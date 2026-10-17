import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { AgroChainObservatory } from './AgroChainObservatory';

export const AdminPortal: React.FC = () => {
  const { role } = useAuth();
  const {
    usersList,
    updateUserStatus,
    deleteUser,
    auditLogs,
    broadcasts,
    addBroadcast,
    listings,
    orders,
    loans,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'broadcasts' | 'audit'>('overview');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [newBroadcast, setNewBroadcast] = useState({
    title: '',
    body: '',
    targetRole: 'all' as 'all' | UserRole,
    targetState: 'All States',
    priority: 'urgent' as 'info' | 'urgent' | 'critical',
  });

  const isSuperAdmin = role === 'super_admin';
  const isGovAdmin = role === 'gov_admin';
  const isInstAdmin = role === 'institutional_admin';

  const filteredUsers = usersList.filter(
    (u) => selectedRoleFilter === 'all' || u.role === selectedRoleFilter
  );

  const handleCreateBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBroadcast.title || !newBroadcast.body) return;
    addBroadcast({
      ...newBroadcast,
      senderName: isGovAdmin
        ? 'Federal Ministry Directorate'
        : isInstAdmin
        ? 'State Agricultural Development Programme'
        : 'USUCO System Administrator',
    });
    setNewBroadcast({
      title: '',
      body: '',
      targetRole: 'all',
      targetState: 'All States',
      priority: 'urgent',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#012d1d] text-white p-5 rounded-2xl shadow-sm border border-[#1b4332] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#ba1a1a] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
              {isSuperAdmin ? 'Super Admin' : isGovAdmin ? 'Government Director' : 'State ADP Admin'}
            </span>
            <span className="text-xs text-[#86af99]">FMAFS & USUCO Agro-Connect Executive Portal</span>
          </div>
          <h1 className="font-heading font-bold text-2xl mt-1">
            Nationwide Agricultural Command Center
          </h1>
          <p className="text-xs text-[#86af99]">
            Monitoring 36 States + FCT • Real-time Food Security Analytics & Regulatory Oversight
          </p>
        </div>

        <div className="flex bg-[#1b4332] p-1 rounded-xl text-xs font-bold text-[#86af99] overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'overview' ? 'bg-[#012d1d] text-white shadow-xs' : 'hover:text-white'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-ping" />
            <span>Agro-Chain Observatory</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'users' ? 'bg-[#012d1d] text-white shadow-xs' : 'hover:text-white'
            }`}
          >
            Participants Directory ({usersList.length})
          </button>
          <button
            onClick={() => setActiveTab('broadcasts')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'broadcasts' ? 'bg-[#012d1d] text-white shadow-xs' : 'hover:text-white'
            }`}
          >
            Regulatory Directives
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'audit' ? 'bg-[#012d1d] text-white shadow-xs' : 'hover:text-white'
            }`}
          >
            NDPR & Audit Logs
          </button>
        </div>
      </div>

      {/* Tab 1: Agro-Chain Intelligence & Regulatory Decision Observatory */}
      {activeTab === 'overview' && <AgroChainObservatory />}

      {/* Tab 2: User Role Management */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-xl border border-[#c1c8c2] p-4 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-[#e2e2e2]">
            <div>
              <h3 className="font-heading font-bold text-base text-[#012d1d]">Identity & Role Management</h3>
              <p className="text-xs text-[#717973]">Review, verify, update permissions, or ban platform accounts.</p>
            </div>

            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
              className="h-10 px-3 rounded-lg border border-[#717973] bg-white text-xs font-bold text-[#1a1c1c]"
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

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#f3f3f3] text-[#012d1d] font-bold border-b border-[#c1c8c2]">
                  <th className="p-2.5">User / Organization</th>
                  <th className="p-2.5">Role</th>
                  <th className="p-2.5">State</th>
                  <th className="p-2.5">Verification</th>
                  <th className="p-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e2e2]">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-[#f9f9f9]">
                    <td className="p-2.5 font-bold text-[#1a1c1c]">
                      <div>{u.name}</div>
                      <div className="text-[10px] text-[#717973] font-normal">{u.email} • {u.phone}</div>
                    </td>
                    <td className="p-2.5">
                      <span className="px-2 py-0.5 rounded bg-[#e8e8e8] font-semibold uppercase text-[10px]">
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-2.5">{u.state}</td>
                    <td className="p-2.5">
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
                    <td className="p-2.5 text-right space-x-2">
                      {u.verificationStatus !== 'verified' && (
                        <button
                          onClick={() => updateUserStatus(u.id, { verificationStatus: 'verified' })}
                          className="px-2.5 py-1 bg-[#012d1d] text-white font-bold text-[10px] rounded hover:bg-[#1b4332]"
                        >
                          Approve KYC
                        </button>
                      )}
                      {isSuperAdmin && u.role !== 'super_admin' && (
                        <button
                          onClick={() => deleteUser(u.id)}
                          className="px-2.5 py-1 bg-[#ba1a1a] text-white font-bold text-[10px] rounded hover:bg-[#93000a]"
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
      )}

      {/* Tab 3: Broadcast Communications */}
      {activeTab === 'broadcasts' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-[#c1c8c2] p-4 space-y-3">
            <h3 className="font-heading font-bold text-sm text-[#012d1d]">Send Federal / State Advisory Broadcast</h3>
            <form onSubmit={handleCreateBroadcast} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Broadcast Title</label>
                <input
                  type="text"
                  required
                  value={newBroadcast.title}
                  onChange={(e) => setNewBroadcast({ ...newBroadcast, title: e.target.value })}
                  placeholder="e.g. Pest Warning or Subsidy Launch"
                  className="w-full h-10 px-3 rounded-lg border border-[#717973]"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Broadcast Message Body</label>
                <textarea
                  required
                  rows={3}
                  value={newBroadcast.body}
                  onChange={(e) => setNewBroadcast({ ...newBroadcast, body: e.target.value })}
                  placeholder="Official details..."
                  className="w-full p-2.5 rounded-lg border border-[#717973]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">Target Priority</label>
                  <select
                    value={newBroadcast.priority}
                    onChange={(e) => setNewBroadcast({ ...newBroadcast, priority: e.target.value as any })}
                    className="w-full h-10 px-2 rounded-lg border border-[#717973]"
                  >
                    <option value="info">Info</option>
                    <option value="urgent">Urgent</option>
                    <option value="critical">Critical Emergency</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">Target Role</label>
                  <select
                    value={newBroadcast.targetRole}
                    onChange={(e) => setNewBroadcast({ ...newBroadcast, targetRole: e.target.value as any })}
                    className="w-full h-10 px-2 rounded-lg border border-[#717973]"
                  >
                    <option value="all">All Roles</option>
                    <option value="farmer">Farmers Only</option>
                    <option value="cooperative">Cooperatives Only</option>
                    <option value="supplier">Input Suppliers</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#012d1d] text-white font-bold rounded-xl hover:bg-[#1b4332]"
              >
                Send Official Broadcast
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl border border-[#c1c8c2] p-4 space-y-3">
            <h3 className="font-heading font-bold text-sm text-[#012d1d]">Active Ministry Broadcast History</h3>
            <div className="space-y-2">
              {broadcasts.map((b) => (
                <div key={b.id} className="p-3 bg-[#f9f9f9] border border-[#e2e2e2] rounded-lg space-y-1">
                  <div className="flex justify-between items-start font-bold text-xs text-[#012d1d]">
                    <span>{b.title}</span>
                    <span className="text-[10px] uppercase bg-[#c1ecd4] px-2 py-0.5 rounded text-[#002114]">
                      {b.priority}
                    </span>
                  </div>
                  <p className="text-xs text-[#414844]">{b.body}</p>
                  <div className="text-[10px] text-[#717973] pt-1 flex justify-between border-t border-[#e2e2e2]">
                    <span>Sender: {b.senderName}</span>
                    <span>{new Date(b.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Security & Audit Logs */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-xl border border-[#c1c8c2] p-4 space-y-3">
          <h3 className="font-heading font-bold text-sm text-[#012d1d]">System Security & Audit Trail</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#f3f3f3] text-[#012d1d] font-bold">
                  <th className="p-2">Timestamp</th>
                  <th className="p-2">Actor</th>
                  <th className="p-2">Action</th>
                  <th className="p-2">Details</th>
                  <th className="p-2">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e2e2]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#f9f9f9]">
                    <td className="p-2 text-[#717973]">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="p-2 font-bold text-[#1a1c1c]">{log.actorName} ({log.actorRole})</td>
                    <td className="p-2 font-mono font-bold text-[#012d1d]">{log.action}</td>
                    <td className="p-2 text-[#414844]">{log.details}</td>
                    <td className="p-2 text-[#717973] font-mono">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
