import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WarehouseIntake } from '../../types';
import { calculateGrainQualityGrade } from '../../data/cooperativeData';

export const WarehouseAggregationView: React.FC = () => {
  const { warehouseIntakes, coopMembers, logWarehouseIntake } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCrop, setFilterCrop] = useState('All');
  const [filterGrade, setFilterGrade] = useState('All');
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<WarehouseIntake | null>(null);

  // Form State for Weighbridge Logging
  const [selectedFarmerId, setSelectedFarmerId] = useState(coopMembers[0]?.id || '');
  const [crop, setCrop] = useState('White Maize');
  const [bagCount, setBagCount] = useState<number>(60);
  const [bagSizeKg, setBagSizeKg] = useState<number>(100);
  const [moistureContent, setMoistureContent] = useState<number>(12.5);
  const [foreignMatter, setForeignMatter] = useState<number>(1.2);
  const [storageBin, setStorageBin] = useState('Silo Alpha-01');
  const [warehouseLocation, setWarehouseLocation] = useState('Abeokuta Central Silo Hub');
  const [intakeOfficer, setIntakeOfficer] = useState('Engr. Dapo Alabi (Certified Grader)');
  const [harvestDeductionNaira, setHarvestDeductionNaira] = useState<number>(50000);

  // Selected farmer object
  const activeFarmer = coopMembers.find((m) => m.id === selectedFarmerId) || coopMembers[0];

  // Live calculation based on moisture and bag count
  const netWeightKg = bagCount * bagSizeKg;
  const netWeightMT = Number((netWeightKg / 1000).toFixed(2));
  const quality = calculateGrainQualityGrade(moistureContent, foreignMatter);
  const pricePerKg = Math.round(quality.basePriceNairaPerMT / 1000);
  const totalValuation = Math.round(netWeightKg * pricePerKg);
  const safeDeduction = Math.min(harvestDeductionNaira, activeFarmer?.loanBalanceNaira || 0);
  const netPayable = Math.max(0, totalValuation - safeDeduction);

  // Silo Storage Occupancy Calculations
  const totalAggregatedMT = warehouseIntakes.reduce((acc, i) => acc + i.netWeightMT, 0);
  const maizeIntakeMT = warehouseIntakes.filter((i) => i.crop.includes('Maize')).reduce((acc, i) => acc + i.netWeightMT, 0);
  const soyIntakeMT = warehouseIntakes.filter((i) => i.crop.includes('Soy')).reduce((acc, i) => acc + i.netWeightMT, 0);
  const riceIntakeMT = warehouseIntakes.filter((i) => i.crop.includes('Rice')).reduce((acc, i) => acc + i.netWeightMT, 0);

  // Filtered Intakes
  const filteredIntakes = warehouseIntakes.filter((item) => {
    const matchesSearch =
      item.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.storageBin.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCrop = filterCrop === 'All' || item.crop === filterCrop;
    const matchesGrade = filterGrade === 'All' || item.qualityGrade.includes(filterGrade);
    return matchesSearch && matchesCrop && matchesGrade;
  });

  const handleLogIntake = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFarmer) return;

    const newIntake = logWarehouseIntake({
      farmerId: activeFarmer.id,
      farmerName: activeFarmer.name,
      clusterName: activeFarmer.cluster,
      crop,
      bagCount,
      bagSizeKg,
      grossWeightKg: netWeightKg + bagCount * 1.2,
      tareWeightKg: bagCount * 1.2,
      netWeightKg,
      netWeightMT,
      moistureContent,
      foreignMatterPercent: foreignMatter,
      qualityGrade: quality.grade,
      storageBin,
      warehouseLocation,
      intakeOfficer,
      pricePerKgCalculated: pricePerKg,
      totalValuationNaira: totalValuation,
      harvestDeductionNaira: safeDeduction,
      netPayableToFarmerNaira: netPayable,
      status: 'verified_in_silo',
    });

    setShowLogModal(false);
    setSelectedReceipt(newIntake);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#3f6653] bg-[#c1ecd4] px-2.5 py-0.5 rounded-full">
              Post-Harvest Logistics & Silos
            </span>
            <span className="text-xs text-[#717973] font-medium">• Automated Weighbridge & Grading</span>
          </div>
          <h1 className="font-heading font-bold text-2xl text-[#012d1d] mt-1">
            Warehouse Intake & Produce Aggregation
          </h1>
          <p className="text-xs text-[#414844]">
            Log smallholder grain deliveries, run moisture tests, issue digital warehouse receipts, and track silo capacity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLogModal(true)}
            className="h-10 px-4 bg-[#012d1d] text-white font-heading font-bold text-xs rounded-full flex items-center gap-2 hover:bg-[#1b4332] active:scale-95 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">scale</span>
            <span>Log Produce Intake</span>
          </button>
        </div>
      </div>

      {/* Silo Occupancy & Storage Status Meters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Silo Alpha */}
        <div className="bg-white border border-[#c1c8c2] p-4 rounded-xl space-y-3 shadow-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#012d1d]">warehouse</span>
              <span className="font-heading font-bold text-xs text-[#012d1d]">Silo Alpha-01 (Maize)</span>
            </div>
            <span className="text-[10px] bg-[#c1ecd4] text-[#002114] font-bold px-2 py-0.5 rounded-full">
              Aerated Silo
            </span>
          </div>
          <div className="flex justify-between items-baseline">
            <div className="font-heading font-bold text-xl text-[#012d1d]">
              {(maizeIntakeMT + 240).toFixed(1)} <span className="text-xs text-[#717973] font-normal">/ 500 MT</span>
            </div>
            <span className="text-xs font-bold text-[#3f6653]">
              {(((maizeIntakeMT + 240) / 500) * 100).toFixed(0)}% Full
            </span>
          </div>
          <div className="w-full bg-[#e8e8e8] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#012d1d] h-2 rounded-full transition-all"
              style={{ width: `${Math.min(100, ((maizeIntakeMT + 240) / 500) * 100)}%` }}
            />
          </div>
          <p className="text-[10px] text-[#717973]">
            Dedicated for Flour Mills & Nestlé industrial milling white maize.
          </p>
        </div>

        {/* Silo Beta */}
        <div className="bg-white border border-[#c1c8c2] p-4 rounded-xl space-y-3 shadow-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#012d1d]">inventory_2</span>
              <span className="font-heading font-bold text-xs text-[#012d1d]">Silo Beta-02 (Soybeans)</span>
            </div>
            <span className="text-[10px] bg-[#c1ecd4] text-[#002114] font-bold px-2 py-0.5 rounded-full">
              Climate Regulated
            </span>
          </div>
          <div className="flex justify-between items-baseline">
            <div className="font-heading font-bold text-xl text-[#012d1d]">
              {(soyIntakeMT + 110).toFixed(1)} <span className="text-xs text-[#717973] font-normal">/ 300 MT</span>
            </div>
            <span className="text-xs font-bold text-[#3f6653]">
              {(((soyIntakeMT + 110) / 300) * 100).toFixed(0)}% Full
            </span>
          </div>
          <div className="w-full bg-[#e8e8e8] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#1b4332] h-2 rounded-full transition-all"
              style={{ width: `${Math.min(100, ((soyIntakeMT + 110) / 300) * 100)}%` }}
            />
          </div>
          <p className="text-[10px] text-[#717973]">
            Secured for Olam Agri crushing contracts at Sagamu interchange depot.
          </p>
        </div>

        {/* Flatbed Floor */}
        <div className="bg-white border border-[#c1c8c2] p-4 rounded-xl space-y-3 shadow-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#012d1d]">layers</span>
              <span className="font-heading font-bold text-xs text-[#012d1d]">Bay 4 (Rice & Cassava)</span>
            </div>
            <span className="text-[10px] bg-[#ffdeac] text-[#281900] font-bold px-2 py-0.5 rounded-full">
              Pallet Stored
            </span>
          </div>
          <div className="flex justify-between items-baseline">
            <div className="font-heading font-bold text-xl text-[#012d1d]">
              {(riceIntakeMT + 65).toFixed(1)} <span className="text-xs text-[#717973] font-normal">/ 200 MT</span>
            </div>
            <span className="text-xs font-bold text-[#8a5d00]">
              {(((riceIntakeMT + 65) / 200) * 100).toFixed(0)}% Full
            </span>
          </div>
          <div className="w-full bg-[#e8e8e8] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#d97706] h-2 rounded-full transition-all"
              style={{ width: `${Math.min(100, ((riceIntakeMT + 65) / 200) * 100)}%` }}
            />
          </div>
          <p className="text-[10px] text-[#717973]">
            Ventilated pallet storage for paddy rice and dried white cassava chips.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#c1c8c2] shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#717973] text-[20px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search by receipt #, farmer name, or silo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#f3f3f3] border border-[#c1c8c2] rounded-lg text-xs focus:outline-none focus:border-[#012d1d]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={filterCrop}
            onChange={(e) => setFilterCrop(e.target.value)}
            className="px-3 py-2 bg-[#f3f3f3] border border-[#c1c8c2] rounded-lg text-xs font-medium text-[#1a1c1c] focus:outline-none"
          >
            <option value="All">All Crops</option>
            <option value="White Maize">White Maize</option>
            <option value="Soybeans">Soybeans</option>
            <option value="Paddy Rice">Paddy Rice</option>
            <option value="Cassava Chips">Cassava Chips</option>
          </select>

          <select
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
            className="px-3 py-2 bg-[#f3f3f3] border border-[#c1c8c2] rounded-lg text-xs font-medium text-[#1a1c1c] focus:outline-none"
          >
            <option value="All">All Quality Grades</option>
            <option value="Grade A">Grade A (Premium)</option>
            <option value="Grade B">Grade B (Commercial)</option>
            <option value="Grade C">Grade C (Discounted)</option>
          </select>
        </div>
      </div>

      {/* Intake Table */}
      <div className="bg-white rounded-xl border border-[#c1c8c2] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f9f9f9] border-b border-[#e2e2e2] text-[#717973] uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Receipt / Date</th>
                <th className="py-3 px-4">Member Farmer</th>
                <th className="py-3 px-4">Crop & Bags</th>
                <th className="py-3 px-4">Net Metric Tons</th>
                <th className="py-3 px-4">Moisture & Quality</th>
                <th className="py-3 px-4">Storage Bin</th>
                <th className="py-3 px-4">Total Value</th>
                <th className="py-3 px-4">Net Payout</th>
                <th className="py-3 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e2e2]">
              {filteredIntakes.map((intake) => (
                <tr
                  key={intake.id}
                  className="hover:bg-[#f3f8f5] transition-colors cursor-pointer"
                  onClick={() => setSelectedReceipt(intake)}
                >
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-xs text-[#012d1d]">{intake.receiptNumber}</div>
                    <div className="text-[10px] text-[#717973]">
                      {new Date(intake.timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-heading font-bold text-xs text-[#1a1c1c]">{intake.farmerName}</div>
                    <div className="text-[10px] text-[#717973]">{intake.clusterName}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#012d1d]">{intake.crop}</div>
                    <div className="text-[10px] text-[#717973]">{intake.bagCount} bags ({intake.bagSizeKg}kg)</div>
                  </td>
                  <td className="py-3.5 px-4 font-heading font-bold text-sm text-[#012d1d]">
                    {intake.netWeightMT} MT
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs">{intake.moistureContent}%</span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          intake.qualityGrade.includes('Grade A')
                            ? 'bg-[#c1ecd4] text-[#002114]'
                            : intake.qualityGrade.includes('Grade B')
                            ? 'bg-[#d8e2ff] text-[#001b3e]'
                            : 'bg-[#ffdeac] text-[#281900]'
                        }`}
                      >
                        {intake.qualityGrade.split(' ')[0]} {intake.qualityGrade.split(' ')[1]}
                      </span>
                    </div>
                    <div className="text-[10px] text-[#717973]">Foreign: {intake.foreignMatterPercent}%</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="bg-[#f3f3f3] text-[#414844] font-medium px-2 py-0.5 rounded text-[11px]">
                      {intake.storageBin}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#1a1c1c]">
                    ₦{intake.totalValuationNaira.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#3f6653]">
                      ₦{intake.netPayableToFarmerNaira.toLocaleString()}
                    </div>
                    {intake.harvestDeductionNaira > 0 && (
                      <div className="text-[9px] text-[#ba1a1a]">
                        -₦{intake.harvestDeductionNaira.toLocaleString()} loan ded.
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setSelectedReceipt(intake)}
                      className="px-2.5 py-1 bg-[#012d1d] hover:bg-[#1b4332] text-white rounded text-[11px] font-bold inline-flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[14px]">receipt_long</span>
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Intake Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#c1c8c2] space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#e2e2e2] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#3f6653] bg-[#c1ecd4] px-2 py-0.5 rounded">
                  Electronic Weighbridge & Moisture Assessment
                </span>
                <h3 className="font-heading font-bold text-lg text-[#012d1d] mt-1">
                  Log Grain Intake & Quality Inspection
                </h3>
              </div>
              <button
                onClick={() => setShowLogModal(false)}
                className="w-8 h-8 rounded-full bg-[#f3f3f3] hover:bg-[#e2e2e2] flex items-center justify-center text-[#414844]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleLogIntake} className="space-y-4 text-xs">
              {/* Farmer Selection */}
              <div>
                <label className="block text-[11px] font-bold text-[#414844] mb-1">
                  Member Farmer *
                </label>
                <select
                  value={selectedFarmerId}
                  onChange={(e) => {
                    setSelectedFarmerId(e.target.value);
                    const f = coopMembers.find((m) => m.id === e.target.value);
                    if (f) {
                      setHarvestDeductionNaira(Math.min(50000, f.loanBalanceNaira));
                    }
                  }}
                  className="w-full px-3 py-2 bg-[#f3f3f3] border border-[#c1c8c2] rounded-lg text-xs font-medium text-[#1a1c1c] focus:outline-none"
                >
                  {coopMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.cluster}) — Loan Debt: ₦{m.loanBalanceNaira.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Crop & Storage Details */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#414844] mb-1">
                    Crop Type
                  </label>
                  <select
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f3f3f3] border border-[#c1c8c2] rounded-lg focus:outline-none"
                  >
                    <option value="White Maize">White Maize</option>
                    <option value="Yellow Maize">Yellow Maize</option>
                    <option value="Soybeans">Soybeans</option>
                    <option value="Paddy Rice">Paddy Rice</option>
                    <option value="Cassava Chips">Dried Cassava Chips</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#414844] mb-1">
                    Designated Silo / Bin
                  </label>
                  <select
                    value={storageBin}
                    onChange={(e) => setStorageBin(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f3f3f3] border border-[#c1c8c2] rounded-lg focus:outline-none"
                  >
                    <option value="Silo Alpha-01">Silo Alpha-01 (Maize Bulk)</option>
                    <option value="Silo Beta-02">Silo Beta-02 (Soybeans Bulk)</option>
                    <option value="Bay 4 (Pallet Flatbed)">Bay 4 (Pallet Flatbed Floor)</option>
                    <option value="Aeration Drying Floor B">Aeration Drying Floor B</option>
                  </select>
                </div>
              </div>

              {/* Weighbridge Numbers */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-[#f9f9f9] rounded-xl border border-[#e2e2e2]">
                <div>
                  <label className="block text-[10px] font-bold text-[#717973] mb-1">
                    Bag Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={bagCount}
                    onChange={(e) => setBagCount(parseInt(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 bg-white border border-[#c1c8c2] rounded-lg font-bold text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#717973] mb-1">
                    Standard Bag Size
                  </label>
                  <select
                    value={bagSizeKg}
                    onChange={(e) => setBagSizeKg(parseInt(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-white border border-[#c1c8c2] rounded-lg text-xs"
                  >
                    <option value={100}>100 kg</option>
                    <option value={50}>50 kg</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#717973] mb-1">
                    Moisture (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="8"
                    max="25"
                    value={moistureContent}
                    onChange={(e) => setMoistureContent(parseFloat(e.target.value) || 12.0)}
                    className="w-full px-2.5 py-1.5 bg-white border border-[#c1c8c2] rounded-lg font-bold text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#717973] mb-1">
                    Foreign Matter (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={foreignMatter}
                    onChange={(e) => setForeignMatter(parseFloat(e.target.value) || 1.0)}
                    className="w-full px-2.5 py-1.5 bg-white border border-[#c1c8c2] rounded-lg font-bold text-xs"
                  />
                </div>
              </div>

              {/* Dynamic Quality Grade & Price Evaluation Box */}
              <div className="p-3 rounded-xl border border-[#c1ecd4] bg-[#f3f8f5] space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-[#012d1d]">Computed Quality Grade:</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                      quality.grade.includes('Grade A')
                        ? 'bg-[#c1ecd4] text-[#002114]'
                        : quality.grade.includes('Grade B')
                        ? 'bg-[#d8e2ff] text-[#001b3e]'
                        : 'bg-[#ffdeac] text-[#281900]'
                    }`}
                  >
                    {quality.grade}
                  </span>
                </div>
                <p className="text-[10px] text-[#414844] leading-relaxed">
                  {quality.recommendation}
                </p>
                <div className="grid grid-cols-3 gap-2 pt-1 border-t border-[#c1ecd4] text-center">
                  <div>
                    <div className="text-[10px] text-[#717973]">Net Weight</div>
                    <div className="font-heading font-bold text-xs text-[#012d1d]">{netWeightMT} MT ({netWeightKg.toLocaleString()} kg)</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#717973]">Calculated Rate</div>
                    <div className="font-heading font-bold text-xs text-[#012d1d]">₦{pricePerKg}/kg (₦{quality.basePriceNairaPerMT.toLocaleString()}/MT)</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#717973]">Gross Valuation</div>
                    <div className="font-heading font-bold text-xs text-[#012d1d]">₦{totalValuation.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {/* Harvest Loan Deduction Settlement */}
              <div className="p-3 bg-[#fdf5f5] rounded-xl border border-[#ffd8d8] space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-[#ba1a1a] text-xs">Harvest Debt Recovery Deduction</span>
                    <p className="text-[10px] text-[#717973]">Farmer loan balance: ₦{(activeFarmer?.loanBalanceNaira || 0).toLocaleString()}</p>
                  </div>
                  <div className="w-32">
                    <input
                      type="number"
                      step="10000"
                      max={activeFarmer?.loanBalanceNaira || 0}
                      value={safeDeduction}
                      onChange={(e) => setHarvestDeductionNaira(Math.min(activeFarmer?.loanBalanceNaira || 0, parseInt(e.target.value) || 0))}
                      className="w-full px-2.5 py-1 bg-white border border-[#ffd8d8] rounded-lg font-bold text-xs text-[#ba1a1a] text-right"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-[#ffd8d8]">
                  <span className="font-bold text-xs text-[#012d1d]">Net Direct Payable to Farmer:</span>
                  <span className="font-heading font-bold text-sm text-[#3f6653]">
                    ₦{netPayable.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#e2e2e2]">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 bg-[#f3f3f3] text-[#414844] font-bold rounded-lg hover:bg-[#e8e8e8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#012d1d] text-white font-bold rounded-lg hover:bg-[#1b4332] flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span>Confirm & Issue Receipt</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Digital Weighbridge Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#c1c8c2] space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-[#e2e2e2] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#3f6653] bg-[#c1ecd4] px-2 py-0.5 rounded">
                  Electronic Grain Warehouse Receipt
                </span>
                <h3 className="font-heading font-bold text-xl text-[#012d1d] mt-1">
                  Receipt #{selectedReceipt.receiptNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="w-8 h-8 rounded-full bg-[#f3f3f3] hover:bg-[#e2e2e2] flex items-center justify-center text-[#414844]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Receipt Body */}
            <div className="p-4 bg-[#f9f9f9] border border-[#e2e2e2] rounded-xl space-y-3 text-xs font-mono">
              <div className="text-center pb-2 border-b border-dashed border-[#c1c8c2]">
                <div className="font-bold text-sm text-[#012d1d]">UNITED GRAIN FARMERS COOPERATIVE SOCIETY</div>
                <div className="text-[10px] text-[#717973]">Central Agro-Terminal & Silo Hub • RC-998234</div>
                <div className="text-[10px] text-[#717973]">Weighbridge Station: Abeokuta Silo Complex</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-[#717973]">Date/Time:</span>{' '}
                  <span className="font-bold">{new Date(selectedReceipt.timestamp).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[#717973]">Intake Officer:</span>{' '}
                  <span className="font-bold">{selectedReceipt.intakeOfficer}</span>
                </div>
                <div>
                  <span className="text-[#717973]">Member Farmer:</span>{' '}
                  <span className="font-bold">{selectedReceipt.farmerName}</span>
                </div>
                <div>
                  <span className="text-[#717973]">Cluster:</span>{' '}
                  <span className="font-bold">{selectedReceipt.clusterName}</span>
                </div>
                <div>
                  <span className="text-[#717973]">Commodity:</span>{' '}
                  <span className="font-bold">{selectedReceipt.crop}</span>
                </div>
                <div>
                  <span className="text-[#717973]">Silo Destination:</span>{' '}
                  <span className="font-bold">{selectedReceipt.storageBin}</span>
                </div>
              </div>

              <div className="p-2.5 bg-white border border-[#e2e2e2] rounded-lg space-y-1">
                <div className="flex justify-between">
                  <span>Bag Tally:</span>
                  <span className="font-bold">{selectedReceipt.bagCount} bags ({selectedReceipt.bagSizeKg} kg/bag)</span>
                </div>
                <div className="flex justify-between">
                  <span>Gross Weighbridge Weight:</span>
                  <span>{selectedReceipt.grossWeightKg.toLocaleString()} kg</span>
                </div>
                <div className="flex justify-between">
                  <span>Tare Weight (Truck/Bags):</span>
                  <span>{selectedReceipt.tareWeightKg.toLocaleString()} kg</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-[#012d1d] pt-1 border-t border-dashed border-[#e2e2e2]">
                  <span>Net Verified Weight:</span>
                  <span>{selectedReceipt.netWeightKg.toLocaleString()} kg ({selectedReceipt.netWeightMT} MT)</span>
                </div>
              </div>

              <div className="p-2.5 bg-[#f3f8f5] border border-[#c1ecd4] rounded-lg space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span>Moisture Content Meter:</span>
                  <span className="font-bold">{selectedReceipt.moistureContent}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Foreign Matter / Impurities:</span>
                  <span className="font-bold">{selectedReceipt.foreignMatterPercent}%</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-dashed border-[#c1ecd4]">
                  <span>Certified Grade:</span>
                  <span className="font-bold text-[#012d1d]">{selectedReceipt.qualityGrade}</span>
                </div>
              </div>

              <div className="p-2.5 bg-white border border-[#e2e2e2] rounded-lg space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Base Price Per Kg:</span>
                  <span>₦{selectedReceipt.pricePerKgCalculated}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Gross Valuation:</span>
                  <span className="font-bold">₦{selectedReceipt.totalValuationNaira.toLocaleString()}</span>
                </div>
                {selectedReceipt.harvestDeductionNaira > 0 && (
                  <div className="flex justify-between text-[#ba1a1a]">
                    <span>Seasonal Loan Harvest Deduction:</span>
                    <span className="font-bold">-₦{selectedReceipt.harvestDeductionNaira.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-[#3f6653] pt-1 border-t border-dashed border-[#e2e2e2]">
                  <span>Net Payable to Farmer:</span>
                  <span>₦{selectedReceipt.netPayableToFarmerNaira.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#c1c8c2] text-[10px] text-[#717973]">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-[#3f6653]">verified</span>
                  <span>Digitally Cryptographically Signed</span>
                </div>
                <span>Secured on Agro Ledger</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-[#012d1d] hover:bg-[#1b4332] text-white rounded-xl font-heading font-bold text-xs flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">print</span>
                <span>Print Weighbridge Receipt</span>
              </button>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2.5 bg-[#f3f3f3] hover:bg-[#e8e8e8] text-[#414844] rounded-xl font-heading font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
