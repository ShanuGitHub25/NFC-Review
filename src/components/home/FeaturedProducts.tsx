import React, { useState } from "react";
import { Product, ProductCategory } from "../../types";
import { PRODUCTS } from "../../data/products";
import { BRAND_CONFIG } from "../../config/brand";
import { CardPreview } from "../customizer/CardPreview";
import { TEMPLATE_PRESETS } from "../../data/products";

interface FeaturedProductsProps {
  onSelectProduct: (product: Product) => void;
  onCustomizeProduct: (product: Product) => void;
  onQuickAddToCart: (product: Product) => void;
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  onSelectProduct,
  onCustomizeProduct,
  onQuickAddToCart,
  wishlist,
  onToggleWishlist,
}) => {
  const [activeCategory, setActiveCategory] = useState<ProductCategory>("all");

  const categories: { id: ProductCategory; label: string }[] = [
    { id: "all", label: "All Products" },
    { id: "best-sellers", label: "Best Sellers" },
    { id: "colour-pop", label: "Colour Pop" },
    { id: "luxury", label: "Luxury Edition" },
    { id: "minimal", label: "Minimal Studio" },
    { id: "bulk-enterprise", label: "Bulk & Enterprise" },
  ];

  const filtered =
    activeCategory === "all"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategory);

  return (
    <section id="collection" className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-xs font-mono font-bold text-[#123B2B] uppercase tracking-wider mb-2">
              Hardware Catalogue
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#17191D]">
              Engineered For The Counter
            </h2>
            <p className="text-sm sm:text-base text-[#17191D]/70 max-w-xl mt-2">
              Every card and countertop display is calibrated for immediate contactless performance, weather resistance, and brand precision.
            </p>
          </div>

          {/* Interactive Category Segmented Tabs (Functional Buttons) */}
          <div className="flex items-center gap-1.5 p-1 bg-black/5 rounded-xl overflow-x-auto max-w-full">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  activeCategory === c.id
                    ? "bg-white text-[#17191D] shadow-xs"
                    : "text-[#17191D]/70 hover:text-[#17191D]"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3-Column Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((product) => {
            const isWishlisted = wishlist.includes(product.id);
            const template = TEMPLATE_PRESETS[product.defaultTemplateId];

            return (
              <div
                key={product.id}
                className="group bg-white rounded-2xl border border-black/10 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                {/* Visual Header / Mockup Preview Container */}
                <div className="relative aspect-[4/3] bg-[#F8F6F0] p-6 flex items-center justify-center overflow-hidden border-b border-black/5">
                  {/* Subtle Vector Preview of Card */}
                  <div className="w-full max-w-[260px] transform group-hover:scale-105 group-hover:-rotate-1 transition-transform duration-300">
                    <CardPreview
                      config={{
                        templateId: product.defaultTemplateId,
                        shape: "standard-card",
                        themeMode: template.themeMode,
                        primaryColor: template.primaryColor,
                        secondaryColor: template.secondaryColor,
                        textColor: template.textColor,
                        accentColor: template.accentColor,
                        fontFamily: template.fontFamily,
                        businessName: "Your Brand",
                        tagline: "Your Feedback Makes Us Better.",
                        subText: "Tap or scan to review",
                        googleReviewUrl: "https://g.page/r/reviewtap",
                        logoScale: 1,
                        qrStyle: "classic",
                        enableNfc: product.nfcEnabled,
                        enableQr: product.qrEnabled,
                        showGoogleLogo: true,
                        showRatingStars: true,
                        starRating: 5,
                      }}
                      interactiveTilt={false}
                    />
                  </div>

                  {/* Top Bar Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    {product.badge && (
                      <span className="text-[10px] font-bold text-[#123B2B] bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md border border-black/10 shadow-xs">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => onToggleWishlist(product.id)}
                    aria-label={isWishlisted ? "Remove from wishlist" : "Save to wishlist"}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs border border-black/10 flex items-center justify-center text-neutral-600 hover:text-red-500 transition-colors shadow-xs cursor-pointer"
                  >
                    <svg
                      className={`w-4 h-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                </div>

                {/* Card Content & Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    {/* Clean unboxed metadata with separators */}
                    <div className="flex items-center gap-2 text-[11px] text-[#17191D]/60 font-mono">
                      <span>{product.material.split(" ")[0]}</span>
                      <span aria-hidden="true">·</span>
                      <span>{product.nfcEnabled ? "NFC + QR" : "QR Only"}</span>
                      <span aria-hidden="true">·</span>
                      <span>Customizable</span>
                    </div>

                    <h3
                      onClick={() => onSelectProduct(product)}
                      className="text-base font-bold text-[#17191D] hover:text-[#123B2B] transition-colors cursor-pointer leading-snug line-clamp-1"
                    >
                      {product.name}
                    </h3>

                    <p className="text-xs text-[#17191D]/70 line-clamp-2 leading-relaxed">
                      {product.subtitle}
                    </p>
                  </div>

                  {/* Color Swatches */}
                  {product.variants.length > 1 && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-neutral-400 font-medium">Finishes:</span>
                      {product.variants.map((v) => (
                        <span
                          key={v.id}
                          title={v.name}
                          className="w-3.5 h-3.5 rounded-full border border-black/20"
                          style={{ backgroundColor: v.colorHex }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Price & Primary Action Row */}
                  <div className="pt-3 border-t border-black/10 flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-bold font-mono text-[#123B2B]">
                          {BRAND_CONFIG.currency.symbol}
                          {product.basePrice.toLocaleString("en-IN")}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs line-through text-neutral-400 font-mono">
                            {BRAND_CONFIG.currency.symbol}
                            {product.originalPrice.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-neutral-400 block">Launch sample price</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectProduct(product)}
                        className="px-3 py-2 text-xs font-semibold text-[#17191D] hover:bg-black/5 rounded-lg border border-black/15 transition-colors cursor-pointer"
                      >
                        Specs
                      </button>
                      <button
                        onClick={() => onCustomizeProduct(product)}
                        className="px-3.5 py-2 text-xs font-bold text-white bg-[#123B2B] hover:bg-[#0c281d] rounded-lg shadow-xs transition-colors cursor-pointer"
                      >
                        Customise
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
