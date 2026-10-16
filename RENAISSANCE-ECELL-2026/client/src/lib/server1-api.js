const API_BASE_URL = (import.meta.env?.VITE_SERVER1_API_URL || "http://localhost:5001/api/v1").replace(/\/+$/, "");
const API_ROOT_URL = API_BASE_URL.replace(/\/api\/v1$/, "");

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
  const url = new URL(`${baseUrl}${normalizedPath}`);

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

async function send(path, { method = "GET", body, query, signal, keepalive = false } = {}, baseUrl = API_BASE_URL) {
  const headers = { Accept: "application/json" };
  let requestBody;

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    requestBody = JSON.stringify(body);
  }

  return fetch(buildUrl(path, query, baseUrl), {
    method,
    headers,
    body: requestBody,
    credentials: "include",
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
      return { ok: true, status: response.status, error: null };
    }

    if (response.status >= 500) {
      try {
        await readResponse(response);
      } catch (error) {
        return { ok: false, status: response.status, error };
      }
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
  login: (body) => request("/admin/auth/login", { method: "POST", body }, null, false),
  me: () => request("/admin/auth/me", {}, "admin"),
  logout: () => request("/admin/auth/logout", { method: "POST" }, null, false),
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
  status: (ticketId) => request(`/tickets/status/${encodeURIComponent(ticketId)}`, {}, null, false, API_ROOT_URL),
  adminList: () => request("/tickets/admin", {}, "admin", true, API_ROOT_URL),
  stageConfigs: () => request("/tickets/admin/stages", {}, "admin", true, API_ROOT_URL),
  addStage: (ticketType, name) => request(`/tickets/admin/stages/${encodeURIComponent(ticketType)}`, { method: "POST", body: { name } }, "admin", true, API_ROOT_URL),
  deleteStage: (ticketType, stageId) => request(`/tickets/admin/stages/${encodeURIComponent(ticketType)}/${encodeURIComponent(stageId)}`, { method: "DELETE" }, "admin", true, API_ROOT_URL),
  verify: (id, body) => request(`/tickets/admin/${encodeURIComponent(id)}/verify`, { method: "PATCH", body }, "admin", true, API_ROOT_URL),
  scan: (body) => request("/tickets/admin/scan", { method: "POST", body }, "admin", true, API_ROOT_URL),
  volunteerLogin: (body) => request("/tickets/volunteer/login", { method: "POST", body }, null, false, API_ROOT_URL),
  volunteerSession: () => request("/tickets/volunteer/session", {}, null, false, API_ROOT_URL),
  volunteerLogout: () => request("/tickets/volunteer/logout", { method: "POST" }, null, false, API_ROOT_URL),
  volunteerStages: () => request("/tickets/volunteer/stages", {}, null, false, API_ROOT_URL),
  volunteerScan: (body) => request("/tickets/volunteer/scan", { method: "POST", body }, null, false, API_ROOT_URL),
};

export const server1ApiBaseUrl = API_BASE_URL;
