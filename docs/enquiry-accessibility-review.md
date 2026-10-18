# Enquiry delivery and accessibility review

Branch: `fix/enquiry-delivery-and-accessibility`, based on current main.

## Delivery status — not yet confirmed

The live form targets `jolien@feline-consulting.be` through FormSubmit's AJAX endpoint. One explicitly approved live test was submitted with the name “Feline website delivery test”, Jolien's public email in the email field, and the agreed delivery-test message. The live form displayed its failure message; the user confirmed no test or activation email arrived. No additional test email was sent.

Read-only HTTP diagnostics against FormSubmit were blocked with Cloudflare error 1010 (browser signature denied). This confirms the diagnostic client was blocked; it does not establish that every normal visitor is blocked. The exact response body of the browser's POST was not available, so activation, filtering and delivery cannot be distinguished from that test alone. A test from the user's normal browser is pending. Do not describe delivery as fixed or verified.

Google and Cloudflare public DNS both return Cloudflare Email Routing MX records for feline-consulting.be. This establishes a mail route, not that the Jolien forwarding rule or destination inbox is working. Mail forwarding and FormSubmit activation need confirmation by the mailbox owner. No DNS, forwarding or account settings were changed.

## Form changes

- Add a clear email subject and table format, retaining the recipient and visitor email field used for Reply-To.
- Keep the status region present and atomic; announce the result after the form's busy state clears.
- Keep drafts on failures and say when sending cannot be confirmed, rather than implying confirmed delivery. Reset only after provider success.
- Provide an email-app fallback that carries the current name, email and message in a properly encoded draft. It also works as a plain mailto link without JavaScript; it requires an email app and does not send automatically.
- Retain required/email validation, allow a one-character name, and improve mobile email entry settings.

## Accessibility changes

- Restore visible focus outlines, including buttons and disclosure summaries.
- Replace low-contrast white text on mint/orange with dark green text, retaining backgrounds, typography, waves and rounded cards. Sample contrast ratios: hero text 5.13:1; orange-button text 5.37:1; form border against white 3.64:1.
- Improve hamburger and carousel control contrast; give carousel arrows and pagination 44px targets, with clickable, keyboard-accessible dots.
- Remove redundant nested navigation and the mobile menu's empty logo tab stop.
- Name the cookie notice, reserve its height to avoid obscuring content, and allow dismissal/reset when browser storage is unavailable.

## Validation

- Production build and 12-page search metadata checks passed.
- `node scripts/check-contact.mjs`: network/HTTP/activation/JSON/timeout failures preserve drafts, success retry/reset, duplicate-submit prevention, live-region update order and email-draft encoding.
- `node scripts/check-cookie-choice.mjs`: notice spacing and dismissal with normal or blocked storage.
- Browser: required fields prevent an empty submission and focus the name; email keyboard focus has a 3px outline; mobile menu Escape returns focus; hidden logo link is removed from the mobile tab sequence; skip link moves focus to main.
- Browser: carousel Enter advances design 2 to 3; dots are 44×44px with button roles and tabindex.
- Browser: cookie notice reserves its measured height and releases it after dismissal.
- 60 page/viewport combinations (12 routes × 320, 390, 768, 1024, 1440px) passed without horizontal overflow; one H1/main per page, image alt attributes and form labels present. Internal links/fragments and missing-article response also passed.

This is a targeted code/keyboard/mobile review, not a formal WCAG certification or a test with every screen reader. Reduced-motion rules remain in place. Real inbox delivery remains the outstanding external check.

References: https://formsubmit.co/documentation and https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
