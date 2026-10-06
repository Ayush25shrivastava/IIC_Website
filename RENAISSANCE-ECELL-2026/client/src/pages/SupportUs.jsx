import React, { useState } from "react";
import {
  Compass,
  Plane,
  BedDouble,
  Gift,
  Sparkles,
  Layers,
  Copy,
  Check,
  QrCode,
  Landmark,
  HeartHandshake,
  Download,
} from "lucide-react";
import ContactFooter from "../components/ContactFooter";
import SocialSideRail from "../components/SocialSideRail";

const BANK_DETAILS = [
  {
    label: "Account Name",
    value: "Institution’s Innovation Council",
    key: "accountName",
  },
  {
    label: "Bank Name",
    value: "SBI",
    key: "bankName",
  },
  {
    label: "Account Number",
    value: "45558684605",
    key: "accountNumber",
    mono: true,
  },
  {
    label: "IFSC Code",
    value: "SBIN0002580",
    key: "ifsc",
    mono: true,
  },
  {
    label: "Branch",
    value: "MLNREC, Allahabad",
    key: "branch",
  },
];

const REASONS_TO_JOIN = [
  {
    id: "01",
    title: "TO INSPIRE THE INNOVATORS OF TOMORROW",
    description:
      "At Renaissance, we celebrate the spirit of creation, innovation, and entrepreneurship. Through a diverse range of events, workshops, and speaker sessions, we aim to ignite ideas that push boundaries and shape the leaders of tomorrow.",
  },
  {
    id: "02",
    title: "A LEGACY OF VISIONARIES",
    description:
      "As alumni, you've been part of a community that thrives on curiosity, ambition, and bold thinking. Renaissance continues that legacy building a culture where ideas turn into action, and dreams transform into ventures. The legacy you leave today becomes the spark that guides the next generation of changemakers.",
  },
  {
    id: "03",
    title: "MORE THAN A FEST — A MOVEMENT",
    description:
      "Renaissance is more than a fest—it's a movement. A platform where ideas grow, collaborations flourish, and innovation finds its voice. As alumni, your experiences, insights, and stories can inspire countless others to dream big, act fearlessly, and shape a future driven by purpose and impact.",
  },
];

const FUND_UTILIZATION = [
  {
    id: "travel",
    title: "TRAVEL EXPENSES",
    icon: Plane,
    description:
      "Covers speaker flights, airport transfers, and local transportation for smooth and timely movement during the event.",
  },
  {
    id: "accommodation",
    title: "ACCOMMODATION AND FOOD",
    icon: BedDouble,
    description:
      "Providing comfortable lodging and quality meals for our speakers and guests to ensure a pleasant and welcoming stay.",
  },
  {
    id: "gifts",
    title: "GIFT HAMPERS & MEMENTOS",
    icon: Gift,
    description:
      "Thoughtful tokens of appreciation for speakers and contributors.",
  },
  {
    id: "decorations",
    title: "DECORATIONS",
    icon: Sparkles,
    description:
      "Creating an inspiring atmosphere in line with the E-Cell spirit, including stage décor, lighting, sound, and projection for a high-quality experience.",
  },
  {
    id: "misc",
    title: "MISCELLANEOUS ARRANGEMENTS",
    icon: Layers,
    description:
      "This includes printing certificates, maintaining the website, designing T-shirts, managing printing costs, creating banners and hoardings, and sending formal invitations.",
  },
];

export default function SupportUs() {
  const [copiedField, setCopiedField] = useState(null);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedField(key);
    setTimeout(() => setCopiedField(null), 1800);
  };

  const handleCopyAllBank = () => {
    const formatted = BANK_DETAILS.map(
      (item) => `${item.label}: ${item.value}`
    ).join("\n");
    navigator.clipboard.writeText(formatted);
    setCopiedField("all");
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-[#DFECEE] via-[#D4E8EA] to-[#C8E1E5] text-[#0C2B3D] selection:bg-[#C5A25F] selection:text-white">
      <SocialSideRail />

      {/* Background Ocean Wash */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[540px] overflow-hidden">
        <img
          src="/bg_images/events.png"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-top opacity-35 select-none"
          draggable="false"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#DFECEE]/55 via-[#DFECEE]/85 to-[#DFECEE]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-6 sm:pt-28 lg:px-8">
        {/* ============================================================
            1. TOP CENTER: QR CODE & BANKING DETAILS
        ============================================================ */}
        <section className="flex flex-col items-center text-center">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#C5A25F]/60 bg-[#F4EBD9]/90 px-3.5 py-1 shadow-sm">
            <HeartHandshake className="h-3.5 w-3.5 text-[#9E6D1F]" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#8A5F1C]">
              Renaissance 10.0 • Official Contribution Portal
            </span>
          </div>

          <h1 className="font-cinzel text-3xl font-black tracking-wide text-[#0C2B3D] sm:text-4xl lg:text-5xl">
            SUPPORT US
          </h1>
          <p className="mt-1.5 max-w-xl font-montserrat text-xs font-semibold text-[#1D4A5E] sm:text-sm">
            Scan the official UPI QR code or transfer via bank account to
            support{" "}
            <span className="font-bold text-[#0C2B3D]">
              Institution’s Innovation Council (E-Cell MNNIT)
            </span>
            .
          </p>

          {/* Centered QR Code Card right at the top */}
          <div className="mt-6 flex flex-col items-center rounded-3xl border-2 border-[#C5A25F]/75 bg-gradient-to-b from-[#F4EBD9] to-[#EDE0C8] p-5 sm:p-6 shadow-[0_16px_45px_rgba(12,43,61,0.16)] w-full max-w-sm">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[#0C2B3D] px-3.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-[#F4EBD9]">
              <QrCode className="h-3.5 w-3.5 text-[#D4AF37]" />
              <span>Scan to Pay via Any UPI App</span>
            </div>

            <div className="flex aspect-square w-56 sm:w-64 items-center justify-center rounded-2xl border-2 border-[#C5A25F]/60 bg-white p-3 shadow-md">
              <img
                src="/support-qr.jpg"
                alt="Institution's Innovation Council Payment QR Code"
                className="h-full w-full object-contain select-none"
              />
            </div>

            <p className="mt-3 font-mono text-xs font-extrabold text-[#0C2B3D]">
              Institution’s Innovation Council
            </p>

            <a
              href="/support-qr.jpg"
              download="IIC-MNNIT-Renaissance-QR.jpg"
              className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[#0C2B3D]/25 bg-white/80 px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#0C2B3D] transition-all hover:bg-[#0C2B3D] hover:text-[#F4EBD9]"
            >
              <Download className="h-3 w-3" />
              <span>Download QR</span>
            </a>
          </div>

          {/* Compact Centered Banking Details Bar */}
          <div className="mt-6 w-full max-w-4xl rounded-3xl border-2 border-[#C5A25F]/65 bg-[#F4EBD9]/95 p-5 sm:p-6 text-left shadow-[0_12px_35px_rgba(12,43,61,0.12)]">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-[#C5A25F]/35 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0C2B3D] text-[#D4AF37]">
                  <Landmark className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="font-cinzel text-base font-black text-[#0C2B3D] sm:text-lg">
                    Banking Details
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyAllBank}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#0C2B3D] px-3.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#F4EBD9] transition-colors hover:bg-[#16435E]"
              >
                {copiedField === "all" ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-[#4ADE80]" />
                    <span>Copied All</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-[#D4AF37]" />
                    <span>Copy All</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {BANK_DETAILS.map((item, idx) => (
                <div
                  key={item.key}
                  className={`flex items-center justify-between gap-2 rounded-xl border border-[#C5A25F]/40 bg-white/85 px-3.5 py-2.5 ${
                    idx === 0 ? "sm:col-span-2 lg:col-span-1" : ""
                  }`}
                >
                  <div className="min-w-0">
                    <span className="block font-mono text-[9px] font-bold uppercase tracking-widest text-[#527486]">
                      {item.label}
                    </span>
                    <span
                      className={`mt-0.5 block truncate text-xs sm:text-sm font-black text-[#0C2B3D] ${
                        item.mono
                          ? "font-mono tracking-wider text-[#8A5F1C]"
                          : "font-montserrat"
                      }`}
                    >
                      {item.value}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(item.value, item.key)}
                    title={`Copy ${item.label}`}
                    className="shrink-0 inline-flex cursor-pointer items-center gap-1 rounded-lg border border-[#0C2B3D]/15 bg-[#F4EBD9]/70 px-2.5 py-1 font-mono text-[10px] font-bold text-[#0C2B3D] transition-colors hover:bg-[#0C2B3D] hover:text-white"
                  >
                    {copiedField === item.key ? (
                      <Check className="h-3 w-3 text-[#16A34A]" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            2. REASONS TO JOIN US! (3-Column Compact Row)
        ============================================================ */}
        <section className="mt-12 sm:mt-14">
          <div className="mb-6 text-center">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#125D73]">
              Why Partner With Renaissance
            </span>
            <h2 className="mt-1 font-cinzel text-2xl font-black tracking-wide text-[#0C2B3D] sm:text-3xl">
              REASONS TO JOIN US!
            </h2>
            <div className="mx-auto mt-2 h-0.5 w-20 rounded-full bg-[#C5A25F]" />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {REASONS_TO_JOIN.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded-2xl border border-[#C5A25F]/55 bg-[#F4EBD9]/90 p-5 shadow-[0_8px_24px_rgba(12,43,61,0.08)]"
              >
                <div>
                  <div className="mb-2.5 flex items-center justify-between gap-2">
                    <span className="rounded-md bg-[#0C2B3D] px-2 py-0.5 font-mono text-[10px] font-bold text-[#D4AF37]">
                      {item.id}
                    </span>
                    <Compass className="h-4 w-4 text-[#9E6D1F]" />
                  </div>
                  <h3 className="font-cinzel text-sm font-black uppercase tracking-wide text-[#0C2B3D] sm:text-base">
                    {item.title}
                  </h3>
                  <p className="mt-2 font-montserrat text-xs leading-relaxed text-[#1D4A5E] sm:text-[13px]">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================
            3. WHERE ARE WE USING THE FUNDS? (Compact 2x2 + 1 Grid)
        ============================================================ */}
        <section className="mt-12 sm:mt-14">
          <div className="mb-6 text-center">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#8A5F1C]">
              Transparent Allocation
            </span>
            <h2 className="mt-1 font-cinzel text-2xl font-black tracking-wide text-[#0C2B3D] sm:text-3xl">
              WHERE ARE WE USING THE FUNDS?
            </h2>
            <div className="mx-auto mt-2 h-0.5 w-20 rounded-full bg-[#C5A25F]" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {FUND_UTILIZATION.slice(0, 4).map((fund) => {
              const Icon = fund.icon;
              return (
                <div
                  key={fund.id}
                  className="flex items-start gap-3.5 rounded-2xl border border-[#7FB6C7]/50 bg-white/80 p-4 sm:p-5 shadow-[0_8px_20px_rgba(12,43,61,0.06)]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#C5A25F]/50 bg-[#F4EBD9] text-[#8A5F1C]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-cinzel text-sm font-black uppercase tracking-wide text-[#0C2B3D] sm:text-base">
                      {fund.title}
                    </h3>
                    <p className="mt-1 font-montserrat text-xs leading-relaxed text-[#1D4A5E] sm:text-[13px]">
                      {fund.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 5th Item Centered Below */}
          {FUND_UTILIZATION.slice(4).map((fund) => {
            const Icon = fund.icon;
            return (
              <div
                key={fund.id}
                className="mx-auto mt-4 flex max-w-xl items-start gap-3.5 rounded-2xl border border-[#7FB6C7]/50 bg-white/80 p-4 sm:p-5 shadow-[0_8px_20px_rgba(12,43,61,0.06)]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#C5A25F]/50 bg-[#F4EBD9] text-[#8A5F1C]">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-cinzel text-sm font-black uppercase tracking-wide text-[#0C2B3D] sm:text-base">
                    {fund.title}
                  </h3>
                  <p className="mt-1 font-montserrat text-xs leading-relaxed text-[#1D4A5E] sm:text-[13px]">
                    {fund.description}
                  </p>
                </div>
              </div>
            );
          })}
        </section>
      </div>

      <ContactFooter />
    </main>
  );
}
