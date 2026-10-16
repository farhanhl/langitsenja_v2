'use client';

import { useEffect, useRef, useCallback } from 'react';
import { getInputState } from './useKeyboard';

// Joystick sentuh untuk mobile
// Mengisi moveX/moveY di InputState yang sama dengan keyboard

interface JoystickState {
  active: boolean;
  originX: number;
  originY: number;
  currentX: number;
  currentY: number;
  touchId: number | null;
}

const JOYSTICK_RADIUS = 50; // px

export function useTouchInput(
  joystickRef: React.RefObject<HTMLElement | null>
) {
  const joyState = useRef<JoystickState>({
    active: false,
    originX: 0,
    originY: 0,
    currentX: 0,
    currentY: 0,
    touchId: null,
  });

  const computeAxis = useCallback(() => {
    const j = joyState.current;
    if (!j.active) {
      // Tulis ke shared inputState (jika tidak ada keyboard override)
      const inp = getInputState() as { moveX: number; moveY: number };
      inp.moveX = 0;
      inp.moveY = 0;
      return;
    }
    const dx = j.currentX - j.originX;
    const dy = j.currentY - j.originY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const norm = Math.min(dist / JOYSTICK_RADIUS, 1);
    const angle = Math.atan2(dy, dx);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- shared mutable state
    const inp = getInputState() as any;
    inp.moveX = Math.cos(angle) * norm;
    inp.moveY = -Math.sin(angle) * norm; // Y dibalik: atas = maju
  }, []);

  useEffect(() => {
    const el = joystickRef.current;
    if (!el) return;

    const onStart = (e: TouchEvent) => {
      e.preventDefault();
      const t = e.changedTouches[0];
      const rect = el.getBoundingClientRect();
      joyState.current = {
        active: true,
        originX: t.clientX - rect.left,
        originY: t.clientY - rect.top,
        currentX: t.clientX - rect.left,
        currentY: t.clientY - rect.top,
        touchId: t.identifier,
      };
      computeAxis();
    };

    const onMove = (e: TouchEvent) => {
      e.preventDefault();
      const j = joyState.current;
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (t.identifier === j.touchId) {
          const rect = el.getBoundingClientRect();
          j.currentX = t.clientX - rect.left;
          j.currentY = t.clientY - rect.top;
          computeAxis();
        }
      }
    };

    const onEnd = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === joyState.current.touchId) {
          joyState.current.active = false;
          computeAxis();
        }
      }
    };

    el.addEventListener('touchstart', onStart, { passive: false });
    el.addEventListener('touchmove', onMove, { passive: false });
    el.addEventListener('touchend', onEnd);
    el.addEventListener('touchcancel', onEnd);

    return () => {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchmove', onMove);
      el.removeEventListener('touchend', onEnd);
      el.removeEventListener('touchcancel', onEnd);
    };
  }, [joystickRef, computeAxis]);

  const getJoyState = useCallback(() => joyState.current, []);

  return { getJoyState };
}
