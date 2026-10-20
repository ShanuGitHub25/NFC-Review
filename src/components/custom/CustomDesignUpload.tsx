import React, { useState, useRef } from "react";
import { Product, CardDesignConfig } from "../../types";
import { PRODUCTS } from "../../data/products";
import { BRAND_CONFIG } from "../../config/brand";

interface CustomDesignUploadProps {
  onAddCustomUploadToCart: (payload: {
    product: Product;
    customDesign: CardDesignConfig;
    quantity: number;
    artworkFileName: string;
    notes: string;
  }) => void;
}

export const CustomDesignUpload: React.FC<CustomDesignUploadProps> = ({
  onAddCustomUploadToCart,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [reviewUrl, setReviewUrl] = useState("https://g.page/r/");
  const [quantity, setQuantity] = useState(5);
  const [notes, setNotes] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (selected: File) => {
    setErrorMessage(null);

    // Validate type: PNG, JPG, JPEG, SVG, PDF
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml", "application/pdf"];
    if (!validTypes.includes(selected.type) && !selected.name.toLowerCase().endsWith(".pdf")) {
      setErrorMessage("Please upload a valid vector or image format (PNG, JPG, SVG, or PDF).");
      return;
    }

    // Validate size: max 15MB
    if (selected.size > 15 * 1024 * 1024) {
      setErrorMessage("File exceeds the 15MB size limit. Please upload a compressed artwork file.");
      return;
    }

    setFile(selected);

    // Generate preview if it's an image
    if (selected.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(selected);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setErrorMessage("Please upload your artwork file before submitting.");
      return;
    }

    if (!businessName || !contactName || !email || !phone || !reviewUrl) {
      setErrorMessage("Please fill in all required contact and Google review fields.");
      return;
    }

    const baseProduct = PRODUCTS[0];
    const unitPrice = baseProduct.basePrice;
    const tier =
      BRAND_CONFIG.pricingTiers.find((t) => quantity >= t.minQty && quantity <= t.maxQty) ||
      BRAND_CONFIG.pricingTiers[0];

    const customDesign: CardDesignConfig = {
      templateId: "brand-match",
      shape: "standard-card",
      themeMode: "light",
      primaryColor: "#FFFFFF",
      secondaryColor: "#F5F5F7",
      textColor: "#111114",
      accentColor: "#2864FF",
      fontFamily: "Plus Jakarta Sans",
      businessName: businessName.trim(),
      tagline: "Custom Brand Artwork",
      subText: "Tap or scan to review",
      googleReviewUrl: reviewUrl.trim(),
      logoUrl: previewUrl || undefined,
      logoScale: 1,
      qrStyle: "classic",
      enableNfc: true,
      enableQr: true,
      showGoogleLogo: true,
      showRatingStars: true,
      starRating: 5,
    };

    onAddCustomUploadToCart({
      product: baseProduct,
      customDesign,
      quantity,
      artworkFileName: file.name,
      notes: `${contactName} (${email}, ${phone}) — Notes: ${notes || "None"}`,
    });

    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 4000);
  };

  return (
    <section id="custom-upload" className="py-28 bg-[#17191D] text-[#F7F4ED] border-t border-white/10 select-none">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-mono font-bold tracking-widest text-[#FFD447] uppercase">
            Have Your Own Design?
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Upload Your Print Artwork.
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-normal">
            Already have brand guidelines or a design from your agency? Skip online editors. Upload your vector file below and our prepress laboratory will inspect, proof, and encode your NFC fleet.
          </p>
        </div>

        {/* Upload Form Box */}
        <div className="bg-white/5 border border-white/15 rounded-3xl p-8 sm:p-12 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-8 text-left">
            {/* File Dropzone */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-2">
                Artwork File (PNG, JPG, SVG, or PDF up to 15MB) *
              </label>

              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-3 ${
                  file
                    ? "border-emerald-500/60 bg-emerald-950/20"
                    : "border-white/20 hover:border-white/40 bg-black/30"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".png,.jpg,.jpeg,.svg,.pdf"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileChange(e.target.files[0]);
                    }
                  }}
                />

                {file ? (
                  <div className="space-y-2">
                    <span className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-lg">
                      ✓
                    </span>
                    <div className="text-sm font-bold text-white font-mono">{file.name}</div>
                    <span className="text-xs text-neutral-400 block">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB · Click or drag to replace
                    </span>
                  </div>
                ) : (
                  <>
                    <svg className="w-8 h-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <div>
                      <span className="text-xs font-bold text-white block">
                        Drag & Drop or Click to Select File
                      </span>
                      <span className="text-[11px] text-neutral-400 block mt-1">
                        Bleed recommendation: 85.6 × 54.0 mm + 3mm bleed margin
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Artwork Image Preview if available */}
              {previewUrl && (
                <div className="mt-4 p-4 bg-black/40 rounded-2xl border border-white/10 flex items-center gap-4">
                  <img
                    src={previewUrl}
                    alt="Uploaded Artwork"
                    className="w-20 h-12 object-contain bg-white rounded-lg p-1 border border-white/10"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">Artwork Preview Ready</span>
                    <span className="text-[10px] text-neutral-400">
                      Our prepress technicians will align this directly to the card cutting dies.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="p-4 bg-red-900/30 border border-red-500/40 rounded-xl text-xs text-red-200">
                {errorMessage}
              </div>
            )}

            {/* Contact & Business Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              <div>
                <label className="block text-xs font-bold text-white mb-1">
                  Business / Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Bombay Canteen"
                  className="w-full px-4 py-2.5 bg-black/40 border border-white/20 rounded-xl text-white focus:outline-hidden focus:border-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">
                  Contact Person *
                </label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Sameer Nair"
                  className="w-full px-4 py-2.5 bg-black/40 border border-white/20 rounded-xl text-white focus:outline-hidden focus:border-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">
                  Business Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@company.in"
                  className="w-full px-4 py-2.5 bg-black/40 border border-white/20 rounded-xl text-white focus:outline-hidden focus:border-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">
                  Mobile / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98450 12345"
                  className="w-full px-4 py-2.5 bg-black/40 border border-white/20 rounded-xl text-white focus:outline-hidden focus:border-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-white mb-1">
                  Google Review Destination URL *
                </label>
                <input
                  type="url"
                  required
                  value={reviewUrl}
                  onChange={(e) => setReviewUrl(e.target.value)}
                  placeholder="https://g.page/r/your-review-destination"
                  className="w-full px-4 py-2.5 font-mono bg-black/40 border border-white/20 rounded-xl text-white focus:outline-hidden focus:border-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">
                  Card Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-4 py-2.5 font-mono font-bold bg-black/40 border border-white/20 rounded-xl text-white focus:outline-hidden focus:border-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">
                  Additional Notes
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Matte finish requested, multi-branch setup"
                  className="w-full px-4 py-2.5 bg-black/40 border border-white/20 rounded-xl text-white focus:outline-hidden focus:border-white"
                />
              </div>
            </div>

            {/* Submit Row */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-neutral-400 block font-mono">
                  Production Rate: ₹799/card (Volume discounts applied automatically)
                </span>
                <span className="text-xs font-bold text-white font-mono">
                  Estimated Total: {BRAND_CONFIG.currency.symbol}{(799 * quantity).toLocaleString("en-IN")}
                </span>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-neutral-200 text-[#111114] font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-colors cursor-pointer"
              >
                Submit Custom Artwork & Order →
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
