// Run against the Vite dev server: node tests/journeyBrowserSmoke.mjs
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const profilePrefix = join(tmpdir(), 'dau-viet-journey-');
const profile = await mkdtemp(profilePrefix);
const chrome = spawn(process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=9350',
  `--user-data-dir=${profile}`, 'about:blank',
], { windowsHide: true, stdio: 'ignore' });
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const base = process.env.SITE_URL || 'http://127.0.0.1:5173';
let ws;
try {
  let tabs;
  for (let i = 0; i < 50; i++) {
    try { tabs = await (await fetch('http://127.0.0.1:9350/json/list')).json(); break; }
    catch { await delay(200); }
  }
  assert.ok(tabs, 'Chrome started');
  ws = new WebSocket(tabs.find(tab => tab.type === 'page').webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true });
    ws.addEventListener('error', reject, { once: true });
  });
  let id = 0;
  const pending = new Map();
  const browserErrors = [];
  ws.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    if (message.method === 'Runtime.exceptionThrown') browserErrors.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text);
    if (!message.id) return;
    const call = pending.get(message.id);
    if (call) {
      clearTimeout(call.timer); pending.delete(message.id);
      message.error ? call.reject(Error(message.error.message)) : call.resolve(message.result);
    }
  });
  ws.addEventListener('close', () => {
    for (const call of pending.values()) {
      clearTimeout(call.timer);
      call.method === 'Browser.close' ? call.resolve({}) : call.reject(Error('Browser connection closed during ' + call.method));
    }
    pending.clear();
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const callId = ++id;
    const timer = setTimeout(() => { pending.delete(callId); reject(Error('Timeout: ' + method)); }, 10000);
    pending.set(callId, { resolve, reject, timer, method });
    ws.send(JSON.stringify({ id: callId, method, params }));
  });
  const evaluate = async expression => {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    return result.result.value;
  };
  const waitFor = async expression => {
    for (let i = 0; i < 200; i++) { if (await evaluate(expression)) return; await delay(100); }
    throw Error('UI did not become ready: ' + expression + '\nErrors: ' + JSON.stringify(browserErrors) + '\nPage: ' + await evaluate('document.body.innerText.slice(0,1000)'));
  };
  await send('Page.enable');
  await send('Runtime.enable');
  await mkdir('artifacts/discovery-journey', { recursive: true });
  for (const route of ['/', '/explore']) {
    for (const width of [1440, 1024, 390, 320]) {
      await send('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: width < 640 });
      await send('Page.navigate', { url: base + route });
      await waitFor('document.querySelectorAll(".discovery-step").length === 6');
      await evaluate('document.fonts.ready.then(() => true)');
      await evaluate('document.documentElement.style.scrollBehavior = "auto"');
      assert.equal(await evaluate('document.querySelectorAll(".discovery-nav a").length'), 6);
      assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'), route + ' no overflow at ' + width);
      assert.ok(await evaluate('[...document.querySelectorAll(".discovery-step")].every(el => getComputedStyle(el).display !== "none" && el.getBoundingClientRect().height > 100)'), 'All six stages readable by scrolling');
      assert.ok(await evaluate('[...document.querySelectorAll(".discovery-journey a")].filter(a => a.hash).every(a => !!document.getElementById(a.hash.slice(1)))'), 'All local calls to action resolve');
      let lastTop = -1;
      for (let i = 0; i < 6; i++) {
        await evaluate('document.querySelectorAll(".discovery-step")[' + i + '].scrollIntoView({block:"start",behavior:"instant"})');
        await waitFor('document.querySelectorAll(".discovery-nav a")[' + i + '].getAttribute("aria-current") === "step"');
        const positions = await evaluate('(() => {const a=document.querySelectorAll(".discovery-step")[' + i + '].getBoundingClientRect(); const n=document.querySelector(".discovery-nav").getBoundingClientRect(); return {top:a.top+scrollY, navTop:n.top, navBottom:n.bottom, articleTop:a.top};})()');
        assert.ok(positions.top > lastTop, 'Stages follow reading order');
        lastTop = positions.top;
        assert.ok(positions.navTop >= 0 && positions.navTop < 160, route + ' width ' + width + ' step ' + i + ' navigation: ' + JSON.stringify(positions));
        assert.ok(positions.articleTop >= positions.navBottom - 2, 'Step heading is not covered by navigation');
      }
      await evaluate('document.querySelectorAll(".discovery-nav a")[0].click()');
      await waitFor('location.hash.endsWith("-step-1") && document.querySelectorAll(".discovery-nav a")[0].getAttribute("aria-current") === "step"');
      if (width === 1440 || width === 390) {
        await delay(250);
        const screenshot = await send('Page.captureScreenshot', { format:'png' });
        await writeFile('artifacts/discovery-journey/' + (route === '/' ? 'home' : 'explore') + '-' + width + '.png', Buffer.from(screenshot.data, 'base64'));
      }
    }
  }
  await send('Emulation.setEmulatedMedia', { features: [{name:'prefers-reduced-motion',value:'reduce'}] });
  await send('Page.navigate', {url:base + '/explore#learning-flow-step-4'});
  await waitFor('!!document.querySelector("#learning-flow-step-4")');
  await waitFor('document.querySelectorAll(".discovery-nav a")[3].getAttribute("aria-current") === "step"');
  assert.ok(await evaluate('document.querySelector("#learning-flow-step-4").getBoundingClientRect().top < innerHeight'), 'Direct links reach the requested step');
  await evaluate('document.querySelectorAll(".discovery-nav a")[2].focus()');
  await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
  await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
  await waitFor('location.hash.endsWith("step-3")');
  assert.deepEqual(browserErrors, [], 'No runtime errors');
  console.log('PASS: Home and Explore; six visible sequential stages; 1440/1024/390/320 layouts; sticky navigation, scroll tracking, anchor links, direct entry, keyboard, reduced motion.');
  await send('Browser.close');
} finally {
  ws?.close(); chrome.kill(); await delay(400);
  if (resolve(profile).startsWith(resolve(profilePrefix))) await rm(profile, { recursive: true, force: true, maxRetries: 3 }).catch(() => {});
}
