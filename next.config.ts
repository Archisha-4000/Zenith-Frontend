import { createCivicAuthPlugin } from "@civic/auth/nextjs"
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

const withCivicAuth = createCivicAuthPlugin({
  clientId: "c6253a33-dc13-4ad5-9099-6cd3b339d027"
});

export default withCivicAuth(nextConfig)