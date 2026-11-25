const $=(s,r=document)=>r.querySelector(s);
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const pad=n=>String(n).padStart(2,'0');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const toDateStr=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const typing=e=>/INPUT|SELECT|TEXTAREA/.test(e.target.tagName);
