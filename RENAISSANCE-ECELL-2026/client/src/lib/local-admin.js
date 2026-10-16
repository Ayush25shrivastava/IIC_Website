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

export function createLocalTeamPhotoApi(storage) {
  const read = () => {
    const saved = storage.getItem(STORAGE_KEY);
    if (saved === null) return structuredClone(DEFAULT_TEAM_PHOTOS);
    const members = JSON.parse(saved);
    if (!Array.isArray(members)) throw new Error("Saved team photos could not be read.");
    return members;
  };
  const write = (members) => {
    try { storage.setItem(STORAGE_KEY, JSON.stringify(members)); }
    catch { throw new Error("Browser storage is full or unavailable. Remove an unused photo or use an image URL."); }
  };
  return {
    async teamPhotos() { return { members: read() }; },
    async createTeamPhoto(body) {
      const members = read();
      const member = { ...body, id: crypto.randomUUID(), updatedAt: new Date().toISOString() };
      write([...members, member]);
      return { member };
    },
    async updateTeamPhoto(id, body) {
      const members = read();
      const index = members.findIndex((member) => member.id === id);
      if (index === -1) throw new Error("Team member not found. Refresh and try again.");
      members[index] = { ...members[index], ...body, id, updatedAt: new Date().toISOString() };
      write(members);
      return { member: members[index] };
    },
    async deleteTeamPhoto(id) {
      write(read().filter((member) => member.id !== id));
    },
  };
}

// Access browser storage lazily so module imports also work outside a browser.
export const localTeamPhotoApi = createLocalTeamPhotoApi({
  getItem: (key) => window.localStorage.getItem(key),
  setItem: (key, value) => window.localStorage.setItem(key, value),
});
