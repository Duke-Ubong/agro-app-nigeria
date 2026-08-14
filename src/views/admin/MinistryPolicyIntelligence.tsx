import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const MinistryPolicyIntelligence: React.FC = () => {
  const { loans } = useApp();
  const [selectedCrop, setSelectedCrop] = useState<string>('Maize');

  // National Food Balance Sheet Estimates
  const balanceSheet = [
    { crop: 'Maize', annualDemandMT: 12500000, projectedHarvestMT: 13200000, surplusDeficit: '+700,000 MT', status: 'Surplus' },
    { crop: 'Paddy Rice', annualDemandMT: 7800000, projectedHarvestMT: 7100000, surplusDeficit: '-700,000 MT', status: 'Deficit Risk' },
    { crop: 'Cassava', annualDemandMT: 60000000, projectedHarvestMT: 63500000, surplusDeficit: '+3,500,000 MT', status: 'Surplus' },
    { crop: 'Soybeans', annualDemandMT: 1800000, projectedHarvestMT: 1650000, surplusDeficit: '-150,000 MT', status: 'Moderate Deficit' },
    { crop: 'Yam', annualDemandMT: 48000000, projectedHarvestMT: 51200000, surplusDeficit: '+3,200,000 MT', status: 'Surplus' },
    { crop: 'Wheat', annualDemandMT: 5200000, projectedHarvestMT: 1800000, surplusDeficit: '-3,400,000 MT', status: 'Import Reliance' },
  ];

  // Bank of Agriculture 5% Agro-Credit Metrics
  const totalBOAFacility = 10000000000; // ₦10B
  const disbursedBOA = 4820000000; // ₦4.82B
  const repaidBOA = 2140000000; // ₦2.14B

  return (
    <div className="space-y-6">
      {/* Top Banner Partnership Notice */}
      <div className="bg-white p-4 rounded-2xl border border-[#c1c8c2]/70 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-[#012d1d] text-[24px]">policy</span>
          <div>
            <h3 className="font-heading font-bold text-base text-[#012d1d]">
              Federal Ministry of Agriculture & Bank of Agriculture Policy Suite
            </h3>
            <p className="text-xs text-[#717973]">
              Macroeconomic food security benchmarks, national balance sheets & credit underwriting metrics
            </p>
          </div>
        </div>

        <span className="text-xs font-bold text-[#012d1d] bg-[#c1ecd4] px-3 py-1 rounded-xl">
          FMAFS Policy Year 2025/2026
        </span>
      </div>

      {/* BOA Credit Line & Disbursal Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white border border-[#c1c8c2]/70 p-4 rounded-2xl shadow-xs space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#717973]">
            Total BOA Agri-Credit Fund
          </span>
          <div className="font-heading font-bold text-2xl text-[#012d1d]">₦10.00 Billion</div>
          <div className="text-[11px] text-[#276a4c] font-bold">5.0% Single-Digit Anchor Rate</div>
        </div>

        <div className="bg-white border border-[#c1c8c2]/70 p-4 rounded-2xl shadow-xs space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#717973]">
            Disbursed to Smallholder Farmers
          </span>
          <div className="font-heading font-bold text-2xl text-[#012d1d]">₦4.82 Billion</div>
          <div className="text-[11px] text-[#012d1d] font-semibold">48.2% Allocation to Date</div>
        </div>

        <div className="bg-white border border-[#c1c8c2]/70 p-4 rounded-2xl shadow-xs space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#717973]">
            On-Time Repayment Rate
          </span>
          <div className="font-heading font-bold text-2xl text-[#012d1d]">94.6%</div>
          <div className="text-[11px] text-[#276a4c] font-bold">Backed by Cooperative Digital Collateral</div>
        </div>
      </div>

      {/* National Food Balance Sheet & Production vs Demand Matrix */}
      <div className="bg-white rounded-2xl border border-[#c1c8c2]/70 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-[#e8ece9]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#012d1d] text-[22px]">balance</span>
            <div>
              <h4 className="font-heading font-bold text-sm text-[#012d1d]">
                National Agricultural Commodity Balance Sheet
              </h4>
              <p className="text-[11px] text-[#717973]">
                Projected harvest vs. domestic industrial & consumer consumption
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold bg-[#c1ecd4] text-[#002114] px-2 py-0.5 rounded-full uppercase">
            Updated Bi-Weekly
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f9fbf9] text-[#012d1d] font-bold border-b border-[#e2e8e4]">
                <th className="p-3">Staple Commodity</th>
                <th className="p-3">Domestic Demand (Annual)</th>
                <th className="p-3">Projected National Harvest</th>
                <th className="p-3">Surplus / Deficit</th>
                <th className="p-3">Food Security Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8ece9]">
              {balanceSheet.map((item, idx) => (
                <tr key={idx} className="hover:bg-[#f9fbf9] transition-colors">
                  <td className="p-3 font-bold text-[#1a1c1c]">{item.crop}</td>
                  <td className="p-3 text-[#525a54]">{(item.annualDemandMT / 1000000).toFixed(2)}M MT</td>
                  <td className="p-3 font-bold text-[#012d1d]">{(item.projectedHarvestMT / 1000000).toFixed(2)}M MT</td>
                  <td className="p-3 font-mono font-bold">{item.surplusDeficit}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        item.status === 'Surplus'
                          ? 'bg-[#c1ecd4] text-[#002114]'
                          : item.status === 'Moderate Deficit'
                          ? 'bg-[#ffdeac] text-[#281900]'
                          : 'bg-[#ffdad6] text-[#410002]'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Quotas & Strategic Reserve Triggers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-[#c1c8c2]/70 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#e8ece9]">
            <span className="material-symbols-outlined text-[#012d1d] text-[20px]">flight_takeoff</span>
            <h4 className="font-heading font-bold text-sm text-[#012d1d]">
              Agricultural Export Quotas & FX Realization
            </h4>
          </div>
          <p className="text-xs text-[#525a54]">
            Tracking non-oil agricultural export clearances (Cocoa, Raw Cashew, Sesame, Ginger) with Central Bank of Nigeria NXP documentation.
          </p>

          <div className="space-y-2 pt-2 text-xs">
            <div className="p-3 bg-[#f9fbf9] rounded-xl border border-[#e2e8e4] flex justify-between items-center">
              <div>
                <span className="font-bold text-[#012d1d]">Processed Sesame Seeds</span>
                <span className="text-[10px] text-[#717973] block">Kano & Gombe Export Corridors</span>
              </div>
              <span className="font-bold text-[#012d1d]">$48.5M FX Realized</span>
            </div>

            <div className="p-3 bg-[#f9fbf9] rounded-xl border border-[#e2e8e4] flex justify-between items-center">
              <div>
                <span className="font-bold text-[#012d1d]">Cocoa Beans (Grade 1)</span>
                <span className="text-[10px] text-[#717973] block">Ondo & Osun Farm Clusters</span>
              </div>
              <span className="font-bold text-[#012d1d]">$92.1M FX Realized</span>
            </div>

            <div className="p-3 bg-[#f9fbf9] rounded-xl border border-[#e2e8e4] flex justify-between items-center">
              <div>
                <span className="font-bold text-[#012d1d]">Split Dried Ginger</span>
                <span className="text-[10px] text-[#717973] block">Southern Kaduna Agro Zone</span>
              </div>
              <span className="font-bold text-[#012d1d]">$22.4M FX Realized</span>
            </div>
          </div>
        </div>

        {/* Policy Interventions Simulator */}
        <div className="bg-white rounded-2xl border border-[#c1c8c2]/70 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#e8ece9]">
            <span className="material-symbols-outlined text-[#012d1d] text-[20px]">science</span>
            <h4 className="font-heading font-bold text-sm text-[#012d1d]">
              National Farm Yield Simulation Model
            </h4>
          </div>
          <p className="text-xs text-[#525a54]">
            Simulate policy outcomes on smallholder farmer yields and food price stabilization.
          </p>

          <div className="p-3.5 bg-[#f0f4f1] rounded-xl border border-[#c1c8c2]/50 space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-bold text-[#012d1d] mb-1">
                <span>Fertilizer Subsidy Coverage:</span>
                <span>50% Price Reduction</span>
              </div>
              <div className="w-full bg-[#d0dbd3] h-2 rounded-full overflow-hidden">
                <div className="bg-[#012d1d] h-full w-[75%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-[#012d1d] mb-1">
                <span>Solar Irrigation Adoption (Dry Season):</span>
                <span>+32% Double-Cropping Impact</span>
              </div>
              <div className="w-full bg-[#d0dbd3] h-2 rounded-full overflow-hidden">
                <div className="bg-[#1b4332] h-full w-[55%]" />
              </div>
            </div>

            <div className="pt-2 border-t border-[#c1c8c2]/60 text-[11px] text-[#3f6653] font-semibold">
              Projected Outcome: +1.8 Million Metric Tons in 2026 dry season grain output.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
