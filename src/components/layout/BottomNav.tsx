import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export const BottomNav: React.FC = () => {
  const { activeView, setActiveView, orders } = useApp();
  const { role } = useAuth();

  const isSuperAdmin = role === 'super_admin';
  const isGovAdmin = role === 'gov_admin';
  const isInstAdmin = role === 'institutional_admin';
  const isAdmin = isSuperAdmin || isGovAdmin || isInstAdmin;

  const pendingOrdersCount = orders.filter((o) => o.status === 'pending' || o.status === 'accepted').length;

  return (
    <nav className="md:hidden fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[1440px] z-40 bg-[#f9f9f9] border-t border-x border-[#c1c8c2] px-2 py-1 flex justify-around items-center h-16 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      {/* Home / Dashboard */}
      <button
        onClick={() => setActiveView('dashboard')}
        className={`flex flex-col items-center justify-center px-3 py-1 rounded-full transition-all min-w-[64px] ${
          activeView === 'dashboard'
            ? 'bg-[#1b4332] text-white font-bold'
            : 'text-[#414844] hover:bg-[#e8e8e8]'
        }`}
      >
        <span className={`material-symbols-outlined text-[20px] ${activeView === 'dashboard' ? 'fill-icon' : ''}`}>
          home
        </span>
        <span className="text-[10px] mt-0.5 leading-tight">Home</span>
      </button>

      {/* Marketplace */}
      <button
        onClick={() => setActiveView('marketplace')}
        className={`flex flex-col items-center justify-center px-3 py-1 rounded-full transition-all min-w-[64px] ${
          activeView === 'marketplace'
            ? 'bg-[#1b4332] text-white font-bold'
            : 'text-[#414844] hover:bg-[#e8e8e8]'
        }`}
      >
        <span className={`material-symbols-outlined text-[20px] ${activeView === 'marketplace' ? 'fill-icon' : ''}`}>
          storefront
        </span>
        <span className="text-[10px] mt-0.5 leading-tight">Market</span>
      </button>

      {/* Wallet / Credit */}
      <button
        onClick={() => setActiveView('wallet')}
        className={`flex flex-col items-center justify-center px-3 py-1 rounded-full transition-all min-w-[64px] ${
          activeView === 'wallet' || activeView === 'credit'
            ? 'bg-[#1b4332] text-white font-bold'
            : 'text-[#414844] hover:bg-[#e8e8e8]'
        }`}
      >
        <span className={`material-symbols-outlined text-[20px] ${activeView === 'wallet' ? 'fill-icon' : ''}`}>
          account_balance_wallet
        </span>
        <span className="text-[10px] mt-0.5 leading-tight">Wallet</span>
      </button>

      {/* Advisory / Orders / Admin */}
      {isAdmin ? (
        <button
          onClick={() => setActiveView('admin')}
          className={`flex flex-col items-center justify-center px-3 py-1 rounded-full transition-all min-w-[64px] ${
            activeView === 'admin'
              ? 'bg-[#ba1a1a] text-white font-bold'
              : 'text-[#ba1a1a] hover:bg-[#ffdad6]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
          <span className="text-[10px] mt-0.5 leading-tight font-bold">Portal</span>
        </button>
      ) : (
        <button
          onClick={() => setActiveView('orders')}
          className={`flex flex-col items-center justify-center px-3 py-1 rounded-full transition-all min-w-[64px] relative ${
            activeView === 'orders'
              ? 'bg-[#1b4332] text-white font-bold'
              : 'text-[#414844] hover:bg-[#e8e8e8]'
          }`}
        >
          <span className={`material-symbols-outlined text-[20px] ${activeView === 'orders' ? 'fill-icon' : ''}`}>
            local_shipping
          </span>
          <span className="text-[10px] mt-0.5 leading-tight">Orders</span>
          {pendingOrdersCount > 0 && (
            <span className="absolute top-1 right-3 w-2 h-2 bg-[#ba1a1a] rounded-full" />
          )}
        </button>
      )}

      {/* Profile */}
      <button
        onClick={() => setActiveView('profile')}
        className={`flex flex-col items-center justify-center px-3 py-1 rounded-full transition-all min-w-[64px] ${
          activeView === 'profile'
            ? 'bg-[#1b4332] text-white font-bold'
            : 'text-[#414844] hover:bg-[#e8e8e8]'
        }`}
      >
        <span className={`material-symbols-outlined text-[20px] ${activeView === 'profile' ? 'fill-icon' : ''}`}>
          person
        </span>
        <span className="text-[10px] mt-0.5 leading-tight">Profile</span>
      </button>
    </nav>
  );
};
