import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { RoleSwitcher } from '../common/RoleSwitcher';
import { LanguageSwitcher } from '../common/LanguageSwitcher';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { user, role } = useAuth();
  const { broadcasts, lowBandwidthMode, toggleLowBandwidthMode, activeView, setActiveView } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);

  const isSuperAdmin = role === 'super_admin';
  const isGovAdmin = role === 'gov_admin';
  const isInstAdmin = role === 'institutional_admin';
  const isAdmin = isSuperAdmin || isGovAdmin || isInstAdmin;

  return (
    <header className="sticky top-0 z-40 bg-[#f9f9f9] border-b border-[#c1c8c2] shadow-xs">
      {/* Top Banner Partnership Notice */}
      <div className="bg-[#012d1d] text-white text-[11px] py-1 px-4 flex justify-between items-center overflow-x-auto whitespace-nowrap border-b border-[#1b4332]">
        <div className="flex items-center gap-2">
          <span className="bg-[#1b4332] text-[#86af99] text-[9px] font-bold px-1.5 py-0.5 rounded">FMAFS + USUCO</span>
          <span>Federal Ministry of Agriculture & Food Security • USUCO Agro-Connect</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleLowBandwidthMode}
            className={`text-[10px] px-2 py-0.5 rounded flex items-center gap-1 font-semibold transition-colors ${
              lowBandwidthMode
                ? 'bg-[#dc9a00] text-[#281900]'
                : 'bg-[#1b4332] text-[#86af99] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[12px]">signal_cellular_alt</span>
            <span>{lowBandwidthMode ? 'Data Saver: ON' : 'Data Saver'}</span>
          </button>
          <span className="hidden sm:inline opacity-80">24/7 Helpline: 0800-AGRO-CONNECT</span>
        </div>
      </div>

      {/* Main Top App Bar */}
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="md:hidden p-1.5 rounded-full text-[#414844] hover:bg-[#e8e8e8] active:scale-95 transition-all"
              aria-label="Toggle navigation"
            >
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>
          )}

          <button
            onClick={() => setActiveView('dashboard')}
            className="flex items-center gap-2 text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#012d1d] text-white flex items-center justify-center shadow-sm group-hover:bg-[#1b4332] transition-colors">
              <span className="material-symbols-outlined text-[22px] fill-icon">agriculture</span>
            </div>
            <div>
              <div className="font-heading font-bold text-lg leading-tight text-[#012d1d] flex items-center gap-1.5">
                <span>AgroApp</span>
                {isAdmin && (
                  <span className="text-[10px] font-bold bg-[#ba1a1a] text-white px-1.5 py-0.2 rounded uppercase">
                    Admin
                  </span>
                )}
              </div>
              <div className="text-[10px] text-[#717973] font-medium leading-none">
                {user.state || 'Nigeria Digital Platform'}
              </div>
            </div>
          </button>
        </div>

        {/* Center/Right Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Role Switcher for seamless testing */}
          <div className="hidden sm:block">
            <RoleSwitcher />
          </div>

          <LanguageSwitcher />

          <button
            onClick={() => setActiveView('splash')}
            className="hidden lg:flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#012d1d] hover:bg-[#e8e8e8] rounded-full transition-colors border border-transparent hover:border-[#c1c8c2]"
            title="View AgroApp Intro & African AgriTech Slides"
          >
            <span className="material-symbols-outlined text-[16px] text-[#0a3826]">slideshow</span>
            <span>Intro Slides</span>
          </button>

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full text-[#012d1d] hover:bg-[#e8e8e8] relative transition-all active:scale-95"
              title="Notifications"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              {broadcasts.length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#ba1a1a] rounded-full border-2 border-white" />
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-[#c1c8c2] z-50 p-3 space-y-2">
                  <div className="flex justify-between items-center pb-2 border-b border-[#e2e2e2]">
                    <h3 className="font-heading font-bold text-sm text-[#012d1d] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[18px]">campaign</span>
                      <span>Ministry Broadcasts & Alerts</span>
                    </h3>
                    <span className="text-[10px] bg-[#c1ecd4] text-[#002114] px-2 py-0.5 rounded-full font-bold">
                      {broadcasts.length} New
                    </span>
                  </div>

                  <div className="max-h-80 overflow-y-auto space-y-2 pr-1 no-scrollbar">
                    {broadcasts.map((b) => (
                      <div
                        key={b.id}
                        className={`p-3 rounded-lg border text-xs space-y-1 ${
                          b.priority === 'critical'
                            ? 'bg-[#ffdad6] border-[#ba1a1a] text-[#93000a]'
                            : b.priority === 'urgent'
                            ? 'bg-[#ffdeac] border-[#dc9a00] text-[#281900]'
                            : 'bg-[#f3f3f3] border-[#c1c8c2] text-[#1a1c1c]'
                        }`}
                      >
                        <div className="flex justify-between items-start font-bold">
                          <span>{b.title}</span>
                          <span className="text-[9px] uppercase font-semibold opacity-75">{b.targetState}</span>
                        </div>
                        <p className="text-[11px] leading-relaxed opacity-90">{b.body}</p>
                        <div className="text-[9px] opacity-75 pt-1 border-t border-black/10 flex justify-between">
                          <span>By: {b.senderName}</span>
                          <span>{new Date(b.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-[#e2e2e2] text-center">
                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        setActiveView('advisory');
                      }}
                      className="text-xs font-bold text-[#012d1d] hover:underline"
                    >
                      View All Advisory & Advisories →
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Profile Avatar / Profile Link */}
          <button
            onClick={() => setActiveView('profile')}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-[#e8e8e8] transition-colors border border-[#c1c8c2]"
            title="Profile & Settings"
          >
            <img
              src={user.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          </button>
        </div>
      </div>

      {/* Role Switcher Mobile Floating Bar */}
      <div className="sm:hidden px-4 py-1.5 bg-[#f3f3f3] border-t border-[#c1c8c2] flex justify-between items-center">
        <RoleSwitcher />
        <span className="text-[10px] text-[#414844] font-medium">Logged in as {user.name}</span>
      </div>
    </header>
  );
};
