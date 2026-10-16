// Web Audio API procedural sound synthesizer untuk audio spasial pedagang keliling
// Tanpa dependensi file eksternal — 100% sintetis, ringan, dan andal di browser

class SpatialSoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterVolume: number = 1.0;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public setMasterVolume(vol: number) {
    this.masterVolume = Math.max(0, Math.min(1, vol));
  }

  /**
   * Mainkan suara spasial berdasarkan jarak (3D distance)
   * @param soundType 'kentongan' | 'bel-eskrim' | 'klakson-siomay' | 'kipas-sate'
   * @param dist Jarak ke pemain dalam unit Three.js
   * @param maxDist Jarak maksimum suara terdengar (default 30m)
   */
  public playVendorCue(
    soundType: string,
    dist: number,
    maxDist: number = 30
  ) {
    if (this.isMuted || dist > maxDist) return;

    const ctx = this.getContext();
    if (!ctx) return;

    // Attenuation volume linear-exponential berdasarkan jarak & master volume
    const normalized = Math.max(0, 1 - dist / maxDist);
    const volume = Math.min(0.8, Math.pow(normalized, 1.8) * 0.7) * this.masterVolume;
    if (volume <= 0.005) return;

    const now = ctx.currentTime;

    switch (soundType) {
      case 'kentongan':
        // Suara khas "ting.. ting.. ting.." mangkok bakso dipukul sendok
        this.playBaksoTing(ctx, now, volume);
        break;

      case 'bel-eskrim':
        // Melodi jingle sederhana ceria es krim keliling
        this.playIceCreamJingle(ctx, now, volume);
        break;

      case 'klakson-siomay':
        // Suara terompet pencet siomay / ontel "toet.. toet.."
        this.playSiomayHorn(ctx, now, volume);
        break;

      case 'kipas-sate':
        // Suara desir kipasan arang sate hangat
        this.playSateSizzle(ctx, now, volume);
        break;

      default:
        break;
    }
  }

  // Efek denting mangkok kaca bakso: frekuensi tinggi jernih dengan resonansi bell
  private playBaksoTing(ctx: AudioContext, startTime: number, volume: number) {
    const tones = [2400, 2400, 2400]; // 3 ketukan ting.. ting.. ting..
    tones.forEach((freq, idx) => {
      const hitTime = startTime + idx * 0.28;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, hitTime);
      // Sedikit micro-drop pitch khas kaca dipukul
      osc.frequency.exponentialRampToValueAtTime(freq * 0.98, hitTime + 0.15);

      gain.gain.setValueAtTime(0, hitTime);
      gain.gain.linearRampToValueAtTime(volume * 0.9, hitTime + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, hitTime + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(hitTime);
      osc.stop(hitTime + 0.25);
    });
  }

  // Melodi bel es krim keliling (nada pentatonik C-E-G-A-G ceria)
  private playIceCreamJingle(ctx: AudioContext, startTime: number, volume: number) {
    const notes = [523.25, 659.25, 783.99, 880.0, 783.99]; // C5, E5, G5, A5, G5
    notes.forEach((freq, idx) => {
      const noteTime = startTime + idx * 0.22;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle'; // Suara bel meling hangat
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0, noteTime);
      gain.gain.linearRampToValueAtTime(volume * 0.7, noteTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.3);
    });
  }

  // Suara terompet bebek/pencet karet siomay keliling: "toet.. toet.."
  private playSiomayHorn(ctx: AudioContext, startTime: number, volume: number) {
    [0, 0.32].forEach((offset) => {
      const hitTime = startTime + offset;
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, hitTime);
      osc.frequency.linearRampToValueAtTime(380, hitTime + 0.08);
      osc.frequency.linearRampToValueAtTime(330, hitTime + 0.2);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, hitTime);
      filter.Q.setValueAtTime(3, hitTime);

      gain.gain.setValueAtTime(0, hitTime);
      gain.gain.linearRampToValueAtTime(volume * 0.8, hitTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, hitTime + 0.22);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(hitTime);
      osc.stop(hitTime + 0.25);
    });
  }

  // Desir arang sate dan kepasan angin
  private playSateSizzle(ctx: AudioContext, startTime: number, volume: number) {
    // Buffer noise putih untuk desis arang
    const bufferSize = ctx.sampleRate * 0.4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(3500, startTime);
    filter.Q.setValueAtTime(2.0, startTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume * 0.5, startTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.38);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(startTime);
    noise.stop(startTime + 0.4);
  }
}

export const spatialSound = new SpatialSoundManager();
