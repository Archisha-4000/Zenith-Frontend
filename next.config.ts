import { createCivicAuthPlugin } from "@civic/auth/nextjs"
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

const withCivicAuth = createCivicAuthPlugin({
  clientId: "af11a15d-2743-463f-a42c-60405f89068f"
});

export default withCivicAuth(nextConfig)