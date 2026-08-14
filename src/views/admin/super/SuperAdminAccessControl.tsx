import React, { useState } from 'react';
import {
  Key,
  Shield,
  Sliders,
  ToggleLeft,
  ToggleRight,
  Laptop,
  Smartphone,
  Globe,
  Trash2,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Layers,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { UserRole } from '../../../types';

interface FeatureFlag {
  id: string;
  name: string;
  enabled: boolean;
  category: string;
  desc: string;
  rolloutScope: 'National' | 'Pilot States' | 'Staging';
  pilotStates?: string[];
}

interface ActiveSession {
  id: string;
  userName: string;
  role: UserRole;
  ipAddress: string;
  location: string;
  device: string;
  loginTime: string;
  status: 'Active' | 'Idle';
}

interface SuperAdminAccessControlProps {
  featureFlags: FeatureFlag[];
  onToggleFlag: (id: string) => void;
  onTerminateSession: (id: string) => void;
  onTerminateAllSessions: () => void;
  subTab?: 'matrix' | 'flags' | 'sessions' | 'security';
  onSubTabChange?: (tab: 'matrix' | 'flags' | 'sessions' | 'security') => void;
}

export const SuperAdminAccessControl: React.FC<SuperAdminAccessControlProps> = ({
  featureFlags,
  onToggleFlag,
  onTerminateSession,
  onTerminateAllSessions,
  subTab = 'matrix',
  onSubTabChange,
}) => {
  const [internalTab, setInternalTab] = useState<'matrix' | 'flags' | 'sessions' | 'security'>(subTab);

  React.useEffect(() => {
    if (subTab) setInternalTab(subTab);
  }, [subTab]);

  const activeTab = subTab || internalTab;
  const setActiveTab = (t: 'matrix' | 'flags' | 'sessions' | 'security') => {
    setInternalTab(t);
    if (onSubTabChange) onSubTabChange(t);
  };

  // Security Settings State
  const [enforce2FAAllAdmins, setEnforce2FAAllAdmins] = useState(true);
  const [geoFencingStrict, setGeoFencingStrict] = useState(true);
  const [sessionInactivityTimeout, setSessionInactivityTimeout] = useState('15');
  const [maxLoginFailures, setMaxLoginFailures] = useState('3');
  const [securitySaved, setSecuritySaved] = useState(false);

  const [sessions, setSessions] = useState<ActiveSession[]>([
    {
      id: 'sess_1',
      userName: 'Dr. Aliyu Danladi',
      role: 'super_admin',
      ipAddress: '102.89.34.12',
      location: 'Abuja, FCT (GovNet Node)',
      device: 'Chrome 128 / macOS Sequoia',
      loginTime: '24 mins ago',
      status: 'Active',
    },
    {
      id: 'sess_2',
      userName: 'Hajiya Fatima Bello',
      role: 'gov_admin',
      ipAddress: '105.112.44.89',
      location: 'Abuja, FCT (FMAFS HQ)',
      device: 'Edge 126 / Windows 11',
      loginTime: '1 hour ago',
      status: 'Active',
    },
    {
      id: 'sess_3',
      userName: 'Engr. Terver Aondo',
      role: 'institutional_admin',
      ipAddress: '197.210.65.11',
      location: 'Makurdi, Benue State ADP',
      device: 'Firefox 129 / Ubuntu 24.04',
      loginTime: '3 hours ago',
      status: 'Idle',
    },
    {
      id: 'sess_4',
      userName: 'Ngozi Okoro (Support Ops)',
      role: 'super_admin',
      ipAddress: '102.90.12.87',
      location: 'Lagos Island (USUCO Ops)',
      device: 'Safari 17.5 / macOS Sonoma',
      loginTime: 'Just now',
      status: 'Active',
    },
  ]);

  const permissionMatrix = [
    {
      module: 'Inter-State Produce Marketplace',
      desc: 'Browse, create listings, submit buy bids & haulage',
      farmer: 'Full',
      coop: 'Full',
      buyer: 'Full',
      adp: 'Read / Moderation',
      ministry: 'Read / Analytics',
      superAdmin: 'Full Root Access',
    },
    {
      module: 'Escrow Banking & Wallet Withdrawals',
      desc: 'Deposit collateral, release settlement, trigger refunds',
      farmer: 'Claim Only',
      coop: 'Bulk Claim',
      buyer: 'Deposit / Escrow',
      adp: 'Audit Only',
      ministry: 'Subsidies Only',
      superAdmin: 'Full Root Access',
    },
    {
      module: 'Bank of Agriculture (BOA) 5% Loan Facility',
      desc: 'Apply, credit underwriting score, biometric sign',
      farmer: 'Apply',
      coop: 'Joint-Guarantee',
      buyer: 'Off-taker Lock',
      adp: 'Endorsement',
      ministry: 'Policy Envelope',
      superAdmin: 'Full Root Access',
    },
    {
      module: 'Produce Price Floor & GMP Compliance',
      desc: 'Monitor price gouging and enforce national GMP',
      farmer: 'View Only',
      coop: 'View Only',
      buyer: 'Enforced Compliance',
      adp: 'Enforcement Desk',
      ministry: 'Set Statutory Floor',
      superAdmin: 'Full Root Access',
    },
    {
      module: 'Tractor GPS Mechanisation Telematics',
      desc: 'IoT fleet tracking, fuel telemetry, billing dispatch',
      farmer: 'Book Service',
      coop: 'Manage Pool',
      buyer: 'Restricted',
      adp: 'Inspect Area',
      ministry: 'National Quota',
      superAdmin: 'Full Root Access',
    },
    {
      module: 'Cryptographic Audit & NDPR Access Logs',
      desc: 'Inspect citizen records, export SHA-256 dossiers',
      farmer: 'Deny',
      coop: 'Deny',
      buyer: 'Deny',
      adp: 'LGA Scope Only',
      ministry: 'Strategic Scope',
      superAdmin: 'Full Root Access',
    },
  ];

  const handleKillSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    onTerminateSession(id);
  };

  return (
    <div className="space-y-5">
      {/* Sub-tabs */}
      <div className="flex items-center gap-2 border-b border-[#1b2b22] pb-2 overflow-x-auto">
        {[
          { id: 'matrix' as const, label: 'Permission Matrix', icon: Key },
          { id: 'flags' as const, label: 'Feature Flags', icon: Sliders },
          { id: 'sessions' as const, label: 'Active Sessions', icon: Laptop },
          { id: 'security' as const, label: 'Security Settings', icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-[#10b981] text-[#0a0f0d]'
                  : 'bg-[#0f1713] text-[#8fa89b] hover:bg-[#1b2b22] border border-[#1b2b22]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Dynamic Feature Flags */}
      {activeTab === 'flags' && (
        <div className="bg-[#0f1713] border border-[#1b2b22] rounded-2xl p-5 shadow-md space-y-4">
          <div className="pb-3 border-b border-[#1b2b22] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h3 className="font-bold text-sm text-white">National Feature Flag Control Bus</h3>
              <p className="text-xs text-[#8fa89b]">
                Real-time module activation with instant Redis cache propagation across 36 states
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#10b981] bg-[#064e3b] px-3 py-1 rounded-xl">
              {featureFlags.filter((f) => f.enabled).length} / {featureFlags.length} Enabled
            </span>
          </div>

          <div className="divide-y divide-[#1b2b22]">
            {featureFlags.map((flag) => (
              <div
                key={flag.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-xs text-white">{flag.name}</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#1b2b22] text-[#8fa89b] rounded-md border border-[#2d4738]">
                      {flag.category}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                        flag.rolloutScope === 'National'
                          ? 'bg-[#064e3b] text-[#6ee7b7]'
                          : 'bg-[#78350f] text-[#fde68a]'
                      }`}
                    >
                      Scope: {flag.rolloutScope}
                    </span>
                  </div>
                  <p className="text-xs text-[#8fa89b]">{flag.desc}</p>
                  {flag.pilotStates && (
                    <div className="text-[11px] text-[#34d399] font-mono">
                      Pilot Corridors: {flag.pilotStates.join(', ')}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onToggleFlag(flag.id)}
                    className={`p-1.5 rounded-xl flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer ${
                      flag.enabled
                        ? 'bg-[#1b2b22] text-[#10b981] border border-[#2d4738]'
                        : 'bg-[#0a0f0d] text-[#8fa89b] border border-[#1b2b22]'
                    }`}
                  >
                    {flag.enabled ? (
                      <>
                        <ToggleRight className="w-6 h-6 text-[#10b981]" />
                        <span className="pr-1 text-white">Active</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-6 h-6 text-[#8fa89b]" />
                        <span className="pr-1">Disabled</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Permission Matrix */}
      {activeTab === 'matrix' && (
        <div className="bg-[#0f1713] border border-[#1b2b22] rounded-2xl p-5 shadow-md space-y-4">
          <div className="pb-3 border-b border-[#1b2b22]">
            <h3 className="font-bold text-sm text-white">Global Role-Based Permission Matrix (RBAC)</h3>
            <p className="text-xs text-[#8fa89b]">
              Fine-grained access policies across Nigerian agricultural stakeholders and administrators
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="border-b border-[#1b2b22] bg-[#0a0f0d] text-[#8fa89b]">
                  <th className="p-3">Module / Capability</th>
                  <th className="p-3">Farmer</th>
                  <th className="p-3">Coop</th>
                  <th className="p-3">Buyer</th>
                  <th className="p-3">State ADP</th>
                  <th className="p-3">Ministry</th>
                  <th className="p-3">Super Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1b2b22] text-[11px]">
                {permissionMatrix.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#0a0f0d] transition-colors">
                    <td className="p-3 font-sans">
                      <div className="font-bold text-white text-xs">{item.module}</div>
                      <div className="text-[10px] text-[#8fa89b]">{item.desc}</div>
                    </td>
                    <td className="p-3 text-[#34d399]">{item.farmer}</td>
                    <td className="p-3 text-[#34d399]">{item.coop}</td>
                    <td className="p-3 text-[#60a5fa]">{item.buyer}</td>
                    <td className="p-3 text-[#fbbf24]">{item.adp}</td>
                    <td className="p-3 text-[#f472b6]">{item.ministry}</td>
                    <td className="p-3 text-[#10b981] font-bold bg-[#10b981]/10">{item.superAdmin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Session Management */}
      {activeTab === 'sessions' && (
        <div className="bg-[#0f1713] border border-[#1b2b22] rounded-2xl p-5 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-[#1b2b22]">
            <div>
              <h3 className="font-bold text-sm text-white">Active Administrator & Citizen Sessions</h3>
              <p className="text-xs text-[#8fa89b]">
                Real-time JWT token state, device fingerprints, and instant session termination
              </p>
            </div>
            <button
              type="button"
              onClick={onTerminateAllSessions}
              className="px-3 py-1.5 bg-[#7f1d1d] hover:bg-[#991b1b] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Terminate All Non-Super Sessions
            </button>
          </div>

          <div className="divide-y divide-[#1b2b22]">
            {sessions.map((sess) => (
              <div
                key={sess.id}
                className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{sess.userName}</span>
                    <span className="px-2 py-0.2 bg-[#1b2b22] text-[#34d399] rounded font-mono text-[10px] uppercase font-bold">
                      {sess.role}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        sess.status === 'Active'
                          ? 'bg-[#064e3b] text-[#6ee7b7]'
                          : 'bg-[#78350f] text-[#fde68a]'
                      }`}
                    >
                      {sess.status}
                    </span>
                  </div>
                  <div className="text-[#8fa89b] text-[11px] font-mono flex flex-wrap items-center gap-2">
                    <span>IP: {sess.ipAddress}</span>
                    <span>•</span>
                    <span>Loc: {sess.location}</span>
                    <span>•</span>
                    <span>Device: {sess.device}</span>
                    <span>•</span>
                    <span>Logged in: {sess.loginTime}</span>
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => handleKillSession(sess.id)}
                    className="px-2.5 py-1 bg-[#2a0e0e] hover:bg-[#3f1616] text-[#ef4444] rounded-lg font-bold text-xs transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Revoke JWT Token</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Security Settings */}
      {activeTab === 'security' && (
        <div className="bg-[#0f1713] border border-[#1b2b22] rounded-2xl p-5 shadow-md space-y-5">
          <div className="pb-3 border-b border-[#1b2b22] flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm text-white">National Cryptographic & Security Enforcement</h3>
              <p className="text-xs text-[#8fa89b]">Configure zero-trust policies, multi-factor authentication, and IP geo-fencing</p>
            </div>
            {securitySaved && (
              <span className="px-3 py-1 bg-[#064e3b] text-[#6ee7b7] text-xs font-bold rounded-xl flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Security Policies Deployed
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#0a0f0d] border border-[#1b2b22] rounded-xl space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-white">Enforce 2FA on All Institutional Admins</h4>
                  <p className="text-[11px] text-[#8fa89b]">Requires TOTP / SMS token on login for Ministry, State ADP, & BOA roles.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEnforce2FAAllAdmins(!enforce2FAAllAdmins)}
                  className={`p-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                    enforce2FAAllAdmins ? 'bg-[#064e3b] text-[#6ee7b7]' : 'bg-[#1b2b22] text-[#8fa89b]'
                  }`}
                >
                  {enforce2FAAllAdmins ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>
            </div>

            <div className="p-4 bg-[#0a0f0d] border border-[#1b2b22] rounded-xl space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-white">Nigerian Sovereign Geo-Fencing</h4>
                  <p className="text-[11px] text-[#8fa89b]">Block non-Nigerian IP ranges from accessing government admin endpoints.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setGeoFencingStrict(!geoFencingStrict)}
                  className={`p-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                    geoFencingStrict ? 'bg-[#064e3b] text-[#6ee7b7]' : 'bg-[#1b2b22] text-[#8fa89b]'
                  }`}
                >
                  {geoFencingStrict ? 'STRICT' : 'OFF'}
                </button>
              </div>
            </div>

            <div className="p-4 bg-[#0a0f0d] border border-[#1b2b22] rounded-xl space-y-2">
              <label className="block text-xs font-bold text-white">Session Inactivity Timeout (Minutes)</label>
              <p className="text-[11px] text-[#8fa89b]">Automatically invalidates JWT token after inactivity period.</p>
              <input
                type="number"
                value={sessionInactivityTimeout}
                onChange={(e) => setSessionInactivityTimeout(e.target.value)}
                className="w-full p-2.5 bg-[#080d0a] border border-[#1b2b22] rounded-xl text-white text-xs"
              />
            </div>

            <div className="p-4 bg-[#0a0f0d] border border-[#1b2b22] rounded-xl space-y-2">
              <label className="block text-xs font-bold text-white">Max Failed Login Attempts Before Lockout</label>
              <p className="text-[11px] text-[#8fa89b]">Locks account for 30 minutes and triggers security alert email.</p>
              <input
                type="number"
                value={maxLoginFailures}
                onChange={(e) => setMaxLoginFailures(e.target.value)}
                className="w-full p-2.5 bg-[#080d0a] border border-[#1b2b22] rounded-xl text-white text-xs"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={() => {
                setSecuritySaved(true);
                setTimeout(() => setSecuritySaved(false), 3000);
              }}
              className="px-5 py-2.5 bg-[#10b981] hover:bg-[#059669] text-[#0a0f0d] font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md"
            >
              Save & Apply Security Policies
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
