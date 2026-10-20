import { CartItem, Order, BulkQuoteRequest, CardDesignConfig, LocationDestination } from "../types";
import { BRAND_CONFIG } from "../config/brand";

const STORAGE_KEYS = {
  CART: "reviewtap_cart_v1",
  ORDERS: "reviewtap_orders_v1",
  DESIGNS: "reviewtap_saved_designs_v1",
  QUOTES: "reviewtap_quotes_v1",
  WISHLIST: "reviewtap_wishlist_v1",
  DESTINATIONS: "reviewtap_destinations_v1",
  RECENTLY_VIEWED: "reviewtap_recent_views_v1",
  COOKIE_CONSENT: "reviewtap_cookie_consent_v1",
};

// Initial demonstration data for order tracking & admin
const INITIAL_ORDERS: Order[] = [
  {
    id: "RT-89214",
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    customer: {
      fullName: "Arjun Mehta",
      email: "arjun@brewcraftcafe.in",
      phone: "+91 98450 12345",
      businessName: "Brewcraft Artisan Coffee",
      gstin: "29AABCU9603R1ZM",
      addressLine1: "142, 100 Feet Road, HAL 2nd Stage",
      addressLine2: "Opposite Metro Pillar 84",
      city: "Bengaluru",
      state: "Karnataka",
      postalCode: "560038",
      country: "India",
    },
    items: [
      {
        cartItemId: "item-demo-1",
        product: {
          id: "rt-signature-card",
          name: "ReviewTap Signature NFC + QR Card",
          subtitle: "The industry standard for contactless customer feedback",
          description: "0.84mm Rigid Matte PVC with scratch-resistant coat",
          category: "best-sellers",
          basePrice: 799,
          material: "0.84mm Rigid Matte PVC",
          dimensions: "85.6 × 54.0 mm",
          chipType: "NTAG213 High-Coercivity Chip",
          nfcEnabled: true,
          qrEnabled: true,
          customizable: true,
          bulkEligible: true,
          rating: 4.9,
          reviewCount: 382,
          features: ["Dual-channel NFC tap + dynamic QR code scan"],
          whatsIncluded: ["1x Custom-printed NFC + QR Card"],
          variants: [{ id: "sig-cream", name: "Ivory Cream", colorHex: "#F8F6F0", priceDelta: 0, inStock: true }],
          defaultTemplateId: "cream-forest",
        },
        selectedVariant: { id: "sig-cream", name: "Ivory Cream", colorHex: "#F8F6F0", priceDelta: 0, inStock: true },
        quantity: 5,
        unitPrice: 799,
        discountedPrice: 719,
        appliedTierDiscountPercent: 10,
        totalPrice: 3595,
        customDesign: {
          templateId: "cream-forest",
          shape: "standard-card",
          themeMode: "light",
          primaryColor: "#F8F6F0",
          secondaryColor: "#EDE7D9",
          textColor: "#123B2B",
          accentColor: "#123B2B",
          fontFamily: "Plus Jakarta Sans",
          businessName: "Brewcraft Coffee Roasters",
          tagline: "Your Feedback Makes Us Better.",
          subText: "Tap with your phone or scan to review",
          googleReviewUrl: "https://g.page/r/brewcraft-coffee",
          logoScale: 1,
          qrStyle: "classic",
          enableNfc: true,
          enableQr: true,
          showGoogleLogo: true,
          showRatingStars: true,
          starRating: 5,
        },
      },
    ],
    subtotal: 3995,
    discountAmount: 400,
    shippingFee: 0,
    shippingMethod: "standard",
    total: 3595,
    status: "manufacturing",
    trackingHistory: [
      {
        status: "order-received",
        label: "Order Placed",
        description: "Payment confirmed via Razorpay UPI.",
        timestamp: "Yesterday, 10:14 AM",
        completed: true,
      },
      {
        status: "artwork-approved",
        label: "Artwork Verified",
        description: "Vector logo and Google destination link inspected and certified.",
        timestamp: "Yesterday, 2:30 PM",
        completed: true,
      },
      {
        status: "manufacturing",
        label: "Precision Manufacturing & NFC Chip Encoding",
        description: "Thermal UV printing completed; NTAG213 chip programming in queue.",
        timestamp: "Today, 11:00 AM",
        completed: true,
      },
      {
        status: "quality-check",
        label: "Dual-Field Quality Inspection",
        description: "Testing 13.56MHz RF resonance and QR optical readability.",
        timestamp: "Pending",
        completed: false,
      },
      {
        status: "shipped",
        label: "Dispatched via Blue Dart Air",
        description: "Tracking AWB assigned.",
        timestamp: "Pending",
        completed: false,
      },
      {
        status: "delivered",
        label: "Delivered to Counter",
        description: "Ready to accept customer reviews.",
        timestamp: "Pending",
        completed: false,
      },
    ],
    paymentMethod: "razorpay-upi",
    paymentStatus: "paid",
    paymentId: "pay_Nfc998124K",
  },
];

const INITIAL_DESTINATIONS: LocationDestination[] = [
  {
    id: "loc-1",
    cardCode: "RT-BLR-01",
    locationName: "Brewcraft — Indiranagar Flagship",
    destinationUrl: "https://maps.app.goo.gl/brewcraft-blr-ind",
    redirectSlug: "brewcraft-ind",
    nfcProgrammed: true,
    scansCount: 412,
    lastScanned: "Today, 4:18 PM",
    status: "active",
  },
  {
    id: "loc-2",
    cardCode: "RT-BLR-02",
    locationName: "Brewcraft — Koramangala 4th Block",
    destinationUrl: "https://maps.app.goo.gl/brewcraft-blr-kor",
    redirectSlug: "brewcraft-kor",
    nfcProgrammed: true,
    scansCount: 289,
    lastScanned: "Today, 1:45 PM",
    status: "active",
  },
  {
    id: "loc-3",
    cardCode: "RT-BOM-01",
    locationName: "Brewcraft — Bandra West",
    destinationUrl: "https://maps.app.goo.gl/brewcraft-bom-ban",
    redirectSlug: "brewcraft-ban",
    nfcProgrammed: true,
    scansCount: 567,
    lastScanned: "Yesterday, 8:20 PM",
    status: "active",
  },
];

export const Storage = {
  // Cart
  getCart(): CartItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CART);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  setCart(cart: CartItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
      window.dispatchEvent(new CustomEvent("reviewtap:cart_updated", { detail: cart }));
    } catch (e) {
      console.error("Cart save error", e);
    }
  },

  // Orders
  getOrders(): Order[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return data ? JSON.parse(data) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  },

  saveOrder(order: Order): void {
    const orders = this.getOrders();
    const updated = [order, ...orders];
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
    } catch (e) {
      console.error("Order save error", e);
    }
  },

  updateOrderStatus(orderId: string, status: Order["status"]): void {
    const orders = this.getOrders();
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx !== -1) {
      orders[idx].status = status;
      try {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      } catch (e) {
        console.error("Status update error", e);
      }
    }
  },

  // Saved Custom Designs
  getSavedDesigns(): { id: string; name: string; date: string; config: CardDesignConfig }[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DESIGNS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveCustomDesign(name: string, config: CardDesignConfig): string {
    const designs = this.getSavedDesigns();
    const id = "dsg_" + Date.now();
    const newItem = {
      id,
      name,
      date: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }),
      config,
    };
    try {
      localStorage.setItem(STORAGE_KEYS.DESIGNS, JSON.stringify([newItem, ...designs]));
    } catch (e) {
      console.error("Save design error", e);
    }
    return id;
  },

  deleteSavedDesign(id: string): void {
    const designs = this.getSavedDesigns().filter((d) => d.id !== id);
    try {
      localStorage.setItem(STORAGE_KEYS.DESIGNS, JSON.stringify(designs));
    } catch (e) {
      console.error("Delete design error", e);
    }
  },

  // Bulk Quotes
  getBulkQuotes(): BulkQuoteRequest[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUOTES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveBulkQuote(quote: BulkQuoteRequest): void {
    const quotes = this.getBulkQuotes();
    try {
      localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify([quote, ...quotes]));
    } catch (e) {
      console.error("Save quote error", e);
    }
  },

  // Destinations & Multi-location redirect routing
  getDestinations(): LocationDestination[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DESTINATIONS);
      return data ? JSON.parse(data) : INITIAL_DESTINATIONS;
    } catch {
      return INITIAL_DESTINATIONS;
    }
  },

  saveDestinations(destinations: LocationDestination[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.DESTINATIONS, JSON.stringify(destinations));
    } catch (e) {
      console.error("Save destinations error", e);
    }
  },

  // Wishlist
  getWishlist(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  toggleWishlist(productId: string): boolean {
    const list = this.getWishlist();
    const exists = list.includes(productId);
    const updated = exists ? list.filter((id) => id !== productId) : [...list, productId];
    try {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(updated));
    } catch (e) {
      console.error("Wishlist error", e);
    }
    return !exists;
  },

  // Cookie Consent
  getCookieConsent(): boolean | null {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.COOKIE_CONSENT);
      return val ? JSON.parse(val) : null;
    } catch {
      return null;
    }
  },

  setCookieConsent(agreed: boolean): void {
    try {
      localStorage.setItem(STORAGE_KEYS.COOKIE_CONSENT, JSON.stringify(agreed));
    } catch (e) {
      console.error("Cookie consent error", e);
    }
  },
};
