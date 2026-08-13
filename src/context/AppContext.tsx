import React, { createContext, useContext, useState } from 'react';
import {
  Listing,
  Order,
  Transaction,
  LoanApplication,
  BroadcastMessage,
  AuditLog,
  User,
  Language,
  MarketPrice,
  WeatherInfo,
  UserRole,
} from '../types';
import {
  INITIAL_LISTINGS,
  INITIAL_ORDERS,
  INITIAL_TRANSACTIONS,
  INITIAL_LOANS,
  BROADCAST_MESSAGES,
  INITIAL_AUDIT_LOGS,
  INITIAL_USERS,
  MARKET_PRICES,
  WEATHER_DATA,
} from '../data/mockData';

interface AppContextType {
  listings: Listing[];
  addListing: (listing: Omit<Listing, 'id' | 'createdAt' | 'rating'>) => void;
  createListing: (listing: Omit<Listing, 'id' | 'createdAt' | 'rating'>) => void;
  orders: Order[];
  createOrder: (listingId: string, quantity: number, buyer: User) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  transactions: Transaction[];
  walletTransactions: Transaction[];
  walletBalance: number;
  addTransaction: (tx: Omit<Transaction, 'id' | 'timestamp' | 'reference'>) => void;
  loans: LoanApplication[];
  applyForLoan: (loanData: Omit<LoanApplication, 'id' | 'createdAt' | 'status'>) => void;
  applyLoan: (loanData: Omit<LoanApplication, 'id' | 'createdAt' | 'status'>) => void;
  updateLoanStatus: (loanId: string, status: LoanApplication['status']) => void;
  broadcasts: BroadcastMessage[];
  addBroadcast: (bc: Omit<BroadcastMessage, 'id' | 'createdAt'>) => void;
  auditLogs: AuditLog[];
  addAuditLog: (actorName: string, actorRole: UserRole, action: string, details: string) => void;
  usersList: User[];
  updateUserStatus: (userId: string, updates: Partial<User>) => void;
  deleteUser: (userId: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  lowBandwidthMode: boolean;
  isDataSaver: boolean;
  toggleLowBandwidthMode: () => void;
  toggleDataSaver: () => void;
  marketPrices: MarketPrice[];
  weatherData: WeatherInfo[];
  weather: WeatherInfo;
  pestAlerts: any[];
  extensionGuides: any[];
  activeView: string;
  setActiveView: (view: string) => void;
  selectedStateFilter: string;
  setSelectedStateFilter: (state: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [listings, setListings] = useState<Listing[]>(INITIAL_LISTINGS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [loans, setLoans] = useState<LoanApplication[]>(INITIAL_LOANS);
  const [broadcasts, setBroadcasts] = useState<BroadcastMessage[]>(BROADCAST_MESSAGES);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [usersList, setUsersList] = useState<User[]>(INITIAL_USERS);
  const [language, setLanguage] = useState<Language>('en');
  const [lowBandwidthMode, setLowBandwidthMode] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<string>('splash');
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>('All States');

  const addListing = (listingData: Omit<Listing, 'id' | 'createdAt' | 'rating'>) => {
    const newListing: Listing = {
      ...listingData,
      id: `lst_${Date.now()}`,
      createdAt: new Date().toISOString(),
      rating: 5.0,
    };
    setListings((prev) => [newListing, ...prev]);
    addAuditLog(listingData.sellerName, listingData.sellerRole, 'CREATE_LISTING', `Created listing ${newListing.title}`);
  };

  const createOrder = (listingId: string, quantity: number, buyer: User) => {
    const listing = listings.find((l) => l.id === listingId);
    if (!listing) return;

    const totalPrice = listing.price * quantity;
    const newOrder: Order = {
      id: `ord_${Date.now().toString().slice(-4)}`,
      listingId,
      cropTitle: listing.title,
      imageUrl: listing.imageUrl,
      buyerId: buyer.id,
      buyerName: buyer.name,
      sellerId: listing.sellerId,
      sellerName: listing.sellerName,
      quantity,
      unit: listing.unit,
      unitPrice: listing.price,
      totalPrice,
      status: 'pending',
      trackingCode: `TRK-NG-${Math.floor(1000 + Math.random() * 9000)}`,
      originState: listing.locationState,
      destinationState: buyer.state || 'Lagos State',
      createdAt: new Date().toISOString(),
      estimatedDeliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Update listing available quantity
    setListings((prev) =>
      prev.map((l) =>
        l.id === listingId
          ? { ...l, availableQuantity: Math.max(0, l.availableQuantity - quantity) }
          : l
      )
    );

    // Record escrow hold transaction
    addTransaction({
      userId: buyer.id,
      type: 'escrow_hold',
      amount: totalPrice,
      description: `Escrow hold for Order #${newOrder.id} - ${listing.title}`,
      category: 'Produce Sale',
      status: 'pending',
    });

    addAuditLog(buyer.name, buyer.role, 'CREATE_ORDER', `Created order #${newOrder.id} for ₦${totalPrice.toLocaleString()}`);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      if (status === 'completed' || status === 'delivered') {
        // Release Escrow to Seller
        addTransaction({
          userId: order.sellerId,
          type: 'escrow_release',
          amount: order.totalPrice,
          description: `Escrow payment released for Order #${order.id}`,
          category: 'Produce Sale',
          status: 'completed',
        });
      }
      addAuditLog('System / User', 'gov_admin', 'UPDATE_ORDER', `Order #${orderId} status changed to ${status}`);
    }
  };

  const addTransaction = (txData: Omit<Transaction, 'id' | 'timestamp' | 'reference'>) => {
    const newTx: Transaction = {
      ...txData,
      id: `tx_${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      reference: `REF-${Math.floor(100000 + Math.random() * 900000)}`,
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const applyForLoan = (loanData: Omit<LoanApplication, 'id' | 'createdAt' | 'status'>) => {
    const newLoan: LoanApplication = {
      ...loanData,
      id: `loan_${Date.now().toString().slice(-4)}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setLoans((prev) => [newLoan, ...prev]);
    addAuditLog(loanData.applicantName, loanData.applicantRole, 'APPLY_LOAN', `Applied for credit of ₦${loanData.amount.toLocaleString()}`);
  };

  const updateLoanStatus = (loanId: string, status: LoanApplication['status']) => {
    setLoans((prev) =>
      prev.map((l) => (l.id === loanId ? { ...l, status } : l))
    );
    const loan = loans.find((l) => l.id === loanId);
    if (loan) {
      addAuditLog('Credit Committee', 'institutional_admin', 'LOAN_DECISION', `Loan #${loanId} set to ${status}`);
    }
  };

  const addBroadcast = (bcData: Omit<BroadcastMessage, 'id' | 'createdAt'>) => {
    const newBc: BroadcastMessage = {
      ...bcData,
      id: `bc_${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
    };
    setBroadcasts((prev) => [newBc, ...prev]);
    addAuditLog(bcData.senderName, 'gov_admin', 'BROADCAST_MESSAGE', `Sent broadcast: ${bcData.title}`);
  };

  const addAuditLog = (actorName: string, actorRole: UserRole, action: string, details: string) => {
    const newLog: AuditLog = {
      id: `log_${Date.now().toString().slice(-4)}`,
      actorName,
      actorRole,
      action,
      details,
      timestamp: new Date().toISOString(),
      ipAddress: '102.89.44.12',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const updateUserStatus = (userId: string, updates: Partial<User>) => {
    setUsersList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...updates } : u))
    );
    addAuditLog('Admin', 'super_admin', 'UPDATE_USER', `Updated user ${userId}`);
  };

  const deleteUser = (userId: string) => {
    setUsersList((prev) => prev.filter((u) => u.id !== userId));
    addAuditLog('Super Admin', 'super_admin', 'DELETE_USER', `Deleted user ${userId}`);
  };

  const toggleLowBandwidthMode = () => {
    setLowBandwidthMode((prev) => !prev);
  };

  const PEST_ALERTS = [
    { id: 'pa_1', title: 'Fall Armyworm Advisory', crop: 'Maize & Sorghum', threatLevel: 'High', state: 'Kaduna, Kano', description: 'Early leaf damage reported. Apply recommended bio-pesticide early morning.' },
    { id: 'pa_2', title: 'Cassava Mosaic Virus Warning', crop: 'Cassava', threatLevel: 'Medium', state: 'Ogun, Oyo', description: 'Monitor clean planting stem cuttings from certified FMFS suppliers.' }
  ];

  const EXTENSION_GUIDES = [
    { id: 'eg_1', title: 'Climate-Smart Irrigation for Dry Season Tomatoes', category: 'Water Management', readTime: '5 min' },
    { id: 'eg_2', title: 'Optimal Grain Storage & Aflatoxin Control Guidelines', category: 'Post-Harvest', readTime: '8 min' },
    { id: 'eg_3', title: 'Soil Conditioning & Organic Fertilizer Blending', category: 'Soil Health', readTime: '6 min' }
  ];

  const walletBalance = 4500000;

  return (
    <AppContext.Provider
      value={{
        listings,
        addListing,
        createListing: addListing,
        orders,
        createOrder,
        updateOrderStatus,
        transactions,
        walletTransactions: transactions,
        walletBalance,
        addTransaction,
        loans,
        applyForLoan,
        applyLoan: applyForLoan,
        updateLoanStatus,
        broadcasts,
        addBroadcast,
        auditLogs,
        addAuditLog,
        usersList,
        updateUserStatus,
        deleteUser,
        language,
        setLanguage,
        lowBandwidthMode,
        isDataSaver: lowBandwidthMode,
        toggleLowBandwidthMode,
        toggleDataSaver: toggleLowBandwidthMode,
        marketPrices: MARKET_PRICES,
        weatherData: WEATHER_DATA,
        weather: WEATHER_DATA[0],
        pestAlerts: PEST_ALERTS,
        extensionGuides: EXTENSION_GUIDES,
        activeView,
        setActiveView,
        selectedStateFilter,
        setSelectedStateFilter,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
