export default {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        search: ''
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        search: ''
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        pathname: '/api/portraits/**'
      },
      {
        protocol: 'https',
        hostname: 'assets.citizenwallet.xyz',
        search: ''
      },
      {
        protocol: 'https',
        hostname: process.env.IPFS_DOMAIN ?? '',
        port: ''
      }
    ]
  }
};
