// Run against the Vite dev server: node tests/demoWorkspaceBrowserSmoke.mjs
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const profilePrefix = join(tmpdir(), 'dau-viet-activities-');
const profile = await mkdtemp(profilePrefix);
const chrome = spawn(process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=9368',
  `--user-data-dir=${profile}`, 'about:blank',
], { windowsHide: true, stdio: 'ignore' });
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const base = process.env.SITE_URL || 'http://127.0.0.1:5173';
let ws;
try {
  let tabs;
  for (let i = 0; i < 50; i++) {
    try { tabs = await (await fetch('http://127.0.0.1:9368/json/list')).json(); break; }
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
    for (let i = 0; i < 600; i++) { if (await evaluate(expression)) return; await delay(100); }
    throw Error('UI did not become ready: ' + expression + '\nErrors: ' + JSON.stringify(browserErrors) + '\nPage: ' + await evaluate('document.body.innerText.slice(0,1000)'));
  };
  await send('Page.enable');await send('Runtime.enable');
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await mkdir('artifacts/demo-workspace',{recursive:true});
  for(const width of [1440,390,320]){
    await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<640});
    const journey={currentStage:'CLUE_EXPLORATION',discoveredClues:[],selectedAnswers:{},completedQuestions:[],score:0};
    const source='localStorage.setItem("dau-viet-journey-v1",'+JSON.stringify(JSON.stringify(journey))+');localStorage.setItem("dau-viet-island-v1",JSON.stringify({earned:["tree","house"],placements:[],pending:[]}));';
    const script=await send('Page.addScriptToEvaluateOnNewDocument',{source});
    await send('Page.navigate',{url:base+'/?activities='+width+'#trai-nghiem'});
    await waitFor('!!document.querySelector(".clue-tabs")');
    await send('Page.removeScriptToEvaluateOnNewDocument',{identifier:script.identifier});
    for(const index of [1,2,3]){
      await evaluate('document.querySelectorAll(".clue-tabs button")['+index+'].click()');
      await waitFor('!!document.querySelector(".clue-activity")');
      assert.equal(await evaluate('document.querySelectorAll(".clue-progress-summary__segments .is-complete").length'),index-1,'Opening an activity does not grant points');
      assert.equal(await evaluate('document.querySelector(".clue-activity__actions button").disabled'),true);
      if(index!==2){
        await evaluate('document.querySelectorAll(".clue-activity input")[1].click()');
        await evaluate('document.querySelector(".clue-activity__actions button").click()');
        assert.ok(await evaluate('!!document.querySelector(".clue-activity__feedback:not(.is-success)")'));
        assert.equal(await evaluate('document.querySelectorAll(".clue-progress-summary__segments .is-complete").length'),index-1);
        await evaluate('document.querySelectorAll(".clue-activity__actions button")[1].click()');
        assert.equal(await evaluate('document.querySelector(".clue-activity__actions button").disabled'),true);
      }
      await evaluate('document.querySelectorAll(".clue-activity input")[0].click()');
      await evaluate('document.querySelector(".clue-activity__actions button").click()');
      await waitFor('!!document.querySelector(".clue-activity__feedback.is-success")');
      assert.equal(await evaluate('document.querySelectorAll(".clue-progress-summary__segments .is-complete").length'),index);
      await evaluate('document.querySelector(".clue-activity__actions button").click()');
      assert.equal(await evaluate('JSON.parse(localStorage.getItem("dau-viet-journey-v1")).score'),index*10,'No duplicate points');
      if(index===2){
        await evaluate('document.querySelectorAll(".clue-activity input")[2].click()');
        await evaluate('document.querySelector(".clue-activity__actions button").click()');
        assert.ok(await evaluate('!!document.querySelector(".clue-activity__feedback.is-success")'),'Another viewpoint is valid');
      }
      assert.ok(await evaluate('document.documentElement.scrollWidth<=innerWidth'));
    }
    await evaluate('document.querySelectorAll(".clue-tabs button")[0].click()');
    await waitFor('!!document.querySelector(".tide-controls__slider")');
    assert.equal(await evaluate('document.querySelector(".tide-controls__slider").value'),'85','Tide interaction remains unchanged');
    await waitFor('document.querySelector(".island-reward")?.open');
    await evaluate('document.querySelector(".island-reward__actions button").click()');
    assert.equal(await evaluate('JSON.parse(localStorage.getItem("dau-viet-journey-v1")).score'),40);
    console.log('PASS '+width+': quiz, retry, multiple viewpoints, role play, completion and no duplicate points');
  }
  assert.deepEqual(browserErrors,[]);
  await send('Browser.close');
} finally {
  ws?.close(); chrome.kill(); await delay(400);
  if (resolve(profile).startsWith(resolve(profilePrefix))) await rm(profile, { recursive: true, force: true, maxRetries: 3 }).catch(() => {});
}
