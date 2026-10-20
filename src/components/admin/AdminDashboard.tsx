import React, { useState } from "react";
import { Order, OrderStatus, BulkQuoteRequest, LocationDestination, Product } from "../../types";
import { BRAND_CONFIG } from "../../config/brand";
import { Storage } from "../../utils/storage";
import { PRODUCTS } from "../../data/products";

interface AdminDashboardProps {
  onBackToStore: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToStore }) => {
  const [role, setRole] = useState<"owner" | "admin" | "order-mgr" | "fulfilment">("admin");
  const [activeTab, setActiveTab] = useState<"orders" | "quotes" | "destinations" | "products" | "settings">("orders");
  const [orders, setOrders] = useState<Order[]>(Storage.getOrders());
  const [quotes, setQuotes] = useState<BulkQuoteRequest[]>(Storage.getBulkQuotes());
  const [destinations, setDestinations] = useState<LocationDestination[]>(Storage.getDestinations());
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Status changer
  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    Storage.updateOrderStatus(orderId, newStatus);
    const updated = Storage.getOrders();
    setOrders(updated);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  // CSV Export for manufacturing production run
  const handleExportManufacturingCsv = () => {
    const headers = [
      "Order ID",
      "Date",
      "Customer Name",
      "Business Name",
      "Item Name",
      "Quantity",
      "Finish Variant",
      "Google Destination URL",
      "Status",
    ];

    const rows = orders.flatMap((o) =>
      o.items.map((i) => [
        o.id,
        o.createdAt.substring(0, 10),
        `"${o.customer.fullName}"`,
        `"${o.customer.businessName || ""}"`,
        `"${i.product.name}"`,
        i.quantity,
        `"${i.selectedVariant.name}"`,
        `"${i.customDesign?.googleReviewUrl || "Default"}"`,
        o.status,
      ])
    );

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `reviewtap-manufacturing-batch-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Metrics calculation
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + o.total, 0);

  const pendingArtwork = orders.filter(
    (o) => o.status === "order-received" || o.status === "artwork-pending"
  ).length;

  const manufacturingCount = orders.filter(
    (o) => o.status === "manufacturing" || o.status === "production-queued"
  ).length;

  return (
    <div className="bg-[#17191D] min-h-screen text-[#F8F6F0] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
              <span>ReviewTap Core Operations</span>
              <span aria-hidden="true">·</span>
              <span>Hardware Production Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Administrator Console
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Role Switcher */}
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl p-1 text-xs">
              <span className="text-white/50 px-2 font-mono">Role:</span>
              {(["owner", "admin", "order-mgr", "fulfilment"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`px-2.5 py-1 rounded-lg capitalize transition-colors cursor-pointer ${
                    role === r
                      ? "bg-[#123B2B] text-white font-bold"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {r.replace("-", " ")}
                </button>
              ))}
            </div>

            <button
              onClick={onBackToStore}
              className="px-3.5 py-2 text-xs font-semibold bg-white/10 hover:bg-white/15 text-white rounded-xl border border-white/10 transition-colors cursor-pointer"
            >
              ← Back to Storefront
            </button>
          </div>
        </div>

        {/* Real-time KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2">
            <span className="text-xs font-mono text-white/50 uppercase">Recorded Paid Revenue</span>
            <div className="text-2xl sm:text-3xl font-mono font-black text-emerald-400">
              {BRAND_CONFIG.currency.symbol}
              {totalRevenue.toLocaleString("en-IN")}
            </div>
            <span className="text-[11px] text-white/40 block">From verified Razorpay transactions</span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2">
            <span className="text-xs font-mono text-white/50 uppercase">Total Orders</span>
            <div className="text-2xl sm:text-3xl font-mono font-black text-white">
              {orders.length}
            </div>
            <span className="text-[11px] text-white/40 block">Hardware batch orders on file</span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2">
            <span className="text-xs font-mono text-white/50 uppercase">Pending Artwork Approvals</span>
            <div className="text-2xl sm:text-3xl font-mono font-black text-amber-400">
              {pendingArtwork}
            </div>
            <span className="text-[11px] text-white/40 block">Awaiting vector / URL inspection</span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2">
            <span className="text-xs font-mono text-white/50 uppercase">In Manufacturing Queue</span>
            <div className="text-2xl sm:text-3xl font-mono font-black text-[#2864F0]">
              {manufacturingCount}
            </div>
            <span className="text-[11px] text-white/40 block">UV print & NTAG chip programming</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-white/10 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-3 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === "orders" ? "border-emerald-400 text-emerald-400" : "border-transparent text-white/60 hover:text-white"
            }`}
          >
            Order Fulfilment Queue ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("quotes")}
            className={`pb-3 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === "quotes" ? "border-emerald-400 text-emerald-400" : "border-transparent text-white/60 hover:text-white"
            }`}
          >
            Enterprise Quote Leads ({quotes.length})
          </button>
          <button
            onClick={() => setActiveTab("destinations")}
            className={`pb-3 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === "destinations" ? "border-emerald-400 text-emerald-400" : "border-transparent text-white/60 hover:text-white"
            }`}
          >
            Multi-Location Redirects ({destinations.length})
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`pb-3 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === "products" ? "border-emerald-400 text-emerald-400" : "border-transparent text-white/60 hover:text-white"
            }`}
          >
            Catalogue & Launch Prices
          </button>
        </div>

        {/* Orders Table */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">
                Manage physical card production and update dispatch statuses.
              </span>
              <button
                onClick={handleExportManufacturingCsv}
                className="px-3.5 py-1.5 text-xs font-bold text-[#123B2B] bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export Manufacturing CSV
              </button>
            </div>

            <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5 text-white/60 font-mono">
                      <th className="py-3.5 px-4">Order ID</th>
                      <th className="py-3.5 px-4">Customer & Business</th>
                      <th className="py-3.5 px-4">Hardware Item</th>
                      <th className="py-3.5 px-4">Destination Link</th>
                      <th className="py-3.5 px-4">Amount</th>
                      <th className="py-3.5 px-4">Fulfilment Status</th>
                      <th className="py-3.5 px-4">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                          {o.id}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-white block">{o.customer.fullName}</span>
                          <span className="text-[11px] text-white/50">{o.customer.businessName || o.customer.city}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          {o.items.map((i) => `${i.product.name} (${i.quantity}x)`).join(", ")}
                        </td>
                        <td className="py-3.5 px-4 max-w-[180px] truncate font-mono text-[11px] text-[#2864F0]">
                          {o.items[0]?.customDesign?.googleReviewUrl || "https://g.page/review"}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-white">
                          {BRAND_CONFIG.currency.symbol}{o.total.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-white/10 text-emerald-300">
                            {o.status.replace("-", " ")}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={o.status}
                            onChange={(e) => handleUpdateStatus(o.id, e.target.value as OrderStatus)}
                            className="bg-neutral-800 text-white border border-white/20 rounded-lg px-2 py-1 text-xs font-mono"
                          >
                            <option value="order-received">Order Received</option>
                            <option value="artwork-approved">Artwork Approved</option>
                            <option value="manufacturing">In Manufacturing</option>
                            <option value="quality-check">Quality Check</option>
                            <option value="ready-to-dispatch">Ready to Dispatch</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Quotes Table */}
        {activeTab === "quotes" && (
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">Enterprise Leads & Multi-Location Inquiries</h3>
            <div className="space-y-3">
              {quotes.map((q) => (
                <div key={q.id} className="p-4 bg-white/5 rounded-xl border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                  <div>
                    <span className="font-mono text-emerald-400 font-bold block">{q.id} · {q.businessName}</span>
                    <span className="text-white/60">
                      Contact: {q.contactName} ({q.email} / {q.phone}) · {q.quantity} units for {q.numLocations} branches
                    </span>
                    {q.notes && <p className="text-[11px] text-white/50 italic mt-1">"{q.notes}"</p>}
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-white block">
                      {BRAND_CONFIG.currency.symbol}{q.quotedAmount?.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-300 uppercase">
                      Lead Status: {q.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Multi-Location Redirects */}
        {activeTab === "destinations" && (
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-white">Centralized Branch Redirect Routes (/r/{`{cardId}`})</h3>
                <p className="text-xs text-white/50 mt-0.5">
                  Allows physical cards to be re-routed if a business relocates without reprinting the card.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-white/60 font-mono">
                    <th className="py-2 px-3">Card Code</th>
                    <th className="py-2 px-3">Branch Location</th>
                    <th className="py-2 px-3">Redirect Slug</th>
                    <th className="py-2 px-3">Destination Google Maps URL</th>
                    <th className="py-2 px-3">Total Taps/Scans</th>
                    <th className="py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {destinations.map((d) => (
                    <tr key={d.id} className="hover:bg-white/5">
                      <td className="py-3 px-3 font-mono font-bold text-emerald-400">{d.cardCode}</td>
                      <td className="py-3 px-3 font-semibold text-white">{d.locationName}</td>
                      <td className="py-3 px-3 font-mono text-[#2864F0]">/r/{d.redirectSlug}</td>
                      <td className="py-3 px-3 font-mono text-white/70 max-w-[200px] truncate">{d.destinationUrl}</td>
                      <td className="py-3 px-3 font-mono text-white">{d.scansCount} taps</td>
                      <td className="py-3 px-3">
                        <span className="text-emerald-400 font-mono text-[10px] bg-emerald-950 px-2 py-0.5 rounded">
                          ACTIVE
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Product Catalog & Pricing Editor */}
        {activeTab === "products" && (
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">Hardware Launch Prices (Editable in INR)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PRODUCTS.map((p) => (
                <div key={p.id} className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-white">{p.name}</h4>
                    <p className="text-[11px] text-white/50">{p.material}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-emerald-400 block">
                      {BRAND_CONFIG.currency.symbol}{p.basePrice}
                    </span>
                    <span className="text-[10px] text-white/40">In Stock</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
