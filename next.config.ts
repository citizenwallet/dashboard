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
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'etvujlqieidfoqsetrqd.supabase.co',
        pathname: '/storage/v1/object/public/uploads/**'
      }
    ]
  }
};
