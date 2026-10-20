import React, { useState } from "react";
import { Product, ProductVariant } from "../../types";
import { BRAND_CONFIG } from "../../config/brand";
import { CardPreview } from "../customizer/CardPreview";
import { TEMPLATE_PRESETS } from "../../data/products";

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onCustomize: (product: Product) => void;
  onAddToCart: (item: { product: Product; variant: ProductVariant; quantity: number }) => void;
  onOpenBulk: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onCustomize,
  onAddToCart,
  onOpenBulk,
}) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants[0]
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"features" | "specs" | "shipping">("features");

  const template = TEMPLATE_PRESETS[product.defaultTemplateId];
  const unitPrice = product.basePrice + (selectedVariant?.priceDelta || 0);
  const totalPrice = unitPrice * quantity;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-black/10 overflow-hidden relative max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/80 border border-black/15 flex items-center justify-center text-neutral-600 hover:text-black hover:bg-white transition-colors cursor-pointer"
        >
          ✕
        </button>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left: Product Visual Showcase (6 cols) */}
            <div className="md:col-span-6 space-y-4">
              <div className="bg-[#F8F6F0] rounded-2xl p-6 flex items-center justify-center border border-black/5 aspect-[4/3]">
                <div className="w-full max-w-[280px]">
                  <CardPreview
                    config={{
                      templateId: product.defaultTemplateId,
                      shape: "standard-card",
                      themeMode: template.themeMode,
                      primaryColor: selectedVariant.colorHex || template.primaryColor,
                      secondaryColor: template.secondaryColor,
                      textColor: template.textColor,
                      accentColor: template.accentColor,
                      fontFamily: template.fontFamily,
                      businessName: "Sample Brand",
                      tagline: "Your Feedback Makes Us Better.",
                      subText: "Tap with your phone or scan to review",
                      googleReviewUrl: "https://g.page/r/reviewtap",
                      logoScale: 1,
                      qrStyle: "classic",
                      enableNfc: product.nfcEnabled,
                      enableQr: product.qrEnabled,
                      showGoogleLogo: true,
                      showRatingStars: true,
                      starRating: 5,
                    }}
                    interactiveTilt={true}
                  />
                </div>
              </div>

              {/* Finishes / Variant Selector */}
              {product.variants.length > 1 && (
                <div>
                  <span className="block text-xs font-bold text-[#17191D] mb-2">
                    Available Finishes ({product.variants.length})
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
                          selectedVariant.id === v.id
                            ? "border-[#123B2B] bg-[#123B2B]/5 text-[#123B2B] font-bold"
                            : "border-black/10 hover:border-black/30 text-[#17191D]/80"
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/20"
                          style={{ backgroundColor: v.colorHex }}
                        />
                        <span>{v.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Specs, Pricing & Purchase Module (6 cols) */}
            <div className="md:col-span-6 space-y-5 text-left">
              <div>
                <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono mb-1">
                  <span>{product.material.split(" ")[0]}</span>
                  <span aria-hidden="true">·</span>
                  <span>{product.nfcEnabled ? "Dual NFC + QR" : "QR Only"}</span>
                </div>
                <h2 className="text-2xl font-extrabold text-[#17191D] leading-tight">
                  {product.name}
                </h2>
                <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                  {product.subtitle}
                </p>
              </div>

              {/* Price Banner */}
              <div className="p-3 bg-[#F8F6F0] rounded-xl border border-black/5 flex items-baseline justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black font-mono text-[#123B2B]">
                      {BRAND_CONFIG.currency.symbol}
                      {unitPrice.toLocaleString("en-IN")}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm line-through text-neutral-400 font-mono">
                        {BRAND_CONFIG.currency.symbol}
                        {product.originalPrice.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-neutral-500">18% GST included · Free delivery above ₹1,499</span>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Ready to Encode
                  </span>
                </div>
              </div>

              {/* Tabs: Features, Specs, Shipping */}
              <div>
                <div className="flex border-b border-black/10 gap-4 text-xs font-bold mb-3">
                  <button
                    onClick={() => setActiveTab("features")}
                    className={`pb-2 border-b-2 cursor-pointer ${
                      activeTab === "features"
                        ? "border-[#123B2B] text-[#123B2B]"
                        : "border-transparent text-neutral-500 hover:text-black"
                    }`}
                  >
                    Features
                  </button>
                  <button
                    onClick={() => setActiveTab("specs")}
                    className={`pb-2 border-b-2 cursor-pointer ${
                      activeTab === "specs"
                        ? "border-[#123B2B] text-[#123B2B]"
                        : "border-transparent text-neutral-500 hover:text-black"
                    }`}
                  >
                    Specifications
                  </button>
                  <button
                    onClick={() => setActiveTab("shipping")}
                    className={`pb-2 border-b-2 cursor-pointer ${
                      activeTab === "shipping"
                        ? "border-[#123B2B] text-[#123B2B]"
                        : "border-transparent text-neutral-500 hover:text-black"
                    }`}
                  >
                    Shipping & Delivery
                  </button>
                </div>

                {activeTab === "features" && (
                  <ul className="space-y-1.5 text-xs text-neutral-700">
                    {product.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#123B2B] font-bold">✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {activeTab === "specs" && (
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-black/5">
                      <span className="text-neutral-500">Substrate Material:</span>
                      <span className="font-semibold text-right">{product.material}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-black/5">
                      <span className="text-neutral-500">Physical Dimensions:</span>
                      <span className="font-semibold text-right">{product.dimensions}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-black/5">
                      <span className="text-neutral-500">NFC Transponder:</span>
                      <span className="font-semibold text-right">{product.chipType}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-black/5">
                      <span className="text-neutral-500">Operating Frequency:</span>
                      <span className="font-semibold text-right">13.56 MHz (ISO/IEC 14443 Type A)</span>
                    </div>
                  </div>
                )}

                {activeTab === "shipping" && (
                  <div className="space-y-2 text-xs text-neutral-700">
                    <p>
                      <strong>Standard Dispatch:</strong> 2 business days after custom artwork and Google destination URL verification.
                    </p>
                    <p>
                      <strong>Pan-India Transit:</strong> Blue Dart / Delhivery Express Air (1-3 days metro, 3-5 days rest of India).
                    </p>
                  </div>
                )}
              </div>

              {/* Quantity Selector & Primary Actions */}
              <div className="pt-3 border-t border-black/10 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-black/15 rounded-xl overflow-hidden shrink-0">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-2 bg-neutral-50 hover:bg-neutral-100 font-bold"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 font-mono font-bold text-xs">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-3 py-2 bg-neutral-50 hover:bg-neutral-100 font-bold"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex-1">
                    <span className="text-xs text-neutral-500 block">Total Price:</span>
                    <span className="text-base font-bold font-mono text-[#123B2B]">
                      {BRAND_CONFIG.currency.symbol}
                      {totalPrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => onCustomize(product)}
                    className="py-3 px-4 bg-[#123B2B] hover:bg-[#0c281d] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Customise Logo & URL →</span>
                  </button>

                  <button
                    onClick={() => {
                      onAddToCart({
                        product,
                        variant: selectedVariant,
                        quantity,
                      });
                      onClose();
                    }}
                    className="py-3 px-4 bg-white hover:bg-black/5 text-[#17191D] border border-black/15 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Add to Cart (Standard)</span>
                  </button>
                </div>

                {product.bulkEligible && (
                  <p className="text-[11px] text-center text-neutral-500">
                    Need 10+ units for branches?{" "}
                    <button
                      onClick={() => {
                        onClose();
                        onOpenBulk();
                      }}
                      className="text-[#2864F0] font-semibold underline cursor-pointer"
                    >
                      Request a volume quote
                    </button>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
