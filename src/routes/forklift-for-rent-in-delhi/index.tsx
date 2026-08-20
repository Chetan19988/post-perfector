import { createFileRoute, redirect } from "@tanstack/react-router";

// Static HTML page lives in /public. Serve the pretty URL by redirecting to it.
export const Route = createFileRoute("/forklift-for-rent-in-delhi/")({
  beforeLoad: () => {
    throw redirect({ href: "/forklift-for-rent-in-delhi/index.html" });
  },
  component: () => null,
});
