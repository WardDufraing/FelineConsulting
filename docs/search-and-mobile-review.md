# Search, sharing and mobile loading

Branch: `improve/search-sharing-mobile-performance` (based directly on main).

## Search and sharing

- Absolute, query-free canonical URLs and branded titles on every page.
- Open Graph and large social cards, with a 1200 × 630 branded default image and the relevant image/date on articles.
- Organization and BlogPosting JSON-LD using existing company details; no invented reviews, ratings or social accounts.
- Generated sitemap for all 12 content pages, robots.txt referencing it, and noindex for 404 and Vercel preview builds.
- Content pages and articles are generated at build time, rather than rendered on every request.

`PUBLIC_SITE_URL` is the single domain setting, used by Astro, canonical URLs, share URLs, schemas and sitemap. The custom domain has now been confirmed to serve the site. The SEO follow-up defaults to https://feline-consulting.be/; any explicit Vercel override must match that origin. Submit the resulting `/sitemap.xml` in Search Console after domain verification; this change does not claim account verification or indexing.

Canonical and sitemap alignment follows Google's guidance: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls

## Mobile loading

- Blog thumbnails now offer 400px and 800px WebP versions; article images also offer 1536px for larger screens.
- Three original blog thumbnails total 216,158 bytes; 800px versions total 74,352 bytes (66% less), and 400px versions total 32,444 bytes (85% less). Actual selection depends on screen size and pixel density. The mobile browser selected the 800px versions.
- Navigation logos offer 160px, 320px and 480px WebP variants instead of relying on the full 2048px image.
- Image dimensions reserve layout space for blog images and carousel images.
- Existing Futura font-display: swap is retained; the regular 50KB font is preloaded. No new font family or weight was introduced.
- Removed the complete Swiper stylesheet and unused effect/autoplay imports, retaining required navigation styles and lazy carousel hydration.

## Validation

- Production build and `node scripts/check-search.mjs`: 12 pages with unique titles, canonical/social metadata, image assets, parsed schemas and sitemap consistency.
- Preview build: every content page has noindex; production build: indexable content and noindex 404. Canonicals remain on the production origin.
- All internal links/fragments and missing-article 404 checked against the built static output.
- 60 browser checks: 12 content routes × 320, 390, 768, 1024 and 1440px; no horizontal overflow, one H1 and no broken loaded images.
- Desktop article and mobile blog visually checked; portfolio next control advances from design 2 to 3.

These are build, asset-size and browser checks, not measured real-device Core Web Vitals or a Lighthouse score. Real network/visitor performance should be checked after deployment.
