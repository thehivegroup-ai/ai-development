# Skill: Fetch and Validate Production HTML (Fallback)

## Purpose
Fetch production HTML and validate it is the real page.

## Guidance
- For parity work, **Playwright capture is preferred** because it captures rendered DOM + screenshots.
- Use this skill as a fallback when Playwright capture is not available.

## Preferred (Playwright)
- `node scripts/parity/capture_rendered.mjs prod "<PROD_URL>" ".temp/parity/prod"`

## Fallback (curl)
- `bash scripts/scraping/fetch_page.sh "<PROD_URL>" ".temp/parity/prod/page.html"`
- `bash scripts/scraping/validate_html.sh ".temp/parity/prod/page.html" "<EXPECTED_MARKER>"`

## Outputs
- `.temp/parity/prod/page.html` (curl fallback only)

## References
- `docs/standards/scraping-comparison.md`
