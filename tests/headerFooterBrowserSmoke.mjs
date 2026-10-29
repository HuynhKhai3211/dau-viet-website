// Run against the Vite dev server: node tests/headerFooterBrowserSmoke.mjs
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const profilePrefix = join(tmpdir(), 'dau-viet-reference-');
const profile = await mkdtemp(profilePrefix);
const chrome = spawn(process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=9356',
  `--user-data-dir=${profile}`, 'about:blank',
], { windowsHide: true, stdio: 'ignore' });
const delay = ms => new Promise(r => setTimeout(r, ms));
const base = process.env.SITE_URL || 'http://127.0.0.1:5173';
let ws;
try {
  let tabs;
  for (let i = 0; i < 50; i++) {
    try { tabs = await (await fetch('http://127.0.0.1:9356/json/list')).json(); break; }
    catch { await delay(200); }
  }
  assert.ok(tabs, 'Chrome started');
  ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.addEventListener('open', res, { once: true }); ws.addEventListener('error', rej, { once: true }); });
  let id = 0;
  const pending = new Map();
  const errors = [];
  ws.addEventListener('message', event => {
    const m = JSON.parse(event.data);
    if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.text);
    if (!m.id) return;
    const p = pending.get(m.id);
    if (p) { clearTimeout(p.timer); pending.delete(m.id); m.error ? p.reject(Error(m.error.message)) : p.resolve(m.result); }
  });
  const send = (method, params = {}) => new Promise((res, rej) => {
    const callId = ++id;
    const timer = setTimeout(() => { pending.delete(callId); rej(Error('Timeout: ' + method)); }, 10000);
    pending.set(callId, { resolve: res, reject: rej, timer });
    ws.send(JSON.stringify({ id: callId, method, params }));
  });
  const evaluate = async expression => {
    const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
    return r.result.value;
  };
  const waitFor = async expression => {
    for (let i = 0; i < 70; i++) { if (await evaluate(expression)) return; await delay(100); }
    throw Error('UI did not become ready: ' + expression);
  };
  const navigate = async route => {
    await send('Page.navigate', { url: base + route });
    await waitFor('!!document.querySelector(".ambient-toggle")');
  };
  const clickToggle = async () => {
    const point = await evaluate(`(() => {
      const el = document.querySelector('.ambient-toggle');
      const r = el.getBoundingClientRect();
      const x = r.x + r.width / 2, y = r.y + r.height / 2;
      if (!el.contains(document.elementFromPoint(x, y))) throw Error('Toggle is covered');
      return {x, y};
    })()`);
    await send('Input.dispatchMouseEvent', { type: 'mousePressed', button: 'left', clickCount: 1, ...point });
    await send('Input.dispatchMouseEvent', { type: 'mouseReleased', button: 'left', clickCount: 1, ...point });
    await delay(100);
  };
  const screenshot = async name => {
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    await writeFile('artifacts/ambient/' + name + '.png', Buffer.from(shot.data, 'base64'));
  };


  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
  await mkdir('artifacts/header-footer-reference', { recursive: true });
  const viewport = async width => {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 960, deviceScaleFactor: 1, mobile: width < 600 });
    await delay(200);
  };
  const click = async selector => {
    const point=await evaluate(`(() => {
      const el=document.querySelector(${JSON.stringify(selector)});
      if(!el)throw Error('Missing control: '+${JSON.stringify(selector)});
      const r=el.getBoundingClientRect(), x=r.x+r.width/2, y=r.y+r.height/2;
      if(!el.contains(document.elementFromPoint(x,y)))throw Error('Covered control: '+${JSON.stringify(selector)});
      return{x,y};
    })()`);
    await send('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...point});
    await send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...point});
    await delay(250);
  };
  const capture=async name=>{
    const shot=await send('Page.captureScreenshot',{format:'png'});
    await writeFile('artifacts/header-footer-reference/'+name+'.png',Buffer.from(shot.data,'base64'));
  };
  const checkAnchor=async id=>{
    await waitFor(`!!document.getElementById(${JSON.stringify(id)})`);
    await delay(400);
    const info=await evaluate(`(() => {
      const target=document.getElementById(${JSON.stringify(id)}).getBoundingClientRect();
      return{top:target.top,header:document.querySelector('.header').getBoundingClientRect().bottom,height:innerHeight,fixed:document.body.style.position};
    })()`);
    assert.ok(info.top>=info.header-1,id+': target not covered by fixed header, '+JSON.stringify(info));
    assert.ok(info.top<info.height,id+': target visible, '+JSON.stringify(info));
    assert.notEqual(info.fixed,'fixed','Scroll unlocked');
  };
  const reports=[];
  await navigate('/');
  await evaluate('document.fonts.ready');
  for(const width of [1908,1440,1280,1201,1024,390,320]){
    await viewport(width);
    await evaluate('window.scrollTo({top:0,behavior:"instant"})');
    await delay(500);
    const info=await evaluate(`(() => {
      const nav=document.querySelector('.header__nav');
      const container=document.querySelector('.header__container');
      const links=[...nav.querySelectorAll('a')];
      const sound=document.querySelector('.sound-toggle').getBoundingClientRect();
      const visible=getComputedStyle(nav).display!=='none';
      return{
        overflow:document.documentElement.scrollWidth>innerWidth,
        containerOverflow:container.scrollWidth>container.clientWidth,
        navVisible:visible,
        navFits:!visible||links.at(-1).getBoundingClientRect().right<=sound.left,
        linkCount:links.length,
        footerColumns:getComputedStyle(document.querySelector('.footer__grid')).gridTemplateColumns,
        footerOverflow:document.querySelector('.footer__grid').scrollWidth>document.querySelector('.footer__grid').clientWidth,
        brand:document.querySelector('.header .brand-lockup__name').textContent.trim(),
        cta:document.querySelector('.header__cta').getAttribute('href'),
      };
    })()`);
    assert.equal(info.overflow,false,'No horizontal overflow at '+width);
    assert.equal(info.containerOverflow,false,'Header contents fit at '+width);
    assert.equal(info.navFits,true,'Navigation leaves room for controls at '+width);
    assert.equal(info.navVisible,width>1200);
    assert.equal(info.footerOverflow,false,'Footer columns fit at '+width);
    assert.equal(info.linkCount,7);
    assert.equal(info.cta,'/demo');
    await capture('header-'+width);
    await evaluate('document.querySelector(".footer").scrollIntoView({block:"start",behavior:"instant"})');
    await delay(300);
    if([1908,1440,390,320].includes(width)){
      const box=await evaluate(`(() => {const r=document.querySelector('.footer').getBoundingClientRect();return{x:0,y:r.top+scrollY,width:innerWidth,height:r.height,scale:1};})()`);
      const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:box});
      await writeFile('artifacts/header-footer-reference/footer-'+width+'.png',Buffer.from(shot.data,'base64'));
    }
    if(width<=1200){
      await click('.header__hamburger');
      await waitFor('document.querySelector(".header__drawer").classList.contains("header__drawer--open")');
      await capture('drawer-'+width);
      await click('.header__drawer-close');
      await waitFor('document.body.style.position!=="fixed"');
    }
    reports.push({width,...info});
  }

  await viewport(1440);
  await navigate('/about');
  await click('.header__nav a[href="/explore#learning-flow"]');
  await checkAnchor('learning-flow');
  assert.equal(await evaluate('document.querySelectorAll(".header__nav-link--active").length'),1);
  await click('.header__nav a[href="/explore#historical-timeline"]');
  await checkAnchor('historical-timeline');
  assert.equal(await evaluate('document.querySelectorAll(".header__nav-link--active").length'),1);
  await click('.header__nav a[href="/explore#personal-island"]');
  await checkAnchor('personal-island');
  await click('.header__nav a[href="/#tinh-nang"]');
  await checkAnchor('tinh-nang');
  await click('.header__nav a[href="/#faq"]');
  await waitFor('document.getElementById("faq").open');
  await checkAnchor('faq');
  await capture('faq-desktop');
  await click('#faq > summary');
  assert.equal(await evaluate('document.getElementById("faq").open'),false);
  await click('.header__nav a[href="/#faq"]');
  await waitFor('document.getElementById("faq").open');
  await navigate('/explore#historical-timeline');
  await checkAnchor('historical-timeline');

  await viewport(390);
  await navigate('/');
  await click('.header__hamburger');
  await click('.header__drawer a[href="/explore#learning-flow"]');
  await waitFor('!document.querySelector(".header__drawer").classList.contains("header__drawer--open")');
  await checkAnchor('learning-flow');
  await click('.header__hamburger');
  await click('.header__drawer a[href="/#faq"]');
  await waitFor('document.getElementById("faq").open && document.body.style.position!=="fixed"');
  await checkAnchor('faq');
  await capture('faq-mobile');

  await click('.header__hamburger');
  await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
  await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
  await waitFor('document.body.style.position!=="fixed"');
  await delay(250);
  await click('.header__hamburger');
  await viewport(1440);
  await waitFor('!document.querySelector(".header__drawer").classList.contains("header__drawer--open") && document.body.style.position!=="fixed"');

  await clickToggle();
  await waitFor('document.querySelector(".ambient-background").hidden');
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".header > .heritage-surface__shine"),"::before").animationName'),'none');
  await clickToggle();
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await waitFor('document.querySelector(".ambient-toggle").disabled');
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".header > .heritage-surface__shine")).display'),'none');
  assert.deepEqual(errors,[],'No browser runtime errors');
  console.log(JSON.stringify(reports,null,2));
  console.log('PASS: reference header/footer layouts across 7 widths, all section links and direct hash loads, exclusive active links, accessible FAQ, mobile navigation and scroll restoration, Escape and resize, motion controls.');
} finally {
  ws?.close();
  chrome.kill();
  await delay(400);
  if (resolve(profile).startsWith(resolve(profilePrefix))) await rm(profile, { recursive: true, force: true, maxRetries: 3 }).catch(() => {});
}
