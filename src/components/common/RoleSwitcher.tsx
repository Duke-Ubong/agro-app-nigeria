import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export const ROLE_LABELS: Record<UserRole, { title: string; subtitle: string; icon: string }> = {
  farmer: { title: 'Farmer', subtitle: 'Producers & Smallholders', icon: 'grass' },
  cooperative: { title: 'Cooperative', subtitle: 'Cluster & Group Lead', icon: 'groups' },
  buyer: { title: 'Buyer / Processor', subtitle: 'Enterprise & Off-taker', icon: 'storefront' },
  supplier: { title: 'Input Supplier', subtitle: 'Seeds, Fertilizer & Tools', icon: 'water_drop' },
  transporter: { title: 'Transporter', subtitle: 'Haulage & Fleet Logistics', icon: 'local_shipping' },
  institutional_admin: { title: 'Institutional Admin', subtitle: 'State Ag Development (ADP)', icon: 'domain' },
  gov_admin: { title: 'Gov Regulator Admin', subtitle: 'Federal Ministry Directorate', icon: 'policy' },
  super_admin: { title: 'Super Admin', subtitle: 'System & Developer Portal', icon: 'admin_panel_settings' },
};

export const RoleSwitcher: React.FC = () => {
  const { role, setRole } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-[#1b4332] text-[#86af99] hover:text-white rounded-full text-xs font-semibold border border-[#274e3d] transition-all shadow-sm active:scale-95"
        title="Switch user role view for testing"
      >
        <span className="material-symbols-outlined text-[16px] text-[#c1ecd4]">account_tree</span>
        <span>Role: <strong className="text-white">{ROLE_LABELS[role].title}</strong></span>
        <span className="material-symbols-outlined text-[14px]">expand_more</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-[#c1c8c2] z-50 p-2 space-y-1 max-h-[80vh] overflow-y-auto">
            <div className="px-3 py-2 border-b border-[#e2e2e2] flex justify-between items-center">
              <span className="text-xs font-bold text-[#012d1d] uppercase tracking-wider">Select Role View</span>
              <span className="text-[10px] bg-[#f3f3f3] text-[#414844] px-2 py-0.5 rounded">8 Roles</span>
            </div>
            {(Object.keys(ROLE_LABELS) as UserRole[]).map((r) => {
              const info = ROLE_LABELS[r];
              const isSelected = role === r;
              return (
                <button
                  key={r}
                  onClick={() => {
                    setRole(r);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg flex items-center gap-3 transition-colors ${
                    isSelected
                      ? 'bg-[#012d1d] text-white'
                      : 'hover:bg-[#f3f3f3] text-[#1a1c1c]'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-[#1b4332] text-[#c1ecd4]' : 'bg-[#e8e8e8] text-[#012d1d]'}`}>
                    <span className="material-symbols-outlined text-[20px]">{info.icon}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-xs leading-snug">{info.title}</div>
                    <div className={`text-[10px] ${isSelected ? 'text-[#86af99]' : 'text-[#414844]'}`}>
                      {info.subtitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
