import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/jobs")({
  validateSearch: (s: Record<string, unknown>): { q?: string } => ({
    q: typeof s.q === "string" ? s.q : undefined,
  }),
  component: () => <Outlet />,
});
