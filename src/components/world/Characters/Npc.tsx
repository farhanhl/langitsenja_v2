'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { RigidBody, CapsuleCollider } from '@react-three/rapier';
import { usePlayerStore } from '@/store/playerStore';
import { useUiStore } from '@/store/uiStore';
import { useGameStore } from '@/store/gameStore';
import { NPC_DIALOGUES } from '@/game/dialogues';
import { consumeInteract } from '@/hooks/useKeyboard';
import type { Mission } from '@/game/missions';

interface NpcProps {
  mission: Mission;
  color: string;
}

export default function Npc({ mission, color }: NpcProps) {
  const isNearRef = useRef(false);

  useFrame(() => {
    // Cek jarak dengan posisi pemain dari playerStore
    const { posX, posZ } = usePlayerStore.getState();
    const [tx, , tz] = mission.worldPos;

    const dx = posX - tx;
    const dz = posZ - tz;
    const distSq = dx * dx + dz * dz;

    const isNear = distSq <= 3.0 * 3.0; // radius 3 meter
    const uiStore = useUiStore.getState();

    if (isNear) {
      if (!isNearRef.current) {
        isNearRef.current = true;
        uiStore.setPrompt({
          id: mission.id,
          label: `Bicara dengan ${mission.name}`,
          type: 'npc',
        });
      }

      // Cek apakah tombol interaksi ditekan
      if (consumeInteract()) {
        const dialog = NPC_DIALOGUES[mission.id];
        if (dialog) {
          uiStore.openDialog(mission.id, dialog);
          // Tandai teman ditemukan jika belum
          if (!mission.found) {
            useGameStore.getState().foundFriend(mission.id);
          }
        }
      }
    } else {
      if (isNearRef.current) {
        isNearRef.current = false;
        if (uiStore.activePrompt?.id === mission.id) {
          uiStore.setPrompt(null);
        }
      }
    }
  });

  const [x, y, z] = mission.worldPos;

  return (
    <RigidBody
      type="fixed"
      colliders={false}
      position={[x, y, z]}
    >
      <CapsuleCollider args={[0.55, 0.35]} position={[0, 0.9, 0]} />

      {/* Tag nama & status melayang di atas kepala */}
      <Html position={[0, 2.3, 0]} center distanceFactor={14} zIndexRange={[100, 0]}>
        <div className="pointer-events-none select-none flex flex-col items-center">
          <div
            className={`px-2 py-0.5 rounded text-xs font-bold font-display shadow-md border ${
              mission.found
                ? 'bg-[#2ECC71] text-white border-[#27AE60]'
                : 'bg-[#E8743B] text-[#FFF] border-[#C0392B] animate-bounce'
            }`}
          >
            {mission.name} {mission.found ? '✓' : '!'}
          </div>
          <div className="text-[10px] text-white font-body bg-black/60 px-1 rounded mt-0.5 whitespace-nowrap">
            {mission.location}
          </div>
        </div>
      </Html>

      {/* Model Blocky NPC */}
      <group position={[0, 0, 0]}>
        {/* Kepala */}
        <mesh position={[0, 1.5, 0]} castShadow>
          <boxGeometry args={[0.45, 0.45, 0.45]} />
          <meshLambertMaterial color="#FFD1A4" />
        </mesh>

        {/* Rambut */}
        <mesh position={[0, 1.7, 0]} castShadow>
          <boxGeometry args={[0.48, 0.18, 0.48]} />
          <meshLambertMaterial color="#3D2B1F" />
        </mesh>

        {/* Baju / Kaos */}
        <mesh position={[0, 0.95, 0]} castShadow>
          <boxGeometry args={[0.55, 0.65, 0.35]} />
          <meshLambertMaterial color={color} />
        </mesh>

        {/* Lengan Kiri */}
        <mesh position={[-0.38, 0.95, 0]} castShadow>
          <boxGeometry args={[0.18, 0.6, 0.2]} />
          <meshLambertMaterial color={color} />
        </mesh>

        {/* Lengan Kanan */}
        <mesh position={[0.38, 0.95, 0]} castShadow>
          <boxGeometry args={[0.18, 0.6, 0.2]} />
          <meshLambertMaterial color={color} />
        </mesh>

        {/* Kaki Kiri */}
        <mesh position={[-0.16, 0.35, 0]} castShadow>
          <boxGeometry args={[0.22, 0.65, 0.25]} />
          <meshLambertMaterial color="#34495E" />
        </mesh>

        {/* Kaki Kanan */}
        <mesh position={[0.16, 0.35, 0]} castShadow>
          <boxGeometry args={[0.22, 0.65, 0.25]} />
          <meshLambertMaterial color="#34495E" />
        </mesh>

        {/* Sepatu */}
        <mesh position={[-0.16, 0.05, 0.03]} castShadow>
          <boxGeometry args={[0.23, 0.12, 0.3]} />
          <meshLambertMaterial color="#555" />
        </mesh>
        <mesh position={[0.16, 0.05, 0.03]} castShadow>
          <boxGeometry args={[0.23, 0.12, 0.3]} />
          <meshLambertMaterial color="#555" />
        </mesh>
      </group>
    </RigidBody>
  );
}
