import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { RoleSwitcher } from '../common/RoleSwitcher';
import { AgroAppLogo } from '../common/AgroAppLogo';
import { getNigerianAvatar } from '../../utils/avatarUtils';

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

  // ==========================================
  // SUPER ADMIN SPECIFIC HEADER RENDER
  // ==========================================
  if (isSuperAdmin && activeView === 'admin') {
    return (
      <header className="sticky top-0 z-40 bg-[#0a0f18] border-b border-[#1e293b] shadow-2xl">
        <div className="max-w-[1440px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-4 min-w-0">
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="md:hidden p-1.5 rounded-xl text-[#94a3b8] hover:bg-[#1e293b] active:scale-95 transition-all border border-transparent hover:border-[#334155]"
                aria-label="Toggle navigation"
              >
                <span className="material-symbols-outlined text-[24px]">menu</span>
              </button>
            )}

            <div className="flex items-center gap-3 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <span className="material-symbols-outlined text-white text-[18px]">admin_panel_settings</span>
              </div>
              <div className="hidden sm:block">
                <h2 className="font-heading font-extrabold text-[#f1f5f9] text-sm tracking-wide flex items-center gap-2">
                  <span>AGRO-CONNECT</span>
                  <span className="text-[9px] font-bold bg-[#1e293b] text-emerald-400 px-1.5 py-0.5 rounded-sm border border-[#334155] uppercase">Command Center</span>
                </h2>
              </div>
            </div>

            {/* Global Search */}
            <div className="hidden lg:flex flex-1 max-w-md ml-4 relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#64748b]">search</span>
              <input
                type="text"
                placeholder="Search telemetry, user IDs, or transactions..."
                className="w-full bg-[#111927] border border-[#1e293b] rounded-full py-1.5 pl-10 pr-4 text-xs text-white placeholder-[#64748b] focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <kbd className="hidden xl:inline-block px-1.5 py-0.5 text-[9px] font-mono text-[#64748b] bg-[#1e293b] rounded border border-[#334155]">⌘</kbd>
                <kbd className="hidden xl:inline-block px-1.5 py-0.5 text-[9px] font-mono text-[#64748b] bg-[#1e293b] rounded border border-[#334155]">K</kbd>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Quick Emergency Button */}
            <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/30 hover:bg-rose-900/50 text-rose-300 border border-rose-500/30 rounded-full text-xs font-bold transition-all cursor-pointer">
              <span className="material-symbols-outlined text-[16px]">emergency</span>
              <span>Emergency Controls</span>
            </button>

            <div className="w-px h-6 bg-[#1e293b] mx-1 hidden sm:block" />

            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-1.5 rounded-full text-[#94a3b8] hover:text-white hover:bg-[#1e293b] relative transition-all active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full border border-[#0a0f18] animate-pulse" />
            </button>

            <button
              onClick={() => setActiveView('profile')}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-[#1e293b] transition-colors border border-[#1e293b] cursor-pointer"
            >
              <img
                src={user.photoUrl || getNigerianAvatar(user.name)}
                alt={user.name}
                className="w-7 h-7 rounded-full object-cover border border-emerald-500/30"
              />
            </button>
          </div>
        </div>
      </header>
    );
  }

  // ==========================================
  // STANDARD HEADER RENDER
  // ==========================================
  return (
    <header className="sticky top-0 z-40 bg-[#f9f9f9] border-b border-[#c1c8c2] shadow-xs">
      {/* Top Banner Partnership Notice */}
      <div className="bg-[#012d1d] text-white text-[11px] py-1 px-4 flex justify-between items-center border-b border-[#1b4332] overflow-hidden">
        {/* Continuous Subtle Sliding Ticker */}
        <div className="flex-1 overflow-hidden relative mr-3 mask-fade">
          <div className="animate-marquee flex items-center gap-10 whitespace-nowrap">
            <div className="flex items-center gap-2.5">
              <span className="bg-[#1b4332] text-[#86af99] text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0">FMAFS + USUCO</span>
              <span>Federal Ministry of Agriculture • USUCO Agro-Connect</span>
              <span className="text-[#86af99] font-bold">•</span>
              <span className="text-[#c1ecd4]">Official Nigerian Farm Registry & Government Support</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="bg-[#1b4332] text-[#86af99] text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0">FMAFS + USUCO</span>
              <span>Federal Ministry of Agriculture • USUCO Agro-Connect</span>
              <span className="text-[#86af99] font-bold">•</span>
              <span className="text-[#c1ecd4]">Official Nigerian Farm Registry & Government Support</span>
            </div>
          </div>
        </div>

        {/* Constant Right Bar Controls (Data Saver + Helpline) */}
        <div className="flex items-center gap-3 shrink-0 z-10 bg-[#012d1d] pl-2">
          <button
            onClick={toggleLowBandwidthMode}
            className={`text-[10px] px-2 py-0.5 rounded flex items-center gap-1 font-semibold transition-colors cursor-pointer ${
              lowBandwidthMode
                ? 'bg-[#dc9a00] text-[#281900]'
                : 'bg-[#1b4332] text-[#86af99] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[12px]">signal_cellular_alt</span>
            <span>{lowBandwidthMode ? 'Data Saver: ON' : 'Data Saver'}</span>
          </button>
          <span className="hidden sm:inline opacity-80 text-[11px]">24/7 Helpline: 0800-AGRO-CONNECT</span>
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

          <div className="flex items-center gap-2">
            <AgroAppLogo
              iconSize={32}
              textSize="text-lg"
              showSubtag
              subtext={user.state ? `${user.state} • Platform` : 'Nigeria Digital Platform'}
              onClick={() => setActiveView('dashboard')}
            />
            {isAdmin && (
              <button
                type="button"
                onClick={() => setActiveView('admin')}
                className="text-[10px] font-bold bg-[#012d1d] text-[#c1ecd4] hover:bg-[#1b4332] px-2 py-0.5 rounded-md uppercase self-center shadow-xs border border-[#1b4332] transition-colors cursor-pointer"
                title="Go to National Admin Portal"
              >
                {isSuperAdmin ? 'Super Admin' : 'Admin Portal'}
              </button>
            )}
          </div>
        </div>

        {/* Center/Right Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Role Switcher */}
          <RoleSwitcher />

          <LanguageSwitcher />

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
              src={user.photoUrl || getNigerianAvatar(user.name)}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
