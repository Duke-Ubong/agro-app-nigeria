import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OfftakerContract } from '../../types';

export const OfftakerContractsView: React.FC = () => {
  const { offtakerContracts, updateContractProgress, addAuditLog } = useApp();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [dispatchContract, setDispatchContract] = useState<OfftakerContract | null>(null);

  // Dispatch modal form state
  const [dispatchMT, setDispatchMT] = useState(30);
  const [truckPlate, setTruckPlate] = useState('KTU-920-XA');
  const [transporterName, setTransporterName] = useState('Arewa Haulage Fleet Line');
  const [waybillCode, setWaybillCode] = useState('WB-2025-0914');

  const filtered = offtakerContracts.filter(
    (c) => selectedFilter === 'All' || c.status === selectedFilter
  );

  // Financial and volume rollups
  const totalContractValue = offtakerContracts.reduce((acc, c) => acc + c.totalContractValueNaira, 0);
  const totalTargetVolume = offtakerContracts.reduce((acc, c) => acc + c.targetVolumeMT, 0);
  const totalFulfilledVolume = offtakerContracts.reduce((acc, c) => acc + c.fulfilledVolumeMT, 0);
  const aggregateFulfillmentPercent = totalTargetVolume > 0 ? (totalFulfilledVolume / totalTargetVolume) * 100 : 0;

  const handleConfirmDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchContract) return;

    updateContractProgress(dispatchContract.id, dispatchMT);
    addAuditLog(
      'Logistics Dispatcher',
      'cooperative',
      'DISPATCH_OFFTAKER',
      `Dispatched ${dispatchMT} MT via truck ${truckPlate} for contract ${dispatchContract.contractNumber} (${dispatchContract.buyerCompany})`
    );

    setDispatchContract(null);
    setDispatchMT(30);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#3f6653] bg-[#c1ecd4] px-2.5 py-0.5 rounded-full">
              Institutional Trade & Off-take
            </span>
            <span className="text-xs text-[#717973] font-medium">• Escrow Backed Contracts</span>
          </div>
          <h1 className="font-heading font-bold text-2xl text-[#012d1d] mt-1">
            Off-taker Supply Contracts & Fulfillment
          </h1>
          <p className="text-xs text-[#414844]">
            Track multi-million naira forward commodity delivery contracts with corporate agro-processors, flour millers, and beverage conglomerates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] text-[#717973] uppercase font-bold">Total Committed Portfolio</div>
            <div className="font-heading font-bold text-lg text-[#012d1d]">
              ₦{(totalContractValue / 1000000).toFixed(1)} Million
            </div>
          </div>
        </div>
      </div>

      {/* Aggregate Pipeline KPI Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#c1c8c2] p-4 rounded-xl space-y-1 shadow-sm">
          <div className="flex justify-between items-center text-[#717973]">
            <span className="text-xs font-bold uppercase">Contract Pipeline</span>
            <span className="material-symbols-outlined text-[#012d1d] text-[20px]">handshake</span>
          </div>
          <div className="font-heading font-bold text-2xl text-[#012d1d]">
            {offtakerContracts.length} Contracts
          </div>
          <p className="text-[10px] text-[#717973]">FMN, Olam, Nestlé, Animal Care</p>
        </div>

        <div className="bg-white border border-[#c1c8c2] p-4 rounded-xl space-y-1 shadow-sm">
          <div className="flex justify-between items-center text-[#717973]">
            <span className="text-xs font-bold uppercase">Target Volume</span>
            <span className="material-symbols-outlined text-[#012d1d] text-[20px]">assignment</span>
          </div>
          <div className="font-heading font-bold text-2xl text-[#012d1d]">
            {totalTargetVolume.toLocaleString()} MT
          </div>
          <p className="text-[10px] text-[#717973]">Aggregated smallholder supply commitments</p>
        </div>

        <div className="bg-white border border-[#c1c8c2] p-4 rounded-xl space-y-1 shadow-sm">
          <div className="flex justify-between items-center text-[#717973]">
            <span className="text-xs font-bold uppercase">Fulfilled Deliveries</span>
            <span className="material-symbols-outlined text-[#3f6653] text-[20px]">local_shipping</span>
          </div>
          <div className="font-heading font-bold text-2xl text-[#3f6653]">
            {totalFulfilledVolume.toLocaleString()} MT
          </div>
          <p className="text-[10px] text-[#717973]">{aggregateFulfillmentPercent.toFixed(1)}% portfolio delivery rate</p>
        </div>

        <div className="bg-white border border-[#c1c8c2] p-4 rounded-xl space-y-1 shadow-sm">
          <div className="flex justify-between items-center text-[#717973]">
            <span className="text-xs font-bold uppercase">Secured Escrow</span>
            <span className="material-symbols-outlined text-[#012d1d] text-[20px]">shield</span>
          </div>
          <div className="font-heading font-bold text-2xl text-[#012d1d]">
            100% Secured
          </div>
          <p className="text-[10px] text-[#717973]">Guaranteed payments upon weighbridge delivery</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {['All', 'in_fulfillment', 'fulfilled'].map((status) => (
          <button
            key={status}
            onClick={() => setSelectedFilter(status)}
            className={`px-4 py-1.5 rounded-full text-xs font-heading font-bold transition-all ${
              selectedFilter === status
                ? 'bg-[#012d1d] text-white shadow-sm'
                : 'bg-white border border-[#c1c8c2] text-[#414844] hover:bg-[#f3f3f3]'
            }`}
          >
            {status === 'All'
              ? 'All Contracts'
              : status === 'in_fulfillment'
              ? 'Active In Fulfillment'
              : 'Completed & Disbursed'}
          </button>
        ))}
      </div>

      {/* Contracts List */}
      <div className="space-y-4">
        {filtered.map((contract) => {
          const percent = Math.min(100, (contract.fulfilledVolumeMT / contract.targetVolumeMT) * 100);
          const remainingMT = Math.max(0, contract.targetVolumeMT - contract.fulfilledVolumeMT);

          return (
            <div
              key={contract.id}
              className="bg-white rounded-2xl border border-[#c1c8c2] p-5 shadow-sm space-y-4 hover:border-[#012d1d] transition-all"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#e2e2e2] pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#e8f3ee] text-[#012d1d] flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-[24px]">corporate_fare</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-bold text-base text-[#012d1d]">
                        {contract.buyerCompany}
                      </h3>
                      <span className="font-mono text-[10px] text-[#717973] bg-[#f3f3f3] px-2 py-0.5 rounded">
                        {contract.contractNumber}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#717973]">
                      Contact: {contract.buyerContact}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="bg-[#c1ecd4] text-[#002114] font-bold text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">verified_user</span>
                    <span>{contract.escrowStatus}</span>
                  </span>
                  <span
                    className={`font-bold text-[10px] px-2.5 py-1 rounded-full uppercase ${
                      contract.status === 'fulfilled'
                        ? 'bg-[#c1ecd4] text-[#002114]'
                        : 'bg-[#d8e2ff] text-[#001b3e]'
                    }`}
                  >
                    {contract.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Specs & Financial Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-[#f9f9f9] rounded-xl border border-[#e2e2e2]">
                  <div className="text-[10px] text-[#717973] uppercase font-bold">Commodity & Grade</div>
                  <div className="font-bold text-[#012d1d] mt-0.5">{contract.crop}</div>
                  <div className="text-[10px] text-[#717973] truncate">{contract.requiredGrade}</div>
                </div>

                <div className="p-3 bg-[#f9f9f9] rounded-xl border border-[#e2e2e2]">
                  <div className="text-[10px] text-[#717973] uppercase font-bold">Contracted Value</div>
                  <div className="font-bold text-[#012d1d] mt-0.5">
                    ₦{(contract.totalContractValueNaira / 1000000).toFixed(1)} Million
                  </div>
                  <div className="text-[10px] text-[#717973]">₦{contract.agreedPricePerMT.toLocaleString()} / MT</div>
                </div>

                <div className="p-3 bg-[#f9f9f9] rounded-xl border border-[#e2e2e2]">
                  <div className="text-[10px] text-[#717973] uppercase font-bold">Destination Depot</div>
                  <div className="font-bold text-[#012d1d] mt-0.5 truncate">{contract.destinationWarehouse}</div>
                  <div className="text-[10px] text-[#717973]">Deadline: {new Date(contract.deliveryDeadline).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                </div>

                <div className="p-3 bg-[#f9f9f9] rounded-xl border border-[#e2e2e2] flex flex-col justify-between">
                  <div className="text-[10px] text-[#717973] uppercase font-bold">Remaining to Fulfill</div>
                  <div className="font-heading font-bold text-lg text-[#012d1d]">
                    {remainingMT > 0 ? `${remainingMT} MT` : 'Completed'}
                  </div>
                  <div className="text-[10px] text-[#3f6653] font-medium">
                    {contract.fulfilledVolumeMT} MT Delivered
                  </div>
                </div>
              </div>

              {/* Fulfillment Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="font-medium text-[#414844]">
                    Fulfillment Status: <strong className="text-[#012d1d]">{contract.fulfilledVolumeMT} MT</strong> of {contract.targetVolumeMT} MT dispatched
                  </span>
                  <span className="font-bold text-[#012d1d]">{percent.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-[#e8e8e8] h-3 rounded-full overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      percent >= 100 ? 'bg-[#3f6653]' : 'bg-[#012d1d]'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-2">
                <p className="text-[11px] text-[#717973] italic">
                  "{contract.notes}"
                </p>

                {contract.status !== 'fulfilled' && (
                  <button
                    onClick={() => setDispatchContract(contract)}
                    className="px-4 py-2 bg-[#012d1d] hover:bg-[#1b4332] text-white rounded-xl text-xs font-heading font-bold flex items-center gap-2 shadow-sm shrink-0"
                  >
                    <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                    <span>Dispatch Haulage Truck</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dispatch Truck Modal */}
      {dispatchContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#c1c8c2] space-y-4">
            <div className="flex justify-between items-center border-b border-[#e2e2e2] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#3f6653] bg-[#c1ecd4] px-2 py-0.5 rounded">
                  Logistics Waybill Dispatch
                </span>
                <h3 className="font-heading font-bold text-base text-[#012d1d] mt-1">
                  Dispatch to {dispatchContract.buyerCompany}
                </h3>
              </div>
              <button
                onClick={() => setDispatchContract(null)}
                className="w-8 h-8 rounded-full bg-[#f3f3f3] hover:bg-[#e2e2e2] flex items-center justify-center text-[#414844]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleConfirmDispatch} className="space-y-3 text-xs">
              <div className="p-3 bg-[#f9f9f9] rounded-xl border border-[#e2e2e2] space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#717973]">Contract:</span>
                  <span className="font-bold">{dispatchContract.contractNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#717973]">Commodity:</span>
                  <span className="font-bold">{dispatchContract.crop}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#717973]">Depot Destination:</span>
                  <span className="font-bold truncate max-w-[200px]">{dispatchContract.destinationWarehouse}</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#414844] mb-1">
                  Truck Load Tonnage (Metric Tons) *
                </label>
                <input
                  type="number"
                  min="5"
                  max="50"
                  step="1"
                  value={dispatchMT}
                  onChange={(e) => setDispatchMT(parseInt(e.target.value) || 30)}
                  className="w-full px-3 py-2 bg-[#f3f3f3] border border-[#c1c8c2] rounded-lg font-bold text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-[#717973] mb-1">
                    Truck Registration Plate
                  </label>
                  <input
                    type="text"
                    value={truckPlate}
                    onChange={(e) => setTruckPlate(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#f3f3f3] border border-[#c1c8c2] rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#717973] mb-1">
                    Waybill Code
                  </label>
                  <input
                    type="text"
                    value={waybillCode}
                    onChange={(e) => setWaybillCode(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#f3f3f3] border border-[#c1c8c2] rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#414844] mb-1">
                  Transporter Fleet Company
                </label>
                <input
                  type="text"
                  value={transporterName}
                  onChange={(e) => setTransporterName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f3f3f3] border border-[#c1c8c2] rounded-lg text-xs"
                />
              </div>

              <div className="p-3 bg-[#f3f8f5] rounded-xl border border-[#c1ecd4] space-y-1">
                <div className="text-[10px] text-[#3f6653] font-bold uppercase">
                  Batch Value Dispatched
                </div>
                <div className="font-heading font-bold text-base text-[#012d1d]">
                  ₦{(dispatchContract.agreedPricePerMT * dispatchMT).toLocaleString()}
                </div>
                <p className="text-[10px] text-[#717973]">
                  Escrow automatically triggered for release upon destination weighbridge verification.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#e2e2e2]">
                <button
                  type="button"
                  onClick={() => setDispatchContract(null)}
                  className="px-4 py-2 bg-[#f3f3f3] text-[#414844] font-bold rounded-lg hover:bg-[#e8e8e8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#012d1d] text-white font-bold rounded-lg hover:bg-[#1b4332]"
                >
                  Authorize Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
