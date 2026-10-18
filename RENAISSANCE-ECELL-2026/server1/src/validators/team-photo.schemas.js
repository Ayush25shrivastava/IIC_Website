import { z } from "zod";

export function validPhotoSource(value) {
  if (value.startsWith("https://")) {
    try { const url = new URL(value); return !!url.hostname && !url.username && !url.password; } catch { return false; }
  }
  const match = /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/]+={0,2})$/.exec(value);
  if (!match || match[2].length % 4 !== 0) return false;
  const bytes = Buffer.from(match[2], "base64");
  if (bytes.length > 350000) return false;
  if (match[1] === "jpeg") return bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  if (match[1] === "png") return bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  return bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP";
}

export const teamPhotoSchema = z.object({
  name: z.string().trim().min(2).max(120),
  category: z.enum(["faculty", "fourth", "third", "second", "first", "other"]),
  position: z.string().trim().max(120).default(""),
  team: z.string().trim().max(120).default(""),
  linkedin: z.string().trim().max(500).refine((value) => !value || /^https:\/\/(www\.)?linkedin\.com\//i.test(value), "Use a LinkedIn HTTPS URL").default(""),
  displayOrder: z.coerce.number().int().min(0).max(9999).optional().default(0),
  image_url: z.string().trim().max(470000).refine(validPhotoSource, "Use an HTTPS photo URL or a JPEG, PNG or WebP photo up to 350 KB"),
}).strict();

export const teamPhotoIdSchema = z.object({ id: z.string().regex(/^[a-zA-Z0-9-]{1,64}$/) });
