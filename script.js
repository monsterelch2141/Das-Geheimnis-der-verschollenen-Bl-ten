(() => {
 'use strict';
 const answers=window.STERNEN_LOESUNGEN||{};
 const valid=/^[A-F][1-4]$/;
 const positions=Array.from({length:24},(_,i)=>'ABCDEF'[i%6]+(Math.floor(i/6)+1));
 const activeAnswers=Object.values(answers).filter(x=>typeof x==='string'&&valid.test(x));
 if(new Set(activeAnswers).size!==activeAnswers.length) console.warn('Achtung: Mindestens eine Rasterposition ist mehrfach als Lösung hinterlegt.');
 const storageKey='sternenpruefung-geloest-v1';
 function load(){try{const obj=JSON.parse(localStorage.getItem(storageKey)||'{}');return obj&&typeof obj==='object'?obj:{}}catch{return {}}}
 let solved=load(),day=1,selected=null;
 const $=id=>document.getElementById(id);
 const board=$('board'),select=$('day'),feedback=$('feedback'),progress=$('progress');
 for(let d=1;d<=24;d++){const option=document.createElement('option');option.value=d;option.textContent=d+'. Dezember';select.append(option)}
 function save(){try{localStorage.setItem(storageKey,JSON.stringify(solved))}catch{}}
 function setFeedback(message,kind='neutral'){feedback.textContent=message;feedback.className='feedback '+kind}
 function render(){
  select.value=String(day);$('previous').disabled=day===1;$('next').disabled=day===24;
  board.replaceChildren();
  for(const pos of positions){
   const button=document.createElement('button');button.type='button';button.className='cell';button.textContent=pos;button.setAttribute('aria-label','Feld '+pos);
   const isSolved=Object.entries(solved).some(([d,p])=>answers[d]===p&&p===pos);
   if(isSolved){button.classList.add('solved');button.setAttribute('aria-label','Feld '+pos+', bereits gelöst');const mark=document.createElement('span');mark.className='tick';mark.textContent='✓';button.append(mark)}
   if(selected===pos)button.classList.add(answers[day]===pos?'correct':'wrong');
   button.addEventListener('click',()=>check(pos));board.append(button);
  }
  const n=Object.entries(solved).filter(([d,p])=>answers[d]===p).length;
  progress.textContent=n+' von 24 Geheimnissen gelüftet';
 }
 function check(pos){
  selected=pos;
  if(!valid.test(answers[day]||'')){setFeedback('Für diesen Tag ist noch keine Lösung hinterlegt.','neutral');render();return}
  if(answers[day]===pos){solved[day]=pos;save();setFeedback('✦ Richtig! Du darfst dieses Häuschen öffnen. ✦','success')}
  else setFeedback('Noch nicht ganz! Prüfe deine Sternenroute und versuche es erneut.','error');
  render();
 }
 function changeDay(n){day=Math.max(1,Math.min(24,n));selected=null;if(solved[day]===answers[day])setFeedback('✦ Dieses Geheimnis hast du bereits gelüftet. ✦','success');else setFeedback('✧ Die Sterne warten auf deine Entdeckung. ✧');render()}
 select.addEventListener('change',()=>changeDay(Number(select.value)));
 $('previous').addEventListener('click',()=>changeDay(day-1));$('next').addEventListener('click',()=>changeDay(day+1));
 render();
})();
