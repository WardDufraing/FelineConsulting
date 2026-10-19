import logoFiles from '../../public/images/blog/logo-bestanden.webp';
import wedding from '../../public/images/blog/huwelijksdrukwerk.webp';
import proof from '../../public/images/blog/drukproef-controleren.webp';
import branding from '../../public/images/blog/branding-guide.webp';
import birth from '../../public/images/blog/geboortekaartje-tips.webp';
import type from '../../public/images/blog/lettertype-kiezen.webp';
export const blogImages = {
  '/images/blog/logo-bestanden.webp': logoFiles,
  '/images/blog/huwelijksdrukwerk.webp': wedding,
  '/images/blog/drukproef-controleren.webp': proof,
  '/images/blog/branding-guide.webp': branding,
  '/images/blog/geboortekaartje-tips.webp': birth,
  '/images/blog/lettertype-kiezen.webp': type,
};
export function blogImage(path: string) {
  const image = blogImages[path as keyof typeof blogImages];
  if (!image) throw new Error(`Missing blog image metadata: ${path}`);
  return image;
}
