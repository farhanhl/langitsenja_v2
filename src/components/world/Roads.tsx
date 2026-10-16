'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { WORLD } from '@/game/constants';

// Jalan dan sidewalk kota
// Grid jalan utama + beberapa jalan sekunder
// Fasad bangunan menghadap ke jalan (sesuai WORLD_DESIGN.md)

const ROAD_COLOR = '#4A4A4A';
const SIDEWALK_COLOR = '#8C7B5E';
const ROAD_LINE_COLOR = '#F5E9D3';

// Definisi jalan: [arah, x/z, panjang]
// arah: 'h' = horizontal (Z-axis), 'v' = vertical (X-axis)
interface RoadDef {
  dir: 'h' | 'v';
  pos: number;    // posisi tetap (x untuk v, z untuk h)
  from: number;   // start
  to: number;     // end
}

const ROADS: RoadDef[] = [
  // Jalan utama vertikal (N-S)
  { dir: 'v', pos: 0, from: -140, to: 140 },
  { dir: 'v', pos: -50, from: -140, to: 140 },
  { dir: 'v', pos: 50, from: -140, to: 140 },
  { dir: 'v', pos: -100, from: -100, to: 100 },
  { dir: 'v', pos: 100, from: -100, to: 100 },

  // Jalan utama horizontal (E-W)
  { dir: 'h', pos: 0, from: -140, to: 140 },
  { dir: 'h', pos: -50, from: -140, to: 140 },
  { dir: 'h', pos: 50, from: -140, to: 140 },
  { dir: 'h', pos: -100, from: -100, to: 100 },
  { dir: 'h', pos: 100, from: -100, to: 100 },
];

export default function Roads() {
  const roadMat = useMemo(
    () => new THREE.MeshLambertMaterial({ color: ROAD_COLOR }),
    []
  );
  const sidewalkMat = useMemo(
    () => new THREE.MeshLambertMaterial({ color: SIDEWALK_COLOR }),
    []
  );

  const W = WORLD.ROAD_WIDTH;
  const SW = WORLD.SIDEWALK_WIDTH;

  return (
    <group>
      {ROADS.map((road, i) => {
        const len = road.to - road.from;
        const mid = (road.from + road.to) / 2;

        if (road.dir === 'v') {
          // Vertikal: panjang di Z, lebar di X
          return (
            <group key={i}>
              {/* Aspal */}
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[road.pos, 0.01, mid]} receiveShadow material={roadMat}>
                <planeGeometry args={[W, len]} />
              </mesh>
              {/* Sidewalk kiri */}
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[road.pos - W / 2 - SW / 2, 0.02, mid]} receiveShadow material={sidewalkMat}>
                <planeGeometry args={[SW, len]} />
              </mesh>
              {/* Sidewalk kanan */}
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[road.pos + W / 2 + SW / 2, 0.02, mid]} receiveShadow material={sidewalkMat}>
                <planeGeometry args={[SW, len]} />
              </mesh>
              {/* Garis tengah jalan putus-putus — ditampilkan sebagai mesh kecil */}
              {Array.from({ length: Math.floor(len / 8) }, (_, j) => (
                <mesh
                  key={j}
                  rotation={[-Math.PI / 2, 0, 0]}
                  position={[road.pos, 0.02, road.from + j * 8 + 4]}
                >
                  <planeGeometry args={[0.15, 3]} />
                  <meshBasicMaterial color={ROAD_LINE_COLOR} opacity={0.4} transparent />
                </mesh>
              ))}
            </group>
          );
        } else {
          // Horizontal: panjang di X, lebar di Z
          return (
            <group key={i}>
              {/* Aspal */}
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[mid, 0.01, road.pos]} receiveShadow material={roadMat}>
                <planeGeometry args={[len, W]} />
              </mesh>
              {/* Sidewalk atas */}
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[mid, 0.02, road.pos - W / 2 - SW / 2]} receiveShadow material={sidewalkMat}>
                <planeGeometry args={[len, SW]} />
              </mesh>
              {/* Sidewalk bawah */}
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[mid, 0.02, road.pos + W / 2 + SW / 2]} receiveShadow material={sidewalkMat}>
                <planeGeometry args={[len, SW]} />
              </mesh>
              {/* Garis tengah */}
              {Array.from({ length: Math.floor(len / 8) }, (_, j) => (
                <mesh
                  key={j}
                  rotation={[-Math.PI / 2, 0, 0]}
                  position={[road.from + j * 8 + 4, 0.02, road.pos]}
                >
                  <planeGeometry args={[3, 0.15]} />
                  <meshBasicMaterial color={ROAD_LINE_COLOR} opacity={0.4} transparent />
                </mesh>
              ))}
            </group>
          );
        }
      })}
    </group>
  );
}
