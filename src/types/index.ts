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
  language?: string | Language;
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
  category?: 'Produce Sale' | 'Input Purchase' | 'Loan Disbursal' | 'Loan Repayment' | 'Freight Fee' | 'Wallet Top-up' | 'Withdrawal' | string;
  timestamp?: string;
  createdAt?: string;
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
  tenureMonths?: number;
  purpose: string;
  collateral: string;
  status: 'pre_approved' | 'pending' | 'approved' | 'rejected' | 'under_review';
  repaymentEstimate: number;
  interestRate: string;
  expectedRepaymentDate: string;
  createdAt: string;
  appliedAt?: string;
}

export interface MarketPrice {
  id: string;
  crop: string;
  cropTitle?: string;
  marketName?: string;
  unit: string;
  priceNaira: number;
  currentPrice?: number;
  changePercent: number;
  priceChange?: string | number;
  trend: 'up' | 'down' | 'stable';
  topState: string;
  state?: string;
}

export interface WeatherInfo {
  state: string;
  lga?: string;
  tempCelsius: number;
  temperatureC?: number;
  condition: string;
  humidityPercent: number;
  windSpeedKm: number;
  rainForecastPercent: number;
  rainProbability?: number;
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
