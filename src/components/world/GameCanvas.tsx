'use client';

import { Canvas } from '@react-three/fiber';
import { KeyboardControls } from '@react-three/drei';
import { Suspense } from 'react';
import { Physics } from '@react-three/rapier';
import { useKeyboard } from '@/hooks/useKeyboard';
import SkyAndLighting from './SkyAndLighting';
import City from './City';
import Player from './Characters/Player';
import NpcList from './Characters/NpcList';
import VehicleManager from './Vehicles/VehicleManager';

import { useSettingsStore } from '@/store/settingsStore';

// Definisi key-map untuk @react-three/drei KeyboardControls
const keyMap = [
  { name: 'forward',  keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left',     keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right',    keys: ['ArrowRight', 'KeyD'] },
  { name: 'sprint',   keys: ['ShiftLeft', 'ShiftRight'] },
  { name: 'jump',     keys: ['Space'] },
  { name: 'interact', keys: ['KeyE'] },
  { name: 'enterExit',keys: ['KeyF'] },
] as const;

export default function GameCanvas() {
  // Aktifkan keyboard listener global
  useKeyboard();

  const quality = useSettingsStore((s) => s.quality);
  const shadows = useSettingsStore((s) => s.shadows);

  const dprRange: [number, number] =
    quality === 'low' ? [1, 1] : quality === 'medium' ? [1, 1.35] : [1, 1.75];

  return (
    <div className="w-full flex-1" style={{ height: '100dvh' }}>
      <KeyboardControls map={keyMap as unknown as Parameters<typeof KeyboardControls>[0]['map']}>
        <Canvas
          shadows={shadows}
          dpr={dprRange}
          camera={{ fov: 65, near: 0.1, far: 800, position: [0, 8, 15] }}
          gl={{ antialias: quality !== 'low', powerPreference: 'high-performance' }}
          style={{ background: '#FF6B35' }}
        >
          <Suspense fallback={null}>
            <SkyAndLighting />
            <Physics gravity={[0, -18, 0]}>
              <City />
              <Player />
              <NpcList />
              <VehicleManager />
            </Physics>
          </Suspense>
        </Canvas>
      </KeyboardControls>
    </div>
  );
}
