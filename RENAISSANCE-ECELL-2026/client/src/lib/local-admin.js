import { DEFAULT_TEAM_PHOTOS } from "../data/teamPhotoCategories.js";

export function isLocalAdminLocation(dev, hostname, setting) {
  return dev === true && ["localhost", "127.0.0.1", "[::1]"].includes(hostname) && setting !== "false";
}

export const localAdminMode = isLocalAdminLocation(
  import.meta.env?.DEV,
  typeof window === "undefined" ? "" : window.location.hostname,
  import.meta.env?.VITE_LOCAL_ADMIN,
);

export const LOCAL_ADMIN = { id: "local-admin", name: "Local Administrator", email: "", role: "ADMIN" };
const STORAGE_KEY = "renaissance.local.team-photos.v1";

// Read-only migration source. New photos are always saved through Cloudinary.
export function legacyTeamPhotos(storage = window.localStorage) {
  try {
    const saved = storage.getItem(STORAGE_KEY);
    const photos = saved === null ? DEFAULT_TEAM_PHOTOS : JSON.parse(saved);
    return Array.isArray(photos) ? photos.filter((photo) => photo.id && photo.name && photo.image_url) : [];
  } catch { return []; }
}
