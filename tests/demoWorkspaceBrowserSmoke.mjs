// Run against the Vite dev server: node tests/demoWorkspaceBrowserSmoke.mjs
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const profilePrefix = join(tmpdir(), 'dau-viet-workspace-');
const profile = await mkdtemp(profilePrefix);
const chrome = spawn(process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=9367',
  `--user-data-dir=${profile}`, 'about:blank',
], { windowsHide: true, stdio: 'ignore' });
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const base = process.env.SITE_URL || 'http://127.0.0.1:5173';
let ws;
try {
  let tabs;
  for (let i = 0; i < 50; i++) {
    try { tabs = await (await fetch('http://127.0.0.1:9367/json/list')).json(); break; }
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
  const viewports=[[1920,900],[1440,900],[1366,768],[390,844],[320,740],[390,667]];
  const cases=[['INTRO','.demo-intro__start-btn'],['CLUE_EXPLORATION','.clue-exploration__next-btn'],['HYPOTHESIS','.hypothesis-stage__submit-btn'],['VERIFICATION','.verification-stage__next-btn'],['RECONSTRUCTION','.reconstruction-stage__check-btn'],['RESULTS','.demo-results__actions']];
  for(const [width,height] of viewports){
    await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<640});
    for(const [stage,action] of cases.filter(([stage]) => !process.env.WORKSPACE_STAGE || stage === process.env.WORKSPACE_STAGE)){
      const marker=stage+'-'+width+'-'+height;
      const journey={currentStage:stage,selectedAnswers:{q1:'q1b',q2:'q2c'},completedQuestions:stage==='HYPOTHESIS'?[]:['q1','q2'],discoveredClues:['thuy-trieu','ngo-quyen','dia-hinh','nam-han'],score:40,reconstructionOrder:['event-2','event-4','event-1','event-3']};
      const island={earned:['tree','house','stakes','boat','flag'],placements:[],pending:[]};
      const source='localStorage.setItem("dau-viet-journey-v1",'+JSON.stringify(JSON.stringify(journey))+');localStorage.setItem("dau-viet-island-v1",'+JSON.stringify(JSON.stringify(island))+');window.__workspaceCase='+JSON.stringify(marker)+';';
      const script=await send('Page.addScriptToEvaluateOnNewDocument',{source});
      await send('Page.navigate',{url:base+'/?workspace='+marker+'#trai-nghiem'});
      await waitFor('window.__workspaceCase === '+JSON.stringify(marker)+' && !!document.querySelector('+JSON.stringify(action)+')');
      await send('Page.removeScriptToEvaluateOnNewDocument',{identifier:script.identifier});
      await evaluate('document.fonts.ready.then(()=>true)');
      await evaluate('document.querySelector(".demo-workspace").scrollIntoView({block:"start",behavior:"instant"})');
      await delay(100);
      const metrics=await evaluate('(() => {const r=document.querySelector('+JSON.stringify(action)+').getBoundingClientRect();return {top:r.top,bottom:r.bottom,height:innerHeight,stage:document.querySelector(".demo-stage-container").getBoundingClientRect().height};})()');
      assert.ok(metrics.top>=70&&metrics.bottom<=height+2,marker+' action outside screen '+JSON.stringify(metrics));
      assert.ok(await evaluate('(() => {const el=document.querySelector('+JSON.stringify(action)+');const r=el.getBoundingClientRect();return el.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2));})()'),marker+' action is covered');
      assert.ok(await evaluate('document.documentElement.scrollWidth<=innerWidth'),'No overflow '+marker);
      if(stage==='CLUE_EXPLORATION'){
        const scene=await evaluate('document.querySelector(".tide-battle-scene").getBoundingClientRect().toJSON()');
        const slider=await evaluate('document.querySelector(".tide-controls__slider").getBoundingClientRect().toJSON()');
        assert.ok(scene.top>=70&&scene.bottom<=height&&slider.top>=70&&slider.bottom<=height,marker+' image and slider not together '+JSON.stringify({scene,slider}));
        assert.equal(await evaluate('document.querySelector(".river-artwork").getAttribute("preserveAspectRatio")'),'xMidYMid meet','Full scene is visible without cropping');
        assert.ok(await evaluate('(() => {const el=document.querySelector(".tide-controls__slider");const r=el.getBoundingClientRect();return el===document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);})()'),marker+' slider is clipped or covered');
      }
      if(stage==='HYPOTHESIS'){
        assert.equal(await evaluate('document.querySelectorAll(".hypothesis-card:not([hidden])").length'),1);
        const confirm=await evaluate('document.querySelector(".question-reward-confirm:not([hidden]) button").getBoundingClientRect().toJSON()');
        assert.ok(confirm.top>=70&&confirm.bottom<=height,marker+' reward button outside screen');
      }
      if(['CLUE_EXPLORATION','HYPOTHESIS'].includes(stage)&&(width===1440||width===390&&height===844)){
        const shot=await send('Page.captureScreenshot',{format:'png'});await writeFile('artifacts/demo-workspace/'+stage+'-'+width+'.png',Buffer.from(shot.data,'base64'));
      }
      console.log(marker+' action visible; stage '+Math.round(metrics.stage)+'px');
    }
  }
  assert.deepEqual(browserErrors,[]);
  console.log('PASS: all six stages keep actions in view; image and tide slider visible together; reward confirmation reachable; five viewports; no runtime errors.');
  await send('Browser.close');
} finally {
  ws?.close(); chrome.kill(); await delay(400);
  if (resolve(profile).startsWith(resolve(profilePrefix))) await rm(profile, { recursive: true, force: true, maxRetries: 3 }).catch(() => {});
}
