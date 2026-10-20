const configuredApiBaseUrl = import.meta.env?.VITE_SERVER1_API_URL?.replace(/\/+$/, "");
// Production uses same-origin Vercel rewrites so HttpOnly auth cookies are first-party.
// Development can still target a locally running Express server.
const API_BASE_URL = import.meta.env?.DEV
  ? (configuredApiBaseUrl || "/api/v1")
  : (configuredApiBaseUrl?.startsWith("/") ? configuredApiBaseUrl : "/api/v1");
const API_ROOT_URL = API_BASE_URL.startsWith("/") ? "" : API_BASE_URL.replace(/\/api\/v1$/, "");

let adminToken = typeof window !== "undefined" ? localStorage.getItem("rn_admin_token") || null : null;

export function setStoredAdminToken(token) {
  adminToken = token;
  if (typeof window !== "undefined") {
    if (token) localStorage.setItem("rn_admin_token", token);
    else localStorage.removeItem("rn_admin_token");
  }
}

export function getStoredAdminToken() {
  return adminToken;
}

export class ApiClientError extends Error {
  constructor(message, { status = 0, code = "REQUEST_FAILED", details = null, requestId = null } = {}) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
    this.details = details;
    this.requestId = requestId;
  }
}

function buildUrl(path, query, baseUrl = API_BASE_URL) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${baseUrl}${normalizedPath}`, globalThis.location?.origin || "http://localhost");

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null || value === "") continue;
      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}

async function readResponse(response) {
  if (response.status === 204) return null;

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const text = await response.text();
    if (!response.ok) {
      throw new ApiClientError(text || `Request failed with status ${response.status}`, {
        status: response.status,
      });
    }
    return text;
  }

  const payload = await response.json();
  if (!response.ok || payload?.success === false) {
    throw new ApiClientError(
      payload?.error?.message || payload?.message || `Request failed with status ${response.status}`,
      {
        status: response.status,
        code: payload?.error?.code || "REQUEST_FAILED",
        details: payload?.error?.details || null,
        requestId: payload?.error?.requestId || null,
      },
    );
  }

  return payload?.data ?? payload;
}

async function send(path, { method = "GET", body, query, signal, cache, keepalive = false } = {}, baseUrl = API_BASE_URL) {
  const headers = { Accept: "application/json" };
  let requestBody;

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    requestBody = JSON.stringify(body);
  }

  if (adminToken) {
    headers["Authorization"] = `Bearer ${adminToken}`;
  }

  return fetch(buildUrl(path, query, baseUrl), {
    method,
    headers,
    body: requestBody,
    credentials: "include",
    cache,
    keepalive,
    signal: signal || AbortSignal.timeout(15000),
  });
}

const refreshRequests = new Map();
let ambassadorAuthMutation = null;

// Finish revoking an old visit before login can issue new cookies.
function mutateAmbassadorAuth(action) {
  const result = ambassadorAuthMutation
    ? ambassadorAuthMutation.catch(() => { }).then(action)
    : action();
  ambassadorAuthMutation = result;
  const clear = () => {
    if (ambassadorAuthMutation === result) ambassadorAuthMutation = null;
  };
  result.then(clear, clear);
  return result;
}

async function refreshAuth(authScope) {
  const existing = refreshRequests.get(authScope);
  if (existing) return existing;

  const refreshPath = authScope === "admin"
    ? "/admin/auth/refresh"
    : "/ambassador/auth/refresh";

  const refreshPromise = (async () => {
    const response = await (authScope === "ambassador"
      ? mutateAmbassadorAuth(() => send(refreshPath, { method: "POST" }))
      : send(refreshPath, { method: "POST" }));

    if (response.ok) {
      if (authScope === "admin") {
        try {
          const payload = await response.clone().json();
          if (payload?.data?.accessToken) setStoredAdminToken(payload.data.accessToken);
        } catch { /* response was not json */ }
      }
      return { ok: true, status: response.status, error: null };
    }

    if (response.status >= 500) {
      try {
        await readResponse(response);
      } catch (error) {
        return { ok: false, status: response.status, error };
      }
    }

    if (authScope === "admin" && (response.status === 401 || response.status === 403)) {
      setStoredAdminToken(null);
    }

    return { ok: false, status: response.status, error: null };
  })().finally(() => {
    refreshRequests.delete(authScope);
  });

  refreshRequests.set(authScope, refreshPromise);
  return refreshPromise;
}
async function request(path, options = {}, authScope = null, retry = true, baseUrl = API_BASE_URL) {
  let response = await send(path, options, baseUrl);

  if (response.status === 401 && retry && authScope) {
    const refreshResult = await refreshAuth(authScope);

    if (refreshResult.ok) {
      response = await send(path, options, baseUrl);
    } else if (refreshResult.error) {
      throw refreshResult.error;
    }
  }

  return readResponse(response);
}

export const ambassadorApi = {
  login: (body) => mutateAmbassadorAuth(() => request("/ambassador/auth/login", { method: "POST", body }, null, false)),
  me: () => request("/ambassador/auth/me", {}, "ambassador"),
  logout: ({ keepalive = false } = {}) => mutateAmbassadorAuth(() => request("/ambassador/auth/logout", { method: "POST", keepalive }, null, false)),
  changePassword: (body) => request(
    "/ambassador/auth/change-password",
    { method: "POST", body },
    "ambassador",
  ),
  dashboard: () => request("/ambassador/dashboard", {}, "ambassador"),
  promoCode: () => request("/ambassador/promo-code", {}, "ambassador"),
  tasks: (query) => request("/ambassador/tasks", { query }, "ambassador"),
  task: (taskId) => request(`/ambassador/tasks/${encodeURIComponent(taskId)}`, {}, "ambassador"),
  updateTask: (taskId, body) => request(
    `/ambassador/tasks/${encodeURIComponent(taskId)}`,
    { method: "PATCH", body }, "ambassador",
  ),
  updateTaskStatus: (taskId, status) => request(
    `/ambassador/tasks/${encodeURIComponent(taskId)}/status`,
    { method: "PATCH", body: { status } },
    "ambassador",
  ),
  updateTaskDetails: (taskId, body) => request(
    `/ambassador/tasks/${encodeURIComponent(taskId)}/remarks`,
    { method: "PATCH", body },
    "ambassador",
  ),
  referrals: (query) => request("/ambassador/referrals", { query }, "ambassador"),
};

export const adminApi = {
  teamPhotos: () => request("/admin/team-photos", {}, "admin"),
  createTeamPhoto: (body) => request("/admin/team-photos", { method: "POST", body }, "admin"),
  updateTeamPhoto: (id, body) => request(`/admin/team-photos/${encodeURIComponent(id)}`, { method: "PUT", body }, "admin"),
  deleteTeamPhoto: (id) => request(`/admin/team-photos/${encodeURIComponent(id)}`, { method: "DELETE" }, "admin"),
  login: async (body) => {
    const data = await request("/admin/auth/login", { method: "POST", body }, null, false);
    if (data?.accessToken) setStoredAdminToken(data.accessToken);
    return data;
  },
  me: () => request("/admin/auth/me", {}, "admin"),
  logout: async () => {
    try {
      await request("/admin/auth/logout", { method: "POST" }, null, false);
    } finally {
      setStoredAdminToken(null);
    }
  },
  changePassword: (body) => request(
    "/admin/auth/change-password",
    { method: "POST", body },
    "admin",
  ),
  dashboard: () => request("/admin/dashboard", {}, "admin"),
  resetCredential: (id) => request(`/admin/ambassadors/${encodeURIComponent(id)}/reset-credential`, { method: "POST", body: {} }, "admin"),
  reviewTask: (id, body) => request(`/admin/tasks/${encodeURIComponent(id)}/review`, { method: "POST", body }, "admin"),
  ambassadors: (query) => request("/admin/ambassadors", { query }, "admin"),
  ambassador: (id) => request(`/admin/ambassadors/${encodeURIComponent(id)}`, {}, "admin"),
  createAmbassador: (body) => request(
    "/admin/ambassadors",
    { method: "POST", body },
    "admin",
  ),
  updateAmbassador: (id, body) => request(
    `/admin/ambassadors/${encodeURIComponent(id)}`,
    { method: "PATCH", body },
    "admin",
  ),
  setAmbassadorStatus: (id, status) => request(
    `/admin/ambassadors/${encodeURIComponent(id)}/status`,
    { method: "PATCH", body: { status } },
    "admin",
  ),
  archiveAmbassador: (id) => request(
    `/admin/ambassadors/${encodeURIComponent(id)}`,
    { method: "DELETE" },
    "admin",
  ),
  hardDeleteAmbassador: (id) => request(
    `/admin/ambassadors/${encodeURIComponent(id)}/hard`,
    { method: "DELETE" },
    "admin",
  ),
  promoCodes: (query) => request("/admin/promo-codes", { query }, "admin"),
  createPromoCode: (body) => request("/admin/promo-codes", { method: "POST", body }, "admin"),
  updatePromoCode: (promoId, body) => request(
    `/admin/promo-codes/${encodeURIComponent(promoId)}`,
    { method: "PATCH", body },
    "admin",
  ),
  setPromoCodeStatus: (promoId, isActive) => request(
    `/admin/promo-codes/${encodeURIComponent(promoId)}/status`,
    { method: "PATCH", body: { isActive } },
    "admin",
  ),
  archivePromoCode: (promoId) => request(
    `/admin/promo-codes/${encodeURIComponent(promoId)}`,
    { method: "DELETE" },
    "admin",
  ),
  hardDeletePromoCode: (promoId) => request(
    `/admin/promo-codes/${encodeURIComponent(promoId)}/hard`,
    { method: "DELETE" },
    "admin",
  ),
  tasks: (query) => request("/admin/tasks", { query }, "admin"),
  createTask: (body) => request("/admin/tasks", { method: "POST", body }, "admin"),
  updateTask: (taskId, body) => request(
    `/admin/tasks/${encodeURIComponent(taskId)}`,
    { method: "PATCH", body },
    "admin",
  ),
  assignTask: (taskId, ambassadorId) => request(
    `/admin/tasks/${encodeURIComponent(taskId)}/assign`,
    { method: "POST", body: { ambassadorId } },
    "admin",
  ),
  deleteTask: (taskId) => request(
    `/admin/tasks/${encodeURIComponent(taskId)}`,
    { method: "DELETE" },
    "admin",
  ),
  referrals: (query) => request("/admin/referrals", { query }, "admin"),
};

export const ticketApi = {
  purchase: (body) => request("/tickets/purchase", { method: "POST", body }, null, false, API_ROOT_URL),
  validatePromo: (body) => request("/tickets/promo/validate", { method: "POST", body }, null, false, API_ROOT_URL),
  availability: () => request("/tickets/availability", {}, null, false, API_ROOT_URL),
  status: (ticketId) => request(`/tickets/status/${encodeURIComponent(ticketId)}`, {}, null, false, API_ROOT_URL),
  adminList: () => request("/tickets/admin", {}, "admin", true, API_ROOT_URL),
  stageConfigs: () => request("/tickets/admin/stages", {}, "admin", true, API_ROOT_URL),
  setSoldOut: (ticketType, soldOut) => request(`/tickets/admin/availability/${encodeURIComponent(ticketType)}`, { method: "PATCH", body: { soldOut } }, "admin", true, API_ROOT_URL),
  addStage: (ticketType, name) => request(`/tickets/admin/stages/${encodeURIComponent(ticketType)}`, { method: "POST", body: { name } }, "admin", true, API_ROOT_URL),
  deleteStage: (ticketType, stageId) => request(`/tickets/admin/stages/${encodeURIComponent(ticketType)}/${encodeURIComponent(stageId)}`, { method: "DELETE" }, "admin", true, API_ROOT_URL),
  verify: (id, body) => request(`/tickets/admin/${encodeURIComponent(id)}/verify`, { method: "PATCH", body }, "admin", true, API_ROOT_URL),
  update: (id, body) => request(`/tickets/admin/${encodeURIComponent(id)}`, { method: "PATCH", body }, "admin", true, API_ROOT_URL),
  scan: (body) => request("/tickets/admin/scan", { method: "POST", body }, "admin", true, API_ROOT_URL),
  adminVolunteers: () => request("/tickets/admin/volunteers", {}, "admin", true, API_ROOT_URL),
  setVolunteerStatus: (id, status) => request(`/tickets/admin/volunteers/${encodeURIComponent(id)}/status`, { method: "PATCH", body: { status } }, "admin", true, API_ROOT_URL),
  volunteerRegister: (body) => request("/tickets/volunteer/register", { method: "POST", body }, null, false, API_ROOT_URL),
  volunteerLogin: (body) => request("/tickets/volunteer/login", { method: "POST", body }, null, false, API_ROOT_URL),
  volunteerSession: () => request("/tickets/volunteer/session", {}, null, false, API_ROOT_URL),
  volunteerLogout: () => request("/tickets/volunteer/logout", { method: "POST" }, null, false, API_ROOT_URL),
  volunteerStages: () => request("/tickets/volunteer/stages", {}, null, false, API_ROOT_URL),
  volunteerScan: (body) => request("/tickets/volunteer/scan", { method: "POST", body }, null, false, API_ROOT_URL),
};

export const server1ApiBaseUrl = API_BASE_URL;

let cachedTeamPhotosPromise = null;

export const getTeamPhotos = (forceFresh = false) => {
  if (forceFresh || !cachedTeamPhotosPromise) {
    cachedTeamPhotosPromise = request("/team-photos", { cache: "no-store", signal: AbortSignal.timeout(60000) })
      .catch((err) => {
        cachedTeamPhotosPromise = null;
        throw err;
      });
  }
  return cachedTeamPhotosPromise;
};

export const prefetchTeamPhotos = () => {
  if (typeof window === "undefined") return;
  getTeamPhotos()
    .then((data) => {
      // Preload image elements in background into browser cache
      if (Array.isArray(data?.members)) {
        for (const member of data.members) {
          const url = teamPhotoUrl(member);
          if (url) {
            const img = new Image();
            img.src = url;
          }
        }
      }
    })
    .catch(() => {
      // Silent fail on prefetch; will retry when visiting page
    });
};

export function createTeamPhotoApi(local = false) {
  const prefix = local ? "/local-admin/team-photos" : "/admin/team-photos";
  const scope = local ? null : "admin";
  const call = (path, options = {}) => request(`${prefix}${path}`, { ...options, cache: "no-store", signal: AbortSignal.timeout(60000) }, scope);
  return {
    teamPhotos: () => call(""),
    createTeamPhoto: (body) => { cachedTeamPhotosPromise = null; return call("", { method: "POST", body }); },
    updateTeamPhoto: (id, body) => { cachedTeamPhotosPromise = null; return call(`/${encodeURIComponent(id)}`, { method: "PUT", body }); },
    deleteTeamPhoto: (id) => { cachedTeamPhotosPromise = null; return call(`/${encodeURIComponent(id)}`, { method: "DELETE" }); },
    importTeamPhoto: (id, body) => { cachedTeamPhotosPromise = null; return call(`/import/${encodeURIComponent(id)}`, { method: "POST", body }); },
  };
}
export const teamPhotoUrl = (member) => member.uploaded
  ? buildUrl(`/team-photos/${encodeURIComponent(member.id)}/image`, { v: member.updatedAt })
  : member.image_url;

