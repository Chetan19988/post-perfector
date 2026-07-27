## Goal

Ship the Chetan Lifters site as **pure static HTML / CSS / JS** — no React, no TanStack components, no build-time JSX. Minimal design, fast load.

## Where files live

All pages go under `public/` and are served by the static server as-is:

```
public/
  home.html                  ← entry page (was index.html)
  services.html
  about.html
  contact.html
  faq.html
  operator-jobs.html         ← was forklift-operator-jobs.html
  hi/
    home.html
    services.html
    about.html
    contact.html
    faq.html
    operator-jobs.html
  css/
    style.css                ← single minimal stylesheet
  js/
    main.js                  ← mobile menu toggle
    lang.js                  ← language switch (kept from upload)
  robots.txt
  sitemap.xml
  favicon.ico                ← already present
```

Each HTML file is self-contained: `<!DOCTYPE html>`, `<link rel="stylesheet" href="/css/style.css">`, semantic markup, one `<script defer src="/js/main.js"></script>` at the end. No frameworks, no bundlers touching these files.

## The `/` route problem (unavoidable)

TanStack owns `/`, so `public/index.html` would be ignored. Two options — pick one:

- **A. Redirect (recommended):** `src/routes/index.tsx` becomes a one-liner that redirects `/` → `/home.html`. This is the only React file in the whole site and users never see it render.
- **B. No redirect:** delete `src/routes/index.tsx`; visitors must go to `/home.html` directly. Cleaner "no react at all" but `/` shows a 404.

Everything else — every page you actually design, every link in the nav — is plain `.html`.

## Minimal design

- System font stack (`-apple-system, Segoe UI, Roboto, sans-serif`). No web fonts.
- Two colors: near-black text on white, one accent (`#f59e0b` amber) for CTAs.
- No shadows, no gradients, no icon libraries. Inline SVG only for the phone icon.
- Single-column, max-width ~720px, generous whitespace.
- Hand-written CSS in one file, target < 4 KB. Replaces the 13 KB `css/style.css` from the upload.

## Minimal JS

- `main.js` (~20 lines): mobile nav toggle + set active nav link.
- `lang.js`: keep the uploaded version as-is (handles EN/HI toggle) — you asked for JS, this is the only real JS the site needs.
- No analytics, no third-party scripts, no fetch calls.

## Performance

- Zero external requests except the CSS + JS files (both small, both cacheable).
- No images bundled (upload had none). If you add hero photos later, they go through Lovable Assets so they're CDN-cached.
- Inline the SEO/meta tags per page (unique `<title>`, `description`, canonical, hreflang, og tags) — copied from your uploaded HTML.

## What I won't port

- `metadata.json`, `vite.config.ts`, `package.json`, `tsconfig.json`, `src/*` from the ZIP — those are project scaffolding for a different setup and this project already has its own.

## Decision needed

1. **Redirect `/` to `/home.html` (A), or leave `/` as 404 (B)?**
2. **Include Hindi pages under `/hi/`?** (Upload has them; small extra work.)