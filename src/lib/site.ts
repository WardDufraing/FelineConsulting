// One preferred public origin for canonicals, sharing links and the sitemap.
export const siteUrl = new URL(import.meta.env.PUBLIC_SITE_URL || 'https://feline-consulting.be/');
export const isPreview = process.env.VERCEL_ENV === 'preview';
export function canonicalUrl(path: string) {
  const cleanPath = path === '/' ? '/' : `${path.replace(/\/+$/, '')}/`;
  return new URL(cleanPath, siteUrl).href;
}
