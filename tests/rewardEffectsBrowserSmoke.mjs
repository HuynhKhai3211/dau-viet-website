// Run against the Vite dev server: node tests/rewardEffectsBrowserSmoke.mjs
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const profilePrefix = join(tmpdir(), 'dau-viet-reward-');
const profile = await mkdtemp(profilePrefix);
const chrome = spawn(process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=9366',
  `--user-data-dir=${profile}`, 'about:blank',
], { windowsHide: true, stdio: 'ignore' });
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const base = process.env.SITE_URL || 'http://127.0.0.1:5173';
let ws;
try {
  let tabs;
  for (let i = 0; i < 50; i++) {
    try { tabs = await (await fetch('http://127.0.0.1:9366/json/list')).json(); break; }
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
  await send('Page.enable');await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
  await mkdir('artifacts/reward-effects',{recursive:true});
  for(const scenario of [{name:'fresh',owned:false,completed:false},{name:'owned',owned:true,completed:false},{name:'completed',owned:true,completed:true}]){
    const island={earned:scenario.owned?['tree','house','boat']:['tree','house'],placements:[],pending:[]};
    const journey={currentStage:'HYPOTHESIS',selectedAnswers:{q1:'q1b'},completedQuestions:scenario.completed?['q1']:[],discoveredClues:['thuy-trieu','ngo-quyen','dia-hinh','nam-han'],score:40};
    const source='localStorage.setItem("dau-viet-island-v1",'+JSON.stringify(JSON.stringify(island))+');localStorage.setItem("dau-viet-journey-v1",'+JSON.stringify(JSON.stringify(journey))+');window.__rewardCase='+JSON.stringify(scenario.name)+';';
    const script=await send('Page.addScriptToEvaluateOnNewDocument',{source});
    await send('Page.navigate',{url:base+'/?reward-case='+scenario.name+'#trai-nghiem'});
    await waitFor('window.__rewardCase === '+JSON.stringify(scenario.name)+' && !!document.querySelector(".question-reward-confirm button")');
    await send('Page.removeScriptToEvaluateOnNewDocument',{identifier:script.identifier});
    await evaluate('document.querySelectorAll(".question-page-nav button")[0].click()');
    assert.equal(await evaluate('document.querySelector(".question-reward-confirm button").disabled'),false);
    await evaluate('document.querySelector(".question-reward-confirm button").click()');
    await waitFor('document.querySelector(".island-reward")?.open');
    const state=await evaluate('({island:JSON.parse(localStorage.getItem("dau-viet-island-v1")),journey:JSON.parse(localStorage.getItem("dau-viet-journey-v1"))})');
    assert.equal(state.island.earned.filter(id=>id==='boat').length,1,'No duplicate ownership');
    assert.deepEqual(state.journey.completedQuestions,['q1'],'No duplicate completion');
    assert.equal(state.journey.score,40,'Viewing rewards does not add score');
    assert.deepEqual(state.island.pending,scenario.owned?[]:['boat']);
    assert.equal(await evaluate('getComputedStyle(document.querySelector(".island-reward__art")).animationName'),'island-gift-pop');
    assert.equal(await evaluate('document.querySelectorAll(".island-reward__burst span").length'),14);
    if(scenario.name==='fresh'){
      const shot=await send('Page.captureScreenshot',{format:'png'});await writeFile('artifacts/reward-effects/fresh-desktop.png',Buffer.from(shot.data,'base64'));
    }
    await evaluate('document.querySelector(".island-reward__actions button").click()');
    await waitFor('!document.querySelector(".island-reward").open');
    if(scenario.name==='fresh'){
      await evaluate('document.querySelector(".hypothesis-stage__submit-btn").click()');
      await waitFor('document.querySelectorAll(".question-page-nav button")[1].getAttribute("aria-pressed") === "true"');
      assert.equal(await evaluate('document.querySelector(".hypothesis-stage__submit-btn").disabled'),true,'Next question requires confirmation');
      await evaluate('document.querySelectorAll(".question-page-nav button")[0].click()');
    }
    await evaluate('document.querySelector(".question-reward-confirm button").click()');
    await waitFor('document.querySelector(".island-reward").open');
    assert.equal(await evaluate('JSON.parse(localStorage.getItem("dau-viet-island-v1")).pending.length'),0,'Replay does not enqueue another gift');
    await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
    await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
    await waitFor('!document.querySelector(".island-reward").open');
  }
  await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await evaluate('document.querySelector(".question-reward-confirm button").click()');
  await waitFor('document.querySelector(".island-reward").open');
  assert.ok(await evaluate('document.documentElement.scrollWidth<=innerWidth'));
  const shot=await send('Page.captureScreenshot',{format:'png'});await writeFile('artifacts/reward-effects/replay-mobile.png',Buffer.from(shot.data,'base64'));
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".island-reward__art")).animationName'),'none');
  await evaluate('document.querySelectorAll(".island-reward__actions button")[1].click()');
  await waitFor('!!document.querySelector(".island-scene") && !document.querySelector(".island-reward").open');
  assert.equal(await evaluate('document.querySelectorAll(".decor-card--selected").length'),1,'Replayed gift can be selected for decorating');
  assert.deepEqual(browserErrors,[]);
  console.log('PASS: fresh reward, owned reward after replay, previously completed question, visual gift animation, repeat viewing, no duplicate gifts/points, Escape, mobile, reduced motion and decorate action.');
  await send('Browser.close');
} finally {
  ws?.close(); chrome.kill(); await delay(400);
  if (resolve(profile).startsWith(resolve(profilePrefix))) await rm(profile, { recursive: true, force: true, maxRetries: 3 }).catch(() => {});
}
