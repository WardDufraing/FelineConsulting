# Google Search Console and favicon

The custom domain now serves the Vercel site. The SEO branch changes the preferred origin to `https://feline-consulting.be/` for canonical URLs, sharing links, structured data, robots and sitemap. Production aliases redirect to that origin after deployment. Preview deployments retain noindex.

## Optional Search Console setup

No Search Console account/property has been configured in this task. The owner previously paused this setup.

If the owner chooses to resume:

1. Sign in to the intended Google account at https://search.google.com/search-console.
2. Add the Domain property `feline-consulting.be` and publish Google's exact DNS TXT verification record in Cloudflare. Keep the record in place. Alternatively use a URL-prefix property `https://feline-consulting.be/` with the provided HTML-tag verification and `PUBLIC_GOOGLE_SITE_VERIFICATION`.
3. After this branch is deployed, inspect the homepage and services URL and submit `https://feline-consulting.be/sitemap.xml`.
4. Check indexing and migration redirects over time. A sitemap or valid structured data does not guarantee indexing, rankings or rich results.

If `PUBLIC_SITE_URL` is explicitly set in Vercel, it must be `https://feline-consulting.be/`; otherwise the code's new default applies. Redeploy after changing a build-time setting.

Google verification guidance: https://support.google.com/webmasters/answer/9008080?hl=en-GB

## Icons

The Astro starter favicon is replaced with a flowing F inspired by the existing logo: looped top stroke and curved stem in dark green on mint, with orange dots. SVG is the source; PNG versions cover 16, 32, 48, 180, 192 and 512px. A multi-size ICO provides a conventional browser fallback, the Apple touch icon supports saved home-screen shortcuts, and the manifest preserves ordinary browser display (no service worker/offline behaviour added).

Browser and Google favicon caches can retain the old icon after deployment. Check the favicon asset URL directly to distinguish deployment problems from cached icons.
