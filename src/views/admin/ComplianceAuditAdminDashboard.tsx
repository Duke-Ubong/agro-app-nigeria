import React, { useState } from 'react';
import {
  ShieldAlert,
  Lock,
  FileText,
  AlertOctagon,
  CheckCircle2,
  Download,
  Search,
  Filter,
  Eye,
  Activity,
  UserCheck,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { AdminGlobalFilterBar, GlobalFilterState } from '../../components/admin/AdminGlobalFilterBar';
import { ReasonLoggingModal } from '../../components/admin/ReasonLoggingModal';

export const ComplianceAuditAdminDashboard: React.FC = () => {
  const { auditLogs, usersList, addAuditLog } = useApp();
  const { user } = useAuth();

  const [filters, setFilters] = useState<GlobalFilterState>({
    dateRange: 'last_30_days',
    state: 'All States',
    lga: 'All LGAs',
    valueChain: 'All Value Chains',
    commodity: 'All Commodities',
  });

  const [activeTab, setActiveTab] = useState<
    'ndpr_audit' | 'data_access_logs' | 'fraud_anomalies' | 'regulatory_checklist' | 'export_audit'
  >('ndpr_audit');

  const [searchLogQuery, setSearchLogQuery] = useState('');
  const [selectedAuditEntry, setSelectedAuditEntry] = useState<any | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // 1. NDPR Data Privacy Metrics
  const ndprStats = {
    consentRate: '99.4%',
    optInFarmers: '382,400',
    dataSubjectAccessRequests: 14,
    rectificationRequests: 28,
    erasureRequests: 3,
    complianceScore: '98.5 / 100 (NDPC Compliant)',
  };

  // 2. Anomaly & Fraud Detection Engine Data
  const [fraudAlerts, setFraudAlerts] = useState([
    {
      id: 'ANOM-901',
      type: 'Rapid Multi-Voucher Redemption',
      location: 'Kura LGA, Kano State',
      severity: 'High',
      description: '45 subsidized fertilizer vouchers redeemed from the same merchant terminal in under 8 minutes.',
      status: 'Flagged for Investigation',
      timestamp: '2 hours ago',
    },
    {
      id: 'ANOM-902',
      type: 'NIN / BVN Identity Discrepancy',
      location: 'Zaria LGA, Kaduna State',
      severity: 'Medium',
      description: 'Bank account name registered as "Crown Agro Ltd" does not match NIN individual name "Usman Bello".',
      status: 'Escrow Frozen',
      timestamp: '4 hours ago',
    },
    {
      id: 'ANOM-903',
      type: 'Unusual Geo-IP Distance in Wallet Access',
      location: 'Ikeja, Lagos vs Makurdi, Benue',
      severity: 'Low',
      description: 'Farmer wallet accessed from Lagos IP address 15 minutes after session opened in Makurdi.',
      status: '2FA Challenged',
      timestamp: '1 day ago',
    },
  ]);

  // 3. Regulatory Compliance Checklist
  const regulatoryStandards = [
    { name: 'Nigeria Data Protection Act (NDPA 2023 / NDPR)', regulator: 'NDPC', status: 'Compliant', lastAudit: '2026-06-15', score: '98.5%' },
    { name: 'NATIP 2022–2027 Policy Alignment', regulator: 'FMAFS', status: 'Compliant', lastAudit: '2026-07-01', score: '100%' },
    { name: 'CBN Tier-1/2/3 KYC & Anti-Money Laundering (AML)', regulator: 'Central Bank of Nigeria', status: 'Compliant', lastAudit: '2026-05-20', score: '97.0%' },
    { name: 'FCCPC Consumer Protection Fair Market Standards', regulator: 'FCCPC', status: 'Compliant', lastAudit: '2026-06-10', score: '99.0%' },
    { name: 'NITDA Cloud Computing & Data Sovereignty Guidelines', regulator: 'NITDA', status: 'Compliant', lastAudit: '2026-07-12', score: '100%' },
  ];

  const handleResolveAlert = (alertId: string) => {
    setFraudAlerts((prev) => prev.filter((a) => a.id !== alertId));
    addAuditLog(
      user.name,
      user.role,
      'RESOLVE_FRAUD_ALERT',
      `Resolved compliance anomaly alert ${alertId} following security audit.`
    );
    setActionSuccess(`Alert ${alertId} resolved and logged.`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  return (
    <div className="space-y-6 font-body">
      {/* Global Filter Bar */}
      <AdminGlobalFilterBar
        filters={filters}
        onFilterChange={setFilters}
        roleTitle="Compliance / Audit Admin (Regulatory & NDPR Oversight)"
        departmentTag="National Data Protection & Regulatory Directorate"
        watermarkText="STATUTORY AUDIT FILE • IMMUTABLE NDPR RECORD"
      />

      {/* Top Banner */}
      <div className="bg-[#4a044e] text-white p-5 rounded-2xl border border-[#701a75] shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-[#f43f5e] text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
              NDPC & Regulatory Compliance
            </span>
            <span className="text-xs text-[#f5d0fe]">Immutable Audit Trail & Data Privacy</span>
          </div>
          <h2 className="font-heading font-bold text-xl text-white">
            Statutory Compliance, NDPR Data Privacy & Fraud Audit Suite
          </h2>
          <p className="text-xs text-[#f5d0fe]">
            Continuous Access Reason Auditing, AML Pattern Detection & Regulatory Sanctions Watch
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#2e1065] p-1.5 rounded-xl border border-[#c084fc]/40">
          <span className="text-[11px] font-bold text-[#f5d0fe] px-2">NDPR Audit Status:</span>
          <span className="px-2.5 py-1 bg-[#c084fc] text-[#2e1065] rounded-lg text-xs font-bold">
            98.5% NDPC Certified
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

      {/* Key Compliance Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="bg-white border border-[#c1c8c2]/80 p-4 rounded-2xl shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#717973]">
            NDPR Consent Capture
          </span>
          <div className="font-heading font-bold text-2xl text-[#012d1d]">
            {ndprStats.consentRate}
          </div>
          <div className="text-[11px] text-[#16a34a] font-bold">382,400 Verified Smallholders</div>
        </div>

        <div className="bg-white border border-[#c1c8c2]/80 p-4 rounded-2xl shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#717973]">
            Logged Admin Data Access
          </span>
          <div className="font-heading font-bold text-2xl text-[#012d1d]">
            {auditLogs.length} Events
          </div>
          <div className="text-[11px] text-[#012d1d] font-semibold">100% Reason Documented</div>
        </div>

        <div className="bg-white border border-[#c1c8c2]/80 p-4 rounded-2xl shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#717973]">
            Active Anomaly Alerts
          </span>
          <div className="font-heading font-bold text-2xl text-[#ba1a1a]">
            {fraudAlerts.length} Flagged
          </div>
          <div className="text-[11px] text-[#ba1a1a] font-semibold">AML & Voucher Red Flags</div>
        </div>

        <div className="bg-white border border-[#c1c8c2]/80 p-4 rounded-2xl shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#717973]">
            Statutory Frameworks
          </span>
          <div className="font-heading font-bold text-2xl text-[#012d1d]">
            5 / 5 Compliant
          </div>
          <div className="text-[11px] text-[#16a34a] font-bold">NDPC • CBN • NITDA • FMAFS</div>
        </div>
      </div>

      {/* Sub-Tabs Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-[#c1c8c2]/60">
        {[
          { id: 'ndpr_audit' as const, label: 'NDPR Data Privacy Overview', icon: Lock },
          { id: 'data_access_logs' as const, label: 'Data Access Audit Trail', icon: Activity },
          { id: 'fraud_anomalies' as const, label: 'Fraud & Anomaly Alerts', icon: AlertOctagon },
          { id: 'regulatory_checklist' as const, label: 'Regulatory Frameworks', icon: ShieldAlert },
          { id: 'export_audit' as const, label: 'Statutory Reports Export', icon: FileText },
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
                  ? 'bg-[#4a044e] text-white shadow-xs'
                  : 'bg-white text-[#525a54] hover:bg-[#f0f4f1] border border-[#c1c8c2]/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#f5d0fe]' : 'text-[#4a044e]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: NDPR Data Privacy Overview */}
      {activeTab === 'ndpr_audit' && (
        <div className="bg-white rounded-2xl border border-[#c1c8c2]/80 p-5 shadow-xs space-y-4">
          <div className="pb-2 border-b border-[#e5e9e6]">
            <h3 className="font-heading font-bold text-sm text-[#012d1d]">
              Nigeria Data Protection Commission (NDPC) Compliance Health
            </h3>
            <p className="text-xs text-[#717973]">
              Enforcing smallholder consent, privacy disclosures, and data minimization across all 36 states
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#f8faf8] rounded-2xl border border-[#d8deda] space-y-2">
              <span className="text-xs font-bold text-[#525a54] uppercase">Subject Access Requests</span>
              <div className="text-2xl font-bold text-[#012d1d]">{ndprStats.dataSubjectAccessRequests}</div>
              <p className="text-xs text-[#525a54]">All 14 citizen data export requests fulfilled within 7 days.</p>
            </div>

            <div className="p-4 bg-[#f8faf8] rounded-2xl border border-[#d8deda] space-y-2">
              <span className="text-xs font-bold text-[#525a54] uppercase">Rectification Requests</span>
              <div className="text-2xl font-bold text-[#012d1d]">{ndprStats.rectificationRequests}</div>
              <p className="text-xs text-[#525a54]">NIN / Phone number updates successfully processed.</p>
            </div>

            <div className="p-4 bg-[#f8faf8] rounded-2xl border border-[#d8deda] space-y-2">
              <span className="text-xs font-bold text-[#525a54] uppercase">Data Sovereignty</span>
              <div className="text-2xl font-bold text-[#16a34a]">100% In-Country</div>
              <p className="text-xs text-[#525a54]">All biometric & financial records hosted on Nigerian sovereign cloud nodes.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Data Access Logs */}
      {activeTab === 'data_access_logs' && (
        <div className="bg-white rounded-2xl border border-[#c1c8c2]/80 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-[#e5e9e6]">
            <div>
              <h3 className="font-heading font-bold text-sm text-[#012d1d]">
                End-User Data Access Audit Trail (NDPR Section 39)
              </h3>
              <p className="text-xs text-[#717973]">
                Every single query to individual citizen data is permanently logged with the admin operator name, timestamp, and justification
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-[#f0f4f1] text-[#012d1d] rounded-md border border-[#d8deda]">
              {auditLogs.length} Total Logs
            </span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-[#717973]" />
            <input
              type="text"
              placeholder="Search audit trail by admin, action, or justification keyword..."
              value={searchLogQuery}
              onChange={(e) => setSearchLogQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#717973] rounded-xl text-[#012d1d]"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#e5e9e6] bg-[#f8faf8] text-[#525a54] font-bold">
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Admin Operator</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Action Type</th>
                  <th className="p-3">Mandatory Justification / Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e9e6]">
                {auditLogs
                  .filter(
                    (log) =>
                      !searchLogQuery ||
                      log.actorName.toLowerCase().includes(searchLogQuery.toLowerCase()) ||
                      log.action.toLowerCase().includes(searchLogQuery.toLowerCase()) ||
                      log.details.toLowerCase().includes(searchLogQuery.toLowerCase())
                  )
                  .map((log) => (
                    <tr key={log.id} className="hover:bg-[#f8faf8] transition-colors">
                      <td className="p-3 text-[#717973] whitespace-nowrap font-mono text-[11px]">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="p-3 font-bold text-[#012d1d]">{log.actorName}</td>
                      <td className="p-3 text-[#525a54] uppercase text-[10px] font-bold">
                        {log.actorRole}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-[#f0f4f1] text-[#012d1d] rounded-md font-mono text-[10px] font-bold border border-[#d8deda]">
                          {log.action}
                        </span>
                      </td>
                      <td className="p-3 text-[#012d1d] max-w-xs truncate">{log.details}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Fraud & Anomaly Alerts */}
      {activeTab === 'fraud_anomalies' && (
        <div className="bg-white rounded-2xl border border-[#c1c8c2]/80 p-5 shadow-xs space-y-4">
          <div className="pb-2 border-b border-[#e5e9e6]">
            <h3 className="font-heading font-bold text-sm text-[#012d1d]">
              Automated Fraud & Anomaly Detection Signals
            </h3>
            <p className="text-xs text-[#717973]">
              Real-time heuristic rules triggering anti-fraud and anti-money laundering investigations
            </p>
          </div>

          <div className="divide-y divide-[#e5e9e6]">
            {fraudAlerts.map((alert) => (
              <div key={alert.id} className="py-4 space-y-2.5">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#012d1d]">{alert.id}</span>
                      <span
                        className={`px-2 py-0.2 rounded-md text-[10px] font-bold ${
                          alert.severity === 'High'
                            ? 'bg-[#ffdad6] text-[#ba1a1a]'
                            : alert.severity === 'Medium'
                            ? 'bg-[#fef3c7] text-[#b45309]'
                            : 'bg-[#f0f4f1] text-[#525a54]'
                        }`}
                      >
                        {alert.severity} Risk
                      </span>
                    </div>
                    <h4 className="font-heading font-bold text-xs sm:text-sm text-[#012d1d] mt-1">{alert.type}</h4>
                    <p className="text-xs text-[#717973]">Location: {alert.location} • Detected: {alert.timestamp}</p>
                  </div>
                  <span className="px-2.5 py-0.5 bg-[#fef3c7] text-[#b45309] rounded-full text-[10px] font-bold">
                    {alert.status}
                  </span>
                </div>

                <p className="text-xs text-[#012d1d] bg-[#f8faf8] p-3 rounded-xl border border-[#e2e8e4]">
                  {alert.description}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleResolveAlert(alert.id)}
                    className="px-3 py-1.5 bg-[#4a044e] hover:bg-[#701a75] text-white text-xs font-bold rounded-xl"
                  >
                    Clear & Log Investigation
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Regulatory Frameworks */}
      {activeTab === 'regulatory_checklist' && (
        <div className="bg-white rounded-2xl border border-[#c1c8c2]/80 p-5 shadow-xs space-y-4">
          <div className="pb-2 border-b border-[#e5e9e6]">
            <h3 className="font-heading font-bold text-sm text-[#012d1d]">
              National Regulatory & Statutory Standard Compliance Scorecard
            </h3>
            <p className="text-xs text-[#717973]">
              Quarterly audit assessments verified with federal regulatory agencies
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#e5e9e6] bg-[#f8faf8] text-[#525a54] font-bold">
                  <th className="p-3">Statutory Framework</th>
                  <th className="p-3">Oversight Agency</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Last External Audit</th>
                  <th className="p-3">Compliance Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e9e6]">
                {regulatoryStandards.map((std, idx) => (
                  <tr key={idx} className="hover:bg-[#f8faf8] transition-colors">
                    <td className="p-3 font-bold text-[#012d1d]">{std.name}</td>
                    <td className="p-3 text-[#525a54] font-semibold">{std.regulator}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-[#c1ecd4] text-[#002114] rounded-full text-[10px] font-bold">
                        {std.status}
                      </span>
                    </td>
                    <td className="p-3 text-[#717973]">{std.lastAudit}</td>
                    <td className="p-3 font-bold text-[#16a34a]">{std.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Statutory Reports Export */}
      {activeTab === 'export_audit' && (
        <div className="bg-white rounded-2xl border border-[#c1c8c2]/80 p-5 shadow-xs space-y-4">
          <div className="pb-2 border-b border-[#e5e9e6]">
            <h3 className="font-heading font-bold text-sm text-[#012d1d]">
              Statutory Audit Dossiers for Regulatory Submission
            </h3>
            <p className="text-xs text-[#717973]">
              Download digitally signed audit packages prepared for NDPC, CBN, and NITDA examiners
            </p>
          </div>

          <div className="space-y-3">
            {[
              { title: 'Annual NDPC Data Protection Compliance Organization (DPCO) Audit Report 2026', ref: 'NDPC/AGRO/DPCO-2026-Q2', date: 'Jul 2026' },
              { title: 'Central Bank of Nigeria (CBN) AML / CFT Agricultural Sandbox Compliance Filing', ref: 'CBN/FSD/AGRO-AML/08', date: 'Jun 2026' },
              { title: 'USUCO Agro-Connect End-to-End System Audit Trail (NDPR Section 41)', ref: 'USUCO/AUD/2026-SYS', date: 'Aug 2026' },
            ].map((rep, idx) => (
              <div key={idx} className="p-4 bg-[#f8faf8] rounded-2xl border border-[#d8deda] flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="font-heading font-bold text-xs text-[#012d1d]">{rep.title}</div>
                  <div className="text-[11px] text-[#717973]">
                    Ref: <strong>{rep.ref}</strong> • Filing Date: {rep.date}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActionSuccess(`Exported watermarked statutory compliance dossier (${rep.ref}).`);
                    setTimeout(() => setActionSuccess(null), 4000);
                  }}
                  className="px-3 py-1.5 bg-[#4a044e] hover:bg-[#701a75] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
                >
                  <Download className="w-3.5 h-3.5 text-[#f5d0fe]" />
                  <span>Download Report</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default ComplianceAuditAdminDashboard;
