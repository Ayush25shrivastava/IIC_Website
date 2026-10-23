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
  formcept: "https://res.cloudinary.com/fbf4uyoz/image/upload/f_auto,q_auto/renaissance_formcept_sponsor.png",
  // maxProtein: "https://res.cloudinary.com/fbf4uyoz/image/fetch/f_auto,q_auto/https://maxprotein.in/cdn/shop/files/max_protein_9bb6131c-0460-4ac0-afba-bf55f4949ecf.png",
  oatey: "https://res.cloudinary.com/fbf4uyoz/image/upload/f_auto,q_auto/v1792007252/renaissance_oatey_sponsor.png",
  safexpress: "https://res.cloudinary.com/fbf4uyoz/image/upload/f_auto,q_auto/WhatsApp_Image_2026-10-05_at_21.38.40_1",
  lotte: "https://res.cloudinary.com/fbf4uyoz/image/fetch/f_auto,q_auto/https://upload.wikimedia.org/wikipedia/commons/2/2a/Lotte_logo.svg",
  unstop: "https://res.cloudinary.com/fbf4uyoz/image/upload/f_auto,q_auto/unstop",
  abhibus: "https://res.cloudinary.com/fbf4uyoz/image/upload/f_auto,q_auto/abhibus",
  easemytrip: "https://res.cloudinary.com/fbf4uyoz/image/upload/f_auto,q_auto/renaissance_easemytrip_sponsor.png",
  ims: "https://res.cloudinary.com/fbf4uyoz/image/upload/f_auto,q_auto/renaissance_ims_sponsor.png",
  laals: "https://res.cloudinary.com/fbf4uyoz/image/upload/f_auto,q_auto/renaissance_laals_sponsor.png",
  smc: "https://res.cloudinary.com/fbf4uyoz/image/upload/f_auto,q_auto/renaissance_smc_sponsor.png",
  doon: "https://res.cloudinary.com/fbf4uyoz/image/upload/f_auto,q_auto/renaissance_doon_sponsor.png",
  syncoro: "https://res.cloudinary.com/fbf4uyoz/image/upload/f_auto,q_auto/renaissance_syncoro_sponsor.png",
  chemicapoint: "https://res.cloudinary.com/fbf4uyoz/image/upload/f_auto,q_auto/renaissance_chemicapoint_sponsor.png",
};

/**
 * T-Shirt Mockup & Size Chart hosted on Cloudinary
 */
export const CLOUDINARY_TSHIRT = {
  mockup: "https://res.cloudinary.com/fbf4uyoz/image/fetch/f_auto,q_auto/https://raw.githubusercontent.com/Ayush25shrivastava/IIC_Website/main/RENAISSANCE-ECELL-2026/client/public/tshirt-mock.jpeg",
  sizeChart: "https://res.cloudinary.com/fbf4uyoz/image/fetch/f_auto,q_auto/https://raw.githubusercontent.com/Ayush25shrivastava/IIC_Website/main/RENAISSANCE-ECELL-2026/client/public/tshirt-size-chart.jpeg",
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
