import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export const FarmerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { marketPrices, weatherData, setActiveView, transactions, orders, walletBalance } = useApp();

  const userWeather = weatherData.find((w) => w.state === user.state) || weatherData[0];
  const myOrders = orders.filter((o) => o.sellerId === user.id || o.buyerId === user.id);
  const myTransactions = transactions.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* 1. Clean Top Header & Actions */}
      <div className="bg-white rounded-2xl border border-[#c1c8c2]/70 p-5 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#002114] bg-[#c1ecd4] px-2.5 py-0.5 rounded-full">
              My Farm Hub
            </span>
            <span className="text-xs text-[#717973]">
              {user.state || 'Nigeria'} • Farmer ID: #{user.id.slice(-6).toUpperCase()}
            </span>
          </div>
          <h1 className="font-heading font-bold text-xl sm:text-2xl text-[#012d1d]">
            Welcome back, {user.name}
          </h1>
          <p className="text-xs text-[#525a54]">
            Federal Ministry of Agriculture • Registered Farmer
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => setActiveView('create_listing')}
            className="flex-1 sm:flex-none h-10 px-4 bg-[#012d1d] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-[#1b4332] active:scale-95 transition-all shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Sell Produce</span>
          </button>
          <button
            onClick={() => setActiveView('advisory')}
            className="flex-1 sm:flex-none h-10 px-3.5 bg-[#f2f6f3] border border-[#c1c8c2] text-[#012d1d] font-bold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-[#e4ede6] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">agriculture</span>
            <span>Farming Tips</span>
          </button>
        </div>
      </div>

      {/* 2. Key Overview Metric Cards (3 Balanced Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Wallet & Escrow */}
        <div className="bg-white rounded-2xl border border-[#c1c8c2]/70 p-4 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[#717973] uppercase tracking-wider">
                My Farm Wallet
              </span>
              <div className="font-heading font-bold text-2xl text-[#012d1d]">
                ₦{(walletBalance || 485000).toLocaleString()}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#e6ece8] text-[#012d1d] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">account_balance_wallet</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-[#e8ece9] text-xs">
            <span className="text-[#525a54]">Protected Wallet (Bank of Agriculture)</span>
            <button
              onClick={() => setActiveView('wallet')}
              className="text-[#012d1d] font-bold hover:underline inline-flex items-center gap-0.5 text-xs"
            >
              <span>Open Wallet</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Local Agro-Weather */}
        <div className="bg-white rounded-2xl border border-[#c1c8c2]/70 p-4 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[#717973] uppercase tracking-wider">
                Weather • {userWeather.state}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-heading font-bold text-2xl text-[#012d1d]">
                  {userWeather.tempCelsius}°C
                </span>
                <span className="text-xs font-semibold text-[#3f6653]">{userWeather.condition}</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#c1ecd4] text-[#002114] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">partly_cloudy_day</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-[#e8ece9] text-xs">
            <span className="text-[#525a54]">Chance of Rain: <strong className="text-[#012d1d]">{userWeather.rainForecastPercent}%</strong></span>
            <button
              onClick={() => setActiveView('advisory')}
              className="text-[#012d1d] font-bold hover:underline inline-flex items-center gap-0.5 text-xs"
            >
              <span>Forecast</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Active Trade & Orders */}
        <div className="bg-white rounded-2xl border border-[#c1c8c2]/70 p-4 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[#717973] uppercase tracking-wider">
                Active Orders
              </span>
              <div className="font-heading font-bold text-2xl text-[#012d1d]">
                {myOrders.length > 0 ? myOrders.length : 3} Orders
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#ffdeac] text-[#523700] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">local_shipping</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-[#e8ece9] text-xs">
            <span className="text-[#525a54]">Deliveries in Progress</span>
            <button
              onClick={() => setActiveView('orders')}
              className="text-[#012d1d] font-bold hover:underline inline-flex items-center gap-0.5 text-xs"
            >
              <span>View Orders</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Operational Grid: 2/3 Feed + 1/3 Market Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Orders & Agronomy Alert (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Recent Orders & Activity */}
          <div className="bg-white rounded-2xl border border-[#c1c8c2]/70 p-5 shadow-xs space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#e8ece9]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#012d1d] text-[20px]">receipt_long</span>
                <h2 className="font-heading font-bold text-base text-[#012d1d]">
                  Recent Orders & Transactions
                </h2>
              </div>
              <button
                onClick={() => setActiveView('orders')}
                className="text-xs font-bold text-[#012d1d] hover:underline flex items-center gap-0.5"
              >
                <span>View All</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>

            <div className="space-y-3">
              {myTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-3.5 rounded-xl bg-[#f9fbf9] border border-[#e2e8e4] flex items-center justify-between gap-3 hover:bg-[#f2f6f3] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        tx.type === 'credit' || tx.type === 'escrow_release'
                          ? 'bg-[#c1ecd4] text-[#002114]'
                          : 'bg-[#ffdad6] text-[#93000a]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {tx.type === 'credit' || tx.type === 'escrow_release' ? 'payments' : 'outbound'}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-xs text-[#1a1c1c] truncate">{tx.description}</h3>
                      <p className="text-[11px] text-[#717973] truncate">
                        {tx.category} • Ref: {tx.reference} • {new Date(tx.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div
                      className={`font-heading font-bold text-xs sm:text-sm ${
                        tx.type === 'credit' || tx.type === 'escrow_release'
                          ? 'text-[#012d1d]'
                          : 'text-[#ba1a1a]'
                      }`}
                    >
                      {tx.type === 'credit' || tx.type === 'escrow_release' ? '+' : '-'}₦
                      {tx.amount.toLocaleString()}
                    </div>
                    <span className="text-[10px] text-[#717973] capitalize">{tx.status || 'Settled'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Agronomy Field Advisory Card */}
          <div className="bg-[#f4f8f5] rounded-2xl border border-[#d2e2d7] p-5 space-y-3">
            <div className="flex items-center gap-2 text-[#012d1d]">
              <span className="material-symbols-outlined text-[22px] text-[#3f6653]">psychology_alt</span>
              <h3 className="font-heading font-bold text-sm">Today's Farming Advice</h3>
            </div>
            <p className="text-xs text-[#303732] leading-relaxed">
              {userWeather.advisoryText || 'Good soil water level in your area. Put your second fertilizer in the cool morning. Check your crops for insect pests.'}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[10px] bg-white border border-[#c1c8c2] text-[#012d1d] font-bold px-2.5 py-1 rounded-full">
                🌾 Crop: Maize & Sorghum
              </span>
              <span className="text-[10px] bg-white border border-[#c1c8c2] text-[#012d1d] font-bold px-2.5 py-1 rounded-full">
                🧪 Fertilizer: NPK 15:15:15
              </span>
              <button
                onClick={() => setActiveView('advisory')}
                className="text-[11px] font-bold text-[#012d1d] hover:underline ml-auto"
              >
                Read Full Farming Guide →
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Market Prices & Quick Access (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Commodity Market Prices */}
          <div className="bg-white rounded-2xl border border-[#c1c8c2]/70 p-5 shadow-xs space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-[#e8ece9]">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#012d1d] text-[18px]">trending_up</span>
                <h2 className="font-heading font-bold text-sm text-[#012d1d]">
                  Crop Market Prices Today
                </h2>
              </div>
              <button
                onClick={() => setActiveView('marketplace')}
                className="text-[11px] font-bold text-[#012d1d] hover:underline"
              >
                Browse All
              </button>
            </div>

            <div className="space-y-2">
              {marketPrices.slice(0, 5).map((mp) => (
                <div
                  key={mp.id}
                  className="p-2.5 rounded-xl bg-[#f9fbf9] border border-[#e8ece9] flex justify-between items-center hover:bg-[#f2f6f3] transition-colors"
                >
                  <div>
                    <div className="font-bold text-xs text-[#1a1c1c]">{mp.crop}</div>
                    <div className="text-[10px] text-[#717973]">{mp.unit} • {mp.topState}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-heading font-bold text-xs text-[#012d1d]">
                      ₦{mp.priceNaira.toLocaleString()}
                    </div>
                    <div
                      className={`text-[10px] font-bold flex items-center justify-end gap-0.5 ${
                        mp.changePercent > 0
                          ? 'text-[#012d1d]'
                          : mp.changePercent < 0
                          ? 'text-[#ba1a1a]'
                          : 'text-[#717973]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[12px]">
                        {mp.changePercent > 0 ? 'trending_up' : mp.changePercent < 0 ? 'trending_down' : 'horizontal_rule'}
                      </span>
                      <span>{mp.changePercent > 0 ? `+${mp.changePercent}%` : `${mp.changePercent}%`}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveView('marketplace')}
              className="w-full mt-2 py-2 px-3 bg-[#f2f6f3] hover:bg-[#e4ede6] text-[#012d1d] text-xs font-bold rounded-xl text-center transition-colors border border-[#c1c8c2]"
            >
              Open Crop Market
            </button>
          </div>

          {/* Support & Offline USSD Card */}
          <div className="bg-[#012d1d] text-white rounded-2xl p-4 space-y-2.5 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#c1ecd4] text-[20px]">phone_in_talk</span>
              <h3 className="font-heading font-bold text-xs text-white">Farmer Help & Phone Code</h3>
            </div>
            <p className="text-[11px] text-[#86af99] leading-tight">
              Check prices, farm tips, and weather on any phone without internet.
            </p>
            <div className="bg-[#1b4332] rounded-xl p-2.5 text-center border border-[#274e3d]">
              <div className="text-[10px] text-[#86af99] uppercase font-semibold">Free Phone Code</div>
              <div className="font-heading font-bold text-lg text-[#c1ecd4] tracking-wider">*384*247#</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
