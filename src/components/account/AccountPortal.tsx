import React, { useState } from "react";
import { Order, BulkQuoteRequest, CardDesignConfig } from "../../types";
import { BRAND_CONFIG } from "../../config/brand";
import { Storage } from "../../utils/storage";
import { CardPreview } from "../customizer/CardPreview";

interface AccountPortalProps {
  onBackToShop: () => void;
  onEditDesign: (config: CardDesignConfig) => void;
  onReorder: (order: Order) => void;
}

export const AccountPortal: React.FC<AccountPortalProps> = ({
  onBackToShop,
  onEditDesign,
  onReorder,
}) => {
  const [activeTab, setActiveTab] = useState<"orders" | "designs" | "quotes" | "profile">("orders");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const orders = Storage.getOrders();
  const savedDesigns = Storage.getSavedDesigns();
  const quotes = Storage.getBulkQuotes();

  return (
    <div className="bg-[#F8F6F0] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-black/10 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#17191D]/60 font-mono mb-1">
              <span>Customer Portal</span>
              <span aria-hidden="true">·</span>
              <span>Hardware Orders & Tracking</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#17191D] tracking-tight">
              My ReviewTap Account
            </h1>
          </div>

          <button
            onClick={onBackToShop}
            className="text-xs font-semibold text-[#17191D] hover:underline"
          >
            ← Back to Storefront
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-black/10 mb-8 overflow-x-auto">
          <button
            onClick={() => {
              setActiveTab("orders");
              setSelectedOrder(null);
            }}
            className={`pb-3 text-xs font-bold border-b-2 whitespace-nowrap px-3 transition-colors cursor-pointer ${
              activeTab === "orders"
                ? "border-[#123B2B] text-[#123B2B]"
                : "border-transparent text-neutral-500 hover:text-black"
            }`}
          >
            Orders & Hardware Tracking ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab("designs")}
            className={`pb-3 text-xs font-bold border-b-2 whitespace-nowrap px-3 transition-colors cursor-pointer ${
              activeTab === "designs"
                ? "border-[#123B2B] text-[#123B2B]"
                : "border-transparent text-neutral-500 hover:text-black"
            }`}
          >
            Saved Custom Designs ({savedDesigns.length})
          </button>

          <button
            onClick={() => setActiveTab("quotes")}
            className={`pb-3 text-xs font-bold border-b-2 whitespace-nowrap px-3 transition-colors cursor-pointer ${
              activeTab === "quotes"
                ? "border-[#123B2B] text-[#123B2B]"
                : "border-transparent text-neutral-500 hover:text-black"
            }`}
          >
            Enterprise Bulk Quotes ({quotes.length})
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-3 text-xs font-bold border-b-2 whitespace-nowrap px-3 transition-colors cursor-pointer ${
              activeTab === "profile"
                ? "border-[#123B2B] text-[#123B2B]"
                : "border-transparent text-neutral-500 hover:text-black"
            }`}
          >
            Saved Profile & Address
          </button>
        </div>

        {/* Tab 1: Orders and Tracking */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            {selectedOrder ? (
              /* Detailed Order Tracking Screen */
              <div className="bg-white rounded-2xl border border-black/10 p-6 sm:p-8 space-y-6 animate-fade-in shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-black/10">
                  <div>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="text-xs text-[#2864F0] font-semibold hover:underline mb-1 block cursor-pointer"
                    >
                      ← Back to All Orders
                    </button>
                    <h2 className="text-xl font-black text-[#17191D]">
                      Order #{selectedOrder.id}
                    </h2>
                    <p className="text-xs text-neutral-500 font-mono mt-0.5">
                      Placed on {new Date(selectedOrder.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>

                  <span className="text-xs font-bold font-mono px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                    Status: {selectedOrder.status.replace("-", " ").toUpperCase()}
                  </span>
                </div>

                {/* Progress Timeline */}
                <div>
                  <h3 className="text-xs font-mono font-bold text-[#123B2B] uppercase mb-4">
                    Manufacturing & Fulfilment Timeline
                  </h3>
                  <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200">
                    {selectedOrder.trackingHistory.map((step, idx) => (
                      <div key={idx} className="relative">
                        <span
                          className={`absolute -left-6 sm:-left-8 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] ${
                            step.completed
                              ? "bg-[#123B2B] border-[#123B2B] text-white"
                              : "bg-white border-neutral-300 text-neutral-400"
                          }`}
                        >
                          {step.completed ? "✓" : idx + 1}
                        </span>
                        <div>
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-[#17191D]">{step.label}</h4>
                            <span className="text-[10px] text-neutral-400 font-mono">{step.timestamp}</span>
                          </div>
                          <p className="text-xs text-neutral-600 mt-0.5">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Items in this order */}
                <div className="pt-4 border-t border-black/10">
                  <h3 className="text-xs font-mono font-bold text-[#123B2B] uppercase mb-3">
                    Items & Hardware In This Order
                  </h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, i) => (
                      <div key={i} className="p-3 bg-neutral-50 rounded-xl border border-black/5 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-[#17191D]">{item.product.name}</span>
                          <span className="block text-[11px] text-neutral-500">
                            Finish: {item.selectedVariant.name} · Qty: {item.quantity}
                          </span>
                          {item.customDesign && (
                            <span className="text-[10px] font-mono text-[#123B2B]">
                              Customized with Google Review Link
                            </span>
                          )}
                        </div>
                        <span className="font-mono font-bold text-[#123B2B]">
                          {BRAND_CONFIG.currency.symbol}{item.totalPrice.toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => onReorder(selectedOrder)}
                    className="px-4 py-2 bg-[#123B2B] hover:bg-[#0c281d] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Reorder This Fleet
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-white border border-black/15 text-xs font-semibold text-neutral-700 rounded-xl hover:bg-neutral-50"
                  >
                    Print Commercial Invoice
                  </button>
                </div>
              </div>
            ) : (
              /* All Orders List */
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-black/10 p-12 text-center">
                    <p className="text-sm font-bold text-[#17191D]">No orders found</p>
                    <p className="text-xs text-neutral-500 mt-1">
                      Customize a card in the studio to place your first order.
                    </p>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white rounded-2xl border border-black/10 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs hover:border-black/25 transition-all"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-[#123B2B] bg-[#123B2B]/10 px-2 py-0.5 rounded">
                            {order.id}
                          </span>
                          <span className="text-xs text-neutral-500 font-mono">
                            {new Date(order.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-[#17191D]">
                          {order.items.map((i) => i.product.name).join(", ")}
                        </h4>
                        <p className="text-xs text-neutral-500">
                          Ship to: {order.customer.fullName} · {order.customer.city} ({order.customer.postalCode})
                        </p>
                      </div>

                      <div className="flex items-center gap-4 self-end sm:self-center">
                        <div className="text-right">
                          <span className="font-mono font-bold text-sm text-[#123B2B] block">
                            {BRAND_CONFIG.currency.symbol}{order.total.toLocaleString("en-IN")}
                          </span>
                          <span className="text-[10px] font-mono text-emerald-700 uppercase">
                            {order.status.replace("-", " ")}
                          </span>
                        </div>

                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-xs font-semibold text-[#17191D] rounded-xl transition-colors cursor-pointer"
                        >
                          Track Hardware →
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Saved Designs Gallery */}
        {activeTab === "designs" && (
          <div>
            {savedDesigns.length === 0 ? (
              <div className="bg-white rounded-2xl border border-black/10 p-12 text-center space-y-3">
                <p className="text-sm font-bold text-[#17191D]">No custom designs saved yet</p>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  When you configure your brand in the visual customizer, click "Save Draft" to access your designs here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedDesigns.map((d) => (
                  <div key={d.id} className="bg-white rounded-2xl border border-black/10 overflow-hidden shadow-xs p-5 space-y-4">
                    <div className="aspect-[4/3] bg-[#F8F6F0] rounded-xl flex items-center justify-center p-4">
                      <div className="w-full max-w-[220px]">
                        <CardPreview config={d.config} interactiveTilt={false} />
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-[#17191D]">{d.name}</h4>
                      <p className="text-[10px] text-neutral-400 font-mono mt-0.5">Saved on {d.date}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-black/10">
                      <button
                        onClick={() => onEditDesign(d.config)}
                        className="px-3 py-1.5 bg-[#123B2B] text-white text-xs font-bold rounded-lg cursor-pointer hover:bg-[#0c281d]"
                      >
                        Open in Customizer
                      </button>

                      <button
                        onClick={() => Storage.deleteSavedDesign(d.id)}
                        className="text-xs text-red-500 hover:underline cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Bulk Quotes */}
        {activeTab === "quotes" && (
          <div className="space-y-4">
            {quotes.length === 0 ? (
              <div className="bg-white rounded-2xl border border-black/10 p-12 text-center">
                <p className="text-sm font-bold text-[#17191D]">No quote requests on file</p>
                <p className="text-xs text-neutral-500 mt-1">
                  Submit a bulk enquiry to get custom multi-store volume rates.
                </p>
              </div>
            ) : (
              quotes.map((q) => (
                <div key={q.id} className="bg-white rounded-2xl border border-black/10 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        Quote #{q.id}
                      </span>
                      <span className="text-xs text-neutral-500 font-mono">
                        {new Date(q.submittedAt).toLocaleDateString("en-IN")}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-[#17191D]">
                      {q.businessName} · {q.quantity} units ({q.numLocations} locations)
                    </h4>
                    <p className="text-xs text-neutral-500">
                      Postal Code: {q.deliveryPostalCode} · Contact: {q.contactName} ({q.phone})
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-mono font-bold text-[#123B2B] block">
                      {BRAND_CONFIG.currency.symbol}{q.quotedAmount?.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase">
                      Status: {q.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 4: Saved Profile */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-2xl border border-black/10 p-6 sm:p-8 max-w-xl space-y-4">
            <h3 className="text-base font-bold text-[#17191D]">Customer Profile Information</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-black/5">
                <span className="text-neutral-500">Full Name:</span>
                <span className="font-semibold text-[#17191D]">Arjun Mehta</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-black/5">
                <span className="text-neutral-500">Business Name:</span>
                <span className="font-semibold text-[#17191D]">Brewcraft Artisan Coffee Roasters</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-black/5">
                <span className="text-neutral-500">Registered Email:</span>
                <span className="font-semibold text-[#17191D]">arjun@brewcraftcafe.in</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-black/5">
                <span className="text-neutral-500">Contact Mobile:</span>
                <span className="font-semibold text-[#17191D]">+91 98450 12345</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-black/5">
                <span className="text-neutral-500">Primary Dispatch Address:</span>
                <span className="font-semibold text-[#17191D] text-right">
                  142, 100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru, KA 560038
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
