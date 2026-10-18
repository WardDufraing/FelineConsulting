// Set PUBLIC_SITE_URL in Vercel when the custom domain serves this site.
export const siteUrl = new URL(import.meta.env.PUBLIC_SITE_URL || 'https://feline-consulting.vercel.app/');
export const isPreview = process.env.VERCEL_ENV === 'preview';
export function canonicalUrl(path: string) {
  const cleanPath = path === '/' ? '/' : `${path.replace(/\/+$/, '')}/`;
  return new URL(cleanPath, siteUrl).href;
}
