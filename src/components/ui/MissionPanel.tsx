'use client';

import { useGameStore } from '@/store/gameStore';
import { useUiStore } from '@/store/uiStore';

export default function MissionPanel() {
  const isOpen = useUiStore((s) => s.missionPanelOpen);
  const toggleMissionPanel = useUiStore((s) => s.toggleMissionPanel);
  const missions = useGameStore((s) => s.missions);
  const friendsFound = useGameStore((s) => s.friendsFound);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm pointer-events-auto">
      <div className="w-full max-w-md bg-[#F5E9D3] border-4 border-[#2B1D14] rounded-lg shadow-[8px_8px_0px_#2B1D14] p-5 flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#2B1D14]/20 pb-3">
          <div>
            <h2 className="font-display font-black text-2xl text-[#2B1D14] leading-tight">
              Misi: Temukan 5 Teman
            </h2>
            <p className="font-body text-xs text-[#2B1D14]/70">
              Temukan sebelum senja berganti malam! ({friendsFound}/5 ketemu)
            </p>
          </div>
          <button
            onClick={toggleMissionPanel}
            className="text-[#2B1D14] hover:bg-[#2B1D14]/10 rounded-md w-8 h-8 font-bold text-lg flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Daftar Teman */}
        <div className="flex flex-col gap-2.5">
          {missions.map((m) => (
            <div
              key={m.id}
              className={`p-3 rounded border-2 flex items-start justify-between gap-3 transition-colors ${m.found
                  ? 'bg-[#E8F8F0] border-[#2ECC71]'
                  : 'bg-white border-[#2B1D14]/30 hover:border-[#E8743B]'
                }`}
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-display font-black text-lg text-[#2B1D14]">
                    {m.name}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#E8743B]/15 text-[#A23B2A] border border-[#E8743B]/40 font-body">
                    {m.location}
                  </span>
                </div>
                <p className="font-body text-xs text-[#2B1D14]/80">
                  {m.locationDesc}
                </p>
              </div>

              <div className="pt-1">
                {m.found ? (
                  <span className="px-2 py-1 rounded bg-[#2ECC71] text-white text-xs font-black font-display shadow-sm">
                    KETEMU ✓
                  </span>
                ) : (
                  <span className="px-2 py-1 rounded bg-[#2B1D14]/10 text-[#2B1D14]/70 text-xs font-bold font-body">
                    Belum
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Tombol Tutup */}
        <div className="pt-2 border-t-2 border-[#2B1D14]/15 flex justify-end font-black">
          <button
            onClick={toggleMissionPanel}
            className="btn-plang text-xs sm:text-sm px-5 py-2 cursor-pointer shadow-[2px_2px_0px_#2B1D14]"
          >
            Kembali Main
          </button>
        </div>
      </div>
    </div>
  );
}
