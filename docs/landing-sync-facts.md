# Landing-page sync fact table

Audit date: 2026-10-29

Scope: software source repository is read-only. This table distinguishes source-verified implementation/documentation from live deployment facts that could not be checked. Only source-verified claims are used on the landing pages; deployment-dependent OCR is explicitly qualified.

| Fact | Source of evidence | Status | Landing-page treatment |
|---|---|---|---|
| Canonical software version is 1.3.1 | `src/content/site.ts` (`SITE.version`); `package.json` | VERIFIED (source) | Structured data and source-version references say 1.3.1. The currently deployed app version and formal GitHub Release status are not asserted. |
| Batch limit is up to 50 PDFs; per-file progress, statuses and possible-duplicate detection | `README.md`; `CHANGELOG.md` v1.1.0 | VERIFIED (source docs) | Described as documented behavior, not as a separately live-tested deployment. |
| Per-file UI limit is 25 MB and 100 pages | `README.md` describes 100 pages; software UI/config was not live-inspected in this audit | PARTIALLY VERIFIED | 100 pages is source documented. 25 MB is reported in source context but exact live UI was NOT VERIFIED; pages qualify it as the documented app limit. |
| Multi-invoice splitting on invoice-number changes; multi-page invoices grouped | `README.md`; `CHANGELOG.md` v1.1.0 | VERIFIED (source docs) | Claim includes explicit edge-case caveat; boundary behavior is not fully tested. |
| Local Tesseract OCR; English only; 20 pages; confidence cap 75%; review required | `docs/OCR.md`; `CHANGELOG.md` v1.1.0; `package.json` | VERIFIED (source docs) | Described as optional and build-dependent, not guaranteed to be enabled on the live deployment. |
| OCR assets are included and working on the deployed app | Live app URL and expected same-origin OCR asset requests could not be fetched by available web inspection; no browser/DevTools network session available | UNVERIFIED | Explicitly marked NOT VERIFIED; never claim OCR is enabled in every deployment. |
| GST-aware extraction fields: GSTIN, HSN, taxable value, tax rate, tax amount, CGST/SGST/IGST | `README.md`; `CHANGELOG.md` v1.1.0 | VERIFIED (source docs) | Claimed as supported extraction fields, with a no-guarantee/review caveat. |
| Locale support en-IN, en-US, en-GB, de-DE | `src/config/locales.ts`; `CHANGELOG.md` v1.2.0 | VERIFIED | Listed as supported date/number parsing locales. |
| Ambiguous date warnings and reprocessing preserves manual edits | `CHANGELOG.md` v1.2.0; source-declared locale behavior | VERIFIED (source docs) | Described with review reminder. |
| XLSX combined workbook, invoice-level CSV, line-item CSV, JSON validation status | `CHANGELOG.md` v1.1.0; `README.md` | VERIFIED (source docs) | All four export scopes/formats described. |
| No application backend/upload by application code; local processing | `README.md`; `docs/OCR.md`; `TERMS.md` | VERIFIED (source documentation) | Exact qualification retained: “Files are processed locally by this application and are not uploaded by application code. Verify your own browser network activity in the Network tab if your environment requires independent confirmation.” Live network activity was NOT VERIFIED. |
| OCR worker/WASM/language assets same-origin when bundled | `docs/OCR.md` | VERIFIED (source documentation) | Conditional wording: only when assets are bundled. Live asset requests were NOT VERIFIED. |
| Formula-injection sanitization and restrictive CSP | `README.md`; `docs/OCR.md`; application source documentation | VERIFIED (source documentation) | Described as documented safeguards, not as a guarantee of complete security. Live response headers were NOT VERIFIED. |
| Licence is MIT; terms say no warranties | `LICENSE`; `TERMS.md` | VERIFIED | Marketing copy says MIT/no warranties. |
| Previous claim that future production versions would use a commercial licence | Not supported by current `LICENSE` or `TERMS.md` | UNVERIFIED / UNSUBSTANTIATED | Removed from marketing, FAQ, roadmap and LLM text. No future licensing change is asserted. |
| Live marketing-page rendering, responsive layout at 320/375/768/1440 px | No browser/Playwright session available through this GitHub connector workflow | UNVERIFIED | Requires human/browser verification before merge. |
| Live sitemap URLs and canonical/OG response behavior | Source markup can be checked; live site fetch was blocked by web inspection | PARTIALLY VERIFIED | Canonical/og:url/sitemap literals retained and source consistency validation added; live URL resolution NOT VERIFIED. |

## Source files reviewed
- Software: `README.md`, `CHANGELOG.md`, `package.json`, `src/content/site.ts`, `src/config/locales.ts`, `docs/OCR.md`, `LICENSE`, `TERMS.md`.
- Landing: `index.html`, `how-it-works/index.html`, `faq/index.html`, `roadmap/index.html`, `privacy/index.html`, `developer/index.html`, `llms.txt`, `llms-full.txt`, `README.md`, `sitemap.xml`.

## Explicitly not verified
- Live app version/release status.
- Whether OCR assets are currently deployed and fetched successfully.
- Live browser network requests and response CSP headers.
- Responsive visual checks at 320, 375, 768 and 1440 pixels.
- Google Rich Results Test and social preview rendering.
