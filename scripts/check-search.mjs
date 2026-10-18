import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
const root = '.vercel/output/static';
const origin = new URL(process.env.PUBLIC_SITE_URL || 'https://feline-consulting.vercel.app/').origin;
const preview = process.env.VERCEL_ENV === 'preview';
const routes = ['/', '/about/', '/services/', '/portfolio/', '/contact/', '/blog/', '/privacy/', '/cookiepolicy/', '/terms-conditions/', ...readdirSync(`${root}/blog`, { withFileTypes: true }).filter(x => x.isDirectory()).map(x => `/blog/${x.name}/`)];
const sitemap = readFileSync(`${root}/sitemap.xml`, 'utf8');
assert.equal((sitemap.match(/<loc>/g) || []).length, routes.length);
const titles = new Set();
for (const route of routes) {
  const html = readFileSync(`${root}${route}index.html`, 'utf8');
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
  assert(title?.includes('Feline Consulting'), `${route}: branded title`);
  assert(!titles.has(title), `${route}: unique title`); titles.add(title);
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
  assert(html.includes(`rel="canonical" href="${origin}${route}"`), `${route}: absolute canonical`);
  assert(sitemap.includes(`<loc>${origin}${route}</loc>`));
  for (const key of ['og:title', 'og:description', 'og:image', 'og:image:alt', 'og:url', 'og:locale', 'twitter:card']) assert(html.includes(`="${key}"`), `${route}: ${key}`);
  const image = html.match(/property="og:image" content="([^"]+)"/)?.[1];
  assert(image?.startsWith(origin)); assert(existsSync(`${root}${new URL(image).pathname}`));
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(x => JSON.parse(x[1]));
  assert(schemas.some(x => x['@type'] === 'Organization'));
  if (route.startsWith('/blog/') && route !== '/blog/') {
    assert(html.includes('property="og:type" content="article"'));
    assert(schemas.some(x => x['@type'] === 'BlogPosting' && x.mainEntityOfPage === `${origin}${route}`));
  }
  assert.equal(html.includes('name="robots" content="noindex, follow"'), preview, `${route}: indexing mode`);
}
assert(readFileSync(`${root}/404.html`, 'utf8').includes('name="robots" content="noindex, follow"'));
assert(readFileSync(`${root}/robots.txt`, 'utf8').includes(`Sitemap: ${origin}/sitemap.xml`));
console.log(`PASS ${routes.length} static pages: unique titles, canonicals, share images, schemas, sitemap, robots and ${preview ? 'preview noindex' : 'production indexing'}`);
