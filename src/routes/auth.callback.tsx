import { createFileRoute } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { getAppUrl } from "@/lib/env";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallback,
});

function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const callbackUrl = new URL(window.location.href);
    const hash = callbackUrl.hash.startsWith("#") ? callbackUrl.hash.slice(1) : callbackUrl.hash;
    const hashParams = new URLSearchParams(hash);
    const queryParams = callbackUrl.searchParams;

    const hasAuthParams =
      hashParams.has("access_token") ||
      hashParams.has("refresh_token") ||
      queryParams.has("code") ||
      queryParams.has("access_token");

    if (hasAuthParams) {
      const cleanUrl = getAppUrl();
      window.history.replaceState({}, document.title, cleanUrl);
    }

    navigate({ to: "/", replace: true });
  }, [navigate]);

  return <div>Signing you in...</div>;
}
