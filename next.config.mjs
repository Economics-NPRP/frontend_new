import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/locales/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },

  experimental: {
    optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
  },
  ...(process.env.NODE_ENV === 'development' && {images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        hostname: '*',
      }
    ]
  }}),

  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/marketplace',
        permanent: false,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
