import React, { useState } from "react";
import { Product, CardDesignConfig } from "../../types";
import { PRODUCTS } from "../../data/products";
import { BRAND_CONFIG } from "../../config/brand";
import { CardPreview } from "../customizer/CardPreview";

interface CuratedShowcaseProps {
  onOrderProduct: (payload: {
    product: Product;
    customDesign: CardDesignConfig;
    quantity: number;
    destinationUrl: string;
  }) => void;
  onHaveOwnDesign: () => void;
}

interface CuratedCardItem {
  id: string;
  title: string;
  tagline: string;
  finish: string;
  basePrice: number;
  config: CardDesignConfig;
  product: Product;
}

export const CuratedShowcase: React.FC<CuratedShowcaseProps> = ({
  onOrderProduct,
  onHaveOwnDesign,
}) => {
  // Four curated ready-made signature finishes
  const curatedCards: CuratedCardItem[] = [
    {
      id: "black-gold",
      title: "Obsidian & Gold",
      tagline: "Matte black velvet substrate with metallic gold foil stamping",
      finish: "Soft-Touch Matte Black PVC · Gold Hot-Stamp",
      basePrice: 1199,
      product: PRODUCTS[2] || PRODUCTS[0],
      config: {
        templateId: "black-gold",
        shape: "standard-card",
        themeMode: "dark",
        primaryColor: "#111114",
        secondaryColor: "#1d1d24",
        textColor: "#F7F4ED",
        accentColor: "#FFD447",
        fontFamily: "Playfair Display",
        businessName: "Your Business Name",
        tagline: "Your Feedback Makes Us Better.",
        subText: "Tap or scan to review on Google",
        googleReviewUrl: "https://g.page/r/reviewtap",
        logoScale: 1,
        qrStyle: "classic",
        enableNfc: true,
        enableQr: true,
        showGoogleLogo: true,
        showRatingStars: true,
        starRating: 5,
      },
    },
    {
      id: "cream-forest",
      title: "Ivory & Forest Green",
      tagline: "Warm architectural paper-tone with deep heritage forest green typography",
      finish: "Matte Recycled 0.84mm PVC · UV Cured Pigment",
      basePrice: 799,
      product: PRODUCTS[0],
      config: {
        templateId: "cream-forest",
        shape: "standard-card",
        themeMode: "light",
        primaryColor: "#F7F4ED",
        secondaryColor: "#EAE6DC",
        textColor: "#164C37",
        accentColor: "#164C37",
        fontFamily: "Plus Jakarta Sans",
        businessName: "Your Business Name",
        tagline: "Your Feedback Makes Us Better.",
        subText: "Tap with your phone or scan to review",
        googleReviewUrl: "https://g.page/r/reviewtap",
        logoScale: 1,
        qrStyle: "classic",
        enableNfc: true,
        enableQr: true,
        showGoogleLogo: true,
        showRatingStars: true,
        starRating: 5,
      },
    },
    {
      id: "sky-blue",
      title: "Sky Cobalt Edition",
      tagline: "Clean architectural sky blue with electric cobalt contrast",
      finish: "Satin Polycarbonate · High-Contrast QR",
      basePrice: 849,
      product: PRODUCTS[3] || PRODUCTS[0],
      config: {
        templateId: "sky-blue",
        shape: "standard-card",
        themeMode: "light",
        primaryColor: "#EEF4FF",
        secondaryColor: "#DCE8FD",
        textColor: "#122A5E",
        accentColor: "#2864FF",
        fontFamily: "Plus Jakarta Sans",
        businessName: "Your Business Name",
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
      },
    },
    {
      id: "minimal-white",
      title: "Minimalist Swiss White",
      tagline: "Pure studio white with graphite lines and crisp geometric layout",
      finish: "0.84mm Scratch-Proof White PVC · Laser Micro-Etch",
      basePrice: 799,
      product: PRODUCTS[0],
      config: {
        templateId: "minimal-white",
        shape: "standard-card",
        themeMode: "light",
        primaryColor: "#FFFFFF",
        secondaryColor: "#F5F5F7",
        textColor: "#111114",
        accentColor: "#111114",
        fontFamily: "Inter",
        businessName: "Your Business Name",
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
      },
    },
  ];

  // Quick Order Modal / State for configuring basic details before adding to cart
  const [orderingCard, setOrderingCard] = useState<CuratedCardItem | null>(null);
  const [orderBusinessName, setOrderBusinessName] = useState("");
  const [orderReviewUrl, setOrderReviewUrl] = useState("");
  const [orderQuantity, setOrderQuantity] = useState(1);

  const handleOpenOrder = (card: CuratedCardItem) => {
    setOrderingCard(card);
    setOrderBusinessName("");
    setOrderReviewUrl("https://g.page/r/");
    setOrderQuantity(1);
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderingCard) return;

    const finalConfig: CardDesignConfig = {
      ...orderingCard.config,
      businessName: orderBusinessName.trim() || orderingCard.title,
      googleReviewUrl: orderReviewUrl.trim() || "https://g.page/r/reviewtap",
    };

    onOrderProduct({
      product: orderingCard.product,
      customDesign: finalConfig,
      quantity: orderQuantity,
      destinationUrl: finalConfig.googleReviewUrl,
    });

    setOrderingCard(null);
  };

  return (
    <section id="designs" className="py-28 bg-[#111114] text-[#F7F4ED] border-t border-white/10 select-none">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
          <div className="space-y-3 text-left">
            <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
              Curated Ready-Made Designs
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight [text-wrap:balance]">
              Four Distinct Expressions.
              <br />
              <span className="text-neutral-400 font-serif font-normal italic">
                One Perfect Standard.
              </span>
            </h2>
          </div>

          <div className="text-left md:text-right">
            <p className="text-xs sm:text-sm text-neutral-400 max-w-sm mb-3">
              Pre-designed for immediate deployment. Pre-programmed to your Google Review destination and dispatched in 2 business days.
            </p>
            <button
              onClick={onHaveOwnDesign}
              className="text-xs font-mono font-bold text-[#8EDBFF] hover:underline cursor-pointer"
            >
              Have your own artwork? Upload here →
            </button>
          </div>
        </div>

        {/* 2x2 Clean Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {curatedCards.map((card) => (
            <div
              key={card.id}
              className="group bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col justify-between hover:border-white/25 transition-all duration-300 space-y-8"
            >
              {/* Card 3D/Vector Visual Header */}
              <div className="aspect-[4/3] rounded-2xl bg-black/40 p-6 flex items-center justify-center overflow-hidden border border-white/5 relative group-hover:bg-black/60 transition-colors">
                <div className="w-full max-w-[280px] transform group-hover:scale-105 transition-transform duration-300">
                  <CardPreview config={card.config} interactiveTilt={true} />
                </div>

                <div className="absolute top-4 left-4 text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                  {card.finish.split("·")[0]}
                </div>
              </div>

              {/* Information Row */}
              <div className="space-y-3 text-left">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-2xl font-black text-white">{card.title}</h3>
                  <span className="text-xl font-mono font-bold text-white">
                    {BRAND_CONFIG.currency.symbol}{card.basePrice.toLocaleString("en-IN")}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
                  {card.tagline}
                </p>

                <div className="text-[11px] font-mono text-neutral-400 pt-1 border-t border-white/5 flex items-center justify-between">
                  <span>ISO/IEC 7810 0.84mm PVC</span>
                  <span>Dual NFC + QR</span>
                </div>
              </div>

              {/* Order Button */}
              <button
                onClick={() => handleOpenOrder(card)}
                className="w-full py-4 bg-white hover:bg-neutral-200 text-[#111114] font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Order This Design</span>
                <span>→</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Order Modal */}
      {orderingCard && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="bg-[#17191D] w-full max-w-lg rounded-3xl border border-white/15 p-6 sm:p-8 space-y-6 text-left text-white shadow-2xl relative">
            <button
              onClick={() => setOrderingCard(null)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-white text-sm cursor-pointer"
            >
              ✕
            </button>

            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 block mb-1">
                Order Configuration
              </span>
              <h3 className="text-2xl font-black text-white">
                {orderingCard.title}
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Enter your business name and Google Review link for NFC encoding.
              </p>
            </div>

            <form onSubmit={handleConfirmOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-white mb-1">
                  Business / Brand Name *
                </label>
                <input
                  type="text"
                  required
                  value={orderBusinessName}
                  onChange={(e) => setOrderBusinessName(e.target.value)}
                  placeholder="e.g. Blue Tokai Coffee"
                  className="w-full px-4 py-2.5 text-xs bg-black/40 border border-white/20 rounded-xl text-white focus:outline-hidden focus:border-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">
                  Google Review Destination URL *
                </label>
                <input
                  type="url"
                  required
                  value={orderReviewUrl}
                  onChange={(e) => setOrderReviewUrl(e.target.value)}
                  placeholder="https://g.page/r/your-business"
                  className="w-full px-4 py-2.5 text-xs font-mono bg-black/40 border border-white/20 rounded-xl text-white focus:outline-hidden focus:border-white"
                />
                <span className="text-[10px] text-neutral-400 mt-1 block">
                  Our lab encodes this URL into the 13.56 MHz NFC chip and generates the verified optical QR code.
                </span>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-bold mb-1">
                  <label>Quantity</label>
                  <span className="font-mono text-emerald-400">
                    {orderQuantity} cards ({orderQuantity >= 5 ? "Volume tier discount applied" : "Standard"})
                  </span>
                </div>
                <div className="flex items-center border border-white/20 rounded-xl overflow-hidden bg-black/40">
                  <button
                    type="button"
                    onClick={() => setOrderQuantity((q) => Math.max(1, q - 1))}
                    className="px-4 py-2 hover:bg-white/10 font-bold"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full text-center py-2 text-xs font-mono font-bold bg-transparent focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setOrderQuantity((q) => q + 1)}
                    className="px-4 py-2 hover:bg-white/10 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <div>
                  <span className="text-neutral-400 block text-[11px]">Total:</span>
                  <span className="text-xl font-bold font-mono text-white">
                    {BRAND_CONFIG.currency.symbol}
                    {(orderingCard.basePrice * orderQuantity).toLocaleString("en-IN")}
                  </span>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3.5 bg-white hover:bg-neutral-200 text-[#111114] font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                >
                  Add to Cart & Checkout →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
