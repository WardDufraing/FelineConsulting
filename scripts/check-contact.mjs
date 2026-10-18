import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { stripTypeScriptTypes } from 'node:module';
import assert from 'node:assert/strict';
const html = readFileSync('src/pages/contact.astro', 'utf8');
const source = html.split('<script>')[1].split('</script>')[0];
assert(html.includes('action="/api/contact/"'));
assert(html.includes('name="submissionId"'));
assert(html.includes('aria-atomic="true" class="form-confirmation-message"></p>'));
const inputHandlers = [];
let handler, calls = 0, resetCount = 0, mode = 'network', resolveRequest;
const attrs = new Map(), classes = new Set();
const button = { disabled: false }, text = { textContent: 'Verstuur' };
const message = { value: '', classList: { toggle: (key, on) => on ? classes.add(key) : classes.delete(key) }, get textContent() { return this.value; }, set textContent(value) { if (value) assert(!attrs.has('aria-busy'), 'announce after clearing busy state'); this.value = value; } };
const fields = { name: { value: 'A' }, email: { value: 'visitor@example.com' }, message: { value: 'Design idea & details\nSecond line' } };
const draft = { href: '', addEventListener() {} };
const submissionId = { value: '' };
const form = {
  elements: { namedItem: name => fields[name] },
  action: 'http://localhost/api/contact/',
  querySelectorAll: () => Object.values(fields),
  querySelector: selector => selector.startsWith('button') ? button : selector.includes('confirmation') ? message : text,
  addEventListener: (event, callback) => { if (event === 'submit') handler = callback; if (event === 'input') inputHandlers.push(callback); },
  setAttribute: (key, value) => attrs.set(key, value), removeAttribute: key => attrs.delete(key), reset: () => resetCount++,
};
vm.runInNewContext(stripTypeScriptTypes(source), {
  document: { querySelector: selector => selector === '#contact-form' ? form : selector === '#submission-id' ? submissionId : draft }, FormData: class {}, AbortSignal, crypto, window: {},
  fetch: async (url, options) => {
    calls++; assert.equal(url, 'http://localhost/api/contact/');
    assert.equal(options.method, 'POST'); assert(options.signal); assert(button.disabled); assert.equal(attrs.get('aria-busy'), 'true');
    if (mode === 'network' || mode === 'timeout') throw new Error(mode);
    if (mode === 'pending') return new Promise(resolve => { resolveRequest = resolve; });
    return { ok: mode !== 'http', json: async () => { if (mode === 'bad-json') throw new Error('not JSON'); return { success: mode === 'success' ? true : false }; } };
  },
});
const initialId = submissionId.value;
for (const callback of inputHandlers) callback({ target: { classList: { contains: () => false } } });
assert.equal(submissionId.value, initialId, 'widget token refresh keeps retry ID');
for (const callback of inputHandlers) callback({ target: { classList: { contains: () => true } } });
assert.notEqual(submissionId.value, initialId, 'editing a visitor field starts a new submission');
assert(draft.href.startsWith('mailto:jolien@feline-consulting.be?'));
assert(decodeURIComponent(draft.href).includes('Design idea & details\nSecond line'));
const submit = () => handler({ preventDefault() {} });
for (const failure of ['network', 'http', 'provider-rejection', 'bad-json', 'timeout']) {
  mode = failure; const before = resetCount; await submit();
  assert.equal(resetCount, before, `${failure}: preserve draft`); assert(classes.has('error')); assert(message.textContent.includes('Je tekst is bewaard'));
  assert(!button.disabled); assert(Object.values(fields).every(field => field.readOnly === false)); assert(!attrs.has('aria-busy')); assert.equal(text.textContent, 'Verstuur');
}
for (const success of ['success']) {
  mode = success; const before = resetCount; await submit(); assert.equal(resetCount, before + 1); assert(!classes.has('error')); assert(message.textContent.startsWith('Bedankt'));
}
mode = 'pending'; const pending = submit(); const count = calls; await submit(); assert.equal(calls, count, 'duplicate submission blocked');
resolveRequest({ ok: true, json: async () => ({ success: true }) }); await pending; assert(!button.disabled);
console.log('PASS contact: same-origin endpoint, provider failure handling, preserved drafts, successful retry, duplicate guard live-region ordering and encoded email-draft fallback');
