import React, { useState } from 'react';
import {
  Landmark,
  TrendingUp,
  BarChart3,
  Truck,
  Layers,
  Sprout,
  ShieldCheck,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Eye,
  Award,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { AdminGlobalFilterBar, GlobalFilterState } from '../../components/admin/AdminGlobalFilterBar';
import { ReasonLoggingModal } from '../../components/admin/ReasonLoggingModal';

export const MinistryAdminDashboard: React.FC = () => {
  const { listings, orders, usersList } = useApp();
  const { user } = useAuth();

  const [filters, setFilters] = useState<GlobalFilterState>({
    dateRange: 'year_to_date',
    state: 'All States',
    lga: 'All LGAs',
    valueChain: 'All Value Chains',
    commodity: 'All Commodities',
  });

  const [activeTab, setActiveTab] = useState<
    'food_security' | 'natip_tracker' | 'gmp_scheme' | 'mechanisation' | 'subsidies' | 'fec_reports'
  >('food_security');

  const [selectedFarmerForAudit, setSelectedFarmerForAudit] = useState<any | null>(null);
  const [reportGenerated, setReportGenerated] = useState<string | null>(null);

  // 1. National Food Security Balance Sheet Data
  const foodBalanceSheet = [
    { crop: 'White Maize', annualDemandMT: 12800000, projectedHarvestMT: 13950000, balanceMT: '+1,150,000 MT', status: 'Surplus', bufferStock: '420,000 MT in National Silos' },
    { crop: 'Paddy Rice', annualDemandMT: 8200000, projectedHarvestMT: 7600000, balanceMT: '-600,000 MT', status: 'Deficit Risk', bufferStock: '280,000 MT in Strategic Reserves' },
    { crop: 'Cassava Tubers', annualDemandMT: 62000000, projectedHarvestMT: 66400000, balanceMT: '+4,400,000 MT', status: 'Surplus', bufferStock: '1,200,000 MT Industrial Starch Buffer' },
    { crop: 'Yam Tubers', annualDemandMT: 49000000, projectedHarvestMT: 52800000, balanceMT: '+3,800,000 MT', status: 'Surplus', bufferStock: 'National Yam Export Hubs Active' },
    { crop: 'Soybeans', annualDemandMT: 1950000, projectedHarvestMT: 1820000, balanceMT: '-130,000 MT', status: 'Moderate Deficit', bufferStock: '85,000 MT Feed Mill Buffer' },
    { crop: 'Sorghum', annualDemandMT: 7100000, projectedHarvestMT: 7450000, balanceMT: '+350,000 MT', status: 'Surplus', bufferStock: '310,000 MT Northern Strategic Silos' },
  ];

  // 2. NATIP 2022-2027 Strategic Pillars Progress
  const natipPillars = [
    { id: 1, name: 'Food Security & Nutrition', target: '100% Staple Self-Sufficiency', progress: 86, budgetDisbursed: '₦48.5B', status: 'On Track' },
    { id: 2, name: 'Agricultural Infrastructure & Storage', target: '36 Modern Grain Hubs', progress: 74, budgetDisbursed: '₦32.0B', status: 'In Progress' },
    { id: 3, name: 'Extension Modernization & Digital Advisory', target: '50,000 Certified Digital Agents', progress: 91, budgetDisbursed: '₦14.2B', status: 'Surpassing Target' },
    { id: 4, name: 'Youth & Women Agro-Enterprise', target: '1.2M New Agripreneurs', progress: 82, budgetDisbursed: '₦22.8B', status: 'On Track' },
    { id: 5, name: 'Private Sector Ag-Processing & Export', target: '₦500B Non-Oil Ag Export', progress: 68, budgetDisbursed: '₦19.5B', status: 'Accelerating' },
  ];

  // 3. Guaranteed Minimum Price (GMP) Scheme Data
  const gmpCommodities = [
    { crop: 'White Maize (Per 100kg Bag)', statutoryFloor: '₦48,000', currentMarketPrice: '₦52,500', complianceRate: '98.2%', farmersProtected: 48500, volumePurchasedMT: '185,000 MT' },
    { crop: 'Paddy Rice (Per 100kg Bag)', statutoryFloor: '₦62,000', currentMarketPrice: '₦64,800', complianceRate: '96.5%', farmersProtected: 38200, volumePurchasedMT: '142,000 MT' },
    { crop: 'Soybeans (Per 100kg Bag)', statutoryFloor: '₦75,000', currentMarketPrice: '₦78,000', complianceRate: '97.8%', farmersProtected: 24100, volumePurchasedMT: '82,000 MT' },
    { crop: 'Sorghum (Per 100kg Bag)', statutoryFloor: '₦42,000', currentMarketPrice: '₦44,500', complianceRate: '99.1%', farmersProtected: 31600, volumePurchasedMT: '94,000 MT' },
  ];

  // 4. Mechanisation Programme Tracker Data
  const mechanisationZones = [
    { zone: 'North West (Kano, Kaduna, Sokoto, Kebbi)', tractorsDeployed: 1250, implements: 4800, activeGpsRate: '92.4%', hectaresTilled: '340,000 Ha' },
    { zone: 'North Central (Benue, Niger, Plateau, Nasarawa)', tractorsDeployed: 980, implements: 3900, activeGpsRate: '88.1%', hectaresTilled: '280,000 Ha' },
    { zone: 'North East (Taraba, Adamawa, Gombe, Bauchi)', tractorsDeployed: 740, implements: 3100, activeGpsRate: '85.6%', hectaresTilled: '210,000 Ha' },
    { zone: 'South West (Oyo, Ogun, Ondo, Osun)', tractorsDeployed: 560, implements: 2400, activeGpsRate: '90.2%', hectaresTilled: '160,000 Ha' },
    { zone: 'South South & South East (Edo, Cross River, Enugu)', tractorsDeployed: 590, implements: 2600, activeGpsRate: '87.5%', hectaresTilled: '155,000 Ha' },
  ];

  // 5. Subsidy Distribution Summary
  const subsidyData = [
    { item: 'NPK 20-10-10 Subsidized Fertilizer', targetBags: 2500000, distributedBags: 2180000, subsidyRate: '50% Federal Subsidy', totalSubsidyValue: '₦32.7 Billion' },
    { item: 'Urea 46-0-0 Subsidized Fertilizer', targetBags: 1800000, distributedBags: 1590000, subsidyRate: '50% Federal Subsidy', totalSubsidyValue: '₦23.8 Billion' },
    { item: 'Certified Hybrid Maize Seeds (10kg)', targetBags: 600000, distributedBags: 540000, subsidyRate: '75% Seed Grant', totalSubsidyValue: '₦4.8 Billion' },
    { item: 'FARO 44 Certified Rice Seeds (25kg)', targetBags: 450000, distributedBags: 412000, subsidyRate: '75% Seed Grant', totalSubsidyValue: '₦6.2 Billion' },
  ];

  const handleGenerateFecReport = () => {
    setReportGenerated('FEC_POLICY_BRIEF_2026_Q3.PDF');
    setTimeout(() => setReportGenerated(null), 5000);
  };

  return (
    <div className="space-y-6 font-body">
      {/* Global Filter Bar */}
      <AdminGlobalFilterBar
        filters={filters}
        onFilterChange={setFilters}
        roleTitle="Federal Ministry Admin (FMAFS Directorate)"
        departmentTag="FMAFS Policy & Planning"
        watermarkText="OFFICIAL POLICY CONFIDENTIAL • FMAFS FEDERAL EXECUTIVE RECORD"
      />

      {/* Top Ministry Banner */}
      <div className="bg-gradient-to-r from-[#012d1d] via-[#053d28] to-[#012d1d] text-white p-5 rounded-2xl border border-[#1b4332] shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-[#b45309] text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-xs">
              Federal Ministry of Agriculture & Food Security
            </span>
            <span className="text-xs text-[#86af99] font-medium">Renewed Hope Agenda</span>
          </div>
          <h2 className="font-heading font-bold text-xl text-white">
            National Food Security & Policy Command Suite
          </h2>
          <p className="text-xs text-[#86af99]">
            Strategic Grain Reserve Monitoring, NATIP 2022–2027 Milestones, GMP Compliance & Mechanisation Telemetry
          </p>
        </div>

        <button
          type="button"
          onClick={handleGenerateFecReport}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#c1ecd4] hover:bg-[#a6e2bf] text-[#002114] text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <Award className="w-4 h-4 text-[#002114]" />
          <span>Generate FEC Policy Brief</span>
        </button>
      </div>

      {reportGenerated && (
        <div className="p-3.5 bg-[#c1ecd4] text-[#002114] border border-[#276a4c]/40 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#002114]" />
            <span>
              Official Federal Executive Council Policy Dossier ({reportGenerated}) compiled and watermarked for legislative submission.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setReportGenerated(null)}
            className="text-xs underline hover:text-black"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="bg-white border border-[#c1c8c2]/80 p-4 rounded-2xl shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#717973]">
            National Grain Reserve Buffer
          </span>
          <div className="font-heading font-bold text-2xl text-[#012d1d]">78.4% Capacity</div>
          <div className="text-[11px] text-[#16a34a] font-bold">2.45M MT Strategic Stock</div>
        </div>

        <div className="bg-white border border-[#c1c8c2]/80 p-4 rounded-2xl shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#717973]">
            NATIP Implementation Index
          </span>
          <div className="font-heading font-bold text-2xl text-[#012d1d]">82.6 / 100</div>
          <div className="text-[11px] text-[#16a34a] font-bold">+5.2% Above 2026 Milestone</div>
        </div>

        <div className="bg-white border border-[#c1c8c2]/80 p-4 rounded-2xl shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#717973]">
            GMP Scheme Farmers Reached
          </span>
          <div className="font-heading font-bold text-2xl text-[#012d1d]">142,800</div>
          <div className="text-[11px] text-[#012d1d] font-semibold">97.4% Floor Price Compliance</div>
        </div>

        <div className="bg-white border border-[#c1c8c2]/80 p-4 rounded-2xl shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#717973]">
            Active Tractors & GPS Implements
          </span>
          <div className="font-heading font-bold text-2xl text-[#012d1d]">4,120 Units</div>
          <div className="text-[11px] text-[#2563eb] font-bold">89.2% Telemetry Utilization</div>
        </div>
      </div>

      {/* Sub-Tabs Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-[#c1c8c2]/60">
        {[
          { id: 'food_security' as const, label: 'National Food Balance Sheet', icon: Sprout },
          { id: 'natip_tracker' as const, label: 'NATIP 2022–2027 Pillars', icon: Layers },
          { id: 'gmp_scheme' as const, label: 'Guaranteed Minimum Price (GMP)', icon: ShieldCheck },
          { id: 'mechanisation' as const, label: 'Mechanisation Programme', icon: Truck },
          { id: 'subsidies' as const, label: 'Subsidies & Inputs Map', icon: Zap },
          { id: 'fec_reports' as const, label: 'FEC & Legislative Reports', icon: FileSpreadsheet },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#012d1d] text-white shadow-xs'
                  : 'bg-white text-[#525a54] hover:bg-[#f0f4f1] border border-[#c1c8c2]/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#c1ecd4]' : 'text-[#012d1d]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* View 1: National Food Balance Sheet */}
      {activeTab === 'food_security' && (
        <div className="bg-white rounded-2xl border border-[#c1c8c2]/80 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-[#e5e9e6]">
            <div>
              <h3 className="font-heading font-bold text-sm text-[#012d1d]">
                National Agricultural Commodity Balance Sheet (2025/2026 Season)
              </h3>
              <p className="text-xs text-[#717973]">
                Projected national production output vs. annual industrial, feed, and household consumption
              </p>
            </div>
            <span className="text-[10px] font-bold bg-[#c1ecd4] text-[#002114] px-2.5 py-1 rounded-full uppercase">
              FMAFS Forecast Live
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#e5e9e6] bg-[#f8faf8] text-[#525a54] font-bold">
                  <th className="p-3">Staple Commodity</th>
                  <th className="p-3">Projected Harvest</th>
                  <th className="p-3">Annual Demand</th>
                  <th className="p-3">Surplus / Deficit</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Strategic Buffer Depots</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e9e6]">
                {foodBalanceSheet.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#f8faf8] transition-colors">
                    <td className="p-3 font-bold text-[#012d1d]">{item.crop}</td>
                    <td className="p-3 font-semibold text-[#012d1d]">
                      {(item.projectedHarvestMT / 1000000).toFixed(2)}M MT
                    </td>
                    <td className="p-3 text-[#525a54]">
                      {(item.annualDemandMT / 1000000).toFixed(2)}M MT
                    </td>
                    <td className="p-3">
                      <span
                        className={`font-bold ${
                          item.status === 'Surplus'
                            ? 'text-[#16a34a]'
                            : item.status === 'Deficit Risk'
                            ? 'text-[#ba1a1a]'
                            : 'text-[#b45309]'
                        }`}
                      >
                        {item.balanceMT}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === 'Surplus'
                            ? 'bg-[#c1ecd4] text-[#002114]'
                            : item.status === 'Deficit Risk'
                            ? 'bg-[#ffdad6] text-[#ba1a1a]'
                            : 'bg-[#fef3c7] text-[#b45309]'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3 text-[#525a54] text-[11px]">{item.bufferStock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View 2: NATIP 2022-2027 Pillars Tracker */}
      {activeTab === 'natip_tracker' && (
        <div className="bg-white rounded-2xl border border-[#c1c8c2]/80 p-5 shadow-xs space-y-4">
          <div className="pb-2 border-b border-[#e5e9e6]">
            <h3 className="font-heading font-bold text-sm text-[#012d1d]">
              National Agricultural Technology & Innovation Policy (NATIP 2022–2027)
            </h3>
            <p className="text-xs text-[#717973]">
              Execution scorecard tracking budget disbursements, technological deployment, and state-level adoption
            </p>
          </div>

          <div className="space-y-4">
            {natipPillars.map((pillar) => (
              <div
                key={pillar.id}
                className="p-4 bg-[#f8faf8] rounded-2xl border border-[#d8deda] space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#012d1d] text-[#c1ecd4] text-xs font-bold flex items-center justify-center">
                        {pillar.id}
                      </span>
                      <h4 className="font-heading font-bold text-xs sm:text-sm text-[#012d1d]">
                        {pillar.name}
                      </h4>
                    </div>
                    <p className="text-xs text-[#717973] ml-7">Target: {pillar.target}</p>
                  </div>

                  <div className="flex items-center gap-3 ml-7 sm:ml-0">
                    <span className="text-xs font-bold text-[#012d1d]">
                      Disbursed: <strong>{pillar.budgetDisbursed}</strong>
                    </span>
                    <span className="px-2.5 py-0.5 bg-[#c1ecd4] text-[#002114] rounded-full text-[10px] font-bold">
                      {pillar.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-[#525a54]">
                    <span>Completion Rate</span>
                    <span className="text-[#012d1d]">{pillar.progress}%</span>
                  </div>
                  <div className="w-full bg-[#e2e8e4] h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#012d1d] h-full rounded-full transition-all duration-500"
                      style={{ width: `${pillar.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View 3: Guaranteed Minimum Price (GMP) Monitoring */}
      {activeTab === 'gmp_scheme' && (
        <div className="bg-white rounded-2xl border border-[#c1c8c2]/80 p-5 shadow-xs space-y-4">
          <div className="pb-2 border-b border-[#e5e9e6]">
            <h3 className="font-heading font-bold text-sm text-[#012d1d]">
              Guaranteed Minimum Price (GMP) Scheme Live Compliance
            </h3>
            <p className="text-xs text-[#717973]">
              Protecting smallholders against post-harvest market glut and price gouging
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gmpCommodities.map((item, idx) => (
              <div key={idx} className="p-4 bg-[#f8faf8] rounded-2xl border border-[#d8deda] space-y-3">
                <div className="flex justify-between items-start">
                  <span className="font-heading font-bold text-xs text-[#012d1d]">{item.crop}</span>
                  <span className="px-2 py-0.5 bg-[#c1ecd4] text-[#002114] text-[10px] font-bold rounded-md">
                    {item.complianceRate} Compliance
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-white p-3 rounded-xl border border-[#e2e8e4]">
                  <div>
                    <span className="text-[10px] text-[#717973] block">Statutory Floor Price</span>
                    <span className="font-bold text-[#ba1a1a]">{item.statutoryFloor}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#717973] block">Current Trade Price</span>
                    <span className="font-bold text-[#16a34a]">{item.currentMarketPrice}</span>
                  </div>
                  <div className="pt-2 border-t border-[#e2e8e4]">
                    <span className="text-[10px] text-[#717973] block">Farmers Protected</span>
                    <span className="font-bold text-[#012d1d]">{item.farmersProtected.toLocaleString()}</span>
                  </div>
                  <div className="pt-2 border-t border-[#e2e8e4]">
                    <span className="text-[10px] text-[#717973] block">Volume Absorbed</span>
                    <span className="font-bold text-[#012d1d]">{item.volumePurchasedMT}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View 4: Mechanisation Programme Tracker */}
      {activeTab === 'mechanisation' && (
        <div className="bg-white rounded-2xl border border-[#c1c8c2]/80 p-5 shadow-xs space-y-4">
          <div className="pb-2 border-b border-[#e5e9e6]">
            <h3 className="font-heading font-bold text-sm text-[#012d1d]">
              National Agricultural Mechanisation Telemetry Tracker
            </h3>
            <p className="text-xs text-[#717973]">
              GPS tracking of commercial tractor fleets, disc harrows, and combine harvesters across 6 geopolitical zones
            </p>
          </div>

          <div className="divide-y divide-[#e5e9e6]">
            {mechanisationZones.map((zone, idx) => (
              <div key={idx} className="py-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-1">
                  <div className="font-heading font-bold text-xs text-[#012d1d]">{zone.zone}</div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#525a54]">
                    <span>Tractors Deployed: <strong>{zone.tractorsDeployed}</strong></span>
                    <span>Implements: <strong>{zone.implements}</strong></span>
                    <span>Area Tilled: <strong>{zone.hectaresTilled}</strong></span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-bold text-[#16a34a] bg-[#f0fdf4] px-2.5 py-1 rounded-lg border border-[#bbf7d0]">
                    {zone.activeGpsRate} Active Telemetry
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View 5: Subsidy & Input Distribution Map */}
      {activeTab === 'subsidies' && (
        <div className="bg-white rounded-2xl border border-[#c1c8c2]/80 p-5 shadow-xs space-y-4">
          <div className="pb-2 border-b border-[#e5e9e6]">
            <h3 className="font-heading font-bold text-sm text-[#012d1d]">
              National Input Subsidies & Voucher Redemption Distribution
            </h3>
            <p className="text-xs text-[#717973]">
              Electronic voucher disbursements (e-Wallets) for certified fertilizers, hybrid seeds, and bio-pesticides
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subsidyData.map((sub, idx) => (
              <div key={idx} className="p-4 bg-[#f8faf8] rounded-2xl border border-[#d8deda] space-y-2.5">
                <div className="flex justify-between items-start">
                  <span className="font-heading font-bold text-xs text-[#012d1d]">{sub.item}</span>
                  <span className="px-2 py-0.5 bg-[#012d1d] text-[#c1ecd4] text-[10px] font-bold rounded-md">
                    {sub.subsidyRate}
                  </span>
                </div>

                <div className="flex justify-between text-xs text-[#525a54]">
                  <span>Distributed: <strong>{sub.distributedBags.toLocaleString()} bags</strong></span>
                  <span>Target: <strong>{sub.targetBags.toLocaleString()} bags</strong></span>
                </div>

                <div className="w-full bg-[#e2e8e4] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#012d1d] h-full rounded-full"
                    style={{ width: `${(sub.distributedBags / sub.targetBags) * 100}%` }}
                  />
                </div>

                <div className="text-right text-[11px] font-bold text-[#012d1d]">
                  Total Value: {sub.totalSubsidyValue}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View 6: FEC & Legislative Reports */}
      {activeTab === 'fec_reports' && (
        <div className="bg-white rounded-2xl border border-[#c1c8c2]/80 p-5 shadow-xs space-y-4">
          <div className="pb-2 border-b border-[#e5e9e6]">
            <h3 className="font-heading font-bold text-sm text-[#012d1d]">
              Executive Briefings for Federal Executive Council (FEC) & National Assembly
            </h3>
            <p className="text-xs text-[#717973]">
              Download signed statutory reports prepared for the Honourable Minister and Permanent Secretary
            </p>
          </div>

          <div className="space-y-3">
            {[
              { title: 'National Food Security & Grain Reserve Status Report Q3 2026', ref: 'FMAFS/FEC/2026/089', date: 'Aug 2026', classification: 'SECRET / FEC' },
              { title: 'NATIP 2022–2027 Mid-Term Progress & Budgetary Impact Review', ref: 'FMAFS/NASS/AG-24', date: 'Jul 2026', classification: 'OFFICIAL' },
              { title: 'Guaranteed Minimum Price (GMP) Scheme Nationwide Audit', ref: 'FMAFS/GMP/AUD-11', date: 'Jun 2026', classification: 'CONFIDENTIAL' },
            ].map((rep, idx) => (
              <div key={idx} className="p-4 bg-[#f8faf8] rounded-2xl border border-[#d8deda] flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="font-heading font-bold text-xs text-[#012d1d]">{rep.title}</div>
                  <div className="text-[11px] text-[#717973]">
                    Ref: <strong>{rep.ref}</strong> • Date: {rep.date} • Security: <span className="text-[#ba1a1a] font-bold">{rep.classification}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleGenerateFecReport}
                  className="px-3 py-1.5 bg-[#012d1d] hover:bg-[#1b4332] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
                >
                  <Download className="w-3.5 h-3.5 text-[#c1ecd4]" />
                  <span>Download Dossier</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mandatory Reason Logging Modal for Individual Record Drilldown */}
      {selectedFarmerForAudit && (
        <ReasonLoggingModal
          isOpen={true}
          onClose={() => setSelectedFarmerForAudit(null)}
          targetUserName={selectedFarmerForAudit.name}
          targetUserRole={selectedFarmerForAudit.role}
          targetUserId={selectedFarmerForAudit.id}
          adminDepartment="FMAFS Policy Directorate"
          recordType="Farmer Verification & Subsidy Yield Record"
          onConfirm={(reason) => {
            setSelectedFarmerForAudit(null);
          }}
        />
      )}
    </div>
  );
};
export default MinistryAdminDashboard;
