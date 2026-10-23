// Run against the Vite dev server: node tests/typographyBrowserSmoke.mjs
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const profilePrefix = join(tmpdir(), 'dau-viet-typography-');
const profile = await mkdtemp(profilePrefix);
const chrome = spawn(process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=9338',
  `--user-data-dir=${profile}`, 'about:blank',
], { windowsHide: true, stdio: 'ignore' });
const delay = ms => new Promise(r => setTimeout(r, ms));
let ws;
try {
  let tabs;
  for (let i = 0; i < 50; i++) {
    try { tabs = await (await fetch('http://127.0.0.1:9338/json/list')).json(); break; }
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

  await send('Page.enable');
  await send('Runtime.enable');
  await send('DOM.enable');
  await send('CSS.enable');
  await send('Network.enable');
  await send('Network.setBlockedURLs', { urls: ['*fonts.googleapis.com*', '*fonts.gstatic.com*'] });
  await mkdir('artifacts/typography', { recursive: true });
  const routes = ['/', '/about', '/explore', '/demo', '/team', '/contact', '/trang-khong-ton-tai'];
  const results = [];
  for (const width of [1440, 390]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: width < 600 });
    for (const route of routes) {
      await send('Page.navigate', { url: 'http://localhost:5173' + route });
      await waitFor("!!document.querySelector('main') && !!document.querySelector('h1')");
      await evaluate('document.fonts.ready.then(() => true)');
      await delay(1100);
      const info = await evaluate("(() => { const title = document.querySelector('.hero-title__main') || document.querySelector('h1'); const s = getComputedStyle(title); return { text: title.textContent.trim(), font: s.fontFamily, lineHeight: parseFloat(s.lineHeight), fontSize: parseFloat(s.fontSize), fill: s.webkitTextFillColor, numeric: s.fontVariantNumeric, bodyFont: getComputedStyle(document.body).fontFamily, overflow: document.documentElement.scrollWidth > window.innerWidth }; })()");
      assert.ok(info.font.includes('Noto Serif'), route + ': heading uses shared Vietnamese font');
      assert.ok(info.bodyFont.includes('Be Vietnam Pro'), route + ': body uses shared font');
      assert.ok(info.numeric.includes('lining-nums'), route + ': numbers have a common baseline');
      assert.ok(!info.overflow, route + ': no horizontal overflow at ' + width);
      const doc = await send('DOM.getDocument');
      const node = await send('DOM.querySelector', { nodeId: doc.root.nodeId, selector: route === '/' ? '.hero-title__main' : 'h1' });
      const used = await send('CSS.getPlatformFontsForNode', { nodeId: node.nodeId });
      assert.ok(used.fonts.length && used.fonts.every(f => f.isCustomFont), route + ': actual heading glyphs use local fonts, including accents');
      if (route === '/') {
        assert.equal(info.text, 'DẤU VIỆT');
        assert.notEqual(info.fill, 'rgba(0, 0, 0, 0)', 'Hero text is not masked by a clipped gradient');
        assert.ok(info.lineHeight / info.fontSize >= 1.35, 'Hero has room for Vietnamese tone marks');
        const digits = await evaluate("(() => { const s = getComputedStyle(document.querySelector('.hero-stat-number')); return { family: s.fontFamily, numeric: s.fontVariantNumeric }; })()");
        assert.ok(digits.family.includes('Be Vietnam Pro'));
        assert.ok(digits.numeric.includes('lining-nums'));
        const digitHeightDifference = await evaluate(`(() => { const c = document.createElement('canvas').getContext('2d'); c.font = '700 24px "Be Vietnam Pro"'; return Math.abs(c.measureText('3').actualBoundingBoxAscent - c.measureText('D').actualBoundingBoxAscent); })()`);
        assert.ok(digitHeightDifference <= 1, '3 and D have matching cap heights');
      }
      const shot = await send('Page.captureScreenshot', { format: 'png' });
      const slug = route === '/' ? 'home' : route.slice(1);
      await writeFile('artifacts/typography/' + slug + '-' + width + '.png', Buffer.from(shot.data, 'base64'));
      results.push({ route, width, heading: info.text, font: info.font });
    }
  }
  assert.deepEqual(browserErrors, [], 'No runtime errors');
  console.log(JSON.stringify(results, null, 2));
  console.log('PASS: all 7 routes at desktop and mobile widths, local fonts with Google Fonts blocked, Vietnamese hero glyphs, lining numerals, tone-mark spacing and horizontal overflow.');
  await send('Browser.close');
} finally {
  ws?.close();
  chrome.kill();
  await delay(400);
  if (resolve(profile).startsWith(resolve(profilePrefix))) await rm(profile, { recursive: true, force: true, maxRetries: 3 }).catch(() => {});
}
