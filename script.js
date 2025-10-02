const fighters = [
{id:'scorpion', name:'Scorpion', style:'linear-gradient(135deg,#f6c66b,#e03b3b)', tag:'Ninja venganza'},
{id:'subzero', name:'Sub-Zero', style:'linear-gradient(135deg,#9fd3ff,#3bb7ff)', tag:'Maestro de hielo'},
{id:'raiden', name:'Raiden', style:'linear-gradient(135deg,#cfeecf,#6fd6b8)', tag:'Dios del trueno'},
{id:'liu', name:'Liu Kang', style:'linear-gradient(135deg,#ffd9b3,#ffb36b)', tag:'Campeón'},
{id:'kitana', name:'Kitana', style:'linear-gradient(135deg,#ffd6ff,#d08cff)', tag:'Princesa guerrera'}
];

const rosterEl = document.getElementById('roster');
const fighterA = document.getElementById('fighterA');
const fighterB = document.getElementById('fighterB');
const faceA = document.getElementById('faceA');
const faceB = document.getElementById('faceB');
const nameA = document.getElementById('nameA');
const nameB = document.getElementById('nameB');
const fightBtn = document.getElementById('fightBtn');
const randomBtn = document.getElementById('randomBtn');
const resultBox = document.getElementById('resultBox');
const score = document.getElementById('score');

let selected = [];

function makeCard(f){
const c = document.createElement('div');
c.className = 'card';
c.tabIndex = 0;
c.dataset.id = f.id;

const avatar = document.createElement('div');
avatar.className = 'avatar';
avatar.style.background = f.style;
avatar.textContent = f.name.split(' ').map(s=>s[0]).slice(0,2).join('');

const info = document.createElement('div');
info.className = 'info';
info.innerHTML = `<h3>${f.name}</h3><div class="tag">${f.tag}</div>`;

c.appendChild(avatar);
c.appendChild(info);

c.addEventListener('click', ()=>toggleSelect(f.id));
c.addEventListener('keydown',(e)=>{ if(e.key==='Enter') toggleSelect(f.id)});

return c;
}

function renderRoster(){
rosterEl.innerHTML = '';
fighters.forEach(f=>rosterEl.appendChild(makeCard(f)));
}

function toggleSelect(id){
const idx = selected.indexOf(id);
if(idx>-1){ selected.splice(idx,1); }
else{
if(selected.length<2) selected.push(id);
else{ selected.shift(); selected.push(id); }
}
updateSelectionUI();
}

function updateSelectionUI(){
document.querySelectorAll('.card').forEach(c=>{
c.style.outline = '';
if(selected.includes(c.dataset.id)) c.style.outline = '3px solid rgba(240,193,0,0.12)';
});

if(selected[0]) applyToSlot(0,selected[0]); else applyToSlot(0,null);
if(selected[1]) applyToSlot(1,selected[1]); else applyToSlot(1,null);


score.textContent = selected.length===2 ? 'Listo para combatir' : 'Elige dos luchadores';
resultBox.innerHTML = '';
}

function applyToSlot(slotIndex, id){
const slot = slotIndex===0 ? {el:fighterA,face:faceA,name:nameA} : {el:fighterB,face:faceB,name:nameB};
if(!id){ slot.face.textContent = slotIndex===0? 'A':'B'; slot.name.textContent = '—'; slot.el.classList.remove('visible'); return; }
const f = fighters.find(x=>x.id===id);
slot.face.textContent = f.name.split(' ').map(s=>s[0]).slice(0,2).join('');
slot.face.style.background = f.style;
slot.name.textContent = f.name;
slot.el.classList.add('visible');
}

function randomPick(){
const a = fighters[Math.floor(Math.random()*fighters.length)].id;
let b;
do{ b = fighters[Math.floor(Math.random()*fighters.length)].id } while(b===a);
selected = [a,b];
updateSelectionUI();
}

function fight(){
if(selected.length<2){ resultBox.innerHTML = '<div class="result" style="background:rgba(255,255,255,0.03)">Selecciona dos luchadores primero</div>'; return; }
const a = fighters.find(f=>f.id===selected[0]);
const b = fighters.find(f=>f.id===selected[1]);

const scoreA = Math.random() + a.name.length*0.0001;
const scoreB = Math.random() + b.name.length*0.0001;
const winner = scoreA>scoreB? {slot:0,f:a} : {slot:1,f:b};

const leftEl = fighterA; const rightEl = fighterB;
leftEl.classList.remove('winner'); rightEl.classList.remove('winner');
leftEl.style.transform = 'translateX(14px)';
rightEl.style.transform = 'translateX(-14px)';

setTimeout(()=>{
leftEl.style.transform = ''; rightEl.style.transform = '';
if(winner.slot===0) leftEl.classList.add('winner'); else rightEl.classList.add('winner');
showResult(winner.f);
},700);
}

function showResult(w){
resultBox.innerHTML = `\n <div class="result flash" style="background:linear-gradient(90deg, rgba(240,193,0,0.08), rgba(224,59,59,0.06));color:var(--gold)">GANADOR: ${w.name}</div>\n `;

const confetti = document.createElement('div');
confetti.style.position='absolute';confetti.style.left='50%';confetti.style.top='10%';confetti.style.transform='translateX(-50%)';
for(let i=0;i<10;i++){const s=document.createElement('span');s.textContent=['⚡','🔥','✨','❗'][Math.floor(Math.random()*4)];s.style.opacity='0.95';s.style.margin='0 4px';confetti.appendChild(s)}
document.getElementById('stage').appendChild(confetti);
setTimeout(()=>confetti.remove(),1200);
}

renderRoster();
randomBtn.addEventListener('click', ()=>randomPick());
fightBtn.addEventListener('click', ()=>fight());
window.addEventListener('keydown',(e)=>{
if(e.key.toLowerCase()==='r') randomPick();
if(e.key.toLowerCase()==='f') fight();
});