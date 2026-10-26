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
    for (let i = 0; i < 60; i++) { if (await evaluate(expression)) return; await delay(100); }
    throw Error('UI did not become ready: ' + expression + '\nErrors: ' + JSON.stringify(browserErrors) + '\nPage: ' + await evaluate('document.body.innerText.slice(0,1000)'));
  };
  const selected = () => evaluate(`Array.from(document.querySelectorAll('.learning-journey__step')).findIndex(el => el.getAttribute('aria-selected') === 'true') + 1`);
  const click = async (selector, index = 0) => {
    await evaluate(`document.querySelectorAll(${JSON.stringify(selector)})[${index}].click()`);
    await delay(80);
  };
  const stablePanelHeight = async viewport => {
    const heights = [];
    for (let index = 0; index < 10; index++) {
      await click('.learning-journey__step', index);
      heights.push(await evaluate(`document.querySelector('.learning-journey__panel').getBoundingClientRect().height`));
    }
    assert.ok(heights.every(height => Math.abs(height - heights[0]) < .5), viewport + ' panel height changes across steps: ' + JSON.stringify(heights));
    console.log(viewport + ' stable panel heights: ' + heights.join(', '));
  };
  const point = async index => {
    await evaluate(`document.querySelectorAll('.learning-journey__step')[${index}].scrollIntoView({block:'center',behavior:'instant'})`);
    return evaluate(`(() => {const r = document.querySelectorAll('.learning-journey__step')[${index}].getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2};})()`);
  };
  const move = ({ x, y }) => send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
  const key = async (key, code = key) => {
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key, code });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key, code });
    await delay(60);
  };
  const screenshot = async name => {
    const clip = await evaluate(`(() => {const r=document.querySelector('.learning-journey').getBoundingClientRect();return {x:r.x+scrollX,y:r.y+scrollY,width:r.width,height:r.height,scale:1};})()`);
    const result = await send('Page.captureScreenshot', { format: 'png', clip, captureBeyondViewport: true });
    await writeFile('artifacts/' + name + '.png', Buffer.from(result.data, 'base64'));
  };

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1100, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: base + '/explore' });
  await waitFor(`document.querySelectorAll('.learning-journey__step').length === 10`);
  await evaluate('document.fonts.ready.then(() => true)');
  await evaluate(`document.querySelector('.learning-journey').scrollIntoView({block:'center',behavior:'instant'})`);
  await delay(450);
  assert.equal(await selected(), 1, 'First step is open by default');
  assert.ok(await evaluate(`document.querySelector('.learning-journey__panel').textContent.includes('Bản đồ cá nhân')`));
  assert.equal(await evaluate(`document.querySelector('.learning-journey__previous').disabled`), true);
  assert.ok(await evaluate(`(() => {const list=document.querySelector('.learning-journey [role=tablist]').getBoundingClientRect(); const panel=document.querySelector('.learning-journey__panel').getBoundingClientRect(); return panel.left >= list.right-1;})()`), 'Desktop details sit to the right of the step list');
  await stablePanelHeight('1440px desktop');
  await click('.learning-journey__step', 0);

  // Actual mouse movement exercises the hover delay and prevents a quick pass from switching content.
  const second = await point(1);
  await move({ x: 2, y: 200 });
  await move(second);
  await delay(70);
  assert.equal(await selected(), 1, 'Hover does not change content immediately');
  await delay(230);
  assert.equal(await selected(), 2, 'Dwelling over a step opens it');
  const panelHeight = await evaluate(`document.querySelector('.learning-journey__panel').getBoundingClientRect().height`);
  await move({ x: 2, y: 200 });
  await delay(300);
  assert.equal(await selected(), 2, 'Leaving the list keeps the content open');
  const third = await point(2);
  await move(third);
  await delay(50);
  await move({ x: 2, y: 200 });
  await delay(250);
  assert.equal(await selected(), 2, 'Leaving before the hover delay cancels the pending step');
  assert.equal(await evaluate(`document.querySelector('.learning-journey__panel').getBoundingClientRect().height`), panelHeight, 'Leaving the steps does not collapse the panel');

  await evaluate(`document.querySelectorAll('.learning-journey__step')[4].focus()`);
  await delay(60);
  assert.equal(await selected(), 5, 'Keyboard focus selects a step immediately');
  await key('ArrowRight');
  assert.equal(await selected(), 6);
  await key('ArrowLeft');
  assert.equal(await selected(), 5);
  await key('End');
  assert.equal(await selected(), 10);
  assert.equal(await evaluate(`document.querySelector('.learning-journey__next').disabled`), true);
  await key('Home');
  assert.equal(await selected(), 1);
  assert.equal(await evaluate(`document.querySelectorAll('.learning-journey__step[tabindex="0"]').length`), 1, 'Tabs have one keyboard entry point');
  await click('.learning-journey__next');
  assert.equal(await selected(), 2);
  await click('.learning-journey__previous');
  assert.equal(await selected(), 1);
  assert.ok(await evaluate(`(() => {const panel=document.querySelector('.learning-journey__panel');return document.getElementById(panel.getAttribute('aria-labelledby'))?.getAttribute('aria-selected') === 'true';})()`), 'Details are associated with the selected tab');
  await mkdir('artifacts', { recursive: true });
  await screenshot('journey-desktop');

  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await send('Emulation.setTouchEmulationEnabled', { enabled: true });
  await delay(200);
  assert.ok(await evaluate(`document.documentElement.scrollWidth <= innerWidth`), 'No horizontal overflow on mobile');
  assert.ok(await evaluate(`(() => {const list=document.querySelector('.learning-journey [role=tablist]').getBoundingClientRect();const panel=document.querySelector('.learning-journey__panel').getBoundingClientRect();return panel.top >= list.bottom-1;})()`), 'Mobile steps appear above the details');
  await evaluate(`document.querySelectorAll('.learning-journey__step')[2].dispatchEvent(new PointerEvent('pointerover', {bubbles:true,pointerType:'touch'}))`);
  await delay(300);
  assert.equal(await selected(), 1, 'Touch pointer entry alone does not select a step');
  await evaluate(`document.querySelectorAll('.learning-journey__step')[2].dispatchEvent(new PointerEvent('pointerout', {bubbles:true,pointerType:'touch'}))`);
  await stablePanelHeight('390px mobile');
  await click('.learning-journey__step', 0);
  const ninth = await point(8);
  await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ ...ninth, radiusX: 3, radiusY: 3, force: 1 }] });
  await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await delay(100);
  assert.equal(await selected(), 9, 'Touch selects a step');
  await screenshot('journey-mobile');
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await click('.learning-journey__next');
  assert.equal(await selected(), 10, 'Reduced motion preserves navigation');
  assert.ok(await evaluate(`document.querySelector('.learning-journey').getAnimations({subtree:true}).every(animation => animation.effect.getTiming().duration <= 1)`), 'Reduced motion removes long content animations');
  assert.deepEqual(browserErrors, [], 'No browser runtime errors');
  console.log('PASS: delayed hover, cancelled hover, persistent details, keyboard tabs, previous/next boundaries, touch, mobile layout and reduced motion.');
  await send('Browser.close');
} finally {
  ws?.close(); chrome.kill(); await delay(400);
  if (resolve(profile).startsWith(resolve(profilePrefix))) await rm(profile, { recursive: true, force: true, maxRetries: 3 }).catch(() => {});
}
