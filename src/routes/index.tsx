import { createFileRoute, redirect } from "@tanstack/react-router";

// Static HTML site lives under /public. Redirect the framework root to the static homepage.
export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ href: "/index.html" });
  },
  component: () => null,
});
