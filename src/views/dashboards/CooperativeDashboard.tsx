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
      {/* 1. Clean Top Header & Actions */}
      <div className="bg-white rounded-2xl border border-[#c1c8c2]/70 p-5 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#002114] bg-[#c1ecd4] px-2.5 py-0.5 rounded-full">
              Cooperative Group
            </span>
            <span className="text-xs text-[#717973]">
              {user.state || 'Nigeria'} • {user.memberCount || 150} Farmers Registered
            </span>
          </div>
          <h1 className="font-heading font-bold text-xl sm:text-2xl text-[#012d1d]">
            {user.companyName || user.name}
          </h1>
          <p className="text-xs text-[#525a54]">
            Farmer Group & Produce Collection Center
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => setActiveView('create_listing')}
            className="flex-1 sm:flex-none h-10 px-4 bg-[#012d1d] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-[#1b4332] active:scale-95 transition-all shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Add Group Harvest</span>
          </button>
          <button
            onClick={() => setActiveView('credit')}
            className="flex-1 sm:flex-none h-10 px-3.5 bg-[#f2f6f3] border border-[#c1c8c2] text-[#012d1d] font-bold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-[#e4ede6] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">account_balance</span>
            <span>Group Loans</span>
          </button>
        </div>
      </div>

      {/* 2. Key KPI Overview Cards (3 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-[#c1c8c2]/70 p-4 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[#717973] uppercase tracking-wider">
                Registered Members
              </span>
              <div className="font-heading font-bold text-2xl text-[#012d1d]">
                {user.memberCount || 150} Farmers
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#e6ece8] text-[#012d1d] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">groups</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-[#e8ece9] text-xs">
            <span className="text-[#525a54]">12 Farm Groups</span>
            <span className="text-[#012d1d] font-bold text-[11px]">All Members Verified</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#c1c8c2]/70 p-4 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[#717973] uppercase tracking-wider">
                Produce for Sale
              </span>
              <div className="font-heading font-bold text-2xl text-[#012d1d]">
                {coopListings.length} Lots
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#c1ecd4] text-[#002114] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">inventory_2</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-[#e8ece9] text-xs">
            <span className="text-[#525a54]">Group Grains & Crops</span>
            <button
              onClick={() => setActiveView('marketplace')}
              className="text-[#012d1d] font-bold hover:underline inline-flex items-center gap-0.5 text-xs"
            >
              <span>Manage</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#c1c8c2]/70 p-4 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[#717973] uppercase tracking-wider">
                Group Loan Fund
              </span>
              <div className="font-heading font-bold text-2xl text-[#012d1d]">
                ₦15,000,000
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#ffdeac] text-[#523700] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">account_balance_wallet</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-[#e8ece9] text-xs">
            <span className="text-[#525a54]">₦4.2M Available for Seeds & Fertilizer</span>
            <button
              onClick={() => setActiveView('credit')}
              className="text-[#012d1d] font-bold hover:underline inline-flex items-center gap-0.5 text-xs"
            >
              <span>Loans</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Operational Grid: 8 Cols Queue + 4 Cols Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#c1c8c2]/70 p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-[#e8ece9]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#012d1d] text-[20px]">pending_actions</span>
              <h2 className="font-heading font-bold text-base text-[#012d1d]">
                Member Requests for Loans & Farm Supplies
              </h2>
            </div>
            <span className="text-[11px] bg-[#ffdeac] text-[#281900] px-2.5 py-0.5 rounded-full font-bold">
              {coopLoans.length} Requests
            </span>
          </div>

          <div className="space-y-3">
            {coopLoans.map((loan) => (
              <div
                key={loan.id}
                className="p-3.5 rounded-xl bg-[#f9fbf9] border border-[#e2e8e4] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-[#f2f6f3] transition-colors"
              >
                <div>
                  <div className="font-bold text-xs text-[#1a1c1c]">{loan.applicantName}</div>
                  <div className="text-[11px] text-[#717973]">
                    For: {loan.purpose} • Guarantee: {loan.collateral}
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-left sm:text-right">
                    <div className="font-heading font-bold text-xs text-[#012d1d]">
                      ₦{loan.amount.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-[#717973]">{loan.durationMonths} Months</div>
                  </div>
                  <button
                    onClick={() => setActiveView('credit')}
                    className="px-3.5 py-1.5 bg-[#012d1d] text-white text-xs font-bold rounded-xl hover:bg-[#1b4332] active:scale-95 transition-all shadow-xs"
                  >
                    Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Operations (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#c1c8c2]/70 p-5 shadow-xs space-y-3">
          <h2 className="font-heading font-bold text-sm text-[#012d1d]">Group Actions</h2>
          <div className="space-y-2.5">
            <button
              onClick={() => setActiveView('create_listing')}
              className="w-full text-left p-3 rounded-xl bg-[#f9fbf9] hover:bg-[#f2f6f3] transition-colors border border-[#e2e8e4] flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-[#e6ece8] text-[#012d1d] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">post_add</span>
              </div>
              <div className="min-w-0">
                <div className="font-bold text-xs text-[#1a1c1c]">Combine Member Harvest</div>
                <div className="text-[10px] text-[#717973] truncate">Put crops together to sell in bulk</div>
              </div>
            </button>

            <button
              onClick={() => setActiveView('orders')}
              className="w-full text-left p-3 rounded-xl bg-[#f9fbf9] hover:bg-[#f2f6f3] transition-colors border border-[#e2e8e4] flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-[#e6ece8] text-[#012d1d] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">local_shipping</span>
              </div>
              <div className="min-w-0">
                <div className="font-bold text-xs text-[#1a1c1c]">Arrange Delivery Trucks</div>
                <div className="text-[10px] text-[#717973] truncate">Book trucks to carry produce</div>
              </div>
            </button>

            <button
              onClick={() => setActiveView('wallet')}
              className="w-full text-left p-3 rounded-xl bg-[#f9fbf9] hover:bg-[#f2f6f3] transition-colors border border-[#e2e8e4] flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-[#e6ece8] text-[#012d1d] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">redeem</span>
              </div>
              <div className="min-w-0">
                <div className="font-bold text-xs text-[#1a1c1c]">Pay Members Their Share</div>
                <div className="text-[10px] text-[#717973] truncate">Send crop sales money to farmers</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
