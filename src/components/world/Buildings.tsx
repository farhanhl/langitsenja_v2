'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { RigidBody } from '@react-three/rapier';

// BuildingSpec dan validateBuilding — sesuai BUILDING_RULES.md

export interface BuildingSpec {
  type: string;
  position: [number, number, number]; // pusat bawah bangunan
  facing: '+x' | '-x' | '+z' | '-z'; // arah fasad → jalan
  width: number;
  depth: number;
  height: number;
  wallColor: string;
  roofColor: string;
}

/** Validator — kembalikan array error; kosong = valid */
export function validateBuilding(spec: BuildingSpec): string[] {
  const errors: string[] = [];
  if (spec.width <= 0) errors.push('width harus > 0');
  if (spec.depth <= 0) errors.push('depth harus > 0');
  if (spec.height <= 0) errors.push('height harus > 0');
  if (!['+ x', '-x', '+z', '-z'].includes(spec.facing) && !['+x', '-x', '+z', '-z'].includes(spec.facing)) {
    errors.push(`facing tidak valid: ${spec.facing}`);
  }
  if (spec.width < 4 && spec.type !== 'warung') {
    errors.push('bangunan terlalu sempit (min 4 unit)');
  }
  return errors;
}

/**
 * Bangunan blocky low-poly dengan pintu & jendela di posisi logis.
 * Fasad selalu menghadap jalan (facing prop).
 */
export function Building({ spec }: { spec: BuildingSpec }) {
  const errors = useMemo(() => validateBuilding(spec), [spec]);

  if (errors.length > 0) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[Building] "${spec.type}" invalid:`, errors);
    }
    return null;
  }

  const { position, facing, width, depth, height, wallColor, roofColor } = spec;
  const [px, py, pz] = position;

  // Offset pintu ke arah fasad
  const doorOffset = facingOffset(facing, depth / 2 + 0.01);
  const doorRotY = facingRotY(facing);

  // Material
  const wallMat = new THREE.MeshLambertMaterial({ color: wallColor });
  const roofMat = new THREE.MeshLambertMaterial({ color: roofColor });
  const doorMat = new THREE.MeshLambertMaterial({ color: '#4A2E1A' });
  const windowMat = new THREE.MeshLambertMaterial({ color: '#A8D8EA', transparent: true, opacity: 0.75 });
  const frameMat = new THREE.MeshLambertMaterial({ color: '#FFFFF0' });

  // Ukuran pintu & jendela
  const doorW = Math.min(1.2, width * 0.25);
  const doorH = Math.min(2.2, height * 0.55);
  const winW = 1.0;
  const winH = 1.2;
  const winY = py + 1.5 + winH / 2;

  // Jendela fasad: 2 jendela simetris kanan-kiri pintu
  const winFacadeDist = doorW / 2 + winW / 2 + 0.6;

  return (
    <group>
      {/* Badan bangunan dengan physics collision */}
      <RigidBody type="fixed" colliders="cuboid" position={[px, py + height / 2, pz]}>
        <mesh castShadow receiveShadow material={wallMat}>
          <boxGeometry args={[width, height, depth]} />
        </mesh>
      </RigidBody>

      {/* Atap dengan overhang 0.4 unit */}
      <mesh position={[px, py + height + 0.2, pz]} castShadow material={roofMat}>
        <boxGeometry args={[width + 0.8, 0.4, depth + 0.8]} />
      </mesh>

      {/* Pintu */}
      <mesh
        position={[
          px + doorOffset[0],
          py + doorH / 2,
          pz + doorOffset[2],
        ]}
        rotation={[0, doorRotY, 0]}
        material={doorMat}
      >
        <boxGeometry args={[doorW, doorH, 0.15]} />
      </mesh>

      {/* Jendela fasad kiri */}
      <WindowPane
        position={facingWindowPos(facing, px, py, pz, depth, -winFacadeDist, winY)}
        rotY={doorRotY}
        winW={winW}
        winH={winH}
        windowMat={windowMat}
        frameMat={frameMat}
      />
      {/* Jendela fasad kanan */}
      <WindowPane
        position={facingWindowPos(facing, px, py, pz, depth, winFacadeDist, winY)}
        rotY={doorRotY}
        winW={winW}
        winH={winH}
        windowMat={windowMat}
        frameMat={frameMat}
      />

      {/* Jendela samping (jika bangunan cukup lebar) */}
      {width > 7 && (
        <>
          <WindowPane
            position={sideWindowPos(facing, px, winY, pz, width, depth, -1)}
            rotY={doorRotY + Math.PI / 2}
            winW={winW}
            winH={winH}
            windowMat={windowMat}
            frameMat={frameMat}
          />
          <WindowPane
            position={sideWindowPos(facing, px, winY, pz, width, depth, 1)}
            rotY={doorRotY + Math.PI / 2}
            winW={winW}
            winH={winH}
            windowMat={windowMat}
            frameMat={frameMat}
          />
        </>
      )}
    </group>
  );
}

// ─── Helper komponen & fungsi ─────────────────────────────────────

interface WindowPaneProps {
  position: [number, number, number];
  rotY: number;
  winW: number;
  winH: number;
  windowMat: THREE.MeshLambertMaterial;
  frameMat: THREE.MeshLambertMaterial;
}

function WindowPane({ position, rotY, winW, winH, windowMat, frameMat }: WindowPaneProps) {
  return (
    <group position={position} rotation={[0, rotY, 0]}>
      {/* Frame */}
      <mesh material={frameMat}>
        <boxGeometry args={[winW + 0.15, winH + 0.15, 0.12]} />
      </mesh>
      {/* Kaca */}
      <mesh material={windowMat} position={[0, 0, 0.04]}>
        <boxGeometry args={[winW - 0.1, winH - 0.1, 0.06]} />
      </mesh>
    </group>
  );
}

function facingOffset(facing: BuildingSpec['facing'], dist: number): [number, number, number] {
  switch (facing) {
    case '+x': return [dist, 0, 0];
    case '-x': return [-dist, 0, 0];
    case '+z': return [0, 0, dist];
    case '-z': return [0, 0, -dist];
  }
}

function facingRotY(facing: BuildingSpec['facing']): number {
  switch (facing) {
    case '+x': return -Math.PI / 2;
    case '-x': return Math.PI / 2;
    case '+z': return 0;
    case '-z': return Math.PI;
  }
}

function facingWindowPos(
  facing: BuildingSpec['facing'],
  px: number, _py: number, pz: number,
  depth: number,
  lateralOffset: number,
  winY: number
): [number, number, number] {
  const surfaceOffset = depth / 2 + 0.08;
  switch (facing) {
    case '+x': return [px + surfaceOffset, winY, pz + lateralOffset];
    case '-x': return [px - surfaceOffset, winY, pz + lateralOffset];
    case '+z': return [px + lateralOffset, winY, pz + surfaceOffset];
    case '-z': return [px + lateralOffset, winY, pz - surfaceOffset];
  }
}

function sideWindowPos(
  facing: BuildingSpec['facing'],
  px: number, winY: number, pz: number,
  width: number, depth: number,
  side: -1 | 1 // -1 = kiri, 1 = kanan (relatif fasad)
): [number, number, number] {
  const halfW = width / 2 + 0.08;
  const halfD = depth / 2 + 0.08;
  switch (facing) {
    case '+x':
    case '-x': return [px, winY, pz + side * halfD];
    case '+z':
    case '-z': return [px + side * halfW, winY, pz];
  }
}

// ─── Komponen Buildings untuk seluruh kota ───────────────────────

const CITY_BUILDINGS: BuildingSpec[] = [
  // Pusat kota — di persimpangan jalan
  { type: 'minimarket', position: [10, 0, -20], facing: '+z', width: 12, depth: 10, height: 5, wallColor: '#ECECEC', roofColor: '#A23B2A' },
  { type: 'ruko', position: [-15, 0, -23], facing: '+z', width: 8, depth: 10, height: 8, wallColor: '#F5E9D3', roofColor: '#555' },
  { type: 'ruko', position: [-25, 0, -23], facing: '+z', width: 8, depth: 10, height: 8, wallColor: '#DDEEFF', roofColor: '#444' },
  { type: 'warung', position: [22, 0, -18], facing: '+z', width: 5, depth: 4, height: 3.5, wallColor: '#F2B632', roofColor: '#8B4513' },

  // Permukiman — kiri tengah
  { type: 'rumah-kecil', position: [-25, 0, 15], facing: '+x', width: 6, depth: 6, height: 4, wallColor: '#F5E9D3', roofColor: '#A23B2A' },
  { type: 'rumah-kecil', position: [-25, 0, 28], facing: '+x', width: 6, depth: 6, height: 4, wallColor: '#E8D5B0', roofColor: '#8B3A2A' },
  { type: 'rumah-sedang', position: [-30, 0, -10], facing: '+x', width: 8, depth: 8, height: 5, wallColor: '#ECECEC', roofColor: '#A23B2A' },
  { type: 'rumah-bagus', position: [-35, 0, 42], facing: '+x', width: 10, depth: 8, height: 6, wallColor: '#F5E9D3', roofColor: '#6B4226' },
  { type: 'rumah-kecil', position: [-40, 0, 58], facing: '+x', width: 6, depth: 6, height: 4, wallColor: '#F0E0C0', roofColor: '#9B3A2A' },

  // Permukiman — kanan tengah
  { type: 'rumah-kecil', position: [30, 0, 15], facing: '-x', width: 6, depth: 6, height: 4, wallColor: '#F5E9D3', roofColor: '#A23B2A' },
  { type: 'rumah-sedang', position: [32, 0, 28], facing: '-x', width: 8, depth: 8, height: 5, wallColor: '#ECECEC', roofColor: '#A23B2A' },
  { type: 'rumah-mewah', position: [35, 0, -15], facing: '-x', width: 12, depth: 10, height: 7, wallColor: '#F0F0F0', roofColor: '#666' },

  // Sekolah SMK TELESANDI
  { type: 'sekolah', position: [-40, 0, -30], facing: '+x', width: 20, depth: 15, height: 8, wallColor: '#ECECEC', roofColor: '#5566AA' },

  // Sekolah SMPN 11
  { type: 'sekolah', position: [-60, 0, 10], facing: '+x', width: 20, depth: 15, height: 8, wallColor: '#F0F0E8', roofColor: '#44AA66' },

  // Warung-warung kecil
  { type: 'warung', position: [-12, 0, 50], facing: '+z', width: 5, depth: 4, height: 3.5, wallColor: '#F2B632', roofColor: '#8B4513' },
  { type: 'warung', position: [15, 0, 55], facing: '-z', width: 5, depth: 4, height: 3.5, wallColor: '#E8AA20', roofColor: '#7B3A10' },
];

export default function Buildings() {
  return (
    <group>
      {CITY_BUILDINGS.map((spec, i) => (
        <Building key={i} spec={spec} />
      ))}
    </group>
  );
}
