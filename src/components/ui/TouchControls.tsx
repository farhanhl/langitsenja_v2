'use client';

import { useState, useRef, useCallback, useSyncExternalStore } from 'react';
import {
  setVirtualMove,
  setVirtualSprint,
  setVirtualJump,
  triggerVirtualInteract,
  triggerVirtualEnterExit,
} from '@/hooks/useKeyboard';
import { useUiStore } from '@/store/uiStore';
import { usePlayerStore } from '@/store/playerStore';

function subscribeTouch(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('resize', callback);
  return () => window.removeEventListener('resize', callback);
}

function getTouchSnapshot(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia('(pointer: coarse)').matches
  );
}

function getTouchServerSnapshot(): boolean {
  return false;
}

export default function TouchControls() {
  const isTouchDevice = useSyncExternalStore(subscribeTouch, getTouchSnapshot, getTouchServerSnapshot);
  const [forceShow, setForceShow] = useState(false);
  const [isSprinting, setIsSprinting] = useState(false);

  const activePrompt = useUiStore((s) => s.activePrompt);
  const isDriving = usePlayerStore((s) => s.mode === 'driving');

  // Joystick touch tracking
  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const joystickKnobRef = useRef<HTMLDivElement>(null);
  const touchIdRef = useRef<number | null>(null);
  const basePosRef = useRef({ x: 0, y: 0, radius: 45 });

  // Joystick touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (touchIdRef.current !== null) return;
    const touch = e.changedTouches[0];
    touchIdRef.current = touch.identifier;

    if (joystickBaseRef.current) {
      const rect = joystickBaseRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      basePosRef.current = { x: centerX, y: centerY, radius: rect.width / 2 };
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (touchIdRef.current === null) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === touchIdRef.current) {
        const dx = touch.clientX - basePosRef.current.x;
        const dy = touch.clientY - basePosRef.current.y;
        const maxR = basePosRef.current.radius;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const clampedDist = Math.min(dist, maxR);
        const angle = Math.atan2(dy, dx);

        const knobX = Math.cos(angle) * clampedDist;
        const knobY = Math.sin(angle) * clampedDist;

        if (joystickKnobRef.current) {
          joystickKnobRef.current.style.transform = `translate(${knobX}px, ${knobY}px)`;
        }

        // Normalisasi: -1 s.d. 1
        const normX = knobX / maxR;
        const normY = -knobY / maxR; // Y maju adalah positif
        setVirtualMove(normX, normY);
        break;
      }
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchIdRef.current === null) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchIdRef.current) {
        touchIdRef.current = null;
        if (joystickKnobRef.current) {
          joystickKnobRef.current.style.transform = `translate(0px, 0px)`;
        }
        setVirtualMove(0, 0);
        break;
      }
    }
  }, []);

  const toggleSprint = () => {
    const next = !isSprinting;
    setIsSprinting(next);
    setVirtualSprint(next);
  };

  const handleJumpPress = () => {
    setVirtualJump(true);
    setTimeout(() => setVirtualJump(false), 200);
  };

  if (!isTouchDevice && !forceShow) {
    return (
      <div className="fixed bottom-3 left-3 z-40">
        <button
          onClick={() => setForceShow(true)}
          className="text-[11px] font-body bg-black/40 hover:bg-black/60 text-[#E8C5A5] px-2 py-1 rounded backdrop-blur border border-[#C86D51]/30 transition-all opacity-40 hover:opacity-100"
          title="Tampilkan kontrol layar sentuh untuk simulasi HP"
        >
          📱 Kontrol Sentuh
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-40 select-none overflow-hidden">
      {/* Tombol sembunyikan toggle force */}
      {forceShow && !isTouchDevice && (
        <div className="absolute top-16 left-3 pointer-events-auto">
          <button
            onClick={() => setForceShow(false)}
            className="text-[11px] font-body bg-black/60 text-[#E8C5A5] px-2 py-1 rounded border border-[#C86D51]/40"
          >
            ✕ Tutup Kontrol Sentuh
          </button>
        </div>
      )}

      {/* ─── Virtual Analog Joystick (Kiri Bawah) ─── */}
      <div className="absolute bottom-6 left-6 pointer-events-auto">
        <div
          ref={joystickBaseRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          className="w-28 h-28 rounded-full bg-black/40 border-2 border-[#E8C5A5]/30 backdrop-blur-sm flex items-center justify-center relative touch-none shadow-lg active:border-[#F2B632]/60"
        >
          {/* Thumb Knob */}
          <div
            ref={joystickKnobRef}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E8C5A5] to-[#C86D51] border-2 border-[#2B1D14] shadow-md transition-transform duration-75 flex items-center justify-center pointer-events-none"
          >
            <div className="w-3 h-3 rounded-full bg-[#2B1D14]/40" />
          </div>
        </div>
      </div>

      {/* ─── Tombol Aksi (Kanan Bawah) ─── */}
      <div className="absolute bottom-6 right-6 pointer-events-auto flex flex-col items-end gap-3">
        {/* Baris Atas: Tombol Kontekstual Interaksi (E) & Kendaraan (F) */}
        <div className="flex items-center gap-3">
          {/* Tombol Masuk / Keluar Kendaraan (F) */}
          {(isDriving || activePrompt?.type === 'vehicle') && (
            <button
              onClick={triggerVirtualEnterExit}
              className={`w-14 h-14 rounded-full flex flex-col items-center justify-center shadow-lg border-2 active:scale-95 transition-transform ${
                isDriving
                  ? 'bg-[#B23B2B] text-white border-white/60 ring-2 ring-[#B23B2B]/60 animate-pulse'
                  : 'bg-[#C86D51] text-[#2B1D14] border-[#F2B632]'
              }`}
            >
              <span className="font-display font-black text-sm leading-none">
                {isDriving ? 'TURUN' : 'NAIK'}
              </span>
              <span className="text-[10px] font-body font-bold">[F]</span>
            </button>
          )}

          {/* Tombol Interaksi (E) */}
          <button
            onClick={triggerVirtualInteract}
            className={`w-14 h-14 rounded-full flex flex-col items-center justify-center shadow-lg border-2 active:scale-95 transition-all ${
              activePrompt
                ? 'bg-[#F2B632] text-[#2B1D14] border-white ring-4 ring-[#F2B632]/50 scale-105 animate-bounce'
                : 'bg-black/40 text-white/70 border-white/20'
            }`}
          >
            <span className="font-display font-black text-sm leading-none">
              {activePrompt?.type === 'vendor' ? 'BELI' : 'BICARA'}
            </span>
            <span className="text-[10px] font-body font-bold">[E]</span>
          </button>
        </div>

        {/* Baris Bawah: Tombol Gerak (Sprint & Jump) */}
        <div className="flex items-center gap-3">
          {/* Tombol Sprint (Lari) */}
          <button
            onClick={toggleSprint}
            className={`w-13 h-13 rounded-full flex flex-col items-center justify-center shadow-lg border-2 active:scale-95 transition-all ${
              isSprinting
                ? 'bg-[#E8C5A5] text-[#2B1D14] border-[#F2B632] ring-2 ring-[#F2B632]/60'
                : 'bg-black/40 text-white/80 border-white/20'
            }`}
          >
            <span className="font-display font-bold text-xs leading-none">
              {isSprinting ? 'LARI ON' : 'LARI'}
            </span>
            <span className="text-[9px] font-body opacity-75">⚡</span>
          </button>

          {/* Tombol Jump (Lompat) */}
          <button
            onClick={handleJumpPress}
            className="w-16 h-16 rounded-full bg-gradient-to-t from-[#C86D51] to-[#E8C5A5] text-[#2B1D14] border-2 border-white/80 shadow-xl flex flex-col items-center justify-center active:scale-95 transition-transform"
          >
            <span className="font-display font-black text-base leading-none">LOMPAT</span>
            <span className="text-[10px] font-body font-bold opacity-80">SPASI</span>
          </button>
        </div>
      </div>
    </div>
  );
}
