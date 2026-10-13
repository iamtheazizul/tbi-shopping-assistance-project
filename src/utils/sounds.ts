let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AC =
  window.AudioContext || (window as unknown as {webkitAudioContext?: typeof AudioContext;}).webkitAudioContext;
  if (!AC) return null;
  ctx = ctx ?? new AC();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function tone(freq: number, start: number, duration: number, peak: number, type: OscillatorType, endFreq?: number) {
  const a = audio();
  if (!a) return;
  const t = a.currentTime + start;
  const osc = a.createOscillator();
  const gain = a.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, t + duration);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(peak, t + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.connect(gain).connect(a.destination);
  osc.start(t);
  osc.stop(t + duration + 0.02);
}

/** A soft, short pop. */
export function playPop() {
  tone(520, 0, 0.09, 0.08, 'sine', 880);
}

/** A little four-note jingle. */
export function playJingle() {
  [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => tone(freq, i * 0.1, 0.24, 0.05, 'triangle'));
}