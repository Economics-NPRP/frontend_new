import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/locales/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
  },

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
