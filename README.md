# Astro Handbook

A modular, single-page Astro learning handbook built with plain HTML, CSS, and JavaScript.

The project uses a source composition workflow under `src/` and generates a production-ready `index.html` at the project root.

---

## Highlights

- Componentized source structure (layout + section partials)
- Simple custom include-based build system (no bundler required)
- Astro-themed UI with responsive behavior and accessibility improvements
- Mermaid diagram support in handbook sections
- Deployment-friendly static output

---

## Project Structure

```text
astro-tuts/
├── assets/
|   └── css/main.css
|   └── js/main.js
├── scripts/
|   └── build-html.mjs
├── src/
|   ├── components/
|   |   ├── layout/
|   |   └── sections/
|   └── pages/index.html
├── index.html
├── package.json
└── README.md
```

---

## How It Works

- `src/pages/index.html` is the composition entry file.
- It includes layout and section partials using `{{ include:... }}` tokens.
- `scripts/build-html.mjs` resolves those tokens recursively and outputs the final root `index.html`.

Full architecture notes: see `docs/architecture.md`.

---

## Requirements

- Node.js (LTS recommended)

---

## Scripts

```bash
npm run build
npm run build:html
```

Both commands generate `index.html` from the source files in `src/`.

---

## Local Workflow

1. Edit source files in:
   - `src/components/layout/`
   - `src/components/sections/`
   - `src/pages/index.html`
   - `assets/css/main.css` and `assets/js/main.js`
2. Build the page:
   ```bash
   npm run build
   ```
3. Open `index.html` in a browser.

---

## Important Note

`index.html` is generated. Do not manually edit root `index.html` for long-term changes.
Make edits in `src/` and rebuild.

---

## Author

- Ziad Elnagar
- GitHub: https://github.com/ZiadNagar/astro-handbook
