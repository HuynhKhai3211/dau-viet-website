// Run against the Vite dev server: node tests/mobileBrowserSmoke.mjs
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const profile = await mkdtemp(join(tmpdir(), 'dau-viet-mobile-'));
const chrome = spawn(process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=9345',
  `--user-data-dir=${profile}`, 'about:blank',
], { windowsHide: true, stdio: 'ignore' });
const delay = ms => new Promise(r => setTimeout(r, ms));
const base = process.env.SITE_URL || 'http://127.0.0.1:5173';
let ws;
try {
  let tabs;
  for (let i = 0; i < 50; i++) {
    try { tabs = await (await fetch('http://127.0.0.1:9345/json/list')).json(); break; } catch { await delay(200); }
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
  const send = (method, params = {}) => new Promise((res, rej) => {
    const callId = ++id;
    const timer = setTimeout(() => { pending.delete(callId); rej(Error(`Timeout: ${method}`)); }, 15000);
    pending.set(callId, { resolve: res, reject: rej, timer });
    ws.send(JSON.stringify({ id: callId, method, params }));
  });
  const evaluate = async expression => {
    const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
    return r.result.value;
  };
  const waitFor = async expression => {
    for (let i = 0; i < 60; i++) { if (await evaluate(expression)) return; await delay(100); }
    throw Error('UI did not become ready: ' + expression);
  };
  const navigate = async route => {
    await send('Page.navigate', { url: base + route });
    await waitFor('!!document.querySelector(".main-content > :last-child") && document.readyState === "complete"');
    await evaluate('document.fonts.ready');
    await delay(150);
  };
  const viewport = async (width, height = 844) => {
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width <= 900 });
    await send('Emulation.setTouchEmulationEnabled', { enabled: width <= 900 });
  };
  const tap = async (selector, index = 0) => {
    const point = await evaluate(`(() => {
      const el = document.querySelectorAll(${JSON.stringify(selector)})[${index}];
      if (!el || el.disabled) throw Error('Missing or disabled: ' + ${JSON.stringify(selector)});
      el.scrollIntoView({block:'center',behavior:'instant'});
      const r = el.getBoundingClientRect();
      const x = r.x + r.width / 2, y = r.y + r.height / 2;
      if (!el.contains(document.elementFromPoint(x,y))) throw Error('Covered control: ' + ${JSON.stringify(selector)});
      return {x,y};
    })()`);
    await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [point] });
    await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await delay(260);
  };
  const layout = async (name, width) => {
    const info = await evaluate(`(() => {
      const elements = [...document.querySelectorAll('main button,main a,main input,main h1,main h2,main h3,main p')];
      const overflow = elements.filter(el => {
        const r = el.getBoundingClientRect(), s = getComputedStyle(el);
        return r.width && r.height && s.visibility !== 'hidden' && s.opacity !== '0' && !el.closest('[aria-hidden="true"]') && (r.left < -1 || r.right > ${width} + 1);
      }).map(el => ({class:el.className,text:el.textContent.slice(0,50)}));
      return {width:innerWidth,scrollWidth:document.documentElement.scrollWidth,overflow};
    })()`);
    assert.equal(info.width, width, name + ': viewport must not auto-expand');
    assert.ok(info.scrollWidth <= width, name + ': no page overflow');
    assert.deepEqual(info.overflow, [], name + ': text and controls stay visible');
  };
  const noOverlap = async selector => {
    const overlaps = await evaluate(`(() => {
      const found=[];
      for (const row of document.querySelectorAll(${JSON.stringify(selector)})) {
        const children=[...row.children].filter(el=>{const r=el.getBoundingClientRect();return r.width && r.height && getComputedStyle(el).position!=='absolute';});
        for(let i=0;i<children.length;i++) for(let j=i+1;j<children.length;j++) {
          const a=children[i].getBoundingClientRect(),b=children[j].getBoundingClientRect();
          if(Math.min(a.right,b.right)-Math.max(a.left,b.left)>1 && Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1) found.push([children[i].className,children[j].className]);
        }
      }
      return found;
    })()`);
    assert.deepEqual(overlaps, [], selector + ': sibling content must not overlap');
  };
  const screenshot = async name => {
    const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    await writeFile('artifacts/mobile/' + name + '.png', Buffer.from(shot.data, 'base64'));
  };
  await send('Page.enable');
  await send('Runtime.enable');
  await mkdir('artifacts/mobile', { recursive: true });

  const routes = ['/', '/about', '/explore', '/demo', '/team', '/contact', '/missing'];
  const stages = ['INTRO', 'CLUE_EXPLORATION', 'HYPOTHESIS', 'VERIFICATION', 'RECONSTRUCTION', 'RESULTS'];
  const stageRows = '.hypothesis-stage__header,.verification-banner,.reconstruction-stage__header,.reconstruction-item,.clue-detail-panel__header';
  const interactionsOnly = process.argv.includes('--interactions-only');
  for (const width of (interactionsOnly ? [] : [320, 360, 390, 430, 768])) {
    await viewport(width);
    for (const route of routes) { await navigate(route); await layout(route, width); }
    for (const stage of stages) {
      await evaluate(`localStorage.setItem('dau-viet-journey-v1',JSON.stringify({currentStage:'${stage}',discoveredClues:['thuy-trieu','bai-coc','dia-hinh','chien-thuat']}))`);
      await navigate('/demo');
      await layout(stage, width);
      await noOverlap(stageRows);
      if (stage === 'CLUE_EXPLORATION') {
        for (let i = 0; i < 4; i++) {
          await tap('.clue-tabs button', i);
          await layout('clue ' + i, width);
          await noOverlap(stageRows);
        }
      }
      if (width === 390) await screenshot(stage.toLowerCase() + '-verified');
    }
    await tap('.demo-experience-tabs button', 1);
    await layout('Island', width);
    await evaluate('localStorage.clear()');
    console.log('PASS: mobile layouts at ' + width + 'px.');
  }
  if (!interactionsOnly) console.log('PASS: 7 routes, all 6 demo stages, 4 clues and island at 320/360/390/430/768px.');

  // Real touch events catch overlays that programmatic clicks bypass.
  await viewport(390);
  await navigate('/');
  await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 195, y: 700 }] });
  for (let y = 680; y >= 280; y -= 20) {
    await send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 195, y }] });
    await delay(20);
  }
  await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await waitFor('scrollY > 100');
  // Let native momentum settle before tapping the fixed header.
  await delay(700);
  const previousScroll = await evaluate('scrollY');
  await tap('.header__hamburger');
  assert.equal(await evaluate('document.body.style.position'), 'fixed');
  const drawer = await evaluate(`(() => { const r=document.querySelector('.header__drawer').getBoundingClientRect();return {top:r.top,height:r.height}; })()`);
  assert.equal(drawer.top, 0, 'Drawer remains anchored to viewport after scrolling');
  assert.equal(drawer.height, 844, 'Drawer covers the whole viewport');
  await tap('.header__drawer-close');
  assert.ok(Math.abs(await evaluate('scrollY') - previousScroll) < 2, 'Closing menu preserves scroll');
  await tap('.header__hamburger');
  await tap('.header__drawer-contact[href="/contact"]');
  await waitFor('location.pathname === "/contact" && document.body.style.position !== "fixed"');
  assert.equal(await evaluate('scrollY'), 0, 'Menu navigation starts at top');
  await tap('.header__hamburger');
  await viewport(1280);
  await waitFor('document.body.style.position !== "fixed"');
  assert.equal(await evaluate('document.querySelector(".header__hamburger").getAttribute("aria-expanded")'), 'false');

  // Short landscape view: the complete menu remains reachable by scrolling.
  await viewport(844, 390);
  await navigate('/');
  await tap('.header__hamburger');
  await tap('.header__drawer-cta');
  await waitFor('location.pathname === "/demo" && document.body.style.position !== "fixed"');
  await viewport(390);
  await navigate('/demo');
  await tap('.demo-intro__start-btn');
  await tap('.tide-interaction__toggle-btn', 1);
  assert.equal(await evaluate('document.querySelector(".tide-controls__slider").value'), '18');
  await tap('.tide-controls__slider');
  assert.ok(Number(await evaluate('document.querySelector(".tide-controls__slider").value')) > 35, 'Range responds to touch');
  await tap('.tide-zoom');
  await tap('.tide-zoom');
  await screenshot('tide-touch-verified');
  console.log('PASS: touch scrolling, viewport drawer, scroll restoration, navigation, rotation, landscape menu and tide controls.');

  // Prove the mobile stylesheet changes no desktop computed styles.
  for (const width of [1024, 1440]) {
    await viewport(width);
    for (const route of ['/', '/explore', '/demo']) {
      await navigate(route);
      await delay(1100);
      const changed = await evaluate(`(() => {
        document.getAnimations().forEach(a=>a.pause());
        const sheet=[...document.styleSheets].find(s=>s.ownerNode?.dataset.viteDevId?.endsWith('/styles/mobile.css'));
        if(!sheet) throw Error('Mobile stylesheet not found');
        const els=[...document.querySelectorAll('body *')];
        const styles=()=>els.map(el=>{const s=getComputedStyle(el);return [...s].map(k=>s.getPropertyValue(k)).join('|');});
        const before=styles(); sheet.disabled=true; const after=styles(); sheet.disabled=false;
        return els.filter((el,i)=>before[i]!==after[i]).map(el=>el.className);
      })()`);
      assert.deepEqual(changed, [], route + ' at ' + width + ': desktop computed styles unchanged');
    }
  }
  assert.deepEqual(browserErrors, [], 'No browser runtime errors');
  console.log('PASS: desktop computed styles identical at 1024px and 1440px; no runtime errors.');
} finally {
  ws?.close(); chrome.kill(); await delay(400);
  await rm(profile, { recursive: true, force: true, maxRetries: 3 }).catch(() => {});
}
