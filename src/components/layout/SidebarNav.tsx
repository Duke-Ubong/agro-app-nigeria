import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { ROLE_LABELS } from '../common/RoleSwitcher';
import { getNigerianAvatar } from '../../utils/avatarUtils';

interface SidebarNavProps {
  onCloseMobile?: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({ onCloseMobile }) => {
  const { activeView, setActiveView, orders, listings, adminTab, setAdminTab } = useApp();
  const { user, role } = useAuth();

  const isSuperAdmin = role === 'super_admin';
  const isGovAdmin = role === 'gov_admin';
  const isInstAdmin = role === 'institutional_admin';
  const isAdmin = isSuperAdmin || isGovAdmin || isInstAdmin;

  const roleInfo = ROLE_LABELS[role];

  // ==========================================
  // SUPER ADMIN SPECIFIC SIDEBAR RENDER
  // ==========================================
  if (isSuperAdmin && activeView === 'admin') {
    const superAdminNavItems = [
      { section: 'Dashboard', items: [{ id: 'super_admin', label: 'System Health Overview', icon: 'monitor_heart' }, { id: 'sa_metrics', label: 'Key Platform Metrics', icon: 'analytics' }, { id: 'sa_alerts', label: 'Critical Alerts', icon: 'warning' }] },
      { section: 'Users & Roles', items: [{ id: 'users', label: 'All Users', icon: 'group' }, { id: 'sa_role_mgmt', label: 'Role Management', icon: 'manage_accounts' }, { id: 'sa_bulk_actions', label: 'Bulk Actions', icon: 'checklist' }, { id: 'sa_user_logs', label: 'User Activity Log', icon: 'history' }] },
      { section: 'Access Control', items: [{ id: 'sa_perm_matrix', label: 'Permission Matrix', icon: 'key' }, { id: 'sa_feature_flags', label: 'Feature Flags', icon: 'toggle_on' }, { id: 'sa_active_sessions', label: 'Active Sessions', icon: 'sensors' }, { id: 'sa_security', label: 'Security Settings', icon: 'security' }] },
      { section: 'Audit & Security', items: [{ id: 'sa_audit_log', label: 'Full Audit Log', icon: 'plagiarism' }, { id: 'sa_security_events', label: 'Security Events', icon: 'policy' }, { id: 'sa_data_access', label: 'Data Access Logs', icon: 'database' }, { id: 'sa_suspicious', label: 'Suspicious Activity', icon: 'gpp_maybe' }] },
      { section: 'Platform Configuration', items: [{ id: 'sa_sys_settings', label: 'System Settings', icon: 'settings' }, { id: 'sa_payment_config', label: 'Payment & Wallet Config', icon: 'account_balance' }, { id: 'sa_notifications', label: 'Notifications', icon: 'notifications_active' }, { id: 'sa_lang_content', label: 'Languages & Content', icon: 'translate' }] },
      { section: 'Analytics & Reports', items: [{ id: 'sa_global_analytics', label: 'Global Analytics', icon: 'monitoring' }, { id: 'sa_report_builder', label: 'Custom Report Builder', icon: 'bar_chart' }, { id: 'sa_export', label: 'Export Centre', icon: 'download' }] },
      { section: 'Emergency Controls', items: [{ id: 'sa_freeze_market', label: 'Freeze Marketplace', icon: 'block' }, { id: 'sa_freeze_wallet', label: 'Freeze Wallet / Payments', icon: 'credit_card_off' }, { id: 'sa_emerg_broadcast', label: 'Emergency Broadcast', icon: 'campaign' }, { id: 'sa_maintenance', label: 'Maintenance Mode', icon: 'build_circle' }] },
      { section: 'System Logs', items: [{ id: 'sa_app_logs', label: 'Application Logs', icon: 'terminal' }, { id: 'sa_api_logs', label: 'API Logs', icon: 'api' }, { id: 'sa_error_tracker', label: 'Error Tracker', icon: 'bug_report' }] },
    ];

    const handleSaSelect = (id: string) => {
      setAdminTab(id);
      if (onCloseMobile) onCloseMobile();
    };

    return (
      <div className="w-full bg-[#0a0f18] text-[#f1f5f9] rounded-2xl border border-[#1e293b] p-4 shadow-2xl flex flex-col h-[calc(100vh-8rem)] overflow-y-auto no-scrollbar sticky top-20 font-body selection:bg-[#10b981]/30 selection:text-[#a7f3d0]">
        {/* Super Admin Profile Card */}
        <div className="p-3.5 bg-[#111927] rounded-xl border border-[#1e293b] mb-4 space-y-2.5">
          <div className="flex items-center gap-3">
            <img
              src={user.photoUrl || getNigerianAvatar(user.name)}
              alt={user.name}
              className="w-11 h-11 rounded-full object-cover border-2 border-emerald-500/50"
            />
            <div className="overflow-hidden min-w-0 flex-1">
              <h3 className="font-heading font-bold text-sm text-white truncate">{user.name}</h3>
              <p className="text-[11px] text-emerald-400 font-bold truncate tracking-wide uppercase">Super Admin</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] pt-2 border-t border-[#1e293b]">
            <span className="text-[#64748b] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Ops
            </span>
            <span className="font-bold text-white px-2 py-0.5 rounded-md bg-[#1e293b] border border-[#334155]">SYS-01</span>
          </div>
        </div>

        {/* Navigation Portals */}
        <button
            onClick={() => setActiveView('dashboard')}
            className="mb-4 w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-950/30 hover:bg-emerald-900/50 border border-emerald-500/20 flex items-center gap-2 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Exit to Standard App
        </button>

        <div className="space-y-5">
          {superAdminNavItems.map((group, idx) => (
            <div key={idx} className="space-y-1">
              <div className="px-2 py-1 text-[10px] font-extrabold text-[#64748b] uppercase tracking-widest border-b border-[#1e293b] pb-1.5 mb-2">
                {group.section}
              </div>
              {group.items.map((item) => {
                const isActive = adminTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSaSelect(item.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-800 to-teal-800 text-white shadow-md shadow-emerald-950/60 border border-emerald-500/40'
                        : 'text-[#94a3b8] hover:text-white hover:bg-[#1e293b]'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[18px] shrink-0 ${isActive ? 'text-emerald-300' : 'text-[#64748b]'}`}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ==========================================
  // STANDARD SIDEBAR RENDER
  // ==========================================
  const myOrdersCount = orders.filter(
    (o) => o.buyerId === user.id || o.sellerId === user.id || o.transporterId === user.id
  ).length;

  const myListingsCount = listings.filter((l) => l.sellerId === user.id).length;

  const navItems = [
    { id: 'dashboard', label: 'My Farm Dashboard', icon: 'dashboard' },
    { id: 'marketplace', label: 'Produce Market (Buy & Sell)', icon: 'storefront', badge: `${listings.length}` },
    { id: 'wallet', label: 'My Wallet & Safe Pay', icon: 'account_balance_wallet' },
    { id: 'credit', label: 'Farm Loans & Credit', icon: 'payments' },
    { id: 'orders', label: 'My Orders & Deliveries', icon: 'local_shipping', badge: myOrdersCount > 0 ? `${myOrdersCount}` : undefined },
    { id: 'advisory', label: 'Farming Tips & Weather', icon: 'agriculture' },
    { id: 'profile', label: 'My Profile & NIN', icon: 'person' },
  ];

  if (isAdmin) {
    navItems.unshift({ id: 'admin', label: 'National Admin Portal', icon: 'admin_panel_settings', badge: 'Admin' });
  }

  const handleSelect = (id: string) => {
    setActiveView(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-[#c1c8c2]/70 p-4 shadow-xs flex flex-col h-fit sticky top-20">
      {/* User Profile Card */}
      <div className="p-3.5 bg-[#f9fbf9] rounded-xl border border-[#e2e8e4] mb-3 space-y-2.5">
        <div className="flex items-center gap-3">
          <img
            src={user.photoUrl || getNigerianAvatar(user.name)}
            alt={user.name}
            className="w-11 h-11 rounded-full object-cover border-2 border-[#c1ecd4]"
          />
          <div className="overflow-hidden min-w-0 flex-1">
            <h3 className="font-heading font-bold text-sm text-[#012d1d] truncate">{user.name}</h3>
            <p className="text-[11px] text-[#3f6653] font-medium truncate">{roleInfo.title}</p>
            <p className="text-[10px] text-[#717973] truncate">{user.state || 'Nigeria'}</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[#e2e8e4]">
          <span className="text-[#414844] text-[11px]">NIN / KYC</span>
          <span className={`font-bold text-[10px] px-2 py-0.5 rounded-full ${
            user.verificationStatus === 'verified'
              ? 'bg-[#c1ecd4] text-[#002114]'
              : 'bg-[#ffdeac] text-[#281900]'
          }`}>
            {user.verificationStatus === 'verified' ? 'Verified' : 'Pending'}
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <div className="space-y-1">
        <div className="px-2 py-1 text-[10px] font-bold text-[#717973] uppercase tracking-wider">
          Platform Menu
        </div>
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                isActive
                  ? 'bg-[#012d1d] text-white shadow-sm'
                  : 'text-[#2b312d] hover:bg-[#f2f6f3]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`material-symbols-outlined text-[20px] shrink-0 ${isActive ? 'text-[#c1ecd4]' : 'text-[#3f6653]'}`}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ml-1 ${
                  isActive ? 'bg-[#1b4332] text-[#c1ecd4]' : 'bg-[#e6ece8] text-[#3f6653]'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Quick Action Footer */}
      <div className="pt-3 mt-3 border-t border-[#e2e8e4]">
        <button
          onClick={() => handleSelect('create_listing')}
          className="w-full py-2.5 px-3 bg-[#012d1d] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-[#1b4332] active:scale-95 transition-all shadow-xs"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>Post Produce Listing</span>
        </button>
      </div>
    </div>
  );
};
