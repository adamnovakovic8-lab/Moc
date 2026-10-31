import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';

// F9 — every old WordPress URL maps to its new home. Confirm against the
// URL audit in Discovery (week 1) and add any product slugs that are missing.
const redirects = {
  '/product-category/golf-carts': '/inventory',
  '/shop': '/inventory',
  '/inventory/golf-carts': '/inventory',
  '/storage-rental': '/rentals',
  '/storage-and-rental': '/rentals',
  '/contact-us': '/contact',
  '/product-category/pre-owned': '/inventory?condition=pre-owned',
  '/product-category/accessories': '/inventory',
  // Product pages on the current WooCommerce site
  '/product/2025-x-series-black-4-passenger-105-lithium': '/inventory/2025-madjax-x4-black-tobacco',
  '/product/2025-madjax-x-series-bolt-blue-4-passenger-105-ah-lithium-niagara-falls-sherkston-shores': '/inventory/2025-madjax-x4-bolt-blue-lifted',
  '/product/2025-x-series-amythest-purple-4-passenger-105-ah-lithium': '/inventory/2025-madjax-x4-amethyst-lifted',
  '/product/2025-madjax-x-series-rosso-red-limo-105-ah-lithium': '/inventory/2025-madjax-limo-rosso-red',
  '/product/2025-madjax-x-series-cherry-red-metallic-limo-105-ah-lithium': '/inventory/2025-madjax-limo-cherry-red-metallic',
  '/product/2025-madjax-x-series-frost-white-metallic-limo': '/inventory/2025-madjax-limo-frost-white',
};

export default defineConfig({
  site: 'https://rcrperformance.ca',
  output: 'static',
  adapter: node({ mode: 'standalone' }),
  integrations: [sitemap({ filter: (page) => !page.includes('/api/') })],
  redirects,
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  trailingSlash: 'ignore',
  // The Node adapter only trusts the Host header for these domains. Without
  // this, the built-in CSRF origin check rejects every form post.
  security: {
    checkOrigin: true,
    allowedDomains: [
      { protocol: 'https', hostname: 'rcrperformance.ca' },
      { protocol: 'https', hostname: 'www.rcrperformance.ca' },
      { protocol: 'https', hostname: '**.vercel.app' },
      { protocol: 'https', hostname: '**.netlify.app' },
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'http', hostname: '127.0.0.1' },
    ],
  },
});
