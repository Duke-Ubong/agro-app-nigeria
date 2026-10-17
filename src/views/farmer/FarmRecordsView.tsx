import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { CropGrowthStage, FarmPlot } from '../../types';
import { ACTIVE_PEST_ALERTS } from '../../data/farmerData';

const GROWTH_STAGES: CropGrowthStage[] = [
  'Land Prep',
  'Planting',
  'Vegetative',
  'Flowering',
  'Maturity',
  'Harvesting',
  'Post-Harvest',
];

const CROP_AVERAGE_YIELD_PER_HA: Record<string, number> = {
  'White Maize': 4.0,
  'Yellow Maize': 3.8,
  'Soya Beans': 2.5,
  'Sorghum': 3.0,
  'Millet': 2.0,
  'Paddy Rice': 4.5,
  'Cassava': 15.0,
};

export const FarmRecordsView: React.FC = () => {
  const { user } = useAuth();
  const { farmPlots, addFarmPlot, updateFarmPlotStage, weatherData, marketPrices, setActiveView } = useApp();

  const [isAddPlotModalOpen, setIsAddPlotModalOpen] = useState(false);
  const [selectedCropFilter, setSelectedCropFilter] = useState<string>('all');
  const [showYieldCalculator, setShowYieldCalculator] = useState(false);

  // Calculator State
  const [calcCrop, setCalcCrop] = useState<string>('White Maize');
  const [calcHectares, setCalcHectares] = useState<number>(3.0);
  const [calcFertilizerLevel, setCalcFertilizerLevel] = useState<'low' | 'standard' | 'optimal'>('standard');

  // Form State
  const [newPlotName, setNewPlotName] = useState('');
  const [newCrop, setNewCrop] = useState('White Maize');
  const [newVariety, setNewVariety] = useState('SAMMAZ 15 High-Yield');
  const [newHectares, setNewHectares] = useState('2.5');
  const [newLocationLGA, setNewLocationLGA] = useState('Abeokuta North');
  const [newSoilType, setNewSoilType] = useState('Rich Loamy Sand');
  const [newPlantingDate, setNewPlantingDate] = useState('2026-06-01');
  const [newHarvestDate, setNewHarvestDate] = useState('2026-09-20');
  const [newNotes, setNewNotes] = useState('');

  const userWeather = weatherData.find((w) => w.state === user.state) || weatherData[0];

  const totalHectares = farmPlots.reduce((acc, p) => acc + p.hectares, 0);
  const totalExpectedMT = farmPlots.reduce((acc, p) => acc + p.expectedYieldMT, 0);
  const totalExpectedBags = farmPlots.reduce((acc, p) => acc + p.expectedYieldBags, 0);

  const filteredPlots = selectedCropFilter === 'all'
    ? farmPlots
    : farmPlots.filter((p) => p.crop.toLowerCase().includes(selectedCropFilter.toLowerCase()));

  const handleCreatePlot = (e: React.FormEvent) => {
    e.preventDefault();
    const ha = parseFloat(newHectares) || 1.0;
    const baseRate = CROP_AVERAGE_YIELD_PER_HA[newCrop] || 3.5;
    const estMT = parseFloat((ha * baseRate).toFixed(1));
    const estBags = Math.round(estMT * 20); // 20 bags per MT (50kg bags)

    addFarmPlot({
      farmerId: user.id || 'usr_farmer_01',
      name: newPlotName.trim() || `${newCrop} Field Block`,
      crop: newCrop,
      variety: newVariety,
      hectares: ha,
      locationLGA: newLocationLGA,
      state: user.state || 'Ogun',
      soilType: newSoilType,
      plantingDate: newPlantingDate,
      expectedHarvestDate: newHarvestDate,
      growthStage: 'Planting',
      healthStatus: 'Good',
      expectedYieldMT: estMT,
      expectedYieldBags: estBags,
      notes: newNotes,
    });

    setIsAddPlotModalOpen(false);
    setNewPlotName('');
    setNewNotes('');
  };

  // Live Calculation for Estimator
  const calcBaseRate = CROP_AVERAGE_YIELD_PER_HA[calcCrop] || 3.5;
  const fertMultiplier = calcFertilizerLevel === 'low' ? 0.75 : calcFertilizerLevel === 'optimal' ? 1.25 : 1.0;
  const calculatedYieldMT = parseFloat((calcHectares * calcBaseRate * fertMultiplier).toFixed(1));
  const calculatedBags = Math.round(calculatedYieldMT * 20);
  const matchingPrice = marketPrices.find((mp) => mp.crop.toLowerCase().includes(calcCrop.toLowerCase()));
  const pricePerBag = matchingPrice ? matchingPrice.priceNaira : 34000;
  const estimatedRevenueNaira = calculatedBags * pricePerBag;

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-2xl border border-[#c1c8c2]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#3f6653] uppercase tracking-wider mb-1">
            <span>Farm Records & Field Management</span>
            <span>·</span>
            <span>{user.state} Agricultural Zone</span>
          </div>
          <h1 className="font-heading font-bold text-2xl text-[#012d1d]">
            Field Plots & Crop Cycle Records
          </h1>
          <p className="text-xs text-[#414844] mt-1">
            Track seasonal planting cycles, growth milestones, field health, and harvest yield projections.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowYieldCalculator(!showYieldCalculator)}
            className="h-10 px-4 rounded-xl border border-[#c1c8c2] bg-[#f9f9f9] text-[#012d1d] hover:bg-[#e8e8e8] text-xs font-bold font-heading flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">calculate</span>
            <span>{showYieldCalculator ? 'Hide Calculator' : 'Yield Estimator'}</span>
          </button>

          <button
            onClick={() => setIsAddPlotModalOpen(true)}
            className="h-10 px-4 rounded-xl bg-[#012d1d] text-white hover:bg-[#1b4332] text-xs font-bold font-heading flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Log New Field Plot</span>
          </button>
        </div>
      </div>

      {/* Yield Estimator Drawer / Card */}
      {showYieldCalculator && (
        <div className="bg-[#f0f7f3] border border-[#a5d0b9] rounded-2xl p-5 space-y-4 transition-all">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2 text-[#012d1d]">
              <span className="material-symbols-outlined text-[22px] text-[#1b4332]">calculate</span>
              <h3 className="font-heading font-bold text-base">Smallholder Harvest Yield & Revenue Estimator</h3>
            </div>
            <button
              onClick={() => setShowYieldCalculator(false)}
              className="text-[#414844] hover:text-[#012d1d] text-xs font-bold"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#414844] mb-1">Target Crop</label>
              <select
                value={calcCrop}
                onChange={(e) => setCalcCrop(e.target.value)}
                className="w-full h-10 px-3 text-xs bg-white border border-[#c1c8c2] rounded-lg focus:outline-none focus:border-[#012d1d]"
              >
                {Object.keys(CROP_AVERAGE_YIELD_PER_HA).map((crop) => (
                  <option key={crop} value={crop}>{crop}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#414844] mb-1">Cultivated Hectares: {calcHectares} Ha</label>
              <input
                type="range"
                min="0.5"
                max="15.0"
                step="0.5"
                value={calcHectares}
                onChange={(e) => setCalcHectares(parseFloat(e.target.value))}
                className="w-full accent-[#012d1d] mt-2"
              />
              <div className="flex justify-between text-[10px] text-[#717973] mt-1">
                <span>0.5 Ha (~1.2 Acres)</span>
                <span>15 Ha (~37 Acres)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#414844] mb-1">Soil Nutrition & Input Regime</label>
              <div className="grid grid-cols-3 gap-1 p-1 bg-white border border-[#c1c8c2] rounded-lg text-center text-xs">
                {(['low', 'standard', 'optimal'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setCalcFertilizerLevel(lvl)}
                    className={`py-1.5 rounded font-medium capitalize transition-colors ${
                      calcFertilizerLevel === lvl ? 'bg-[#012d1d] text-white' : 'text-[#414844] hover:bg-slate-100'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Calculator Output Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#a5d0b9]">
            <div className="bg-white p-3 rounded-xl border border-[#c1c8c2]">
              <span className="text-[10px] font-semibold text-[#717973] uppercase tracking-wide">Projected Biomass</span>
              <div className="font-heading font-bold text-xl text-[#012d1d] tabular-nums mt-0.5">
                {calculatedYieldMT} MT
              </div>
              <span className="text-[10px] text-[#414844]">Metric Tons at 13% harvest moisture</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-[#c1c8c2]">
              <span className="text-[10px] font-semibold text-[#717973] uppercase tracking-wide">Standard 50kg Bags</span>
              <div className="font-heading font-bold text-xl text-[#012d1d] tabular-nums mt-0.5">
                {calculatedBags.toLocaleString()} Bags
              </div>
              <span className="text-[10px] text-[#414844]">Ready for cooperative intake pass</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-[#c1c8c2]">
              <span className="text-[10px] font-semibold text-[#717973] uppercase tracking-wide">Est. Gross Revenue</span>
              <div className="font-heading font-bold text-xl text-[#1b4332] tabular-nums mt-0.5">
                ₦{estimatedRevenueNaira.toLocaleString()}
              </div>
              <span className="text-[10px] text-[#414844]">At current benchmark ₦{pricePerBag.toLocaleString()}/bag</span>
            </div>
          </div>
        </div>
      )}

      {/* 4-Pillar Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-[#c1c8c2] space-y-1">
          <div className="text-[11px] font-semibold text-[#717973] uppercase tracking-wide">Total Farm Area</div>
          <div className="font-heading font-bold text-2xl text-[#012d1d] tabular-nums">
            {totalHectares.toFixed(1)} <span className="text-xs font-normal text-[#414844]">Ha</span>
          </div>
          <div className="text-[11px] text-[#414844]">
            ~{(totalHectares * 2.47).toFixed(1)} Total Acres
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#c1c8c2] space-y-1">
          <div className="text-[11px] font-semibold text-[#717973] uppercase tracking-wide">Active Field Plots</div>
          <div className="font-heading font-bold text-2xl text-[#012d1d] tabular-nums">
            {farmPlots.length}
          </div>
          <div className="text-[11px] text-[#414844]">
            Across {new Set(farmPlots.map((p) => p.locationLGA)).size} Local Gov Areas
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#c1c8c2] space-y-1">
          <div className="text-[11px] font-semibold text-[#717973] uppercase tracking-wide">Est. Harvest Biomass</div>
          <div className="font-heading font-bold text-2xl text-[#012d1d] tabular-nums">
            {totalExpectedMT.toFixed(1)} <span className="text-xs font-normal text-[#414844]">MT</span>
          </div>
          <div className="text-[11px] text-[#414844]">
            {totalExpectedBags.toLocaleString()} Standard 50kg Bags
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#c1c8c2] space-y-1">
          <div className="text-[11px] font-semibold text-[#717973] uppercase tracking-wide">Co-op Affiliation</div>
          <div className="font-heading font-bold text-lg text-[#012d1d] truncate">
            Dawanau Union
          </div>
          <div className="text-[11px] text-[#3f6653] font-semibold">
            Cluster A · Verified KYC
          </div>
        </div>
      </div>

      {/* Weather & Active Pest Advisory Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Weather Card */}
        <div className="bg-[#1b4332] text-white p-4 rounded-2xl border border-[#274e3d] flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[#86af99] text-xs font-semibold">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-[#c1ecd4]">cloud</span>
                <span>Hyperlocal Weather · {userWeather.state}</span>
              </span>
              <span className="text-[10px] text-[#c1ecd4] font-bold">Station Synced</span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="font-heading font-bold text-3xl text-[#c1ecd4] tabular-nums">
                {userWeather.tempCelsius}°C
              </span>
              <span className="text-xs font-medium text-slate-200">{userWeather.condition}</span>
            </div>

            <p className="text-xs text-[#a5d0b9] leading-relaxed">
              {userWeather.advisoryText}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 bg-[#012d1d]/80 p-2.5 rounded-xl border border-[#274e3d] text-center mt-4">
            <div>
              <span className="text-[9px] text-[#86af99] uppercase font-bold">Rain Risk</span>
              <div className="font-heading font-bold text-sm text-white tabular-nums">{userWeather.rainForecastPercent}%</div>
            </div>
            <div className="border-x border-[#274e3d]">
              <span className="text-[9px] text-[#86af99] uppercase font-bold">Wind</span>
              <div className="font-heading font-bold text-sm text-white tabular-nums">{userWeather.windSpeedKm} km/h</div>
            </div>
            <div>
              <span className="text-[9px] text-[#86af99] uppercase font-bold">Spray Window</span>
              <div className="font-heading font-bold text-xs text-[#c1ecd4]">Optimal</div>
            </div>
          </div>
        </div>

        {/* Pest Advisory Warnings */}
        <div className="lg:col-span-2 bg-white p-4 rounded-2xl border border-[#c1c8c2] space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-[#e2e2e2]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#ba1a1a]">pest_control</span>
              <h3 className="font-heading font-bold text-sm text-[#012d1d]">
                Active Agronomic Pest & Disease Advisories
              </h3>
            </div>
            <span className="text-xs text-[#717973]">
              {ACTIVE_PEST_ALERTS.length} Alerts Active in Regional Hub
            </span>
          </div>

          <div className="space-y-2.5">
            {ACTIVE_PEST_ALERTS.map((alert) => (
              <div
                key={alert.id}
                className="p-3 rounded-xl bg-[#fef7f7] border border-[#f5c2c2] flex flex-col sm:flex-row justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-xs text-[#93000a]">{alert.threatName}</span>
                    <span className="text-[10px] font-bold uppercase text-[#93000a] bg-[#ffdad6] px-2 py-0.5 rounded">
                      {alert.severity} Risk
                    </span>
                  </div>
                  <p className="text-xs text-[#414844] leading-relaxed">
                    <strong className="text-[#1a1c1c]">Symptoms:</strong> {alert.symptoms}
                  </p>
                  <p className="text-xs text-[#1b4332] font-medium">
                    <strong className="text-[#012d1d]">Action:</strong> {alert.recommendedAction}
                  </p>
                </div>
                <div className="text-[10px] text-[#717973] shrink-0 sm:text-right">
                  <div>Affected: {alert.affectedCrops.join(', ')}</div>
                  <div>Reported: {alert.dateReported}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Field Plots List Section */}
      <div className="bg-white rounded-2xl border border-[#c1c8c2] p-5 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-[#e2e2e2]">
          <div>
            <h3 className="font-heading font-bold text-base text-[#012d1d]">
              Enrolled Field Plots ({filteredPlots.length})
            </h3>
            <p className="text-xs text-[#717973]">
              Keep stage milestones updated so your cooperative can schedule aggregation logistics and warehouse slots.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-1.5 p-1 bg-[#f3f3f3] rounded-xl text-xs">
            <button
              onClick={() => setSelectedCropFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedCropFilter === 'all' ? 'bg-white text-[#012d1d] shadow-xs' : 'text-[#414844] hover:text-[#012d1d]'
              }`}
            >
              All Crops
            </button>
            <button
              onClick={() => setSelectedCropFilter('maize')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedCropFilter === 'maize' ? 'bg-white text-[#012d1d] shadow-xs' : 'text-[#414844] hover:text-[#012d1d]'
              }`}
            >
              Maize
            </button>
            <button
              onClick={() => setSelectedCropFilter('soya')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedCropFilter === 'soya' ? 'bg-white text-[#012d1d] shadow-xs' : 'text-[#414844] hover:text-[#012d1d]'
              }`}
            >
              Soya Beans
            </button>
            <button
              onClick={() => setSelectedCropFilter('sorghum')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedCropFilter === 'sorghum' ? 'bg-white text-[#012d1d] shadow-xs' : 'text-[#414844] hover:text-[#012d1d]'
              }`}
            >
              Sorghum
            </button>
          </div>
        </div>

        {/* Plots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlots.map((plot) => {
            const currentStageIndex = GROWTH_STAGES.indexOf(plot.growthStage);
            const progressPercent = Math.round(((currentStageIndex + 1) / GROWTH_STAGES.length) * 100);

            return (
              <div
                key={plot.id}
                className="bg-[#f9f9f9] border border-[#c1c8c2] rounded-xl p-4 flex flex-col justify-between hover:border-[#012d1d] transition-all space-y-4"
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-heading font-bold text-sm text-[#012d1d]">{plot.name}</h4>
                      <div className="text-xs font-semibold text-[#1b4332] mt-0.5">
                        {plot.crop} · <span className="font-normal text-[#414844]">{plot.variety}</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-[#012d1d] bg-[#c1ecd4] px-2 py-0.5 rounded">
                      {plot.healthStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-[#414844] pt-3 mt-3 border-t border-[#e2e2e2]">
                    <div>
                      <span className="text-[10px] text-[#717973] uppercase font-bold">Area</span>
                      <div className="font-heading font-bold text-[#1a1c1c] tabular-nums">
                        {plot.hectares} Ha <span className="text-[10px] font-normal text-[#717973]">({(plot.hectares * 2.47).toFixed(1)} Ac)</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#717973] uppercase font-bold">Est. Yield</span>
                      <div className="font-heading font-bold text-[#012d1d] tabular-nums">
                        {plot.expectedYieldMT} MT <span className="text-[10px] font-normal text-[#717973]">({plot.expectedYieldBags} bgs)</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#717973] uppercase font-bold">Location</span>
                      <div className="truncate">{plot.locationLGA}, {plot.state}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#717973] uppercase font-bold">Soil Profile</span>
                      <div className="truncate">{plot.soilType}</div>
                    </div>
                  </div>

                  {/* Growth Stage Progress */}
                  <div className="space-y-1.5 mt-3 pt-3 border-t border-[#e2e2e2]">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[10px] font-bold uppercase text-[#717973]">Current Stage</span>
                      <span className="font-bold text-[#012d1d]">{plot.growthStage}</span>
                    </div>

                    <div className="h-2 w-full bg-[#e8e8e8] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#1b4332] rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] text-[#717973]">
                      <span>Planted: {plot.plantingDate}</span>
                      <span>Target: {plot.expectedHarvestDate}</span>
                    </div>
                  </div>

                  {plot.notes && (
                    <p className="text-xs text-[#414844] italic bg-white p-2.5 rounded-lg border border-[#e2e2e2] mt-3">
                      "{plot.notes}"
                    </p>
                  )}
                </div>

                {/* Card Actions: Advance Stage & Delivery Pass Shortcut */}
                <div className="pt-3 border-t border-[#e2e2e2] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <label htmlFor={`stage-select-${plot.id}`} className="text-[10px] font-bold text-[#717973]">Stage:</label>
                    <select
                      id={`stage-select-${plot.id}`}
                      value={plot.growthStage}
                      onChange={(e) => updateFarmPlotStage(plot.id, e.target.value as CropGrowthStage)}
                      className="h-8 px-2 text-xs bg-white border border-[#c1c8c2] rounded-lg focus:outline-none focus:border-[#012d1d] font-semibold text-[#012d1d]"
                    >
                      {GROWTH_STAGES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => setActiveView('produce_sales')}
                    className="h-8 px-3 rounded-lg bg-[#012d1d] text-white hover:bg-[#1b4332] text-xs font-bold font-heading flex items-center gap-1 transition-colors"
                  >
                    <span>Delivery Pass</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Plot Modal */}
      {isAddPlotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 border border-[#c1c8c2] shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start pb-3 border-b border-[#e2e2e2]">
              <div>
                <h3 className="font-heading font-bold text-lg text-[#012d1d]">
                  Enroll New Field Plot
                </h3>
                <p className="text-xs text-[#717973] mt-0.5">
                  Record plot details for acreage validation and seasonal yield forecasting.
                </p>
              </div>
              <button
                onClick={() => setIsAddPlotModalOpen(false)}
                className="text-[#717973] hover:text-[#012d1d]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreatePlot} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#414844] mb-1">
                  Plot / Field Designation Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. West Ridge Plot 2"
                  value={newPlotName}
                  onChange={(e) => setNewPlotName(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-[#f9f9f9] border border-[#c1c8c2] rounded-lg focus:outline-none focus:border-[#012d1d]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#414844] mb-1">Crop Type *</label>
                  <select
                    value={newCrop}
                    onChange={(e) => setNewCrop(e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-[#f9f9f9] border border-[#c1c8c2] rounded-lg focus:outline-none focus:border-[#012d1d]"
                  >
                    {Object.keys(CROP_AVERAGE_YIELD_PER_HA).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#414844] mb-1">Seed Variety *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SAMMAZ 15"
                    value={newVariety}
                    onChange={(e) => setNewVariety(e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-[#f9f9f9] border border-[#c1c8c2] rounded-lg focus:outline-none focus:border-[#012d1d]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#414844] mb-1">Acreage in Hectares (Ha) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.2"
                    max="50"
                    required
                    value={newHectares}
                    onChange={(e) => setNewHectares(e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-[#f9f9f9] border border-[#c1c8c2] rounded-lg focus:outline-none focus:border-[#012d1d]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#414844] mb-1">Soil Texture / Profile *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Loamy Sand"
                    value={newSoilType}
                    onChange={(e) => setNewSoilType(e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-[#f9f9f9] border border-[#c1c8c2] rounded-lg focus:outline-none focus:border-[#012d1d]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#414844] mb-1">Planting Date *</label>
                  <input
                    type="date"
                    required
                    value={newPlantingDate}
                    onChange={(e) => setNewPlantingDate(e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-[#f9f9f9] border border-[#c1c8c2] rounded-lg focus:outline-none focus:border-[#012d1d]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#414844] mb-1">Target Harvest Date *</label>
                  <input
                    type="date"
                    required
                    value={newHarvestDate}
                    onChange={(e) => setNewHarvestDate(e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-[#f9f9f9] border border-[#c1c8c2] rounded-lg focus:outline-none focus:border-[#012d1d]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#414844] mb-1">Field Treatment & Agronomy Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Basal NPK applied, intercropped with cowpea border"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full p-2.5 text-xs bg-[#f9f9f9] border border-[#c1c8c2] rounded-lg focus:outline-none focus:border-[#012d1d]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#e2e2e2]">
                <button
                  type="button"
                  onClick={() => setIsAddPlotModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-[#414844] hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#012d1d] hover:bg-[#1b4332] rounded-lg transition-colors"
                >
                  Save Field Plot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
