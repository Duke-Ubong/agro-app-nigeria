import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export const CooperativeDashboard: React.FC = () => {
  const { user } = useAuth();
  const { listings, orders, setActiveView, loans } = useApp();

  const coopListings = listings.filter((l) => l.sellerRole === 'cooperative');
  const coopLoans = loans.filter((l) => l.applicantRole === 'cooperative' || l.applicantRole === 'farmer');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#3f6653] bg-[#c1ecd4] px-2.5 py-1 rounded-full">
            Cooperative Cluster Portal
          </span>
          <h1 className="font-heading font-bold text-2xl text-[#012d1d] mt-1">
            {user.companyName || user.name}
          </h1>
          <p className="text-xs text-[#414844]">
            {user.state} • {user.memberCount || 150} Smallholder Farmers Enrolled
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveView('create_listing')}
            className="h-11 px-5 bg-[#012d1d] text-white font-heading font-bold text-xs rounded-full flex items-center gap-2 hover:bg-[#1b4332] active:scale-95 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Create Bulk Listing</span>
          </button>
          <button
            onClick={() => setActiveView('credit')}
            className="h-11 px-4 bg-[#f3f3f3] border border-[#c1c8c2] text-[#012d1d] font-heading font-bold text-xs rounded-full flex items-center gap-2 hover:bg-[#e8e8e8] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">account_balance</span>
            <span>Group Credit Hub</span>
          </button>
        </div>
      </div>

      {/* Bento Grid KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-[#c1c8c2] p-4 rounded-xl space-y-2">
          <div className="flex justify-between items-center text-[#717973]">
            <span className="text-xs font-bold uppercase">Enrolled Members</span>
            <span className="material-symbols-outlined text-[#012d1d]">groups</span>
          </div>
          <div className="font-heading font-bold text-3xl text-[#012d1d]">
            {user.memberCount || 150} Farmers
          </div>
          <p className="text-[11px] text-[#414844]">Registered across 12 local farming clusters</p>
        </div>

        <div className="bg-white border border-[#c1c8c2] p-4 rounded-xl space-y-2">
          <div className="flex justify-between items-center text-[#717973]">
            <span className="text-xs font-bold uppercase">Active Bulk Lots</span>
            <span className="material-symbols-outlined text-[#012d1d]">inventory_2</span>
          </div>
          <div className="font-heading font-bold text-3xl text-[#012d1d]">{coopListings.length} Lots</div>
          <p className="text-[11px] text-[#414844]">Aggregated grains & tubers for off-taker fulfillment</p>
        </div>

        <div className="bg-[#1b4332] text-white p-4 rounded-xl space-y-2 border border-[#274e3d]">
          <div className="flex justify-between items-center text-[#86af99]">
            <span className="text-xs font-bold uppercase">Revolving Credit Facility</span>
            <span className="material-symbols-outlined text-[#c1ecd4]">account_balance_wallet</span>
          </div>
          <div className="font-heading font-bold text-3xl text-[#c1ecd4]">₦15,000,000</div>
          <p className="text-[11px] text-[#86af99]">4.2M available for input loans to cluster farmers</p>
        </div>
      </div>

      {/* Main Operations & Member Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#c1c8c2] p-4 space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-[#e2e2e2]">
            <h3 className="font-heading font-bold text-sm text-[#012d1d] flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">queue</span>
              <span>Pending Member Loan & Input Requests</span>
            </h3>
            <span className="text-[10px] bg-[#ffdeac] text-[#281900] px-2 py-0.5 rounded-full font-bold">
              {coopLoans.length} Requests
            </span>
          </div>

          <div className="space-y-2">
            {coopLoans.map((loan) => (
              <div
                key={loan.id}
                className="p-3 rounded-lg bg-[#f9f9f9] border border-[#e2e2e2] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
              >
                <div>
                  <div className="font-bold text-xs text-[#1a1c1c]">{loan.applicantName}</div>
                  <div className="text-[11px] text-[#414844]">
                    Purpose: {loan.purpose} • Collateral: {loan.collateral}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-heading font-bold text-xs text-[#012d1d]">
                      ₦{loan.amount.toLocaleString()}
                    </div>
                    <div className="text-[9px] text-[#717973]">{loan.durationMonths} Months</div>
                  </div>
                  <button
                    onClick={() => setActiveView('credit')}
                    className="px-3 py-1 bg-[#012d1d] text-white text-[11px] font-bold rounded-lg hover:bg-[#1b4332]"
                  >
                    Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Operations */}
        <div className="bg-white rounded-xl border border-[#c1c8c2] p-4 space-y-3">
          <h3 className="font-heading font-bold text-sm text-[#012d1d]">Cooperative Operations</h3>
          <div className="space-y-2">
            <button
              onClick={() => setActiveView('create_listing')}
              className="w-full text-left p-3 rounded-xl bg-[#f3f3f3] hover:bg-[#e8e8e8] transition-colors border border-[#c1c8c2] flex items-center gap-3"
            >
              <span className="material-symbols-outlined text-[#012d1d]">post_add</span>
              <div>
                <div className="font-bold text-xs text-[#1a1c1c]">Aggregate Harvest Output</div>
                <div className="text-[10px] text-[#717973]">Combine smallholder harvest into bulk lot</div>
              </div>
            </button>

            <button
              onClick={() => setActiveView('orders')}
              className="w-full text-left p-3 rounded-xl bg-[#f3f3f3] hover:bg-[#e8e8e8] transition-colors border border-[#c1c8c2] flex items-center gap-3"
            >
              <span className="material-symbols-outlined text-[#012d1d]">local_shipping</span>
              <div>
                <div className="font-bold text-xs text-[#1a1c1c]">Coordinate Logistics</div>
                <div className="text-[10px] text-[#717973]">Assign trucks for bulk pickup</div>
              </div>
            </button>

            <button
              onClick={() => setActiveView('wallet')}
              className="w-full text-left p-3 rounded-xl bg-[#f3f3f3] hover:bg-[#e8e8e8] transition-colors border border-[#c1c8c2] flex items-center gap-3"
            >
              <span className="material-symbols-outlined text-[#012d1d]">redeem</span>
              <div>
                <div className="font-bold text-xs text-[#1a1c1c]">Bulk Dividend Payout</div>
                <div className="text-[10px] text-[#717973]">Distribute off-taker proceeds to farmers</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
