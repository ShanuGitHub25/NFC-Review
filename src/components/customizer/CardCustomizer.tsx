import React, { useState, useRef } from "react";
import { CardDesignConfig, CardTemplateId, CardShape, Product } from "../../types";
import { TEMPLATE_PRESETS, PRODUCTS } from "../../data/products";
import { CardPreview } from "./CardPreview";
import { validateDestinationUrl } from "../../utils/qr";
import { BRAND_CONFIG } from "../../config/brand";
import { Storage } from "../../utils/storage";

interface CardCustomizerProps {
  initialProduct?: Product;
  onAddToCart: (item: {
    product: Product;
    customDesign: CardDesignConfig;
    quantity: number;
  }) => void;
  onClose?: () => void;
}

export const CardCustomizer: React.FC<CardCustomizerProps> = ({
  initialProduct,
  onAddToCart,
  onClose,
}) => {
  const baseProduct = initialProduct || PRODUCTS[0];

  // Default initial configuration based on template
  const defaultTemplate: CardTemplateId = baseProduct.defaultTemplateId || "cream-forest";
  const defaultPreset = TEMPLATE_PRESETS[defaultTemplate];

  const [config, setConfig] = useState<CardDesignConfig>({
    templateId: defaultTemplate,
    shape: "standard-card",
    themeMode: defaultPreset.themeMode,
    primaryColor: defaultPreset.primaryColor,
    secondaryColor: defaultPreset.secondaryColor,
    textColor: defaultPreset.textColor,
    accentColor: defaultPreset.accentColor,
    fontFamily: defaultPreset.fontFamily,
    businessName: "The Artisan Pantry",
    tagline: "Your Feedback Makes Us Better.",
    subText: "Tap with your phone or scan to review",
    googleReviewUrl: "https://g.page/r/the-artisan-pantry/review",
    logoScale: 1,
    qrStyle: "classic",
    enableNfc: true,
    enableQr: true,
    showGoogleLogo: true,
    showRatingStars: true,
    starRating: 5,
    bleedGuidesVisible: false,
  });

  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"template" | "details" | "branding" | "options">("template");
  const [urlValidation, setUrlValidation] = useState<{ valid: boolean; message: string }>({
    valid: true,
    message: "Verified Google Maps / Review Link format",
  });
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isSimulatingTap, setIsSimulatingTap] = useState(false);
  const [isSimulatingScan, setIsSimulatingScan] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Template switch handler
  const handleSelectTemplate = (templateId: CardTemplateId) => {
    const preset = TEMPLATE_PRESETS[templateId];
    setConfig((prev) => ({
      ...prev,
      templateId,
      themeMode: preset.themeMode,
      primaryColor: preset.primaryColor,
      secondaryColor: preset.secondaryColor,
      textColor: preset.textColor,
      accentColor: preset.accentColor,
      fontFamily: preset.fontFamily,
    }));
  };

  // Google URL change & validation
  const handleUrlChange = (newUrl: string) => {
    const check = validateDestinationUrl(newUrl);
    setUrlValidation(check);
    setConfig((prev) => ({ ...prev, googleReviewUrl: newUrl }));
  };

  // Logo file upload handler
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG, JPG, SVG, or WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit. Please upload a smaller image.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setConfig((prev) => ({ ...prev, logoUrl: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setConfig((prev) => ({ ...prev, logoUrl: undefined }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Pricing calculation with volume tiers
  const calculatePricing = () => {
    const unitPrice = baseProduct.basePrice;
    const tier =
      BRAND_CONFIG.pricingTiers.find((t) => quantity >= t.minQty && quantity <= t.maxQty) ||
      BRAND_CONFIG.pricingTiers[0];
    const discountPercent = tier.discountPercent;
    const discountedUnitPrice = Math.round(unitPrice * (1 - discountPercent / 100));
    const subtotal = discountedUnitPrice * quantity;
    const savings = (unitPrice - discountedUnitPrice) * quantity;

    return {
      unitPrice,
      discountedUnitPrice,
      discountPercent,
      tierLabel: tier.tierLabel,
      subtotal,
      savings,
    };
  };

  const pricing = calculatePricing();

  // Save draft
  const handleSaveDraft = () => {
    Storage.saveCustomDesign(config.businessName || "Custom Card", config);
    setSaveToast("Design saved to your account drafts!");
    setTimeout(() => setSaveToast(null), 3000);
  };

  // Reset to default
  const handleReset = () => {
    handleSelectTemplate(defaultTemplate);
    setConfig((prev) => ({
      ...prev,
      businessName: "The Artisan Pantry",
      tagline: "Your Feedback Makes Us Better.",
      subText: "Tap with your phone or scan to review",
      logoUrl: undefined,
      enableNfc: true,
      enableQr: true,
      showGoogleLogo: true,
      showRatingStars: true,
    }));
  };

  // Download printable SVG artwork
  const handleDownloadArtwork = () => {
    const svgContent = `
<svg width="856" height="540" viewBox="0 0 856 540" xmlns="http://www.w3.org/2000/svg">
  <rect width="856" height="540" rx="30" fill="${config.primaryColor}"/>
  <text x="60" y="90" font-family="${config.fontFamily}, sans-serif" font-size="34" font-weight="bold" fill="${config.textColor}">
    ${config.businessName}
  </text>
  <text x="60" y="130" font-family="${config.fontFamily}, sans-serif" font-size="20" fill="${config.textColor}" opacity="0.8">
    ${config.tagline}
  </text>
  <text x="60" y="320" font-family="${config.fontFamily}, sans-serif" font-size="24" font-weight="600" fill="${config.textColor}">
    Review us on Google (5.0 ★★★★★)
  </text>
  <text x="60" y="360" font-family="${config.fontFamily}, sans-serif" font-size="18" fill="${config.textColor}" opacity="0.9">
    ${config.subText}
  </text>
  <rect x="620" y="240" width="170" height="170" rx="16" fill="#FFFFFF"/>
  <text x="705" y="335" font-family="monospace" font-size="14" text-anchor="middle" fill="#17191D">QR MATRIX</text>
  <text x="60" y="500" font-family="monospace" font-size="14" fill="${config.textColor}" opacity="0.5">
    ReviewTap ISO/IEC 7810 · Production Print Ready (85.6x54mm) · Bleed: 3mm
  </text>
</svg>
    `.trim();

    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${config.businessName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-reviewtap-proof.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleAddToCart = () => {
    onAddToCart({
      product: baseProduct,
      customDesign: config,
      quantity,
    });
  };

  const testReviewLink = () => {
    window.open(config.googleReviewUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="bg-[#F8F6F0] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed top-6 right-6 z-50 bg-[#123B2B] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 text-sm font-medium animate-fade-in">
          <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          {saveToast}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header Breadcrumb & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-black/10 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#17191D]/60 mb-1">
              <span>Studio Customizer</span>
              <span aria-hidden="true">·</span>
              <span>85.6 × 54.0 mm Standard Card</span>
              <span aria-hidden="true">·</span>
              <span>NTAG213 High-Frequency Chip</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#17191D]">
              Design Your Custom Review Card
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <button
              onClick={handleSaveDraft}
              className="px-3.5 py-2 text-xs font-semibold text-[#17191D] bg-white border border-black/15 rounded-lg hover:bg-black/5 transition-colors"
            >
              Save Draft
            </button>
            <button
              onClick={handleReset}
              className="px-3.5 py-2 text-xs font-semibold text-[#17191D]/70 hover:text-[#17191D] transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleDownloadArtwork}
              className="px-3.5 py-2 text-xs font-semibold text-[#123B2B] bg-[#123B2B]/10 rounded-lg hover:bg-[#123B2B]/15 transition-colors flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download SVG Proof
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="px-3 py-2 text-xs font-semibold text-neutral-500 hover:text-black"
              >
                Close
              </button>
            )}
          </div>
        </div>

        {/* Main 3-Column Studio Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Design Controls & Tool Tabs (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-sm border border-black/10 order-2 lg:order-1">
            {/* Tab Navigation */}
            <div className="flex items-center gap-1 p-1 bg-black/5 rounded-xl mb-6">
              <button
                onClick={() => setActiveTab("template")}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === "template"
                    ? "bg-white text-[#17191D] shadow-xs"
                    : "text-[#17191D]/60 hover:text-[#17191D]"
                }`}
              >
                1. Template
              </button>
              <button
                onClick={() => setActiveTab("details")}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === "details"
                    ? "bg-white text-[#17191D] shadow-xs"
                    : "text-[#17191D]/60 hover:text-[#17191D]"
                }`}
              >
                2. Details
              </button>
              <button
                onClick={() => setActiveTab("branding")}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === "branding"
                    ? "bg-white text-[#17191D] shadow-xs"
                    : "text-[#17191D]/60 hover:text-[#17191D]"
                }`}
              >
                3. Logo & Link
              </button>
              <button
                onClick={() => setActiveTab("options")}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === "options"
                    ? "bg-white text-[#17191D] shadow-xs"
                    : "text-[#17191D]/60 hover:text-[#17191D]"
                }`}
              >
                4. Features
              </button>
            </div>

            {/* Tab 1: Template Selection */}
            {activeTab === "template" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-[#17191D] mb-1">
                    Choose a Curated Editorial Preset
                  </h3>
                  <p className="text-xs text-[#17191D]/70">
                    Hand-crafted color pairings tested for optimal scan contrast and aesthetic finish.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {(Object.keys(TEMPLATE_PRESETS) as CardTemplateId[]).map((tid) => {
                    const preset = TEMPLATE_PRESETS[tid];
                    const isSelected = config.templateId === tid;

                    return (
                      <button
                        key={tid}
                        onClick={() => handleSelectTemplate(tid)}
                        className={`text-left p-3 rounded-xl border transition-all text-xs flex flex-col justify-between h-24 ${
                          isSelected
                            ? "border-[#123B2B] ring-2 ring-[#123B2B]/20 bg-neutral-50"
                            : "border-black/10 hover:border-black/30 bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-4 h-4 rounded-full border border-black/15 shrink-0"
                            style={{ backgroundColor: preset.primaryColor }}
                          />
                          <span
                            className="w-4 h-4 rounded-full border border-black/15 shrink-0 -ml-2"
                            style={{ backgroundColor: preset.accentColor }}
                          />
                          <span className="font-bold text-[#17191D] truncate ml-1">{preset.name}</span>
                        </div>
                        <p className="text-[10px] text-[#17191D]/60 line-clamp-2">{preset.description}</p>
                      </button>
                    );
                  })}
                </div>

                {/* Form Factor / Shape */}
                <div className="pt-4 border-t border-black/10">
                  <label className="block text-xs font-bold text-[#17191D] mb-2">
                    Card Form Factor
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setConfig((p) => ({ ...p, shape: "standard-card" }))}
                      className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-colors ${
                        config.shape === "standard-card"
                          ? "border-[#123B2B] bg-[#123B2B]/5 text-[#123B2B]"
                          : "border-black/10 text-[#17191D]/70 hover:border-black/30"
                      }`}
                    >
                      Pocket Card
                      <span className="block text-[10px] font-normal opacity-70">85.6 × 54mm</span>
                    </button>
                    <button
                      onClick={() => setConfig((p) => ({ ...p, shape: "countertop-card" }))}
                      className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-colors ${
                        config.shape === "countertop-card"
                          ? "border-[#123B2B] bg-[#123B2B]/5 text-[#123B2B]"
                          : "border-black/10 text-[#17191D]/70 hover:border-black/30"
                      }`}
                    >
                      Table Card
                      <span className="block text-[10px] font-normal opacity-70">Thick PVC Base</span>
                    </button>
                    <button
                      onClick={() => setConfig((p) => ({ ...p, shape: "acrylic-stand" }))}
                      className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-colors ${
                        config.shape === "acrylic-stand"
                          ? "border-[#123B2B] bg-[#123B2B]/5 text-[#123B2B]"
                          : "border-black/10 text-[#17191D]/70 hover:border-black/30"
                      }`}
                    >
                      Stand Insert
                      <span className="block text-[10px] font-normal opacity-70">Acrylic Slotted</span>
                    </button>
                  </div>
                </div>

                {/* Custom Color Overrides (Available in Brand Match or anytime) */}
                <div className="pt-4 border-t border-black/10">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-bold text-[#17191D]">
                      Custom Brand Color Tuner
                    </label>
                    <button
                      onClick={() =>
                        setConfig((p) => ({
                          ...p,
                          themeMode: p.themeMode === "light" ? "dark" : "light",
                        }))
                      }
                      className="text-xs text-[#2864F0] font-semibold hover:underline"
                    >
                      Switch to {config.themeMode === "light" ? "Dark Theme" : "Light Theme"}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="block text-[11px] text-[#17191D]/70 mb-1">Background Surface</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={config.primaryColor}
                          onChange={(e) => setConfig((p) => ({ ...p, primaryColor: e.target.value }))}
                          className="w-8 h-8 rounded-lg cursor-pointer border border-black/15 p-0.5"
                        />
                        <span className="font-mono text-xs text-[#17191D]">{config.primaryColor}</span>
                      </div>
                    </div>
                    <div>
                      <span className="block text-[11px] text-[#17191D]/70 mb-1">Accent Accentuation</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={config.accentColor}
                          onChange={(e) => setConfig((p) => ({ ...p, accentColor: e.target.value }))}
                          className="w-8 h-8 rounded-lg cursor-pointer border border-black/15 p-0.5"
                        />
                        <span className="font-mono text-xs text-[#17191D]">{config.accentColor}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Text & Typography */}
            {activeTab === "details" && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-[#17191D] mb-1">
                    Card Copy & Typography
                  </h3>
                  <p className="text-xs text-[#17191D]/70">
                    Customize your business name, tagline, and call to action.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17191D] mb-1">
                    Business / Brand Name
                  </label>
                  <input
                    type="text"
                    value={config.businessName}
                    onChange={(e) => setConfig((p) => ({ ...p, businessName: e.target.value }))}
                    maxLength={32}
                    className="w-full px-3.5 py-2 text-sm border border-black/15 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#123B2B]"
                    placeholder="e.g. Brewcraft Artisan Coffee"
                  />
                  <span className="text-[10px] text-[#17191D]/50 mt-1 block">Max 32 characters</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17191D] mb-1">
                    Sub-Heading Tagline
                  </label>
                  <input
                    type="text"
                    value={config.tagline}
                    onChange={(e) => setConfig((p) => ({ ...p, tagline: e.target.value }))}
                    maxLength={48}
                    className="w-full px-3.5 py-2 text-sm border border-black/15 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#123B2B]"
                    placeholder="Your Feedback Makes Us Better."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17191D] mb-1">
                    Instruction Callout
                  </label>
                  <input
                    type="text"
                    value={config.subText}
                    onChange={(e) => setConfig((p) => ({ ...p, subText: e.target.value }))}
                    maxLength={50}
                    className="w-full px-3.5 py-2 text-sm border border-black/15 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#123B2B]"
                    placeholder="Tap with your phone or scan to review"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17191D] mb-2">
                    Primary Typography
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {(["Plus Jakarta Sans", "Manrope", "Playfair Display", "Inter"] as const).map(
                      (font) => (
                        <button
                          key={font}
                          onClick={() => setConfig((p) => ({ ...p, fontFamily: font }))}
                          className={`p-2.5 rounded-xl border text-left font-medium transition-colors ${
                            config.fontFamily === font
                              ? "border-[#123B2B] bg-[#123B2B]/5 text-[#123B2B]"
                              : "border-black/10 text-[#17191D]/80 hover:border-black/30"
                          }`}
                          style={{ fontFamily: font }}
                        >
                          {font}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Logo & Review Destination */}
            {activeTab === "branding" && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-[#17191D] mb-1">
                    Logo Asset & Google Destination Link
                  </h3>
                  <p className="text-xs text-[#17191D]/70">
                    Upload your high-res logo and link your official Google Maps place or review link.
                  </p>
                </div>

                {/* Logo Upload */}
                <div>
                  <label className="block text-xs font-bold text-[#17191D] mb-1.5">
                    Brand Logo (PNG / SVG / JPG)
                  </label>
                  {config.logoUrl ? (
                    <div className="flex items-center gap-4 p-3 bg-neutral-50 rounded-xl border border-black/10">
                      <img
                        src={config.logoUrl}
                        alt="Brand preview"
                        className="w-12 h-12 object-contain bg-white rounded-lg p-1 border border-black/10"
                      />
                      <div className="flex-1">
                        <span className="text-xs font-semibold text-[#17191D] block">
                          Logo Uploaded
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <label className="text-[11px] text-[#17191D]/70">Scale:</label>
                          <input
                            type="range"
                            min="0.7"
                            max="1.3"
                            step="0.05"
                            value={config.logoScale}
                            onChange={(e) =>
                              setConfig((p) => ({ ...p, logoScale: parseFloat(e.target.value) }))
                            }
                            className="w-24 accent-[#123B2B]"
                          />
                        </div>
                      </div>
                      <button
                        onClick={handleRemoveLogo}
                        className="text-xs text-red-600 hover:text-red-700 font-semibold px-2 py-1"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-black/15 rounded-xl p-4 text-center hover:border-black/30 transition-colors">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label
                        htmlFor="logo-upload"
                        className="cursor-pointer text-xs font-semibold text-[#2864F0] flex flex-col items-center gap-1"
                      >
                        <svg className="w-6 h-6 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Click to upload logo
                        <span className="text-[10px] text-neutral-400 font-normal">
                          Vector SVG or transparent PNG recommended (up to 5MB)
                        </span>
                      </label>
                    </div>
                  )}
                </div>

                {/* Destination URL */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-[#17191D]">
                      Google Review URL
                    </label>
                    <button
                      onClick={testReviewLink}
                      className="text-xs text-[#2864F0] font-semibold hover:underline flex items-center gap-1"
                    >
                      Test Link
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </button>
                  </div>
                  <input
                    type="url"
                    value={config.googleReviewUrl}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    className={`w-full px-3.5 py-2 text-xs font-mono border rounded-xl focus:outline-hidden focus:ring-2 ${
                      urlValidation.valid
                        ? "border-black/15 focus:ring-[#123B2B]"
                        : "border-red-500 focus:ring-red-500"
                    }`}
                    placeholder="https://g.page/r/... or https://maps.app.goo.gl/..."
                  />
                  <div className="flex items-center gap-1.5 mt-1 text-[11px]">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        urlValidation.valid ? "bg-emerald-500" : "bg-red-500"
                      }`}
                    />
                    <span className={urlValidation.valid ? "text-emerald-700" : "text-red-600"}>
                      {urlValidation.message}
                    </span>
                  </div>
                </div>

                {/* Notice regarding NFC vs QR programming */}
                <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    NFC Encoding & QR Dual Verification
                  </div>
                  <p className="text-[11px] leading-relaxed text-amber-800">
                    Generating this preview creates a verified optical QR code. During physical fabrication, our laboratory encodes the matching URL directly into the 13.56 MHz NTAG microchip and performs dual-field resonance tests before shipping.
                  </p>
                </div>
              </div>
            )}

            {/* Tab 4: Features & Badges */}
            {activeTab === "options" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-[#17191D] mb-1">
                    Card Elements & Verification Marks
                  </h3>
                  <p className="text-xs text-[#17191D]/70">
                    Toggle optional design elements to suit your brand personality.
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 rounded-xl border border-black/10 hover:bg-neutral-50 cursor-pointer">
                    <div>
                      <span className="text-xs font-bold text-[#17191D] block">
                        Dual Contactless NFC Chip
                      </span>
                      <span className="text-[11px] text-[#17191D]/60">
                        Displays contactless symbol & encodes physical NTAG213 chip
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.enableNfc}
                      onChange={(e) => setConfig((p) => ({ ...p, enableNfc: e.target.checked }))}
                      className="w-4 h-4 accent-[#123B2B] rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl border border-black/10 hover:bg-neutral-50 cursor-pointer">
                    <div>
                      <span className="text-xs font-bold text-[#17191D] block">
                        High-Contrast QR Code
                      </span>
                      <span className="text-[11px] text-[#17191D]/60">
                        Ensures camera-based scanning for older or non-NFC phones
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.enableQr}
                      onChange={(e) => setConfig((p) => ({ ...p, enableQr: e.target.checked }))}
                      className="w-4 h-4 accent-[#123B2B] rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl border border-black/10 hover:bg-neutral-50 cursor-pointer">
                    <div>
                      <span className="text-xs font-bold text-[#17191D] block">
                        Official Google 'G' Lockup
                      </span>
                      <span className="text-[11px] text-[#17191D]/60">
                        Shows 'Review us on Google' with authentic 4-color 'G' icon
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.showGoogleLogo}
                      onChange={(e) => setConfig((p) => ({ ...p, showGoogleLogo: e.target.checked }))}
                      className="w-4 h-4 accent-[#123B2B] rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl border border-black/10 hover:bg-neutral-50 cursor-pointer">
                    <div>
                      <span className="text-xs font-bold text-[#17191D] block">
                        5-Star Rating Visual
                      </span>
                      <span className="text-[11px] text-[#17191D]/60">
                        Displays 5-star customer feedback rating motif
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.showRatingStars}
                      onChange={(e) => setConfig((p) => ({ ...p, showRatingStars: e.target.checked }))}
                      className="w-4 h-4 accent-[#123B2B] rounded"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Center Column: Live Card Canvas Preview (4 cols desktop) */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center space-y-4 order-1 lg:order-2">
            {/* Canvas Controls Toolbar */}
            <div className="w-full flex items-center justify-between text-xs px-2 text-[#17191D]/70">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.1))}
                  className="w-7 h-7 rounded-lg bg-white border border-black/15 flex items-center justify-center font-bold hover:bg-black/5"
                  title="Zoom Out"
                >
                  -
                </button>
                <span className="font-mono text-[11px]">{Math.round(zoomLevel * 100)}%</span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(1.3, z + 0.1))}
                  className="w-7 h-7 rounded-lg bg-white border border-black/15 flex items-center justify-center font-bold hover:bg-black/5"
                  title="Zoom In"
                >
                  +
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setConfig((p) => ({ ...p, bleedGuidesVisible: !p.bleedGuidesVisible }))
                  }
                  className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-colors ${
                    config.bleedGuidesVisible
                      ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                      : "bg-white border-black/15 text-[#17191D]/70"
                  }`}
                >
                  Bleed Guides {config.bleedGuidesVisible ? "ON" : "OFF"}
                </button>
              </div>
            </div>

            {/* The Live Interactive Card */}
            <div
              className="w-full flex items-center justify-center transition-transform duration-200 py-2"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <CardPreview
                config={config}
                interactiveTilt={true}
                showBleedGuides={config.bleedGuidesVisible}
                showNfcAnimation={isSimulatingTap}
                showScanAnimation={isSimulatingScan}
              />
            </div>

            {/* Interactive Experience Demonstrations */}
            <div className="w-full bg-white/70 backdrop-blur-xs rounded-xl p-3 border border-black/10 flex items-center justify-around gap-2 text-xs">
              <button
                onClick={() => {
                  setIsSimulatingTap(true);
                  setTimeout(() => setIsSimulatingTap(false), 2200);
                }}
                className="px-3 py-1.5 rounded-lg bg-[#2864F0]/10 hover:bg-[#2864F0]/15 text-[#2864F0] font-semibold transition-colors flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Simulate NFC Tap
              </button>

              <button
                onClick={() => {
                  setIsSimulatingScan(true);
                  setTimeout(() => setIsSimulatingScan(false), 2200);
                }}
                className="px-3 py-1.5 rounded-lg bg-[#7556E8]/10 hover:bg-[#7556E8]/15 text-[#7556E8] font-semibold transition-colors flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M4 8h16" />
                </svg>
                Simulate QR Scan
              </button>
            </div>

            <p className="text-[11px] text-[#17191D]/50 text-center">
              Hover to tilt · 0.84mm recycled PVC with micro-textured matte velvet finish
            </p>
          </div>

          {/* Right Column: Pricing Summary & Add to Cart (3 cols) */}
          <div className="lg:col-span-3 bg-white rounded-2xl p-6 shadow-sm border border-black/10 order-3 space-y-6">
            <div>
              <span className="text-xs text-[#17191D]/60 uppercase tracking-wider font-semibold">
                Order Configuration
              </span>
              <h3 className="text-lg font-extrabold text-[#17191D] mt-0.5">
                {baseProduct.name}
              </h3>
              <p className="text-xs text-[#17191D]/70 mt-1">
                Custom artwork + NFC chip programming + delivery verification
              </p>
            </div>

            {/* Quantity Selector with Tier Callout */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#17191D]">
                <span>Quantity</span>
                <span className="text-emerald-700 font-semibold">{pricing.tierLabel}</span>
              </div>

              <div className="flex items-center border border-black/15 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 bg-neutral-50 hover:bg-neutral-100 text-[#17191D] font-bold transition-colors"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full text-center py-2 text-sm font-bold font-mono focus:outline-hidden"
                />
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-2 bg-neutral-50 hover:bg-neutral-100 text-[#17191D] font-bold transition-colors"
                >
                  +
                </button>
              </div>

              {/* Volume Discount Badges */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {[5, 10, 25, 50].map((step) => (
                  <button
                    key={step}
                    onClick={() => setQuantity(step)}
                    className={`text-[10px] px-2 py-0.5 rounded-md border font-mono transition-colors ${
                      quantity === step
                        ? "bg-[#123B2B] text-white border-[#123B2B]"
                        : "bg-neutral-50 text-[#17191D]/70 border-black/10 hover:border-black/30"
                    }`}
                  >
                    {step}x
                  </button>
                ))}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="pt-4 border-t border-black/10 space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#17191D]/70">
                <span>Unit Price</span>
                <span className="font-mono tabular-nums">
                  {BRAND_CONFIG.currency.symbol}
                  {pricing.unitPrice}
                </span>
              </div>

              {pricing.discountPercent > 0 && (
                <div className="flex items-center justify-between text-emerald-700 font-semibold">
                  <span>Volume Tier ({pricing.discountPercent}% off)</span>
                  <span className="font-mono tabular-nums">
                    -{BRAND_CONFIG.currency.symbol}
                    {pricing.savings}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-[#17191D]/70">
                <span>GST (18% included)</span>
                <span className="text-[11px] text-emerald-700">Included</span>
              </div>

              <div className="flex items-center justify-between text-[#17191D]/70">
                <span>Shipping</span>
                <span>
                  {pricing.subtotal >= BRAND_CONFIG.shipping.standardFreeThreshold ? (
                    <span className="text-emerald-700 font-semibold">Free Pan-India</span>
                  ) : (
                    <span className="font-mono">
                      {BRAND_CONFIG.currency.symbol}
                      {BRAND_CONFIG.shipping.standardFee}
                    </span>
                  )}
                </span>
              </div>

              <div className="pt-2 border-t border-black/10 flex items-baseline justify-between text-base font-extrabold text-[#17191D]">
                <span>Total</span>
                <span className="text-xl font-mono text-[#123B2B]">
                  {BRAND_CONFIG.currency.symbol}
                  {pricing.subtotal.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleAddToCart}
                className="w-full py-3.5 px-4 bg-[#123B2B] hover:bg-[#0c281d] text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Add Custom Card to Cart
              </button>

              <p className="text-[10px] text-neutral-500 text-center">
                Estimated dispatch in 2 business days after artwork confirmation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
