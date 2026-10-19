# Consent-based Google Analytics setup

Branch: `feature/consent-based-google-analytics`.

## Prepared website behaviour

- GA4 uses basic consent mode: no Google script/request before an explicit Analytics opt-in. Ad storage, ad user data and ad personalization remain denied.
- The old `cookiesAccepted` flag is ignored because that banner stated that no trackers were present. Fresh consent is stored under `felineAnalyticsConsentV1` for at most 180 days; missing, malformed, expired and future-dated records require a fresh choice.
- Refusal leaves Analytics unloaded. Footer preferences reopen the choice. Withdrawal sets the GA disable flag, removes standard GA cookies and reloads the page to unload the script. The cookie-policy reset removes the saved choice and disables Analytics.
- Page views use origin + pathname, without query strings or fragments. Referrer URLs are similarly reduced. No contact-form values or custom form events are sent.
- Preview, localhost, invalid/missing measurement IDs and non-production hostnames cannot load Analytics. Actual allowed hostnames are feline-consulting.be and www.feline-consulting.be.
- Existing banner spacing, keyboard focus and contact fallback remain. Privacy/cookie text reflects the new behaviour.

## Account setup still to complete

No Feline property, stream or Production measurement-ID setting has been created yet. The signed-in account contains “Ward Dufraing – Client Analytics” and a personal account; the owner has been asked which account to use or whether an existing Feline measurement ID is available. Do not use another client's ID.

Once confirmed:

1. Create/select a separate Feline GA4 property and a web stream for https://feline-consulting.be/. Use Belgium reporting time zone and EUR currency.
2. Disable enhanced measurement for this initial integration, especially form interactions and history-based page changes; the code explicitly sends sanitized page views. Leave Google Signals/user-provided data/advertising personalization off. Do not link Ads or enable user-ID/form tracking. Choose a short retention period (2 months) for event-level data.
3. Save the public web-stream ID (G-...) as `PUBLIC_GA_MEASUREMENT_ID` in this Vercel project's Production environment only. It is a public identifier, not an API secret. No measurement-protocol API key is needed.
4. Merge/deploy only after configuration is reviewed. Production build-time environment changes require a new deployment.
5. Verify in the browser: no Google script/requests before consent or after refusal; consent loads one tag and sends a sanitized page view; withdrawal disables future collection and clears cookies. Check GA Realtime with a deliberate consented test visit after deployment. Never enter real enquiry details for an analytics test.

## Validation so far

Production build and existing 18-page SEO checks passed. The rewritten cookie/analytics regression suite tests refusal, legacy choice, expiry, malformed storage, blocked storage, accepted choice, duplicate acceptance, sanitized URLs, advertising defaults, preview isolation, withdrawal, reset, cookie cleanup and reserved banner spacing. Tests mock the browser and send no data to Google.

Local desktop 1280px and mobile 390px checks: new banner, refusal and footer reopening work; no horizontal overflow; space is reserved for the banner; no Google script loads. Live GA stream/Realtime verification remains pending account configuration and deployment.

References:
- https://developers.google.com/tag-platform/security/guides/consent
- https://developers.google.com/tag-platform/security/concepts/consent-mode
- https://support.google.com/analytics/answer/9539598
