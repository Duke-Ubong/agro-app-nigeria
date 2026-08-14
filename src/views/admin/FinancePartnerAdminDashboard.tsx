import React, { useState } from 'react';
import {
  CreditCard,
  TrendingUp,
  DollarSign,
  PieChart,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  Shield,
  FileSpreadsheet,
  Download,
  Eye,
  Percent,
  Sliders,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { AdminGlobalFilterBar, GlobalFilterState } from '../../components/admin/AdminGlobalFilterBar';
import { ReasonLoggingModal } from '../../components/admin/ReasonLoggingModal';

export const FinancePartnerAdminDashboard: React.FC = () => {
  const { loans, usersList, addAuditLog } = useApp();
  const { user } = useAuth();

  const [filters, setFilters] = useState<GlobalFilterState>({
    dateRange: 'year_to_date',
    state: 'All States',
    lga: 'All LGAs',
    valueChain: 'All Value Chains',
    commodity: 'All Commodities',
  });

  const [activeTab, setActiveTab] = useState<
    'portfolio' | 'credit_scoring' | 'single_digit_schemes' | 'asset_financing' | 'credit_history' | 'par_alerts'
  >('portfolio');

  const [selectedBorrower, setSelectedBorrower] = useState<any | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // 1. Portfolio Breakdown Data
  const portfolioStats = {
    totalFacility: '₦10.00 Billion',
    totalDisbursed: '₦4.85 Billion',
    totalRepaid: '₦3.67 Billion',
    outstandingBalance: '₦1.18 Billion',
    repaymentRate: '94.8%',
    defaultRate: '2.1%',
    activeBorrowers: 38400,
    par30: '₦42.5M (0.87%)',
    par60: '₦28.2M (0.58%)',
    par90: '₦31.4M (0.65%)',
  };

  // 2. Single-Digit Schemes Performance
  const singleDigitSchemes = [
    {
      id: 'sch_1',
      name: 'BOA Smallholder Anchor Fund (5.0% Fixed)',
      totalAllocation: '₦5.0 Billion',
      disbursed: '₦3.2 Billion',
      repaymentRate: '96.2%',
      beneficiaries: 24500,
      status: 'Active & Performing',
      tenor: '9 Months (Single Harvest)',
    },
    {
      id: 'sch_2',
      name: 'Renewed Hope Commercial Ag-Facility (7.5% Fixed)',
      totalAllocation: '₦3.0 Billion',
      disbursed: '₦1.1 Billion',
      repaymentRate: '92.4%',
      beneficiaries: 1200,
      status: 'Active',
      tenor: '24 Months (Capital Asset)',
    },
    {
      id: 'sch_3',
      name: 'Women & Youth In Agriculture Revolving Credit (3.0% Concession)',
      totalAllocation: '₦2.0 Billion',
      disbursed: '₦550 Million',
      repaymentRate: '97.8%',
      beneficiaries: 12700,
      status: 'Active & Low Risk',
      tenor: '12 Months',
    },
  ];

  // 3. Asset & Tractor Financing Monitoring
  const assetLeases = [
    {
      id: 'AST-101',
      asset: 'Mahindra 75HP 4WD Tractor + 3-Disc Plough',
      lessee: 'Zaria Mechanized Farmers Cooperative',
      state: 'Kaduna',
      cost: '₦28,500,000',
      downPayment: '10% (₦2,850,000)',
      monthlyRepayment: '₦1,150,000',
      repaymentStatus: 'Up-to-Date (14/24 installments)',
      gpsStatus: 'Active Telemetry (94% utilization)',
    },
    {
      id: 'AST-102',
      asset: 'Solar-Powered Cold Storage Pod (10 MT)',
      lessee: 'Kano Tomato Growers Cluster',
      state: 'Kano',
      cost: '₦14,200,000',
      downPayment: '10% (₦1,420,000)',
      monthlyRepayment: '₦580,000',
      repaymentStatus: 'Up-to-Date (8/24 installments)',
      gpsStatus: 'Active Telemetry (Optimal Temp 4°C)',
    },
  ];

  // 4. Sample Farmer Credit History Records
  const borrowerRecords = [
    {
      id: 'BORR-881',
      name: 'Abebe Usman',
      role: 'Smallholder Farmer',
      state: 'Kaduna',
      lga: 'Zaria',
      creditScore: 785,
      riskTier: 'Tier A (Low Risk)',
      activeLoan: '₦2,400,000 (Maize Anchor Loan)',
      repaidToDate: '₦1,800,000 (75%)',
      nextDueDate: '2026-09-15',
      collateral: 'Cooperative Joint Liability Guarantee + 5 Ha Farmland Survey',
      history: '3 previous BOA loans repaid on-time with zero default.',
    },
    {
      id: 'BORR-882',
      name: 'Hauwa Abubakar',
      role: 'Smallholder Farmer',
      state: 'Kaduna',
      lga: 'Giwa',
      creditScore: 740,
      riskTier: 'Tier A (Low Risk)',
      activeLoan: '₦1,200,000 (Soybean Facility)',
      repaidToDate: '₦1,200,000 (100% Cleared)',
      nextDueDate: 'Completed',
      collateral: 'Giwa Women Cooperative Guarantee',
      history: 'Eligible for Tier-2 credit limit expansion to ₦3,000,000.',
    },
    {
      id: 'BORR-883',
      name: 'Ibrahim Danladi',
      role: 'Aggregator / Merchant',
      state: 'Kano',
      lga: 'Bichi',
      creditScore: 620,
      riskTier: 'Tier B (Medium Risk - PAR 30)',
      activeLoan: '₦8,500,000 (Grain Aggregation Facility)',
      repaidToDate: '₦4,200,000 (49%)',
      nextDueDate: 'Overdue by 18 days',
      collateral: 'Warehouse Electronic Receipt #WR-9941 (120 MT Maize)',
      history: 'Automated escrow recovery triggered upon grain sales.',
    },
  ];

  return (
    <div className="space-y-6 font-body">
      {/* Global Filter Bar */}
      <AdminGlobalFilterBar
        filters={filters}
        onFilterChange={setFilters}
        roleTitle="Finance / Partner Admin (Bank of Agriculture - BOA)"
        departmentTag="Bank of Agriculture Credit Directorate"
        watermarkText="INTERNAL BANK USE ONLY • BANK OF AGRICULTURE STATUTORY CREDIT"
      />

      {/* Top Banner */}
      <div className="bg-[#065f46] text-white p-5 rounded-2xl border border-[#047857] shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-[#d97706] text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
              Bank of Agriculture (BOA)
            </span>
            <span className="text-xs text-[#a7f3d0]">Single-Digit Interest Agricultural Facility Suite</span>
          </div>
          <h2 className="font-heading font-bold text-xl text-white">
            Agricultural Credit Underwriting & Portfolio Recovery Console
          </h2>
          <p className="text-xs text-[#a7f3d0]">
            Disbursement Tranches, Risk Profiling, PAR Monitoring & Asset Lease Recovery
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#064e3b] p-1.5 rounded-xl border border-[#34d399]/40">
          <span className="text-[11px] font-bold text-[#a7f3d0] px-2">Portfolio Health:</span>
          <span className="px-2.5 py-1 bg-[#34d399] text-[#064e3b] rounded-lg text-xs font-bold">
            94.8% Repayment
          </span>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3.5 bg-[#c1ecd4] text-[#002114] border border-[#276a4c]/40 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#002114]" />
            <span>{actionSuccess}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionSuccess(null)}
            className="text-xs underline hover:text-black"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Key Financial Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="bg-white border border-[#c1c8c2]/80 p-4 rounded-2xl shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#717973]">
            Total BOA Disbursed
          </span>
          <div className="font-heading font-bold text-2xl text-[#012d1d]">
            {portfolioStats.totalDisbursed}
          </div>
          <div className="text-[11px] text-[#012d1d] font-semibold">Of {portfolioStats.totalFacility} Fund</div>
        </div>

        <div className="bg-white border border-[#c1c8c2]/80 p-4 rounded-2xl shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#717973]">
            On-Time Repayment Rate
          </span>
          <div className="font-heading font-bold text-2xl text-[#16a34a]">
            {portfolioStats.repaymentRate}
          </div>
          <div className="text-[11px] text-[#16a34a] font-bold">Backed by Crop Escrow</div>
        </div>

        <div className="bg-white border border-[#c1c8c2]/80 p-4 rounded-2xl shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#717973]">
            Default Rate
          </span>
          <div className="font-heading font-bold text-2xl text-[#012d1d]">
            {portfolioStats.defaultRate}
          </div>
          <div className="text-[11px] text-[#717973] font-medium">Well below 5% CBN ceiling</div>
        </div>

        <div className="bg-white border border-[#c1c8c2]/80 p-4 rounded-2xl shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#717973]">
            Active Smallholder Borrowers
          </span>
          <div className="font-heading font-bold text-2xl text-[#012d1d]">
            {portfolioStats.activeBorrowers.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#2563eb] font-bold">In 1,840 Registered Coops</div>
        </div>
      </div>

      {/* Sub-Tabs Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-[#c1c8c2]/60">
        {[
          { id: 'portfolio' as const, label: 'Loan Portfolio & Recovery', icon: DollarSign },
          { id: 'single_digit_schemes' as const, label: 'Single-Digit Loan Schemes', icon: Percent },
          { id: 'credit_scoring' as const, label: 'Credit Risk Scoring', icon: PieChart },
          { id: 'asset_financing' as const, label: 'Tractor & Asset Leases', icon: CreditCard },
          { id: 'credit_history' as const, label: 'Farmer Credit Viewer', icon: Eye },
          { id: 'par_alerts' as const, label: 'Portfolio-at-Risk (PAR)', icon: AlertCircle },
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
                  ? 'bg-[#065f46] text-white shadow-xs'
                  : 'bg-white text-[#525a54] hover:bg-[#f0f4f1] border border-[#c1c8c2]/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#a7f3d0]' : 'text-[#065f46]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Loan Portfolio & Recovery */}
      {activeTab === 'portfolio' && (
        <div className="bg-white rounded-2xl border border-[#c1c8c2]/80 p-5 shadow-xs space-y-4">
          <div className="pb-2 border-b border-[#e5e9e6]">
            <h3 className="font-heading font-bold text-sm text-[#012d1d]">
              National Agricultural Loan Portfolio Health (Bank of Agriculture)
            </h3>
            <p className="text-xs text-[#717973]">
              Automated direct-debit sweeps and harvest-linked escrow settlement recovery
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#f8faf8] rounded-2xl border border-[#d8deda] space-y-2">
              <span className="text-xs font-bold text-[#525a54] uppercase">Recovered Capital</span>
              <div className="text-2xl font-bold text-[#16a34a]">{portfolioStats.totalRepaid}</div>
              <p className="text-xs text-[#525a54]">Recovered through marketplace escrow sweeps upon produce sales.</p>
            </div>

            <div className="p-4 bg-[#f8faf8] rounded-2xl border border-[#d8deda] space-y-2">
              <span className="text-xs font-bold text-[#525a54] uppercase">Outstanding Balance</span>
              <div className="text-2xl font-bold text-[#012d1d]">{portfolioStats.outstandingBalance}</div>
              <p className="text-xs text-[#525a54]">Current active credit facilities within scheduled tenors.</p>
            </div>

            <div className="p-4 bg-[#f8faf8] rounded-2xl border border-[#d8deda] space-y-2">
              <span className="text-xs font-bold text-[#525a54] uppercase">Scheduled Recovery Run</span>
              <div className="text-2xl font-bold text-[#2563eb]">Every Friday</div>
              <p className="text-xs text-[#525a54]">Automatic NIBSS mandate processing for matured loan batches.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Single-Digit Loan Schemes */}
      {activeTab === 'single_digit_schemes' && (
        <div className="bg-white rounded-2xl border border-[#c1c8c2]/80 p-5 shadow-xs space-y-4">
          <div className="pb-2 border-b border-[#e5e9e6]">
            <h3 className="font-heading font-bold text-sm text-[#012d1d]">
              Federal Single-Digit Concessionary Schemes Tracker
            </h3>
            <p className="text-xs text-[#717973]">
              Presidential directives enforcing 3%–7.5% capped interest for genuine food producers
            </p>
          </div>

          <div className="divide-y divide-[#e5e9e6]">
            {singleDigitSchemes.map((sch) => (
              <div key={sch.id} className="py-4 space-y-2.5">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-heading font-bold text-xs sm:text-sm text-[#012d1d]">{sch.name}</h4>
                    <p className="text-xs text-[#717973]">Allocation: <strong>{sch.totalAllocation}</strong> • Tenor: {sch.tenor}</p>
                  </div>
                  <span className="px-2.5 py-0.5 bg-[#c1ecd4] text-[#002114] rounded-full text-[10px] font-bold">
                    {sch.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-[#f8faf8] p-3 rounded-xl border border-[#e2e8e4] text-xs">
                  <div>
                    <span className="text-[10px] text-[#717973] block">Disbursed Volume</span>
                    <span className="font-bold text-[#012d1d]">{sch.disbursed}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#717973] block">Repayment Rate</span>
                    <span className="font-bold text-[#16a34a]">{sch.repaymentRate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#717973] block">Active Beneficiaries</span>
                    <span className="font-bold text-[#012d1d]">{sch.beneficiaries.toLocaleString()} farmers</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Credit Risk Scoring */}
      {activeTab === 'credit_scoring' && (
        <div className="bg-white rounded-2xl border border-[#c1c8c2]/80 p-5 shadow-xs space-y-4">
          <div className="pb-2 border-b border-[#e5e9e6]">
            <h3 className="font-heading font-bold text-sm text-[#012d1d]">
              Algorithmic Credit Scoring & Risk Tiers
            </h3>
            <p className="text-xs text-[#717973]">
              Calculated using satellite NDVI vegetative health, historical crop yield, cooperative endorsement & payment velocity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#f0fdf4] rounded-2xl border border-[#bbf7d0] space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-xs text-[#166534]">Tier A (Score 720+)</span>
                <span className="px-2 py-0.2 bg-[#16a34a] text-white rounded-md text-[10px] font-bold">68% of Portfolio</span>
              </div>
              <p className="text-xs text-[#14532d]">
                Instant automatic approval up to ₦3.5M. Backed by cooperative joint liability and verified historical harvest track record.
              </p>
            </div>

            <div className="p-4 bg-[#fefce8] rounded-2xl border border-[#fef08a] space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-xs text-[#854d0e]">Tier B (Score 600–719)</span>
                <span className="px-2 py-0.2 bg-[#ca8a04] text-white rounded-md text-[10px] font-bold">24% of Portfolio</span>
              </div>
              <p className="text-xs text-[#713f12]">
                Supervised lending with field extension officer milestone sign-off (planting, weeding, harvest). Max ₦1.5M.
              </p>
            </div>

            <div className="p-4 bg-[#fff1f2] rounded-2xl border border-[#fecdd3] space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-xs text-[#9f1239]">Tier C (Score &lt; 600)</span>
                <span className="px-2 py-0.2 bg-[#e11d48] text-white rounded-md text-[10px] font-bold">8% of Portfolio</span>
              </div>
              <p className="text-xs text-[#881337]">
                Restricted to input-in-kind voucher grants (seed/fertilizer). No direct cash disbursement until credit history builds.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Tractor & Asset Leases */}
      {activeTab === 'asset_financing' && (
        <div className="bg-white rounded-2xl border border-[#c1c8c2]/80 p-5 shadow-xs space-y-4">
          <div className="pb-2 border-b border-[#e5e9e6]">
            <h3 className="font-heading font-bold text-sm text-[#012d1d]">
              Agricultural Asset Leasing & Mechanisation Collateral
            </h3>
            <p className="text-xs text-[#717973]">
              Tractors, combine harvesters, solar cold rooms, and irrigation pumps with IoT GPS immobilizer security
            </p>
          </div>

          <div className="divide-y divide-[#e5e9e6]">
            {assetLeases.map((lease) => (
              <div key={lease.id} className="py-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#012d1d]">{lease.id}</span>
                    <h4 className="font-heading font-bold text-xs sm:text-sm text-[#012d1d]">{lease.asset}</h4>
                    <p className="text-xs text-[#525a54]">Lessee: <strong>{lease.lessee}</strong> ({lease.state} State) • Capital Cost: <strong>{lease.cost}</strong></p>
                  </div>
                  <span className="px-2.5 py-0.5 bg-[#c1ecd4] text-[#002114] rounded-full text-[10px] font-bold">
                    {lease.repaymentStatus}
                  </span>
                </div>
                <div className="text-xs text-[#16a34a] font-semibold bg-[#f0fdf4] p-2.5 rounded-xl border border-[#bbf7d0]">
                  🛰️ IoT Telematics: {lease.gpsStatus}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Farmer Credit Viewer */}
      {activeTab === 'credit_history' && (
        <div className="bg-white rounded-2xl border border-[#c1c8c2]/80 p-5 shadow-xs space-y-4">
          <div className="pb-2 border-b border-[#e5e9e6]">
            <h3 className="font-heading font-bold text-sm text-[#012d1d]">
              Farmer Credit Dossier & Repayment Behaviour
            </h3>
            <p className="text-xs text-[#717973]">
              Comprehensive underwriting records with mandatory access logging for banking privacy compliance
            </p>
          </div>

          <div className="divide-y divide-[#e5e9e6]">
            {borrowerRecords.map((borr) => (
              <div key={borr.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#012d1d]">{borr.name}</span>
                    <span className="px-2 py-0.2 bg-[#065f46] text-[#a7f3d0] rounded-md text-[10px] font-bold">
                      Credit Score: {borr.creditScore}
                    </span>
                    <span className="text-[10px] font-bold text-[#16a34a]">{borr.riskTier}</span>
                  </div>
                  <div className="text-xs text-[#525a54]">
                    Active: <strong>{borr.activeLoan}</strong> • Paid: <span className="text-[#16a34a] font-bold">{borr.repaidToDate}</span>
                  </div>
                  <div className="text-[11px] text-[#717973]">
                    Collateral: {borr.collateral}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedBorrower(borr)}
                  className="px-3 py-1.5 bg-[#065f46] hover:bg-[#047857] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Credit File</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Portfolio-at-Risk (PAR) */}
      {activeTab === 'par_alerts' && (
        <div className="bg-white rounded-2xl border border-[#c1c8c2]/80 p-5 shadow-xs space-y-4">
          <div className="pb-2 border-b border-[#e5e9e6]">
            <h3 className="font-heading font-bold text-sm text-[#012d1d]">
              Portfolio-at-Risk (PAR) Watchlist & Early Warnings
            </h3>
            <p className="text-xs text-[#717973]">
              Monitors loans past due date and triggers cooperative joint-guarantor remediation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#f8faf8] rounded-2xl border border-[#d8deda] space-y-1.5">
              <span className="text-xs font-bold text-[#b45309]">PAR 30 (1–30 Days Overdue)</span>
              <div className="text-2xl font-bold text-[#b45309]">{portfolioStats.par30}</div>
              <p className="text-[11px] text-[#717973]">SMS payment reminders sent to cooperative leaders.</p>
            </div>

            <div className="p-4 bg-[#fff8f6] rounded-2xl border border-[#ffdad6] space-y-1.5">
              <span className="text-xs font-bold text-[#ba1a1a]">PAR 60 (31–60 Days Overdue)</span>
              <div className="text-2xl font-bold text-[#ba1a1a]">{portfolioStats.par60}</div>
              <p className="text-[11px] text-[#717973]">Extension officer field visit and repayment restructuring.</p>
            </div>

            <div className="p-4 bg-[#fff1f2] rounded-2xl border border-[#fecdd3] space-y-1.5">
              <span className="text-xs font-bold text-[#9f1239]">PAR 90 (Default Warning)</span>
              <div className="text-2xl font-bold text-[#9f1239]">{portfolioStats.par90}</div>
              <p className="text-[11px] text-[#717973]">Automated collateral liquidation of warehouse receipts.</p>
            </div>
          </div>
        </div>
      )}

      {/* Mandatory Reason Logging Modal for Borrower Credit Inspection */}
      {selectedBorrower && (
        <ReasonLoggingModal
          isOpen={true}
          onClose={() => setSelectedBorrower(null)}
          targetUserName={selectedBorrower.name}
          targetUserRole="Borrower / Farmer"
          targetUserId={selectedBorrower.id}
          adminDepartment="Bank of Agriculture Credit Directorate"
          recordType="BOA Credit History, Collateral & Bank Account Details"
          onConfirm={(reason) => {
            setSelectedBorrower(null);
            setActionSuccess(`BOA underwriter authorized decrypted access logged for ${selectedBorrower.name}.`);
            setTimeout(() => setActionSuccess(null), 4000);
          }}
        />
      )}
    </div>
  );
};
export default FinancePartnerAdminDashboard;
