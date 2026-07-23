/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.dzcdn.net",
      },
      {
        protocol: "https",
        hostname: "api.deezer.com",
      },
    ],
  },
};

module.exports = nextConfig;