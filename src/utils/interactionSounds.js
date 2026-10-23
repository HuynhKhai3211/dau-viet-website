export const SOUND_STORAGE_KEY = 'dau-viet-sound-enabled-v1';

// Short, softly voiced pentatonic cues. Synthesized locally: no audio downloads.
const note = (frequency, at = 0, length = 0.13, gain = 0.15, type = 'sine', endFrequency) => ({ frequency, at, length, gain, type, endFrequency });
export const soundCues = {
  click: { priority: 0, notes: [note(660, 0, 0.055, 0.09, 'triangle')] },
  select: { priority: 1, notes: [note(523.25, 0, 0.09), note(659.25, 0.055, 0.12, 0.1)] },
  place: { priority: 1, notes: [note(261.63, 0, 0.08, 0.17, 'triangle'), note(523.25, 0.04, 0.16, 0.1)] },
  water: { priority: 1, cooldown: 180, notes: [note(392, 0, 0.18, 0.1, 'sine', 261.63), note(783.99, 0.06, 0.18, 0.045, 'sine', 523.25)] },
  mascot: { priority: 1, notes: [note(523.25, 0, 0.12), note(659.25, 0.09, 0.12), note(783.99, 0.18, 0.2, 0.1)] },
  discover: { priority: 2, notes: [note(659.25), note(783.99, 0.09, 0.2), note(1046.5, 0.18, 0.25, 0.09)] },
  success: { priority: 2, notes: [note(523.25), note(659.25, 0.09), note(783.99, 0.18, 0.28)] },
  error: { priority: 2, notes: [note(329.63, 0, 0.16, 0.1, 'triangle'), note(261.63, 0.13, 0.2, 0.09, 'triangle')] },
  reward: { priority: 3, notes: [note(523.25), note(659.25, 0.1), note(783.99, 0.2), note(1046.5, 0.32, 0.4, 0.12), note(783.99, 0.32, 0.4, 0.06)] },
  complete: { priority: 3, notes: [note(392), note(523.25, 0.12), note(659.25, 0.24), note(783.99, 0.36), note(1046.5, 0.5, 0.5, 0.12)] },
};

export function createSoundPlayer({
  isEnabled = () => true,
  isVisible = () => typeof document === 'undefined' || !document.hidden,
  now = () => performance.now(),
  createContext = () => {
    // Only create an audio device after an actual user gesture.
    if (typeof window === 'undefined' || (navigator.userActivation && !navigator.userActivation.hasBeenActive)) return null;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    return AudioContext ? new AudioContext() : null;
  },
} = {}) {
  let context;
  let master;
  let generation = 0;
  let lastTime = -Infinity;
  let lastPriority = -1;
  let lastCue;
  const active = new Set();

  const stop = () => {
    generation += 1;
    for (const oscillator of active) {
      try { oscillator.stop(); } catch { /* A finished voice is already silent. */ }
    }
    active.clear();
    lastTime = -Infinity;
  };

  const play = async (name = 'click') => {
    const cue = soundCues[name];
    if (!cue || !isEnabled() || !isVisible()) return false;
    const time = now();
    if ((time - lastTime < 80 && cue.priority <= lastPriority)
      || (name === lastCue && time - lastTime < (cue.cooldown || 80))) return false;
    try {
      if (!context || context.state === 'closed') {
        context = createContext();
        if (!context) return false;
        master = context.createGain();
        master.gain.value = 0.3;
        master.connect(context.destination);
      }
      lastTime = time;
      lastPriority = cue.priority;
      lastCue = name;
      const currentGeneration = generation;
      if (context.state === 'suspended') await context.resume();
      if (context.state !== 'running' || currentGeneration !== generation || !isEnabled() || !isVisible()) return false;
      if (active.size + cue.notes.length > 20) return false;
      const start = context.currentTime + 0.005;
      for (const voice of cue.notes) {
        const oscillator = context.createOscillator();
        const envelope = context.createGain();
        const onset = start + voice.at;
        oscillator.type = voice.type;
        oscillator.frequency.setValueAtTime(voice.frequency, onset);
        if (voice.endFrequency) oscillator.frequency.exponentialRampToValueAtTime(voice.endFrequency, onset + voice.length);
        envelope.gain.setValueAtTime(0, onset);
        envelope.gain.linearRampToValueAtTime(voice.gain, onset + 0.008);
        envelope.gain.exponentialRampToValueAtTime(0.0001, onset + voice.length);
        oscillator.connect(envelope);
        envelope.connect(master);
        active.add(oscillator);
        oscillator.onended = () => { active.delete(oscillator); oscillator.disconnect(); envelope.disconnect(); };
        oscillator.start(onset);
        oscillator.stop(onset + voice.length + 0.025);
      }
      return true;
    } catch {
      // An unavailable audio device must never interrupt the interaction.
      return false;
    }
  };
  return { play, stop };
}

function readPreference() {
  try { return localStorage.getItem(SOUND_STORAGE_KEY) !== 'false'; }
  catch { return true; }
}
let enabled = readPreference();
const listeners = new Set();
const player = createSoundPlayer({ isEnabled: () => enabled });
export const playSound = name => player.play(name);
export const stopSounds = () => player.stop();
export const getSoundEnabled = () => enabled;
export const subscribeSound = listener => { listeners.add(listener); return () => listeners.delete(listener); };
export function setSoundEnabled(value) {
  enabled = !!value;
  if (!enabled) player.stop();
  try { localStorage.setItem(SOUND_STORAGE_KEY, String(enabled)); } catch { /* Keep the preference for this session. */ }
  for (const listener of listeners) listener();
}

// Bubble phase lets an action's success/reward cue take priority over its click.
export function installInteractionSounds(target = document) {
  const handleClick = event => {
    if (!event.isTrusted || !(event.target instanceof Element)) return;
    const control = event.target.closest('button, a[href], [role="button"]');
    if (!control || control.matches(':disabled, [aria-disabled="true"]') || control.closest('[data-sound="off"]')) return;
    void playSound(control.dataset.sound || 'click');
  };
  const handleChange = event => {
    if (event.isTrusted && event.target instanceof Element && event.target.matches('input[type="radio"], input[type="checkbox"], select')) void playSound('select');
  };
  const handleInput = event => {
    if (event.isTrusted && event.target instanceof Element && event.target.matches('.tide-controls__slider')) void playSound('water');
  };
  const handleVisibility = () => { if (target.hidden) stopSounds(); };
  const handleStorage = event => {
    if (event.key !== SOUND_STORAGE_KEY && event.key !== null) return;
    enabled = readPreference();
    if (!enabled) stopSounds();
    for (const listener of listeners) listener();
  };
  target.addEventListener('click', handleClick);
  target.addEventListener('change', handleChange);
  target.addEventListener('input', handleInput);
  target.addEventListener('visibilitychange', handleVisibility);
  window.addEventListener('storage', handleStorage);
  window.addEventListener('pagehide', stopSounds);
  return () => {
    target.removeEventListener('click', handleClick);
    target.removeEventListener('change', handleChange);
    target.removeEventListener('input', handleInput);
    target.removeEventListener('visibilitychange', handleVisibility);
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener('pagehide', stopSounds);
    stopSounds();
  };
}
