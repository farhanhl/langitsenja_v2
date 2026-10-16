'use client';

import { useGameStore } from '@/store/gameStore';
import Link from 'next/link';

export default function EndScreen() {
  const phase = useGameStore((s) => s.phase);
  const friendsFound = useGameStore((s) => s.friendsFound);
  const startGame = useGameStore((s) => s.startGame);

  if (phase !== 'won' && phase !== 'lost') return null;

  const isWin = phase === 'won';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm pointer-events-auto">
      <div className="w-full max-w-md bg-[#F5E9D3] border-4 border-[#2B1D14] rounded-lg shadow-[8px_8px_0px_#2B1D14] p-6 flex flex-col items-center text-center gap-4 animate-float-title">
        {/* Badge Status */}
        <div
          className={`font-display font-black text-4xl sm:text-5xl px-4 py-2 rounded-md border-2 shadow-[3px_3px_0px_#2B1D14] ${
            isWin
              ? 'bg-[#2ECC71] text-white border-[#27AE60]'
              : 'bg-[#A23B2A] text-white border-[#8B3A2A]'
          }`}
        >
          {isWin ? 'KAMU MENANG!' : 'WAKTU HABIS!'}
        </div>

        {/* Deskripsi */}
        <p className="font-body text-[#2B1D14] text-base sm:text-lg font-semibold leading-relaxed">
          {isWin
            ? 'Hebat! Semua 5 teman berhasil kamu temukan sebelum senja berganti malam. Sekarang kalian bisa nongkrong bareng!'
            : `Malam sudah tiba di kota. Kamu baru menemukan ${friendsFound} dari 5 teman. Jangan patah semangat, coba lagi yuk!`}
        </p>

        {/* Tombol Aksi */}
        <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
          <button
            onClick={() => startGame()}
            className="btn-plang flex-1 py-2.5 text-base cursor-pointer shadow-[2px_2px_0px_#2B1D14]"
          >
            Coba Lagi
          </button>
          <Link
            href="/"
            className="btn-plang btn-secondary flex-1 py-2.5 text-base text-center cursor-pointer shadow-[2px_2px_0px_#2B1D14]"
          >
            Menu Utama
          </Link>
        </div>
      </div>
    </div>
  );
}
