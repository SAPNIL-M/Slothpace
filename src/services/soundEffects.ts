// Zero-dependency Web Audio API Sound Generator for Offline Zen Focus

class SoundManager {
  private ctx: AudioContext | null = null;
  private noiseNode: AudioNode | null = null;
  private isAmbiencePlaying: boolean = false;
  private currentAmbienceType: 'rain' | 'brown' | 'none' = 'none';

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a gentle, rewarding micro-accomplishment chime (pentatonic scale)
  playChime(pitch: 'high' | 'mid' | 'low' = 'mid') {
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const baseFreq = pitch === 'high' ? 880 : pitch === 'mid' ? 587.33 : 440; // A5, D5, A4

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, this.ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.45);
    } catch {
      // Audio might be blocked until user interaction
    }
  }

  // Play a resonant Tibetan bell / bowl gong for session transitions
  playBowl() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const freqs = [216, 432, 648]; // Calming harmonics
      freqs.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        const volume = 0.08 / (i + 1);
        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 2.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 2.6);
      });
    } catch {
      // Ignore
    }
  }

  // Generate soothing procedural forest rain / pink noise entirely in memory
  toggleAmbience(type: 'rain' | 'brown'): boolean {
    try {
      this.initContext();
      if (!this.ctx) return false;

      if (this.isAmbiencePlaying && this.currentAmbienceType === type) {
        this.stopAmbience();
        return false;
      }

      this.stopAmbience();

      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (type === 'brown') {
          // Brown noise (deep rumble)
          data[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = data[i];
          data[i] *= 3.5;
        } else {
          // Gentle Rain (filtered pink noise)
          data[i] = (lastOut + 0.05 * white) / 1.05;
          lastOut = data[i];
          data[i] *= 2.0;
        }
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = type === 'brown' ? 350 : 800;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
      this.noiseNode = noise;
      this.isAmbiencePlaying = true;
      this.currentAmbienceType = type;
      return true;
    } catch {
      return false;
    }
  }

  stopAmbience() {
    if (this.noiseNode) {
      try {
        (this.noiseNode as AudioBufferSourceNode).stop();
        this.noiseNode.disconnect();
      } catch {
        // Ignore
      }
      this.noiseNode = null;
    }
    this.isAmbiencePlaying = false;
    this.currentAmbienceType = 'none';
  }

  getAmbienceState() {
    return {
      isPlaying: this.isAmbiencePlaying,
      type: this.currentAmbienceType,
    };
  }
}

export const soundEffects = new SoundManager();
