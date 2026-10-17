import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

interface StateWeatherData {
  state: string;
  lga: string;
  zone: string;
  tempCelsius: number;
  condition: string;
  conditionIcon: string;
  humidityPercent: number;
  windSpeedKm: number;
  rainForecastPercent: number;
  soilMoisturePercent: number;
  soilTempCelsius: number;
  evapotranspirationMm: number;
  uvIndex: number;
  advisoryText: string;
  forecast: {
    day: string;
    tempHigh: number;
    tempLow: number;
    condition: string;
    icon: string;
    rainProb: number;
    farmingAction: string;
  }[];
}

const NIGERIA_STATE_WEATHER: Record<string, StateWeatherData> = {
  'Kaduna State': {
    state: 'Kaduna State',
    lga: 'Zaria / Kaduna Central',
    zone: 'Northern Guinea Savannah',
    tempCelsius: 29,
    condition: 'Partly Cloudy',
    conditionIcon: 'partly_cloudy_day',
    humidityPercent: 62,
    windSpeedKm: 12,
    rainForecastPercent: 35,
    soilMoisturePercent: 58,
    soilTempCelsius: 26,
    evapotranspirationMm: 4.8,
    uvIndex: 8,
    advisoryText: 'Optimal soil moisture and ambient temperature window for grain conditioning and land preparation for maize, soybeans, and sorghum.',
    forecast: [
      { day: 'Today', tempHigh: 31, tempLow: 21, condition: 'Partly Cloudy', icon: 'partly_cloudy_day', rainProb: 35, farmingAction: 'Good for tractor tillage & clearing' },
      { day: 'Tomorrow', tempHigh: 30, tempLow: 22, condition: 'Scattered Showers', icon: 'rainy', rainProb: 65, farmingAction: 'Hold fertilizer top-dressing until ground stabilizes' },
      { day: 'Wed', tempHigh: 29, tempLow: 20, condition: 'Cloudy', icon: 'cloud', rainProb: 40, farmingAction: 'Optimal soil moisture for sowing certified seeds' },
      { day: 'Thu', tempHigh: 32, tempLow: 21, condition: 'Sunny & Dry', icon: 'wb_sunny', rainProb: 15, farmingAction: 'Favorable for post-emergence weed control' },
      { day: 'Fri', tempHigh: 31, tempLow: 22, condition: 'Partly Cloudy', icon: 'partly_cloudy_day', rainProb: 25, farmingAction: 'Inspect traps for fall armyworm larvae' },
      { day: 'Sat', tempHigh: 30, tempLow: 21, condition: 'Scattered Showers', icon: 'rainy', rainProb: 60, farmingAction: 'Ensure farm water retention furrows are clear' },
      { day: 'Sun', tempHigh: 29, tempLow: 20, condition: 'Clear Sky', icon: 'wb_sunny', rainProb: 10, farmingAction: 'Excellent day for sun-drying grain batches' },
    ],
  },
  'Kano State': {
    state: 'Kano State',
    lga: 'Kura / Kano Municipal',
    zone: 'Sudan Savannah',
    tempCelsius: 34,
    condition: 'Sunny & Dry',
    conditionIcon: 'wb_sunny',
    humidityPercent: 42,
    windSpeedKm: 16,
    rainForecastPercent: 10,
    soilMoisturePercent: 38,
    soilTempCelsius: 30,
    evapotranspirationMm: 6.2,
    uvIndex: 10,
    advisoryText: 'High evapotranspiration rate. Maintain scheduled drip and furrow irrigation across tomato and wheat clusters. Mulch vegetable beds.',
    forecast: [
      { day: 'Today', tempHigh: 35, tempLow: 24, condition: 'Sunny', icon: 'wb_sunny', rainProb: 10, farmingAction: 'Irrigate horticulture early morning' },
      { day: 'Tomorrow', tempHigh: 36, tempLow: 25, condition: 'Hot & Dry', icon: 'sunny', rainProb: 5, farmingAction: 'Avoid foliar sprays during peak heat' },
      { day: 'Wed', tempHigh: 34, tempLow: 23, condition: 'Partly Cloudy', icon: 'partly_cloudy_day', rainProb: 20, farmingAction: 'Apply organic mulch to retain soil moisture' },
      { day: 'Thu', tempHigh: 33, tempLow: 23, condition: 'Breezy', icon: 'air', rainProb: 15, farmingAction: 'Inspect grain storage silos for weevil control' },
      { day: 'Fri', tempHigh: 34, tempLow: 24, condition: 'Sunny', icon: 'wb_sunny', rainProb: 10, farmingAction: 'Check drip emitters for mineral blockage' },
      { day: 'Sat', tempHigh: 35, tempLow: 25, condition: 'Clear', icon: 'wb_sunny', rainProb: 10, farmingAction: 'Solarization of nursery seedbeds recommended' },
      { day: 'Sun', tempHigh: 34, tempLow: 24, condition: 'Partly Cloudy', icon: 'partly_cloudy_day', rainProb: 25, farmingAction: 'Prepare storage bags with hermetic seals' },
    ],
  },
  'Benue State': {
    state: 'Benue State',
    lga: 'Makurdi / Zaki Biam',
    zone: 'Southern Guinea Savannah',
    tempCelsius: 30,
    condition: 'Thunderstorms Likely',
    conditionIcon: 'thunderstorm',
    humidityPercent: 78,
    windSpeedKm: 14,
    rainForecastPercent: 75,
    soilMoisturePercent: 76,
    soilTempCelsius: 27,
    evapotranspirationMm: 4.1,
    uvIndex: 7,
    advisoryText: 'Active heavy rainfall front. High risk of river basin waterlogging in low-lying farms. Reinforce yam mounds and maintain drainage canals.',
    forecast: [
      { day: 'Today', tempHigh: 30, tempLow: 23, condition: 'Thunderstorms', icon: 'thunderstorm', rainProb: 75, farmingAction: 'Clear drainage ditches around yam mounds' },
      { day: 'Tomorrow', tempHigh: 29, tempLow: 22, condition: 'Heavy Rain', icon: 'rainy', rainProb: 80, farmingAction: 'Avoid field traffic to prevent soil compaction' },
      { day: 'Wed', tempHigh: 30, tempLow: 23, condition: 'Light Rain', icon: 'rainy', rainProb: 50, farmingAction: 'Inspect yam vines for anthracnose spots' },
      { day: 'Thu', tempHigh: 31, tempLow: 23, condition: 'Partly Cloudy', icon: 'partly_cloudy_day', rainProb: 30, farmingAction: 'Good time for staking emerging yam vines' },
      { day: 'Fri', tempHigh: 32, tempLow: 24, condition: 'Cloudy', icon: 'cloud', rainProb: 40, farmingAction: 'Check grain storage for moisture ingress' },
      { day: 'Sat', tempHigh: 30, tempLow: 23, condition: 'Showers', icon: 'rainy', rainProb: 65, farmingAction: 'Inspect soy plots for root-knot nematodes' },
      { day: 'Sun', tempHigh: 31, tempLow: 23, condition: 'Partly Cloudy', icon: 'partly_cloudy_day', rainProb: 35, farmingAction: 'Prepare harvested tubers for co-op aggregation' },
    ],
  },
  'Ogun State': {
    state: 'Ogun State',
    lga: 'Abeokuta South / Sagamu',
    zone: 'Rainforest Transition Zone',
    tempCelsius: 31,
    condition: 'Humid & Overcast',
    conditionIcon: 'cloud',
    humidityPercent: 84,
    windSpeedKm: 9,
    rainForecastPercent: 55,
    soilMoisturePercent: 72,
    soilTempCelsius: 28,
    evapotranspirationMm: 3.9,
    uvIndex: 8,
    advisoryText: 'High relative humidity favors fungal leaf spots on cassava and cocoa black pod disease. Apply copper-based fungicide spray early morning.',
    forecast: [
      { day: 'Today', tempHigh: 31, tempLow: 24, condition: 'Humid & Overcast', icon: 'cloud', rainProb: 55, farmingAction: 'Inspect cocoa pods for black pod lesions' },
      { day: 'Tomorrow', tempHigh: 30, tempLow: 23, condition: 'Afternoon Showers', icon: 'rainy', rainProb: 60, farmingAction: 'Plant healthy, certified TME-419 cassava stems' },
      { day: 'Wed', tempHigh: 32, tempLow: 24, condition: 'Partly Sunny', icon: 'partly_cloudy_day', rainProb: 30, farmingAction: 'Weeding around young cassava plantations' },
      { day: 'Thu', tempHigh: 31, tempLow: 23, condition: 'Light Showers', icon: 'rainy', rainProb: 45, farmingAction: 'Apply organic compost around fruit trees' },
      { day: 'Fri', tempHigh: 32, tempLow: 24, condition: 'Sunny Breaks', icon: 'wb_sunny', rainProb: 25, farmingAction: 'Harvest ripe palm bunches for processing' },
      { day: 'Sat', tempHigh: 31, tempLow: 24, condition: 'Thunderstorms', icon: 'thunderstorm', rainProb: 70, farmingAction: 'Cover processed garri and dry flour stocks' },
      { day: 'Sun', tempHigh: 30, tempLow: 23, condition: 'Overcast', icon: 'cloud', rainProb: 40, farmingAction: 'Inspect perimeter fences against rodents' },
    ],
  },
  'Plateau State': {
    state: 'Plateau State',
    lga: 'Jos South / Barkin Ladi',
    zone: 'High Altitude Plateau',
    tempCelsius: 23,
    condition: 'Cool & Breezy',
    conditionIcon: 'air',
    humidityPercent: 56,
    windSpeedKm: 18,
    rainForecastPercent: 30,
    soilMoisturePercent: 64,
    soilTempCelsius: 19,
    evapotranspirationMm: 3.5,
    uvIndex: 9,
    advisoryText: 'Temperate climate highly conducive for Irish potato tuberization and exotic vegetables. Monitor for late blight following cool morning dews.',
    forecast: [
      { day: 'Today', tempHigh: 24, tempLow: 15, condition: 'Cool & Breezy', icon: 'air', rainProb: 30, farmingAction: 'Ridge earthing-up for Irish potato tubers' },
      { day: 'Tomorrow', tempHigh: 23, tempLow: 14, condition: 'Partly Cloudy', icon: 'partly_cloudy_day', rainProb: 35, farmingAction: 'Fungicide preventive spray for late blight' },
      { day: 'Wed', tempHigh: 25, tempLow: 16, condition: 'Sunny', icon: 'wb_sunny', rainProb: 15, farmingAction: 'Harvest mature cabbage and bell peppers' },
      { day: 'Thu', tempHigh: 24, tempLow: 15, condition: 'Breezy', icon: 'air', rainProb: 20, farmingAction: 'Plant certified disease-free potato seed cuts' },
      { day: 'Fri', tempHigh: 23, tempLow: 14, condition: 'Afternoon Rain', icon: 'rainy', rainProb: 55, farmingAction: 'Check drainage in terraced farm slopes' },
      { day: 'Sat', tempHigh: 24, tempLow: 15, condition: 'Cloudy', icon: 'cloud', rainProb: 40, farmingAction: 'Top-dress maize fields with urea' },
      { day: 'Sun', tempHigh: 25, tempLow: 16, condition: 'Sunny', icon: 'wb_sunny', rainProb: 10, farmingAction: 'Pack cold-chain crate vegetables for market' },
    ],
  },
};

const AUDIO_BULLETINS = {
  English: {
    title: 'Federal Agronomic Weather Advisory — Bulletin #AGR-2026-W14',
    speaker: 'NiMet Senior Agricultural Meteorologist',
    duration: '1:45',
    text: 'Farmers across the North-Central and Middle-Belt grain corridors are advised that steady rainfall front is moving eastward. Soil moisture across Kaduna, Niger, and Benue is optimal for sowing certified seeds of hybrid maize, soybeans, and high-starch cassava. Hold broadcasting of granular nitrogen fertilizer 24 hours prior to anticipated thunderstorms to minimize nutrient leaching. Early fall armyworm traps should be inspected at dawn.',
  },
  Hausa: {
    title: 'Saƙon Fadakarwa Ga Manoma Kan Yanayi Da Shuka',
    speaker: 'Jami’in Fadada Ilimin Noma (NiMet / ADP)',
    duration: '2:10',
    text: 'Barka da rana ga manoman mu na Najeriya. Wannan saƙo ne daga Hukumar Kula da Yanayi (NiMet) da Ma’aikatar Noma ta Kasa. Yanayin kasa da ruwan sama a Kaduna da Kano da sauran yankunan arewa yana da matukar kyau don shuka masara da waken soya. Kada a zuba takin Ureaya a lokacin da ake tsammanin mamakon ruwa don kar ruwa ya tafi da shi. A duba gonaki da sassafe don kare amfanin gona daga tsutsar masara (Fall Armyworm).',
  },
  Yoruba: {
    title: 'Ìkìlọ̀ Ojú-Ọjọ́ Àti Ìmọ̀ràn Fún Àwọn Àgbẹ̀',
    speaker: 'Olùdámọ̀ràn Nípa Iṣẹ́ Àgbẹ̀ (Federal Ministry / ADP)',
    duration: '1:55',
    text: 'Ẹ kú ojúmọ́ gbogbo àwọn àgbẹ̀ wa olùfẹ́. Ìkìlọ̀ pàtàkì láti ọ̀dọ̀ àwọn onímọ̀ ojú-ọjọ́ NiMet àti Ilé-iṣẹ́ Ìjọba Àpapọ̀: Ọ̀rinrin ilẹ̀ dára gan-an ní àkókò yìí fún gbígbin ẹ̀gẹ́ TME-419 àti àgbàdo. Ẹ ṣọ́ra fún àrùn dídú orí kóko nípasẹ̀ títọ́jú igi kóko dáadáa. Ẹ má ṣe wọ́n ajílẹ̀ nígbà tí òjò bá fẹ́ rọ̀ púpọ̀ kí omi má baà gbé e lọ. Ẹ pe nọ́mbà ọ̀fẹ́ wa 0800-AGRO-CONNECT fún ìrànwọ́ lẹ́sẹ̀kẹsẹ̀.',
  },
  Igbo: {
    title: 'Ozi Ndụmọdụ Banyere Ọnọdụ Ihu Igwe Maka Ndị Ọrụ Ugbo',
    speaker: 'Onye Ọkachamara N’ihe Gbasara Ọrụ Ugbo',
    duration: '2:05',
    text: 'Ndewo nu ndị ọrụ ugbo anyị. Nke a bụ ozi pụrụ iche sitere na NiMet na Ngalaba Ọrụ Ugbo nke Gọọmentị Etiti. Ihu igwe na mmiri ozuzo n’oge a dị mma nke ukwuu maka ịkụ ọka, ji, na akpụ. Kpacharanụ anya ka mmiri ozuzo buru ibu ghara imebi akụkụ ugbo dị nso n’iyi ma ọ bụ osimiri. E tinyela fatịlaịza mgbe oké mmiri ozuzo na-ezo. Kpọọ nọmba anyị n’efu maka ndụmọdụ ọzọ.',
  },
};

const CROP_PLAYBOOKS = [
  {
    id: 'maize',
    name: 'Yellow / White Maize',
    icon: 'grain',
    currentSeason: 'Early Sowing & Vegetative Stage',
    soilRequirement: 'Well-drained loam, pH 5.8 - 6.8',
    fertilizer: 'NPK 20:10:10 (4 bags/ha basal) + Urea 46-0-0 split at 4 & 7 weeks',
    irrigation: '450 - 650 mm total crop cycle; avoid drought at tasseling',
    pestThreat: 'Fall Armyworm (Spodoptera frugiperda); Stem Borers',
    controlMeasure: 'Apply Emamectin Benzoate 5% SG or bio-pesticide early morning at whorl',
    targetYield: '4.5 - 6.5 MT / Hectare (Certified Hybrid Varieties)',
  },
  {
    id: 'cassava',
    name: 'Cassava (TME 419 / Vitamin A)',
    icon: 'psychiatry',
    currentSeason: 'Stem Planting & Tuber Bulking',
    soilRequirement: 'Deep, friable sandy clay loam, pH 5.0 - 6.5',
    fertilizer: 'NPK 15:15:15 or 12:12:17 at 8 weeks after planting (WAP)',
    irrigation: 'High drought tolerance; requires moisture in first 60 days',
    pestThreat: 'Cassava Mosaic Disease, Green Mite, Whitefly vectors',
    controlMeasure: 'Use virus-free certified stem cuttings from accredited FMFS nurseries',
    targetYield: '25 - 35 MT / Hectare (Industrial Starch Quality)',
  },
  {
    id: 'rice',
    name: 'Paddy Rice (Faro 44 / 52)',
    icon: 'grass',
    currentSeason: 'Nursery Prep & Lowland Bunding',
    soilRequirement: 'Heavy clay or clay-loam with impermeable subsoil layer',
    fertilizer: 'NPK 15:15:15 basal + Urea deep placement (UDP) at tillering',
    irrigation: 'Shallow flooding (5-10cm depth) maintained through panicle initiation',
    pestThreat: 'African Rice Gall Midge, Blast (Pyricularia oryzae)',
    controlMeasure: 'Water level management and fungicide seed dressing with Thiram',
    targetYield: '5.0 - 7.5 MT / Hectare (Irrigated Lowland Ecology)',
  },
  {
    id: 'yam',
    name: 'White Yam Tubers',
    icon: 'spa',
    currentSeason: 'Vine Staking & Foliage Growth',
    soilRequirement: 'Rich alluvial soils, high organic matter, deep loose mounds',
    fertilizer: 'Organic well-rotted farmyard manure + NPK 12:12:17 at 12 WAP',
    irrigation: 'Rainfed; requires 1000 - 1400 mm evenly distributed rainfall',
    pestThreat: 'Yam Beetle, Nematodes, Anthracnose leaf blight',
    controlMeasure: 'Ash dusting of seed setts + Mancozeb spray for anthracnose',
    targetYield: '15 - 22 MT / Hectare (Export Ware Quality)',
  },
  {
    id: 'soybeans',
    name: 'Soybeans (TGX Varieties)',
    icon: 'energy_savings_leaf',
    currentSeason: 'Land Inoculation & Planting',
    soilRequirement: 'Fertile loams with good phosphorus availability, pH 6.0 - 7.0',
    fertilizer: 'Single Super Phosphate (SSP) for root nodulation; low nitrogen need',
    irrigation: 'Moisture critical during flowering and pod development',
    pestThreat: 'Pod Borers, Rust (Phakopsora pachyrhizi)',
    controlMeasure: 'Rhizobium bio-inoculant + crop rotation with cereals',
    targetYield: '2.0 - 3.2 MT / Hectare (High Protein / Oil Content)',
  },
];

export const AdvisoryView: React.FC = () => {
  const { user } = useAuth();
  const { marketPrices } = useApp();

  // State selection defaulting to user state or Kaduna
  const defaultState = NIGERIA_STATE_WEATHER[user.state] ? user.state : 'Kaduna State';
  const [selectedState, setSelectedState] = useState<string>(defaultState);
  const [selectedLanguage, setSelectedLanguage] = useState<'English' | 'Hausa' | 'Yoruba' | 'Igbo'>('English');
  const [activeCropId, setActiveCropId] = useState<string>('maize');
  
  // Audio player simulation state
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioProgress, setAudioProgress] = useState<number>(35);

  // Radar animation simulation state
  const [isRadarPlaying, setIsRadarPlaying] = useState<boolean>(true);
  const [radarFrame, setRadarFrame] = useState<number>(2);
  const [radarLayer, setRadarLayer] = useState<'precipitation' | 'flood' | 'soil'>('precipitation');

  // Report pest modal state
  const [showPestModal, setShowPestModal] = useState<boolean>(false);
  const [pestReportSuccess, setPestReportSuccess] = useState<boolean>(false);
  const [pestFormData, setPestFormData] = useState({
    crop: 'Maize',
    pestType: 'Fall Armyworm',
    farmLocation: `${user.state} (${user.lga || 'Zaria'} LGA)`,
    affectedAcres: '2.5',
    severity: 'High',
  });

  const weatherData = NIGERIA_STATE_WEATHER[selectedState] || NIGERIA_STATE_WEATHER['Kaduna State'];
  const audioBulletin = AUDIO_BULLETINS[selectedLanguage] || AUDIO_BULLETINS.English;
  const currentCrop = CROP_PLAYBOOKS.find((c) => c.id === activeCropId) || CROP_PLAYBOOKS[0];

  // Radar animation loop
  useEffect(() => {
    if (!isRadarPlaying) return;
    const interval = setInterval(() => {
      setRadarFrame((prev) => (prev + 1) % 4);
    }, 1800);
    return () => clearInterval(interval);
  }, [isRadarPlaying]);

  // Audio player simulation timer
  useEffect(() => {
    if (!isPlayingAudio) return;
    const interval = setInterval(() => {
      setAudioProgress((prev) => (prev >= 100 ? 0 : prev + 2));
    }, 600);
    return () => clearInterval(interval);
  }, [isPlayingAudio]);

  const handlePestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPestReportSuccess(true);
    setTimeout(() => {
      setPestReportSuccess(false);
      setShowPestModal(false);
    }, 2200);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Federal NiMet & NIHSA Integrated Agro-Climate Command Center */}
      <div className="bg-[#012d1d] text-white p-6 rounded-2xl shadow-md border border-[#1b4332] space-y-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#022c1b] bg-[#10b981] px-3 py-1 rounded-full flex items-center gap-1 font-mono">
                <span className="w-2 h-2 rounded-full bg-[#022c1b] animate-ping" />
                <span>NIMET SATELLITE TELEMETRY LIVE</span>
              </span>
              <span className="text-[10px] font-bold text-[#86af99] bg-[#1b4332] px-2.5 py-0.5 rounded-full border border-[#86af99]/30">
                NIHSA Hydrological Flood Watch
              </span>
              <span className="text-[10px] font-bold text-[#fde047] bg-[#854d0e]/40 px-2.5 py-0.5 rounded-full border border-[#eab308]/40">
                FMFS Extension Division
              </span>
            </div>
            
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">
              Agronomy Advisory & Smart Weather Intelligence
            </h1>
            <p className="text-xs text-[#86af99] max-w-2xl mt-1">
              Localized Soil Moisture, Micro-Climate Forecasts, Pest Warning Systems, and Real-Time Agricultural Commodity Benchmarks.
            </p>
          </div>

          {/* Agricultural State Selector */}
          <div className="bg-[#1b4332] p-2 rounded-xl border border-[#274e3d] flex flex-col gap-1 w-full sm:w-auto">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#86af99] flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#10b981]">location_on</span>
              <span>Select Agro-Climatic Zone:</span>
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-[#012d1d] text-[#c1ecd4] font-bold text-xs h-9 px-3 rounded-lg border border-[#86af99]/40 focus:outline-none focus:border-[#10b981]"
            >
              {Object.keys(NIGERIA_STATE_WEATHER).map((st) => (
                <option key={st} value={st}>
                  {st} ({NIGERIA_STATE_WEATHER[st].zone})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Primary State Telemetry Card with Micro-Climate Metrics */}
        <div className="bg-[#1b4332]/80 backdrop-blur-md p-5 rounded-xl border border-[#274e3d] grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          
          {/* Main Temp & Condition */}
          <div className="md:col-span-2 flex items-center gap-4 border-b md:border-b-0 md:border-r border-[#274e3d] pb-4 md:pb-0 pr-0 md:pr-4">
            <div className="w-16 h-16 rounded-2xl bg-[#012d1d] flex items-center justify-center text-[#10b981] border border-[#10b981]/40 shadow-inner">
              <span className="material-symbols-outlined text-[42px] animate-pulse">
                {weatherData.conditionIcon}
              </span>
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-heading font-black text-3xl sm:text-4xl text-white">
                  {weatherData.tempCelsius}°C
                </span>
                <span className="text-xs font-bold text-[#c1ecd4] uppercase tracking-wider">
                  {weatherData.condition}
                </span>
              </div>
              <div className="text-xs text-[#86af99] mt-0.5">
                <strong className="text-white">{weatherData.state}</strong> • {weatherData.lga}
              </div>
              <div className="text-[11px] text-[#34d399] font-mono mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">eco</span>
                <span>{weatherData.zone}</span>
              </div>
            </div>
          </div>

          {/* Micro-climate Gauges */}
          <div className="grid grid-cols-2 gap-3 text-xs md:col-span-2">
            <div className="p-2.5 bg-[#012d1d] rounded-lg border border-[#274e3d]">
              <div className="text-[10px] text-[#86af99] font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px] text-[#38bdf8]">rainy</span>
                <span>Rain Probability</span>
              </div>
              <div className="font-mono font-bold text-sm text-white mt-1">
                {weatherData.rainForecastPercent}%
              </div>
              <div className="text-[9px] text-[#86af99]">Next 24h NiMet model</div>
            </div>

            <div className="p-2.5 bg-[#012d1d] rounded-lg border border-[#274e3d]">
              <div className="text-[10px] text-[#86af99] font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px] text-[#10b981]">water_drop</span>
                <span>Soil Moisture (10cm)</span>
              </div>
              <div className="font-mono font-bold text-sm text-[#10b981] mt-1">
                {weatherData.soilMoisturePercent}% (Optimal)
              </div>
              <div className="text-[9px] text-[#86af99]">Soil Temp: {weatherData.soilTempCelsius}°C</div>
            </div>

            <div className="p-2.5 bg-[#012d1d] rounded-lg border border-[#274e3d]">
              <div className="text-[10px] text-[#86af99] font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px] text-[#f59e0b]">air</span>
                <span>Wind & Evapo (ET₀)</span>
              </div>
              <div className="font-mono font-bold text-sm text-white mt-1">
                {weatherData.windSpeedKm} km/h • {weatherData.evapotranspirationMm} mm/d
              </div>
              <div className="text-[9px] text-[#86af99]">Humidity: {weatherData.humidityPercent}%</div>
            </div>

            <div className="p-2.5 bg-[#012d1d] rounded-lg border border-[#274e3d]">
              <div className="text-[10px] text-[#86af99] font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px] text-[#fbbf24]">light_mode</span>
                <span>UV Index & Solar</span>
              </div>
              <div className="font-mono font-bold text-sm text-[#fbbf24] mt-1">
                Index {weatherData.uvIndex} (High Solar)
              </div>
              <div className="text-[9px] text-[#86af99]">Active Photosynthesis</div>
            </div>
          </div>
        </div>

        {/* Agronomist Live Recommendation Highlight */}
        <div className="p-3 bg-[#012d1d] rounded-xl border border-[#10b981]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#10b981] text-[22px]">psychology</span>
            <div>
              <span className="font-bold text-white uppercase text-[11px] tracking-wide">
                Official NiMet Agronomic Action Directive ({selectedState}):
              </span>
              <p className="text-[#c1ecd4] text-xs mt-0.5 leading-relaxed">
                {weatherData.advisoryText}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              const el = document.getElementById('audio-advisory-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-3 py-1.5 bg-[#10b981] text-[#022c1b] font-bold text-xs rounded-lg hover:bg-[#059669] flex items-center gap-1.5 shrink-0 transition-colors shadow-xs active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">volume_up</span>
            <span>Listen Audio Bulletin</span>
          </button>
        </div>
      </div>

      {/* 7-Day Precision Agronomic Forecast Table */}
      <div className="bg-white rounded-2xl border border-[#c1c8c2] p-5 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-[#e2e2e2]">
          <div>
            <h3 className="font-heading font-black text-lg text-[#012d1d] flex items-center gap-2">
              <span className="material-symbols-outlined text-[22px] text-[#10b981]">calendar_month</span>
              <span>7-Day Agricultural Planning Forecast ({selectedState})</span>
            </h3>
            <p className="text-xs text-[#717973]">
              Daily temperature, precipitation risk, and recommended on-field farm operations.
            </p>
          </div>

          <div className="text-xs font-mono font-bold text-[#012d1d] bg-[#e7f5e8] px-3 py-1 rounded-full border border-[#10b981]/30">
            Updated: 06:00 AM WAT • NiMet Doppler Network
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {weatherData.forecast.map((fc, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
                idx === 0
                  ? 'bg-[#e7f5e8]/80 border-[#10b981] ring-1 ring-[#10b981]/50 shadow-xs'
                  : 'bg-[#f9f9f9] border-[#e2e2e2] hover:border-[#10b981]/60'
              }`}
            >
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className={`font-bold text-xs ${idx === 0 ? 'text-[#012d1d]' : 'text-[#1a1c1c]'}`}>
                    {fc.day}
                  </span>
                  <span className="text-[10px] font-mono text-[#38bdf8] font-bold flex items-center">
                    <span className="material-symbols-outlined text-[12px]">water_drop</span>
                    {fc.rainProb}%
                  </span>
                </div>

                <div className="my-2 flex items-center justify-center">
                  <span className={`material-symbols-outlined text-[28px] ${
                    fc.icon === 'wb_sunny' || fc.icon === 'sunny'
                      ? 'text-[#f59e0b]'
                      : fc.icon === 'rainy' || fc.icon === 'thunderstorm'
                      ? 'text-[#38bdf8]'
                      : 'text-[#64748b]'
                  }`}>
                    {fc.icon}
                  </span>
                </div>

                <div className="text-center font-bold text-xs text-[#1a1c1c]">
                  <span>{fc.tempHigh}°</span>
                  <span className="text-[#9ca3af] font-normal ml-1">/ {fc.tempLow}°C</span>
                </div>
                <div className="text-[10px] text-center text-[#717973] mt-0.5 truncate">{fc.condition}</div>
              </div>

              <div className="mt-3 pt-2 border-t border-[#e2e2e2] text-[10px] leading-tight font-medium text-[#012d1d] bg-white/70 p-1.5 rounded-lg border border-black/5">
                {fc.farmingAction}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Multilingual Voice Broadcast & Radar Section */}
      <div id="audio-advisory-section" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Interactive Audio Voice Advisory Broadcast Player */}
        <div className="bg-white rounded-2xl border border-[#c1c8c2] p-5 space-y-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-2 border-b border-[#e2e2e2]">
              <h3 className="font-heading font-black text-base text-[#012d1d] flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#10b981]">record_voice_over</span>
                <span>Multilingual Voice Agronomy Bulletin</span>
              </h3>
              <span className="text-[10px] bg-[#c1ecd4] text-[#002114] font-bold px-2.5 py-0.5 rounded-full">
                Audio Extension
              </span>
            </div>

            <p className="text-xs text-[#717973] mt-2">
              Broadcasted daily in major Nigerian languages for smallholder farmers and cooperatives.
            </p>

            {/* Language Selection Tabs */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {(['English', 'Hausa', 'Yoruba', 'Igbo'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    selectedLanguage === lang
                      ? 'bg-[#012d1d] text-[#c1ecd4] shadow-xs'
                      : 'bg-[#f3f3f3] text-[#414844] hover:bg-[#e8e8e8]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">translate</span>
                  <span>{lang}</span>
                </button>
              ))}
            </div>

            {/* Audio Player Interface */}
            <div className="mt-4 p-4 bg-[#012d1d] rounded-xl text-white space-y-3">
              <div className="flex justify-between items-start text-xs">
                <div>
                  <h4 className="font-heading font-bold text-sm text-[#c1ecd4]">{audioBulletin.title}</h4>
                  <div className="text-[11px] text-[#86af99] mt-0.5">{audioBulletin.speaker}</div>
                </div>
                <span className="font-mono text-xs text-[#10b981] bg-[#1b4332] px-2 py-0.5 rounded border border-[#10b981]/40">
                  {audioBulletin.duration}
                </span>
              </div>

              {/* Animated Audio Equalizer Bars */}
              <div className="flex items-center gap-1 h-6 py-1">
                {[40, 75, 95, 30, 60, 100, 80, 45, 90, 70, 85, 40, 65, 90, 50, 80, 95, 60].map((h, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-full transition-all duration-300 ${
                      isPlayingAudio ? 'bg-[#10b981] animate-pulse' : 'bg-[#86af99]/40'
                    }`}
                    style={{ height: isPlayingAudio ? `${(h * (i % 2 === 0 ? 0.9 : 1.1)).toFixed(0)}%` : '20%' }}
                  />
                ))}
              </div>

              {/* Scrubber & Controls */}
              <div className="space-y-1">
                <div className="w-full bg-[#1b4332] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#10b981] h-full transition-all duration-300"
                    style={{ width: `${audioProgress}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-[#86af99]">
                  <span>0:38</span>
                  <span>{audioBulletin.duration}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="px-4 py-2 bg-[#10b981] hover:bg-[#059669] text-[#022c1b] font-bold text-xs rounded-full flex items-center gap-2 shadow-md transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isPlayingAudio ? 'pause' : 'play_arrow'}
                  </span>
                  <span>{isPlayingAudio ? 'Pause Voice Bulletin' : 'Play Audio Broadcast'}</span>
                </button>

                <div className="text-[11px] text-[#86af99] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-[#10b981]">podcasts</span>
                  <span>Synced to Radio Nigeria Network</span>
                </div>
              </div>
            </div>

            {/* Language Transcript Card */}
            <div className="mt-3 p-3 bg-[#f9f9f9] border border-[#e2e2e2] rounded-xl text-xs space-y-1">
              <div className="font-bold text-[#012d1d] flex items-center justify-between">
                <span>Verified Translation Transcript ({selectedLanguage}):</span>
                <span className="text-[10px] text-[#717973] font-normal">Accredited Linguists</span>
              </div>
              <p className="text-[#414844] text-[11px] leading-relaxed italic">
                "{audioBulletin.text}"
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-[#e2e2e2] flex items-center justify-between text-xs text-[#717973]">
            <span>Helpline Voice IVR: Dial <strong className="text-[#012d1d]">0800-AGRO-CONNECT</strong></span>
            <span className="font-bold text-[#10b981]">Toll-Free (24/7)</span>
          </div>
        </div>

        {/* NiMet & NIHSA Interactive Precipitation Radar */}
        <div className="bg-white rounded-2xl border border-[#c1c8c2] p-5 space-y-4 shadow-xs">
          <div className="flex justify-between items-center pb-2 border-b border-[#e2e2e2]">
            <div>
              <h3 className="font-heading font-black text-base text-[#012d1d] flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#10b981]">radar</span>
                <span>NiMet Satellite Precipitation Radar</span>
              </h3>
              <p className="text-[11px] text-[#717973]">Live cloud reflectivity & rainfall Doppler radar over Nigeria</p>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsRadarPlaying(!isRadarPlaying)}
                className="p-1.5 rounded-lg bg-[#e7f5e8] text-[#012d1d] hover:bg-[#c1ecd4] text-xs font-bold flex items-center gap-1 border border-[#10b981]/30"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {isRadarPlaying ? 'pause' : 'play_arrow'}
                </span>
                <span>{isRadarPlaying ? 'Looping' : 'Paused'}</span>
              </button>
            </div>
          </div>

          {/* Radar Layers Toggle */}
          <div className="flex bg-[#f3f3f3] p-1 rounded-lg text-xs gap-1">
            <button
              onClick={() => setRadarLayer('precipitation')}
              className={`flex-1 py-1 px-2 rounded-md font-bold transition-all ${
                radarLayer === 'precipitation' ? 'bg-[#012d1d] text-white shadow-xs' : 'text-[#414844] hover:text-[#012d1d]'
              }`}
            >
              Rainfall Doppler
            </button>
            <button
              onClick={() => setRadarLayer('flood')}
              className={`flex-1 py-1 px-2 rounded-md font-bold transition-all ${
                radarLayer === 'flood' ? 'bg-[#012d1d] text-white shadow-xs' : 'text-[#414844] hover:text-[#012d1d]'
              }`}
            >
              NIHSA Flood Risk
            </button>
            <button
              onClick={() => setRadarLayer('soil')}
              className={`flex-1 py-1 px-2 rounded-md font-bold transition-all ${
                radarLayer === 'soil' ? 'bg-[#012d1d] text-white shadow-xs' : 'text-[#414844] hover:text-[#012d1d]'
              }`}
            >
              Soil Saturation
            </button>
          </div>

          {/* Interactive Radar Visual Canvas */}
          <div className="relative w-full h-64 bg-[#051a11] rounded-xl overflow-hidden border border-[#1b4332] flex items-center justify-center select-none">
            {/* Background Grid */}
            <div 
              className="absolute inset-0 opacity-25"
              style={{
                backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* Concentric Radar Range Rings */}
            <div className="absolute w-48 h-48 rounded-full border border-[#10b981]/30" />
            <div className="absolute w-32 h-32 rounded-full border border-[#10b981]/40" />
            <div className="absolute w-16 h-16 rounded-full border border-[#10b981]/50" />

            {/* Rotating Radar Sweep Line */}
            <div
              className={`absolute w-48 h-48 rounded-full pointer-events-none transition-transform duration-1000 ${
                isRadarPlaying ? 'animate-spin' : ''
              }`}
              style={{
                background: 'conic-gradient(from 0deg, rgba(16, 185, 129, 0.4) 0deg, transparent 60deg, transparent 360deg)',
              }}
            />

            {/* Simulated Weather Doppler Echo Cells */}
            {radarLayer === 'precipitation' && (
              <>
                <div 
                  className="absolute w-24 h-20 rounded-full bg-[#38bdf8]/40 blur-md transition-all duration-700"
                  style={{ top: `${20 + radarFrame * 5}%`, left: `${30 + radarFrame * 6}%` }}
                />
                <div 
                  className="absolute w-32 h-24 rounded-full bg-[#10b981]/45 blur-lg transition-all duration-700"
                  style={{ top: `${40 + radarFrame * 3}%`, left: `${45 + radarFrame * 4}%` }}
                />
                <div 
                  className="absolute w-14 h-14 rounded-full bg-[#eab308]/50 blur-sm transition-all duration-700"
                  style={{ top: `${45 + radarFrame * 3}%`, left: `${52 + radarFrame * 4}%` }}
                />
              </>
            )}

            {radarLayer === 'flood' && (
              <>
                {/* River Niger & Benue Confluence Flood Risk Cells */}
                <div className="absolute w-44 h-12 rounded-full bg-[#f43f5e]/40 blur-md top-[55%] left-[35%]" />
                <div className="absolute text-[10px] font-mono text-[#fecdd3] bg-[#881337]/80 px-2 py-0.5 rounded border border-[#f43f5e] top-[50%] left-[40%]">
                  Lokoja River Confluence: High Watch
                </div>
              </>
            )}

            {radarLayer === 'soil' && (
              <>
                <div className="absolute inset-4 rounded-xl bg-gradient-to-tr from-[#15803d]/40 via-[#eab308]/30 to-[#15803d]/50 blur-md" />
              </>
            )}

            {/* Radar Coordinates Overlay */}
            <div className="absolute top-2 left-2 z-10 bg-black/75 backdrop-blur-xs px-2.5 py-1 rounded text-[10px] font-mono text-[#34d399] border border-white/10">
              FRAME {radarFrame + 1}/4 • T-{((3 - radarFrame) * 30)} MIN • KADUNA-ABUJA-LOKOJA
            </div>

            <div className="absolute bottom-2 right-2 z-10 flex items-center gap-2 bg-black/75 px-2 py-1 rounded text-[9px] font-mono text-white border border-white/10">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#38bdf8]" /> Light
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#10b981]" /> Mod
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#eab308]" /> Heavy
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#ef4444]" /> Severe
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center text-xs text-[#717973] pt-1">
            <span>Satellite Feed: <strong className="text-[#012d1d]">NiMet Meteosat-11 (EUMETSAT)</strong></span>
            <span>Refresh rate: 15 min</span>
          </div>
        </div>
      </div>

      {/* Crop-Specific Agronomy Calendar & Playbook Matrix */}
      <div className="bg-white rounded-2xl border border-[#c1c8c2] p-5 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-[#e2e2e2]">
          <div>
            <h3 className="font-heading font-black text-lg text-[#012d1d] flex items-center gap-2">
              <span className="material-symbols-outlined text-[22px] text-[#10b981]">menu_book</span>
              <span>Federal Crop Agronomy Playbooks & Input Standards</span>
            </h3>
            <p className="text-xs text-[#717973]">
              Evidence-based guidelines vetted by the National Agricultural Extension Research and Liaison Services (NAERLS).
            </p>
          </div>

          <button
            onClick={() => setShowPestModal(true)}
            className="px-3.5 py-2 bg-[#ba1a1a] hover:bg-[#93000a] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">report_problem</span>
            <span>Report Pest / Blight Sighting</span>
          </button>
        </div>

        {/* Crop Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar">
          {CROP_PLAYBOOKS.map((crop) => {
            const isSelected = activeCropId === crop.id;
            return (
              <button
                key={crop.id}
                onClick={() => setActiveCropId(crop.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#012d1d] text-[#c1ecd4] shadow-sm'
                    : 'bg-[#f3f3f3] text-[#414844] hover:bg-[#e8e8e8]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{crop.icon}</span>
                <span>{crop.name}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Crop Detail Matrix Card */}
        <div className="p-4 bg-[#f9f9f9] border border-[#e2e2e2] rounded-xl grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="space-y-3">
            <div>
              <span className="text-[10px] font-bold text-[#717973] uppercase tracking-wider">Current Season Cycle</span>
              <div className="font-heading font-black text-sm text-[#012d1d] mt-0.5">{currentCrop.currentSeason}</div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-[#717973] uppercase tracking-wider">Soil & Field Preparation</span>
              <p className="text-xs text-[#1a1c1c] mt-0.5">{currentCrop.soilRequirement}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-[#717973] uppercase tracking-wider">Target Yield Benchmark</span>
              <div className="font-mono font-bold text-xs text-[#10b981] mt-0.5">{currentCrop.targetYield}</div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-[10px] font-bold text-[#717973] uppercase tracking-wider">Fertilizer Protocol (FMFS Spec)</span>
              <p className="text-xs text-[#1a1c1c] mt-0.5">{currentCrop.fertilizer}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-[#717973] uppercase tracking-wider">Water & Moisture Schedule</span>
              <p className="text-xs text-[#1a1c1c] mt-0.5">{currentCrop.irrigation}</p>
            </div>
          </div>

          <div className="space-y-3 bg-[#fff8f6] p-3 rounded-xl border border-[#ffdad6]">
            <div>
              <span className="text-[10px] font-bold text-[#ba1a1a] uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">warning</span>
                <span>Primary Pest & Vector Threat</span>
              </span>
              <div className="font-bold text-xs text-[#ba1a1a] mt-0.5">{currentCrop.pestThreat}</div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-[#717973] uppercase tracking-wider">Recommended IPM Control</span>
              <p className="text-xs text-[#414844] mt-0.5">{currentCrop.controlMeasure}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Commodity Benchmark & Early Warning Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* National Commodity Price Index */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#c1c8c2] p-5 space-y-4 shadow-xs">
          <div className="flex justify-between items-center pb-2 border-b border-[#e2e2e2]">
            <div>
              <h3 className="font-heading font-black text-base text-[#012d1d] flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#10b981]">trending_up</span>
                <span>National Commodity Spot Price Index</span>
              </h3>
              <p className="text-[11px] text-[#717973]">Daily spot price benchmarks aggregated across 36 state trading hubs</p>
            </div>

            <span className="text-[10px] bg-[#c1ecd4] text-[#002114] font-bold px-2.5 py-0.5 rounded-full font-mono">
              Live Verified
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {marketPrices.map((mp) => (
              <div key={mp.id} className="p-3.5 bg-[#f9f9f9] border border-[#e2e2e2] rounded-xl space-y-2 hover:border-[#10b981] transition-colors">
                <div className="flex justify-between items-start font-bold text-xs text-[#1a1c1c]">
                  <div>
                    <span className="text-sm">{mp.crop}</span>
                    <span className="block text-[10px] text-[#717973] font-normal">Primary Hub: {mp.topState}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[#012d1d] font-heading font-bold text-base">
                      ₦{mp.priceNaira.toLocaleString()}
                    </span>
                    <span className="block text-[10px] text-[#3f6653] font-semibold">/ {mp.unit}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] pt-2 border-t border-[#e2e2e2]">
                  <span className="text-[#717973] font-mono">Benchmark: BOA / AFEX</span>
                  <span
                    className={`font-bold flex items-center gap-0.5 ${
                      mp.trend === 'up' ? 'text-[#012d1d]' : mp.trend === 'down' ? 'text-[#ba1a1a]' : 'text-[#717973]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[13px]">
                      {mp.trend === 'up' ? 'arrow_upward' : mp.trend === 'down' ? 'arrow_downward' : 'remove'}
                    </span>
                    <span>{mp.changePercent > 0 ? '+' : ''}{mp.changePercent}% 7d</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Pest Outbreak & Agricultural Bulletins */}
        <div className="bg-white rounded-2xl border border-[#c1c8c2] p-5 space-y-4 shadow-xs">
          <div className="flex justify-between items-center pb-2 border-b border-[#e2e2e2]">
            <h3 className="font-heading font-black text-base text-[#ba1a1a] flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">warning</span>
              <span>Active Field Alerts</span>
            </h3>
            <span className="text-[10px] bg-[#ffdad6] text-[#93000a] font-bold px-2 py-0.5 rounded font-mono">
              2 Active
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 bg-[#fff8f6] border border-[#ffdad6] rounded-xl space-y-2 text-xs">
              <div className="flex justify-between font-bold text-[#ba1a1a]">
                <span>Fall Armyworm (Spodoptera)</span>
                <span className="text-[9px] uppercase px-2 py-0.5 rounded bg-[#ba1a1a] text-white">CRITICAL</span>
              </div>
              <p className="text-[#414844] text-[11px] leading-snug">
                Infestations reported in North-Central grain belt (Plateau, Kaduna, Niger). Pheromone trap counts exceed economic threshold of 10 moths/trap/night.
              </p>
              <div className="p-2 bg-white rounded border border-[#ffdad6] text-[10px] font-semibold text-[#012d1d]">
                Directive: Spray Emamectin Benzoate 5% SG at early vegetative whorl stage before larvae penetrate stems.
              </div>
            </div>

            <div className="p-3.5 bg-[#fffde7] border border-[#fef08a] rounded-xl space-y-2 text-xs">
              <div className="flex justify-between font-bold text-[#854d0e]">
                <span>NIHSA River Benue Flood Alert</span>
                <span className="text-[9px] uppercase px-2 py-0.5 rounded bg-[#fef08a] text-[#854d0e]">MODERATE</span>
              </div>
              <p className="text-[#414844] text-[11px] leading-snug">
                Upstream Lagdo Dam release simulations indicate potential crest along Makurdi basin within 10 days. Farmers on floodplains advised to harvest early.
              </p>
              <div className="p-2 bg-white rounded border border-[#fef08a] text-[10px] font-semibold text-[#854d0e]">
                Directive: Clear low-lying grain stores and move livestock to higher elevation.
              </div>
            </div>
          </div>

          {/* Quick USSD & Offline Support Banner */}
          <div className="p-3 bg-[#012d1d] text-white rounded-xl space-y-1 text-xs">
            <div className="font-bold text-[#c1ecd4] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">cell_tower</span>
              <span>USSD Offline Advisory Channel</span>
            </div>
            <p className="text-[11px] text-[#86af99]">
              Dial <strong className="text-white font-mono">*347*88#</strong> on any GSM phone to receive SMS weather & pricing without internet data.
            </p>
          </div>
        </div>
      </div>

      {/* Modal: Report Pest or Blight Sighting */}
      {showPestModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowPestModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[#e8e8e8] text-[#717973]"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="flex items-center gap-2.5 pb-2 border-b border-[#e2e2e2]">
              <div className="p-2 bg-[#ffdad6] text-[#ba1a1a] rounded-xl">
                <span className="material-symbols-outlined text-[24px]">bug_report</span>
              </div>
              <div>
                <h3 className="font-heading font-black text-lg text-[#012d1d]">
                  Emergency Pest & Crop Blight Report
                </h3>
                <p className="text-xs text-[#717973]">
                  Directly dispatched to State Agricultural Development Programme (ADP) rapid response team.
                </p>
              </div>
            </div>

            {pestReportSuccess ? (
              <div className="p-6 bg-[#e7f5e8] border border-[#10b981] rounded-xl text-center space-y-2">
                <span className="material-symbols-outlined text-[#10b981] text-[40px]">check_circle</span>
                <h4 className="font-heading font-bold text-base text-[#012d1d]">Report Dispatched Successfully!</h4>
                <p className="text-xs text-[#414844]">
                  An extension agronomist from your state ADP office has been notified. SMS reference sent to your registered phone.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePestSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-[#1a1c1c] mb-1">Affected Crop</label>
                  <select
                    value={pestFormData.crop}
                    onChange={(e) => setPestFormData({ ...pestFormData, crop: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-[#717973] font-bold"
                  >
                    <option value="Maize">Maize (Grain)</option>
                    <option value="Cassava">Cassava (Tubers/Stems)</option>
                    <option value="Paddy Rice">Paddy Rice</option>
                    <option value="Yam">Yam</option>
                    <option value="Tomatoes">Tomatoes / Vegetables</option>
                    <option value="Soybeans">Soybeans</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#1a1c1c] mb-1">Observed Pest / Disease Symptoms</label>
                  <input
                    type="text"
                    value={pestFormData.pestType}
                    onChange={(e) => setPestFormData({ ...pestFormData, pestType: e.target.value })}
                    placeholder="e.g. Caterpillar feeding on leaves, yellow mosaic spots, stem wilt"
                    required
                    className="w-full h-10 px-3 rounded-xl border border-[#717973]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#1a1c1c] mb-1">Farm Location (State / LGA)</label>
                    <input
                      type="text"
                      value={pestFormData.farmLocation}
                      onChange={(e) => setPestFormData({ ...pestFormData, farmLocation: e.target.value })}
                      required
                      className="w-full h-10 px-3 rounded-xl border border-[#717973]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#1a1c1c] mb-1">Affected Land (Acres/Ha)</label>
                    <input
                      type="text"
                      value={pestFormData.affectedAcres}
                      onChange={(e) => setPestFormData({ ...pestFormData, affectedAcres: e.target.value })}
                      placeholder="e.g. 3 Hectares"
                      className="w-full h-10 px-3 rounded-xl border border-[#717973]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#1a1c1c] mb-1">Threat Severity Level</label>
                  <select
                    value={pestFormData.severity}
                    onChange={(e) => setPestFormData({ ...pestFormData, severity: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-[#717973] font-bold"
                  >
                    <option value="Critical">Critical (Over 40% crop damage)</option>
                    <option value="High">High (Rapidly spreading across field)</option>
                    <option value="Moderate">Moderate (Early signs spotted)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full h-11 bg-[#012d1d] hover:bg-[#1b4332] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-all mt-4"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  <span>Submit Urgent Pest Alert to Ministry Extension</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
