# Feline Consulting

Belgian graphic design studio website, in Dutch, built with Astro, React and SCSS.

## Development

Use Node.js 22.22 or newer (Node.js 22 LTS recommended). Run `npm ci`, then `npm run dev`.
Run `npm run build` and `npm audit --audit-level=low` before submitting changes.

The GitHub workflow checks both. Unused Stylelint dependencies were removed (there was no lint script or configuration). A scoped override keeps Vercel routing on the compatible patched `path-to-regexp` 6.x release until its parent dependency updates.

## Deployment

The project uses Astro server rendering and the Vercel adapter. Connect the repository to Vercel and use the Astro framework preset. The old Cloudflare configuration has been removed because it did not match the active adapter.

## Content and images

Pages are in `src/pages/`; blog articles are in `src/content/blog/`.
Public WebP images are resized to a maximum width of 1600px. Original artwork remains in the repository.

## Contact form

FormSubmit handles delivery. The recipient must activate the service. Verify delivery from a deployed preview before publishing. Submissions time out after 15 seconds, preserve entered text on failure, and prevent duplicate sends while pending.

## Review notes

- Duplicate logo slides have been removed. Add distinct approved client projects and factual case studies (brief, approach, outcome) when supplied.
- Enquiries deliver to `jolien@feline-consulting.be`, matching the public contact address. FormSubmit activation for this address and an end-to-end delivery check are required before publishing.
- Review third-party form and cookie wording against the services actually used; no tracking was added.
- Confirm font licensing before publishing; supplied Futura assets are preserved.
- Check a real phone and deployed Vercel preview, including form delivery.

## Content review — October 2026

All public pages and the three existing articles have been reviewed for clearer copy, practical guidance, page descriptions and internal links. The five-tip article now contains exactly five numbered tips. Commercial terms were preserved; legal-page typography and the factual FormSubmit/cookie descriptions were corrected. Provider reference: https://formsubmit.co/documentation (submission archive) and https://formsubmit.co/help (retention before activation).

Owner input for a future content pass:
- A portrait and a short approved personal introduction for Jolien.
- Real project assets, permission to show them and factual project descriptions.
- Confirmed deliverable formats, revision scope and typical turnaround by service.
- Review existing commercial terms and complete privacy details such as the applicable retention periods and controller information before publishing policy changes. These were not invented.
