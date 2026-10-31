// Run against the Vite dev server: node tests/journeyBrowserSmoke.mjs
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const profilePrefix = join(tmpdir(), 'dau-viet-one-page-');
const profile = await mkdtemp(profilePrefix);
const chrome = spawn(process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=9360',
  `--user-data-dir=${profile}`, 'about:blank',
], { windowsHide: true, stdio: 'ignore' });
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const base = process.env.SITE_URL || 'http://127.0.0.1:5173';
let ws;
try {
  let tabs;
  for (let i = 0; i < 50; i++) {
    try { tabs = await (await fetch('http://127.0.0.1:9360/json/list')).json(); break; }
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
  await send('Emulation.setEmulatedMedia', {features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
  await send('Page.navigate',{url:base + '/'});
  await waitFor('document.querySelectorAll(".one-page > section").length === 6');
  await evaluate('document.fonts.ready.then(() => true)');
  await delay(300);
  assert.equal(await evaluate('scrollY'),0,'Fresh load stays at home rather than jumping to demo');
  const ids=['trang-chu','gioi-thieu','kham-pha','trai-nghiem','doi-ngu','lien-he'];
  assert.deepEqual(await evaluate('[...document.querySelectorAll(".one-page > section")].map(el=>el.id)'),ids);
  assert.equal(await evaluate('document.querySelectorAll("main").length'),1);
  assert.equal(await evaluate('document.querySelectorAll("h1").length'),1);
  const duplicateIds=await evaluate('(() => {const ids=[...document.querySelectorAll("[id]")].map(el=>el.id);return ids.filter((id,index)=>ids.indexOf(id)!==index);})()');
  assert.deepEqual(duplicateIds,[], 'One-page sections have unique IDs');
  for(const width of [1440,1024,390,320]){
    await send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width<640});
    for(const id of ids){
      await evaluate('document.getElementById('+JSON.stringify(id)+').scrollIntoView({block:"start",behavior:"instant"})');
      await waitFor('document.querySelector(".header__nav-link--active").hash === '+JSON.stringify('#'+id));
      assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'), 'No overflow at '+width+' in '+id);
    }
  }
  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
  await evaluate('document.querySelectorAll(".header__nav-link")[3].click()');
  await waitFor('location.hash === "#trai-nghiem"');
  await evaluate('document.querySelector(".demo-intro button.btn--primary").click()');
  await waitFor('!!document.querySelector(".tide-interaction")');
  assert.ok(await evaluate('scrollY > document.getElementById("trai-nghiem").offsetTop - 300'),'Demo stage changes stay within experience section');
  await evaluate('document.querySelectorAll(".clue-tabs button")[1].click()');
  await evaluate('document.querySelectorAll(".header__nav-link")[4].click()');
  await waitFor('location.hash === "#doi-ngu"');
  await evaluate('document.querySelectorAll(".header__nav-link")[3].click()');
  await waitFor('location.hash === "#trai-nghiem"');
  assert.equal(await evaluate('document.querySelectorAll(".clue-tab--discovered").length'),1,'Anchor navigation preserves live demo state');
  await evaluate('document.getElementById("doi-ngu").scrollIntoView({block:"start",behavior:"instant"})');
  await evaluate('document.querySelectorAll(".header__nav-link")[3].click()');
  await waitFor('Math.abs(document.getElementById("trai-nghiem").getBoundingClientRect().top - 112) < 35');
  await mkdir('artifacts/one-page',{recursive:true});
  await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await evaluate('document.querySelector(".header__hamburger").click()');
  await waitFor('document.querySelector(".header__hamburger").getAttribute("aria-expanded") === "true"');
  await evaluate('document.querySelectorAll(".header__drawer-link")[5].click()');
  await waitFor('location.hash === "#lien-he" && document.querySelector(".header__hamburger").getAttribute("aria-expanded") === "false"');
  await delay(200);
  assert.ok(await evaluate('Math.abs(document.getElementById("lien-he").getBoundingClientRect().top - 92) < 35'),'Mobile drawer closes and reaches contact without jumping to home');
  assert.equal(await evaluate('document.body.style.position'),'');
  const shot=await send('Page.captureScreenshot',{format:'png'});
  await writeFile('artifacts/one-page/contact-mobile.png',Buffer.from(shot.data,'base64'));
  await evaluate('document.querySelector(".header__logo").click()');
  await waitFor('location.hash === "#trang-chu" && scrollY < 10');
  for(const [path,id] of [['/about','gioi-thieu'],['/explore','kham-pha'],['/demo','trai-nghiem'],['/team','doi-ngu'],['/contact','lien-he']]){
    await send('Page.navigate',{url:base+path});
    await waitFor('location.pathname === "/" && location.hash === '+JSON.stringify('#'+id)+' && !!document.getElementById('+JSON.stringify(id)+')');
    await waitFor('document.querySelector(".header__nav-link--active").hash === '+JSON.stringify('#'+id));
  }
  await send('Page.navigate',{url:base+'/#learning-flow-step-4'});
  await waitFor('!!document.querySelector("#learning-flow-step-4") && document.querySelectorAll(".discovery-nav a")[3].getAttribute("aria-current") === "step"');
  assert.deepEqual(browserErrors,[],'No runtime errors across the full one-page flow');
  console.log('PASS: six ordered sections; home load; single main and h1; unique IDs; 1440/1024/390/320; active navigation; mobile drawer scroll; demo state retained; legacy redirects; direct step links.');
  await send('Browser.close');
} finally {
  ws?.close(); chrome.kill(); await delay(400);
  if (resolve(profile).startsWith(resolve(profilePrefix))) await rm(profile, { recursive: true, force: true, maxRetries: 3 }).catch(() => {});
}
