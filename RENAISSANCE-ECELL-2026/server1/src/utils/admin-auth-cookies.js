import { env } from "../config/env.js";

export const ADMIN_ACCESS_COOKIE_NAME = "rn_admin_access";
export const ADMIN_REFRESH_COOKIE_NAME = "rn_admin_refresh";

function baseCookieOptions() {
  return {
    httpOnly: true,
    secure: env.AUTH_COOKIE_SECURE,
    sameSite: env.AUTH_COOKIE_SAME_SITE,
    domain: env.AUTH_COOKIE_DOMAIN,
  };
}

export function setAdminAuthCookies(res, accessToken, refreshToken) {
  res.cookie(ADMIN_ACCESS_COOKIE_NAME, accessToken, {
    ...baseCookieOptions(),
    path: "/",
    maxAge: env.JWT_ACCESS_TTL_SECONDS * 1000,
  });
  res.cookie(ADMIN_REFRESH_COOKIE_NAME, refreshToken, {
    ...baseCookieOptions(),
    path: "/api/v1/admin/auth",
    maxAge: env.JWT_REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000,
  });
}

export function clearAdminAuthCookies(res) {
  res.clearCookie(ADMIN_ACCESS_COOKIE_NAME, { ...baseCookieOptions(), path: "/" });
  res.clearCookie(ADMIN_REFRESH_COOKIE_NAME, {
    ...baseCookieOptions(),
    path: "/api/v1/admin/auth",
  });
}
