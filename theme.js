const FONTS={'Inter':'Inter','Poppins':'Poppins','Space Grotesk':'Space+Grotesk','Playfair Display':'Playfair+Display','JetBrains Mono':'JetBrains+Mono','Bebas Neue':'Bebas+Neue','Hind Siliguri':'Hind+Siliguri','System':null};
const BGS={Aurora:'linear-gradient(120deg,#4f46e5,#06b6d4,#a855f7,#4f46e5)',Sunset:'linear-gradient(120deg,#f97316,#ec4899,#6366f1,#f97316)',Ocean:'linear-gradient(120deg,#0ea5e9,#1e3a8a,#06b6d4,#0ea5e9)',Forest:'linear-gradient(120deg,#10b981,#064e3b,#84cc16,#10b981)',Midnight:'linear-gradient(120deg,#1e1b4b,#0c1224,#312e81,#1e1b4b)'};
const Look={
 apply(){const s=Store.settings(),r=document.documentElement.style,f=s.font||'Inter';
  if(FONTS[f]&&!document.getElementById('gf-'+f)){const l=document.createElement('link');l.id='gf-'+f;l.rel='stylesheet';l.href=`https://fonts.googleapis.com/css2?family=${FONTS[f]}:wght@400;600;700&display=swap`;document.head.append(l)}
  r.setProperty('--font',f=='System'?'system-ui,sans-serif':`'${f}',system-ui,sans-serif`);
  r.setProperty('--bgimg',s.bgImg?`url("${s.bgImg}")`:(BGS[s.bg||'Aurora']||'none'));
  r.setProperty('--dim',(s.dim??35)/100);r.setProperty('--blur',(s.blur??0)+'px');
  $('#bgfx').classList.toggle('grad',!s.bgImg);document.body.classList.toggle('noanim',s.anim===false)},
 set(p){Store.saveSettings({...Store.settings(),...p});Look.apply()},
 upload(file){const img=new Image();img.onload=()=>{const k=Math.min(1,1600/img.width),c=document.createElement('canvas');c.width=img.width*k;c.height=img.height*k;
  c.getContext('2d').drawImage(img,0,0,c.width,c.height);Look.set({bgImg:c.toDataURL('image/jpeg',.7)});UI.toast('Background updated')};img.src=URL.createObjectURL(file)},
 init(){const s=Store.settings();
  $('#look').innerHTML=`<label>Font<select id="lkFont">${Object.keys(FONTS).map(f=>`<option ${f==(s.font||'Inter')?'selected':''}>${f}</option>`).join('')}</select></label>
  <label>Background</label><div class="chips" id="lkBg">${Object.keys(BGS).map(k=>`<button type="button" class="sw" data-bg="${k}" style="background:${BGS[k]}" title="${k}"></button>`).join('')}<button type="button" id="lkUp">Upload image</button></div>
  <input id="lkUrl" placeholder="…or paste an image URL and press Enter"><input type="file" id="lkFile" accept="image/*" hidden>
  <label>Dim <input type="range" id="lkDim" min="0" max="80" value="${s.dim??35}"></label><label>Blur <input type="range" id="lkBlur" min="0" max="20" value="${s.blur??0}"></label>
  <label class="chk"><input type="checkbox" id="lkAnim" ${s.anim===false?'':'checked'}> Animations</label>`;
  $('#lkFont').onchange=e=>Look.set({font:e.target.value});
  $('#lkBg').onclick=e=>{const k=e.target.dataset.bg;if(k)Look.set({bg:k,bgImg:''})};
  $('#lkUp').onclick=()=>$('#lkFile').click();$('#lkFile').onchange=e=>e.target.files[0]&&Look.upload(e.target.files[0]);
  $('#lkUrl').onkeydown=e=>{if(e.key=='Enter'&&e.target.value)Look.set({bgImg:e.target.value.trim()})};
  $('#lkDim').oninput=e=>Look.set({dim:+e.target.value});$('#lkBlur').oninput=e=>Look.set({blur:+e.target.value});
  $('#lkAnim').onchange=e=>Look.set({anim:e.target.checked});Look.apply()}
};
