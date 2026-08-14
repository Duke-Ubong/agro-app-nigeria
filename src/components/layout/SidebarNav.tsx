import React from 'react';
import {
  LayoutDashboard,
  Store,
  Wallet,
  Landmark,
  Truck,
  CloudSun,
  User,
  ShieldAlert,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Building,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
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

  const roleInfo = ROLE_LABELS[role] || {
    title: 'Farmer',
    subtitle: 'Agricultural Producer',
    icon: 'grass',
  };

  const myOrdersCount = orders.filter(
    (o) => o.buyerId === user.id || o.sellerId === user.id || o.transporterId === user.id
  ).length;

  const myListingsCount = listings.filter((l) => l.sellerId === user.id).length;

  // Role-aware primary navigation labels and icons
  const navItems = [
    {
      id: 'dashboard',
      label: role === 'farmer' ? 'Farm Dashboard' : role === 'buyer' ? 'Buyer Overview' : role === 'supplier' ? 'Supplier Hub' : role === 'transporter' ? 'Logistics Fleet' : 'Operations Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'marketplace',
      label: 'Produce Marketplace',
      icon: Store,
      badge: listings.length > 0 ? `${listings.length}` : undefined,
    },
    {
      id: 'wallet',
      label: 'Wallet & Escrow Pay',
      icon: Wallet,
    },
    {
      id: 'credit',
      label: 'BOA Agricultural Credit',
      icon: Landmark,
      badge: '5% APR',
      badgeColor: 'emerald',
    },
    {
      id: 'orders',
      label: 'Orders & Deliveries',
      icon: Truck,
      badge: myOrdersCount > 0 ? `${myOrdersCount}` : undefined,
    },
    {
      id: 'advisory',
      label: 'Weather & AI Advisory',
      icon: CloudSun,
    },
    {
      id: 'profile',
      label: 'Citizen Identity & NIN',
      icon: User,
    },
  ];

  if (isAdmin) {
    navItems.unshift({
      id: 'admin',
      label: isSuperAdmin
        ? 'Super Admin Control'
        : isGovAdmin
        ? 'Ministry Policy Suite'
        : 'State ADP Command',
      icon: ShieldCheck,
      badge: isSuperAdmin ? 'Root L0' : 'Gov Admin',
      badgeColor: 'amber',
    });
  }

  const handleSelect = (id: string) => {
    setActiveView(id);
    if (onCloseMobile) onCloseMobile();
  };

  const isVerified = user.verificationStatus === 'verified';

  return (
    <div className="w-full bg-white rounded-2xl border border-[#d8e0dc] p-4 shadow-sm flex flex-col h-fit sticky top-20 transition-all">
      {/* User Profile Card */}
      <div className="p-3.5 bg-gradient-to-b from-[#f6f9f7] to-[#eef4f0] rounded-xl border border-[#d5e0d9] mb-3.5 space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <img
              src={user.photoUrl || getNigerianAvatar(user.name)}
              alt={user.name}
              className="w-11 h-11 rounded-full object-cover border-2 border-[#10b981] shadow-xs"
            />
            {isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-[#10b981] text-white p-0.5 rounded-full ring-2 ring-white">
                <CheckCircle2 className="w-3 h-3" />
              </div>
            )}
          </div>
          <div className="overflow-hidden min-w-0 flex-1">
            <h3 className="font-heading font-bold text-sm text-[#012d1d] truncate">
              {user.name}
            </h3>
            <div className="flex items-center gap-1 text-[11px] text-[#2d5240] font-semibold truncate">
              <span>{roleInfo.title}</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-[#61746b] truncate mt-0.5">
              <MapPin className="w-2.5 h-2.5 shrink-0 text-[#10b981]" />
              <span className="truncate">{user.lga ? `${user.lga}, ${user.state || 'Nigeria'}` : (user.state || 'Nigeria')}</span>
            </div>
          </div>
        </div>

        {/* NIN Verification Strip */}
        <div className="flex items-center justify-between text-[11px] pt-2.5 border-t border-[#d8e3dc]">
          <span className="text-[#4b6055] font-medium text-[11px] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
            NIN / Biometric KYC
          </span>
          <span
            className={`font-bold text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 ${
              isVerified
                ? 'bg-[#d1fae5] text-[#065f46] border border-[#a7f3d0]'
                : 'bg-[#fef3c7] text-[#92400e] border border-[#fde68a]'
            }`}
          >
            {isVerified ? (
              <>
                <CheckCircle2 className="w-2.5 h-2.5" />
                Tier-2 Verified
              </>
            ) : (
              <>
                <AlertCircle className="w-2.5 h-2.5" />
                Pending Verification
              </>
            )}
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <div className="space-y-1">
        <div className="px-2 py-1 text-[10px] font-bold text-[#6a8075] uppercase tracking-wider flex items-center justify-between">
          <span>Main Navigation</span>
          <span className="text-[9px] font-mono text-[#8fa89b]">{navItems.length} Menus</span>
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer group ${
                isActive
                  ? 'bg-[#012d1d] text-white shadow-sm border border-[#1b4332]'
                  : 'text-[#2b3a32] hover:bg-[#f0f6f2] hover:text-[#012d1d]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-[#34d399]' : 'text-[#3f6653]'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ml-1.5 ${
                    isActive
                      ? 'bg-[#1b4332] text-[#6ee7b7] border border-[#2d5e46]'
                      : item.badgeColor === 'emerald'
                      ? 'bg-[#d1fae5] text-[#065f46]'
                      : item.badgeColor === 'amber'
                      ? 'bg-[#fef3c7] text-[#92400e]'
                      : 'bg-[#e2ebe5] text-[#2d5240]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Quick Action Footer */}
      <div className="pt-3.5 mt-3.5 border-t border-[#e2ece5] space-y-2">
        {isAdmin ? (
          <button
            onClick={() => handleSelect('admin')}
            className="w-full py-2.5 px-3 bg-[#012d1d] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-[#064e3b] active:scale-[0.98] transition-all shadow-xs cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4 text-[#34d399]" />
            <span>Open Admin Command</span>
          </button>
        ) : (
          <button
            onClick={() => handleSelect('create_listing')}
            className="w-full py-2.5 px-3 bg-[#012d1d] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-[#064e3b] active:scale-[0.98] transition-all shadow-xs cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-[#34d399]" />
            <span>Post Produce Listing</span>
          </button>
        )}

        <div className="px-2 py-1 text-center">
          <p className="text-[10px] text-[#7a8f84] font-medium">
            USUCO Agro-Connect • FMARD
          </p>
        </div>
      </div>
    </div>
  );
};

