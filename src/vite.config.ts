import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    plugins: [
      react({
        // Enable React Strict Mode in production
        babel: {
          plugins: isProduction ? [] : [],
        },
      }),
    ],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './'),
      },
    },

    // Build optimizations
    build: {
      // Target modern browsers for better optimization
      target: 'es2020',
      
      // Minification
      minify: 'terser',
      terserOptions: {
        compress: {
          // Remove console.log in production
          drop_console: true,
          drop_debugger: true,
          pure_funcs: isProduction ? ['console.log', 'console.info', 'console.debug'] : [],
        },
        format: {
          // Remove comments
          comments: false,
        },
      },

      // Code splitting configuration
      rollupOptions: {
        output: {
          // Manual chunk splitting for better caching
          manualChunks: {
            // Vendor chunks
            'vendor-react': ['react', 'react-dom'],
            'vendor-router': ['motion/react'],
            'vendor-ui': ['lucide-react'],
            'vendor-charts': ['recharts'],
            'vendor-forms': ['react-hook-form@7.55.0'],
            'vendor-supabase': ['@supabase/supabase-js'],
            
            // Component chunks
            'components-dashboard': [
              './components/AdminDashboard',
              './components/OwnerDashboard',
              './components/AccountantDashboard',
            ],
            'components-views': [
              './components/PropertiesView',
              './components/MaintenanceView',
              './components/FinancialReportsView',
            ],
            'components-ui': [
              './components/ui/button',
              './components/ui/card',
              './components/ui/input',
              './components/ui/select',
            ],
          },
          
          // Asset file naming for better caching
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.');
            const ext = info[info.length - 1];
            
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
              return `assets/images/[name]-[hash][extname]`;
            } else if (/woff|woff2/.test(ext)) {
              return `assets/fonts/[name]-[hash][extname]`;
            }
            
            return `assets/[name]-[hash][extname]`;
          },
          
          // Chunk file naming
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
        },
      },

      // Chunk size warnings
      chunkSizeWarningLimit: 500, // 500KB

      // Source maps for production debugging (optional)
      sourcemap: false,

      // CSS code splitting
      cssCodeSplit: true,

      // Report compressed size
      reportCompressedSize: true,

      // Write bundle to analyze (can be disabled after analysis)
      write: true,
    },

    // Performance optimizations
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'motion/react',
        'lucide-react',
        '@supabase/supabase-js',
      ],
      // Exclude large dependencies from pre-bundling
      exclude: ['recharts'],
    },

    // Server configuration for development
    server: {
      port: 3000,
      strictPort: false,
      host: true,
      open: false,
    },

    // Preview server configuration
    preview: {
      port: 4173,
      strictPort: false,
      host: true,
      open: false,
    },

    // Esbuild optimizations
    esbuild: {
      // Remove console in production via esbuild as well
      drop: isProduction ? ['console', 'debugger'] : [],
      // Legal comments
      legalComments: 'none',
    },

    // CSS processing
    css: {
      devSourcemap: !isProduction,
    },
  };
});
