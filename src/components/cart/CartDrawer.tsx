import React, { useState } from "react";
import { CartItem, Product } from "../../types";
import { BRAND_CONFIG } from "../../config/brand";
import { Storage } from "../../utils/storage";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onEditCustomDesign: (item: CartItem) => void;
  onProceedToCheckout: () => void;
  onStartShopping: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onEditCustomDesign,
  onProceedToCheckout,
  onStartShopping,
}) => {
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountPercent: number;
    description: string;
  } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Subtotal calculation
  const subtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);

  // Coupon discount calculation
  const couponDiscount = appliedCoupon ? Math.round((subtotal * appliedCoupon.discountPercent) / 100) : 0;

  // Shipping calculation
  const isFreeShipping = subtotal >= BRAND_CONFIG.shipping.standardFreeThreshold;
  const shippingFee = cart.length === 0 ? 0 : isFreeShipping ? 0 : BRAND_CONFIG.shipping.standardFee;

  const total = Math.max(0, subtotal - couponDiscount + shippingFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    const found = BRAND_CONFIG.coupons.find(
      (c) => c.code.toUpperCase() === couponCode.trim().toUpperCase()
    );

    if (found) {
      setAppliedCoupon(found);
      setCouponCode("");
    } else {
      setCouponError("Invalid coupon code. Try 'TAP10' or 'GROWTH20'");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-fade-in">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-black/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-extrabold text-[#17191D]">Your Review Cart</h2>
            <span className="text-xs font-mono font-bold text-[#123B2B] bg-[#123B2B]/10 px-2 py-0.5 rounded-full">
              {cart.reduce((sum, item) => sum + item.quantity, 0)} items
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close cart"
            className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center text-neutral-500 hover:text-black hover:bg-black/5 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="px-6 py-3 bg-[#F8F6F0] border-b border-black/5 text-xs">
          {isFreeShipping ? (
            <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
              <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
              <span>You unlocked Free Pan-India Air Delivery!</span>
            </div>
          ) : (
            <div>
              <div className="flex justify-between text-neutral-600 mb-1">
                <span>
                  Add {BRAND_CONFIG.currency.symbol}
                  {(BRAND_CONFIG.shipping.standardFreeThreshold - subtotal).toLocaleString("en-IN")}{" "}
                  more for Free Air Delivery
                </span>
                <span className="font-mono font-bold">
                  {Math.round((subtotal / BRAND_CONFIG.shipping.standardFreeThreshold) * 100)}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-black/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#123B2B] rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      (subtotal / BRAND_CONFIG.shipping.standardFreeThreshold) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Cart Line Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-[#17191D]">Your cart is empty</h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Choose a card or open the visual customizer to get started.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onStartShopping();
                }}
                className="px-5 py-2.5 bg-[#123B2B] text-white font-bold text-xs rounded-xl shadow-xs hover:bg-[#0c281d] transition-colors cursor-pointer"
              >
                Explore Hardware →
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.cartItemId}
                className="p-4 rounded-xl border border-black/10 bg-neutral-50/50 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-[#17191D] leading-snug">
                      {item.product.name}
                    </h4>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      Finish: {item.selectedVariant.name}
                    </p>

                    {item.customDesign && (
                      <div className="mt-1 text-[10px] font-mono text-[#123B2B] bg-[#123B2B]/10 px-2 py-0.5 rounded inline-block">
                        Custom: "{item.customDesign.businessName}"
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.cartItemId)}
                    aria-label="Remove item"
                    className="text-neutral-400 hover:text-red-600 transition-colors text-xs p-1 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-black/5 text-xs">
                  {/* Quantity controls */}
                  <div className="flex items-center border border-black/15 rounded-lg overflow-hidden bg-white">
                    <button
                      onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                      className="px-2.5 py-1 hover:bg-neutral-100 font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 font-mono font-bold text-xs">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                      className="px-2.5 py-1 hover:bg-neutral-100 font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Actions & Price */}
                  <div className="flex items-center gap-3">
                    {item.customDesign && (
                      <button
                        onClick={() => {
                          onEditCustomDesign(item);
                          onClose();
                        }}
                        className="text-[11px] text-[#2864F0] font-semibold hover:underline cursor-pointer"
                      >
                        Edit Design
                      </button>
                    )}
                    <span className="font-mono font-bold text-[#123B2B] text-sm">
                      {BRAND_CONFIG.currency.symbol}
                      {item.totalPrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer / Checkout Summary */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-black/10 bg-white space-y-4">
            {/* Coupon Box */}
            <form onSubmit={handleApplyCoupon} className="space-y-1">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Coupon code (e.g. TAP10)"
                  className="flex-1 px-3 py-2 text-xs border border-black/15 rounded-xl uppercase font-mono focus:outline-hidden focus:ring-1 focus:ring-[#123B2B]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-[#17191D] font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>

              {couponError && (
                <p className="text-[10px] text-red-600 font-medium">{couponError}</p>
              )}
              {appliedCoupon && (
                <div className="flex items-center justify-between text-[11px] text-emerald-800 bg-emerald-50 px-2 py-1 rounded">
                  <span>Coupon {appliedCoupon.code} applied ({appliedCoupon.discountPercent}% off)</span>
                  <button
                    onClick={() => setAppliedCoupon(null)}
                    className="text-red-500 font-bold ml-2 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}
            </form>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono">
                  {BRAND_CONFIG.currency.symbol}
                  {subtotal.toLocaleString("en-IN")}
                </span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount</span>
                  <span className="font-mono">
                    -{BRAND_CONFIG.currency.symbol}
                    {couponDiscount.toLocaleString("en-IN")}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {shippingFee === 0 ? (
                    <span className="text-emerald-700 font-semibold">Free Pan-India</span>
                  ) : (
                    <span className="font-mono">
                      {BRAND_CONFIG.currency.symbol}
                      {shippingFee}
                    </span>
                  )}
                </span>
              </div>

              <div className="pt-2 border-t border-black/10 flex justify-between items-baseline font-black text-base text-[#17191D]">
                <span>Total Due</span>
                <span className="text-xl font-mono text-[#123B2B]">
                  {BRAND_CONFIG.currency.symbol}
                  {total.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3.5 bg-[#123B2B] hover:bg-[#0c281d] text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
