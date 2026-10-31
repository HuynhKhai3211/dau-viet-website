// Run against the Vite dev server: node tests/tideBrowserSmoke.mjs
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const profilePrefix = join(tmpdir(), 'dau-viet-tide-');
const profile = await mkdtemp(profilePrefix);
const chrome = spawn(process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=9340',
  `--user-data-dir=${profile}`, 'about:blank',
], { windowsHide: true, stdio: 'ignore' });
const delay = ms => new Promise(r => setTimeout(r, ms));
let ws;
try {
  let tabs;
  for (let i = 0; i < 50; i++) {
    try { tabs = await (await fetch('http://127.0.0.1:9340/json/list')).json(); break; }
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
    const timer = setTimeout(() => { pending.delete(callId); rej(Error(`Timeout: ${method}`)); }, 30000);
    pending.set(callId, { resolve: res, reject: rej, timer, method });
    ws.send(JSON.stringify({ id: callId, method, params }));
  });
  const evaluate = async expression => {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    return result.result.value;
  };
  const waitFor = async expression => {
    for (let i = 0; i < 200; i++) { if (await evaluate(expression)) return; await delay(100); }
    throw Error(`UI did not become ready: ${expression}`);
  };
  const click = async (selector, index = 0) => {
    await evaluate(`(() => { const el = document.querySelectorAll(${JSON.stringify(selector)})[${index}]; if (!el || el.disabled) throw Error('Missing or disabled: ' + ${JSON.stringify(selector)}); el.click(); })()`);
    await delay(150);
  };
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1100, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: 'http://localhost:5173/demo' });
  await waitFor('!!document.querySelector(".demo-intro")');
  await click('.demo-intro button.btn--primary');
  await waitFor('!!document.querySelector(".tide-battle-scene")');
  await evaluate('document.fonts.ready.then(() => true)');
  const sceneAssets = await evaluate(`(async () => {
    const urls = [...new Set([...document.querySelectorAll('.river-artwork image')].map(el => el.getAttribute('href')))];
    await Promise.all(urls.map(async url => { const img = new Image(); img.src = url; await img.decode(); }));
    return urls;
  })()`);
  assert.equal(sceneAssets.length, 8, 'All team illustrations, including both broken halves, load successfully');
  assert.ok(sceneAssets.every(url => url.includes('/bach-dang/team-')), 'Scene uses the team artwork');
  await delay(600);
  await mkdir('artifacts', { recursive: true });
  const screenshot = async (selector, name) => {
    const clip = await evaluate('(() => { const r=document.querySelector(' + JSON.stringify(selector) + ').getBoundingClientRect(); return {x:r.x+scrollX,y:r.y+scrollY,width:r.width,height:r.height,scale:1}; })()');
    const result = await send('Page.captureScreenshot', { format: 'png', clip, captureBeyondViewport: true });
    await writeFile('artifacts/' + name + '.png', Buffer.from(result.data, 'base64'));
  };
  const waterY = () => evaluate('Number(document.querySelector(".river-water-body").getAttribute("y"))');
  assert.equal(await evaluate('document.querySelector(".tide-controls__slider").value'), '85');
  assert.equal(await waterY(), 384);
  assert.equal(await evaluate('!!document.querySelector(".river-warship--trapped")'), false);
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".river-warship__intact")).opacity'), '1');
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".river-warship__wreck")).opacity'), '0');
  assert.equal(await evaluate('document.querySelectorAll(".tide-story-card[aria-pressed=true]").length'), 1);
  await screenshot('.tide-interaction', 'tide-high');
  await click('.tide-story-card', 1);
  assert.equal(await waterY(), 440);
  assert.ok(await evaluate('document.querySelector(".tide-battle-scene").classList.contains("tide-battle-scene--ebb")'));
  assert.ok(await evaluate('!!document.querySelector(".river-warship--grounding")'), 'Ship strikes the emerging stakes before breaking');
  await delay(600);
  await screenshot('.tide-interaction', 'tide-ebb');
  await click('.tide-interaction__toggle-btn', 1);
  await delay(1250);
  assert.equal(await waterY(), 491.2);
  assert.equal(await evaluate('!!document.querySelector(".river-warship--trapped")'), true);
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".river-warship__intact")).opacity'), '0');
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".river-warship__wreck")).opacity'), '1');
  assert.ok(await evaluate(`(() => {
    const matrix = selector => new DOMMatrix(getComputedStyle(document.querySelector(selector)).transform);
    const front = matrix('.river-warship__half--front');
    const back = matrix('.river-warship__half--back');
    return front.e < back.e && front.b < 0 && back.b > 0;
  })()`), 'Broken halves separate and tilt in opposite directions');
  assert.ok(await evaluate('document.querySelector(".tide-controls__slider").getAttribute("aria-valuetext").startsWith("18%")'));
  await screenshot('.tide-interaction', 'tide-low');
  await evaluate('document.querySelector(".tide-controls__slider").focus()');
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'End', code: 'End', windowsVirtualKeyCode: 35 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'End', code: 'End', windowsVirtualKeyCode: 35 });
  await delay(300);
  assert.equal(await waterY(), 360, 'Slider is keyboard accessible and updates the scene');
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".river-warship__wreck")).opacity'), '0', 'Raising the tide restores the intact ship');
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".river-warship__intact")).opacity'), '1');
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Home', code: 'Home', windowsVirtualKeyCode: 36 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Home', code: 'Home', windowsVirtualKeyCode: 36 });
  await delay(100);
  assert.equal(await waterY(), 520);
  await click('.tide-zoom');
  assert.equal(await evaluate('document.querySelector(".tide-artwork-frame").style.width'), '165%');
  await click('.tide-zoom');
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await delay(300);
  assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'), 'No mobile overflow');
  await screenshot('.tide-interaction', 'tide-mobile');
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".river-scout")).animationName'), 'none');
  assert.ok(await evaluate('parseFloat(getComputedStyle(document.querySelector(".river-warship__half--front")).transitionDuration) < .001'), 'Reduced motion disables the separation transition');
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".river-warship__wreck")).opacity'), '1', 'Reduced motion retains the broken state without movement');
  await click('.clue-tabs button', 1);
  assert.equal(await evaluate('!!document.querySelector(".clue-detail-panel--panoramic")'), false, 'Other clue layouts are unchanged');
  await click('.clue-tabs button', 0);
  assert.ok(await evaluate('!!document.querySelector(".river-artwork")'), 'Scene works after switching clues');
  const clueTitles = ['Ngô Quyền', 'Sông Bạch Đằng', 'Quân Nam Hán'];
  for (let index = 1; index <= 3; index++) {
    await click('.clue-tabs button', index);
    assert.equal(await evaluate('document.querySelector(".clue-detail-panel__title").textContent'), clueTitles[index - 1]);
    assert.equal(await evaluate('document.querySelectorAll(".clue-sub-interaction--facts .terrain-zone-btn").length'), 3);
    assert.equal(await evaluate('!!document.querySelector(".stake-schematic, .strategy-stepper")'), false);
    for (let fact = 0; fact < 3; fact++) {
      await click('.clue-sub-interaction--facts .terrain-zone-btn', fact);
      assert.equal(await evaluate(`document.querySelectorAll('.terrain-zone-btn')[${fact}].getAttribute('aria-pressed')`), 'true');
      assert.equal(await evaluate('document.querySelector(".terrain-zone-card h4").textContent'), await evaluate(`document.querySelectorAll('.terrain-zone-btn strong')[${fact}].textContent`));
    }
    assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'), 'New clue fits mobile');
  }
  await click('.clue-tabs button', 0);
  assert.ok(await evaluate('!!document.querySelector(".river-artwork")'), 'Original tide scene still mounts after all new clues');
  await evaluate(`(() => {
    const key = 'dau-viet-journey-v1';
    const saved = JSON.parse(localStorage.getItem(key));
    saved.discoveredClues = ['thuy-trieu', 'bai-coc', 'dia-hinh', 'chien-thuat'];
    saved.score = 40;
    localStorage.setItem(key, JSON.stringify(saved));
  })()`);
  await send('Page.navigate', { url: 'http://localhost:5173/demo?legacy-clues' });
  await waitFor('document.querySelectorAll(".clue-tab--discovered").length === 4');
  assert.deepEqual(await evaluate('JSON.parse(localStorage.getItem("dau-viet-journey-v1")).discoveredClues'), ['thuy-trieu', 'ngo-quyen', 'dia-hinh', 'nam-han']);
  await click('.clue-tabs button', 1);
  await click('.clue-tabs button', 3);
  assert.equal(await evaluate('JSON.parse(localStorage.getItem("dau-viet-journey-v1")).score'), 40, 'Existing progress migrates without duplicate points');
  assert.deepEqual(browserErrors, [], 'No runtime errors');
  console.log('PASS: artwork loading, high/mid/low tides, ship impact and splitting, tide reset, phase controls, keyboard slider, zoom, mobile layout, reduced motion and clue switching.');
  await send('Browser.close');
} finally {
  ws?.close(); chrome.kill(); await delay(400);
  if (resolve(profile).startsWith(resolve(profilePrefix))) await rm(profile, { recursive: true, force: true, maxRetries: 3 }).catch(() => {});
}
