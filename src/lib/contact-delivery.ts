import { createHash } from 'node:crypto';

type Settings = Record<string, string | undefined>;
type Dependencies = { env: Settings; fetch: typeof fetch };
const RECIPIENT = 'jolien@feline-consulting.be';
const MAX_BYTES = 40000;
const reply = (status: number, body: Record<string, unknown>) => new Response(JSON.stringify(body), {
  status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' },
});

export async function handleContact(request: Request, dependencies: Dependencies) {
  const { env, fetch: send } = dependencies;
  const origin = request.headers.get('origin');
  const allowed = new Set([new URL(request.url).origin, new URL(env.PUBLIC_SITE_URL || 'https://feline-consulting.vercel.app/').origin]);
  if (!origin || !allowed.has(origin)) return reply(403, { success: false, error: 'invalid_origin' });
  const contentType = request.headers.get('content-type') || '';
  if (!/^(multipart\/form-data;|application\/x-www-form-urlencoded(?:;|$))/i.test(contentType)) return reply(415, { success: false, error: 'invalid_format' });
  if (Number(request.headers.get('content-length')) > MAX_BYTES) return reply(413, { success: false, error: 'too_large' });

  let form: FormData;
  try {
    // Bound the actual stream too: Content-Length alone is not authoritative.
    const reader = request.body?.getReader();
    if (!reader) return reply(400, { success: false, error: 'invalid_form' });
    const chunks: Uint8Array[] = []; let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BYTES) { await reader.cancel(); return reply(413, { success: false, error: 'too_large' }); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size); let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    form = await new Request(request.url, { method: 'POST', headers: { 'Content-Type': contentType }, body: bytes }).formData();
  } catch { return reply(400, { success: false, error: 'invalid_form' }); }

  const field = (name: string) => typeof form.get(name) === 'string' ? String(form.get(name)).trim() : '';
  if (field('_honey')) return reply(200, { success: true });
  const name = field('name'), email = field('email'), message = field('message');
  const submissionId = field('submissionId');
  if (!name || name.length > 120 || /[\r\n]/.test(name) || email.length > 254 || !/^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(email) || !message || message.length > 8000 || !/^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i.test(submissionId)) {
    return reply(400, { success: false, error: 'invalid_fields' });
  }
  const apiKey = env.RESEND_API_KEY, from = env.RESEND_FROM_EMAIL, turnstileSecret = env.TURNSTILE_SECRET_KEY;
  if (!apiKey || !from || /[\r\n]/.test(from) || !turnstileSecret) return reply(503, { success: false, error: 'unavailable' });
  const token = field('cf-turnstile-response');
  if (!token || token.length > 2048) return reply(400, { success: false, error: 'verification_required' });

  try {
    const verification = await send('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: turnstileSecret, response: token }), signal: AbortSignal.timeout(5000),
    });
    if (!verification.ok) return reply(503, { success: false, error: 'unavailable' });
    const proof = await verification.json();
    if (proof.success !== true || proof.hostname !== new URL(origin).hostname || proof.action !== 'contact') {
      return reply(400, { success: false, error: 'verification_required' });
    }
    const text = `Naam: ${name}\nE-mailadres: ${email}\nWebsite: ${origin}\n\n${message}`;
    // Same draft + same submission ID remains deduplicated after an uncertain timeout.
    const hash = createHash('sha256').update(text).digest('hex').slice(0, 32);
    const response = await send('https://api.resend.com/emails', {
      method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'Idempotency-Key': `contact/${submissionId}/${hash}` },
      body: JSON.stringify({ from, to: [RECIPIENT], reply_to: email, subject: 'Nieuwe ontwerpvraag via Feline Consulting', text }),
      signal: AbortSignal.timeout(8000),
    });
    const result = await response.json();
    if (!response.ok || typeof result.id !== 'string' || !result.id) return reply(502, { success: false, error: 'delivery_unconfirmed' });
    return reply(200, { success: true });
  } catch { return reply(502, { success: false, error: 'delivery_unconfirmed' }); }
}
