import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Download,
  FileText,
  Filter,
  CheckCircle2,
  Calendar,
  Layers,
  Globe,
  PieChart,
  Check,
} from 'lucide-react';

interface SuperAdminAnalyticsReportingProps {
  onGenerateReport: (config: any) => void;
  subTab?: 'global' | 'builder' | 'export';
  onSubTabChange?: (tab: 'global' | 'builder' | 'export') => void;
}

export const SuperAdminAnalyticsReporting: React.FC<SuperAdminAnalyticsReportingProps> = ({
  onGenerateReport,
  subTab = 'global',
  onSubTabChange,
}) => {
  const [internalTab, setInternalTab] = useState<'global' | 'builder' | 'export'>(subTab);

  React.useEffect(() => {
    if (subTab) setInternalTab(subTab);
  }, [subTab]);

  const activeTab = subTab || internalTab;
  const setActiveTab = (t: 'global' | 'builder' | 'export') => {
    setInternalTab(t);
    if (onSubTabChange) onSubTabChange(t);
  };

  const [reportType, setReportType] = useState('TRADE_VELOCITY');
  const [selectedState, setSelectedState] = useState('ALL');
  const [dateRange, setDateRange] = useState('30D');
  const [exportFormat, setExportFormat] = useState('PDF');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSuccess, setGeneratedSuccess] = useState<string | null>(null);

  const commodityVolumeData = [
    { name: 'White Maize (Grain)', volume: '48,200 MT', gmv: '₦2,024,400,000', priceAvg: '₦42,000 / 100kg bag', growth: '+18.4%' },
    { name: 'Paddy Rice (Farouk 44)', volume: '39,400 MT', gmv: '₦2,955,000,000', priceAvg: '₦75,000 / 100kg bag', growth: '+22.1%' },
    { name: 'Cassava Tubers & Starch', volume: '62,100 MT', gmv: '₦1,117,800,000', priceAvg: '₦18,000 / ton', growth: '+8.5%' },
    { name: 'Soybeans (TGX-1448)', volume: '24,600 MT', gmv: '₦1,968,000,000', priceAvg: '₦80,000 / 100kg bag', growth: '+31.2%' },
    { name: 'Yam Tubers (Gboko Grade A)', volume: '18,900 MT', gmv: '₦1,323,000,000', priceAvg: '₦70,000 / 100 tubers', growth: '+12.7%' },
    { name: 'NPK 20-10-10 Fertilizer (Subsidized)', volume: '31,500 MT', gmv: '₦1,102,500,000', priceAvg: '₦35,000 / 50kg bag', growth: '+45.0%' },
  ];

  const recentExportDossiers = [
    { id: 'exp_1', title: 'Q3 National Food Balance Sheet (FMAFS Submission)', format: 'PDF (Signed)', size: '4.2 MB', generatedBy: 'Super Admin', time: 'Yesterday, 16:40' },
    { id: 'exp_2', title: 'Inter-State Fertilizer Subsidy Redemption Ledger (Full CSV)', format: 'CSV', size: '18.9 MB', generatedBy: 'Super Admin', time: '12 Aug 2026' },
    { id: 'exp_3', title: 'Bank of Agriculture Anchor Borrower Repayment Audit', format: 'XLSX', size: '6.7 MB', generatedBy: 'BOA Finance Desk', time: '09 Aug 2026' },
    { id: 'exp_4', title: 'Northern Agro-Corridor Post-Harvest Loss Mitigation Metrics', format: 'PDF (Signed)', size: '3.1 MB', generatedBy: 'Super Admin', time: '04 Aug 2026' },
  ];

  const handleRunReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedSuccess(
        `Generated: National ${reportType} Report (${dateRange}, ${exportFormat}) - Watermarked & Signed.`
      );
      onGenerateReport({ reportType, selectedState, dateRange, exportFormat });
      setTimeout(() => setGeneratedSuccess(null), 5000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Sub Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1b2b22] pb-3 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('global')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'global'
              ? 'bg-[#10b981] text-[#0a0f0d]'
              : 'bg-[#0f1713] text-[#8fa89b] hover:text-white border border-[#1b2b22]'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Global Analytics</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('builder')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'builder'
              ? 'bg-[#10b981] text-[#0a0f0d]'
              : 'bg-[#0f1713] text-[#8fa89b] hover:text-white border border-[#1b2b22]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Custom Report Builder</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('export')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'export'
              ? 'bg-[#10b981] text-[#0a0f0d]'
              : 'bg-[#0f1713] text-[#8fa89b] hover:text-white border border-[#1b2b22]'
          }`}
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Centre</span>
        </button>
      </div>

      {/* Top Commodity GMV Breakdown */}
      {(activeTab === 'global' || activeTab === 'builder') && (
      <div className="bg-[#0f1713] border border-[#1b2b22] rounded-2xl p-5 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-[#1b2b22]">
          <div>
            <h3 className="font-bold text-sm text-white">National Value Chain Throughput & Trade Velocity</h3>
            <p className="text-xs text-[#8fa89b]">
              Aggregated physical tonnage, GMV liquidity, and market clearing prices
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-[#10b981] bg-[#064e3b] px-3 py-1 rounded-xl">
            ₦14.82 Billion Total GMV
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {commodityVolumeData.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-[#0a0f0d] rounded-xl border border-[#1b2b22] space-y-2 hover:border-[#10b981]/40 transition-colors"
            >
              <div className="flex justify-between items-start">
                <span className="font-bold text-xs text-white">{item.name}</span>
                <span className="text-[10px] font-mono font-bold text-[#10b981] bg-[#064e3b] px-1.5 py-0.5 rounded">
                  {item.growth}
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-[#8fa89b]">
                  <span>Physical Volume:</span>
                  <span className="font-mono text-white font-bold">{item.volume}</span>
                </div>
                <div className="flex justify-between text-[#8fa89b]">
                  <span>Total Value (GMV):</span>
                  <span className="font-mono text-[#34d399] font-bold">{item.gmv}</span>
                </div>
                <div className="flex justify-between text-[#8fa89b] text-[11px] pt-1 border-t border-[#1b2b22]">
                  <span>Weighted Avg:</span>
                  <span className="font-mono text-[#c1d3c9]">{item.priceAvg}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Custom Report Builder */}
      {(activeTab === 'builder' || activeTab === 'global') && (
      <div className="bg-[#0f1713] border border-[#1b2b22] rounded-2xl p-5 shadow-md space-y-4">
        <div className="pb-3 border-b border-[#1b2b22]">
          <h3 className="font-bold text-sm text-white">Custom Analytical Report Builder & Policy Dossier Generator</h3>
          <p className="text-xs text-[#8fa89b]">
            Produce official watermarked analytical reports for Federal Executive Council (FEC), BOA, or State ADP review
          </p>
        </div>

        {generatedSuccess && (
          <div className="p-3 bg-[#064e3b] text-[#6ee7b7] border border-[#10b981]/40 rounded-xl text-xs flex items-center gap-2 font-bold animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            <span>{generatedSuccess}</span>
          </div>
        )}

        <form onSubmit={handleRunReport} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="space-y-1">
            <label className="block text-[#8fa89b] font-semibold">Report Dataset Focus</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full p-2.5 bg-[#0a0f0d] border border-[#1b2b22] rounded-xl text-white focus:outline-hidden focus:border-[#10b981]"
            >
              <option value="TRADE_VELOCITY">Inter-State Trade Velocity & Hectares</option>
              <option value="BOA_CREDIT_RECOVERY">BOA 5% Loan Underwriting & Repayment</option>
              <option value="POST_HARVEST_LOSS">Cold-Chain & Post-Harvest Loss Index</option>
              <option value="FERTILIZER_SUBSIDY">e-Voucher Redemption & Agro-Dealer Quotas</option>
              <option value="FULL_AUDIT_TRAIL">Cryptographic Audit & Security Dossier</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[#8fa89b] font-semibold">State Jurisdiction Filter</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full p-2.5 bg-[#0a0f0d] border border-[#1b2b22] rounded-xl text-white focus:outline-hidden focus:border-[#10b981]"
            >
              <option value="ALL">Nationwide (All 36 States + FCT)</option>
              <option value="KADUNA">Kaduna Grain Corridor</option>
              <option value="KANO">Kano Commercial Hub</option>
              <option value="BENUE">Benue Food Basket Belt</option>
              <option value="NIGER">Niger Rice Basins</option>
              <option value="OYO">Oyo South-West Agro Belt</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[#8fa89b] font-semibold">Time Horizon</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full p-2.5 bg-[#0a0f0d] border border-[#1b2b22] rounded-xl text-white focus:outline-hidden focus:border-[#10b981]"
            >
              <option value="7D">Last 7 Days</option>
              <option value="30D">Last 30 Days (Standard)</option>
              <option value="90D">Q2 2026 Planting Season</option>
              <option value="YTD">Year-to-Date (YTD)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[#8fa89b] font-semibold">Export Format</label>
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="w-full p-2.5 bg-[#0a0f0d] border border-[#1b2b22] rounded-xl text-white focus:outline-hidden focus:border-[#10b981]"
            >
              <option value="PDF">Watermarked PDF (Official Cabinet Brief)</option>
              <option value="EXCEL">Structured Excel (.xlsx with Pivot Sheets)</option>
              <option value="JSON">Raw JSON Cryptographic Export</option>
            </select>
          </div>

          <div className="sm:col-span-2 lg:col-span-4 pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isGenerating}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#10b981] hover:bg-[#059669] text-[#0a0f0d] text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isGenerating ? 'Compiling Datasets...' : 'Compile & Export Report'}</span>
            </button>
          </div>
        </form>
      </div>
      )}

      {/* Export Centre */}
      {(activeTab === 'export') && (
        <div className="bg-[#0f1713] border border-[#1b2b22] rounded-2xl p-5 shadow-md space-y-4">
          <div className="pb-3 border-b border-[#1b2b22] flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm text-white">Central Export Centre & Archives</h3>
              <p className="text-xs text-[#8fa89b]">Download previously generated cabinet briefings, regulatory spreadsheets, and data feeds</p>
            </div>
          </div>

          <div className="divide-y divide-[#1b2b22]">
            {recentExportDossiers.map((exp) => (
              <div key={exp.id} className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{exp.title}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#064e3b] text-[#6ee7b7] border border-[#10b981]/30">
                      {exp.format}
                    </span>
                  </div>
                  <div className="text-[#8fa89b] text-[11px] font-mono flex items-center gap-2">
                    <span>Generated by {exp.generatedBy}</span>
                    <span>•</span>
                    <span>{exp.time}</span>
                    <span>•</span>
                    <span>Size: {exp.size}</span>
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => alert(`Downloading archived dossier: ${exp.title}`)}
                    className="px-3.5 py-1.5 bg-[#1b2b22] hover:bg-[#253b2f] text-[#34d399] font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors border border-[#2d4738]"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Dossier</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
