import { getAssetUrl } from "../utils/assetUrl";
import { CLOUDINARY_SPONSORS } from "../constants/cloudinaryAssets";

export const SPONSOR_STREAM_ITEMS = [];

export const SPONSOR_TIERS = [
  {
    id: "technology",
    title: "Technology Partner",
    sponsors: [
      {
        name: "Formcept",
        category: "Technology Partner",
        image: CLOUDINARY_SPONSORS.formcept || getAssetUrl("/sponsors/formcept.png"),
        fallbackImage: getAssetUrl("/sponsors/formcept.png"),
        description: "Official Technology Partner for Renaissance 2026.",
      }
    ],
  },
  {
    id: "nutrition",
    title: "Nutrition Partner",
    sponsors: [
      {
        name: "Max Protein",
        category: "Nutrition Partner",
        image: CLOUDINARY_SPONSORS.maxProtein || getAssetUrl("/sponsors/maxprotein.png"),
        fallbackImage: getAssetUrl("/sponsors/maxprotein.png"),
        description: "Official Nutrition Partner for Renaissance 2026.",
      }
    ],
  },
  {
    id: "refreshment",
    title: "Refreshment Partner",
    sponsors: [
      {
        name: "Oatey",
        category: "Refreshment Partner",
        image: CLOUDINARY_SPONSORS.oatey || getAssetUrl("/sponsors/oatey.png"),
        fallbackImage: getAssetUrl("/sponsors/oatey.png"),
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
        fallbackImage: getAssetUrl("/sponsors/safexpress.png"),
        description: "Official Supply Chain Partner for Renaissance 2026.",
      }
    ],
  },
  {
    id: "confectionery",
    title: "Confectionery Partner",
    sponsors: [
      {
        name: "Lotte",
        category: "Confectionery Partner",
        image: CLOUDINARY_SPONSORS.lotte || getAssetUrl("/sponsors/lotte.png"),
        fallbackImage: getAssetUrl("/sponsors/lotte.png"),
        description: "Official Confectionery Partner for Renaissance 2026.",
      }
    ],
  },
  {
    id: "platform",
    title: "Platform Partner",
    sponsors: [
      {
        name: "Unstop",
        category: "Platform Partner",
        image: CLOUDINARY_SPONSORS.unstop || getAssetUrl("/sponsors/unstop.png"),
        fallbackImage: getAssetUrl("/sponsors/unstop.png"),
        description: "Official Platform Partner for Renaissance 2026.",
      }
    ],
  },
  {
    id: "travel",
    title: "Travel Partner",
    sponsors: [
      {
        name: "AbhiBus",
        category: "Travel Partner",
        image: CLOUDINARY_SPONSORS.abhibus || getAssetUrl("/sponsors/abhibus.png"),
        fallbackImage: getAssetUrl("/sponsors/abhibus.png"),
        description: "Official Travel Partner for Renaissance 2026.",
      }
    ],
  }
];
