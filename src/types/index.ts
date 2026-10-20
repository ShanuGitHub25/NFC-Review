export type ProductCategory =
  | "all"
  | "best-sellers"
  | "minimal"
  | "colour-pop"
  | "luxury"
  | "business-essentials"
  | "bulk-enterprise";

export type CardShape = "standard-card" | "countertop-card" | "acrylic-stand";

export type CardTemplateId =
  | "lavender-luxury"
  | "sky-blue"
  | "mint-fresh"
  | "cream-forest"
  | "black-gold"
  | "navy-electric"
  | "minimal-white"
  | "brand-match";

export interface CardDesignConfig {
  templateId: CardTemplateId;
  shape: CardShape;
  themeMode: "light" | "dark";
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  accentColor: string;
  fontFamily: "Plus Jakarta Sans" | "Manrope" | "Playfair Display" | "Inter";
  businessName: string;
  tagline: string;
  subText: string;
  googleReviewUrl: string;
  logoUrl?: string;
  logoScale: number;
  qrStyle: "classic" | "rounded" | "dots";
  enableNfc: boolean;
  enableQr: boolean;
  showGoogleLogo: boolean;
  showRatingStars: boolean;
  starRating: number;
  bleedGuidesVisible?: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  colorHex: string;
  priceDelta: number;
  inStock: boolean;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  category: ProductCategory;
  basePrice: number; // in INR
  originalPrice?: number;
  material: string;
  dimensions: string;
  chipType: string;
  nfcEnabled: boolean;
  qrEnabled: boolean;
  customizable: boolean;
  bulkEligible: boolean;
  rating: number;
  reviewCount: number;
  features: string[];
  whatsIncluded: string[];
  badge?: string;
  variants: ProductVariant[];
  defaultTemplateId: CardTemplateId;
}

export interface CartItem {
  cartItemId: string;
  product: Product;
  selectedVariant: ProductVariant;
  quantity: number;
  customDesign?: CardDesignConfig;
  unitPrice: number;
  discountedPrice: number;
  appliedTierDiscountPercent: number;
  totalPrice: number;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  businessName?: string;
  gstin?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export type OrderStatus =
  | "order-received"
  | "artwork-pending"
  | "artwork-approved"
  | "production-queued"
  | "manufacturing"
  | "quality-check"
  | "ready-to-dispatch"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderTrackingEvent {
  status: OrderStatus;
  label: string;
  description: string;
  timestamp: string;
  completed: boolean;
}

export interface Order {
  id: string; // e.g. RT-84291
  createdAt: string;
  customer: ShippingAddress;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  shippingMethod: "standard" | "express";
  total: number;
  couponCode?: string;
  status: OrderStatus;
  trackingHistory: OrderTrackingEvent[];
  paymentMethod: "razorpay-upi" | "razorpay-card" | "netbanking" | "cod";
  paymentStatus: "paid" | "pending" | "failed";
  paymentId?: string;
  notes?: string;
}

export interface BulkQuoteRequest {
  id: string;
  submittedAt: string;
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  quantity: number;
  productId: string;
  numLocations: number;
  deliveryPostalCode: string;
  customPackaging: boolean;
  brandGuidelineAttached: boolean;
  notes: string;
  status: "new" | "reviewing" | "quote-sent" | "approved" | "converted";
  quotedAmount?: number;
}

export interface LocationDestination {
  id: string;
  cardCode: string; // e.g. RT-LOC-01
  locationName: string; // e.g. "Indiranagar Flagship"
  destinationUrl: string;
  redirectSlug: string; // e.g. "blr-01"
  nfcProgrammed: boolean;
  scansCount: number;
  lastScanned?: string;
  status: "active" | "inactive";
}
