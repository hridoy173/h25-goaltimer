const CATS=['Personal Goal','Study / Exam','Birthday','Project Deadline','Work','Travel','Holiday','Sale / Promotion','Custom'];
const UI={
 toast(m){const e=document.createElement('div');e.className='toast';e.textContent=m;$('#toasts').append(e);setTimeout(()=>e.remove(),2800)},
 confirm(msg){return new Promise(r=>{$('#confirmMsg').textContent=msg;const d=$('#confirmDlg');d.showModal();
  const end=v=>{d.close();r(v)};$('#confirmYes').onclick=()=>end(true);$('#confirmNo').onclick=()=>end(false)})},
 cdHTML(t){if(Timer.done(t))return`<div class="done">⏰ Time's up — event started</div>`;const p=Timer.parts(t);
  return`<div class="cd">${[['d','Days'],['h','Hours'],['m','Minutes'],['s','Seconds']].map(([k,l])=>`<div><b>${k=='d'?p[k]:pad(p[k])}</b><small>${l}</small></div>`).join('')}</div>`},
 paint(el,t){const bs=el.querySelectorAll('.cd b');if(Timer.done(t)||bs.length!=4){el.innerHTML=UI.cdHTML(t);return}
  const p=Timer.parts(t);[String(p.d),pad(p.h),pad(p.m),pad(p.s)].forEach((v,i)=>{if(bs[i].textContent!=v){bs[i].textContent=v;bs[i].classList.remove('flip');void bs[i].offsetWidth;bs[i].classList.add('flip')}})},
 card(t,i){return`<article class="card" data-id="${t.id}" style="--i:${i};--c:${esc(t.color)}"><h3>${esc(t.icon)} ${esc(t.title)}</h3><p>${esc(t.desc)}</p>
 <p>${esc(t.category)} · ${t.date} ${t.time}</p><div class="live">${UI.cdHTML(t)}</div>
 <div class="prog" title="Progress"><i style="width:${Timer.progress(t)}%"></i></div><p class="pt">Goal progress: ${Timer.progress(t)}%</p>
 <div class="acts">${[['edit','Edit'],['dup','Duplicate'],['fav',t.fav?'★ Favorite':'☆ Favorite'],['win','New window'],['focus','Focus'],['del','Delete']].map(([a,l])=>`<button data-a="${a}" title="${l}">${l}</button>`).join('')}</div></article>`},
 tick(){document.querySelectorAll('.card').forEach(c=>{const t=App.timers.find(x=>x.id===c.dataset.id);if(!t)return;
  UI.paint($('.live',c),t);$('.prog i',c).style.width=Timer.progress(t)+'%';$('.pt',c).textContent='Goal progress: '+Timer.progress(t)+'%'});
  const f=$('#fBody');if(!$('#focus').hidden&&f.dataset.id){const t=App.timers.find(x=>x.id===f.dataset.id);if(t)UI.paint($('.live',f),t)}},
 stats(){const a=App.timers,d=a.filter(Timer.done).length;
  $('#stats').innerHTML=[['Total timers',a.length],['Active',a.length-d],['Completed',d],['Upcoming (7 days)',a.filter(t=>!Timer.done(t)&&Timer.left(t)<6048e5).length]].map(([l,n])=>`<div class="stat"><b>${n}</b><span>${l}</span></div>`).join('')},
 render(anim){$('#grid').classList.toggle('enter',anim===true);const f=App.filter,q=$('#search').value.toLowerCase(),c=$('#cat').value,s=$('#sort').value;
  let a=App.timers.filter(t=>t.title.toLowerCase().includes(q)&&(!c||t.category===c)&&(f=='all'||(f=='active'&&!Timer.done(t))||(f=='done'&&Timer.done(t))||(f=='fav'&&t.fav)));
  a.sort((x,y)=>s=='az'?x.title.localeCompare(y.title):s=='new'?y.createdAt-x.createdAt:Timer.target(x)-Timer.target(y));
  $('#grid').innerHTML=a.length?a.map((t,i)=>UI.card(t,i)).join(''):`<div class="empty"><h2>No timers here yet</h2><p>Press N or use “New timer” to count down to a goal.</p></div>`;
  $('#tabs').innerHTML=[['all','All'],['active','Active'],['done','Completed'],['fav','Favorites']].map(([k,l])=>`<button data-f="${k}" class="${f==k?'on':''}">${l}</button>`).join('');UI.stats()},
 showFocus(id){const t=App.timers.find(x=>x.id===id);if(!t)return;$('#fBody').dataset.id=id;$('#fBody').style.setProperty('--c',t.color);
  $('#fBody').innerHTML=`<h1>${esc(t.icon)} ${esc(t.title)}</h1><p>${t.date} ${t.time}</p><div class="live">${UI.cdHTML(t)}</div><div class="prog"><i style="width:${Timer.progress(t)}%;background:${esc(t.color)}"></i></div><p>${esc(t.desc)}</p>`;$('#focus').hidden=false}
};
