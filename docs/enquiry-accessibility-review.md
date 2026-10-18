# Enquiry delivery and accessibility review

Accessibility changes merged in PR #16. Resend follow-up branch: `fix/resend-enquiry-delivery`, based on current main.

## Delivery status — replacement prepared; inbox test pending

The approved live FormSubmit test failed, and the user confirmed no email arrived. A subsequent test in the user's normal browser also failed. The user chose Resend as the replacement.

The branch replaces FormSubmit with a same-origin server endpoint. Resend's sending domain `contact.feline-consulting.be` is verified. The approved DKIM and two CNAME records were added; existing inbox MX and website records were preserved. A sending-only key restricted to that domain and a managed Turnstile widget were created. The four settings are saved only in the Feline Vercel project's Production environment; private values are neither committed nor printed. See [setup notes](resend-delivery-setup.md).

The current live deployment still uses FormSubmit until this branch is merged and deployed. No real Resend test email has been sent. Provider acceptance and actual inbox arrival must be checked after deployment, with fresh approval for a labelled test and confirmation from the mailbox owner. DNS verification alone does not establish inbox delivery.

## Form changes

- Send through `/api/contact/`, with the fixed recipient `jolien@feline-consulting.be` and the visitor address as Reply-To.
- Validate fields and request size on the server; verify Turnstile token, hostname and action before sending. A honeypot also filters simple bots.
- Use a stable submission ID and content hash for provider idempotency when retrying an uncertain result. Visitor edits create a new submission ID; token refreshes do not.
- Only show success when Resend returns an accepted message ID. Preserve drafts on failure, keep fields read-only during submission, and provide specific validation/configuration feedback.
- Keep the status region present and atomic; announce results after the busy state clears.
- Provide an encoded email-app draft as a fallback, including without JavaScript. It requires an email app and never sends automatically.
- Update privacy/cookie information for Resend and Turnstile.

## Accessibility changes

- Restore visible focus outlines, including buttons and disclosure summaries.
- Replace low-contrast white text on mint/orange with dark green text, retaining backgrounds, typography, waves and rounded cards. Sample contrast ratios: hero text 5.13:1; orange-button text 5.37:1; form border against white 3.64:1.
- Improve hamburger and carousel control contrast; give carousel arrows and pagination 44px targets, with clickable, keyboard-accessible dots.
- Remove redundant nested navigation and the mobile menu's empty logo tab stop.
- Name the cookie notice, reserve its height to avoid obscuring content, and allow dismissal/reset when browser storage is unavailable.

## Validation

- Production build and 12-page search metadata checks passed.
- `node scripts/check-contact.mjs`: network/HTTP/JSON/timeout failures preserve drafts, success retry/reset, duplicate-submit prevention, live-region update order and email-draft encoding.
- `node scripts/check-contact-delivery.mjs`: mocked provider checks cover validation, origin and size limits, verification failures, fixed recipient/Reply-To, stable retry keys, provider errors and private error responses. No email is sent by these tests.
- `node scripts/check-cookie-choice.mjs`: notice spacing and dismissal with normal or blocked storage.
- Browser: required fields prevent an empty submission and focus the name; email keyboard focus has a 3px outline; mobile menu Escape returns focus; hidden logo link is removed from the mobile tab sequence; skip link moves focus to main.
- Browser: carousel Enter advances design 2 to 3; dots are 44×44px with button roles and tabindex.
- Browser: cookie notice reserves its measured height and releases it after dismissal.
- 60 page/viewport combinations (12 routes × 320, 390, 768, 1024, 1440px) passed without horizontal overflow; one H1/main per page, image alt attributes and form labels present. Internal links/fragments and missing-article response also passed.

This is a targeted code/keyboard/mobile review, not a formal WCAG certification or a test with every screen reader. Reduced-motion rules remain in place. Real inbox delivery remains the outstanding external check.

References: https://resend.com/docs/api-reference/emails/send-email, https://developers.cloudflare.com/turnstile/get-started/server-side-validation/ and https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
