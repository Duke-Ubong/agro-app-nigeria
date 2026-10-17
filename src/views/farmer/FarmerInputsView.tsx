import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { BulkInputCampaign } from '../../types';

export const FarmerInputsView: React.FC = () => {
  const { user } = useAuth();
  const {
    bulkInputCampaigns,
    orderBulkInputForFarmer,
    walletBalance,
    coopMembers,
    setActiveView,
  } = useApp();

  const [selectedCampaign, setSelectedCampaign] = useState<BulkInputCampaign | null>(null);
  const [orderQuantity, setOrderQuantity] = useState<number>(4);
  const [paymentOption, setPaymentOption] = useState<'cash' | 'credit'>('credit');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const currentMember = coopMembers.find((m) => m.id === 'mem_001') || coopMembers[0];

  // Farmer's active bulk orders across all campaigns
  const myOrders = bulkInputCampaigns
    .map((c) => {
      const participation = c.participatingMembers.find(
        (pm) => pm.memberId === currentMember.id || pm.memberName.toLowerCase().includes(user.name.toLowerCase().split(' ')[0])
      );
      return participation ? { campaign: c, order: participation } : null;
    })
    .filter(Boolean) as { campaign: BulkInputCampaign; order: any }[];

  const handleOpenOrderModal = (campaign: BulkInputCampaign) => {
    setSelectedCampaign(campaign);
    setOrderQuantity(4);
    setPaymentOption('credit');
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaign) return;

    orderBulkInputForFarmer(selectedCampaign.id, orderQuantity, paymentOption);

    const savedAmount = (selectedCampaign.retailMarketPriceNaira - selectedCampaign.groupDiscountPriceNaira) * orderQuantity;
    setSuccessMessage(
      `Successfully allocated ${orderQuantity} ${selectedCampaign.unit} of ${selectedCampaign.title}. You saved ₦${savedAmount.toLocaleString()} via cooperative group buying!`
    );
    setSelectedCampaign(null);
  };

  const filteredCampaigns = filterCategory === 'all'
    ? bulkInputCampaigns
    : bulkInputCampaigns.filter((c) => c.category.toLowerCase().includes(filterCategory.toLowerCase()));

  const totalSavingsAchieved = myOrders.reduce((acc, item) => {
    const diff = item.campaign.retailMarketPriceNaira - item.campaign.groupDiscountPriceNaira;
    return acc + diff * item.order.unitsRequested;
  }, 0);

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-2xl border border-[#c1c8c2]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#3f6653] uppercase tracking-wider mb-1">
            <span>Cooperative Input Services</span>
            <span>·</span>
            <span>Direct Bulk Factory Procurement</span>
          </div>
          <h1 className="font-heading font-bold text-2xl text-[#012d1d]">
            Co-op Group Inputs & Subsidies
          </h1>
          <p className="text-xs text-[#414844] mt-1">
            Order authentic certified fertilizers, hybrid seeds, and crop protection at wholesale prices through cooperative group pooling.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#f0f7f3] border border-[#a5d0b9] px-4 py-2.5 rounded-xl">
          <span className="material-symbols-outlined text-[24px] text-[#012d1d]">savings</span>
          <div>
            <div className="text-[10px] text-[#717973] uppercase font-bold">Your Group Savings</div>
            <div className="font-heading font-bold text-base text-[#012d1d] tabular-nums">
              ₦{totalSavingsAchieved.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successMessage && (
        <div className="bg-[#c1ecd4] border border-[#274e3d] text-[#002114] p-4 rounded-xl flex justify-between items-center text-xs font-semibold animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-[#002114] hover:underline font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Inputs' },
          { id: 'fertilizer', label: 'Fertilizer (NPK & Urea)' },
          { id: 'seed', label: 'Certified Seeds' },
          { id: 'protection', label: 'Crop Protection' },
          { id: 'tool', label: 'Tools & Sprayers' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterCategory(tab.id)}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
              filterCategory === tab.id
                ? 'bg-[#012d1d] text-white shadow-xs'
                : 'bg-white border border-[#c1c8c2] text-[#414844] hover:bg-[#f3f3f3]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active Cooperative Bulk Buying Campaigns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCampaigns.map((camp) => {
          const savingsPerUnit = camp.retailMarketPriceNaira - camp.groupDiscountPriceNaira;
          const poolPercent = Math.min(100, Math.round((camp.committedUnits / camp.minimumTargetUnits) * 100));

          return (
            <div
              key={camp.id}
              className="bg-white border border-[#c1c8c2] rounded-2xl p-5 space-y-4 shadow-xs hover:border-[#012d1d] transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#3f6653] bg-[#c1ecd4] px-2 py-0.5 rounded">
                      {camp.category}
                    </span>
                    <h3 className="font-heading font-bold text-base text-[#012d1d] mt-1.5">
                      {camp.title}
                    </h3>
                    <div className="text-xs text-[#717973]">
                      Direct Supplier: <strong className="text-[#1a1c1c]">{camp.supplierName}</strong>
                    </div>
                  </div>

                  <div className="bg-[#ffdeac] text-[#523700] p-2 rounded-xl text-center shrink-0 min-w-[70px]">
                    <div className="text-[9px] uppercase font-bold">Save</div>
                    <div className="font-heading font-bold text-base tabular-nums">
                      {camp.savingsPercentage}%
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#414844] leading-relaxed">
                  {camp.description}
                </p>

                {/* Price Comparison Box */}
                <div className="bg-[#f9f9f9] border border-[#e2e2e2] rounded-xl p-3 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-[#717973] uppercase font-bold">Open Market Price</span>
                    <div className="line-through text-[#717973] font-medium tabular-nums mt-0.5">
                      ₦{camp.retailMarketPriceNaira.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#3f6653] uppercase font-bold">Co-op Member Price</span>
                    <div className="font-heading font-bold text-base text-[#012d1d] tabular-nums mt-0.5">
                      ₦{camp.groupDiscountPriceNaira.toLocaleString()}{' '}
                      <span className="text-[10px] font-normal text-[#717973]">/{camp.unit}</span>
                    </div>
                  </div>
                </div>

                {/* Group Pool Progress Bar */}
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#717973]">Group Target Pool:</span>
                    <strong className="text-[#012d1d] tabular-nums">
                      {camp.committedUnits} / {camp.minimumTargetUnits} {camp.unit}s ({poolPercent}%)
                    </strong>
                  </div>
                  <div className="h-2 w-full bg-[#e8e8e8] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#012d1d] rounded-full transition-all duration-300"
                      style={{ width: `${poolPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-[#717973]">
                    <span>Deadline: {camp.deadlineDate}</span>
                    <span>Depot Arrival: {camp.deliveryEstimatedDate}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-[#e2e2e2] flex justify-between items-center">
                <div className="text-xs text-[#1b4332] font-semibold">
                  Save ₦{savingsPerUnit.toLocaleString()} per unit
                </div>

                <button
                  onClick={() => handleOpenOrderModal(camp)}
                  className="h-9 px-4 rounded-xl bg-[#012d1d] text-white hover:bg-[#1b4332] text-xs font-bold font-heading flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">shopping_cart</span>
                  <span>Join Group Order</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* My Allocated Orders & Depot Pickup Tracker */}
      <div className="bg-white rounded-2xl border border-[#c1c8c2] p-5 space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-[#e2e2e2]">
          <div>
            <h3 className="font-heading font-bold text-base text-[#012d1d]">
              My Input Allocations & Depot Pickups ({myOrders.length})
            </h3>
            <p className="text-xs text-[#717973]">
              Present your allocated collection code at the cooperative depot to collect your packages.
            </p>
          </div>
          <button
            onClick={() => setActiveView('wallet')}
            className="text-xs font-bold text-[#012d1d] hover:underline"
          >
            View Credit & Liens →
          </button>
        </div>

        <div className="divide-y divide-[#e2e2e2]">
          {myOrders.map((item, idx) => (
            <div key={idx} className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-heading font-bold text-sm text-[#012d1d]">{item.campaign.title}</h4>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    item.order.paymentStatus === 'paid_cash'
                      ? 'bg-[#c1ecd4] text-[#002114]'
                      : 'bg-[#ffdeac] text-[#523700]'
                  }`}>
                    {item.order.paymentStatus === 'paid_cash' ? 'Paid in Full' : 'Harvest Crop Lien'}
                  </span>
                </div>
                <div className="text-xs text-[#414844]">
                  Allocated: <strong className="text-[#1a1c1c] tabular-nums">{item.order.unitsRequested} {item.campaign.unit}s</strong> · Depot: Abeokuta Agro Hub Central Warehouse
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <div className="text-right">
                  <span className="text-[10px] text-[#717973] uppercase font-bold">Pickup Code</span>
                  <div className="font-heading font-bold text-sm text-[#012d1d] tracking-wider">
                    PK-948{idx + 1}
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                  item.order.distributed
                    ? 'bg-[#c1ecd4] text-[#002114]'
                    : 'bg-[#f3f3f3] text-[#414844] border border-[#c1c8c2]'
                }`}>
                  {item.order.distributed ? 'Collected' : 'Ready at Depot'}
                </span>
              </div>
            </div>
          ))}

          {myOrders.length === 0 && (
            <div className="py-6 text-center text-xs text-[#717973]">
              You have no active input orders. Join an active group-buying campaign above to save on farm inputs.
            </div>
          )}
        </div>
      </div>

      {/* Order Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-[#c1c8c2] shadow-xl">
            <div className="flex justify-between items-start pb-3 border-b border-[#e2e2e2]">
              <div>
                <span className="text-[10px] font-bold text-[#3f6653] uppercase tracking-wider">
                  Cooperative Group Order
                </span>
                <h3 className="font-heading font-bold text-lg text-[#012d1d] mt-0.5">
                  {selectedCampaign.title}
                </h3>
              </div>
              <button onClick={() => setSelectedCampaign(null)} className="text-[#717973] hover:text-[#012d1d]">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleConfirmOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#414844] mb-1">
                  Requested Units ({selectedCampaign.unit}) *
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    max="50"
                    required
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(parseInt(e.target.value, 10) || 1)}
                    className="w-28 h-10 px-3 text-xs bg-[#f9f9f9] border border-[#c1c8c2] rounded-lg focus:outline-none focus:border-[#012d1d] font-bold text-center"
                  />
                  <div className="text-xs text-[#717973]">
                    Recommended for 2–4 Hectares of planting.
                  </div>
                </div>
              </div>

              {/* Order Cost Calculation */}
              <div className="bg-[#f0f7f3] border border-[#a5d0b9] rounded-xl p-3 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#414844]">Wholesale Member Price:</span>
                  <span className="font-heading font-bold text-[#012d1d] tabular-nums">
                    ₦{selectedCampaign.groupDiscountPriceNaira.toLocaleString()} / {selectedCampaign.unit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#414844]">Total Order Amount:</span>
                  <span className="font-heading font-bold text-base text-[#012d1d] tabular-nums">
                    ₦{(selectedCampaign.groupDiscountPriceNaira * orderQuantity).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-[#1b4332] font-semibold border-t border-[#a5d0b9] pt-1">
                  <span>Your Group Savings vs Retail:</span>
                  <span className="tabular-nums">
                    -₦{((selectedCampaign.retailMarketPriceNaira - selectedCampaign.groupDiscountPriceNaira) * orderQuantity).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#414844]">Payment Method *</label>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentOption('credit')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      paymentOption === 'credit'
                        ? 'border-[#012d1d] bg-[#f0f7f3] text-[#012d1d]'
                        : 'border-[#c1c8c2] bg-white text-[#414844] hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-heading font-bold text-xs">Harvest Crop Lien</div>
                    <div className="text-[10px] text-[#717973] mt-0.5">
                      ₦0 upfront · Repay with grains at harvest
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentOption('cash')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      paymentOption === 'cash'
                        ? 'border-[#012d1d] bg-[#f0f7f3] text-[#012d1d]'
                        : 'border-[#c1c8c2] bg-white text-[#414844] hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-heading font-bold text-xs">Instant Wallet</div>
                    <div className="text-[10px] text-[#717973] mt-0.5">
                      Deduct from balance (₦{walletBalance.toLocaleString()})
                    </div>
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#e2e2e2]">
                <button
                  type="button"
                  onClick={() => setSelectedCampaign(null)}
                  className="px-4 py-2 text-xs font-bold text-[#414844] hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#012d1d] hover:bg-[#1b4332] rounded-lg transition-colors"
                >
                  Confirm Group Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
