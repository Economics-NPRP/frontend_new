import createNextIntlPlugin from 'next-intl/plugin';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname is not available in ESM; derive it from import.meta.url
const __dirname = path.dirname( fileURLToPath( import.meta.url ) );

const withNextIntl = createNextIntlPlugin( './src/locales/request.ts' );

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    // typescript: {
    //   ignoreBuildErrors: true,
    // },
    // eslint: {
    //   ignoreDuringBuilds: true,
    // },

    experimental: {
        optimizePackageImports: [ "@mantine/core", "@mantine/hooks" ],
    },
    ...( process.env.NODE_ENV === 'development' && {
        images: {
            dangerouslyAllowSVG: true,
            remotePatterns: [
                {
                    hostname: '*',
                }
            ]
        }
    } ),

    redirects: async () =>
    {
        return [
            {
                source: '/',
                destination: '/marketplace',
                permanent: false,
            },
        ];
    },

    webpack ( config )
    {
        // Align webpack aliases with tsconfig paths
        config.resolve = config.resolve || {};
        config.resolve.alias = {
            ...( config.resolve.alias || {} ),
            '@': path.resolve( __dirname, 'src' ),
            '@/pages': path.resolve( __dirname, 'src/app' ),
        };

        // Grab the existing rule that handles SVG imports
        const fileLoaderRule = config.module.rules.find( ( rule ) =>
            rule.test?.test?.( '.svg' ),
        );

        config.module.rules.push(
            // Reapply the existing rule, but only for svg imports ending in ?url
            {
                ...fileLoaderRule,
                test: /\.svg$/i,
                resourceQuery: /url/, // *.svg?url
            },
            // Convert all other *.svg imports to React components
            {
                test: /\.svg$/i,
                issuer: fileLoaderRule.issuer,
                resourceQuery: { not: [ ...fileLoaderRule.resourceQuery.not, /url/ ] }, // exclude if *.svg?url
                use: [ '@svgr/webpack' ],
            },
        );

        // Modify the file loader rule to ignore *.svg, since we have it handled now.
        fileLoaderRule.exclude = /\.svg$/i;

        return config;
    },
};

export default withNextIntl( nextConfig );
