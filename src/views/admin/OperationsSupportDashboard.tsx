import React, { useState } from 'react';
import {
  Headphones,
  FileCheck,
  AlertTriangle,
  Scale,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Shield,
  MessageSquare,
  Eye,
  Send,
  Sliders,
  TrendingDown,
  FileText,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { AdminGlobalFilterBar, GlobalFilterState } from '../../components/admin/AdminGlobalFilterBar';
import { ReasonLoggingModal } from '../../components/admin/ReasonLoggingModal';

export const OperationsSupportDashboard: React.FC = () => {
  const { usersList, listings, orders, updateUserStatus, addAuditLog } = useApp();
  const { user } = useAuth();

  const [filters, setFilters] = useState<GlobalFilterState>({
    dateRange: 'last_7_days',
    state: 'All States',
    lga: 'All LGAs',
    valueChain: 'All Value Chains',
    commodity: 'All Commodities',
  });

  const [activeTab, setActiveTab] = useState<
    'tickets' | 'kyc_queue' | 'listing_moderation' | 'disputes' | 'issues_analytics' | 'user_lookup'
  >('tickets');

  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // 1. Support Tickets Queue
  const [tickets, setTickets] = useState([
    {
      id: 'TCK-8821',
      sender: 'Mallam Haruna Bello',
      role: 'Farmer',
      subject: 'USSD *384*247# voucher redemption error in Fagge LGA',
      priority: 'High',
      status: 'Open',
      slaMinutesLeft: 45,
      createdAt: '25 mins ago',
      category: 'Input Subsidy',
    },
    {
      id: 'TCK-8820',
      sender: 'Premium Flour Mills Ltd',
      role: 'Buyer',
      subject: 'Escrow payment debited but order #ORD-4491 shows pending',
      priority: 'Critical',
      status: 'In-Progress',
      slaMinutesLeft: 15,
      createdAt: '1 hour ago',
      category: 'Payments / Escrow',
    },
    {
      id: 'TCK-8819',
      sender: 'Kano Trans-Freight Logistics',
      role: 'Transporter',
      subject: 'Waybill electronic signature not uploading due to low 2G network',
      priority: 'Medium',
      status: 'Open',
      slaMinutesLeft: 120,
      createdAt: '3 hours ago',
      category: 'Logistics',
    },
  ]);

  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [ticketReplyText, setTicketReplyText] = useState<string>('');

  // 2. KYC Verification Queue
  const [kycQueue, setKycQueue] = useState([
    {
      id: 'kyc_1',
      userId: 'usr_201',
      name: 'Salisu Mohammed',
      role: 'Farmer',
      state: 'Kano',
      lga: 'Kura',
      documents: ['National Identity (NIN: 8941-2094-1182)', 'LGA Farmer Cooperative Letter'],
      submittedAt: 'Today, 08:30 AM',
      status: 'Pending Review',
    },
    {
      id: 'kyc_2',
      userId: 'usr_202',
      name: 'Golden Harvest Grains Ltd',
      role: 'Buyer',
      state: 'Lagos',
      lga: 'Ikeja',
      documents: ['Corporate Affairs Commission (RC: 1849201)', 'Tax Clearance (FIRS: 2025/TIN/8812)'],
      submittedAt: 'Today, 09:15 AM',
      status: 'Pending Review',
    },
  ]);

  // 3. Flagged Listings for Moderation
  const [flaggedListings, setFlaggedListings] = useState([
    {
      id: 'lst_mod_1',
      title: 'Bulk Yellow Maize (200 Bags)',
      seller: 'Aliyu Ibrahim',
      location: 'Zaria, Kaduna',
      price: '₦78,000 / bag',
      flagReason: 'Price is 45% above statutory GMP benchmark (Potential price-gouging)',
      status: 'Flagged',
    },
    {
      id: 'lst_mod_2',
      title: 'Paddy Rice Unmilled (100 Bags)',
      seller: 'Katsina Agro Hub',
      location: 'Funtua, Katsina',
      price: '₦62,000 / bag',
      flagReason: 'Reported moisture content > 16.0% (Exceeds 13.0% contract standard)',
      status: 'Flagged',
    },
  ]);

  // 4. Dispute Resolution Cases
  const [disputes, setDisputes] = useState([
    {
      id: 'DSP-401',
      orderId: 'ORD-9821',
      buyer: 'Crown Agro Mills (Lagos)',
      seller: 'Abebe Usman (Kaduna)',
      transporter: 'Ibrahim Haulage Ltd',
      amount: '₦3,600,000',
      reason: '15 bags torn during transit in rainy corridor; moisture damage reported on arrival',
      evidence: '3 Geo-tagged photographs and weighbridge moisture certificate attached',
      status: 'Under Arbitration',
    },
  ]);

  // 5. User Lookup State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserForInspection, setSelectedUserForInspection] = useState<any | null>(null);

  const handleResolveTicket = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: 'Resolved' } : t))
    );
    addAuditLog(
      user.name,
      user.role,
      'SUPPORT_TICKET_RESOLVE',
      `Support ticket ${ticketId} resolved with response: "${ticketReplyText || 'Issue resolved'}"`
    );
    setSelectedTicket(null);
    setTicketReplyText('');
    setActionSuccess(`Ticket ${ticketId} marked as Resolved.`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleApproveKyc = (kycId: string, name: string) => {
    setKycQueue((prev) => prev.filter((k) => k.id !== kycId));
    addAuditLog(
      user.name,
      user.role,
      'APPROVE_KYC',
      `Approved Tier-2 KYC for ${name} following document verification.`
    );
    setActionSuccess(`KYC for ${name} successfully Approved.`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleApproveListing = (listingId: string) => {
    setFlaggedListings((prev) => prev.filter((l) => l.id !== listingId));
    addAuditLog(
      user.name,
      user.role,
      'APPROVE_FLAGGED_LISTING',
      `Cleared flagged listing ${listingId} after compliance verification.`
    );
    setActionSuccess(`Listing ${listingId} approved and restored to marketplace.`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleRemoveListing = (listingId: string) => {
    setFlaggedListings((prev) => prev.filter((l) => l.id !== listingId));
    addAuditLog(
      user.name,
      user.role,
      'REMOVE_FLAGGED_LISTING',
      `Removed non-compliant produce listing ${listingId} from marketplace.`
    );
    setActionSuccess(`Listing ${listingId} removed from public marketplace.`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleArbitrateDispute = (disputeId: string, decision: string) => {
    setDisputes((prev) => prev.filter((d) => d.id !== disputeId));
    addAuditLog(
      user.name,
      user.role,
      'ARBITRATE_TRADE_DISPUTE',
      `Arbitrated dispute ${disputeId}: Decision = ${decision}`
    );
    setActionSuccess(`Dispute ${disputeId} arbitrated: ${decision}`);
    setTimeout(() => setActionSuccess(null), 5000);
  };

  return (
    <div className="space-y-6 font-body">
      {/* Global Filter Bar */}
      <AdminGlobalFilterBar
        filters={filters}
        onFilterChange={setFilters}
        roleTitle="Operations / Support Admin Desk"
        departmentTag="USUCO Support & Verification Desk"
        watermarkText="OFFICIAL OPERATIONS DESK • USUCO / FMAFS TICKET RECORD"
      />

      {/* Top Banner */}
      <div className="bg-[#0f766e] text-white p-5 rounded-2xl border border-[#115e59] shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-[#0284c7] text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
              Operations & Customer Protection
            </span>
            <span className="text-xs text-[#ccfbf1]">SLA Response Target: &lt; 60 mins</span>
          </div>
          <h2 className="font-heading font-bold text-xl text-white">
            Operations, KYC Verification & Dispute Arbitration Desk
          </h2>
          <p className="text-xs text-[#ccfbf1]">
            Active Farmer Support Queues, Escrow Holds, Produce Moderation & Drop-off Analytics
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#134e4a] p-1.5 rounded-xl border border-[#2dd4bf]/40">
          <span className="text-[11px] font-bold text-[#ccfbf1] px-2">Pending Action:</span>
          <span className="px-2.5 py-1 bg-[#2dd4bf] text-[#042f2e] rounded-lg text-xs font-bold">
            {tickets.filter((t) => t.status !== 'Resolved').length + kycQueue.length + flaggedListings.length} items
          </span>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3.5 bg-[#c1ecd4] text-[#002114] border border-[#276a4c]/40 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#002114]" />
            <span>{actionSuccess}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionSuccess(null)}
            className="text-xs underline hover:text-black"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="bg-white border border-[#c1c8c2]/80 p-4 rounded-2xl shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#717973]">
            Open Support Tickets
          </span>
          <div className="font-heading font-bold text-2xl text-[#012d1d]">
            {tickets.filter((t) => t.status !== 'Resolved').length} Active
          </div>
          <div className="text-[11px] text-[#16a34a] font-bold">96.8% SLA Compliance</div>
        </div>

        <div className="bg-white border border-[#c1c8c2]/80 p-4 rounded-2xl shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#717973]">
            Pending KYC Verifications
          </span>
          <div className="font-heading font-bold text-2xl text-[#012d1d]">
            {kycQueue.length} Applications
          </div>
          <div className="text-[11px] text-[#012d1d] font-semibold">NIN / CAC Validation</div>
        </div>

        <div className="bg-white border border-[#c1c8c2]/80 p-4 rounded-2xl shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#717973]">
            Flagged Produce Listings
          </span>
          <div className="font-heading font-bold text-2xl text-[#ba1a1a]">
            {flaggedListings.length} Flagged
          </div>
          <div className="text-[11px] text-[#ba1a1a] font-semibold">Moisture & Price Audits</div>
        </div>

        <div className="bg-white border border-[#c1c8c2]/80 p-4 rounded-2xl shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#717973]">
            Active Escrow Disputes
          </span>
          <div className="font-heading font-bold text-2xl text-[#b45309]">
            {disputes.length} Disputes
          </div>
          <div className="text-[11px] text-[#b45309] font-bold">₦3.6M Locked in Escrow</div>
        </div>
      </div>

      {/* Sub-Tabs Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-[#c1c8c2]/60">
        {[
          { id: 'tickets' as const, label: 'Support Tickets Queue', icon: Headphones },
          { id: 'kyc_queue' as const, label: 'KYC & Identity Review', icon: FileCheck },
          { id: 'listing_moderation' as const, label: 'Listing Moderation', icon: AlertTriangle },
          { id: 'disputes' as const, label: 'Dispute Arbitration', icon: Scale },
          { id: 'issues_analytics' as const, label: 'Common Issues Analytics', icon: TrendingDown },
          { id: 'user_lookup' as const, label: 'Quick User Lookup', icon: Search },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#0f766e] text-white shadow-xs'
                  : 'bg-white text-[#525a54] hover:bg-[#f0f4f1] border border-[#c1c8c2]/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#ccfbf1]' : 'text-[#0f766e]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Support Tickets Queue */}
      {activeTab === 'tickets' && (
        <div className="bg-white rounded-2xl border border-[#c1c8c2]/80 p-5 shadow-xs space-y-4">
          <div className="pb-2 border-b border-[#e5e9e6]">
            <h3 className="font-heading font-bold text-sm text-[#012d1d]">
              Live Support Ticket Triage Queue
            </h3>
            <p className="text-xs text-[#717973]">
              Farmer USSD incidents, payment gateway failures, and logistics inquiries
            </p>
          </div>

          <div className="divide-y divide-[#e5e9e6]">
            {tickets.map((t) => (
              <div key={t.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#012d1d]">{t.id}</span>
                    <span
                      className={`px-2 py-0.2 rounded-md text-[10px] font-bold ${
                        t.priority === 'Critical'
                          ? 'bg-[#ffdad6] text-[#ba1a1a]'
                          : t.priority === 'High'
                          ? 'bg-[#fef3c7] text-[#b45309]'
                          : 'bg-[#f0f4f1] text-[#525a54]'
                      }`}
                    >
                      {t.priority} Priority
                    </span>
                    <span className="text-[10px] text-[#717973] bg-[#f8faf8] px-2 py-0.2 rounded-md border border-[#e2e8e4]">
                      {t.category}
                    </span>
                  </div>
                  <div className="font-heading font-bold text-xs text-[#012d1d]">{t.subject}</div>
                  <div className="text-[11px] text-[#525a54]">
                    Sender: <strong>{t.sender}</strong> ({t.role}) • {t.createdAt} • SLA: <span className="font-bold text-[#ba1a1a]">{t.slaMinutesLeft} mins left</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {t.status === 'Resolved' ? (
                    <span className="px-3 py-1 bg-[#c1ecd4] text-[#002114] rounded-xl text-xs font-bold">
                      Resolved
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setSelectedTicket(t)}
                      className="px-3 py-1.5 bg-[#0f766e] hover:bg-[#115e59] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Respond & Resolve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: KYC & Identity Review */}
      {activeTab === 'kyc_queue' && (
        <div className="bg-white rounded-2xl border border-[#c1c8c2]/80 p-5 shadow-xs space-y-4">
          <div className="pb-2 border-b border-[#e5e9e6]">
            <h3 className="font-heading font-bold text-sm text-[#012d1d]">
              Tier-2 KYC Verification Review Queue
            </h3>
            <p className="text-xs text-[#717973]">
              Verify National Identification Numbers (NIN), CAC certificates, and Cooperative endorsement letters
            </p>
          </div>

          <div className="divide-y divide-[#e5e9e6]">
            {kycQueue.map((kyc) => (
              <div key={kyc.id} className="py-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-xs sm:text-sm text-[#012d1d]">{kyc.name}</span>
                      <span className="px-2 py-0.2 bg-[#012d1d] text-[#c1ecd4] text-[10px] font-bold rounded-md uppercase">
                        {kyc.role}
                      </span>
                    </div>
                    <p className="text-xs text-[#717973]">Location: {kyc.lga}, {kyc.state} State • Submitted: {kyc.submittedAt}</p>
                  </div>
                  <span className="px-2.5 py-0.5 bg-[#fef3c7] text-[#b45309] rounded-full text-[10px] font-bold">
                    {kyc.status}
                  </span>
                </div>

                <div className="bg-[#f8faf8] p-3 rounded-xl border border-[#e2e8e4] space-y-1 text-xs">
                  <span className="font-bold text-[#525a54] block">Attached Verification Credentials:</span>
                  {kyc.documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[#012d1d]">
                      <FileCheck className="w-3.5 h-3.5 text-[#16a34a]" />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleApproveKyc(kyc.id, kyc.name)}
                    className="px-3 py-1.5 bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve Tier-2 KYC</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setKycQueue((prev) => prev.filter((k) => k.id !== kyc.id));
                      setActionSuccess(`Requested additional documents for ${kyc.name}.`);
                    }}
                    className="px-3 py-1.5 border border-[#d8deda] hover:bg-[#f8faf8] text-[#525a54] text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Request Info
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Listing Moderation */}
      {activeTab === 'listing_moderation' && (
        <div className="bg-white rounded-2xl border border-[#c1c8c2]/80 p-5 shadow-xs space-y-4">
          <div className="pb-2 border-b border-[#e5e9e6]">
            <h3 className="font-heading font-bold text-sm text-[#012d1d]">
              Produce Listing Quality & Pricing Moderation
            </h3>
            <p className="text-xs text-[#717973]">
              Flagged produce listings exceeding moisture limits or statutory price ceilings
            </p>
          </div>

          <div className="divide-y divide-[#e5e9e6]">
            {flaggedListings.map((lst) => (
              <div key={lst.id} className="py-4 space-y-2.5">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-heading font-bold text-xs sm:text-sm text-[#012d1d]">{lst.title}</h4>
                    <p className="text-xs text-[#525a54]">Seller: <strong>{lst.seller}</strong> • {lst.location} • Listed Price: <strong>{lst.price}</strong></p>
                  </div>
                  <span className="px-2.5 py-0.5 bg-[#ffdad6] text-[#ba1a1a] text-[10px] font-bold rounded-full">
                    {lst.status}
                  </span>
                </div>

                <div className="p-3 bg-[#fff8f6] rounded-xl border border-[#ffdad6] text-xs text-[#ba1a1a] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Violation: <strong>{lst.flagReason}</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleApproveListing(lst.id)}
                    className="px-3 py-1.5 bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold rounded-xl"
                  >
                    Approve & Clear Flag
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveListing(lst.id)}
                    className="px-3 py-1.5 bg-[#ba1a1a] hover:bg-[#93000a] text-white text-xs font-bold rounded-xl"
                  >
                    Takedown Listing
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Dispute Resolution */}
      {activeTab === 'disputes' && (
        <div className="bg-white rounded-2xl border border-[#c1c8c2]/80 p-5 shadow-xs space-y-4">
          <div className="pb-2 border-b border-[#e5e9e6]">
            <h3 className="font-heading font-bold text-sm text-[#012d1d]">
              Escrow Trade Dispute Arbitration Center
            </h3>
            <p className="text-xs text-[#717973]">
              Review buyer-seller damage claims, waybill certificates, and execute binding escrow payouts
            </p>
          </div>

          <div className="divide-y divide-[#e5e9e6]">
            {disputes.map((dsp) => (
              <div key={dsp.id} className="py-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#012d1d]">{dsp.id}</span>
                    <h4 className="font-heading font-bold text-sm text-[#012d1d]">Order: {dsp.orderId} • Escrow: {dsp.amount}</h4>
                    <p className="text-xs text-[#525a54]">Buyer: {dsp.buyer} • Seller: {dsp.seller} • Carrier: {dsp.transporter}</p>
                  </div>
                  <span className="px-2.5 py-0.5 bg-[#fef3c7] text-[#b45309] rounded-full text-[10px] font-bold">
                    {dsp.status}
                  </span>
                </div>

                <div className="p-3 bg-[#f8faf8] rounded-xl border border-[#d8deda] text-xs space-y-1">
                  <p className="text-[#012d1d]"><strong>Claim:</strong> {dsp.reason}</p>
                  <p className="text-[#717973]"><strong>Evidence:</strong> {dsp.evidence}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleArbitrateDispute(dsp.id, 'Full Release to Seller (Farmer)')}
                    className="px-3 py-1.5 bg-[#012d1d] text-white text-xs font-bold rounded-xl hover:bg-[#1b4332]"
                  >
                    Release to Farmer
                  </button>
                  <button
                    type="button"
                    onClick={() => handleArbitrateDispute(dsp.id, 'Full Refund to Buyer')}
                    className="px-3 py-1.5 bg-[#ba1a1a] text-white text-xs font-bold rounded-xl hover:bg-[#93000a]"
                  >
                    Refund Buyer
                  </button>
                  <button
                    type="button"
                    onClick={() => handleArbitrateDispute(dsp.id, 'Split Escrow 50/50')}
                    className="px-3 py-1.5 border border-[#d8deda] hover:bg-[#f8faf8] text-[#012d1d] text-xs font-bold rounded-xl"
                  >
                    50/50 Split Settlement
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Common Issues Analytics */}
      {activeTab === 'issues_analytics' && (
        <div className="bg-white rounded-2xl border border-[#c1c8c2]/80 p-5 shadow-xs space-y-4">
          <div className="pb-2 border-b border-[#e5e9e6]">
            <h3 className="font-heading font-bold text-sm text-[#012d1d]">
              Platform Operational Analytics & Drop-off Funnels
            </h3>
            <p className="text-xs text-[#717973]">
              Identify UX friction, payment gateway timeouts, and rural USSD bottlenecks
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#f8faf8] rounded-2xl border border-[#d8deda] space-y-2">
              <span className="font-heading font-bold text-xs text-[#012d1d]">Registration Drop-offs</span>
              <div className="text-2xl font-bold text-[#ba1a1a]">4.2% Rate</div>
              <p className="text-xs text-[#525a54]">Primary drop-off: NIN OTP SMS delay from telecos.</p>
            </div>

            <div className="p-4 bg-[#f8faf8] rounded-2xl border border-[#d8deda] space-y-2">
              <span className="font-heading font-bold text-xs text-[#012d1d]">Bank Gateway Failures</span>
              <div className="text-2xl font-bold text-[#16a34a]">0.8% Rate</div>
              <p className="text-xs text-[#525a54]">NIBSS instant payment bus is performing optimally.</p>
            </div>

            <div className="p-4 bg-[#f8faf8] rounded-2xl border border-[#d8deda] space-y-2">
              <span className="font-heading font-bold text-xs text-[#012d1d]">Waybill Upload Success</span>
              <div className="text-2xl font-bold text-[#012d1d]">98.6%</div>
              <p className="text-xs text-[#525a54]">Offline-first image compression prevents field failures.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: User Lookup */}
      {activeTab === 'user_lookup' && (
        <div className="bg-white rounded-2xl border border-[#c1c8c2]/80 p-5 shadow-xs space-y-4">
          <div className="pb-2 border-b border-[#e5e9e6]">
            <h3 className="font-heading font-bold text-sm text-[#012d1d]">
              Quick User Profile Lookup & Support Audit
            </h3>
            <p className="text-xs text-[#717973]">
              Lookup individual end-users by phone number or name with mandatory access reason logging
            </p>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-[#717973]" />
            <input
              type="text"
              placeholder="Search user by name, phone (+234), or UID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#717973] rounded-xl text-[#012d1d]"
            />
          </div>

          <div className="divide-y divide-[#e5e9e6]">
            {usersList
              .filter(
                (u) =>
                  !searchQuery ||
                  u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  u.phone.includes(searchQuery)
              )
              .slice(0, 5)
              .map((u) => (
                <div key={u.id} className="py-3 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-xs text-[#012d1d]">{u.name}</div>
                    <div className="text-[11px] text-[#717973]">
                      Phone: {u.phone} • Role: <span className="uppercase font-bold">{u.role}</span> • State: {u.state}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedUserForInspection(u)}
                    className="px-3 py-1.5 bg-[#0f766e] hover:bg-[#115e59] text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect Profile</span>
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Ticket Response Modal Drawer */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-[#c1c8c2]">
            <div className="flex justify-between items-center pb-2 border-b border-[#e5e9e6]">
              <h3 className="font-heading font-bold text-base text-[#012d1d]">
                Respond to Ticket: {selectedTicket.id}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="text-[#717973]"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-[#f8faf8] rounded-xl border border-[#e2e8e4] space-y-1 text-xs">
              <div><strong>Sender:</strong> {selectedTicket.sender} ({selectedTicket.role})</div>
              <div><strong>Subject:</strong> {selectedTicket.subject}</div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#012d1d]">Official Resolution Message</label>
              <textarea
                rows={4}
                value={ticketReplyText}
                onChange={(e) => setTicketReplyText(e.target.value)}
                placeholder="Enter formal resolution or dispatch instructions..."
                className="w-full text-xs p-3 bg-white border border-[#717973] rounded-xl text-[#012d1d]"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="flex-1 py-2.5 border border-[#d8deda] text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleResolveTicket(selectedTicket.id)}
                className="flex-1 py-2.5 bg-[#0f766e] hover:bg-[#115e59] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send & Close Ticket</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mandatory Reason Logging Modal for User Lookup */}
      {selectedUserForInspection && (
        <ReasonLoggingModal
          isOpen={true}
          onClose={() => setSelectedUserForInspection(null)}
          targetUserName={selectedUserForInspection.name}
          targetUserRole={selectedUserForInspection.role}
          targetUserId={selectedUserForInspection.id}
          adminDepartment="USUCO Operations Support Desk"
          recordType="Customer Support & Incident Log"
          onConfirm={(reason) => {
            setSelectedUserForInspection(null);
            setActionSuccess(`Operations authorized decrypted profile inspection logged for ${selectedUserForInspection.name}.`);
            setTimeout(() => setActionSuccess(null), 4000);
          }}
        />
      )}
    </div>
  );
};
export default OperationsSupportDashboard;
