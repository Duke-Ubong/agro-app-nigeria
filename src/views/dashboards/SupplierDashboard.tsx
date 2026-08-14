import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export const SupplierDashboard: React.FC = () => {
  const { user } = useAuth();
  const { listings, setActiveView } = useApp();

  const supplierListings = listings.filter((l) => l.category === 'Inputs');

  return (
    <div className="space-y-6">
      {/* 1. Clean Top Header */}
      <div className="bg-white rounded-2xl border border-[#c1c8c2]/70 p-5 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#002114] bg-[#c1ecd4] px-2.5 py-0.5 rounded-full">
              Farm Supplies Shop
            </span>
            <span className="text-xs text-[#717973]">
              {user.state || 'Nigeria'} • NAFDAC Approved Certified Merchant
            </span>
          </div>
          <h1 className="font-heading font-bold text-xl sm:text-2xl text-[#012d1d]">
            {user.companyName || 'AgriGrow Supplies Ltd'}
          </h1>
          <p className="text-xs text-[#525a54]">
            Certified Seeds, Fertilizers & Farm Supplies Portal
          </p>
        </div>

        <button
          onClick={() => setActiveView('create_listing')}
          className="h-10 px-4 bg-[#012d1d] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-[#1b4332] active:scale-95 transition-all shadow-xs"
        >
          <span className="material-symbols-outlined text-[18px]">add_box</span>
          <span>Add New Supply Item</span>
        </button>
      </div>

      {/* 2. Key KPI Overview Cards (3 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-[#c1c8c2]/70 p-4 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[#717973] uppercase tracking-wider">
                My Store Items
              </span>
              <div className="font-heading font-bold text-2xl text-[#012d1d]">
                {supplierListings.length} Products
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#e6ece8] text-[#012d1d] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">water_drop</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-[#e8ece9] text-xs">
            <span className="text-[#525a54]">NPK, Urea & Hybrid Seeds</span>
            <span className="text-[#012d1d] font-bold text-[11px]">NAFDAC Vetted</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#c1c8c2]/70 p-4 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[#717973] uppercase tracking-wider">
                Government Voucher Orders
              </span>
              <div className="font-heading font-bold text-2xl text-[#012d1d]">
                24 Orders
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#c1ecd4] text-[#002114] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">confirmation_number</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-[#e8ece9] text-xs">
            <span className="text-[#525a54]">50% Government Discount</span>
            <span className="text-[#012d1d] font-bold text-[11px]">Instant Claim</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#c1c8c2]/70 p-4 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[#717973] uppercase tracking-wider">
                Total Sales Money
              </span>
              <div className="font-heading font-bold text-2xl text-[#012d1d]">
                ₦8,250,000
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#ffdeac] text-[#523700] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">payments</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-[#e8ece9] text-xs">
            <span className="text-[#525a54]">Fast 24-Hour Payout</span>
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

      {/* 3. Inventory Table / Cards */}
      <div className="bg-white rounded-2xl border border-[#c1c8c2]/70 p-5 shadow-xs space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-[#e8ece9]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#012d1d] text-[20px]">inventory</span>
            <h2 className="font-heading font-bold text-base text-[#012d1d]">
              My Seed, Fertilizer & Chemical Stock
            </h2>
          </div>
          <button
            onClick={() => setActiveView('marketplace')}
            className="text-xs font-bold text-[#012d1d] hover:underline flex items-center gap-0.5"
          >
            <span>View All Stock</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>

        <div className="space-y-3">
          {supplierListings.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-[#f9fbf9] border border-[#e2e8e4] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-[#f2f6f3] transition-colors"
            >
              <div>
                <div className="font-bold text-xs text-[#1a1c1c]">{item.title}</div>
                <div className="text-[11px] text-[#717973]">
                  Available: {item.availableQuantity} {item.unit} • Grade: {item.grade || 'NAFDAC Approved'}
                </div>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <div className="text-left sm:text-right">
                  <div className="font-heading font-bold text-xs text-[#012d1d]">₦{item.price.toLocaleString()}</div>
                  <span className="text-[10px] text-[#717973]">Per {item.unit}</span>
                </div>
                <button
                  onClick={() => setActiveView('marketplace')}
                  className="px-3 py-1.5 bg-[#f2f6f3] border border-[#c1c8c2] text-[#012d1d] text-xs font-bold rounded-xl hover:bg-[#e4ede6] transition-colors"
                >
                  Manage Stock
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
