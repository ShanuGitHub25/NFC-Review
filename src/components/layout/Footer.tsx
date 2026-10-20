import React from "react";
import { BRAND_CONFIG } from "../../config/brand";

interface FooterProps {
  onOpenPolicy: (policy: "shipping" | "returns" | "cancellation" | "privacy" | "terms") => void;
  onOpenCustomizer: () => void;
  onOpenBulk: () => void;
  onNavigateSection: (section: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPolicy,
  onOpenCustomizer,
  onOpenBulk,
  onNavigateSection,
}) => {
  return (
    <footer className="bg-[#17191D] text-[#F8F6F0] pt-16 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10 text-sm">
          {/* Brand Col (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[#2864F0] text-white flex items-center justify-center text-xs font-mono font-bold">
                RT
              </span>
              <span className="text-xl font-bold tracking-tight text-white">{BRAND_CONFIG.name}</span>
            </div>
            <p className="text-white/70 text-xs sm:text-sm max-w-sm leading-relaxed">
              {BRAND_CONFIG.tagline} {BRAND_CONFIG.promise}
            </p>

            <div className="pt-2 text-xs text-white/50 space-y-1">
              <p>Registered Office: {BRAND_CONFIG.contact.address}</p>
              <p>Support: {BRAND_CONFIG.contact.email} · {BRAND_CONFIG.contact.phone}</p>
              <p>{BRAND_CONFIG.contact.hours}</p>
            </div>

            {/* Direct WhatsApp Action */}
            <div className="pt-2">
              <a
                href={`https://wa.me/${BRAND_CONFIG.contact.whatsapp.replace(/[^0-9]/g, "")}?text=Hi%20ReviewTap,%20I%20would%20like%20to%20inquire%20about%20custom%20NFC%20cards`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold px-3.5 py-2 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.772.846 2.791.846 3.182 0 5.768-2.587 5.768-5.766.001-3.182-2.585-5.768-5.768-5.768zm0 10.364c-.886 0-1.666-.25-2.381-.676l-.17-.101-1.765.463.471-1.722-.112-.178c-.468-.748-.716-1.554-.715-2.384 0-2.536 2.064-4.6 4.602-4.6 2.538 0 4.602 2.064 4.602 4.6 0 2.537-2.064 4.598-4.522 4.598z" />
                </svg>
                Chat on WhatsApp (+91 98765 43210)
              </a>
            </div>
          </div>

          {/* Col 2: Products */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/50">Products</h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li>
                <button
                  onClick={() => onNavigateSection("collection")}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Signature NFC + QR Card
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection("collection")}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Acrylic Countertop Stand
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection("collection")}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Executive Black & Gold Card
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection("collection")}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Pastel Colour Pop Edition
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection("collection")}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Natural Beechwood Stand
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenCustomizer}
                  className="text-emerald-400 font-semibold hover:underline cursor-pointer text-left"
                >
                  Interactive Visual Customizer →
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Business & Enterprise */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/50">Enterprise</h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li>
                <button
                  onClick={onOpenBulk}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Volume Quotes & Tiers
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenBulk}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Multi-Store Branch Sets
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenBulk}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Agency White-Label Packs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection("solutions")}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Hospitality & Cafés
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection("solutions")}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Salons & Spas
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection("solutions")}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Healthcare Clinics
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Customer Policies & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/50">Policies & Trust</h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li>
                <button
                  onClick={() => onOpenPolicy("shipping")}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Shipping & Pan-India Delivery
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy("returns")}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Returns & Replacements
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy("cancellation")}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Custom Order Cancellation
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy("privacy")}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Privacy & Data Handling
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy("terms")}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Compliance & Currency */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <div>
            © {new Date().getFullYear()} {BRAND_CONFIG.name} Technologies Pvt. Ltd. All rights reserved.
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span>Currency: INR (₹)</span>
            <span aria-hidden="true">·</span>
            <span>Made in Bengaluru, India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
