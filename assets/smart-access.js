(() => {
  if (window.__vitalNovalSmartAccess) return;
  window.__vitalNovalSmartAccess = true;
  const style = document.createElement('style');
  style.textContent = `
    .vn-smart-trigger{position:fixed;right:18px;bottom:18px;z-index:9998;border:0;border-radius:999px;padding:13px 18px;background:#c5f36a;color:#123d31;font:800 14px Arial,sans-serif;box-shadow:0 8px 28px #102b2440;cursor:pointer}
    .vn-smart-trigger:focus-visible,.vn-smart-close:focus-visible,.vn-smart-input:focus-visible,.vn-smart-result:focus-visible{outline:3px solid #e7b85b;outline-offset:3px}
    .vn-smart-backdrop{position:fixed;inset:0;z-index:9999;background:#081b15b8;display:none;align-items:flex-start;justify-content:center;padding:9vh 16px 20px}
    .vn-smart-backdrop.vn-open{display:flex}
    .vn-smart-panel{width:min(680px,100%);max-height:82vh;overflow:auto;background:#f7f8f1;color:#17271f;border-radius:22px;padding:22px;box-shadow:0 25px 80px #0006}
    .vn-smart-top{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:8px}
    .vn-smart-top strong{font:800 18px Arial,sans-serif;color:#123d31}
    .vn-smart-close{border:1px solid #dce4d9;background:#fff;border-radius:50%;width:38px;height:38px;font-size:20px;cursor:pointer}
    .vn-smart-hint{font:13px/1.5 Arial,sans-serif;color:#66756c;margin:0 0 14px}
    .vn-smart-input{width:100%;border:2px solid #cbd8ca;border-radius:13px;padding:15px 16px;font:16px Arial,sans-serif;background:#fff;color:#17271f}
    .vn-smart-results{display:grid;gap:9px;margin-top:15px}
    .vn-smart-result{display:block;text-decoration:none;background:#fff;border:1px solid #dce4d9;border-radius:13px;padding:13px 15px;color:#17271f}
    .vn-smart-result b{display:block;color:#205d47;font:700 14px Arial,sans-serif;margin-bottom:3px}
    .vn-smart-result span{display:block;color:#66756c;font:12px/1.45 Arial,sans-serif}
    .vn-smart-empty{padding:18px;text-align:center;color:#66756c;font:13px Arial,sans-serif}
    @media(prefers-reduced-motion:reduce){.vn-smart-backdrop{scroll-behavior:auto}}
  `;
  document.head.appendChild(style);
  const trigger = document.createElement('button');
  trigger.className = 'vn-smart-trigger'; trigger.type = 'button';
  trigger.textContent = '⌕ Smart Access'; trigger.setAttribute('aria-haspopup','dialog');
  const backdrop = document.createElement('div'); backdrop.className = 'vn-smart-backdrop';
  backdrop.innerHTML = '<section class="vn-smart-panel" role="dialog" aria-modal="true" aria-labelledby="vnSmartTitle"><div class="vn-smart-top"><strong id="vnSmartTitle">VitalNoval Smart Access</strong><button class="vn-smart-close" type="button" aria-label="Close search">×</button></div><p class="vn-smart-hint">Search courses, health topics, learning resources and website sections. Press / to open and Esc to close.</p><input class="vn-smart-input" type="search" placeholder="What would you like to learn today?" autocomplete="off"><div class="vn-smart-results" aria-live="polite"></div></section>';
  document.body.append(trigger, backdrop);
  const input = backdrop.querySelector('input'), results = backdrop.querySelector('.vn-smart-results');
  const close = () => { backdrop.classList.remove('vn-open'); trigger.focus(); };
  const open = () => { backdrop.classList.add('vn-open'); input.value=''; render(''); setTimeout(()=>input.focus(),30); };
  const entries = [];
  const seen = new Set();
  document.querySelectorAll('main section[id], main h2, main h3, main article').forEach((el, i) => {
    let target = el;
    if (!el.id && !el.matches('section')) {
      const parent = el.closest('section');
      if (parent) target = parent;
    }
    const label = (el.id ? el.querySelector('h1,h2,h3')?.textContent : el.textContent) || el.textContent;
    const title = (label || '').replace(/\s+/g,' ').trim().slice(0,90);
    if (!title || seen.has(target)) return;
    seen.add(target);
    if (!target.id) target.id = 'vn-smart-destination-' + i;
    entries.push({title, text:(el.textContent||'').replace(/\s+/g,' ').trim().slice(0,240), href:'#'+target.id});
  });
  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || /^(mailto:|tel:|javascript:)/i.test(href)) return;
    const title=(a.textContent||'').replace(/\s+/g,' ').trim();
    if (title && !entries.some(e=>e.title===title && e.href===href)) entries.push({title,text:'Open this VitalNoval learning page or resource.',href});
  });
  function render(query) {
    const q=query.trim().toLowerCase();
    const matches=(q ? entries.filter(e=>(e.title+' '+e.text).toLowerCase().includes(q)) : entries).slice(0,12);
    results.innerHTML='';
    if (!matches.length) { results.innerHTML='<div class="vn-smart-empty">No exact match yet. Try a broader topic such as fitness, health, sports, first aid or biomechanics.</div>'; return; }
    matches.forEach(e=>{
      const a=document.createElement('a'); a.className='vn-smart-result'; a.href=e.href;
      const b=document.createElement('b'); b.textContent=e.title;
      const s=document.createElement('span'); s.textContent=e.text.slice(0,150);
      a.append(b,s); a.addEventListener('click',()=>{backdrop.classList.remove('vn-open');});
      results.appendChild(a);
    });
  }
  trigger.addEventListener('click',open);
  backdrop.querySelector('.vn-smart-close').addEventListener('click',close);
  backdrop.addEventListener('click',e=>{if(e.target===backdrop)close();});
  input.addEventListener('input',()=>render(input.value));
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape' && backdrop.classList.contains('vn-open')) close();
    if(e.key==='/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) && !e.ctrlKey && !e.metaKey){e.preventDefault();open();}
  });
})();