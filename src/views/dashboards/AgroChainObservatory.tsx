import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface ZoneFlowData {
  zone: string;
  name: string;
  volumeMT: number;
  valueMillions: number;
  activeWaybills: number;
  topCorridor: string;
  leadCrop: string;
  growthPercent: number;
}

interface SiloFacility {
  id: string;
  name: string;
  state: string;
  zone: string;
  capacityMT: number;
  currentStockMT: number;
  primaryCrop: string;
  moisturePercent: number;
  tempCelsius: number;
  status: 'Optimal' | 'Near Capacity' | 'Buffer Alert';
  lastInspection: string;
}

interface PriceCorridorPoint {
  month: string;
  openMarket: number;
  floorPrice: number;
  ceilingPrice: number;
  reserveBenchmark: number;
}

export const AgroChainObservatory: React.FC = () => {
  const { role } = useAuth();
  const { auditLogs, addAuditLog, orders, listings, usersList } = useApp();

  // Selected filters & chart controls
  const [selectedCrop, setSelectedCrop] = useState<'Maize' | 'Rice' | 'Cassava' | 'Soybeans' | 'Sorghum'>('Maize');
  const [flowMetric, setFlowMetric] = useState<'volume' | 'value' | 'waybills'>('volume');
  const [selectedZone, setSelectedZone] = useState<string>('All Zones');
  const [timeRange, setTimeRange] = useState<'6M' | '1Y' | '30D'>('6M');

  // Modals
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [isBriefModalOpen, setIsBriefModalOpen] = useState(false);
  const [selectedSiloDetail, setSelectedSiloDetail] = useState<SiloFacility | null>(null);

  // Intervention simulation state
  const [simulatedCrop, setSimulatedCrop] = useState<'White Maize' | 'Paddy Rice' | 'Sorghum'>('White Maize');
  const [simulatedSilo, setSimulatedSilo] = useState<string>('Minna Federal Silo Complex (Niger)');
  const [releaseQuantityMT, setReleaseQuantityMT] = useState<number>(15000);
  const [targetZone, setTargetZone] = useState<string>('South West Urban Centers (Lagos, Ibadan)');
  const [interventionFeedback, setInterventionFeedback] = useState<string | null>(null);

  // Dynamic Silos state that can be updated when a release directive is executed
  const [silos, setSilos] = useState<SiloFacility[]>([
    {
      id: 'silo_1',
      name: 'Minna Federal Grain Silo Complex',
      state: 'Niger State',
      zone: 'North Central',
      capacityMT: 100000,
      currentStockMT: 84200,
      primaryCrop: 'White Maize',
      moisturePercent: 11.8,
      tempCelsius: 22.4,
      status: 'Optimal',
      lastInspection: '12 Feb 2025 (NAQS Certified)',
    },
    {
      id: 'silo_2',
      name: 'Gaya Strategic Reserve Complex',
      state: 'Kano State',
      zone: 'North West',
      capacityMT: 100000,
      currentStockMT: 91500,
      primaryCrop: 'Sorghum & Millet',
      moisturePercent: 10.9,
      tempCelsius: 21.8,
      status: 'Near Capacity',
      lastInspection: '14 Feb 2025 (NAQS Certified)',
    },
    {
      id: 'silo_3',
      name: 'Ado-Ekiti National Reserve Silo',
      state: 'Ekiti State',
      zone: 'South West',
      capacityMT: 25000,
      currentStockMT: 18750,
      primaryCrop: 'Paddy Rice',
      moisturePercent: 12.1,
      tempCelsius: 23.1,
      status: 'Optimal',
      lastInspection: '08 Feb 2025 (NAQS Certified)',
    },
    {
      id: 'silo_4',
      name: 'Dutsin-Ma Grain Silo Reserve',
      state: 'Katsina State',
      zone: 'North West',
      capacityMT: 25000,
      currentStockMT: 21200,
      primaryCrop: 'White Maize',
      moisturePercent: 11.2,
      tempCelsius: 22.0,
      status: 'Optimal',
      lastInspection: '10 Feb 2025 (NAQS Certified)',
    },
    {
      id: 'silo_5',
      name: 'Ogoja Grain Silo Facility',
      state: 'Cross River State',
      zone: 'South South',
      capacityMT: 25000,
      currentStockMT: 14500,
      primaryCrop: 'Cassava Starch & Rice',
      moisturePercent: 12.4,
      tempCelsius: 24.2,
      status: 'Buffer Alert',
      lastInspection: '05 Feb 2025 (NAQS Certified)',
    },
    {
      id: 'silo_6',
      name: 'Akure Strategic Agro Silo',
      state: 'Ondo State',
      zone: 'South West',
      capacityMT: 25000,
      currentStockMT: 19800,
      primaryCrop: 'Paddy Rice & Soybeans',
      moisturePercent: 11.9,
      tempCelsius: 22.8,
      status: 'Optimal',
      lastInspection: '09 Feb 2025 (NAQS Certified)',
    },
    {
      id: 'silo_7',
      name: 'Bauchi Regional Grain Depot',
      state: 'Bauchi State',
      zone: 'North East',
      capacityMT: 50000,
      currentStockMT: 42100,
      primaryCrop: 'Sorghum & Maize',
      moisturePercent: 11.5,
      tempCelsius: 21.5,
      status: 'Optimal',
      lastInspection: '11 Feb 2025 (NAQS Certified)',
    },
    {
      id: 'silo_8',
      name: 'Lafia Agro-Buffer Silo',
      state: 'Nasarawa State',
      zone: 'North Central',
      capacityMT: 25000,
      currentStockMT: 16300,
      primaryCrop: 'Paddy Rice & Sesame',
      moisturePercent: 12.0,
      tempCelsius: 23.5,
      status: 'Optimal',
      lastInspection: '07 Feb 2025 (NAQS Certified)',
    },
  ]);

  // Regional Commodity Flow Data across the 6 Geopolitical Zones
  const zoneFlowData: ZoneFlowData[] = [
    {
      zone: 'NC',
      name: 'North Central (Benue, Niger, Kaduna, Plateau)',
      volumeMT: 18400,
      valueMillions: 1480,
      activeWaybills: 412,
      topCorridor: 'Zaria/Minna ➔ Lagos/Ibadan Industrial Belt',
      leadCrop: 'White Maize & Soybeans',
      growthPercent: 14.8,
    },
    {
      zone: 'NW',
      name: 'North West (Kano, Katsina, Jigawa, Kebbi)',
      volumeMT: 14200,
      valueMillions: 1190,
      activeWaybills: 358,
      topCorridor: 'Dawanau/Kano ➔ Onitsha/Enugu Consumer Hub',
      leadCrop: 'Sorghum, Rice & Millet',
      growthPercent: 18.2,
    },
    {
      zone: 'SW',
      name: 'South West (Ogun, Ondo, Oyo, Osun, Lagos)',
      volumeMT: 9800,
      valueMillions: 885,
      activeWaybills: 245,
      topCorridor: 'Ibadan/Abeokuta ➔ Lagos Port & Feedmills',
      leadCrop: 'Cassava, Poultry Feed & Cocoa',
      growthPercent: 9.4,
    },
    {
      zone: 'NE',
      name: 'North East (Taraba, Bauchi, Gombe, Adamawa)',
      volumeMT: 7900,
      valueMillions: 670,
      activeWaybills: 198,
      topCorridor: 'Jalingo/Bauchi ➔ Port Harcourt Food Terminal',
      leadCrop: 'Maize, Groundnut & Cotton',
      growthPercent: 12.1,
    },
    {
      zone: 'SS',
      name: 'South South (Delta, Edo, Cross River, Rivers)',
      volumeMT: 5400,
      valueMillions: 510,
      activeWaybills: 142,
      topCorridor: 'Benin/Warri ➔ South East Regional Markets',
      leadCrop: 'Palm Oil, Cassava Starch & Rubber',
      growthPercent: 7.6,
    },
    {
      zone: 'SE',
      name: 'South East (Enugu, Anambra, Ebonyi, Imo, Abia)',
      volumeMT: 4800,
      valueMillions: 460,
      activeWaybills: 128,
      topCorridor: 'Abakaliki/Onitsha ➔ Coastal Distribution',
      leadCrop: 'Abakaliki Rice & Yam Tubers',
      growthPercent: 11.3,
    },
  ];

  // Price Corridor Historical Trends (6 Months) for Selected Crops
  const priceCorridors: Record<'Maize' | 'Rice' | 'Cassava' | 'Soybeans' | 'Sorghum', PriceCorridorPoint[]> = {
    Maize: [
      { month: 'Sep', openMarket: 28500, floorPrice: 24000, ceilingPrice: 34000, reserveBenchmark: 27500 },
      { month: 'Oct', openMarket: 29200, floorPrice: 24000, ceilingPrice: 34000, reserveBenchmark: 28000 },
      { month: 'Nov', openMarket: 30100, floorPrice: 25000, ceilingPrice: 35000, reserveBenchmark: 28500 },
      { month: 'Dec', openMarket: 31400, floorPrice: 25000, ceilingPrice: 35500, reserveBenchmark: 29000 },
      { month: 'Jan', openMarket: 31800, floorPrice: 26000, ceilingPrice: 36000, reserveBenchmark: 29500 },
      { month: 'Feb', openMarket: 32000, floorPrice: 26000, ceilingPrice: 36000, reserveBenchmark: 30000 },
    ],
    Rice: [
      { month: 'Sep', openMarket: 42000, floorPrice: 36000, ceilingPrice: 52000, reserveBenchmark: 40000 },
      { month: 'Oct', openMarket: 43500, floorPrice: 36000, ceilingPrice: 52000, reserveBenchmark: 41000 },
      { month: 'Nov', openMarket: 45000, floorPrice: 38000, ceilingPrice: 54000, reserveBenchmark: 42500 },
      { month: 'Dec', openMarket: 47200, floorPrice: 38000, ceilingPrice: 55000, reserveBenchmark: 44000 },
      { month: 'Jan', openMarket: 47800, floorPrice: 39000, ceilingPrice: 56000, reserveBenchmark: 45000 },
      { month: 'Feb', openMarket: 48000, floorPrice: 39000, ceilingPrice: 56000, reserveBenchmark: 45500 },
    ],
    Cassava: [
      { month: 'Sep', openMarket: 78000, floorPrice: 65000, ceilingPrice: 95000, reserveBenchmark: 75000 },
      { month: 'Oct', openMarket: 79500, floorPrice: 65000, ceilingPrice: 95000, reserveBenchmark: 76000 },
      { month: 'Nov', openMarket: 81000, floorPrice: 68000, ceilingPrice: 98000, reserveBenchmark: 78000 },
      { month: 'Dec', openMarket: 83500, floorPrice: 68000, ceilingPrice: 98000, reserveBenchmark: 80000 },
      { month: 'Jan', openMarket: 84200, floorPrice: 70000, ceilingPrice: 100000, reserveBenchmark: 81000 },
      { month: 'Feb', openMarket: 85000, floorPrice: 70000, ceilingPrice: 100000, reserveBenchmark: 82000 },
    ],
    Soybeans: [
      { month: 'Sep', openMarket: 380000, floorPrice: 320000, ceilingPrice: 460000, reserveBenchmark: 360000 },
      { month: 'Oct', openMarket: 390000, floorPrice: 320000, ceilingPrice: 460000, reserveBenchmark: 370000 },
      { month: 'Nov', openMarket: 402000, floorPrice: 340000, ceilingPrice: 480000, reserveBenchmark: 385000 },
      { month: 'Dec', openMarket: 412000, floorPrice: 340000, ceilingPrice: 480000, reserveBenchmark: 395000 },
      { month: 'Jan', openMarket: 416000, floorPrice: 350000, ceilingPrice: 490000, reserveBenchmark: 400000 },
      { month: 'Feb', openMarket: 420000, floorPrice: 350000, ceilingPrice: 490000, reserveBenchmark: 405000 },
    ],
    Sorghum: [
      { month: 'Sep', openMarket: 24500, floorPrice: 20000, ceilingPrice: 31000, reserveBenchmark: 23500 },
      { month: 'Oct', openMarket: 25200, floorPrice: 20000, ceilingPrice: 31000, reserveBenchmark: 24000 },
      { month: 'Nov', openMarket: 26100, floorPrice: 21000, ceilingPrice: 32000, reserveBenchmark: 25000 },
      { month: 'Dec', openMarket: 27000, floorPrice: 21000, ceilingPrice: 33000, reserveBenchmark: 26000 },
      { month: 'Jan', openMarket: 27600, floorPrice: 22000, ceilingPrice: 33500, reserveBenchmark: 26500 },
      { month: 'Feb', openMarket: 28000, floorPrice: 22000, ceilingPrice: 34000, reserveBenchmark: 27000 },
    ],
  };

  const activePoints = priceCorridors[selectedCrop];
  const maxPrice = Math.max(...activePoints.map((p) => Math.max(p.ceilingPrice, p.openMarket))) * 1.1;
  const minPrice = Math.min(...activePoints.map((p) => Math.min(p.floorPrice, p.openMarket))) * 0.9;

  // Total Silo Capacity & Utilization
  const totalSiloCapacity = silos.reduce((acc, s) => acc + s.capacityMT, 0);
  const totalSiloStock = silos.reduce((acc, s) => acc + s.currentStockMT, 0);
  const nationalBufferDays = Math.round((totalSiloStock / 4200) * 1.1); // approx daily national staple buffer consumption

  // Agro-Chain Participants Matrix
  const participantsSummary = [
    {
      category: 'Primary Producers (Farmers)',
      count: '142,850',
      verifiedPercent: 93.4,
      unit: 'Active smallholders',
      icon: 'grass',
      share: '64%',
      regulatoryFocus: 'NIN/BVN & Geo-tagged Acreage (FMAFS National Register)',
    },
    {
      category: 'Registered Farmer Cooperatives',
      count: '1,840',
      verifiedPercent: 98.1,
      unit: 'Clusters (Avg 78 members)',
      icon: 'groups',
      share: '12%',
      regulatoryFocus: 'CAC RC & Federal Ministry Cooperative Division registration',
    },
    {
      category: 'Commercial Off-takers & Millers',
      count: '320',
      verifiedPercent: 100,
      unit: 'Industrial food processors',
      icon: 'storefront',
      share: '8%',
      regulatoryFocus: 'Accredited by NCX & FMAFS Food Reserve Directorate',
    },
    {
      category: 'Licensed Agro-Input Dealers',
      count: '612',
      verifiedPercent: 96.5,
      unit: 'Fertilizer & seed depots',
      icon: 'water_drop',
      share: '6%',
      regulatoryFocus: 'NAFDAC & National Agricultural Seed Council (NASC) certification',
    },
    {
      category: 'Certified Logistics & Transporters',
      count: '1,290',
      verifiedPercent: 95.0,
      unit: 'Haulage fleet trucks',
      icon: 'local_shipping',
      share: '7%',
      regulatoryFocus: 'NAQS Quarantine clearance & Inter-state waybill tracking',
    },
    {
      category: 'Strategic Silos & Warehouses',
      count: '33',
      verifiedPercent: 100,
      unit: 'Storage complexes',
      icon: 'domain',
      share: '3%',
      regulatoryFocus: 'Federal Strategic Reserve Network & Electronic Warehouse Receipts (e-WHR)',
    },
  ];

  // Handler for simulating and executing a regulatory market intervention
  const handleExecuteIntervention = () => {
    const target = silos.find((s) => s.name === simulatedSilo) || silos[0];
    if (target.currentStockMT < releaseQuantityMT) {
      alert(`Warning: Selected silo has insufficient stock (${target.currentStockMT.toLocaleString()} MT available).`);
      return;
    }

    // Deduct stock from the silo
    setSilos((prev) =>
      prev.map((s) =>
        s.id === target.id
          ? {
              ...s,
              currentStockMT: s.currentStockMT - releaseQuantityMT,
              status: s.currentStockMT - releaseQuantityMT < 20000 ? 'Buffer Alert' : s.status,
            }
          : s
      )
    );

    // Log the official ministerial action
    addAuditLog(
      'FMAFS Regulatory Directorate',
      role,
      'MINISTERIAL_MARKET_INTERVENTION',
      `Authorized strategic reserve release of ${releaseQuantityMT.toLocaleString()} MT of ${simulatedCrop} from ${target.name} to ${targetZone}. Expected price dampening: -8.5% in destination corridor.`
    );

    setInterventionFeedback(
      `Directive Gazette #FMAFS/SGR/${Date.now().toString().slice(-6)} successfully executed! ${releaseQuantityMT.toLocaleString()} MT allocated to ${targetZone}. Electronic waybills generated for freight mobilization.`
    );

    setTimeout(() => {
      setInterventionFeedback(null);
      setIsDecisionModalOpen(false);
    }, 3500);
  };

  return (
    <div className="space-y-6">
      {/* Top Regulatory Intelligence Banner */}
      <div className="bg-[#012d1d] text-white p-6 rounded-2xl shadow-sm border border-[#1b4332] space-y-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#10b981] text-[#002114] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#002114] animate-ping" />
                Live Surveillance
              </span>
              <span className="text-xs text-[#86af99] font-mono">
                FMAFS • Bank of Agriculture (BOA) • NAQS • NCX Observatory
              </span>
            </div>
            <h1 className="font-heading font-black text-2xl lg:text-3xl tracking-tight">
              National Agro-Chain Intelligence & Regulatory Observatory
            </h1>
            <p className="text-xs text-[#c1ecd4]/80 max-w-3xl leading-relaxed">
              Real-time multi-tier surveillance across Nigeria's agricultural value chain: monitoring 146,000+ participants, inter-state trade volumes, food inflation corridors, and national strategic grain buffers for policy decision-making.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsDecisionModalOpen(true)}
              className="px-4 py-2.5 bg-[#10b981] hover:bg-[#059669] text-[#002114] text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">gavel</span>
              <span>Policy Decision Simulator</span>
            </button>

            <button
              onClick={() => setIsBriefModalOpen(true)}
              className="px-4 py-2.5 bg-[#1b4332] hover:bg-[#274e3d] text-white text-xs font-bold rounded-xl flex items-center gap-2 border border-[#86af99]/30 transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">description</span>
              <span>Export Executive Brief</span>
            </button>
          </div>
        </div>

        {/* Real-time Ticker Strip */}
        <div className="pt-3 border-t border-[#1b4332] flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#86af99] font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10b981]" />
            <span>National Feed Ingestion: <strong>Active (36 States + FCT)</strong></span>
          </div>
          <div className="flex items-center gap-4">
            <span>Verified Participants: <strong className="text-white">146,912</strong> (94.2% NIN)</span>
            <span>BOA Escrow Hold: <strong className="text-[#c1ecd4]">₦3.85B</strong></span>
            <span>Food Security Buffer: <strong className="text-white">{nationalBufferDays} Days</strong></span>
            <span>Cadre Harmonisé Status: <strong className="text-[#10b981]">Phase 1 (Normal)</strong></span>
          </div>
        </div>
      </div>

      {/* KPI Overview Cards for Regulators */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#c1c8c2] p-4 rounded-xl space-y-1.5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#717973]">Trade Commodity Flow</span>
            <span className="text-[10px] font-bold text-[#059669] bg-[#d1fae5] px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[12px]">trending_up</span>
              +18.4% MoM
            </span>
          </div>
          <div className="font-heading font-black text-2xl text-[#012d1d]">
            48,500 <span className="text-sm font-semibold text-[#414844]">MT</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#414844] pt-1 border-t border-[#e2e2e2]">
            <span>Active Interstate Fleets:</span>
            <span className="font-bold text-[#012d1d]">1,483 Waybills</span>
          </div>
        </div>

        <div className="bg-white border border-[#c1c8c2] p-4 rounded-xl space-y-1.5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#717973]">Strategic Grain Reserves</span>
            <span className="text-[10px] font-bold text-[#0284c7] bg-[#e0f2fe] px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[12px]">inventory_2</span>
              {Math.round((totalSiloStock / totalSiloCapacity) * 100)}% Capacity
            </span>
          </div>
          <div className="font-heading font-black text-2xl text-[#012d1d]">
            {(totalSiloStock / 1000).toFixed(1)}k <span className="text-sm font-semibold text-[#414844]">MT Stored</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#414844] pt-1 border-t border-[#e2e2e2]">
            <span>National Reserve Safety:</span>
            <span className="font-bold text-[#059669]">{nationalBufferDays} Days Supply</span>
          </div>
        </div>

        <div className="bg-white border border-[#c1c8c2] p-4 rounded-xl space-y-1.5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#717973]">Food Price Stability Index</span>
            <span className="text-[10px] font-bold text-[#059669] bg-[#d1fae5] px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[12px]">verified</span>
              Normal Corridor
            </span>
          </div>
          <div className="font-heading font-black text-2xl text-[#012d1d]">
            92.4 <span className="text-sm font-semibold text-[#717973]">/ 100</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#414844] pt-1 border-t border-[#e2e2e2]">
            <span>Inflation Deviation:</span>
            <span className="font-bold text-[#012d1d]">+2.1% (Within Cap)</span>
          </div>
        </div>

        <div className="bg-white border border-[#c1c8c2] p-4 rounded-xl space-y-1.5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#717973]">BOA Escrow Liquidity</span>
            <span className="text-[10px] font-bold text-[#7c3aed] bg-[#ede9fe] px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[12px]">account_balance</span>
              Protected
            </span>
          </div>
          <div className="font-heading font-black text-2xl text-[#012d1d]">
            ₦3.85 <span className="text-sm font-semibold text-[#414844]">Billion</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#414844] pt-1 border-t border-[#e2e2e2]">
            <span>Default / Fraud Risk:</span>
            <span className="font-bold text-[#059669]">0.00% Zero Loss</span>
          </div>
        </div>
      </div>

      {/* Main Charts Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Inter-State Commodity Flow & Trade Volume (8 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#c1c8c2] p-5 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-[#e2e2e2]">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#012d1d]">swap_horiz</span>
                <h3 className="font-heading font-black text-base text-[#012d1d]">
                  Regional Commodity Flow & Movement Matrix
                </h3>
              </div>
              <p className="text-xs text-[#717973]">
                Inter-state agricultural tonnage flowing through Nigerian transit corridors.
              </p>
            </div>

            <div className="flex items-center bg-[#f3f3f3] p-1 rounded-xl text-xs font-bold text-[#414844]">
              <button
                onClick={() => setFlowMetric('volume')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  flowMetric === 'volume' ? 'bg-[#012d1d] text-white shadow-xs' : 'hover:text-[#012d1d]'
                }`}
              >
                Volume (MT)
              </button>
              <button
                onClick={() => setFlowMetric('value')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  flowMetric === 'value' ? 'bg-[#012d1d] text-white shadow-xs' : 'hover:text-[#012d1d]'
                }`}
              >
                Value (₦M)
              </button>
              <button
                onClick={() => setFlowMetric('waybills')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  flowMetric === 'waybills' ? 'bg-[#012d1d] text-white shadow-xs' : 'hover:text-[#012d1d]'
                }`}
              >
                Waybills
              </button>
            </div>
          </div>

          {/* Interactive SVG Bar & Flow Representation */}
          <div className="space-y-3 pt-2">
            {zoneFlowData.map((item) => {
              const maxMetric = Math.max(
                ...zoneFlowData.map((d) =>
                  flowMetric === 'volume'
                    ? d.volumeMT
                    : flowMetric === 'value'
                    ? d.valueMillions
                    : d.activeWaybills
                )
              );
              const currentValue =
                flowMetric === 'volume'
                  ? item.volumeMT
                  : flowMetric === 'value'
                  ? item.valueMillions
                  : item.activeWaybills;
              const barPercent = Math.round((currentValue / maxMetric) * 100);

              return (
                <div key={item.zone} className="p-3 rounded-xl bg-[#f9f9f9] border border-[#e2e2e2] space-y-1.5 hover:bg-[#e7f5e8]/40 transition-colors">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[11px] bg-[#012d1d] text-[#c1ecd4] px-1.5 py-0.5 rounded">
                        {item.zone}
                      </span>
                      <span className="font-bold text-[#1a1c1c]">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-heading font-black text-[#012d1d] text-sm">
                        {flowMetric === 'volume'
                          ? `${item.volumeMT.toLocaleString()} MT`
                          : flowMetric === 'value'
                          ? `₦${item.valueMillions.toLocaleString()}M`
                          : `${item.activeWaybills} Fleets`}
                      </span>
                      <span className="text-[10px] text-[#059669] font-bold ml-1.5">
                        +{item.growthPercent}%
                      </span>
                    </div>
                  </div>

                  {/* Horizontal Bar with Gradient */}
                  <div className="w-full bg-[#e2e8f0] h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#012d1d] via-[#10b981] to-[#059669] h-full rounded-full transition-all duration-700"
                      style={{ width: `${barPercent}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[11px] text-[#717973] pt-0.5">
                    <span className="flex items-center gap-1 truncate max-w-[280px]">
                      <span className="material-symbols-outlined text-[13px] text-[#059669]">route</span>
                      {item.topCorridor}
                    </span>
                    <span className="font-medium text-[#414844] shrink-0">
                      Lead: <strong>{item.leadCrop}</strong>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-[#e7f5e8] border border-[#c1ecd4] rounded-xl flex items-center justify-between text-xs text-[#002114]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#059669] text-[20px]">verified_user</span>
              <span>
                <strong>Quarantine & Inter-state Toll Exemption:</strong> All 1,483 active waybills possess digital NAQS certificates, eliminating illegal checkpoints.
              </span>
            </div>
            <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded font-bold text-[#012d1d]">
              Zero Delay
            </span>
          </div>
        </div>

        {/* Chart 2: Real-time Price Corridor & Regulatory Inflation Watch (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#c1c8c2] p-5 space-y-4 shadow-xs flex flex-col justify-between">
          <div className="space-y-2 pb-3 border-b border-[#e2e2e2]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#012d1d]">price_check</span>
                <h3 className="font-heading font-black text-base text-[#012d1d]">
                  Regulatory Price Corridor
                </h3>
              </div>
              <span className="text-[10px] bg-[#c1ecd4] text-[#002114] font-bold px-2 py-0.5 rounded-full uppercase">
                FMAFS Benchmark
              </span>
            </div>
            <p className="text-xs text-[#717973]">
              Comparing Open Market trade versus Federal Reserve floor & anti-hoarding ceiling.
            </p>

            {/* Crop Selector Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-1 no-scrollbar">
              {(['Maize', 'Rice', 'Cassava', 'Soybeans', 'Sorghum'] as const).map((crop) => (
                <button
                  key={crop}
                  onClick={() => setSelectedCrop(crop)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    selectedCrop === crop
                      ? 'bg-[#012d1d] text-white shadow-xs'
                      : 'bg-[#f3f3f3] text-[#414844] hover:bg-[#e2e2e2]'
                  }`}
                >
                  {crop}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Multi-Line Trend Chart */}
          <div className="bg-[#fcfdfc] p-3 rounded-xl border border-[#e2e2e2] relative">
            <div className="flex justify-between items-center text-[10px] text-[#717973] font-mono mb-2">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-0.5 bg-[#ef4444] inline-block" /> Ceiling (Hoarding Risk)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-1 bg-[#10b981] inline-block rounded" /> Open Market Live
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-0.5 bg-[#0284c7] inline-block" /> Silo Floor Buffer
              </span>
            </div>

            {/* SVG Chart Area */}
            <div className="w-full h-44 relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 320 140" preserveAspectRatio="none">
                {/* Horizontal Guide Lines */}
                <line x1="0" y1="20" x2="320" y2="20" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="60" x2="320" y2="60" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="100" x2="320" y2="100" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />

                {/* Ceiling Line (Red) */}
                <polyline
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                  points={activePoints
                    .map((p, idx) => {
                      const x = (idx / (activePoints.length - 1)) * 320;
                      const y = 130 - ((p.ceilingPrice - minPrice) / (maxPrice - minPrice)) * 120;
                      return `${x},${y}`;
                    })
                    .join(' ')}
                />

                {/* Floor Line (Blue) */}
                <polyline
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                  points={activePoints
                    .map((p, idx) => {
                      const x = (idx / (activePoints.length - 1)) * 320;
                      const y = 130 - ((p.floorPrice - minPrice) / (maxPrice - minPrice)) * 120;
                      return `${x},${y}`;
                    })
                    .join(' ')}
                />

                {/* Open Market Area & Line (Green) */}
                <polygon
                  fill="url(#greenGradient)"
                  opacity="0.25"
                  points={`0,130 ${activePoints
                    .map((p, idx) => {
                      const x = (idx / (activePoints.length - 1)) * 320;
                      const y = 130 - ((p.openMarket - minPrice) / (maxPrice - minPrice)) * 120;
                      return `${x},${y}`;
                    })
                    .join(' ')} 320,130`}
                />

                <polyline
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={activePoints
                    .map((p, idx) => {
                      const x = (idx / (activePoints.length - 1)) * 320;
                      const y = 130 - ((p.openMarket - minPrice) / (maxPrice - minPrice)) * 120;
                      return `${x},${y}`;
                    })
                    .join(' ')}
                />

                {/* Point Dots */}
                {activePoints.map((p, idx) => {
                  const x = (idx / (activePoints.length - 1)) * 320;
                  const y = 130 - ((p.openMarket - minPrice) / (maxPrice - minPrice)) * 120;
                  return (
                    <circle
                      key={idx}
                      cx={x}
                      cy={y}
                      r="4"
                      fill="#012d1d"
                      stroke="#c1ecd4"
                      strokeWidth="2"
                    />
                  );
                })}

                <defs>
                  <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Month Labels */}
              <div className="flex justify-between text-[9px] font-mono text-[#717973] pt-1">
                {activePoints.map((p) => (
                  <span key={p.month}>{p.month}</span>
                ))}
              </div>
            </div>

            {/* Current Metrics Card */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#e2e2e2] text-center">
              <div className="p-1.5 bg-white rounded border border-[#e2e2e2]">
                <div className="text-[9px] text-[#717973] font-bold">Floor Support</div>
                <div className="text-xs font-black text-[#0284c7]">
                  ₦{activePoints[activePoints.length - 1].floorPrice.toLocaleString()}
                </div>
              </div>
              <div className="p-1.5 bg-[#e7f5e8] rounded border border-[#c1ecd4]">
                <div className="text-[9px] text-[#002114] font-bold">Open Market Live</div>
                <div className="text-xs font-black text-[#012d1d]">
                  ₦{activePoints[activePoints.length - 1].openMarket.toLocaleString()}
                </div>
              </div>
              <div className="p-1.5 bg-white rounded border border-[#e2e2e2]">
                <div className="text-[9px] text-[#717973] font-bold">Anti-Hoard Cap</div>
                <div className="text-xs font-black text-[#ef4444]">
                  ₦{activePoints[activePoints.length - 1].ceilingPrice.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Regulatory Corridor Status */}
          <div className="p-3 bg-[#f3f3f3] rounded-xl border border-[#e2e2e2] text-xs space-y-1">
            <div className="flex justify-between items-center font-bold text-[#012d1d]">
              <span>Market Stability Evaluation:</span>
              <span className="text-[#059669]">HEALTHY (+1.4% change)</span>
            </div>
            <p className="text-[11px] text-[#414844]">
              {selectedCrop} prices are trading safely within the ₦{activePoints[activePoints.length - 1].floorPrice.toLocaleString()} – ₦{activePoints[activePoints.length - 1].ceilingPrice.toLocaleString()} corridor. No predatory gouging detected by NCX monitors.
            </p>
          </div>
        </div>
      </div>

      {/* Row 2: Agro-Chain Participants Matrix & National Silo Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Participants Directory Breakdown (6 Cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-[#c1c8c2] p-5 space-y-4 shadow-xs">
          <div className="flex justify-between items-center pb-3 border-b border-[#e2e2e2]">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#012d1d]">hub</span>
                <h3 className="font-heading font-black text-base text-[#012d1d]">
                  Agro-Chain Participants & KYC Registry
                </h3>
              </div>
              <p className="text-xs text-[#717973]">
                146,912 registered stakeholders across 6 distinct value chain segments.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#059669] bg-[#d1fae5] px-2.5 py-1 rounded-full">
              94.2% Biometric KYC
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {participantsSummary.map((p, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-[#f9f9f9] border border-[#e2e2e2] space-y-2 hover:border-[#10b981] transition-all">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-[#012d1d] text-[#c1ecd4] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">{p.icon}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-[#c1ecd4] text-[#002114] px-1.5 py-0.5 rounded">
                    {p.verifiedPercent}% Verified
                  </span>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#414844] truncate">{p.category}</div>
                  <div className="font-heading font-black text-lg text-[#012d1d]">{p.count}</div>
                  <div className="text-[10px] text-[#717973]">{p.unit}</div>
                </div>
                <div className="text-[9px] text-[#414844] pt-1.5 border-t border-[#e2e2e2] flex items-center gap-1 truncate">
                  <span className="material-symbols-outlined text-[11px] text-[#059669]">verified</span>
                  <span className="truncate">{p.regulatoryFocus}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-[#fdfdfd] border border-[#e2e2e2] rounded-xl flex items-center justify-between text-xs text-[#414844]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#012d1d]">fingerprint</span>
              <span>
                <strong>National Identity Management Commission (NIMC) API:</strong> Biometric verification enabled for farmer input subsidy disbursements.
              </span>
            </div>
          </div>
        </div>

        {/* National Strategic Grain Reserves (SGR) Silo Telemetry (6 Cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-[#c1c8c2] p-5 space-y-4 shadow-xs">
          <div className="flex justify-between items-center pb-3 border-b border-[#e2e2e2]">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#012d1d]">warehouse</span>
                <h3 className="font-heading font-black text-base text-[#012d1d]">
                  Federal Strategic Grain Silos (SGR)
                </h3>
              </div>
              <p className="text-xs text-[#717973]">
                Live capacity and grain health telemetry across 8 Federal storage complexes.
              </p>
            </div>
            <button
              onClick={() => setIsDecisionModalOpen(true)}
              className="px-3 py-1 bg-[#012d1d] hover:bg-[#1b4332] text-white text-[11px] font-bold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">tune</span>
              <span>Adjust Buffer</span>
            </button>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto no-scrollbar pr-1">
            {silos.map((silo) => {
              const fillPercent = Math.round((silo.currentStockMT / silo.capacityMT) * 100);
              return (
                <div
                  key={silo.id}
                  onClick={() => setSelectedSiloDetail(silo)}
                  className="p-3 rounded-xl bg-[#f9f9f9] border border-[#e2e2e2] space-y-2 hover:bg-[#e7f5e8]/40 hover:border-[#10b981] transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-xs text-[#012d1d] flex items-center gap-1.5">
                        <span>{silo.name}</span>
                        <span className="text-[10px] font-normal text-[#717973]">({silo.state})</span>
                      </div>
                      <div className="text-[11px] text-[#414844]">
                        Crop: <strong>{silo.primaryCrop}</strong> • Zone: {silo.zone}
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        silo.status === 'Optimal'
                          ? 'bg-[#c1ecd4] text-[#002114]'
                          : silo.status === 'Near Capacity'
                          ? 'bg-[#e0f2fe] text-[#0369a1]'
                          : 'bg-[#ffdeac] text-[#78350f]'
                      }`}
                    >
                      {silo.status} ({fillPercent}%)
                    </span>
                  </div>

                  {/* Silo Capacity Bar */}
                  <div className="space-y-1">
                    <div className="w-full bg-[#e2e8f0] h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          fillPercent > 80
                            ? 'bg-[#059669]'
                            : fillPercent > 50
                            ? 'bg-[#0284c7]'
                            : 'bg-[#d97706]'
                        }`}
                        style={{ width: `${fillPercent}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-[#717973] font-mono">
                      <span>Stored: <strong>{silo.currentStockMT.toLocaleString()} MT</strong></span>
                      <span>Total: {silo.capacityMT.toLocaleString()} MT</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] pt-1 border-t border-[#e2e2e2] text-[#414844]">
                    <span>Moisture: <strong>{silo.moisturePercent}%</strong> (Safe &lt;13%)</span>
                    <span>Temp: <strong>{silo.tempCelsius}°C</strong></span>
                    <span className="text-[#059669] font-medium">{silo.lastInspection}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 3: Input Subsidy Funnel & Food Security Early Warning (Cadre Harmonisé) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Presidential Fertilizer Initiative (PFI) & Input Subsidy Tracker */}
        <div className="bg-white rounded-2xl border border-[#c1c8c2] p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#e2e2e2]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#012d1d]">spa</span>
              <h3 className="font-heading font-black text-base text-[#012d1d]">
                Presidential Fertilizer & Subsidy Flow (PFI)
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold bg-[#c1ecd4] text-[#002114] px-2 py-0.5 rounded-full">
              76.5% Redemption
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-[#f9f9f9] rounded-xl border border-[#e2e2e2] space-y-2">
              <div className="flex justify-between text-xs font-bold text-[#012d1d]">
                <span>1. Federal Budget Allocation</span>
                <span>₦12.5 Billion</span>
              </div>
              <p className="text-[11px] text-[#717973]">
                Authorized by FMAFS for smallholder input support (50% price subsidy on NPK 20:10:10 & Urea).
              </p>
              <div className="w-full bg-[#e2e8f0] h-2 rounded-full overflow-hidden">
                <div className="bg-[#012d1d] h-full w-[100%]" />
              </div>
            </div>

            <div className="p-3 bg-[#f9f9f9] rounded-xl border border-[#e2e2e2] space-y-2">
              <div className="flex justify-between text-xs font-bold text-[#012d1d]">
                <span>2. Registered Fertilizer Blenders & Depots</span>
                <span>500,000 Vouchers Dispatched</span>
              </div>
              <p className="text-[11px] text-[#717973]">
                Allocated across certified blending plants in Kaduna, Kano, Edo, and Ogun States.
              </p>
              <div className="w-full bg-[#e2e8f0] h-2 rounded-full overflow-hidden">
                <div className="bg-[#1b4332] h-full w-[100%]" />
              </div>
            </div>

            <div className="p-3 bg-[#e7f5e8] rounded-xl border border-[#c1ecd4] space-y-2">
              <div className="flex justify-between text-xs font-bold text-[#002114]">
                <span>3. Smallholder Biometric Redemption (NIN Verified)</span>
                <span>382,410 Vouchers Redeemed</span>
              </div>
              <p className="text-[11px] text-[#414844]">
                Farmers presented digital QR / USSD vouchers at local ADP depots for immediate bag collection.
              </p>
              <div className="w-full bg-[#c1ecd4] h-2 rounded-full overflow-hidden">
                <div className="bg-[#10b981] h-full w-[76.5%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Food Security Early Warning (Cadre Harmonisé / IPC) */}
        <div className="bg-white rounded-2xl border border-[#c1c8c2] p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#e2e2e2]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#012d1d]">radar</span>
              <h3 className="font-heading font-black text-base text-[#012d1d]">
                Food Security Early Warning (Cadre Harmonisé)
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold bg-[#c1ecd4] text-[#002114] px-2 py-0.5 rounded-full">
              Q1 Surveillance
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] space-y-1">
              <div className="flex justify-between items-center text-xs font-bold text-[#166534]">
                <span>North Central Belt (Benue, Niger, Plateau)</span>
                <span className="bg-[#bbf7d0] text-[#166534] px-2 py-0.5 rounded text-[10px]">Phase 1: Minimal</span>
              </div>
              <p className="text-[11px] text-[#414844]">
                Above-average harvest yields recorded for early maize and yam. Silo storage at 82% capacity.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#fefce8] border border-[#fef08a] space-y-1">
              <div className="flex justify-between items-center text-xs font-bold text-[#854d0e]">
                <span>North West Grain Zone (Katsina, Sokoto, Kebbi)</span>
                <span className="bg-[#fef08a] text-[#854d0e] px-2 py-0.5 rounded text-[10px]">Phase 2: Stressed</span>
              </div>
              <p className="text-[11px] text-[#414844]">
                Dry season irrigation ongoing along Rima Basin. Soil moisture optimal; fuel logistics costs monitored.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#fef2f2] border border-[#fecaca] space-y-1">
              <div className="flex justify-between items-center text-xs font-bold text-[#991b1b]">
                <span>North East Border Pockets (Borno, Yobe)</span>
                <span className="bg-[#fecaca] text-[#991b1b] px-2 py-0.5 rounded text-[10px]">Phase 2/3: Targeted Relief</span>
              </div>
              <p className="text-[11px] text-[#414844]">
                Strategic grain releases recommended for displaced farmer clusters. FMAFS emergency seeds allocated.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] space-y-1">
              <div className="flex justify-between items-center text-xs font-bold text-[#166534]">
                <span>Southern Agro-Industrial Belts (South West, South South)</span>
                <span className="bg-[#bbf7d0] text-[#166534] px-2 py-0.5 rounded text-[10px]">Phase 1: Minimal</span>
              </div>
              <p className="text-[11px] text-[#414844]">
                Cassava starch processing and poultry feed production operating at 94% industrial utilization.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: Policy Decision & Market Intervention Simulator */}
      {isDecisionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#c1c8c2] space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start pb-3 border-b border-[#e2e2e2]">
              <div>
                <span className="bg-[#ba1a1a] text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">
                  Ministerial Action Center
                </span>
                <h2 className="font-heading font-black text-xl text-[#012d1d] mt-1">
                  Simulate Strategic Reserve Release & Market Intervention
                </h2>
                <p className="text-xs text-[#717973]">
                  Model the real-time macroeconomic impact of releasing strategic buffer stocks into national deficit corridors.
                </p>
              </div>
              <button
                onClick={() => setIsDecisionModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f3f3f3] text-[#414844] hover:bg-[#e2e2e2] flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {interventionFeedback ? (
              <div className="p-4 bg-[#e7f5e8] border border-[#10b981] rounded-xl text-center space-y-2">
                <span className="material-symbols-outlined text-[36px] text-[#059669]">check_circle</span>
                <h3 className="font-heading font-bold text-sm text-[#002114]">Intervention Dispatched</h3>
                <p className="text-xs text-[#012d1d]">{interventionFeedback}</p>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#1a1c1c] mb-1">Target Commodity</label>
                    <select
                      value={simulatedCrop}
                      onChange={(e) => setSimulatedCrop(e.target.value as any)}
                      className="w-full h-10 px-3 rounded-lg border border-[#717973] bg-white font-bold"
                    >
                      <option value="White Maize">White Maize (Feed & Grain)</option>
                      <option value="Paddy Rice">Paddy Rice (Food Security)</option>
                      <option value="Sorghum">Sorghum (Beverage & Flour)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-[#1a1c1c] mb-1">Source Federal Silo Complex</label>
                    <select
                      value={simulatedSilo}
                      onChange={(e) => setSimulatedSilo(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-[#717973] bg-white font-bold"
                    >
                      {silos.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name} ({s.currentStockMT.toLocaleString()} MT available)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-[#1a1c1c]">Release Quantity (Metric Tonnes)</label>
                    <span className="font-mono font-bold text-[#012d1d] bg-[#f3f3f3] px-2 py-0.5 rounded">
                      {releaseQuantityMT.toLocaleString()} MT ({Math.round(releaseQuantityMT * 10)} Bags)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="35000"
                    step="2500"
                    value={releaseQuantityMT}
                    onChange={(e) => setReleaseQuantityMT(Number(e.target.value))}
                    className="w-full accent-[#012d1d]"
                  />
                  <div className="flex justify-between text-[10px] text-[#717973] font-mono">
                    <span>5,000 MT (Targeted relief)</span>
                    <span>20,000 MT (Zone price cooling)</span>
                    <span>35,000 MT (National market shock absorber)</span>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#1a1c1c] mb-1">Destination Deficit Zone / Market Belt</label>
                  <select
                    value={targetZone}
                    onChange={(e) => setTargetZone(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-[#717973] bg-white font-bold"
                  >
                    <option value="South West Urban Centers (Lagos, Ibadan)">
                      South West Urban Centers (Lagos, Ibadan) — High Consumer Deficit
                    </option>
                    <option value="South East Agro Terminals (Onitsha, Aba)">
                      South East Agro Terminals (Onitsha, Aba) — Commercial Cluster
                    </option>
                    <option value="North East Relief Corridors (Maiduguri, Damaturu)">
                      North East Relief Corridors (Maiduguri, Damaturu) — Targeted Humanitarian
                    </option>
                  </select>
                </div>

                {/* Simulated Outcome Card */}
                <div className="p-4 bg-[#f3f3f3] rounded-xl border border-[#c1c8c2] space-y-2">
                  <span className="font-bold text-[#012d1d] uppercase tracking-wider text-[10px] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-[#059669]">insights</span>
                    Predicted Macroeconomic Impact
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-white rounded border border-[#e2e2e2]">
                      <div className="text-[10px] text-[#717973]">Open Market Price</div>
                      <div className="text-sm font-black text-[#059669]">-8.5%</div>
                      <div className="text-[9px] text-[#717973]">₦32k ➔ ₦29.3k/bag</div>
                    </div>
                    <div className="p-2 bg-white rounded border border-[#e2e2e2]">
                      <div className="text-[10px] text-[#717973]">Silo Capacity Left</div>
                      <div className="text-sm font-black text-[#012d1d]">
                        {(silos.find((s) => s.name === simulatedSilo)?.currentStockMT || 84200) - releaseQuantityMT} MT
                      </div>
                      <div className="text-[9px] text-[#717973]">Safe reserve buffer</div>
                    </div>
                    <div className="p-2 bg-white rounded border border-[#e2e2e2]">
                      <div className="text-[10px] text-[#717973]">Trucks Required</div>
                      <div className="text-sm font-black text-[#0284c7]">
                        {Math.ceil(releaseQuantityMT / 30)} Fleets
                      </div>
                      <div className="text-[9px] text-[#717973]">30-Ton Flatbeds</div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsDecisionModalOpen(false)}
                    className="px-4 py-2 bg-[#f3f3f3] hover:bg-[#e2e2e2] text-[#414844] font-bold rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleExecuteIntervention}
                    className="px-5 py-2.5 bg-[#012d1d] hover:bg-[#1b4332] text-white font-bold rounded-xl flex items-center gap-2 shadow-md cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                    <span>Issue Ministerial Execution Order</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: Official Ministerial Situation Brief (Executive Printable Report) */}
      {isBriefModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-8 shadow-2xl border border-[#c1c8c2] space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Header with Coat of Arms Styling */}
            <div className="flex justify-between items-start pb-4 border-b-2 border-[#012d1d]">
              <div>
                <div className="text-[10px] font-black text-[#ba1a1a] tracking-widest uppercase">
                  CONFIDENTIAL • FOR REGULATORY BODIES & EXECUTIVE DECISION MAKERS ONLY
                </div>
                <h2 className="font-heading font-black text-2xl text-[#012d1d] mt-1">
                  Federal Republic of Nigeria
                </h2>
                <div className="text-xs font-bold text-[#414844]">
                  Federal Ministry of Agriculture & Food Security • Bank of Agriculture
                </div>
                <div className="text-[11px] font-mono text-[#717973] mt-0.5">
                  Agro-Chain Intelligence Surveillance Brief • Ref: FMAFS/NAT-OBS/2025-Q1
                </div>
              </div>

              <button
                onClick={() => setIsBriefModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f3f3f3] text-[#414844] hover:bg-[#e2e2e2] flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Document Content */}
            <div className="space-y-4 text-xs text-[#1a1c1c] leading-relaxed">
              <div className="p-3 bg-[#f9f9f9] rounded-xl border border-[#e2e2e2] grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                <div>
                  <span className="text-[#717973] block text-[9px]">SURVEILLANCE DATE:</span>
                  <strong>{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                </div>
                <div>
                  <span className="text-[#717973] block text-[9px]">PARTICIPANTS RECORDED:</span>
                  <strong>146,912 Verified Actors</strong>
                </div>
                <div>
                  <span className="text-[#717973] block text-[9px]">TOTAL STOCKS (SGR):</span>
                  <strong>{(totalSiloStock / 1000).toFixed(1)}k MT (8 Silos)</strong>
                </div>
                <div>
                  <span className="text-[#717973] block text-[9px]">NATIONAL BUFFER MARGIN:</span>
                  <strong className="text-[#059669]">{nationalBufferDays} Days Security</strong>
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="font-heading font-black text-sm text-[#012d1d] uppercase">
                  1. Executive Summary & Market Findings
                </h4>
                <p>
                  Agricultural commodity prices across all six geopolitical zones are currently operating within the designated fair price corridors established by the Bank of Agriculture and FMAFS. Dry yellow maize is trading at an average of ₦32,000 per 100kg bag (6.8% below the anti-hoarding regulatory ceiling). No systemic artificial shortages have been detected across grain aggregation corridors.
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-heading font-black text-sm text-[#012d1d] uppercase">
                  2. Logistics, Waybills & Checkpoint Exemption
                </h4>
                <p>
                  1,483 digital waybills are actively tracked via satellite telemetry. Inter-state transit times between the North Central food basket and South West consumption terminals have reduced from 4.8 days to 1.9 days due to the integration of NAQS digital quarantine waivers.
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-heading font-black text-sm text-[#012d1d] uppercase">
                  3. Key Regulatory Recommendations for Decision Makers
                </h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Maintain SGR Buffer Stocks:</strong> Sustain current stock retention above 70 days national supply through Q2 pre-planting season.
                  </li>
                  <li>
                    <strong>Phase 2 Subsidized Voucher Allocation:</strong> Direct remaining 117,590 NPK fertilizer e-vouchers specifically to southern cassava and rice clusters.
                  </li>
                  <li>
                    <strong>Enforce Anti-Gouging Monitoring:</strong> NCX price monitors should continue daily spot-checks at Dawanau (Kano) and Bodija (Ibadan) wholesale markets.
                  </li>
                </ul>
              </div>

              {/* Signature Block */}
              <div className="pt-4 border-t border-[#e2e2e2] flex justify-between items-end">
                <div>
                  <div className="w-32 h-10 border-b border-[#012d1d] flex items-end font-serif italic text-sm text-[#012d1d]">
                    Dr. Chidi Okafor
                  </div>
                  <div className="text-[10px] font-bold text-[#012d1d] mt-1">Director of Agricultural Statistics</div>
                  <div className="text-[9px] text-[#717973]">Federal Ministry of Agriculture & Food Security</div>
                </div>

                <div className="text-right">
                  <div className="inline-block p-2 border-2 border-dashed border-[#10b981] rounded-lg text-center font-mono text-[9px] text-[#002114] bg-[#e7f5e8]">
                    <div className="font-bold">SEAL OF AUTHENTICITY</div>
                    <div>USUCO AGRO-CONNECT CLOUD</div>
                    <div>ID: NG-FMAFS-9982</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#e2e2e2]">
              <button
                type="button"
                onClick={() => setIsBriefModalOpen(false)}
                className="px-4 py-2 bg-[#f3f3f3] hover:bg-[#e2e2e2] text-[#414844] font-bold text-xs rounded-xl cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  alert('Ministerial Executive Situation Brief prepared for printing / PDF export!');
                }}
                className="px-5 py-2 bg-[#012d1d] hover:bg-[#1b4332] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">print</span>
                <span>Print Official Brief (PDF)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Silo Facility Detailed Inspector */}
      {selectedSiloDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#c1c8c2] space-y-4">
            <div className="flex justify-between items-start pb-2 border-b border-[#e2e2e2]">
              <div>
                <h3 className="font-heading font-black text-lg text-[#012d1d]">
                  {selectedSiloDetail.name}
                </h3>
                <p className="text-xs text-[#717973]">{selectedSiloDetail.state} • {selectedSiloDetail.zone}</p>
              </div>
              <button
                onClick={() => setSelectedSiloDetail(null)}
                className="w-7 h-7 rounded-full bg-[#f3f3f3] text-[#414844] hover:bg-[#e2e2e2] flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2.5 bg-[#f9f9f9] rounded-xl border border-[#e2e2e2]">
                  <span className="text-[10px] text-[#717973] block">Current Stored</span>
                  <span className="font-black text-base text-[#012d1d]">
                    {selectedSiloDetail.currentStockMT.toLocaleString()} MT
                  </span>
                </div>
                <div className="p-2.5 bg-[#f9f9f9] rounded-xl border border-[#e2e2e2]">
                  <span className="text-[10px] text-[#717973] block">Total Capacity</span>
                  <span className="font-black text-base text-[#414844]">
                    {selectedSiloDetail.capacityMT.toLocaleString()} MT
                  </span>
                </div>
              </div>

              <div className="p-3 bg-[#e7f5e8] rounded-xl border border-[#c1ecd4] space-y-1.5">
                <div className="flex justify-between font-bold text-[#002114]">
                  <span>Grain Quality & Storage Health:</span>
                  <span className="text-[#059669]">GRADE A CERTIFIED</span>
                </div>
                <div className="flex justify-between text-[11px] text-[#414844]">
                  <span>Moisture Content:</span>
                  <strong>{selectedSiloDetail.moisturePercent}% (Optimal &lt;13%)</strong>
                </div>
                <div className="flex justify-between text-[11px] text-[#414844]">
                  <span>Core Aeration Temp:</span>
                  <strong>{selectedSiloDetail.tempCelsius}°C</strong>
                </div>
                <div className="flex justify-between text-[11px] text-[#414844]">
                  <span>NAQS Certification:</span>
                  <strong>{selectedSiloDetail.lastInspection}</strong>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedSiloDetail(null)}
                  className="px-4 py-2 bg-[#012d1d] text-white font-bold rounded-xl text-xs"
                >
                  Close Silo Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
