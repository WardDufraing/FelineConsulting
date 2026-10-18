import type { APIRoute } from 'astro';
import { handleContact } from '../../lib/contact-delivery';
export const prerender = false;
export const POST: APIRoute = ({ request }) => handleContact(request, { env: process.env, fetch });
export const ALL: APIRoute = () => new Response(null, { status: 405, headers: { Allow: 'POST', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' } });
