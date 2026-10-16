'use client';

import { useGameStore } from '@/store/gameStore';
import Npc from './Npc';

const NPC_COLORS: Record<string, string> = {
  ariman: '#27AE60',      // Hijau daun
  putra: '#E74C3C',       // Merah cerah
  ananda: '#8E44AD',      // Ungu
  zait: '#F39C12',        // Kuning / Oranye
  mahardhika: '#16A085',  // Toska / Hijau laut
};

export default function NpcList() {
  const missions = useGameStore((s) => s.missions);

  return (
    <group>
      {missions.map((m) => (
        <Npc
          key={m.id}
          mission={m}
          color={NPC_COLORS[m.id] || '#E8743B'}
        />
      ))}
    </group>
  );
}
