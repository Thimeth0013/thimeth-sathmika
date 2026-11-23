import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { transformWithEsbuild } from 'vite';

// Inlines the time-of-day script (src/lib/skyBoot.js) into each page's <head>, at <!-- sky-boot -->,
// minified, so it runs before the first paint; one source for all the pages.
const skyBoot = () => ({
  name: 'sky-boot',
  async transformIndexHtml(html) {
    const source = readFileSync(fileURLToPath(new URL('./src/lib/skyBoot.js', import.meta.url)), 'utf8');
    const { code } = await transformWithEsbuild(source, 'skyBoot.js', { minify: true, legalComments: 'none' });
    return html.replace('<!-- sky-boot -->', `<script>${code.trim()}</script>`);
  },
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), skyBoot()],
  base: "/thimeth-sathmika",
  // Three pages: the site, "All work" (work/index.html, served at /thimeth-sathmika/work/) and the
  // 404 page (404.html: GitHub Pages serves it for any path under the site that does not exist).
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        work: fileURLToPath(new URL('./work/index.html', import.meta.url)),
        notFound: fileURLToPath(new URL('./404.html', import.meta.url)),
      },
    },
  },
})
