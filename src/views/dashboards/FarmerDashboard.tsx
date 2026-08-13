import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export const FarmerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { marketPrices, weatherData, setActiveView, transactions, orders } = useApp();

  const userWeather = weatherData.find((w) => w.state === user.state) || weatherData[0];

  return (
    <div className="space-y-6">
      {/* Top Banner - Welcome */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#3f6653] bg-[#c1ecd4] px-2.5 py-1 rounded-full">
            Farmer Portal
          </span>
          <h1 className="font-heading font-bold text-2xl text-[#012d1d] mt-1">
            Welcome back, {user.name}
          </h1>
          <p className="text-xs text-[#414844]">
            {user.state} Cluster • Farm ID: {user.id.slice(-6).toUpperCase()}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveView('create_listing')}
            className="h-11 px-5 bg-[#012d1d] text-white font-heading font-bold text-xs rounded-full flex items-center gap-2 hover:bg-[#1b4332] active:scale-95 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Sell Produce</span>
          </button>
          <button
            onClick={() => setActiveView('advisory')}
            className="h-11 px-4 bg-[#f3f3f3] border border-[#c1c8c2] text-[#012d1d] font-heading font-bold text-xs rounded-full flex items-center gap-2 hover:bg-[#e8e8e8] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">agriculture</span>
            <span>Agronomy Advisory</span>
          </button>
        </div>
      </div>

      {/* Hero Weather & Advisory Card */}
      <div className="bg-[#1b4332] text-white rounded-2xl p-5 border border-[#274e3d] shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#86af99] text-xs font-bold uppercase">
              <span className="material-symbols-outlined text-[18px] text-[#c1ecd4]">partly_cloudy_day</span>
              <span>Local Weather • {userWeather.state}</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="font-heading font-bold text-4xl text-[#c1ecd4]">{userWeather.tempCelsius}°C</span>
              <span className="text-sm font-semibold">{userWeather.condition}</span>
            </div>
            <p className="text-xs text-[#86af99] max-w-md">{userWeather.advisoryText}</p>
          </div>

          <div className="grid grid-cols-3 gap-2 bg-[#012d1d]/60 p-3 rounded-xl border border-[#274e3d] text-center min-w-[240px]">
            <div>
              <span className="material-symbols-outlined text-[#a5d0b9] text-[20px] mb-1">water_drop</span>
              <div className="text-[10px] text-[#86af99] uppercase font-bold">Rain Risk</div>
              <div className="font-heading font-bold text-sm text-white">{userWeather.rainForecastPercent}%</div>
            </div>
            <div className="border-x border-[#274e3d]">
              <span className="material-symbols-outlined text-[#a5d0b9] text-[20px] mb-1">air</span>
              <div className="text-[10px] text-[#86af99] uppercase font-bold">Wind</div>
              <div className="font-heading font-bold text-sm text-white">{userWeather.windSpeedKm} km/h</div>
            </div>
            <div>
              <span className="material-symbols-outlined text-[#a5d0b9] text-[20px] mb-1">humidity_percentage</span>
              <div className="text-[10px] text-[#86af99] uppercase font-bold">Humidity</div>
              <div className="font-heading font-bold text-sm text-white">{userWeather.humidityPercent}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveView('create_listing')}
          className="p-4 bg-white border border-[#c1c8c2] rounded-xl flex flex-col items-center justify-center text-center gap-2 hover:border-[#012d1d] hover:bg-[#f3f3f3] transition-all active:scale-95 group shadow-xs min-h-[110px]"
        >
          <div className="p-2.5 rounded-xl bg-[#012d1d] text-white group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-[24px]">storefront</span>
          </div>
          <span className="font-heading font-bold text-xs text-[#1a1c1c]">Sell Produce</span>
        </button>

        <button
          onClick={() => setActiveView('advisory')}
          className="p-4 bg-white border border-[#c1c8c2] rounded-xl flex flex-col items-center justify-center text-center gap-2 hover:border-[#012d1d] hover:bg-[#f3f3f3] transition-all active:scale-95 group shadow-xs min-h-[110px]"
        >
          <div className="p-2.5 rounded-xl bg-[#e8e8e8] text-[#012d1d] group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-[24px]">support_agent</span>
          </div>
          <span className="font-heading font-bold text-xs text-[#1a1c1c]">Get Advisory</span>
        </button>

        <button
          onClick={() => setActiveView('wallet')}
          className="p-4 bg-white border border-[#c1c8c2] rounded-xl flex flex-col items-center justify-center text-center gap-2 hover:border-[#012d1d] hover:bg-[#f3f3f3] transition-all active:scale-95 group shadow-xs min-h-[110px]"
        >
          <div className="p-2.5 rounded-xl bg-[#e8e8e8] text-[#012d1d] group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-[24px]">account_balance_wallet</span>
          </div>
          <span className="font-heading font-bold text-xs text-[#1a1c1c]">Digital Wallet</span>
        </button>

        <button
          onClick={() => setActiveView('credit')}
          className="p-4 bg-white border border-[#c1c8c2] rounded-xl flex flex-col items-center justify-center text-center gap-2 hover:border-[#012d1d] hover:bg-[#f3f3f3] transition-all active:scale-95 group shadow-xs min-h-[110px]"
        >
          <div className="p-2.5 rounded-xl bg-[#ffdeac] text-[#523700] group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-[24px]">payments</span>
          </div>
          <span className="font-heading font-bold text-xs text-[#1a1c1c]">Seasonal Loan</span>
        </button>
      </div>

      {/* Main Grid: Market Prices & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Market Prices */}
        <div className="bg-white rounded-xl border border-[#c1c8c2] p-4 space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-[#e2e2e2]">
            <h3 className="font-heading font-bold text-sm text-[#012d1d] flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">trending_up</span>
              <span>Market Prices Today</span>
            </h3>
            <button
              onClick={() => setActiveView('marketplace')}
              className="text-xs font-bold text-[#012d1d] hover:underline"
            >
              Browse All →
            </button>
          </div>

          <div className="space-y-2">
            {marketPrices.map((mp) => (
              <div
                key={mp.id}
                className="p-2.5 rounded-lg bg-[#f9f9f9] border border-[#e2e2e2] flex justify-between items-center"
              >
                <div>
                  <div className="font-bold text-xs text-[#1a1c1c]">{mp.crop}</div>
                  <div className="text-[10px] text-[#717973]">{mp.unit} • Top: {mp.topState}</div>
                </div>
                <div className="text-right">
                  <div className="font-heading font-bold text-sm text-[#012d1d]">
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
        </div>

        {/* Recent Activity Feed */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#c1c8c2] p-4 space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-[#e2e2e2]">
            <h3 className="font-heading font-bold text-sm text-[#012d1d] flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">history</span>
              <span>Recent Activity & Updates</span>
            </h3>
            <button
              onClick={() => setActiveView('orders')}
              className="text-xs font-bold text-[#012d1d] hover:underline"
            >
              My Orders ({orders.length}) →
            </button>
          </div>

          <div className="space-y-2.5">
            {transactions.slice(0, 3).map((tx) => (
              <div key={tx.id} className="p-3 rounded-lg bg-[#f3f3f3] border border-[#e2e2e2] flex items-start gap-3">
                <div
                  className={`p-2 rounded-full shrink-0 ${
                    tx.type === 'credit' || tx.type === 'escrow_release'
                      ? 'bg-[#c1ecd4] text-[#002114]'
                      : 'bg-[#ffdad6] text-[#93000a]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {tx.type === 'credit' || tx.type === 'escrow_release' ? 'payments' : 'outbound'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-xs text-[#1a1c1c] truncate">{tx.description}</h4>
                    <span
                      className={`font-heading font-bold text-xs ${
                        tx.type === 'credit' || tx.type === 'escrow_release'
                          ? 'text-[#012d1d]'
                          : 'text-[#ba1a1a]'
                      }`}
                    >
                      {tx.type === 'credit' || tx.type === 'escrow_release' ? '+' : '-'}₦
                      {tx.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-[#717973] mt-1">
                    <span>{tx.category} • Ref: {tx.reference}</span>
                    <span>{new Date(tx.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
