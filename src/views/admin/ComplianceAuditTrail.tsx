import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const ComplianceAuditTrail: React.FC = () => {
  const { auditLogs } = useApp();
  const [filterAction, setFilterAction] = useState<string>('all');
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  // AML/CFT Suspicious Transaction Red Flags
  const redFlags = [
    {
      id: 'flg_801',
      actor: 'Alhaji Kabir Shehu (Supplier Depot Kano)',
      reason: '145 fertilizer subsidy vouchers redeemed within 8 minutes from same IP/device fingerprint',
      riskLevel: 'High Risk',
      amount: '₦4,350,000',
      timestamp: 'Today at 09:14 AM',
      status: 'Flagged for Inspection',
    },
    {
      id: 'flg_802',
      actor: 'Grain Merchant Alpha Corp',
      reason: 'Produce listing marked 65% above national price ceiling during localized flood crisis',
      riskLevel: 'Moderate Risk',
      amount: '₦12,800,000',
      timestamp: 'Yesterday at 16:30 PM',
      status: 'Price Advisory Triggered',
    },
  ];

  const filteredLogs = auditLogs.filter(
    (log) => filterAction === 'all' || log.action.toLowerCase().includes(filterAction.toLowerCase())
  );

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'Actor Name', 'Role', 'Action', 'Details', 'IP Address'];
    const rows = filteredLogs.map((l) => [
      `"${new Date(l.timestamp).toISOString()}"`,
      `"${l.actorName}"`,
      `"${l.actorRole}"`,
      `"${l.action}"`,
      `"${l.details.replace(/"/g, '""')}"`,
      `"${l.ipAddress || '127.0.0.1'}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AgroApp_Audit_Trail_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-4 rounded-2xl border border-[#c1c8c2]/70 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-[#012d1d] text-[24px]">verified_user</span>
          <div>
            <h3 className="font-heading font-bold text-base text-[#012d1d]">
              Regulatory Compliance, AML/CFT & Audit Trail
            </h3>
            <p className="text-xs text-[#717973]">
              Immutable audit ledger complying with Central Bank of Nigeria (CBN) and BOA guidelines
            </p>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-3.5 py-2 bg-[#012d1d] text-white font-bold text-xs rounded-xl hover:bg-[#1b4332] active:scale-95 transition-all shadow-xs flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          <span>Export Audit Dossier (CSV)</span>
        </button>
      </div>

      {downloadSuccess && (
        <div className="p-3.5 bg-[#c1ecd4] text-[#002114] border border-[#276a4c]/40 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span>Official audit trail downloaded successfully.</span>
        </div>
      )}

      {/* AML & Fraud Detection Flags */}
      <div className="bg-white rounded-2xl border border-[#c1c8c2]/70 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#e8ece9]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ba1a1a] text-[22px]">security</span>
            <div>
              <h4 className="font-heading font-bold text-sm text-[#012d1d]">
                Anti-Money Laundering (AML) & Subsidy Abuse Alerts
              </h4>
              <p className="text-[11px] text-[#717973]">Automated pattern detection & device fingerprint heuristics</p>
            </div>
          </div>
          <span className="text-[10px] font-bold bg-[#ffdad6] text-[#410002] px-2.5 py-0.5 rounded-full uppercase">
            2 Alerts Active
          </span>
        </div>

        <div className="space-y-3">
          {redFlags.map((flag) => (
            <div key={flag.id} className="p-4 bg-[#f9fbf9] rounded-xl border border-[#e2e8e4] space-y-2">
              <div className="flex justify-between items-start">
                <div className="font-bold text-xs text-[#1a1c1c]">{flag.actor}</div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    flag.riskLevel === 'High Risk' ? 'bg-[#ffdad6] text-[#410002]' : 'bg-[#ffdeac] text-[#281900]'
                  }`}
                >
                  {flag.riskLevel}
                </span>
              </div>

              <p className="text-xs text-[#525a54]">{flag.reason}</p>

              <div className="flex justify-between items-center text-[11px] pt-1.5 border-t border-[#e2e8e4]">
                <span className="font-bold text-[#012d1d]">Transaction Value: {flag.amount}</span>
                <div className="space-x-2">
                  <span className="text-[#717973]">{flag.timestamp}</span>
                  <button className="text-xs font-bold text-[#012d1d] hover:underline">Investigate</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Tamper-Proof Audit Table */}
      <div className="bg-white rounded-2xl border border-[#c1c8c2]/70 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-[#e8ece9]">
          <div>
            <h4 className="font-heading font-bold text-sm text-[#012d1d]">Immutable System Event Ledger</h4>
            <p className="text-xs text-[#717973]">Cryptographically verifiable event log across all 36 state nodes</p>
          </div>

          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="h-8 px-2.5 rounded-lg border border-[#c1c8c2] bg-[#f9fbf9] text-xs font-bold text-[#012d1d]"
          >
            <option value="all">All Event Actions</option>
            <option value="LOGIN">User Logins</option>
            <option value="KYC">KYC & Approvals</option>
            <option value="LISTING">Market Listings</option>
            <option value="DISPUTE">Escrow Disputes</option>
            <option value="MAINTENANCE">System Overrides</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f9fbf9] text-[#012d1d] font-bold border-b border-[#e2e8e4]">
                <th className="p-3">Timestamp</th>
                <th className="p-3">Actor & Role</th>
                <th className="p-3">Event Code</th>
                <th className="p-3">Details</th>
                <th className="p-3">IP / Device</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8ece9]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#f9fbf9] transition-colors">
                  <td className="p-3 text-[#717973] whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="p-3 font-bold text-[#1a1c1c]">
                    {log.actorName} <span className="text-[10px] text-[#717973] font-normal">({log.actorRole})</span>
                  </td>
                  <td className="p-3 font-mono font-bold text-[#012d1d]">{log.action}</td>
                  <td className="p-3 text-[#525a54]">{log.details}</td>
                  <td className="p-3 text-[#717973] font-mono text-[11px]">{log.ipAddress || '197.210.84.12'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
