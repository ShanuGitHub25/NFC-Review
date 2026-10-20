import React, { useEffect, useRef, useState } from "react";
import { Scene3DManager } from "../../three/Scene3DManager";
import { CardDesignConfig, CardTemplateId } from "../../types";
import { TEMPLATE_PRESETS } from "../../data/products";
import { CardPreview } from "../customizer/CardPreview";

interface HeroScene3DProps {
  onOpenCustomizer: () => void;
  onExploreCollection: () => void;
  onOpenBulk: () => void;
}

export const HeroScene3D: React.FC<HeroScene3DProps> = ({
  onOpenCustomizer,
  onExploreCollection,
  onOpenBulk,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const managerRef = useRef<Scene3DManager | null>(null);
  const [activePreset, setActivePreset] = useState<CardTemplateId>("cream-forest");
  const [webGlSupported, setWebGlSupported] = useState(true);
  const [isShowingBack, setIsShowingBack] = useState(false);
  const [isNfcPulsing, setIsNfcPulsing] = useState(false);
  const [showReviewPopup, setShowReviewPopup] = useState(false);

  const preset = TEMPLATE_PRESETS[activePreset];

  const heroConfig: CardDesignConfig = {
    templateId: activePreset,
    shape: "standard-card",
    themeMode: preset.themeMode,
    primaryColor: preset.primaryColor,
    secondaryColor: preset.secondaryColor,
    textColor: preset.textColor,
    accentColor: preset.accentColor,
    fontFamily: preset.fontFamily,
    businessName: "Aori Botanicals",
    tagline: "Your Feedback Makes Us Better.",
    subText: "Tap with your phone or scan to review",
    googleReviewUrl: "https://g.page/r/aori-botanicals",
    logoScale: 1,
    qrStyle: "classic",
    enableNfc: true,
    enableQr: true,
    showGoogleLogo: true,
    showRatingStars: true,
    starRating: 5,
  };

  // Mount Three.js Scene
  useEffect(() => {
    if (!mountRef.current) return;

    try {
      // Check WebGL availability
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        setWebGlSupported(false);
        return;
      }

      const mgr = new Scene3DManager({
        container: mountRef.current,
        initialConfig: heroConfig,
        enablePointerTilt: true,
        enableAutoRotate: false,
        cameraZ: 4.8,
      });

      managerRef.current = mgr;

      return () => {
        mgr.dispose();
        managerRef.current = null;
      };
    } catch (e) {
      console.warn("WebGL initialization failed, falling back to 2D vector preview", e);
      setWebGlSupported(false);
    }
  }, []);

  // Update 3D card whenever template changes
  useEffect(() => {
    if (managerRef.current && managerRef.current.card) {
      managerRef.current.card.updateDesign(heroConfig);
    }
  }, [activePreset]);

  // Rotate to inspect back / front
  const toggleFlipCard = () => {
    if (!managerRef.current) return;
    const nextIsBack = !isShowingBack;
    setIsShowingBack(nextIsBack);
    if (nextIsBack) {
      managerRef.current.setRotation(0.15, Math.PI - 0.25, 0);
    } else {
      managerRef.current.setRotation(0.1, -0.25, 0.05);
    }
  };

  // Trigger NFC pulse in 3D
  const handleNfcTap = () => {
    setIsNfcPulsing(true);
    if (managerRef.current?.card) {
      managerRef.current.card.triggerNfcPulse();
    }
    setTimeout(() => {
      setIsNfcPulsing(false);
      setShowReviewPopup(true);
      setTimeout(() => setShowReviewPopup(false), 4500);
    }, 1100);
  };

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden bg-[#F7F4ED] text-[#111114] pt-8 pb-12 sm:pt-12 sm:pb-16 select-none">
      {/* Background Architectural Canvas Accents */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 -right-20 w-[550px] h-[550px] bg-[#A88BFF]/8 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-[600px] h-[600px] bg-[#164C37]/6 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-between">
        {/* Top Kicker */}
        <div className="flex items-center justify-between py-2 text-xs font-mono uppercase tracking-widest text-neutral-500">
          <span>01 / The Physical Feedback Card</span>
          <span>Dual 13.56 MHz NFC + Optical QR</span>
        </div>

        {/* Central Split: Editorial Typography on Left, 3D WebGL Canvas on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto py-4">
          {/* Left: Editorial Typography & Actions (6 cols) */}
          <div className="lg:col-span-6 space-y-6 text-left z-20">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.95] [text-wrap:balance]">
              MAKE EVERY REVIEW
              <br />
              <span className="text-[#164C37] italic font-serif font-normal">AN EXPERIENCE.</span>
            </h1>

            <p className="text-base sm:text-lg text-neutral-700 max-w-lg leading-relaxed font-normal">
              Custom-designed NFC + QR cards that bring your customers one tap closer to sharing their honest feedback. Designed with tactile 0.84mm recycled PVC, high-contrast QR matrices, and precision NTAG microchips.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={onOpenCustomizer}
                className="px-7 py-4 text-xs font-bold uppercase tracking-wider text-white bg-[#111114] hover:bg-[#2864FF] rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>CREATE YOUR CARD</span>
                <span className="text-xs">→</span>
              </button>

              <button
                onClick={onExploreCollection}
                className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#111114] bg-white border border-black/15 hover:border-black/40 rounded-xl transition-colors flex items-center justify-center cursor-pointer shadow-xs"
              >
                EXPLORE THE COLLECTION
              </button>

              <button
                onClick={onOpenBulk}
                className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#164C37] hover:text-[#2864FF] hover:bg-black/5 rounded-xl transition-colors flex items-center justify-center cursor-pointer"
              >
                BULK ORDERS
              </button>
            </div>

            {/* Color Universe Quick-Selector (Updates 3D Scene in Real Time) */}
            <div className="pt-6 border-t border-black/10">
              <span className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-2.5">
                Inspect 3D Finishes & Color Universe:
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { id: "cream-forest" as CardTemplateId, label: "Cream & Forest", dot: "#164C37" },
                  { id: "black-gold" as CardTemplateId, label: "Matte Black & Gold", dot: "#FFD447" },
                  { id: "lavender-luxury" as CardTemplateId, label: "Lavender", dot: "#A88BFF" },
                  { id: "sky-blue" as CardTemplateId, label: "Sky Blue", dot: "#8EDBFF" },
                  { id: "mint-fresh" as CardTemplateId, label: "Mint Fresh", dot: "#10B981" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActivePreset(item.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                      activePreset === item.id
                        ? "border-[#111114] bg-[#111114] text-white shadow-xs"
                        : "border-black/10 bg-white/80 text-neutral-700 hover:border-black/30"
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-black/20"
                      style={{ backgroundColor: item.dot }}
                    />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Real Three.js WebGL Canvas (6 cols) */}
          <div className="lg:col-span-6 relative flex flex-col items-center justify-center min-h-[420px] sm:min-h-[480px]">
            {/* The WebGL Canvas Container */}
            {webGlSupported ? (
              <div
                ref={mountRef}
                className="w-full h-[400px] sm:h-[480px] cursor-grab active:cursor-grabbing relative"
                title="Drag or move pointer to rotate 3D card"
              />
            ) : (
              <div className="w-full max-w-[420px] mx-auto p-4">
                <CardPreview config={heroConfig} interactiveTilt={true} />
              </div>
            )}

            {/* Overlay: Review Pop-Up Modal (Simulating phone review screen when tapped) */}
            {showReviewPopup && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-black/15 p-5 z-40 animate-fade-in text-[#111114]">
                <div className="flex items-center gap-3 pb-3 border-b border-black/5">
                  <div className="w-9 h-9 rounded-xl bg-[#2864FF] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    G
                  </div>
                  <div>
                    <h4 className="text-xs font-bold leading-tight">Aori Botanicals</h4>
                    <span className="text-[10px] text-neutral-500 font-mono">Google Business Profile</span>
                  </div>
                </div>

                <div className="pt-3 space-y-2">
                  <span className="text-[11px] font-semibold text-neutral-700 block">
                    Verified Contactless Tap
                  </span>
                  <div className="flex gap-1 text-[#FFD447]">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <svg key={s} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-[10px] text-neutral-500 italic">
                    "Effortless, genuine feedback from your real customers."
                  </p>
                </div>
              </div>
            )}

            {/* 3D Scene Controls Dock */}
            <div className="flex items-center gap-2 pt-2 z-20">
              <button
                onClick={toggleFlipCard}
                className="px-3.5 py-1.5 rounded-lg bg-white/90 border border-black/15 hover:border-black/35 text-xs font-semibold text-neutral-800 transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 text-[#2864FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>{isShowingBack ? "View Front Face" : "Inspect Reverse / Chip"}</span>
              </button>

              <button
                onClick={handleNfcTap}
                disabled={isNfcPulsing}
                className="px-3.5 py-1.5 rounded-lg bg-white/90 border border-black/15 hover:border-black/35 text-xs font-semibold text-neutral-800 transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <svg className="w-3.5 h-3.5 text-[#164C37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span>Simulate 3D NFC Pulse</span>
              </button>
            </div>
            <span className="text-[10px] text-neutral-400 font-mono mt-1">
              Drag pointer to tilt & rotate in real-time WebGL
            </span>
          </div>
        </div>

        {/* Bottom Scroll Indicator */}
        <div className="flex items-center justify-between pt-6 border-t border-black/10 text-xs font-mono text-neutral-500">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#164C37]" />
            <span>Real-Time PBR Card Mesh · 0.84mm Beveled Geometry</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Scroll to explore Chapters</span>
            <span className="text-sm">↓</span>
          </div>
        </div>
      </div>
    </section>
  );
};
