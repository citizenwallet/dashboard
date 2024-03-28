/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath:
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_BASE_PATH
      : undefined,
  assetPrefix:
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_BASE_ASSET_PATH
      : undefined,
  async redirects() {
    if (process.env.NODE_ENV === "production") {
      return [
        {
          source: "/",
          destination: process.env.NEXT_PUBLIC_BASE_PATH,
          basePath: false,
          permanent: false,
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
