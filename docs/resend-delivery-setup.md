# Feline enquiry delivery setup

## Completed account configuration

- Resend: verified `contact.feline-consulting.be`, Ireland region. “Feline website enquiries” API key has sending-only access restricted to this domain.
- Cloudflare DNS: TXT `resend._domainkey.contact` contains Resend's public DKIM key; DNS-only CNAME `rsend.contact` points to `rsend-euw1.forge.rmta.net`; DNS-only CNAME `send.contact` points to `send.forge.rmta.net`.
- Existing root MX, inbox routing and website records were preserved.
- Cloudflare Turnstile: managed widget “Feline website enquiries”, hostnames `feline-consulting.vercel.app` and `feline-consulting.be` (including its subdomains). Pre-clearance is off.

## Vercel Production settings

Project: `feline-consulting`, under `warddufraings-projects`.

| Name | Type | Purpose |
| --- | --- | --- |
| RESEND_API_KEY | Secret | Restricted sending key, server only |
| TURNSTILE_SECRET_KEY | Secret | Server-side token verification |
| PUBLIC_TURNSTILE_SITE_KEY | Config | Public browser widget identifier, included at build time |
| RESEND_FROM_EMAIL | Config | `Feline Consulting <website@contact.feline-consulting.be>` |

All four are configured for Production only. Private values are stored in the provider/Vercel settings, never in this repository. `.env.example` documents names without credentials. Preview deployments deliberately have no sending credentials; their form returns an unavailable message and offers an email-app fallback.

## Deployment and final check

Merge the Resend delivery PR and allow a new Production deployment so both runtime secrets and the build-time public widget key apply. No redeployment or merge was performed during configuration.

Check the contact form on desktop and mobile. With fresh approval, send one clearly labelled test enquiry; check Resend's delivery status and have Jolien confirm receipt in the destination inbox/spam folder. A successful API response means provider acceptance, not proof of inbox placement. No real Resend message has been sent yet.

The endpoint only sends to `jolien@feline-consulting.be`; the visitor's email is Reply-To. It verifies Turnstile's token/hostname/action, limits field/body sizes, and uses idempotency keys for retries. Do not put private keys in public environment variables, source code, screenshots or logs.
