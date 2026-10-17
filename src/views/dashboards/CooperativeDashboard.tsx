import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export const CooperativeDashboard: React.FC = () => {
  const { user } = useAuth();
  const {
    coopMembers,
    warehouseIntakes,
    bulkInputCampaigns,
    offtakerContracts,
    memberLoans,
    setActiveView,
  } = useApp();

  const totalHectares = coopMembers.reduce((acc, m) => acc + m.farmSizeHectares, 0).toFixed(1);
  const totalAggregatedMT = warehouseIntakes.reduce((acc, i) => acc + i.netWeightMT, 0).toFixed(1);
  const totalContractValue = offtakerContracts.reduce((acc, c) => acc + c.totalContractValueNaira, 0);
  const totalTargetVolume = offtakerContracts.reduce((acc, c) => acc + c.targetVolumeMT, 0);
  const totalFulfilledVolume = offtakerContracts.reduce((acc, c) => acc + c.fulfilledVolumeMT, 0);
  const fulfillmentPercent = totalTargetVolume > 0 ? (totalFulfilledVolume / totalTargetVolume) * 100 : 0;

  const totalSavingsAchievedNaira = bulkInputCampaigns.reduce((acc, c) => {
    const diff = c.retailMarketPriceNaira - c.groupDiscountPriceNaira;
    return acc + diff * c.committedUnits;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-2xl border border-[#c1c8c2] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#3f6653] bg-[#c1ecd4] px-2.5 py-0.5 rounded-full">
              Agricultural Cooperative Operational Hub
            </span>
            <span className="text-xs text-[#717973] font-medium">• Ogun State Agro-Cluster</span>
          </div>
          <h1 className="font-heading font-bold text-2xl text-[#012d1d] mt-1">
            {user.companyName || user.name}
          </h1>
          <p className="text-xs text-[#414844]">
            {user.state} • {coopMembers.length} Enrolled Smallholders • {totalHectares} Ha Mapped Acreage
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveView('coop_aggregation')}
            className="h-10 px-4 bg-[#012d1d] text-white font-heading font-bold text-xs rounded-full flex items-center gap-2 hover:bg-[#1b4332] active:scale-95 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">scale</span>
            <span>Log Silo Intake</span>
          </button>

          <button
            onClick={() => setActiveView('coop_inputs')}
            className="h-10 px-4 bg-[#f3f3f3] border border-[#c1c8c2] text-[#012d1d] font-heading font-bold text-xs rounded-full flex items-center gap-2 hover:bg-[#e8e8e8] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
            <span>Bulk Input Pools</span>
          </button>

          <button
            onClick={() => setActiveView('coop_contracts')}
            className="h-10 px-4 bg-[#f3f3f3] border border-[#c1c8c2] text-[#012d1d] font-heading font-bold text-xs rounded-full flex items-center gap-2 hover:bg-[#e8e8e8] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">handshake</span>
            <span>Contracts</span>
          </button>
        </div>
      </div>

      {/* Bento Grid 4 Operational Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pillar 1: Smallholder Roster */}
        <div
          onClick={() => setActiveView('coop_roster')}
          className="bg-white border border-[#c1c8c2] p-4 rounded-xl space-y-2 shadow-sm hover:border-[#012d1d] transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-center text-[#717973]">
            <span className="text-xs font-bold uppercase">Member Smallholders</span>
            <span className="material-symbols-outlined text-[#012d1d] group-hover:scale-110 transition-transform">groups</span>
          </div>
          <div className="font-heading font-bold text-2xl text-[#012d1d]">
            {coopMembers.length} Farmers
          </div>
          <div className="flex justify-between items-center text-[11px] text-[#414844] pt-1 border-t border-[#e2e2e2]">
            <span>{totalHectares} Ha mapped</span>
            <span className="text-[#3f6653] font-bold">100% KYC &rarr;</span>
          </div>
        </div>

        {/* Pillar 2: Silo Aggregation */}
        <div
          onClick={() => setActiveView('coop_aggregation')}
          className="bg-white border border-[#c1c8c2] p-4 rounded-xl space-y-2 shadow-sm hover:border-[#012d1d] transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-center text-[#717973]">
            <span className="text-xs font-bold uppercase">Warehouse Aggregation</span>
            <span className="material-symbols-outlined text-[#012d1d] group-hover:scale-110 transition-transform">warehouse</span>
          </div>
          <div className="font-heading font-bold text-2xl text-[#012d1d]">
            {totalAggregatedMT} MT
          </div>
          <div className="flex justify-between items-center text-[11px] text-[#414844] pt-1 border-t border-[#e2e2e2]">
            <span>{warehouseIntakes.length} intake batches</span>
            <span className="text-[#3f6653] font-bold">Grade A &rarr;</span>
          </div>
        </div>

        {/* Pillar 3: Bulk Input Savings */}
        <div
          onClick={() => setActiveView('coop_inputs')}
          className="bg-white border border-[#c1c8c2] p-4 rounded-xl space-y-2 shadow-sm hover:border-[#012d1d] transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-center text-[#717973]">
            <span className="text-xs font-bold uppercase">Collective Group Savings</span>
            <span className="material-symbols-outlined text-[#012d1d] group-hover:scale-110 transition-transform">savings</span>
          </div>
          <div className="font-heading font-bold text-2xl text-[#3f6653]">
            ₦{(totalSavingsAchievedNaira / 1000000).toFixed(2)}M
          </div>
          <div className="flex justify-between items-center text-[11px] text-[#414844] pt-1 border-t border-[#e2e2e2]">
            <span>{bulkInputCampaigns.length} active pools</span>
            <span className="text-[#3f6653] font-bold">22% Avg &rarr;</span>
          </div>
        </div>

        {/* Pillar 4: Offtaker Pipeline */}
        <div
          onClick={() => setActiveView('coop_contracts')}
          className="bg-[#012d1d] text-white p-4 rounded-xl space-y-2 shadow-sm border border-[#1b4332] cursor-pointer group"
        >
          <div className="flex justify-between items-center text-[#86af99]">
            <span className="text-xs font-bold uppercase">Off-taker Escrow Value</span>
            <span className="material-symbols-outlined text-[#c1ecd4] group-hover:scale-110 transition-transform">verified_user</span>
          </div>
          <div className="font-heading font-bold text-2xl text-[#c1ecd4]">
            ₦{(totalContractValue / 1000000).toFixed(1)}M
          </div>
          <div className="flex justify-between items-center text-[11px] text-[#86af99] pt-1 border-t border-white/20">
            <span>{fulfillmentPercent.toFixed(0)}% fulfilled</span>
            <span className="text-white font-bold">View pipeline &rarr;</span>
          </div>
        </div>
      </div>

      {/* Main Operational Feeds & Action Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Warehouse & Offtaker Fulfillment */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Warehouse Deliveries */}
          <div className="bg-white rounded-2xl border border-[#c1c8c2] p-5 shadow-sm space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-[#e2e2e2]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#012d1d]">scale</span>
                <h3 className="font-heading font-bold text-sm text-[#012d1d]">
                  Recent Silo & Weighbridge Deliveries
                </h3>
              </div>
              <button
                onClick={() => setActiveView('coop_aggregation')}
                className="text-xs font-bold text-[#3f6653] hover:text-[#012d1d]"
              >
                View Full Log &rarr;
              </button>
            </div>

            <div className="space-y-2">
              {warehouseIntakes.slice(0, 4).map((intake) => (
                <div
                  key={intake.id}
                  onClick={() => setActiveView('coop_aggregation')}
                  className="p-3 rounded-xl bg-[#f9f9f9] border border-[#e2e2e2] hover:bg-[#f3f8f5] transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 cursor-pointer"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-xs text-[#012d1d]">
                        {intake.farmerName}
                      </span>
                      <span className="font-mono text-[10px] text-[#717973]">{intake.receiptNumber}</span>
                    </div>
                    <div className="text-[11px] text-[#414844]">
                      {intake.crop} • {intake.bagCount} bags • Moisture: <strong className="text-[#012d1d]">{intake.moistureContent}%</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-heading font-bold text-xs text-[#012d1d]">
                        {intake.netWeightMT} MT
                      </div>
                      <div className="text-[10px] text-[#3f6653] font-bold">
                        ₦{intake.netPayableToFarmerNaira.toLocaleString()} net
                      </div>
                    </div>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                        intake.qualityGrade.includes('Grade A')
                          ? 'bg-[#c1ecd4] text-[#002114]'
                          : 'bg-[#d8e2ff] text-[#001b3e]'
                      }`}
                    >
                      {intake.qualityGrade.split(' ')[0]} {intake.qualityGrade.split(' ')[1]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Off-taker Contract Progress */}
          <div className="bg-white rounded-2xl border border-[#c1c8c2] p-5 shadow-sm space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-[#e2e2e2]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#012d1d]">handshake</span>
                <h3 className="font-heading font-bold text-sm text-[#012d1d]">
                  Active Off-taker Delivery Progress
                </h3>
              </div>
              <button
                onClick={() => setActiveView('coop_contracts')}
                className="text-xs font-bold text-[#3f6653] hover:text-[#012d1d]"
              >
                Manage Contracts &rarr;
              </button>
            </div>

            <div className="space-y-3">
              {offtakerContracts.slice(0, 3).map((ctr) => {
                const percent = Math.min(100, (ctr.fulfilledVolumeMT / ctr.targetVolumeMT) * 100);
                return (
                  <div key={ctr.id} className="p-3 bg-[#f9f9f9] rounded-xl border border-[#e2e2e2] space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-[#012d1d]">{ctr.buyerCompany}</span>
                        <span className="text-[#717973] ml-2">({ctr.crop})</span>
                      </div>
                      <span className="font-heading font-bold text-[#012d1d]">
                        {ctr.fulfilledVolumeMT} / {ctr.targetVolumeMT} MT ({percent.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="w-full bg-[#e8e8e8] h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#012d1d] h-2 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-[#717973]">
                      <span>Destination: {ctr.destinationWarehouse}</span>
                      <span className="text-[#3f6653] font-bold">₦{(ctr.totalContractValueNaira / 1000000).toFixed(1)}M Total</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Quick Operational Actions & Input Pools */}
        <div className="space-y-6">
          {/* Operational Hub Navigation Quick Actions */}
          <div className="bg-white rounded-2xl border border-[#c1c8c2] p-5 shadow-sm space-y-3">
            <h3 className="font-heading font-bold text-sm text-[#012d1d]">
              Cooperative Workflows
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => setActiveView('coop_roster')}
                className="w-full text-left p-3 rounded-xl bg-[#f3f3f3] hover:bg-[#e8e8e8] transition-colors border border-[#c1c8c2] flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-lg bg-[#012d1d] text-white flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">groups</span>
                </div>
                <div>
                  <div className="font-bold text-xs text-[#1a1c1c]">Farmer Roster & Clusters</div>
                  <div className="text-[10px] text-[#717973]">{coopMembers.length} farmers mapped</div>
                </div>
              </button>

              <button
                onClick={() => setActiveView('coop_aggregation')}
                className="w-full text-left p-3 rounded-xl bg-[#f3f3f3] hover:bg-[#e8e8e8] transition-colors border border-[#c1c8c2] flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-lg bg-[#012d1d] text-white flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">warehouse</span>
                </div>
                <div>
                  <div className="font-bold text-xs text-[#1a1c1c]">Weighbridge & Silos</div>
                  <div className="text-[10px] text-[#717973]">Quality grading & digital receipts</div>
                </div>
              </button>

              <button
                onClick={() => setActiveView('coop_inputs')}
                className="w-full text-left p-3 rounded-xl bg-[#f3f3f3] hover:bg-[#e8e8e8] transition-colors border border-[#c1c8c2] flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-lg bg-[#012d1d] text-white flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                </div>
                <div>
                  <div className="font-bold text-xs text-[#1a1c1c]">Bulk Input Buying</div>
                  <div className="text-[10px] text-[#717973]">Wholesale fertilizer & seeds</div>
                </div>
              </button>

              <button
                onClick={() => setActiveView('coop_contracts')}
                className="w-full text-left p-3 rounded-xl bg-[#f3f3f3] hover:bg-[#e8e8e8] transition-colors border border-[#c1c8c2] flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-lg bg-[#012d1d] text-white flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">handshake</span>
                </div>
                <div>
                  <div className="font-bold text-xs text-[#1a1c1c]">Off-taker Contracts</div>
                  <div className="text-[10px] text-[#717973]">Flour Mills, Olam, Nestlé</div>
                </div>
              </button>

              <button
                onClick={() => setActiveView('coop_credit')}
                className="w-full text-left p-3 rounded-xl bg-[#f3f3f3] hover:bg-[#e8e8e8] transition-colors border border-[#c1c8c2] flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-lg bg-[#012d1d] text-white flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">payments</span>
                </div>
                <div>
                  <div className="font-bold text-xs text-[#1a1c1c]">Seasonal Credit Ledger</div>
                  <div className="text-[10px] text-[#717973]">Harvest loan deduction tracking</div>
                </div>
              </button>
            </div>
          </div>

          {/* Active Bulk Pools Snapshot */}
          <div className="bg-[#f3f8f5] rounded-2xl border border-[#c1ecd4] p-5 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-heading font-bold text-xs text-[#012d1d] uppercase tracking-wider">
                Ongoing Input Pools
              </span>
              <button
                onClick={() => setActiveView('coop_inputs')}
                className="text-[11px] font-bold text-[#3f6653] hover:text-[#012d1d]"
              >
                Join Pool &rarr;
              </button>
            </div>

            <div className="space-y-2">
              {bulkInputCampaigns.slice(0, 2).map((pool) => (
                <div key={pool.id} className="p-3 bg-white rounded-xl border border-[#c1ecd4] space-y-1">
                  <div className="font-bold text-xs text-[#012d1d]">{pool.title}</div>
                  <div className="flex justify-between text-[11px] text-[#414844]">
                    <span>₦{pool.groupDiscountPriceNaira.toLocaleString()}/{pool.unit}</span>
                    <span className="text-[#3f6653] font-bold">Save {pool.savingsPercentage}%</span>
                  </div>
                  <div className="text-[10px] text-[#717973]">
                    {pool.committedUnits} / {pool.minimumTargetUnits} committed
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
