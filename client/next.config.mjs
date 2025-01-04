

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

export default nextConfig;
