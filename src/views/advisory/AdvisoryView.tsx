import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export const AdvisoryView: React.FC = () => {
  const { user } = useAuth();
  const { weather, marketPrices, pestAlerts, extensionGuides } = useApp();

  const [selectedLanguage, setSelectedLanguage] = useState<'English' | 'Hausa' | 'Yoruba' | 'Igbo'>('English');

  return (
    <div className="space-y-6">
      {/* Banner & Language Audio Bar */}
      <div className="bg-[#012d1d] text-white p-6 rounded-2xl shadow-sm border border-[#1b4332] space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#86af99] bg-[#1b4332] px-3 py-1 rounded-full border border-[#86af99]/30">
              NiMet & NIHSA Integrated Extension Network
            </span>
            <h1 className="font-heading font-bold text-2xl mt-2">Agronomy Advisory & Market Intelligence</h1>
            <p className="text-xs text-[#86af99]">
              Local Weather Forecasts, Pest Warning Systems, and Real-Time Grain Benchmarks
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#1b4332] p-1.5 rounded-full border border-[#86af99]/30">
            <span className="material-symbols-outlined text-[#86af99] pl-2 text-[18px]">record_voice_over</span>
            {(['English', 'Hausa', 'Yoruba', 'Igbo'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  selectedLanguage === lang ? 'bg-[#c1ecd4] text-[#002114]' : 'text-[#86af99] hover:text-white'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Localized Weather Widget */}
        {weather && (
          <div className="bg-[#1b4332] p-4 rounded-xl border border-[#274e3d] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#c1ecd4] text-[40px]">partly_cloudy_day</span>
              <div>
                <div className="font-heading font-bold text-2xl text-[#c1ecd4]">
                  {weather.temperatureC}°C • {weather.condition}
                </div>
                <div className="text-xs text-[#86af99]">
                  {weather.state} ({weather.lga} LGA) • Rainfall Prob: {weather.rainProbability}%
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-[#012d1d] rounded-lg border border-[#86af99]/30 text-xs space-y-1">
              <div className="font-bold text-[#c1ecd4] flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">eco</span>
                <span>Agronomist Planting Recommendation:</span>
              </div>
              <p className="text-[#86af99] text-[11px] leading-relaxed">
                {selectedLanguage === 'Hausa'
                  ? 'Kyakkyawan lokaci don shuka masara da waken soya. Ruwan sama zai ci gaba.'
                  : selectedLanguage === 'Yoruba'
                  ? 'Akokọ to dara fun gbingbin agbado ati ewe. Ojo yoo rọ dada.'
                  : 'Optimal soil moisture window for planting Maize, Soybeans & Cassava stems over next 48 hours.'}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Commodity Market Prices */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#c1c8c2] p-5 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-[#e2e2e2]">
            <h3 className="font-heading font-bold text-base text-[#012d1d] flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">trending_up</span>
              <span>National Commodity Price Index (Today)</span>
            </h3>
            <span className="text-[10px] bg-[#c1ecd4] text-[#002114] font-bold px-2 py-0.5 rounded">
              Verified Grain Hubs
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {marketPrices.map((mp) => (
              <div key={mp.id} className="p-3.5 bg-[#f9f9f9] border border-[#e2e2e2] rounded-xl space-y-2">
                <div className="flex justify-between items-start font-bold text-xs text-[#1a1c1c]">
                  <div>
                    <span>{mp.cropTitle}</span>
                    <span className="block text-[10px] text-[#717973] font-normal">{mp.marketName}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[#012d1d] font-heading font-bold text-sm">
                      ₦{mp.currentPrice.toLocaleString()}
                    </span>
                    <span className="block text-[10px] text-[#3f6653] font-semibold">/ {mp.unit}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] pt-2 border-t border-[#e2e2e2]">
                  <span className="text-[#717973]">{mp.state}</span>
                  <span
                    className={`font-bold flex items-center ${
                      mp.priceChange.startsWith('+') ? 'text-[#012d1d]' : 'text-[#ba1a1a]'
                    }`}
                  >
                    {mp.priceChange}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pest Outbreak & Emergency Alerts */}
        <div className="bg-white rounded-2xl border border-[#c1c8c2] p-5 space-y-4">
          <h3 className="font-heading font-bold text-base text-[#012d1d] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ba1a1a] text-[20px]">warning</span>
            <span>Early Warning Pest Alerts</span>
          </h3>

          <div className="space-y-3">
            {pestAlerts.map((pa) => (
              <div key={pa.id} className="p-3.5 bg-[#fff8f6] border border-[#ffdad6] rounded-xl space-y-1.5 text-xs">
                <div className="flex justify-between font-bold text-[#ba1a1a]">
                  <span>{pa.title}</span>
                  <span className="text-[9px] uppercase px-2 py-0.5 rounded bg-[#ffdad6]">{pa.severity}</span>
                </div>
                <p className="text-[#414844] text-[11px] leading-snug">{pa.description}</p>
                <div className="p-2 bg-white rounded border border-[#ffdad6] text-[10px] font-semibold text-[#012d1d]">
                  Mitigation: {pa.preventionAdvice}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Agronomy Extension Guides */}
      <div className="bg-white rounded-2xl border border-[#c1c8c2] p-5 space-y-4">
        <h3 className="font-heading font-bold text-base text-[#012d1d] flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">menu_book</span>
          <span>Federal Agronomy Extension Guides</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {extensionGuides.map((eg) => (
            <div key={eg.id} className="p-4 bg-[#f9f9f9] border border-[#e2e2e2] rounded-xl space-y-2">
              <div className="flex justify-between items-start">
                <h4 className="font-heading font-bold text-sm text-[#012d1d]">{eg.title}</h4>
                <span className="text-[10px] font-bold bg-[#c1ecd4] text-[#002114] px-2 py-0.5 rounded">
                  {eg.cropType}
                </span>
              </div>
              <p className="text-xs text-[#414844]">{eg.summary}</p>
              <div className="pt-2 flex justify-between items-center text-[11px]">
                <span className="text-[#717973]">Author: {eg.author}</span>
                <button className="font-bold text-[#012d1d] hover:underline flex items-center gap-1">
                  <span>Read Guide</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
