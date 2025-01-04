import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "server.digmark.pankri.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "55555", 
        pathname: "/**",
      },
    ],
  },
  
};

// Enable PWA
const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true, // Automatically update service workers
})(nextConfig);

export default pwaConfig;
