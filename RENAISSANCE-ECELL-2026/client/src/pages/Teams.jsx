import { useEffect, useState } from "react";
import { getTeamPhotos, teamPhotoUrl } from "../lib/server1-api";
import { STUDENT_TEAMS, TEAM_PHOTO_CATEGORIES } from "../data/teamPhotoCategories";
import { getAssetUrl } from "../utils/assetUrl";
import { FaLinkedin } from "react-icons/fa";
import ContactFooter from "../components/ContactFooter";

const MAIN_SECTION_HEADING_CLASS =
  "group mx-auto mb-6 flex w-fit cursor-default flex-col items-center font-cinzel text-[1.65rem] font-bold uppercase leading-tight tracking-[0.04em] text-[#166E94] sm:mb-10 sm:text-5xl sm:tracking-[0.06em]";

const FacultyCard = ({ member, grouped = false, isTopLeader = false }) => {
  const NameHeading = grouped ? "h4" : "h3";
  return (
    <article className={`teams-member-card teams-faculty-card group flex w-full shrink-0 flex-col rounded-xl border border-[#D8C4A8] bg-[#FDF3DF] p-3 text-center shadow-[0_10px_24px_rgba(84,64,43,0.2)] transition-all duration-300 sm:rounded-2xl sm:p-4 ${isTopLeader ? 'max-w-[320px] sm:w-[280px]' : 'max-w-[280px] sm:w-[232px]'}`}>
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
      <NameHeading className={`teams-member-name mt-3 font-cinzel font-bold leading-snug text-[#40352B] sm:mt-5 ${isTopLeader ? 'text-xl sm:text-3xl' : 'text-base sm:text-2xl'}`}>
        {member.name}
      </NameHeading>
      {/* Designation conditionally renders only if added */}
      {member.position && <p className={`mt-2 font-semibold text-[#7A6A58] ${isTopLeader ? 'text-base' : 'text-sm'}`}>{member.position}</p>}
      {!grouped && member.team && <p className="mt-1 text-xs text-[#7A6A58]">{member.team}</p>}
      {/* LinkedIn dynamically shows for anyone who has it, including final years */}
      {member.linkedin && (
        <a
          href={member.linkedin}
          target="_blank"
          rel="noreferrer"
          className="mt-2.5 inline-flex items-center justify-center gap-1.5 self-center font-montserrat text-[10px] font-bold uppercase tracking-[0.1em] text-[#7A6A58] transition-colors hover:text-[#40352B] sm:mt-4 sm:gap-2 sm:text-xs sm:tracking-[0.13em]"
        >
          <FaLinkedin className="text-lg" aria-hidden="true" />
          <span>LinkedIn</span>
        </a>
      )}
    </article>
  );
};

function StudentTeamGroups({ members, category }) {
  const groups = new Map();
  
  let processedMembers = members.map(member => {
    let team = member.team?.trim() || "Team Members";
    if (team.toLowerCase().includes('media') || team.toLowerCase().includes('design')) {
        return { ...member, team: 'Design & Media Team' };
    }
    return member;
  });

  for (const member of processedMembers) {
    const team = member.team;
    if (!groups.has(team)) groups.set(team, []);
    groups.get(team).push(member);
  }

  const sortedGroupKeys = Array.from(groups.keys()).sort((a, b) => a.localeCompare(b));

  return (
    <div className="space-y-8 sm:space-y-12">
      {sortedGroupKeys.map((team, index) => {
        const teamMembers = groups.get(team);
        if (!teamMembers.length) return null;
        
        teamMembers.sort((a, b) => a.name.localeCompare(b.name));

        const headingId = `team-${category}-${index}-heading`;
        return (
          <section key={team} aria-labelledby={headingId}>
            <h3 id={headingId} className="mx-auto mb-4 flex w-fit flex-col items-center text-center font-cinzel text-lg font-bold uppercase tracking-[0.05em] text-[#166E94] sm:mb-6 sm:text-[1.75rem]">
              {team}
              <span className="mt-2 h-[2px] w-12 rounded-full bg-[#78C8ED] sm:mt-3 sm:w-16" />
            </h3>
            <div className="teams-student-row overflow-x-auto rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#166E94]" tabIndex={0} role="region" aria-labelledby={headingId}>
              <div className="teams-faculty-cards flex w-max min-w-full items-stretch justify-center gap-5 px-3 pb-6 pt-2 sm:gap-12">
                {teamMembers.map((member) => <FacultyCard key={member.id} member={member} grouped />)}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}

export default function Teams({ embedded = false }) {
  const [members, setMembers] = useState([]);
  const [photoError, setPhotoError] = useState("");
  const [photosLoading, setPhotosLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const refresh = () => {
      if (document.visibilityState !== "visible") return;
      getTeamPhotos().then((data) => { 
        if (active) { 
            const processedMembers = data.members.map(m => {
                if (m.name.toLowerCase().includes('mayank')) {
                    return {...m, position: 'President, IIC'};
                }
                if (m.name.toLowerCase().includes('mukul')) {
                    return {...m, position: 'Vice President, IIC'};
                }
                return m;
            });
            setMembers(processedMembers); 
            setPhotoError(""); 
        } 
      })
      .catch(() => { if (active) setPhotoError("Team photos are temporarily unavailable. Please try again shortly."); })
      .finally(() => { if (active) setPhotosLoading(false); });
    };
    refresh();
    window.addEventListener("focus", refresh);
    window.addEventListener("visibilitychange", refresh);
    return () => { active = false; window.removeEventListener("focus", refresh); window.removeEventListener("visibilitychange", refresh); };
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

        .teams-student-row {
          scrollbar-width: thin;
          scrollbar-color: #78C8ED transparent;
        }

        .teams-student-row .teams-member-card {
          width: min(76vw, 280px);
        }

        .teams-member-row {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .teams-member-row::-webkit-scrollbar {
          display: none;
        }

        @media (min-width: 1024px) {
          .teams-content {
            max-width: min(calc(100% - 4rem), 91.75rem);
          }

          .teams-faculty-cards {
            gap: clamp(2rem, 3.3vw, 4rem);
          }
          
          .teams-faculty-grid {
             display: grid;
             grid-template-columns: repeat(1, minmax(0, 1fr));
             gap: 2rem;
             justify-items: center;
          }
          
          @media (min-width: 640px) {
              .teams-faculty-grid {
                  grid-template-columns: repeat(2, minmax(0, 1fr));
              }
          }
          
          @media (min-width: 1024px) {
              .teams-faculty-grid {
                  grid-template-columns: repeat(4, minmax(0, 1fr));
              }
          }
        }

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

          .teams-faculty-card .teams-member-name {
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
        <header className="teams-team-banner relative mb-6 rounded-[22px] border border-[#C9953D] bg-[#FDF6E8] p-1 shadow-[0_16px_32px_rgba(92,67,27,0.18)] sm:mb-10 sm:rounded-[30px] sm:p-2">
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

        <div className="space-y-16">
          {photosLoading && <p role="status" className="text-center">Loading team photos…</p>}
          {photoError && <p role="alert" className="text-center">{photoError}</p>}
          {!photosLoading && !photoError && !members.length && <p className="text-center">Team photos will be added soon.</p>}
          
          {TEAM_PHOTO_CATEGORIES.map(([category, label]) => {
            const group = members.filter((member) => member.category === category);
            if (!group.length) return null;

            if (category === "faculty") {
                const topLeaders = group.filter(m => m.name.toLowerCase().includes('mayank') || m.name.toLowerCase().includes('mukul'));
                const otherFaculty = group.filter(m => !m.name.toLowerCase().includes('mayank') && !m.name.toLowerCase().includes('mukul'));

                return (
                    <section key={category} className="teams-faculty-section overflow-x-clip" aria-labelledby={`team-${category}-heading`}>
                        <h2 id={`team-${category}-heading`} className={`${MAIN_SECTION_HEADING_CLASS} teams-faculty-heading`}>
                            <span>Our-Mentors</span>
                            <span className="mt-2 h-1 w-20 rounded-full bg-[#78C8ED] sm:mt-3 sm:w-32" />
                        </h2>
                        
                        {topLeaders.length > 0 && (
                            <div className="flex flex-wrap items-stretch justify-center gap-6 px-1 pb-10 sm:gap-16">
                                {topLeaders.map((member) => <FacultyCard key={member.id} member={member} isTopLeader={true} />)}
                            </div>
                        )}

                        {otherFaculty.length > 0 && (
                            <div className="teams-faculty-grid w-full px-1 pb-2">
                                {otherFaculty.map((member) => <FacultyCard key={member.id} member={member} />)}
                            </div>
                        )}
                    </section>
                );
            }

            return (
              <section key={category} className="teams-faculty-section overflow-x-clip" aria-labelledby={`team-${category}-heading`}>
                <h2 id={`team-${category}-heading`} className={`${MAIN_SECTION_HEADING_CLASS} teams-faculty-heading`}>
                  <span>{category === "faculty" ? "Our-Mentors" : label}</span>
                  <span className="mt-2 h-1 w-20 rounded-full bg-[#78C8ED] sm:mt-3 sm:w-32" />
                </h2>
                
                <StudentTeamGroups members={group} category={category} />
                
              </section>
            );
          })}
        </div>
      </div>

      {!embedded && <ContactFooter />}
    </div>
  );
}