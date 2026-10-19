# Lighter-mint consistency and contrast review

Branch: `fix/sitewide-mint-and-contrast`, based on merged PR #18.

## Findings and focused fixes

- The header/hero already used approved lighter mint `#a4dfd4`, while the footer and browser/manifest theme still used the original `#79d1c2`. Match the large surfaces and browser theme to the approved lighter mint.
- Introduce one Sass surface token for header, hero and footer. Preserve the original mint as a decorative accent and keep pale card/callout backgrounds, orange buttons, original orange logo and its approved shadow.
- Replace the faint orange desktop active-page underline with the existing dark green `#356e64`. This is a thin state indicator, not a border around buttons or the logo. Existing aria-current remains.
- Correct address and VAT from PR #18 are retained.

## Review scope

Reviewed the homepage, About, Diensten, Portfolio, Contact, blog index, three blog articles, privacy, cookie policy, terms and custom 404 page. Desktop width 1280px and mobile width 390px. Rendered text/background colour checks found no failures against 4.5:1 normal-text / 3:1 large-text thresholds, and no horizontal overflow. Visually inspected shared header/footer and Diensten surfaces. Logo artwork, decorative borders and portfolio images are not treated as body text.

The colour check uses computed text colours and the nearest opaque background. It does not replace manual assessment of images, transparency, every interactive state or a formal accessibility audit. No claim of complete WCAG conformance is made. The approved original-orange logo is deliberately preserved.

Production build, 12-page search metadata checks, contact-client regression checks, cookie-choice checks and whitespace checks passed. No enquiry was sent during this review.
