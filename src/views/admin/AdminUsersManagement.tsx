import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { getNigerianAvatar } from '../../utils/avatarUtils';
import { UserRole } from '../../types';

export const AdminUsersManagement: React.FC = () => {
  const { usersList, updateUserStatus, deleteUser, addAuditLog } = useApp();
  const { role: currentRole, user: currentUser } = useAuth();

  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedUserModal, setSelectedUserModal] = useState<any | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const isSuperAdmin = currentRole === 'super_admin';

  const filteredUsers = usersList.filter((u) => {
    const matchesRole = selectedRoleFilter === 'all' || u.role === selectedRoleFilter;
    const matchesState = selectedStateFilter === 'all' || u.state.toLowerCase().includes(selectedStateFilter.toLowerCase());
    const matchesSearch =
      searchQuery === '' ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery);
    return matchesRole && matchesState && matchesSearch;
  });

  const handleVerify = (u: any) => {
    updateUserStatus(u.id, { verificationStatus: 'verified' });
    addAuditLog(currentUser.name, currentUser.role, 'VERIFY_USER', `Verified identity for ${u.name}`);
    setActionSuccess(`Verified account for ${u.name}`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleChangeRole = (u: any, newRole: UserRole) => {
    updateUserStatus(u.id, { role: newRole });
    addAuditLog(currentUser.name, currentUser.role, 'CHANGE_ROLE', `Changed role of ${u.name} to ${newRole}`);
    setActionSuccess(`Role of ${u.name} updated to ${newRole.replace('_', ' ')}.`);
    setSelectedUserModal(null);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="bg-white p-4 rounded-2xl border border-[#c1c8c2]/70 shadow-xs flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
        <div>
          <h3 className="font-heading font-bold text-base text-[#012d1d]">
            National Farmer & Value Chain Registry
          </h3>
          <p className="text-xs text-[#717973]">
            Manage credentials, KYC approvals, and role permissions across Nigeria
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <input
            type="text"
            placeholder="Search name, email, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 px-3 rounded-xl border border-[#c1c8c2] text-xs bg-[#f9fbf9] flex-1 lg:w-48"
          />

          <select
            value={selectedRoleFilter}
            onChange={(e) => setSelectedRoleFilter(e.target.value)}
            className="h-9 px-2.5 rounded-xl border border-[#c1c8c2] text-xs bg-[#f9fbf9] font-bold text-[#012d1d]"
          >
            <option value="all">All Roles ({usersList.length})</option>
            <option value="farmer">Farmers</option>
            <option value="cooperative">Cooperatives</option>
            <option value="buyer">Buyers / Processors</option>
            <option value="supplier">Input Suppliers</option>
            <option value="transporter">Transporters</option>
            <option value="institutional_admin">Institutional Admin</option>
            <option value="gov_admin">Gov Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3.5 bg-[#c1ecd4] text-[#002114] border border-[#276a4c]/40 rounded-xl text-xs font-bold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-xs underline hover:text-black">
            Dismiss
          </button>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-[#c1c8c2]/70 p-5 shadow-xs space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-[#e8ece9]">
          <h4 className="font-heading font-bold text-sm text-[#012d1d]">
            Showing {filteredUsers.length} Registered Accounts
          </h4>
          <span className="text-xs text-[#717973]">Identity Verified via National NIMC Rail</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f9fbf9] text-[#012d1d] font-bold border-b border-[#e2e8e4]">
                <th className="p-3">User & Contact</th>
                <th className="p-3">Role</th>
                <th className="p-3">State / LGA</th>
                <th className="p-3">KYC Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8ece9]">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-[#f9fbf9] transition-colors">
                  <td className="p-3 font-bold text-[#1a1c1c]">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={u.photoUrl || getNigerianAvatar(u.name)}
                        alt={u.name}
                        className="w-8 h-8 rounded-full object-cover border border-[#c1c8c2] shrink-0"
                      />
                      <div>
                        <div>{u.name}</div>
                        <div className="text-[10px] text-[#717973] font-normal">{u.email} • {u.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full bg-[#e8ece9] font-bold uppercase text-[10px] text-[#2c342e]">
                      {u.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3 text-[#525a54]">{u.lga ? `${u.lga}, ${u.state}` : u.state}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        u.verificationStatus === 'verified'
                          ? 'bg-[#c1ecd4] text-[#002114]'
                          : 'bg-[#ffdeac] text-[#281900]'
                      }`}
                    >
                      {u.verificationStatus}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    {u.verificationStatus !== 'verified' && (
                      <button
                        onClick={() => handleVerify(u)}
                        className="px-2.5 py-1 bg-[#012d1d] text-white font-bold text-[11px] rounded-lg hover:bg-[#1b4332] active:scale-95 transition-all shadow-xs"
                      >
                        Verify
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedUserModal(u)}
                      className="px-2.5 py-1 border border-[#c1c8c2] bg-white text-[#012d1d] font-bold text-[11px] rounded-lg hover:bg-[#f0f4f1]"
                    >
                      Manage
                    </button>
                    {isSuperAdmin && u.role !== 'super_admin' && (
                      <button
                        onClick={() => deleteUser(u.id)}
                        className="px-2.5 py-1 bg-[#ba1a1a] text-white font-bold text-[11px] rounded-lg hover:bg-[#93000a] transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: User Edit / Role Switch */}
      {selectedUserModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-[#c1c8c2]">
            <div className="flex justify-between items-center pb-2 border-b border-[#e8ece9]">
              <h3 className="font-heading font-bold text-base text-[#012d1d]">
                Manage User: {selectedUserModal.name}
              </h3>
              <button
                onClick={() => setSelectedUserModal(null)}
                className="text-[#717973] hover:text-[#1a1c1c] text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-[#f9fbf9] rounded-xl border border-[#e2e8e4] text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#717973]">Email:</span>
                <span className="font-bold text-[#1a1c1c]">{selectedUserModal.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#717973]">Phone:</span>
                <span className="font-bold text-[#1a1c1c]">{selectedUserModal.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#717973]">State:</span>
                <span className="font-bold text-[#1a1c1c]">{selectedUserModal.state}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#717973]">Current Role:</span>
                <span className="font-bold text-[#012d1d] uppercase">{selectedUserModal.role.replace('_', ' ')}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#2c342e]">Reassign Role / Permission Group:</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {(['farmer', 'cooperative', 'buyer', 'supplier', 'transporter', 'institutional_admin', 'gov_admin'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => handleChangeRole(selectedUserModal, r)}
                    className={`py-2 px-2.5 rounded-xl font-bold text-left border transition-all ${
                      selectedUserModal.role === r
                        ? 'bg-[#012d1d] text-white border-[#012d1d]'
                        : 'bg-white border-[#c1c8c2] text-[#2c342e] hover:bg-[#f0f4f1]'
                    }`}
                  >
                    {r.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedUserModal(null)}
                className="w-full py-2.5 rounded-xl border border-[#c1c8c2] font-bold text-xs hover:bg-[#f9fbf9]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
