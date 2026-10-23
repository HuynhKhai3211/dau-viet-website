// Run against the Vite dev server: node tests/islandBrowserSmoke.mjs
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { hypothesisQuestions } from '../src/data/bachDangDemo.js';

const profilePrefix = join(tmpdir(), 'dau-viet-island-');
const profile = await mkdtemp(profilePrefix);
const chrome = spawn(process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=9337',
  `--user-data-dir=${profile}`, 'about:blank',
], { windowsHide: true, stdio: 'ignore' });
const delay = ms => new Promise(r => setTimeout(r, ms));
let ws;
try {
  let tabs;
  for (let i = 0; i < 50; i++) {
    try { tabs = await (await fetch('http://127.0.0.1:9337/json/list')).json(); break; }
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
  const savedIsland = () => evaluate("JSON.parse(localStorage.getItem('dau-viet-island-v1'))");
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: process.env.DEMO_URL || 'http://localhost:5173/demo' });
  await waitFor("!!document.querySelector('.demo-experience-tabs')");
  await click('.demo-intro button.btn--primary');
  await waitFor("!!document.querySelector('.clue-tabs')");
  for (let i = 0; i < 4; i++) await click('.clue-tabs button', i);
  await waitFor("document.querySelector('.island-reward')?.open");
  assert.deepEqual((await savedIsland()).pending, ['stakes']);
  assert.equal(await evaluate("document.querySelector('.demo-score-chip__val').textContent"), '40', 'StrictMode does not duplicate points');
  await click('.island-reward__actions button', 0);
  await click('.clue-exploration__next-btn');
  await click('.hypothesis-card input', 0); // A wrong answer still earns a completion reward.
  await click('.question-reward-confirm button', 0);
  await waitFor("document.querySelector('.island-reward')?.open");
  assert.deepEqual((await savedIsland()).pending, ['boat']);
  await click('.island-reward__actions button', 1);
  await waitFor("!!document.querySelector('.island-scene')");
  await waitFor("document.querySelector('.island-scene__image')?.naturalWidth > 0");
  assert.ok(await evaluate("document.querySelector('.island-scene__image').src.includes('island-medium')"), 'Medium island image is used');
  const anchorBeforeZoom = await evaluate("(() => { const scene = document.querySelector('.island-scene').getBoundingClientRect(); const cell = document.querySelectorAll('.island-cell')[12].getBoundingClientRect(); return (cell.x + cell.width / 2 - scene.x) / scene.width; })()");
  await click('.island-zoom-btn');
  const anchorAfterZoom = await evaluate("(() => { const scene = document.querySelector('.island-scene').getBoundingClientRect(); const cell = document.querySelectorAll('.island-cell')[12].getBoundingClientRect(); return (cell.x + cell.width / 2 - scene.x) / scene.width; })()");
  assert.ok(Math.abs(anchorBeforeZoom - anchorAfterZoom) < 0.001, 'Anchors stay aligned when zooming');
  await click('.island-zoom-btn');
  assert.equal(await evaluate("document.querySelectorAll('.island-cell--water.island-cell--available').length"), 10, 'Marine items highlight water spots');
  assert.equal(await evaluate("document.querySelectorAll('.island-cell--land:not(:disabled)').length"), 0, 'Boat cannot be placed on land');
  await click('.island-cell', 30);
  await click('.island-edit-bar button', 0);
  await click('.island-cell', 31);
  assert.deepEqual((await savedIsland()).placements, [{ id: 'boat', cell: 31, rotation: 180 }]);
  await click('.island-edit-bar button', 1);
  assert.equal((await savedIsland()).placements.length, 0, 'Stash returns item to inventory');
  await click('.island-cell', 32);
  await click('.decor-card', 2);
  await click('.island-cell', 34);
  assert.equal((await savedIsland()).placements.find(p => p.id === 'stakes').cell, 34, 'Stakes can be placed in the foreground water');
  await mkdir('artifacts', { recursive: true });
  await delay(400);
  const screenshot = await send('Page.captureScreenshot', { format: 'png' });
  await writeFile('artifacts/island-desktop.png', Buffer.from(screenshot.data, 'base64'));
  await send('Page.reload');
  await waitFor("!!document.querySelector('.demo-experience-tabs')");
  assert.equal(await evaluate("[...document.querySelectorAll('.question-reward-confirm button')].filter(b => b.textContent.includes('Đã hoàn thành')).length"), 1, 'Question progress survives reload');
  await click('.demo-experience-tabs button', 1);
  assert.equal((await savedIsland()).placements[0].cell, 32, 'Island layout survives reload');
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await delay(250);
  assert.equal(await evaluate('document.documentElement.scrollWidth <= window.innerWidth'), true, 'Mobile has no horizontal overflow');
  const mobileScreenshot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
  await writeFile('artifacts/island-mobile.png', Buffer.from(mobileScreenshot.data, 'base64'));
  await click('.island-workshop__heading button');
  const q2 = hypothesisQuestions[1];
  await click(`#hypo-${q2.id}-${q2.correctId}`);
  await click('.question-reward-confirm button', 1);
  assert.deepEqual((await savedIsland()).pending, ['flag']);
  await click('.island-reward__actions button', 0);
  await click('.hypothesis-stage__submit-btn');
  await waitFor("!!document.querySelector('.verification-stage')");
  assert.equal(await evaluate("document.querySelector('.demo-score-chip__val').textContent"), '55');
  await click('.verification-stage__next-btn');
  // Starting order: 2, 4, 1, 3. Move 1 up twice, then 3 up once.
  await click('.reconstruction-btn--up', 2);
  await click('.reconstruction-btn--up', 1);
  await click('.reconstruction-btn--up', 3);
  await click('.reconstruction-stage__check-btn');
  assert.deepEqual((await savedIsland()).pending, ['tower']);
  await click('.island-reward__actions button', 0);
  await click('.reconstruction-stage__finish-btn');
  await waitFor("!!document.querySelector('.island-results-rewards')");
  assert.equal(await evaluate("document.querySelector('.demo-score-chip__val').textContent"), '85');
  const earned = (await savedIsland()).earned;
  assert.equal(earned.length, 6);
  await click('.demo-results__actions button');
  assert.deepEqual((await savedIsland()).earned, earned, 'Replay preserves rewards');
  assert.deepEqual((await savedIsland()).pending, [], 'Replay does not repeat reward notifications');
  assert.deepEqual(browserErrors, [], 'No browser runtime exceptions');
  console.log('PASS: clue rewards, each question reward, wrong-answer reward, placement, rotation, moving, stash, reload, mobile layout, results, replay, score and browser errors.');
  await send('Browser.close');
} finally {
  ws?.close();
  chrome.kill();
  await delay(400);
  if (resolve(profile).startsWith(resolve(profilePrefix))) await rm(profile, { recursive: true, force: true, maxRetries: 3 }).catch(() => {});
}
