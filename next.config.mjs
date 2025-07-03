import createPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const withPWA = createPWA({
  dest: 'public',
  customWorkerDir: 'custom-sw.js',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // evita usar PWA en desarrollo
});

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
    async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/custom-sw.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self'",
          },
        ],
      },
    ]
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['typeorm'],
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },

  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        'utf-8-validate': 'commonjs utf-8-validate',
        'bufferutil': 'commonjs bufferutil',
        'supports-color': 'commonjs supports-color',
        'pg-native': 'commonjs pg-native',
        'mysql': 'commonjs mysql',
        'mysql2': 'commonjs mysql2',
        'oracledb': 'commonjs oracledb',
        'pg': 'commonjs pg',
        'redis': 'commonjs redis',
        'ioredis': 'commonjs ioredis',
        'better-sqlite3': 'commonjs better-sqlite3',
        'sqlite3': 'commonjs sqlite3',
        'typeorm-aurora-data-api-driver': 'commonjs typeorm-aurora-data-api-driver',
        'react-native-sqlite-storage': 'commonjs react-native-sqlite-storage',
        '@sap/hana-client': 'commonjs @sap/hana-client',
        'hdb-pool': 'commonjs hdb-pool',
        'sql.js': 'commonjs sql.js',
        'mongodb': 'commonjs mongodb',
        '@google-cloud/spanner': 'commonjs @google-cloud/spanner',
      });

      config.module.parser = {
        ...config.module.parser,
        javascript: {
          ...config.module.parser?.javascript,
          commonjsMagicComments: true,
        },
      };

      config.infrastructureLogging = {
        level: 'log',
      };

      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        'react-native-sqlite-storage': false,
      };
    }

    return config;
  },
};

export default withPWA(nextConfig);
