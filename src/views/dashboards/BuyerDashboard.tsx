import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { getNigerianAvatar } from '../../utils/avatarUtils';

export const BuyerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { orders, setActiveView } = useApp();

  const activeOrders = orders.filter((o) => o.buyerId === user.id);

  return (
    <div className="space-y-6">
      {/* 1. Clean Top Header */}
      <div className="bg-white rounded-2xl border border-[#c1c8c2]/70 p-5 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#002114] bg-[#c1ecd4] px-2.5 py-0.5 rounded-full">
              Buyer & Factory Hub
            </span>
            <span className="text-xs text-[#717973]">
              {user.state || 'Nigeria'} • Capacity: 50 MT/Day • CAC: {user.cacNumber || 'RC-112345'}
            </span>
          </div>
          <h1 className="font-heading font-bold text-xl sm:text-2xl text-[#012d1d]">
            {user.companyName || 'Premium Agro Processors Ltd'}
          </h1>
          <p className="text-xs text-[#525a54]">
            Verified Farm Produce Buying & Order Portal
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => setActiveView('marketplace')}
            className="flex-1 sm:flex-none h-10 px-4 bg-[#012d1d] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-[#1b4332] active:scale-95 transition-all shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">search</span>
            <span>Buy Produce</span>
          </button>
          <button
            onClick={() => setActiveView('wallet')}
            className="flex-1 sm:flex-none h-10 px-3.5 bg-[#f2f6f3] border border-[#c1c8c2] text-[#012d1d] font-bold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-[#e4ede6] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">account_balance</span>
            <span>Buying Wallet</span>
          </button>
        </div>
      </div>

      {/* 2. Key KPI Overview Cards (3 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-[#c1c8c2]/70 p-4 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[#717973] uppercase tracking-wider">
                Active Purchases
              </span>
              <div className="font-heading font-bold text-2xl text-[#012d1d]">
                {activeOrders.length || 8} Orders
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#e6ece8] text-[#012d1d] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">handshake</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-[#e8ece9] text-xs">
            <span className="text-[#525a54]">From 3 Farming Centers</span>
            <span className="text-[#012d1d] font-bold text-[11px]">Direct From Farms</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#c1c8c2]/70 p-4 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[#717973] uppercase tracking-wider">
                Total Produce Bought
              </span>
              <div className="font-heading font-bold text-2xl text-[#012d1d]">
                1,450 MT
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#c1ecd4] text-[#002114] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">inventory</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-[#e8ece9] text-xs">
            <span className="text-[#525a54]">Cassava, Maize & Soy</span>
            <button
              onClick={() => setActiveView('orders')}
              className="text-[#012d1d] font-bold hover:underline inline-flex items-center gap-0.5 text-xs"
            >
              <span>Details</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#c1c8c2]/70 p-4 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[#717973] uppercase tracking-wider">
                Protected Payment Account
              </span>
              <div className="font-heading font-bold text-2xl text-[#012d1d]">
                ₦25,400,000
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#ffdeac] text-[#523700] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">security</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-[#e8ece9] text-xs">
            <span className="text-[#525a54]">Money Safe Until Goods Arrive</span>
            <button
              onClick={() => setActiveView('wallet')}
              className="text-[#012d1d] font-bold hover:underline inline-flex items-center gap-0.5 text-xs"
            >
              <span>Wallet</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Operational Grid: 8 Cols Orders + 4 Cols Sourcing Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#c1c8c2]/70 p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-[#e8ece9]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#012d1d] text-[20px]">local_shipping</span>
              <h2 className="font-heading font-bold text-base text-[#012d1d]">
                My Orders & Deliveries
              </h2>
            </div>
            <button
              onClick={() => setActiveView('orders')}
              className="text-xs font-bold text-[#012d1d] hover:underline flex items-center gap-0.5"
            >
              <span>Track Orders</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>

          <div className="space-y-3">
            {activeOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-3.5 rounded-xl bg-[#f9fbf9] border border-[#e2e8e4] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-[#f2f6f3] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img src={ord.imageUrl} alt={ord.cropTitle} className="w-11 h-11 rounded-xl object-cover shrink-0 border border-[#c1c8c2]" />
                  <div className="min-w-0">
                    <h3 className="font-bold text-xs text-[#1a1c1c] truncate">{ord.cropTitle}</h3>
                    <div className="text-[11px] text-[#717973] flex items-center gap-1.5 mt-0.5 truncate">
                      <img
                        src={getNigerianAvatar(ord.sellerName)}
                        alt={ord.sellerName}
                        className="w-3.5 h-3.5 rounded-full object-cover shrink-0"
                      />
                      <span className="truncate">Seller: {ord.sellerName} • {ord.originState} → {ord.destinationState}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-left sm:text-right">
                    <div className="font-heading font-bold text-xs text-[#012d1d]">
                      ₦{ord.totalPrice.toLocaleString()}
                    </div>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#c1ecd4] text-[#002114]">
                      {ord.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* High-Yield Sourcing Clusters (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#c1c8c2]/70 p-5 shadow-xs space-y-3">
          <h2 className="font-heading font-bold text-sm text-[#012d1d]">Sourcing Hotspots</h2>
          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-[#f9fbf9] border border-[#e2e8e4] space-y-1">
              <div className="flex justify-between font-bold text-xs text-[#1a1c1c]">
                <span>Benue State Hub</span>
                <span className="text-[#012d1d]">Yam & Soybeans</span>
              </div>
              <p className="text-[11px] text-[#717973]">
                1,200 Tonnes available from Zaki Biam cooperatives.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#f9fbf9] border border-[#e2e8e4] space-y-1">
              <div className="flex justify-between font-bold text-xs text-[#1a1c1c]">
                <span>Ogun State Cluster</span>
                <span className="text-[#012d1d]">High Starch Cassava</span>
              </div>
              <p className="text-[11px] text-[#717973]">
                TME 419 harvest season active. Moisture tested &lt; 14%.
              </p>
            </div>

            <button
              onClick={() => setActiveView('marketplace')}
              className="w-full py-2.5 bg-[#012d1d] text-white font-bold text-xs rounded-xl hover:bg-[#1b4332] active:scale-95 transition-all text-center shadow-xs"
            >
              Browse Verified Produce
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
