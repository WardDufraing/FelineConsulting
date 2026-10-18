# Website review — 18 October 2026

Reviewed deployment: https://feline-consulting.vercel.app/
Starting revision: origin/main at ad90e82.
Branch: fix/live-site-services-and-responsive-layout.

## Findings and changes

| Page | Outcome |
| --- | --- |
| Home | Preserve the existing layout; keep benefit-card text visible during entry animations. |
| Over ons | Replace four narrow desktop columns with two readable columns; retain a single mobile column. Keep copy visible during animation. |
| Diensten | Replace five equally weighted, dense cards with two main directions and three supporting services. Add section shortcuts, concrete examples and a three-part project checklist. Preserve existing service anchors, FAQs and contact path. Match existing palette, fonts, rounded cards and line illustrations. |
| Portfolio | Existing layout and carousel retained. Mobile next-slide control verified. |
| Blog | Keep article cards visible during entry and enlarge read-more touch targets. |
| Three articles | Keep article content visible during entry; retain content and cross-links. |
| Contact | Existing layout and delivery logic retained. Mocked network failure, HTTP failure, retry and duplicate-submit checks passed; no live submission sent. |
| Privacy | Restore list bullets; retain policy text. |
| Cookies / Voorwaarden | No additional changes needed in the reviewed layouts; policy and commercial text retained. |
| 404 | Existing recovery page retained; unknown article returns 404. |
| Footer / navigation | Enlarge mobile footer link targets; mobile menu open/Escape behaviour verified. |

Service examples describe possibilities rather than fixed packages, deliverable guarantees, prices or turnaround promises. No client work or testimonials were added.

## Verification

- Reviewed all 12 content routes on the live Vercel deployment at desktop (1440px) and phone (390px) widths.
- Local checks: 13 routes including the 404 page at 320, 390, 768, 1024 and 1440px — 65 combinations with no horizontal overflow, exactly one H1 and no faded copy.
- Production build on Node 22.22.0 and whitespace checks passed.
- Internal links and fragment targets passed. Original service links `#merken`, `#kaartjes` and `#service-questions` remain valid.
- Section shortcut navigation, FAQ expansion, mobile menu open/Escape and portfolio slide changes verified in the browser.
- Browser viewport simulations; no physical-device test or actual form delivery test.

## Deployment observation

At review time, https://feline-consulting.be redirected to https://www.feline-consulting.be/, which served the older WordPress site; `/services/` returned a server 404. The user supplied the Vercel URL above for the new website. Custom-domain configuration needs separate attention; this branch does not change DNS or hosting settings.
