import React, { useState } from 'react';
import {
  Shield,
  Activity,
  Server,
  ToggleLeft,
  ToggleRight,
  AlertOctagon,
  Lock,
  Unlock,
  RefreshCw,
  Search,
  Users,
  Layers,
  Database,
  Key,
  DollarSign,
  TrendingUp,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  FileText,
  UserCheck,
  Eye,
  Sliders,
  Radio,
  Download,
  Filter,
  Trash2,
  Edit3,
  Globe,
  Zap,
  HardDrive,
  BarChart3,
  ArrowUpRight,
  Check,
  X,
  Clock,
  ShieldCheck,
  PieChart,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { AdminGlobalFilterBar, GlobalFilterState } from '../../components/admin/AdminGlobalFilterBar';
import { ReasonLoggingModal } from '../../components/admin/ReasonLoggingModal';
import { UserRole } from '../../types';

interface FeatureFlag {
  id: string;
  name: string;
  enabled: boolean;
  category: string;
  desc: string;
  rolloutScope: 'National' | 'Pilot States' | 'Staging';
  pilotStates?: string[];
}

interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  state: string;
  status: 'Active' | 'Suspended' | 'Pending 2FA';
  lastActive: string;
  twoFactorEnabled: boolean;
}

export const SuperAdminDashboard: React.FC = () => {
  const { auditLogs, addAuditLog, usersList, listings, orders } = useApp();
  const { user } = useAuth();

  const [filters, setFilters] = useState<GlobalFilterState>({
    dateRange: 'last_30_days',
    state: 'All States',
    lga: 'All LGAs',
    valueChain: 'All Value Chains',
    commodity: 'All Commodities',
  });

  const [activeSubTab, setActiveSubTab] = useState<
    'system_health' | 'revenue_volume' | 'feature_flags' | 'role_management' | 'emergency_controls' | 'audit_explorer'
  >('system_health');

  // Emergency Switches State
  const [marketplaceTradingFrozen, setMarketplaceTradingFrozen] = useState<boolean>(false);
  const [walletWithdrawalsFrozen, setWalletWithdrawalsFrozen] = useState<boolean>(false);
  const [maintenanceModeActive, setMaintenanceModeActive] = useState<boolean>(false);
  const [highRiskRateLimiter, setHighRiskRateLimiter] = useState<boolean>(true);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Freeze Confirmation Modal State
  const [freezeModalType, setFreezeModalType] = useState<'marketplace' | 'wallet' | 'maintenance' | null>(null);
  const [freezeReason, setFreezeReason] = useState('');

  // Feature Flags State
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([
    {
      id: 'flag_marketplace',
      name: 'Inter-State Produce Marketplace Engine',
      enabled: true,
      category: 'Core Commerce',
      desc: 'Allows national produce matching, buyer bidding, order checkout, and haulage negotiation',
      rolloutScope: 'National',
    },
    {
      id: 'flag_escrow',
      name: 'NIBSS / Commercial Escrow Auto-Settlement Bridge',
      enabled: true,
      category: 'Payments',
      desc: 'Locks buyer funds during multi-state transit until electronic POD inspection verification',
      rolloutScope: 'National',
    },
    {
      id: 'flag_boa_credit',
      name: 'Bank of Agriculture (BOA) 5% Loan Underwriting',
      enabled: true,
      category: 'Credit',
      desc: 'Permits smallholders and verified cooperatives to submit single-digit agricultural facility requests',
      rolloutScope: 'Pilot States',
      pilotStates: ['Kaduna', 'Kano', 'Benue', 'Niger', 'Oyo'],
    },
    {
      id: 'flag_ai_advisory',
      name: 'AI Agronomist & Pest Diagnostics Engine',
      enabled: true,
      category: 'Extension',
      desc: 'Enables satellite vegetation pest tracking and multi-lingual voice crop advisory (Hausa, Yoruba, Igbo, Pidgin)',
      rolloutScope: 'National',
    },
    {
      id: 'flag_ussd_gateway',
      name: 'Offline USSD (*384*247#) SMS Fallback Engine',
      enabled: true,
      category: 'Accessibility',
      desc: 'Allows rural farmers on 2G feature phones to list produce and confirm harvest delivery',
      rolloutScope: 'National',
    },
    {
      id: 'flag_gmp_monitoring',
      name: 'Guaranteed Minimum Price (GMP) Compliance Engine',
      enabled: true,
      category: 'Policy',
      desc: 'Monitors grain market trade rates against FMAFS federal statutory floor prices',
      rolloutScope: 'National',
    },
    {
      id: 'flag_evoucher',
      name: 'National e-Voucher Fertilizer & Input Redemption',
      enabled: true,
      category: 'Subsidies',
      desc: 'Enables biometric wallet redemption at accredited agro-dealer redemption centers',
      rolloutScope: 'Pilot States',
      pilotStates: ['Kano', 'Kaduna', 'Katsina', 'Jigawa'],
    },
    {
      id: 'flag_tractor_telematics',
      name: 'Agricultural Mechanisation & Tractor GPS Fleet IoT',
      enabled: true,
      category: 'Mechanisation',
      desc: 'Real-time telemetry and hectare billing for 4,120 registered private tractor service providers',
      rolloutScope: 'National',
    },
  ]);

  // Microservices Telemetry Data
  const microservices = [
    { name: 'Core API Gateway (NGINX / Cloud Run)', status: 'Operational', latency: '24ms', uptime: '99.99%', load: '42%', errorRate: '0.01%' },
    { name: 'NIBSS & Interswitch Banking Settlement Bus', status: 'Operational', latency: '108ms', uptime: '99.96%', load: '61%', errorRate: '0.04%' },
    { name: 'USSD Rural SMS Telecom Gateway (MTN/Airtel/Glo)', status: 'Operational', latency: '62ms', uptime: '99.92%', load: '74%', errorRate: '0.12%' },
    { name: 'GIS Satellite & Soil Weather Engine (Sentinel-2)', status: 'Operational', latency: '185ms', uptime: '99.89%', load: '36%', errorRate: '0.02%' },
    { name: 'Truck Freight GPS Telematics & Route Engine', status: 'Operational', latency: '41ms', uptime: '99.97%', load: '49%', errorRate: '0.00%' },
    { name: 'NIN / NIMC & CAC Identity Verification Node', status: 'Operational', latency: '152ms', uptime: '99.85%', load: '43%', errorRate: '0.05%' },
  ];

  // System Concurrency Breakdown
  const userConcurrency = [
    { roleLabel: 'Smallholder & Commercial Farmers', count: '24,810', share: '57.8%', status: 'Online' },
    { roleLabel: 'Agricultural Cooperatives', count: '3,420', share: '8.0%', status: 'Online' },
    { roleLabel: 'Industrial Buyers & Processors', count: '2,910', share: '6.8%', status: 'Online' },
    { roleLabel: 'Input Suppliers & Agro-Dealers', count: '4,150', share: '9.7%', status: 'Online' },
    { roleLabel: 'Transporters & Logistics Providers', count: '3,840', share: '9.0%', status: 'Online' },
    { roleLabel: 'Field Extension Agents & ADP Officers', count: '3,120', share: '7.3%', status: 'Online' },
    { roleLabel: 'Federal & State Governance Admins', count: '640', share: '1.5%', status: 'Online' },
  ];

  // Value Chain Volume Breakdown
  const valueChainVolume = [
    { commodity: 'White Maize', volumeTonnes: '34,200 MT', valueNaira: '₦4.45 Billion', share: '30.0%', growth: '+14.2%' },
    { commodity: 'Paddy Rice', volumeTonnes: '28,150 MT', valueNaira: '₦3.94 Billion', share: '26.6%', growth: '+22.5%' },
    { commodity: 'Cassava Tubers & Starch', volumeTonnes: '41,000 MT', valueNaira: '₦2.26 Billion', share: '15.2%', growth: '+9.8%' },
    { commodity: 'Soybeans & Grains', volumeTonnes: '16,400 MT', valueNaira: '₦1.80 Billion', share: '12.1%', growth: '+18.4%' },
    { commodity: 'Yam Tubers', volumeTonnes: '22,900 MT', valueNaira: '₦1.37 Billion', share: '9.2%', growth: '+6.1%' },
    { commodity: 'NPK Fertilizer & Agrochemicals', volumeTonnes: '18,500 MT', valueNaira: '₦1.00 Billion', share: '6.9%', growth: '+31.0%' },
  ];

  // Reason Logging State
  const [selectedUserForInspection, setSelectedUserForInspection] = useState<AdminUserRecord | null>(null);

  // Admin Role Management State
  const [adminUsers, setAdminUsers] = useState<AdminUserRecord[]>([
    { id: 'adm_1', name: 'Dr. Aliyu Danladi', email: 'a.danladi@agrigov.ng', role: 'super_admin', department: 'USUCO Tech Operations', state: 'National', status: 'Active', lastActive: '2 mins ago', twoFactorEnabled: true },
    { id: 'adm_2', name: 'Hajiya Fatima Bello', email: 'f.bello@fmafs.gov.ng', role: 'gov_admin', department: 'FMAFS Policy Directorate', state: 'National', status: 'Active', lastActive: '18 mins ago', twoFactorEnabled: true },
    { id: 'adm_3', name: 'Engr. Terver Aondo', email: 't.aondo@benueadp.gov.ng', role: 'institutional_admin', department: 'Benue State ADP Command', state: 'Benue', status: 'Active', lastActive: '1 hour ago', twoFactorEnabled: true },
    { id: 'adm_4', name: 'Ngozi Okoro', email: 'n.okoro@agrigov.ng', role: 'super_admin', department: 'USUCO Support & Verification Desk', state: 'National', status: 'Active', lastActive: 'Just now', twoFactorEnabled: true },
    { id: 'adm_5', name: 'Ibrahim Sanusi', email: 'i.sanusi@boa.gov.ng', role: 'gov_admin', department: 'Bank of Agriculture (BOA) Credit Desk', state: 'National', status: 'Active', lastActive: '3 hours ago', twoFactorEnabled: true },
    { id: 'adm_6', name: 'Amina Yusuf', email: 'a.yusuf@kanoadp.gov.ng', role: 'institutional_admin', department: 'Kano State ADP Extension', state: 'Kano', status: 'Active', lastActive: '45 mins ago', twoFactorEnabled: true },
  ]);

  const [searchAdminQuery, setSearchAdminQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('All');
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUserRecord | null>(null);

  // Form State for Admin Creation / Edit
  const [adminFormName, setAdminFormName] = useState('');
  const [adminFormEmail, setAdminFormEmail] = useState('');
  const [adminFormRole, setAdminFormRole] = useState<UserRole>('gov_admin');
  const [adminFormDept, setAdminFormDept] = useState('');
  const [adminFormState, setAdminFormState] = useState('National');

  // Audit Log Filtering & Search
  const [searchAuditQuery, setSearchAuditQuery] = useState('');
  const [auditCategoryFilter, setAuditCategoryFilter] = useState<string>('ALL');

  // Toggle Feature Flag
  const handleToggleFlag = (flagId: string) => {
    setFeatureFlags((prev) =>
      prev.map((f) => {
        if (f.id === flagId) {
          const updated = !f.enabled;
          addAuditLog(
            user.name,
            user.role,
            'FEATURE_FLAG_TOGGLE',
            `Toggled flag ${f.name} to ${updated ? 'ENABLED' : 'DISABLED'} (${f.rolloutScope})`
          );
          return { ...f, enabled: updated };
        }
        return f;
      })
    );
    setActionSuccess('Feature flag status successfully updated in global Redis cache.');
    setTimeout(() => setActionSuccess(null), 4000);
  };

  // Emergency Freeze Handlers with Modal Confirmation
  const executeEmergencyAction = () => {
    if (!freezeModalType) return;

    if (freezeModalType === 'marketplace') {
      const nextState = !marketplaceTradingFrozen;
      setMarketplaceTradingFrozen(nextState);
      addAuditLog(
        user.name,
        user.role,
        'EMERGENCY_FREEZE_MARKETPLACE',
        `Marketplace Trading Freeze ${nextState ? 'ENGAGED' : 'DISENGAGED'}. Reason: ${freezeReason || 'Operational safeguard'}`
      );
      setActionSuccess(`Marketplace Trading circuit breaker is now ${nextState ? 'FROZEN' : 'ACTIVE'}.`);
    } else if (freezeModalType === 'wallet') {
      const nextState = !walletWithdrawalsFrozen;
      setWalletWithdrawalsFrozen(nextState);
      addAuditLog(
        user.name,
        user.role,
        'EMERGENCY_FREEZE_WALLETS',
        `Escrow & Wallet Settlement Freeze ${nextState ? 'ENGAGED' : 'DISENGAGED'}. Reason: ${freezeReason || 'Liquidity/AML safety halt'}`
      );
      setActionSuccess(`Escrow & Wallet Payout Gateways are now ${nextState ? 'FROZEN' : 'UNFROZEN'}.`);
    } else if (freezeModalType === 'maintenance') {
      const nextState = !maintenanceModeActive;
      setMaintenanceModeActive(nextState);
      addAuditLog(
        user.name,
        user.role,
        'MAINTENANCE_MODE_TOGGLE',
        `Full Platform Maintenance Gate ${nextState ? 'ACTIVATED' : 'DEACTIVATED'}. Reason: ${freezeReason || 'System Upgrade'}`
      );
      setActionSuccess(`Platform Maintenance Mode successfully ${nextState ? 'ACTIVATED' : 'DEACTIVATED'}.`);
    }

    setFreezeModalType(null);
    setFreezeReason('');
    setTimeout(() => setActionSuccess(null), 5000);
  };

  const handlePurgeEdgeCdn = () => {
    addAuditLog(
      user.name,
      user.role,
      'PURGE_EDGE_CDN',
      'Purged all national Edge Redis cache buffers and static CDN assets.'
    );
    setActionSuccess('Nationwide Edge Redis Cache & API response buffers purged.');
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleSaveAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminFormName || !adminFormEmail) return;

    if (editingAdmin) {
      // Edit existing
      setAdminUsers((prev) =>
        prev.map((adm) =>
          adm.id === editingAdmin.id
            ? {
                ...adm,
                name: adminFormName,
                email: adminFormEmail,
                role: adminFormRole,
                department: adminFormDept,
                state: adminFormState,
              }
            : adm
        )
      );
      addAuditLog(
        user.name,
        user.role,
        'UPDATE_ADMIN_USER',
        `Updated administrative user: ${adminFormName} (${adminFormRole}) in ${adminFormState}`
      );
      setActionSuccess(`Admin account ${adminFormName} successfully updated.`);
    } else {
      // Create new
      const newEntry: AdminUserRecord = {
        id: `adm_${Date.now()}`,
        name: adminFormName,
        email: adminFormEmail,
        role: adminFormRole,
        department: adminFormDept || 'General Administration',
        state: adminFormState,
        status: 'Active',
        lastActive: 'Just created',
        twoFactorEnabled: true,
      };
      setAdminUsers((prev) => [newEntry, ...prev]);
      addAuditLog(
        user.name,
        user.role,
        'CREATE_ADMIN_USER',
        `Created new administrative user: ${adminFormName} (${adminFormRole}) assigned to ${adminFormState}`
      );
      setActionSuccess(`Admin user ${adminFormName} created with ${adminFormRole} permissions.`);
    }

    setShowAddAdminModal(false);
    setEditingAdmin(null);
    setAdminFormName('');
    setAdminFormEmail('');
    setAdminFormDept('');
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleToggleAdminStatus = (adminId: string) => {
    setAdminUsers((prev) =>
      prev.map((adm) => {
        if (adm.id === adminId) {
          const nextStatus = adm.status === 'Active' ? 'Suspended' : 'Active';
          addAuditLog(
            user.name,
            user.role,
            'ADMIN_STATUS_CHANGE',
            `Changed status of admin ${adm.name} to ${nextStatus}`
          );
          return { ...adm, status: nextStatus };
        }
        return adm;
      })
    );
    setActionSuccess('Admin account status changed.');
    setTimeout(() => setActionSuccess(null), 4000);
  };

  // Export Audit Dossier
  const handleExportAuditLogs = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(auditLogs, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `USUCO_SUPER_ADMIN_AUDIT_DOSSIER_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    addAuditLog(
      user.name,
      user.role,
      'EXPORT_AUDIT_LOGS',
      'Exported complete SHA-256 verified platform audit trail dossier.'
    );
    setActionSuccess('Cryptographic audit trail dossier exported successfully.');
    setTimeout(() => setActionSuccess(null), 4000);
  };

  // Filtered Audit Logs
  const filteredAuditLogs = auditLogs.filter((log) => {
    const matchesSearch =
      !searchAuditQuery ||
      log.actorName.toLowerCase().includes(searchAuditQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchAuditQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchAuditQuery.toLowerCase());

    const matchesCategory =
      auditCategoryFilter === 'ALL' ||
      (auditCategoryFilter === 'AUTH' && (log.action.includes('AUTH') || log.action.includes('LOGIN') || log.action.includes('ROLE'))) ||
      (auditCategoryFilter === 'FREEZE' && log.action.includes('FREEZE')) ||
      (auditCategoryFilter === 'FLAG' && log.action.includes('FEATURE_FLAG')) ||
      (auditCategoryFilter === 'KYC' && log.action.includes('KYC')) ||
      (auditCategoryFilter === 'EXPORT' && log.action.includes('EXPORT'));

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 font-body">
      {/* Global Filter Bar */}
      <AdminGlobalFilterBar
        filters={filters}
        onFilterChange={setFilters}
        roleTitle="Super Administrator (USUCO – Platform Owner)"
        departmentTag="USUCO System Architecture & National Infrastructure"
        watermarkText="CONFIDENTIAL • USUCO SUPER ADMIN GOVERNANCE"
      />

      {/* Emergency Active Banner Alert */}
      {(marketplaceTradingFrozen || walletWithdrawalsFrozen || maintenanceModeActive) && (
        <div className="p-4 bg-[#ba1a1a] text-white rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg animate-pulse">
          <div className="flex items-center gap-3">
            <AlertOctagon className="w-7 h-7 shrink-0 text-white" />
            <div>
              <div className="font-heading font-bold text-sm">
                CRITICAL SYSTEM EMERGENCY OVERRIDE ENGAGED
              </div>
              <p className="text-xs opacity-90">
                {marketplaceTradingFrozen && '• Marketplace Trading is Frozen '}
                {walletWithdrawalsFrozen && '• Wallet & Escrow Withdrawals are Paused '}
                {maintenanceModeActive && '• Platform is in Maintenance Gate '}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setMarketplaceTradingFrozen(false);
              setWalletWithdrawalsFrozen(false);
              setMaintenanceModeActive(false);
              addAuditLog(user.name, user.role, 'EMERGENCY_RESET', 'Deactivated all emergency freezes');
            }}
            className="px-3.5 py-1.5 bg-white text-[#ba1a1a] rounded-xl font-bold text-xs hover:bg-[#ffdad6] transition-colors cursor-pointer"
          >
            Lift All Freezes
          </button>
        </div>
      )}

      {/* Action Success Alert */}
      {actionSuccess && (
        <div className="p-3.5 bg-[#c1ecd4] text-[#002114] border border-[#276a4c]/40 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#002114]" />
            <span>{actionSuccess}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionSuccess(null)}
            className="text-xs underline hover:text-black cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* High-level Platform Revenue & Health Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="bg-white border border-[#c1c8c2]/80 p-4 rounded-2xl shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#717973]">
            <span className="text-[11px] font-bold uppercase tracking-wider">System Uptime</span>
            <Activity className="w-4 h-4 text-[#16a34a]" />
          </div>
          <div className="font-heading font-bold text-2xl text-[#012d1d]">99.98%</div>
          <div className="text-[11px] text-[#16a34a] font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] animate-pulse" />
            <span>All 6 Microservices Operational</span>
          </div>
        </div>

        <div className="bg-white border border-[#c1c8c2]/80 p-4 rounded-2xl shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#717973]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Concurrency</span>
            <Users className="w-4 h-4 text-[#012d1d]" />
          </div>
          <div className="font-heading font-bold text-2xl text-[#012d1d]">42,890</div>
          <div className="text-[11px] text-[#012d1d] font-semibold">Farmers, Agents & Aggregators</div>
        </div>

        <div className="bg-white border border-[#c1c8c2]/80 p-4 rounded-2xl shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#717973]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Gross Merchandise Value</span>
            <DollarSign className="w-4 h-4 text-[#2563eb]" />
          </div>
          <div className="font-heading font-bold text-2xl text-[#012d1d]">₦14.82 Billion</div>
          <div className="text-[11px] text-[#16a34a] font-bold">+18.4% MoM Nationwide Trade Flow</div>
        </div>

        <div className="bg-white border border-[#c1c8c2]/80 p-4 rounded-2xl shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#717973]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Platform Revenue (1%)</span>
            <TrendingUp className="w-4 h-4 text-[#b45309]" />
          </div>
          <div className="font-heading font-bold text-2xl text-[#012d1d]">₦148.20 Million</div>
          <div className="text-[11px] text-[#717973] font-semibold">Net Escrow Service Commission</div>
        </div>
      </div>

      {/* Sub-Tabs Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-[#c1c8c2]/60">
        {[
          { id: 'system_health' as const, label: 'System Health & APIs', icon: Server },
          { id: 'revenue_volume' as const, label: 'Revenue & Trade Volume', icon: BarChart3 },
          { id: 'feature_flags' as const, label: 'Feature Flags & Modules', icon: Sliders },
          { id: 'role_management' as const, label: 'Global Admin & Roles', icon: Key },
          { id: 'emergency_controls' as const, label: 'Emergency Kill-Switches', icon: AlertOctagon },
          { id: 'audit_explorer' as const, label: 'Full Audit Trail Explorer', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id)}
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

      {/* Tab 1: System Health & Microservices Telemetry */}
      {activeSubTab === 'system_health' && (
        <div className="space-y-5">
          {/* Microservices Grid */}
          <div className="bg-white rounded-2xl border border-[#c1c8c2]/80 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-[#e5e9e6]">
              <div>
                <h3 className="font-heading font-bold text-sm text-[#012d1d]">
                  Microservices & API Gateway Telemetry
                </h3>
                <p className="text-xs text-[#717973]">
                  Real-time health of federal integration endpoints, banking settlement buses, and USSD relays
                </p>
              </div>
              <button
                type="button"
                onClick={handlePurgeEdgeCdn}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f0f4f1] hover:bg-[#e2e8e4] text-[#012d1d] text-xs font-bold rounded-xl border border-[#d8deda] transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#012d1d]" />
                <span>Purge Edge CDN Cache</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {microservices.map((svc, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-[#f8faf8] rounded-2xl border border-[#d8deda] space-y-2 hover:border-[#012d1d]/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-heading font-bold text-xs text-[#012d1d] leading-snug">
                      {svc.name}
                    </span>
                    <span className="px-2 py-0.5 bg-[#c1ecd4] text-[#002114] text-[10px] font-bold rounded-full shrink-0">
                      {svc.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5 pt-1 border-t border-[#e2e8e4] text-center">
                    <div>
                      <div className="text-[10px] text-[#717973]">Latency</div>
                      <div className="text-xs font-bold text-[#012d1d]">{svc.latency}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#717973]">Uptime</div>
                      <div className="text-xs font-bold text-[#16a34a]">{svc.uptime}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#717973]">Load</div>
                      <div className="text-xs font-bold text-[#012d1d]">{svc.load}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#717973]">Error %</div>
                      <div className="text-xs font-bold text-[#16a34a]">{svc.errorRate}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Concurrency & Infrastructure Health */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-[#c1c8c2]/80 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#e5e9e6]">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#012d1d]" />
                  <h4 className="font-heading font-bold text-xs text-[#012d1d]">
                    Live Concurrency by User Role
                  </h4>
                </div>
                <span className="text-[11px] font-bold text-[#16a34a] bg-[#f0fdf4] px-2 py-0.5 rounded-md border border-[#bbf7d0]">
                  42,890 Active Sessions
                </span>
              </div>

              <div className="space-y-2.5">
                {userConcurrency.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-[#012d1d]">{item.roleLabel}</span>
                      <span className="font-bold text-[#012d1d]">
                        {item.count} <span className="text-[11px] font-normal text-[#717973]">({item.share})</span>
                      </span>
                    </div>
                    <div className="w-full bg-[#f0f4f1] h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#012d1d] h-full rounded-full transition-all duration-500"
                        style={{ width: item.share }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Infrastructure Specs */}
            <div className="bg-white rounded-2xl border border-[#c1c8c2]/80 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[#e5e9e6]">
                <Cpu className="w-4 h-4 text-[#012d1d]" />
                <h4 className="font-heading font-bold text-xs text-[#012d1d]">
                  Cloud Infrastructure Health
                </h4>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-2.5 bg-[#f8faf8] rounded-xl border border-[#e5e9e6] flex justify-between items-center">
                  <span className="text-[#717973]">CPU Cluster Load</span>
                  <span className="font-bold text-[#012d1d]">34.2% / 128 Cores</span>
                </div>
                <div className="p-2.5 bg-[#f8faf8] rounded-xl border border-[#e5e9e6] flex justify-between items-center">
                  <span className="text-[#717973]">Memory Allocation</span>
                  <span className="font-bold text-[#012d1d]">182 GB / 512 GB</span>
                </div>
                <div className="p-2.5 bg-[#f8faf8] rounded-xl border border-[#e5e9e6] flex justify-between items-center">
                  <span className="text-[#717973]">Redis Cache Hit Ratio</span>
                  <span className="font-bold text-[#16a34a]">98.4%</span>
                </div>
                <div className="p-2.5 bg-[#f8faf8] rounded-xl border border-[#e5e9e6] flex justify-between items-center">
                  <span className="text-[#717973]">Cloud SQL DB Pool</span>
                  <span className="font-bold text-[#012d1d]">18 / 250 Conn.</span>
                </div>
                <div className="p-2.5 bg-[#f8faf8] rounded-xl border border-[#e5e9e6] flex justify-between items-center">
                  <span className="text-[#717973]">USSD Packet Drop</span>
                  <span className="font-bold text-[#16a34a]">0.12% (Nominal)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Revenue & Trade Volume Overview */}
      {activeSubTab === 'revenue_volume' && (
        <div className="space-y-5">
          {/* Revenue Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-[#c1c8c2]/80 p-5 shadow-xs space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#717973]">
                Total Escrow Holding Balance
              </div>
              <div className="font-heading font-bold text-2xl text-[#012d1d]">₦1.24 Billion</div>
              <p className="text-xs text-[#525a54]">
                Protected in CBN-regulated settlement accounts awaiting delivery sign-offs
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#c1c8c2]/80 p-5 shadow-xs space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#717973]">
                Total Settled Orders (All-time)
              </div>
              <div className="font-heading font-bold text-2xl text-[#012d1d]">48,290 Trades</div>
              <p className="text-xs text-[#16a34a] font-bold">
                99.8% Dispute-free Resolution
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#c1c8c2]/80 p-5 shadow-xs space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#717973]">
                Average Trade Ticket Size
              </div>
              <div className="font-heading font-bold text-2xl text-[#012d1d]">₦306,900</div>
              <p className="text-xs text-[#525a54]">
                Aggregated cross-state haulage & bulk cooperative batch orders
              </p>
            </div>
          </div>

          {/* Commodity Trade Volume Breakdown Table */}
          <div className="bg-white rounded-2xl border border-[#c1c8c2]/80 p-5 shadow-xs space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#e5e9e6]">
              <div>
                <h3 className="font-heading font-bold text-sm text-[#012d1d]">
                  National Trade Volume by Commodity
                </h3>
                <p className="text-xs text-[#717973]">
                  Physical tonnage transacted and gross settlement value across Nigerian agro-corridors
                </p>
              </div>
              <span className="text-xs font-bold text-[#012d1d] bg-[#f0f4f1] px-3 py-1 rounded-xl border border-[#d8deda]">
                Live Market Data
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#e5e9e6] bg-[#f8faf8] text-[#525a54] font-bold">
                    <th className="p-3">Agricultural Commodity</th>
                    <th className="p-3">Volume Transacted</th>
                    <th className="p-3">Gross Value (₦)</th>
                    <th className="p-3">Market Share</th>
                    <th className="p-3 text-right">MoM Growth</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5e9e6]">
                  {valueChainVolume.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#f8faf8] transition-colors">
                      <td className="p-3 font-bold text-[#012d1d]">{item.commodity}</td>
                      <td className="p-3 font-medium text-[#525a54]">{item.volumeTonnes}</td>
                      <td className="p-3 font-bold text-[#012d1d]">{item.valueNaira}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-[#f0f4f1] text-[#012d1d] rounded-md font-mono text-[10px] font-bold">
                          {item.share}
                        </span>
                      </td>
                      <td className="p-3 text-right font-bold text-[#16a34a]">{item.growth}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Feature Flags & Module Activation */}
      {activeSubTab === 'feature_flags' && (
        <div className="bg-white rounded-2xl border border-[#c1c8c2]/80 p-5 shadow-xs space-y-4">
          <div className="pb-2 border-b border-[#e5e9e6] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h3 className="font-heading font-bold text-sm text-[#012d1d]">
                National Platform Feature Flags & Dynamic Modules
              </h3>
              <p className="text-xs text-[#717973]">
                Instantly activate, pilot-test, or deactivate nationwide modules without redeploying infrastructure
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#16a34a] bg-[#f0fdf4] px-2.5 py-1 rounded-lg border border-[#bbf7d0]">
                8 Active Modules
              </span>
            </div>
          </div>

          <div className="divide-y divide-[#e5e9e6]">
            {featureFlags.map((flag) => (
              <div key={flag.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-heading font-bold text-xs text-[#012d1d]">
                      {flag.name}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.2 bg-[#f0f4f1] text-[#525a54] rounded-md border border-[#d8deda]">
                      {flag.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.2 rounded-md ${
                        flag.rolloutScope === 'National'
                          ? 'bg-[#c1ecd4] text-[#002114]'
                          : 'bg-[#fffbeb] text-[#b45309] border border-[#fef3c7]'
                      }`}
                    >
                      Scope: {flag.rolloutScope}
                    </span>
                  </div>
                  <p className="text-xs text-[#717973]">{flag.desc}</p>
                  {flag.pilotStates && (
                    <div className="text-[11px] text-[#525a54]">
                      <span className="font-bold">Pilot States:</span> {flag.pilotStates.join(', ')}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleToggleFlag(flag.id)}
                    className={`p-1.5 rounded-xl flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer ${
                      flag.enabled
                        ? 'bg-[#012d1d] text-[#c1ecd4]'
                        : 'bg-[#f0f4f1] text-[#717973] border border-[#d8deda]'
                    }`}
                  >
                    {flag.enabled ? (
                      <>
                        <ToggleRight className="w-6 h-6 text-[#4ade80]" />
                        <span className="pr-1 text-white">Active</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-6 h-6 text-[#717973]" />
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

      {/* Tab 4: Global Admin & Role Management */}
      {activeSubTab === 'role_management' && (
        <div className="bg-white rounded-2xl border border-[#c1c8c2]/80 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-2 border-b border-[#e5e9e6]">
            <div>
              <h3 className="font-heading font-bold text-sm text-[#012d1d]">
                Global Administrative Access & Role Delegation
              </h3>
              <p className="text-xs text-[#717973]">
                Provision, modify, or revoke administrative credentials across federal ministries and state ADPs
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingAdmin(null);
                setAdminFormName('');
                setAdminFormEmail('');
                setAdminFormRole('gov_admin');
                setAdminFormDept('');
                setAdminFormState('National');
                setShowAddAdminModal(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#012d1d] hover:bg-[#1b4332] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-[#c1ecd4]" />
              <span>Provision New Admin</span>
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#717973] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search administrator name, email, or department..."
                value={searchAdminQuery}
                onChange={(e) => setSearchAdminQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#f8faf8] border border-[#d8deda] rounded-xl text-xs text-[#012d1d] focus:outline-hidden focus:border-[#012d1d]"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#717973]" />
              <select
                value={selectedRoleFilter}
                onChange={(e) => setSelectedRoleFilter(e.target.value)}
                className="text-xs p-2 bg-[#f8faf8] border border-[#d8deda] rounded-xl text-[#012d1d] font-medium"
              >
                <option value="All">All Role Tiers</option>
                <option value="super_admin">Super Admin (USUCO)</option>
                <option value="gov_admin">Gov Admin (Ministry / BOA)</option>
                <option value="institutional_admin">Institutional Admin (State ADP)</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#e5e9e6] bg-[#f8faf8] text-[#525a54] font-bold">
                  <th className="p-3">Official Name</th>
                  <th className="p-3">Role Tier</th>
                  <th className="p-3">Department / Directorate</th>
                  <th className="p-3">Jurisdiction</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">2FA</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e9e6]">
                {adminUsers
                  .filter((adm) => {
                    const matchesSearch =
                      !searchAdminQuery ||
                      adm.name.toLowerCase().includes(searchAdminQuery.toLowerCase()) ||
                      adm.email.toLowerCase().includes(searchAdminQuery.toLowerCase()) ||
                      adm.department.toLowerCase().includes(searchAdminQuery.toLowerCase());
                    const matchesRole = selectedRoleFilter === 'All' || adm.role === selectedRoleFilter;
                    return matchesSearch && matchesRole;
                  })
                  .map((adm) => (
                    <tr key={adm.id} className="hover:bg-[#f8faf8] transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-[#012d1d]">{adm.name}</div>
                        <div className="text-[11px] text-[#717973]">{adm.email}</div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-[#012d1d] text-[#c1ecd4] rounded-md font-mono text-[10px] font-bold uppercase">
                          {adm.role}
                        </span>
                      </td>
                      <td className="p-3 text-[#525a54] font-medium">{adm.department}</td>
                      <td className="p-3">
                        <span className="font-semibold text-[#012d1d]">{adm.state}</span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            adm.status === 'Active'
                              ? 'bg-[#c1ecd4] text-[#002114]'
                              : 'bg-[#ffdad6] text-[#ba1a1a]'
                          }`}
                        >
                          {adm.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="text-[10px] font-bold text-[#16a34a] bg-[#f0fdf4] px-1.5 py-0.5 rounded border border-[#bbf7d0]">
                          Enforced
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedUserForInspection(adm)}
                            className="p-1.5 bg-[#f0f4f1] hover:bg-[#e2e8e4] text-[#012d1d] rounded-lg transition-colors cursor-pointer"
                            title="Inspect Profile with Mandatory Reason Logging"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#012d1d]" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingAdmin(adm);
                              setAdminFormName(adm.name);
                              setAdminFormEmail(adm.email);
                              setAdminFormRole(adm.role);
                              setAdminFormDept(adm.department);
                              setAdminFormState(adm.state);
                              setShowAddAdminModal(true);
                            }}
                            className="p-1.5 bg-[#f0f4f1] hover:bg-[#e2e8e4] text-[#012d1d] rounded-lg transition-colors cursor-pointer"
                            title="Edit Role & Department"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-[#012d1d]" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleAdminStatus(adm.id)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              adm.status === 'Active'
                                ? 'bg-[#fff8f6] hover:bg-[#ffdad6] text-[#ba1a1a]'
                                : 'bg-[#c1ecd4] text-[#002114]'
                            }`}
                            title={adm.status === 'Active' ? 'Suspend Account' : 'Activate Account'}
                          >
                            {adm.status === 'Active' ? (
                              <Lock className="w-3.5 h-3.5 text-[#ba1a1a]" />
                            ) : (
                              <Unlock className="w-3.5 h-3.5 text-[#002114]" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Emergency Kill-Switches */}
      {activeSubTab === 'emergency_controls' && (
        <div className="bg-white rounded-2xl border border-[#c1c8c2]/80 p-5 shadow-xs space-y-5">
          <div className="pb-2 border-b border-[#e5e9e6]">
            <h3 className="font-heading font-bold text-sm text-[#012d1d]">
              Emergency Kill-Switches & Circuit Breakers
            </h3>
            <p className="text-xs text-[#717973]">
              Execute immediate operational halts in response to bank liquidity shortages, price manipulation, or security incidents
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Freeze Marketplace Trading */}
            <div className="p-4 bg-[#fff8f6] rounded-2xl border border-[#ffdad6] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertOctagon className="w-5 h-5 text-[#ba1a1a]" />
                  <span className="font-heading font-bold text-xs text-[#410002]">
                    Freeze Marketplace Trading
                  </span>
                </div>
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                    marketplaceTradingFrozen
                      ? 'bg-[#ba1a1a] text-white'
                      : 'bg-[#c1ecd4] text-[#002114]'
                  }`}
                >
                  {marketplaceTradingFrozen ? 'FROZEN' : 'ACTIVE'}
                </span>
              </div>
              <p className="text-xs text-[#525a54]">
                Temporarily suspends new listing creation and order checkout nationwide during emergency market disruptions.
              </p>
              <button
                type="button"
                onClick={() => {
                  setFreezeModalType('marketplace');
                  setFreezeReason('');
                }}
                className={`w-full py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                  marketplaceTradingFrozen
                    ? 'bg-[#16a34a] hover:bg-[#15803d] text-white'
                    : 'bg-[#ba1a1a] hover:bg-[#93000a] text-white shadow-xs'
                }`}
              >
                {marketplaceTradingFrozen ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                <span>{marketplaceTradingFrozen ? 'Unfreeze Trading' : 'Engage Marketplace Freeze'}</span>
              </button>
            </div>

            {/* Freeze Escrow & Wallet Withdrawals */}
            <div className="p-4 bg-[#fff8f6] rounded-2xl border border-[#ffdad6] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-[#ba1a1a]" />
                  <span className="font-heading font-bold text-xs text-[#410002]">
                    Freeze Escrow & Bank Withdrawals
                  </span>
                </div>
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                    walletWithdrawalsFrozen
                      ? 'bg-[#ba1a1a] text-white'
                      : 'bg-[#c1ecd4] text-[#002114]'
                  }`}
                >
                  {walletWithdrawalsFrozen ? 'FROZEN' : 'ACTIVE'}
                </span>
              </div>
              <p className="text-xs text-[#525a54]">
                Blocks outbound NIBSS / Interswitch payout batches if suspicious AML velocity or double-spend is detected.
              </p>
              <button
                type="button"
                onClick={() => {
                  setFreezeModalType('wallet');
                  setFreezeReason('');
                }}
                className={`w-full py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                  walletWithdrawalsFrozen
                    ? 'bg-[#16a34a] hover:bg-[#15803d] text-white'
                    : 'bg-[#ba1a1a] hover:bg-[#93000a] text-white shadow-xs'
                }`}
              >
                {walletWithdrawalsFrozen ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                <span>{walletWithdrawalsFrozen ? 'Unfreeze Withdrawals' : 'Engage Settlement Freeze'}</span>
              </button>
            </div>

            {/* System Maintenance Mode */}
            <div className="p-4 bg-[#f8faf8] rounded-2xl border border-[#d8deda] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="w-5 h-5 text-[#012d1d]" />
                  <span className="font-heading font-bold text-xs text-[#012d1d]">
                    Full Platform Maintenance Gate
                  </span>
                </div>
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                    maintenanceModeActive
                      ? 'bg-[#ba1a1a] text-white'
                      : 'bg-[#f0f4f1] text-[#525a54]'
                  }`}
                >
                  {maintenanceModeActive ? 'ENGAGED' : 'OFFLINE'}
                </span>
              </div>
              <p className="text-xs text-[#525a54]">
                Reroutes public traffic to the NATIP scheduled maintenance holding screen. Super Admins retain console access.
              </p>
              <button
                type="button"
                onClick={() => {
                  setFreezeModalType('maintenance');
                  setFreezeReason('');
                }}
                className="w-full py-2.5 bg-[#012d1d] hover:bg-[#1b4332] text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sliders className="w-4 h-4 text-[#c1ecd4]" />
                <span>{maintenanceModeActive ? 'Disable Maintenance' : 'Activate Maintenance Mode'}</span>
              </button>
            </div>

            {/* High-Risk API Rate Limiting */}
            <div className="p-4 bg-[#f8faf8] rounded-2xl border border-[#d8deda] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#16a34a]" />
                  <span className="font-heading font-bold text-xs text-[#012d1d]">
                    Automated DDoS & Abuse Shield
                  </span>
                </div>
                <span className="px-2 py-0.5 bg-[#c1ecd4] text-[#002114] text-[10px] font-bold rounded-md">
                  ENFORCED
                </span>
              </div>
              <p className="text-xs text-[#525a54]">
                Auto-throttles requests exceeding 2,500 rpm per IP subnet and isolates fraudulent bot fingerprints.
              </p>
              <div className="flex items-center justify-between text-xs font-bold text-[#012d1d] pt-1">
                <span>Threshold: 2,500 req/min</span>
                <span className="text-[#16a34a]">0 Threats Active</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Full Audit Log Explorer */}
      {activeSubTab === 'audit_explorer' && (
        <div className="bg-white rounded-2xl border border-[#c1c8c2]/80 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-2 border-b border-[#e5e9e6]">
            <div>
              <h3 className="font-heading font-bold text-sm text-[#012d1d]">
                Immutable Cryptographic Audit Trail Explorer
              </h3>
              <p className="text-xs text-[#717973]">
                Every administrative configuration change, role elevation, and end-user access is cryptographically signed
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-[#16a34a] bg-[#f0fdf4] px-2.5 py-1 rounded-lg border border-[#bbf7d0]">
                SHA-256 Chain Verified
              </span>
              <button
                type="button"
                onClick={handleExportAuditLogs}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#012d1d] hover:bg-[#1b4332] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#c1ecd4]" />
                <span>Export Dossier (JSON)</span>
              </button>
            </div>
          </div>

          {/* Audit Filters */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#717973] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search audit action, admin name, or specific details..."
                value={searchAuditQuery}
                onChange={(e) => setSearchAuditQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#f8faf8] border border-[#d8deda] rounded-xl text-xs text-[#012d1d] focus:outline-hidden focus:border-[#012d1d]"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#717973]" />
              <select
                value={auditCategoryFilter}
                onChange={(e) => setAuditCategoryFilter(e.target.value)}
                className="text-xs p-2 bg-[#f8faf8] border border-[#d8deda] rounded-xl text-[#012d1d] font-medium"
              >
                <option value="ALL">All Categories</option>
                <option value="AUTH">Auth & Roles</option>
                <option value="FREEZE">Emergency Freezes</option>
                <option value="FLAG">Feature Flags</option>
                <option value="KYC">KYC & Verification</option>
                <option value="EXPORT">Data Exports</option>
              </select>
            </div>
          </div>

          <div className="divide-y divide-[#e5e9e6]">
            {filteredAuditLogs.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#717973]">
                No audit entries match the specified filter criteria.
              </div>
            ) : (
              filteredAuditLogs.map((log) => (
                <div key={log.id} className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 hover:bg-[#f8faf8] p-2 rounded-xl transition-colors">
                  <div className="space-y-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-xs text-[#012d1d]">{log.actorName}</span>
                      <span className="text-[10px] font-bold px-2 py-0.2 bg-[#012d1d] text-[#c1ecd4] rounded-md font-mono">
                        {log.actorRole}
                      </span>
                      <span className="text-[10px] font-bold text-[#b45309] bg-[#fffbeb] px-2 py-0.2 rounded-md border border-[#fef3c7]">
                        {log.action}
                      </span>
                    </div>
                    <p className="text-xs text-[#525a54]">{log.details}</p>
                  </div>
                  <div className="text-right text-[11px] text-[#717973] font-mono shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} • {new Date(log.timestamp).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Freeze Confirmation Modal */}
      {freezeModalType && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-[#c1c8c2]">
            <div className="flex items-center gap-2.5 pb-2 border-b border-[#e5e9e6] text-[#ba1a1a]">
              <AlertOctagon className="w-6 h-6" />
              <h3 className="font-heading font-bold text-base text-[#410002]">
                Confirm Emergency Circuit Breaker Action
              </h3>
            </div>

            <p className="text-xs text-[#525a54]">
              You are about to toggle the emergency state for:
              <strong className="block text-[#012d1d] text-sm mt-1 uppercase">
                {freezeModalType === 'marketplace' && 'Nationwide Marketplace Trading'}
                {freezeModalType === 'wallet' && 'Escrow & Banking Settlement Gateways'}
                {freezeModalType === 'maintenance' && 'Full Platform Maintenance Gate'}
              </strong>
            </p>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#012d1d]">
                Mandatory Operational Justification (Required for Audit Log)
              </label>
              <textarea
                rows={3}
                required
                placeholder="e.g. CBN settlement gateway latency spike or scheduled database index re-clustering..."
                value={freezeReason}
                onChange={(e) => setFreezeReason(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-[#717973] rounded-xl text-[#012d1d]"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setFreezeModalType(null)}
                className="flex-1 py-2.5 border border-[#d8deda] text-[#525a54] font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeEmergencyAction}
                className="flex-1 py-2.5 bg-[#ba1a1a] hover:bg-[#93000a] text-white font-bold text-xs rounded-xl cursor-pointer shadow-xs"
              >
                Confirm Action
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Admin Modal */}
      {showAddAdminModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-[#c1c8c2]">
            <div className="flex justify-between items-center pb-2 border-b border-[#e5e9e6]">
              <h3 className="font-heading font-bold text-base text-[#012d1d]">
                {editingAdmin ? 'Edit Administrator Credentials' : 'Provision New Administrative Account'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowAddAdminModal(false);
                  setEditingAdmin(null);
                }}
                className="text-[#717973] hover:text-black cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAdmin} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#012d1d]">Full Official Name & Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Audu Ogbeh"
                  value={adminFormName}
                  onChange={(e) => setAdminFormName(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-[#717973] rounded-xl text-[#012d1d]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#012d1d]">Official Government / Institutional Email</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. a.ogbeh@fmafs.gov.ng"
                  value={adminFormEmail}
                  onChange={(e) => setAdminFormEmail(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-[#717973] rounded-xl text-[#012d1d]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#012d1d]">Role Tier</label>
                <select
                  value={adminFormRole}
                  onChange={(e) => setAdminFormRole(e.target.value as UserRole)}
                  className="w-full text-xs p-2.5 bg-white border border-[#717973] rounded-xl text-[#012d1d]"
                >
                  <option value="super_admin">Super Admin (USUCO Owner)</option>
                  <option value="gov_admin">Gov Admin (Federal Ministry / BOA)</option>
                  <option value="institutional_admin">Institutional Admin (State ADP Command)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#012d1d]">Department / Directorate</label>
                <input
                  type="text"
                  placeholder="e.g. Directorate of Agricultural Mechanisation"
                  value={adminFormDept}
                  onChange={(e) => setAdminFormDept(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-[#717973] rounded-xl text-[#012d1d]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#012d1d]">Jurisdiction</label>
                <input
                  type="text"
                  placeholder="e.g. National, Kano, Kaduna, Benue"
                  value={adminFormState}
                  onChange={(e) => setAdminFormState(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-[#717973] rounded-xl text-[#012d1d]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddAdminModal(false);
                    setEditingAdmin(null);
                  }}
                  className="flex-1 py-2.5 border border-[#d8deda] text-[#525a54] font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#012d1d] hover:bg-[#1b4332] text-white font-bold text-xs rounded-xl cursor-pointer shadow-xs"
                >
                  {editingAdmin ? 'Update Account' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mandatory Reason Logging Modal for User Inspection */}
      {selectedUserForInspection && (
        <ReasonLoggingModal
          isOpen={true}
          onClose={() => setSelectedUserForInspection(null)}
          targetUserName={selectedUserForInspection.name}
          targetUserRole={selectedUserForInspection.role}
          targetUserId={selectedUserForInspection.id}
          adminDepartment="USUCO Super Admin Tech Ops"
          recordType="Administrative Security Profile & 2FA Keyring"
          onConfirm={(reason) => {
            setSelectedUserForInspection(null);
            setActionSuccess(`Decrypted access logged in immutable audit trail for ${selectedUserForInspection.name}.`);
            setTimeout(() => setActionSuccess(null), 4000);
          }}
        />
      )}
    </div>
  );
};
export default SuperAdminDashboard;
