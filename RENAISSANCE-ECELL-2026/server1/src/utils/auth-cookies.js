import { env } from "../config/env.js";

export const ACCESS_COOKIE_NAME = "rn_access";
export const REFRESH_COOKIE_NAME = "rn_refresh";

function baseCookieOptions() {
  return {
    httpOnly: true,
    secure: env.AUTH_COOKIE_SECURE,
    sameSite: env.AUTH_COOKIE_SAME_SITE,
    domain: env.AUTH_COOKIE_DOMAIN,
  };
}

export function setAuthCookies(res, accessToken, refreshToken) {
  res.cookie(ACCESS_COOKIE_NAME, accessToken, {
    ...baseCookieOptions(),
    path: "/",
    maxAge: env.JWT_ACCESS_TTL_SECONDS * 1000,
  });

  res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
    ...baseCookieOptions(),
    path: "/api/v1/ambassador/auth",
    maxAge: env.JWT_REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000,
  });
}

export function clearAuthCookies(res) {
  res.clearCookie(ACCESS_COOKIE_NAME, {
    ...baseCookieOptions(),
    path: "/",
  });
  res.clearCookie(REFRESH_COOKIE_NAME, {
    ...baseCookieOptions(),
    path: "/api/v1/ambassador/auth",
  });
}
