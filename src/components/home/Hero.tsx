import React, { useState } from "react";
import { CardPreview } from "../customizer/CardPreview";
import { CardDesignConfig, CardTemplateId } from "../../types";
import { TEMPLATE_PRESETS } from "../../data/products";

interface HeroProps {
  onOpenCustomizer: () => void;
  onExploreCollection: () => void;
  onOpenBulk: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenCustomizer,
  onExploreCollection,
  onOpenBulk,
}) => {
  const [activePreset, setActivePreset] = useState<CardTemplateId>("cream-forest");
  const [isTapping, setIsTapping] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [showReviewPopup, setShowReviewPopup] = useState(false);

  const preset = TEMPLATE_PRESETS[activePreset];

  const heroCardConfig: CardDesignConfig = {
    templateId: activePreset,
    shape: "standard-card",
    themeMode: preset.themeMode,
    primaryColor: preset.primaryColor,
    secondaryColor: preset.secondaryColor,
    textColor: preset.textColor,
    accentColor: preset.accentColor,
    fontFamily: preset.fontFamily,
    businessName: "The Roast Room",
    tagline: "Your Feedback Makes Us Better.",
    subText: "Tap with your phone or scan to review",
    googleReviewUrl: "https://g.page/r/the-roast-room",
    logoScale: 1,
    qrStyle: "classic",
    enableNfc: true,
    enableQr: true,
    showGoogleLogo: true,
    showRatingStars: true,
    starRating: 5,
  };

  const handleSimulateTap = () => {
    setIsTapping(true);
    setTimeout(() => {
      setIsTapping(false);
      setShowReviewPopup(true);
      setTimeout(() => setShowReviewPopup(false), 4500);
    }, 1200);
  };

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setShowReviewPopup(true);
      setTimeout(() => setShowReviewPopup(false), 4500);
    }, 1200);
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28">
      {/* Background Architectural Studio Geometry */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute -top-32 right-0 w-[600px] h-[600px] bg-[#123B2B]/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-32 w-[500px] h-[500px] bg-[#2864F0]/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Actions (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Quiet 1-line kicker (no pills) */}
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#123B2B]">
              <span>Next-Gen Customer Reputation</span>
              <span aria-hidden="true">·</span>
              <span>NTAG213 Microchip + Dynamic QR</span>
            </div>

            {/* Oversized Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#17191D] leading-[1.08] [text-wrap:balance]">
              Make Every Review Effortless.
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-[#17191D]/80 max-w-xl leading-relaxed">
              Premium NFC + QR review cards custom-designed around your brand. One simple tap or scan takes customers directly to your official Google Review page in seconds. No apps, no typing.
            </p>

            {/* Action Cluster */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={onOpenCustomizer}
                className="px-6 py-3.5 text-sm font-bold text-white bg-[#123B2B] hover:bg-[#0c281d] rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Design Your Card</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>

              <button
                onClick={onExploreCollection}
                className="px-5 py-3.5 text-sm font-semibold text-[#17191D] bg-white border border-black/15 hover:border-black/30 rounded-xl transition-colors flex items-center justify-center cursor-pointer shadow-xs"
              >
                Explore Collection
              </button>

              <button
                onClick={onOpenBulk}
                className="px-5 py-3.5 text-sm font-semibold text-[#2864F0] hover:text-[#122A5E] hover:bg-[#2864F0]/5 rounded-xl transition-colors flex items-center justify-center cursor-pointer"
              >
                Get a Bulk Quote →
              </button>
            </div>

            {/* Live Interactive Finish Selector */}
            <div className="pt-6 border-t border-black/10">
              <span className="block text-xs font-bold text-[#17191D]/70 mb-2.5">
                Preview Finish & Palette Live:
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { id: "cream-forest" as CardTemplateId, label: "Ivory & Forest" },
                  { id: "black-gold" as CardTemplateId, label: "Matte Black & Gold" },
                  { id: "lavender-luxury" as CardTemplateId, label: "Lavender Luxury" },
                  { id: "sky-blue" as CardTemplateId, label: "Sky Cobalt" },
                  { id: "mint-fresh" as CardTemplateId, label: "Mint Fresh" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActivePreset(item.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                      activePreset === item.id
                        ? "border-[#123B2B] bg-[#123B2B] text-white shadow-xs"
                        : "border-black/10 bg-white/70 text-[#17191D]/80 hover:border-black/30"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Floating Studio Showcase & Live Interaction (5 cols) */}
          <div className="lg:col-span-5 relative flex flex-col items-center">
            {/* Live Interactive Floating Card */}
            <div className="relative w-full max-w-[420px] mx-auto">
              <CardPreview
                config={heroCardConfig}
                interactiveTilt={true}
                showNfcAnimation={isTapping}
                showScanAnimation={isScanning}
              />

              {/* Simulated Phone in NFC Approach */}
              {isTapping && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-32 bg-[#17191D] rounded-2xl border-2 border-white/20 shadow-2xl p-3 flex flex-col justify-between text-white animate-bounce pointer-events-none z-30">
                  <div className="w-10 h-1 bg-white/40 rounded-full mx-auto" />
                  <div className="text-center">
                    <p className="text-[11px] font-bold">Hold near top of card</p>
                    <p className="text-[9px] text-white/60">Reading NFC Tag...</p>
                  </div>
                  <div className="w-4 h-4 rounded-full border border-white/20 mx-auto" />
                </div>
              )}

              {/* Instant Customer Review Modal (Simulating phone popup on tap or scan) */}
              {showReviewPopup && (
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-80 bg-white rounded-2xl shadow-2xl border border-black/15 p-4 z-40 animate-fade-in text-[#17191D]">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#4285F4] text-white flex items-center justify-center font-bold text-xs">
                        G
                      </div>
                      <div>
                        <h4 className="text-xs font-bold">The Roast Room</h4>
                        <p className="text-[10px] text-neutral-500">Google Business Profile</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-medium">
                      Direct Link
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-neutral-100">
                    <p className="text-[11px] font-semibold text-neutral-700">Rate and review</p>
                    <div className="flex gap-1 text-[#FBBC05] my-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <svg key={s} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-[10px] text-neutral-500">
                      "Share details of your own experience at this place"
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Interactive Simulation Controls */}
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={handleSimulateTap}
                className="px-3 py-1.5 bg-white border border-black/15 hover:border-black/30 rounded-xl text-xs font-semibold text-[#17191D] transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 text-[#2864F0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Tap Phone
              </button>
              <button
                onClick={handleSimulateScan}
                className="px-3 py-1.5 bg-white border border-black/15 hover:border-black/30 rounded-xl text-xs font-semibold text-[#17191D] transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 text-[#7556E8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M4 8h16" />
                </svg>
                Scan QR
              </button>
            </div>
            <span className="text-[11px] text-[#17191D]/50 mt-1">
              Test the real dual-channel customer flow
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
