import { getAssetUrl } from "../utils/assetUrl";
import { CLOUDINARY_SPONSORS } from "../constants/cloudinaryAssets";

export const SPONSOR_STREAM_ITEMS = [];

export const SPONSOR_TIERS = [
  {
    id: "title",
    title: "Title Partner",
    sponsors: [
      {
        name: "Study for Civil Services by Gyan Sir",
        category: "Title Partner",
        image: CLOUDINARY_SPONSORS.title || getAssetUrl("/sponsors/studyForCivilServicesByGyanSir.jpeg"),
        fallbackImage: getAssetUrl("/sponsors/studyForCivilServicesByGyanSir.jpeg"),
        description: "Official Title Partner for Renaissance 2026.",
      }
    ],
  },
  {
    id: "executive",
    title: "Executive Partner",
    sponsors: [
      {
        name: "Formcept",
        category: "Executive Partner",
        image: CLOUDINARY_SPONSORS.formcept || getAssetUrl("/sponsors/formcept.png"),
        fallbackImage: getAssetUrl("/sponsors/formcept.png"),
        description: "Official Executive Partner for Renaissance 2026.",
      }
    ],
  },
  // {
  //   id: "ai",
  //   title: "AI Partner",
  //   sponsors: [
  //     {
  //       name: "Wayam AI",
  //       category: "AI Partner",
  //       image: CLOUDINARY_SPONSORS.wayamai || getAssetUrl("/sponsors/wayamai.png"),
  //       fallbackImage: getAssetUrl("/sponsors/wayamai.png"),
  //       description: "Official AI Partner for Renaissance 2026.",
  //     }
  //   ],
  // },
  {
    id: "beverage",
    title: "Beverage Partner",
    sponsors: [
      {
        name: "Campa",
        category: "Beverage Partner",
        image: CLOUDINARY_SPONSORS.campa || getAssetUrl("/sponsors/campacola.jpeg"),
        fallbackImage: getAssetUrl("/sponsors/campacola.jpeg"),
        description: "Official Beverage Partner for Renaissance 2026.",
      }
    ],
  },
  {
    id: "beverage",
    title: "Beverage Partner",
    sponsors: [
      {
        name: "Oatey",
        category: "Beverage Partner",
        image: CLOUDINARY_SPONSORS.oatey || getAssetUrl("/sponsors/oatey.png"),
        fallbackImage: getAssetUrl("/sponsors/oatey.png"),
        description: "Official Beverage Partner for Renaissance 2026.",
      }
    ],
  },
  {
    id:"goodness",
    title:"Goodness Partner",
    sponsors:[
      {
        name:"Plum Goodness",
        category:"Goodness Partner",
        image:CLOUDINARY_SPONSORS.plum|| getAssetUrl("/sponsors/plum-goodness.png"),
        fallbackImage: getAssetUrl("/sponsors/plum-goodness.png"),
        description: "Official Goodness Partner for Renaissance 2026.",
      }
    ],
  },
  {
    id: "logistics",
    title: "Logistics Partner",
    sponsors: [
      {
        name: "Safexpress",
        category: "Logistics Partner",
        image: CLOUDINARY_SPONSORS.safexpress || getAssetUrl("/sponsors/safexpress.png"),
        fallbackImage: getAssetUrl("/sponsors/safexpress.png"),
        description: "Official Logistics Partner for Renaissance 2026.",
      }
    ],
  },
  {
    id: "snacking",
    title: "Snacking Partner",
    sponsors: [
      {
        name: "Lotte",
        category: "Snacking Partner",
        image: CLOUDINARY_SPONSORS.lotte || getAssetUrl("/sponsors/lotte.png"),
        fallbackImage: getAssetUrl("/sponsors/lotte.png"),
        description: "Official Snacking Partner for Renaissance 2026.",
      }
    ],
  },
  {
    id:"myfa-chocolate",
    title:"Snacking Partner",
    sponsors:[
      {
        name:"Myfa Chocolate",
        category:"Snacking Partner",
        image:CLOUDINARY_SPONSORS.myfa || getAssetUrl("/sponsors/myfa chocolates.png"),
        fallbackImage: getAssetUrl("/sponsors/myfa chocolates.png"),
        description: "Official Snacking Partner for Renaissance 2026.",
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
    id:"skincare",
    title:"Skincare Partner",
    sponsors:[
      {
        name:"Ayouthveda",
        category:"Skincare Partner",
        image:CLOUDINARY_SPONSORS.ayouthveda || getAssetUrl("/sponsors/ayouthveda.jpeg"),
        fallbackImage: getAssetUrl("/sponsors/ayouthveda.jpeg"),
        description: "Official Skincare Partner for Renaissance 2026.",
      }
    ],
  },
  // {
  //   id: "protein",
  //   title: "Protein Partner",
  //   sponsors: [
  //     {
  //       name: "Max Protein",
  //       category: "Protein Partner",
  //       image: CLOUDINARY_SPONSORS.maxProtein || getAssetUrl("/sponsors/maxprotein.png"),
  //       fallbackImage: getAssetUrl("/sponsors/maxprotein.png"),
  //       description: "Official Protein Partner for Renaissance 2026.",
  //     }
  //   ],
  // },
  {
    id: "travel",
    title: "Travel Partner",
    sponsors: [
      {
        name: "Abhibus",
        category: "Travel Partner",
        image: CLOUDINARY_SPONSORS.abhibus || getAssetUrl("/sponsors/abhibus.png"),
        fallbackImage: getAssetUrl("/sponsors/abhibus.png"),
        description: "Official Travel Partner for Renaissance 2026.",
      }
    ],
  }
];
