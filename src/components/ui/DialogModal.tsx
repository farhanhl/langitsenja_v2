'use client';

import { useEffect } from 'react';
import { useUiStore } from '@/store/uiStore';

export default function DialogModal() {
  const dialog = useUiStore((s) => s.dialog);
  const advanceDialog = useUiStore((s) => s.advanceDialog);
  const closeDialog = useUiStore((s) => s.closeDialog);

  // Keyboard shortcut: Space, Enter, or E to advance, Escape to close
  useEffect(() => {
    if (!dialog) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter' || e.code === 'KeyE') {
        e.preventDefault();
        e.stopPropagation();
        advanceDialog();
      } else if (e.code === 'Escape') {
        closeDialog();
      }
    };

    window.addEventListener('keydown', onKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', onKeyDown, { capture: true });
  }, [dialog, advanceDialog, closeDialog]);

  if (!dialog) return null;

  const currentLine = dialog.script[dialog.lineIndex];
  if (!currentLine) return null;

  const isLastLine = dialog.lineIndex === dialog.script.length - 1;
  const isPlayer = currentLine.speaker === 'Kamu';

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pb-8 sm:pb-12 px-4 pointer-events-auto bg-black/35 backdrop-blur-[1px]">
      <div
        className="w-full max-w-xl bg-[#F5E9D3] border-4 border-[#2B1D14] rounded-lg shadow-[6px_6px_0px_#2B1D14] p-5 flex flex-col gap-3 transform transition-all animate-float-title"
        style={{ animationDuration: '0.2s' }}
      >
        {/* Header Dialog: Nama Pembicara & Tombol Tutup */}
        <div className="flex items-center justify-between border-b-2 border-[#2B1D14]/20 pb-2">
          <div className="flex items-center gap-2">
            <span
              className={`font-display font-black text-xl tracking-wide px-3 py-0.5 rounded text-white shadow-sm ${
                isPlayer ? 'bg-[#2980B9]' : 'bg-[#E8743B]'
              }`}
            >
              {currentLine.speaker}
            </span>
            <span className="text-xs font-bold text-[#2B1D14]/60 uppercase tracking-wider font-body">
              {dialog.lineIndex + 1} / {dialog.script.length}
            </span>
          </div>

          <button
            onClick={closeDialog}
            className="text-[#2B1D14]/60 hover:text-[#2B1D14] font-black text-lg w-7 h-7 flex items-center justify-center rounded hover:bg-[#2B1D14]/10 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Isi Percakapan */}
        <p className="font-body text-[#2B1D14] text-base sm:text-lg leading-relaxed min-h-[50px] font-semibold">
          &ldquo;{currentLine.text}&rdquo;
        </p>

        {/* Footer Tombol Lanjut */}
        <div className="flex items-center justify-between pt-2 border-t-2 border-[#2B1D14]/10">
          <span className="text-[11px] text-[#2B1D14]/50 font-body">
            Tekan <kbd className="px-1.5 py-0.5 bg-black/10 rounded font-mono text-[10px]">Spasi</kbd> atau klik tombol
          </span>

          <button
            onClick={advanceDialog}
            className="btn-plang text-xs sm:text-sm px-4 py-1.5 cursor-pointer shadow-[2px_2px_0px_#2B1D14]"
          >
            {isLastLine ? 'Selesai ✓' : 'Lanjut →'}
          </button>
        </div>
      </div>
    </div>
  );
}
