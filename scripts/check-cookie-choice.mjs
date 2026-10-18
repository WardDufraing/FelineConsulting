import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { stripTypeScriptTypes } from 'node:module';
const source = readFileSync('src/components/CookieBanner.astro','utf8').split('<script>')[1].split('</script>')[0];
for (const blocked of [false, true]) {
  const classes = new Set(['hidden']), handlers = {}, properties = {};
  const banner = { classList: { add: v => classes.add(v), remove: v => classes.delete(v) }, get offsetHeight() { return classes.has('hidden') ? 0 : 240; } };
  const storage = new Map();
  vm.runInNewContext(stripTypeScriptTypes(source), {
    document: { getElementById: id => id === 'cookie-banner' ? banner : { addEventListener: (_, fn) => { handlers[id] = fn; } }, documentElement: { style: { setProperty: (key,value) => { properties[key] = value; } } } },
    localStorage: { getItem: key => { if(blocked) throw Error('disabled'); return storage.get(key); }, setItem: (key,value) => { if(blocked) throw Error('disabled'); storage.set(key,value); } },
    ResizeObserver: class { constructor(fn) { this.fn = fn; } observe() { this.fn(); } },
  });
  assert(!classes.has('hidden')); assert.equal(properties['--cookie-banner-height'],'240px');
  handlers['reject-cookies'](); assert(classes.has('hidden')); assert.equal(properties['--cookie-banner-height'],'0px');
  if (!blocked) assert.equal(storage.get('cookiesAccepted'),'false');
}
console.log('PASS cookie notice: space reserved, dismissible with normal or blocked storage');
