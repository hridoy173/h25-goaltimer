const K={t:'goaltimer_timers',s:'goaltimer_settings',th:'goaltimer_theme'};
const Store={
 read(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){console.error(e);return d}},
 write(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){UI.toast('Could not save data (storage full or blocked)');return false}},
 timers:()=>Store.read(K.t,[]),saveTimers:a=>Store.write(K.t,a),
 settings:()=>Store.read(K.s,{theme:'system'}),saveSettings:s=>Store.write(K.s,s),
 valid:t=>t&&typeof t.id==='string'&&typeof t.title==='string'&&!isNaN(new Date(t.date+'T'+t.time))
};
