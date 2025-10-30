import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './styles/globals.css';
import { PerformanceMetrics } from './components/PerformanceMetrics';

// Get root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

// Create root with React 18 concurrent features
const root = createRoot(rootElement);

// Render app with StrictMode in production for safety checks
root.render(
  <StrictMode>
    <>
      <App />
      <PerformanceMetrics />
    </>
  </StrictMode>
);

// Report web vitals to analytics
const isProd = typeof import.meta !== 'undefined' && import.meta.env?.PROD;
if (isProd) {
  // Performance monitoring after app loads
  window.addEventListener('load', () => {
    // Mark the app as ready
    performance.mark('app-ready');
    
    // Measure total app initialization time
    try {
      performance.measure('app-init', 'navigationStart', 'app-ready');
      const measure = performance.getEntriesByName('app-init')[0];
      console.log(`App initialized in ${measure.duration.toFixed(2)}ms`);
    } catch (e) {
      // Ignore errors in performance measurement
    }
  });
}

// Service Worker Registration (optional, for PWA)
if (isProd && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Uncomment to enable service worker
    // navigator.serviceWorker.register('/sw.js').then(
    //   (registration) => {
    //     console.log('SW registered:', registration);
    //   },
    //   (error) => {
    //     console.log('SW registration failed:', error);
    //   }
    // );
  });
}
