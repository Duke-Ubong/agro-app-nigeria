import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export const BottomNav: React.FC = () => {
  const { activeView, setActiveView, orders } = useApp();
  const { role } = useAuth();

  const isSuperAdmin = role === 'super_admin';
  const isGovAdmin = role === 'gov_admin';
  const isInstAdmin = role === 'institutional_admin';
  const isAdmin = isSuperAdmin || isGovAdmin || isInstAdmin;

  const pendingOrdersCount = orders.filter((o) => o.status === 'pending' || o.status === 'accepted').length;

  const getNavItemsForRole = (currentRole: UserRole) => {
    const baseItems = [];
    switch (currentRole) {
      case 'farmer':
        return [
          { id: 'farm_records', label: 'Records', icon: 'yard' },
          { id: 'produce_sales', label: 'Sales', icon: 'local_shipping' },
          { id: 'farmer_inputs', label: 'Inputs', icon: 'inventory_2' },
          { id: 'wallet', label: 'Wallet', icon: 'account_balance_wallet' },
          { id: 'profile', label: 'Profile', icon: 'person' },
        ];
      case 'cooperative':
        return [
          { id: 'dashboard', label: 'Home', icon: 'home' },
          { id: 'coop_roster', label: 'Roster', icon: 'groups' },
          { id: 'coop_aggregation', label: 'Warehouse', icon: 'warehouse' },
          { id: 'coop_inputs', label: 'Inputs', icon: 'shopping_bag' },
          { id: 'coop_contracts', label: 'Contracts', icon: 'handshake' },
        ];
      case 'buyer':
        return [
          { id: 'dashboard', label: 'Home', icon: 'home' },
          { id: 'marketplace', label: 'Sourcing', icon: 'storefront' },
          { id: 'wallet', label: 'Wallet', icon: 'account_balance_wallet' },
          { id: 'orders', label: 'Supply', icon: 'local_shipping', badge: pendingOrdersCount > 0 },
          { id: 'profile', label: 'Profile', icon: 'business' },
        ];
      case 'supplier':
        return [
          { id: 'dashboard', label: 'Home', icon: 'home' },
          { id: 'marketplace', label: 'Store', icon: 'storefront' },
          { id: 'wallet', label: 'Wallet', icon: 'account_balance_wallet' },
          { id: 'orders', label: 'Orders', icon: 'local_shipping', badge: pendingOrdersCount > 0 },
          { id: 'profile', label: 'Profile', icon: 'store' },
        ];
      case 'transporter':
        return [
          { id: 'dashboard', label: 'Home', icon: 'home' },
          { id: 'orders', label: 'Loads', icon: 'local_shipping', badge: pendingOrdersCount > 0 },
          { id: 'wallet', label: 'Wallet', icon: 'account_balance_wallet' },
          { id: 'profile', label: 'Profile', icon: 'local_shipping' },
        ];
      case 'super_admin':
      case 'gov_admin':
      case 'institutional_admin':
        return [
          { id: 'admin', label: 'Portal', icon: 'admin_panel_settings', activeColor: 'bg-[#ba1a1a]' },
          { id: 'dashboard', label: 'Analytics', icon: 'analytics' },
          { id: 'marketplace', label: 'Market', icon: 'policy' },
          { id: 'wallet', label: 'Audit', icon: 'account_balance_wallet' },
          { id: 'profile', label: 'Profile', icon: 'shield_person' },
        ];
      default:
        return [
          { id: 'dashboard', label: 'Home', icon: 'home' },
          { id: 'profile', label: 'Profile', icon: 'person' },
        ];
    }
  };

  const navItems = getNavItemsForRole(role);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#f9f9f9] border-t border-[#c1c8c2] px-2 py-1 flex justify-around items-center h-16 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => {
        const isActive = activeView === item.id || (item.id === 'wallet' && activeView === 'credit');
        const activeBgColor = item.activeColor || 'bg-[#1b4332]';
        const activeTextColor = item.activeColor ? 'text-[#ba1a1a]' : 'text-[#1b4332]';
        const hoverBgColor = item.activeColor ? 'hover:bg-[#ffdad6]' : 'hover:bg-[#e8e8e8]';

        return (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`flex flex-col items-center justify-center px-3 py-1 rounded-full transition-all min-w-[64px] relative ${
              isActive
                ? `${activeBgColor} text-white font-bold`
                : `text-[#414844] ${hoverBgColor}`
            }`}
          >
            <span className={`material-symbols-outlined text-[20px] ${isActive && !item.activeColor ? 'fill-icon' : ''}`}>
              {item.icon}
            </span>
            <span className="text-[10px] mt-0.5 leading-tight">{item.label}</span>
            {item.badge && (
              <span className="absolute top-1 right-3 w-2 h-2 bg-[#ba1a1a] rounded-full" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
