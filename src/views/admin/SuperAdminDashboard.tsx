import React, { useState } from 'react';
import {
  Shield,
  Activity,
  Users,
  Key,
  FileText,
  Sliders,
  BarChart3,
  AlertOctagon,
  RefreshCw,
  CheckCircle2,
  Lock,
  DollarSign,
  Layers,
  Radio,
  Server,
  Zap,
  Search,
  Bell,
  LogOut,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Globe,
  SlidersHorizontal,
  FileCode,
  Flame,
  UserCheck,
  Building,
  ArrowUpRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { ReasonLoggingModal } from '../../components/admin/ReasonLoggingModal';
import { User, UserRole } from '../../types';

// Sub-components for all 8 Core Pillars
import { SuperAdminHealthOverview } from './super/SuperAdminHealthOverview';
import { SuperAdminUserManagement } from './super/SuperAdminUserManagement';
import { SuperAdminAccessControl } from './super/SuperAdminAccessControl';
import { SuperAdminAuditSecurity } from './super/SuperAdminAuditSecurity';
import { SuperAdminPlatformConfig } from './super/SuperAdminPlatformConfig';
import { SuperAdminAnalyticsReporting } from './super/SuperAdminAnalyticsReporting';
import { SuperAdminEmergencyCenter } from './super/SuperAdminEmergencyCenter';
import { SuperAdminSystemLogs } from './super/SuperAdminSystemLogs';

export type MainTabType =
  | 'dashboard'
  | 'users'
  | 'access'
  | 'audit'
  | 'config'
  | 'analytics'
  | 'emergency'
  | 'logs';

export const SuperAdminDashboard: React.FC = () => {
  const { auditLogs, addAuditLog, usersList, setActiveView } = useApp();
  const { user, logout } = useAuth();

  // Navigation State (Active Pillar & Deep Sub-tab)
  const [activeTab, setActiveTab] = useState<MainTabType>('dashboard');
  const [subTab, setSubTab] = useState<string>('overview');

  // Sidebar Expansion State (For Collapsible Sub-menus)
  const [expandedSections, setExpandedSections] = useState<Record<MainTabType, boolean>>({
    dashboard: true,
    users: false,
    access: false,
    audit: false,
    config: false,
    analytics: false,
    emergency: false,
    logs: false,
  });

  // Mobile Drawer Toggle
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Top Bar Persistent State
  const [globalSearch, setGlobalSearch] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showEmergencyQuickModal, setShowEmergencyQuickModal] = useState(false);

  // Emergency & Global State
  const [marketplaceFrozen, setMarketplaceFrozen] = useState(false);
  const [walletFrozen, setWalletFrozen] = useState(false);
  const [maintenanceModeActive, setMaintenanceModeActive] = useState(false);
  const [rateLimiterActive, setRateLimiterActive] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // NDPR Modal for User Inspection
  const [inspectingUser, setInspectingUser] = useState<User | null>(null);

  // Dynamic Feature Flags
  const [featureFlags, setFeatureFlags] = useState([
    {
      id: 'flag_marketplace',
      name: 'Inter-State Produce Marketplace Engine',
      enabled: true,
      category: 'Trade & Commerce',
      desc: 'Enables produce discovery, spot pricing, and buyer bid matching nationwide.',
      rolloutScope: 'National' as const,
    },
    {
      id: 'flag_escrow_settlement',
      name: 'NIBSS / Commercial Escrow Auto-Settlement Bridge',
      enabled: true,
      category: 'Banking & Payments',
      desc: 'Automatic clearing of funds upon verified delivery confirmation.',
      rolloutScope: 'National' as const,
    },
    {
      id: 'flag_boa_credit',
      name: 'Bank of Agriculture (BOA) 5% Loan Underwriting',
      enabled: true,
      category: 'Agricultural Finance',
      desc: 'Direct digital application and biometric loan disbursement for smallholders.',
      rolloutScope: 'Pilot States' as const,
      pilotStates: ['Kaduna', 'Kano', 'Benue', 'Niger', 'Oyo'],
    },
    {
      id: 'flag_ai_agronomist',
      name: 'AI Agronomist & Crop Disease Diagnostic Vision',
      enabled: true,
      category: 'Advisory & Extension',
      desc: 'Gemini crop disease leaf scan and vernacular voice guidance.',
      rolloutScope: 'National' as const,
    },
    {
      id: 'flag_ussd_gateway',
      name: 'Offline USSD (*384*247#) SMS Fallback Engine',
      enabled: true,
      category: 'Rural Telecom Ingress',
      desc: 'Enables basic phone offline trading via MTN/Airtel/Glo telco aggregates.',
      rolloutScope: 'National' as const,
    },
    {
      id: 'flag_gmp_monitoring',
      name: 'Guaranteed Minimum Price (GMP) Compliance Engine',
      enabled: true,
      category: 'Market Regulation',
      desc: 'Detects predatory off-taking below national statutory price floors.',
      rolloutScope: 'National' as const,
    },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const toggleSection = (tab: MainTabType) => {
    setExpandedSections((prev) => ({ ...prev, [tab]: !prev[tab] }));
  };

  const handleNavigate = (main: MainTabType, sub: string) => {
    setActiveTab(main);
    setSubTab(sub);
    setExpandedSections((prev) => ({ ...prev, [main]: true }));
    setSidebarOpen(false);
  };

  // 1. Purge Edge Cache
  const handlePurgeCache = () => {
    addAuditLog(
      user?.name || 'Engr. Tariq Abubakar',
      (user?.role as UserRole) || 'super_admin',
      'CACHE_PURGE_EXECUTED',
      'Flushed all 36-state Edge Redis layers and static CDN cache.'
    );
    showToast('Edge Redis cache successfully purged across all national availability zones.');
  };

  // 2. Feature Flags
  const handleToggleFlag = (id: string) => {
    setFeatureFlags((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          const next = !f.enabled;
          addAuditLog(
            user?.name || 'Engr. Tariq Abubakar',
            (user?.role as UserRole) || 'super_admin',
            'FEATURE_FLAG_MODIFIED',
            `Toggled flag "${f.name}" to ${next ? 'ENABLED' : 'DISABLED'}.`
          );
          return { ...f, enabled: next };
        }
        return f;
      })
    );
    showToast('Feature flag state updated and broadcast via Redis pub/sub.');
  };

  // 3. User CRUD actions
  const handleAddUser = (newU: Partial<User>) => {
    addAuditLog(
      user?.name || 'Engr. Tariq Abubakar',
      (user?.role as UserRole) || 'super_admin',
      'USER_PROVISIONED',
      `Provisioned new user "${newU.name}" with role ${newU.role} in ${newU.state}.`
    );
    showToast(`User ${newU.name} created successfully.`);
  };

  const handleUpdateUser = (id: string, updates: Partial<User>) => {
    addAuditLog(
      user?.name || 'Engr. Tariq Abubakar',
      (user?.role as UserRole) || 'super_admin',
      'USER_MODIFIED',
      `Updated user record #${id} (${updates.name || 'Citizen'}).`
    );
    showToast('User record updated.');
  };

  const handleDeleteUser = (id: string) => {
    addAuditLog(
      user?.name || 'Engr. Tariq Abubakar',
      (user?.role as UserRole) || 'super_admin',
      'USER_EXPUNGED',
      `Expunged user record #${id} from platform registry.`
    );
    showToast(`User #${id} removed.`);
  };

  const handleBulkVerify = (ids: string[]) => {
    addAuditLog(
      user?.name || 'Engr. Tariq Abubakar',
      (user?.role as UserRole) || 'super_admin',
      'BULK_KYC_VERIFICATION',
      `Bulk approved Tier-2 biometric NIN verification for ${ids.length} citizens.`
    );
    showToast(`Bulk verified ${ids.length} users.`);
  };

  const handleBulkSuspend = (ids: string[]) => {
    addAuditLog(
      user?.name || 'Engr. Tariq Abubakar',
      (user?.role as UserRole) || 'super_admin',
      'BULK_USER_SUSPENSION',
      `Suspended platform access for ${ids.length} accounts.`
    );
    showToast(`Suspended ${ids.length} users.`);
  };

  const handleBulkExport = (users: User[]) => {
    addAuditLog(
      user?.name || 'Engr. Tariq Abubakar',
      (user?.role as UserRole) || 'super_admin',
      'USER_DATASET_EXPORT',
      `Exported ${users.length} user records with cryptographic signature.`
    );
    showToast(`Exported ${users.length} records to secure CSV.`);
  };

  // 4. Session Termination
  const handleTerminateSession = (sessId: string) => {
    addAuditLog(
      user?.name || 'Engr. Tariq Abubakar',
      (user?.role as UserRole) || 'super_admin',
      'SESSION_TERMINATED',
      `Revoked active JWT session token #${sessId}.`
    );
    showToast('Session terminated.');
  };

  const handleTerminateAllSessions = () => {
    addAuditLog(
      user?.name || 'Engr. Tariq Abubakar',
      (user?.role as UserRole) || 'super_admin',
      'GLOBAL_SESSION_FLUSH',
      'Terminated all non-Super Admin active sessions across 36 states.'
    );
    showToast('All user sessions revoked. Force re-authentication requested.');
  };

  // 5. Audit Dossier Export
  const handleExportAuditDossier = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `USUCO_AGRO_CRYPTO_AUDIT_${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    addAuditLog(
      user?.name || 'Engr. Tariq Abubakar',
      (user?.role as UserRole) || 'super_admin',
      'AUDIT_DOSSIER_DOWNLOADED',
      'Exported full SHA-256 verified cryptographic audit ledger.'
    );
    showToast('Audit dossier JSON downloaded.');
  };

  // 6. Platform Config Save
  const handleSaveConfig = (section: string, data: any) => {
    addAuditLog(
      user?.name || 'Engr. Tariq Abubakar',
      (user?.role as UserRole) || 'super_admin',
      'PLATFORM_CONFIG_UPDATED',
      `Updated platform configuration for section: ${section.toUpperCase()}.`
    );
    showToast(`Platform settings for [${section}] committed to sovereign ledger.`);
  };

  // 7. Emergency Actions
  const handleToggleMarketplaceFreeze = (frozen: boolean, reason: string) => {
    setMarketplaceFrozen(frozen);
    addAuditLog(
      user?.name || 'Engr. Tariq Abubakar',
      (user?.role as UserRole) || 'super_admin',
      frozen ? 'EMERGENCY_FREEZE_MARKETPLACE' : 'EMERGENCY_UNFREEZE_MARKETPLACE',
      `Marketplace trading ${frozen ? 'FROZEN' : 'UNFROZEN'}. Operational Justification: "${reason}"`
    );
    showToast(`Marketplace trading ${frozen ? 'FROZEN' : 'RESTORED'}.`);
  };

  const handleToggleWalletFreeze = (frozen: boolean, reason: string) => {
    setWalletFrozen(frozen);
    addAuditLog(
      user?.name || 'Engr. Tariq Abubakar',
      (user?.role as UserRole) || 'super_admin',
      frozen ? 'EMERGENCY_FREEZE_WALLET' : 'EMERGENCY_UNFREEZE_WALLET',
      `Wallet & Escrow payouts ${frozen ? 'FROZEN' : 'UNFROZEN'}. Operational Justification: "${reason}"`
    );
    showToast(`Wallet & Escrow disbursements ${frozen ? 'FROZEN' : 'RESTORED'}.`);
  };

  const handleToggleMaintenanceMode = (active: boolean, reason: string) => {
    setMaintenanceModeActive(active);
    addAuditLog(
      user?.name || 'Engr. Tariq Abubakar',
      (user?.role as UserRole) || 'super_admin',
      active ? 'MAINTENANCE_MODE_ENABLED' : 'MAINTENANCE_MODE_DISABLED',
      `Platform maintenance gate ${active ? 'ACTIVATED' : 'DEACTIVATED'}. Reason: "${reason}"`
    );
    showToast(`Maintenance mode ${active ? 'ENABLED' : 'DISABLED'}.`);
  };

  const handleToggleRateLimiter = (active: boolean) => {
    setRateLimiterActive(active);
    addAuditLog(
      user?.name || 'Engr. Tariq Abubakar',
      (user?.role as UserRole) || 'super_admin',
      'RATE_LIMITER_MODIFIED',
      `Adaptive DDoS rate limiter ${active ? 'ENABLED' : 'DISABLED'}.`
    );
    showToast(`Rate limiter ${active ? 'ENABLED' : 'DISABLED'}.`);
  };

  const handleSendEmergencyBroadcast = (
    title: string,
    message: string,
    targetRoles: string[],
    channels: string[]
  ) => {
    addAuditLog(
      user?.name || 'Engr. Tariq Abubakar',
      (user?.role as UserRole) || 'super_admin',
      'EMERGENCY_BROADCAST_TRANSMITTED',
      `Emergency Broadcast: "${title}" transmitted to [${targetRoles.join(', ')}] via [${channels.join(', ')}].`
    );
    showToast('Emergency alert transmitted nationwide.');
  };

  const handleGenerateReport = (config: any) => {
    addAuditLog(
      user?.name || 'Engr. Tariq Abubakar',
      (user?.role as UserRole) || 'super_admin',
      'REPORT_COMPILED',
      `Compiled official report: ${config.reportType} (${config.dateRange}, ${config.exportFormat}).`
    );
  };

  const confirmNDPRInspection = (reason: string, category: string) => {
    if (!inspectingUser) return;
    addAuditLog(
      user?.name || 'Engr. Tariq Abubakar',
      (user?.role as UserRole) || 'super_admin',
      'NDPR_RECORD_INSPECTED',
      `Inspected citizen data for ${inspectingUser.name} (${inspectingUser.phone}). Category: ${category}. Stated Reason: "${reason}"`
    );
    showToast(`NDPR justification logged. Viewing ${inspectingUser.name}.`);
    setInspectingUser(null);
  };

  // Structured Sidebar Navigation Definition
  const sidebarItems = [
    {
      id: 'dashboard' as MainTabType,
      label: 'Dashboard',
      icon: Activity,
      subItems: [
        { id: 'overview', label: 'System Health Overview' },
        { id: 'metrics', label: 'Key Platform Metrics' },
        { id: 'alerts', label: 'Critical Alerts' },
      ],
    },
    {
      id: 'users' as MainTabType,
      label: 'Users & Roles',
      icon: Users,
      badge: `${usersList.length}`,
      subItems: [
        { id: 'all', label: 'All Users' },
        { id: 'roles', label: 'Role Management' },
        { id: 'bulk', label: 'Bulk Actions' },
        { id: 'activity', label: 'User Activity Log' },
      ],
    },
    {
      id: 'access' as MainTabType,
      label: 'Access Control',
      icon: Key,
      subItems: [
        { id: 'matrix', label: 'Permission Matrix' },
        { id: 'flags', label: 'Feature Flags' },
        { id: 'sessions', label: 'Active Sessions' },
        { id: 'security', label: 'Security Settings' },
      ],
    },
    {
      id: 'audit' as MainTabType,
      label: 'Audit & Security',
      icon: Shield,
      subItems: [
        { id: 'full_audit', label: 'Full Audit Log' },
        { id: 'security_events', label: 'Security Events' },
        { id: 'data_access', label: 'Data Access Logs' },
        { id: 'suspicious', label: 'Suspicious Activity' },
      ],
    },
    {
      id: 'config' as MainTabType,
      label: 'Platform Configuration',
      icon: Sliders,
      subItems: [
        { id: 'system', label: 'System Settings' },
        { id: 'payments', label: 'Payment & Wallet Config' },
        { id: 'notifications', label: 'Notifications' },
        { id: 'content', label: 'Languages & Content' },
      ],
    },
    {
      id: 'analytics' as MainTabType,
      label: 'Analytics & Reports',
      icon: BarChart3,
      subItems: [
        { id: 'global', label: 'Global Analytics' },
        { id: 'builder', label: 'Custom Report Builder' },
        { id: 'export', label: 'Export Centre' },
      ],
    },
    {
      id: 'emergency' as MainTabType,
      label: 'Emergency Controls',
      icon: AlertOctagon,
      isDanger: true,
      badge: (marketplaceFrozen || walletFrozen || maintenanceModeActive) ? 'ACTIVE' : undefined,
      subItems: [
        { id: 'freeze_marketplace', label: 'Freeze Marketplace' },
        { id: 'freeze_wallet', label: 'Freeze Wallet / Payments' },
        { id: 'broadcast', label: 'Emergency Broadcast' },
        { id: 'maintenance', label: 'Maintenance Mode' },
      ],
    },
    {
      id: 'logs' as MainTabType,
      label: 'System Logs',
      icon: FileCode,
      subItems: [
        { id: 'app', label: 'Application Logs' },
        { id: 'api', label: 'API & USSD Logs' },
        { id: 'errors', label: 'Error Tracker' },
      ],
    },
  ];

  // Notification items for Top Bar
  const sampleNotifications = [
    { id: '1', title: 'High USSD Volume Detected', time: '4m ago', type: 'info', desc: 'Sokoto node registered 1,200 SMS pings/min.' },
    { id: '2', title: 'Unusual IP Range Ping', time: '18m ago', type: 'warn', desc: 'Blocked 4 rapid login attempts on Port 443.' },
    { id: '3', title: 'BOA Batch Settlement Cleared', time: '42m ago', type: 'success', desc: '₦142.5M disbursed to 348 cooperatives.' },
  ];

  return (
    <div className="min-h-screen bg-[#070b09] text-[#e2e8e4] flex flex-col font-sans selection:bg-[#10b981]/30 selection:text-[#34d399]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 bg-[#064e3b] text-[#6ee7b7] border border-[#10b981]/50 rounded-2xl shadow-2xl flex items-center gap-2.5 font-bold text-xs animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. PERSISTENT TOP BAR                                                     */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-[#0c1310] border-b border-[#1b2b22] px-4 sm:px-6 py-3 shadow-md flex items-center justify-between gap-4">
        {/* Left Side: Mobile Menu + Super Admin Brand Badge */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-xl bg-[#131d18] hover:bg-[#1b2b22] text-[#8fa89b] hover:text-white transition-colors cursor-pointer border border-[#1b2b22]"
            aria-label="Toggle Sidebar"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#10b981] text-[#0a0f0d] flex items-center justify-center font-black shadow-md shadow-[#10b981]/20">
              <Shield className="w-4 h-4 text-[#0a0f0d]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-white tracking-tight">USUCO AGRO-CONNECT</span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#10b981]/20 text-[#34d399] border border-[#10b981]/30">
                  SUPER ADMIN
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono text-[#8fa89b] bg-[#131d18] border border-[#1b2b22]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                  ROOT LEVEL 0
                </span>
              </div>
              <div className="text-[11px] text-[#8fa89b] hidden md:block">
                Federal Ministry of Agriculture & Food Security • Sovereign Cloud Control
              </div>
            </div>
          </div>
        </div>

        {/* Middle: Global Search Input */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8fa89b]" />
            <input
              type="text"
              placeholder="Search users, audit logs, feature flags, system parameters..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-[#070b09] border border-[#1b2b22] rounded-xl text-xs text-white placeholder-[#587063] focus:outline-hidden focus:border-[#10b981] transition-all"
            />
            {globalSearch && (
              <button
                type="button"
                onClick={() => setGlobalSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8fa89b] hover:text-white text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Quick Actions, Alerts, Emergency, Profile */}
        <div className="flex items-center gap-2.5">
          {/* Quick Emergency Kill Button */}
          <button
            type="button"
            onClick={() => handleNavigate('emergency', 'freeze_marketplace')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
              marketplaceFrozen || walletFrozen || maintenanceModeActive
                ? 'bg-[#ef4444] text-white animate-pulse shadow-[#ef4444]/30'
                : 'bg-[#2a1313] hover:bg-[#3f1919] text-[#f87171] border border-[#7f1d1d]'
            }`}
            title="Emergency Control Center"
          >
            <AlertOctagon className="w-4 h-4" />
            <span className="hidden sm:inline">Emergency Controls</span>
          </button>

          {/* System Status Pill */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-[#131d18] border border-[#1b2b22] rounded-xl text-[11px] font-mono text-[#8fa89b]">
            <span className="w-2 h-2 rounded-full bg-[#10b981]" />
            <span>99.98% OK</span>
          </div>

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl bg-[#131d18] hover:bg-[#1b2b22] text-[#8fa89b] hover:text-white transition-colors relative cursor-pointer border border-[#1b2b22]"
              title="System Alerts & Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#10b981] rounded-full ring-2 ring-[#0c1310]" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-[#0c1310] border border-[#1b2b22] rounded-2xl shadow-2xl p-3 space-y-2 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-[#1b2b22]">
                  <span className="text-xs font-bold text-white">System Security Alerts</span>
                  <span className="text-[10px] text-[#34d399] font-mono">3 New</span>
                </div>
                <div className="divide-y divide-[#1b2b22] text-xs">
                  {sampleNotifications.map((n) => (
                    <div key={n.id} className="py-2 space-y-0.5">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[#e2e8e4] text-[11px]">{n.title}</span>
                        <span className="text-[9px] text-[#8fa89b]">{n.time}</span>
                      </div>
                      <p className="text-[10px] text-[#8fa89b] leading-tight">{n.desc}</p>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowNotifications(false);
                    handleNavigate('audit', 'security_events');
                  }}
                  className="w-full py-1.5 text-center bg-[#131d18] hover:bg-[#1b2b22] text-[#34d399] rounded-xl text-[11px] font-bold transition-colors cursor-pointer"
                >
                  View All Security Events
                </button>
              </div>
            )}
          </div>

          {/* Profile & Switch Portal */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1.5 pl-2 rounded-xl bg-[#131d18] hover:bg-[#1b2b22] border border-[#1b2b22] transition-colors cursor-pointer"
            >
              <div className="w-6 h-6 rounded-lg bg-[#10b981]/20 text-[#10b981] flex items-center justify-center font-bold text-xs">
                {user?.name?.[0] || 'T'}
              </div>
              <span className="text-xs font-bold text-white hidden sm:inline max-w-[100px] truncate">
                {user?.name?.split(' ')[0] || 'Tariq'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#8fa89b]" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-[#0c1310] border border-[#1b2b22] rounded-2xl shadow-2xl p-2 space-y-1 z-50 text-xs">
                <div className="px-3 py-2 border-b border-[#1b2b22]">
                  <div className="font-bold text-white truncate">{user?.name || 'Engr. Tariq Abubakar'}</div>
                  <div className="text-[10px] text-[#8fa89b] font-mono">tariq.abubakar@fmafs.gov.ng</div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    setActiveView('admin_department_select');
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-[#131d18] text-[#e2e8e4] rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Building className="w-4 h-4 text-[#10b981]" />
                  <span>Switch Admin Department</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    handleNavigate('config', 'system');
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-[#131d18] text-[#e2e8e4] rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Sliders className="w-4 h-4 text-[#8fa89b]" />
                  <span>System Preferences</span>
                </button>

                <div className="pt-1 border-t border-[#1b2b22]">
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-[#2a1313] text-[#ef4444] rounded-xl flex items-center gap-2 cursor-pointer transition-colors font-bold"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. BODY LAYOUT: SIDEBAR + MAIN CONTENT AREA                              */}
      {/* ========================================================================= */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 top-[57px] z-30 w-72 bg-[#0c1310] border-r border-[#1b2b22] flex flex-col transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Sidebar Navigation Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-1.5 scrollbar-thin scrollbar-thumb-[#1b2b22]">
            <div className="px-3 pb-2 text-[10px] font-mono font-bold uppercase tracking-wider text-[#587063]">
              Super Admin Core Navigation
            </div>

            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id;
              const isExpanded = expandedSections[item.id];

              return (
                <div key={item.id} className="space-y-0.5">
                  <div
                    onClick={() => {
                      if (!isSelected) {
                        handleNavigate(item.id, item.subItems[0].id);
                      } else {
                        toggleSection(item.id);
                      }
                    }}
                    className={`group w-full px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? item.isDanger
                          ? 'bg-[#ef4444] text-white shadow-md'
                          : 'bg-[#10b981] text-[#0a0f0d] shadow-md shadow-[#10b981]/20 font-extrabold'
                        : 'text-[#8fa89b] hover:bg-[#131d18] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 shrink-0 ${isSelected ? (item.isDanger ? 'text-white' : 'text-[#0a0f0d]') : item.isDanger ? 'text-[#ef4444]' : 'text-[#8fa89b] group-hover:text-white'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span
                          className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                            isSelected
                              ? 'bg-black/30 text-white'
                              : item.isDanger
                              ? 'bg-[#ef4444]/20 text-[#ef4444]'
                              : 'bg-[#1b2b22] text-[#34d399]'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSection(item.id);
                        }}
                        className="p-0.5 hover:opacity-80 cursor-pointer"
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Sub-items (Tree View) */}
                  {isExpanded && (
                    <div className="pl-6 pr-1 py-1 space-y-0.5 border-l-2 border-[#1b2b22] ml-4 my-0.5">
                      {item.subItems.map((sub) => {
                        const isSubActive = isSelected && subTab === sub.id;
                        return (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() => handleNavigate(item.id, sub.id)}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] flex items-center justify-between transition-colors cursor-pointer ${
                              isSubActive
                                ? 'text-[#34d399] font-bold bg-[#131d18] border border-[#1b2b22]'
                                : 'text-[#8fa89b] hover:text-white hover:bg-[#131d18]/50'
                            }`}
                          >
                            <span className="truncate">{sub.label}</span>
                            {isSubActive && <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick System Diagnostics Footer in Sidebar */}
          <div className="p-3 bg-[#080d0a] border-t border-[#1b2b22] space-y-2 text-[11px] font-mono">
            <div className="flex justify-between text-[#8fa89b]">
              <span>Edge Nodes:</span>
              <span className="text-[#34d399] font-bold">36 / 36 Active</span>
            </div>
            <div className="flex justify-between text-[#8fa89b]">
              <span>Escrow Liquidity:</span>
              <span className="text-white font-bold">₦14.82B</span>
            </div>
            <button
              type="button"
              onClick={handlePurgeCache}
              className="w-full py-1.5 bg-[#131d18] hover:bg-[#1b2b22] text-[#8fa89b] hover:text-white rounded-lg flex items-center justify-center gap-1.5 border border-[#1b2b22] transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Purge Edge Cache</span>
            </button>
          </div>
        </aside>

        {/* Backdrop for mobile drawer */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-20 bg-black/60 backdrop-blur-xs lg:hidden"
          />
        )}

        {/* Main Workspace Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Active View Header */}
          <div className="bg-[#0f1713] border border-[#1b2b22] rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 relative z-10">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 bg-[#10b981] text-[#0a0f0d] font-mono font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-xs">
                    USUCO Sovereign Platform Control
                  </span>
                  <span className="px-2.5 py-0.5 bg-[#1b2b22] text-[#34d399] font-mono text-xs font-bold rounded-lg border border-[#2d4738] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                    Live Cluster Root
                  </span>
                  {(marketplaceFrozen || walletFrozen || maintenanceModeActive) && (
                    <span className="px-2.5 py-0.5 bg-[#7f1d1d] text-white font-mono text-xs font-bold rounded-lg border border-[#991b1b] flex items-center gap-1 animate-pulse">
                      <AlertOctagon className="w-3.5 h-3.5" />
                      <span>EMERGENCY FREEZE ACTIVE</span>
                    </span>
                  )}
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight pt-1">
                  {activeTab === 'dashboard' && 'National Platform Health & Telemetry'}
                  {activeTab === 'users' && 'Global User & Administrative Authority Matrix'}
                  {activeTab === 'access' && 'Access Control, Feature Flags & Active Sessions'}
                  {activeTab === 'audit' && 'Cryptographic Audit Trail & Security Ledger'}
                  {activeTab === 'config' && 'Sovereign Platform Configuration & Parameter Store'}
                  {activeTab === 'analytics' && 'Macro Agricultural Analytics & Policy Reporting'}
                  {activeTab === 'emergency' && 'Emergency Kill Switches & National Broadcast Terminal'}
                  {activeTab === 'logs' && 'Platform Application, API & Error Logs'}
                </h1>
                <p className="text-xs sm:text-sm text-[#8fa89b]">
                  Federal Ministry of Agriculture & Food Security • USUCO Agro-Connect Infrastructure
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <div className="px-3 py-2 bg-[#0a0f0d] border border-[#1b2b22] rounded-xl text-center">
                  <div className="text-[10px] text-[#8fa89b]">Active Section</div>
                  <div className="font-bold text-[#10b981] uppercase">{activeTab}</div>
                </div>
                <div className="px-3 py-2 bg-[#0a0f0d] border border-[#1b2b22] rounded-xl text-center">
                  <div className="text-[10px] text-[#8fa89b]">Current Focus</div>
                  <div className="font-bold text-[#34d399] uppercase">{subTab}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Pillar Workspace Content Component Rendering */}
          <div className="space-y-6">
            {activeTab === 'dashboard' && (
              <SuperAdminHealthOverview
                onPurgeCache={handlePurgeCache}
                subTab={subTab as any}
                onSubTabChange={(st) => setSubTab(st)}
              />
            )}

            {activeTab === 'users' && (
              <SuperAdminUserManagement
                usersList={usersList}
                onAddUser={handleAddUser}
                onUpdateUser={handleUpdateUser}
                onDeleteUser={handleDeleteUser}
                onInspectUser={(u) => setInspectingUser(u)}
                onBulkVerify={handleBulkVerify}
                onBulkSuspend={handleBulkSuspend}
                onBulkExport={handleBulkExport}
                subTab={subTab as any}
                onSubTabChange={(st) => setSubTab(st)}
              />
            )}

            {activeTab === 'access' && (
              <SuperAdminAccessControl
                featureFlags={featureFlags}
                onToggleFlag={handleToggleFlag}
                onTerminateSession={handleTerminateSession}
                onTerminateAllSessions={handleTerminateAllSessions}
                subTab={subTab as any}
                onSubTabChange={(st) => setSubTab(st)}
              />
            )}

            {activeTab === 'audit' && (
              <SuperAdminAuditSecurity
                auditLogs={auditLogs}
                onExportAuditDossier={handleExportAuditDossier}
                subTab={subTab as any}
                onSubTabChange={(st) => setSubTab(st)}
              />
            )}

            {activeTab === 'config' && (
              <SuperAdminPlatformConfig
                onSaveConfig={handleSaveConfig}
                subTab={subTab as any}
                onSubTabChange={(st) => setSubTab(st)}
              />
            )}

            {activeTab === 'analytics' && (
              <SuperAdminAnalyticsReporting
                onGenerateReport={handleGenerateReport}
                subTab={subTab as any}
                onSubTabChange={(st) => setSubTab(st)}
              />
            )}

            {activeTab === 'emergency' && (
              <SuperAdminEmergencyCenter
                marketplaceFrozen={marketplaceFrozen}
                walletFrozen={walletFrozen}
                maintenanceModeActive={maintenanceModeActive}
                rateLimiterActive={rateLimiterActive}
                onToggleMarketplaceFreeze={handleToggleMarketplaceFreeze}
                onToggleWalletFreeze={handleToggleWalletFreeze}
                onToggleMaintenanceMode={handleToggleMaintenanceMode}
                onToggleRateLimiter={handleToggleRateLimiter}
                onSendEmergencyBroadcast={handleSendEmergencyBroadcast}
                subTab={subTab as any}
                onSubTabChange={(st) => setSubTab(st)}
              />
            )}

            {activeTab === 'logs' && (
              <SuperAdminSystemLogs
                subTab={subTab as any}
                onSubTabChange={(st) => setSubTab(st)}
              />
            )}
          </div>
        </main>
      </div>

      {/* NDPR Reason Logging Modal for Sensitive User Data Access */}
      {inspectingUser && (
        <ReasonLoggingModal
          isOpen={!!inspectingUser}
          targetUserName={inspectingUser.name}
          targetUserRole={inspectingUser.role}
          targetUserId={inspectingUser.id}
          adminDepartment="Platform Infrastructure & Security (USUCO)"
          onClose={() => setInspectingUser(null)}
          onConfirm={confirmNDPRInspection}
        />
      )}
    </div>
  );
};
