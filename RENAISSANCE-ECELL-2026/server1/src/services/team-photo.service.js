import { TeamPhoto } from "../models/team-photo.model.js";
import { ApiError } from "../utils/api-error.js";

// Keep the existing faculty visible until an administrator changes their records.
export const defaultTeamPhotos = [
  { id: "faculty-mukul-shukla", name: "Prof. Mukul Shukla", category: "faculty", image_url: "https://res.cloudinary.com/ddjzcyl4d/image/upload/v1774029796/image_1_roojuv.avif", linkedin: "https://www.linkedin.com/in/mukul-shukla-329a7121" },
  { id: "faculty-mayank-pandey", name: "Prof. Mayank Pandey", category: "faculty", image_url: "https://res.cloudinary.com/ddjzcyl4d/image/upload/v1774029797/image_wj6szw.avif", linkedin: "https://www.linkedin.com/in/mayank-pandey-0b433137/" },
];

export function mergeTeamPhotos(records) {
  const members = new Map(defaultTeamPhotos.map((member) => [member.id, member]));
  for (const record of records) members.set(String(record._id), { ...record, id: String(record._id) });
  return [...members.values()].filter((member) => !member.isDeleted);
}

export function serializeTeamPhoto(member) {
  return { id: member.id || String(member._id), name: member.name, category: member.category,
    position: member.position || "", team: member.team || "", linkedin: member.linkedin || "",
    image_url: member.image_url.startsWith("data:") ? "" : member.image_url,
    uploaded: member.image_url.startsWith("data:"), updatedAt: member.updatedAt || null };
}

export async function getTeamPhoto(id) {
  const member = await TeamPhoto.findById(id).lean() || defaultTeamPhotos.find((photo) => photo.id === id);
  if (!member || member.isDeleted) throw new ApiError(404, "Team member not found", "TEAM_PHOTO_NOT_FOUND");
  return member;
}
