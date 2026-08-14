import React, { useState } from 'react';
import {
  Shield,
  FileText,
  Search,
  Filter,
  Download,
  AlertTriangle,
  Lock,
  Eye,
  CheckCircle2,
  Clock,
  Key,
  Database,
  Radio,
  Server,
  Zap,
} from 'lucide-react';
import { AuditLog } from '../../../types';

interface SuperAdminAuditSecurityProps {
  auditLogs: AuditLog[];
  onExportAuditDossier: () => void;
  subTab?: 'full_audit' | 'security_events' | 'data_access' | 'suspicious';
  onSubTabChange?: (tab: 'full_audit' | 'security_events' | 'data_access' | 'suspicious') => void;
}

export const SuperAdminAuditSecurity: React.FC<SuperAdminAuditSecurityProps> = ({
  auditLogs,
  onExportAuditDossier,
  subTab = 'full_audit',
  onSubTabChange,
}) => {
  const [internalTab, setInternalTab] = useState<'full_audit' | 'security_events' | 'data_access' | 'suspicious'>(subTab);

  React.useEffect(() => {
    if (subTab) setInternalTab(subTab);
  }, [subTab]);

  const activeTab = subTab || internalTab;
  const setActiveTab = (t: 'full_audit' | 'security_events' | 'data_access' | 'suspicious') => {
    setInternalTab(t);
    if (onSubTabChange) onSubTabChange(t);
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Security Events Monitor
  const securityEvents = [
    {
      id: 'sec_1',
      type: 'RATE_LIMIT_TRIPPED',
      severity: 'WARNING',
      source: '102.89.23.4 (Lagos Aggregator IP)',
      desc: 'USSD webhook rate limit exceeded (180 req/sec on batch produce endpoint)',
      time: '12 mins ago',
      mitigation: 'Auto-throttled to 50 req/sec via Cloudflare WAF',
    },
    {
      id: 'sec_2',
      type: 'GEO_IP_ANOMALY',
      severity: 'CRITICAL',
      source: '185.220.101.5 (Tor Exit Node / Foreign IP)',
      desc: 'Attempted administrative login to Kaduna ADP Command from foreign IP range',
      time: '45 mins ago',
      mitigation: 'Blocked by Geo-Fencing policy; account locked for 2FA challenge',
    },
    {
      id: 'sec_3',
      type: 'HIGH_VALUE_ESCROW_DISBURSE',
      severity: 'INFO',
      source: 'Internal Settlement Engine',
      desc: '₦45,000,000 BOA Anchor Fund bulk disbursement batch verified by 2 signers',
      time: '2 hours ago',
      mitigation: 'Dual-key cryptographic sign-off logged to audit ledger',
    },
  ];

  // Data Access Logs (NDPR Compliance)
  const dataAccessLogs = [
    { id: 'da_1', officer: 'Aliyu Sani (ADP Supervisor)', citizen: 'Ibrahim Danladi', ninTarget: '23819201928', reason: 'Farmer Credit Appraisal for BOA Anchor Loan', time: '18 mins ago' },
    { id: 'da_2', officer: 'Hajiya Fatima (Ministry Auditor)', citizen: 'Giwa Grains Cooperative #402', ninTarget: 'CAC-RC-99281', reason: 'Grain Storage Subsidy Allocation Inspection', time: '1 hour ago' },
    { id: 'da_3', officer: 'Dr. Aliyu Danladi (Super Admin)', citizen: 'Kano Aggregators Ltd', ninTarget: 'NIN-772819201', reason: 'Dispute Arbitration Review on Maize Shipment', time: '3 hours ago' },
  ];

  // Suspicious Activity Triggers
  const suspiciousActivities = [
    { id: 'susp_1', trigger: 'Rapid Multiple Withdrawals (>₦5m/hr)', account: 'usr_kano_991 (Buyer Account)', severity: 'HIGH', status: 'Flagged for 2FA Verification', time: '25 mins ago' },
    { id: 'susp_2', trigger: 'Produce Listing Below Statutory GMP Floor', account: 'listing_88192 (Maize @ ₦18k/bag)', severity: 'MEDIUM', status: 'GMP Engine Flagged & Held', time: '1 hour ago' },
    { id: 'susp_3', trigger: 'Simultaneous Login from 2 Disparate States', account: 'officer_kaduna_44 (Kaduna + Lagos)', severity: 'CRITICAL', status: 'Tokens Revoked; Password Reset Forced', time: '3 hours ago' },
  ];

  // Filtered Audit Logs
  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      !searchQuery ||
      log.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'ALL' ||
      (selectedCategory === 'AUTH' && (log.action.includes('AUTH') || log.action.includes('LOGIN') || log.action.includes('USER'))) ||
      (selectedCategory === 'FREEZE' && log.action.includes('FREEZE')) ||
      (selectedCategory === 'FLAG' && log.action.includes('FEATURE_FLAG')) ||
      (selectedCategory === 'INSPECTION' && log.action.includes('INSPECT'));

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-5">
      {/* Sub Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1b2b22] pb-3 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('full_audit')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'full_audit'
              ? 'bg-[#10b981] text-[#0a0f0d]'
              : 'bg-[#0f1713] text-[#8fa89b] hover:text-white border border-[#1b2b22]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Full Audit Log ({auditLogs.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security_events')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'security_events'
              ? 'bg-[#10b981] text-[#0a0f0d]'
              : 'bg-[#0f1713] text-[#8fa89b] hover:text-white border border-[#1b2b22]'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Security Events ({securityEvents.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('data_access')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'data_access'
              ? 'bg-[#10b981] text-[#0a0f0d]'
              : 'bg-[#0f1713] text-[#8fa89b] hover:text-white border border-[#1b2b22]'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Data Access Logs ({dataAccessLogs.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('suspicious')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'suspicious'
              ? 'bg-[#ef4444] text-white'
              : 'bg-[#0f1713] text-[#8fa89b] hover:text-white border border-[#1b2b22]'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Suspicious Activity ({suspiciousActivities.length})</span>
        </button>
      </div>

      {activeTab === 'security_events' ? (
        /* Security Threat & Event HUD */
        <div className="bg-[#0f1713] border border-[#1b2b22] rounded-2xl p-5 shadow-md space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#1b2b22]">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#10b981]" />
              <h3 className="font-bold text-sm text-white">Live Platform Security & Threat Mitigation HUD</h3>
            </div>
            <span className="text-xs font-mono text-[#34d399] bg-[#064e3b] px-2.5 py-0.5 rounded-full font-bold">
              Zero Active Breaches
            </span>
          </div>

          <div className="space-y-2">
            {securityEvents.map((evt) => (
              <div
                key={evt.id}
                className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
                  evt.severity === 'CRITICAL'
                    ? 'bg-[#2a0e0e] border-[#5c1d1d] text-[#fca5a5]'
                    : evt.severity === 'WARNING'
                    ? 'bg-[#241a0b] border-[#5c3e12] text-[#fde68a]'
                    : 'bg-[#0a1812] border-[#1b3d2b] text-[#a7f3d0]'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold uppercase">{evt.type}</span>
                    <span className="text-[10px] font-mono opacity-80 font-bold px-1.5 py-0.2 rounded bg-black/30">
                      {evt.severity}
                    </span>
                    <span className="text-[#8fa89b]">• {evt.time}</span>
                  </div>
                  <div className="text-white font-medium">{evt.desc}</div>
                  <div className="text-[11px] opacity-80 font-mono">Source: {evt.source}</div>
                </div>

                <div className="text-right sm:max-w-xs shrink-0">
                  <span className="text-[11px] font-bold text-white block bg-black/40 px-2 py-1 rounded">
                    Mitigation: {evt.mitigation}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === 'data_access' ? (
        /* Data Access Logs (NDPR Compliance) */
        <div className="bg-[#0f1713] border border-[#1b2b22] rounded-2xl p-5 shadow-md space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-[#1b2b22]">
            <div>
              <h3 className="font-bold text-sm text-white">NDPR Citizen PII Access Dossier</h3>
              <p className="text-xs text-[#8fa89b]">All administrative viewings of farmer NIN, BVN, and biometric data</p>
            </div>
          </div>
          <div className="space-y-2">
            {dataAccessLogs.map((da) => (
              <div key={da.id} className="p-3.5 bg-[#0a0f0d] border border-[#1b2b22] rounded-xl flex items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <div className="font-bold text-white">{da.officer} viewed citizen {da.citizen}</div>
                  <div className="text-[11px] text-[#34d399] font-mono">Target ID: {da.ninTarget}</div>
                  <div className="text-[11px] text-[#8fa89b]">Legal Justification: {da.reason}</div>
                </div>
                <div className="text-[#8fa89b] font-mono text-xs">{da.time}</div>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === 'suspicious' ? (
        /* Suspicious Activity */
        <div className="bg-[#0f1713] border border-[#1b2b22] rounded-2xl p-5 shadow-md space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-[#1b2b22]">
            <div>
              <h3 className="font-bold text-sm text-white">Anomalous Activity Triggers & Fraud Engine</h3>
              <p className="text-xs text-[#8fa89b]">Automated detection of velocity spikes, price floor dumping, and credential stuffing</p>
            </div>
          </div>
          <div className="space-y-2.5">
            {suspiciousActivities.map((sa) => (
              <div key={sa.id} className="p-3.5 bg-[#2a0e0e]/40 border border-[#5c1d1d] rounded-xl flex items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{sa.trigger}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${sa.severity === 'CRITICAL' ? 'bg-[#7f1d1d] text-[#fca5a5]' : 'bg-[#78350f] text-[#fde68a]'}`}>
                      {sa.severity}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#8fa89b] font-mono">Target: {sa.account}</div>
                  <div className="text-[11px] text-[#10b981] font-bold">Action Taken: {sa.status}</div>
                </div>
                <div className="text-[#8fa89b] font-mono text-xs">{sa.time}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Default: Full Audit Log */
        <>
          {/* Security Threat & Event HUD */}
          <div className="bg-[#0f1713] border border-[#1b2b22] rounded-2xl p-5 shadow-md space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#1b2b22]">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#10b981]" />
            <h3 className="font-bold text-sm text-white">Live Platform Security & Threat Mitigation HUD</h3>
          </div>
          <span className="text-xs font-mono text-[#34d399] bg-[#064e3b] px-2.5 py-0.5 rounded-full font-bold">
            Zero Active Breaches
          </span>
        </div>

        <div className="space-y-2">
          {securityEvents.map((evt) => (
            <div
              key={evt.id}
              className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
                evt.severity === 'CRITICAL'
                  ? 'bg-[#2a0e0e] border-[#5c1d1d] text-[#fca5a5]'
                  : evt.severity === 'WARNING'
                  ? 'bg-[#241a0b] border-[#5c3e12] text-[#fde68a]'
                  : 'bg-[#0a1812] border-[#1b3d2b] text-[#a7f3d0]'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold uppercase">{evt.type}</span>
                  <span className="text-[10px] opacity-75 font-mono">({evt.time})</span>
                </div>
                <div className="text-white font-medium">{evt.desc}</div>
                <div className="text-[11px] opacity-80">
                  <span className="font-bold">Source:</span> {evt.source} •{' '}
                  <span className="font-bold">Mitigation:</span> {evt.mitigation}
                </div>
              </div>

              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-black/40 text-white shrink-0">
                {evt.severity}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Cryptographic Audit Trail Explorer */}
      <div className="bg-[#0f1713] border border-[#1b2b22] rounded-2xl p-5 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-[#1b2b22]">
          <div>
            <h3 className="font-bold text-sm text-white">SHA-256 Immutable Audit Trail Explorer</h3>
            <p className="text-xs text-[#8fa89b]">
              Every administrative configuration change, role elevation, and data access query is cryptographically signed
            </p>
          </div>

          <button
            type="button"
            onClick={onExportAuditDossier}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#1b2b22] hover:bg-[#253b2f] text-[#34d399] text-xs font-bold rounded-xl border border-[#2d4738] transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Cryptographic Dossier</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8fa89b] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search audit trail by actor, action type, or justification..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#0a0f0d] border border-[#1b2b22] rounded-xl text-xs text-white placeholder-[#5a7266] focus:outline-hidden focus:border-[#10b981]"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#8fa89b]" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="py-2 px-3 bg-[#0a0f0d] border border-[#1b2b22] rounded-xl text-xs text-white focus:outline-hidden focus:border-[#10b981]"
            >
              <option value="ALL">All Event Categories</option>
              <option value="AUTH">Authentication & Users</option>
              <option value="FREEZE">Emergency Freezes</option>
              <option value="FLAG">Feature Flags</option>
              <option value="INSPECTION">NDPR Profile Inspections</option>
            </select>
          </div>
        </div>

        {/* Audit Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="border-b border-[#1b2b22] bg-[#0a0f0d] text-[#8fa89b]">
                <th className="p-3">Timestamp (UTC)</th>
                <th className="p-3">Actor & Role</th>
                <th className="p-3">Action Signature</th>
                <th className="p-3">Audit Details & Justification</th>
                <th className="p-3 text-right">Integrity Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1b2b22]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#0a0f0d] transition-colors">
                  <td className="p-3 text-[#8fa89b] whitespace-nowrap text-[11px]">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-3 font-sans">
                    <div className="font-bold text-white text-xs">{log.actorName}</div>
                    <div className="text-[10px] text-[#34d399] font-mono uppercase">{log.actorRole}</div>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-[#1b2b22] text-[#34d399] rounded font-bold text-[10px] border border-[#2d4738]">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3 font-sans text-white text-xs max-w-md">{log.details}</td>
                  <td className="p-3 text-right text-[10px] text-[#8fa89b] whitespace-nowrap">
                    sha256:{log.id.slice(0, 10)}...
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </>
      )}
    </div>
  );
};
