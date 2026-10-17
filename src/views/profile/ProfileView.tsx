import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export const ProfileView: React.FC = () => {
  const { user, logout, setRole } = useAuth();
  const { isDataSaver, toggleDataSaver, setActiveView } = useApp();

  const [language, setLanguage] = useState(user.language || 'English');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-white border border-[#c1c8c2] rounded-2xl p-6 space-y-4 shadow-xs text-center sm:text-left flex flex-col sm:flex-row items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-[#012d1d] text-white flex items-center justify-center font-heading font-bold text-2xl border-4 border-[#c1ecd4]">
          {user.name.charAt(0)}
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="font-heading font-bold text-xl text-[#012d1d]">{user.name}</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#c1ecd4] text-[#002114] font-bold text-[10px] uppercase">
              {user.verificationStatus} Verified
            </span>
          </div>

          <p className="text-xs text-[#414844]">
            {user.role.replace('_', ' ').toUpperCase()} • {user.state} State ({user.lga || 'Central'} LGA)
          </p>

          <p className="text-[11px] text-[#717973] font-mono">
            Agro ID: {user.ninNumber || user.cacNumber || 'NG-AGRO-2026-99128'}
          </p>
        </div>
      </div>

      {/* Settings Form */}
      <div className="bg-white border border-[#c1c8c2] rounded-2xl p-6 space-y-5 shadow-xs">
        <h3 className="font-heading font-bold text-base text-[#012d1d] pb-2 border-b border-[#e2e2e2]">
          App & Accessibility Settings
        </h3>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#1a1c1c] mb-1">Preferred Platform Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="w-full h-11 px-3 rounded-xl border border-[#717973] font-bold"
            >
              <option value="English">English</option>
              <option value="Hausa">Hausa (Harshen Hausa)</option>
              <option value="Yoruba">Yoruba (Èdè Yorùbá)</option>
              <option value="Igbo">Igbo (Asụsụ Igbo)</option>
              <option value="Pidgin">Nigerian Pidgin</option>
            </select>
          </div>

          {/* Low Bandwidth Mode Toggle */}
          <div className="p-4 bg-[#f3f3f3] rounded-xl border border-[#c1c8c2] flex items-center justify-between">
            <div>
              <div className="font-bold text-sm text-[#012d1d] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">signal_cellular_alt_1_bar</span>
                <span>Low Bandwidth & Data Saver Mode</span>
              </div>
              <p className="text-[11px] text-[#414844] mt-0.5">
                Optimizes images and compressed data packets for 2G / 3G rural networks in remote farming clusters.
              </p>
            </div>

            <button
              type="button"
              onClick={toggleDataSaver}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                isDataSaver ? 'bg-[#012d1d]' : 'bg-[#c1c8c2]'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                  isDataSaver ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          <div className="pt-2 flex justify-between items-center">
            <button
              type="button"
              onClick={() => {
                logout();
                setIsSaved(true);
                setTimeout(() => setIsSaved(false), 2000);
              }}
              className="h-11 px-5 border border-[#ba1a1a] text-[#ba1a1a] font-bold text-xs rounded-full hover:bg-[#ffdad6] transition-colors"
            >
              Reset to Default Farmer
            </button>

            <button
              type="submit"
              className="h-11 px-6 bg-[#012d1d] text-white font-bold text-xs rounded-full hover:bg-[#1b4332] shadow-sm transition-all"
            >
              {isSaved ? 'Settings Saved ✓' : 'Save Preferences'}
            </button>
          </div>
        </form>
      </div>

      {/* Instant Role Switcher Section */}
      <div className="bg-white border border-[#c1c8c2] rounded-2xl p-6 space-y-4 shadow-xs">
        <div className="flex justify-between items-center pb-2 border-b border-[#e2e2e2]">
          <div>
            <h3 className="font-heading font-bold text-base text-[#012d1d]">
              Direct Role Access (No Registration Needed)
            </h3>
            <p className="text-xs text-[#717973] mt-0.5">
              Jump instantly to any stakeholder interface with full features enabled.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveView('splash')}
            className="text-xs font-bold text-[#0a3826] hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">slideshow</span>
            <span>View Intro Slides</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { id: 'farmer', title: 'Farmer', icon: 'grass', desc: 'Abebe Usman' },
            { id: 'cooperative', title: 'Cooperative', icon: 'groups', desc: 'United Grain' },
            { id: 'buyer', title: 'Buyer / Off-taker', icon: 'storefront', desc: 'Premium Agro' },
            { id: 'supplier', title: 'Input Supplier', icon: 'water_drop', desc: 'AgriGrow Ltd' },
            { id: 'transporter', title: 'Transporter', icon: 'local_shipping', desc: 'Ibrahim Haulage' },
            { id: 'super_admin', title: 'System Admin', icon: 'admin_panel_settings', desc: 'Ministry Directorate' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setRole(item.id as any);
                setActiveView('dashboard');
              }}
              className={`p-3 rounded-xl border text-left transition-all ${
                user.role === item.id
                  ? 'border-[#0a3826] bg-[#e7f5e8] ring-1 ring-[#0a3826]'
                  : 'border-[#c1c8c2] hover:border-[#0a3826] hover:bg-[#f9faf9]'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`material-symbols-outlined text-[18px] ${user.role === item.id ? 'text-[#0a3826]' : 'text-[#717973]'}`}>
                  {item.icon}
                </span>
                <span className="font-heading font-bold text-xs text-[#1a1c1c]">{item.title}</span>
              </div>
              <div className="text-[10px] text-[#717973] truncate">{item.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
