import React, { useState, useEffect } from 'react';
import {
  Terminal,
  Server,
  Activity,
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Search,
  Download,
  Trash2,
  RefreshCw,
  Clock,
  Code,
  Shield,
  Layers,
  ArrowUpRight,
  Zap,
  Radio,
  FileCode,
  Bug,
} from 'lucide-react';

interface AppLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  service: string;
  message: string;
  metadata?: Record<string, any>;
}

interface ApiLog {
  id: string;
  timestamp: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  statusCode: number;
  durationMs: number;
  clientIp: string;
  authRole: string;
  payloadSnippet?: string;
}

interface ErrorIssue {
  id: string;
  title: string;
  culprit: string;
  count: number;
  firstSeen: string;
  lastSeen: string;
  status: 'UNRESOLVED' | 'RESOLVED' | 'INVESTIGATING';
  stackTrace: string;
}

interface SuperAdminSystemLogsProps {
  subTab?: 'app' | 'api' | 'errors';
  onSubTabChange?: (tab: 'app' | 'api' | 'errors') => void;
}

export const SuperAdminSystemLogs: React.FC<SuperAdminSystemLogsProps> = ({
  subTab = 'app',
  onSubTabChange,
}) => {
  const [internalLogTab, setInternalLogTab] = useState<'app' | 'api' | 'errors'>(subTab);

  useEffect(() => {
    if (subTab) setInternalLogTab(subTab);
  }, [subTab]);

  const activeLogTab = subTab || internalLogTab;
  const setActiveLogTab = (t: 'app' | 'api' | 'errors') => {
    setInternalLogTab(t);
    if (onSubTabChange) onSubTabChange(t);
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('ALL');
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);

  // Application Logs Mock Data
  const [appLogs, setAppLogs] = useState<AppLog[]>([
    {
      id: 'log_101',
      timestamp: '2026-08-14 00:14:52',
      level: 'INFO',
      service: 'settlement-worker-lagos-01',
      message: 'Escrow settlement job completed for batch #BATCH-2026-0814. Total value: ₦142,500,000 across 348 deliveries.',
      metadata: { batchSize: 348, totalDisbursed: 142500000, duration: '1.42s' },
    },
    {
      id: 'log_102',
      timestamp: '2026-08-14 00:13:10',
      level: 'WARN',
      service: 'telecom-ussd-bridge',
      message: 'Airtel USSD Gateway session keep-alive timeout exceeded on gateway node #04. Retrying via MTN fiber fallback.',
      metadata: { sessionId: 'ussd_89237461', telco: 'Airtel NG', retryCount: 2 },
    },
    {
      id: 'log_103',
      timestamp: '2026-08-14 00:11:45',
      level: 'ERROR',
      service: 'identity-nimc-proxy',
      message: 'NIMC Tier-2 Biometric verification timeout (408). Remote endpoint did not respond within 5000ms.',
      metadata: { ninPrefix: '23819***', region: 'Kano', endpoint: 'https://api.nimc.gov.ng/v2/verify' },
    },
    {
      id: 'log_104',
      timestamp: '2026-08-14 00:09:22',
      level: 'INFO',
      service: 'crop-vision-inference',
      message: 'Gemini Vision Leaf Scan diagnostic completed for Cassava Mosaic Disease detection. Confidence: 98.4%.',
      metadata: { farmerState: 'Benue', crop: 'Cassava', responseTime: '820ms' },
    },
    {
      id: 'log_105',
      timestamp: '2026-08-14 00:07:05',
      level: 'DEBUG',
      service: 'redis-cache-cluster',
      message: 'Zone sync event: Invalidate key "produce_price_index:kaduna:maize" across 36 state edge nodes.',
      metadata: { keysEvicted: 36, clusterStatus: 'HEALTHY' },
    },
    {
      id: 'log_106',
      timestamp: '2026-08-14 00:04:19',
      level: 'INFO',
      service: 'gmp-compliance-engine',
      message: 'Guaranteed Minimum Price (GMP) automated scan completed for 1,240 marketplace listings. 0 violations flagged.',
      metadata: { listingsAudited: 1240, complianceRate: '100%' },
    },
  ]);

  // API Requests Logs
  const [apiLogs, setApiLogs] = useState<ApiLog[]>([
    {
      id: 'api_1',
      timestamp: '00:14:30',
      method: 'POST',
      path: '/api/v1/escrow/disburse',
      statusCode: 200,
      durationMs: 142,
      clientIp: '10.0.12.44',
      authRole: 'super_admin',
      payloadSnippet: '{"batchId":"BATCH-2026-0814","signer":"0x7F2A...","amount":142500000}',
    },
    {
      id: 'api_2',
      timestamp: '00:13:55',
      method: 'GET',
      path: '/api/v1/marketplace/listings?state=Kaduna&crop=Maize',
      statusCode: 200,
      durationMs: 24,
      clientIp: '102.89.22.18',
      authRole: 'buyer',
    },
    {
      id: 'api_3',
      timestamp: '00:12:18',
      method: 'POST',
      path: '/api/v1/ussd/incoming',
      statusCode: 200,
      durationMs: 88,
      clientIp: '196.11.238.10',
      authRole: 'ussd_gateway',
      payloadSnippet: '{"msisdn":"+2348039281726","sessionId":"99283","text":"*384*247*1#"}',
    },
    {
      id: 'api_4',
      timestamp: '00:10:44',
      method: 'POST',
      path: '/api/v1/kyc/verify-nin',
      statusCode: 504,
      durationMs: 5002,
      clientIp: '105.112.41.90',
      authRole: 'farmer',
      payloadSnippet: '{"nin":"28192019281","farmerId":"usr_kano_991"}',
    },
    {
      id: 'api_5',
      timestamp: '00:08:12',
      method: 'PUT',
      path: '/api/v1/logistics/dispatch/order_8829',
      statusCode: 200,
      durationMs: 45,
      clientIp: '197.210.65.12',
      authRole: 'transporter',
    },
    {
      id: 'api_6',
      timestamp: '00:05:01',
      method: 'GET',
      path: '/api/v1/admin/telemetry/nodes',
      statusCode: 200,
      durationMs: 18,
      clientIp: '10.0.0.1',
      authRole: 'super_admin',
    },
  ]);

  // Error Tracker Issues
  const [errorIssues, setErrorIssues] = useState<ErrorIssue[]>([
    {
      id: 'err_1',
      title: 'GatewayTimeout: NIMC Biometric Service Gateway Failure',
      culprit: 'services/identity/nimcProxy.ts:line 142',
      count: 28,
      firstSeen: '2 hours ago',
      lastSeen: '4 mins ago',
      status: 'INVESTIGATING',
      stackTrace: `GatewayTimeoutError: NIMC biometric upstream failed to respond within 5000ms\n  at NimcProxy.verifyBiometric (/app/services/identity/nimcProxy.ts:142:19)\n  at processTicksAndRejections (node:internal/process/task_queues:95:5)\n  at async handleKycVerification (/app/controllers/kycController.ts:64:12)`,
    },
    {
      id: 'err_2',
      title: 'USSDSessionAborted: Session termination by telco carrier (MNO code 62120)',
      culprit: 'telecom/ussd/sessionHandler.ts:line 88',
      count: 14,
      firstSeen: '6 hours ago',
      lastSeen: '18 mins ago',
      status: 'UNRESOLVED',
      stackTrace: `TelcoSessionAbortedError: Airtel MNO dropped active session before completion\n  at TelcoGateway.onSessionDrop (/app/telecom/ussd/sessionHandler.ts:88:14)\n  at Socket.emit (node:events:517:28)`,
    },
    {
      id: 'err_3',
      title: 'GeoFenceMismatchWarning: Transaction signed outside Nigerian border IPs',
      culprit: 'security/geoFenceMiddleware.ts:line 32',
      count: 3,
      firstSeen: '1 day ago',
      lastSeen: '45 mins ago',
      status: 'RESOLVED',
      stackTrace: `SecurityAlert: Blocked Tor Exit Node 185.220.101.5 attempting administrative route\n  at geoFenceEnforcer (/app/security/geoFenceMiddleware.ts:32:9)\n  at Layer.handle [as handle_request] (/app/node_modules/express/lib/router/layer.js:95:5)`,
    },
  ]);

  // Simulated live log ticker
  useEffect(() => {
    if (!isLiveStreaming) return;
    const interval = setInterval(() => {
      const services = [
        'settlement-worker-lagos-01',
        'telecom-ussd-bridge',
        'crop-vision-inference',
        'redis-cache-cluster',
        'gis-satellite-pipeline',
      ];
      const randomService = services[Math.floor(Math.random() * services.length)];
      const newLog: AppLog = {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        level: 'INFO',
        service: randomService,
        message: `Heartbeat health check passed [OK]. Memory usage 42.1%, Active Threads: 16.`,
        metadata: { heapUsed: '248MB', uptime: '14d 6h' },
      };
      setAppLogs((prev) => [newLog, ...prev.slice(0, 49)]);
    }, 8000);
    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  const handleResolveError = (id: string) => {
    setErrorIssues((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'RESOLVED' } : e))
    );
  };

  const handleExportLogs = () => {
    const data = { appLogs, apiLogs, errorIssues, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `USUCO_SYSTEM_LOGS_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredAppLogs = appLogs.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.service.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = levelFilter === 'ALL' || log.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0f1713] border border-[#1b2b22] p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-[#1b2b22] text-[#34d399] rounded-xl">
              <Terminal className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Real-Time National System & API Telemetry Logs
            </h2>
          </div>
          <p className="text-xs text-[#8fa89b] mt-1">
            Live container stdout, microservice HTTP routes, and unhandled exception triage.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              isLiveStreaming
                ? 'bg-[#064e3b] text-[#6ee7b7] border border-[#10b981]/50'
                : 'bg-[#1b2b22] text-[#8fa89b] border border-[#2d4738]'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isLiveStreaming ? 'bg-[#10b981] animate-ping' : 'bg-gray-500'}`} />
            <span>{isLiveStreaming ? 'Live Streaming' : 'Stream Paused'}</span>
          </button>

          <button
            type="button"
            onClick={handleExportLogs}
            className="px-3.5 py-2 bg-[#10b981] text-[#0a0f0d] font-bold text-xs rounded-xl flex items-center gap-1.5 hover:bg-[#34d399] transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Logs (JSON)</span>
          </button>
        </div>
      </div>

      {/* Log Tabs Sub-Navigation */}
      <div className="flex items-center gap-2 border-b border-[#1b2b22] pb-3">
        <button
          type="button"
          onClick={() => setActiveLogTab('app')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeLogTab === 'app'
              ? 'bg-[#10b981] text-[#0a0f0d]'
              : 'bg-[#0f1713] text-[#8fa89b] hover:text-white border border-[#1b2b22]'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>Application Logs ({appLogs.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveLogTab('api')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeLogTab === 'api'
              ? 'bg-[#10b981] text-[#0a0f0d]'
              : 'bg-[#0f1713] text-[#8fa89b] hover:text-white border border-[#1b2b22]'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>API & USSD Gateway Logs ({apiLogs.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveLogTab('errors')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeLogTab === 'errors'
              ? 'bg-[#ef4444] text-white'
              : 'bg-[#0f1713] text-[#8fa89b] hover:text-white border border-[#1b2b22]'
          }`}
        >
          <Bug className="w-4 h-4" />
          <span>Error Tracker ({errorIssues.filter((e) => e.status !== 'RESOLVED').length} Unresolved)</span>
        </button>
      </div>

      {/* Tab 1: Application Logs */}
      {activeLogTab === 'app' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8fa89b]" />
              <input
                type="text"
                placeholder="Search log messages, services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#0f1713] border border-[#1b2b22] rounded-xl text-xs text-white placeholder-[#8fa89b] focus:outline-hidden focus:border-[#10b981]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-[#8fa89b] whitespace-nowrap">Filter Level:</span>
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="bg-[#0f1713] border border-[#1b2b22] text-xs text-white rounded-xl px-3 py-2 focus:outline-hidden focus:border-[#10b981]"
              >
                <option value="ALL">All Levels</option>
                <option value="INFO">INFO</option>
                <option value="WARN">WARN</option>
                <option value="ERROR">ERROR</option>
                <option value="DEBUG">DEBUG</option>
              </select>
            </div>
          </div>

          <div className="bg-[#080d0a] border border-[#1b2b22] rounded-2xl font-mono text-xs overflow-hidden shadow-xl">
            <div className="bg-[#0f1713] px-4 py-2.5 border-b border-[#1b2b22] flex items-center justify-between text-[#8fa89b] text-[11px]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ef4444]/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#f59e0b]/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#10b981]/80 inline-block" />
                <span className="ml-2 font-bold text-white">stdout / stderr stream</span>
              </div>
              <div>{filteredAppLogs.length} events logged</div>
            </div>

            <div className="p-3 divide-y divide-[#1b2b22]/50 max-h-[500px] overflow-y-auto space-y-1">
              {filteredAppLogs.map((log) => (
                <div key={log.id} className="pt-2 pb-2 hover:bg-[#0f1713]/60 px-2 rounded-lg transition-all">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-[#8fa89b] text-[11px]">{log.timestamp}</span>
                    <span
                      className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                        log.level === 'ERROR'
                          ? 'bg-[#7f1d1d] text-[#fca5a5]'
                          : log.level === 'WARN'
                          ? 'bg-[#78350f] text-[#fde68a]'
                          : log.level === 'DEBUG'
                          ? 'bg-[#1e1b4b] text-[#c7d2fe]'
                          : 'bg-[#064e3b] text-[#6ee7b7]'
                      }`}
                    >
                      {log.level}
                    </span>
                    <span className="text-[#34d399] font-bold text-[11px]">[{log.service}]</span>
                    <span className="text-[#e2e8e4] flex-1">{log.message}</span>
                  </div>
                  {log.metadata && (
                    <div className="mt-1 ml-6 text-[10px] text-[#8fa89b] bg-[#0a0f0d] p-1.5 rounded-md border border-[#1b2b22]">
                      {JSON.stringify(log.metadata)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: API Logs */}
      {activeLogTab === 'api' && (
        <div className="bg-[#0f1713] border border-[#1b2b22] rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-[#1b2b22] flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-white">Inbound HTTP / USSD Gateway Traffic</h3>
              <p className="text-xs text-[#8fa89b]">Real-time inspection of API response codes and execution latency</p>
            </div>
            <span className="px-3 py-1 bg-[#1b2b22] text-[#34d399] text-xs font-mono rounded-lg">
              Avg Latency: 46ms
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#0a0f0d] text-[#8fa89b] uppercase text-[10px] tracking-wider border-b border-[#1b2b22]">
                <tr>
                  <th className="p-3">Time</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Route Path</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3">Role / IP</th>
                  <th className="p-3">Payload Snippet</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1b2b22] text-[#e2e8e4]">
                {apiLogs.map((req) => (
                  <tr key={req.id} className="hover:bg-[#1b2b22]/40 transition-colors">
                    <td className="p-3 text-[#8fa89b]">{req.timestamp}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          req.method === 'POST'
                            ? 'bg-[#0369a1] text-white'
                            : req.method === 'PUT'
                            ? 'bg-[#d97706] text-white'
                            : req.method === 'DELETE'
                            ? 'bg-[#dc2626] text-white'
                            : 'bg-[#059669] text-white'
                        }`}
                      >
                        {req.method}
                      </span>
                    </td>
                    <td className="p-3 text-white font-bold">{req.path}</td>
                    <td className="p-3">
                      <span
                        className={`font-bold ${
                          req.statusCode >= 500
                            ? 'text-[#ef4444]'
                            : req.statusCode >= 400
                            ? 'text-[#f59e0b]'
                            : 'text-[#10b981]'
                        }`}
                      >
                        {req.statusCode}
                      </span>
                    </td>
                    <td className="p-3 text-[#8fa89b]">{req.durationMs}ms</td>
                    <td className="p-3">
                      <span className="text-[#34d399]">{req.authRole}</span>
                      <span className="text-[#8fa89b] text-[10px] block">{req.clientIp}</span>
                    </td>
                    <td className="p-3 max-w-xs truncate text-[10px] text-[#8fa89b]">
                      {req.payloadSnippet || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Error Tracker */}
      {activeLogTab === 'errors' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#0f1713] border border-[#1b2b22] p-4 rounded-2xl">
              <div className="text-xs text-[#8fa89b]">Total Unhandled Errors</div>
              <div className="text-2xl font-black text-[#ef4444] mt-1">45</div>
              <div className="text-[11px] text-[#8fa89b] mt-1">Last 24 hours</div>
            </div>
            <div className="bg-[#0f1713] border border-[#1b2b22] p-4 rounded-2xl">
              <div className="text-xs text-[#8fa89b]">Impacted Citizens</div>
              <div className="text-2xl font-black text-white mt-1">32 Users</div>
              <div className="text-[11px] text-[#34d399] mt-1">NIMC Proxy Bottleneck</div>
            </div>
            <div className="bg-[#0f1713] border border-[#1b2b22] p-4 rounded-2xl">
              <div className="text-xs text-[#8fa89b]">Resolved Incidents</div>
              <div className="text-2xl font-black text-[#10b981] mt-1">12 Issues</div>
              <div className="text-[11px] text-[#8fa89b] mt-1">Hotfixed in production</div>
            </div>
          </div>

          <div className="space-y-3">
            {errorIssues.map((err) => (
              <div
                key={err.id}
                className="bg-[#0f1713] border border-[#1b2b22] rounded-2xl p-4.5 space-y-3 hover:border-[#2d4738] transition-all"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          err.status === 'RESOLVED'
                            ? 'bg-[#064e3b] text-[#6ee7b7]'
                            : err.status === 'INVESTIGATING'
                            ? 'bg-[#78350f] text-[#fde68a]'
                            : 'bg-[#7f1d1d] text-[#fca5a5]'
                        }`}
                      >
                        {err.status}
                      </span>
                      <span className="text-xs font-mono text-[#ef4444] font-bold">
                        {err.count} occurrences
                      </span>
                      <span className="text-[11px] text-[#8fa89b]">Last: {err.lastSeen}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{err.title}</h4>
                    <p className="text-xs text-[#8fa89b] font-mono">{err.culprit}</p>
                  </div>

                  {err.status !== 'RESOLVED' && (
                    <button
                      type="button"
                      onClick={() => handleResolveError(err.id)}
                      className="px-3.5 py-1.5 bg-[#064e3b] text-[#6ee7b7] border border-[#10b981]/50 rounded-xl text-xs font-bold hover:bg-[#10b981] hover:text-[#0a0f0d] transition-all cursor-pointer"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>

                <div className="bg-[#080d0a] p-3 rounded-xl border border-[#1b2b22] font-mono text-[11px] text-[#fca5a5] overflow-x-auto whitespace-pre">
                  {err.stackTrace}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
