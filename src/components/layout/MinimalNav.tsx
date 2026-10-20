import React, { useState } from "react";
import { BRAND_CONFIG } from "../../config/brand";

interface MinimalNavProps {
  cartCount: number;
  onOpenCart: () => void;
  onScrollTo: (sectionId: string) => void;
  onOpenAccount: () => void;
  onOpenAdmin: () => void;
}

export const MinimalNav: React.FC<MinimalNavProps> = ({
  cartCount,
  onOpenCart,
  onScrollTo,
  onOpenAccount,
  onOpenAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#111114]/80 backdrop-blur-md border-b border-white/10 text-white transition-colors">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button
            onClick={() => onScrollTo("hero")}
            className="flex items-center gap-3 text-left cursor-pointer group"
          >
            <span className="w-8 h-8 rounded-lg bg-white text-[#111114] flex items-center justify-center font-bold font-mono text-xs group-hover:bg-[#2864FF] group-hover:text-white transition-colors">
              RT
            </span>
            <div className="leading-tight">
              <span className="text-lg font-black tracking-tight text-white block">
                {BRAND_CONFIG.name}
              </span>
              <span className="text-[10px] font-mono text-neutral-400 tracking-wider uppercase block">
                NFC + QR Cards
              </span>
            </div>
          </button>

          {/* Minimal Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-wider uppercase text-neutral-300">
            <button
              onClick={() => onScrollTo("designs")}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Designs
            </button>
            <button
              onClick={() => onScrollTo("how-it-works")}
              className="hover:text-white transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => onScrollTo("custom-upload")}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Custom Artwork
            </button>
            <button
              onClick={() => onScrollTo("faq")}
              className="hover:text-white transition-colors cursor-pointer"
            >
              FAQ
            </button>
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-3">
            {/* Account / Track orders */}
            <button
              onClick={onOpenAccount}
              className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-xs font-mono hidden sm:flex items-center gap-1.5"
              title="Track Orders"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Orders</span>
            </button>

            {/* Admin console button */}
            <button
              onClick={onOpenAdmin}
              className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-xs font-mono hidden lg:block"
              title="Admin Fulfilment"
            >
              Admin
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              aria-label={`Cart with ${cartCount} items`}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-mono text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
            >
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>Cart</span>
              <span className="w-5 h-5 rounded-full bg-white text-[#111114] flex items-center justify-center font-bold text-[10px]">
                {cartCount}
              </span>
            </button>

            {/* Primary Order CTA */}
            <button
              onClick={() => onScrollTo("designs")}
              className="hidden sm:inline-flex items-center px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-[#111114] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-md"
            >
              Order Now
            </button>

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg cursor-pointer"
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
        <div className="md:hidden bg-[#111114] border-b border-white/10 px-6 py-4 space-y-3">
          <button
            onClick={() => {
              onScrollTo("designs");
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white"
          >
            Designs
          </button>
          <button
            onClick={() => {
              onScrollTo("how-it-works");
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white"
          >
            How It Works
          </button>
          <button
            onClick={() => {
              onScrollTo("custom-upload");
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white"
          >
            Upload Custom Artwork
          </button>
          <button
            onClick={() => {
              onScrollTo("faq");
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white"
          >
            FAQ
          </button>
          <button
            onClick={() => {
              onOpenAccount();
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-xs font-bold uppercase tracking-wider text-emerald-400"
          >
            Track Orders & Account
          </button>
        </div>
      )}
    </header>
  );
};
