import { createFileRoute, redirect } from "@tanstack/react-router";

// Static HTML site lives under /public. Redirect root to the real entry page.
export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ href: "/home.html" });
  },
  component: () => null,
});
