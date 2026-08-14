import React from 'react';
import {
  Activity,
  Server,
  Users,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  RefreshCw,
  Cpu,
  HardDrive,
  Radio,
  Globe,
  Layers,
  ArrowUpRight,
  Shield,
  Zap,
} from 'lucide-react';

interface SystemAlert {
  id: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  title: string;
  source: string;
  timestamp: string;
  acknowledged: boolean;
}

interface SuperAdminHealthOverviewProps {
  onPurgeCache: () => void;
  subTab?: 'overview' | 'metrics' | 'alerts';
  onSubTabChange?: (tab: 'overview' | 'metrics' | 'alerts') => void;
}

export const SuperAdminHealthOverview: React.FC<SuperAdminHealthOverviewProps> = ({
  onPurgeCache,
  subTab = 'overview',
  onSubTabChange,
}) => {
  const [internalSubTab, setInternalSubTab] = React.useState<'overview' | 'metrics' | 'alerts'>(subTab);

  React.useEffect(() => {
    if (subTab) setInternalSubTab(subTab);
  }, [subTab]);

  const currentTab = subTab || internalSubTab;
  const setTab = (t: 'overview' | 'metrics' | 'alerts') => {
    setInternalSubTab(t);
    if (onSubTabChange) onSubTabChange(t);
  };
  const [alerts, setAlerts] = React.useState<SystemAlert[]>([
    {
      id: 'alt_1',
      severity: 'WARNING',
      title: 'USSD Telecom Relay (*384*247#) Latency Spike on Airtel Core Node',
      source: 'Telephony Gateway • Northern Zone',
      timestamp: '4 mins ago',
      acknowledged: false,
    },
    {
      id: 'alt_2',
      severity: 'INFO',
      title: 'Sentinel-2 Satellite Soil Moisture Ingestion Synchronized (100% Tiles)',
      source: 'GIS Crop Intelligence Bus',
      timestamp: '18 mins ago',
      acknowledged: true,
    },
    {
      id: 'alt_3',
      severity: 'CRITICAL',
      title: 'NIN-NIMC Identity Rate Limit Reached for Kano Farmer Batch Onboarding',
      source: 'Identity Node • NIMC Proxy #3',
      timestamp: '28 mins ago',
      acknowledged: false,
    },
  ]);

  const microservices = [
    { name: 'Core API Gateway (NGINX / Cloud Run)', status: 'Operational', latency: '22ms', uptime: '99.99%', load: '38%', errorRate: '0.01%' },
    { name: 'NIBSS & Interswitch Settlement Bus', status: 'Operational', latency: '98ms', uptime: '99.96%', load: '58%', errorRate: '0.03%' },
    { name: 'USSD Rural SMS Gateway (*384*247#)', status: 'Degraded', latency: '142ms', uptime: '99.78%', load: '82%', errorRate: '0.24%' },
    { name: 'GIS Sentinel-2 Satellite Engine', status: 'Operational', latency: '180ms', uptime: '99.91%', load: '32%', errorRate: '0.00%' },
    { name: 'Cold-Chain & Freight Telematics IoT', status: 'Operational', latency: '38ms', uptime: '99.98%', load: '44%', errorRate: '0.01%' },
    { name: 'NIMC & CAC Verification Proxy Node', status: 'Operational', latency: '115ms', uptime: '99.85%', load: '49%', errorRate: '0.05%' },
  ];

  const userConcurrencyByRole = [
    { role: 'Smallholder & Commercial Farmers', count: '26,410', share: '56.8%', activeColor: '#10b981' },
    { role: 'Agricultural Cooperatives', count: '3,890', share: '8.4%', activeColor: '#34d399' },
    { role: 'Industrial Buyers & Processors', count: '3,120', share: '6.7%', activeColor: '#60a5fa' },
    { role: 'Input Suppliers & Agro-Dealers', count: '4,450', share: '9.6%', activeColor: '#fbbf24' },
    { role: 'Transporters & Logistics Providers', count: '4,020', share: '8.6%', activeColor: '#a78bfa' },
    { role: 'Field Extension Agents (ADP)', count: '3,780', share: '8.1%', activeColor: '#f472b6' },
    { role: 'Federal & State Governance Admins', count: '820', share: '1.8%', activeColor: '#38bdf8' },
  ];

  const stateConcurrency = [
    { state: 'Kaduna', count: '7,840', zone: 'North West', activeHectares: '142,000 ha' },
    { state: 'Kano', count: '8,920', zone: 'North West', activeHectares: '168,500 ha' },
    { state: 'Benue', count: '6,450', zone: 'North Central', activeHectares: '119,200 ha' },
    { state: 'Oyo', count: '5,310', zone: 'South West', activeHectares: '94,800 ha' },
    { state: 'Niger', count: '5,180', zone: 'North Central', activeHectares: '131,000 ha' },
    { state: 'Enugu', count: '3,890', zone: 'South East', activeHectares: '62,400 ha' },
    { state: 'Cross River', count: '3,210', zone: 'South South', activeHectares: '58,100 ha' },
    { state: 'Taraba', count: '2,890', zone: 'North East', activeHectares: '77,600 ha' },
  ];

  const acknowledgeAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    );
  };

  return (
    <div className="space-y-6">
      {/* Sub Navigation Pills */}
      <div className="flex items-center gap-2 border-b border-[#1b2b22] pb-3 overflow-x-auto">
        <button
          type="button"
          onClick={() => setTab('overview')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            currentTab === 'overview'
              ? 'bg-[#10b981] text-[#0a0f0d]'
              : 'bg-[#0f1713] text-[#8fa89b] hover:text-white border border-[#1b2b22]'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>System Health Overview</span>
        </button>

        <button
          type="button"
          onClick={() => setTab('metrics')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            currentTab === 'metrics'
              ? 'bg-[#10b981] text-[#0a0f0d]'
              : 'bg-[#0f1713] text-[#8fa89b] hover:text-white border border-[#1b2b22]'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Key Platform Metrics</span>
        </button>

        <button
          type="button"
          onClick={() => setTab('alerts')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            currentTab === 'alerts'
              ? 'bg-[#fbbf24] text-[#0a0f0d]'
              : 'bg-[#0f1713] text-[#8fa89b] hover:text-white border border-[#1b2b22]'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Critical Alerts ({alerts.filter((a) => !a.acknowledged).length})</span>
        </button>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-[#0f1713] border border-[#1b2b22] p-4 rounded-2xl space-y-1.5 shadow-md">
          <div className="flex items-center justify-between text-[#8fa89b]">
            <span className="text-[11px] font-mono uppercase tracking-wider">System Uptime</span>
            <Activity className="w-4 h-4 text-[#10b981]" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">99.98%</div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#10b981] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            <span>5/6 Clusters 100% Green</span>
          </div>
        </div>

        <div className="bg-[#0f1713] border border-[#1b2b22] p-4 rounded-2xl space-y-1.5 shadow-md">
          <div className="flex items-center justify-between text-[#8fa89b]">
            <span className="text-[11px] font-mono uppercase tracking-wider">Live Concurrency</span>
            <Users className="w-4 h-4 text-[#34d399]" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">46,490</div>
          <div className="text-[11px] text-[#8fa89b]">36 States + FCT Active</div>
        </div>

        <div className="bg-[#0f1713] border border-[#1b2b22] p-4 rounded-2xl space-y-1.5 shadow-md">
          <div className="flex items-center justify-between text-[#8fa89b]">
            <span className="text-[11px] font-mono uppercase tracking-wider">24h Gross Merch. Value</span>
            <DollarSign className="w-4 h-4 text-[#60a5fa]" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">₦482.4 Million</div>
          <div className="text-[11px] text-[#10b981] font-semibold">+14.8% vs Yesterday</div>
        </div>

        <div className="bg-[#0f1713] border border-[#1b2b22] p-4 rounded-2xl space-y-1.5 shadow-md">
          <div className="flex items-center justify-between text-[#8fa89b]">
            <span className="text-[11px] font-mono uppercase tracking-wider">Escrow Service Fee (1%)</span>
            <TrendingUp className="w-4 h-4 text-[#fbbf24]" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">₦4.82 Million</div>
          <div className="text-[11px] text-[#8fa89b]">Net Platform Retained</div>
        </div>
      </div>

      {/* Critical System Alerts Feed */}
      <div className="bg-[#0f1713] border border-[#1b2b22] rounded-2xl p-5 shadow-md space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#1b2b22]">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#fbbf24]" />
            <h3 className="font-bold text-sm text-white">Live Critical System Alerts & Telemetry Bus</h3>
          </div>
          <span className="text-xs font-mono text-[#8fa89b]">
            {alerts.filter((a) => !a.acknowledged).length} Unresolved Incidents
          </span>
        </div>

        <div className="space-y-2">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors ${
                alert.severity === 'CRITICAL'
                  ? 'bg-[#2a0e0e] border-[#5c1d1d] text-[#fca5a5]'
                  : alert.severity === 'WARNING'
                  ? 'bg-[#241a0b] border-[#5c3e12] text-[#fde68a]'
                  : 'bg-[#0a1812] border-[#1b3d2b] text-[#a7f3d0]'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {alert.severity === 'CRITICAL' ? (
                  <AlertOctagon className="w-4 h-4 text-[#ef4444] shrink-0 mt-0.5" />
                ) : alert.severity === 'WARNING' ? (
                  <AlertTriangle className="w-4 h-4 text-[#f59e0b] shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-semibold text-xs text-white">{alert.title}</div>
                  <div className="text-[11px] opacity-80">
                    Source: {alert.source} • <span className="font-mono">{alert.timestamp}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {alert.acknowledged ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/10 text-white font-bold">
                    ACKNOWLEDGED
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => acknowledgeAlert(alert.id)}
                    className="px-2.5 py-1 bg-white/15 hover:bg-white/25 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    Acknowledge
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Microservices & Integration Gateway Telemetry */}
      <div className="bg-[#0f1713] border border-[#1b2b22] rounded-2xl p-5 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-[#1b2b22]">
          <div>
            <h3 className="font-bold text-sm text-white">Microservice Mesh & Banking Gateway Health</h3>
            <p className="text-xs text-[#8fa89b]">Real-time latency, uptime, cluster load, and packet drops</p>
          </div>
          <button
            type="button"
            onClick={onPurgeCache}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1b2b22] hover:bg-[#253b2f] text-[#34d399] text-xs font-bold rounded-xl border border-[#2d4738] transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Purge Edge Redis Buffer</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {microservices.map((svc, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-[#0a0f0d] rounded-xl border border-[#1b2b22] space-y-2 hover:border-[#34d399]/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-bold text-xs text-white leading-snug">{svc.name}</span>
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-full shrink-0 font-mono ${
                    svc.status === 'Operational'
                      ? 'bg-[#064e3b] text-[#6ee7b7]'
                      : 'bg-[#78350f] text-[#fde68a]'
                  }`}
                >
                  {svc.status}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-1.5 pt-1 border-t border-[#1b2b22] text-center font-mono">
                <div>
                  <div className="text-[10px] text-[#8fa89b]">Latency</div>
                  <div className="text-xs font-bold text-white">{svc.latency}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#8fa89b]">Uptime</div>
                  <div className="text-xs font-bold text-[#10b981]">{svc.uptime}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#8fa89b]">Load</div>
                  <div className="text-xs font-bold text-white">{svc.load}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#8fa89b]">Error %</div>
                  <div className="text-xs font-bold text-[#10b981]">{svc.errorRate}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Concurrency Breakdown & State Density */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Role Concurrency */}
        <div className="bg-[#0f1713] border border-[#1b2b22] rounded-2xl p-5 shadow-md space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#1b2b22]">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#34d399]" />
              <h4 className="font-bold text-xs text-white">Active Concurrency by Value Chain Role</h4>
            </div>
            <span className="text-[11px] font-mono text-[#10b981]">46,490 Active</span>
          </div>

          <div className="space-y-2.5">
            {userConcurrencyByRole.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#c1d3c9]">{item.role}</span>
                  <span className="font-mono font-bold text-white">
                    {item.count} <span className="text-[#8fa89b] font-normal">({item.share})</span>
                  </span>
                </div>
                <div className="w-full bg-[#1b2b22] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: item.share, backgroundColor: item.activeColor }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* State Density */}
        <div className="bg-[#0f1713] border border-[#1b2b22] rounded-2xl p-5 shadow-md space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#1b2b22]">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#60a5fa]" />
              <h4 className="font-bold text-xs text-white">Top Active Agricultural States (Hectare Flow)</h4>
            </div>
            <span className="text-[11px] font-mono text-[#8fa89b]">8 Focus States</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {stateConcurrency.map((st, idx) => (
              <div key={idx} className="p-2.5 bg-[#0a0f0d] border border-[#1b2b22] rounded-xl space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">{st.state}</span>
                  <span className="text-[10px] text-[#8fa89b]">{st.zone}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#10b981] font-mono">{st.count} users</span>
                  <span className="text-[#c1d3c9] font-mono">{st.activeHectares}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
