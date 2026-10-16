'use client';

import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface TrafficVehicle {
  id: string;
  type: 'car' | 'motor';
  color: string;
  speed: number;
  axis: 'x' | 'z';
  dir: 1 | -1;
  fixedCoord: number; // posisi di sumbu lain (mis. z jika jalan di x)
  minPos: number;
  maxPos: number;
  initialPos: number;
}

const TRAFFIC_CONFIGS: TrafficVehicle[] = [
  // Jalur X = 0 (jalan tengah membujur Z)
  { id: 'traffic-car-1', type: 'car', color: '#E8743B', speed: 8.0, axis: 'z', dir: 1, fixedCoord: 2.2, minPos: -120, maxPos: 120, initialPos: -60 },
  { id: 'traffic-motor-1', type: 'motor', color: '#27AE60', speed: 9.5, axis: 'z', dir: -1, fixedCoord: -2.2, minPos: -120, maxPos: 120, initialPos: 80 },

  // Jalur Z = 0 (jalan tengah melintang X)
  { id: 'traffic-car-2', type: 'car', color: '#F1C40F', speed: 7.5, axis: 'x', dir: 1, fixedCoord: -2.2, minPos: -120, maxPos: 120, initialPos: -40 },
  { id: 'traffic-motor-2', type: 'motor', color: '#8E44AD', speed: 10.0, axis: 'x', dir: -1, fixedCoord: 2.2, minPos: -120, maxPos: 120, initialPos: 50 },

  // Jalur Z = 50 (jalan permukiman & taman)
  { id: 'traffic-car-3', type: 'car', color: '#ECECEC', speed: 7.0, axis: 'x', dir: 1, fixedCoord: 47.8, minPos: -120, maxPos: 120, initialPos: -90 },
  { id: 'traffic-motor-3', type: 'motor', color: '#C0392B', speed: 9.0, axis: 'x', dir: -1, fixedCoord: 52.2, minPos: -120, maxPos: 120, initialPos: 100 },
];

export default function TrafficAi() {
  return (
    <group>
      {TRAFFIC_CONFIGS.map((config) => (
        <AiVehicle key={config.id} config={config} />
      ))}
    </group>
  );
}

function AiVehicle({ config }: { config: TrafficVehicle }) {
  const groupRef = useRef<THREE.Group>(null);
  const posRef = useRef(config.initialPos);
  const dirRef = useRef(config.dir);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Gerak maju sesuai arah
    posRef.current += dirRef.current * config.speed * delta;

    // Balik arah jika mencapai ujung jalan
    if (posRef.current > config.maxPos) {
      posRef.current = config.maxPos;
      dirRef.current = -1;
    } else if (posRef.current < config.minPos) {
      posRef.current = config.minPos;
      dirRef.current = 1;
    }

    // Set posisi dan rotasi
    const rotY = config.axis === 'z'
      ? (dirRef.current === 1 ? 0 : Math.PI)
      : (dirRef.current === 1 ? Math.PI / 2 : -Math.PI / 2);

    if (config.axis === 'z') {
      groupRef.current.position.set(config.fixedCoord, 0, posRef.current);
    } else {
      groupRef.current.position.set(posRef.current, 0, config.fixedCoord);
    }
    groupRef.current.rotation.y = rotY;
  });

  const bodyMaterial = useMemo(
    () => new THREE.MeshLambertMaterial({ color: config.color }),
    [config.color]
  );
  const darkMaterial = useMemo(
    () => new THREE.MeshLambertMaterial({ color: '#2C3E50' }),
    []
  );
  const lightMaterial = useMemo(
    () => new THREE.MeshLambertMaterial({ color: '#FFF3A8', emissive: '#FFB347', emissiveIntensity: 0.5 }),
    []
  );

  if (config.type === 'car') {
    return (
      <group ref={groupRef}>
        {/* Bodi mobil AI */}
        <mesh position={[0, 0.55, 0]} material={bodyMaterial} castShadow>
          <boxGeometry args={[1.8, 0.45, 3.4]} />
        </mesh>
        <mesh position={[0, 1.1, -0.15]} material={bodyMaterial} castShadow>
          <boxGeometry args={[1.5, 0.65, 1.8]} />
        </mesh>
        {/* Lampu depan */}
        <mesh position={[-0.6, 0.55, 1.71]} material={lightMaterial}>
          <boxGeometry args={[0.3, 0.15, 0.05]} />
        </mesh>
        <mesh position={[0.6, 0.55, 1.71]} material={lightMaterial}>
          <boxGeometry args={[0.3, 0.15, 0.05]} />
        </mesh>
        {/* Roda */}
        <mesh position={[-0.9, 0.35, 1.0]} material={darkMaterial}>
          <boxGeometry args={[0.2, 0.6, 0.6]} />
        </mesh>
        <mesh position={[0.9, 0.35, 1.0]} material={darkMaterial}>
          <boxGeometry args={[0.2, 0.6, 0.6]} />
        </mesh>
        <mesh position={[-0.9, 0.35, -1.0]} material={darkMaterial}>
          <boxGeometry args={[0.2, 0.6, 0.6]} />
        </mesh>
        <mesh position={[0.9, 0.35, -1.0]} material={darkMaterial}>
          <boxGeometry args={[0.2, 0.6, 0.6]} />
        </mesh>
      </group>
    );
  }

  // Motor AI
  return (
    <group ref={groupRef}>
      {/* Rangka motor */}
      <mesh position={[0, 0.55, 0]} material={bodyMaterial} castShadow>
        <boxGeometry args={[0.3, 0.4, 1.3]} />
      </mesh>
      {/* Pengendara AI */}
      <mesh position={[0, 1.0, 0]} material={bodyMaterial} castShadow>
        <boxGeometry args={[0.35, 0.5, 0.25]} />
      </mesh>
      <mesh position={[0, 1.4, 0.05]} material={darkMaterial} castShadow>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
      </mesh>
      {/* Lampu depan */}
      <mesh position={[0, 0.75, 0.66]} material={lightMaterial}>
        <boxGeometry args={[0.18, 0.15, 0.06]} />
      </mesh>
      {/* Roda depan & belakang */}
      <mesh position={[0, 0.35, 0.6]} material={darkMaterial}>
        <boxGeometry args={[0.14, 0.6, 0.6]} />
      </mesh>
      <mesh position={[0, 0.35, -0.5]} material={darkMaterial}>
        <boxGeometry args={[0.14, 0.6, 0.6]} />
      </mesh>
    </group>
  );
}
