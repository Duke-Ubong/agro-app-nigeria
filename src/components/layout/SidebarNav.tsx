import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { ROLE_LABELS } from '../common/RoleSwitcher';
import { UserRole } from '../../types';

interface SidebarNavProps {
  onCloseMobile?: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({ onCloseMobile }) => {
  const { activeView, setActiveView, orders, listings } = useApp();
  const { user, role } = useAuth();

  const isSuperAdmin = role === 'super_admin';
  const isGovAdmin = role === 'gov_admin';
  const isInstAdmin = role === 'institutional_admin';
  const isAdmin = isSuperAdmin || isGovAdmin || isInstAdmin;

  const roleInfo = ROLE_LABELS[role];

  const myOrdersCount = orders.filter(
    (o) => o.buyerId === user.id || o.sellerId === user.id || o.transporterId === user.id
  ).length;

  const myListingsCount = listings.filter((l) => l.sellerId === user.id).length;

  const getNavItemsForRole = (currentRole: UserRole) => {
    switch (currentRole) {
      case 'farmer':
        return [
          { id: 'dashboard', label: 'Farm Value Chain Hub', icon: 'dashboard', badge: 'Active' },
          { id: 'marketplace', label: 'Sell Harvest & Offtake', icon: 'storefront', badge: `${listings.length}` },
          { id: 'orders', label: 'Waybills & Transport', icon: 'local_shipping', badge: myOrdersCount > 0 ? `${myOrdersCount}` : undefined },
          { id: 'wallet', label: 'Escrow & Digital Wallet', icon: 'account_balance_wallet' },
          { id: 'credit', label: 'Subsidies & Farm Loans', icon: 'payments' },
          { id: 'advisory', label: 'Weather & Agronomy', icon: 'agriculture', badge: 'NiMet 29°C' },
          { id: 'profile', label: 'Farm Profile & Identity', icon: 'person' },
        ];
      case 'cooperative':
        return [
          { id: 'dashboard', label: 'Co-op Overview', icon: 'dashboard' },
          { id: 'marketplace', label: 'Group Sales', icon: 'storefront', badge: `${listings.length}` },
          { id: 'wallet', label: 'Co-op Treasury', icon: 'account_balance_wallet' },
          { id: 'credit', label: 'Group Financing', icon: 'payments' },
          { id: 'orders', label: 'Bulk Orders', icon: 'local_shipping', badge: myOrdersCount > 0 ? `${myOrdersCount}` : undefined },
          { id: 'advisory', label: 'Extension Services', icon: 'agriculture' },
          { id: 'profile', label: 'Co-op Profile', icon: 'groups' },
        ];
      case 'buyer':
        return [
          { id: 'dashboard', label: 'Procurement Dashboard', icon: 'dashboard' },
          { id: 'marketplace', label: 'Sourcing & Commodities', icon: 'storefront', badge: `${listings.length}` },
          { id: 'wallet', label: 'Escrow & Payments', icon: 'account_balance_wallet' },
          { id: 'orders', label: 'Supply Chain Tracking', icon: 'local_shipping', badge: myOrdersCount > 0 ? `${myOrdersCount}` : undefined },
          { id: 'profile', label: 'Corporate Profile', icon: 'business' },
        ];
      case 'supplier':
        return [
          { id: 'dashboard', label: 'Supplier Dashboard', icon: 'dashboard' },
          { id: 'marketplace', label: 'My Input Store', icon: 'storefront', badge: `${myListingsCount}` },
          { id: 'wallet', label: 'Earnings & Wallet', icon: 'account_balance_wallet' },
          { id: 'orders', label: 'Fulfillment & Orders', icon: 'local_shipping', badge: myOrdersCount > 0 ? `${myOrdersCount}` : undefined },
          { id: 'profile', label: 'Supplier Profile', icon: 'store' },
        ];
      case 'transporter':
        return [
          { id: 'dashboard', label: 'Fleet Dashboard', icon: 'dashboard' },
          { id: 'orders', label: 'Available Loads', icon: 'local_shipping', badge: myOrdersCount > 0 ? `${myOrdersCount}` : undefined },
          { id: 'wallet', label: 'Earnings & Wallet', icon: 'account_balance_wallet' },
          { id: 'profile', label: 'Fleet Profile', icon: 'local_shipping' },
        ];
      case 'super_admin':
      case 'gov_admin':
      case 'institutional_admin':
        return [
          { id: 'admin', label: 'Executive Portal', icon: 'admin_panel_settings', badge: 'Admin' },
          { id: 'dashboard', label: 'Agro-Chain Analytics', icon: 'analytics', badge: '36 States Live' },
          { id: 'marketplace', label: 'Market Oversight', icon: 'policy', badge: `${listings.length}` },
          { id: 'wallet', label: 'Financial Audit', icon: 'account_balance_wallet' },
          { id: 'profile', label: 'Admin Profile', icon: 'shield_person' },
        ];
      default:
        return [
          { id: 'dashboard', label: 'Dashboard Overview', icon: 'dashboard' },
          { id: 'profile', label: 'Profile & Identity', icon: 'person' },
        ];
    }
  };

  const navItems = getNavItemsForRole(role);

  const handleSelect = (id: string) => {
    setActiveView(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside className="w-full bg-[#f9f9f9] border-r border-[#c1c8c2] h-full flex flex-col p-4 shadow-sm rounded-xl">
      {/* User Profile Card */}
      <div className="p-3 bg-white rounded-xl border border-[#c1c8c2] mb-4 space-y-2">
        <div className="flex items-center gap-3">
          <img
            src={user.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover border border-[#c1c8c2]"
          />
          <div className="overflow-hidden">
            <h3 className="font-heading font-bold text-sm text-[#012d1d] truncate">{user.name}</h3>
            <p className="text-[11px] text-[#414844] font-medium">{roleInfo.title}</p>
            <p className="text-[10px] text-[#717973] truncate">
              {user.cropTypes ? user.cropTypes.join(', ') : 'Grains'} • {user.farmSizeHectares ? `${user.farmSizeHectares} Ha` : user.state}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[#e2e2e2]">
          <span className="text-[#414844]">KYC Status:</span>
          <span className={`font-bold px-2 py-0.5 rounded-full ${
            user.verificationStatus === 'verified'
              ? 'bg-[#c1ecd4] text-[#002114]'
              : 'bg-[#ffdeac] text-[#281900]'
          }`}>
            {user.verificationStatus === 'verified' ? 'NIN Verified' : 'Pending'}
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 space-y-1 overflow-y-auto no-scrollbar pr-1">
        <div className="px-3 py-1 text-[10px] font-bold text-[#717973] uppercase tracking-wider">
          Value Chain Navigation
        </div>
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`w-full text-left px-3 py-2.5 rounded-xl font-label-lg text-xs flex items-center justify-between transition-all group ${
                isActive
                  ? 'bg-[#012d1d] text-white font-bold shadow-md ring-1 ring-[#10b981]/50'
                  : item.id === 'dashboard'
                  ? 'text-[#1a1c1c] hover:bg-[#e7f5e8] border border-transparent hover:border-[#10b981]/30 font-semibold'
                  : item.id === 'advisory'
                  ? 'text-[#1a1c1c] hover:bg-[#e7f5e8] border border-transparent hover:border-[#10b981]/30'
                  : 'text-[#1a1c1c] hover:bg-[#e8e8e8]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`material-symbols-outlined text-[20px] transition-transform group-hover:scale-110 ${
                  isActive
                    ? 'text-[#c1ecd4]'
                    : item.id === 'dashboard' || item.id === 'advisory'
                    ? 'text-[#0a3826]'
                    : 'text-[#012d1d]'
                }`}>
                  {item.icon}
                </span>
                <span className={item.id === 'advisory' && !isActive ? 'font-medium' : ''}>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 transition-all ${
                  item.id === 'dashboard'
                    ? isActive
                      ? 'bg-[#1b4332] text-[#c1ecd4]'
                      : 'bg-[#c1ecd4] text-[#002114] font-bold'
                    : item.id === 'advisory'
                    ? 'bg-[#10b981] text-[#022c1b] font-mono shadow-xs font-bold'
                    : isActive
                    ? 'bg-[#1b4332] text-[#86af99]'
                    : 'bg-[#e8e8e8] text-[#414844]'
                }`}>
                  {(item.id === 'dashboard' || item.id === 'advisory') && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-ping" />
                  )}
                  <span>{item.badge}</span>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Quick Action Footer */}
      <div className="pt-4 border-t border-[#c1c8c2] space-y-2">
        <button
          onClick={() => handleSelect('create_listing')}
          className="w-full py-2.5 px-3 bg-[#012d1d] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-[#1b4332] active:scale-95 transition-all shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>Sell Harvest (Zero Fee)</span>
        </button>
        <div className="text-[10px] text-center font-mono text-[#717973] bg-white p-1.5 rounded-lg border border-[#e2e2e2] flex items-center justify-center gap-1">
          <span className="material-symbols-outlined text-[13px] text-[#10b981]">cell_tower</span>
          <span>Offline USSD: <strong>*347*88#</strong></span>
        </div>
      </div>
    </aside>
  );
};
