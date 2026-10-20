import React, { useState } from "react";
import { BRAND_CONFIG } from "../../config/brand";

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenCustomizer: () => void;
  onOpenBulk: () => void;
  onOpenAccount: () => void;
  onOpenAdmin: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenCustomizer,
  onOpenBulk,
  onOpenAccount,
  onOpenAdmin,
  onNavigateSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#F8F6F0]/95 backdrop-blur-md border-b border-black/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => onNavigateSection("hero")}
            className="text-xl sm:text-2xl font-black tracking-tight text-[#17191D] hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 text-left flex items-center gap-2 cursor-pointer"
          >
            <span className="w-7 h-7 rounded-lg bg-[#123B2B] text-white flex items-center justify-center text-xs font-mono font-bold">
              RT
            </span>
            <span>{BRAND_CONFIG.name}</span>
          </button>

          {/* Zone 2: 4–5 clean single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-[#17191D]/80">
            <button
              onClick={() => onNavigateSection("collection")}
              className="hover:text-[#17191D] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Shop
            </button>
            <button
              onClick={onOpenCustomizer}
              className="hover:text-[#17191D] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Customise
            </button>
            <button
              onClick={onOpenBulk}
              className="hover:text-[#17191D] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Bulk Orders
            </button>
            <button
              onClick={() => onNavigateSection("how-it-works")}
              className="hover:text-[#17191D] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => onNavigateSection("solutions")}
              className="hover:text-[#17191D] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Business Solutions
            </button>
            <button
              onClick={() => onNavigateSection("comparison")}
              className="hover:text-[#17191D] transition-colors whitespace-nowrap shrink-0 cursor-pointer text-xs opacity-70"
            >
              Compare
            </button>
          </nav>

          {/* Zone 3: Primary action + Cart & Account tools */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Account trigger */}
            <button
              onClick={onOpenAccount}
              aria-label="Account and orders"
              className="p-2 text-[#17191D]/80 hover:text-[#17191D] hover:bg-black/5 rounded-lg transition-colors cursor-pointer"
              title="Customer Account & Orders"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>

            {/* Admin portal trigger */}
            <button
              onClick={onOpenAdmin}
              aria-label="Admin Dashboard"
              className="p-2 text-[#17191D]/80 hover:text-[#17191D] hover:bg-black/5 rounded-lg transition-colors cursor-pointer hidden sm:block"
              title="Admin Dashboard & Manufacturing"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            {/* Cart Trigger */}
            <button
              onClick={onOpenCart}
              aria-label={`Shopping Cart with ${cartCount} items`}
              className="relative p-2.5 text-[#17191D] bg-white border border-black/10 hover:border-black/30 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <svg className="w-5 h-5 text-[#123B2B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="font-mono text-xs font-bold text-[#123B2B] tabular-nums">
                {cartCount}
              </span>
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onOpenCustomizer}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white bg-[#123B2B] hover:bg-[#0c281d] rounded-xl shadow-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Design Your Card
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="lg:hidden p-2 text-[#17191D] hover:bg-black/5 rounded-lg transition-colors cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#F8F6F0] border-b border-black/10 px-4 pt-2 pb-6 space-y-3 animate-fade-in">
          <div className="flex flex-col space-y-2 text-sm font-semibold text-[#17191D]">
            <button
              onClick={() => {
                onNavigateSection("collection");
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 rounded-lg hover:bg-black/5 transition-colors"
            >
              Shop Collection
            </button>
            <button
              onClick={() => {
                onOpenCustomizer();
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 rounded-lg hover:bg-black/5 transition-colors text-[#123B2B] font-bold"
            >
              Interactive Card Customizer
            </button>
            <button
              onClick={() => {
                onOpenBulk();
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 rounded-lg hover:bg-black/5 transition-colors"
            >
              Bulk Orders & Enterprise
            </button>
            <button
              onClick={() => {
                onNavigateSection("how-it-works");
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 rounded-lg hover:bg-black/5 transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => {
                onNavigateSection("solutions");
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 rounded-lg hover:bg-black/5 transition-colors"
            >
              Business Solutions
            </button>
            <button
              onClick={() => {
                onOpenAccount();
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 rounded-lg hover:bg-black/5 transition-colors"
            >
              My Orders & Account
            </button>
            <button
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 rounded-lg hover:bg-black/5 transition-colors text-neutral-600"
            >
              Admin Dashboard
            </button>
          </div>

          <div className="pt-2 border-t border-black/10">
            <button
              onClick={() => {
                onOpenCustomizer();
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 bg-[#123B2B] text-white font-bold text-xs rounded-xl shadow-sm text-center"
            >
              Start Designing Your Card →
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
