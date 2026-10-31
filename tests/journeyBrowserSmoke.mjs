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
    const timer = setTimeout(() => { pending.delete(callId); reject(Error('Timeout: ' + method)); }, 30000);
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
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await mkdir('artifacts/discovery-tabs',{recursive:true});
  for(const width of [1440,1024,390,320]){
    await send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width<640});
    await send('Page.navigate',{url:base+'/#learning-flow'});
    await waitFor('document.querySelectorAll(".discovery-nav [role=tab]").length === 6');
    await evaluate('document.fonts.ready.then(()=>true)');
    await evaluate('document.querySelector(".discovery-nav").scrollIntoView({block:"start",behavior:"instant"})');
    for(let index=0;index<6;index++){
      const scrollBefore=await evaluate('scrollY');
      await evaluate('document.querySelectorAll(".discovery-nav button")['+index+'].click()');
      await waitFor('document.querySelectorAll(".discovery-nav button")['+index+'].getAttribute("aria-selected") === "true"');
      assert.equal(await evaluate('document.querySelectorAll(".discovery-step:not([hidden])").length'),1,'Only one stage is visible');
      assert.equal(await evaluate('document.querySelector(".discovery-step:not([hidden])").dataset.step'),String(index));
      assert.equal(await evaluate('document.querySelector(".discovery-nav [aria-selected=true]").getAttribute("aria-controls")'),await evaluate('document.querySelector(".discovery-step:not([hidden])").id'));
      assert.ok(await evaluate('[...document.querySelectorAll(".discovery-step[hidden]")].every(el=>getComputedStyle(el).display === "none")'));
      assert.ok(Math.abs(await evaluate('scrollY')-scrollBefore)<3,'Selecting a tab does not scroll the page');
      assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'),'No overflow at '+width);
    }
    await evaluate('document.querySelectorAll(".discovery-nav button")[0].click()');
    await evaluate('document.querySelector(".discovery-step:not([hidden]) .discovery-next").click()');
    await waitFor('document.querySelectorAll(".discovery-nav button")[1].getAttribute("aria-selected") === "true"');
    await evaluate('document.querySelectorAll(".discovery-nav button")[0].focus({preventScroll:true})');
    for(const [key,index] of [['ArrowRight',1],['End',5],['ArrowRight',0],['ArrowLeft',5],['Home',0]]){
      await send('Input.dispatchKeyEvent',{type:'keyDown',key,code:key});
      await send('Input.dispatchKeyEvent',{type:'keyUp',key,code:key});
      await waitFor('document.querySelectorAll(".discovery-nav button")['+index+'].getAttribute("aria-selected") === "true"');
      assert.ok(await evaluate('document.activeElement === document.querySelectorAll(".discovery-nav button")['+index+']'));
    }
    if(width===1440||width===390){
      const shot=await send('Page.captureScreenshot',{format:'png'});
      await writeFile('artifacts/discovery-tabs/tabs-'+width+'.png',Buffer.from(shot.data,'base64'));
    }
  }
  await send('Page.navigate',{url:base+'/explore#learning-flow-step-4'});
  await waitFor('location.pathname === "/" && document.querySelectorAll(".discovery-nav button")[3]?.getAttribute("aria-selected") === "true"');
  assert.equal(await evaluate('document.querySelector(".discovery-step:not([hidden])").id'),'learning-flow-step-4','Old direct links open their matching tab');
  assert.deepEqual(browserErrors,[],'No runtime errors');
  console.log('PASS: six tabs; exactly one matching panel visible; no scroll jump; four viewport sizes; next button; keyboard arrows/Home/End; direct legacy links.');
  await send('Browser.close');
} finally {
  ws?.close(); chrome.kill(); await delay(400);
  if (resolve(profile).startsWith(resolve(profilePrefix))) await rm(profile, { recursive: true, force: true, maxRetries: 3 }).catch(() => {});
}
