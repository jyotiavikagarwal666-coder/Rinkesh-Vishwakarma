/**
 * Procedural Web Audio API sound synthesizer
 * Zero external audio files or 404 errors.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private bgmGain: GainNode | null = null;
  private isBgmPlaying = false;
  private bgmTimer: number | null = null;
  private isMuted = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.bgmGain) {
      this.bgmGain.gain.setTargetAtTime(muted ? 0 : 0.15, this.ctx?.currentTime || 0, 0.1);
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsBgmPlaying(): boolean {
    return this.isBgmPlaying;
  }

  /**
   * Delicate glass chime / celestial bell note
   */
  public playChime(freq = 880, duration = 0.8, type: OscillatorType = 'sine') {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      // Delicate natural bell envelope
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.2, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.1);
    } catch {
      // Audio context might fail in non-interactive environment
    }
  }

  /**
   * Sweet romantic chord shimmer
   */
  public playRomanticChord() {
    if (this.isMuted) return;
    // Fmaj9 chord: F4, A4, C5, E5, G5
    const freqs = [349.23, 440.0, 523.25, 659.25, 783.99];
    freqs.forEach((freq, idx) => {
      setTimeout(() => {
        this.playChime(freq, 1.4, 'triangle');
      }, idx * 70);
    });
  }

  /**
   * Heart pop / sparkle sound effect
   */
  public playHeartClick() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch {}
  }

  /**
   * Warm romantic heartbeat sound (lub-dub)
   */
  public playHeartbeat() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const playPulse = (t: number, freq: number) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.exponentialRampToValueAtTime(45, t + 0.15);
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.2);
      };

      playPulse(now, 85);
      playPulse(now + 0.2, 70);
    } catch {}
  }

  /**
   * Candle blow sound (soft filtered breath / whoosh)
   */
  public playCandleBlow() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const bufferSize = this.ctx.sampleRate * 0.9;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Pink/soft noise
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        data[i] = (b0 + b1 + b2) * 0.15;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.9);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.35, this.ctx.currentTime + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.9);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
    } catch {}
  }

  /**
   * Confetti celebration pop
   */
  public playConfettiPop() {
    if (this.isMuted) return;
    this.playChime(1046.5, 0.4, 'sine');
    setTimeout(() => this.playChime(1318.51, 0.5, 'sine'), 60);
    setTimeout(() => this.playChime(1567.98, 0.6, 'sine'), 120);
  }

  /**
   * Rising sparkle chime when charging love meter
   */
  public playSparkleCharge(progress: number) {
    if (this.isMuted) return;
    const baseFreq = 440;
    const freq = baseFreq + progress * 500;
    this.playChime(freq, 0.15, 'triangle');
  }

  /**
   * Magical shooting star wish sound
   */
  public playWishStar() {
    if (this.isMuted) return;
    const freqs = [659.25, 783.99, 987.77, 1318.51, 1567.98];
    freqs.forEach((f, idx) => {
      setTimeout(() => {
        this.playChime(f, 0.4, 'sine');
      }, idx * 60);
    });
  }

  /**
   * Happy Birthday melody sequence on marimba / chime
   */
  public playHappyBirthdayMelody() {
    if (this.isMuted) return;
    // C4, C4, D4, C4, F4, E4 | C4, C4, D4, C4, G4, F4
    const notes = [
      { f: 261.63, d: 250 },
      { f: 261.63, d: 250 },
      { f: 293.66, d: 450 },
      { f: 261.63, d: 450 },
      { f: 349.23, d: 450 },
      { f: 329.63, d: 800 },
      // part 2
      { f: 261.63, d: 250 },
      { f: 261.63, d: 250 },
      { f: 293.66, d: 450 },
      { f: 261.63, d: 450 },
      { f: 392.00, d: 450 },
      { f: 349.23, d: 900 },
    ];

    let delay = 0;
    notes.forEach((item) => {
      setTimeout(() => {
        this.playChime(item.f, item.d / 1000, 'triangle');
      }, delay);
      delay += item.d + 60;
    });
  }

  /**
   * Ambient romantic background arpeggiator
   * Soft, peaceful, looping music
   */
  public toggleAmbientBGM(): boolean {
    if (this.isBgmPlaying) {
      this.stopAmbientBGM();
      return false;
    } else {
      this.startAmbientBGM();
      return true;
    }
  }

  public startAmbientBGM() {
    this.initCtx();
    if (!this.ctx) return;
    this.isBgmPlaying = true;

    // Peaceful arpeggio sequence in A minor / C major:
    // C - E - G - B - A - C - E - G
    const scale = [261.63, 329.63, 392.0, 493.88, 440.0, 523.25, 659.25, 783.99];
    let noteIdx = 0;

    const playLoop = () => {
      if (!this.isBgmPlaying) return;
      const freq = scale[noteIdx % scale.length];
      if (!this.isMuted) {
        this.playChime(freq, 1.2, 'sine');
      }
      noteIdx++;
      // Every 8 notes, add soft warm bass note
      if (noteIdx % 4 === 0 && !this.isMuted) {
        this.playChime(130.81, 2.0, 'triangle');
      }
      this.bgmTimer = window.setTimeout(playLoop, 450);
    };

    playLoop();
  }

  public stopAmbientBGM() {
    this.isBgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}

export const sound = new SoundEngine();
