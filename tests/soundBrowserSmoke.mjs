// Run against the Vite dev server: node tests/soundBrowserSmoke.mjs
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const profilePrefix = join(tmpdir(), 'dau-viet-sound-');
const profile = await mkdtemp(profilePrefix);
const chrome = spawn(process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=9339',
  `--user-data-dir=${profile}`, 'about:blank',
], { windowsHide: true, stdio: 'ignore' });
const delay = ms => new Promise(r => setTimeout(r, ms));
let ws;
try {
  let tabs;
  for (let i = 0; i < 50; i++) {
    try { tabs = await (await fetch('http://127.0.0.1:9339/json/list')).json(); break; }
    catch { await delay(200); }
  }
  assert.ok(tabs, 'Chrome started');
  ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.addEventListener('open', res, { once: true }); ws.addEventListener('error', rej, { once: true }); });
  let id = 0;
  const pending = new Map();
  const browserErrors = [];
  ws.addEventListener('message', event => {
    const m = JSON.parse(event.data);
    if (m.method === 'Runtime.exceptionThrown') browserErrors.push(m.params.exceptionDetails.text);
    if (!m.id) return;
    const p = pending.get(m.id);
    if (p) { clearTimeout(p.timer); pending.delete(m.id); m.error ? p.reject(Error(m.error.message)) : p.resolve(m.result); }
  });
  ws.addEventListener('close', () => {
    for (const p of pending.values()) {
      clearTimeout(p.timer);
      if (p.method === 'Browser.close') p.resolve({});
      else p.reject(Error('Browser connection closed during ' + p.method));
    }
    pending.clear();
  });
  const send = (method, params = {}) => new Promise((res, rej) => {
    const callId = ++id;
    const timer = setTimeout(() => { pending.delete(callId); rej(Error(`Timeout: ${method}`)); }, 10000);
    pending.set(callId, { resolve: res, reject: rej, timer, method });
    ws.send(JSON.stringify({ id: callId, method, params }));
  });
  const evaluate = async expression => {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    return result.result.value;
  };
  const waitFor = async expression => {
    for (let i = 0; i < 50; i++) { if (await evaluate(expression)) return; await delay(100); }
    throw Error(`UI did not become ready: ${expression}`);
  };
  const click = async (selector, index = 0) => {
    await evaluate(`(() => { const el = document.querySelectorAll(${JSON.stringify(selector)})[${index}]; if (!el || el.disabled) throw Error('Missing or disabled: ' + ${JSON.stringify(selector)}); el.click(); })()`);
    await delay(150);
  };
  const trustedClick = async (selector, index = 0) => {
    const point = await evaluate('(() => { const el = document.querySelectorAll(' + JSON.stringify(selector) + ')[' + index + ']; if (!el || el.disabled) throw Error("Missing or disabled: " + ' + JSON.stringify(selector) + '); window.scrollTo({top:scrollY,left:scrollX,behavior:"instant"}); el.scrollIntoView({block:"center",behavior:"instant"}); const r = el.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2}; })()');
    await send('Input.dispatchMouseEvent', { type: 'mousePressed', button: 'left', clickCount: 1, ...point });
    await send('Input.dispatchMouseEvent', { type: 'mouseReleased', button: 'left', clickCount: 1, ...point });
    await delay(220);
  };
  const voiceCount = () => evaluate('window.__audioAudit.voices.length');
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await send('Page.addScriptToEvaluateOnNewDocument', { source: `
    window.__audioAudit = {contexts: [], voices: [], stops: 0};
    const Native = window.AudioContext;
    if (Native) window.AudioContext = class extends Native {
      constructor(...args) { super(...args); window.__audioAudit.contexts.push(this); }
      createOscillator() {
        const osc = super.createOscillator();
        const start = osc.start.bind(osc), stop = osc.stop.bind(osc);
        osc.start = (...args) => { window.__audioAudit.voices.push(osc); return start(...args); };
        osc.stop = (...args) => { if (args.length === 0) window.__audioAudit.stops++; return stop(...args); };
        return osc;
      }
    };
  ` });
  await send('Page.navigate', { url: 'http://localhost:5173/' });
  await waitFor('!!document.querySelector(".sound-toggle")');
  assert.equal(await evaluate('window.__audioAudit.contexts.length'), 0, 'No audio device is started before interaction');
  await trustedClick('.sound-toggle');
  assert.equal(await evaluate('document.querySelector(".sound-toggle").getAttribute("aria-pressed")'), 'false');
  assert.equal(await voiceCount(), 0, 'Muting does not play a sound');
  await send('Page.reload');
  await waitFor('!!document.querySelector(".sound-toggle")');
  assert.equal(await evaluate('document.querySelector(".sound-toggle").getAttribute("aria-pressed")'), 'false', 'Mute preference survives reload');
  await trustedClick('.sound-toggle');
  await waitFor('window.__audioAudit.voices.length === 2');
  assert.equal(await evaluate('window.__audioAudit.contexts[0].state'), 'running', 'AudioContext runs after a trusted gesture');
  await trustedClick('.header__nav a[href="/about"]');
  assert.equal(await voiceCount(), 3, 'One generic click cue, including under React StrictMode');
  const beforeReward = await voiceCount();
  assert.equal(await evaluate('import("/src/utils/interactionSounds.js").then(m => m.playSound("reward"))'), true);
  await trustedClick('.sound-toggle');
  assert.equal(await voiceCount(), beforeReward + 5, 'Reward has five softly voiced notes');
  assert.ok(await evaluate('window.__audioAudit.stops > 0'), 'Mute stops scheduled notes immediately');
  const mutedCount = await voiceCount();
  await trustedClick('.header__nav a[href="/demo"]');
  assert.equal(await voiceCount(), mutedCount, 'Navigation remains silent when muted');
  await trustedClick('.sound-toggle');
  await trustedClick('.demo-intro button.btn--primary');
  await waitFor('!!document.querySelector(".clue-tabs")');
  for (let i = 0; i < 4; i++) await trustedClick('.clue-tabs button', i);
  await waitFor('document.querySelector(".island-reward").open');
  assert.ok(await voiceCount() > mutedCount + 10, 'Clues and actual reward actions produce audio');
  await trustedClick('.island-reward__actions button', 0);
  await trustedClick('.clue-exploration__next-btn');
  await trustedClick('.hypothesis-option-label', 0);
  const answerCount = await voiceCount();
  await trustedClick('.question-reward-confirm button', 0);
  assert.equal(await voiceCount(), answerCount + 5, 'Question completion plays the reward cue without an extra click');
  await trustedClick('.island-reward__actions button', 1);
  const beforePlacement = await voiceCount();
  await trustedClick('.island-cell', 30);
  assert.equal(await voiceCount(), beforePlacement + 2, 'Putting a boat on water plays exactly one water cue');
  assert.equal(await evaluate('JSON.parse(localStorage.getItem("dau-viet-island-v1")).placements[0].cell'), 30);
  const beforeDisabled = await voiceCount();
  await evaluate('document.querySelector(".decor-card:disabled").click()');
  assert.equal(await voiceCount(), beforeDisabled, 'Disabled controls are silent');
  for (const width of [390, 960, 1024, 1440]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: width < 600 });
    await delay(200);
    const layout = await evaluate('(() => { const r=document.querySelector(".sound-toggle").getBoundingClientRect(); return {visible:r.width>0 && r.x>=0 && r.right<=innerWidth, overflow:document.documentElement.scrollWidth>innerWidth}; })()');
    assert.ok(layout.visible, 'Sound control visible at ' + width);
    assert.ok(!layout.overflow, 'No horizontal overflow at ' + width);
  }
  await evaluate('document.querySelector(".sound-toggle").focus()');
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: ' ', code: 'Space', windowsVirtualKeyCode: 32 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: ' ', code: 'Space', windowsVirtualKeyCode: 32 });
  await delay(100);
  assert.equal(await evaluate('document.querySelector(".sound-toggle").getAttribute("aria-pressed")'), 'false', 'Keyboard can mute sound');
  await mkdir('artifacts', { recursive: true });
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  await writeFile('artifacts/interaction-sounds.png', Buffer.from(shot.data, 'base64'));
  assert.deepEqual(browserErrors, [], 'No browser audio/runtime errors');
  console.log('PASS: no autoplay, real audio playback after a gesture, mute and saved preference, navigation, reward, answer selection, water placement, disabled controls, keyboard toggle and responsive header.');
  await send('Browser.close');
} finally {
  ws?.close(); chrome.kill(); await delay(400);
  if (resolve(profile).startsWith(resolve(profilePrefix))) await rm(profile, { recursive: true, force: true, maxRetries: 3 }).catch(() => {});
}
