import { create } from 'zustand';

export interface PromptTarget {
  id: string;
  label: string; // mis. "E — Bicara dengan Ariman"
  type: 'npc' | 'vendor' | 'vehicle' | 'action';
}

export interface ActiveDialog {
  speakerId: string;
  script: Array<{ speaker: string; text: string }>;
  lineIndex: number;
}

interface UiState {
  // Prompt interaksi di dekat objek
  activePrompt: PromptTarget | null;
  // Dialog modal aktif
  dialog: ActiveDialog | null;
  // VendorShop aktif
  vendorShopId: string | null;
  // Panel yang terbuka
  missionPanelOpen: boolean;
  settingsOpen: boolean;
  // Actions
  setPrompt: (target: PromptTarget | null) => void;
  openDialog: (speakerId: string, script: ActiveDialog['script']) => void;
  advanceDialog: () => void;
  closeDialog: () => void;
  openVendorShop: (id: string) => void;
  closeVendorShop: () => void;
  toggleMissionPanel: () => void;
  toggleSettings: () => void;
}

export const useUiStore = create<UiState>()((set, get) => ({
  activePrompt: null,
  dialog: null,
  vendorShopId: null,
  missionPanelOpen: false,
  settingsOpen: false,

  setPrompt: (target) => set({ activePrompt: target }),

  openDialog: (speakerId, script) =>
    set({ dialog: { speakerId, script, lineIndex: 0 } }),

  advanceDialog: () => {
    const { dialog } = get();
    if (!dialog) return;
    const next = dialog.lineIndex + 1;
    if (next >= dialog.script.length) {
      set({ dialog: null });
    } else {
      set({ dialog: { ...dialog, lineIndex: next } });
    }
  },

  closeDialog: () => set({ dialog: null }),

  openVendorShop: (id) => set({ vendorShopId: id }),
  closeVendorShop: () => set({ vendorShopId: null }),

  toggleMissionPanel: () =>
    set((s) => ({ missionPanelOpen: !s.missionPanelOpen })),

  toggleSettings: () =>
    set((s) => ({ settingsOpen: !s.settingsOpen })),
}));
