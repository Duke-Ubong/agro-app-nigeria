import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BulkInputCampaign } from '../../types';

export const BulkInputsView: React.FC = () => {
  const {
    bulkInputCampaigns,
    coopMembers,
    createBulkInputCampaign,
    joinBulkInputCampaign,
    markBulkInputDistributed,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [allocationCampaign, setAllocationCampaign] = useState<BulkInputCampaign | null>(null);

  // Form states for creating campaign
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<BulkInputCampaign['category']>('Fertilizer');
  const [supplierName, setSupplierName] = useState('Indorama Eleme Fertilizer');
  const [unit, setUnit] = useState('50kg Bag');
  const [retailPrice, setRetailPrice] = useState('42000');
  const [discountPrice, setDiscountPrice] = useState('32500');
  const [minTargetUnits, setMinTargetUnits] = useState('300');
  const [deadlineDate, setDeadlineDate] = useState('2025-05-01');
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState('2025-05-15');
  const [description, setDescription] = useState('');
  const [specifications, setSpecifications] = useState('');

  // Allocation modal states
  const [allocMemberId, setAllocMemberId] = useState(coopMembers[0]?.id || '');
  const [allocUnits, setAllocUnits] = useState(10);
  const [allocPaymentMethod, setAllocPaymentMethod] = useState<'paid_cash' | 'financed_on_credit'>('financed_on_credit');

  // Filtered campaigns
  const filteredCampaigns = bulkInputCampaigns.filter(
    (c) => selectedCategory === 'All' || c.category === selectedCategory
  );

  // Calculate total savings achieved by the cooperative
  const totalSavingsAchievedNaira = bulkInputCampaigns.reduce((acc, c) => {
    const diff = c.retailMarketPriceNaira - c.groupDiscountPriceNaira;
    return acc + diff * c.committedUnits;
  }, 0);

  const totalUnitsCommitted = bulkInputCampaigns.reduce((acc, c) => acc + c.committedUnits, 0);

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const retail = parseFloat(retailPrice) || 40000;
    const groupPrice = parseFloat(discountPrice) || 30000;
    const savings = Number((((retail - groupPrice) / retail) * 100).toFixed(1));

    createBulkInputCampaign({
      title,
      category,
      supplierName,
      unit,
      retailMarketPriceNaira: retail,
      groupDiscountPriceNaira: groupPrice,
      savingsPercentage: savings,
      minimumTargetUnits: parseInt(minTargetUnits) || 200,
      committedUnits: 0,
      deadlineDate,
      deliveryEstimatedDate: estimatedDeliveryDate,
      status: 'pooling',
      description: description || 'High-grade agro inputs sourced directly from manufacturer.',
      specifications: specifications || 'Standard certification compliant.',
      participatingMembers: [],
    });

    setShowCreateModal(false);
    setTitle('');
  };

  const handleAllocate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allocationCampaign || !allocMemberId) return;

    joinBulkInputCampaign(
      allocationCampaign.id,
      allocMemberId,
      allocUnits,
      allocPaymentMethod
    );

    setAllocationCampaign(null);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#3f6653] bg-[#c1ecd4] px-2.5 py-0.5 rounded-full">
              Group Purchasing Power
            </span>
            <span className="text-xs text-[#717973] font-medium">• Direct Manufacturer Pricing</span>
          </div>
          <h1 className="font-heading font-bold text-2xl text-[#012d1d] mt-1">
            Bulk Input Group Buying & Distribution
          </h1>
          <p className="text-xs text-[#414844]">
            Pool smallholder demand for fertilizer, seeds, and agrochemicals to negotiate wholesale factory discounts and track member handovers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="h-10 px-4 bg-[#012d1d] text-white font-heading font-bold text-xs rounded-full flex items-center gap-2 hover:bg-[#1b4332] active:scale-95 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
            <span>Launch Bulk Order Pool</span>
          </button>
        </div>
      </div>

      {/* Group Bargaining Highlight Banner */}
      <div className="bg-gradient-to-r from-[#012d1d] via-[#1b4332] to-[#274e3d] text-white p-5 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-[#c1ecd4] uppercase tracking-wider flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">savings</span>
            Collective Bargaining Impact
          </span>
          <div className="font-heading font-bold text-3xl text-white">
            ₦{(totalSavingsAchievedNaira / 1000000).toFixed(2)}M Saved for Member Farmers
          </div>
          <p className="text-xs text-[#86af99] max-w-xl">
            By aggregating demand across {coopMembers.length} smallholder farmers, our cooperative negotiates an average of 22% to 26% discount below open-market agrochemical retailers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-3 rounded-xl text-center min-w-[110px]">
            <div className="text-[10px] text-[#86af99] uppercase font-bold">Total Committed</div>
            <div className="font-heading font-bold text-xl text-[#c1ecd4]">{totalUnitsCommitted} Units</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-3 rounded-xl text-center min-w-[110px]">
            <div className="text-[10px] text-[#86af99] uppercase font-bold">Active Pools</div>
            <div className="font-heading font-bold text-xl text-white">{bulkInputCampaigns.length} Pools</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {['All', 'Fertilizer', 'Certified Seeds', 'Crop Protection', 'Farming Tools'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-heading font-bold transition-all shrink-0 ${
              selectedCategory === cat
                ? 'bg-[#012d1d] text-white shadow-sm'
                : 'bg-white border border-[#c1c8c2] text-[#414844] hover:bg-[#f3f3f3]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Campaign Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCampaigns.map((campaign) => {
          const quotaPercent = Math.min(100, (campaign.committedUnits / campaign.minimumTargetUnits) * 100);
          const perUnitSavings = campaign.retailMarketPriceNaira - campaign.groupDiscountPriceNaira;

          return (
            <div
              key={campaign.id}
              className="bg-white rounded-2xl border border-[#c1c8c2] p-5 shadow-sm space-y-4 hover:border-[#012d1d] transition-all"
            >
              {/* Card Header */}
              <div className="flex justify-between items-start gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#3f6653] bg-[#c1ecd4] px-2 py-0.5 rounded">
                      {campaign.category}
                    </span>
                    <span className="text-[10px] text-[#717973] font-medium">• {campaign.unit}</span>
                  </div>
                  <h3 className="font-heading font-bold text-base text-[#012d1d] mt-1">
                    {campaign.title}
                  </h3>
                  <p className="text-[11px] text-[#717973]">
                    Supplier: <strong className="text-[#1a1c1c]">{campaign.supplierName}</strong>
                  </p>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                    campaign.status === 'pooling'
                      ? 'bg-[#ffdeac] text-[#281900]'
                      : campaign.status === 'ordered'
                      ? 'bg-[#d8e2ff] text-[#001b3e]'
                      : campaign.status === 'arrived_at_depot'
                      ? 'bg-[#c1ecd4] text-[#002114]'
                      : 'bg-[#f3f3f3] text-[#414844]'
                  }`}
                >
                  {campaign.status.replace('_', ' ')}
                </span>
              </div>

              {/* Price & Savings Comparison Box */}
              <div className="p-3 bg-[#f9f9f9] rounded-xl border border-[#e2e2e2] flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-[#717973] line-through">
                    Retail Market: ₦{campaign.retailMarketPriceNaira.toLocaleString()}
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-heading font-bold text-xl text-[#012d1d]">
                      ₦{campaign.groupDiscountPriceNaira.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-[#717973]">/{campaign.unit}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block bg-[#c1ecd4] text-[#002114] font-heading font-bold text-xs px-2.5 py-1 rounded-full">
                    Save {campaign.savingsPercentage}% (₦{perUnitSavings.toLocaleString()}/unit)
                  </span>
                  <div className="text-[10px] text-[#717973] mt-1">
                    Deadline: {new Date(campaign.deadlineDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                  </div>
                </div>
              </div>

              {/* Progress Bar towards bulk supplier minimum */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="font-medium text-[#414844]">
                    Pooled Demand: <strong className="text-[#012d1d]">{campaign.committedUnits}</strong> / {campaign.minimumTargetUnits} {campaign.unit}s
                  </span>
                  <span className="font-bold text-[#012d1d]">{quotaPercent.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-[#e8e8e8] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#012d1d] h-2 rounded-full transition-all"
                    style={{ width: `${quotaPercent}%` }}
                  />
                </div>
              </div>

              {/* Specifications snippet */}
              <p className="text-[11px] text-[#414844] leading-relaxed line-clamp-2">
                {campaign.specifications}
              </p>

              {/* Participating Member Allocations */}
              <div className="border-t border-[#e2e2e2] pt-3 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#012d1d]">
                    Member Orders ({campaign.participatingMembers.length} Farmers)
                  </span>
                  <button
                    onClick={() => setAllocationCampaign(campaign)}
                    className="text-[11px] font-bold text-[#3f6653] hover:text-[#012d1d] flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">add</span>
                    <span>Allocate for Member</span>
                  </button>
                </div>

                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {campaign.participatingMembers.map((pm) => (
                    <div
                      key={pm.memberId}
                      className="p-2 rounded-lg bg-[#f9f9f9] border border-[#e2e2e2] flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-[#1a1c1c]">{pm.memberName}</div>
                        <div className="text-[10px] text-[#717973]">
                          {pm.unitsRequested} {campaign.unit}s •{' '}
                          <span className={pm.paymentStatus === 'financed_on_credit' ? 'text-[#ba1a1a] font-medium' : 'text-[#3f6653] font-medium'}>
                            {pm.paymentStatus === 'financed_on_credit' ? 'Input Loan Financed' : 'Paid Cash'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {pm.distributed ? (
                          <span className="text-[10px] bg-[#c1ecd4] text-[#002114] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">check_circle</span>
                            <span>Collected</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => markBulkInputDistributed(campaign.id, pm.memberId)}
                            className="px-2 py-1 bg-[#012d1d] text-white hover:bg-[#1b4332] text-[10px] font-bold rounded"
                          >
                            Mark Collected
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {campaign.participatingMembers.length === 0 && (
                    <div className="p-3 text-center text-[#717973] text-[11px]">
                      No member allocations yet. Click "+ Allocate for Member" to reserve units.
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Allocate for Member Modal */}
      {allocationCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#c1c8c2] space-y-4">
            <div className="flex justify-between items-center border-b border-[#e2e2e2] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#3f6653] bg-[#c1ecd4] px-2 py-0.5 rounded">
                  Input Allocation
                </span>
                <h3 className="font-heading font-bold text-base text-[#012d1d] mt-1">
                  Allocate: {allocationCampaign.title}
                </h3>
              </div>
              <button
                onClick={() => setAllocationCampaign(null)}
                className="w-8 h-8 rounded-full bg-[#f3f3f3] hover:bg-[#e2e2e2] flex items-center justify-center text-[#414844]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAllocate} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-[#414844] mb-1">
                  Select Member Farmer *
                </label>
                <select
                  value={allocMemberId}
                  onChange={(e) => setAllocMemberId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f3f3f3] border border-[#c1c8c2] rounded-lg focus:outline-none"
                >
                  {coopMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.cluster}) — Credit Avail: ₦{(m.creditLimitNaira - m.loanBalanceNaira).toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#414844] mb-1">
                  Units / Bags Requested ({allocationCampaign.unit})
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={allocUnits}
                  onChange={(e) => setAllocUnits(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 bg-[#f3f3f3] border border-[#c1c8c2] rounded-lg font-bold text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#414844] mb-1">
                  Payment Arrangement
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAllocPaymentMethod('financed_on_credit')}
                    className={`p-2.5 rounded-lg border text-left text-xs ${
                      allocPaymentMethod === 'financed_on_credit'
                        ? 'bg-[#012d1d] text-white border-[#012d1d]'
                        : 'bg-[#f9f9f9] text-[#1a1c1c] border-[#c1c8c2]'
                    }`}
                  >
                    <div className="font-bold">Seasonal Credit</div>
                    <div className="text-[10px] opacity-80">Deducted from harvest</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAllocPaymentMethod('paid_cash')}
                    className={`p-2.5 rounded-lg border text-left text-xs ${
                      allocPaymentMethod === 'paid_cash'
                        ? 'bg-[#012d1d] text-white border-[#012d1d]'
                        : 'bg-[#f9f9f9] text-[#1a1c1c] border-[#c1c8c2]'
                    }`}
                  >
                    <div className="font-bold">Immediate Cash</div>
                    <div className="text-[10px] opacity-80">Paid up front</div>
                  </button>
                </div>
              </div>

              <div className="p-3 bg-[#f3f8f5] rounded-xl border border-[#c1ecd4] space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#717973]">Rate per Unit:</span>
                  <span className="font-bold">₦{allocationCampaign.groupDiscountPriceNaira.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-[#012d1d] pt-1 border-t border-[#c1ecd4]">
                  <span>Total Order Cost:</span>
                  <span>₦{(allocationCampaign.groupDiscountPriceNaira * allocUnits).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#e2e2e2]">
                <button
                  type="button"
                  onClick={() => setAllocationCampaign(null)}
                  className="px-4 py-2 bg-[#f3f3f3] text-[#414844] font-bold rounded-lg hover:bg-[#e8e8e8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#012d1d] text-white font-bold rounded-lg hover:bg-[#1b4332]"
                >
                  Confirm Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#c1c8c2] space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#e2e2e2] pb-3">
              <h3 className="font-heading font-bold text-lg text-[#012d1d]">
                Launch Bulk Input Group Buying Pool
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-full bg-[#f3f3f3] hover:bg-[#e2e2e2] flex items-center justify-center text-[#414844]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-[#414844] mb-1">
                  Campaign Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wet Season Urea 46% Direct Plant Order"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f3f3f3] border border-[#c1c8c2] rounded-lg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#414844] mb-1">
                    Input Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#f3f3f3] border border-[#c1c8c2] rounded-lg focus:outline-none"
                  >
                    <option value="Fertilizer">Fertilizer</option>
                    <option value="Certified Seeds">Certified Seeds</option>
                    <option value="Crop Protection">Crop Protection</option>
                    <option value="Farming Tools">Farming Tools & PPE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#414844] mb-1">
                    Manufacturer / Supplier Name
                  </label>
                  <input
                    type="text"
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f3f3f3] border border-[#c1c8c2] rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-[#717973] mb-1">
                    Unit Type
                  </label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#f3f3f3] border border-[#c1c8c2] rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#717973] mb-1">
                    Retail Price (₦)
                  </label>
                  <input
                    type="number"
                    value={retailPrice}
                    onChange={(e) => setRetailPrice(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#f3f3f3] border border-[#c1c8c2] rounded-lg font-bold text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#717973] mb-1">
                    Negotiated Price (₦)
                  </label>
                  <input
                    type="number"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#f3f3f3] border border-[#c1c8c2] rounded-lg font-bold text-xs text-[#012d1d]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#414844] mb-1">
                    Min Supplier Target (Units)
                  </label>
                  <input
                    type="number"
                    value={minTargetUnits}
                    onChange={(e) => setMinTargetUnits(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f3f3f3] border border-[#c1c8c2] rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#414844] mb-1">
                    Pooling Deadline
                  </label>
                  <input
                    type="date"
                    value={deadlineDate}
                    onChange={(e) => setDeadlineDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f3f3f3] border border-[#c1c8c2] rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#414844] mb-1">
                  Product Description & Specifications
                </label>
                <textarea
                  rows={2}
                  value={specifications}
                  onChange={(e) => setSpecifications(e.target.value)}
                  placeholder="Technical composition, active ingredient %, recommended dosage..."
                  className="w-full px-3 py-2 bg-[#f3f3f3] border border-[#c1c8c2] rounded-lg focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#e2e2e2]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-[#f3f3f3] text-[#414844] font-bold rounded-lg hover:bg-[#e8e8e8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#012d1d] text-white font-bold rounded-lg hover:bg-[#1b4332]"
                >
                  Launch Pool
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
