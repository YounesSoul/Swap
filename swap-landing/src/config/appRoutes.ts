const rawOrigin = import.meta.env.VITE_SWAP_APP_ORIGIN;
const runtimeOrigin = typeof window !== "undefined" && window.location ? window.location.origin : undefined;
const fallbackOrigin = runtimeOrigin ?? "http://localhost:3000";
const normalizedOrigin = (typeof rawOrigin === "string" && rawOrigin.trim().length > 0 ? rawOrigin : fallbackOrigin).replace(/\/+$/, "");

export const swapAppOrigin = normalizedOrigin;

export const swapAppRoutes = {
  home: normalizedOrigin,
  signin: `${normalizedOrigin}/signin`,
  register: `${normalizedOrigin}/register`,
  community: `${normalizedOrigin}/community`,
  courses: `${normalizedOrigin}/courses`,
  dashboard: `${normalizedOrigin}/dashboard`,
  features: `${normalizedOrigin}/features`,
  matches: `${normalizedOrigin}/matches`,
  onboarding: `${normalizedOrigin}/onboarding`,
  profile: `${normalizedOrigin}/profile`,
  ratings: `${normalizedOrigin}/ratings`,
  requests: `${normalizedOrigin}/requests`,
  sessions: `${normalizedOrigin}/sessions`,
  chat: `${normalizedOrigin}/chat`,
  signinCallback: `${normalizedOrigin}/auth/callback`,
} as const;

export const buildSwapAppUrl = (path: string = "/") => {
  if (!path) return normalizedOrigin;
  return `${normalizedOrigin}${path.startsWith("/") ? path : `/${path}`}`;
};
