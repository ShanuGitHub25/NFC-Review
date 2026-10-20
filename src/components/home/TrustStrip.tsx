import React from "react";

export const TrustStrip: React.FC = () => {
  const benefits = [
    {
      title: "Custom Branding",
      description: "Edge-to-edge Pantone color matching, precision vector logo UV printing, and custom fonts.",
    },
    {
      title: "Dual NFC + QR Access",
      description: "Works with 99%+ of smartphones. Instant 13.56 MHz contactless tap or high-contrast camera scan.",
    },
    {
      title: "Volume Quote Architecture",
      description: "Graduated volume discounts for restaurant tables, multi-location clinics, and retail franchises.",
    },
    {
      title: "Commercial Durability",
      description: "0.84mm recycled PVC, water-resistant acrylic, and UV-sealed inks built for busy counters.",
    },
    {
      title: "Pan-India Courier Network",
      description: "Air express delivery across Bengaluru, Mumbai, Delhi NCR, Chennai, Hyderabad, and all Indian PINs.",
    },
  ];

  return (
    <section className="border-y border-black/10 bg-white/60 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {benefits.map((b, idx) => (
            <div key={idx} className="space-y-1.5 text-left">
              <div className="text-xs font-mono font-bold text-[#123B2B]">
                0{idx + 1}.
              </div>
              <h3 className="text-sm font-bold text-[#17191D]">{b.title}</h3>
              <p className="text-xs text-[#17191D]/70 leading-relaxed">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
