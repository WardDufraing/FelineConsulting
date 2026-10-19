# SEO audit and implementation

Branch: `improve/seo-discoverability`, based on merged PR #19.

## Confirmed live findings

The apex domain, www domain and named Vercel production alias all returned the new site with HTTP 200. The custom-domain pages still declared the Vercel hostname as canonical, and robots/sitemap/share metadata also pointed there. This sent mixed preferred-domain signals. Google search also returned the former WordPress services URL `https://www.feline-consulting.be/?page_id=49`.

## Changes

- Default the shared site origin, Astro configuration, test expectations and documented environment setting to `https://feline-consulting.be/`. Canonicals, sitemap, robots, share images and organization/article IDs use it consistently.
- Add permanent Vercel redirects for the exact www and named production-alias hosts, preserving paths. Preview hostnames are not captured. Preserve the confirmed legacy services link with a `page_id=49` root redirect to `/services/`; no other old WordPress IDs were guessed.
- Add descriptive, unique titles for service, about, contact, portfolio and blog pages; describe Zoersel accurately in homepage/about metadata and a small amount of visible text. Retain the established headlines, design and examples without inventing clients, testimonials or business claims.
- Add WebSite, WebPage/AboutPage/ContactPage, hierarchical breadcrumb and services JSON-LD. Services reference the existing organization and actual page sections. Keep the verified address and VAT; do not invent hours, phone numbers, ratings, coordinates or walk-in availability.
- Normalize related article links to the site's trailing-slash convention.
- Expand search checks to verify unique descriptions, one H1, organization details, hierarchy, services/anchors and Vercel redirect compilation/matching.

## Validation and limits

Production and preview builds pass. All 12 content pages have unique titles/descriptions, canonical/share URLs, appropriate schemas and sitemap entries. Custom 404 remains noindex; previews remain noindex. Redirects compile through Vercel's routing utilities and tests cover root/nested paths, trailing slashes, primary-host loop avoidance and preview isolation. Contact client and mocked delivery regressions pass; no real enquiry was sent. Browser checks confirmed the homepage design at desktop 1280px and no overflow on homepage, About, Diensten and an article at mobile 390px, with one H1 and the correct custom-domain canonical.

The deployed redirects must still be checked after merge. Local static preview does not execute Vercel edge rules. If Vercel has an explicit PUBLIC_SITE_URL override, set it to the custom domain before deployment. Current code configuration cannot override a conflicting project/domain-dashboard redirect; verify those if a loop appears.

No Search Console setup or submission was performed; that account work was previously paused. No ranking or rich-result guarantee is made.

## Next steps after deployment

1. Check apex self-canonical, www and named Vercel alias permanent redirects, the legacy services query URL, robots and sitemap on production.
2. If the owner wants to resume Search Console, verify the `feline-consulting.be` Domain property, submit its sitemap and inspect homepage/services indexing. No need to buy an SEO plugin.
3. Add genuinely distinct client projects when available, with permission, real descriptions and useful images. Keep publishing helpful, original answers to customers' design questions; do not generate near-duplicate location pages.
4. Consider a Google Business Profile only if the business meets Google's eligibility criteria; confirm actual customer-facing arrangements first.

References:
- https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
- https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- https://vercel.com/docs/project-configuration/vercel-json
