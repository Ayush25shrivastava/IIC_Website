import { useEffect, useState } from "react";
import { getTeamPhotos, teamPhotoUrl } from "../lib/server1-api";
import { TEAM_PHOTO_CATEGORIES, DEFAULT_TEAM_PHOTOS } from "../data/teamPhotoCategories";
import { localAdminMode, localTeamPhotoApi } from "../lib/local-admin";
import { getAssetUrl } from "../utils/assetUrl";
import { FaLinkedin } from "react-icons/fa";
import ContactFooter from "../components/ContactFooter";

const MAIN_SECTION_HEADING_CLASS =
  "group mx-auto mb-5 flex w-fit cursor-default flex-col items-center font-cinzel text-[1.65rem] font-bold leading-tight tracking-[0.04em] text-[#166E94] sm:mb-9 sm:text-5xl sm:tracking-[0.06em]";

const FacultyCard = ({ member }) => (
  <article className="teams-member-card teams-faculty-card group flex w-full max-w-[280px] shrink-0 flex-col rounded-xl border border-[#D8C4A8] bg-[#FDF3DF] p-3 text-center shadow-[0_10px_24px_rgba(84,64,43,0.2)] transition-all duration-300 sm:w-[232px] sm:rounded-2xl sm:p-4">
    <div className="aspect-square w-full overflow-hidden rounded-xl border border-[#D8C4A8] bg-[#EAD7BC]">
      <img
        src={teamPhotoUrl(member)}
        alt={member.name}
        className="h-full w-full object-cover"
        onError={(e) => {
          const fallback = getAssetUrl("/placeholder-speaker.svg");
          if (e.currentTarget.getAttribute("src") !== fallback) e.currentTarget.src = fallback;
        }}
      />
    </div>
    <h3 className="mt-3 font-cinzel text-base font-bold leading-snug text-[#40352B] sm:mt-5 sm:text-2xl">
      {member.name}
    </h3>
    {member.position && <p className="mt-2 text-sm text-[#7A6A58]">{member.position}</p>}
    {member.team && <p className="mt-1 text-xs text-[#7A6A58]">{member.team}</p>}
    {member.linkedin && <a
      href={member.linkedin}
      target="_blank"
      rel="noreferrer"
      className="mt-2.5 inline-flex items-center justify-center gap-1.5 self-center font-montserrat text-[10px] font-bold uppercase tracking-[0.1em] text-[#7A6A58] transition-colors hover:text-[#40352B] sm:mt-4 sm:gap-2 sm:text-xs sm:tracking-[0.13em]"
    >
      <FaLinkedin className="text-lg" aria-hidden="true" />
      <span>LinkedIn</span>
    </a>}
  </article>
);


export default function Teams({ embedded = false }) {
  const [members, setMembers] = useState(DEFAULT_TEAM_PHOTOS);
  useEffect(() => {
    let active = true;
    const refresh = () => {
      if (document.visibilityState !== "visible") return;
      const request = localAdminMode ? localTeamPhotoApi.teamPhotos() : getTeamPhotos();
      request.then((data) => { if (active) setMembers(data.members); }).catch(() => {
        // Preserve the last available team if the API is temporarily unavailable.
      });
    };
    refresh();
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);
    return () => { active = false; window.removeEventListener("focus", refresh); window.removeEventListener("storage", refresh); };
  }, []);
  return (
    <div className={`${embedded ? "py-12 sm:py-16" : "teams-page-root min-h-[100svh] pt-[68px] sm:pt-24"} flex flex-col justify-between overflow-x-hidden bg-[radial-gradient(ellipse_at_15%_18%,rgba(249,231,196,0.60)_0%,transparent_34%),radial-gradient(ellipse_at_85%_76%,rgba(128,199,220,0.35)_0%,transparent_36%),linear-gradient(180deg,#E9DFC9_0%,#C6DEE0_20%,#D7E1D9_44%,#F2E8C8_72%,#FFD9A5_100%)] text-[#173F56]`}>
      <style>{`
        @keyframes teams-member-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-33.333333%); }
        }

        @keyframes teams-member-scroll-reverse {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }

        .teams-member-card {
          transform: perspective(900px) translateZ(0);
          transform-style: preserve-3d;
          will-change: transform;
        }

        .teams-member-card:hover {
          transform: perspective(900px) translateZ(36px) scale(1.025);
          box-shadow: 0 0 14px rgba(120, 200, 237, 0.7), 0 0 30px rgba(120, 200, 237, 0.4);
        }

        .teams-member-row {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .teams-member-row::-webkit-scrollbar {
          display: none;
        }

        /* Scale the reference composition across the full desktop range. */
        @media (min-width: 1024px) {
          .teams-content {
            max-width: min(calc(100% - 4rem), 91.75rem);
          }

          .teams-faculty-cards {
            gap: clamp(2rem, 3.3vw, 4rem);
          }

          .teams-faculty-card {
            width: clamp(16.25rem, 17.6vw, 21.5625rem);
          }
        }

        /* Keep the complete faculty introduction above the fold on short desktop windows. */
        @media (min-width: 1024px) and (max-height: 780px) {
          .teams-page-root {
            padding-top: 4rem !important;
          }

          .teams-team-banner {
            margin-bottom: 1rem !important;
          }

          .teams-team-banner__inner {
            min-height: 150px !important;
            padding-top: 1rem !important;
            padding-bottom: 1rem !important;
          }

          .teams-team-banner__inner > span:not(.absolute) {
            padding: 0.25rem 1rem !important;
            font-size: 0.625rem !important;
          }

          .teams-team-banner__inner h1 {
            margin-top: 0.5rem !important;
            font-size: 2rem !important;
          }

          .teams-team-banner__inner > div {
            margin-top: 0.75rem !important;
          }

          .teams-team-banner__inner p {
            margin-top: 0.5rem !important;
            font-size: 0.875rem !important;
          }

          .teams-faculty-heading {
            margin-bottom: 1rem !important;
            font-size: 2.25rem !important;
          }

          .teams-faculty-heading > span:last-child {
            margin-top: 0.5rem !important;
          }

          .teams-faculty-card {
            width: 260px !important;
            padding: 0.75rem !important;
          }

          .teams-faculty-card h3 {
            margin-top: 0.75rem !important;
            font-size: 1.25rem !important;
            line-height: 1.25 !important;
          }

          .teams-faculty-card a {
            margin-top: 0.75rem !important;
            font-size: 0.625rem !important;
          }
        }
      `}</style>
      <div className="teams-content mx-auto mb-16 w-full max-w-6xl px-3 sm:mb-36 sm:px-6">
        <header className="teams-team-banner relative mb-4 rounded-[22px] border border-[#C9953D] bg-[#FDF6E8] p-1 shadow-[0_16px_32px_rgba(92,67,27,0.18)] sm:mb-6 sm:rounded-[30px] sm:p-2">
          <div className="teams-team-banner__inner relative flex min-h-[142px] flex-col items-center justify-center overflow-hidden rounded-[17px] border border-[#E1BC73] px-4 py-4 text-center sm:min-h-[200px] sm:rounded-[23px] sm:px-5 sm:py-6">
            <span className="absolute left-3 top-2 font-serif text-sm text-[#B98531] sm:left-4 sm:top-3">✦</span>
            <span className="absolute right-3 top-2 font-serif text-sm text-[#B98531] sm:right-4 sm:top-3">✦</span>
            <span className="absolute bottom-2 left-3 font-serif text-sm text-[#B98531] sm:bottom-3 sm:left-4">✦</span>
            <span className="absolute bottom-2 right-3 font-serif text-sm text-[#B98531] sm:bottom-3 sm:right-4">✦</span>

            <span className="rounded-full border border-[#C9953D] px-3 py-1.5 font-mono text-[7px] font-bold uppercase tracking-[0.26em] text-[#A97929] sm:px-6 sm:py-2 sm:text-xs sm:tracking-[0.5em]">
              ✦ The Organizing Guild ✦
            </span>
            <h1 className="mt-2.5 pt-3 font-cinzel text-[1.65rem] font-bold uppercase tracking-[0.08em] text-[#31291F] sm:mt-5 sm:text-4xl">
              Our Team
            </h1>
            <div className="mt-2.5 flex items-center gap-3 text-[#C9953D] sm:mt-5 sm:gap-5">
              <span className="h-px w-11 bg-[#C9953D] sm:w-28" />
              <span className="text-sm">✦</span>
              <span className="h-px w-11 bg-[#C9953D] sm:w-28" />
            </div>
            <p className="mt-2 font-montserrat text-[11px] font-medium leading-snug tracking-wide text-[#796E5B] sm:mt-4 sm:text-base">
              Meet the people behind Renaissance 2026.
            </p>
          </div>
        </header>

        <div className="space-y-14">
          {TEAM_PHOTO_CATEGORIES.map(([category, label]) => {
            const group = members.filter((member) => member.category === category);
            if (!group.length) return null;
            return <section key={category} className="teams-faculty-section overflow-x-clip" aria-labelledby={`team-${category}-heading`}>
              <h2 id={`team-${category}-heading`} className={`${MAIN_SECTION_HEADING_CLASS} teams-faculty-heading`}>
                <span>{label}</span>
                <span className="mt-2 h-1 w-20 rounded-full bg-[#78C8ED] sm:mt-3 sm:w-24" />
              </h2>
              <div className="teams-faculty-cards flex flex-wrap items-stretch justify-center gap-4 px-1 pb-2 sm:gap-12">
                {group.map((member) => <FacultyCard key={member.id} member={member} />)}
              </div>
            </section>;
          })}
        </div>
      </div>

      {!embedded && <ContactFooter />}
    </div>
  );
}
