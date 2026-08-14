import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { AdminGovernanceOverview } from '../admin/AdminGovernanceOverview';
import { SuperAdminInfrastructure } from '../admin/SuperAdminInfrastructure';
import { StateADPCommand } from '../admin/StateADPCommand';
import { OperationsSupportDisputes } from '../admin/OperationsSupportDisputes';
import { MinistryPolicyIntelligence } from '../admin/MinistryPolicyIntelligence';
import { ComplianceAuditTrail } from '../admin/ComplianceAuditTrail';
import { AdminUsersManagement } from '../admin/AdminUsersManagement';
import { AdminBroadcastDesk } from '../admin/AdminBroadcastDesk';

export const AdminPortal: React.FC = () => {
  const { role } = useAuth();
  const { usersList, auditLogs, broadcasts, adminTab, setAdminTab, setActiveView } = useApp();

  type AdminTab =
    | 'overview'
    | 'super_admin'
    | 'state_adp'
    | 'operations'
    | 'policy'
    | 'compliance'
    | 'users'
    | 'broadcasts';

  const [activeTab, setActiveTabState] = useState<AdminTab>((adminTab as AdminTab) || 'overview');

  const handleTabChange = (tab: AdminTab) => {
    setActiveTabState(tab);
    if (setAdminTab) {
      setAdminTab(tab);
    }
  };

  const isSuperAdmin = role === 'super_admin';
  const isGovAdmin = role === 'gov_admin';
  const isInstAdmin = role === 'institutional_admin';

  const tabList = [
    { id: 'overview' as const, label: 'Executive Overview', icon: 'dashboard', badge: 'Live' },
    { id: 'super_admin' as const, label: 'Infrastructure & Controls', icon: 'dns', badge: isSuperAdmin ? 'Super' : undefined },
    { id: 'state_adp' as const, label: 'State ADP Command', icon: 'location_city' },
    { id: 'operations' as const, label: 'Operations & Disputes', icon: 'support_agent' },
    { id: 'policy' as const, label: 'Ministry & BOA Policy', icon: 'policy' },
    { id: 'compliance' as const, label: 'Audit & AML Suite', icon: 'verified_user' },
    { id: 'users' as const, label: 'User Registry', icon: 'group', badge: `${usersList.length}` },
    { id: 'broadcasts' as const, label: 'Broadcasts & SMS', icon: 'campaign' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Partnership Header */}
      <div className="bg-[#012d1d] text-white p-5 rounded-2xl shadow-xs border border-[#1b4332] flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-[#ba1a1a] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
              {isSuperAdmin ? 'Super Admin' : isGovAdmin ? 'Federal Ministry Director' : 'State ADP Admin'}
            </span>
            <span className="text-xs text-[#86af99]">
              Federal Ministry of Agriculture and Food Security • USUCO Agro-Connect
            </span>
          </div>
          <h1 className="font-heading font-bold text-xl sm:text-2xl mt-1 text-white">
            National Agricultural Governance Command Center
          </h1>
          <p className="text-xs text-[#86af99] mt-0.5">
            Real-time Food Security Governance, Multi-State Silos, Grain Balance Sheets & Inter-State Trade
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => setActiveView('admin_department_select')}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#1b4332] hover:bg-[#276a4c] text-[#c1ecd4] rounded-xl text-xs font-bold transition-colors cursor-pointer border border-[#2d5a42]"
            title="Switch administrative department or shell"
          >
            <span className="material-symbols-outlined text-[16px]">switch_account</span>
            <span>Switch Department</span>
          </button>

          <div className="flex items-center gap-2 bg-[#002114] p-1.5 rounded-xl border border-[#1b4332]">
            <span className="text-[11px] font-bold text-[#86af99] px-2">Portal Status:</span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-[#1b4332] text-[#c1ecd4] rounded-lg text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse" />
              <span>36 States Live</span>
            </span>
          </div>
        </div>
      </div>

      {/* Sub-portal Navigation Tabs Ribbon */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-[#c1c8c2]/60">
        {tabList.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#012d1d] text-white shadow-sm'
                  : 'bg-white text-[#3f6653] hover:bg-[#f0f4f1] border border-[#c1c8c2]/50'
              }`}
            >
              <span className={`material-symbols-outlined text-[18px] ${isActive ? 'text-[#c1ecd4]' : 'text-[#012d1d]'}`}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-[#1b4332] text-[#c1ecd4]' : 'bg-[#e6ece8] text-[#012d1d]'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Tab View Rendering */}
      <div>
        {activeTab === 'overview' && <AdminGovernanceOverview />}
        {activeTab === 'super_admin' && <SuperAdminInfrastructure />}
        {activeTab === 'state_adp' && <StateADPCommand />}
        {activeTab === 'operations' && <OperationsSupportDisputes />}
        {activeTab === 'policy' && <MinistryPolicyIntelligence />}
        {activeTab === 'compliance' && <ComplianceAuditTrail />}
        {activeTab === 'users' && <AdminUsersManagement />}
        {activeTab === 'broadcasts' && <AdminBroadcastDesk />}
      </div>
    </div>
  );
};
export default AdminPortal;
