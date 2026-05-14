/** @type {import('next').NextConfig} */
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  transpilePackages: ["@optim/ui"],
  basePath: "/dashboard",
  outputFileTracingRoot: resolve(__dirname, "..", ".."),
  turbopack: {
    root: resolve(__dirname, "..", ".."),
  },
};

export default nextConfig;
