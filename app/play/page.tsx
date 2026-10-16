'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import Hud from '@/components/ui/Hud';
import DialogModal from '@/components/ui/DialogModal';
import MissionPanel from '@/components/ui/MissionPanel';
import EndScreen from '@/components/ui/EndScreen';
import VendorShop from '@/components/ui/VendorShop';
import TouchControls from '@/components/ui/TouchControls';
import SettingsModal from '@/components/ui/SettingsModal';

// Canvas dimuat client-only
const GameCanvas = dynamic(() => import('@/components/world/GameCanvas'), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#2B1D14] gap-4">
      <div
        className="font-display font-bold text-[#E8743B]"
        style={{ fontSize: '2rem', animation: 'pulse-glow 1.5s ease-in-out infinite' }}
      >
        Memuat Dunia...
      </div>
      <p className="font-body text-[#F5E9D3] opacity-60 text-sm">
        Kota Bekasi sedang disiapkan untuk kamu jelajahi
      </p>
    </div>
  ),
});

export default function PlayPage() {
  return (
    <main className="relative flex flex-col min-h-screen overflow-hidden bg-[#2B1D14]">
      {/* Layer UI Game 2D */}
      <Hud />
      <TouchControls />
      <DialogModal />
      <MissionPanel />
      <VendorShop />
      <SettingsModal />
      <EndScreen />

      {/* Game Canvas 3D */}
      <div className="flex-1 flex flex-col">
        <Suspense>
          <GameCanvas />
        </Suspense>
      </div>
    </main>
  );
}
