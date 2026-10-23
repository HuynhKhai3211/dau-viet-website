import test from 'node:test';
import assert from 'node:assert/strict';
import { createSoundPlayer, soundCues } from '../src/utils/interactionSounds.js';

function fakeAudio() {
  const voices = [];
  const gains = [];
  const parameter = () => ({ value: 0, setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {} });
  const context = {
    state: 'running', currentTime: 1, destination: {},
    createGain() { const node = { gain: parameter(), connect() {}, disconnect() {} }; gains.push(node); return node; },
    createOscillator() {
      const node = { frequency: parameter(), connect() {}, disconnect() {}, starts: [], stops: [],
        start(time) { this.starts.push(time); }, stop(time) { this.stops.push(time); } };
      voices.push(node); return node;
    },
    async resume() { this.state = 'running'; },
  };
  return { context, voices, gains };
}

test('disabled sound never initializes an audio device', async () => {
  let created = 0;
  const player = createSoundPlayer({ isEnabled: () => false, createContext: () => { created++; } });
  assert.equal(await player.play('reward'), false);
  assert.equal(created, 0);
});

test('hidden pages remain silent and unsupported audio fails safely', async () => {
  let created = 0;
  const hidden = createSoundPlayer({ isVisible: () => false, createContext: () => { created++; } });
  assert.equal(await hidden.play('click'), false);
  assert.equal(created, 0);
  const unsupported = createSoundPlayer({ createContext: () => null });
  assert.equal(await unsupported.play('click'), false);
  const unavailable = createSoundPlayer({ createContext: () => { throw Error('No audio device'); } });
  assert.equal(await unavailable.play('click'), false);
});

test('reward schedules all notes with soft envelopes and reuses the context', async () => {
  const audio = fakeAudio();
  let created = 0;
  let time = 0;
  const player = createSoundPlayer({ now: () => time, createContext: () => { created++; return audio.context; } });
  assert.equal(await player.play('reward'), true);
  assert.equal(audio.voices.length, soundCues.reward.notes.length);
  assert.equal(audio.gains[0].gain.value, 0.3);
  assert.ok(audio.voices.every(v => v.starts.length === 1 && v.stops[0] > v.starts[0]));
  time = 1000;
  assert.equal(await player.play('click'), true);
  assert.equal(created, 1);
});

test('action cue suppresses its generic click and repeated slider input', async () => {
  const audio = fakeAudio();
  let time = 0;
  const player = createSoundPlayer({ now: () => time, createContext: () => audio.context });
  await player.play('reward');
  assert.equal(await player.play('click'), false);
  time = 200;
  assert.equal(await player.play('water'), true);
  time = 300;
  assert.equal(await player.play('water'), false);
  time = 400;
  assert.equal(await player.play('water'), true);
});

test('mute stops already scheduled voices and cancels a pending resume', async () => {
  const audio = fakeAudio();
  const player = createSoundPlayer({ createContext: () => audio.context });
  await player.play('reward');
  player.stop();
  assert.ok(audio.voices.every(v => v.stops.includes(undefined)));

  const waitingAudio = fakeAudio();
  waitingAudio.context.state = 'suspended';
  let resume;
  waitingAudio.context.resume = () => new Promise(resolve => { resume = () => { waitingAudio.context.state = 'running'; resolve(); }; });
  const waiting = createSoundPlayer({ createContext: () => waitingAudio.context });
  const playback = waiting.play('reward');
  waiting.stop();
  resume();
  assert.equal(await playback, false);
  assert.equal(waitingAudio.voices.length, 0);
});

test('completed voices release their audio nodes and invalid cues are ignored', async () => {
  const audio = fakeAudio();
  const player = createSoundPlayer({ createContext: () => audio.context });
  assert.equal(await player.play('unknown'), false);
  assert.equal(audio.voices.length, 0);
  await player.play('select');
  for (const voice of audio.voices) voice.onended();
  player.stop();
  assert.ok(audio.voices.every(v => v.stops.length === 1));
});
