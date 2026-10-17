export type UserRole =
  | 'farmer'
  | 'cooperative'
  | 'buyer'
  | 'supplier'
  | 'transporter'
  | 'institutional_admin'
  | 'gov_admin'
  | 'super_admin';

export type Language = 'en' | 'ha' | 'yo' | 'ig';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  state: string;
  lga?: string;
  address?: string;
  verificationStatus: 'verified' | 'pending' | 'unverified';
  companyName?: string;
  cacNumber?: string;
  nin?: string;
  photoUrl?: string;
  createdAt: string;
  // Specific role metadata
  cropTypes?: string[];
  farmSizeHectares?: number;
  memberCount?: number;
  vehicleType?: string;
  licensePlate?: string;
  businessType?: string;
  department?: string;
  employeeId?: string;
}

export interface Listing {
  id: string;
  title: string;
  cropType: string;
  category: 'Grains' | 'Tubers' | 'Vegetables' | 'Fruits' | 'Inputs' | 'Processed';
  price: number;
  unit: string;
  quantity: number;
  availableQuantity: number;
  minOrder: number;
  locationState: string;
  locationLga: string;
  sellerId: string;
  sellerName: string;
  sellerRole: UserRole;
  sellerVerified: boolean;
  imageUrl: string;
  rating: number;
  description: string;
  moistureContent?: string;
  grade?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  listingId: string;
  cropTitle: string;
  imageUrl: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  transporterId?: string;
  transporterName?: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  status: 'pending' | 'accepted' | 'in_transit' | 'delivered' | 'completed' | 'cancelled';
  trackingCode: string;
  originState: string;
  destinationState: string;
  createdAt: string;
  estimatedDeliveryDate: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'credit' | 'debit' | 'escrow_hold' | 'escrow_release';
  amount: number;
  description: string;
  category: 'Produce Sale' | 'Input Purchase' | 'Loan Disbursal' | 'Loan Repayment' | 'Freight Fee' | 'Wallet Top-up' | 'Withdrawal';
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  reference: string;
}

export interface Wallet {
  balance: number;
  escrowBalance: number;
  creditLineAvailable: number;
  totalCreditLine: number;
}

export interface LoanApplication {
  id: string;
  applicantId: string;
  applicantName: string;
  applicantRole: UserRole;
  applicantState: string;
  amount: number;
  durationMonths: number;
  purpose: string;
  collateral: string;
  status: 'pre_approved' | 'pending' | 'approved' | 'rejected';
  repaymentEstimate: number;
  interestRate: string;
  expectedRepaymentDate: string;
  createdAt: string;
}

export interface MarketPrice {
  id: string;
  crop: string;
  unit: string;
  priceNaira: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
  topState: string;
}

export interface WeatherInfo {
  state: string;
  tempCelsius: number;
  condition: string;
  humidityPercent: number;
  windSpeedKm: number;
  rainForecastPercent: number;
  advisoryText: string;
}

export interface BroadcastMessage {
  id: string;
  title: string;
  body: string;
  targetRole: 'all' | UserRole;
  targetState: string;
  senderName: string;
  createdAt: string;
  priority: 'info' | 'urgent' | 'critical';
}

export interface AuditLog {
  id: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}

// ==========================================
// REAL-WORLD COOPERATIVE DOMAIN TYPES
// ==========================================

export interface CooperativeMember {
  id: string;
  name: string;
  phone: string;
  cluster: string;
  lga: string;
  state: string;
  farmSizeHectares: number;
  primaryCrops: string[];
  nin: string;
  kycStatus: 'verified' | 'pending' | 'unverified';
  totalAggregatedMT: number;
  loanBalanceNaira: number;
  creditLimitNaira: number;
  joinedDate: string;
  bankName?: string;
  accountNumber?: string;
}

export type GrainGrade = 'Grade A (Export/Industrial)' | 'Grade B (Standard Commercial)' | 'Grade C (Feed/Discounted)';

export interface WarehouseIntake {
  id: string;
  receiptNumber: string;
  farmerId: string;
  farmerName: string;
  clusterName: string;
  crop: string;
  bagCount: number;
  bagSizeKg: number;
  grossWeightKg: number;
  tareWeightKg: number;
  netWeightKg: number;
  netWeightMT: number;
  moistureContent: number; // e.g. 12.4%
  foreignMatterPercent: number; // e.g. 1.2%
  qualityGrade: GrainGrade;
  storageBin: string; // e.g. "Silo Delta-03"
  warehouseLocation: string; // e.g. "Abeokuta Agro Hub Depot"
  intakeOfficer: string;
  pricePerKgCalculated: number;
  totalValuationNaira: number;
  harvestDeductionNaira: number;
  netPayableToFarmerNaira: number;
  timestamp: string;
  status: 'weighed' | 'verified_in_silo' | 'dispatched';
}

export interface BulkInputCampaign {
  id: string;
  title: string;
  category: 'Fertilizer' | 'Certified Seeds' | 'Crop Protection' | 'Farming Tools';
  supplierName: string;
  unit: string;
  retailMarketPriceNaira: number;
  groupDiscountPriceNaira: number;
  savingsPercentage: number;
  minimumTargetUnits: number;
  committedUnits: number;
  deadlineDate: string;
  deliveryEstimatedDate: string;
  status: 'pooling' | 'negotiating' | 'ordered' | 'arrived_at_depot' | 'distributed';
  description: string;
  specifications: string;
  participatingMembers: {
    memberId: string;
    memberName: string;
    unitsRequested: number;
    paymentStatus: 'paid_cash' | 'financed_on_credit' | 'pending';
    distributed: boolean;
  }[];
}

export interface OfftakerContract {
  id: string;
  contractNumber: string;
  buyerName: string;
  buyerCompany: string;
  buyerContact: string;
  crop: string;
  requiredGrade: string;
  targetVolumeMT: number;
  fulfilledVolumeMT: number;
  agreedPricePerMT: number;
  totalContractValueNaira: number;
  escrowStatus: '100% Escrow Secured' | '30% Advance Escrowed' | 'Disbursed';
  deliveryDeadline: string;
  destinationWarehouse: string;
  status: 'active' | 'in_fulfillment' | 'fulfilled' | 'pending_dispatch';
  notes: string;
}

export interface MemberLoanRecord {
  id: string;
  memberId: string;
  memberName: string;
  cluster: string;
  cropSeason: string;
  loanType: 'Input Package (Fertilizer + Seeds)' | 'Tractor Mechanization' | 'Cash Working Capital';
  amountGrantedNaira: number;
  amountRepaidNaira: number;
  outstandingBalanceNaira: number;
  interestRatePercent: number;
  disbursedDate: string;
  dueDate: string;
  status: 'active' | 'partially_repaid' | 'fully_repaid' | 'overdue';
  harvestDeductionTonsCommitted: number;
}

// ==========================================
// REAL-WORLD FARMER DOMAIN MODELS
// ==========================================

export type CropGrowthStage = 'Land Prep' | 'Planting' | 'Vegetative' | 'Flowering' | 'Maturity' | 'Harvesting' | 'Post-Harvest';

export interface FarmPlot {
  id: string;
  farmerId: string;
  name: string;
  locationLGA: string;
  state: string;
  hectares: number;
  crop: string;
  variety: string;
  plantingDate: string;
  expectedHarvestDate: string;
  growthStage: CropGrowthStage;
  healthStatus: 'Excellent' | 'Good' | 'Attention Needed' | 'Pest Risk';
  soilType: string;
  expectedYieldMT: number;
  expectedYieldBags: number;
  notes: string;
}

export interface FarmerDeliveryPass {
  id: string;
  passCode: string; // 6-digit or formatted code e.g. "DP-8302"
  farmerId: string;
  farmerName: string;
  cooperativeName: string;
  warehouseLocation: string;
  crop: string;
  estimatedBags: number;
  estimatedWeightMT: number;
  deliveryDate: string;
  transporterName?: string;
  vehiclePlateNumber?: string;
  status: 'scheduled' | 'arrived_at_gate' | 'weighed' | 'settled';
  receiptId?: string;
  createdAt: string;
}

export interface NigerianBank {
  code: string;
  name: string;
}


