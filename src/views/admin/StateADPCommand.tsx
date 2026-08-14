import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const StateADPCommand: React.FC = () => {
  const [selectedState, setSelectedState] = useState<string>('Kaduna');

  // State Agricultural Development Programmes (ADP) Profiles
  const stateADPData: Record<
    string,
    {
      director: string;
      hq: string;
      registeredClusters: number;
      extensionOfficers: number;
      topCrops: string[];
      activeLGAs: number;
      fertilizerAllocatedMT: number;
      fertilizerDistributedMT: number;
      activeWarning?: string;
    }
  > = {
    Kaduna: {
      director: 'Dr. Chidi Okafor',
      hq: 'State ADP Complex, Zaria Road, Kaduna',
      registeredClusters: 1420,
      extensionOfficers: 284,
      topCrops: ['Maize', 'Ginger', 'Soybeans', 'Tomatoes'],
      activeLGAs: 23,
      fertilizerAllocatedMT: 18000,
      fertilizerDistributedMT: 15400,
      activeWarning: 'Fall Armyworm scouting alert active in Giwa & Makarfi LGAs',
    },
    Kano: {
      director: 'Alhaji Mansur Garba',
      hq: 'Kano State Agricultural & Rural Development Authority (KNARDA)',
      registeredClusters: 2150,
      extensionOfficers: 340,
      topCrops: ['Rice Paddy', 'Wheat', 'Groundnuts', 'Onions'],
      activeLGAs: 44,
      fertilizerAllocatedMT: 26000,
      fertilizerDistributedMT: 22800,
    },
    Benue: {
      director: 'Engr. Terver Aondo',
      hq: 'Benue Agricultural and Rural Development Authority (BNARDA), Makurdi',
      registeredClusters: 1890,
      extensionOfficers: 260,
      topCrops: ['Yam', 'Cassava', 'Soybeans', 'Citrus'],
      activeLGAs: 23,
      fertilizerAllocatedMT: 16500,
      fertilizerDistributedMT: 13900,
      activeWarning: 'Post-harvest yam tuber storage ventilation advisory issued',
    },
    Ogun: {
      director: 'Mrs. Folashade Adeleke',
      hq: 'Ogun State Agricultural Development Programme (OGADEP), Abeokuta',
      registeredClusters: 980,
      extensionOfficers: 175,
      topCrops: ['Cassava', 'Maize', 'Poultry', 'Oil Palm'],
      activeLGAs: 20,
      fertilizerAllocatedMT: 9500,
      fertilizerDistributedMT: 8200,
    },
    Niger: {
      director: 'Mallam Ibrahim Kontagora',
      hq: 'Niger State Agricultural Development Programme (NAMDA), Minna',
      registeredClusters: 1650,
      extensionOfficers: 220,
      topCrops: ['Rice', 'Sorghum', 'Cowpea', 'Shea Nut'],
      activeLGAs: 25,
      fertilizerAllocatedMT: 15000,
      fertilizerDistributedMT: 12400,
    },
  };

  const current = stateADPData[selectedState] || stateADPData['Kaduna'];

  // LGA breakdown for selected state
  const sampleLGAs = [
    { name: `${selectedState} Central LGA`, farmers: 4520, officers: 18, inputRedemption: '88%', health: 'Optimal' },
    { name: `${selectedState} North Agricultural Zone`, farmers: 6200, officers: 24, inputRedemption: '76%', health: 'Optimal' },
    { name: `${selectedState} River Basin Cluster`, farmers: 5100, officers: 20, inputRedemption: '92%', health: 'Optimal' },
    { name: `${selectedState} South Agronomy Unit`, farmers: 3800, officers: 15, inputRedemption: '69%', health: 'Needs Follow-up' },
  ];

  return (
    <div className="space-y-6">
      {/* State Selection Top Ribbon */}
      <div className="bg-white p-4 rounded-2xl border border-[#c1c8c2]/70 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-[#012d1d] text-[24px]">location_city</span>
          <div>
            <h3 className="font-heading font-bold text-base text-[#012d1d]">
              State Agricultural Development Programme (ADP) Command
            </h3>
            <p className="text-xs text-[#717973]">Direct operational control with State ADPs & Field Agronomists</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-[#012d1d]">Select State:</label>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="h-9 px-3 rounded-xl border border-[#c1c8c2] bg-[#f9fbf9] font-bold text-xs text-[#012d1d]"
          >
            {Object.keys(stateADPData).map((st) => (
              <option key={st} value={st}>
                {st} State ADP
              </option>
            ))}
          </select>
        </div>
      </div>

      {current.activeWarning && (
        <div className="p-3.5 bg-[#ffdeac] text-[#281900] rounded-xl border border-[#e6b400]/40 flex items-center justify-between text-xs shadow-xs">
          <div className="flex items-center gap-2 font-semibold">
            <span className="material-symbols-outlined text-[20px] text-[#dc9a00]">warning</span>
            <span>{current.activeWarning}</span>
          </div>
          <span className="font-bold uppercase text-[10px] bg-[#281900] text-white px-2 py-0.5 rounded-full">
            Active Warning
          </span>
        </div>
      )}

      {/* State ADP Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#c1c8c2]/70 p-4 rounded-2xl shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#717973]">Registered Farm Clusters</span>
          <div className="font-heading font-bold text-2xl text-[#012d1d]">
            {current.registeredClusters.toLocaleString()}
          </div>
          <span className="text-[11px] text-[#3f6653] font-semibold">{current.activeLGAs} LGAs Fully Covered</span>
        </div>

        <div className="bg-white border border-[#c1c8c2]/70 p-4 rounded-2xl shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#717973]">Field Extension Officers</span>
          <div className="font-heading font-bold text-2xl text-[#012d1d]">{current.extensionOfficers} Active</div>
          <span className="text-[11px] text-[#276a4c] font-bold">1 : 350 Farmer Ratio</span>
        </div>

        <div className="bg-white border border-[#c1c8c2]/70 p-4 rounded-2xl shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#717973]">Subsidized Fertilizer Stock</span>
          <div className="font-heading font-bold text-2xl text-[#012d1d]">
            {current.fertilizerDistributedMT.toLocaleString()} / {current.fertilizerAllocatedMT.toLocaleString()} MT
          </div>
          <span className="text-[11px] text-[#276a4c] font-bold">
            {Math.round((current.fertilizerDistributedMT / current.fertilizerAllocatedMT) * 100)}% Dispatched
          </span>
        </div>

        <div className="bg-white border border-[#c1c8c2]/70 p-4 rounded-2xl shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#717973]">Primary Focus Crops</span>
          <div className="font-heading font-bold text-sm text-[#012d1d] truncate">
            {current.topCrops.join(', ')}
          </div>
          <span className="text-[11px] text-[#717973]">FMAFS Priority Value Chain</span>
        </div>
      </div>

      {/* ADP Headquarters & Extension Deployment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-[#c1c8c2]/70 p-5 shadow-xs space-y-3">
          <h4 className="font-heading font-bold text-sm text-[#012d1d]">State ADP Directorate</h4>
          <div className="p-3 bg-[#f9fbf9] rounded-xl border border-[#e2e8e4] text-xs space-y-2">
            <div>
              <span className="text-[#717973] block text-[10px] uppercase font-bold">Program Director / Manager:</span>
              <span className="font-bold text-[#012d1d] text-sm">{current.director}</span>
            </div>
            <div>
              <span className="text-[#717973] block text-[10px] uppercase font-bold">HQ Office:</span>
              <span className="text-[#2c342e]">{current.hq}</span>
            </div>
            <div className="pt-2 border-t border-[#e2e8e4] flex justify-between">
              <span className="text-[#717973]">Status:</span>
              <span className="text-[#012d1d] font-bold">Full Telemetry Link</span>
            </div>
          </div>

          <div className="p-3 bg-[#f0f4f1] rounded-xl border border-[#c1c8c2]/50 text-xs space-y-2">
            <span className="font-bold text-[#012d1d] block">Emergency Field Dispatch:</span>
            <p className="text-[11px] text-[#525a54]">
              Instantly push geo-tagged SMS advisory or crop scouting orders to all {current.extensionOfficers} extension officers in {selectedState}.
            </p>
            <button className="w-full py-2 bg-[#012d1d] text-white font-bold text-xs rounded-xl hover:bg-[#1b4332] active:scale-95 transition-all shadow-xs">
              Dispatch Extension Alert
            </button>
          </div>
        </div>

        {/* LGA Breakdown Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#c1c8c2]/70 p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-[#e8ece9]">
            <h4 className="font-heading font-bold text-sm text-[#012d1d]">
              Agricultural Zones & LGA Performance ({selectedState} State)
            </h4>
            <span className="text-xs text-[#717973] font-semibold">{sampleLGAs.length} Zones Tracked</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#f9fbf9] text-[#012d1d] font-bold border-b border-[#e2e8e4]">
                  <th className="p-3">Agricultural Zone / LGA</th>
                  <th className="p-3">Farmers</th>
                  <th className="p-3">Officers</th>
                  <th className="p-3">Voucher Redemption</th>
                  <th className="p-3">Zone Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8ece9]">
                {sampleLGAs.map((lga, idx) => (
                  <tr key={idx} className="hover:bg-[#f9fbf9] transition-colors">
                    <td className="p-3 font-bold text-[#1a1c1c]">{lga.name}</td>
                    <td className="p-3">{lga.farmers.toLocaleString()}</td>
                    <td className="p-3 font-semibold">{lga.officers}</td>
                    <td className="p-3 font-bold text-[#012d1d]">{lga.inputRedemption}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          lga.health === 'Optimal'
                            ? 'bg-[#c1ecd4] text-[#002114]'
                            : 'bg-[#ffdeac] text-[#281900]'
                        }`}
                      >
                        {lga.health}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
