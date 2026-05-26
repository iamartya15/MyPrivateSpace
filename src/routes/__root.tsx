import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { GoogleOAuthProvider } from "@react-oauth/google";

import appCss from "../styles.css?url";
import { env, getAppUrl } from "@/lib/env";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href={getAppUrl()}
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => {
    const appUrl = getAppUrl();
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title: "MyPrivateSpace" },
        {
          name: "description",
          content:
            "MyPrivateSpace is your private cloud notebook — capture notes, checklists, scanned text and ideas, then find them instantly across every device.",
        },
        { property: "og:site_name", content: "MyPrivateSpace" },
        { property: "og:title", content: "MyPrivateSpace" },
        {
          property: "og:description",
          content:
            "MyPrivateSpace is your private cloud notebook — capture notes, checklists, scanned text and ideas, then find them instantly across every device.",
        },
        { property: "og:type", content: "website" },
        { property: "og:url", content: appUrl },
        { name: "twitter:card", content: "summary" },
        { name: "twitter:title", content: "MyPrivateSpace" },
        {
          name: "twitter:description",
          content:
            "MyPrivateSpace is your private cloud notebook — capture notes, checklists, scanned text and ideas, then find them instantly across every device.",
        },
        {
          property: "og:image",
          content:
            "https://storage.googleapis.com/gpt-engineer-file-uploads/8L2yVavKmvQ0XWrUIvRm7r6HW772/social-images/social-1779694086494-61m5H1fYccL._AC_UF1000,1000_QL80_.webp",
        },
        {
          name: "twitter:image",
          content:
            "https://storage.googleapis.com/gpt-engineer-file-uploads/8L2yVavKmvQ0XWrUIvRm7r6HW772/social-images/social-1779694086494-61m5H1fYccL._AC_UF1000,1000_QL80_.webp",
        },
      ],
      links: [
        {
          rel: "stylesheet",
          href: appCss,
        },
        {
          rel: "canonical",
          href: appUrl,
        },
      ],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const googleClientId = env.googleClientId;
  const content = (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );

  if (!googleClientId) {
    return content;
  }

  return <GoogleOAuthProvider clientId={googleClientId}>{content}</GoogleOAuthProvider>;
}