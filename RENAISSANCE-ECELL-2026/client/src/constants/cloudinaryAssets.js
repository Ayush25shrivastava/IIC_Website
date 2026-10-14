import { getAssetUrl } from "../utils/assetUrl";

export const CLOUDINARY_CONFIG = {
  cloudName: "fbf4uyoz",
  baseUrl: "https://res.cloudinary.com/fbf4uyoz/image/upload/f_auto,q_auto/",
};

/**
 * QR Codes hosted on Cloudinary with local fallback
 */
export const CLOUDINARY_QR = {
  // Support / Bank Transfer QR Code (shown on Support Us page)
  supportQr: "https://res.cloudinary.com/fbf4uyoz/image/upload/f_auto,q_auto/v1792007251/renaissance_payment_qr.jpg",
  // Payment QR Code (shown in Tickets & Accommodation registration modal)
  paymentQr: "https://res.cloudinary.com/fbf4uyoz/image/upload/f_auto,q_auto/v1792007251/renaissance_payment_qr.jpg",
};

/**
 * Sponsor logos hosted on Cloudinary
 */
export const CLOUDINARY_SPONSORS = {
  safexpress: "https://res.cloudinary.com/fbf4uyoz/image/upload/f_auto,q_auto/WhatsApp_Image_2026-10-05_at_21.38.40_1",
  oatey: "https://res.cloudinary.com/fbf4uyoz/image/upload/f_auto,q_auto/v1792007252/renaissance_oatey_sponsor.png",
};

/**
 * Resolves a Cloudinary URL or falls back to local getAssetUrl
 * 
 * @param {string} cloudinaryUrl - The Cloudinary URL or key
 * @param {string} fallbackLocalPath - The local path fallback (e.g. '/support-qr.jpg')
 * @returns {string} - The resolved asset URL
 */
export function getCloudinaryAsset(cloudinaryUrl, fallbackLocalPath) {
  if (cloudinaryUrl && (cloudinaryUrl.startsWith("http://") || cloudinaryUrl.startsWith("https://"))) {
    return cloudinaryUrl;
  }
  if (cloudinaryUrl) {
    return `${CLOUDINARY_CONFIG.baseUrl}${cloudinaryUrl}`;
  }
  return fallbackLocalPath ? getAssetUrl(fallbackLocalPath) : "";
}
