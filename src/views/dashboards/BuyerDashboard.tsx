import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { getNigerianAvatar } from '../../utils/avatarUtils';

export const BuyerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { listings, orders, setActiveView } = useApp();

  const activeOrders = orders.filter((o) => o.buyerId === user.id);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#3f6653] bg-[#c1ecd4] px-2.5 py-1 rounded-full">
            Commercial Buyer & Processor Hub
          </span>
          <h1 className="font-heading font-bold text-2xl text-[#012d1d] mt-1">
            {user.companyName || 'Premium Agro Processors'}
          </h1>
          <p className="text-xs text-[#414844]">
            {user.state} • Off-take Capacity: 50 MT/Day • CAC: {user.cacNumber || 'RC-112345'}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveView('marketplace')}
            className="h-11 px-5 bg-[#012d1d] text-white font-heading font-bold text-xs rounded-full flex items-center gap-2 hover:bg-[#1b4332] active:scale-95 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">search</span>
            <span>Procure Bulk Produce</span>
          </button>
          <button
            onClick={() => setActiveView('wallet')}
            className="h-11 px-4 bg-[#f3f3f3] border border-[#c1c8c2] text-[#012d1d] font-heading font-bold text-xs rounded-full flex items-center gap-2 hover:bg-[#e8e8e8] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">account_balance</span>
            <span>Trade Credit</span>
          </button>
        </div>
      </div>

      {/* Bento Grid KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-[#c1c8c2] p-4 rounded-xl space-y-2">
          <div className="flex justify-between items-center text-[#717973]">
            <span className="text-xs font-bold uppercase">Active Procurement Contracts</span>
            <span className="material-symbols-outlined text-[#012d1d]">handshake</span>
          </div>
          <div className="font-heading font-bold text-3xl text-[#012d1d]">{activeOrders.length || 8} Contracts</div>
          <p className="text-[11px] text-[#414844]">Tracked across Ogun, Benue & Kaduna hubs</p>
        </div>

        <div className="bg-white border border-[#c1c8c2] p-4 rounded-xl space-y-2">
          <div className="flex justify-between items-center text-[#717973]">
            <span className="text-xs font-bold uppercase">Total Commodities Sourced</span>
            <span className="material-symbols-outlined text-[#012d1d]">inventory</span>
          </div>
          <div className="font-heading font-bold text-3xl text-[#012d1d]">1,450 Tonnes</div>
          <p className="text-[11px] text-[#414844]">High-starch Cassava, Maize & Soybeans</p>
        </div>

        <div className="bg-[#1b4332] text-white p-4 rounded-xl space-y-2 border border-[#274e3d]">
          <div className="flex justify-between items-center text-[#86af99]">
            <span className="text-xs font-bold uppercase">Corporate Escrow Balance</span>
            <span className="material-symbols-outlined text-[#c1ecd4]">security</span>
          </div>
          <div className="font-heading font-bold text-3xl text-[#c1ecd4]">₦25,400,000</div>
          <p className="text-[11px] text-[#86af99]">Locked safely until quality inspection & delivery sign-off</p>
        </div>
      </div>

      {/* Active Orders & Sourcing Map */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#c1c8c2] p-4 space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-[#e2e2e2]">
            <h3 className="font-heading font-bold text-sm text-[#012d1d] flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">local_shipping</span>
              <span>Active Sourcing Orders</span>
            </h3>
            <button
              onClick={() => setActiveView('orders')}
              className="text-xs font-bold text-[#012d1d] hover:underline"
            >
              Order Tracking →
            </button>
          </div>

          <div className="space-y-2">
            {activeOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-3 rounded-lg bg-[#f9f9f9] border border-[#e2e2e2] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
              >
                <div className="flex items-center gap-3">
                  <img src={ord.imageUrl} alt={ord.cropTitle} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                  <div>
                    <div className="font-bold text-xs text-[#1a1c1c]">{ord.cropTitle}</div>
                    <div className="text-[11px] text-[#414844] flex items-center gap-1.5 mt-0.5">
                      <img
                        src={getNigerianAvatar(ord.sellerName)}
                        alt={ord.sellerName}
                        className="w-4 h-4 rounded-full object-cover border border-[#c1c8c2]"
                      />
                      <span>Seller: {ord.sellerName} • {ord.originState} → {ord.destinationState}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <div className="text-right">
                    <div className="font-heading font-bold text-xs text-[#012d1d]">
                      ₦{ord.totalPrice.toLocaleString()}
                    </div>
                    <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-[#c1ecd4] text-[#002114]">
                      {ord.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* High-Yield Sourcing Insights */}
        <div className="bg-white rounded-xl border border-[#c1c8c2] p-4 space-y-3">
          <h3 className="font-heading font-bold text-sm text-[#012d1d]">High-Yield Sourcing Clusters</h3>
          <div className="space-y-2.5">
            <div className="p-2.5 rounded-lg bg-[#f3f3f3] border border-[#e2e2e2] space-y-1">
              <div className="flex justify-between font-bold text-xs text-[#1a1c1c]">
                <span>Benue State Hub</span>
                <span className="text-[#012d1d]">Yam & Soybeans</span>
              </div>
              <p className="text-[11px] text-[#414844]">
                1,200 Tonnes available from Zaki Biam cooperatives.
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-[#f3f3f3] border border-[#e2e2e2] space-y-1">
              <div className="flex justify-between font-bold text-xs text-[#1a1c1c]">
                <span>Ogun State Cluster</span>
                <span className="text-[#012d1d]">High Starch Cassava</span>
              </div>
              <p className="text-[11px] text-[#414844]">
                TME 419 harvest season active. Moisture tested &lt; 14%.
              </p>
            </div>

            <button
              onClick={() => setActiveView('marketplace')}
              className="w-full py-2.5 bg-[#012d1d] text-white font-bold text-xs rounded-xl hover:bg-[#1b4332] text-center"
            >
              Browse All Verified Listings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
