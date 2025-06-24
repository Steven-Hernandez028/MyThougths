/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['typeorm']
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Ignorar las dependencias opcionales de TypeORM que no uses
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

      // Suprimir advertencias específicas de TypeORM
      config.module.parser = {
        ...config.module.parser,
        javascript: {
          ...config.module.parser?.javascript,
          commonjsMagicComments: true,
        },
      };
    }

    return config;
  },
}

//  webpack: config => {
//     /**
//      * These packages need to be added as external, else Oracle DB will try to load them due to a
//      * Webpack bug.
//      *
//      * See these two issues for more information:
//      * - https://github.com/oracle/node-oracledb/issues/1688
//      * - https://github.com/oracle/node-oracledb/issues/1691
//      **/
//     config.externals.push(
//       ...[
//         "@azure/app-configuration",
//         "@azure/identity",
//         "@azure/keyvault-secrets",
//         "oci-common",
//         "oci-objectstorage",
//         "oci-secrets",
//         "oracledb"
//       ],
//     )

//     return config
//   },

export default nextConfig
