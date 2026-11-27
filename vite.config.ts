import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import path from 'path';
import {defineConfig} from 'vite';
import {legacyCss} from './scripts/legacyCss';

export default defineConfig(() => {
  return {
    // Caminhos relativos: funciona no GitHub Pages (subpasta) e no app Android
    base: './',
    plugins: [
      react(),
      tailwindcss(),
      // JS compatível com WebViews antigos (Android 5+) com polyfills automáticos
      legacy({
        targets: ['chrome >= 49', 'android >= 5'],
        modernTargets: ['chrome >= 64', 'safari >= 12', 'firefox >= 67', 'edge >= 79'],
        modernPolyfills: true,
      }),
      legacyCss(),
    ],
    build: {
      cssTarget: 'chrome61',
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify; file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
