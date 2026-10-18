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
