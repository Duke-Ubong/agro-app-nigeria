import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Listing } from '../../types';

const NIGERIAN_STATES = [
  'All States', 'Benue State', 'Kaduna State', 'Kano State', 'Ogun State', 'Lagos State', 'Plateau State', 'FCT Abuja', 'Enugu State', 'Ondo State'
];

export const MarketplaceView: React.FC = () => {
  const { listings, createOrder, setActiveView } = useApp();
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string>('All States');
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [orderQuantity, setOrderQuantity] = useState<number>(10);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const categories = ['All', 'Grains', 'Tubers', 'Vegetables', 'Fruits', 'Inputs', 'Processed'];

  const filteredListings = listings.filter((l) => {
    const matchesSearch =
      l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.cropType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.locationState.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || l.category === selectedCategory;
    const matchesState = selectedState === 'All States' || l.locationState === selectedState;
    return matchesSearch && matchesCategory && matchesState;
  });

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListing) return;
    createOrder(selectedListing.id, orderQuantity, user);
    setIsSuccessModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Search Header Banner */}
      <div className="bg-[#012d1d] text-white p-6 rounded-2xl shadow-sm border border-[#1b4332] space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[#10b981] text-[#002114] text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                FMAFS & NCX Regulated
              </span>
              <span className="text-xs text-[#86af99] font-mono">Real-time Fair Trade Price Surveillance Active</span>
            </div>
            <h1 className="font-heading font-bold text-2xl">Nationwide Produce Marketplace</h1>
            <p className="text-xs text-[#86af99]">
              Verified Grains, Tubers, Inputs & Processed Commodities directly from Nigerian Farmers & Cooperatives.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveView('dashboard')}
              className="h-10 px-3 bg-[#10b981] hover:bg-[#059669] text-[#002114] text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shrink-0 shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">analytics</span>
              <span>Regulatory Data</span>
            </button>
            <button
              onClick={() => setActiveView('create_listing')}
              className="h-10 px-4 bg-[#1b4332] hover:bg-[#274e3d] text-white text-xs font-bold rounded-xl flex items-center gap-2 border border-[#86af99]/30 transition-colors shrink-0"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>Sell Produce</span>
            </button>
          </div>
        </div>

        {/* Regulatory Price Corridor Quick Ticker */}
        <div className="p-3 bg-[#1b4332]/70 rounded-xl border border-[#274e3d] flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-[#c1ecd4]">
            <span className="material-symbols-outlined text-[16px] text-[#10b981]">gavel</span>
            <span>Regulatory Price Corridor:</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-[#86af99]">
            <span>Maize: <strong className="text-white">₦32,000/bag</strong> (Cap ₦36k)</span>
            <span>Rice: <strong className="text-white">₦48,000/bag</strong> (Cap ₦56k)</span>
            <span>Cassava: <strong className="text-white">₦85,000/MT</strong></span>
            <span className="text-[#10b981] font-bold">Anti-Gouging: 100% Compliant</span>
          </div>
        </div>

        {/* Search Bar & State Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="sm:col-span-2 relative">
            <span className="material-symbols-outlined absolute left-3 top-3 text-[#86af99]">search</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search maize, cassava, yam, fertilizer, Kano, Benue..."
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-white text-xs text-[#1a1c1c] placeholder-[#717973] focus:outline-none focus:ring-2 focus:ring-[#c1ecd4]"
            />
          </div>

          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="h-11 px-3 rounded-xl bg-white text-xs font-bold text-[#1a1c1c] focus:outline-none focus:ring-2 focus:ring-[#c1ecd4]"
          >
            {NIGERIAN_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#c1ecd4] text-[#002114]'
                  : 'bg-[#1b4332] text-[#86af99] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Listing Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredListings.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-[#c1c8c2] rounded-2xl overflow-hidden hover:border-[#012d1d] hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Product Image & Badges */}
              <div className="relative aspect-[16/10] bg-[#f3f3f3] overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="bg-[#012d1d]/90 text-white font-bold text-[10px] px-2 py-0.5 rounded-full backdrop-blur-xs">
                    {item.category}
                  </span>
                  {item.sellerVerified && (
                    <span className="bg-[#c1ecd4] text-[#002114] font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[12px]">verified</span>
                      <span>Verified</span>
                    </span>
                  )}
                </div>
                <div className="absolute bottom-3 right-3 bg-white/90 text-[#012d1d] font-bold text-[10px] px-2 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px] text-[#dc9a00]">star</span>
                  <span>{item.rating}</span>
                </div>
              </div>

              {/* Body Info */}
              <div className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-heading font-bold text-sm text-[#1a1c1c] leading-snug">
                    {item.title}
                  </h3>
                </div>

                <p className="text-xs text-[#414844] line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                <div className="pt-2 border-t border-[#e2e2e2] grid grid-cols-2 gap-2 text-[11px] text-[#717973]">
                  <div>
                    <span className="block text-[9px] uppercase font-bold">Location</span>
                    <span className="text-[#1a1c1c] font-semibold">{item.locationState}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase font-bold">Available</span>
                    <span className="text-[#1a1c1c] font-semibold">
                      {item.availableQuantity} {item.unit}s
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Price & Action */}
            <div className="p-4 pt-0 flex items-center justify-between gap-2 border-t border-[#f3f3f3] mt-2">
              <div>
                <span className="text-[10px] text-[#717973]">Unit Price</span>
                <div className="font-heading font-bold text-base text-[#012d1d]">
                  ₦{item.price.toLocaleString()}{' '}
                  <span className="text-[10px] text-[#414844] font-normal">/ {item.unit}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedListing(item);
                  setOrderQuantity(item.minOrder || 5);
                }}
                className="h-10 px-4 bg-[#012d1d] text-white text-xs font-bold rounded-xl hover:bg-[#1b4332] active:scale-95 transition-all shadow-xs"
              >
                Buy Produce
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Buy / Escrow Modal */}
      {selectedListing && !isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedListing(null)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-[#e8e8e8] text-[#717973]"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="flex items-center gap-3 pb-3 border-b border-[#e2e2e2]">
              <img
                src={selectedListing.imageUrl}
                alt={selectedListing.title}
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div>
                <span className="text-[10px] bg-[#c1ecd4] text-[#002114] font-bold px-2 py-0.5 rounded">
                  {selectedListing.locationState}
                </span>
                <h3 className="font-heading font-bold text-base text-[#012d1d] mt-0.5">
                  {selectedListing.title}
                </h3>
                <p className="text-xs text-[#414844]">Seller: {selectedListing.sellerName}</p>
              </div>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1a1c1c] mb-1">
                  Order Quantity ({selectedListing.unit}s)
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setOrderQuantity(Math.max(selectedListing.minOrder, orderQuantity - 5))}
                    className="w-10 h-10 rounded-lg bg-[#e8e8e8] font-bold text-lg hover:bg-[#c1c8c2]"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={selectedListing.minOrder}
                    max={selectedListing.availableQuantity}
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(parseInt(e.target.value, 10) || selectedListing.minOrder)}
                    className="flex-1 h-10 text-center font-bold text-sm rounded-lg border border-[#717973]"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setOrderQuantity(Math.min(selectedListing.availableQuantity, orderQuantity + 5))
                    }
                    className="w-10 h-10 rounded-lg bg-[#e8e8e8] font-bold text-lg hover:bg-[#c1c8c2]"
                  >
                    +
                  </button>
                </div>
                <p className="text-[10px] text-[#717973] mt-1">
                  Min order: {selectedListing.minOrder} {selectedListing.unit}s • Max available:{' '}
                  {selectedListing.availableQuantity}
                </p>
              </div>

              {/* Total Summary */}
              <div className="p-3 bg-[#f3f3f3] rounded-xl border border-[#c1c8c2] space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Subtotal ({orderQuantity} units)</span>
                  <span className="font-bold">₦{(selectedListing.price * orderQuantity).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#717973]">
                  <span>AgroApp Secure Escrow Fee (0.5%)</span>
                  <span>₦{((selectedListing.price * orderQuantity) * 0.005).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-heading font-bold text-sm text-[#012d1d] pt-2 border-t border-[#c1c8c2]">
                  <span>Total Escrow Hold Amount</span>
                  <span>₦{((selectedListing.price * orderQuantity) * 1.005).toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-[#1b4332] text-white p-3 rounded-xl text-xs flex items-start gap-2">
                <span className="material-symbols-outlined text-[#c1ecd4] text-[18px]">verified_user</span>
                <p className="text-[11px] text-[#86af99]">
                  Funds are locked safely in Escrow until delivery is verified and waybill is signed off by buyer.
                </p>
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-[#012d1d] text-white font-heading font-bold text-sm rounded-full flex items-center justify-center gap-2 hover:bg-[#1b4332] active:scale-95 transition-all shadow-md"
              >
                <span>Confirm Purchase & Lock Escrow</span>
                <span className="material-symbols-outlined text-[18px]">lock</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 bg-[#c1ecd4] text-[#002114] rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[36px]">check_circle</span>
            </div>
            <h3 className="font-heading font-bold text-lg text-[#012d1d]">Order Created & Escrow Locked!</h3>
            <p className="text-xs text-[#414844]">
              Your purchase contract has been submitted to the seller and transporter route assigned.
            </p>
            <button
              onClick={() => {
                setIsSuccessModalOpen(false);
                setSelectedListing(null);
                setActiveView('orders');
              }}
              className="w-full py-3 bg-[#012d1d] text-white font-bold text-xs rounded-full hover:bg-[#1b4332]"
            >
              Track Order Status →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
