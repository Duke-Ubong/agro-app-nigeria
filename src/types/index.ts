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
