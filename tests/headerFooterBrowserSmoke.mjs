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


const baseline={"nav":[{"label":"Trang chủ","path":"/"},{"label":"Giới thiệu","path":"/about"},{"label":"Khám phá","path":"/explore"},{"label":"Trải nghiệm","path":"/demo"},{"label":"Đội ngũ","path":"/team"},{"label":"Liên hệ","path":"/contact"}],"links":[{"label":"Trang chủ","path":"/"},{"label":"Giới thiệu dự án","path":"/about"},{"label":"Khám phá thời kỳ","path":"/explore"},{"label":"Trải nghiệm tương tác","path":"/demo"},{"label":"Đội ngũ phát triển","path":"/team"},{"label":"Liên hệ đóng góp","path":"/contact"},{"label":"Phòng suy luận lịch sử","path":"/explore"},{"label":"Bản đồ di sản tương tác","path":"/explore"},{"label":"Tái hiện các trận chiến hào hùng","path":"/demo"},{"label":"Hệ thống thu thập dấu vết","path":"/demo"},{"label":"Kho tư liệu thời đại","path":"/about"}],"cta":"Trải nghiệm ngay","description":"Dấu Việt là nền tảng số hóa và giáo dục lịch sử Việt Nam tương tác. \n              Chúng tôi đưa người học vào hành trình khám phá quá khứ qua thu thập chứng cứ, \n              suy luận bối cảnh và tái hiện những thời khắc vẻ vang của dân tộc.","socials":["https://www.facebook.com/dauviet05","https://youtube.com","https://tiktok.com","https://github.com"],"contacts":["Hộp thư điện tử:  \n                   \n                    contact@historydauviet.id.vn","Địa điểm phát triển:  \n                   Trường Đại học FPT Cần Thơ, số 600, đường Nguyễn Văn Cừ nối dài, phường An Bình, thành phố Cần Thơ, Việt Nam, 900000.","Thời gian hỗ trợ:  \n                   08:00 – 17:30 (Thứ 2 đến Thứ 6)"],"headings":["Điều hướng","Trải nghiệm","Liên hệ"],"legal":[{"path":"/about","label":"Về chúng tôi"},{"path":"/contact","label":"Hỗ trợ kỹ thuật"},{"path":"#root","label":"Lên đầu trang ↑"}]};

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
  await mkdir('artifacts/header-footer-original-content',{recursive:true});
  const normalize=text=>text.replace(/\s+/g,' ').trim();
  const viewport=async width=>{
    await send('Emulation.setDeviceMetricsOverride',{width,height:960,deviceScaleFactor:1,mobile:width<600});
    await delay(200);
  };
  const click=async selector=>{
    const point=await evaluate(`(() => {
      const el=document.querySelector(${JSON.stringify(selector)});
      const r=el.getBoundingClientRect(),x=r.x+r.width/2,y=r.y+r.height/2;
      if(!el.contains(document.elementFromPoint(x,y)))throw Error('Covered control: '+${JSON.stringify(selector)});
      return{x,y};
    })()`);
    await send('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...point});
    await send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...point});
    await delay(250);
  };
  await navigate('/');
  await evaluate('document.fonts.ready');
  const content=await evaluate(`(() => {
    const pairs=selector=>[...document.querySelectorAll(selector)].map(a=>({label:a.textContent.replace(/\\s+/g,' ').trim(),path:a.getAttribute('href')}));
    return{
      desktop:pairs('.header__nav a'),
      mobile:pairs('.header__drawer-nav a'),
      cta:document.querySelector('.header__cta').textContent.replace(/\\s+/g,' ').trim(),
      description:document.querySelector('.footer__description').textContent.replace(/\\s+/g,' ').trim(),
      links:pairs('.footer__navigation .footer__link'),
      socials:[...document.querySelectorAll('.footer__social-link')].map(a=>a.getAttribute('href')),
      contacts:[...document.querySelectorAll('.footer__contact-item')].map(el=>el.innerText.replace(/\\s+/g,' ').trim()),
      headings:[...document.querySelectorAll('.footer__title')].map(el=>el.textContent),
      legal:pairs('.footer__legal-link'),
      addedContent:!!document.querySelector('.header__motto,.brand-lockup__tagline,.footer__invitation,.footer__faq'),
    };
  })()`);
  assert.deepEqual(content.desktop,baseline.nav,'Original six desktop navigation labels and destinations');
  assert.deepEqual(content.mobile,baseline.nav,'Original mobile navigation labels and destinations');
  assert.equal(content.cta,baseline.cta);
  assert.equal(content.description,normalize(baseline.description),'Original description preserved verbatim');
  assert.deepEqual(content.links,baseline.links,'All eleven original navigation and experience links preserved');
  assert.deepEqual(content.socials,baseline.socials,'All original social links preserved');
  assert.deepEqual(content.contacts,baseline.contacts.map(normalize),'Original email, address and support hours preserved');
  assert.deepEqual(content.headings,baseline.headings);
  assert.deepEqual(content.legal,baseline.legal);
  assert.equal(content.addedContent,false,'Reference-only copy removed');

  const widths=[1908,1440,1280,1201,1024,390,320];
  for(const width of widths){
    await viewport(width);
    await evaluate('window.scrollTo({top:0,behavior:"instant"})');
    await delay(350);
    const layout=await evaluate(`(() => {
      const nav=document.querySelector('.header__nav'),container=document.querySelector('.header__container');
      return{overflow:document.documentElement.scrollWidth>innerWidth,
        headerOverflow:container.scrollWidth>container.clientWidth,
        footerOverflow:document.querySelector('.footer__grid').scrollWidth>document.querySelector('.footer__grid').clientWidth,
        desktop:getComputedStyle(nav).display!=='none'};
    })()`);
    assert.equal(layout.overflow,false,'Page fits at '+width);
    assert.equal(layout.headerOverflow,false,'Header fits at '+width);
    assert.equal(layout.footerOverflow,false,'Footer fits at '+width);
    assert.equal(layout.desktop,width>1200);
    if([1908,1440,390,320].includes(width)){
      const shot=await send('Page.captureScreenshot',{format:'png'});
      await writeFile('artifacts/header-footer-original-content/header-'+width+'.png',Buffer.from(shot.data,'base64'));
      await evaluate('document.querySelector(".footer").scrollIntoView({block:"start",behavior:"instant"})');
      const box=await evaluate(`(() => {const r=document.querySelector('.footer').getBoundingClientRect();return{x:0,y:r.top+scrollY,width:innerWidth,height:r.height,scale:1};})()`);
      const footer=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:box});
      await writeFile('artifacts/header-footer-original-content/footer-'+width+'.png',Buffer.from(footer.data,'base64'));
    }
    if(width<=1200){
      await click('.header__hamburger');
      await waitFor('document.querySelector(".header__drawer").classList.contains("header__drawer--open")');
      await click('.header__drawer-close');
      await waitFor('document.body.style.position!=="fixed"');
    }
  }
  await viewport(1440);
  for(const path of ['/about','/explore','/demo','/team','/contact','/']){
    await click('.header__nav a[href="'+path+'"]');
    await waitFor('location.pathname==='+JSON.stringify(path)+' && document.querySelector(".header__nav-link--active")?.getAttribute("href")==='+JSON.stringify(path));
    assert.equal(await evaluate('document.querySelector(".header__nav-link--active").getAttribute("href")'),path);
  }
  await viewport(390);
  await click('.header__hamburger');
  await click('.header__drawer-link[href="/contact"]');
  await waitFor('location.pathname==="/contact" && document.body.style.position!=="fixed"');
  await click('.header__hamburger');
  await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
  await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
  await waitFor('document.body.style.position!=="fixed"');
  await delay(250);
  await click('.header__hamburger');
  await viewport(1440);
  await waitFor('document.body.style.position!=="fixed" && !document.querySelector(".header__drawer").classList.contains("header__drawer--open")');
  await clickToggle();
  await waitFor('document.querySelector(".ambient-background").hidden');
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".header > .heritage-surface__shine"),"::before").animationName'),'none');
  await clickToggle();
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await waitFor('document.querySelector(".ambient-toggle").disabled');
  assert.deepEqual(errors,[],'No runtime errors');
  console.log('PASS: original header/footer copy, all menu and footer links, social links, contact details, support hours and legal links; reference styling at '+widths.join('/')+'px; mobile navigation, Escape, resize and motion controls.');
} finally {
  ws?.close();
  chrome.kill();
  await delay(400);
  if (resolve(profile).startsWith(resolve(profilePrefix))) await rm(profile, { recursive: true, force: true, maxRetries: 3 }).catch(() => {});
}
