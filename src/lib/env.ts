const GH_PAGES_REPOSITORY = "MyPrivateSpace";
const GH_PAGES_ORIGIN = "https://iamartya15.github.io";
const GH_PAGES_APP_URL = `${GH_PAGES_ORIGIN}/${GH_PAGES_REPOSITORY}/`;

export const appBasePath = import.meta.env.BASE_URL || "/";

export const getAppOrigin = (): string => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return GH_PAGES_ORIGIN;
};

export const getAppUrl = (): string => {
  if (typeof window !== "undefined") {
    return new URL(appBasePath, window.location.origin).toString();
  }

  return GH_PAGES_APP_URL;
};

export const getAuthCallbackUrl = (): string => new URL("auth/callback", getAppUrl()).toString();

export const env = {
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined,
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL as string | undefined,
  supabasePublishableKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined,
};
