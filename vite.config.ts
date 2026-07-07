import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    root: 'src',
    envDir: path.resolve(__dirname),
    base: '/EventDrink/',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      outDir: path.resolve(__dirname, 'docs'),
      target: 'es2015',
      emptyOutDir: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return undefined;
            // Group core UI/runtime libs together to avoid circular chunks
            if (id.includes('react') || id.includes('motion')) return 'vendor_react';
            if (id.includes('lucide-react')) return 'vendor_icons';
            if (id.includes('@supabase')) return 'vendor_supabase';
            return 'vendor_misc';
          }
        }
      },
      chunkSizeWarningLimit: 1200,
      minify: 'esbuild'
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify - file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
