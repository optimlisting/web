/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@optim/ui"],
  basePath: "/dashboard",
  outputFileTracingRoot: "../../",
  turbopack: {
    root: "../../",
  },
};

export default nextConfig;
