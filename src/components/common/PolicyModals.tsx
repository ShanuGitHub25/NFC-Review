import React from "react";
import { BRAND_CONFIG } from "../../config/brand";

export type PolicyType = "shipping" | "returns" | "cancellation" | "privacy" | "terms";

interface PolicyModalProps {
  type: PolicyType | null;
  onClose: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  const content: Record<
    PolicyType,
    { title: string; subtitle: string; sections: { heading: string; body: string }[] }
  > = {
    shipping: {
      title: "Shipping & Pan-India Fulfilment Policy",
      subtitle: "Transparent delivery times and logistics standards for custom NFC hardware.",
      sections: [
        {
          heading: "1. Custom Production & Dispatch Timelines",
          body: "Because every ReviewTap card is custom-manufactured with your specific vector artwork and digitally encoded with your destination URL, manufacturing begins immediately upon artwork review. Standard dispatch occurs within 2 business days from our Bengaluru facility.",
        },
        {
          heading: "2. Pan-India Logistics Partners",
          body: "We partner exclusively with tier-1 air logistics providers (Blue Dart, Delhivery Air, and India Post Speed Post). All shipments include door-to-door tracking and SMS dispatch notifications.",
        },
        {
          heading: "3. Delivery Estimates & Thresholds",
          body: "Standard Air Cargo delivers within 3–5 business days and is complimentary on all orders above ₹1,499. For urgent venue launches, Priority Express Air provides 1–2 business day delivery at ₹199 flat rate.",
        },
      ],
    },
    returns: {
      title: "Returns & Replacement Guarantee",
      subtitle: "Our commitment to flawless physical and electronic hardware quality.",
      sections: [
        {
          heading: "1. Bespoke Custom Goods Policy",
          body: "Custom-printed NFC cards, countertop stands, and multi-location sets contain permanent ultraviolet ink printing and write-locked NTAG microchips tailored to your business, and therefore cannot be restocked for general resale.",
        },
        {
          heading: "2. 100% Quality Replacement Guarantee",
          body: "If any ReviewTap hardware arrives physically damaged in transit, suffers print color misregistration, or exhibits an NFC chip failure upon arrival, we will manufacture and express-air-ship a replacement card at zero cost within 24 hours.",
        },
        {
          heading: "3. Reporting a Quality Discrepancy",
          body: "Contact support@reviewtap.in with your Order ID and a clear photograph or video showing the defect within 7 days of delivery confirmation.",
        },
      ],
    },
    cancellation: {
      title: "Custom Order Cancellation Policy",
      subtitle: "Rules governing design revisions and pre-production order alterations.",
      sections: [
        {
          heading: "1. Cancellation Window",
          body: "Orders may be cancelled or modified for a full refund within 4 hours of submission, prior to our prepress team generating the physical UV film plates and queueing the NFC chip programmer.",
        },
        {
          heading: "2. Post-Production Queue",
          body: "Once an order enters 'In Manufacturing', material costs and chip write cycles have been irrevocably committed, and cancellations are no longer permitted.",
        },
      ],
    },
    privacy: {
      title: "Privacy & Responsible Data Handling",
      subtitle: "How ReviewTap secures customer assets and destination endpoints.",
      sections: [
        {
          heading: "1. Minimalist Data Collection",
          body: "We collect only the information strictly required to manufacture and ship your physical hardware: business name, shipping address, contact phone, and your destination review URL.",
        },
        {
          heading: "2. Safe Managed Redirects",
          body: "For cards utilizing ReviewTap managed shortlinks (/r/{cardId}), our redirect service resolves exclusively to administrator-approved Google Review or business endpoints. We prohibit open redirects, malicious URL injections, and track only high-level contactless tap counts without storing customer PII.",
        },
        {
          heading: "3. Financial Confidentiality",
          body: "We never store credit card numbers, CVVs, or payment passwords. All transactions are securely processed through PCI-DSS compliant providers (Razorpay).",
        },
      ],
    },
    terms: {
      title: "Terms of Commercial Service",
      subtitle: "Standards of use for ReviewTap contactless review products.",
      sections: [
        {
          heading: "1. Honest Customer Feedback",
          body: "ReviewTap products are designed to make giving feedback frictionless. In accordance with Google's Business Profile guidelines and consumer protection laws, ReviewTap cards must never be used in conjunction with review gating, deceptive filtering, or conditioning prizes/discounts on 5-star ratings.",
        },
        {
          heading: "2. Trademark Acknowledgment",
          body: "Google, Google Reviews, and the Google logo are trademarks of Google LLC. ReviewTap is an independent hardware manufacturer and is not sponsored by or affiliated with Google LLC.",
        },
      ],
    },
  };

  const selected = content[type];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-black/10 p-6 sm:p-8 relative">
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-5 right-5 w-8 h-8 rounded-full border border-black/10 flex items-center justify-center text-neutral-500 hover:text-black hover:bg-black/5 transition-colors cursor-pointer"
        >
          ✕
        </button>

        <div className="space-y-6 text-left">
          <div>
            <span className="text-xs font-mono font-bold text-[#123B2B] uppercase">
              Official Commercial Policy
            </span>
            <h2 className="text-2xl font-black text-[#17191D] mt-1">{selected.title}</h2>
            <p className="text-xs text-neutral-500 mt-1">{selected.subtitle}</p>
          </div>

          <div className="space-y-4 text-xs text-neutral-700 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
            {selected.sections.map((s, idx) => (
              <div key={idx} className="space-y-1">
                <h3 className="font-bold text-[#17191D] text-sm">{s.heading}</h3>
                <p className="text-neutral-600">{s.body}</p>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-black/10 flex items-center justify-between text-xs text-neutral-400">
            <span>Last revised: October 2026</span>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#123B2B] text-white font-bold rounded-xl hover:bg-[#0c281d] cursor-pointer"
            >
              Understood
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CookieBanner: React.FC<{
  onAccept: () => void;
  onDecline: () => void;
}> = ({ onAccept, onDecline }) => {
  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 bg-[#17191D] text-white p-5 rounded-2xl shadow-2xl border border-white/10 animate-fade-in text-xs space-y-3">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400" />
        <h4 className="font-bold text-sm text-white">Privacy & Essential Storage</h4>
      </div>
      <p className="text-white/70 leading-relaxed">
        We use privacy-conscious local storage strictly to remember your customized card designs, cart selections, and order history. We do not sell user data.
      </p>
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={onAccept}
          className="flex-1 py-2 px-3 bg-emerald-500 hover:bg-emerald-400 text-[#17191D] font-bold rounded-lg transition-colors cursor-pointer text-center"
        >
          Accept
        </button>
        <button
          onClick={onDecline}
          className="py-2 px-3 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-lg transition-colors cursor-pointer"
        >
          Essential Only
        </button>
      </div>
    </div>
  );
};
