'use client';

import { create } from 'zustand';
import { spatialSound } from '@/game/spatialAudio';

export type QualityLevel = 'low' | 'medium' | 'high';

interface SettingsState {
  // Audio
  masterVolume: number; // 0 - 100
  musicVolume: number;  // 0 - 100
  sfxVolume: number;    // 0 - 100
  isMuted: boolean;

  // Grafis
  quality: QualityLevel;
  shadows: boolean;

  // Setters
  setMasterVolume: (val: number) => void;
  setMusicVolume: (val: number) => void;
  setSfxVolume: (val: number) => void;
  toggleMute: () => void;
  setQuality: (level: QualityLevel) => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  masterVolume: 80,
  musicVolume: 70,
  sfxVolume: 85,
  isMuted: false,
  quality: 'medium',
  shadows: true,

  setMasterVolume: (val) => {
    set({ masterVolume: val });
    const { isMuted, sfxVolume } = get();
    const effectiveSfx = isMuted ? 0 : (val / 100) * (sfxVolume / 100);
    spatialSound.setMasterVolume(effectiveSfx);
  },

  setMusicVolume: (val) => {
    set({ musicVolume: val });
  },

  setSfxVolume: (val) => {
    set({ sfxVolume: val });
    const { isMuted, masterVolume } = get();
    const effectiveSfx = isMuted ? 0 : (masterVolume / 100) * (val / 100);
    spatialSound.setMasterVolume(effectiveSfx);
  },

  toggleMute: () => {
    const nextMuted = !get().isMuted;
    set({ isMuted: nextMuted });
    spatialSound.setMuted(nextMuted);
  },

  setQuality: (level) => {
    set({
      quality: level,
      shadows: level !== 'low',
    });
  },
}));
