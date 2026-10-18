# Feline Consulting

Belgian graphic design studio website, in Dutch, built with Astro, React and SCSS.

## Development

Use Node.js 22 LTS. Run `npm ci`, then `npm run dev`.
Run `npm run build` before submitting changes.

## Deployment

The project uses Astro server rendering and the Vercel adapter. Connect the repository to Vercel and use the Astro framework preset. The old Cloudflare configuration has been removed because it did not match the active adapter.

## Content and images

Pages are in `src/pages/`; blog articles are in `src/content/blog/`.
Public WebP images are resized to a maximum width of 1600px. Original artwork remains in the repository.

## Contact form

FormSubmit handles delivery. The recipient must activate the service. Verify delivery from a deployed preview before publishing. Submissions time out after 15 seconds, preserve entered text on failure, and prevent duplicate sends while pending.

## Review notes

- Replace the three identical logo samples with distinct approved client projects and add short case studies (brief, approach, outcome).
- Confirm the intended form recipient: the form delivers to Ward while the footer lists Jolien. The recipient has been preserved to avoid changing delivery without confirmation.
- Review third-party form and cookie wording against the services actually used; no tracking was added.
- Confirm font licensing before publishing; supplied Futura assets are preserved.
- Check a real phone and deployed Vercel preview, including form delivery.
