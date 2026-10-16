import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { MISSIONS, type Mission } from '@/game/missions';
import { GAME } from '@/game/constants';

interface GameState {
  // Status
  phase: 'menu' | 'playing' | 'paused' | 'won' | 'lost';
  // Timer
  timeLeft: number; // detik
  // Misi
  missions: Mission[];
  friendsFound: number;
  // Actions
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  tickTimer: (delta: number) => void;
  foundFriend: (id: string) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>()(
  subscribeWithSelector((set, get) => ({
    phase: 'menu',
    timeLeft: GAME.MISSION_TIME,
    missions: MISSIONS.map((m) => ({ ...m })),
    friendsFound: 0,

    startGame: () =>
      set({
        phase: 'playing',
        timeLeft: GAME.MISSION_TIME,
        missions: MISSIONS.map((m) => ({ ...m, found: false })),
        friendsFound: 0,
      }),

    pauseGame: () => {
      if (get().phase === 'playing') set({ phase: 'paused' });
    },

    resumeGame: () => {
      if (get().phase === 'paused') set({ phase: 'playing' });
    },

    tickTimer: (delta: number) => {
      const { phase, timeLeft } = get();
      if (phase !== 'playing') return;
      const next = timeLeft - delta;
      if (next <= 0) {
        set({ timeLeft: 0, phase: 'lost' });
      } else {
        set({ timeLeft: next });
      }
    },

    foundFriend: (id: string) => {
      const { missions } = get();
      const updated = missions.map((m) =>
        m.id === id ? { ...m, found: true } : m
      );
      const count = updated.filter((m) => m.found).length;
      set({ missions: updated, friendsFound: count });
      if (count >= GAME.FRIENDS_NEEDED) {
        set({ phase: 'won' });
      }
    },

    resetGame: () =>
      set({
        phase: 'menu',
        timeLeft: GAME.MISSION_TIME,
        missions: MISSIONS.map((m) => ({ ...m, found: false })),
        friendsFound: 0,
      }),
  }))
);
