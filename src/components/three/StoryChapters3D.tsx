import React, { useState } from "react";
import { CardTemplateId } from "../../types";
import { TEMPLATE_PRESETS } from "../../data/products";
import { CardPreview } from "../customizer/CardPreview";

interface StoryChapters3DProps {
  onOpenCustomizer: (preset?: CardTemplateId) => void;
  onExploreCollection: () => void;
}

export const StoryChapters3D: React.FC<StoryChapters3DProps> = ({
  onOpenCustomizer,
  onExploreCollection,
}) => {
  const [selectedColor, setSelectedColor] = useState<CardTemplateId>("lavender-luxury");
  const [activeInteraction, setActiveInteraction] = useState<"nfc" | "qr">("nfc");

  const colorPresets: { id: CardTemplateId; name: string; hex: string; desc: string }[] = [
    { id: "lavender-luxury", name: "Lavender Luxury", hex: "#A88BFF", desc: "Velvet matte lilac with deep violet editorial typography" },
    { id: "sky-blue", name: "Sky Blue Modern", hex: "#8EDBFF", desc: "Electric cobalt highlights on crisp architectural sky blue" },
    { id: "mint-fresh", name: "Mint Fresh", hex: "#10B981", desc: "Organic clean sage green designed for wellness & cafés" },
    { id: "cream-forest", name: "Cream & Forest", hex: "#164C37", desc: "Heritage warm ivory paired with deep forest green" },
    { id: "black-gold", name: "Black & Gold", hex: "#FFD447", desc: "Obsidian velvet texture with hot-stamped gold foil" },
    { id: "navy-electric", name: "Navy Electric", hex: "#3A86FF", desc: "Midnight navy blue base with vivid electric cobalt" },
    { id: "minimal-white", name: "Minimal White", hex: "#FFFFFF", desc: "Pure Swiss grid clarity with graphite laser markings" },
  ];

  const currentPreset = TEMPLATE_PRESETS[selectedColor];

  return (
    <div className="bg-[#111114] text-[#F7F4ED] py-24 sm:py-32 border-t border-white/10 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
        {/* CHAPTER 01 — THE OBJECT */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5 text-left">
            <span className="text-xs font-mono font-bold tracking-widest text-[#2864FF] uppercase">
              Chapter 01 / The Object
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight [text-wrap:balance]">
              Sculpted for the Hand.
              <br />
              <span className="text-neutral-400 font-serif font-normal italic">
                Engineered for the Counter.
              </span>
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 max-w-lg leading-relaxed">
              Every ReviewTap card is cut to the exact ISO/IEC 7810 ID-1 standard (85.6 × 54.0 mm) with CNC-milled 3.18mm rounded corners. Seamlessly balance structural rigidity with an ultra-slim 0.84mm pocket-ready profile.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <span className="text-neutral-400 block mb-1">Substrate Depth</span>
                <span className="text-lg font-bold text-white">0.84 mm</span>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <span className="text-neutral-400 block mb-1">Corner Curvature</span>
                <span className="text-lg font-bold text-white">3.18 mm R</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 flex items-center justify-center">
            <div className="w-full max-w-[420px] p-6 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-white/15 shadow-2xl backdrop-blur-md">
              <CardPreview
                config={{
                  templateId: "black-gold",
                  shape: "standard-card",
                  themeMode: "dark",
                  primaryColor: "#17191D",
                  secondaryColor: "#23262C",
                  textColor: "#F8F6F0",
                  accentColor: "#FFD447",
                  fontFamily: "Playfair Display",
                  businessName: "Aori Noir Suite",
                  tagline: "Your Feedback Makes Us Better.",
                  subText: "Tap or scan to share your review",
                  googleReviewUrl: "https://g.page/r/aori-noir",
                  logoScale: 1,
                  qrStyle: "classic",
                  enableNfc: true,
                  enableQr: true,
                  showGoogleLogo: true,
                  showRatingStars: true,
                  starRating: 5,
                }}
                interactiveTilt={true}
              />
            </div>
          </div>
        </section>

        {/* CHAPTER 02 — THE INTERACTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1 flex items-center justify-center">
            <div className="w-full max-w-[420px] p-6 rounded-2xl bg-white/5 border border-white/10 shadow-2xl text-left space-y-4">
              <div className="flex items-center gap-2 p-1 bg-black/40 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setActiveInteraction("nfc")}
                  className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer text-center ${
                    activeInteraction === "nfc"
                      ? "bg-[#2864FF] text-white"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Contactless NFC Mode
                </button>
                <button
                  onClick={() => setActiveInteraction("qr")}
                  className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer text-center ${
                    activeInteraction === "qr"
                      ? "bg-[#2864FF] text-white"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Optical QR Mode
                </button>
              </div>

              <div className="p-4 bg-black/60 rounded-xl border border-white/10 space-y-3">
                {activeInteraction === "nfc" ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      13.56 MHz High-Frequency Protocol
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      Near-Field Communication triggers an instantaneous push notification on iOS and Android devices without requiring any companion app or battery power.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[#8EDBFF] text-xs font-mono font-bold">
                      <span className="w-2 h-2 rounded-full bg-[#8EDBFF]" />
                      High-Contrast Optical QR Matrix
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      Laser-calibrated with ISO 18004 quiet zones ensuring instantaneous focus even in dim restaurant lighting or through camera glare.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 space-y-5 text-left">
            <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
              Chapter 02 / The Interaction
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight [text-wrap:balance]">
              Two Paths.
              <br />
              <span className="text-neutral-400 font-serif font-normal italic">
                Zero Friction for the Guest.
              </span>
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 max-w-lg leading-relaxed">
              Customers never have to search for your business name or decipher misspelled listings. Whether they tap via contactless NFC or point their phone camera at the QR matrix, they arrive directly on your Google review box in under 2 seconds.
            </p>
          </div>
        </section>

        {/* CHAPTER 03 — THE MATERIAL & FINISH */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5 text-left">
            <span className="text-xs font-mono font-bold tracking-widest text-[#FFD447] uppercase">
              Chapter 03 / The Material
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight [text-wrap:balance]">
              Matte Velvet Coating.
              <br />
              <span className="text-neutral-400 font-serif font-normal italic">
                Anti-Fingerprint Sealed.
              </span>
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 max-w-lg leading-relaxed">
              Crafted with high-density polymer layers that resist daily counter sanitizer wipes, coffee spills, and heavy footfall. Ultraviolet cured inks provide deep pigment saturation with zero color fading over time.
            </p>

            <ul className="space-y-2 text-xs font-mono text-neutral-300 pt-2">
              <li className="flex items-center gap-2">
                <span className="text-[#FFD447]">✓</span>
                <span>Waterproof and chemical-resistant UV coating</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#FFD447]">✓</span>
                <span>100,000+ certified NFC contactless read cycles</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#FFD447]">✓</span>
                <span>10-year chip data retention guarantee</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-6 flex items-center justify-center">
            <div className="w-full max-w-[420px] p-6 rounded-2xl bg-white/5 border border-white/10 shadow-2xl">
              <CardPreview
                config={{
                  templateId: "lavender-luxury",
                  shape: "standard-card",
                  themeMode: "light",
                  primaryColor: "#F3EFFE",
                  secondaryColor: "#E2D9FC",
                  textColor: "#321E6E",
                  accentColor: "#7556E8",
                  fontFamily: "Plus Jakarta Sans",
                  businessName: "L’Atelier Studio",
                  tagline: "Your Feedback Makes Us Better.",
                  subText: "Tap or scan to share your review",
                  googleReviewUrl: "https://g.page/r/latelier-studio",
                  logoScale: 1,
                  qrStyle: "classic",
                  enableNfc: true,
                  enableQr: true,
                  showGoogleLogo: true,
                  showRatingStars: true,
                  starRating: 5,
                }}
                interactiveTilt={true}
              />
            </div>
          </div>
        </section>

        {/* CHAPTER 04 — THE COLOUR UNIVERSE */}
        <section className="space-y-12">
          <div className="text-left max-w-2xl">
            <span className="text-xs font-mono font-bold tracking-widest text-[#A88BFF] uppercase">
              Chapter 04 / The Colour Universe
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mt-1">
              Select Your Studio Palette.
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 mt-2">
              Click any colorway below to preview the tactile artwork in real time.
            </p>
          </div>

          {/* Color Switcher Bar & Live Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-2">
              {colorPresets.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedColor(c.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedColor === c.id
                      ? "bg-white/15 border-white ring-1 ring-white/40 shadow-sm"
                      : "bg-white/5 border-white/10 hover:bg-white/10 text-neutral-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-5 h-5 rounded-full border border-white/20 shrink-0"
                      style={{ backgroundColor: c.hex }}
                    />
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-white">{c.name}</div>
                      <div className="text-[11px] text-neutral-400 line-clamp-1">{c.desc}</div>
                    </div>
                  </div>
                  <span className="text-xs text-neutral-500 font-mono">→</span>
                </button>
              ))}
            </div>

            <div className="lg:col-span-7 flex flex-col items-center justify-center p-8 rounded-3xl bg-gradient-to-b from-white/10 to-transparent border border-white/10 shadow-2xl">
              <div className="w-full max-w-[420px]">
                <CardPreview
                  config={{
                    templateId: selectedColor,
                    shape: "standard-card",
                    themeMode: currentPreset.themeMode,
                    primaryColor: currentPreset.primaryColor,
                    secondaryColor: currentPreset.secondaryColor,
                    textColor: currentPreset.textColor,
                    accentColor: currentPreset.accentColor,
                    fontFamily: currentPreset.fontFamily,
                    businessName: "ReviewTap Studio",
                    tagline: "Your Feedback Makes Us Better.",
                    subText: "Tap or scan to review",
                    googleReviewUrl: "https://g.page/r/reviewtap",
                    logoScale: 1,
                    qrStyle: "classic",
                    enableNfc: true,
                    enableQr: true,
                    showGoogleLogo: true,
                    showRatingStars: true,
                    starRating: 5,
                  }}
                  interactiveTilt={true}
                />
              </div>

              <div className="mt-8 flex items-center gap-4">
                <button
                  onClick={() => onOpenCustomizer(selectedColor)}
                  className="px-6 py-3 bg-white text-[#111114] hover:bg-neutral-200 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-colors cursor-pointer"
                >
                  Customize in {currentPreset.name} →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* CHAPTER 05 — MAKE IT YOURS */}
        <section className="p-10 sm:p-14 rounded-3xl bg-gradient-to-r from-[#164C37] to-[#123B2B] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 shadow-2xl border border-white/15">
          <div className="space-y-3 max-w-xl text-left">
            <span className="text-xs font-mono font-bold tracking-widest text-emerald-300 uppercase">
              Chapter 05 / Make It Yours
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Ready to Craft Your Custom 3D Review Card?
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Launch our full studio customizer to upload your brand logo, adjust typography, connect your live Google destination link, and inspect the real 3D product in real time.
            </p>
          </div>

          <button
            onClick={() => onOpenCustomizer()}
            className="px-8 py-4 bg-white text-[#123B2B] hover:bg-neutral-100 font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-xl transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            Launch 3D Customizer →
          </button>
        </section>
      </div>
    </div>
  );
};
