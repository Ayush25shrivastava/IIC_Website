import { useState, useEffect } from "react";
import { FaLinkedin, FaInstagram, FaEnvelope } from "react-icons/fa";
import ContactFooter from "../components/ContactFooter";
import { teamApi } from "../lib/server1-api";

const MAIN_SECTION_HEADING_CLASS =
  "group mx-auto mb-6 flex w-fit cursor-default flex-col items-center font-cinzel text-[1.65rem] font-bold leading-tight tracking-[0.04em] text-[#166E94] sm:mb-10 sm:text-4xl sm:tracking-[0.06em]";

const SUB_SECTION_HEADING_CLASS =
  "group mx-auto mb-6 mt-4 flex w-fit cursor-default flex-col items-center font-cinzel text-xl font-bold uppercase tracking-[0.06em] text-[#31291F] sm:text-2xl";

const INITIAL_FACULTY = [
  {
    _id: "init-1",
    name: "Prof. Mukul Shukla",
    category: "faculty",
    sequence: 1,
    imageUrl: "https://res.cloudinary.com/ddjzcyl4d/image/upload/v1774029796/image_1_roojuv.avif",
    linkedin: "https://www.linkedin.com/in/mukul-shukla-329a7121",
  },
  {
    _id: "init-2",
    name: "Prof. Mayank Pandey",
    category: "faculty",
    sequence: 2,
    imageUrl: "https://res.cloudinary.com/ddjzcyl4d/image/upload/v1774029797/image_wj6szw.avif",
    linkedin: "https://www.linkedin.com/in/mayank-pandey-0b433137/",
  },
];

// Faculty Card - exact dimensions matching Photo 1 with hover scale & highlight
function FacultyCard({ member }) {
  const imageSrc = member.imageUrl || member.image_url || "/placeholder-speaker.svg";

  return (
    <article className="teams-member-card teams-faculty-card group relative flex w-full max-w-[270px] sm:w-[260px] h-full shrink-0 cursor-pointer flex-col justify-between rounded-2xl border border-[#D8C4A8] bg-[#FDF3DF] p-3.5 sm:p-4 text-center shadow-[0_10px_24px_rgba(84,64,43,0.18)] transition-all duration-300 ease-out hover:z-20 hover:-translate-y-2 hover:scale-[1.04] hover:border-[#238BBB] hover:bg-[#FFF9EE] hover:shadow-[0_22px_44px_rgba(84,64,43,0.30)]">
      <div className="flex flex-col items-center">
        {/* Square Portrait Photo (matching Photo 1) */}
        <div className="aspect-square w-full overflow-hidden rounded-xl border border-[#D8C4A8] bg-[#EAD7BC] shadow-inner transition-colors group-hover:border-[#78C8ED]">
          <img
            src={imageSrc}
            alt={member.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = "/placeholder-speaker.svg";
            }}
          />
        </div>
        <h3 className="mt-3.5 flex min-h-[2.5rem] items-center justify-center font-cinzel text-base font-bold uppercase leading-snug text-[#40352B] transition-colors group-hover:text-[#166E94] sm:min-h-[3rem] sm:text-xl">
          {member.name}
        </h3>
      </div>

      {member.linkedin ? (
        <a
          href={member.linkedin}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center justify-center gap-1.5 self-center font-montserrat text-[10px] font-bold uppercase tracking-[0.1em] text-[#7A6A58] transition-colors hover:text-[#40352B] sm:gap-2 sm:text-xs sm:tracking-[0.13em]"
        >
          <FaLinkedin className="text-lg text-[#0077B5]" aria-hidden="true" />
          <span>LINKEDIN</span>
        </a>
      ) : (
        <div className="mt-3 h-[20px] sm:h-[24px]" />
      )}
    </article>
  );
}

// Student & Member Card - identical dimensions to Photo 1 with role pill and hover highlight
function MemberCard({ member }) {
  const imageSrc = member.imageUrl || member.image_url || "/placeholder-speaker.svg";

  return (
    <article className="teams-member-card group relative flex w-full max-w-[270px] sm:w-[260px] h-full shrink-0 cursor-pointer flex-col justify-between rounded-2xl border border-[#D8C4A8] bg-[#FDF3DF] p-3.5 sm:p-4 text-center shadow-[0_10px_24px_rgba(84,64,43,0.18)] transition-all duration-300 ease-out hover:z-20 hover:-translate-y-2 hover:scale-[1.04] hover:border-[#238BBB] hover:bg-[#FFF9EE] hover:shadow-[0_22px_44px_rgba(84,64,43,0.30)]">
      <div className="flex flex-col items-center">
        {/* Square Photo matching Photo 1 */}
        <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-[#D8C4A8] bg-[#EAD7BC] shadow-inner transition-colors group-hover:border-[#78C8ED]">
          <img
            src={imageSrc}
            alt={member.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = "/placeholder-speaker.svg";
            }}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>

        {/* Member Name */}
        <h3 className="mt-3.5 flex min-h-[2.5rem] items-center justify-center text-center font-cinzel text-base font-bold uppercase leading-snug tracking-wide text-[#31291F] transition-colors group-hover:text-[#166E94] line-clamp-2">
          {member.name}
        </h3>

        {/* Role Description Box */}
        <div className="mt-2 flex min-h-[34px] w-full items-center justify-center rounded-lg border border-[#D8C4A8] bg-[#F4E9D5] px-2.5 py-1.5 text-center font-montserrat text-xs font-bold uppercase tracking-wider text-[#54402B] shadow-sm transition-colors group-hover:border-[#78C8ED] group-hover:text-[#166E94]">
          {member.role || "Member"}
        </div>
      </div>

      {/* Social Links */}
      <div className="mt-3 flex min-h-[32px] items-center justify-center gap-3 border-t border-[#D8C4A8]/40 pt-2 text-[#7A6A58]">
        {member.linkedin && (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noreferrer"
            title="LinkedIn Profile"
            className="rounded-full p-1.5 transition-colors hover:bg-[#78C8ED]/20 hover:text-[#0077B5]"
          >
            <FaLinkedin className="text-base" />
            <span className="sr-only">LinkedIn</span>
          </a>
        )}
        {member.instagram && (
          <a
            href={member.instagram}
            target="_blank"
            rel="noreferrer"
            title="Instagram Profile"
            className="rounded-full p-1.5 transition-colors hover:bg-pink-100 hover:text-[#E4405F]"
          >
            <FaInstagram className="text-base" />
            <span className="sr-only">Instagram</span>
          </a>
        )}
        {member.email && (
          <a
            href={`mailto:${member.email}`}
            title="Send Email"
            className="rounded-full p-1.5 transition-colors hover:bg-sky-100 hover:text-[#EA4335]"
          >
            <FaEnvelope className="text-sm" />
            <span className="sr-only">Email</span>
          </a>
        )}
      </div>
    </article>
  );
}

export default function Teams({ embedded = false }) {
  const [members, setMembers] = useState(INITIAL_FACULTY);

  useEffect(() => {
    let mounted = true;
    teamApi
      .getTeamMembers()
      .then((data) => {
        if (!mounted) return;
        if (data?.members?.length > 0) {
          setMembers(data.members);
        }
      })
      .catch((err) => {
        console.warn("Using initial faculty data", err);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Filter by category
  const facultyMembers = members
    .filter((m) => m.category === "faculty")
    .sort((a, b) => (a.sequence || 0) - (b.sequence || 0));

  const finalYearMembers = members
    .filter((m) => m.category === "final_year")
    .sort((a, b) => (a.sequence || 0) - (b.sequence || 0));

  const preFinalYearMembers = members
    .filter((m) => m.category === "pre_final_year")
    .sort((a, b) => (a.sequence || 0) - (b.sequence || 0));

  const secondYearMembers = members
    .filter((m) => m.category === "second_year")
    .sort((a, b) => (a.sequence || 0) - (b.sequence || 0));

  // Group sub-teams dynamically
  const groupBySubteam = (memberList) => {
    return memberList.reduce((acc, member) => {
      const sub = (member.subTeam || "General").trim();
      if (!acc[sub]) acc[sub] = [];
      acc[sub].push(member);
      return acc;
    }, {});
  };

  const finalYearSubteams = groupBySubteam(finalYearMembers);
  const finalYearHasDistinctSubteams =
    Object.keys(finalYearSubteams).length > 1 ||
    (Object.keys(finalYearSubteams).length === 1 && !finalYearSubteams["General"]);

  const preFinalSubteams = groupBySubteam(preFinalYearMembers);
  const secondYearSubteams = groupBySubteam(secondYearMembers);
  const secondYearHasDistinctSubteams =
    Object.keys(secondYearSubteams).length > 1 ||
    (Object.keys(secondYearSubteams).length === 1 && !secondYearSubteams["General"]);

  return (
    <div
      className={`${
        embedded ? "py-12 sm:py-16" : "teams-page-root min-h-[100svh] pt-[68px] sm:pt-24"
      } flex flex-col justify-between overflow-x-hidden bg-[radial-gradient(ellipse_at_15%_18%,rgba(249,231,196,0.60)_0%,transparent_34%),radial-gradient(ellipse_at_85%_76%,rgba(128,199,220,0.35)_0%,transparent_36%),linear-gradient(180deg,#E9DFC9_0%,#C6DEE0_20%,#D7E1D9_44%,#F2E8C8_72%,#FFD9A5_100%)] text-[#173F56]`}
    >
      <div className="teams-content mx-auto mb-16 w-full max-w-7xl px-4 sm:mb-28 sm:px-6">
        {/* Banner */}
        <header className="teams-team-banner relative mb-8 rounded-[22px] border border-[#C9953D] bg-[#FDF6E8] p-1 shadow-[0_16px_32px_rgba(92,67,27,0.18)] sm:mb-12 sm:rounded-[30px] sm:p-2">
          <div className="teams-team-banner__inner relative flex min-h-[142px] flex-col items-center justify-center overflow-hidden rounded-[17px] border border-[#E1BC73] px-4 py-4 text-center sm:min-h-[180px] sm:rounded-[23px] sm:px-5 sm:py-6">
            <span className="absolute left-3 top-2 font-serif text-sm text-[#B98531] sm:left-4 sm:top-3">✦</span>
            <span className="absolute right-3 top-2 font-serif text-sm text-[#B98531] sm:right-4 sm:top-3">✦</span>
            <span className="absolute bottom-2 left-3 font-serif text-sm text-[#B98531] sm:bottom-3 sm:left-4">✦</span>
            <span className="absolute bottom-2 right-3 font-serif text-sm text-[#B98531] sm:bottom-3 sm:right-4">✦</span>

            <span className="rounded-full border border-[#C9953D] px-3 py-1 font-mono text-[8px] font-bold uppercase tracking-[0.26em] text-[#A97929] sm:px-6 sm:py-1.5 sm:text-xs sm:tracking-[0.4em]">
              ✦ The Organizing Guild ✦
            </span>
            <h1 className="mt-2 font-cinzel text-2xl font-bold uppercase tracking-[0.08em] text-[#31291F] sm:mt-4 sm:text-4xl">
              Our Team
            </h1>
            <div className="mt-2 flex items-center gap-3 text-[#C9953D] sm:mt-3 sm:gap-5">
              <span className="h-px w-11 bg-[#C9953D] sm:w-28" />
              <span className="text-xs">✦</span>
              <span className="h-px w-11 bg-[#C9953D] sm:w-28" />
            </div>
            <p className="mt-2 font-montserrat text-xs font-medium leading-snug tracking-wide text-[#796E5B] sm:mt-3 sm:text-sm">
              Meet the people behind Renaissance 2026.
            </p>
          </div>
        </header>

        {/* Seamless Scroll Sections */}
        <div className="space-y-20 sm:space-y-28">
          {/* SECTION 1: FACULTY INCHARGE (If 2: centered side-by-side as screenshot; If >2: 4-in-a-row) */}
          <section className="teams-faculty-section" aria-labelledby="faculty-incharge-heading">
            <h2 id="faculty-incharge-heading" className={MAIN_SECTION_HEADING_CLASS}>
              <span className="transition-transform duration-300 group-hover:scale-105">
                Faculty Incharge
              </span>
              <span className="mt-2 h-1 w-20 rounded-full bg-[#78C8ED] transition-all duration-300 group-hover:w-[70%] sm:mt-3 sm:w-24" />
            </h2>
            {facultyMembers.length <= 2 ? (
              <div className="flex flex-col items-center justify-center gap-6 px-1 pb-2 sm:flex-row sm:gap-12">
                {facultyMembers.map((member) => (
                  <FacultyCard key={member._id} member={member} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-8 justify-items-center">
                {facultyMembers.map((member) => (
                  <FacultyCard key={member._id} member={member} />
                ))}
              </div>
            )}
          </section>

          {/* SECTION 2: FINAL YEAR (4 cards in a row, with dynamic sub-teams if defined) */}
          {finalYearMembers.length > 0 && (
            <section className="teams-final-year-section" aria-labelledby="final-year-heading">
              <h2 id="final-year-heading" className={MAIN_SECTION_HEADING_CLASS}>
                <span className="transition-transform duration-300 group-hover:scale-105">
                  Final Year
                </span>
                <span className="mt-2 h-1 w-20 rounded-full bg-[#78C8ED] transition-all duration-300 group-hover:w-[70%] sm:mt-3 sm:w-24" />
              </h2>

              {finalYearHasDistinctSubteams ? (
                <div className="space-y-16">
                  {Object.entries(finalYearSubteams).map(([subteamName, subMembers]) => (
                    <div key={subteamName} className="subteam-block">
                      <h3 className={SUB_SECTION_HEADING_CLASS}>
                        <span className="transition-transform duration-300 group-hover:scale-105">
                          {subteamName}
                        </span>
                        <span className="mt-2 h-0.5 w-14 rounded-full bg-[#78C8ED] transition-all duration-300 group-hover:w-[60%]" />
                      </h3>

                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-8 justify-items-center">
                        {subMembers
                          .sort((a, b) => (a.sequence || 0) - (b.sequence || 0))
                          .map((member) => (
                            <MemberCard key={member._id} member={member} />
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-8 justify-items-center">
                  {finalYearMembers.map((member) => (
                    <MemberCard key={member._id} member={member} />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* SECTION 3: PRE-FINAL YEAR (Sub-teams: Marketing, Media, Events, Web, and any customizable sub-team - 4 cards in a row) */}
          {preFinalYearMembers.length > 0 && (
            <section className="teams-prefinal-section" aria-labelledby="pre-final-year-heading">
              <h2 id="pre-final-year-heading" className={MAIN_SECTION_HEADING_CLASS}>
                <span className="transition-transform duration-300 group-hover:scale-105">
                  Pre-Final Year
                </span>
                <span className="mt-2 h-1 w-20 rounded-full bg-[#78C8ED] transition-all duration-300 group-hover:w-[70%] sm:mt-3 sm:w-24" />
              </h2>

              <div className="space-y-16">
                {Object.entries(preFinalSubteams).map(([subteamName, subMembers]) => (
                  <div key={subteamName} className="subteam-block">
                    <h3 className={SUB_SECTION_HEADING_CLASS}>
                      <span className="transition-transform duration-300 group-hover:scale-105">
                        {subteamName}
                      </span>
                      <span className="mt-2 h-0.5 w-14 rounded-full bg-[#78C8ED] transition-all duration-300 group-hover:w-[60%]" />
                    </h3>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-8 justify-items-center">
                      {subMembers
                        .sort((a, b) => (a.sequence || 0) - (b.sequence || 0))
                        .map((member) => (
                          <MemberCard key={member._id} member={member} />
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* SECTION 4: SECOND YEAR (4 cards in a row, with dynamic sub-teams if present) */}
          {secondYearMembers.length > 0 && (
            <section className="teams-second-year-section" aria-labelledby="second-year-heading">
              <h2 id="second-year-heading" className={MAIN_SECTION_HEADING_CLASS}>
                <span className="transition-transform duration-300 group-hover:scale-105">
                  Second Year
                </span>
                <span className="mt-2 h-1 w-20 rounded-full bg-[#78C8ED] transition-all duration-300 group-hover:w-[70%] sm:mt-3 sm:w-24" />
              </h2>

              {secondYearHasDistinctSubteams ? (
                <div className="space-y-16">
                  {Object.entries(secondYearSubteams).map(([subteamName, subMembers]) => (
                    <div key={subteamName} className="subteam-block">
                      <h3 className={SUB_SECTION_HEADING_CLASS}>
                        <span className="transition-transform duration-300 group-hover:scale-105">
                          {subteamName}
                        </span>
                        <span className="mt-2 h-0.5 w-14 rounded-full bg-[#78C8ED] transition-all duration-300 group-hover:w-[60%]" />
                      </h3>

                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-8 justify-items-center">
                        {subMembers
                          .sort((a, b) => (a.sequence || 0) - (b.sequence || 0))
                          .map((member) => (
                            <MemberCard key={member._id} member={member} />
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-8 justify-items-center">
                  {secondYearMembers.map((member) => (
                    <MemberCard key={member._id} member={member} />
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </div>

      {!embedded && <ContactFooter />}
    </div>
  );
}
