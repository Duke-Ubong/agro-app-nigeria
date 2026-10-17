import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CooperativeMember } from '../../types';

export const CooperativeRosterView: React.FC = () => {
  const { coopMembers, addCoopMember, updateCoopMember, setActiveView } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCluster, setSelectedCluster] = useState('All');
  const [selectedKyc, setSelectedKyc] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<CooperativeMember | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+234 ');
  const [cluster, setCluster] = useState('Abeokuta North Maize Cluster');
  const [lga, setLga] = useState('Abeokuta North');
  const [farmSize, setFarmSize] = useState('4.0');
  const [primaryCrops, setPrimaryCrops] = useState('White Maize, Soybeans');
  const [nin, setNin] = useState('');
  const [creditLimit, setCreditLimit] = useState('500000');
  const [bankName, setBankName] = useState('First Bank Nigeria');
  const [accountNumber, setAccountNumber] = useState('');

  // Clusters list
  const clusters = Array.from(new Set(coopMembers.map((m) => m.cluster)));

  // Filtered members
  const filtered = coopMembers.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.phone.includes(searchTerm) ||
      m.nin.includes(searchTerm);
    const matchesCluster = selectedCluster === 'All' || m.cluster === selectedCluster;
    const matchesKyc = selectedKyc === 'All' || m.kycStatus === selectedKyc;
    return matchesSearch && matchesCluster && matchesKyc;
  });

  // Aggregated Stats
  const totalFarmers = coopMembers.length;
  const totalHectares = coopMembers.reduce((acc, m) => acc + m.farmSizeHectares, 0).toFixed(1);
  const totalAggregatedMT = coopMembers.reduce((acc, m) => acc + m.totalAggregatedMT, 0).toFixed(1);
  const totalLoanDebt = coopMembers.reduce((acc, m) => acc + m.loanBalanceNaira, 0);

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    addCoopMember({
      name,
      phone,
      cluster,
      lga,
      state: 'Ogun State',
      farmSizeHectares: parseFloat(farmSize) || 2.0,
      primaryCrops: primaryCrops.split(',').map((c) => c.trim()),
      nin: nin || '10293847561',
      kycStatus: 'verified',
      totalAggregatedMT: 0,
      loanBalanceNaira: 0,
      creditLimitNaira: parseFloat(creditLimit) || 500000,
      bankName,
      accountNumber: accountNumber || '0123456789',
    });

    setShowAddModal(false);
    setName('');
    setPhone('+234 ');
    setNin('');
    setAccountNumber('');
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#3f6653] bg-[#c1ecd4] px-2.5 py-0.5 rounded-full">
              Smallholder Directory & Clusters
            </span>
            <span className="text-xs text-[#717973] font-medium">• 100% KYC Verified Pipeline</span>
          </div>
          <h1 className="font-heading font-bold text-2xl text-[#012d1d] mt-1">
            Member Farmer Roster
          </h1>
          <p className="text-xs text-[#414844]">
            Manage smallholder profiles, GPS farm acreage, cluster assignments, and seasonal intake records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="h-10 px-4 bg-[#012d1d] text-white font-heading font-bold text-xs rounded-full flex items-center gap-2 hover:bg-[#1b4332] active:scale-95 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>Enroll New Farmer</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#c1c8c2] p-4 rounded-xl space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-[#717973]">
            <span className="text-xs font-bold uppercase">Enrolled Members</span>
            <span className="material-symbols-outlined text-[#012d1d] text-[20px]">groups</span>
          </div>
          <div className="font-heading font-bold text-2xl text-[#012d1d]">{totalFarmers}</div>
          <p className="text-[10px] text-[#717973] font-medium">Across {clusters.length} active LGA clusters</p>
        </div>

        <div className="bg-white border border-[#c1c8c2] p-4 rounded-xl space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-[#717973]">
            <span className="text-xs font-bold uppercase">Cultivated Acreage</span>
            <span className="material-symbols-outlined text-[#012d1d] text-[20px]">landscape</span>
          </div>
          <div className="font-heading font-bold text-2xl text-[#012d1d]">{totalHectares} Ha</div>
          <p className="text-[10px] text-[#717973] font-medium">GPS polygon mapped & verified</p>
        </div>

        <div className="bg-white border border-[#c1c8c2] p-4 rounded-xl space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-[#717973]">
            <span className="text-xs font-bold uppercase">Total Aggregated</span>
            <span className="material-symbols-outlined text-[#012d1d] text-[20px]">warehouse</span>
          </div>
          <div className="font-heading font-bold text-2xl text-[#012d1d]">{totalAggregatedMT} MT</div>
          <p className="text-[10px] text-[#717973] font-medium">Delivered to coop silos this season</p>
        </div>

        <div className="bg-white border border-[#c1c8c2] p-4 rounded-xl space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-[#717973]">
            <span className="text-xs font-bold uppercase">Active Input Credit</span>
            <span className="material-symbols-outlined text-[#ba1a1a] text-[20px]">payments</span>
          </div>
          <div className="font-heading font-bold text-2xl text-[#ba1a1a]">
            ₦{(totalLoanDebt / 1000000).toFixed(2)}M
          </div>
          <p className="text-[10px] text-[#717973] font-medium">To be deducted at grain intake</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#c1c8c2] shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#717973] text-[20px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search by name, phone, or NIN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#f3f3f3] border border-[#c1c8c2] rounded-lg text-xs focus:outline-none focus:border-[#012d1d]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedCluster}
            onChange={(e) => setSelectedCluster(e.target.value)}
            className="px-3 py-2 bg-[#f3f3f3] border border-[#c1c8c2] rounded-lg text-xs font-medium text-[#1a1c1c] focus:outline-none"
          >
            <option value="All">All Farming Clusters</option>
            {clusters.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={selectedKyc}
            onChange={(e) => setSelectedKyc(e.target.value)}
            className="px-3 py-2 bg-[#f3f3f3] border border-[#c1c8c2] rounded-lg text-xs font-medium text-[#1a1c1c] focus:outline-none"
          >
            <option value="All">All KYC Statuses</option>
            <option value="verified">KYC Verified Only</option>
            <option value="pending">KYC Pending</option>
          </select>
        </div>
      </div>

      {/* Farmers Table */}
      <div className="bg-white rounded-xl border border-[#c1c8c2] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f9f9f9] border-b border-[#e2e2e2] text-[#717973] uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Member Name & ID</th>
                <th className="py-3 px-4">Cluster / LGA</th>
                <th className="py-3 px-4">Farm Size</th>
                <th className="py-3 px-4">Primary Crops</th>
                <th className="py-3 px-4">Delivered (MT)</th>
                <th className="py-3 px-4">Input Loan Debt</th>
                <th className="py-3 px-4">KYC Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e2e2]">
              {filtered.map((member) => (
                <tr
                  key={member.id}
                  className="hover:bg-[#f3f8f5] transition-colors cursor-pointer"
                  onClick={() => setSelectedMember(member)}
                >
                  <td className="py-3.5 px-4">
                    <div className="font-heading font-bold text-xs text-[#012d1d]">{member.name}</div>
                    <div className="text-[11px] text-[#717973]">{member.phone}</div>
                    <div className="text-[10px] text-[#8e918f] font-mono">NIN: {member.nin.slice(0, 4)}****{member.nin.slice(-3)}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-[#1a1c1c]">{member.cluster}</div>
                    <div className="text-[10px] text-[#717973]">{member.lga}, {member.state}</div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#012d1d]">
                    {member.farmSizeHectares} Ha
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {member.primaryCrops.map((crop) => (
                        <span
                          key={crop}
                          className="bg-[#e8f3ee] text-[#012d1d] px-2 py-0.5 rounded text-[10px] font-medium"
                        >
                          {crop}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-heading font-bold text-[#012d1d]">
                    {member.totalAggregatedMT > 0 ? `${member.totalAggregatedMT} MT` : '—'}
                  </td>
                  <td className="py-3.5 px-4">
                    {member.loanBalanceNaira > 0 ? (
                      <span className="font-bold text-[#ba1a1a]">
                        ₦{member.loanBalanceNaira.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-[#3f6653] font-bold">Clear (₦0)</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        member.kycStatus === 'verified'
                          ? 'bg-[#c1ecd4] text-[#002114]'
                          : 'bg-[#ffdeac] text-[#281900]'
                      }`}
                    >
                      {member.kycStatus === 'verified' ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedMember(member)}
                        className="px-2.5 py-1 bg-[#f3f3f3] hover:bg-[#e8e8e8] text-[#012d1d] rounded text-[11px] font-bold"
                        title="View profile details"
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => setActiveView('coop_aggregation')}
                        className="px-2.5 py-1 bg-[#012d1d] hover:bg-[#1b4332] text-white rounded text-[11px] font-bold"
                        title="Intake produce from this farmer"
                      >
                        Intake
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-[#717973] space-y-2">
            <span className="material-symbols-outlined text-4xl text-[#c1c8c2]">person_search</span>
            <p className="text-xs">No member farmers matching the filter criteria.</p>
          </div>
        )}
      </div>

      {/* Member Details Drawer Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#c1c8c2] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-[#e2e2e2] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#3f6653] bg-[#c1ecd4] px-2 py-0.5 rounded">
                  Farmer ID: {selectedMember.id}
                </span>
                <h3 className="font-heading font-bold text-xl text-[#012d1d] mt-1">
                  {selectedMember.name}
                </h3>
                <p className="text-xs text-[#717973]">{selectedMember.cluster} • Member since {selectedMember.joinedDate}</p>
              </div>
              <button
                onClick={() => setSelectedMember(null)}
                className="w-8 h-8 rounded-full bg-[#f3f3f3] hover:bg-[#e2e2e2] flex items-center justify-center text-[#414844]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#f9f9f9] rounded-xl border border-[#e2e2e2]">
                <div className="text-[10px] text-[#717973] uppercase font-bold">Contact Phone</div>
                <div className="font-bold text-[#012d1d] mt-0.5">{selectedMember.phone}</div>
              </div>
              <div className="p-3 bg-[#f9f9f9] rounded-xl border border-[#e2e2e2]">
                <div className="text-[10px] text-[#717973] uppercase font-bold">National NIN</div>
                <div className="font-bold text-[#012d1d] mt-0.5">{selectedMember.nin}</div>
              </div>
              <div className="p-3 bg-[#f9f9f9] rounded-xl border border-[#e2e2e2]">
                <div className="text-[10px] text-[#717973] uppercase font-bold">Farm Acreage</div>
                <div className="font-bold text-[#012d1d] mt-0.5">{selectedMember.farmSizeHectares} Hectares</div>
              </div>
              <div className="p-3 bg-[#f9f9f9] rounded-xl border border-[#e2e2e2]">
                <div className="text-[10px] text-[#717973] uppercase font-bold">Seasonal Intake Delivered</div>
                <div className="font-bold text-[#012d1d] mt-0.5">{selectedMember.totalAggregatedMT} MT</div>
              </div>
              <div className="p-3 bg-[#f9f9f9] rounded-xl border border-[#e2e2e2]">
                <div className="text-[10px] text-[#717973] uppercase font-bold">Outstanding Input Loan</div>
                <div className="font-bold text-[#ba1a1a] mt-0.5">
                  ₦{selectedMember.loanBalanceNaira.toLocaleString()}
                </div>
              </div>
              <div className="p-3 bg-[#f9f9f9] rounded-xl border border-[#e2e2e2]">
                <div className="text-[10px] text-[#717973] uppercase font-bold">Approved Credit Limit</div>
                <div className="font-bold text-[#3f6653] mt-0.5">
                  ₦{selectedMember.creditLimitNaira.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="p-3 bg-[#f3f8f5] rounded-xl border border-[#c1ecd4] space-y-1">
              <div className="text-[10px] text-[#3f6653] uppercase font-bold">Direct Payout Account</div>
              <div className="text-xs font-bold text-[#012d1d]">
                {selectedMember.bankName || 'First Bank Nigeria'} — {selectedMember.accountNumber || '0192837465'}
              </div>
              <p className="text-[10px] text-[#717973]">
                Offtaker sale proceeds are deposited directly into this farmer account minus harvest loan deductions.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setSelectedMember(null);
                  setActiveView('coop_aggregation');
                }}
                className="flex-1 py-2.5 bg-[#012d1d] hover:bg-[#1b4332] text-white rounded-xl font-heading font-bold text-xs flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">scale</span>
                <span>Log Weighbridge Intake</span>
              </button>
              <button
                onClick={() => {
                  setSelectedMember(null);
                  setActiveView('coop_inputs');
                }}
                className="flex-1 py-2.5 bg-[#f3f3f3] hover:bg-[#e8e8e8] text-[#012d1d] rounded-xl font-heading font-bold text-xs border border-[#c1c8c2] flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                <span>Allocate Bulk Inputs</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Farmer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#c1c8c2] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#e2e2e2] pb-3">
              <h3 className="font-heading font-bold text-lg text-[#012d1d]">
                Enroll New Member Farmer
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-[#f3f3f3] hover:bg-[#e2e2e2] flex items-center justify-center text-[#414844]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateMember} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-[#414844] mb-1">
                  Full Name (as on National ID) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Babatunde Olawale"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f3f3f3] border border-[#c1c8c2] rounded-lg focus:outline-none focus:border-[#012d1d]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#414844] mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+234 803 000 0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f3f3f3] border border-[#c1c8c2] rounded-lg focus:outline-none focus:border-[#012d1d]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#414844] mb-1">
                    National ID (NIN)
                  </label>
                  <input
                    type="text"
                    maxLength={11}
                    placeholder="11-digit NIN"
                    value={nin}
                    onChange={(e) => setNin(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f3f3f3] border border-[#c1c8c2] rounded-lg focus:outline-none focus:border-[#012d1d]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#414844] mb-1">
                    Farming Cluster
                  </label>
                  <select
                    value={cluster}
                    onChange={(e) => setCluster(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f3f3f3] border border-[#c1c8c2] rounded-lg focus:outline-none"
                  >
                    {clusters.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                    <option value="New Ogun Cluster">Other / New Cluster</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#414844] mb-1">
                    LGA (Local Govt Area)
                  </label>
                  <input
                    type="text"
                    value={lga}
                    onChange={(e) => setLga(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f3f3f3] border border-[#c1c8c2] rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#414844] mb-1">
                    Farm Size (Hectares)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    value={farmSize}
                    onChange={(e) => setFarmSize(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f3f3f3] border border-[#c1c8c2] rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#414844] mb-1">
                    Seasonal Credit Line (₦)
                  </label>
                  <input
                    type="number"
                    step="50000"
                    value={creditLimit}
                    onChange={(e) => setCreditLimit(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f3f3f3] border border-[#c1c8c2] rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#414844] mb-1">
                  Primary Crops Cultivated
                </label>
                <input
                  type="text"
                  placeholder="e.g. White Maize, Soybeans"
                  value={primaryCrops}
                  onChange={(e) => setPrimaryCrops(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f3f3f3] border border-[#c1c8c2] rounded-lg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#414844] mb-1">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f3f3f3] border border-[#c1c8c2] rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#414844] mb-1">
                    Account Number
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="10-digit NUBAN"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f3f3f3] border border-[#c1c8c2] rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#e2e2e2]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-[#f3f3f3] text-[#414844] font-bold rounded-lg hover:bg-[#e8e8e8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#012d1d] text-white font-bold rounded-lg hover:bg-[#1b4332]"
                >
                  Confirm Enrollment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
