'use client';

import { useUiStore } from '@/store/uiStore';
import { useSettingsStore, type QualityLevel } from '@/store/settingsStore';

export default function SettingsModal() {
  const isOpen = useUiStore((s) => s.settingsOpen);
  const toggleSettings = useUiStore((s) => s.toggleSettings);

  const masterVolume = useSettingsStore((s) => s.masterVolume);
  const musicVolume = useSettingsStore((s) => s.musicVolume);
  const sfxVolume = useSettingsStore((s) => s.sfxVolume);
  const isMuted = useSettingsStore((s) => s.isMuted);
  const quality = useSettingsStore((s) => s.quality);
  const shadows = useSettingsStore((s) => s.shadows);

  const setMasterVolume = useSettingsStore((s) => s.setMasterVolume);
  const setMusicVolume = useSettingsStore((s) => s.setMusicVolume);
  const setSfxVolume = useSettingsStore((s) => s.setSfxVolume);
  const toggleMute = useSettingsStore((s) => s.toggleMute);
  const setQuality = useSettingsStore((s) => s.setQuality);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in select-none">
      <div className="relative w-full max-w-md bg-[#2B1D14] border-4 border-[#8B5A2B] rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.8)] overflow-hidden text-[#F5E9D3] font-body">
        {/* Header Plang Kayu Senja */}
        <div className="bg-gradient-to-r from-[#8B5A2B] via-[#C86D51] to-[#8B5A2B] px-6 py-4 border-b-2 border-[#2B1D14] flex justify-between items-center shadow-md">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚙️</span>
            <h2 className="font-display font-black text-2xl text-[#2B1D14] tracking-wide uppercase drop-shadow-sm">
              Pengaturan Game
            </h2>
          </div>
          <button
            onClick={toggleSettings}
            className="w-8 h-8 rounded-full bg-[#2B1D14] text-[#F5E9D3] hover:bg-[#3D2B1F] flex items-center justify-center font-bold text-sm transition-transform active:scale-90"
            title="Tutup"
          >
            ✕
          </button>
        </div>

        {/* Konten Pengaturan */}
        <div className="p-6 flex flex-col gap-5 max-h-[80vh] overflow-y-auto">
          {/* ─── 1. Audio Mixer ─── */}
          <div className="flex flex-col gap-3.5 bg-black/25 p-4 rounded-xl border border-[#8B5A2B]/40">
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-lg text-[#F2B632] flex items-center gap-1.5">
                <span>🔊</span> Mixer Suara
              </span>
              <button
                onClick={toggleMute}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                  isMuted
                    ? 'bg-[#E74C3C] text-white ring-2 ring-red-400'
                    : 'bg-[#8B5A2B] text-white hover:bg-[#A06D3B]'
                }`}
              >
                {isMuted ? '🔇 Bunyi Mati (Muted)' : '🔊 Suara Aktif'}
              </button>
            </div>

            {/* Master Volume */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs text-[#E8C5A5]">
                <span>Volume Utama</span>
                <span className="font-mono font-bold text-[#F2B632]">{masterVolume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={masterVolume}
                onChange={(e) => setMasterVolume(Number(e.target.value))}
                className="w-full accent-[#F2B632] cursor-pointer"
              />
            </div>

            {/* SFX (Pedagang, Kendaraan, Bola) */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs text-[#E8C5A5]">
                <span>Efek Suara Kota & Jajanan</span>
                <span className="font-mono font-bold text-[#F2B632]">{sfxVolume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sfxVolume}
                onChange={(e) => setSfxVolume(Number(e.target.value))}
                className="w-full accent-[#E8743B] cursor-pointer"
              />
            </div>

            {/* Musik Senja */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs text-[#E8C5A5]">
                <span>Musik Latar Senja</span>
                <span className="font-mono font-bold text-[#F2B632]">{musicVolume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={musicVolume}
                onChange={(e) => setMusicVolume(Number(e.target.value))}
                className="w-full accent-[#C86D51] cursor-pointer"
              />
            </div>
          </div>

          {/* ─── 2. Kualitas Grafis & Bayangan ─── */}
          <div className="flex flex-col gap-3 bg-black/25 p-4 rounded-xl border border-[#8B5A2B]/40">
            <span className="font-display font-bold text-lg text-[#F2B632] flex items-center gap-1.5">
              <span>🎨</span> Kualitas Grafis
            </span>

            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'low', label: 'Ringan', desc: 'Hemat Baterai' },
                  { id: 'medium', label: 'Seimbang', desc: 'Standar 60 FPS' },
                  { id: 'high', label: 'Tinggi', desc: 'Detail Penuh' },
                ] as const
              ).map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setQuality(preset.id as QualityLevel)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-lg border-2 transition-all ${
                    quality === preset.id
                      ? 'bg-[#C86D51] text-[#2B1D14] border-[#F2B632] font-bold shadow-md scale-102'
                      : 'bg-[#2B1D14]/80 text-[#E8C5A5] border-[#8B5A2B]/50 hover:bg-[#3D2B1F]'
                  }`}
                >
                  <span className="text-xs font-display font-black uppercase">
                    {preset.label}
                  </span>
                  <span className="text-[10px] opacity-75">{preset.desc}</span>
                </button>
              ))}
            </div>

            <div className="text-[11px] text-[#E8C5A5]/80 mt-1 flex justify-between items-center">
              <span>Bayangan Dinamis (Shadows):</span>
              <span className={`font-bold ${shadows ? 'text-[#2ECC71]' : 'text-[#E74C3C]'}`}>
                {shadows ? 'Aktif' : 'Nonaktif'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Tombol Selesai */}
        <div className="p-4 bg-black/30 border-t border-[#8B5A2B]/30 flex justify-end">
          <button
            onClick={toggleSettings}
            className="btn-plang text-sm px-6 py-2 bg-gradient-to-r from-[#C86D51] to-[#F2B632] text-[#2B1D14] font-display font-black rounded-lg shadow-md hover:scale-105 active:scale-95 transition-transform"
          >
            Simpan & Kembali
          </button>
        </div>
      </div>
    </div>
  );
}
