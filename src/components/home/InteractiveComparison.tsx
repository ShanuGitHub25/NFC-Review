import React from "react";

export const InteractiveComparison: React.FC = () => {
  const comparisonData = [
    {
      feature: "Contactless NFC Tap (13.56 MHz)",
      qrOnly: "No",
      nfcQrCard: "Yes (NTAG213)",
      countertopStand: "Yes (NTAG215)",
      enterpriseSet: "Yes (Multi-UID)",
    },
    {
      feature: "High-Contrast Optical QR Code",
      qrOnly: "Yes",
      nfcQrCard: "Yes",
      countertopStand: "Yes (A6 Optical Matrix)",
      enterpriseSet: "Yes (Unique per location)",
    },
    {
      feature: "Customer Friction",
      qrOnly: "Open camera app & focus",
      nfcQrCard: "Single tap (<0.5s) or camera scan",
      countertopStand: "Hands-free tap at eye-level tilt",
      enterpriseSet: "Instant tap with branch routing",
    },
    {
      feature: "Form Factor & Material",
      qrOnly: "0.76mm Standard PVC",
      nfcQrCard: "0.84mm Scratch-Proof PVC",
      countertopStand: "5mm Diamond Cast Acrylic",
      enterpriseSet: "Fleet set of 10-50 PVC / Stands",
    },
    {
      feature: "Sanitizer & Water Resistance",
      qrOnly: "Moderate",
      nfcQrCard: "High (Sealed Substrate)",
      countertopStand: "Commercial Grade Cleanable",
      enterpriseSet: "High (Commercial Duty)",
    },
    {
      feature: "Multi-Location Managed Redirect",
      qrOnly: "Static print only",
      nfcQrCard: "Supported via ReviewTap /r/ ID",
      countertopStand: "Supported via ReviewTap /r/ ID",
      enterpriseSet: "Centralized multi-store dashboard",
    },
    {
      feature: "Best Suited Environment",
      qrOnly: "Budget promotions",
      nfcQrCard: "Mobile staff, bill presentation",
      countertopStand: "Busy checkout registers & desks",
      enterpriseSet: "Chains, franchises & agencies",
    },
  ];

  return (
    <section id="comparison" className="py-20 bg-[#F8F6F0] border-t border-black/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-mono font-bold text-[#123B2B] uppercase tracking-wider mb-2">
            Technical Specification Matrix
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#17191D]">
            Compare Form Factors & Capabilities
          </h2>
          <p className="text-sm text-[#17191D]/70 mt-2">
            Understand the exact physical and technological differences so you can deploy the right hardware for your premises.
          </p>
        </div>

        {/* Comparison Table Container */}
        <div className="bg-white rounded-2xl border border-black/10 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-black/10 bg-neutral-50/70">
                  <th className="py-4 px-5 font-bold text-[#17191D] w-1/4">Specification</th>
                  <th className="py-4 px-5 font-semibold text-neutral-600">Standard QR Card</th>
                  <th className="py-4 px-5 font-bold text-[#123B2B] bg-[#123B2B]/5">
                    ReviewTap NFC+QR Card
                  </th>
                  <th className="py-4 px-5 font-semibold text-neutral-800">Acrylic Stand</th>
                  <th className="py-4 px-5 font-semibold text-[#2864F0]">Multi-Store Set</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {comparisonData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="py-3.5 px-5 font-medium text-[#17191D]">{row.feature}</td>
                    <td className="py-3.5 px-5 text-neutral-500">{row.qrOnly}</td>
                    <td className="py-3.5 px-5 font-semibold text-[#123B2B] bg-[#123B2B]/5">
                      {row.nfcQrCard}
                    </td>
                    <td className="py-3.5 px-5 text-[#17191D]">{row.countertopStand}</td>
                    <td className="py-3.5 px-5 text-[#2864F0] font-medium">{row.enterpriseSet}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
