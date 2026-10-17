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
  CooperativeMember,
  WarehouseIntake,
  BulkInputCampaign,
  OfftakerContract,
  MemberLoanRecord,
  FarmPlot,
  CropGrowthStage,
  FarmerDeliveryPass,
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
import {
  INITIAL_COOP_MEMBERS,
  INITIAL_WAREHOUSE_INTAKES,
  INITIAL_BULK_CAMPAIGNS,
  INITIAL_OFFTAKER_CONTRACTS,
  INITIAL_MEMBER_LOANS,
} from '../data/cooperativeData';
import {
  INITIAL_FARM_PLOTS,
  INITIAL_DELIVERY_PASSES,
} from '../data/farmerData';

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

  // Cooperative Operations
  coopMembers: CooperativeMember[];
  addCoopMember: (member: Omit<CooperativeMember, 'id' | 'joinedDate'>) => void;
  updateCoopMember: (id: string, updates: Partial<CooperativeMember>) => void;
  warehouseIntakes: WarehouseIntake[];
  logWarehouseIntake: (intake: Omit<WarehouseIntake, 'id' | 'receiptNumber' | 'timestamp'>) => WarehouseIntake;
  bulkInputCampaigns: BulkInputCampaign[];
  createBulkInputCampaign: (campaign: Omit<BulkInputCampaign, 'id'>) => void;
  joinBulkInputCampaign: (campaignId: string, memberId: string, quantity: number, paymentMethod: 'paid_cash' | 'financed_on_credit') => void;
  markBulkInputDistributed: (campaignId: string, memberId: string) => void;
  offtakerContracts: OfftakerContract[];
  updateContractProgress: (contractId: string, additionalMT: number) => void;
  memberLoans: MemberLoanRecord[];
  recordLoanRepayment: (loanId: string, amount: number) => void;

  // Smallholder Farmer Operations
  farmPlots: FarmPlot[];
  addFarmPlot: (plot: Omit<FarmPlot, 'id'>) => void;
  updateFarmPlotStage: (plotId: string, stage: CropGrowthStage) => void;
  farmerDeliveryPasses: FarmerDeliveryPass[];
  createDeliveryPass: (pass: Omit<FarmerDeliveryPass, 'id' | 'passCode' | 'createdAt' | 'status'>) => FarmerDeliveryPass;
  orderBulkInputForFarmer: (campaignId: string, units: number, paymentMethod: 'cash' | 'credit') => void;
  withdrawFromWallet: (amountNaira: number, bankCode: string, bankName: string, accountNumber: string, accountName: string) => boolean;
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
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>('All States');

  // Cooperative Operation State
  const [coopMembers, setCoopMembers] = useState<CooperativeMember[]>(INITIAL_COOP_MEMBERS);
  const [warehouseIntakes, setWarehouseIntakes] = useState<WarehouseIntake[]>(INITIAL_WAREHOUSE_INTAKES);
  const [bulkInputCampaigns, setBulkInputCampaigns] = useState<BulkInputCampaign[]>(INITIAL_BULK_CAMPAIGNS);
  const [offtakerContracts, setOfftakerContracts] = useState<OfftakerContract[]>(INITIAL_OFFTAKER_CONTRACTS);
  const [memberLoans, setMemberLoans] = useState<MemberLoanRecord[]>(INITIAL_MEMBER_LOANS);

  // Smallholder Farmer State
  const [farmPlots, setFarmPlots] = useState<FarmPlot[]>(INITIAL_FARM_PLOTS);
  const [farmerDeliveryPasses, setFarmerDeliveryPasses] = useState<FarmerDeliveryPass[]>(INITIAL_DELIVERY_PASSES);
  const [farmerWalletBalance, setFarmerWalletBalance] = useState<number>(3850000);

  const addCoopMember = (memberData: Omit<CooperativeMember, 'id' | 'joinedDate'>) => {
    const newMember: CooperativeMember = {
      ...memberData,
      id: `mem_${Date.now().toString().slice(-4)}`,
      joinedDate: new Date().toISOString().split('T')[0],
    };
    setCoopMembers((prev) => [newMember, ...prev]);
    addAuditLog('Cooperative Manager', 'cooperative', 'ENROLL_MEMBER', `Enrolled member farmer ${newMember.name} in ${newMember.cluster}`);
  };

  const updateCoopMember = (id: string, updates: Partial<CooperativeMember>) => {
    setCoopMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
    addAuditLog('Cooperative Manager', 'cooperative', 'UPDATE_MEMBER', `Updated member record ${id}`);
  };

  const logWarehouseIntake = (intakeData: Omit<WarehouseIntake, 'id' | 'receiptNumber' | 'timestamp'>) => {
    const newIntake: WarehouseIntake = {
      ...intakeData,
      id: `intk_${Date.now().toString().slice(-4)}`,
      receiptNumber: `WHR-OG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
    };
    setWarehouseIntakes((prev) => [newIntake, ...prev]);
    
    // Update member aggregated MT and adjust loan balance if harvest deduction applied
    setCoopMembers((prev) =>
      prev.map((m) =>
        m.id === intakeData.farmerId
          ? {
              ...m,
              totalAggregatedMT: Number((m.totalAggregatedMT + intakeData.netWeightMT).toFixed(2)),
              loanBalanceNaira: Math.max(0, m.loanBalanceNaira - intakeData.harvestDeductionNaira),
            }
          : m
      )
    );

    // If harvest deduction applied, update member loan records
    if (intakeData.harvestDeductionNaira > 0) {
      setMemberLoans((prev) =>
        prev.map((l) => {
          if (l.memberId === intakeData.farmerId && l.outstandingBalanceNaira > 0) {
            const deduction = Math.min(l.outstandingBalanceNaira, intakeData.harvestDeductionNaira);
            const newBal = l.outstandingBalanceNaira - deduction;
            return {
              ...l,
              amountRepaidNaira: l.amountRepaidNaira + deduction,
              outstandingBalanceNaira: newBal,
              status: newBal <= 0 ? 'fully_repaid' : 'partially_repaid',
            };
          }
          return l;
        })
      );
    }

    addAuditLog(
      'Weighbridge Grader',
      'cooperative',
      'LOG_INTAKE',
      `Logged ${intakeData.netWeightMT} MT of ${intakeData.crop} (${intakeData.qualityGrade}) for ${intakeData.farmerName}`
    );

    return newIntake;
  };

  const createBulkInputCampaign = (campaignData: Omit<BulkInputCampaign, 'id'>) => {
    const newCampaign: BulkInputCampaign = {
      ...campaignData,
      id: `bulk_${Date.now().toString().slice(-4)}`,
    };
    setBulkInputCampaigns((prev) => [newCampaign, ...prev]);
    addAuditLog('Cooperative Admin', 'cooperative', 'CREATE_BULK_CAMPAIGN', `Created bulk input pool: ${newCampaign.title}`);
  };

  const joinBulkInputCampaign = (
    campaignId: string,
    memberId: string,
    quantity: number,
    paymentMethod: 'paid_cash' | 'financed_on_credit'
  ) => {
    const member = coopMembers.find((m) => m.id === memberId);
    if (!member) return;

    setBulkInputCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === campaignId) {
          const existing = c.participatingMembers.find((pm) => pm.memberId === memberId);
          let updatedMembers = [];
          if (existing) {
            updatedMembers = c.participatingMembers.map((pm) =>
              pm.memberId === memberId
                ? { ...pm, unitsRequested: pm.unitsRequested + quantity, paymentStatus: paymentMethod }
                : pm
            );
          } else {
            updatedMembers = [
              ...c.participatingMembers,
              {
                memberId,
                memberName: member.name,
                unitsRequested: quantity,
                paymentStatus: paymentMethod,
                distributed: false,
              },
            ];
          }
          return {
            ...c,
            committedUnits: c.committedUnits + quantity,
            participatingMembers: updatedMembers,
          };
        }
        return c;
      })
    );

    if (paymentMethod === 'financed_on_credit') {
      const campaign = bulkInputCampaigns.find((c) => c.id === campaignId);
      const cost = (campaign?.groupDiscountPriceNaira || 30000) * quantity;
      setCoopMembers((prev) =>
        prev.map((m) =>
          m.id === memberId
            ? { ...m, loanBalanceNaira: m.loanBalanceNaira + cost }
            : m
        )
      );
    }

    addAuditLog('Cooperative Admin', 'cooperative', 'JOIN_BULK_INPUT', `${member.name} ordered ${quantity} units in campaign #${campaignId}`);
  };

  const markBulkInputDistributed = (campaignId: string, memberId: string) => {
    setBulkInputCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === campaignId) {
          const updated = c.participatingMembers.map((pm) =>
            pm.memberId === memberId ? { ...pm, distributed: true } : pm
          );
          const allDistributed = updated.every((pm) => pm.distributed);
          return {
            ...c,
            status: allDistributed ? 'distributed' : c.status,
            participatingMembers: updated,
          };
        }
        return c;
      })
    );
    addAuditLog('Warehouse Officer', 'cooperative', 'DISTRIBUTE_INPUT', `Handed over input allocation to member ${memberId}`);
  };

  const updateContractProgress = (contractId: string, additionalMT: number) => {
    setOfftakerContracts((prev) =>
      prev.map((ctr) => {
        if (ctr.id === contractId) {
          const updatedFulfilled = Math.min(ctr.targetVolumeMT, ctr.fulfilledVolumeMT + additionalMT);
          const isFulfilled = updatedFulfilled >= ctr.targetVolumeMT;
          return {
            ...ctr,
            fulfilledVolumeMT: updatedFulfilled,
            status: isFulfilled ? 'fulfilled' : 'in_fulfillment',
          };
        }
        return ctr;
      })
    );
    addAuditLog('Discretionary Haulage', 'cooperative', 'DISPATCH_OFFTAKER', `Dispatched ${additionalMT} MT against contract #${contractId}`);
  };

  const recordLoanRepayment = (loanId: string, amount: number) => {
    setMemberLoans((prev) =>
      prev.map((l) => {
        if (l.id === loanId) {
          const newOutstanding = Math.max(0, l.outstandingBalanceNaira - amount);
          return {
            ...l,
            amountRepaidNaira: l.amountRepaidNaira + amount,
            outstandingBalanceNaira: newOutstanding,
            status: newOutstanding === 0 ? 'fully_repaid' : 'partially_repaid',
          };
        }
        return l;
      })
    );
    addAuditLog('Treasury Officer', 'cooperative', 'LOAN_REPAYMENT', `Recorded loan repayment of ₦${amount.toLocaleString()} on loan #${loanId}`);
  };

  // Smallholder Farmer Operations
  const addFarmPlot = (plotData: Omit<FarmPlot, 'id'>) => {
    const newPlot: FarmPlot = {
      ...plotData,
      id: `plot_${Date.now()}`,
    };
    setFarmPlots((prev) => [newPlot, ...prev]);
    addAuditLog(plotData.farmerId, 'farmer', 'ADD_FARM_PLOT', `Logged field plot ${newPlot.name} (${newPlot.hectares} Ha of ${newPlot.crop})`);
  };

  const updateFarmPlotStage = (plotId: string, stage: CropGrowthStage) => {
    setFarmPlots((prev) =>
      prev.map((p) => (p.id === plotId ? { ...p, growthStage: stage } : p))
    );
    addAuditLog('Farmer', 'farmer', 'UPDATE_PLOT_STAGE', `Updated plot #${plotId} growth stage to ${stage}`);
  };

  const createDeliveryPass = (passData: Omit<FarmerDeliveryPass, 'id' | 'passCode' | 'createdAt' | 'status'>) => {
    const newPass: FarmerDeliveryPass = {
      ...passData,
      id: `pass_${Date.now()}`,
      passCode: `DP-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
    };
    setFarmerDeliveryPasses((prev) => [newPass, ...prev]);
    addAuditLog(passData.farmerName, 'farmer', 'CREATE_DELIVERY_PASS', `Created delivery pass ${newPass.passCode} for ${passData.estimatedBags} bags of ${passData.crop}`);
    return newPass;
  };

  const orderBulkInputForFarmer = (campaignId: string, units: number, paymentMethod: 'cash' | 'credit') => {
    const campaign = bulkInputCampaigns.find((c) => c.id === campaignId);
    if (!campaign) return;

    const totalCost = campaign.groupDiscountPriceNaira * units;
    const currentMember = coopMembers.find((m) => m.id === 'mem_001') || coopMembers[0];

    joinBulkInputCampaign(campaignId, currentMember.id, units, paymentMethod === 'cash' ? 'paid_cash' : 'financed_on_credit');

    if (paymentMethod === 'cash') {
      setFarmerWalletBalance((prev) => Math.max(0, prev - totalCost));
      addTransaction({
        userId: currentMember.id,
        type: 'debit',
        amount: totalCost,
        description: `Bulk input order: ${units} ${campaign.unit} of ${campaign.title}`,
        category: 'Input Purchase',
        status: 'completed',
      });
    } else {
      const newLoanRecord: MemberLoanRecord = {
        id: `loan_inp_${Date.now()}`,
        memberId: currentMember.id,
        memberName: currentMember.name,
        cluster: currentMember.cluster,
        cropSeason: '2026 Wet Season',
        loanType: 'Input Package (Fertilizer + Seeds)',
        amountGrantedNaira: totalCost,
        amountRepaidNaira: 0,
        outstandingBalanceNaira: totalCost,
        interestRatePercent: 0,
        disbursedDate: new Date().toISOString().split('T')[0],
        dueDate: '2026-11-30',
        status: 'active',
        harvestDeductionTonsCommitted: parseFloat((units * 0.1).toFixed(1)),
      };
      setMemberLoans((prev) => [newLoanRecord, ...prev]);
    }
  };

  const withdrawFromWallet = (amountNaira: number, bankCode: string, bankName: string, accountNumber: string, accountName: string): boolean => {
    if (amountNaira <= 0 || amountNaira > farmerWalletBalance) return false;

    setFarmerWalletBalance((prev) => prev - amountNaira);
    addTransaction({
      userId: 'usr_farmer_01',
      type: 'debit',
      amount: amountNaira,
      description: `NIBSS Instant Transfer to ${bankName} (${accountNumber}) - ${accountName}`,
      category: 'Withdrawal',
      status: 'completed',
    });
    addAuditLog(accountName, 'farmer', 'BANK_CASHOUT', `Withdrew ₦${amountNaira.toLocaleString()} to ${bankName} (${accountNumber})`);
    return true;
  };

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

  const walletBalance = farmerWalletBalance;

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

        // Cooperative Operations
        coopMembers,
        addCoopMember,
        updateCoopMember,
        warehouseIntakes,
        logWarehouseIntake,
        bulkInputCampaigns,
        createBulkInputCampaign,
        joinBulkInputCampaign,
        markBulkInputDistributed,
        offtakerContracts,
        updateContractProgress,
        memberLoans,
        recordLoanRepayment,

        // Smallholder Farmer Operations
        farmPlots,
        addFarmPlot,
        updateFarmPlotStage,
        farmerDeliveryPasses,
        createDeliveryPass,
        orderBulkInputForFarmer,
        withdrawFromWallet,
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
