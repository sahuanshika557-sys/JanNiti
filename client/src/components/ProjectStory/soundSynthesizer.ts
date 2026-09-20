/**
 * Web Audio API Procedural Sound Synthesizer for JanNiti AI Cinematic Film
 * Zero external audio files required — generates rich ambient audio, rain, 
 * digital data pulses, warm cinematic pads, and whoosh transitions in real-time.
 */

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private rainGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private rainNode: AudioNode | null = null;
  private ambientOsc1: OscillatorNode | null = null;
  private ambientOsc2: OscillatorNode | null = null;

  public init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.ctx && this.ctx.state === 'suspended' && !muted) {
      this.ctx.resume();
    }
    if (this.rainGain) {
      this.rainGain.gain.setValueAtTime(muted ? 0 : 0.08, this.ctx?.currentTime || 0);
    }
    if (this.ambientGain) {
      this.ambientGain.gain.setValueAtTime(muted ? 0 : 0.05, this.ctx?.currentTime || 0);
    }
  }

  public startAmbience() {
    if (this.isMuted || !this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      // Dual warm meditative drone (D3 + A3 harmonic pad)
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(146.83, this.ctx.currentTime); // D3

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(220.00, this.ctx.currentTime); // A3

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(380, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start();
      osc2.start();
      this.ambientOsc1 = osc1;
      this.ambientOsc2 = osc2;
      this.ambientGain = gain;
    } catch (e) {
      console.warn('Ambient audio init skipped', e);
    }
  }

  public startRain() {
    if (this.isMuted || !this.ctx || this.rainNode) return;
    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1; // White noise
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(750, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.07, this.ctx.currentTime);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
      this.rainNode = noise;
      this.rainGain = gain;
    } catch (e) {
      console.warn('Rain audio init skipped', e);
    }
  }

  public stopRain() {
    if (this.rainNode) {
      try {
        (this.rainNode as AudioBufferSourceNode).stop();
        this.rainNode.disconnect();
      } catch (e) {}
      this.rainNode = null;
    }
  }

  public playWhoosh() {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(720, this.ctx.currentTime + 0.4);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.4);
    } catch (e) {}
  }

  public playChime() {
    if (this.isMuted || !this.ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.07);

        gain.gain.setValueAtTime(0.045, this.ctx.currentTime + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.07 + 0.7);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + idx * 0.07);
        osc.stop(this.ctx.currentTime + idx * 0.07 + 0.7);
      });
    } catch (e) {}
  }

  public playDataPulse() {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(920, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(460, this.ctx.currentTime + 0.16);

      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.16);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.16);
    } catch (e) {}
  }

  public playMicClick() {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.07, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {}
  }

  public playSuccessChord() {
    if (this.isMuted || !this.ctx) return;
    try {
      const chord = [261.63, 329.63, 392.00, 523.25, 659.25]; // C Major 9 chord
      chord.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.045, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 1.6);
      });
    } catch (e) {}
  }

  public stopAll() {
    this.stopRain();
    if (this.ambientOsc1) {
      try {
        this.ambientOsc1.stop();
        this.ambientOsc1.disconnect();
      } catch (e) {}
      this.ambientOsc1 = null;
    }
    if (this.ambientOsc2) {
      try {
        this.ambientOsc2.stop();
        this.ambientOsc2.disconnect();
      } catch (e) {}
      this.ambientOsc2 = null;
    }
  }
}

export const soundSynthesizer = new SoundSynthesizer();
