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
