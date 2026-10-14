import { getAssetUrl } from "../utils/assetUrl";
import { CLOUDINARY_SPONSORS } from "../constants/cloudinaryAssets";

export const SPONSOR_STREAM_ITEMS = [];

export const SPONSOR_TIERS = [
  {
    id: "refreshment",
    title: "Refreshment Partner",
    sponsors: [
      {
        name: "Oatey",
        category: "Refreshment Partner",
        image: CLOUDINARY_SPONSORS.oatey || getAssetUrl("/sponsors/oatey.png"),
        description: "Official Refreshment Partner for Renaissance 2026.",
      }
    ],
  },
  {
    id: "supply-chain",
    title: "Supply Chain Partner",
    sponsors: [
      {
        name: "Safe Express",
        category: "Supply Chain Partner",
        image: CLOUDINARY_SPONSORS.safexpress || getAssetUrl("/sponsors/safexpress.png"),
        description: "Official Supply Chain Partner for Renaissance 2026.",
      }
    ],
  }
];
