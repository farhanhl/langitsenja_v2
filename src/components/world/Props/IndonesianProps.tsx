'use client';

import { RigidBody } from '@react-three/rapier';

export default function IndonesianProps() {
  return (
    <group>
      {/* ─── 1. Gapura 17 Agustus / Gapura Utama Kota ─── */}
      <Gapura position={[0, 0, -35]} />

      {/* ─── 2. Pos Ronda (Pos Kamling Warga) ─── */}
      <PosRonda position={[-16, 0, 8]} />

      {/* ─── 3. Tiang-tiang Listrik Beton & Kabel Sepanjang Jalan ─── */}
      <PowerGrid />

      {/* ─── 4. Bendera Merah Putih di Tiang Bambu ─── */}
      <FlagPole position={[-18, 0, 12]} />
      <FlagPole position={[8, 0, -14]} />
      <FlagPole position={[28, 0, 24]} />

      {/* ─── 5. Tanaman Khas: Pohon Pisang & Kelapa ─── */}
      <BananaTree position={[-18, 0, 20]} />
      <BananaTree position={[-19, 0, 34]} />
      <BananaTree position={[26, 0, 36]} />
      <CoconutTree position={[52, 0, 48]} />
      <CoconutTree position={[68, 0, 72]} />

      {/* ─── 6. Jemuran Baju Warga ─── */}
      <Clothesline position={[-28, 0, 18]} rotY={0} />
      <Clothesline position={[32, 0, 20]} rotY={Math.PI / 2} />

      {/* ─── 7. Tong Sampah Drum Biru ─── */}
      <TrashBin position={[-5, 0, -10]} />
      <TrashBin position={[9.5, 0, -14]} />
      <TrashBin position={[17, 0, 6]} />

      {/* ─── 8. Polisi Tidur (Speed Bump) di Jalan Komplek ─── */}
      <SpeedBump position={[0, 0.05, 25]} />
      <SpeedBump position={[0, 0.05, -20]} />
    </group>
  );
}

// ─── GAPURA 17 AGUSTUS MERAH PUTIH ───────────────────────────────
function Gapura({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Pilar Kiri (Merah) dengan physics collider */}
      <RigidBody type="fixed" colliders="cuboid" position={[-5.5, 3.0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.2, 6.0, 1.2]} />
          <meshLambertMaterial color="#C0392B" />
        </mesh>
      </RigidBody>

      {/* Pilar Kanan (Merah) dengan physics collider */}
      <RigidBody type="fixed" colliders="cuboid" position={[5.5, 3.0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.2, 6.0, 1.2]} />
          <meshLambertMaterial color="#C0392B" />
        </mesh>
      </RigidBody>

      {/* Balok Atas / Jembatan Gapura (Putih-Merah) */}
      <mesh position={[0, 5.6, 0]} castShadow>
        <boxGeometry args={[12.2, 0.8, 1.4]} />
        <meshLambertMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[0, 6.2, 0]} castShadow>
        <boxGeometry args={[10.5, 0.5, 1.2]} />
        <meshLambertMaterial color="#C0392B" />
      </mesh>

      {/* Ornamen Lambang / Spanduk Gapura */}
      <mesh position={[0, 5.6, 0.72]}>
        <boxGeometry args={[6.5, 0.6, 0.05]} />
        <meshLambertMaterial color="#F1C40F" />
      </mesh>
      {/* Bendera mini di ujung tiang gapura */}
      <mesh position={[-5.5, 6.8, 0]}>
        <boxGeometry args={[0.08, 1.2, 0.08]} />
        <meshLambertMaterial color="#E8D5B0" />
      </mesh>
      <mesh position={[-5.1, 7.1, 0]}>
        <boxGeometry args={[0.7, 0.4, 0.02]} />
        <meshLambertMaterial color="#E74C3C" />
      </mesh>
      <mesh position={[5.5, 6.8, 0]}>
        <boxGeometry args={[0.08, 1.2, 0.08]} />
        <meshLambertMaterial color="#E8D5B0" />
      </mesh>
      <mesh position={[5.9, 7.1, 0]}>
        <boxGeometry args={[0.7, 0.4, 0.02]} />
        <meshLambertMaterial color="#E74C3C" />
      </mesh>
    </group>
  );
}

// ─── POS RONDA (POS KAMLING) ─────────────────────────────────────
function PosRonda({ position }: { position: [number, number, number] }) {
  return (
    <RigidBody type="fixed" colliders="cuboid" position={position}>
      <group>
        {/* Lantai Panggung Kayu */}
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 0.3, 3.2]} />
          <meshLambertMaterial color="#8B5A2B" />
        </mesh>
        {/* Kaki-kaki Panggung */}
        <mesh position={[-1.4, 0.2, -1.4]}>
          <boxGeometry args={[0.2, 0.4, 0.2]} />
          <meshLambertMaterial color="#4A2E1A" />
        </mesh>
        <mesh position={[1.4, 0.2, -1.4]}>
          <boxGeometry args={[0.2, 0.4, 0.2]} />
          <meshLambertMaterial color="#4A2E1A" />
        </mesh>
        <mesh position={[-1.4, 0.2, 1.4]}>
          <boxGeometry args={[0.2, 0.4, 0.2]} />
          <meshLambertMaterial color="#4A2E1A" />
        </mesh>
        <mesh position={[1.4, 0.2, 1.4]}>
          <boxGeometry args={[0.2, 0.4, 0.2]} />
          <meshLambertMaterial color="#4A2E1A" />
        </mesh>

        {/* 4 Tiang Penyangga Atap */}
        <mesh position={[-1.4, 1.7, -1.4]} castShadow>
          <boxGeometry args={[0.18, 2.2, 0.18]} />
          <meshLambertMaterial color="#5A3A1B" />
        </mesh>
        <mesh position={[1.4, 1.7, -1.4]} castShadow>
          <boxGeometry args={[0.18, 2.2, 0.18]} />
          <meshLambertMaterial color="#5A3A1B" />
        </mesh>
        <mesh position={[-1.4, 1.7, 1.4]} castShadow>
          <boxGeometry args={[0.18, 2.2, 0.18]} />
          <meshLambertMaterial color="#5A3A1B" />
        </mesh>
        <mesh position={[1.4, 1.7, 1.4]} castShadow>
          <boxGeometry args={[0.18, 2.2, 0.18]} />
          <meshLambertMaterial color="#5A3A1B" />
        </mesh>

        {/* Sandaran Dinding Setengah Terbuka */}
        <mesh position={[0, 1.0, -1.45]}>
          <boxGeometry args={[3.0, 0.7, 0.1]} />
          <meshLambertMaterial color="#7B5E3A" />
        </mesh>
        <mesh position={[-1.45, 1.0, 0]}>
          <boxGeometry args={[0.1, 0.7, 3.0]} />
          <meshLambertMaterial color="#7B5E3A" />
        </mesh>

        {/* Atap Genteng Limas / Seng */}
        <mesh position={[0, 3.0, 0]} castShadow>
          <boxGeometry args={[3.8, 0.3, 3.8]} />
          <meshLambertMaterial color="#A23B2A" />
        </mesh>
        <mesh position={[0, 3.3, 0]} castShadow>
          <boxGeometry args={[2.5, 0.3, 2.5]} />
          <meshLambertMaterial color="#8B3A2A" />
        </mesh>

        {/* Kentongan Bambu Gantung */}
        <mesh position={[1.2, 2.2, 1.2]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.7, 6]} />
          <meshLambertMaterial color="#D7BDE2" />
        </mesh>
      </group>
    </RigidBody>
  );
}

// ─── TIANG LISTRIK BETON & KABEL ─────────────────────────────────
function PowerGrid() {
  const poles = [
    [-5, 0, -45],
    [-5, 0, -15],
    [-5, 0, 15],
    [-5, 0, 45],
    [5, 0, -45],
    [5, 0, -15],
    [5, 0, 15],
    [5, 0, 45],
  ] as const;

  return (
    <group>
      {poles.map((pos, idx) => (
        <PowerPole key={idx} position={pos} />
      ))}
    </group>
  );
}

function PowerPole({ position }: { position: readonly [number, number, number] }) {
  return (
    <RigidBody type="fixed" colliders="cuboid" position={position as [number, number, number]}>
      <group>
        {/* Tiang Beton Silindris / Prisma */}
        <mesh position={[0, 3.75, 0]} castShadow>
          <boxGeometry args={[0.35, 7.5, 0.35]} />
          <meshLambertMaterial color="#95A5A6" />
        </mesh>
        {/* Palang Salang Isolator (Crossarm) */}
        <mesh position={[0, 7.0, 0]} castShadow>
          <boxGeometry args={[1.8, 0.15, 0.15]} />
          <meshLambertMaterial color="#7F8C8D" />
        </mesh>
        {/* 3 Isolator Keramik Putih */}
        <mesh position={[-0.8, 7.2, 0]}>
          <cylinderGeometry args={[0.06, 0.08, 0.25, 6]} />
          <meshLambertMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[0, 7.2, 0]}>
          <cylinderGeometry args={[0.06, 0.08, 0.25, 6]} />
          <meshLambertMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[0.8, 7.2, 0]}>
          <cylinderGeometry args={[0.06, 0.08, 0.25, 6]} />
          <meshLambertMaterial color="#FFFFFF" />
        </mesh>
      </group>
    </RigidBody>
  );
}

// ─── TIANG BENDERA MERAH PUTIH ───────────────────────────────────
function FlagPole({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Tiang Bambu Tipis */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.06, 5.0, 5]} />
        <meshLambertMaterial color="#F5DEB3" />
      </mesh>
      {/* Bendera Merah (Atas) */}
      <mesh position={[0.5, 4.7, 0]} castShadow>
        <boxGeometry args={[1.0, 0.35, 0.02]} />
        <meshLambertMaterial color="#E74C3C" />
      </mesh>
      {/* Bendera Putih (Bawah) */}
      <mesh position={[0.5, 4.35, 0]} castShadow>
        <boxGeometry args={[1.0, 0.35, 0.02]} />
        <meshLambertMaterial color="#FFFFFF" />
      </mesh>
    </group>
  );
}

// ─── POHON PISANG TROPIS ─────────────────────────────────────────
function BananaTree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Batang Pisang */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.3, 2.8, 6]} />
        <meshLambertMaterial color="#88A856" />
      </mesh>
      {/* Daun-daun Pisang Lebar Melengkung */}
      <mesh position={[0.7, 2.7, 0]} rotation={[0, 0, -0.4]} castShadow>
        <boxGeometry args={[1.6, 0.06, 0.65]} />
        <meshLambertMaterial color="#5A9E32" />
      </mesh>
      <mesh position={[-0.7, 2.6, 0]} rotation={[0, 0, 0.4]} castShadow>
        <boxGeometry args={[1.6, 0.06, 0.65]} />
        <meshLambertMaterial color="#5A9E32" />
      </mesh>
      <mesh position={[0, 2.8, 0.7]} rotation={[0.4, 0, 0]} castShadow>
        <boxGeometry args={[0.65, 0.06, 1.6]} />
        <meshLambertMaterial color="#4C8B28" />
      </mesh>
      <mesh position={[0, 2.7, -0.7]} rotation={[-0.4, 0, 0]} castShadow>
        <boxGeometry args={[0.65, 0.06, 1.6]} />
        <meshLambertMaterial color="#4C8B28" />
      </mesh>
    </group>
  );
}

// ─── POHON KELAPA ────────────────────────────────────────────────
function CoconutTree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Batang Kelapa Melengkung */}
      <mesh position={[0.3, 3.2, 0]} rotation={[0, 0, -0.1]} castShadow>
        <cylinderGeometry args={[0.3, 0.45, 6.5, 6]} />
        <meshLambertMaterial color="#7B5E3A" />
      </mesh>
      {/* Mahkota Daun Kelapa */}
      <mesh position={[0.7, 6.5, 0]} castShadow>
        <boxGeometry args={[2.8, 0.2, 2.8]} />
        <meshLambertMaterial color="#3D7B2A" />
      </mesh>
      <mesh position={[0.7, 6.7, 0]} castShadow>
        <boxGeometry args={[2.0, 0.2, 2.0]} />
        <meshLambertMaterial color="#2E631E" />
      </mesh>
    </group>
  );
}

// ─── JEMURAN BAJU WARGA ──────────────────────────────────────────
function Clothesline({ position, rotY }: { position: [number, number, number]; rotY: number }) {
  return (
    <group position={position} rotation={[0, rotY, 0]}>
      {/* Tiang Jemuran Kiri & Kanan */}
      <mesh position={[-1.5, 0.8, 0]}>
        <boxGeometry args={[0.08, 1.6, 0.08]} />
        <meshLambertMaterial color="#BDC3C7" />
      </mesh>
      <mesh position={[1.5, 0.8, 0]}>
        <boxGeometry args={[0.08, 1.6, 0.08]} />
        <meshLambertMaterial color="#BDC3C7" />
      </mesh>
      {/* Kawat Jemuran */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[3.0, 0.02, 0.02]} />
        <meshLambertMaterial color="#7F8C8D" />
      </mesh>
      {/* Pakaian Tergantung Warna-Warni */}
      <mesh position={[-0.8, 1.25, 0]} castShadow>
        <boxGeometry args={[0.45, 0.55, 0.04]} />
        <meshLambertMaterial color="#E74C3C" />
      </mesh>
      <mesh position={[-0.2, 1.2, 0]} castShadow>
        <boxGeometry args={[0.4, 0.65, 0.04]} />
        <meshLambertMaterial color="#3498DB" />
      </mesh>
      <mesh position={[0.5, 1.28, 0]} castShadow>
        <boxGeometry args={[0.5, 0.5, 0.04]} />
        <meshLambertMaterial color="#F1C40F" />
      </mesh>
      <mesh position={[1.1, 1.22, 0]} castShadow>
        <boxGeometry args={[0.4, 0.6, 0.04]} />
        <meshLambertMaterial color="#FFFFFF" />
      </mesh>
    </group>
  );
}

// ─── TONG SAMPAH DRUM BIRU ───────────────────────────────────────
function TrashBin({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.9, 8]} />
        <meshLambertMaterial color="#2980B9" />
      </mesh>
    </group>
  );
}

// ─── POLISI TIDUR (SPEED BUMP) ───────────────────────────────────
function SpeedBump({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Garis Karet Aspal Polisi Tidur (kuning-hitam) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[8.0, 0.7]} />
        <meshLambertMaterial color="#F1C40F" />
      </mesh>
    </group>
  );
}
