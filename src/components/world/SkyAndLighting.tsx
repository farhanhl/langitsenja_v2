'use client';

import { Sky, Cloud } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { useGameStore } from '@/store/gameStore';

// Langit senja yang bergerak — blocky low-poly style
// Mendukung transisi mode malam saat waktu habis (kalah)

export default function SkyAndLighting() {
  const cloudGroupRef = useRef<THREE.Group>(null!);
  const phase = useGameStore((s) => s.phase);
  const isNight = phase === 'lost';

  // Awan bergerak pelan
  useFrame((_, delta) => {
    if (cloudGroupRef.current) {
      cloudGroupRef.current.position.x += delta * 0.5;
      if (cloudGroupRef.current.position.x > 200) {
        cloudGroupRef.current.position.x = -200;
      }
    }
  });

  return (
    <>
      {/* Langit senja (atau langit malam saat waktu habis) */}
      <Sky
        distance={450000}
        sunPosition={isNight ? [1, -0.3, -1] : [1, 0.08, -1]}
        inclination={isNight ? 0.6 : 0.49}
        azimuth={0.25}
        mieCoefficient={isNight ? 0.005 : 0.015}
        mieDirectionalG={isNight ? 0.6 : 0.88}
        rayleigh={isNight ? 0.3 : 3}
        turbidity={isNight ? 6 : 12}
      />

      {/* Cahaya ambient hangat (atau biru malam redup) */}
      <ambientLight
        intensity={isNight ? 0.25 : 0.6}
        color={isNight ? '#1E293B' : '#FFA560'}
      />

      {/* Matahari rendah senja / Rembulan malam */}
      <directionalLight
        position={isNight ? [-20, 40, 30] : [40, 20, -60]}
        intensity={isNight ? 0.35 : 2.0}
        color={isNight ? '#93C5FD' : '#FFB347'}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={200}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
      />

      {/* Fill light dari langit */}
      <hemisphereLight
        args={[
          isNight ? '#1E3A8A' : '#FF6B35',
          isNight ? '#020617' : '#2B1D14',
          isNight ? 0.2 : 0.4,
        ]}
      />

      {/* Awan blocky bergerak */}
      <group ref={cloudGroupRef}>
        <Cloud
          position={[-80, 40, -120]}
          segments={4}
          bounds={[20, 8, 8]}
          color={isNight ? '#334155' : '#F5E9D3'}
          opacity={isNight ? 0.3 : 0.6}
          speed={0}
        />
        <Cloud
          position={[30, 45, -130]}
          segments={4}
          bounds={[25, 10, 8]}
          color={isNight ? '#1E293B' : '#F5DFC0'}
          opacity={isNight ? 0.25 : 0.5}
          speed={0}
        />
        <Cloud
          position={[120, 38, -110]}
          segments={4}
          bounds={[18, 7, 7]}
          color={isNight ? '#334155' : '#F5E9D3'}
          opacity={isNight ? 0.3 : 0.55}
          speed={0}
        />
      </group>

      {/* Fog: senja oranye gelap atau malam pekat */}
      <fog
        attach="fog"
        args={[isNight ? '#0A0F1D' : '#C0392B', isNight ? 40 : 80, isNight ? 200 : 280]}
      />
    </>
  );
}
