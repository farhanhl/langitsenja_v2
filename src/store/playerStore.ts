import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export type PlayerMode = 'walking' | 'driving';

export interface BuffState {
  type: 'sprint_boost' | 'hint' | 'sprint_and_hint' | null;
  multiplier: number; // sprint multiplier, default 1.0
  expiresAt: number; // timestamp ms
  hintText?: string;
}

interface PlayerState {
  // Posisi (ref di komponen, bukan sini — hanya untuk mini-map/UI)
  posX: number;
  posZ: number;
  // Mode
  mode: PlayerMode;
  currentVehicleId: string | null;
  // Uang
  money: number;
  // Buff aktif
  buff: BuffState;
  // Actions
  setPosition: (x: number, z: number) => void;
  setMode: (mode: PlayerMode, vehicleId?: string | null) => void;
  addMoney: (amount: number) => void;
  spendMoney: (amount: number) => boolean; // return false jika tidak cukup
  applyBuff: (type: BuffState['type'], duration: number, hint?: string) => void;
  clearBuff: () => void;
  checkBuff: () => void; // panggil tiap frame untuk expire buff
}

const DEFAULT_BUFF: BuffState = {
  type: null,
  multiplier: 1.0,
  expiresAt: 0,
};

export const usePlayerStore = create<PlayerState>()(
  subscribeWithSelector((set, get) => ({
    posX: 0,
    posZ: 0,
    mode: 'walking',
    currentVehicleId: null,
    money: 50000, // mulai dengan Rp 50.000

    buff: { ...DEFAULT_BUFF },

    setPosition: (x, z) => set({ posX: x, posZ: z }),

    setMode: (mode, vehicleId = null) =>
      set({ mode, currentVehicleId: vehicleId }),

    addMoney: (amount) =>
      set((s) => ({ money: s.money + amount })),

    spendMoney: (amount) => {
      const { money } = get();
      if (money < amount) return false;
      set({ money: money - amount });
      return true;
    },

    applyBuff: (type, duration, hint) => {
      let multiplier = 1.0;
      if (type === 'sprint_boost') multiplier = 1.25;
      if (type === 'sprint_and_hint') multiplier = 1.2;
      set({
        buff: {
          type,
          multiplier,
          expiresAt: Date.now() + duration * 1000,
          hintText: hint,
        },
      });
    },

    clearBuff: () => set({ buff: { ...DEFAULT_BUFF } }),

    checkBuff: () => {
      const { buff } = get();
      if (buff.type && Date.now() > buff.expiresAt) {
        set({ buff: { ...DEFAULT_BUFF } });
      }
    },
  }))
);
