import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Edit3,
  Trash2,
  Eye,
  Clock,
  Download,
  X,
} from 'lucide-react';
import { User, UserRole } from '../../../types';

interface SuperAdminUserManagementProps {
  usersList: User[];
  onAddUser: (user: Partial<User>) => void;
  onUpdateUser: (id: string, updates: Partial<User>) => void;
  onDeleteUser: (id: string) => void;
  onInspectUser: (user: User) => void;
  onBulkVerify: (ids: string[]) => void;
  onBulkSuspend: (ids: string[]) => void;
  onBulkExport: (users: User[]) => void;
  subTab?: 'all' | 'roles' | 'bulk' | 'activity';
  onSubTabChange?: (tab: 'all' | 'roles' | 'bulk' | 'activity') => void;
}

export const SuperAdminUserManagement: React.FC<SuperAdminUserManagementProps> = ({
  usersList,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  onInspectUser,
  onBulkVerify,
  onBulkSuspend,
  onBulkExport,
  subTab = 'all',
  onSubTabChange,
}) => {
  const [internalSubTab, setInternalSubTab] = useState<'all' | 'roles' | 'bulk' | 'activity'>(subTab);

  React.useEffect(() => {
    if (subTab) setInternalSubTab(subTab);
  }, [subTab]);

  const currentTab = subTab || internalSubTab;
  const setTab = (t: 'all' | 'roles' | 'bulk' | 'activity') => {
    setInternalSubTab(t);
    if (onSubTabChange) onSubTabChange(t);
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [timelineUser, setTimelineUser] = useState<User | null>(null);

  // Modal State for Create / Edit
  const [showModal, setShowModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<UserRole>('farmer');
  const [formState, setFormState] = useState('Kaduna');
  const [formLga, setFormLga] = useState('Giwa');
  const [formVerified, setFormVerified] = useState<boolean>(true);

  // Filtered Users
  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      !searchQuery ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery) ||
      (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = selectedRole === 'ALL' || u.role === selectedRole;
    const matchesState = selectedState === 'ALL' || u.state === selectedState;

    return matchesSearch && matchesRole && matchesState;
  });

  const handleSelectAll = () => {
    if (selectedUserIds.length === filteredUsers.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(filteredUsers.map((u) => u.id));
    }
  };

  const handleToggleSelectUser = (id: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const openCreateModal = () => {
    setEditingUserId(null);
    setFormName('');
    setFormPhone('+234 ');
    setFormEmail('');
    setFormRole('farmer');
    setFormState('Kaduna');
    setFormLga('Giwa');
    setFormVerified(true);
    setShowModal(true);
  };

  const openEditModal = (u: User) => {
    setEditingUserId(u.id);
    setFormName(u.name);
    setFormPhone(u.phone);
    setFormEmail(u.email || '');
    setFormRole(u.role);
    setFormState(u.state || 'Kaduna');
    setFormLga(u.lga || 'Giwa');
    setFormVerified(u.verificationStatus === 'verified');
    setShowModal(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPhone) return;

    if (editingUserId) {
      onUpdateUser(editingUserId, {
        name: formName,
        phone: formPhone,
        email: formEmail,
        role: formRole,
        state: formState,
        lga: formLga,
        verificationStatus: formVerified ? 'verified' : 'pending',
      });
    } else {
      onAddUser({
        id: `usr_${Date.now()}`,
        name: formName,
        phone: formPhone,
        email: formEmail || `user_${Date.now()}@agroapp.gov.ng`,
        role: formRole,
        state: formState,
        lga: formLga,
        verificationStatus: formVerified ? 'verified' : 'pending',
        language: 'ha',
        createdAt: new Date().toISOString(),
      });
    }

    setShowModal(false);
  };

  // Mock User Timeline Activity
  const mockTimelineEvents = [
    { time: '10:45 AM', action: 'USSD Harvest Produce Listed', details: '50 Bags White Maize @ ₦42,000/bag via *384*247#' },
    { time: 'Yesterday', action: 'Escrow Settlement Payout Received', details: '₦1,850,000 disbursed from BOA Settlement Pool' },
    { time: '3 days ago', action: 'Tier-2 Biometric NIN Verification', details: 'Verified by Extension Agent Aliyu Sani in Giwa LGA' },
    { time: '1 week ago', action: 'Cooperative Joint-Guarantee Bond', details: 'Joined Giwa Grains Cooperative Society #402' },
  ];

  return (
    <div className="space-y-5">
      {/* Sub Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1b2b22] pb-3 overflow-x-auto">
        <button
          type="button"
          onClick={() => setTab('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            currentTab === 'all'
              ? 'bg-[#10b981] text-[#0a0f0d]'
              : 'bg-[#0f1713] text-[#8fa89b] hover:text-white border border-[#1b2b22]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>All Users ({usersList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setTab('roles')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            currentTab === 'roles'
              ? 'bg-[#10b981] text-[#0a0f0d]'
              : 'bg-[#0f1713] text-[#8fa89b] hover:text-white border border-[#1b2b22]'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Role Management (8 Tiers)</span>
        </button>

        <button
          type="button"
          onClick={() => setTab('bulk')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            currentTab === 'bulk'
              ? 'bg-[#10b981] text-[#0a0f0d]'
              : 'bg-[#0f1713] text-[#8fa89b] hover:text-white border border-[#1b2b22]'
          }`}
        >
          <Download className="w-3.5 h-3.5" />
          <span>Bulk Actions & Exports</span>
        </button>

        <button
          type="button"
          onClick={() => setTab('activity')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            currentTab === 'activity'
              ? 'bg-[#10b981] text-[#0a0f0d]'
              : 'bg-[#0f1713] text-[#8fa89b] hover:text-white border border-[#1b2b22]'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>User Activity Log</span>
        </button>
      </div>

      {currentTab === 'roles' ? (
        <div className="bg-[#0f1713] border border-[#1b2b22] rounded-2xl p-5 shadow-md space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-[#1b2b22]">
            <div>
              <h3 className="font-bold text-sm text-white">Value Chain Role Hierarchy & Capabilities</h3>
              <p className="text-xs text-[#8fa89b]">Defined access tiers and governance scopes across Nigeria</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { role: 'Farmer (Smallholder & Commercial)', count: usersList.filter(u => u.role === 'farmer').length, scope: 'Produce listing, BOA credit access, USSD flash trade, advisory.' },
              { role: 'Agricultural Cooperative', count: usersList.filter(u => u.role === 'cooperative').length, scope: 'Aggregate farmer produce, joint loan guarantees, warehouse inventory.' },
              { role: 'Buyer & Industrial Processor', count: usersList.filter(u => u.role === 'buyer').length, scope: 'Bulk procurement, escrow deposit, off-take contract execution.' },
              { role: 'Input Supplier & Agro-Dealer', count: usersList.filter(u => u.role === 'supplier').length, scope: 'Fertilizer/seed catalog, redemption of government subsidy vouchers.' },
              { role: 'Transporter & Fleet Logistics', count: usersList.filter(u => u.role === 'transporter').length, scope: 'Waybill dispatch, GPS telematics, haulage rate negotiation.' },
              { role: 'State ADP Administrator', count: usersList.filter(u => u.role === 'institutional_admin').length, scope: 'State extension agent supervision, LGA farmer onboarding verification.' },
              { role: 'Ministry Admin (FMARD)', count: usersList.filter(u => u.role === 'gov_admin').length, scope: 'National food security index, export quotas, strategic grain reserve.' },
              { role: 'Super Admin (Level 0 Root)', count: usersList.filter(u => u.role === 'super_admin').length, scope: 'Full platform sovereignty, emergency kill-switches, audit oversight.' },
            ].map((r, idx) => (
              <div key={idx} className="p-4 bg-[#0a0f0d] border border-[#1b2b22] rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs text-white">{r.role}</span>
                  <span className="px-2 py-0.5 bg-[#1b2b22] text-[#34d399] rounded text-[10px] font-mono font-bold">{r.count} users</span>
                </div>
                <p className="text-[11px] text-[#8fa89b] leading-relaxed">{r.scope}</p>
              </div>
            ))}
          </div>
        </div>
      ) : currentTab === 'bulk' ? (
        <div className="bg-[#0f1713] border border-[#1b2b22] rounded-2xl p-5 shadow-md space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-[#1b2b22]">
            <div>
              <h3 className="font-bold text-sm text-white">Bulk Actions & Batch Provisioning Desk</h3>
              <p className="text-xs text-[#8fa89b]">Execute batch operations on registered citizens and institutions</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-[#0a0f0d] border border-[#1b2b22] rounded-xl space-y-3">
              <h4 className="font-bold text-xs text-white">Batch Biometric Verification</h4>
              <p className="text-[11px] text-[#8fa89b]">Verify all unverified farmers with pending NIN submissions.</p>
              <button
                type="button"
                onClick={() => onBulkVerify(usersList.filter(u => u.verificationStatus !== 'verified').map(u => u.id))}
                className="w-full py-2 bg-[#064e3b] text-[#6ee7b7] border border-[#10b981]/50 rounded-xl text-xs font-bold hover:bg-[#10b981] hover:text-[#0a0f0d] transition-all cursor-pointer"
              >
                Verify {usersList.filter(u => u.verificationStatus !== 'verified').length} Pending Users
              </button>
            </div>

            <div className="p-4 bg-[#0a0f0d] border border-[#1b2b22] rounded-xl space-y-3">
              <h4 className="font-bold text-xs text-white">National Farmer Registry Export</h4>
              <p className="text-[11px] text-[#8fa89b]">Export complete census dataset compliant with NBS / FMARD standards.</p>
              <button
                type="button"
                onClick={() => onBulkExport(usersList)}
                className="w-full py-2 bg-[#1b2b22] text-[#34d399] border border-[#2d4738] rounded-xl text-xs font-bold hover:bg-[#253b2f] transition-all cursor-pointer"
              >
                Export All ({usersList.length}) CSV/JSON
              </button>
            </div>

            <div className="p-4 bg-[#0a0f0d] border border-[#1b2b22] rounded-xl space-y-3">
              <h4 className="font-bold text-xs text-white">Emergency Bulk Account Freeze</h4>
              <p className="text-[11px] text-[#8fa89b]">Suspend unverified high-velocity accounts across high-risk corridors.</p>
              <button
                type="button"
                onClick={() => onBulkSuspend(selectedUserIds.length > 0 ? selectedUserIds : [usersList[0]?.id || ''])}
                className="w-full py-2 bg-[#7f1d1d] text-[#fca5a5] border border-[#991b1b] rounded-xl text-xs font-bold hover:bg-[#991b1b] hover:text-white transition-all cursor-pointer"
              >
                Freeze Selected ({selectedUserIds.length}) Accounts
              </button>
            </div>
          </div>
        </div>
      ) : currentTab === 'activity' ? (
        <div className="bg-[#0f1713] border border-[#1b2b22] rounded-2xl p-5 shadow-md space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-[#1b2b22]">
            <div>
              <h3 className="font-bold text-sm text-white">Live Citizen & Institutional Activity Log</h3>
              <p className="text-xs text-[#8fa89b]">Real-time audit stream of user transactions and authentication events</p>
            </div>
          </div>
          <div className="space-y-2">
            {[
              { user: 'Ibrahim Danladi (Farmer)', event: 'Listed 120 Bags Yellow Maize in Giwa, Kaduna', time: '2 mins ago', ip: '102.89.23.11' },
              { user: 'Dangote Sugar Refineries (Buyer)', event: 'Funded Escrow Account with ₦42,000,000 via NIBSS', time: '9 mins ago', ip: '105.112.44.8' },
              { user: 'Aliyu Sani (ADP Extension Agent)', event: 'Completed 14 On-Field Farmer NIN Biometric Verifications', time: '22 mins ago', ip: '197.210.65.90' },
              { user: 'Borno Grains Apex (Cooperative)', event: 'Approved ₦8,500,000 BOA Input Loan Request Batch', time: '40 mins ago', ip: '196.11.238.41' },
              { user: 'Kano Cold Chain Express (Transporter)', event: 'Dispatched 30MT Refrig. Truck from Kano to Mile 12 Lagos', time: '1 hour ago', ip: '102.90.12.89' },
            ].map((act, idx) => (
              <div key={idx} className="p-3 bg-[#0a0f0d] border border-[#1b2b22] rounded-xl flex items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-white">{act.user}</div>
                  <div className="text-[#8fa89b] text-[11px]">{act.event}</div>
                </div>
                <div className="text-right">
                  <div className="text-[#10b981] font-mono">{act.time}</div>
                  <div className="text-[10px] text-[#8fa89b] font-mono">{act.ip}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
        {/* Controls & Search Bar */}
        <div className="bg-[#0f1713] border border-[#1b2b22] rounded-2xl p-5 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-[#1b2b22]">
          <div>
            <h3 className="font-bold text-sm text-white">Nationwide User Registry & Role Authority</h3>
            <p className="text-xs text-[#8fa89b]">
              Full CRUD, role elevation, biometric verification, and bulk provisioning
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openCreateModal}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#10b981] hover:bg-[#059669] text-[#0a0f0d] text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create User Record</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-[#8fa89b] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by full name, phone number, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#0a0f0d] border border-[#1b2b22] rounded-xl text-xs text-white placeholder-[#5a7266] focus:outline-hidden focus:border-[#10b981]"
            />
          </div>

          <div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full py-2 px-3 bg-[#0a0f0d] border border-[#1b2b22] rounded-xl text-xs text-white focus:outline-hidden focus:border-[#10b981]"
            >
              <option value="ALL">All Roles</option>
              <option value="farmer">Farmer</option>
              <option value="cooperative">Cooperative</option>
              <option value="buyer">Buyer / Processor</option>
              <option value="supplier">Input Supplier</option>
              <option value="transporter">Transporter</option>
              <option value="institutional_admin">State ADP Admin</option>
              <option value="gov_admin">Ministry Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>

          <div>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full py-2 px-3 bg-[#0a0f0d] border border-[#1b2b22] rounded-xl text-xs text-white focus:outline-hidden focus:border-[#10b981]"
            >
              <option value="ALL">All States (36 + FCT)</option>
              <option value="Kaduna">Kaduna</option>
              <option value="Kano">Kano</option>
              <option value="Benue">Benue</option>
              <option value="Oyo">Oyo</option>
              <option value="Niger">Niger</option>
              <option value="Enugu">Enugu</option>
              <option value="Lagos">Lagos</option>
              <option value="Abuja">Abuja (FCT)</option>
            </select>
          </div>
        </div>

        {/* Bulk Action Ribbon */}
        {selectedUserIds.length > 0 && (
          <div className="p-3 bg-[#1b2b22] rounded-xl border border-[#2d4738] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-[#34d399] font-mono font-bold">
              <span>{selectedUserIds.length} users selected</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onBulkVerify(selectedUserIds)}
                className="px-2.5 py-1 bg-[#10b981] hover:bg-[#059669] text-[#0a0f0d] rounded-lg font-bold transition-colors cursor-pointer"
              >
                Bulk Verify KYC
              </button>
              <button
                type="button"
                onClick={() => onBulkSuspend(selectedUserIds)}
                className="px-2.5 py-1 bg-[#7f1d1d] hover:bg-[#991b1b] text-white rounded-lg font-bold transition-colors cursor-pointer"
              >
                Bulk Suspend
              </button>
              <button
                type="button"
                onClick={() =>
                  onBulkExport(usersList.filter((u) => selectedUserIds.includes(u.id)))
                }
                className="px-2.5 py-1 bg-[#0a0f0d] hover:bg-[#14201a] text-[#c1d3c9] border border-[#2d4738] rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Selected</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-[#0f1713] border border-[#1b2b22] rounded-2xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#1b2b22] bg-[#0a0f0d] text-[#8fa89b] font-mono">
                <th className="p-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      filteredUsers.length > 0 &&
                      selectedUserIds.length === filteredUsers.length
                    }
                    onChange={handleSelectAll}
                    className="rounded border-[#1b2b22] bg-[#0a0f0d] text-[#10b981] cursor-pointer"
                  />
                </th>
                <th className="p-3.5">User Identity</th>
                <th className="p-3.5">Assigned Role</th>
                <th className="p-3.5">State / LGA</th>
                <th className="p-3.5">KYC Status</th>
                <th className="p-3.5">Phone / Channel</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1b2b22]">
              {filteredUsers.map((u) => {
                const isSelected = selectedUserIds.includes(u.id);
                const isVerified = u.verificationStatus === 'verified';
                return (
                  <tr
                    key={u.id}
                    className={`transition-colors ${
                      isSelected ? 'bg-[#1b2b22]/50' : 'hover:bg-[#0a0f0d]'
                    }`}
                  >
                    <td className="p-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelectUser(u.id)}
                        className="rounded border-[#1b2b22] bg-[#0a0f0d] text-[#10b981] cursor-pointer"
                      />
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-white">{u.name}</div>
                      <div className="text-[11px] text-[#8fa89b] font-mono">{u.email || u.id}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-[#1b2b22] text-[#34d399] border border-[#2d4738] uppercase">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="text-white font-medium">{u.state || 'Kaduna'}</div>
                      <div className="text-[10px] text-[#8fa89b]">{u.lga || 'Giwa'} LGA</div>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isVerified
                            ? 'bg-[#064e3b] text-[#6ee7b7]'
                            : 'bg-[#78350f] text-[#fde68a]'
                        }`}
                      >
                        {isVerified ? 'Tier-2 Verified' : 'Pending NIN'}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-[#c1d3c9]">
                      {u.phone}
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onInspectUser(u)}
                          className="p-1.5 bg-[#1b2b22] hover:bg-[#253b2f] text-[#34d399] rounded-lg transition-colors cursor-pointer"
                          title="NDPR Profile Inspection"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setTimelineUser(u)}
                          className="p-1.5 bg-[#1b2b22] hover:bg-[#253b2f] text-[#60a5fa] rounded-lg transition-colors cursor-pointer"
                          title="Activity Timeline"
                        >
                          <Clock className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditModal(u)}
                          className="p-1.5 bg-[#1b2b22] hover:bg-[#253b2f] text-white rounded-lg transition-colors cursor-pointer"
                          title="Edit User"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteUser(u.id)}
                          className="p-1.5 bg-[#2a0e0e] hover:bg-[#3f1616] text-[#ef4444] rounded-lg transition-colors cursor-pointer"
                          title="Delete User"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      </>
      )}

      {/* User Activity Timeline Slide-out / Modal */}
      {timelineUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f1713] border border-[#1b2b22] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#1b2b22]">
              <div>
                <h4 className="font-bold text-sm text-white">Citizen Activity Audit Trail</h4>
                <p className="text-xs text-[#8fa89b]">
                  {timelineUser.name} • {timelineUser.phone}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setTimelineUser(null)}
                className="p-1 text-[#8fa89b] hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {mockTimelineEvents.map((evt, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-[#10b981] mt-1 shrink-0" />
                  <div className="space-y-0.5">
                    <div className="font-bold text-white flex items-center gap-2">
                      <span>{evt.action}</span>
                      <span className="text-[10px] text-[#8fa89b] font-mono">({evt.time})</span>
                    </div>
                    <div className="text-[#8fa89b] text-[11px]">{evt.details}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#1b2b22] flex justify-end">
              <button
                type="button"
                onClick={() => setTimelineUser(null)}
                className="px-4 py-2 bg-[#10b981] text-[#0a0f0d] font-bold text-xs rounded-xl cursor-pointer"
              >
                Close Timeline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f1713] border border-[#1b2b22] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#1b2b22]">
              <h4 className="font-bold text-sm text-white">
                {editingUserId ? 'Edit User Record' : 'Provision New Platform Citizen / Official'}
              </h4>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 text-[#8fa89b] hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#8fa89b] mb-1 font-semibold">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Mallam Danladi Bello"
                  className="w-full p-2.5 bg-[#0a0f0d] border border-[#1b2b22] rounded-xl text-white focus:outline-hidden focus:border-[#10b981]"
                />
              </div>

              <div>
                <label className="block text-[#8fa89b] mb-1 font-semibold">Phone Number (NIN Linked)</label>
                <input
                  type="text"
                  required
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="+234 803 123 4567"
                  className="w-full p-2.5 bg-[#0a0f0d] border border-[#1b2b22] rounded-xl text-white font-mono focus:outline-hidden focus:border-[#10b981]"
                />
              </div>

              <div>
                <label className="block text-[#8fa89b] mb-1 font-semibold">Email Address (Optional)</label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="danladi@gmail.com"
                  className="w-full p-2.5 bg-[#0a0f0d] border border-[#1b2b22] rounded-xl text-white focus:outline-hidden focus:border-[#10b981]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#8fa89b] mb-1 font-semibold">Role Tier</label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value as UserRole)}
                    className="w-full p-2.5 bg-[#0a0f0d] border border-[#1b2b22] rounded-xl text-white focus:outline-hidden focus:border-[#10b981]"
                  >
                    <option value="farmer">Farmer</option>
                    <option value="cooperative">Cooperative</option>
                    <option value="buyer">Buyer / Processor</option>
                    <option value="supplier">Input Supplier</option>
                    <option value="transporter">Transporter</option>
                    <option value="institutional_admin">State ADP Admin</option>
                    <option value="gov_admin">Ministry Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#8fa89b] mb-1 font-semibold">State Jurisdiction</label>
                  <select
                    value={formState}
                    onChange={(e) => setFormState(e.target.value)}
                    className="w-full p-2.5 bg-[#0a0f0d] border border-[#1b2b22] rounded-xl text-white focus:outline-hidden focus:border-[#10b981]"
                  >
                    <option value="Kaduna">Kaduna</option>
                    <option value="Kano">Kano</option>
                    <option value="Benue">Benue</option>
                    <option value="Oyo">Oyo</option>
                    <option value="Niger">Niger</option>
                    <option value="Enugu">Enugu</option>
                    <option value="Lagos">Lagos</option>
                    <option value="Abuja">Abuja (FCT)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="kycToggle"
                  checked={formVerified}
                  onChange={(e) => setFormVerified(e.target.checked)}
                  className="rounded border-[#1b2b22] bg-[#0a0f0d] text-[#10b981] cursor-pointer"
                />
                <label htmlFor="kycToggle" className="text-[#c1d3c9] font-medium cursor-pointer">
                  Enforce Tier-2 Biometric NIN & BVN Verification
                </label>
              </div>

              <div className="pt-3 border-t border-[#1b2b22] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-[#1b2b22] text-[#c1d3c9] font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#10b981] hover:bg-[#059669] text-[#0a0f0d] font-bold rounded-xl cursor-pointer transition-colors"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
