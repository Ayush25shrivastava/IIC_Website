// Shared Tailwind styling tokens for Renaissance Admin command center
// Provides 100% exact parity with the legacy admin-dashboard.css styles

export const adminStyles = {
  // Base shell
  app: "min-h-screen text-[#173f52] font-[var(--font-montserrat),sans-serif] bg-[radial-gradient(ellipse_at_18%_0%,#c7e1e0_0,transparent_57%),linear-gradient(130deg,#5ba3b9,#1583a5_70%,#075374)] leading-[1.55] relative isolate text-[14px] [&_*]:box-border",
  gate: "min-h-screen text-[#173f52] font-[var(--font-montserrat),sans-serif] bg-[radial-gradient(ellipse_at_18%_0%,#c7e1e0_0,transparent_57%),linear-gradient(130deg,#5ba3b9,#1583a5_70%,#075374)] leading-[1.55] relative isolate text-[14px] flex flex-col gap-[18px] items-center justify-center p-6 text-center [&_*]:box-border",

  // Buttons
  btn: "inline-flex items-center justify-center gap-[9px] border border-[#b6dce4] rounded-[11px] bg-[#e5f6fa] text-[#376579] font-inherit font-semibold px-4 py-[11px] cursor-pointer hover:bg-[#f4fcfd] disabled:opacity-55 disabled:cursor-not-allowed transition-colors duration-150 focus-visible:outline-3 focus-visible:outline-[#b17e2e] focus-visible:outline-offset-3",
  btnGold: "inline-flex items-center justify-center gap-[9px] border border-[#d8b15c] rounded-[11px] bg-[linear-gradient(115deg,#f9ebbd,#efd084)] text-[#72551c] font-inherit font-semibold px-4 py-[11px] cursor-pointer hover:brightness-105 disabled:opacity-55 disabled:cursor-not-allowed transition-all duration-150 focus-visible:outline-3 focus-visible:outline-[#b17e2e] focus-visible:outline-offset-3",
  btnDanger: "inline-flex items-center justify-center gap-[9px] border border-[#deb6aa] rounded-[11px] bg-[#fff0ea] text-[#963a33] font-inherit font-semibold px-4 py-[11px] cursor-pointer hover:bg-[#fde8e1] disabled:opacity-55 disabled:cursor-not-allowed transition-colors duration-150 focus-visible:outline-3 focus-visible:outline-[#b17e2e] focus-visible:outline-offset-3",
  btnText: "border-0 bg-transparent p-[5px] text-[#247d96] whitespace-nowrap inline-flex items-center gap-1 cursor-pointer font-semibold hover:underline",
  btnHero: "flex-1 sm:flex-none inline-flex items-center justify-center gap-[9px] border border-[#b6dce4] rounded-[11px] bg-[#e5f6fa] text-[#376579] font-inherit font-semibold px-4 py-[11px] max-[520px]:p-[10px] max-[520px]:text-[12px] cursor-pointer hover:bg-[#f4fcfd] disabled:opacity-55 disabled:cursor-not-allowed transition-colors duration-150 focus-visible:outline-3 focus-visible:outline-[#b17e2e] focus-visible:outline-offset-3",
  btnHeroGold: "flex-1 sm:flex-none inline-flex items-center justify-center gap-[9px] border border-[#d8b15c] rounded-[11px] bg-[linear-gradient(115deg,#f9ebbd,#efd084)] text-[#72551c] font-inherit font-semibold px-4 py-[11px] max-[520px]:p-[10px] max-[520px]:text-[12px] cursor-pointer hover:brightness-105 disabled:opacity-55 disabled:cursor-not-allowed transition-all duration-150 focus-visible:outline-3 focus-visible:outline-[#b17e2e] focus-visible:outline-offset-3",

  // Form Controls
  input: "w-full min-w-0 px-[14px] py-3 text-[#173f52] font-inherit border border-[#afd6e1] rounded-[11px] bg-[#f0fbfc] placeholder:text-[#648c9b] focus-visible:outline-3 focus-visible:outline-[#b17e2e] focus-visible:outline-offset-3",
  select: "w-full min-w-0 px-[14px] py-3 text-[#173f52] font-inherit border border-[#afd6e1] rounded-[11px] bg-[#f0fbfc] focus-visible:outline-3 focus-visible:outline-[#b17e2e] focus-visible:outline-offset-3",
  textarea: "w-full min-w-0 px-[14px] py-3 text-[#173f52] font-inherit border border-[#afd6e1] rounded-[11px] bg-[#f0fbfc] placeholder:text-[#648c9b] focus-visible:outline-3 focus-visible:outline-[#b17e2e] focus-visible:outline-offset-3",
  form: "grid gap-4 [&_label]:grid [&_label]:gap-[7px] [&_label]:font-semibold [&_label]:text-[#173f52] [&_details]:p-[15px] [&_details]:border [&_details]:border-[#b8d6df] [&_details]:rounded-[10px] [&_summary]:cursor-pointer [&_p]:mb-[10px] [&_p]:mt-0",
  passwordWrapper: "flex relative",
  passwordInput: "w-full min-w-0 px-[14px] py-3 pr-[52px] text-[#173f52] font-inherit border border-[#afd6e1] rounded-[11px] bg-[#f0fbfc] placeholder:text-[#648c9b] focus-visible:outline-3 focus-visible:outline-[#b17e2e] focus-visible:outline-offset-3",
  passwordToggle: "absolute right-[3px] top-[3px] bottom-[3px] bg-transparent border-0 inline-flex items-center justify-center p-2 text-[#376579] hover:text-[#173f52] cursor-pointer focus-visible:outline-3 focus-visible:outline-[#b17e2e] focus-visible:outline-offset-3",

  // Panels & Containers
  panel: "bg-[linear-gradient(125deg,#e5f6f8f5,#ccebf0f5)] border border-[#b4dbe3] rounded-[20px] shadow-[0_12px_28px_#0e4a6710] overflow-hidden",
  panelMain: "bg-[linear-gradient(125deg,#e5f6f8f5,#ccebf0f5)] border border-[#b4dbe3] rounded-[20px] shadow-[0_12px_28px_#0e4a6710] overflow-hidden mb-[22px]",
  panelHeading: "p-[25px_26px] max-[520px]:p-[22px_17px] max-[520px]:flex-wrap max-[520px]:gap-[14px] flex justify-between items-center gap-5",

  // Typography
  kicker: "font-mono text-[11px] uppercase tracking-[0.14em] font-semibold",
  h1: "font-cinzel text-[clamp(26px,2.7vw,44px)] leading-[1.25] m-0 font-semibold uppercase tracking-[-0.05em] max-[520px]:text-[29px] max-[520px]:max-w-[330px]",
  h2: "font-cinzel text-[clamp(22px,2vw,30px)] leading-[1.25] m-0 font-semibold",
  h3: "text-[17px] font-semibold text-[#173f52]",
  small: "block text-[#527e8e] text-[12px]",

  // Navigation & Layout
  sidebar: "w-[260px] 2xl:w-[290px] max-[1250px]:w-[225px] max-[900px]:w-[260px] fixed inset-y-0 left-0 z-30 flex flex-col p-[32px_17px_24px] 2xl:p-[35px_20px_25px] border-r-2 border-[#508599] bg-[linear-gradient(150deg,#eefafa_0%,#c2e5ea_100%)] transition-transform duration-200 max-[900px]:top-[78px] max-[900px]:pt-5 max-[900px]:shadow-[15px_0_30px_#103c4940] overflow-y-auto",
  sidebarBrand: "text-center px-[6px]",
  sidebarBrandImg: "block w-full h-[76px] object-contain p-[12px_18px] rounded-[22px] bg-[#f7fcfc] mb-[18px]",
  sidebarNavLabel: "font-mono text-[11px] uppercase tracking-[0.14em] font-semibold text-[#527e8e] my-[42px_20px] mx-3 max-[900px]:mt-5",
  sidebarNav: "grid gap-[10px]",
  sidebarNavItem: "justify-start p-[15px_12px] bg-transparent border border-transparent rounded-[11px] text-left text-[14px] inline-flex items-center gap-[9px] text-[#376579] font-semibold no-underline cursor-pointer transition-colors duration-150 hover:bg-[#f4fcfd] [&_svg]:shrink-0 [&_svg]:text-[#679caf]",
  sidebarNavSelected: "!bg-[#f7f1df] !border-[#dcbb6e] !text-[#224c60] [&_svg]:!text-[#b18b36]",
  sidebarNavBadge: "ml-auto text-[#997329] bg-[#f7eed5] border border-[#dfc580] rounded-[6px] px-[6px] text-xs font-bold",
  sidebarFooter: "border-t border-[#afd4df] flex items-center gap-[10px] pt-[22px] pb-3 mt-auto text-[12px] [&>svg]:text-[#b18b36] [&_button]:p-2 [&_button]:ml-auto [&_button]:bg-transparent [&_button]:border-0 [&_button]:cursor-pointer [&_button]:text-[#376579] [&_button]:hover:text-[#173f52]",
  sidebarCredit: "font-mono text-[9px] uppercase tracking-[0.14em] font-semibold text-[#557e8d] text-center mt-2",
  main: "ml-[260px] 2xl:ml-[290px] max-[1250px]:ml-[225px] max-[900px]:ml-0 p-[26px_32px_30px] 2xl:p-[30px_38px] max-[1250px]:p-[22px] max-[900px]:p-[14px_18px] max-[520px]:p-3 min-w-0",

  // Topbar & Hero
  topbar: "rounded-[21px] p-[15px_24px] bg-[#e5f5f8] flex justify-between items-center gap-[14px] text-[#47768a] max-[900px]:p-[10px_12px] max-[900px]:min-h-[55px] max-[900px]:relative max-[900px]:z-35",
  topbarMobileMenu: "hidden max-[900px]:inline-flex max-[900px]:p-[6px] bg-transparent border-0 cursor-pointer text-[#47768a] items-center justify-center rounded-lg",
  topbarGroup: "flex items-center gap-[15px] max-[900px]:gap-[9px]",
  topbarKicker: "hidden min-[901px]:inline font-mono text-[11px] uppercase tracking-[0.14em] font-semibold",
  topbarAccess: "hidden min-[901px]:flex text-[#9b7a31] uppercase items-center gap-[7px] font-mono text-[11px] tracking-[0.08em] font-semibold",
  avatar: "w-[37px] h-[37px] bg-[#d9f0f4] border border-[#a3d0df] rounded-full inline-flex items-center justify-center shrink-0 text-[11px] text-[#41809a] font-semibold",
  hero: "py-[31px] pb-7 text-[#e2f4f7] max-[900px]:pt-6",
  heroKicker: "font-mono text-[11px] uppercase tracking-[0.14em] font-semibold mb-3 text-[#f0f6ef] flex items-center before:content-[''] before:inline-block before:w-[26px] before:h-[1px] before:bg-[#e8d18d] before:align-middle before:mr-3",
  heroContent: "flex justify-between items-center flex-wrap gap-5 2xl:items-end",
  actions: "flex flex-wrap gap-[10px] max-[520px]:w-full",

  // Stats Grid
  statsGrid: "grid grid-cols-4 max-[900px]:grid-cols-2 gap-[18px] max-[1250px]:gap-3 mb-6",
  statCard: "bg-[linear-gradient(125deg,#e5f6f8f5,#ccebf0f5)] border border-[#b4dbe3] rounded-[20px] shadow-[0_12px_28px_#0e4a6710] overflow-hidden p-[23px_21px] max-[1250px]:p-[19px_15px] max-[520px]:p-[16px_12px]",
  statCardGold: "border-[#dfc177] bg-[linear-gradient(120deg,#f6f2df,#d5edf0)] [&>strong]:text-[#9c7c29] [&>div]:text-[#9c7c29]",
  statHead: "flex items-center justify-between gap-2 text-[#508397] max-[520px]:items-start [&_svg]:p-2 [&_svg]:w-[37px] [&_svg]:h-[37px] [&_svg]:border [&_svg]:border-[#b3d9e4] [&_svg]:rounded-[12px] [&_svg]:shrink-0 max-[520px]:[&_svg]:w-[29px] max-[520px]:[&_svg]:h-[29px] max-[520px]:[&_svg]:p-[6px]",
  statValue: "block text-[clamp(32px,3.5vw,48px)] leading-[1.2] tracking-[-0.06em] my-[18px_12px] font-bold text-[#173f52]",
  statDetail: "text-[#517e8b] text-[12px] m-0 max-[520px]:text-[10px]",

  // Tables & Lists
  tableScroll: "w-full overflow-x-auto",
  table: "w-full border-collapse text-left text-[12px]",
  th: "font-mono uppercase tracking-[0.06em] text-[10px] text-[#4d798c] bg-[#c8e8ee75] px-5 py-[17px] whitespace-nowrap",
  td: "border-t border-[#b7dbe4] px-5 py-[21px] text-[#173f52]",
  person: "flex items-center gap-[11px] min-w-[175px] [&_small]:mt-1 [&_small]:block [&_small]:text-[#527e8e] [&_strong]:text-[#173f52] [&_strong]:text-[13px]",
  code: "text-[#986e24] font-mono text-[12px] break-all",
  statusBadge: "inline-block border rounded-[7px] px-[9px] py-1 text-[11px] font-semibold whitespace-nowrap capitalize",
  statusActive: "text-[#327588] border-[#abd1dd] bg-[#def4f6]",
  statusMuted: "bg-[#e5ecee] border-[#c6d4da] text-[#5b747e]",
  progressBar: "block w-[150px] max-w-full h-[5px] mt-2 border-0 rounded-[10px] overflow-hidden bg-[#b7dbe4] [&::-webkit-progress-bar]:bg-[#b7dbe4] [&::-webkit-progress-value]:bg-[#58afc2] [&::-moz-progress-bar]:bg-[#58afc2]",

  // Filters & Search
  filters: "flex flex-wrap gap-[14px] px-[26px] pb-[22px] max-[520px]:px-[17px] max-[520px]:pb-5 justify-between max-[520px]:[&_select]:w-full max-[520px]:[&_select]:max-w-none",
  searchWrapper: "relative flex items-center flex-1 max-w-[520px] basis-[280px] [&>svg]:absolute [&>svg]:left-[14px] [&>svg]:text-[#6396aa] [&>input]:pl-[42px]",
  filterSelect: "w-auto max-w-[280px] min-w-0 px-[14px] py-3 text-[#173f52] font-inherit border border-[#afd6e1] rounded-[11px] bg-[#f0fbfc] focus-visible:outline-3 focus-visible:outline-[#b17e2e] focus-visible:outline-offset-3",

  // Review Queue & Overview
  overviewGrid: "grid grid-cols-[minmax(0,2.4fr)_minmax(245px,1fr)] max-[1250px]:grid-cols-1 gap-[22px] items-start",
  reviewQueue: "bg-[linear-gradient(125deg,#e5f6f8f5,#ccebf0f5)] border border-[#b4dbe3] rounded-[20px] shadow-[0_12px_28px_#0e4a6710] overflow-hidden p-[25px_22px] max-[1250px]:block",
  reviewQueueItem: "flex w-full border-0 rounded-none bg-transparent border-b border-[#b5dce5] py-[18px] px-0 text-left justify-start hover:bg-transparent cursor-pointer [&>svg:first-child]:shrink-0 [&>svg:first-child]:text-[#ab893c] [&>svg:last-child]:ml-auto [&_small]:mt-[6px] [&_small]:block [&_small]:text-[#527e8e] [&_strong]:text-[#173f52] items-center gap-3",

  // Tasks & Promo Lists
  taskList: "px-[26px] pb-6 max-[520px]:px-[17px] [&>article]:py-[22px] [&>article]:border-t [&>article]:border-[#b1d7e1]",
  taskHeading: "flex justify-between items-center gap-[14px] max-[520px]:items-start [&_h3]:my-[7px] [&_h3]:text-[17px] [&_h3]:font-semibold",
  evidence: "whitespace-pre-wrap break-all my-3 text-[#173f52]",
  promoList: "px-[26px] pb-6 max-[520px]:px-[17px] [&>article]:flex [&>article]:items-center [&>article]:flex-wrap [&>article]:gap-[14px] [&>article]:border-t [&>article]:border-[#b5dbe3] [&>article]:py-[18px] [&>article>div]:flex-[1_1_200px]",

  // Feedback, Alerts, Dialog
  alert: "p-[16px_20px] rounded-[12px] mb-5 bg-[#fff1ed] text-[#933830] border border-[#deaea2] flex items-center justify-between [&_button]:ml-3",
  notice: "p-[16px_20px] rounded-[12px] mb-5 bg-[#e5f4e9] text-[#285a46]",
  credential: "p-[16px_20px] rounded-[12px] mb-5 bg-[#fff6db] text-[#70531b] break-all [&_code]:text-[18px] [&_code]:block [&_code]:my-2",
  empty: "text-center py-10 px-[22px] text-[#4e7a8a] [&_svg]:mx-auto [&_svg]:mb-[10px]",
  dataFooter: "flex justify-between items-center gap-[18px] mt-[22px] text-[#e0f2f8] text-[11px]",

  dialog: "border border-[#accfd8] rounded-[22px] p-[26px] w-[min(540px,calc(100%-32px))] max-h-[calc(100dvh-40px)] m-auto overflow-y-auto bg-[#e5f5f8] text-[#173f52] shadow-[0_24px_90px_#062f4d55] font-[var(--font-montserrat),sans-serif] text-[14px] leading-[1.6] backdrop:bg-[#062e48a8] backdrop:backdrop-blur-[4px]",
  dialogHeader: "flex items-center justify-between gap-[14px] mb-[22px] [&_button]:p-2 [&_button]:bg-transparent [&_button]:border-0 [&_button]:cursor-pointer [&_button]:text-[#376579] [&_button]:hover:text-[#173f52] [&_button]:rounded-lg",

  // Login page specific
  loginMain: "min-h-screen text-[#173f52] font-[var(--font-montserrat),sans-serif] bg-[radial-gradient(ellipse_at_18%_0%,#c7e1e0_0,transparent_57%),linear-gradient(130deg,#5ba3b9,#1583a5_70%,#075374)] leading-[1.55] relative isolate text-[14px] grid place-items-center p-5 sm:p-10 [&_*]:box-border",
  loginCard: "bg-[linear-gradient(125deg,#e5f6f8f5,#ccebf0f5)] border border-[#b4dbe3] rounded-[20px] shadow-[0_12px_28px_#0e4a6710] overflow-hidden w-[min(100%,470px)] p-[26px] sm:p-9",
  loginLogo: "w-[200px] h-[75px] object-contain mx-auto mb-7 block",

  // Team Photo & Photo Cropper
  photoFields: "grid gap-4 border-0 p-0 min-w-0",
  photoPreview: "w-[160px] h-[160px] object-cover rounded-[12px]",
  photoGrid: "grid grid-cols-[repeat(auto-fill,minmax(min(220px,100%),1fr))] gap-5 px-[26px] pb-[26px]",
  photoCard: "overflow-hidden border border-[#b5dbe3] rounded-[14px] bg-[#f4fbfc] [&>img]:w-full [&>img]:aspect-square [&>img]:object-cover [&>img]:bg-[#d6e9ee] [&>div]:p-4 [&_h3]:text-[17px] [&_h3]:font-semibold [&_h3]:my-2 [&_h3]:break-all [&_p]:min-h-[22px] [&_p]:mb-[14px] [&_p]:break-all",
  cropper: "grid gap-4 [&_label]:grid [&_label]:gap-[6px] [&_label]:font-semibold [&_input[type='range']]:w-full [&_input[type='range']]:min-h-[30px] [&_input[type='range']]:p-0 [&_input[type='range']]:accent-[#98742f] [&_input[type='range']]:cursor-pointer",
  cropStage: "relative w-[min(100%,350px)] aspect-square mx-auto overflow-hidden border-2 border-[#98742f] rounded-[8px] touch-none cursor-grab active:cursor-grabbing select-none focus-visible:outline-3 focus-visible:outline-[#166e94] focus-visible:outline-offset-3 [&_canvas]:block [&_canvas]:w-full [&_canvas]:h-full",
  cropGrid: "pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,transparent_33.1%,#ffffff80_33.1%,#ffffff80_33.5%,transparent_33.5%,transparent_66.4%,#ffffff80_66.4%,#ffffff80_66.8%,transparent_66.8%),linear-gradient(to_bottom,transparent_33.1%,#ffffff80_33.1%,#ffffff80_33.5%,transparent_33.5%,transparent_66.4%,#ffffff80_66.4%,#ffffff80_66.8%,transparent_66.8%)]",
};
