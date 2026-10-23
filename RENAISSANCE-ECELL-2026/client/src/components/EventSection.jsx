import React from "react";
import { useNavigate } from "react-router-dom";
import { EVENTS_DATA } from "../data/eventsData";
import WaterButton from "./WaterButton";

export default function EventSection() {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-6 bg-[#070E1A] border-t border-[#C5A25F]/15">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#F4EBD9] mb-3">
            Events & Competitions
          </h2>
          <div className="w-16 h-[2px] bg-[#C5A25F] mx-auto mb-4" />
          <p className="font-montserrat text-xs sm:text-sm text-[#94A3B8]">
            Explore summit challenges and competitive dockets.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {EVENTS_DATA.map((event) => (
            <div
              key={event.id}
              className="p-6 rounded-2xl bg-[#0A192F]/60 border border-[#C5A25F]/20 flex flex-col justify-between hover:border-[#C5A25F]/40 transition-colors"
            >
              <div>
                <span className="text-[10px] font-mono uppercase text-[#0EA5E9] font-bold block mb-2">
                  {event.category} • {event.eventType}
                </span>
                <h3 className="font-cinzel text-lg font-bold text-[#F4EBD9] mb-2">
                  {event.name}
                </h3>
                <p className="font-montserrat text-xs text-[#94A3B8] line-clamp-3 mb-6 font-light">
                  {event.description}
                </p>
              </div>

              <div className="flex items-center gap-2 mt-auto">
                <WaterButton
                  onClick={() =>
                    event.registrationUrl
                      ? window.open(event.registrationUrl, "_blank", "noopener,noreferrer")
                      : navigate(`/events/${event.id}/register`)
                  }
                  variant="primary"
                  className="flex-1 !px-3 !py-2.5 text-[11px]"
                >
                  Register
                </WaterButton>
                <a
                  href={event.rulebookUrl || "https://drive.google.com/file/d/1GKo2utmVtmqG4AAFaZkUpYblXxmvERii/view?usp=sharing"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2.5 rounded-full border border-[#C5A25F]/40 bg-[#0A192F]/80 hover:bg-[#C5A25F]/20 text-[#F4EBD9] font-mono text-[10px] uppercase font-bold tracking-wider transition-colors text-center shadow-sm"
                >
                  Rulebook
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <WaterButton
            to="/events"
            variant="secondary"
            className="!px-8 !py-3 text-xs"
          >
            View All Events ➔
          </WaterButton>
        </div>
      </div>
    </section>
  );
}
