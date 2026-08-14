import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export const SuperAdminInfrastructure: React.FC = () => {
  const { auditLogs, addAuditLog } = useApp();
  const { user } = useAuth();

  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(false);
  const [priceCircuitBreaker, setPriceCircuitBreaker] = useState<boolean>(true);
  const [escrowAutoFreeze, setEscrowAutoFreeze] = useState<boolean>(true);
  const [debugLogging, setDebugLogging] = useState<boolean>(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Microservices & API Gateway Telemetry Mock
  const [services, setServices] = useState([
    { name: 'Core API Gateway (NGINX / Cloud Run)', status: 'Operational', latency: '42ms', uptime: '99.98%', requestsPerSec: '1,420 rps' },
    { name: 'Payment & Bank Settlement Bridge (Interswitch / NIBSS)', status: 'Operational', latency: '128ms', uptime: '99.94%', requestsPerSec: '380 rps' },
    { name: 'USSD & Rural SMS Gateway (MTN / Airtel / Glo)', status: 'Operational', latency: '85ms', uptime: '99.91%', requestsPerSec: '820 rps' },
    { name: 'GIS Satellite & Weather Intelligence Engine', status: 'Operational', latency: '210ms', uptime: '99.85%', requestsPerSec: '140 rps' },
    { name: 'Freight & GPS Truck Telematics Stream', status: 'Operational', latency: '65ms', uptime: '99.99%', requestsPerSec: '490 rps' },
    { name: 'Identity & NIN/CAC KYC Verification Microservice', status: 'Operational', latency: '190ms', uptime: '99.78%', requestsPerSec: '95 rps' },
  ]);

  const handleToggleMaintenance = () => {
    const newState = !maintenanceMode;
    setMaintenanceMode(newState);
    addAuditLog(
      user.name,
      user.role,
      'TOGGLE_MAINTENANCE',
      `Platform maintenance mode ${newState ? 'ACTIVATED' : 'DEACTIVATED'}`
    );
    setActionSuccess(`Platform Maintenance Mode successfully ${newState ? 'ENABLED' : 'DISABLED'}.`);
    setTimeout(() => setActionSuccess(null), 5000);
  };

  const handleToggleCircuitBreaker = () => {
    const newState = !priceCircuitBreaker;
    setPriceCircuitBreaker(newState);
    addAuditLog(
      user.name,
      user.role,
      'CIRCUIT_BREAKER_TOGGLE',
      `Produce price spike circuit breaker ${newState ? 'ENGAGED' : 'DISENGAGED'}`
    );
    setActionSuccess(`Automated Price Gouging Circuit Breaker ${newState ? 'ACTIVATED' : 'PAUSED'}.`);
    setTimeout(() => setActionSuccess(null), 5000);
  };

  const handleToggleEscrowFreeze = () => {
    const newState = !escrowAutoFreeze;
    setEscrowAutoFreeze(newState);
    addAuditLog(
      user.name,
      user.role,
      'ESCROW_FREEZE_TOGGLE',
      `High-risk escrow auto-freeze threshold ${newState ? 'ENABLED' : 'DISABLED'}`
    );
    setActionSuccess(`Escrow High-Risk Safety Thresholds ${newState ? 'ACTIVE' : 'MUTED'}.`);
    setTimeout(() => setActionSuccess(null), 5000);
  };

  const handlePurgeCache = () => {
    addAuditLog(user.name, user.role, 'PURGE_REDIS_CACHE', 'Purged Edge CDN & Redis Cache nationwide.');
    setActionSuccess('Nationwide Redis Cache and Edge CDN buffers successfully purged.');
    setTimeout(() => setActionSuccess(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Alert if Maintenance Mode Enabled */}
      {maintenanceMode && (
        <div className="p-4 bg-[#ba1a1a] text-white rounded-2xl flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[28px] animate-pulse">warning</span>
            <div>
              <h4 className="font-bold text-sm">System Maintenance Mode is Active</h4>
              <p className="text-xs opacity-90">All non-admin public traffic is gated with standard maintenance screen.</p>
            </div>
          </div>
          <button
            onClick={handleToggleMaintenance}
            className="px-3 py-1.5 bg-white text-[#ba1a1a] font-bold text-xs rounded-xl hover:bg-[#ffdad6] transition-colors"
          >
            Disable Maintenance
          </button>
        </div>
      )}

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

      {/* Infrastructure Telemetry Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#c1c8c2]/70 p-4 rounded-2xl shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#717973]">System Uptime (30d)</span>
          <div className="font-heading font-bold text-2xl text-[#012d1d]">99.98%</div>
          <span className="text-[11px] text-[#276a4c] font-bold">Multi-region Redundancy</span>
        </div>

        <div className="bg-white border border-[#c1c8c2]/70 p-4 rounded-2xl shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#717973]">Avg API Response</span>
          <div className="font-heading font-bold text-2xl text-[#012d1d]">64 ms</div>
          <span className="text-[11px] text-[#276a4c] font-bold">Edge Accelerated</span>
        </div>

        <div className="bg-white border border-[#c1c8c2]/70 p-4 rounded-2xl shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#717973]">Daily USSD / SMS Queries</span>
          <div className="font-heading font-bold text-2xl text-[#012d1d]">314,200</div>
          <span className="text-[11px] text-[#717973]">Feature phone reach</span>
        </div>

        <div className="bg-white border border-[#c1c8c2]/70 p-4 rounded-2xl shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#717973]">Active DB Connections</span>
          <div className="font-heading font-bold text-2xl text-[#012d1d]">42 / 500</div>
          <span className="text-[11px] text-[#276a4c] font-bold">Auto-scaling healthy</span>
        </div>
      </div>

      {/* Emergency Platform Switches & Governance Controls */}
      <div className="bg-white rounded-2xl border border-[#c1c8c2]/70 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#e8ece9]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#012d1d] text-[22px]">admin_panel_settings</span>
            <div>
              <h3 className="font-heading font-bold text-sm text-[#012d1d]">
                Emergency Platform Governance & Circuit Breakers
              </h3>
              <p className="text-[11px] text-[#717973]">
                Super-administrator override switches for security, financial integrity, and system health
              </p>
            </div>
          </div>
          <button
            onClick={handlePurgeCache}
            className="px-3 py-1.5 bg-[#f0f4f1] text-[#012d1d] font-bold text-xs rounded-xl hover:bg-[#e2e8e4] active:scale-95 transition-all border border-[#c1c8c2]/60 flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">cached</span>
            <span>Purge CDN & Cache</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Switch 1 */}
          <div className="p-4 rounded-xl border border-[#e2e8e4] bg-[#f9fbf9] space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-xs text-[#1a1c1c]">Platform Maintenance Mode</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    maintenanceMode ? 'bg-[#ba1a1a] text-white' : 'bg-[#c1ecd4] text-[#002114]'
                  }`}
                >
                  {maintenanceMode ? 'ACTIVE' : 'STANDBY'}
                </span>
              </div>
              <p className="text-[11px] text-[#525a54]">
                Temporarily suspends public web and mobile requests for database migrations.
              </p>
            </div>
            <button
              onClick={handleToggleMaintenance}
              className={`w-full py-2 text-xs font-bold rounded-xl transition-all ${
                maintenanceMode
                  ? 'bg-[#012d1d] text-white hover:bg-[#1b4332]'
                  : 'bg-[#ba1a1a] text-white hover:bg-[#93000a]'
              }`}
            >
              {maintenanceMode ? 'Deactivate Maintenance' : 'Activate Maintenance'}
            </button>
          </div>

          {/* Switch 2 */}
          <div className="p-4 rounded-xl border border-[#e2e8e4] bg-[#f9fbf9] space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-xs text-[#1a1c1c]">Anti-Gouging Circuit Breaker</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    priceCircuitBreaker ? 'bg-[#c1ecd4] text-[#002114]' : 'bg-[#ffdeac] text-[#281900]'
                  }`}
                >
                  {priceCircuitBreaker ? 'ARMED' : 'DISABLED'}
                </span>
              </div>
              <p className="text-[11px] text-[#525a54]">
                Auto-flags market listings with prices exceeding +40% of national average.
              </p>
            </div>
            <button
              onClick={handleToggleCircuitBreaker}
              className="w-full py-2 text-xs font-bold rounded-xl bg-[#012d1d] text-white hover:bg-[#1b4332] transition-colors"
            >
              {priceCircuitBreaker ? 'Disengage Breaker' : 'Engage Breaker'}
            </button>
          </div>

          {/* Switch 3 */}
          <div className="p-4 rounded-xl border border-[#e2e8e4] bg-[#f9fbf9] space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-xs text-[#1a1c1c]">Escrow High-Risk Auto-Freeze</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    escrowAutoFreeze ? 'bg-[#c1ecd4] text-[#002114]' : 'bg-[#ffdeac] text-[#281900]'
                  }`}
                >
                  {escrowAutoFreeze ? 'ARMED' : 'DISABLED'}
                </span>
              </div>
              <p className="text-[11px] text-[#525a54]">
                Locks transactions &gt; ₦5,000,000 for manual compliance review before settlement.
              </p>
            </div>
            <button
              onClick={handleToggleEscrowFreeze}
              className="w-full py-2 text-xs font-bold rounded-xl bg-[#012d1d] text-white hover:bg-[#1b4332] transition-colors"
            >
              {escrowAutoFreeze ? 'Mute Auto-Freeze' : 'Activate Auto-Freeze'}
            </button>
          </div>
        </div>
      </div>

      {/* Services Health Matrix */}
      <div className="bg-white rounded-2xl border border-[#c1c8c2]/70 p-5 shadow-xs space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-[#e8ece9]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#012d1d] text-[22px]">dns</span>
            <div>
              <h3 className="font-heading font-bold text-sm text-[#012d1d]">Microservices Health & Integrations</h3>
              <p className="text-[11px] text-[#717973]">Real-time latency and connectivity to Nigerian payment & telecom rails</p>
            </div>
          </div>
          <span className="text-[10px] font-bold bg-[#c1ecd4] text-[#002114] px-2 py-0.5 rounded-full uppercase">
            All 6 Nodes Green
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f9fbf9] text-[#012d1d] font-bold border-b border-[#e2e8e4]">
                <th className="p-3">Microservice Component</th>
                <th className="p-3">Status</th>
                <th className="p-3">Latency</th>
                <th className="p-3">Uptime</th>
                <th className="p-3">Throughput</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8ece9]">
              {services.map((srv, idx) => (
                <tr key={idx} className="hover:bg-[#f9fbf9] transition-colors">
                  <td className="p-3 font-bold text-[#1a1c1c]">{srv.name}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full bg-[#c1ecd4] text-[#002114] font-bold text-[10px]">
                      {srv.status}
                    </span>
                  </td>
                  <td className="p-3 font-mono font-semibold text-[#012d1d]">{srv.latency}</td>
                  <td className="p-3 font-semibold">{srv.uptime}</td>
                  <td className="p-3 text-[#525a54]">{srv.requestsPerSec}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
