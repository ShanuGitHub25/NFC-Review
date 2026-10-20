import React, { useState, useEffect } from "react";
import { Product, ProductVariant, CartItem, CardDesignConfig, Order } from "./types";
import { PRODUCTS } from "./data/products";
import { BRAND_CONFIG } from "./config/brand";
import { Storage } from "./utils/storage";

// Minimal Layout & Navigation
import { MinimalNav } from "./components/layout/MinimalNav";
import { Footer } from "./components/layout/Footer";

// Cinematic 3D Scroll Story & Core Sections
import { Cinematic3DStory } from "./components/three/Cinematic3DStory";
import { CuratedShowcase } from "./components/showcase/CuratedShowcase";
import { CustomDesignUpload } from "./components/custom/CustomDesignUpload";
import { CompactFaq } from "./components/home/CompactFaq";

// Commerce Modals & Portals
import { CartDrawer } from "./components/cart/CartDrawer";
import { CheckoutModal } from "./components/checkout/CheckoutModal";
import { AccountPortal } from "./components/account/AccountPortal";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { PolicyModal, PolicyType, CookieBanner } from "./components/common/PolicyModals";

export function App() {
  const [currentView, setCurrentView] = useState<"store" | "account" | "admin">("store");

  // Cart & Orders State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  // Policy Modal & Cookie Banner State
  const [activePolicy, setActivePolicy] = useState<PolicyType | null>(null);
  const [showCookieBanner, setShowCookieBanner] = useState<boolean>(false);

  // Initialize data on mount
  useEffect(() => {
    setCart(Storage.getCart());

    const consent = Storage.getCookieConsent();
    if (consent === null) {
      setShowCookieBanner(true);
    }

    const handleCartUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<CartItem[]>;
      if (customEvent.detail) {
        setCart(customEvent.detail);
      }
    };

    window.addEventListener("reviewtap:cart_updated", handleCartUpdated);
    return () => {
      window.removeEventListener("reviewtap:cart_updated", handleCartUpdated);
    };
  }, []);

  // Smooth scroll helper
  const handleScrollTo = (sectionId: string) => {
    setCurrentView("store");
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 50);
  };

  // Add Ready-Made Curated Card to Cart
  const handleAddCuratedToCart = (payload: {
    product: Product;
    customDesign: CardDesignConfig;
    quantity: number;
    destinationUrl: string;
  }) => {
    const unitPrice = payload.product.basePrice;
    const tier =
      BRAND_CONFIG.pricingTiers.find(
        (t) => payload.quantity >= t.minQty && payload.quantity <= t.maxQty
      ) || BRAND_CONFIG.pricingTiers[0];

    const discountedPrice = Math.round(unitPrice * (1 - tier.discountPercent / 100));
    const totalPrice = discountedPrice * payload.quantity;

    const newItem: CartItem = {
      cartItemId: "cart_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      product: payload.product,
      selectedVariant: payload.product.variants[0],
      quantity: payload.quantity,
      customDesign: payload.customDesign,
      unitPrice,
      discountedPrice,
      appliedTierDiscountPercent: tier.discountPercent,
      totalPrice,
    };

    const updated = [newItem, ...cart];
    setCart(updated);
    Storage.setCart(updated);
    setCartOpen(true);
  };

  // Add Custom Upload Card to Cart
  const handleAddCustomUploadToCart = (payload: {
    product: Product;
    customDesign: CardDesignConfig;
    quantity: number;
    artworkFileName: string;
    notes: string;
  }) => {
    const unitPrice = payload.product.basePrice;
    const tier =
      BRAND_CONFIG.pricingTiers.find(
        (t) => payload.quantity >= t.minQty && payload.quantity <= t.maxQty
      ) || BRAND_CONFIG.pricingTiers[0];

    const discountedPrice = Math.round(unitPrice * (1 - tier.discountPercent / 100));
    const totalPrice = discountedPrice * payload.quantity;

    const newItem: CartItem = {
      cartItemId: "cart_custom_" + Date.now(),
      product: payload.product,
      selectedVariant: payload.product.variants[0],
      quantity: payload.quantity,
      customDesign: payload.customDesign,
      unitPrice,
      discountedPrice,
      appliedTierDiscountPercent: tier.discountPercent,
      totalPrice,
    };

    const updated = [newItem, ...cart];
    setCart(updated);
    Storage.setCart(updated);
    setCartOpen(true);
  };

  // Cart operations
  const handleUpdateCartQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      const updated = cart.filter((i) => i.cartItemId !== cartItemId);
      setCart(updated);
      Storage.setCart(updated);
      return;
    }

    const updated = cart.map((item) => {
      if (item.cartItemId === cartItemId) {
        const tier =
          BRAND_CONFIG.pricingTiers.find((t) => newQty >= t.minQty && newQty <= t.maxQty) ||
          BRAND_CONFIG.pricingTiers[0];
        const discountedPrice = Math.round(item.unitPrice * (1 - tier.discountPercent / 100));
        return {
          ...item,
          quantity: newQty,
          discountedPrice,
          appliedTierDiscountPercent: tier.discountPercent,
          totalPrice: discountedPrice * newQty,
        };
      }
      return item;
    });

    setCart(updated);
    Storage.setCart(updated);
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    const updated = cart.filter((i) => i.cartItemId !== cartItemId);
    setCart(updated);
    Storage.setCart(updated);
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#111114] text-[#F7F4ED] font-sans antialiased selection:bg-[#2864FF] selection:text-white">
      {/* Minimal Navigation */}
      <MinimalNav
        cartCount={totalCartCount}
        onOpenCart={() => setCartOpen(true)}
        onScrollTo={handleScrollTo}
        onOpenAccount={() => {
          setCurrentView("account");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onOpenAdmin={() => {
          setCurrentView("admin");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* VIEW 1: Main Store Experience */}
        {currentView === "store" && (
          <div className="animate-fade-in">
            {/* 1 & 2. Cinematic 3D Opening & Scroll-Driven Story (Scenes 1 to 4) */}
            <Cinematic3DStory
              onExploreCards={() => handleScrollTo("designs")}
              onOrderCustom={() => handleScrollTo("custom-upload")}
            />

            {/* 3. Curated Ready-Made Design Showcase */}
            <CuratedShowcase
              onOrderProduct={handleAddCuratedToCart}
              onHaveOwnDesign={() => handleScrollTo("custom-upload")}
            />

            {/* 4. Simple Custom Design Upload */}
            <CustomDesignUpload onAddCustomUploadToCart={handleAddCustomUploadToCart} />

            {/* 5. Compact FAQ */}
            <CompactFaq />
          </div>
        )}

        {/* VIEW 2: Customer Account & Order History Portal */}
        {currentView === "account" && (
          <div className="animate-fade-in pt-16">
            <AccountPortal
              onBackToShop={() => setCurrentView("store")}
              onEditDesign={() => handleScrollTo("designs")}
              onReorder={(order) => {
                order.items.forEach((item) => {
                  handleAddCuratedToCart({
                    product: item.product,
                    customDesign: item.customDesign!,
                    quantity: item.quantity,
                    destinationUrl: item.customDesign?.googleReviewUrl || "",
                  });
                });
              }}
            />
          </div>
        )}

        {/* VIEW 3: Administrator Console */}
        {currentView === "admin" && (
          <div className="animate-fade-in pt-16">
            <AdminDashboard onBackToStore={() => setCurrentView("store")} />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenPolicy={(policy) => setActivePolicy(policy)}
        onOpenCustomizer={() => handleScrollTo("designs")}
        onOpenBulk={() => handleScrollTo("custom-upload")}
        onNavigateSection={handleScrollTo}
      />

      {/* Slide-Over Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onEditCustomDesign={() => {
          setCartOpen(false);
          handleScrollTo("designs");
        }}
        onProceedToCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
        onStartShopping={() => {
          setCartOpen(false);
          handleScrollTo("designs");
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cart={cart}
        onOrderCompleted={(order) => {
          // Dialog presents receipt and tracking options
        }}
      />

      {/* Legal & Policy Modals */}
      <PolicyModal type={activePolicy} onClose={() => setActivePolicy(null)} />

      {/* Cookie Consent Banner */}
      {showCookieBanner && (
        <CookieBanner
          onAccept={() => {
            Storage.setCookieConsent(true);
            setShowCookieBanner(false);
          }}
          onDecline={() => {
            Storage.setCookieConsent(false);
            setShowCookieBanner(false);
          }}
        />
      )}
    </div>
  );
}

export default App;
