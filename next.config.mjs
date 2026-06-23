import path from 'path';
import { fileURLToPath } from 'url';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: projectRoot,
  },

  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/login',
          destination: 'http://127.0.0.1:8080/api/login',
        },
        {
          source: '/api/register',
          destination: 'http://127.0.0.1:8080/api/register',
        },
        {
          source: '/api/user',
          destination: 'http://127.0.0.1:8080/api/user',
        },
        {
          source: '/api/user/:path*',
          destination: 'http://127.0.0.1:8080/api/user/:path*',
        },
        {
          source: '/api/transaction',
          destination: 'http://127.0.0.1:8080/api/transaction',
        },
        {
          source: '/api/transaction/:path*',
          destination: 'http://127.0.0.1:8080/api/transaction/:path*',
        },
        {
          source: '/api/transactions',
          destination: 'http://127.0.0.1:8080/api/transactions',
        },
        {
          source: '/api/analytics',
          destination: 'http://127.0.0.1:8080/api/analytics',
        },
        {
          source: '/api/budget',
          destination: 'http://127.0.0.1:8080/api/budget',
        },
        {
          source: '/api/budget/:path*',
          destination: 'http://127.0.0.1:8080/api/budget/:path*',
        },
        {
          source: '/api/budgets',
          destination: 'http://127.0.0.1:8080/api/budgets',
        },
        {
          source: '/api/erase-data',
          destination: 'http://127.0.0.1:8080/api/erase-data',
        },
      ]
    }
  }
};

export default nextConfig;
