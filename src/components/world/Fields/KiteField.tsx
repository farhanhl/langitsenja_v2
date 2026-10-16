import { useRef, useMemo, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { usePlayerStore } from '@/store/playerStore';
import { useUiStore } from '@/store/uiStore';
import { consumeInteract, getInputState } from '@/hooks/useKeyboard';

// Lapangan Kosong + Anak-anak + Layangan Senja
// Posisi default: [-75, 0, -75] (Kuadran barat laut terbuka)

interface KiteData {
  id: string;
  color: string;
  tailColor: string;
  childPos: [number, number, number];
  baseKitePos: [number, number, number];
  phase: number;
  freq: number;
}

const KITES: KiteData[] = [
  { id: 'kite-1', color: '#E74C3C', tailColor: '#F1C40F', childPos: [-8, 0, -4], baseKitePos: [-5, 18, -2], phase: 0, freq: 1.2 },
  { id: 'kite-2', color: '#3498DB', tailColor: '#E67E22', childPos: [6, 0, 8], baseKitePos: [10, 22, 12], phase: 1.5, freq: 0.9 },
  { id: 'kite-3', color: '#F1C40F', tailColor: '#2ECC71', childPos: [-12, 0, 10], baseKitePos: [-14, 20, 15], phase: 3.0, freq: 1.1 },
  { id: 'kite-4', color: '#9B59B6', tailColor: '#E74C3C', childPos: [12, 0, -10], baseKitePos: [15, 24, -12], phase: 4.5, freq: 0.8 },
];

export default function KiteField() {
  return (
    <group position={[-75, 0, -75]}>
      {/* ─── 1. Tanah Lapang Berumput Liar (50x50 m) ─── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshLambertMaterial color="#7D9C5B" />
      </mesh>

      {/* Detail rumput liar acak */}
      <WildGrassPatches />

      {/* ─── 2. Props Lapangan: Pohon, Ban Bekas, Tumpukan Batu ─── */}
      <FieldObstacles />

      {/* ─── 3. Anak-Anak & Layangan Melayang ─── */}
      {KITES.map((k) => (
        <FlyingKiteWithChild key={k.id} data={k} />
      ))}

      {/* ─── 4. Layangan yang Tersangkut di Pohon (Detail Khas) ─── */}
      <StuckKite position={[-16, 5.2, -14]} />

      {/* ─── 5. Interaksi Layangan Pemain (Mini-game) ─── */}
      <InteractivePlayerKite stationPos={[2, 0, 15]} />
    </group>
  );
}

// Benang layangan 3D berorientasi otomatis
function KiteString({ from, to }: { from: THREE.Vector3; to: THREE.Vector3 }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!meshRef.current) return;
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
    const midZ = (from.z + to.z) / 2;
    meshRef.current.position.set(midX, midY, midZ);
    meshRef.current.lookAt(to);
    const dist = from.distanceTo(to);
    meshRef.current.scale.set(1, 1, dist);
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[0.02, 0.02, 1]} />
      <meshBasicMaterial color="#F5E9D3" transparent opacity={0.65} />
    </mesh>
  );
}

// Komponen sepasang: Anak kecil di bawah + Layangan di atas + Benang penghubung
function FlyingKiteWithChild({ data }: { data: KiteData }) {
  const kiteRef = useRef<THREE.Group>(null);

  const [cx, cy, cz] = data.childPos;
  // Tangan anak kira-kira di ketinggian y = 1.0
  const handPos = useMemo(() => new THREE.Vector3(cx, cy + 0.9, cz), [cx, cy, cz]);
  const currentKitePos = useMemo(() => new THREE.Vector3(...data.baseKitePos), [data.baseKitePos]);

  // Animasi layangan bergoyang tertiup angin senja
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * data.freq + data.phase;
    const swayX = Math.sin(t) * 1.8 + Math.cos(t * 0.5) * 0.6;
    const swayY = Math.cos(t * 1.2) * 0.8;
    const swayZ = Math.sin(t * 0.7) * 1.2;

    currentKitePos.set(
      data.baseKitePos[0] + swayX,
      data.baseKitePos[1] + swayY,
      data.baseKitePos[2] + swayZ
    );

    if (kiteRef.current) {
      kiteRef.current.position.copy(currentKitePos);
      // Miring mengikuti goyangan angin
      kiteRef.current.rotation.z = Math.sin(t * 1.5) * 0.25;
      kiteRef.current.rotation.x = Math.cos(t) * 0.2 + 0.3;
    }
  });

  return (
    <group>
      {/* Anak Kecil Memegang Benang */}
      <ChildNpc position={data.childPos} />

      {/* Benang Layangan */}
      <KiteString from={handPos} to={currentKitePos} />

      {/* Model Layangan */}
      <group ref={kiteRef} position={data.baseKitePos}>
        {/* Badan Layangan (Belah Ketupat Blocky Tipis) */}
        <mesh rotation={[0, 0, Math.PI / 4]} castShadow>
          <boxGeometry args={[1.3, 1.3, 0.04]} />
          <meshLambertMaterial color={data.color} />
        </mesh>
        {/* Rangka Bambu Silang */}
        <mesh position={[0, 0, 0.03]}>
          <boxGeometry args={[1.8, 0.05, 0.03]} />
          <meshLambertMaterial color="#D7BDE2" />
        </mesh>
        <mesh position={[0, 0, 0.03]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[1.8, 0.05, 0.03]} />
          <meshLambertMaterial color="#D7BDE2" />
        </mesh>
        {/* Ekor Pita Layangan */}
        <mesh position={[0, -1.2, 0]} rotation={[0, 0, 0.1]}>
          <boxGeometry args={[0.2, 1.4, 0.02]} />
          <meshLambertMaterial color={data.tailColor} />
        </mesh>
        <mesh position={[0.1, -2.2, 0]} rotation={[0, 0, -0.15]}>
          <boxGeometry args={[0.18, 1.2, 0.02]} />
          <meshLambertMaterial color={data.color} />
        </mesh>
      </group>
    </group>
  );
}

// Model Anak Kecil Blocky
function ChildNpc({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Kepala */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[0.32, 0.32, 0.32]} />
        <meshLambertMaterial color="#FFD1A4" />
      </mesh>
      {/* Rambut */}
      <mesh position={[0, 1.25, 0]} castShadow>
        <boxGeometry args={[0.34, 0.12, 0.34]} />
        <meshLambertMaterial color="#2B1D14" />
      </mesh>
      {/* Kaos Anak */}
      <mesh position={[0, 0.72, 0]} castShadow>
        <boxGeometry args={[0.38, 0.45, 0.24]} />
        <meshLambertMaterial color="#E67E22" />
      </mesh>
      {/* Lengan Mengangkat Benang */}
      <mesh position={[0.25, 0.82, 0.15]} rotation={[0.6, 0, 0]} castShadow>
        <boxGeometry args={[0.1, 0.35, 0.1]} />
        <meshLambertMaterial color="#FFD1A4" />
      </mesh>
      {/* Celana Pendek */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.32, 0.4, 0.22]} />
        <meshLambertMaterial color="#34495E" />
      </mesh>
      {/* Sandal Jepit */}
      <mesh position={[-0.1, 0.04, 0.02]} castShadow>
        <boxGeometry args={[0.12, 0.08, 0.22]} />
        <meshLambertMaterial color="#E74C3C" />
      </mesh>
      <mesh position={[0.1, 0.04, 0.02]} castShadow>
        <boxGeometry args={[0.12, 0.08, 0.22]} />
        <meshLambertMaterial color="#E74C3C" />
      </mesh>
    </group>
  );
}

// Layangan yang tersangkut di ranting pohon
function StuckKite({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Pohon tempat tersangkut */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.5, 5, 5]} />
        <meshLambertMaterial color="#7B5E3A" />
      </mesh>
      <mesh position={[0, 5.5, 0]} castShadow>
        <boxGeometry args={[3.2, 3.0, 3.2]} />
        <meshLambertMaterial color="#4F7A3A" />
      </mesh>
      {/* Layangan Miring Tersangkut */}
      <group position={[1.4, 6.0, 0.8]} rotation={[0.4, 0.6, 0.8]}>
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[1.2, 1.2, 0.04]} />
          <meshLambertMaterial color="#F39C12" />
        </mesh>
        <mesh position={[0, -1.0, 0]}>
          <boxGeometry args={[0.18, 1.2, 0.02]} />
          <meshLambertMaterial color="#E74C3C" />
        </mesh>
      </group>
    </group>
  );
}

// Rintangan lapangan: ban bekas, batu, rumput liar
function FieldObstacles() {
  return (
    <group>
      {/* Tumpukan Ban Bekas */}
      <group position={[-6, 0, 16]}>
        <mesh position={[0, 0.25, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.6, 0.6, 0.35, 8]} />
          <meshLambertMaterial color="#1C2833" />
        </mesh>
        <mesh position={[0.4, 0.55, 0.2]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.6, 0.6, 0.35, 8]} />
          <meshLambertMaterial color="#1C2833" />
        </mesh>
      </group>

      {/* Gundukan Batu Kali */}
      <group position={[15, 0, 12]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <dodecahedronGeometry args={[0.8]} />
          <meshLambertMaterial color="#7F8C8D" />
        </mesh>
        <mesh position={[0.7, 0.3, -0.4]} castShadow>
          <dodecahedronGeometry args={[0.5]} />
          <meshLambertMaterial color="#95A5A6" />
        </mesh>
      </group>
    </group>
  );
}

function WildGrassPatches() {
  const patches = [
    [-14, 0, -8],
    [10, 0, -15],
    [-5, 0, 12],
    [18, 0, 4],
    [-20, 0, 15],
  ] as const;

  return (
    <group>
      {patches.map((pos, idx) => (
        <mesh key={idx} position={[pos[0], 0.04, pos[2]]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[2.5, 6]} />
          <meshLambertMaterial color="#6B8E4E" />
        </mesh>
      ))}
    </group>
  );
}

// ─── INTERAKSI LAYANGAN PEMAIN (MINI-GAME) ───────────────────────
function InteractivePlayerKite({ stationPos }: { stationPos: [number, number, number] }) {
  const [isFlying, setIsFlying] = useState(false);
  const kiteGroupRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Mesh>(null);

  const handPosRef = useRef(new THREE.Vector3());
  const kitePosRef = useRef(new THREE.Vector3());

  useFrame(({ clock }) => {
    const { posX, posZ } = usePlayerStore.getState();
    // Posisi lokal pemain terhadap KiteField [-75, 0, -75]
    const localPX = posX - (-75);
    const localPZ = posZ - (-75);

    const uiStore = useUiStore.getState();
    const distToStation = Math.hypot(stationPos[0] - localPX, stationPos[2] - localPZ);

    if (!isFlying) {
      if (distToStation < 2.5) {
        if (uiStore.activePrompt?.id !== 'kite-station') {
          uiStore.setPrompt({
            id: 'kite-station',
            label: 'Terbangkan Layangan Senja (Tekan E)',
            type: 'action',
          });
        }
        if (consumeInteract()) {
          setIsFlying(true);
        }
      } else {
        if (uiStore.activePrompt?.id === 'kite-station') {
          uiStore.setPrompt(null);
        }
      }
    } else {
      // Sedang menerbangkan layangan
      if (uiStore.activePrompt?.id !== 'kite-flying') {
        uiStore.setPrompt({
          id: 'kite-flying',
          label: 'Gulung Layangan (Tekan E) | Tarik Benang (Spasi)',
          type: 'action',
        });
      }
      if (consumeInteract()) {
        setIsFlying(false);
        uiStore.setPrompt(null);
      }

      // Animasi layangan melayang di atas pemain
      const t = clock.getElapsedTime();
      const isPulling = getInputState().jump; // tombol lompat/spasi untuk menarik benang

      const swingRange = isPulling ? 5.5 : 2.5;
      const targetHeight = isPulling ? 27.0 + Math.sin(t * 3.5) * 3 : 21.0 + Math.sin(t * 1.2) * 1.5;

      kitePosRef.current.set(
        localPX + Math.sin(t * 1.5) * swingRange,
        targetHeight,
        localPZ - 10 + Math.cos(t * 1.1) * 2.0
      );

      handPosRef.current.set(localPX + 0.35, 1.25, localPZ - 0.2);

      if (kiteGroupRef.current) {
        kiteGroupRef.current.position.copy(kitePosRef.current);
        // Roll & pitch dinamis mengikuti tiupan angin
        kiteGroupRef.current.rotation.z = Math.sin(t * 2.0) * (isPulling ? 0.6 : 0.25);
        kiteGroupRef.current.rotation.x = 0.4 + Math.cos(t * 1.5) * 0.15;
      }

      if (tailRef.current) {
        tailRef.current.rotation.z = Math.sin(t * 4.0) * 0.5;
      }
    }
  });

  return (
    <group>
      {/* Stan Layangan (Bangku & Gulungan Benang) di Lapangan */}
      <group position={stationPos}>
        {/* Bangku Kayu Kecil */}
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[1.6, 0.15, 0.7]} />
          <meshLambertMaterial color="#8B5A2B" />
        </mesh>
        <mesh position={[-0.6, 0.2, 0]} castShadow>
          <boxGeometry args={[0.15, 0.4, 0.6]} />
          <meshLambertMaterial color="#5C3A21" />
        </mesh>
        <mesh position={[0.6, 0.2, 0]} castShadow>
          <boxGeometry args={[0.15, 0.4, 0.6]} />
          <meshLambertMaterial color="#5C3A21" />
        </mesh>

        {/* Gulungan Benang Kenur / Kaleng Gelasan */}
        <mesh position={[-0.3, 0.55, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.25, 12]} />
          <meshLambertMaterial color="#E74C3C" />
        </mesh>

        {/* Layangan Pemain Standby (hanya muncul saat belum diterbangkan) */}
        {!isFlying && (
          <group position={[0.2, 0.7, 0]} rotation={[0.3, 0.4, -0.2]}>
            <mesh castShadow>
              <boxGeometry args={[0.9, 0.9, 0.04]} />
              <meshLambertMaterial color="#F39C12" />
            </mesh>
            <mesh position={[0, 0, 0.03]}>
              <boxGeometry args={[0.7, 0.7, 0.02]} />
              <meshLambertMaterial color="#E74C3C" />
            </mesh>
          </group>
        )}

        {/* Plang Teks Penanda Interaksi */}
        <Html position={[0, 1.6, 0]} center distanceFactor={18}>
          <div className="bg-[#2B1D14]/90 border border-[#F2B632] px-2 py-0.5 rounded shadow text-center select-none pointer-events-none whitespace-nowrap">
            <span className="text-[10px] text-[#F2B632] font-display font-bold">
              🪁 Layangan Senja Warga
            </span>
          </div>
        </Html>
      </group>

      {/* Saat Diterbangkan: Benang 3D dan Layangan Melayang di Angkasa */}
      {isFlying && (
        <>
          <KiteString from={handPosRef.current} to={kitePosRef.current} />

          <group ref={kiteGroupRef}>
            {/* Rangka & Kertas Layangan Motif Senja */}
            <mesh castShadow rotation={[0, 0, Math.PI / 4]}>
              <boxGeometry args={[1.5, 1.5, 0.04]} />
              <meshLambertMaterial color="#F39C12" />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 4]} position={[0, 0, 0.03]}>
              <boxGeometry args={[1.1, 1.1, 0.03]} />
              <meshLambertMaterial color="#E74C3C" />
            </mesh>
            {/* Bambu Penyangga Silang */}
            <mesh position={[0, 0, 0.05]}>
              <boxGeometry args={[0.04, 2.1, 0.04]} />
              <meshLambertMaterial color="#E8C5A5" />
            </mesh>
            <mesh position={[0, 0, 0.05]}>
              <boxGeometry args={[2.1, 0.04, 0.04]} />
              <meshLambertMaterial color="#E8C5A5" />
            </mesh>
            {/* Ekor Pita Layangan */}
            <group ref={tailRef} position={[0, -1.2, 0]}>
              <mesh position={[0, -0.6, 0]}>
                <boxGeometry args={[0.15, 1.2, 0.02]} />
                <meshLambertMaterial color="#2ECC71" />
              </mesh>
            </group>
          </group>
        </>
      )}
    </group>
  );
}
