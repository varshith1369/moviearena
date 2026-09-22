import { createFileRoute, redirect } from "@tanstack/react-router";

// Sports has been removed from MovieArena. Redirect to Movies.
export const Route = createFileRoute("/sports")({
  beforeLoad: () => {
    throw redirect({ to: "/movies", replace: true });
  },
  component: () => null,
});
