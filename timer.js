const Timer={
 target:t=>new Date(`${t.date}T${t.time}`).getTime(),
 left(t){return Math.max(0,Timer.target(t)-Date.now())},
 done:t=>Timer.left(t)===0,
 parts(t){const s=Math.floor(Timer.left(t)/1000);return{d:Math.floor(s/86400),h:Math.floor(s/3600)%24,m:Math.floor(s/60)%60,s:s%60}},
 progress(t){const a=t.createdAt,b=Timer.target(t);return b<=a?100:Math.min(100,Math.max(0,Math.round((Date.now()-a)/(b-a)*100)))}
};
