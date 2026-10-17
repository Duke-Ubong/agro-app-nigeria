import { FarmPlot, FarmerDeliveryPass, NigerianBank } from '../types';

export const INITIAL_FARM_PLOTS: FarmPlot[] = [
  {
    id: 'plot_001',
    farmerId: 'usr_farmer_01',
    name: 'Main Valley Field - Block A',
    locationLGA: 'Abeokuta North',
    state: 'Ogun',
    hectares: 3.2,
    crop: 'White Maize',
    variety: 'SAMMAZ 15 High-Yield',
    plantingDate: '2026-05-18',
    expectedHarvestDate: '2026-09-10',
    growthStage: 'Vegetative',
    healthStatus: 'Excellent',
    soilType: 'Rich Loamy Sand',
    expectedYieldMT: 12.8,
    expectedYieldBags: 256,
    notes: 'Base NPK 15-15-15 applied at planting. 2nd urea side-dressing scheduled in 10 days.',
  },
  {
    id: 'plot_002',
    farmerId: 'usr_farmer_01',
    name: 'East Ridge Outpost',
    locationLGA: 'Odeda',
    state: 'Ogun',
    hectares: 1.8,
    crop: 'Soya Beans',
    variety: 'TGX 1448-2E (Inoculated)',
    plantingDate: '2026-06-02',
    expectedHarvestDate: '2026-09-25',
    growthStage: 'Flowering',
    healthStatus: 'Good',
    soilType: 'Sandy Loam',
    expectedYieldMT: 4.5,
    expectedYieldBags: 90,
    notes: 'Rhizobium nodulation verified. Pod formation stage looking strong.',
  },
  {
    id: 'plot_003',
    farmerId: 'usr_farmer_01',
    name: 'Bomo Lowland Extension',
    locationLGA: 'Abeokuta North',
    state: 'Ogun',
    hectares: 2.0,
    crop: 'Sorghum',
    variety: 'KSV 8 White Grain',
    plantingDate: '2026-06-20',
    expectedHarvestDate: '2026-10-15',
    growthStage: 'Planting',
    healthStatus: 'Good',
    soilType: 'Clay Loam',
    expectedYieldMT: 6.0,
    expectedYieldBags: 120,
    notes: 'Bed harrowing completed. Pre-emergence herbicide applied.',
  },
];

export const INITIAL_DELIVERY_PASSES: FarmerDeliveryPass[] = [
  {
    id: 'pass_001',
    passCode: 'DP-83921',
    farmerId: 'usr_farmer_01',
    farmerName: 'Babatunde Adeleke',
    cooperativeName: 'Dawanau Grains Farmers Cooperative',
    warehouseLocation: 'Abeokuta Agro Hub Silo Depot',
    crop: 'White Maize',
    estimatedBags: 140,
    estimatedWeightMT: 7.0,
    deliveryDate: '2026-10-18',
    transporterName: 'Alhaji Musa Haulage',
    vehiclePlateNumber: 'KRD-442-XA',
    status: 'scheduled',
    createdAt: '2026-10-12T08:30:00Z',
  },
  {
    id: 'pass_002',
    passCode: 'DP-71042',
    farmerId: 'usr_farmer_01',
    farmerName: 'Babatunde Adeleke',
    cooperativeName: 'Dawanau Grains Farmers Cooperative',
    warehouseLocation: 'Abeokuta Agro Hub Silo Depot',
    crop: 'Soya Beans',
    estimatedBags: 60,
    estimatedWeightMT: 3.0,
    deliveryDate: '2026-10-14',
    transporterName: 'Self (Tractor Trailer)',
    vehiclePlateNumber: 'OG-881-AB',
    status: 'arrived_at_gate',
    createdAt: '2026-10-13T11:15:00Z',
  },
];

export const NIGERIAN_BANKS: NigerianBank[] = [
  { code: '058', name: 'Guaranty Trust Bank (GTBank)' },
  { code: '057', name: 'Zenith Bank PLC' },
  { code: '044', name: 'Access Bank PLC' },
  { code: '011', name: 'First Bank of Nigeria' },
  { code: '033', name: 'United Bank for Africa (UBA)' },
  { code: '221', name: 'Stanbic IBTC Bank' },
  { code: '035', name: 'Wema Bank PLC' },
  { code: '50211', name: 'Kuda Microfinance Bank' },
  { code: '50515', name: 'Moniepoint MFB' },
  { code: '999992', name: 'OPay Digital Services' },
];

export interface PestAlert {
  id: string;
  threatName: string;
  severity: 'High' | 'Medium' | 'Low';
  affectedCrops: string[];
  zones: string[];
  symptoms: string;
  recommendedAction: string;
  dateReported: string;
}

export const ACTIVE_PEST_ALERTS: PestAlert[] = [
  {
    id: 'pest_01',
    threatName: 'Fall Armyworm (Spodoptera frugiperda)',
    severity: 'High',
    affectedCrops: ['Maize', 'Sorghum'],
    zones: ['Ogun', 'Oyo', 'Kwara', 'Kaduna'],
    symptoms: 'Window pane leaf damage, ragged whorl holes with sawdust-like frass.',
    recommendedAction: 'Spray Emamectin benzoate (50g/Ha) early morning into whorls. Avoid overhead irrigation during treatment.',
    dateReported: '2026-10-11',
  },
  {
    id: 'pest_02',
    threatName: 'Soybean Rust (Phakopsora pachyrhizi)',
    severity: 'Medium',
    affectedCrops: ['Soya Beans'],
    zones: ['Benue', 'Ogun', 'Plateau'],
    symptoms: 'Tiny brown lesions on lower leaf surfaces turning into tan pustules.',
    recommendedAction: 'Apply Triazole or Strobilurin fungicide before flowering canopy closure.',
    dateReported: '2026-10-09',
  },
];
