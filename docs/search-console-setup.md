# Google Search Console and favicon

The working production site is currently https://feline-consulting.vercel.app/. The custom domain has not yet been confirmed to serve this deployment, so canonical URLs and the sitemap remain on the Vercel origin.

## Connect Search Console

1. Sign in at https://search.google.com/search-console with the Google account that should own the property.
2. For the working site, add the URL-prefix property `https://feline-consulting.vercel.app/`.
3. Choose HTML tag verification. Copy only the content value from Google's `google-site-verification` tag.
4. Set `PUBLIC_GOOGLE_SITE_VERIFICATION` to that value in Vercel's production environment and redeploy (or add Google's exact downloaded verification HTML file to `public/`). The layout emits the tag when the environment variable is set; no verification token is invented or committed.
5. Check the published homepage source, then complete verification in Search Console.
6. Submit `https://feline-consulting.vercel.app/sitemap.xml`. Inspect the homepage and request indexing. Indexing is not immediate or guaranteed.

When the custom domain is connected, prefer a Domain property `feline-consulting.be` with Google's DNS TXT verification. Keep the verification record in place. Set `PUBLIC_SITE_URL` to the actual preferred HTTPS origin, redeploy, check canonical/sitemap URLs, then submit that domain's sitemap. Avoid submitting the new site's sitemap under the older WordPress property's URL.

Google's verification guidance: https://support.google.com/webmasters/answer/9008080?hl=en-GB

## Icons

The Astro starter favicon is replaced with a mint F monogram, dark green letter and orange accent. SVG is the source; PNG versions cover 16, 32, 48, 180, 192 and 512px. A multi-size ICO provides a conventional browser fallback, the Apple touch icon supports saved home-screen shortcuts, and the manifest preserves ordinary browser display (no service worker/offline behaviour added).

Browser and Google favicon caches can retain the old icon after deployment. Check the favicon asset URL directly to distinguish deployment problems from cached icons.
