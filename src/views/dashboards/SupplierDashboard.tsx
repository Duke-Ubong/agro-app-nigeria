import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export const SupplierDashboard: React.FC = () => {
  const { user } = useAuth();
  const { listings, setActiveView } = useApp();

  const supplierListings = listings.filter((l) => l.category === 'Inputs');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#3f6653] bg-[#c1ecd4] px-2.5 py-1 rounded-full">
            Input Merchant Portal
          </span>
          <h1 className="font-heading font-bold text-2xl text-[#012d1d] mt-1">
            {user.companyName || 'AgriGrow Supplies Ltd'}
          </h1>
          <p className="text-xs text-[#414844]">
            {user.state} • Seed & Fertilizer Merchant • NAFDAC Approved
          </p>
        </div>

        <button
          onClick={() => setActiveView('create_listing')}
          className="h-11 px-5 bg-[#012d1d] text-white font-heading font-bold text-xs rounded-full flex items-center gap-2 hover:bg-[#1b4332] active:scale-95 transition-all shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">add_box</span>
          <span>Post Input Product</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-[#c1c8c2] p-4 rounded-xl space-y-2">
          <div className="flex justify-between items-center text-[#717973]">
            <span className="text-xs font-bold uppercase">Input Catalog</span>
            <span className="material-symbols-outlined text-[#012d1d]">water_drop</span>
          </div>
          <div className="font-heading font-bold text-3xl text-[#012d1d]">{supplierListings.length} Products</div>
          <p className="text-[11px] text-[#414844]">NPK, Urea, Certified Hybrid Seeds</p>
        </div>

        <div className="bg-white border border-[#c1c8c2] p-4 rounded-xl space-y-2">
          <div className="flex justify-between items-center text-[#717973]">
            <span className="text-xs font-bold uppercase">Pending Farmer Voucher Orders</span>
            <span className="material-symbols-outlined text-[#012d1d]">confirmation_number</span>
          </div>
          <div className="font-heading font-bold text-3xl text-[#012d1d]">24 Orders</div>
          <p className="text-[11px] text-[#414844]">50% Federal Subsidy Voucher Vetted</p>
        </div>

        <div className="bg-[#1b4332] text-white p-4 rounded-xl space-y-2 border border-[#274e3d]">
          <div className="flex justify-between items-center text-[#86af99]">
            <span className="text-xs font-bold uppercase">Monthly Input Revenue</span>
            <span className="material-symbols-outlined text-[#c1ecd4]">payments</span>
          </div>
          <div className="font-heading font-bold text-3xl text-[#c1ecd4]">₦8,250,000</div>
          <p className="text-[11px] text-[#86af99]">Direct Bank Settlement within 24h</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#c1c8c2] p-4 space-y-3">
        <h3 className="font-heading font-bold text-sm text-[#012d1d]">Active Seed & Fertilizer Inventory</h3>
        <div className="space-y-2">
          {supplierListings.map((item) => (
            <div key={item.id} className="p-3 bg-[#f9f9f9] border border-[#e2e2e2] rounded-lg flex justify-between items-center">
              <div>
                <div className="font-bold text-xs text-[#1a1c1c]">{item.title}</div>
                <div className="text-[11px] text-[#717973]">
                  Available: {item.availableQuantity} {item.unit} • Grade: {item.grade || 'NAFDAC Approved'}
                </div>
              </div>
              <div className="text-right">
                <div className="font-heading font-bold text-xs text-[#012d1d]">₦{item.price.toLocaleString()}</div>
                <button
                  onClick={() => setActiveView('marketplace')}
                  className="text-[10px] font-bold text-[#012d1d] underline"
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
