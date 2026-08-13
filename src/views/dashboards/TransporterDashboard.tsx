import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export const TransporterDashboard: React.FC = () => {
  const { user } = useAuth();
  const { orders, setActiveView } = useApp();

  const activeDeliveries = orders.filter((o) => o.status === 'in_transit' || o.status === 'accepted');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#3f6653] bg-[#c1ecd4] px-2.5 py-1 rounded-full">
            Logistics & Freight Portal
          </span>
          <h1 className="font-heading font-bold text-2xl text-[#012d1d] mt-1">
            {user.companyName || user.name}
          </h1>
          <p className="text-xs text-[#414844]">
            {user.state} • Vehicle: {user.vehicleType || '30-Ton Flatbed Truck'} ({user.licensePlate || 'KAD-882-X'})
          </p>
        </div>

        <button
          onClick={() => setActiveView('orders')}
          className="h-11 px-5 bg-[#012d1d] text-white font-heading font-bold text-xs rounded-full flex items-center gap-2 hover:bg-[#1b4332] active:scale-95 transition-all shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">local_shipping</span>
          <span>Load Board & Jobs</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-[#c1c8c2] p-4 rounded-xl space-y-2">
          <div className="flex justify-between items-center text-[#717973]">
            <span className="text-xs font-bold uppercase">Active In-Transit Freight</span>
            <span className="material-symbols-outlined text-[#012d1d]">route</span>
          </div>
          <div className="font-heading font-bold text-3xl text-[#012d1d]">
            {activeDeliveries.length} Trips
          </div>
          <p className="text-[11px] text-[#414844]">Kano → Lagos & Kaduna → Abuja Corridors</p>
        </div>

        <div className="bg-white border border-[#c1c8c2] p-4 rounded-xl space-y-2">
          <div className="flex justify-between items-center text-[#717973]">
            <span className="text-xs font-bold uppercase">Fleet On-Time Rate</span>
            <span className="material-symbols-outlined text-[#012d1d]">speed</span>
          </div>
          <div className="font-heading font-bold text-3xl text-[#012d1d]">98.5%</div>
          <p className="text-[11px] text-[#414844]">GPS tracking & digital waybill enabled</p>
        </div>

        <div className="bg-[#1b4332] text-white p-4 rounded-xl space-y-2 border border-[#274e3d]">
          <div className="flex justify-between items-center text-[#86af99]">
            <span className="text-xs font-bold uppercase">Weekly Freight Earnings</span>
            <span className="material-symbols-outlined text-[#c1ecd4]">account_balance_wallet</span>
          </div>
          <div className="font-heading font-bold text-3xl text-[#c1ecd4]">₦1,850,000</div>
          <p className="text-[11px] text-[#86af99]">Automatic split-settlement to driver & fleet wallet</p>
        </div>
      </div>

      {/* Active Jobs List */}
      <div className="bg-white rounded-xl border border-[#c1c8c2] p-4 space-y-3">
        <div className="flex justify-between items-center pb-2 border-b border-[#e2e2e2]">
          <h3 className="font-heading font-bold text-sm text-[#012d1d] flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">local_shipping</span>
            <span>Active Freight Deliveries</span>
          </h3>
          <button
            onClick={() => setActiveView('orders')}
            className="text-xs font-bold text-[#012d1d] hover:underline"
          >
            Track All →
          </button>
        </div>

        <div className="space-y-2">
          {activeDeliveries.map((del) => (
            <div
              key={del.id}
              className="p-3 bg-[#f9f9f9] border border-[#e2e2e2] rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
            >
              <div>
                <div className="font-bold text-xs text-[#1a1c1c]">{del.cropTitle}</div>
                <div className="text-[11px] text-[#717973]">
                  Route: {del.originState} → {del.destinationState} • Code: {del.trackingCode}
                </div>
              </div>
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <span className="text-xs font-bold text-[#012d1d]">₦{del.totalPrice.toLocaleString()}</span>
                <button
                  onClick={() => setActiveView('orders')}
                  className="px-3 py-1 bg-[#012d1d] text-white text-[11px] font-bold rounded-lg hover:bg-[#1b4332]"
                >
                  Live GPS Track
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
