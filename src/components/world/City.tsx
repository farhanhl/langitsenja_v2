'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import Roads from './Roads';
import Buildings from './Buildings';
import SportsComplex from './Fields/SportsComplex';
import KiteField from './Fields/KiteField';
import IndonesianProps from './Props/IndonesianProps';
import VendorList from './Characters/VendorList';

// Komponen utama dunia — menggabungkan jalan, bangunan, ground
// Koordinat sesuai WORLD_DESIGN.md: 300x300 unit, flat

export default function City() {
  // Material dasar — shared untuk performa
  const groundMaterial = useMemo(
    () =>
      new THREE.MeshLambertMaterial({
        color: '#C8A96E',
        // flatShading tidak perlu di Lambert, tapi kita keep low-poly
      }),
    []
  );

  return (
    <group>
      {/* Tanah dengan physics collider */}
      <RigidBody type="fixed" colliders={false} position={[0, 0, 0]}>
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
          material={groundMaterial}
        >
          <planeGeometry args={[300, 300]} />
        </mesh>
        {/* Lantai fisik setebal 1 unit di bawah permukaan y=0 */}
        <CuboidCollider args={[150, 0.5, 150]} position={[0, -0.5, 0]} />

        {/* Dinding batas dunia tak terlihat (300x300) */}
        <CuboidCollider args={[150, 10, 1]} position={[0, 10, -150]} />
        <CuboidCollider args={[150, 10, 1]} position={[0, 10, 150]} />
        <CuboidCollider args={[1, 10, 150]} position={[150, 10, 0]} />
        <CuboidCollider args={[1, 10, 150]} position={[-150, 10, 0]} />
      </RigidBody>

      {/* Jalan & sidewalk */}
      <Roads />

      {/* Bangunan */}
      <Buildings />

      {/* Kompleks Olahraga (Sepak Bola & Basket) */}
      <SportsComplex />

      {/* Lapangan Kosong + Layangan Senja */}
      <KiteField />

      {/* Props Khas Indonesia (Gapura, Pos Ronda, Tiang Listrik, dll) */}
      <IndonesianProps />

      {/* Pedagang Keliling (Bakso, Es Krim, Siomay, Sate) */}
      <VendorList />

      {/* Taman */}
      <Park />

      {/* Danau */}
      <Lake />
    </group>
  );
}

// Taman sederhana — akan diperluas di Fase 1
function Park() {
  return (
    <group position={[20, 0, 20]}>
      {/* Rumput taman */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0.05, 0]}>
        <circleGeometry args={[15, 8]} />
        <meshLambertMaterial color="#5A8C40" />
      </mesh>
      {/* Air mancur blocky */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[2, 2.5, 1, 8]} />
        <meshLambertMaterial color="#7FB3D3" />
      </mesh>
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 2, 6]} />
        <meshLambertMaterial color="#B0C4DE" />
      </mesh>
      {/* Bangku-bangku */}
      {PARK_BENCH_POS.map((p, i) => (
        <Bench key={i} position={p} />
      ))}
      {/* Pohon-pohon */}
      {PARK_TREE_POS.map((p, i) => (
        <Tree key={i} position={p} />
      ))}
    </group>
  );
}

// Danau sederhana — akan diperluas di Fase 1
function Lake() {
  return (
    <group position={[60, 0, 60]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <planeGeometry args={[36, 24]} />
        <meshLambertMaterial color="#2980B9" transparent opacity={0.85} />
      </mesh>
      {/* Pohon tepi danau */}
      {LAKE_TREE_POS.map((p, i) => (
        <Tree key={i} position={p} />
      ))}
    </group>
  );
}

// Pohon blocky low-poly
function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 3, 5]} />
        <meshLambertMaterial color="#7B5E3A" />
      </mesh>
      <mesh position={[0, 4, 0]} castShadow>
        <boxGeometry args={[2.5, 2.5, 2.5]} />
        <meshLambertMaterial color="#4F7A3A" />
      </mesh>
      <mesh position={[0, 5.8, 0]} castShadow>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshLambertMaterial color="#3D6B2A" />
      </mesh>
    </group>
  );
}

// Bangku taman blocky
function Bench({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Papan duduk */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[1.4, 0.1, 0.5]} />
        <meshLambertMaterial color="#8B6914" />
      </mesh>
      {/* Kaki bangku */}
      <mesh position={[-0.55, 0.25, 0]}>
        <boxGeometry args={[0.1, 0.5, 0.5]} />
        <meshLambertMaterial color="#6B4F10" />
      </mesh>
      <mesh position={[0.55, 0.25, 0]}>
        <boxGeometry args={[0.1, 0.5, 0.5]} />
        <meshLambertMaterial color="#6B4F10" />
      </mesh>
    </group>
  );
}

// ─── Data posisi ─────────────────────────────────────────────────

const PARK_BENCH_POS: [number, number, number][] = [
  [4, 0, 8],
  [-4, 0, 8],
  [8, 0, -4],
  [-8, 0, -4],
];

const PARK_TREE_POS: [number, number, number][] = [
  [10, 0, 10],
  [-10, 0, 10],
  [10, 0, -10],
  [-10, 0, -10],
  [12, 0, 0],
  [-12, 0, 0],
];

const LAKE_TREE_POS: [number, number, number][] = [
  [20, 0, 0],
  [15, 0, 10],
  [-18, 0, 5],
  [-14, 0, -8],
  [10, 0, -14],
];
