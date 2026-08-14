import React, { useState } from 'react';
import {
  AlertOctagon,
  Lock,
  Unlock,
  Radio,
  Send,
  AlertTriangle,
  Shield,
  CheckCircle2,
  X,
  FileText,
  Users,
  Smartphone,
  Zap,
} from 'lucide-react';

interface SuperAdminEmergencyCenterProps {
  marketplaceFrozen: boolean;
  walletFrozen: boolean;
  maintenanceModeActive: boolean;
  rateLimiterActive: boolean;
  onToggleMarketplaceFreeze: (frozen: boolean, reason: string) => void;
  onToggleWalletFreeze: (frozen: boolean, reason: string) => void;
  onToggleMaintenanceMode: (active: boolean, reason: string) => void;
  onToggleRateLimiter: (active: boolean) => void;
  onSendEmergencyBroadcast: (title: string, message: string, targetRoles: string[], channels: string[]) => void;
  subTab?: 'all' | 'freeze_marketplace' | 'freeze_wallet' | 'broadcast' | 'maintenance';
  onSubTabChange?: (tab: 'all' | 'freeze_marketplace' | 'freeze_wallet' | 'broadcast' | 'maintenance') => void;
}

export const SuperAdminEmergencyCenter: React.FC<SuperAdminEmergencyCenterProps> = ({
  marketplaceFrozen,
  walletFrozen,
  maintenanceModeActive,
  rateLimiterActive,
  onToggleMarketplaceFreeze,
  onToggleWalletFreeze,
  onToggleMaintenanceMode,
  onToggleRateLimiter,
  onSendEmergencyBroadcast,
  subTab = 'all',
  onSubTabChange,
}) => {
  const [internalTab, setInternalTab] = useState<'all' | 'freeze_marketplace' | 'freeze_wallet' | 'broadcast' | 'maintenance'>(subTab);

  React.useEffect(() => {
    if (subTab) setInternalTab(subTab);
  }, [subTab]);

  const activeTab = subTab || internalTab;
  const setActiveTab = (t: 'all' | 'freeze_marketplace' | 'freeze_wallet' | 'broadcast' | 'maintenance') => {
    setInternalTab(t);
    if (onSubTabChange) onSubTabChange(t);
  };

  // Modal states for freezes
  const [activeModal, setActiveModal] = useState<'MARKETPLACE' | 'WALLET' | 'MAINTENANCE' | null>(null);
  const [modalReason, setModalReason] = useState('');

  // Emergency Broadcast Form
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastRoles, setBroadcastRoles] = useState<string[]>(['farmer', 'cooperative', 'buyer', 'input_supplier', 'transporter']);
  const [broadcastChannels, setBroadcastChannels] = useState<string[]>(['SMS', 'USSD_FLASH', 'IN_APP']);
  const [broadcastSuccess, setBroadcastSuccess] = useState<string | null>(null);

  const handleOpenModal = (type: 'MARKETPLACE' | 'WALLET' | 'MAINTENANCE') => {
    setActiveModal(type);
    setModalReason('');
  };

  const handleConfirmAction = () => {
    if (!modalReason.trim()) return;

    if (activeModal === 'MARKETPLACE') {
      onToggleMarketplaceFreeze(!marketplaceFrozen, modalReason);
    } else if (activeModal === 'WALLET') {
      onToggleWalletFreeze(!walletFrozen, modalReason);
    } else if (activeModal === 'MAINTENANCE') {
      onToggleMaintenanceMode(!maintenanceModeActive, modalReason);
    }

    setActiveModal(null);
    setModalReason('');
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMessage) return;

    onSendEmergencyBroadcast(broadcastTitle, broadcastMessage, broadcastRoles, broadcastChannels);
    setBroadcastSuccess(`Emergency Broadcast Transmitted to ${broadcastRoles.length} role groups across 36 states.`);
    setBroadcastTitle('');
    setBroadcastMessage('');
    setTimeout(() => setBroadcastSuccess(null), 6000);
  };

  return (
    <div className="space-y-6">
      {/* Emergency Sub-tabs */}
      <div className="flex items-center gap-2 border-b border-[#1b2b22] pb-3 overflow-x-auto">
        {[
          { id: 'all' as const, label: 'All Emergency Controls', icon: AlertOctagon },
          { id: 'freeze_marketplace' as const, label: 'Freeze Marketplace', icon: Lock },
          { id: 'freeze_wallet' as const, label: 'Freeze Wallet / Payments', icon: Shield },
          { id: 'broadcast' as const, label: 'Emergency Broadcast', icon: Radio },
          { id: 'maintenance' as const, label: 'Maintenance Mode', icon: Zap },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-[#ef4444] text-white shadow-lg'
                  : 'bg-[#0f1713] text-[#8fa89b] hover:text-white border border-[#1b2b22]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Emergency Kill Switches Grid */}
      {(activeTab === 'all' || activeTab === 'freeze_marketplace' || activeTab === 'freeze_wallet' || activeTab === 'maintenance') && (
      <div className="bg-[#0f1713] border border-[#1b2b22] rounded-2xl p-5 shadow-md space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1b2b22]">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-[#ef4444]" />
            <div>
              <h3 className="font-bold text-sm text-white">Emergency Platform Kill Switches & Circuit Breakers</h3>
              <p className="text-xs text-[#8fa89b]">
                Instant freeze controls for market trading, financial payouts, and public maintenance gates
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-[#ef4444] bg-[#2a0e0e] px-2.5 py-1 rounded-md border border-[#5c1d1d] font-bold">
            Root Authority
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Switch 1: Marketplace */}
          <div
            className={`p-4 rounded-xl border flex flex-col justify-between gap-3 ${
              marketplaceFrozen
                ? 'bg-[#2a0e0e] border-[#5c1d1d]'
                : 'bg-[#0a0f0d] border-[#1b2b22]'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white">Produce Marketplace</span>
                {marketplaceFrozen ? (
                  <span className="text-[10px] font-mono font-bold text-[#ef4444] bg-black/40 px-2 py-0.5 rounded">
                    FROZEN
                  </span>
                ) : (
                  <span className="text-[10px] font-mono font-bold text-[#10b981] bg-[#064e3b] px-2 py-0.5 rounded">
                    ACTIVE
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#8fa89b]">
                Freezes buyer bidding, farmer new listings, and inter-state trade checkout.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleOpenModal('MARKETPLACE')}
              className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                marketplaceFrozen
                  ? 'bg-[#10b981] hover:bg-[#059669] text-[#0a0f0d]'
                  : 'bg-[#7f1d1d] hover:bg-[#991b1b] text-white'
              }`}
            >
              {marketplaceFrozen ? (
                <>
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Unfreeze Marketplace</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Freeze Marketplace</span>
                </>
              )}
            </button>
          </div>

          {/* Switch 2: Wallet & Escrow */}
          <div
            className={`p-4 rounded-xl border flex flex-col justify-between gap-3 ${
              walletFrozen
                ? 'bg-[#2a0e0e] border-[#5c1d1d]'
                : 'bg-[#0a0f0d] border-[#1b2b22]'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white">Banking & Escrow Payouts</span>
                {walletFrozen ? (
                  <span className="text-[10px] font-mono font-bold text-[#ef4444] bg-black/40 px-2 py-0.5 rounded">
                    FROZEN
                  </span>
                ) : (
                  <span className="text-[10px] font-mono font-bold text-[#10b981] bg-[#064e3b] px-2 py-0.5 rounded">
                    ACTIVE
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#8fa89b]">
                Halts all outbound NIBSS transfers and escrow automated bank settlements.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleOpenModal('WALLET')}
              className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                walletFrozen
                  ? 'bg-[#10b981] hover:bg-[#059669] text-[#0a0f0d]'
                  : 'bg-[#7f1d1d] hover:bg-[#991b1b] text-white'
              }`}
            >
              {walletFrozen ? (
                <>
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Unfreeze Escrow / Payouts</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Freeze Escrow / Payouts</span>
                </>
              )}
            </button>
          </div>

          {/* Switch 3: Maintenance Mode */}
          <div
            className={`p-4 rounded-xl border flex flex-col justify-between gap-3 ${
              maintenanceModeActive
                ? 'bg-[#2a0e0e] border-[#5c1d1d]'
                : 'bg-[#0a0f0d] border-[#1b2b22]'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white">Platform Maintenance Gate</span>
                {maintenanceModeActive ? (
                  <span className="text-[10px] font-mono font-bold text-[#ef4444] bg-black/40 px-2 py-0.5 rounded">
                    ON
                  </span>
                ) : (
                  <span className="text-[10px] font-mono font-bold text-[#8fa89b] bg-[#1b2b22] px-2 py-0.5 rounded">
                    OFF
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#8fa89b]">
                Reroutes public web & USSD traffic to maintenance screen while preserving Super Admin console.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleOpenModal('MAINTENANCE')}
              className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                maintenanceModeActive
                  ? 'bg-[#10b981] hover:bg-[#059669] text-[#0a0f0d]'
                  : 'bg-[#1b2b22] hover:bg-[#253b2f] text-[#c1d3c9] border border-[#2d4738]'
              }`}
            >
              {maintenanceModeActive ? 'Disable Maintenance Gate' : 'Enable Maintenance Gate'}
            </button>
          </div>
        </div>
      </div>
      )}

      {/* Emergency National Broadcast Terminal */}
      {(activeTab === 'all' || activeTab === 'broadcast') && (
      <div className="bg-[#0f1713] border border-[#1b2b22] rounded-2xl p-5 shadow-md space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1b2b22]">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-[#34d399]" />
            <div>
              <h3 className="font-bold text-sm text-white">National Emergency Broadcast Terminal</h3>
              <p className="text-xs text-[#8fa89b]">
                Transmit high-priority SMS, USSD flash alerts, and in-app banners to farmers, transporters, and buyers
              </p>
            </div>
          </div>
        </div>

        {broadcastSuccess && (
          <div className="p-3 bg-[#064e3b] text-[#6ee7b7] border border-[#10b981]/40 rounded-xl text-xs flex items-center gap-2 font-bold animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            <span>{broadcastSuccess}</span>
          </div>
        )}

        <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-[#8fa89b] font-semibold">Broadcast Advisory Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Flood Warning in Benue River Basin / Grain Transit Advisory"
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                className="w-full p-2.5 bg-[#0a0f0d] border border-[#1b2b22] rounded-xl text-white focus:outline-hidden focus:border-[#10b981]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[#8fa89b] font-semibold">Transmission Delivery Channels</label>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {['SMS', 'USSD_FLASH', 'IN_APP'].map((ch) => (
                  <label key={ch} className="flex items-center gap-1.5 cursor-pointer text-[#c1d3c9]">
                    <input
                      type="checkbox"
                      checked={broadcastChannels.includes(ch)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setBroadcastChannels([...broadcastChannels, ch]);
                        } else {
                          setBroadcastChannels(broadcastChannels.filter((c) => c !== ch));
                        }
                      }}
                      className="rounded border-[#1b2b22] bg-[#0a0f0d] text-[#10b981]"
                    />
                    <span className="font-mono text-[11px]">{ch}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[#8fa89b] font-semibold">Emergency Broadcast Message (160 char SMS)</label>
            <textarea
              rows={3}
              required
              placeholder="FMAFS URGENT ADVISORY: Flash flooding projected for Benue & Niger riverbank farms over next 48h. Evacuate bagged maize to nearest ADP warehouse."
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              className="w-full p-2.5 bg-[#0a0f0d] border border-[#1b2b22] rounded-xl text-white font-mono text-xs focus:outline-hidden focus:border-[#10b981]"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-[#ef4444] hover:bg-[#dc2626] text-white text-xs font-bold rounded-xl shadow-lg transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Authorize & Transmit Broadcast</span>
            </button>
          </div>
        </form>
      </div>
      )}

      {/* Confirmation Modal for Freeze / Unfreeze */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f1713] border border-[#5c1d1d] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1b2b22]">
              <div className="flex items-center gap-2 text-[#ef4444]">
                <AlertOctagon className="w-5 h-5" />
                <h4 className="font-bold text-sm text-white">Emergency State Modification Safeguard</h4>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-[#8fa89b] hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#c1d3c9]">
              You are modifying the core status of <span className="font-bold text-white">{activeModal}</span>.
              This will immediately take effect across all 36 states. You MUST provide an operational justification
              for the cryptographic audit ledger.
            </p>

            <div className="space-y-1">
              <label className="block text-xs text-[#8fa89b] font-semibold">
                Mandatory Operational Justification
              </label>
              <textarea
                rows={3}
                required
                placeholder="e.g. Temporary circuit break due to Interswitch gateway maintenance / Bank of Agriculture clearing notice."
                value={modalReason}
                onChange={(e) => setModalReason(e.target.value)}
                className="w-full p-2.5 bg-[#0a0f0d] border border-[#1b2b22] rounded-xl text-white font-mono text-xs focus:outline-hidden focus:border-[#ef4444]"
              />
            </div>

            <div className="pt-3 border-t border-[#1b2b22] flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-[#1b2b22] text-[#c1d3c9] font-bold rounded-xl cursor-pointer"
              >
                Abort
              </button>
              <button
                type="button"
                disabled={!modalReason.trim()}
                onClick={handleConfirmAction}
                className="px-4 py-2 bg-[#ef4444] hover:bg-[#dc2626] text-white font-bold rounded-xl cursor-pointer transition-colors disabled:opacity-50"
              >
                Confirm & Sign Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
