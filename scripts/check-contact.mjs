import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { stripTypeScriptTypes } from 'node:module';
import assert from 'node:assert/strict';
const html = readFileSync('src/pages/contact.astro', 'utf8');
const source = html.split('<script>')[1].split('</script>')[0];
assert(html.includes('action="https://formsubmit.co/jolien@feline-consulting.be"'));
assert(html.includes('name="_subject" value="Nieuwe ontwerpvraag via Feline Consulting"'));
assert(html.includes('aria-atomic="true" class="form-confirmation-message"></p>'));
let handler, calls = 0, resetCount = 0, mode = 'network', resolveRequest;
const attrs = new Map(), classes = new Set();
const button = { disabled: false }, text = { textContent: 'Verstuur' };
const message = { value: '', classList: { toggle: (key, on) => on ? classes.add(key) : classes.delete(key) }, get textContent() { return this.value; }, set textContent(value) { if (value) assert(!attrs.has('aria-busy'), 'announce after clearing busy state'); this.value = value; } };
const fields = { name: { value: 'A' }, email: { value: 'visitor@example.com' }, message: { value: 'Design idea & details\nSecond line' } };
const draft = { href: '', addEventListener() {} };
const form = {
  elements: { namedItem: name => fields[name] },
  action: 'https://formsubmit.co/jolien@feline-consulting.be',
  querySelector: selector => selector.startsWith('button') ? button : selector.includes('confirmation') ? message : text,
  addEventListener: (event, callback) => { if (event === 'submit') handler = callback; },
  setAttribute: (key, value) => attrs.set(key, value), removeAttribute: key => attrs.delete(key), reset: () => resetCount++,
};
vm.runInNewContext(stripTypeScriptTypes(source), {
  document: { querySelector: selector => selector === '#contact-form' ? form : draft }, FormData: class {}, AbortSignal,
  fetch: async (url, options) => {
    calls++; assert.equal(url, 'https://formsubmit.co/ajax/jolien@feline-consulting.be');
    assert.equal(options.method, 'POST'); assert(options.signal); assert(button.disabled); assert.equal(attrs.get('aria-busy'), 'true');
    if (mode === 'network' || mode === 'timeout') throw new Error(mode);
    if (mode === 'pending') return new Promise(resolve => { resolveRequest = resolve; });
    return { ok: mode !== 'http', json: async () => { if (mode === 'bad-json') throw new Error('not JSON'); return { success: mode === 'success' ? true : mode === 'success-string' ? 'true' : false }; } };
  },
});
assert(draft.href.startsWith('mailto:jolien@feline-consulting.be?'));
assert(decodeURIComponent(draft.href).includes('Design idea & details\nSecond line'));
const submit = () => handler({ preventDefault() {} });
for (const failure of ['network', 'http', 'activation-required', 'bad-json', 'timeout']) {
  mode = failure; const before = resetCount; await submit();
  assert.equal(resetCount, before, `${failure}: preserve draft`); assert(classes.has('error')); assert(message.textContent.includes('Je tekst is bewaard'));
  assert(!button.disabled); assert(!attrs.has('aria-busy')); assert.equal(text.textContent, 'Verstuur');
}
for (const success of ['success', 'success-string']) {
  mode = success; const before = resetCount; await submit(); assert.equal(resetCount, before + 1); assert(!classes.has('error')); assert(message.textContent.startsWith('Bedankt'));
}
mode = 'pending'; const pending = submit(); const count = calls; await submit(); assert.equal(calls, count, 'duplicate submission blocked');
resolveRequest({ ok: true, json: async () => ({ success: true }) }); await pending; assert(!button.disabled);
console.log('PASS contact: endpoint/subject, failure and activation handling, preserved drafts, successful retry, duplicate guard live-region ordering and encoded email-draft fallback');
