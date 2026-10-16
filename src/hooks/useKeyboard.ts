'use client';

import { useEffect } from 'react';

// Abstraksi input terpadu: keyboard + mouse
// Logika game hanya baca dari sini, bukan langsung dari event

export interface InputState {
  moveX: number;   // -1 kiri, 1 kanan
  moveY: number;   // -1 mundur, 1 maju
  sprint: boolean;
  jump: boolean;
  interact: boolean;   // E
  enterExit: boolean;  // F — naik/turun kendaraan
}

const state: InputState = {
  moveX: 0,
  moveY: 0,
  sprint: false,
  jump: false,
  interact: false,
  enterExit: false,
};

const keys = new Set<string>();

// Virtual touch inputs
let virtualMoveX = 0;
let virtualMoveY = 0;
let virtualSprint = false;
let virtualJump = false;

function updateState() {
  const hasD = keys.has('KeyD') || keys.has('ArrowRight') || keys.has('d') || keys.has('D');
  const hasA = keys.has('KeyA') || keys.has('ArrowLeft') || keys.has('a') || keys.has('A');
  const hasW = keys.has('KeyW') || keys.has('ArrowUp') || keys.has('w') || keys.has('W');
  const hasS = keys.has('KeyS') || keys.has('ArrowDown') || keys.has('s') || keys.has('S');

  const kbX = (hasD ? 1 : 0) - (hasA ? 1 : 0);
  const kbY = (hasW ? 1 : 0) - (hasS ? 1 : 0);

  // Jika keyboard aktif, beri prioritas, jika 0 gunakan virtual touch
  state.moveX = kbX !== 0 ? kbX : virtualMoveX;
  state.moveY = kbY !== 0 ? kbY : virtualMoveY;

  const kbSprint = keys.has('ShiftLeft') || keys.has('ShiftRight') || keys.has('Shift');
  state.sprint = kbSprint || virtualSprint;

  const kbJump = keys.has('Space') || keys.has(' ');
  state.jump = kbJump || virtualJump;
}

// Setters untuk Touch Controls Mobile
export function setVirtualMove(x: number, y: number) {
  virtualMoveX = x;
  virtualMoveY = y;
  updateState();
}

export function setVirtualSprint(active: boolean) {
  virtualSprint = active;
  updateState();
}

export function setVirtualJump(active: boolean) {
  virtualJump = active;
  updateState();
}

export function triggerVirtualInteract() {
  state.interact = true;
}

export function triggerVirtualEnterExit() {
  state.enterExit = true;
}

// Interact & enterExit diperlakukan sebagai one-shot (consumed setelah dibaca)
export function consumeInteract(): boolean {
  const v = state.interact;
  state.interact = false;
  return v;
}

export function consumeEnterExit(): boolean {
  const v = state.enterExit;
  state.enterExit = false;
  return v;
}

export function getInputState(): Readonly<InputState> {
  return state;
}

export function useKeyboard() {
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      // Abaikan jika user sedang mengetik di input/textarea
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }

      keys.add(e.code);
      keys.add(e.key);

      if (e.code === 'KeyE' || e.key === 'e' || e.key === 'E') state.interact = true;
      if (e.code === 'KeyF' || e.key === 'f' || e.key === 'F') state.enterExit = true;
      updateState();
    };

    const onUp = (e: KeyboardEvent) => {
      keys.delete(e.code);
      keys.delete(e.key);
      updateState();
    };

    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);

    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      keys.clear();
      state.moveX = 0;
      state.moveY = 0;
    };
  }, []);
}
