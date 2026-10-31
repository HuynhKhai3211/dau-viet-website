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
  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
  await send('Page.navigate',{url:base+'/'});
  await waitFor('document.querySelectorAll(".one-page > section").length === 9');
  await evaluate('document.fonts.ready.then(()=>true)');
  const ids=['about','how-it-works','periods','investigation','islands','gamification','team','contact'];
  assert.deepEqual(await evaluate('[...document.querySelectorAll(".one-page > section")].map(el=>el.id)'),['trang-chu',...ids]);
  assert.deepEqual(await evaluate('[...document.querySelectorAll(".header__nav-link")].map(el=>el.hash.slice(1))'),ids);
  assert.equal(await evaluate('document.querySelectorAll("main").length'),1);
  assert.equal(await evaluate('document.querySelectorAll("h1").length'),1);
  assert.equal(await evaluate('document.querySelectorAll("#contact .early-access__form").length'),1);
  assert.equal(await evaluate('document.querySelector(".early-access__form").checkValidity()'),false,'Signup requires an email');
  await evaluate('document.getElementById("early-access-email").value="invalid-email"');
  assert.equal(await evaluate('document.querySelector(".early-access__form").checkValidity()'),false,'Signup rejects invalid email');
  await evaluate('document.getElementById("early-access-email").value="tester@example.com"');
  assert.equal(await evaluate('document.querySelector(".early-access__form").checkValidity()'),true,'Name and device are optional');
  assert.equal(await evaluate('document.querySelectorAll("#early-access-platform option").length'),3);
  await evaluate('document.querySelector(".early-access__form").reset()');
  assert.equal(await evaluate('document.querySelectorAll(".landing-period").length'),4);
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".landing-quote"),"::before").content'),'none');
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".landing-quote"),"::after").content'),'none');
  assert.equal(await evaluate('document.querySelector(".landing-quote").textContent.split(String.fromCharCode(8220)).length-1'),1);
  assert.equal(await evaluate('document.querySelector(".landing-quote").textContent.split(String.fromCharCode(8221)).length-1'),1);
  assert.equal(await evaluate('document.querySelector(".landing-demo-panel").hidden'),false,'Full demo is always visible');
  assert.equal(await evaluate('document.querySelectorAll(".demo-intro").length'),1);
  assert.ok(await evaluate('document.getElementById("about").getBoundingClientRect().height<800'),'Introduction fits one desktop screen');
  assert.ok(await evaluate('document.getElementById("periods").getBoundingClientRect().height<900'),'Four chapters are compact');
  const duplicateIds=await evaluate('(() => {const ids=[...document.querySelectorAll("[id]")].map(el=>el.id);return ids.filter((id,index)=>ids.indexOf(id)!==index);})()');
  assert.deepEqual(duplicateIds,[]);
  await mkdir('artifacts/compact-landing',{recursive:true});
  for(const width of [1440,1280,1024,390,320]){
    await send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width<640});
    for(const id of ids){
      await evaluate('document.getElementById('+JSON.stringify(id)+').scrollIntoView({block:"start",behavior:"instant"})');
      await waitFor('document.querySelector(".header__nav-link--active")?.hash === '+JSON.stringify('#'+id));
      assert.ok(await evaluate('document.documentElement.scrollWidth<=innerWidth'),'No overflow at '+width+' in '+id);
    }
    if(width===1440||width===390){
      await evaluate('document.getElementById("periods").scrollIntoView({block:"start",behavior:"instant"})');
      const shot=await send('Page.captureScreenshot',{format:'png'});
      await writeFile('artifacts/compact-landing/periods-'+width+'.png',Buffer.from(shot.data,'base64'));
    }
  }
  await evaluate('document.querySelector(".landing-period summary").click()');
  assert.equal(await evaluate('document.querySelector(".landing-period details").open'),true);
  for(let i=0;i<3;i++){
    await evaluate('document.querySelectorAll(".landing-island-options button")['+i+'].click()');
    await waitFor('document.querySelectorAll(".landing-island-options button")['+i+'].getAttribute("aria-pressed") === "true"');
  }
  await evaluate('document.querySelector(".landing-open-demo").click()');
  await waitFor('!!document.querySelector(".demo-intro") && !document.querySelector(".landing-demo-panel").hidden');
  await evaluate('document.querySelector(".demo-intro button.btn--primary").click()');
  await waitFor('!!document.querySelector(".tide-interaction")');
  await evaluate('document.querySelectorAll(".clue-tabs button")[1].click()');
  await evaluate('document.getElementById("about").scrollIntoView({behavior:"instant"})');
  assert.equal(await evaluate('document.querySelector(".landing-demo-panel").hidden'),false);
  await evaluate('document.querySelector(".landing-open-demo").click()');
  await waitFor('!document.querySelector(".landing-demo-panel").hidden');
  assert.equal(await evaluate('document.querySelectorAll(".clue-tab--discovered").length'),1,'Section navigation preserves live progress');
  await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await evaluate('document.querySelector(".header__hamburger").click()');
  await waitFor('document.querySelector(".header__hamburger").getAttribute("aria-expanded") === "true"');
  await evaluate('document.querySelectorAll(".header__drawer-link")[7].click()');
  await waitFor('location.hash === "#contact" && document.body.style.position !== "fixed"');
  for(const [path,id] of [['/about','about'],['/explore','investigation'],['/demo','investigation'],['/team','team'],['/contact','contact']]){
    await send('Page.navigate',{url:base+path});
    await waitFor('location.pathname === "/" && !!document.getElementById('+JSON.stringify(id)+')');
    if(path==='/demo')await waitFor('!!document.querySelector(".tide-interaction") && !document.querySelector(".landing-demo-panel").hidden');
  }
  await send('Page.navigate',{url:base+'/#learning-flow-step-4'});
  await waitFor('document.querySelectorAll(".discovery-nav button")[3]?.getAttribute("aria-selected") === "true"');
  assert.deepEqual(browserErrors,[]);
  console.log('PASS: ordered eight-section landing; one quote pair; compact intro and four chapters; five widths; profiles; island previews; always visible demo without losing progress; mobile menu; legacy links and step aliases.');
  await send('Browser.close');
} finally {
  ws?.close(); chrome.kill(); await delay(400);
  if (resolve(profile).startsWith(resolve(profilePrefix))) await rm(profile, { recursive: true, force: true, maxRetries: 3 }).catch(() => {});
}
