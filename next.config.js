/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost"],
  },
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true,
  },
  headers: () => [
    {
      source: "/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "max-age=300",
        },
      ],
    },
  ],
};

module.exports = nextConfig;
