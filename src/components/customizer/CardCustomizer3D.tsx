import React, { useState, useRef, useEffect } from "react";
import { CardDesignConfig, CardTemplateId, CardShape, Product } from "../../types";
import { TEMPLATE_PRESETS, PRODUCTS } from "../../data/products";
import { Scene3DManager } from "../../three/Scene3DManager";
import { CardPreview } from "./CardPreview";
import { validateDestinationUrl } from "../../utils/qr";
import { BRAND_CONFIG } from "../../config/brand";
import { Storage } from "../../utils/storage";

interface CardCustomizer3DProps {
  initialProduct?: Product;
  initialTemplate?: CardTemplateId;
  onAddToCart: (item: {
    product: Product;
    customDesign: CardDesignConfig;
    quantity: number;
  }) => void;
  onClose?: () => void;
}

export const CardCustomizer3D: React.FC<CardCustomizer3DProps> = ({
  initialProduct,
  initialTemplate,
  onAddToCart,
  onClose,
}) => {
  const baseProduct = initialProduct || PRODUCTS[0];
  const defaultTemplate: CardTemplateId =
    initialTemplate || baseProduct.defaultTemplateId || "cream-forest";
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
  const [viewMode, setViewMode] = useState<"3d" | "2d">("3d");
  const [isShowingBack, setIsShowingBack] = useState(false);

  // 3D Scene Refs
  const mount3DRef = useRef<HTMLDivElement>(null);
  const managerRef = useRef<Scene3DManager | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mount 3D Scene
  useEffect(() => {
    if (viewMode !== "3d" || !mount3DRef.current) return;

    try {
      const mgr = new Scene3DManager({
        container: mount3DRef.current,
        initialConfig: config,
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
      console.warn("WebGL manager failed, switching to 2D vector view", e);
      setViewMode("2d");
    }
  }, [viewMode]);

  // Synchronize 3D Card with design configuration changes
  useEffect(() => {
    if (managerRef.current?.card) {
      managerRef.current.card.updateDesign(config);
    }
  }, [config]);

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

  // Google URL validation
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

  // Pricing calculation
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

  // 3D Flip Card Action
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

  // Trigger 3D NFC Pulse
  const trigger3DNfc = () => {
    if (managerRef.current?.card) {
      managerRef.current.card.triggerNfcPulse();
    }
  };

  // Save Draft
  const handleSaveDraft = () => {
    Storage.saveCustomDesign(config.businessName || "Custom Card", config);
    setSaveToast("3D Design saved to your account drafts!");
    setTimeout(() => setSaveToast(null), 3000);
  };

  // Download SVG Proof
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

  return (
    <div className="bg-[#F7F4ED] min-h-screen py-8 px-4 sm:px-6 lg:px-8 select-none">
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed top-6 right-6 z-50 bg-[#164C37] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 text-sm font-medium animate-fade-in">
          <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          {saveToast}
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Breadcrumb & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-black/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 mb-1">
              <span>Studio 3D Customizer</span>
              <span aria-hidden="true">·</span>
              <span>Real-Time PBR Viewport</span>
              <span aria-hidden="true">·</span>
              <span>85.6 × 54.0 mm</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111114]">
              Design Your Custom 3D Review Card
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* View Mode Toggle: 3D vs 2D */}
            <div className="flex items-center p-1 bg-black/5 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setViewMode("3d")}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === "3d" ? "bg-[#111114] text-white shadow-xs" : "text-neutral-600 hover:text-black"
                }`}
              >
                3D Viewport
              </button>
              <button
                onClick={() => setViewMode("2d")}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === "2d" ? "bg-[#111114] text-white shadow-xs" : "text-neutral-600 hover:text-black"
                }`}
              >
                2D Print Flat
              </button>
            </div>

            <button
              onClick={handleSaveDraft}
              className="px-3.5 py-2 text-xs font-semibold text-[#111114] bg-white border border-black/15 rounded-xl hover:bg-black/5 transition-colors cursor-pointer shadow-xs"
            >
              Save Draft
            </button>

            <button
              onClick={handleDownloadArtwork}
              className="px-3.5 py-2 text-xs font-semibold text-[#164C37] bg-[#164C37]/10 rounded-xl hover:bg-[#164C37]/15 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download SVG
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="px-3 py-2 text-xs font-semibold text-neutral-500 hover:text-black cursor-pointer"
              >
                Close
              </button>
            )}
          </div>
        </div>

        {/* Studio Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Tooling Panels (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-sm border border-black/10 order-2 lg:order-1 space-y-6">
            {/* Tabs */}
            <div className="flex items-center gap-1 p-1 bg-black/5 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveTab("template")}
                className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer ${
                  activeTab === "template" ? "bg-white text-black shadow-xs" : "text-neutral-500 hover:text-black"
                }`}
              >
                1. Palette
              </button>
              <button
                onClick={() => setActiveTab("details")}
                className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer ${
                  activeTab === "details" ? "bg-white text-black shadow-xs" : "text-neutral-500 hover:text-black"
                }`}
              >
                2. Copy
              </button>
              <button
                onClick={() => setActiveTab("branding")}
                className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer ${
                  activeTab === "branding" ? "bg-white text-black shadow-xs" : "text-neutral-500 hover:text-black"
                }`}
              >
                3. Logo & URL
              </button>
              <button
                onClick={() => setActiveTab("options")}
                className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer ${
                  activeTab === "options" ? "bg-white text-black shadow-xs" : "text-neutral-500 hover:text-black"
                }`}
              >
                4. Features
              </button>
            </div>

            {/* Tab 1: Templates & Finishes */}
            {activeTab === "template" && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-[#111114]">Curated Color Universe</h3>
                  <p className="text-xs text-neutral-500">
                    Hand-crafted palettes calibrated for high scan contrast and luxury tactile finish.
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
                        className={`text-left p-3 rounded-xl border transition-all text-xs flex flex-col justify-between h-22 cursor-pointer ${
                          isSelected
                            ? "border-[#111114] ring-2 ring-black/10 bg-neutral-50 font-bold"
                            : "border-black/10 hover:border-black/30 bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/15"
                            style={{ backgroundColor: preset.primaryColor }}
                          />
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/15 -ml-2"
                            style={{ backgroundColor: preset.accentColor }}
                          />
                          <span className="truncate ml-1">{preset.name}</span>
                        </div>
                        <p className="text-[10px] text-neutral-500 font-normal line-clamp-2">
                          {preset.description}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Color Tuning */}
                <div className="pt-4 border-t border-black/10 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#111114]">Custom Brand Hex Tuner</span>
                    <button
                      onClick={() =>
                        setConfig((p) => ({
                          ...p,
                          themeMode: p.themeMode === "light" ? "dark" : "light",
                        }))
                      }
                      className="text-[#2864FF] font-semibold hover:underline"
                    >
                      {config.themeMode === "light" ? "Switch to Dark" : "Switch to Light"}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="block text-[11px] text-neutral-500 mb-1">Substrate Surface</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={config.primaryColor}
                          onChange={(e) => setConfig((p) => ({ ...p, primaryColor: e.target.value }))}
                          className="w-8 h-8 rounded-lg cursor-pointer border border-black/15 p-0.5"
                        />
                        <span className="font-mono text-xs">{config.primaryColor}</span>
                      </div>
                    </div>
                    <div>
                      <span className="block text-[11px] text-neutral-500 mb-1">Accent Highlight</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={config.accentColor}
                          onChange={(e) => setConfig((p) => ({ ...p, accentColor: e.target.value }))}
                          className="w-8 h-8 rounded-lg cursor-pointer border border-black/15 p-0.5"
                        />
                        <span className="font-mono text-xs">{config.accentColor}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Copy & Text */}
            {activeTab === "details" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-[#111114]">Card Text & Typography</h3>
                  <p className="text-xs text-neutral-500">
                    Live updates sync instantly to the 3D card canvas.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111114] mb-1">
                    Business / Brand Name
                  </label>
                  <input
                    type="text"
                    value={config.businessName}
                    onChange={(e) => setConfig((p) => ({ ...p, businessName: e.target.value }))}
                    maxLength={32}
                    className="w-full px-3.5 py-2 text-xs border border-black/15 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#164C37]"
                    placeholder="e.g. Aori Botanicals"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111114] mb-1">
                    Sub-Heading Tagline
                  </label>
                  <input
                    type="text"
                    value={config.tagline}
                    onChange={(e) => setConfig((p) => ({ ...p, tagline: e.target.value }))}
                    maxLength={48}
                    className="w-full px-3.5 py-2 text-xs border border-black/15 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#164C37]"
                    placeholder="Your Feedback Makes Us Better."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111114] mb-1">
                    Instruction Callout
                  </label>
                  <input
                    type="text"
                    value={config.subText}
                    onChange={(e) => setConfig((p) => ({ ...p, subText: e.target.value }))}
                    maxLength={50}
                    className="w-full px-3.5 py-2 text-xs border border-black/15 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#164C37]"
                    placeholder="Tap with your phone or scan to review"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111114] mb-2">
                    Primary Typography
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {(["Plus Jakarta Sans", "Manrope", "Playfair Display", "Inter"] as const).map(
                      (font) => (
                        <button
                          key={font}
                          onClick={() => setConfig((p) => ({ ...p, fontFamily: font }))}
                          className={`p-2.5 rounded-xl border text-left font-medium transition-colors cursor-pointer ${
                            config.fontFamily === font
                              ? "border-[#111114] bg-neutral-100 font-bold"
                              : "border-black/10 text-neutral-600 hover:border-black/30"
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

            {/* Tab 3: Branding & Google Review Link */}
            {activeTab === "branding" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-[#111114]">Brand Logo & Google Link</h3>
                  <p className="text-xs text-neutral-500">
                    Upload your vector logo and link your official Google Maps place or review URL.
                  </p>
                </div>

                {/* Logo Upload */}
                <div>
                  <label className="block text-xs font-bold text-[#111114] mb-1.5">
                    Brand Logo (PNG / SVG / JPG)
                  </label>
                  {config.logoUrl ? (
                    <div className="flex items-center gap-4 p-3 bg-neutral-50 rounded-xl border border-black/10">
                      <img
                        src={config.logoUrl}
                        alt="Logo"
                        className="w-12 h-12 object-contain bg-white rounded-lg p-1 border border-black/10"
                      />
                      <div className="flex-1">
                        <span className="text-xs font-semibold text-[#111114] block">Logo Ready</span>
                        <div className="flex items-center gap-2 mt-1">
                          <label className="text-[11px] text-neutral-500">Scale:</label>
                          <input
                            type="range"
                            min="0.7"
                            max="1.3"
                            step="0.05"
                            value={config.logoScale}
                            onChange={(e) =>
                              setConfig((p) => ({ ...p, logoScale: parseFloat(e.target.value) }))
                            }
                            className="w-24 accent-[#111114]"
                          />
                        </div>
                      </div>
                      <button
                        onClick={handleRemoveLogo}
                        className="text-xs text-red-600 hover:text-red-700 font-semibold px-2 py-1 cursor-pointer"
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
                        id="customizer-logo-upload"
                      />
                      <label
                        htmlFor="customizer-logo-upload"
                        className="cursor-pointer text-xs font-semibold text-[#2864FF] flex flex-col items-center gap-1"
                      >
                        <svg className="w-6 h-6 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Upload vector logo (up to 5MB)
                      </label>
                    </div>
                  )}
                </div>

                {/* Destination URL Input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-[#111114]">Google Review URL</label>
                    <a
                      href={config.googleReviewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#2864FF] font-semibold hover:underline flex items-center gap-1"
                    >
                      Test Link ↗
                    </a>
                  </div>
                  <input
                    type="url"
                    value={config.googleReviewUrl}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs font-mono border rounded-xl focus:outline-hidden focus:ring-2 border-black/15 focus:ring-[#164C37]"
                    placeholder="https://g.page/r/... or https://maps.app.goo.gl/..."
                  />
                  <div className="flex items-center gap-1.5 mt-1 text-[11px]">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        urlValidation.valid ? "bg-emerald-500" : "bg-red-500"
                      }`}
                    />
                    <span className={urlValidation.valid ? "text-emerald-700 font-medium" : "text-red-600"}>
                      {urlValidation.message}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Features */}
            {activeTab === "options" && (
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-bold text-[#111114]">Hardware Features</h3>
                  <p className="text-xs text-neutral-500">
                    Toggle individual elements displayed on the card surface.
                  </p>
                </div>

                <label className="flex items-center justify-between p-3 rounded-xl border border-black/10 hover:bg-neutral-50 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-[#111114] block">NFC Contactless Antenna</span>
                    <span className="text-[11px] text-neutral-500">Encodes physical 13.56 MHz NTAG chip</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.enableNfc}
                    onChange={(e) => setConfig((p) => ({ ...p, enableNfc: e.target.checked }))}
                    className="w-4 h-4 accent-[#164C37] rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-black/10 hover:bg-neutral-50 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-[#111114] block">Dynamic Optical QR</span>
                    <span className="text-[11px] text-neutral-500">Real-time vector QR with quiet zone</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.enableQr}
                    onChange={(e) => setConfig((p) => ({ ...p, enableQr: e.target.checked }))}
                    className="w-4 h-4 accent-[#164C37] rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-black/10 hover:bg-neutral-50 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-[#111114] block">5-Star Feedback Rating</span>
                    <span className="text-[11px] text-neutral-500">Motif encouraging 5-star customer ratings</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.showRatingStars}
                    onChange={(e) => setConfig((p) => ({ ...p, showRatingStars: e.target.checked }))}
                    className="w-4 h-4 accent-[#164C37] rounded"
                  />
                </label>
              </div>
            )}
          </div>

          {/* Center Column: Live 3D Viewport / Canvas (4 cols) */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center space-y-4 order-1 lg:order-2">
            {/* Viewport Control Bar */}
            <div className="w-full flex items-center justify-between text-xs px-2 text-neutral-500 font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Three.js PBR Active</span>
              </div>
              <button
                onClick={toggleFlipCard}
                className="text-[#2864FF] hover:underline font-semibold cursor-pointer"
              >
                {isShowingBack ? "Flip to Front" : "Inspect Reverse"}
              </button>
            </div>

            {/* 3D or 2D Interactive Container */}
            <div className="w-full aspect-[85.6/54] relative rounded-2xl overflow-hidden bg-neutral-900/5 border border-black/10 flex items-center justify-center shadow-lg">
              {viewMode === "3d" ? (
                <div
                  ref={mount3DRef}
                  className="w-full h-full cursor-grab active:cursor-grabbing"
                  title="Drag or touch to inspect 3D card"
                />
              ) : (
                <div className="p-4 w-full">
                  <CardPreview
                    config={config}
                    interactiveTilt={true}
                    showBleedGuides={config.bleedGuidesVisible}
                  />
                </div>
              )}
            </div>

            {/* Interaction Tools */}
            <div className="flex items-center justify-center gap-3 w-full">
              <button
                onClick={toggleFlipCard}
                className="px-3 py-1.5 rounded-lg bg-white border border-black/15 text-xs font-semibold hover:bg-neutral-50 cursor-pointer shadow-xs"
              >
                {isShowingBack ? "Show Front Face" : "Inspect Reverse / Chip"}
              </button>
              <button
                onClick={trigger3DNfc}
                className="px-3 py-1.5 rounded-lg bg-[#2864FF]/10 text-[#2864FF] text-xs font-semibold hover:bg-[#2864FF]/20 cursor-pointer"
              >
                Simulate 3D Tap Wave
              </button>
            </div>
            <span className="text-[10px] text-neutral-400 font-mono">
              Drag to rotate in full 360° space
            </span>
          </div>

          {/* Right Column: Pricing & Purchase Module (3 cols) */}
          <div className="lg:col-span-3 bg-white rounded-2xl p-6 shadow-sm border border-black/10 order-3 space-y-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
                Configuration
              </span>
              <h3 className="text-base font-extrabold text-[#111114] mt-0.5">
                {baseProduct.name}
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Physical 0.84mm PVC + 13.56 MHz chip + print proof
              </p>
            </div>

            {/* Quantity Selector with Tier Callout */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#111114]">
                <span>Quantity</span>
                <span className="text-emerald-700 font-semibold">{pricing.tierLabel}</span>
              </div>

              <div className="flex items-center border border-black/15 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 bg-neutral-50 hover:bg-neutral-100 font-bold"
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
                  className="px-3 py-2 bg-neutral-50 hover:bg-neutral-100 font-bold"
                >
                  +
                </button>
              </div>

              {/* Volume Badges */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {[5, 10, 25, 50].map((step) => (
                  <button
                    key={step}
                    onClick={() => setQuantity(step)}
                    className={`text-[10px] px-2 py-0.5 rounded-md border font-mono cursor-pointer transition-colors ${
                      quantity === step
                        ? "bg-[#111114] text-white border-[#111114]"
                        : "bg-neutral-50 text-neutral-600 border-black/10 hover:border-black/30"
                    }`}
                  >
                    {step}x
                  </button>
                ))}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="pt-4 border-t border-black/10 space-y-2 text-xs">
              <div className="flex items-center justify-between text-neutral-600">
                <span>Unit Price</span>
                <span className="font-mono">
                  {BRAND_CONFIG.currency.symbol}{pricing.unitPrice}
                </span>
              </div>

              {pricing.discountPercent > 0 && (
                <div className="flex items-center justify-between text-emerald-700 font-semibold">
                  <span>Tier ({pricing.discountPercent}% off)</span>
                  <span className="font-mono">
                    -{BRAND_CONFIG.currency.symbol}{pricing.savings}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-neutral-600">
                <span>GST (18% included)</span>
                <span className="text-emerald-700 font-semibold">Included</span>
              </div>

              <div className="pt-2 border-t border-black/10 flex items-baseline justify-between text-base font-extrabold text-[#111114]">
                <span>Total</span>
                <span className="text-xl font-mono text-[#164C37]">
                  {BRAND_CONFIG.currency.symbol}
                  {pricing.subtotal.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full py-3.5 bg-[#111114] hover:bg-[#2864FF] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-colors cursor-pointer"
            >
              Add 3D Design to Cart →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
