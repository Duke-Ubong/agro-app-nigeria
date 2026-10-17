import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { ROLE_LABELS } from '../common/RoleSwitcher';
import { UserRole } from '../../types';

interface SidebarNavProps {
  onCloseMobile?: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({ onCloseMobile }) => {
  const {
    activeView,
    setActiveView,
    orders,
    listings,
    coopMembers,
    warehouseIntakes,
    bulkInputCampaigns,
    offtakerContracts,
    farmPlots,
    farmerDeliveryPasses,
  } = useApp();
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
          { id: 'farm_records', label: 'Farm Records', icon: 'yard', badge: `${farmPlots.length}` },
          { id: 'produce_sales', label: 'Produce Sales', icon: 'local_shipping', badge: `${farmerDeliveryPasses.length}` },
          { id: 'farmer_inputs', label: 'Co-op Inputs', icon: 'inventory_2', badge: `${bulkInputCampaigns.length}` },
          { id: 'wallet', label: 'Payout Wallet', icon: 'account_balance_wallet' },
          { id: 'profile', label: 'Farm Profile', icon: 'person' },
        ];
      case 'cooperative':
        return [
          { id: 'dashboard', label: 'Co-op Overview', icon: 'dashboard' },
          { id: 'coop_roster', label: 'Member Farmer Roster', icon: 'groups', badge: `${coopMembers.length}` },
          { id: 'coop_aggregation', label: 'Warehouse & Intake', icon: 'warehouse', badge: `${warehouseIntakes.length}` },
          { id: 'coop_inputs', label: 'Bulk Input Buying', icon: 'shopping_bag', badge: `${bulkInputCampaigns.length}` },
          { id: 'coop_contracts', label: 'Off-taker Contracts', icon: 'handshake', badge: `${offtakerContracts.filter((c) => c.status === 'in_fulfillment').length}` },
          { id: 'coop_credit', label: 'Member Seasonal Credit', icon: 'payments' },
          { id: 'marketplace', label: 'Commodity Market', icon: 'storefront' },
          { id: 'profile', label: 'Co-op Profile', icon: 'domain' },
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
          { id: 'dashboard', label: 'Platform Analytics', icon: 'analytics' },
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
