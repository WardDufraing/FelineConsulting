import assert from 'node:assert/strict';
import { getTransformedRoutes } from '@vercel/routing-utils';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
const root = '.vercel/output/static';
const origin = new URL(process.env.PUBLIC_SITE_URL || 'https://feline-consulting.be/').origin;
const preview = process.env.VERCEL_ENV === 'preview';
const routes = ['/', '/about/', '/services/', '/portfolio/', '/contact/', '/blog/', '/privacy/', '/cookiepolicy/', '/terms-conditions/', ...readdirSync(`${root}/blog`, { withFileTypes: true }).filter(x => x.isDirectory()).map(x => `/blog/${x.name}/`)];
const sitemap = readFileSync(`${root}/sitemap.xml`, 'utf8');
assert.equal((sitemap.match(/<loc>/g) || []).length, routes.length);
const titles = new Set();
const descriptions = new Set();
for (const route of routes) {
  const html = readFileSync(`${root}${route}index.html`, 'utf8');
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
  assert(title?.includes('Feline Consulting'), `${route}: branded title`);
  assert(!titles.has(title), `${route}: unique title`); titles.add(title);
  const description = html.match(/name="description" content="([^"]+)"/)?.[1];
  assert(description && !descriptions.has(description), `${route}: unique description`); descriptions.add(description);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `${route}: one main heading`);
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
  assert(html.includes(`rel="canonical" href="${origin}${route}"`), `${route}: absolute canonical`);
  assert(sitemap.includes(`<loc>${origin}${route}</loc>`));
  for (const key of ['og:title', 'og:description', 'og:image', 'og:image:alt', 'og:url', 'og:locale', 'twitter:card']) assert(html.includes(`="${key}"`), `${route}: ${key}`);
  const image = html.match(/property="og:image" content="([^"]+)"/)?.[1];
  assert(image?.startsWith(origin)); assert(existsSync(`${root}${new URL(image).pathname}`));
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(x => JSON.parse(x[1]));
  const organization = schemas.find(x => x['@type'] === 'Organization');
  assert.equal(organization.url, `${origin}/`);
  assert.equal(organization.vatID, 'BE0787715224');
  assert.equal(organization.address.addressLocality, 'Zoersel');
  assert(schemas.some(x => x['@type'] === 'WebSite' && x.url === `${origin}/`));
  assert(schemas.some(x => ['WebPage', 'AboutPage', 'ContactPage'].includes(x['@type']) && x.url === `${origin}${route}`));
  if (route !== '/') {
    const crumbs = schemas.find(x => x['@type'] === 'BreadcrumbList').itemListElement;
    assert.equal(crumbs[0].item, `${origin}/`);
    assert.equal(crumbs.at(-1).item, `${origin}${route}`);
    assert.equal(crumbs.length, route.startsWith('/blog/') && route !== '/blog/' ? 3 : 2);
    crumbs.forEach((crumb, index) => assert.equal(crumb.position, index + 1));
  }
  if (route === '/services/') {
    const services = schemas.filter(x => x['@type'] === 'Service');
    assert.equal(services.length, 3);
    for (const service of services) {
      assert.equal(service.provider['@id'], organization['@id']);
      assert(html.includes(`id="${new URL(service.url).hash.slice(1)}"`));
    }
  }
  if (route.startsWith('/blog/') && route !== '/blog/') {
    assert(html.includes('property="og:type" content="article"'));
    assert(schemas.some(x => x['@type'] === 'BlogPosting' && x.mainEntityOfPage === `${origin}${route}`));
  }
  assert.equal(html.includes('name="robots" content="noindex, follow"'), preview, `${route}: indexing mode`);
}
assert(readFileSync(`${root}/404.html`, 'utf8').includes('name="robots" content="noindex, follow"'));
assert(readFileSync(`${root}/robots.txt`, 'utf8').includes(`Sitemap: ${origin}/sitemap.xml`));
console.log(`PASS ${routes.length} static pages: unique titles, canonicals, share images, schemas, sitemap, robots and ${preview ? 'preview noindex' : 'production indexing'}`);

const redirects = getTransformedRoutes(JSON.parse(readFileSync('vercel.json', 'utf8')));
assert.equal(redirects.error, null, 'Vercel accepts redirect configuration');
const hostRoutes = redirects.routes.filter(route => route.has?.some(condition => condition.type === 'host'));
assert.equal(hostRoutes.length, 2);
for (const route of hostRoutes) {
  assert.equal(route.status, 308);
  for (const path of ['/', '/services', '/services/', '/blog/branding-gids/']) {
    const match = path.match(new RegExp(route.src));
    assert(match, `alias redirect matches ${path}`);
    assert.equal(route.headers.Location.replace('$1', match[1] || ''), `https://feline-consulting.be${path}`);
  }
}
assert(!hostRoutes.some(route => route.has.some(condition => condition.value === 'feline-consulting.be')), 'no primary-host redirect loop');
assert(hostRoutes.every(route => route.has.every(condition => ['www.feline-consulting.be', 'feline-consulting.vercel.app'].includes(condition.value))), 'preview hosts remain isolated');
const legacy = redirects.routes.find(route => route.has?.some(condition => condition.key === 'page_id' && condition.value === '49'));
assert.equal(legacy.headers.Location, 'https://feline-consulting.be/services/');
console.log('PASS permanent alias and confirmed legacy-service redirects: root, nested paths, trailing slashes, no primary-host loop or preview-host takeover');
