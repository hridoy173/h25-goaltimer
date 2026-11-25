const App={timers:Store.timers(),filter:'all',editing:null,
 save(){Store.saveTimers(App.timers);UI.render()},
 theme(v){const m=v||Store.settings().theme;document.documentElement.dataset.theme=m=='system'?(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'):m},
 toggleTheme(){const s=Store.settings();s.theme=document.documentElement.dataset.theme=='dark'?'light':'dark';Store.saveSettings(s);App.theme()},
 openForm(t){App.editing=t;const f=$('#form');f.reset();$('#err').textContent='';$('#formTitle').textContent=t?'Edit timer':'New timer';$('#save').textContent=t?'Save changes':'Create timer';
  if(t){f.title.value=t.title;f.desc.value=t.desc;f.date.value=t.date;f.time.value=t.time;f.category.value=t.category;f.icon.value=t.icon;f.color.value=t.color}
  else f.date.value=toDateStr(new Date(Date.now()+864e5));$('#formDlg').showModal()},
 submit(e){e.preventDefault();const f=e.target,v={title:f.title.value.trim(),desc:f.desc.value.trim(),date:f.date.value,time:f.time.value,category:f.category.value,icon:f.icon.value||'🎯',color:f.color.value};
  if(!v.title)return $('#err').textContent='Enter a title.';
  if(new Date(`${v.date}T${v.time}`)<=Date.now()&&!App.editing)return $('#err').textContent='Choose a future date and time.';
  if(App.editing)Object.assign(App.editing,v,{updatedAt:Date.now()});
  else App.timers.push({id:uid(),...v,fav:false,createdAt:Date.now(),updatedAt:Date.now()});
  UI.toast(App.editing?'Saved':'Timer created');$('#formDlg').close();App.save()},
 async action(a,id){const t=App.timers.find(x=>x.id===id);
  if(a=='edit')App.openForm(t);
  if(a=='dup'){App.timers.push({...t,id:uid(),title:t.title+' (copy)',createdAt:Date.now(),updatedAt:Date.now()});UI.toast('Duplicated');App.save()}
  if(a=='fav'){t.fav=!t.fav;App.save()}
  if(a=='win'){const w=open(`?view=${id}`,'gt'+id,'width=520,height=360');if(!w)UI.toast('Pop-up blocked — allow pop-ups for this page')}
  if(a=='focus')UI.showFocus(id);
  if(a=='del'&&await UI.confirm(`Delete “${t.title}” permanently?`)){App.timers=App.timers.filter(x=>x!==t);UI.toast('Deleted');App.save()}},
 init(){App.theme();Look.init();matchMedia('(prefers-color-scheme:dark)').onchange=()=>App.theme();
  $('#cat').innerHTML='<option value="">All categories</option>'+CATS.map(c=>`<option>${c}</option>`).join('');
  $('#form').category.innerHTML=CATS.map(c=>`<option>${c}</option>`).join('');
  $('#presets').innerHTML=[['Tomorrow',1],['7 days',7],['30 days',30],['90 days',90],['1 year',365]].map(([l,d])=>`<button type="button" data-d="${d}">${l}</button>`).join('');
  $('#presets').onclick=e=>{const d=e.target.dataset.d;if(d)$('#form').date.value=toDateStr(new Date(Date.now()+d*864e5))};
  $('#grid').onclick=e=>{const b=e.target.closest('[data-a]');if(b)App.action(b.dataset.a,b.closest('.card').dataset.id)};
  $('#tabs').onclick=e=>{if(e.target.dataset.f){App.filter=e.target.dataset.f;UI.render(true)}};
  ['#search','#cat','#sort'].forEach(s=>$(s).oninput=UI.render);
  $('#newBtn').onclick=()=>App.openForm();$('#form').onsubmit=App.submit;$('#cancel').onclick=()=>$('#formDlg').close();
  $('#theme').onclick=$('#fTheme').onclick=App.toggleTheme;
  $('#settingsBtn').onclick=()=>{$('#setTheme').value=Store.settings().theme;$('#setDlg').showModal()};
  $('#setTheme').onchange=e=>{const s=Store.settings();s.theme=e.target.value;Store.saveSettings(s);App.theme()};
  $('#closeSet').onclick=()=>$('#setDlg').close();
  $('#export').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify({timers:App.timers,settings:Store.settings()},null,2)],{type:'application/json'}));a.download='goaltimer-backup.json';a.click()};
  $('#import').onclick=()=>$('#file').click();
  $('#file').onchange=async e=>{try{const d=JSON.parse(await e.target.files[0].text());const ok=(d.timers||[]).filter(Store.valid);
   if(!ok.length)throw 0;if(await UI.confirm(`Import ${ok.length} timers? Existing timers are kept; duplicates by ID are skipped.`)){
    const have=new Set(App.timers.map(t=>t.id));App.timers.push(...ok.filter(t=>!have.has(t.id)));App.save();UI.toast('Imported')}}catch{UI.toast('Invalid backup file')}e.target.value=''};
  $('#clear').onclick=async()=>{if(await UI.confirm('Delete ALL timers? This cannot be undone.')){App.timers=[];App.save();UI.toast('All timers cleared')}};
  $('#fClose').onclick=()=>{$('#focus').hidden=true;if(document.fullscreenElement)document.exitFullscreen();if(App.single)close()};
  $('#fsBtn').onclick=()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen?.();
  addEventListener('keydown',e=>{if(typing(e)||e.ctrlKey||e.metaKey)return;const k=e.key.toLowerCase();
   if(k=='n'){e.preventDefault();App.openForm()}if(k=='f'){e.preventDefault();$('#search').focus()}if(k=='t')App.toggleTheme()});
  addEventListener('storage',e=>{if(e.key===K.t){App.timers=Store.timers();UI.render()}});
  UI.render(true);setInterval(UI.tick,1000);
  const v=new URLSearchParams(location.search).get('view');if(v){App.single=true;UI.showFocus(v)}}
};
App.init();
