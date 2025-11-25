# NHM ROI Calculator

This project is a Vite + React + TypeScript single-page app. Because the entrypoint (`src/main.tsx`) is TypeScript and uses module imports, the calculator must be served through the Vite dev server or through the compiled `dist` output. Opening `index.html` directly in the browser (e.g., using a `file://` URL) will lead to a blank screen because the browser cannot transpile TypeScript on its own.

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server (compiles TypeScript on the fly):
   ```bash
   npm run dev
   ```
   Then open the printed localhost URL in your browser.

## Building for static hosting

If you need a static bundle (e.g., to host behind a simple web server), run:
```bash
npm run build
```
This produces a `dist/` folder with plain JavaScript and CSS. Serve that folder (for example with `npm run preview` or any static host) instead of opening the uncompiled `index.html` directly.
