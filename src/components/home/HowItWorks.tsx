import React, { useState } from "react";

export const HowItWorks: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      num: "01",
      title: "Select Form Factor",
      tagline: "Pocket card, tabletop stand, or enterprise multi-store fleet.",
      details:
        "Choose between our portable 85.6 × 54mm PVC card, weighted 5mm acrylic countertop stand, or natural beechwood block depending on your checkout flow.",
      technicalNote: "Hardware Selection: ISO/IEC 7810 ID-1 standard or A6 upright display.",
    },
    {
      num: "02",
      title: "Customize Identity",
      tagline: "Upload vector brand assets, set typography, and calibrate colors.",
      details:
        "Our live studio customizer renders your changes instantaneously. Toggle dark or light themes, fine-tune RGB/Pantone hex values, and check safe 3mm print bleed boundaries.",
      technicalNote: "Artwork Proofing: High-resolution vector SVG export with verified 300 DPI layout.",
    },
    {
      num: "03",
      title: "Connect Google Review Link",
      tagline: "Enter your official Google Maps place or managed redirect URL.",
      details:
        "The system instantly generates a clean optical QR matrix with quiet zone protection and prepares the hexadecimal NDEF payload for the contactless NFC chip.",
      technicalNote: "Dual-Encoding: Dynamic QR code paired with 13.56 MHz NTAG213 radio frequency encoding.",
    },
    {
      num: "04",
      title: "Fabricate & Ship",
      tagline: "Thermal UV printing, dual-field inspection, and pan-India dispatch.",
      details:
        "Our technicians UV-cure the artwork onto rigid recycled PVC, encode and lock the NFC chip, test read cycles, and package your order with protective sleeves for swift delivery.",
      technicalNote: "Quality Assurance: 100% contactless frequency resonance & camera scan validation before dispatch.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white border-t border-black/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-mono font-bold text-[#123B2B] uppercase tracking-wider mb-2">
            Production & Engineering Workflow
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#17191D]">
            How ReviewTap Works
          </h2>
          <p className="text-sm text-[#17191D]/70 mt-2">
            A seamless bridge between digital design customisation and precision physical hardware manufacturing.
          </p>
        </div>

        {/* 4 Steps Interactive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const isSelected = activeStep === idx;

            return (
              <div
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "border-[#123B2B] ring-2 ring-[#123B2B]/20 bg-[#F8F6F0]/60 shadow-sm"
                    : "border-black/10 hover:border-black/25 bg-white"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-2xl font-extrabold text-[#123B2B]">
                      {step.num}
                    </span>
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        isSelected ? "bg-[#123B2B]" : "bg-neutral-200"
                      }`}
                    />
                  </div>

                  <h3 className="text-lg font-bold text-[#17191D] mb-1.5">{step.title}</h3>
                  <p className="text-xs font-medium text-[#17191D]/80 mb-3">{step.tagline}</p>
                  <p className="text-xs text-[#17191D]/65 leading-relaxed">{step.details}</p>
                </div>

                <div className="mt-5 pt-4 border-t border-black/10 text-[10px] font-mono text-neutral-500">
                  {step.technicalNote}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
