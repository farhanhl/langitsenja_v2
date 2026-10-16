'use client';

import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { VENDOR_ROUTES, type Waypoint } from '@/game/npcPaths';
import { consumeInteract } from '@/hooks/useKeyboard';
import { usePlayerStore } from '@/store/playerStore';
import { useUiStore } from '@/store/uiStore';
import { spatialSound } from '@/game/spatialAudio';
import type { Vendor } from '@/game/vendors';

interface VendorNpcProps {
  vendor: Vendor;
}

export default function VendorNpc({ vendor }: VendorNpcProps) {
  const groupRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
  const steamRef = useRef<THREE.Group>(null);

  const route: Waypoint[] = useMemo(() => {
    return VENDOR_ROUTES[vendor.route] || [
      { x: 0, z: 0, pauseDuration: 10 },
      { x: 10, z: 10, pauseDuration: 10 },
    ];
  }, [vendor.route]);

  const targetIdxRef = useRef(0);
  const pauseTimerRef = useRef(0);
  const isPausedRef = useRef(false);
  const isNearRef = useRef(false);
  const currentPosRef = useRef(new THREE.Vector3(route[0].x, 0, route[0].z));
  const walkCycleRef = useRef(0);
  const soundCooldownRef = useRef((vendor.id.charCodeAt(0) % 5) + 3); // initial deterministic stagger

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // ─── 1. Navigasi Waypoint Rute Pedagang ───
    if (isPausedRef.current) {
      pauseTimerRef.current -= delta;
      if (pauseTimerRef.current <= 0) {
        isPausedRef.current = false;
        targetIdxRef.current = (targetIdxRef.current + 1) % route.length;
      }
      // Kaki diam saat berhenti
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
    } else {
      const targetWp = route[targetIdxRef.current];
      const targetVec = new THREE.Vector3(targetWp.x, 0, targetWp.z);
      const toTarget = new THREE.Vector3().subVectors(targetVec, currentPosRef.current);
      const dist = toTarget.length();

      if (dist < 0.3) {
        // Sampai di waypoint, berhenti sejenak
        isPausedRef.current = true;
        pauseTimerRef.current = targetWp.pauseDuration || 10;
      } else {
        // Berjalan menuju waypoint berikutnya
        toTarget.normalize();
        const moveDist = vendor.speed * delta;
        currentPosRef.current.addScaledVector(toTarget, moveDist);

        // Orientasi rotasi menghadap arah jalan
        const rotY = Math.atan2(toTarget.x, toTarget.z);
        groupRef.current.rotation.y = rotY;

        // Animasi kaki melangkah
        walkCycleRef.current += delta * 6;
        const legAngle = Math.sin(walkCycleRef.current) * 0.45;
        if (leftLegRef.current) leftLegRef.current.rotation.x = legAngle;
        if (rightLegRef.current) rightLegRef.current.rotation.x = -legAngle;
      }
    }

    groupRef.current.position.set(currentPosRef.current.x, 0, currentPosRef.current.z);

    // Animasi uap kuah panas naik
    if (steamRef.current) {
      steamRef.current.position.y = 1.6 + Math.sin(Date.now() * 0.005) * 0.15;
    }

    // ─── 2. Deteksi Jarak dengan Pemain (Interaksi & Audio Spasial) ───
    const { posX, posZ } = usePlayerStore.getState();
    const dx = posX - currentPosRef.current.x;
    const dz = posZ - currentPosRef.current.z;
    const distSq = dx * dx + dz * dz;
    const dist = Math.sqrt(distSq);

    // Audio Spasial Sound Cue
    soundCooldownRef.current -= delta;
    if (soundCooldownRef.current <= 0) {
      if (dist < 32) {
        spatialSound.playVendorCue(vendor.soundCue, dist, 32);
      }
      // Interval jeda antara 7 sampai 14 detik
      soundCooldownRef.current = 7 + Math.random() * 7;
    }

    const isNear = distSq <= 3.2 * 3.2;
    const uiStore = useUiStore.getState();

    if (isNear) {
      if (!isNearRef.current) {
        isNearRef.current = true;
        uiStore.setPrompt({
          id: vendor.id,
          label: `Beli ${vendor.name} (Tekan E)`,
          type: 'vendor',
        });
      }

      // Buka toko pedagang jika menekan E
      if (consumeInteract()) {
        uiStore.openVendorShop(vendor.id);
      }
    } else {
      if (isNearRef.current) {
        isNearRef.current = false;
        if (uiStore.activePrompt?.id === vendor.id) {
          uiStore.setPrompt(null);
        }
      }
    }
  });

  return (
    <group ref={groupRef} position={[route[0].x, 0, route[0].z]}>
      {/* ─── Tag Nama Mengapung di Atas Gerobak ─── */}
      <Html position={[0, 2.7, 0]} center distanceFactor={15} zIndexRange={[100, 0]}>
        <div className="pointer-events-none select-none flex flex-col items-center">
          <div className="px-2.5 py-0.5 rounded bg-[#F2B632] text-[#2B1D14] border border-[#B8860B] font-display font-black text-xs shadow-md">
            {vendor.name} 🍲
          </div>
          <div className="text-[10px] text-white font-body bg-black/60 px-1.5 rounded mt-0.5 whitespace-nowrap">
            Jajanan Keliling Sore
          </div>
        </div>
      </Html>

      {/* ─── Model 3D Gerobak / Sepeda Sesuai Jenis Pedagang ─── */}
      {vendor.type === 'bakso' && <BaksoCart steamRef={steamRef} />}
      {vendor.type === 'eskrim' && <IceCreamCart />}
      {vendor.type === 'siomay' && <SiomayCart steamRef={steamRef} />}
      {vendor.type === 'sate' && <SateCart steamRef={steamRef} />}

      {/* ─── Model Pedagang Blocky di Belakang Gerobak ─── */}
      <group position={[0, 0, -1.2]}>
        {/* Kepala */}
        <mesh position={[0, 1.45, 0]} castShadow>
          <boxGeometry args={[0.4, 0.4, 0.4]} />
          <meshLambertMaterial color="#FFD1A4" />
        </mesh>
        {/* Topi / Peci */}
        <mesh position={[0, 1.68, 0]} castShadow>
          <boxGeometry args={[0.42, 0.12, 0.42]} />
          <meshLambertMaterial color="#2B1D14" />
        </mesh>
        {/* Badan (Kaos Santai & Celemek) */}
        <mesh position={[0, 0.95, 0]} castShadow>
          <boxGeometry args={[0.5, 0.6, 0.3]} />
          <meshLambertMaterial color="#ECECEC" />
        </mesh>
        {/* Celemek Pedagang */}
        <mesh position={[0, 0.9, 0.16]}>
          <boxGeometry args={[0.4, 0.45, 0.04]} />
          <meshLambertMaterial color="#34495E" />
        </mesh>
        {/* Lengan Mendorong */}
        <mesh position={[-0.32, 0.9, 0.25]} rotation={[0.4, 0, 0]} castShadow>
          <boxGeometry args={[0.14, 0.5, 0.14]} />
          <meshLambertMaterial color="#FFD1A4" />
        </mesh>
        <mesh position={[0.32, 0.9, 0.25]} rotation={[0.4, 0, 0]} castShadow>
          <boxGeometry args={[0.14, 0.5, 0.14]} />
          <meshLambertMaterial color="#FFD1A4" />
        </mesh>
        {/* Kaki Kiri & Kanan */}
        <mesh ref={leftLegRef} position={[-0.15, 0.35, 0]} castShadow>
          <boxGeometry args={[0.18, 0.65, 0.22]} />
          <meshLambertMaterial color="#2C3E50" />
        </mesh>
        <mesh ref={rightLegRef} position={[0.15, 0.35, 0]} castShadow>
          <boxGeometry args={[0.18, 0.65, 0.22]} />
          <meshLambertMaterial color="#2C3E50" />
        </mesh>
      </group>
    </group>
  );
}

// ─── GEROBAK BAKSO ───────────────────────────────────────────────
function BaksoCart({ steamRef }: { steamRef: React.RefObject<THREE.Group | null> }) {
  return (
    <group position={[0, 0, 0]}>
      {/* Meja / Bodi Gerobak Kayu Merah */}
      <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.7, 1.8]} />
        <meshLambertMaterial color="#A23B2A" />
      </mesh>
      {/* 2 Roda Gerobak */}
      <mesh position={[-0.65, 0.35, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.1, 10]} />
        <meshLambertMaterial color="#333" />
      </mesh>
      <mesh position={[0.65, 0.35, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.1, 10]} />
        <meshLambertMaterial color="#333" />
      </mesh>

      {/* Dandang Kuah Bakso Logam */}
      <mesh position={[-0.25, 1.15, 0.2]} castShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.4, 8]} />
        <meshLambertMaterial color="#BDC3C7" />
      </mesh>

      {/* Uap Hangat Kuah Bakso Blocky */}
      <group ref={steamRef} position={[-0.25, 1.5, 0.2]}>
        <mesh>
          <boxGeometry args={[0.15, 0.15, 0.15]} />
          <meshLambertMaterial color="#FFF" transparent opacity={0.4} />
        </mesh>
      </group>

      {/* Toples Kaca Kerupuk & Sambal */}
      <mesh position={[0.3, 1.15, 0.2]}>
        <cylinderGeometry args={[0.15, 0.15, 0.3, 6]} />
        <meshLambertMaterial color="#F9E79F" />
      </mesh>
      {/* Botol Kecap & Saus */}
      <mesh position={[0.1, 1.1, 0.5]}>
        <boxGeometry args={[0.08, 0.25, 0.08]} />
        <meshLambertMaterial color="#C0392B" />
      </mesh>

      {/* Tiang Penyangga Tenda */}
      <mesh position={[-0.55, 1.5, -0.8]}>
        <boxGeometry args={[0.06, 1.2, 0.06]} />
        <meshLambertMaterial color="#555" />
      </mesh>
      <mesh position={[0.55, 1.5, -0.8]}>
        <boxGeometry args={[0.06, 1.2, 0.06]} />
        <meshLambertMaterial color="#555" />
      </mesh>
      <mesh position={[-0.55, 1.5, 0.8]}>
        <boxGeometry args={[0.06, 1.2, 0.06]} />
        <meshLambertMaterial color="#555" />
      </mesh>
      <mesh position={[0.55, 1.5, 0.8]}>
        <boxGeometry args={[0.06, 1.2, 0.06]} />
        <meshLambertMaterial color="#555" />
      </mesh>

      {/* Tenda Oranye Gerobak */}
      <mesh position={[0, 2.15, 0]} castShadow>
        <boxGeometry args={[1.35, 0.15, 1.95]} />
        <meshLambertMaterial color="#E67E22" />
      </mesh>
    </group>
  );
}

// ─── GEROBAK ES KRIM ─────────────────────────────────────────────
function IceCreamCart() {
  return (
    <group position={[0, 0, 0]}>
      {/* Boks Es Krim Biru Putih */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <boxGeometry args={[1.1, 0.8, 1.6]} />
        <meshLambertMaterial color="#3498DB" />
      </mesh>
      <mesh position={[0, 0.9, 0]} castShadow>
        <boxGeometry args={[1.15, 0.15, 1.65]} />
        <meshLambertMaterial color="#FFFFFF" />
      </mesh>
      {/* Roda Sepeda */}
      <mesh position={[-0.6, 0.35, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.08, 10]} />
        <meshLambertMaterial color="#2C3E50" />
      </mesh>
      <mesh position={[0.6, 0.35, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.08, 10]} />
        <meshLambertMaterial color="#2C3E50" />
      </mesh>
      {/* Payung Pantai Warna-Warni */}
      <mesh position={[0, 1.7, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1.5, 6]} />
        <meshLambertMaterial color="#BDC3C7" />
      </mesh>
      <mesh position={[0, 2.3, 0]} castShadow>
        <coneGeometry args={[1.0, 0.4, 8]} />
        <meshLambertMaterial color="#F39C12" />
      </mesh>
    </group>
  );
}

// ─── SEPEDA SIOMAY ───────────────────────────────────────────────
function SiomayCart({ steamRef }: { steamRef: React.RefObject<THREE.Group | null> }) {
  return (
    <group position={[0, 0, 0]}>
      {/* Bodi Sepeda / Rangka Kayu */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[0.8, 0.6, 1.4]} />
        <meshLambertMaterial color="#8B5A2B" />
      </mesh>
      {/* Kukusan Siomay Aluminium */}
      <mesh position={[0, 1.05, 0.2]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.4, 8]} />
        <meshLambertMaterial color="#BDC3C7" />
      </mesh>
      {/* Uap Siomay Panas */}
      <group ref={steamRef} position={[0, 1.45, 0.2]}>
        <mesh>
          <boxGeometry args={[0.15, 0.15, 0.15]} />
          <meshLambertMaterial color="#FFF" transparent opacity={0.35} />
        </mesh>
      </group>
      {/* Panci Bumbu Kacang */}
      <mesh position={[0, 1.0, -0.3]}>
        <cylinderGeometry args={[0.18, 0.18, 0.25, 6]} />
        <meshLambertMaterial color="#6E2C00" />
      </mesh>
      {/* Roda */}
      <mesh position={[-0.45, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.06, 8]} />
        <meshLambertMaterial color="#333" />
      </mesh>
      <mesh position={[0.45, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.06, 8]} />
        <meshLambertMaterial color="#333" />
      </mesh>
    </group>
  );
}

// ─── GEROBAK SATE ────────────────────────────────────────────────
function SateCart({ steamRef }: { steamRef: React.RefObject<THREE.Group | null> }) {
  return (
    <group position={[0, 0, 0]}>
      {/* Meja Gerobak Sate */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[1.0, 0.6, 1.6]} />
        <meshLambertMaterial color="#5C3A21" />
      </mesh>
      {/* Panggangan Arang Panjang */}
      <mesh position={[0, 0.98, 0.2]} castShadow>
        <boxGeometry args={[0.8, 0.15, 0.3]} />
        <meshLambertMaterial color="#212F3D" />
      </mesh>
      {/* Arang Merah Membara */}
      <mesh position={[0, 1.05, 0.2]}>
        <boxGeometry args={[0.7, 0.05, 0.22]} />
        <meshLambertMaterial color="#E74C3C" emissive="#FF5733" emissiveIntensity={0.6} />
      </mesh>
      {/* Asap Sate Blocky */}
      <group ref={steamRef} position={[0, 1.45, 0.2]}>
        <mesh>
          <boxGeometry args={[0.25, 0.2, 0.25]} />
          <meshLambertMaterial color="#BDC3C7" transparent opacity={0.4} />
        </mesh>
      </group>
      {/* Wadah Bumbu Kacang & Kecap */}
      <mesh position={[0, 0.98, -0.3]}>
        <boxGeometry args={[0.5, 0.15, 0.35]} />
        <meshLambertMaterial color="#784212" />
      </mesh>
      {/* Roda Gerobak */}
      <mesh position={[-0.55, 0.32, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.32, 0.32, 0.08, 8]} />
        <meshLambertMaterial color="#333" />
      </mesh>
      <mesh position={[0.55, 0.32, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.32, 0.32, 0.08, 8]} />
        <meshLambertMaterial color="#333" />
      </mesh>
    </group>
  );
}
