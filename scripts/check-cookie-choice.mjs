import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import assert from 'node:assert/strict';
const source = stripTypeScriptTypes(readFileSync('src/scripts/analytics.ts', 'utf8'));
const { initAnalyticsConsent } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const clock = 1800000000000, key = 'felineAnalyticsConsentV1', id = 'G-TEST12345';
function setup({ record, blocked = false, enabled = true, hostname = 'feline-consulting.be', legacy = 'true', measurementId = id } = {}) {
  const storage = new Map([['cookiesAccepted',legacy]]);if(record!==undefined)storage.set(key,typeof record==='string'?record:JSON.stringify(record));
  const classes = new Set(['hidden']), handlers = {}, properties = {}, scripts = [], cookies = new Map([['_ga','old'],['_ga_TEST12345','old'],['essential','keep']]);let reloads=0;
  const element = name => ({ addEventListener: (_, fn) => handlers[name]=fn, focus() {} });
  const banner = { dataset:{measurementId,analyticsEnabled:String(enabled)},classList:{add:x=>classes.add(x),remove:x=>classes.delete(x)},get offsetHeight(){return classes.has('hidden')?0:240;} };
  const elements={'cookie-banner':banner,'accept-cookies':element('accept'),'reject-cookies':element('reject'),'reset-cookie-choice':element('reset'),'cookie-reset-status':{textContent:''}};
  const win={location:{hostname,origin:'https://'+hostname,pathname:'/contact/',search:'?email=private@example.com',hash:'#private',reload:()=>reloads++},localStorage:{getItem:k=>{if(blocked)throw Error();return storage.get(k);},setItem:(k,v)=>{if(blocked)throw Error();storage.set(k,v);},removeItem:k=>{if(blocked)throw Error();storage.delete(k);}}};
  const doc={getElementById:n=>elements[n],querySelectorAll:()=>[element('settings')],documentElement:{style:{setProperty:(k,v)=>properties[k]=v}},head:{appendChild:s=>scripts.push(s)},createElement:()=>({}),referrer:'https://example.com/from/?secret=private#private',title:'Contact',get cookie(){return [...cookies].map(([k,v])=>k+'='+v).join('; ');},set cookie(v){cookies.delete(v.split('=')[0]);}};
  initAnalyticsConsent({win,doc,now:()=>clock,Observer:class{constructor(fn){this.fn=fn;}observe(){this.fn();}}});
  return {classes,handlers,properties,scripts,cookies,storage,win,get reloads(){return reloads;}};
}
for(const blocked of [false,true]){
 const s=setup({blocked});assert(!s.classes.has('hidden'));assert.equal(s.scripts.length,0);assert.equal(s.properties['--cookie-banner-height'],'240px');
 s.handlers.reject();assert(s.classes.has('hidden'));assert.equal(s.scripts.length,0);assert.equal(s.properties['--cookie-banner-height'],'0px');assert(s.cookies.has('essential'));assert(!s.cookies.has('_ga'));
 if(!blocked)assert.equal(JSON.parse(s.storage.get(key)).decision,'denied');
}
const s=setup();s.handlers.accept();s.handlers.accept();assert.equal(s.scripts.length,1);assert(s.scripts[0].src.endsWith(id));
const commands=s.win.dataLayer.map(args=>Array.from(args));const config=commands.find(c=>c[0]==='config')[2];assert.equal(config.send_page_view,false);assert.equal(config.page_location,'https://feline-consulting.be/contact/');assert.equal(config.page_referrer,'https://example.com/from/');assert.equal(config.allow_google_signals,false);assert.equal(config.allow_ad_personalization_signals,false);assert(!JSON.stringify(commands).includes('private'));assert.equal(commands.filter(c=>c[1]==='page_view').length,1);
assert.equal(commands[0][2].ad_user_data,'denied');assert.equal(commands[0][2].ad_personalization,'denied');
s.handlers.settings();assert(!s.classes.has('hidden'));s.handlers.reject();assert.equal(s.win['ga-disable-'+id],true);assert.equal(s.reloads,1);
const granted=setup({record:{decision:'granted',time:clock-1000}});assert.equal(granted.scripts.length,1);assert(granted.classes.has('hidden'));granted.handlers.reset();assert.equal(granted.reloads,1);assert(!granted.storage.has(key));
const denied=setup({record:{decision:'denied',time:clock-1000}});assert.equal(denied.scripts.length,0);assert(denied.classes.has('hidden'));denied.handlers.reset();assert(!denied.classes.has('hidden'));
for(const record of ['not JSON',{decision:'yes',time:clock},{decision:'granted',time:clock-181*86400000},{decision:'granted',time:clock+1}]){const t=setup({record});assert.equal(t.scripts.length,0);assert(!t.classes.has('hidden'));}
for(const options of [{enabled:false},{measurementId:''},{measurementId:'G-<script>'},{hostname:'localhost'},{hostname:'preview.vercel.app'}]){const t=setup(options);t.handlers.accept();assert.equal(t.scripts.length,0);}
console.log('PASS Analytics consent: no pre-consent/rejected/preview requests; fresh consent after legacy/expiry; one sanitized pageview after acceptance; revocation, reset, cookie cleanup, banner spacing and blocked storage');
