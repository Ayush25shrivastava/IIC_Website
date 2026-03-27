import React, { useState, useEffect } from "react";
import { FaLinkedin, FaInstagram } from "react-icons/fa";

const IICFooter = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isContactOpen ? "hidden" : "unset";
  }, [isContactOpen]);

  // smooth scroll fix
  const handleAboutClick = (e) => {
    e.preventDefault();
    const section = document.getElementById("aboutus"); // ✅ changed

    if (section) {
        section.scrollIntoView({ behavior: "smooth" });
    } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
    };

  return (
    <section className="relative bg-[#e8ecef] text-[#1a1f24] pt-20 pb-10 overflow-hidden border-t border-[#c8bfb0]">

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        {/* Top Row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-10 mb-14">

          {/* Branding */}
          <div className="text-3xl font-playfair font-black tracking-wide text-[#1a1f24]">
            IIC MNNIT
          </div>

          {/* Links */}
          <nav className="flex gap-10 text-sm uppercase tracking-widest font-merriweather text-[#1a1f24]/70">
            <a onClick={handleAboutClick} className="hover:text-[#b8a18a] cursor-pointer transition">
              About Us
            </a>

            <button
              onClick={() => setIsContactOpen(true)}
              className="hover:text-[#b8a18a] transition"
            >
              Contact Us
            </button>
          </nav>
        </div>

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-t border-[#c8bfb0] pt-8">

          <div className="text-xs text-[#1a1f24]/60 font-merriweather">
            © 2026 IIC MNNIT. All Rights Reserved.
          </div>

          <div className="flex gap-6">
            <a
              href="https://www.linkedin.com/company/iicmnnitallahabad/posts/?feedView=all"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl text-[#1a1f24] hover:text-[#0077b5] transition bg-white/60 p-2 rounded-full border border-[#c8bfb0]"
            >
              <FaLinkedin />
            </a>

            <a
              href="https://www.instagram.com/iic_mnnit/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl text-[#1a1f24] hover:text-[#E4405F] transition bg-white/60 p-2 rounded-full border border-[#c8bfb0]"
            >
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      {/* FULL WATERMARK */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h1 className="text-[20vw] md:text-[15vw] font-black text-[#1a1f24] opacity-[0.06] tracking-tighter font-playfair uppercase">
          IIC
        </h1>
      </div>

      {/* CONTACT MODAL (MATCHED STYLE) */}
      {isContactOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1a1f24]/70 backdrop-blur-md"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsContactOpen(false);
          }}
        >
          <div className="w-full max-w-xl bg-[#fdfbf7] border border-[#d1ccc0] rounded-[2rem] shadow-[20px_20px_50px_rgba(0,0,0,0.15)] overflow-hidden">

            {/* Header */}
            <div className="p-6 border-b border-[#d1ccc0] flex justify-between items-center">
              <h2 className="text-2xl md:text-3xl font-playfair font-black text-[#0E0E0E]">
                Contact Us
              </h2>
              <button
                onClick={() => setIsContactOpen(false)}
                className="text-3xl text-[#0E0E0E]/70 hover:text-[#0E0E0E]"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="p-8 space-y-8 font-merriweather text-[#0E0E0E]">

              <div className="p-6 bg-white border border-[#d1ccc0] rounded-xl shadow-sm">
                <h4 className="font-playfair font-bold text-lg mb-2">
                  Address
                </h4>
                <p className="text-sm text-[#0E0E0E]/70 leading-relaxed">
                  Institution's Innovation Council<br />
                  Motilal Nehru National Institute of Technology<br />
                  Prayagraj - 211004, India
                </p>
              </div>

              <div className="p-6 bg-white border border-[#d1ccc0] rounded-xl shadow-sm">
                <h4 className="font-playfair font-bold text-lg mb-2">
                  Email
                </h4>
                <a
                  href="mailto:iic@mnnit.ac.in"
                  className="text-[#0E0E0E] hover:text-[#b8a18a] underline"
                >
                  iic@mnnit.ac.in
                </a>
              </div>

            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default IICFooter;