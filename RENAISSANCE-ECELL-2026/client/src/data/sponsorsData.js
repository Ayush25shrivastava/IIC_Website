import { getAssetUrl } from "../utils/assetUrl";
import { CLOUDINARY_SPONSORS } from "../constants/cloudinaryAssets";

export const SPONSOR_STREAM_ITEMS = [];

export const SPONSOR_TIERS = [
  {
    id: "title",
    title: "Title Partner",
    sponsors: [
      {
        name: "Study For Civil Services by Gyan Sir",
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
    id: "ai",
    title: "AI Partner",
    sponsors: [
      {
        name: "Wayam AI",
        category: "AI Partner",
        image: CLOUDINARY_SPONSORS.wayamai || getAssetUrl("/sponsors/wayamai.png"),
        fallbackImage: getAssetUrl("/sponsors/wayamai.png"),
        description: "Official AI Partner for Renaissance 2026.",
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
  },
  {
    id: "sports",
    title: "Sports Partner",
    sponsors: [
      {
        name: "Shukla Sport",
        category: "Sports Partner",
        image: CLOUDINARY_SPONSORS.shuklaSport || getAssetUrl("/sponsors/shukla sports.jpeg"),
        fallbackImage: getAssetUrl("/sponsors/shukla sports.jpeg"),
        description: "Official Sports Partner for Renaissance 2026.",
      }
    ],
  },
  {
    id:"coaching",
    title:"Coaching Partner",
    sponsors:[
      {
        name:"Toppers Code India",
        category:"Coaching Partner",
        image:CLOUDINARY_SPONSORS.toppersCode || getAssetUrl("/sponsors/topperscode.jpeg"),
        fallbackImage: getAssetUrl("/sponsors/topperscode.jpeg"),
        description: "Official Coaching Partner for Renaissance 2026.",
      }
    ],
  },
  {
    id:"communication",
    title:"Communication Partner",
    sponsors:[
      {
        name:"Caller Desk",
        category:"Communication Partner",
        image:CLOUDINARY_SPONSORS.callerDesk || getAssetUrl("/sponsors/caller-desk.jpeg"),
        fallbackImage: getAssetUrl("/sponsors/caller-desk.jpeg"),
        description: "Official Communication Partner for Renaissance 2026.",
      }
    ],
  },
  {
    id: "media",
    title: "Media Partner",
    sponsors: [
      {
        name: "Dainik Jagran inext",
        category: "Media Partner",
        image: CLOUDINARY_SPONSORS.dainikJagranInext || getAssetUrl("/sponsors/dainik-jagran-inext.png"),
        fallbackImage: getAssetUrl("/sponsors/dainik-jagran-inext.png"),
        description: "Official Media Partner for Renaissance 2026.",
      }
    ],
  },
  {
    id: "travel-easemytrip",
    title: "Travel Partner",
    sponsors: [
      {
        name: "EaseMyTrip",
        category: "Travel Partner",
        image: CLOUDINARY_SPONSORS.easemytrip || getAssetUrl("/sponsors/easemytrip.png"),
        fallbackImage: getAssetUrl("/sponsors/easemytrip.png"),
        description: "Official Travel Partner for Renaissance 2026.",
      }
    ],
  },
  {
    id: "exam-prep",
    title: "Exam Prep Partner",
    sponsors: [
      {
        name: "IMS",
        category: "Exam Prep Partner",
        image: CLOUDINARY_SPONSORS.ims || getAssetUrl("/sponsors/ims.png"),
        fallbackImage: getAssetUrl("/sponsors/ims.png"),
        description: "Official Exam Prep Partner for Renaissance 2026.",
      }
    ],
  },
  {
    id: "fooding",
    title: "Fooding Partner",
    sponsors: [
      {
        name: "Laal's Kitchen",
        category: "Fooding Partner",
        image: CLOUDINARY_SPONSORS.laals || getAssetUrl("/sponsors/laals-kitchen.png"),
        fallbackImage: getAssetUrl("/sponsors/laals-kitchen.png"),
        description: "Official Fooding Partner for Renaissance 2026.",
      }
    ],
  },
  {
    id: "trading",
    title: "Trading Partner",
    sponsors: [
      {
        name: "SMC",
        category: "Trading Partner",
        image: CLOUDINARY_SPONSORS.smc || getAssetUrl("/sponsors/smc.png"),
        fallbackImage: getAssetUrl("/sponsors/smc.png"),
        description: "Official Trading Partner for Renaissance 2026.",
      }
    ],
  },
  {
    id: "knowledge",
    title: "Knowledge Partner",
    sponsors: [
      {
        name: "Syncoro Ventures",
        category: "Knowledge Partner",
        image: CLOUDINARY_SPONSORS.syncoro || getAssetUrl("/sponsors/syncoro-ventures.png"),
        fallbackImage: getAssetUrl("/sponsors/syncoro-ventures.png"),
        description: "Official Knowledge Partner for Renaissance 2026.",
      }
    ],
  },
  {
    id: "merchandise",
    title: "Merchandise Partner",
    sponsors: [
      {
        name: "Doon Merchandise",
        category: "Merchandise Partner",
        image: CLOUDINARY_SPONSORS.doon || getAssetUrl("/sponsors/doon-merchandise.png"),
        fallbackImage: getAssetUrl("/sponsors/doon-merchandise.png"),
        description: "Official Merchandise Partner for Renaissance 2026.",
      }
    ],
  },
  {
    id: "learning",
    title: "Learning Partner",
    sponsors: [
      {
        name: "Chemica Point",
        category: "Learning Partner",
        image: CLOUDINARY_SPONSORS.chemicapoint || getAssetUrl("/sponsors/chemica-point.png"),
        fallbackImage: getAssetUrl("/sponsors/chemica-point.png"),
        description: "Official Learning Partner for Renaissance 2026.",
      }
    ],
  }
];
