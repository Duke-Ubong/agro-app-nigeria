import React from 'react';
import { useApp } from '../../context/AppContext';
import { Language } from '../../types';

export const LANGUAGES: { code: Language; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'ha', label: 'Hausa', native: 'Harshen Hausa' },
  { code: 'yo', label: 'Yoruba', native: 'Èdè Yorùbá' },
  { code: 'ig', label: 'Igbo', native: 'Ásụ̀sụ́ Ígbò' },
];

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useApp();
  const [isOpen, setIsOpen] = React.useState(false);

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#f3f3f3] hover:bg-[#e8e8e8] text-[#1a1c1c] text-xs font-semibold border border-[#c1c8c2] transition-colors active:scale-95"
        title="Change Language"
      >
        <span className="material-symbols-outlined text-[16px] text-[#012d1d]">language</span>
        <span>{currentLang.label}</span>
        <span className="material-symbols-outlined text-[14px]">expand_more</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-[#c1c8c2] z-50 p-1.5 space-y-1">
            <div className="px-2 py-1 text-[10px] font-bold text-[#717973] uppercase">Language / Harshe / Èdè</div>
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs flex justify-between items-center transition-colors ${
                  language === lang.code
                    ? 'bg-[#1b4332] text-white font-bold'
                    : 'hover:bg-[#f3f3f3] text-[#1a1c1c]'
                }`}
              >
                <span>{lang.label}</span>
                <span className="text-[10px] opacity-80">{lang.native}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
