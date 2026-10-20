import React, { useState } from "react";
import { PRODUCTS } from "../../data/products";
import { BRAND_CONFIG } from "../../config/brand";
import { Storage } from "../../utils/storage";
import { lookupIndiaPostalCode } from "../../utils/indiaPostal";
import { BulkQuoteRequest } from "../../types";

interface BulkOrderPortalProps {
  onBackToShop: () => void;
  onViewAccountQuotes?: () => void;
}

export const BulkOrderPortal: React.FC<BulkOrderPortalProps> = ({
  onBackToShop,
  onViewAccountQuotes,
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(PRODUCTS[0].id);
  const [quantity, setQuantity] = useState<number>(25);
  const [numLocations, setNumLocations] = useState<number>(5);
  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [postalCode, setPostalCode] = useState("560038");
  const [customPackaging, setCustomPackaging] = useState(true);
  const [brandGuidelineAttached, setBrandGuidelineAttached] = useState(false);
  const [notes, setNotes] = useState("");
  const [submittedQuote, setSubmittedQuote] = useState<BulkQuoteRequest | null>(null);

  const selectedProduct = PRODUCTS.find((p) => p.id === selectedProductId) || PRODUCTS[0];

  // Tier pricing calculation based on configured tiers
  const calculateTierPrice = () => {
    const base = selectedProduct.basePrice;
    const tier =
      BRAND_CONFIG.pricingTiers.find((t) => quantity >= t.minQty && quantity <= t.maxQty) ||
      BRAND_CONFIG.pricingTiers[BRAND_CONFIG.pricingTiers.length - 1];

    const discountPercent = tier.discountPercent;
    const unitPrice = Math.round(base * (1 - discountPercent / 100));
    const subtotal = unitPrice * quantity;
    const packagingCost = customPackaging ? quantity * 40 : 0;
    const estimatedTotal = subtotal + packagingCost;

    return {
      baseUnitPrice: base,
      discountPercent,
      tierLabel: tier.tierLabel,
      unitPrice,
      subtotal,
      packagingCost,
      estimatedTotal,
    };
  };

  const pricing = calculateTierPrice();
  const postalInfo = lookupIndiaPostalCode(postalCode);

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();

    if (!businessName || !contactName || !email || !phone) {
      alert("Please fill in your business name, contact name, email, and phone number.");
      return;
    }

    const quoteId = "QT-" + Math.floor(10000 + Math.random() * 90000);
    const newQuote: BulkQuoteRequest = {
      id: quoteId,
      submittedAt: new Date().toISOString(),
      businessName,
      contactName,
      email,
      phone,
      quantity,
      productId: selectedProductId,
      numLocations,
      deliveryPostalCode: postalCode,
      customPackaging,
      brandGuidelineAttached,
      notes,
      status: "new",
      quotedAmount: pricing.estimatedTotal,
    };

    Storage.saveBulkQuote(newQuote);
    setSubmittedQuote(newQuote);
  };

  return (
    <div className="bg-[#F8F6F0] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between pb-6 border-b border-black/10 mb-8">
          <div className="flex items-center gap-2 text-xs text-[#17191D]/60 font-mono">
            <span>Enterprise Desk</span>
            <span aria-hidden="true">·</span>
            <span>Multi-Location Fleet</span>
            <span aria-hidden="true">·</span>
            <span>B2B Volume Quotes</span>
          </div>

          <button
            onClick={onBackToShop}
            className="text-xs font-semibold text-[#17191D] hover:underline"
          >
            ← Back to Storefront
          </button>
        </div>

        {/* Success Confirmation View */}
        {submittedQuote ? (
          <div className="bg-white rounded-2xl border border-black/10 p-8 sm:p-10 shadow-sm text-center max-w-2xl mx-auto space-y-5 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <div>
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                Quote Request {submittedQuote.id} Received
              </span>
              <h2 className="text-2xl font-black text-[#17191D] mt-3">
                We're Reviewing Your Fleet Requirements
              </h2>
              <p className="text-xs sm:text-sm text-[#17191D]/70 max-w-md mx-auto mt-2 leading-relaxed">
                Thank you, {submittedQuote.contactName}. Our commercial team has recorded your request for {submittedQuote.quantity} units for {submittedQuote.businessName} across {submittedQuote.numLocations} locations.
              </p>
            </div>

            <div className="p-4 bg-neutral-50 rounded-xl border border-black/5 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-neutral-500">Hardware Unit:</span>
                <span className="font-semibold text-[#17191D]">{selectedProduct.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Volume Quantity:</span>
                <span className="font-bold text-[#17191D]">{submittedQuote.quantity} cards</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Estimated Total:</span>
                <span className="font-mono font-bold text-[#123B2B]">
                  {BRAND_CONFIG.currency.symbol}
                  {submittedQuote.quotedAmount?.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Delivery Region:</span>
                <span className="text-[#17191D]">
                  {postalInfo.city}, {postalInfo.state} ({submittedQuote.deliveryPostalCode})
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-3">
              <button
                onClick={() => setSubmittedQuote(null)}
                className="px-4 py-2 text-xs font-semibold text-[#17191D] border border-black/15 rounded-xl hover:bg-black/5"
              >
                Submit Another Inquiry
              </button>
              {onViewAccountQuotes && (
                <button
                  onClick={onViewAccountQuotes}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#123B2B] hover:bg-[#0c281d] rounded-xl"
                >
                  View in My Account →
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Form & Live Calculator Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Inquiry Form (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-black/10 shadow-xs space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17191D] tracking-tight">
                  Scale Your Brand Across Every Counter
                </h1>
                <p className="text-xs sm:text-sm text-[#17191D]/70 mt-1">
                  Volume-based production for hotel chains, restaurant franchises, multi-chair salons, and agency resellers.
                </p>
              </div>

              <form onSubmit={handleSubmitQuote} className="space-y-5">
                {/* Product Selection */}
                <div>
                  <label className="block text-xs font-bold text-[#17191D] mb-2">
                    Hardware Form Factor
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {PRODUCTS.filter((p) => p.bulkEligible).map((prod) => (
                      <button
                        type="button"
                        key={prod.id}
                        onClick={() => setSelectedProductId(prod.id)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          selectedProductId === prod.id
                            ? "border-[#123B2B] bg-[#123B2B]/5 font-bold text-[#123B2B] ring-1 ring-[#123B2B]"
                            : "border-black/10 text-[#17191D]/80 hover:border-black/25 bg-white"
                        }`}
                      >
                        <span className="block truncate">{prod.name}</span>
                        <span className="text-[10px] text-neutral-500 font-mono font-normal">
                          Starting at {BRAND_CONFIG.currency.symbol}{prod.basePrice}/unit
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity & Locations Slider */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between items-center text-xs font-bold text-[#17191D] mb-1.5">
                      <label>Total Card Quantity</label>
                      <span className="font-mono text-emerald-700">{quantity} units</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="500"
                      step="5"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                      className="w-full accent-[#123B2B]"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-neutral-400 mt-1">
                      <span>10</span>
                      <span>100</span>
                      <span>250</span>
                      <span>500+</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-xs font-bold text-[#17191D] mb-1.5">
                      <label>Number of Branch Locations</label>
                      <span className="font-mono text-[#123B2B]">{numLocations} branches</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={numLocations}
                      onChange={(e) => setNumLocations(parseInt(e.target.value))}
                      className="w-full accent-[#123B2B]"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-neutral-400 mt-1">
                      <span>1</span>
                      <span>25</span>
                      <span>50</span>
                      <span>100</span>
                    </div>
                  </div>
                </div>

                {/* Business Details Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#17191D] mb-1">
                      Company / Brand Name
                    </label>
                    <input
                      type="text"
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs border border-black/15 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#123B2B]"
                      placeholder="e.g. Blue Tokai Coffee Roasters"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#17191D] mb-1">
                      Contact Person
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs border border-black/15 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#123B2B]"
                      placeholder="e.g. Rohini Sharma"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#17191D] mb-1">
                      Business Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs border border-black/15 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#123B2B]"
                      placeholder="operations@brand.in"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#17191D] mb-1">
                      Phone Number (WhatsApp)
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs border border-black/15 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#123B2B]"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                {/* Postal Code with auto-detect */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-[#17191D]">
                      Delivery PIN Code (India)
                    </label>
                    {postalInfo.valid && (
                      <span className="text-[11px] font-mono text-emerald-700">
                        {postalInfo.city}, {postalInfo.state}
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full sm:w-1/2 px-3.5 py-2 text-xs font-mono border border-black/15 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#123B2B]"
                    placeholder="e.g. 560038"
                  />
                </div>

                {/* Packaging & Guidelines Checkboxes */}
                <div className="space-y-2 pt-2 border-t border-black/10">
                  <label className="flex items-center gap-2.5 text-xs text-[#17191D] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={customPackaging}
                      onChange={(e) => setCustomPackaging(e.target.checked)}
                      className="w-4 h-4 accent-[#123B2B] rounded"
                    />
                    <span>Include custom-branded sleeve packaging (+₹40/card)</span>
                  </label>

                  <label className="flex items-center gap-2.5 text-xs text-[#17191D] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={brandGuidelineAttached}
                      onChange={(e) => setBrandGuidelineAttached(e.target.checked)}
                      className="w-4 h-4 accent-[#123B2B] rounded"
                    />
                    <span>I have a vector PDF brand guideline to share with the design team</span>
                  </label>
                </div>

                {/* Specifications Notes */}
                <div>
                  <label className="block text-xs font-bold text-[#17191D] mb-1">
                    Branch Setup Notes & Destination Preferences
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-black/15 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#123B2B]"
                    placeholder="Provide branch names, Google Maps place IDs, or notes on whether waitstaff need individual serial tracking..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#123B2B] hover:bg-[#0c281d] text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Submit Enterprise Quote Request
                </button>
              </form>
            </div>

            {/* Right Column: Dynamic Price Calculation Summary (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-7 border border-black/10 shadow-xs space-y-6">
              <div>
                <span className="text-xs font-mono font-bold text-[#123B2B] uppercase">
                  Live Tier Calculation
                </span>
                <h3 className="text-lg font-bold text-[#17191D] mt-0.5">
                  Volume Cost Breakdown
                </h3>
                <p className="text-xs text-[#17191D]/70 mt-1">
                  Calculated automatically from configured business quantity tiers.
                </p>
              </div>

              {/* Pricing Cards */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 text-[#17191D]/70">
                  <span>Selected Model</span>
                  <span className="font-semibold text-[#17191D] text-right truncate max-w-[180px]">
                    {selectedProduct.name}
                  </span>
                </div>

                <div className="flex justify-between py-1 text-[#17191D]/70">
                  <span>Base Unit Price</span>
                  <span className="font-mono">
                    {BRAND_CONFIG.currency.symbol}
                    {pricing.baseUnitPrice}
                  </span>
                </div>

                <div className="flex justify-between py-1 text-emerald-700 font-semibold">
                  <span>Volume Tier ({pricing.tierLabel})</span>
                  <span className="font-mono">-{pricing.discountPercent}%</span>
                </div>

                <div className="flex justify-between py-1 text-[#17191D]/70">
                  <span>Discounted Unit Rate</span>
                  <span className="font-mono font-bold text-[#17191D]">
                    {BRAND_CONFIG.currency.symbol}
                    {pricing.unitPrice} / unit
                  </span>
                </div>

                <div className="flex justify-between py-1 text-[#17191D]/70">
                  <span>Hardware Subtotal ({quantity} units)</span>
                  <span className="font-mono font-bold text-[#17191D]">
                    {BRAND_CONFIG.currency.symbol}
                    {pricing.subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                {customPackaging && (
                  <div className="flex justify-between py-1 text-[#17191D]/70">
                    <span>Custom Branded Sleeves</span>
                    <span className="font-mono">
                      {BRAND_CONFIG.currency.symbol}
                      {pricing.packagingCost.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                <div className="flex justify-between py-1 text-[#17191D]/70">
                  <span>NFC Chip Encoding & Multi-URL Setup</span>
                  <span className="font-semibold text-emerald-700">Included Free</span>
                </div>

                <div className="flex justify-between py-1 text-[#17191D]/70">
                  <span>Pan-India Priority Air Freight</span>
                  <span className="font-semibold text-emerald-700">Included Free</span>
                </div>

                <div className="pt-3 border-t border-black/10 flex items-baseline justify-between text-base font-extrabold text-[#17191D]">
                  <span>Estimated Total</span>
                  <span className="text-xl font-mono text-[#123B2B]">
                    {BRAND_CONFIG.currency.symbol}
                    {pricing.estimatedTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Service Level Assurances */}
              <div className="p-4 bg-[#F8F6F0] rounded-xl border border-black/5 text-xs space-y-2">
                <div className="font-bold text-[#17191D] flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-[#123B2B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Enterprise Service Contract
                </div>
                <ul className="space-y-1 text-neutral-600 text-[11px] list-disc list-inside">
                  <li>Downloadable CSV mapping with branch-level redirect IDs</li>
                  <li>Dedicated account director with 2-hour SLA response</li>
                  <li>Pre-production physical sample proof before full volume run</li>
                  <li>Tax invoice with input credit (GST registered)</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
