import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ShipWheel } from "lucide-react";
import { SPONSOR_STREAM_ITEMS } from "../data/sponsorsData";
import SponsorVoyageScene from "./SponsorVoyageScene";

const CARD_SLOTS = ["left", "center", "right"];

function LighthouseCoast() {
  return (
    <div className="sponsor-coast" aria-hidden="true">
      <div className="sponsor-lighthouse">
        <div className="sponsor-lighthouse__beam" />
        <div className="sponsor-lighthouse__roof" />

        <div className="sponsor-lighthouse__lamp">
          <span />
        </div>

        <div className="sponsor-lighthouse__neck" />
        <div className="sponsor-lighthouse__tower" />
        <div className="sponsor-lighthouse__base" />
      </div>
    </div>
  );
}

const CLOUD_PUFFS = [
  { cx: 82, cy: 111, rx: 62, ry: 36, tone: "shade" },
  { cx: 126, cy: 82, rx: 70, ry: 53, tone: "mid" },
  { cx: 176, cy: 66, rx: 82, ry: 61, tone: "light" },
  { cx: 228, cy: 55, rx: 78, ry: 55, tone: "light" },
  { cx: 280, cy: 73, rx: 78, ry: 54, tone: "mid" },
  { cx: 333, cy: 91, rx: 71, ry: 43, tone: "mid" },
  { cx: 373, cy: 117, rx: 52, ry: 31, tone: "shade" },
  { cx: 221, cy: 103, rx: 124, ry: 55, tone: "mid" },
  { cx: 155, cy: 119, rx: 92, ry: 42, tone: "shade" },
  { cx: 303, cy: 120, rx: 96, ry: 40, tone: "shade" },
];

function StormClouds() {
  const clouds = [
    {
      slot: "left",
      x: 70,
      y: 56,
      width: 440,
      height: 170,
    },
    {
      slot: "center",
      x: 560,
      y: 18,
      width: 500,
      height: 190,
    },
    {
      slot: "right",
      x: 1130,
      y: 62,
      width: 410,
      height: 162,
    },
  ];

  return (
    <div className="sponsor-storm" aria-hidden="true">
      <svg
        className="sponsor-storm__svg"
        viewBox="0 0 1600 240"
        preserveAspectRatio="none"
      >
        <defs>
          <radialGradient
            id="stormPuffLight"
            cx="38%"
            cy="28%"
            r="74%"
          >
            <stop
              offset="0"
              stopColor="#ffffff"
              stopOpacity="0.98"
            />

            <stop
              offset="0.38"
              stopColor="#f3f7fa"
              stopOpacity="0.96"
            />

            <stop
              offset="0.74"
              stopColor="#cfdbe3"
              stopOpacity="0.9"
            />

            <stop
              offset="1"
              stopColor="#8799a7"
              stopOpacity="0.74"
            />
          </radialGradient>

          <radialGradient
            id="stormPuffMid"
            cx="42%"
            cy="30%"
            r="78%"
          >
            <stop
              offset="0"
              stopColor="#edf3f7"
              stopOpacity="0.95"
            />

            <stop
              offset="0.56"
              stopColor="#c7d3dc"
              stopOpacity="0.9"
            />

            <stop
              offset="1"
              stopColor="#667887"
              stopOpacity="0.76"
            />
          </radialGradient>

          <radialGradient
            id="stormPuffShade"
            cx="44%"
            cy="22%"
            r="82%"
          >
            <stop
              offset="0"
              stopColor="#cfd9e0"
              stopOpacity="0.88"
            />

            <stop
              offset="0.58"
              stopColor="#8b9ca8"
              stopOpacity="0.82"
            />

            <stop
              offset="1"
              stopColor="#3a4d5b"
              stopOpacity="0.76"
            />
          </radialGradient>

          <linearGradient
            id="stormCloudUnder"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0"
              stopColor="#95a8b5"
              stopOpacity="0.72"
            />

            <stop
              offset="0.55"
              stopColor="#526675"
              stopOpacity="0.78"
            />

            <stop
              offset="1"
              stopColor="#243744"
              stopOpacity="0.88"
            />
          </linearGradient>

          <radialGradient
            id="stormCloudMist"
            cx="50%"
            cy="45%"
            r="58%"
          >
            <stop
              offset="0"
              stopColor="#eaf5fb"
              stopOpacity="0.48"
            />

            <stop
              offset="1"
              stopColor="#b6cad5"
              stopOpacity="0"
            />
          </radialGradient>

          <filter
            id="stormLightningGlow"
            x="-180%"
            y="-40%"
            width="460%"
            height="220%"
          >
            <feGaussianBlur
              stdDeviation="2.2"
              result="blur"
            />

            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter
            id="stormFlashBlur"
            x="-80%"
            y="-100%"
            width="260%"
            height="300%"
          >
            <feGaussianBlur stdDeviation="18" />
          </filter>
        </defs>

        {clouds.map((cloud) => (
          <svg
            key={cloud.slot}
            className={`storm-cloud storm-cloud--${cloud.slot}`}
            x={cloud.x}
            y={cloud.y}
            width={cloud.width}
            height={cloud.height}
            viewBox="0 0 440 180"
            overflow="visible"
          >
            <ellipse
              className="storm-cloud__flash"
              cx="222"
              cy="107"
              rx="126"
              ry="55"
              fill="#dff4ff"
              filter="url(#stormFlashBlur)"
            />

            <ellipse
              className="storm-cloud__flash storm-cloud__flash--secondary"
              cx="302"
              cy="116"
              rx="92"
              ry="43"
              fill="#eef9ff"
              filter="url(#stormFlashBlur)"
            />

            <g className="storm-cloud__mass">
              <ellipse
                className="storm-cloud__mist"
                cx="220"
                cy="98"
                rx="205"
                ry="78"
                fill="url(#stormCloudMist)"
              />

              {CLOUD_PUFFS.map((puff, index) => (
                <ellipse
                  key={`${cloud.slot}-puff-${index}`}
                  className={`storm-cloud__puff storm-cloud__puff--${puff.tone}`}
                  cx={puff.cx}
                  cy={puff.cy}
                  rx={puff.rx}
                  ry={puff.ry}
                  fill={`url(#stormPuff${puff.tone === "light"
                      ? "Light"
                      : puff.tone === "mid"
                        ? "Mid"
                        : "Shade"
                    })`}
                />
              ))}

              <path
                className="storm-cloud__underside"
                fill="url(#stormCloudUnder)"
                d="M38 124 C78 111 119 115 155 126 C194 113 245 115 283 129 C322 114 369 116 405 130 C395 151 357 160 320 153 C283 166 243 159 208 157 C166 165 124 159 90 154 C64 155 44 145 38 124 Z"
              />

              <ellipse
                className="storm-cloud__silver-lining"
                cx="215"
                cy="83"
                rx="166"
                ry="63"
              />
            </g>

            <path
              className="storm-lightning storm-lightning--main"
              d="M228 138 L218 153 L226 159 L211 174 L218 181 L196 207 L203 183 L194 176 L207 160 L200 154 L215 138"
              filter="url(#stormLightningGlow)"
            />

            <path
              className="storm-lightning storm-lightning--branch storm-lightning--branch-left"
              d="M208 160 L192 170 L181 188"
              filter="url(#stormLightningGlow)"
            />

            <path
              className="storm-lightning storm-lightning--branch storm-lightning--branch-right"
              d="M214 174 L231 184 L240 199"
              filter="url(#stormLightningGlow)"
            />

            <path
              className="storm-lightning storm-lightning--secondary"
              d="M314 137 L301 154 L309 162 L293 177 L299 185 L279 207 L286 185 L277 177 L292 161 L285 154 L302 137"
              filter="url(#stormLightningGlow)"
            />

            <path
              className="storm-lightning storm-lightning--secondary-branch"
              d="M296 162 L316 174 L327 192 M292 177 L274 188 L265 202"
              filter="url(#stormLightningGlow)"
            />

            <g className="storm-cloud__rain">
              <path d="M128 149 L116 172" />
              <path d="M158 153 L146 178" />
              <path d="M292 150 L279 176" />
              <path d="M323 146 L312 169" />
            </g>
          </svg>
        ))}
      </svg>
    </div>
  );
}

function SponsorCard({ sponsor, slot }) {
  return (
    <article
      className={`voyage-sponsor-card voyage-sponsor-card--${slot}`}
    >
      <div className="voyage-sponsor-card__inner">
        <div className="voyage-sponsor-card__logo">
          <div className="flex items-center justify-center w-full h-full text-5xl font-cinzel font-bold text-[#0C2B3D]/70">{sponsor.number}</div>
        </div>

        <div className="voyage-sponsor-card__copy">
          <h3>{sponsor.name}</h3>
          <p>{sponsor.tier}</p>
        </div>
      </div>
    </article>
  );
}

export default function SponsorStream() {
  const [startIndex, setStartIndex] = useState(3);

  const [fleetTransition, setFleetTransition] = useState({
    key: 0,
    direction: 0,
    active: false,
  });

  const timersRef = useRef([]);

  const sponsorCount = SPONSOR_STREAM_ITEMS.length;

  const visibleSponsors = useMemo(
    () =>
      CARD_SLOTS.map(
        (_, slotIndex) =>
          SPONSOR_STREAM_ITEMS[
          (startIndex + slotIndex) % sponsorCount
          ],
      ),
    [startIndex, sponsorCount],
  );

  useEffect(
    () => () => {
      timersRef.current.forEach((timer) =>
        window.clearTimeout(timer),
      );

      timersRef.current = [];
    },
    [],
  );

  const shift = (step) => {
    if (fleetTransition.active || sponsorCount === 0) {
      return;
    }

    const direction = Math.sign(step) || 1;

    const changeBy = direction * 3;

    setFleetTransition((current) => ({
      key: current.key + 1,
      direction,
      active: true,
    }));

    /*
     * Swap the sponsor data while the cards and fleet are
     * around the midpoint of the animation. This keeps the
     * sponsor cards and ships feeling like one carousel
     * instead of teleporting independently.
     */
    timersRef.current.push(
      window.setTimeout(() => {
        setStartIndex(
          (current) =>
            (current + changeBy + sponsorCount) %
            sponsorCount,
        );
      }, 470),
    );

    timersRef.current.push(
      window.setTimeout(() => {
        setFleetTransition((current) => ({
          ...current,
          active: false,
        }));
      }, 1180),
    );
  };

  if (sponsorCount === 0) {
    return null;
  }

  return (
    <section
      className={`sponsor-voyage ${fleetTransition.active
          ? `sponsor-voyage--fleet-${fleetTransition.direction > 0
            ? "next"
            : "prev"
          }`
          : ""
        }`}
      aria-labelledby="sponsor-voyage-title"
    >
      <div
        className="sponsor-voyage__stars sponsor-voyage__stars--one"
        aria-hidden="true"
      />

      <div
        className="sponsor-voyage__stars sponsor-voyage__stars--two"
        aria-hidden="true"
      />

      <div
        className="sponsor-voyage__nebula"
        aria-hidden="true"
      />

      <div
        className="sponsor-voyage__compass"
        aria-hidden="true"
      >
        <span className="compass-n">N</span>
        <span className="compass-e">E</span>
        <span className="compass-s">S</span>
        <span className="compass-w">W</span>

        <div className="sponsor-voyage__compass-rose" />
      </div>

      <div
        className="sponsor-voyage__motto"
        aria-hidden="true"
      >
        <span>IDEAS</span>
        <span>PEOPLE</span>
        <span>CULTURE</span>
        <span>BEYOND</span>
        <span>TOMORROW</span>
      </div>

      <div
        className="sponsor-voyage__quote"
        aria-hidden="true"
      >
        “Different
        <br />
        Minds
        <br />
        A Brighter
        <br />
        Tomorrow”
      </div>

      <header className="sponsor-voyage__heading">
        <h1 id="sponsor-voyage-title">
          OUR SPONSORS
        </h1>

        <div
          className="sponsor-voyage__title-rule"
          aria-hidden="true"
        >
          <span />

          <ShipWheel
            size={30}
            strokeWidth={1.55}
          />

          <span />
        </div>

        <p>
          Sponsors and partners powering Renaissance 2026
        </p>
      </header>

      <div
        className="sponsor-voyage__subheading"
        aria-hidden="true"
      >
        <span />

        <strong>
          SAILING WITH THE VOYAGE
        </strong>

        <span />
      </div>

      <StormClouds />

      <LighthouseCoast />

      <div className="sponsor-voyage__ocean">
        <div
          className="sponsor-voyage__horizon-glow"
          aria-hidden="true"
        />

        <SponsorVoyageScene
          transitionKey={fleetTransition.key}
          transitionDirection={
            fleetTransition.direction
          }
        />

        {/*
          Extra foam bands sit over the WebGL sea.
          This creates crisp layered white crests
          and blue translucency over the ocean.
        */}

        <div
          className="sponsor-foam sponsor-foam--far"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 1600 220"
            preserveAspectRatio="none"
          >
            <path d="M0 112 C120 74 230 156 360 110 S620 76 780 118 S1040 82 1180 112 S1420 152 1600 106" />
          </svg>
        </div>

        <div
          className="sponsor-foam sponsor-foam--near"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 1600 250"
            preserveAspectRatio="none"
          >
            <path d="M0 154 C130 100 245 210 390 145 S690 99 825 160 S1090 108 1230 155 S1485 202 1600 145" />
          </svg>
        </div>

        <div
          className="ship-glow ship-glow--left"
          aria-hidden="true"
        />

        <div
          className="ship-glow ship-glow--center"
          aria-hidden="true"
        />

        <div
          className="ship-glow ship-glow--right"
          aria-hidden="true"
        />

        <svg
          className="sponsor-voyage__route"
          viewBox="0 0 1600 160"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M42 93 C176 48 300 133 430 90 S690 47 820 96 S1080 48 1210 91 S1462 127 1562 82" />
        </svg>
      </div>

      <div
        className={`sponsor-voyage__cards ${fleetTransition.active
            ? `sponsor-voyage__cards--sailing-${fleetTransition.direction > 0
              ? "next"
              : "prev"
            }`
            : ""
          }`}
      >
        {visibleSponsors.map(
          (sponsor, index) => (
            <SponsorCard
              key={`${sponsor.name}-${startIndex}-${index}`}
              sponsor={sponsor}
              slot={CARD_SLOTS[index]}
            />
          ),
        )}
      </div>

      <button
        type="button"
        className="sponsor-voyage__arrow sponsor-voyage__arrow--left"
        onClick={() => shift(-3)}
        disabled={fleetTransition.active}
        aria-label="Show previous sponsors"
      >
        <ChevronLeft
          size={34}
          strokeWidth={1.8}
        />
      </button>

      <button
        type="button"
        className="sponsor-voyage__arrow sponsor-voyage__arrow--right"
        onClick={() => shift(3)}
        disabled={fleetTransition.active}
        aria-label="Show next sponsors"
      >
        <ChevronRight
          size={34}
          strokeWidth={1.8}
        />
      </button>

      <a
        href="#sponsor-tiers"
        className="sponsor-voyage__cta"
      >
        <span>
          VIEW FULL SPONSOR TIERS
        </span>

        <span aria-hidden="true">
          →
        </span>
      </a>
    </section>
  );
}