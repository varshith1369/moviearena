import { createFileRoute, redirect } from "@tanstack/react-router";

// Sports match routes are disabled in MovieArena. Redirect to /movies.
export const Route = createFileRoute("/match/$matchId")({
  beforeLoad: () => {
    throw redirect({ to: "/movies", replace: true });
  },
  component: () => null,
});
