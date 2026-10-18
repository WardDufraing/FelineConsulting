import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import assert from 'node:assert/strict';
const source = stripTypeScriptTypes(readFileSync('src/lib/contact-delivery.ts','utf8'));
const { handleContact } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const origin = 'https://feline-consulting.vercel.app';
const id = 'd48b3914-8798-40da-bf5c-9536b273c4af';
const fields = { name: 'A', email: 'visitor@example.com', message: 'My project\n<script>plain text</script>', submissionId: id, 'cf-turnstile-response': 'proof' };
const env = { RESEND_API_KEY: 'test-private-key', RESEND_FROM_EMAIL: 'Feline <website@contact.feline-consulting.be>', TURNSTILE_SECRET_KEY: 'test-private-secret' };
let mode = 'success', calls = [], lastPayload, lastKey;
const send = async (url, options) => {
  calls.push(url);
  if (url.includes('siteverify')) {
    const body=JSON.parse(options.body); assert.equal(body.secret,env.TURNSTILE_SECRET_KEY); assert.equal(body.response,'proof');
    if(mode==='proof-timeout') throw Error('timeout');
    return Response.json({ success: mode !== 'invalid-proof', hostname: mode === 'wrong-host' ? 'attacker.example' : new URL(origin).hostname, action: mode === 'wrong-action' ? 'other' : 'contact' }, { status: mode === 'proof-outage' ? 503 : 200 });
  }
  assert.equal(url,'https://api.resend.com/emails');
  assert.equal(options.headers.Authorization,`Bearer ${env.RESEND_API_KEY}`);
  lastPayload = JSON.parse(options.body); lastKey = options.headers['Idempotency-Key'];
  assert.deepEqual(lastPayload.to,['jolien@feline-consulting.be']); assert.equal(lastPayload.reply_to,'visitor@example.com');
  assert(!lastPayload.html); assert(lastPayload.text.includes('<script>plain text</script>')); assert(!lastPayload.from.includes('visitor'));
  if(mode==='provider-timeout') throw Error('timeout');
  if(mode==='provider-json') return new Response('not JSON');
  return Response.json(mode === 'provider-reject' ? { message:'rejected' } : { id: 'provider-message-id' }, { status: mode === 'provider-reject' ? 422 : 200 });
};
const request = (data = {}, headers = {}) => new Request(`${origin}/api/contact/`, { method:'POST', headers:{ Origin:origin, ...headers }, body:new URLSearchParams({ ...fields, ...data }) });
const run = (req, configuration = env) => handleContact(req,{ env:configuration, fetch:send });
let result = await run(request()); assert.equal(result.status,200); assert.deepEqual(await result.json(),{success:true}); assert.equal(calls.length,2);
const key = lastKey; await run(request()); assert.equal(lastKey,key,'retry idempotency key stable'); await run(request({message:'Changed <script>plain text</script>'})); assert.notEqual(lastKey,key,'edited draft gets different key');
for(const data of [{name:''},{name:'a\nb'},{email:'bad'},{email:'x@example.com\r\nBcc: victim@example.com'},{message:' '},{message:'a'.repeat(8001)},{submissionId:'invalid'}]) { calls=[]; assert.equal((await run(request(data))).status,400); assert.equal(calls.length,0); }
calls=[]; assert.equal((await run(request({_honey:'bot'}))).status,200); assert.equal(calls.length,0);
assert.equal((await run(request({}, {Origin:'https://attacker.example'}))).status,403);
assert.equal((await run(request(),{})).status,503);
calls=[]; assert.equal((await run(request({'cf-turnstile-response':''}))).status,400); assert.equal(calls.length,0);
for(const [failure,status] of [['invalid-proof',400],['wrong-host',400],['wrong-action',400],['proof-outage',503],['proof-timeout',502],['provider-reject',502],['provider-timeout',502],['provider-json',502]]) {mode=failure;calls=[];result=await run(request());assert.equal(result.status,status,failure);if(failure.startsWith('proof')||failure.startsWith('wrong')||failure==='invalid-proof')assert(!calls.includes('https://api.resend.com/emails'));assert(!(await result.text()).includes('private'));}
mode='success'; const large=new Request(`${origin}/api/contact/`,{method:'POST',headers:{Origin:origin,'Content-Type':'application/x-www-form-urlencoded'},body:'name='+ 'x'.repeat(45000)}); assert.equal((await run(large)).status,413);
const invalid=new Request(`${origin}/api/contact/`,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:'{}'});assert.equal((await run(invalid)).status,415);
const form=new FormData();for(const [k,v] of Object.entries(fields))form.set(k,v);assert.equal((await run(new Request(`${origin}/api/contact/`,{method:'POST',headers:{Origin:origin},body:form}))).status,200);
console.log('PASS delivery endpoint: validation, fixed recipient/reply-to, secret isolation, size/origin checks, honeypot, Turnstile hostname/action, Resend errors and stable retry keys; no email sent');
