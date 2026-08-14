import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { getNigerianAvatar } from '../../utils/avatarUtils';

export const OperationsSupportDisputes: React.FC = () => {
  const { usersList, updateUserStatus, addAuditLog } = useApp();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'kyc' | 'disputes' | 'freight'>('kyc');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Pending KYC queue
  const pendingKYC = usersList.filter((u) => u.verificationStatus === 'pending' || u.verificationStatus === 'unverified');

  // Active Escrow & Trade Disputes
  const [disputes, setDisputes] = useState([
    {
      id: 'dsp_101',
      orderId: 'ord_9482',
      commodity: 'White Maize (500 Bags)',
      disputeReason: 'Moisture content measured at 16.5% on arrival (Contract agreed <13.0%)',
      buyer: 'Premium Agro Processors (Ikeja, Lagos)',
      seller: 'Abebe Usman (Zaria, Kaduna)',
      escrowAmount: 2400000,
      status: 'Under Review',
      openedDate: '2025-05-12',
    },
    {
      id: 'dsp_102',
      orderId: 'ord_8831',
      commodity: 'Clean Sesame Seeds (200 Bags)',
      disputeReason: 'Transporter delayed delivery by 48 hours; partial bag leakage during transit',
      buyer: 'Kano Export Hub Ltd',
      seller: 'Gombe Farmers Cooperative',
      escrowAmount: 1850000,
      status: 'Mediation Offered',
      openedDate: '2025-05-14',
    },
  ]);

  // Freight & Transport Road Incident Feed
  const [freightIncidents, setFreightIncidents] = useState([
    {
      id: 'inc_501',
      truckPlate: 'KAD-882-X',
      carrier: 'Ibrahim Logistics Ltd',
      route: 'Kaduna → Lagos (Lokoja Corridor)',
      incident: 'Minor engine breakdown near Okene bypass. Replacement truck dispatched.',
      severity: 'Medium',
      cargo: '30 MT Soybeans',
      timestamp: '2 hours ago',
    },
    {
      id: 'inc_502',
      truckPlate: 'BNU-441-Y',
      carrier: 'Benue Trans-Freight',
      route: 'Makurdi → Port Harcourt',
      incident: 'Heavy rainfall roadblock; rerouted via Enugu expressway with 3h delay.',
      severity: 'Low',
      cargo: '25 MT Yam Tubers',
      timestamp: '5 hours ago',
    },
  ]);

  const handleApproveKYC = (targetUser: any) => {
    updateUserStatus(targetUser.id, { verificationStatus: 'verified' });
    addAuditLog(user.name, user.role, 'APPROVE_KYC', `Approved identity & farm verification for ${targetUser.name}`);
    setActionSuccess(`KYC and verification approved for ${targetUser.name}.`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleResolveDispute = (disputeId: string, action: 'refund' | 'release' | 'split') => {
    const d = disputes.find((item) => item.id === disputeId);
    if (!d) return;

    setDisputes((prev) => prev.filter((item) => item.id !== disputeId));
    const outcomeText =
      action === 'refund'
        ? `Refunded ₦${d.escrowAmount.toLocaleString()} to Buyer`
        : action === 'release'
        ? `Released ₦${d.escrowAmount.toLocaleString()} to Seller`
        : `Split Escrow 50/50 between Buyer and Seller`;

    addAuditLog(
      user.name,
      user.role,
      'RESOLVE_DISPUTE',
      `Resolved dispute ${disputeId} on ${d.orderId}: ${outcomeText}`
    );
    setActionSuccess(`Dispute ${disputeId} successfully resolved: ${outcomeText}.`);
    setTimeout(() => setActionSuccess(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Top Section Nav Tabs */}
      <div className="bg-white p-3 rounded-2xl border border-[#c1c8c2]/70 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#012d1d] text-[24px]">support_agent</span>
          <div>
            <h3 className="font-heading font-bold text-base text-[#012d1d]">
              Operations, Support & Dispute Resolution Desk
            </h3>
            <p className="text-xs text-[#717973]">Identity verification, escrow adjudication & logistics incident oversight</p>
          </div>
        </div>

        <div className="flex bg-[#f0f4f1] p-1 rounded-xl text-xs font-bold text-[#3f6653]">
          <button
            onClick={() => setActiveTab('kyc')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'kyc' ? 'bg-[#012d1d] text-white shadow-xs' : 'hover:text-[#012d1d]'
            }`}
          >
            KYC Verification ({pendingKYC.length})
          </button>
          <button
            onClick={() => setActiveTab('disputes')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'disputes' ? 'bg-[#012d1d] text-white shadow-xs' : 'hover:text-[#012d1d]'
            }`}
          >
            Escrow Disputes ({disputes.length})
          </button>
          <button
            onClick={() => setActiveTab('freight')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'freight' ? 'bg-[#012d1d] text-white shadow-xs' : 'hover:text-[#012d1d]'
            }`}
          >
            Freight Incidents ({freightIncidents.length})
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3.5 bg-[#c1ecd4] text-[#002114] border border-[#276a4c]/40 rounded-xl text-xs font-bold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-xs underline hover:text-black">
            Dismiss
          </button>
        </div>
      )}

      {/* Tab 1: KYC Verification Queue */}
      {activeTab === 'kyc' && (
        <div className="bg-white rounded-2xl border border-[#c1c8c2]/70 p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-[#e8ece9]">
            <h4 className="font-heading font-bold text-sm text-[#012d1d]">
              Identity & Farmer Registry Verification Queue
            </h4>
            <span className="text-xs text-[#717973]">
              Validating National Identity Numbers (NIN), CAC & GPS Farm Boundaries
            </span>
          </div>

          {pendingKYC.length === 0 ? (
            <div className="p-8 text-center bg-[#f9fbf9] rounded-xl border border-dashed border-[#c1c8c2] space-y-2">
              <span className="material-symbols-outlined text-[36px] text-[#276a4c]">verified</span>
              <p className="font-bold text-sm text-[#012d1d]">All Verification Queues are Cleared</p>
              <p className="text-xs text-[#717973]">No pending KYC applications awaiting manual review.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingKYC.map((usr) => (
                <div key={usr.id} className="p-4 bg-[#f9fbf9] rounded-xl border border-[#e2e8e4] space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={usr.photoUrl || getNigerianAvatar(usr.name)}
                      alt={usr.name}
                      className="w-12 h-12 rounded-full object-cover border border-[#c1c8c2]"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-heading font-bold text-sm text-[#012d1d] truncate">{usr.name}</div>
                      <div className="text-[11px] text-[#717973] uppercase font-bold">{usr.role.replace('_', ' ')} • {usr.state}</div>
                      <div className="text-[10px] text-[#525a54]">{usr.phone}</div>
                    </div>
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-[#e2e8e4] text-[11px] space-y-1">
                    <div className="flex justify-between">
                      <span className="text-[#717973]">Submitted NIN:</span>
                      <span className="font-mono font-bold text-[#012d1d]">{usr.nin || '23490812903'}</span>
                    </div>
                    {usr.cacNumber && (
                      <div className="flex justify-between">
                        <span className="text-[#717973]">CAC Registration:</span>
                        <span className="font-mono font-bold text-[#012d1d]">{usr.cacNumber}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-[#717973]">Farm / Business Location:</span>
                      <span className="font-semibold text-[#1a1c1c]">{usr.lga || 'Zaria'}, {usr.state}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => handleApproveKYC(usr)}
                      className="flex-1 py-2 bg-[#012d1d] text-white font-bold text-xs rounded-xl hover:bg-[#1b4332] active:scale-95 transition-all shadow-xs"
                    >
                      Approve KYC
                    </button>
                    <button className="px-3 py-2 border border-[#c1c8c2] text-[#ba1a1a] font-bold text-xs rounded-xl hover:bg-[#ffdad6] transition-colors">
                      Reject / Request Docs
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Escrow Disputes */}
      {activeTab === 'disputes' && (
        <div className="bg-white rounded-2xl border border-[#c1c8c2]/70 p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-[#e8ece9]">
            <h4 className="font-heading font-bold text-sm text-[#012d1d]">
              Contested Produce Orders & Escrow Mediation
            </h4>
            <span className="text-xs text-[#717973]">
              Quality discrepancies, moisture disputes & delivery disagreements
            </span>
          </div>

          {disputes.length === 0 ? (
            <div className="p-8 text-center bg-[#f9fbf9] rounded-xl border border-dashed border-[#c1c8c2] space-y-2">
              <span className="material-symbols-outlined text-[36px] text-[#276a4c]">handshake</span>
              <p className="font-bold text-sm text-[#012d1d]">No Active Disputes</p>
              <p className="text-xs text-[#717973]">All marketplace orders and escrow releases are functioning smoothly.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {disputes.map((dsp) => (
                <div key={dsp.id} className="p-4 bg-[#f9fbf9] rounded-xl border border-[#e2e8e4] space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#ba1a1a] text-[20px]">gavel</span>
                      <span className="font-bold text-sm text-[#012d1d]">Dispute #{dsp.id}</span>
                      <span className="text-xs text-[#717973]">({dsp.commodity})</span>
                    </div>
                    <span className="text-xs font-bold text-[#ba1a1a] bg-[#ffdad6] px-2.5 py-0.5 rounded-full self-start">
                      Escrow Locked: ₦{dsp.escrowAmount.toLocaleString()}
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-[#e2e8e4] text-xs space-y-1.5">
                    <div className="text-[#525a54]">
                      <span className="font-bold text-[#1a1c1c]">Dispute Cause: </span>
                      {dsp.disputeReason}
                    </div>
                    <div className="flex flex-wrap justify-between gap-2 pt-1 border-t border-[#e8ece9] text-[11px]">
                      <div>
                        <span className="text-[#717973]">Buyer: </span>
                        <span className="font-bold text-[#012d1d]">{dsp.buyer}</span>
                      </div>
                      <div>
                        <span className="text-[#717973]">Seller: </span>
                        <span className="font-bold text-[#012d1d]">{dsp.seller}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      onClick={() => handleResolveDispute(dsp.id, 'release')}
                      className="px-3 py-2 bg-[#012d1d] text-white font-bold text-xs rounded-xl hover:bg-[#1b4332] active:scale-95 transition-all shadow-xs"
                    >
                      Release to Seller (₦{dsp.escrowAmount.toLocaleString()})
                    </button>
                    <button
                      onClick={() => handleResolveDispute(dsp.id, 'refund')}
                      className="px-3 py-2 bg-[#ba1a1a] text-white font-bold text-xs rounded-xl hover:bg-[#93000a] active:scale-95 transition-all shadow-xs"
                    >
                      Refund to Buyer
                    </button>
                    <button
                      onClick={() => handleResolveDispute(dsp.id, 'split')}
                      className="px-3 py-2 border border-[#c1c8c2] bg-white font-bold text-xs rounded-xl hover:bg-[#f0f4f1] transition-colors text-[#012d1d]"
                    >
                      Split 50/50 Mediation
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Freight Incidents */}
      {activeTab === 'freight' && (
        <div className="bg-white rounded-2xl border border-[#c1c8c2]/70 p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-[#e8ece9]">
            <h4 className="font-heading font-bold text-sm text-[#012d1d]">
              National Freight Corridors & Road Incident Feed
            </h4>
            <span className="text-xs text-[#717973]">Live truck telematics, transit delays & cargo condition logs</span>
          </div>

          <div className="space-y-3">
            {freightIncidents.map((inc) => (
              <div key={inc.id} className="p-4 bg-[#f9fbf9] rounded-xl border border-[#e2e8e4] space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#012d1d] text-[20px]">local_shipping</span>
                    <span className="font-bold text-xs text-[#1a1c1c]">{inc.carrier}</span>
                    <span className="font-mono text-[10px] bg-[#e8ece9] px-1.5 py-0.5 rounded font-bold">{inc.truckPlate}</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      inc.severity === 'Low' ? 'bg-[#c1ecd4] text-[#002114]' : 'bg-[#ffdeac] text-[#281900]'
                    }`}
                  >
                    {inc.severity} Severity
                  </span>
                </div>

                <div className="text-xs text-[#525a54]">{inc.incident}</div>

                <div className="flex justify-between text-[11px] text-[#717973] pt-1.5 border-t border-[#e2e8e4]">
                  <span>Route: {inc.route} • Cargo: {inc.cargo}</span>
                  <span>{inc.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
