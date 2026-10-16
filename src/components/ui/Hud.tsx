'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useGameStore } from '@/store/gameStore';
import { usePlayerStore } from '@/store/playerStore';
import { useUiStore } from '@/store/uiStore';

export default function Hud() {
  const phase = useGameStore((s) => s.phase);
  const timeLeft = useGameStore((s) => s.timeLeft);
  const tickTimer = useGameStore((s) => s.tickTimer);
  const missions = useGameStore((s) => s.missions);
  const friendsFound = useGameStore((s) => s.friendsFound);

  const money = usePlayerStore((s) => s.money);
  const buff = usePlayerStore((s) => s.buff);

  const activePrompt = useUiStore((s) => s.activePrompt);
  const toggleMissionPanel = useUiStore((s) => s.toggleMissionPanel);
  const toggleSettings = useUiStore((s) => s.toggleSettings);

  // Timer loop
  useEffect(() => {
    if (phase !== 'playing') return;
    const interval = setInterval(() => {
      tickTimer(1);
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, tickTimer]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = Math.floor(timeLeft % 60);
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isUrgent = timeLeft < 120; // kurang dari 2 menit

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex flex-col justify-between p-4 overflow-hidden select-none">
      {/* ─── Top Bar: Menu (Kiri), Timer Senja (Tengah), Teman & Uang (Kanan) ─── */}
      <div className="relative flex items-start justify-between w-full">
        {/* Kiri: Tombol Menu, Pengaturan & Buff */}
        <div className="flex flex-col gap-1.5 pointer-events-auto">
          <div className="flex items-center gap-1.5">
            <Link
              href="/"
              className="btn-plang btn-secondary text-xs px-3 py-1.5 shadow-[2px_2px_0px_rgba(0,0,0,0.4)] flex items-center justify-center font-bold"
              style={{ fontSize: '0.85rem' }}
            >
              ← Menu
            </Link>
            <button
              onClick={toggleSettings}
              className="bg-[#2B1D14]/90 hover:bg-[#3D2B1F] border border-[#8B5A2B] text-[#F5E9D3] text-xs px-2.5 py-1.5 rounded shadow-[2px_2px_0px_rgba(0,0,0,0.4)] flex items-center justify-center font-bold transition-transform active:scale-95"
              title="Pengaturan Suara & Grafis"
            >
              ⚙️
            </button>
          </div>

          {/* Buff Aktif jika ada */}
          {buff.type && (
            <div className="bg-[#4F7A3A]/90 text-white text-xs px-2.5 py-1 rounded border border-[#27AE60] flex items-center gap-1.5 shadow">
              <span className="font-bold">⚡ Buff Jajanan:</span>
              <span>{buff.type === 'sprint_boost' ? 'Lari Cepat +25%' : 'Petunjuk Aktif'}</span>
            </div>
          )}
        </div>

        {/* Tengah: Countdown Waktu Senja */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 pointer-events-auto flex flex-col items-center">
          <div
            className={`flex items-center gap-2.5 px-4 py-1.5 rounded-lg border-2 shadow-[3px_3px_0px_rgba(0,0,0,0.4)] ${
              isUrgent
                ? 'bg-[#A23B2A] border-[#FFD1A4] text-white animate-pulse'
                : 'bg-[#2B1D14]/90 border-[#E8743B] text-[#F5E9D3]'
            }`}
          >
            {/* Ikon Jam Matahari Senja */}
            <svg
              className="w-5 h-5 text-[#F2B632]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="9" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#E8743B] leading-none mb-0.5">
                Waktu Senja
              </span>
              <span className="font-display font-black text-2xl leading-none tracking-wider">
                {formattedTime}
              </span>
            </div>
          </div>
        </div>

        {/* Tengah/Kanan: Misi Teman & Uang */}
        <div className="flex flex-col items-end gap-2 pointer-events-auto">
          {/* Uang Saku */}
          <div className="bg-[#2B1D14]/90 border-2 border-[#F2B632] px-3 py-1 rounded shadow-[2px_2px_0px_rgba(0,0,0,0.4)] text-right">
            <span className="text-[10px] text-[#F5E9D3]/70 font-semibold uppercase block">
              Uang Jajan
            </span>
            <span className="font-display font-bold text-lg text-[#F2B632]">
              {formatRupiah(money)}
            </span>
          </div>

          {/* Progress Teman (2/5) */}
          <button
            onClick={toggleMissionPanel}
            className="flex items-center gap-2.5 bg-[#2B1D14]/90 hover:bg-[#3D2B1F] border-2 border-[#E8743B] px-3 py-1.5 rounded shadow-[2px_2px_0px_rgba(0,0,0,0.4)] transition-all cursor-pointer"
          >
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-[#E8743B] font-bold uppercase tracking-wider">
                Teman Ditemukan
              </span>
              <span className="font-display font-black text-xl text-[#F5E9D3] leading-none">
                {friendsFound} / {missions.length}
              </span>
            </div>

            {/* Indikator 5 kotak teman */}
            <div className="flex gap-1">
              {missions.map((m) => (
                <div
                  key={m.id}
                  title={`${m.name}: ${m.found ? 'Sudah Ketemu' : 'Belum Ketemu'}`}
                  className={`w-3.5 h-3.5 rounded-sm border ${
                    m.found
                      ? 'bg-[#2ECC71] border-[#27AE60]'
                      : 'bg-[#2B1D14] border-[#E8743B]/60'
                  }`}
                />
              ))}
            </div>
          </button>
        </div>
      </div>

      {/* ─── Tengah Bawah: Floating Prompt Interaksi [E] ─── */}
      <div className="flex flex-col items-center justify-end mb-4">
        {activePrompt && (
          <div className="pointer-events-auto bg-[#2B1D14]/95 border-2 border-[#E8743B] px-5 py-2.5 rounded shadow-[3px_3px_0px_rgba(0,0,0,0.5)] flex items-center gap-3 animate-bounce">
            <span className="bg-[#E8743B] text-white font-display font-black text-lg px-2.5 py-0.5 rounded border border-[#C0392B]">
              E
            </span>
            <span className="font-body font-bold text-[#F5E9D3] text-sm">
              {activePrompt.label}
            </span>
          </div>
        )}
      </div>

      {/* ─── Kanan Bawah: Petunjuk Kontrol Sederhana ─── */}
      <div className="flex justify-between items-end w-full">
        {/* Tombol Misi di Kiri Bawah */}
        <div className="pointer-events-auto">
          <button
            onClick={toggleMissionPanel}
            className="btn-plang text-xs px-3 py-1.5 flex items-center gap-1.5"
            style={{ fontSize: '0.8rem' }}
          >
            <span>📋</span>
            <span>Daftar Teman (M)</span>
          </button>
        </div>

        {/* Panduan Tombol di Kanan Bawah */}
        <div className="hidden md:flex flex-col items-end">
          <details className="bg-[#2B1D14]/85 border border-[#E8743B]/40 rounded text-[11px] text-[#F5E9D3]/80 font-body shadow backdrop-blur-sm pointer-events-auto">
            <summary className="font-bold text-[#E8743B] uppercase text-[10px] tracking-wider px-3 py-1.5 cursor-pointer select-none hover:text-[#F2B632] flex items-center gap-1.5">
              <span>⌨️ Kontrol Keyboard</span>
            </summary>
            <div className="px-3 pb-2 pt-1 flex flex-col gap-1 border-t border-[#E8743B]/20">
              <div className="flex justify-between gap-4">
                <span className="font-semibold text-white">W, A, S, D</span>
                <span>Jalan</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="font-semibold text-white">Shift</span>
                <span>Lari</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="font-semibold text-white">Spasi</span>
                <span>Lompat</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="font-semibold text-white">E</span>
                <span>Bicara / Beli</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="font-semibold text-white">F</span>
                <span>Naik / Turun Kendaraan</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="font-semibold text-white">Klik & Geser</span>
                <span>Putar Kamera</span>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}
