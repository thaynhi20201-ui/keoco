// Web Audio API Synthesizer for Tug of War game sounds
class SoundManager {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // Tiếng còi khai cuộc "Tuuuu - Tuuu!"
  playWhistle() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(2600, now);
    osc.frequency.exponentialRampToValueAtTime(3200, now + 0.1);
    osc.frequency.setValueAtTime(3000, now + 0.2);

    // Modulator for whistle trill vibration
    const mod = this.ctx.createOscillator();
    const modGain = this.ctx.createGain();
    mod.frequency.setValueAtTime(35, now);
    modGain.gain.setValueAtTime(150, now);
    mod.connect(osc.frequency);
    mod.start(now);
    mod.stop(now + 0.5);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.05);
    gain.gain.setValueAtTime(0.3, now + 0.35);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.5);
  }

  // Tiếng kéo dây thừng "Hây da! / Boong"
  playPull(isSuper: boolean = false) {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = isSuper ? 'sawtooth' : 'triangle';
    osc.frequency.setValueAtTime(isSuper ? 180 : 120, now);
    osc.frequency.exponentialRampToValueAtTime(isSuper ? 380 : 220, now + (isSuper ? 0.25 : 0.18));

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (isSuper ? 0.35 : 0.22));

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + (isSuper ? 0.35 : 0.25));

    // Add low rumble bass punch
    if (isSuper) {
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(80, now);
      sub.frequency.exponentialRampToValueAtTime(40, now + 0.3);
      subGain.gain.setValueAtTime(0.4, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      sub.connect(subGain);
      subGain.connect(this.ctx.destination);
      sub.start(now);
      sub.stop(now + 0.3);
    }
  }

  // Tiếng trả lời đúng: Leng keng vui tai
  playCorrect() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = now + idx * 0.07;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.18, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });
  }

  // Tiếng trả lời sai: Tiếng buzz trầm
  playWrong() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.linearRampToValueAtTime(110, now + 0.25);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  // Đếm ngược tíc tắc
  playTick() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  // Nhạc kèn chiến thắng rộn ràng
  playVictory() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const fanfare = [
      { freq: 523.25, dur: 0.15 }, // C5
      { freq: 659.25, dur: 0.15 }, // E5
      { freq: 783.99, dur: 0.15 }, // G5
      { freq: 1046.5, dur: 0.4 },  // C6
      { freq: 783.99, dur: 0.15 }, // G5
      { freq: 1046.5, dur: 0.6 },  // C6
    ];

    let timeAcc = now;
    fanfare.forEach((item) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(item.freq, timeAcc);

      gain.gain.setValueAtTime(0, timeAcc);
      gain.gain.linearRampToValueAtTime(0.25, timeAcc + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, timeAcc + item.dur);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(timeAcc);
      osc.stop(timeAcc + item.dur);
      timeAcc += item.dur;
    });
  }
}

export const soundManager = new SoundManager();
