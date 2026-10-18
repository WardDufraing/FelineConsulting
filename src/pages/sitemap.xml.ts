import { getCollection } from 'astro:content';
import { canonicalUrl } from '../lib/site';
export const prerender = true;
export async function GET() {
  const pages = ['/', '/about/', '/services/', '/portfolio/', '/contact/', '/blog/', '/privacy/', '/cookiepolicy/', '/terms-conditions/'];
  const posts = await getCollection('blog');
  const urls = [...pages, ...posts.map(post => `/blog/${post.id}/`)];
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(path => `<url><loc>${canonicalUrl(path).replace(/&/g, '&amp;')}</loc></url>`).join('')}</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
