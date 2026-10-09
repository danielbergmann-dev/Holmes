const {JSDOM}=await import(process.env.UI_JSDOM_PATH||'jsdom');
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const dom=new JSDOM(readFileSync(new URL('../dist/index.html',import.meta.url),'utf8'),{url:'https://holmes.test/',pretendToBeVisual:true});
const w=dom.window,doc=w.document,frames=[];let ts=0;
for(const key of ['window','document','localStorage','navigator','Option','Blob','HTMLElement'])Object.defineProperty(globalThis,key,{value:key==='window'?w:w[key],configurable:true});
globalThis.Image=w.Image;globalThis.matchMedia=()=>({matches:true});globalThis.devicePixelRatio=1;globalThis.requestAnimationFrame=cb=>frames.push(cb);globalThis.ResizeObserver=class{constructor(cb){this.cb=cb}observe(){this.cb()}};
w.HTMLElement.prototype.scrollIntoView=function(){};
w.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','');};w.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open');};
w.HTMLCanvasElement.prototype.getBoundingClientRect=()=>({width:390,height:430,left:0,top:0});
const gradient={addColorStop(){}};const ctx=new Proxy({measureText:t=>({width:t.length*7}),createLinearGradient:()=>gradient,createRadialGradient:()=>gradient},{get:(t,k)=>k in t?t[k]:()=>{},set:(t,k,v)=>(t[k]=v,true)});w.HTMLCanvasElement.prototype.getContext=()=>ctx;
URL.createObjectURL=()=> 'blob:test';URL.revokeObjectURL=()=>{};
const registry=new Map();doc.modelContext={registerTool(tool){registry.set(tool.name,tool);}};
await import('../dist/app.mjs');
const $=id=>doc.getElementById(id),state=()=>JSON.parse(localStorage.getItem('holmes.case1.v1'));
function click(text){const b=[...doc.querySelectorAll('dialog[open] button')].find(x=>x.textContent===text||x.textContent.startsWith(text));assert.ok(b,`button: ${text}`);assert.ok(!b.disabled);b.click();}
function framesAdvance(){for(let i=0;i<400;i++){const q=frames.splice(0);ts+=20;for(const cb of q)cb(ts);}}
function spot(name){$('spots').click();click(name);framesAdvance();}
function go(name){$('map').click();click(name);framesAdvance();}
$('begin').click();assert.equal(state().node,'intro');click('Weiter');click('Weiter');click('Mit Watson');click('Weiter');click('Weiter');const beforeReread=state();click('Zurück');assert.equal(state().page,1);click('Zurück');assert.equal(state().page,0);assert.ok(doc.querySelector('.reading-back').disabled);click('Weiter');click('Weiter');assert.equal(state().turns,beforeReread.turns);assert.deepEqual(state().flags,beforeReread.flags);assert.match(doc.querySelector('.reading-position').textContent,/Seite 3 von 3/);click('Mit der Untersuchung');assert.ok(state().flags.arrival);
spot('Die Portiersloge');click('Die Schlüsselausgabe');assert.ok(state().clues.includes('keylog'));
go('Garderobe');spot('Der Schminktisch');click('Die Fahrkarte sichern');spot('Der Papierkorb');click('Den Vertrag');spot('Die Seitentür');click('Die frische Spur');assert.ok($('dice-dialog').open);$('roll').click();await new Promise(r=>setTimeout(r,150));$('roll').click();await new Promise(r=>setTimeout(r,0));click('Weiter ermitteln');assert.ok(state().clues.includes('grease'));
go('Hinterbühne');spot('Der Bühnenplan');click('Den Plan abzeichnen');
function combine(a,b,c){$('case').click();click('Kombinieren');const select=[...doc.querySelectorAll('dialog[open] select')];select[0].value=a;select[1].value=b;select[2].value=c;click('Verbindung prüfen');$('sheet-close').click();}
combine('grease','plan','route');assert.ok(state().deductions.includes('route'));
spot('Eli Mercer');click('Den versiegelten Ersatz');click('Weiter ermitteln');go('Wartungskammer');spot('Die verschlossene Kammer');click('Die Kammer öffnen');click('Weiter');click('Die Ermittlung fortsetzen');assert.ok(state().flags.rescued);
go('Lieferhof');spot('Der Lieferzettel');click('Den quittierten Zettel');go('Druckerei');spot('Das Auftragsbuch');click('Den Durchschlag');combine('keylog','delivery','opportunity');combine('contract','ledger','motive');
const read=registry.get('read_investigation').execute();assert.equal(read.clues.length,state().clues.length);assert.throws(()=>registry.get('open_found_evidence').execute({clueId:'unknown'}));registry.get('open_found_evidence').execute({clueId:'ledger'});assert.match($('sheet-content').textContent,/zweite Abrechnung/);$('sheet-close').click();
$('case').click();click('Den Fall abschließen');click('Victor Rook');click('Entscheidung bestätigen');assert.equal(state().ending,'complete');assert.equal(state().node,'epilogue');
click('Weiter');click('Weiter');click('Zur Fallauswahl');assert.equal($('title-screen').hidden,false);$('continue').click();assert.equal(state().ending,'complete');assert.ok($('sheet').open);
console.log(JSON.stringify({ui:'passed',clues:state().clues.length,ending:state().ending,clock:state().turns,webMCP:'registration and shared UI actions verified in DOM harness; native browser API unavailable'}));
