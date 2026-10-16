import { createHash, randomUUID } from "node:crypto";
import { env } from "../config/env.js";
import { ApiError } from "../utils/api-error.js";

const TAG = "renaissance_team_photos";
const PREFIX = "renaissance/team/";
const fields = ["name", "category", "position", "team", "linkedin"];
const escapeContext = (value) => String(value || "").replaceAll("\\", "\\\\").replaceAll("=", "\\=").replaceAll("|", "\\|");

export function createCloudinaryTeamPhotoService(config, fetcher = (...args) => fetch(...args)) {
  const base = `https://api.cloudinary.com/v1_1/${config.CLOUDINARY_CLOUD_NAME}`;
  function configured() {
    if (!config.CLOUDINARY_API_KEY || !config.CLOUDINARY_API_SECRET) {
      throw new ApiError(503, "Cloudinary is not configured. Add CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET to server1/.env and restart the API.", "CLOUDINARY_NOT_CONFIGURED");
    }
  }
  async function request(path, options = {}) {
    configured();
    let response;
    try { response = await fetcher(`${base}/${path}`, { ...options, signal: AbortSignal.timeout(25000) }); }
    catch { throw new ApiError(503, "Cloudinary could not be reached. Please try again.", "CLOUDINARY_UNAVAILABLE"); }
    if (!response.ok) {
      if (response.status === 404) throw new ApiError(404, "Team photo not found", "TEAM_PHOTO_NOT_FOUND");
      if (response.status === 401 || response.status === 403) throw new ApiError(503, "Cloudinary credentials were rejected. Check the cloud name, API key and API secret on the server.", "CLOUDINARY_AUTH_FAILED");
      if (response.status === 420 || response.status === 429) throw new ApiError(503, "Cloudinary's request limit was reached. Please try again later.", "CLOUDINARY_RATE_LIMITED");
      throw new ApiError(502, "Cloudinary could not save this change. Check the photo URL or try uploading a file.", "CLOUDINARY_REQUEST_FAILED");
    }
    return response.json();
  }
  function adminGet(path) {
    return request(path, { headers: { Authorization: `Basic ${Buffer.from(`${config.CLOUDINARY_API_KEY}:${config.CLOUDINARY_API_SECRET}`).toString("base64")}` }, cache: "no-store" });
  }
  function signed(action, params, file) {
    configured();
    const values = { ...params, timestamp: Math.floor(Date.now() / 1000) };
    const toSign = Object.keys(values).sort().map((key) => `${key}=${values[key]}`).join("&");
    const signature = createHash("sha256").update(toSign + config.CLOUDINARY_API_SECRET).digest("hex");
    const body = new FormData();
    for (const [key, value] of Object.entries(values)) body.set(key, String(value));
    body.set("api_key", config.CLOUDINARY_API_KEY);
    body.set("signature", signature);
    if (file) body.set("file", file);
    return request(`image/${action}`, { method: "POST", body });
  }
  function publicId(id) {
    if (!/^[a-zA-Z0-9-]{1,64}$/.test(id)) throw new ApiError(400, "Invalid team member ID", "INVALID_TEAM_PHOTO_ID");
    return `${PREFIX}${id}`;
  }
  function member(resource) {
    const details = resource.context?.custom || {};
    return { id: resource.public_id.slice(PREFIX.length), ...Object.fromEntries(fields.map((key) => [key, details[key] || ""])), image_url: resource.secure_url, uploaded: false, updatedAt: String(resource.version || resource.created_at || ""), cloudinaryPublicId: resource.public_id };
  }
  function context(body) { return fields.map((key) => `${key}=${escapeContext(body[key])}`).join("|"); }
  async function getResource(id) {
    return adminGet(`resources/image/upload/${encodeURIComponent(publicId(id))}?context=true`);
  }
  async function upload(id, body, overwrite) {
    const result = await signed("upload", { public_id: publicId(id), tags: TAG, context: context(body), overwrite, invalidate: true }, body.image_url);
    return { ...member(result), ...Object.fromEntries(fields.map((key) => [key, body[key] || ""])) };
  }
  return {
    async list() {
      const members = [];
      let cursor;
      do {
        const query = new URLSearchParams({ context: "true", max_results: "500" });
        if (cursor) query.set("next_cursor", cursor);
        const result = await adminGet(`resources/image/tags/${TAG}?${query}`);
        for (const resource of result.resources || []) {
          if (resource.public_id.startsWith(PREFIX) && resource.context?.custom?.name) members.push(member(resource));
        }
        cursor = result.next_cursor;
      } while (cursor);
      return members.sort((a, b) => a.name.localeCompare(b.name) || a.id.localeCompare(b.id));
    },
    async create(body) { return upload(randomUUID(), body, false); },
    async update(id, body) {
      const previous = member(await getResource(id));
      if (body.image_url && body.image_url !== previous.image_url) return upload(id, body, true);
      await signed("explicit", { public_id: publicId(id), type: "upload", context: context(body) });
      return { ...previous, ...Object.fromEntries(fields.map((key) => [key, body[key] || ""])) };
    },
    async import(id, body) {
      try { return member(await getResource(id)); }
      catch (error) { if (error.statusCode !== 404) throw error; }
      // Stable IDs and overwrite=false make interrupted migrations safe to retry.
      return upload(id, body, false);
    },
    async remove(id) {
      const result = await signed("destroy", { public_id: publicId(id), invalidate: true });
      if (!["ok", "not found"].includes(result.result)) throw new ApiError(502, "Cloudinary did not confirm removal. Please retry.", "CLOUDINARY_DELETE_FAILED");
    },
  };
}

export const cloudinaryTeamPhotos = createCloudinaryTeamPhotoService(env);
