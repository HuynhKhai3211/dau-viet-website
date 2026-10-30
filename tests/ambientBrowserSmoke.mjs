// Run against the Vite dev server: node tests/ambientBrowserSmoke.mjs
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const profilePrefix = join(tmpdir(), 'dau-viet-ambient-');
const profile = await mkdtemp(profilePrefix);
const chrome = spawn(process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=9352',
  `--user-data-dir=${profile}`, 'about:blank',
], { windowsHide: true, stdio: 'ignore' });
const delay = ms => new Promise(r => setTimeout(r, ms));
const base = process.env.SITE_URL || 'http://127.0.0.1:5173';
let ws;
try {
  let tabs;
  for (let i = 0; i < 50; i++) {
    try { tabs = await (await fetch('http://127.0.0.1:9352/json/list')).json(); break; }
    catch { await delay(200); }
  }
  assert.ok(tabs, 'Chrome started');
  ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.addEventListener('open', res, { once: true }); ws.addEventListener('error', rej, { once: true }); });
  let id = 0;
  const pending = new Map();
  const errors = [];
  ws.addEventListener('message', event => {
    const m = JSON.parse(event.data);
    if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.text);
    if (!m.id) return;
    const p = pending.get(m.id);
    if (p) { clearTimeout(p.timer); pending.delete(m.id); m.error ? p.reject(Error(m.error.message)) : p.resolve(m.result); }
  });
  const send = (method, params = {}) => new Promise((res, rej) => {
    const callId = ++id;
    const timer = setTimeout(() => { pending.delete(callId); rej(Error('Timeout: ' + method)); }, 10000);
    pending.set(callId, { resolve: res, reject: rej, timer });
    ws.send(JSON.stringify({ id: callId, method, params }));
  });
  const evaluate = async expression => {
    const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
    return r.result.value;
  };
  const waitFor = async expression => {
    for (let i = 0; i < 70; i++) { if (await evaluate(expression)) return; await delay(100); }
    throw Error('UI did not become ready: ' + expression);
  };
  const navigate = async route => {
    await send('Page.navigate', { url: base + route });
    await waitFor('!!document.querySelector(".ambient-toggle") && document.readyState === "complete"');
  };
  const clickToggle = async () => {
    const point = await evaluate(`(() => {
      const el = document.querySelector('.ambient-toggle');
      const r = el.getBoundingClientRect();
      const x = r.x + r.width / 2, y = r.y + r.height / 2;
      if (!el.contains(document.elementFromPoint(x, y))) throw Error('Toggle is covered');
      return {x, y};
    })()`);
    await send('Input.dispatchMouseEvent', { type: 'mousePressed', button: 'left', clickCount: 1, ...point });
    await send('Input.dispatchMouseEvent', { type: 'mouseReleased', button: 'left', clickCount: 1, ...point });
    await delay(100);
  };
  const screenshot = async name => {
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    await writeFile('artifacts/ambient/' + name + '.png', Buffer.from(shot.data, 'base64'));
  };

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
  await mkdir('artifacts/ambient', { recursive: true });
  await navigate('/');
  assert.equal(await evaluate('document.querySelector(".ambient-toggle").getAttribute("aria-pressed")'), 'true');

  for (const width of [1440, 390, 320]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 960, deviceScaleFactor: 1, mobile: width < 600 });
    await evaluate('window.scrollTo({top: 0, behavior: "instant"})');
    await delay(1100);
    const scene = await evaluate(`(() => {
      const layer = document.querySelector('.ambient-background');
      const particles = [...document.querySelectorAll('.ambient-particle')];
      const button = document.querySelector('.ambient-toggle').getBoundingClientRect();
      return {
        count: particles.length,
        visibleCount: particles.filter(p => getComputedStyle(p).display !== 'none').length,
        interactive: [layer, ...layer.querySelectorAll('*')].some(p => getComputedStyle(p).pointerEvents !== 'none'),
        fixed: getComputedStyle(layer).position,
        overflowing: document.documentElement.scrollWidth > innerWidth,
        durationCount: new Set(particles.map(p => getComputedStyle(p).animationDuration)).size,
        buttonInside: button.left >= 0 && button.right <= innerWidth && button.bottom <= innerHeight && button.height >= 44,
        background: getComputedStyle(document.querySelector('.heritage-backdrop')).backgroundImage,
      };
    })()`);
    assert.equal(scene.count, 42);
    assert.equal(scene.visibleCount, width < 600 ? 30 : 42);
    assert.equal(scene.fixed, 'fixed');
    assert.equal(scene.interactive, false);
    assert.equal(scene.overflowing, false);
    assert.equal(scene.buttonInside, true);
    assert.ok(scene.durationCount > 10);
    assert.ok(scene.background.includes('repeating-linear-gradient'));
    const animations = await evaluate(`(() => {
      const p = document.querySelector('.ambient-particle').getAnimations()[0];
      const t = p.currentTime;
      return new Promise(resolve => setTimeout(() => resolve({ running: p.playState, moved: p.currentTime > t }), 120));
    })()`);
    assert.equal(animations.running, 'running');
    assert.ok(animations.moved);
    await screenshot('home-' + width);
    await evaluate('window.scrollTo({top: 1800, behavior: "instant"})');
    assert.equal(await evaluate('Math.round(document.querySelector(".ambient-background").getBoundingClientRect().top)'), 0);
    await screenshot('scrolled-' + width);
  }

  await clickToggle();
  await waitFor('document.querySelector(".ambient-background").hidden');
  assert.equal(await evaluate('localStorage.getItem("dau-viet-ambient-enabled")'), 'false');
  assert.equal(await evaluate('document.querySelectorAll(".ambient-particle").length'), 0);
  await navigate('/');
  assert.equal(await evaluate('document.querySelector(".ambient-toggle").getAttribute("aria-pressed")'), 'false');
  await navigate('/about');
  assert.equal(await evaluate('document.querySelector(".ambient-toggle").getAttribute("aria-pressed")'), 'false');
  await clickToggle();
  await waitFor('document.querySelectorAll(".ambient-particle").length === 42');

  // Keyboard access uses the native button activation behavior.
  await evaluate('document.querySelector(".ambient-toggle").focus()');
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, text: '\r', unmodifiedText: '\r' });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
  await waitFor('document.querySelector(".ambient-background").hidden');
  await clickToggle();

  // Simulate visibility changes; animation state must pause and resume in place.
  await evaluate(`Object.defineProperty(document, 'hidden', { configurable: true, value: true }); document.dispatchEvent(new Event('visibilitychange'))`);
  await waitFor('document.querySelector(".ambient-background").classList.contains("ambient-background--paused")');
  assert.ok(await evaluate(`[...document.querySelector('.ambient-background').getAnimations({subtree: true})].every(a => a.playState === 'paused')`));
  await evaluate(`Object.defineProperty(document, 'hidden', { configurable: true, value: false }); document.dispatchEvent(new Event('visibilitychange'))`);
  await waitFor('!document.querySelector(".ambient-background").classList.contains("ambient-background--paused")');

  // Changing the OS preference wins over a previously saved "on" choice.
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await waitFor('document.querySelector(".ambient-toggle").disabled');
  assert.equal(await evaluate('document.querySelector(".ambient-background").hidden'), true);
  assert.equal(await evaluate('document.querySelectorAll(".ambient-particle").length'), 0);
  assert.equal(await evaluate('localStorage.getItem("dau-viet-ambient-enabled")'), 'true');
  await navigate('/');
  await waitFor('document.querySelector(".ambient-toggle").disabled');
  await screenshot('reduced-motion-320');
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
  await waitFor('!document.querySelector(".ambient-toggle").disabled && document.querySelectorAll(".ambient-particle").length === 42');

  // Storage restrictions must not prevent toggling or break rendering.
  await evaluate(`window.originalSetItem = Storage.prototype.setItem; Storage.prototype.setItem = function () { throw new DOMException('Blocked', 'SecurityError'); }`);
  await clickToggle();
  await waitFor('document.querySelector(".ambient-background").hidden');
  await clickToggle();
  await waitFor('!document.querySelector(".ambient-background").hidden');
  await evaluate('Storage.prototype.setItem = window.originalSetItem');

  // The decorative layer must not cover links beneath it.
  await evaluate('document.querySelector(".hero-actions a").scrollIntoView({block: "center", behavior: "instant"})');
  assert.ok(await evaluate(`(() => {
    const link = document.querySelector('.hero-actions a');
    const r = link.getBoundingClientRect();
    return link.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2));
  })()`));
  for (const route of ['/', '/about', '/explore', '/demo', '/team', '/contact', '/not-found']) {
    await navigate(route);
    await waitFor('!!document.querySelector(".heritage-backdrop")');
    assert.ok(await evaluate(`getComputedStyle(document.querySelector('.heritage-backdrop')).backgroundImage.includes('heritage-background')`), route + ' shares the landscape');
    assert.equal(await evaluate(`getComputedStyle(document.querySelector('.main-content > div:not(.heritage-backdrop)')).backgroundColor`), 'rgba(0, 0, 0, 0)', route + ' reveals the landscape');
    assert.equal(await evaluate(`document.querySelectorAll('.ambient-particle--leaf').length`), 28);
  }
  assert.deepEqual(errors, [], 'No runtime errors');
  console.log('PASS: 42 desktop / 30 mobile particles; 1440/390/320 layouts; fixed overlay; pointer passthrough; real CSS motion; toggle by pointer and keyboard; persisted preferences; route navigation; tab visibility pause; live reduced-motion changes; blocked storage fallback.');
} finally {
  ws?.close();
  chrome.kill();
  await delay(400);
  if (resolve(profile).startsWith(resolve(profilePrefix))) await rm(profile, { recursive: true, force: true, maxRetries: 3 }).catch(() => {});
}
