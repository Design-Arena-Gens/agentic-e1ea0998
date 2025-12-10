/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.cf",
        pathname: "**"
      },
      {
        protocol: "https",
        hostname: "imagedelivery.net",
        pathname: "**"
      },
      {
        protocol: "https",
        hostname: "**.r2.dev",
        pathname: "**"
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "**"
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "**"
      }
    ]
  }
};

module.exports = nextConfig;
