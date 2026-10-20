import React, { useState } from "react";
import { CartItem, Order, ShippingAddress, OrderTrackingEvent } from "../../types";
import { BRAND_CONFIG } from "../../config/brand";
import { lookupIndiaPostalCode } from "../../utils/indiaPostal";
import { Storage } from "../../utils/storage";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onOrderCompleted: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  onOrderCompleted,
}) => {
  const [step, setStep] = useState<"shipping" | "payment" | "confirmed">("shipping");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Customer Shipping Details
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [gstin, setGstin] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [postalCode, setPostalCode] = useState("560038");
  const [city, setCity] = useState("Bengaluru");
  const [state, setState] = useState("Karnataka");
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");
  const [artworkConfirmed, setArtworkConfirmed] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(true);

  // Payment Options
  const [paymentMethod, setPaymentMethod] = useState<
    "razorpay-upi" | "razorpay-card" | "netbanking" | "cod"
  >("razorpay-upi");
  const [upiVpa, setUpiVpa] = useState("user@okhdfcbank");

  if (!isOpen) return null;

  // Real-time postal code auto-fill
  const handlePinChange = (pin: string) => {
    setPostalCode(pin);
    const info = lookupIndiaPostalCode(pin);
    if (info.valid && info.city && info.state) {
      setCity(info.city);
      setState(info.state);
    }
  };

  const subtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  const isFreeStandard = subtotal >= BRAND_CONFIG.shipping.standardFreeThreshold;
  const shippingFee =
    shippingMethod === "express"
      ? BRAND_CONFIG.shipping.expressFee
      : isFreeStandard
      ? 0
      : BRAND_CONFIG.shipping.standardFee;
  const total = subtotal + shippingFee;

  // Shipping submission
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !addressLine1 || !postalCode) {
      alert("Please fill in all required shipping fields.");
      return;
    }
    if (!artworkConfirmed || !termsAccepted) {
      alert("Please accept the terms and custom artwork verification.");
      return;
    }
    setStep("payment");
  };

  // Payment submission & Order Creation
  const handleExecutePayment = () => {
    setIsProcessingPayment(true);

    setTimeout(() => {
      const orderId = "RT-" + Math.floor(10000 + Math.random() * 90000);
      const trackingHistory: OrderTrackingEvent[] = [
        {
          status: "order-received",
          label: "Order Placed & Verified",
          description: `Payment confirmed via ${paymentMethod.toUpperCase()} (Test Gateway).`,
          timestamp: "Just now",
          completed: true,
        },
        {
          status: "artwork-approved",
          label: "Design Proof Queued",
          description: "Vector logo and Google destination link scheduled for lab inspection.",
          timestamp: "Next 2 hours",
          completed: false,
        },
        {
          status: "manufacturing",
          label: "Thermal UV Print & NFC Encoding",
          description: "High-resolution thermal printing & 13.56 MHz chip write cycle.",
          timestamp: "Pending",
          completed: false,
        },
        {
          status: "ready-to-dispatch",
          label: "Quality Inspection",
          description: "RF resonance testing and optical QR scan validation.",
          timestamp: "Pending",
          completed: false,
        },
        {
          status: "shipped",
          label: "Dispatched via Express Air",
          description: "Tracking airway bill generated.",
          timestamp: "Pending",
          completed: false,
        },
      ];

      const newOrder: Order = {
        id: orderId,
        createdAt: new Date().toISOString(),
        customer: {
          fullName,
          email,
          phone,
          businessName,
          gstin,
          addressLine1,
          addressLine2,
          city,
          state,
          postalCode,
          country: "India",
        },
        items: cart,
        subtotal,
        discountAmount: 0,
        shippingFee,
        shippingMethod,
        total,
        status: "order-received",
        trackingHistory,
        paymentMethod,
        paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
        paymentId: "pay_test_" + Math.random().toString(36).substring(2, 10),
      };

      Storage.saveOrder(newOrder);
      Storage.setCart([]); // Clear cart
      setIsProcessingPayment(false);
      setConfirmedOrder(newOrder);
      setStep("confirmed");
      onOrderCompleted(newOrder);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-black/10 overflow-hidden relative">
        {/* Header */}
        <div className="px-6 py-4 border-b border-black/10 flex items-center justify-between bg-neutral-50/70">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-[#123B2B] text-white flex items-center justify-center text-[10px] font-mono font-bold">
              RT
            </span>
            <span className="text-sm font-bold text-[#17191D]">
              Secure Checkout · {BRAND_CONFIG.name}
            </span>
          </div>

          {step !== "confirmed" && (
            <button
              onClick={onClose}
              className="text-xs text-neutral-400 hover:text-black cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Step 1: Shipping Address & GST */}
        {step === "shipping" && (
          <form onSubmit={handleProceedToPayment} className="p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-xl font-black text-[#17191D]">Shipping & Billing Details</h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Ensure delivery contact and business name match for official tax invoicing.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#17191D] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-black/15 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#123B2B]"
                  placeholder="Arjun Sharma"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17191D] mb-1">
                  Business Email (for order confirmation) *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-black/15 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#123B2B]"
                  placeholder="arjun@company.in"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17191D] mb-1">
                  Mobile Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-black/15 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#123B2B]"
                  placeholder="+91 98450 12345"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17191D] mb-1">
                  Business / Brand Name (Optional)
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-black/15 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#123B2B]"
                  placeholder="The Coffee Roaster LLC"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#17191D] mb-1">
                  Street Address & Suite / Floor *
                </label>
                <input
                  type="text"
                  required
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-black/15 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#123B2B]"
                  placeholder="Unit 4B, 100 Feet Road, Indiranagar"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17191D] mb-1">
                  Indian PIN Code *
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={postalCode}
                  onChange={(e) => handlePinChange(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs font-mono border border-black/15 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#123B2B]"
                  placeholder="560038"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17191D] mb-1">
                  City & State *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-black/15 rounded-xl"
                    placeholder="City"
                  />
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-black/15 rounded-xl"
                    placeholder="State"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Method Option */}
            <div className="pt-2 border-t border-black/10">
              <label className="block text-xs font-bold text-[#17191D] mb-2">
                Select Shipping Velocity
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setShippingMethod("standard")}
                  className={`p-3 rounded-xl border text-left flex justify-between items-center transition-colors ${
                    shippingMethod === "standard"
                      ? "border-[#123B2B] bg-[#123B2B]/5 text-[#123B2B] font-bold"
                      : "border-black/10 text-neutral-600 hover:border-black/30"
                  }`}
                >
                  <div>
                    <span>Standard Air Cargo</span>
                    <span className="block text-[10px] text-neutral-400 font-normal">
                      3-5 business days pan-India
                    </span>
                  </div>
                  <span className="font-mono">
                    {isFreeStandard ? "FREE" : `₹${BRAND_CONFIG.shipping.standardFee}`}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setShippingMethod("express")}
                  className={`p-3 rounded-xl border text-left flex justify-between items-center transition-colors ${
                    shippingMethod === "express"
                      ? "border-[#123B2B] bg-[#123B2B]/5 text-[#123B2B] font-bold"
                      : "border-black/10 text-neutral-600 hover:border-black/30"
                  }`}
                >
                  <div>
                    <span>Priority Express Air</span>
                    <span className="block text-[10px] text-neutral-400 font-normal">
                      1-2 business days express courier
                    </span>
                  </div>
                  <span className="font-mono">₹{BRAND_CONFIG.shipping.expressFee}</span>
                </button>
              </div>
            </div>

            {/* Terms and Artwork Confirmation */}
            <div className="space-y-2 pt-2 border-t border-black/10 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={artworkConfirmed}
                  onChange={(e) => setArtworkConfirmed(e.target.checked)}
                  className="w-4 h-4 accent-[#123B2B] rounded"
                />
                <span className="text-neutral-700">
                  I confirm that the Google Review URL and custom logos submitted are accurate for physical printing and NFC encoding.
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="w-4 h-4 accent-[#123B2B] rounded"
                />
                <span className="text-neutral-700">
                  I agree to the Terms of Service and Cancellation Policy for customized products.
                </span>
              </label>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-black/10">
              <div>
                <span className="text-xs text-neutral-500 block">Total Due:</span>
                <span className="text-xl font-bold font-mono text-[#123B2B]">
                  {BRAND_CONFIG.currency.symbol}
                  {total.toLocaleString("en-IN")}
                </span>
              </div>

              <button
                type="submit"
                className="py-3 px-6 bg-[#123B2B] hover:bg-[#0c281d] text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
              >
                Proceed to Payment →
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Payment Gateway (Test Mode / Razorpay Simulation) */}
        {step === "payment" && (
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md inline-block mb-1">
                🔒 Razorpay Payment Engine (Sandbox Test Mode)
              </div>
              <h2 className="text-xl font-black text-[#17191D]">Select Payment Method</h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Transactions are verified with cryptographic backend test signatures.
              </p>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <button
                type="button"
                onClick={() => setPaymentMethod("razorpay-upi")}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  paymentMethod === "razorpay-upi"
                    ? "border-[#123B2B] bg-[#123B2B]/5 text-[#123B2B] font-bold ring-1 ring-[#123B2B]"
                    : "border-black/10 hover:border-black/25 text-neutral-700"
                }`}
              >
                <div className="font-bold text-sm mb-1">UPI Instant</div>
                <span className="text-[10px] text-neutral-500 block">GPay / PhonePe / Paytm</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("razorpay-card")}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  paymentMethod === "razorpay-card"
                    ? "border-[#123B2B] bg-[#123B2B]/5 text-[#123B2B] font-bold ring-1 ring-[#123B2B]"
                    : "border-black/10 hover:border-black/25 text-neutral-700"
                }`}
              >
                <div className="font-bold text-sm mb-1">Debit / Credit</div>
                <span className="text-[10px] text-neutral-500 block">Visa, MC, RuPay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("netbanking")}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  paymentMethod === "netbanking"
                    ? "border-[#123B2B] bg-[#123B2B]/5 text-[#123B2B] font-bold ring-1 ring-[#123B2B]"
                    : "border-black/10 hover:border-black/25 text-neutral-700"
                }`}
              >
                <div className="font-bold text-sm mb-1">NetBanking</div>
                <span className="text-[10px] text-neutral-500 block">HDFC, ICICI, SBI</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("cod")}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  paymentMethod === "cod"
                    ? "border-[#123B2B] bg-[#123B2B]/5 text-[#123B2B] font-bold ring-1 ring-[#123B2B]"
                    : "border-black/10 hover:border-black/25 text-neutral-700"
                }`}
              >
                <div className="font-bold text-sm mb-1">Cash on Delivery</div>
                <span className="text-[10px] text-neutral-500 block">Verified PIN only</span>
              </button>
            </div>

            {/* UPI Details Mock */}
            {paymentMethod === "razorpay-upi" && (
              <div className="p-4 bg-neutral-50 rounded-xl border border-black/10 space-y-3">
                <label className="block text-xs font-bold text-[#17191D]">
                  Enter Virtual Payment Address (VPA / UPI ID)
                </label>
                <input
                  type="text"
                  value={upiVpa}
                  onChange={(e) => setUpiVpa(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs font-mono border border-black/15 rounded-xl bg-white"
                  placeholder="yourname@okhdfcbank"
                />
                <span className="text-[10px] text-neutral-400 block">
                  A payment notification request will simulate authorization on your UPI app.
                </span>
              </div>
            )}

            {/* Summary Box */}
            <div className="p-4 bg-[#F8F6F0] rounded-xl border border-black/10 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-neutral-500">Subtotal ({cart.length} line items):</span>
                <span className="font-mono">{BRAND_CONFIG.currency.symbol}{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Shipping:</span>
                <span className="font-mono">{shippingFee === 0 ? "FREE" : `₹${shippingFee}`}</span>
              </div>
              <div className="pt-2 border-t border-black/10 flex justify-between font-bold text-sm text-[#17191D]">
                <span>Total Amount:</span>
                <span className="font-mono text-[#123B2B]">{BRAND_CONFIG.currency.symbol}{total.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep("shipping")}
                className="text-xs text-neutral-600 hover:underline"
              >
                ← Back to Shipping
              </button>

              <button
                type="button"
                onClick={handleExecutePayment}
                disabled={isProcessingPayment}
                className="py-3 px-6 bg-[#123B2B] hover:bg-[#0c281d] disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer flex items-center gap-2"
              >
                {isProcessingPayment ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>Authorizing Payment...</span>
                  </>
                ) : (
                  <span>
                    Pay {BRAND_CONFIG.currency.symbol}
                    {total.toLocaleString("en-IN")} & Complete Order
                  </span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmed Screen */}
        {step === "confirmed" && confirmedOrder && (
          <div className="p-8 sm:p-10 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <div>
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Payment Confirmed · Ref #{confirmedOrder.id}
              </span>
              <h2 className="text-2xl font-black text-[#17191D] mt-3">
                Your ReviewTap Order Has Been Placed!
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto mt-2">
                We've sent a detailed confirmation to <strong>{confirmedOrder.customer.email}</strong>. Our hardware engineers are now verifying your Google Review destination URL.
              </p>
            </div>

            <div className="max-w-md mx-auto p-4 bg-neutral-50 rounded-xl border border-black/5 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-neutral-500">Order ID:</span>
                <span className="font-mono font-bold">{confirmedOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Delivery Address:</span>
                <span className="text-[#17191D] text-right">
                  {confirmedOrder.customer.addressLine1}, {confirmedOrder.customer.city} ({confirmedOrder.customer.postalCode})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Payment Status:</span>
                <span className="font-bold text-emerald-700 uppercase">{confirmedOrder.paymentStatus}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 text-xs font-semibold text-neutral-700 bg-white border border-black/15 rounded-xl hover:bg-neutral-50"
              >
                Print Receipt
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 text-xs font-bold text-white bg-[#123B2B] hover:bg-[#0c281d] rounded-xl shadow-xs"
              >
                Done / Return to Storefront
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
