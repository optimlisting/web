/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@optim/ui"],
  basePath: "/dashboard",
  turbopack: {
    root: process.cwd() + "/../..",
  },
};

export default nextConfig;
