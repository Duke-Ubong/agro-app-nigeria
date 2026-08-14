import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export const AdminBroadcastDesk: React.FC = () => {
  const { broadcasts, addBroadcast } = useApp();
  const { role, user } = useAuth();

  const [newBroadcast, setNewBroadcast] = useState({
    title: '',
    body: '',
    targetRole: 'all' as 'all' | UserRole,
    targetState: 'All States',
    priority: 'urgent' as 'info' | 'urgent' | 'critical',
  });
  const [sendSMS, setSendSMS] = useState<boolean>(true);
  const [sendPush, setSendPush] = useState<boolean>(true);
  const [broadcastSentSuccess, setBroadcastSentSuccess] = useState<string | null>(null);

  const isGovAdmin = role === 'gov_admin';
  const isInstAdmin = role === 'institutional_admin';

  const handleCreateBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBroadcast.title || !newBroadcast.body) return;

    addBroadcast({
      ...newBroadcast,
      senderName: isGovAdmin
        ? 'Federal Ministry Directorate (FMAFS)'
        : isInstAdmin
        ? 'State Agricultural Development Programme (ADP)'
        : 'USUCO Agro-Connect Executive Command',
    });

    setBroadcastSentSuccess(
      `Broadcast "${newBroadcast.title}" successfully dispatched to ${newBroadcast.targetRole === 'all' ? 'All Registered Users' : newBroadcast.targetRole} in ${newBroadcast.targetState} via ${sendSMS ? 'SMS/USSD & Push' : 'Push Notification'}.`
    );

    setNewBroadcast({
      title: '',
      body: '',
      targetRole: 'all',
      targetState: 'All States',
      priority: 'urgent',
    });

    setTimeout(() => setBroadcastSentSuccess(null), 6000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-4 rounded-2xl border border-[#c1c8c2]/70 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-[#012d1d] text-[24px]">campaign</span>
          <div>
            <h3 className="font-heading font-bold text-base text-[#012d1d]">
              National Agricultural Advisory & Broadcast Center
            </h3>
            <p className="text-xs text-[#717973]">
              Dispatch geo-targeted emergency advisories, input alerts, and policy circulars
            </p>
          </div>
        </div>

        <span className="text-xs font-bold text-[#012d1d] bg-[#c1ecd4] px-3 py-1 rounded-xl">
          Multi-channel: USSD, SMS & App
        </span>
      </div>

      {broadcastSentSuccess && (
        <div className="p-3.5 bg-[#c1ecd4] text-[#002114] border border-[#276a4c]/40 rounded-xl text-xs font-bold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            <span>{broadcastSentSuccess}</span>
          </div>
          <button onClick={() => setBroadcastSentSuccess(null)} className="text-xs underline hover:text-black">
            Dismiss
          </button>
        </div>
      )}

      {/* Broadcast Form & Dispatch History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Send Broadcast Card */}
        <div className="bg-white rounded-2xl border border-[#c1c8c2]/70 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#e8ece9]">
            <span className="material-symbols-outlined text-[#012d1d] text-[20px]">send</span>
            <h4 className="font-heading font-bold text-sm text-[#012d1d]">Compose Official Dispatch</h4>
          </div>

          <form onSubmit={handleCreateBroadcast} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold mb-1 text-[#2c342e]">Broadcast Title</label>
              <input
                type="text"
                required
                value={newBroadcast.title}
                onChange={(e) => setNewBroadcast({ ...newBroadcast, title: e.target.value })}
                placeholder="e.g. Locust Warning or Fertilizer Subsidy Launch"
                className="w-full h-9 px-3 rounded-xl border border-[#c1c8c2] bg-[#f9fbf9] font-medium"
              />
            </div>

            <div>
              <label className="block font-bold mb-1 text-[#2c342e]">Message Body (Multi-language Translated)</label>
              <textarea
                required
                rows={3}
                value={newBroadcast.body}
                onChange={(e) => setNewBroadcast({ ...newBroadcast, body: e.target.value })}
                placeholder="Enter official advisory, instructions, or subsidy redemption codes..."
                className="w-full p-2.5 rounded-xl border border-[#c1c8c2] bg-[#f9fbf9] font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold mb-1 text-[#2c342e]">Priority Level</label>
                <select
                  value={newBroadcast.priority}
                  onChange={(e) => setNewBroadcast({ ...newBroadcast, priority: e.target.value as any })}
                  className="w-full h-9 px-2 rounded-xl border border-[#c1c8c2] bg-white font-semibold"
                >
                  <option value="info">Info / General</option>
                  <option value="urgent">Urgent Warning</option>
                  <option value="critical">Critical Emergency</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1 text-[#2c342e]">Target State</label>
                <select
                  value={newBroadcast.targetState}
                  onChange={(e) => setNewBroadcast({ ...newBroadcast, targetState: e.target.value })}
                  className="w-full h-9 px-2 rounded-xl border border-[#c1c8c2] bg-white font-semibold"
                >
                  <option value="All States">All 36 States + FCT</option>
                  <option value="Kaduna">Kaduna State</option>
                  <option value="Kano">Kano State</option>
                  <option value="Benue">Benue State</option>
                  <option value="Ogun">Ogun State</option>
                  <option value="Niger">Niger State</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold mb-1 text-[#2c342e]">Recipient Segment</label>
              <select
                value={newBroadcast.targetRole}
                onChange={(e) => setNewBroadcast({ ...newBroadcast, targetRole: e.target.value as any })}
                className="w-full h-9 px-2 rounded-xl border border-[#c1c8c2] bg-white font-semibold"
              >
                <option value="all">All Roles (Farmers, Coops, Buyers, Suppliers)</option>
                <option value="farmer">Smallholder Farmers Only</option>
                <option value="cooperative">Farmer Cooperatives</option>
                <option value="supplier">Certified Input Suppliers</option>
                <option value="transporter">Haulage & Transporters</option>
              </select>
            </div>

            <div className="space-y-1 pt-1 text-[11px] text-[#525a54]">
              <label className="flex items-center gap-2 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={sendSMS}
                  onChange={(e) => setSendSMS(e.target.checked)}
                  className="rounded text-[#012d1d]"
                />
                <span>Broadcast via Telecom SMS / USSD (Rural Offline Farmers)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={sendPush}
                  onChange={(e) => setSendPush(e.target.checked)}
                  className="rounded text-[#012d1d]"
                />
                <span>Send Instant Mobile Push & In-App Notification</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#012d1d] text-white font-bold text-xs rounded-xl hover:bg-[#1b4332] active:scale-95 transition-all shadow-xs"
            >
              Dispatch Official Broadcast
            </button>
          </form>
        </div>

        {/* History Feed */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#c1c8c2]/70 p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-[#e8ece9]">
            <h4 className="font-heading font-bold text-sm text-[#012d1d]">Broadcast Dispatch History</h4>
            <span className="text-xs text-[#717973] font-semibold">{broadcasts.length} Messages Dispatched</span>
          </div>

          <div className="space-y-3">
            {broadcasts.map((b) => (
              <div key={b.id} className="p-4 bg-[#f9fbf9] border border-[#e2e8e4] rounded-xl space-y-2">
                <div className="flex justify-between items-start">
                  <div className="font-bold text-sm text-[#012d1d]">{b.title}</div>
                  <span
                    className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-bold ${
                      b.priority === 'critical'
                        ? 'bg-[#ffdad6] text-[#410002]'
                        : b.priority === 'urgent'
                        ? 'bg-[#ffdeac] text-[#281900]'
                        : 'bg-[#c1ecd4] text-[#002114]'
                    }`}
                  >
                    {b.priority}
                  </span>
                </div>

                <p className="text-xs text-[#525a54]">{b.body}</p>

                <div className="text-[11px] text-[#717973] pt-2 flex flex-wrap justify-between gap-2 border-t border-[#e2e8e4]">
                  <span>Dispatched by: <strong className="text-[#012d1d]">{b.senderName}</strong></span>
                  <span>Target: {b.targetRole === 'all' ? 'All Roles' : b.targetRole} • {b.targetState}</span>
                  <span>{new Date(b.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
