import React, { useState } from "react";

export const CompactFaq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does the contactless NFC tap work for customers?",
      a: "Every ReviewTap card contains an embedded 13.56 MHz NTAG microchip. When any iPhone (XR and newer) or NFC-enabled Android smartphone approaches the card within 2–4 cm, a native system push notification appears automatically. Customers tap the notification to open your official Google Review dialog. No apps or battery required.",
    },
    {
      q: "What if a customer has an older phone without NFC?",
      a: "Every ReviewTap card is dual-channel: it features both an NFC microchip and a laser-calibrated high-contrast optical QR code. Customers with older phones simply point their native camera at the QR code to reach the exact same review destination.",
    },
    {
      q: "Can I change my Google Review destination link later?",
      a: "Yes. All ReviewTap cards are routed through our secure managed redirect service (/r/{cardId}). If your business changes locations, rebrands, or updates its Google Business Profile link, our support team updates the destination remotely with zero re-printing needed.",
    },
    {
      q: "What is the dispatch and delivery timeline across India?",
      a: "Because each card is physically encoded and quality-inspected, orders are dispatched via Blue Dart or Delhivery Air within 2 business days from our Bengaluru facility. Transit typically takes 1–2 business days for metro cities and 3–4 days for other Indian PIN codes.",
    },
    {
      q: "Can I order multiple cards for different branch locations?",
      a: "Absolutely. You can order a fleet of cards where each card is mapped to a branch-specific Google Place ID. During checkout or custom upload, specify your branch names and our technicians will program and serialize each card individually.",
    },
  ];

  return (
    <section id="faq" className="py-24 bg-[#111114] text-[#F7F4ED] border-t border-white/10 select-none">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
            Essential Questions
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400">
            Clear, honest answers about NFC hardware, phone compatibility, and delivery.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left p-5 flex items-center justify-between text-xs sm:text-sm font-bold text-white hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span className="font-mono text-base text-neutral-400">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-neutral-300 leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
