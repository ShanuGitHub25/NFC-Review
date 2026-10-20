import React from "react";
import { BulkFleetScene3D } from "../three/BulkFleetScene3D";

interface BulkSpotlightProps {
  onOpenBulk: () => void;
}

export const BulkSpotlight: React.FC<BulkSpotlightProps> = ({ onOpenBulk }) => {
  return (
    <section className="py-24 bg-[#111114] text-white overflow-hidden relative border-t border-white/10 select-none">
      {/* Subtle Studio Lighting Backdrops */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#2864FF] rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-[#FFD447] rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
            Enterprise Fleet & Multi-Location Hardware
          </div>
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight leading-[0.95] [text-wrap:balance]">
            ONE BRAND.
            <br />
            <span className="text-neutral-400 font-serif font-normal italic">
              EVERY COUNTER.
            </span>
          </h2>
          <p className="text-neutral-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Equip 10 to 500+ locations with unified brand aesthetics, branch-specific Google Review destinations, and centralized redirect routing.
          </p>
        </div>

        {/* 3D Multi-Card Spatial Fleet */}
        <div className="w-full">
          <BulkFleetScene3D onOpenBulkForm={onOpenBulk} />
        </div>

        {/* B2B Value Pillars & Quote Action */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-left max-w-4xl mx-auto pt-4">
          <div className="border border-white/10 rounded-2xl p-5 bg-white/5 backdrop-blur-md space-y-1.5">
            <span className="font-mono text-emerald-400 block font-bold">01 / Volume Tiers</span>
            <h4 className="font-bold text-sm text-white">Up to 40% Volume Rebate</h4>
            <p className="text-neutral-400">
              Configured volume-based tiers for retail chains, franchises, and agency reseller networks.
            </p>
          </div>

          <div className="border border-white/10 rounded-2xl p-5 bg-white/5 backdrop-blur-md space-y-1.5">
            <span className="font-mono text-[#8EDBFF] block font-bold">02 / Dynamic Routing</span>
            <h4 className="font-bold text-sm text-white">Unique Branch URLs</h4>
            <p className="text-neutral-400">
              Each card points to its dedicated Google Business Profile via automated ReviewTap /r/ shortlinks.
            </p>
          </div>

          <div className="border border-white/10 rounded-2xl p-5 bg-white/5 backdrop-blur-md space-y-1.5">
            <span className="font-mono text-[#A88BFF] block font-bold">03 / White-Label</span>
            <h4 className="font-bold text-sm text-white">Agency Packaging</h4>
            <p className="text-neutral-400">
              Unbranded client sleeves and batch CSV link programming direct to your end-clients.
            </p>
          </div>
        </div>

        <div className="text-center pt-2">
          <button
            onClick={onOpenBulk}
            className="px-8 py-4 bg-white text-[#111114] hover:bg-neutral-200 font-black text-xs uppercase tracking-wider rounded-xl shadow-xl transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <span>LAUNCH BULK FLEET PORTAL</span>
            <span className="text-sm">→</span>
          </button>
        </div>
      </div>
    </section>
  );
};
