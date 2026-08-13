import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  getNigerianAvatar,
  NIGERIAN_MALE_AVATARS,
  NIGERIAN_FEMALE_AVATARS,
} from '../../utils/avatarUtils';

export const ProfileView: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const { isDataSaver, toggleDataSaver } = useApp();

  const [language, setLanguage] = useState(user?.language || 'English');
  const [isSaved, setIsSaved] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [selectedGender, setSelectedGender] = useState<'male' | 'female'>('female');

  if (!user) return null;

  const currentAvatar = user.photoUrl || getNigerianAvatar(user.name);

  const handleSelectAvatar = (url: string) => {
    updateUser({ photoUrl: url });
    setShowAvatarPicker(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ language });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white border border-[#c1c8c2] rounded-2xl p-6 space-y-4 shadow-xs text-center sm:text-left flex flex-col sm:flex-row items-center gap-5">
        {/* User Photo with Edit Badge */}
        <div className="relative group shrink-0">
          <img
            src={currentAvatar}
            alt={user.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-[#c1ecd4] shadow-md group-hover:opacity-90 transition-opacity"
          />
          <button
            onClick={() => setShowAvatarPicker(!showAvatarPicker)}
            className="absolute bottom-0 right-0 bg-[#012d1d] hover:bg-[#1b4332] text-white p-1.5 rounded-full shadow-sm border border-white cursor-pointer transition-transform active:scale-95"
            title="Change Profile Photo"
          >
            <span className="material-symbols-outlined text-sm">photo_camera</span>
          </button>
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="font-heading font-bold text-xl text-[#012d1d]">{user.name}</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#c1ecd4] text-[#002114] font-bold text-[10px] uppercase">
              {user.verificationStatus} Verified
            </span>
          </div>

          <p className="text-xs text-[#414844]">
            {user.role.replace('_', ' ').toUpperCase()} • {user.state} ({user.lga || 'Central'} LGA)
          </p>

          <p className="text-[11px] text-[#717973] font-mono">
            Agro ID: {user.nin || user.cacNumber || 'NG-AGRO-2026-99128'}
          </p>

          <button
            onClick={() => setShowAvatarPicker(!showAvatarPicker)}
            className="mt-2 text-xs font-bold text-[#012d1d] hover:underline flex items-center justify-center sm:justify-start gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">face</span>
            <span>{showAvatarPicker ? 'Hide Photo Options' : 'Change Profile Photo'}</span>
          </button>
        </div>
      </div>

      {/* Dynamic Nigerian Avatar Selector Modal/Section */}
      {showAvatarPicker && (
        <div className="bg-white border border-[#012d1d]/30 rounded-2xl p-5 space-y-4 shadow-sm animate-fadeIn">
          <div className="flex items-center justify-between pb-2 border-b border-[#e2e2e2]">
            <div>
              <h3 className="font-heading font-bold text-sm text-[#012d1d]">
                Select African Profile Photo
              </h3>
              <p className="text-xs text-[#717973]">
                Choose from diverse male & female African agricultural professionals
              </p>
            </div>

            {/* Gender Toggle Tabs */}
            <div className="flex bg-[#f3f3f3] p-1 rounded-xl text-xs font-bold border border-[#c1c8c2]">
              <button
                type="button"
                onClick={() => setSelectedGender('female')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  selectedGender === 'female'
                    ? 'bg-[#012d1d] text-white shadow-xs'
                    : 'text-[#414844] hover:text-[#012d1d]'
                }`}
              >
                Female Profiles
              </button>
              <button
                type="button"
                onClick={() => setSelectedGender('male')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  selectedGender === 'male'
                    ? 'bg-[#012d1d] text-white shadow-xs'
                    : 'text-[#414844] hover:text-[#012d1d]'
                }`}
              >
                Male Profiles
              </button>
            </div>
          </div>

          {/* Avatar Gallery Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 pt-2">
            {(selectedGender === 'female' ? NIGERIAN_FEMALE_AVATARS : NIGERIAN_MALE_AVATARS).map(
              (imgUrl, idx) => {
                const isSelected = currentAvatar === imgUrl;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectAvatar(imgUrl)}
                    className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all cursor-pointer group ${
                      isSelected
                        ? 'border-[#012d1d] ring-2 ring-[#c1ecd4] scale-105 shadow-sm'
                        : 'border-[#e2e2e2] hover:border-[#012d1d] hover:scale-102'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Nigerian avatar ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-[#012d1d]/40 flex items-center justify-center">
                        <span className="material-symbols-outlined text-white font-bold text-xl">
                          check_circle
                        </span>
                      </div>
                    )}
                  </button>
                );
              }
            )}
          </div>
        </div>
      )}

      {/* Settings Form */}
      <div className="bg-white border border-[#c1c8c2] rounded-2xl p-6 space-y-5 shadow-xs">
        <h3 className="font-heading font-bold text-base text-[#012d1d] pb-2 border-b border-[#e2e2e2]">
          App & Accessibility Settings
        </h3>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#1a1c1c] mb-1">
              Preferred Platform Language
            </label>
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
                <span className="material-symbols-outlined text-[18px]">
                  signal_cellular_alt_1_bar
                </span>
                <span>Low Bandwidth & Data Saver Mode</span>
              </div>
              <p className="text-[11px] text-[#414844] mt-0.5">
                Optimizes images and compressed data packets for 2G / 3G rural networks in remote
                farming clusters.
              </p>
            </div>

            <button
              type="button"
              onClick={toggleDataSaver}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
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
              type="submit"
              className="h-11 px-6 bg-[#012d1d] text-white font-bold text-xs rounded-full hover:bg-[#1b4332] cursor-pointer"
            >
              {isSaved ? 'Settings Saved ✓' : 'Save Preferences'}
            </button>

            <button
              type="button"
              onClick={logout}
              className="h-11 px-6 bg-[#ba1a1a] text-white font-bold text-xs rounded-full hover:bg-[#93000a] cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
