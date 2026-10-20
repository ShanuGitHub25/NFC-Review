import React, { useState } from "react";

interface UseCasesProps {
  onOpenCustomizer: () => void;
  onOpenBulk: () => void;
}

export const UseCases: React.FC<UseCasesProps> = ({ onOpenCustomizer, onOpenBulk }) => {
  const [selectedSector, setSelectedSector] = useState<number>(0);

  const sectors = [
    {
      title: "Restaurants & Cafés",
      tagline: "Presented with the bill or placed on dining tables",
      description:
        "Waitstaff hand the ReviewTap card alongside the bill folder or table receipt. Guests tap their phone on the spot while the warm dining experience is fresh in their minds, avoiding the drop-off of delayed follow-up SMS messages.",
      recommendedHardware: "Table Stand or Matte Pocket Card",
      impactFocus: "Real-time table feedback before customer departs",
    },
    {
      title: "Salons, Spas & Wellness",
      tagline: "Reception checkout counter & styling station mirrors",
      description:
        "Place an architectural acrylic stand on the reception counter where clients complete payment. A quick tap lets delighted clients mention their stylist or therapist by name on Google Reviews in under 15 seconds.",
      recommendedHardware: "Architectural Acrylic Countertop Stand",
      impactFocus: "Stylist attribution and high local Maps ranking",
    },
    {
      title: "Jewellery & Luxury Boutiques",
      tagline: "VIP client suites and high-value checkout lounges",
      description:
        "Crafted with velvet-touch black PVC and debossed gold foil, our luxury edition matches the refined ambiance of diamond showrooms and haute couture fashion stores without feeling promotional or cheap.",
      recommendedHardware: "Executive Black & Gold Foil Edition",
      impactFocus: "Preserves luxury interior aesthetics while capturing high-intent reviews",
    },
    {
      title: "Healthcare & Dental Clinics",
      tagline: "Front desk billing & appointment scheduling counters",
      description:
        "Patients appreciate clean, contactless touchpoints. A hygienic acrylic display positioned by the discharge desk makes it effortless for patients to commend their doctor or nursing team.",
      recommendedHardware: "Sanitizable Acrylic Stand",
      impactFocus: "Hygienic, zero-touch compliance for medical practices",
    },
    {
      title: "Boutique Hotels & Resorts",
      tagline: "Concierge desk, reception check-in, and poolside bars",
      description:
        "Travelers rely heavily on Google Maps when exploring new cities. Equipping front-desk concierges with NFC cards encourages positive mentions during key moments like check-out or valet pickup.",
      recommendedHardware: "Multi-Store Fleet Pack",
      impactFocus: "International guest capture across multiple languages",
    },
    {
      title: "Agencies & Retail Franchises",
      tagline: "Centralized reputation management for multi-branch brands",
      description:
        "Provide your client branches with unbranded, white-label NFC hardware mapped to branch-specific Google Place IDs. If a branch changes addresses, update destination URLs remotely via the managed redirect dashboard.",
      recommendedHardware: "Agency White-Label 50-Pack",
      impactFocus: "Scalable branch link management and reseller profit margins",
    },
  ];

  const current = sectors[selectedSector];

  return (
    <section id="solutions" className="py-20 sm:py-28 bg-[#F8F6F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left max-w-2xl mb-12">
          <div className="text-xs font-mono font-bold text-[#123B2B] uppercase tracking-wider mb-2">
            Tailored Industry Deployments
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#17191D]">
            Purpose-Built For Every Counter
          </h2>
          <p className="text-sm sm:text-base text-[#17191D]/70 mt-2">
            Explore how different hospitality, retail, and wellness businesses integrate contactless ReviewTap cards into their natural customer journey.
          </p>
        </div>

        {/* Sector Tabs + Display Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sector Navigation List (4 cols) */}
          <div className="lg:col-span-4 space-y-2">
            {sectors.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedSector(idx)}
                className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedSector === idx
                    ? "bg-white border-[#123B2B] ring-2 ring-[#123B2B]/20 shadow-xs"
                    : "bg-white/60 border-black/10 hover:bg-white text-[#17191D]/80"
                }`}
              >
                <div className="font-bold text-sm text-[#17191D]">{s.title}</div>
                <div className="text-xs text-[#17191D]/60 truncate mt-0.5">{s.tagline}</div>
              </button>
            ))}
          </div>

          {/* Active Sector Showcase (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-black/10 p-8 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-mono font-bold text-[#123B2B] uppercase">
                Sector Strategy
              </span>
              <h3 className="text-2xl font-black text-[#17191D] mt-1">{current.title}</h3>
              <p className="text-sm font-semibold text-[#17191D]/80 mt-1">{current.tagline}</p>
            </div>

            <p className="text-sm sm:text-base text-[#17191D]/75 leading-relaxed">
              {current.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-black/10 text-xs">
              <div className="p-3 bg-neutral-50 rounded-xl border border-black/5">
                <span className="font-mono text-neutral-400 block mb-1">Recommended Hardware</span>
                <span className="font-bold text-[#17191D]">{current.recommendedHardware}</span>
              </div>
              <div className="p-3 bg-neutral-50 rounded-xl border border-black/5">
                <span className="font-mono text-neutral-400 block mb-1">Core Commercial Objective</span>
                <span className="font-bold text-[#123B2B]">{current.impactFocus}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={onOpenCustomizer}
                className="px-5 py-2.5 text-xs font-bold text-white bg-[#123B2B] hover:bg-[#0c281d] rounded-xl transition-colors cursor-pointer"
              >
                Design for {current.title.split(" ")[0]}
              </button>
              <button
                onClick={onOpenBulk}
                className="px-4 py-2.5 text-xs font-semibold text-[#17191D] hover:bg-black/5 rounded-xl border border-black/15 transition-colors cursor-pointer"
              >
                Request Enterprise Quote
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
