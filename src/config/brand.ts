// Central brand configuration for ReviewTap
export interface BrandConfig {
  name: string;
  tagline: string;
  promise: string;
  currency: {
    code: string;
    symbol: string;
    rateToINR: number;
  };
  contact: {
    email: string;
    phone: string;
    whatsapp: string;
    hours: string;
    address: string;
  };
  announcement: {
    enabled: boolean;
    text: string;
    linkText: string;
    linkUrl: string;
  };
  shipping: {
    standardFreeThreshold: number;
    standardFee: number;
    expressFee: number;
    estimatedDaysStandard: string;
    estimatedDaysExpress: string;
  };
  pricingTiers: {
    minQty: number;
    maxQty: number;
    discountPercent: number;
    tierLabel: string;
  }[];
  coupons: {
    code: string;
    discountPercent: number;
    description: string;
  }[];
}

export const BRAND_CONFIG: BrandConfig = {
  name: "ReviewTap",
  tagline: "Your Feedback Makes Us Better.",
  promise: "Turn every customer interaction into an effortless opportunity to share honest feedback.",
  currency: {
    code: "INR",
    symbol: "₹",
    rateToINR: 1,
  },
  contact: {
    email: "support@reviewtap.in",
    phone: "+91 98765 43210",
    whatsapp: "+919876543210",
    hours: "Monday – Saturday, 9:00 AM – 7:00 PM IST",
    address: "ReviewTap Technologies Pvt. Ltd., Indiranagar, Bengaluru, Karnataka 560038, India",
  },
  announcement: {
    enabled: true,
    text: "Custom-branded NFC review cards · Bulk orders & multi-location shipping available across India",
    linkText: "Design in 60s",
    linkUrl: "#customizer",
  },
  shipping: {
    standardFreeThreshold: 1499,
    standardFee: 99,
    expressFee: 199,
    estimatedDaysStandard: "3-5 business days",
    estimatedDaysExpress: "1-2 business days",
  },
  pricingTiers: [
    { minQty: 1, maxQty: 4, discountPercent: 0, tierLabel: "Starter (1-4 cards)" },
    { minQty: 5, maxQty: 9, discountPercent: 10, tierLabel: "Studio (5-9 cards)" },
    { minQty: 10, maxQty: 24, discountPercent: 18, tierLabel: "Multi-Store (10-24 cards)" },
    { minQty: 25, maxQty: 49, discountPercent: 25, tierLabel: "Franchise (25-49 cards)" },
    { minQty: 50, maxQty: 99, discountPercent: 32, tierLabel: "Retail Chain (50-99 cards)" },
    { minQty: 100, maxQty: 9999, discountPercent: 40, tierLabel: "Enterprise Bulk (100+ cards)" },
  ],
  coupons: [
    { code: "TAP10", discountPercent: 10, description: "10% off launch celebration discount" },
    { code: "GROWTH20", discountPercent: 20, description: "20% off orders of 5 or more cards" },
    { code: "FIRSTORDER", discountPercent: 15, description: "15% off your first custom card design" },
  ],
};
