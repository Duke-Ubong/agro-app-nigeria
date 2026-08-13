import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { ROLE_LABELS } from '../common/RoleSwitcher';
import { getNigerianAvatar } from '../../utils/avatarUtils';

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

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: 'dashboard' },
    { id: 'marketplace', label: 'Digital Marketplace', icon: 'storefront', badge: `${listings.length}` },
    { id: 'wallet', label: 'Wallet & Escrow', icon: 'account_balance_wallet' },
    { id: 'credit', label: 'Agro Credit / Loans', icon: 'payments' },
    { id: 'orders', label: 'Orders & Tracking', icon: 'local_shipping', badge: myOrdersCount > 0 ? `${myOrdersCount}` : undefined },
    { id: 'advisory', label: 'Advisory & Weather', icon: 'agriculture' },
    { id: 'profile', label: 'Profile & Identity', icon: 'person' },
  ];

  if (isAdmin) {
    navItems.unshift({ id: 'admin', label: 'Admin Executive Portal', icon: 'admin_panel_settings', badge: 'Admin' });
  }

  const handleSelect = (id: string) => {
    setActiveView(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside className="w-72 bg-[#f9f9f9] border-r border-[#c1c8c2] h-full flex flex-col p-4 shadow-sm">
      {/* User Profile Card */}
      <div className="p-3 bg-white rounded-xl border border-[#c1c8c2] mb-4 space-y-2">
        <div className="flex items-center gap-3">
          <img
            src={user.photoUrl || getNigerianAvatar(user.name)}
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover border border-[#c1c8c2]"
          />
          <div className="overflow-hidden">
            <h3 className="font-heading font-bold text-sm text-[#012d1d] truncate">{user.name}</h3>
            <p className="text-[11px] text-[#414844] font-medium">{roleInfo.title}</p>
            <p className="text-[10px] text-[#717973] truncate">{user.state || 'Nigeria'}</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[#e2e2e2]">
          <span className="text-[#414844]">KYC Status:</span>
          <span className={`font-bold px-2 py-0.5 rounded-full ${
            user.verificationStatus === 'verified'
              ? 'bg-[#c1ecd4] text-[#002114]'
              : 'bg-[#ffdeac] text-[#281900]'
          }`}>
            {user.verificationStatus === 'verified' ? 'Verified' : 'Pending'}
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 space-y-1 overflow-y-auto no-scrollbar pr-1">
        <div className="px-3 py-1 text-[10px] font-bold text-[#717973] uppercase tracking-wider">
          Platform Navigation
        </div>
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`w-full text-left px-3 py-2.5 rounded-xl font-label-lg text-xs flex items-center justify-between transition-all ${
                isActive
                  ? 'bg-[#012d1d] text-white font-bold shadow-sm'
                  : 'text-[#1a1c1c] hover:bg-[#e8e8e8]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-[#c1ecd4]' : 'text-[#012d1d]'}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-[#1b4332] text-[#86af99]' : 'bg-[#e8e8e8] text-[#414844]'
                }`}>
                  {item.badge}
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
          className="w-full py-2.5 px-3 bg-[#1b4332] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-[#012d1d] transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>Post Market Listing</span>
        </button>
      </div>
    </aside>
  );
};
