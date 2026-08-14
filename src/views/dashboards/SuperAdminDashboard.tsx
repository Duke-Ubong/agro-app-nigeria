import React, { useState, useMemo } from 'react';
import {
  Shield,
  Activity,
  Server,
  Users,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Clock,
  TrendingUp,
  DollarSign,
  Cpu,
  Database,
  Radio,
  RefreshCw,
  Search,
  Filter,
  Sliders,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Layers,
  Lock,
  Unlock,
  Bell,
  Check,
  X,
  FileText,
  Download,
  Terminal,
  Globe,
  HardDrive,
  Network,
  ShieldCheck,
  Send,
  Eye,
  ChevronRight,
  Wifi,
  Sparkles,
  Flame,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { AdminGlobalFilterBar, GlobalFilterState } from '../../components/admin/AdminGlobalFilterBar';

export interface SystemAlert {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  category: 'Settlement' | 'Infrastructure' | 'Security' | 'Trade' | 'Telecom';
  timestamp: string;
  service: string;
  status: 'active' | 'acknowledged' | 'resolved';
  affectedRegion?: string;
  acknowledgedBy?: string;
}

export const SuperAdminDashboard: React.FC = () => {
  const { auditLogs, addAuditLog, listings, orders, transactions, usersList, adminTab, setAdminTab } = useApp();
  const { user } = useAuth();

  // Filters State
  const [filters, setFilters] = useState<GlobalFilterState>({
    dateRange: 'last_30_days',
    state: 'All States',
    lga: 'All LGAs',
    valueChain: 'All Value Chains',
    commodity: 'All Commodities',
  });

  // Map adminTab from context to internal views
  const activeView = useMemo(() => {
    switch (adminTab) {
      case 'super_admin': return 'overview';
      case 'sa_metrics': return 'transactions';
      case 'sa_alerts': return 'alerts';
      case 'sa_sys_settings': return 'microservices';
      case 'sa_freeze_market':
      case 'sa_freeze_wallet':
      case 'sa_emerg_broadcast':
      case 'sa_maintenance': return 'circuit_breakers';
      default: return 'overview';
    }
  }, [adminTab]);

  // Chart Timeframe Selection
  const [chartTimeframe, setChartTimeframe] = useState<'24h' | '7d' | '30d' | '90d' | '1y'>('30d');
  const [chartMetric, setChartMetric] = useState<'volume_value' | 'trade_count' | 'escrow_settled'>('volume_value');
  const [hoveredDataIndex, setHoveredDataIndex] = useState<number | null>(null);

  // Emergency Switches State
  const [tradingFrozen, setTradingFrozen] = useState<boolean>(false);
  const [escrowFrozen, setEscrowFrozen] = useState<boolean>(false);
  const [maintenanceGate, setMaintenanceGate] = useState<boolean>(false);
  const [highRiskRateLimiter, setHighRiskRateLimiter] = useState<boolean>(true);
  const [actionNotice, setActionNotice] = useState<{ type: 'success' | 'warn' | 'error'; message: string } | null>(null);

  // Ping Testing State
  const [isPingingNodes, setIsPingingNodes] = useState<boolean>(false);
  const [lastPingTime, setLastPingTime] = useState<string>('Just now');

  // Alerts Management State
  const [alertSeverityFilter, setAlertSeverityFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [alertStatusFilter, setAlertStatusFilter] = useState<'all' | 'active' | 'acknowledged' | 'resolved'>('all');
  const [alertSearchQuery, setAlertSearchQuery] = useState<string>('');
  const [selectedAlertForDetail, setSelectedAlertForDetail] = useState<SystemAlert | null>(null);

  // New Alert Broadcast Form Modal State
  const [showBroadcastModal, setShowBroadcastModal] = useState<boolean>(false);
  const [newAlertTitle, setNewAlertTitle] = useState('');
  const [newAlertDesc, setNewAlertDesc] = useState('');
  const [newAlertSeverity, setNewAlertSeverity] = useState<'critical' | 'warning' | 'info'>('warning');
  const [newAlertCategory, setNewAlertCategory] = useState<'Settlement' | 'Infrastructure' | 'Security' | 'Trade' | 'Telecom'>('Infrastructure');
  const [newAlertRegion, setNewAlertRegion] = useState('National');

  // Initial System Alerts
  const [alerts, setAlerts] = useState<SystemAlert[]>([
    {
      id: 'ALT-9081',
      title: 'NIBSS Settlement Bus Latency Spike (>3,850ms)',
      description: 'Automated escrow payout gateway experienced transient latency during morning peak auctions in Kano Dawanau Market.',
      severity: 'critical',
      category: 'Settlement',
      timestamp: '6 mins ago',
      service: 'NIBSS / Interswitch Bridge',
      status: 'active',
      affectedRegion: 'Kano, Kaduna, Niger',
    },
    {
      id: 'ALT-9080',
      title: 'High-Value Escrow Batch Velocity Trigger',
      description: 'Single-order bulk trade flagged: ₦48,500,000 White Maize haulage from Giwa (Kaduna) to Ikeja Feedmills (Lagos). KYC Tier 3 verified.',
      severity: 'warning',
      category: 'Security',
      timestamp: '24 mins ago',
      service: 'Escrow Compliance Sentry',
      status: 'active',
      affectedRegion: 'Kaduna -> Lagos Corridor',
    },
    {
      id: 'ALT-9078',
      title: 'USSD Gateway SMS Relay Queue Congestion',
      description: 'Feature-phone USSD (*384*247#) queue depth exceeded 420 messages/min in Benue agrarian belt during yam market opening.',
      severity: 'warning',
      category: 'Telecom',
      timestamp: '1 hour ago',
      service: 'Telco USSD Relays (MTN/Airtel/Glo)',
      status: 'acknowledged',
      affectedRegion: 'Benue, Taraba, Nasarawa',
      acknowledgedBy: 'Dr. Aliyu Danladi (USUCO)',
    },
    {
      id: 'ALT-9075',
      title: 'Guaranteed Minimum Price (GMP) Floor Deviation (+28%)',
      description: 'Paddy Rice spot prices in Kebbi and Sokoto spiked 28% above federal statutory advisory due to dry-season processor demand surge.',
      severity: 'warning',
      category: 'Trade',
      timestamp: '3 hours ago',
      service: 'FMAFS Price Sentry',
      status: 'active',
      affectedRegion: 'Kebbi, Sokoto',
    },
    {
      id: 'ALT-9071',
      title: 'NIMC / NIN Biometric Cluster Auto-Scaled to 14 Nodes',
      description: 'Farmer onboarding traffic surge triggered automated horizontal container replication in Lagos and Kano edge zones.',
      severity: 'info',
      category: 'Infrastructure',
      timestamp: '4 hours ago',
      service: 'Identity Verification Node',
      status: 'resolved',
      affectedRegion: 'National',
    },
    {
      id: 'ALT-9068',
      title: 'Moisture Telemetry Offline Alert: Silo #04 (Minna)',
      description: 'Strategic Grain Reserve IoT silo sensor intermittently dropping WiFi telemetry packets. Backup LoRaWAN active.',
      severity: 'info',
      category: 'Infrastructure',
      timestamp: '6 hours ago',
      service: 'GIS & Silo IoT Telemetry',
      status: 'resolved',
      affectedRegion: 'Niger State',
    },
  ]);

  // Microservices Telemetry Data
  const [microservices, setMicroservices] = useState([
    {
      id: 'srv_gateway',
      name: 'Core API Gateway & NGINX Ingress',
      region: 'Cloud Run (eu-west2 / Lagos Edge)',
      status: 'Operational',
      latency: '22ms',
      uptime: '99.99%',
      rps: '1,840 req/s',
      errorRate: '0.008%',
      cpu: '34%',
      memory: '41%',
    },
    {
      id: 'srv_settlement',
      name: 'NIBSS & Interswitch Banking Settlement Bus',
      region: 'CBN Dedicated Financial Corridor',
      status: 'Operational',
      latency: '112ms',
      uptime: '99.96%',
      rps: '420 req/s',
      errorRate: '0.038%',
      cpu: '58%',
      memory: '64%',
    },
    {
      id: 'srv_ussd',
      name: 'Offline USSD (*384*247#) & Rural SMS Relays',
      region: 'NCC Aggregator (MTN/Airtel/Glo/9mobile)',
      status: 'Operational',
      latency: '68ms',
      uptime: '99.93%',
      rps: '890 req/s',
      errorRate: '0.110%',
      cpu: '72%',
      memory: '55%',
    },
    {
      id: 'srv_gis',
      name: 'GIS Satellite & Soil Weather Engine (Sentinel-2)',
      region: 'Copernicus GIS Geo-Node',
      status: 'Operational',
      latency: '184ms',
      uptime: '99.89%',
      rps: '160 req/s',
      errorRate: '0.015%',
      cpu: '44%',
      memory: '78%',
    },
    {
      id: 'srv_freight',
      name: 'Truck Freight GPS Telematics & Route Engine',
      region: 'National Agro-Corridor Telemetry',
      status: 'Operational',
      latency: '39ms',
      uptime: '99.98%',
      rps: '540 req/s',
      errorRate: '0.002%',
      cpu: '29%',
      memory: '38%',
    },
    {
      id: 'srv_kyc',
      name: 'NIN / NIMC & CAC Identity Verification Node',
      region: 'FGN Biometric Trust Infrastructure',
      status: 'Operational',
      latency: '148ms',
      uptime: '99.87%',
      rps: '115 req/s',
      errorRate: '0.042%',
      cpu: '46%',
      memory: '52%',
    },
  ]);

  // Transaction Chart Data Sets by Timeframe
  const chartDataSets = useMemo(() => {
    return {
      '24h': [
        { label: '00:00', valueNaira: 14.2, count: 420, escrow: 12.8, timestamp: '12:00 AM' },
        { label: '03:00', valueNaira: 8.5, count: 190, escrow: 7.9, timestamp: '03:00 AM' },
        { label: '06:00', valueNaira: 36.8, count: 1140, escrow: 34.1, timestamp: '06:00 AM (Farm-gate opening)' },
        { label: '09:00', valueNaira: 88.4, count: 2840, escrow: 82.0, timestamp: '09:00 AM (Peak Morning Auctions)' },
        { label: '12:00', valueNaira: 112.5, count: 3950, escrow: 104.2, timestamp: '12:00 PM (Inter-State Grain Clearing)' },
        { label: '15:00', valueNaira: 94.2, count: 3120, escrow: 89.0, timestamp: '03:00 PM (Haulage Dispatch)' },
        { label: '18:00', valueNaira: 65.0, count: 2210, escrow: 61.4, timestamp: '06:00 PM (Wholesale Settlement)' },
        { label: '21:00', valueNaira: 32.1, count: 980, escrow: 29.8, timestamp: '09:00 PM (Evening Batch Reconciliation)' },
      ],
      '7d': [
        { label: 'Mon', valueNaira: 420, count: 14200, escrow: 390, timestamp: 'Monday (North Central Hub)' },
        { label: 'Tue', valueNaira: 510, count: 16800, escrow: 480, timestamp: 'Tuesday (Kano / Dawanau Day)' },
        { label: 'Wed', valueNaira: 480, count: 15400, escrow: 450, timestamp: 'Wednesday (Benue Yam Auction)' },
        { label: 'Thu', valueNaira: 630, count: 21200, escrow: 590, timestamp: 'Thursday (National Input Subsidies)' },
        { label: 'Fri', valueNaira: 740, count: 24800, escrow: 710, timestamp: 'Friday (Weekly Wholesale Peak)' },
        { label: 'Sat', valueNaira: 590, count: 19100, escrow: 560, timestamp: 'Saturday (Local Cooperative Dispatch)' },
        { label: 'Sun', valueNaira: 320, count: 10400, escrow: 300, timestamp: 'Sunday (Logistics Clearing)' },
      ],
      '30d': [
        { label: 'Week 1', valueNaira: 3200, count: 98000, escrow: 3050, timestamp: 'Days 1 - 7' },
        { label: 'Week 2', valueNaira: 3650, count: 112000, escrow: 3480, timestamp: 'Days 8 - 14' },
        { label: 'Week 3', valueNaira: 4120, count: 129000, escrow: 3920, timestamp: 'Days 15 - 21' },
        { label: 'Week 4', valueNaira: 3850, count: 121000, escrow: 3670, timestamp: 'Days 22 - 30' },
      ],
      '90d': [
        { label: 'Nov', valueNaira: 11400, count: 340000, escrow: 10800, timestamp: 'November Harvest Season' },
        { label: 'Dec', valueNaira: 14800, count: 460000, escrow: 14100, timestamp: 'December Festive Demand' },
        { label: 'Jan', valueNaira: 13200, count: 410000, escrow: 12600, timestamp: 'January Dry Season Planting' },
      ],
      '1y': [
        { label: 'Q1', valueNaira: 32400, count: 1050000, escrow: 30800, timestamp: 'Q1: Early Planting & Inputs' },
        { label: 'Q2', valueNaira: 41200, count: 1320000, escrow: 39100, timestamp: 'Q2: Mid-Season Crop Care' },
        { label: 'Q3', valueNaira: 56800, count: 1840000, escrow: 54200, timestamp: 'Q3: Main Grain Harvest Flow' },
        { label: 'Q4', valueNaira: 68400, count: 2190000, escrow: 65100, timestamp: 'Q4: Peak National Food Distribution' },
      ],
    };
  }, []);

  const currentChartData = chartDataSets[chartTimeframe];
  const maxChartValue = Math.max(
    ...currentChartData.map((d) =>
      chartMetric === 'volume_value' ? d.valueNaira : chartMetric === 'trade_count' ? d.count : d.escrow
    )
  );

  // User Concurrency Distribution Breakdown
  const concurrencyBreakdown = [
    { roleLabel: 'Smallholder & Commercial Farmers', count: '30,420', percent: 58.0, color: 'bg-emerald-500', glow: 'shadow-emerald-500/20' },
    { roleLabel: 'Agricultural Cooperatives', count: '4,710', percent: 9.0, color: 'bg-teal-400', glow: 'shadow-teal-400/20' },
    { roleLabel: 'Input Suppliers & Agro-Dealers', count: '5,240', percent: 10.0, color: 'bg-cyan-400', glow: 'shadow-cyan-400/20' },
    { roleLabel: 'Industrial Grain Buyers & Processors', count: '4,190', percent: 8.0, color: 'bg-blue-500', glow: 'shadow-blue-500/20' },
    { roleLabel: 'Freight Transporters & Fleet Drivers', count: '4,190', percent: 8.0, color: 'bg-amber-400', glow: 'shadow-amber-400/20' },
    { roleLabel: 'Field Extension Agents & ADP Officers', count: '3,670', percent: 7.0, color: 'bg-indigo-400', glow: 'shadow-indigo-400/20' },
  ];

  // Commodity Volume Breakdown
  const commodityVolumes = [
    { name: 'White Maize', volume: '48,200 MT', value: '₦6.27B', percent: 32, trend: '+18.4%', zone: 'North Central & North West' },
    { name: 'Paddy Rice', volume: '39,150 MT', value: '₦5.48B', percent: 28, trend: '+24.1%', zone: 'Kebbi, Kano, Niger' },
    { name: 'Cassava Tubers & Starch', volume: '54,000 MT', value: '₦2.97B', percent: 15, trend: '+8.7%', zone: 'Ogun, Edo, Cross River' },
    { name: 'Soybeans & Oilseeds', volume: '22,400 MT', value: '₦2.46B', percent: 13, trend: '+14.9%', zone: 'Benue, Kaduna' },
    { name: 'Yam Tubers (Zaki Biam Batch)', volume: '31,000 MT', value: '₦1.86B', percent: 12, trend: '+6.2%', zone: 'Benue, Taraba, Nasarawa' },
  ];

  // System Ping / Latency Simulation
  const handlePingNodes = () => {
    setIsPingingNodes(true);
    setTimeout(() => {
      setMicroservices((prev) =>
        prev.map((s) => ({
          ...s,
          latency: `${Math.floor(Math.random() * 30 + 20)}ms`,
        }))
      );
      setIsPingingNodes(false);
      setLastPingTime('Just now');
      addAuditLog(
        user.name,
        user.role,
        'TELEMETRY_PING_PROBE',
        'Executed nationwide synchronous latency probe across 6 microservice ingress nodes.'
      );
      setActionNotice({ type: 'success', message: 'Synchronous latency probe complete. All 6 nodes responding within SLA (<150ms).' });
      setTimeout(() => setActionNotice(null), 4000);
    }, 1200);
  };

  // Emergency Switch Handlers
  const handleToggleTrading = () => {
    const nextState = !tradingFrozen;
    setTradingFrozen(nextState);
    addAuditLog(
      user.name,
      user.role,
      'CIRCUIT_BREAKER_MARKETPLACE',
      `Marketplace Trading Circuit Breaker ${nextState ? 'ENGAGED (HALTED)' : 'DISENGAGED (ACTIVE)'}`
    );
    setActionNotice({
      type: nextState ? 'error' : 'success',
      message: `Marketplace Trading is now ${nextState ? 'HALTED / FROZEN nationwide' : 'RESTORED to full operations'}.`,
    });
    setTimeout(() => setActionNotice(null), 5000);
  };

  const handleToggleEscrow = () => {
    const nextState = !escrowFrozen;
    setEscrowFrozen(nextState);
    addAuditLog(
      user.name,
      user.role,
      'CIRCUIT_BREAKER_ESCROW',
      `NIBSS Escrow Auto-Settlement Gate ${nextState ? 'LOCKED (PAUSED)' : 'UNLOCKED (ACTIVE)'}`
    );
    setActionNotice({
      type: nextState ? 'error' : 'success',
      message: `Escrow Automated Payout Bridge is now ${nextState ? 'PAUSED for security review' : 'ACTIVE with instant settlement'}.`,
    });
    setTimeout(() => setActionNotice(null), 5000);
  };

  const handleToggleMaintenance = () => {
    const nextState = !maintenanceGate;
    setMaintenanceGate(nextState);
    addAuditLog(
      user.name,
      user.role,
      'MAINTENANCE_GATE_TOGGLE',
      `National Platform Maintenance Gate ${nextState ? 'ACTIVATED (LOCKED)' : 'DEACTIVATED (ONLINE)'}`
    );
    setActionNotice({
      type: nextState ? 'error' : 'success',
      message: `Platform Public Ingress is now ${nextState ? 'GATED under Maintenance Mode' : 'OPEN to public traffic'}.`,
    });
    setTimeout(() => setActionNotice(null), 5000);
  };

  const handlePurgeRedis = () => {
    addAuditLog(
      user.name,
      user.role,
      'PURGE_REDIS_EDGE_CDN',
      'Purged all national Redis cache clusters, price memory indices, and Edge CDN buffers.'
    );
    setActionNotice({
      type: 'success',
      message: 'Global Redis Cache & Edge API buffers purged across 36 state edge-nodes.',
    });
    setTimeout(() => setActionNotice(null), 4000);
  };

  // Alert Action Handlers
  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? {
              ...a,
              status: 'acknowledged',
              acknowledgedBy: `${user.name} (${user.role})`,
            }
          : a
      )
    );
    addAuditLog(user.name, user.role, 'ACKNOWLEDGE_ALERT', `Acknowledged incident alert ${alertId}`);
    setActionNotice({ type: 'success', message: `Alert ${alertId} marked as Acknowledged.` });
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleResolveAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? {
              ...a,
              status: 'resolved',
            }
          : a
      )
    );
    addAuditLog(user.name, user.role, 'RESOLVE_ALERT', `Marked incident alert ${alertId} as Resolved`);
    setActionNotice({ type: 'success', message: `Alert ${alertId} successfully marked as Resolved.` });
    setTimeout(() => setActionNotice(null), 3000);
  };

  // Create & Broadcast Alert
  const handleCreateBroadcastAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlertTitle || !newAlertDesc) return;

    const createdAlert: SystemAlert = {
      id: `ALT-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newAlertTitle,
      description: newAlertDesc,
      severity: newAlertSeverity,
      category: newAlertCategory,
      timestamp: 'Just now',
      service: 'Super Admin Broadcast Console',
      status: 'active',
      affectedRegion: newAlertRegion,
      acknowledgedBy: user.name,
    };

    setAlerts((prev) => [createdAlert, ...prev]);
    addAuditLog(
      user.name,
      user.role,
      'BROADCAST_SYSTEM_ALERT',
      `Issued system-wide ${newAlertSeverity.toUpperCase()} alert: "${newAlertTitle}" for region: ${newAlertRegion}`
    );

    setShowBroadcastModal(false);
    setNewAlertTitle('');
    setNewAlertDesc('');
    setActionNotice({ type: 'success', message: 'System-wide alert broadcast successfully published to all admin panels.' });
    setTimeout(() => setActionNotice(null), 4000);
  };

  // Filtered Alerts Calculation
  const filteredAlerts = useMemo(() => {
    return alerts.filter((alt) => {
      const matchesSeverity = alertSeverityFilter === 'all' || alt.severity === alertSeverityFilter;
      const matchesStatus = alertStatusFilter === 'all' || alt.status === alertStatusFilter;
      const matchesQuery =
        !alertSearchQuery ||
        alt.title.toLowerCase().includes(alertSearchQuery.toLowerCase()) ||
        alt.description.toLowerCase().includes(alertSearchQuery.toLowerCase()) ||
        alt.service.toLowerCase().includes(alertSearchQuery.toLowerCase()) ||
        (alt.affectedRegion && alt.affectedRegion.toLowerCase().includes(alertSearchQuery.toLowerCase()));

      return matchesSeverity && matchesStatus && matchesQuery;
    });
  }, [alerts, alertSeverityFilter, alertStatusFilter, alertSearchQuery]);

  // Alert Counts for badges
  const activeCriticalCount = alerts.filter((a) => a.severity === 'critical' && a.status === 'active').length;
  const activeWarningCount = alerts.filter((a) => a.severity === 'warning' && a.status === 'active').length;

  return (
    <div className="min-h-screen bg-[#0a0f18] text-[#f1f5f9] rounded-2xl p-4 sm:p-6 lg:p-7 space-y-6 font-body selection:bg-[#10b981]/30 selection:text-[#a7f3d0] border border-[#1e293b] shadow-2xl">
      {/* 1. Global Filter Bar (Styled in cohesive dark mode container) */}
      <div className="bg-[#111927] border border-[#1e293b] rounded-2xl p-2 shadow-lg">
        <AdminGlobalFilterBar
          filters={filters}
          onFilterChange={setFilters}
          roleTitle="Super Administrator (USUCO Platform Owner)"
          departmentTag="National Cloud Architecture & 36-State Ingress Core"
          watermarkText="CONFIDENTIAL • SUPER ADMIN LIVE TELEMETRY"
        />
      </div>

      {/* 2. Top Super Admin Header & Status Bar */}
      <div className="bg-gradient-to-r from-[#0d1b2a] via-[#0f241d] to-[#0d1b2a] border border-[#1e3a2b] rounded-2xl p-5 shadow-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="bg-gradient-to-r from-red-600 to-rose-700 text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-widest shadow-md shadow-red-900/30 flex items-center gap-1.5">
              <Shield className="w-3 h-3" />
              <span>SUPER ADMIN COMMAND</span>
            </span>
            <span className="text-xs text-[#94a3b8] flex items-center gap-1.5 font-medium">
              <Globe className="w-3.5 h-3.5 text-[#10b981]" />
              <span>Federal Ministry of Agriculture & Food Security • USUCO Agro-Connect</span>
            </span>
          </div>

          <h1 className="font-heading font-bold text-xl sm:text-2xl text-white tracking-tight flex items-center gap-3">
            <span>National Infrastructure & Platform Health</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>LIVE 36 STATES</span>
            </span>
          </h1>

          <p className="text-xs text-[#94a3b8]">
            Real-time multi-cloud telemetry, banking settlement buses, transaction velocity graphs, and national alert matrix.
          </p>
        </div>

        {/* Action Controls in Header */}
        <div className="flex flex-wrap items-center gap-2.5 self-stretch sm:self-auto">
          <button
            type="button"
            onClick={handlePingNodes}
            disabled={isPingingNodes}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#1e293b] hover:bg-[#334155] active:scale-95 text-[#e2e8f0] rounded-xl text-xs font-bold transition-all border border-[#334155] shadow-sm cursor-pointer disabled:opacity-50"
            title="Execute synchronous latency probe across microservices"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#10b981] ${isPingingNodes ? 'animate-spin' : ''}`} />
            <span>{isPingingNodes ? 'Pinging Nodes...' : 'Probe Latency'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowBroadcastModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-950/50 cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Broadcast Alert</span>
          </button>

          <button
            type="button"
            onClick={handlePurgeRedis}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#172554] hover:bg-[#1e3a8a] text-blue-200 border border-blue-800/60 rounded-xl text-xs font-bold transition-all cursor-pointer"
            title="Purge nationwide Edge Redis caches"
          >
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            <span>Purge Redis</span>
          </button>
        </div>
      </div>

      {/* Emergency Active Banner */}
      {(tradingFrozen || escrowFrozen || maintenanceGate) && (
        <div className="p-4 bg-gradient-to-r from-rose-950 via-red-900 to-rose-950 text-white rounded-2xl border border-red-500/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl shadow-red-950/50 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-600/30 rounded-xl border border-red-400">
              <AlertOctagon className="w-6 h-6 text-red-300" />
            </div>
            <div>
              <div className="font-heading font-extrabold text-sm text-red-100 flex items-center gap-2">
                <span>CRITICAL SYSTEM CIRCUIT BREAKER ENGAGED</span>
                <span className="text-[10px] bg-red-800/80 px-2 py-0.5 rounded-full uppercase tracking-wider">Override Active</span>
              </div>
              <p className="text-xs text-red-200/90 mt-0.5">
                {tradingFrozen && '• Marketplace Trading is HALTED '}
                {escrowFrozen && '• NIBSS / Escrow Automated Settlements are PAUSED '}
                {maintenanceGate && '• Public Ingress is LOCKED in Maintenance Gate '}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setTradingFrozen(false);
              setEscrowFrozen(false);
              setMaintenanceGate(false);
              addAuditLog(user.name, user.role, 'EMERGENCY_OVERRIDE_RESET', 'Lifted all platform circuit breakers.');
              setActionNotice({ type: 'success', message: 'All circuit breakers lifted. Normal traffic restored.' });
            }}
            className="px-4 py-2 bg-white hover:bg-red-50 text-red-950 font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer whitespace-nowrap"
          >
            Disengage All Freezes
          </button>
        </div>
      )}

      {/* Dynamic Action Notice */}
      {actionNotice && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-bold flex items-center justify-between shadow-lg transition-all ${
            actionNotice.type === 'success'
              ? 'bg-[#064e3b]/80 border-emerald-500/50 text-emerald-100'
              : actionNotice.type === 'warn'
              ? 'bg-[#78350f]/80 border-amber-500/50 text-amber-100'
              : 'bg-[#881337]/80 border-rose-500/50 text-rose-100'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {actionNotice.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            )}
            <span>{actionNotice.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionNotice(null)}
            className="text-xs underline hover:text-white cursor-pointer px-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 3. High-Level Platform Health Cards (Top 4 KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: System Uptime */}
        <div className="bg-[#111927] border border-[#1e293b] hover:border-emerald-500/40 rounded-2xl p-5 shadow-lg transition-all space-y-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all pointer-events-none" />
          <div className="flex items-center justify-between text-[#94a3b8]">
            <span className="text-[11px] font-bold uppercase tracking-wider">System SLA Uptime</span>
            <div className="p-1.5 bg-emerald-950/60 border border-emerald-600/30 rounded-lg text-emerald-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading font-extrabold text-3xl text-white tracking-tight">99.992%</span>
            <span className="text-xs text-emerald-400 font-bold flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +0.01%
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#1e293b]">
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>6/6 Nodes Green</span>
            </span>
            <span className="text-[#94a3b8]">0 Fatal Errors (48h)</span>
          </div>
        </div>

        {/* Card 2: Core API & Gateway Status */}
        <div className="bg-[#111927] border border-[#1e293b] hover:border-blue-500/40 rounded-2xl p-5 shadow-lg transition-all space-y-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all pointer-events-none" />
          <div className="flex items-center justify-between text-[#94a3b8]">
            <span className="text-[11px] font-bold uppercase tracking-wider">API Ingress & Latency</span>
            <div className="p-1.5 bg-blue-950/60 border border-blue-600/30 rounded-lg text-blue-400">
              <Server className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading font-extrabold text-3xl text-white tracking-tight">24 ms</span>
            <span className="text-xs text-blue-400 font-semibold">Avg Response</span>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#1e293b]">
            <span className="text-blue-400 font-semibold flex items-center gap-1">
              <Network className="w-3.5 h-3.5" />
              <span>1,840 req/s Ingress</span>
            </span>
            <span className="text-[#94a3b8]">Edge Accelerated</span>
          </div>
        </div>

        {/* Card 3: Active Users & Concurrency */}
        <div className="bg-[#111927] border border-[#1e293b] hover:border-teal-500/40 rounded-2xl p-5 shadow-lg transition-all space-y-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-2xl group-hover:bg-teal-500/10 transition-all pointer-events-none" />
          <div className="flex items-center justify-between text-[#94a3b8]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Live Active Concurrency</span>
            <div className="p-1.5 bg-teal-950/60 border border-teal-600/30 rounded-lg text-teal-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading font-extrabold text-3xl text-white tracking-tight">52,430</span>
            <span className="text-xs text-teal-400 font-bold flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +16.2%
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#1e293b]">
            <span className="text-teal-300 font-medium">Farmers, AGPs & Buyers</span>
            <span className="text-[#94a3b8]">36 States + FCT</span>
          </div>
        </div>

        {/* Card 4: Escrow & GMV Volume */}
        <div className="bg-[#111927] border border-[#1e293b] hover:border-amber-500/40 rounded-2xl p-5 shadow-lg transition-all space-y-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all pointer-events-none" />
          <div className="flex items-center justify-between text-[#94a3b8]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Gross Trade Volume (GMV)</span>
            <div className="p-1.5 bg-amber-950/60 border border-amber-600/30 rounded-lg text-amber-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading font-extrabold text-3xl text-white tracking-tight">₦18.45 B</span>
            <span className="text-xs text-emerald-400 font-bold flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +21.4%
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#1e293b]">
            <span className="text-amber-400 font-bold">₦1.48B in Escrow</span>
            <span className="text-[#94a3b8]">CBN Audited</span>
          </div>
        </div>
      </div>

      {/* 5. TAB 1: Platform Health Overview */}
      {activeView === 'overview' && (
        <div className="space-y-6">
          {/* Main 2-Column Section: High-Level Telemetry & System Alerts Snapshot */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Transaction & Concurrency Telemetry */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Transaction Velocity Chart Card */}
              <div className="bg-[#111927] border border-[#1e293b] rounded-2xl p-5 shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-[#1e293b]">
                  <div>
                    <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <span>National Produce Transaction Velocity</span>
                    </h3>
                    <p className="text-xs text-[#94a3b8]">
                      Gross trade flow across 36 states and multi-corridor bulk agricultural transactions
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 bg-[#0a0f18] p-1 rounded-xl border border-[#1e293b]">
                    {(['24h', '7d', '30d', '90d'] as const).map((tf) => (
                      <button
                        key={tf}
                        type="button"
                        onClick={() => setChartTimeframe(tf)}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                          chartTimeframe === tf
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-[#94a3b8] hover:text-white'
                        }`}
                      >
                        {tf.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SVG Visual Chart */}
                <div className="space-y-3">
                  <div className="h-52 w-full flex items-end gap-2 pt-6 pb-2 px-2 relative">
                    {/* Background grid lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                      <div className="border-b border-[#334155] w-full" />
                      <div className="border-b border-[#334155] w-full" />
                      <div className="border-b border-[#334155] w-full" />
                      <div className="border-b border-[#334155] w-full" />
                    </div>

                    {currentChartData.map((item, idx) => {
                      const val = chartMetric === 'volume_value' ? item.valueNaira : chartMetric === 'trade_count' ? item.count : item.escrow;
                      const heightPercent = Math.max(12, Math.round((val / maxChartValue) * 100));
                      const isHovered = hoveredDataIndex === idx;

                      return (
                        <div
                          key={idx}
                          onMouseEnter={() => setHoveredDataIndex(idx)}
                          onMouseLeave={() => setHoveredDataIndex(null)}
                          className="flex-1 flex flex-col items-center gap-1 h-full justify-end relative group cursor-pointer"
                        >
                          {/* Tooltip on Hover */}
                          {isHovered && (
                            <div className="absolute -top-12 z-20 bg-[#0a0f18] text-white border border-emerald-500/60 px-3 py-1.5 rounded-xl text-xs font-bold shadow-xl whitespace-nowrap">
                              <span className="text-emerald-400">₦{item.valueNaira.toLocaleString()} {chartTimeframe === '24h' ? 'Million' : 'Billion'}</span>
                              <span className="text-[#94a3b8] text-[10px] block font-normal">{item.timestamp}</span>
                            </div>
                          )}

                          {/* Bar Graphic */}
                          <div
                            className={`w-full rounded-t-lg transition-all duration-300 ${
                              isHovered
                                ? 'bg-gradient-to-t from-emerald-600 via-teal-500 to-emerald-300 shadow-lg shadow-emerald-500/40 scale-105'
                                : 'bg-gradient-to-t from-emerald-900/80 via-emerald-700/80 to-teal-500/90'
                            }`}
                            style={{ height: `${heightPercent}%` }}
                          />

                          <span className="text-[10px] font-medium text-[#94a3b8] truncate max-w-[48px]">
                            {item.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#94a3b8] pt-2 border-t border-[#1e293b]">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                        <span>Trade Volume (₦ Naira)</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-teal-400" />
                        <span>Escrow Protected Flow</span>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAdminTab('sa_metrics')}
                      className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Detailed Analytics</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Concurrency by User Role Progress Bars */}
              <div className="bg-[#111927] border border-[#1e293b] rounded-2xl p-5 shadow-lg space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-teal-400" />
                    <h3 className="font-heading font-bold text-sm text-white">
                      Live User Concurrency by Platform Persona
                    </h3>
                  </div>
                  <span className="text-[11px] font-extrabold text-emerald-400 bg-emerald-950/70 border border-emerald-600/40 px-2.5 py-0.5 rounded-full">
                    52,430 Active Sessions
                  </span>
                </div>

                <div className="space-y-3">
                  {concurrencyBreakdown.map((item, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-[#e2e8f0]">{item.roleLabel}</span>
                        <span className="font-bold text-white">
                          {item.count}{' '}
                          <span className="text-[11px] text-[#94a3b8] font-normal">({item.percent}%)</span>
                        </span>
                      </div>
                      <div className="w-full bg-[#0a0f18] h-2 rounded-full overflow-hidden border border-[#1e293b]">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                          style={{ width: `${item.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: System-Wide Alerts Live Feed & Quick Actions */}
            <div className="space-y-6">
              {/* Alerts Snapshot Card */}
              <div className="bg-[#111927] border border-[#1e293b] rounded-2xl p-5 shadow-lg space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-amber-400" />
                      <h3 className="font-heading font-bold text-sm text-white">Live System Alerts</h3>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-950 border border-rose-500/50 text-rose-300">
                      {activeCriticalCount} Critical
                    </span>
                  </div>

                  <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                    {alerts.slice(0, 4).map((alt) => (
                      <div
                        key={alt.id}
                        onClick={() => setSelectedAlertForDetail(alt)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                          alt.severity === 'critical'
                            ? 'bg-rose-950/30 border-rose-600/40 hover:border-rose-400'
                            : alt.severity === 'warning'
                            ? 'bg-amber-950/30 border-amber-600/40 hover:border-amber-400'
                            : 'bg-emerald-950/30 border-emerald-600/40 hover:border-emerald-400'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-bold text-white line-clamp-1">{alt.title}</span>
                          <span
                            className={`text-[9px] font-extrabold px-2 py-0.2 rounded-full uppercase shrink-0 ${
                              alt.severity === 'critical'
                                ? 'bg-rose-900 text-rose-200'
                                : alt.severity === 'warning'
                                ? 'bg-amber-900 text-amber-200'
                                : 'bg-emerald-900 text-emerald-200'
                            }`}
                          >
                            {alt.severity}
                          </span>
                        </div>

                        <p className="text-[11px] text-[#cbd5e1] line-clamp-2">{alt.description}</p>

                        <div className="flex items-center justify-between text-[10px] text-[#94a3b8] pt-1 border-t border-[#1e293b]/60">
                          <span>{alt.service}</span>
                          <span>{alt.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#1e293b]">
                  <button
                    type="button"
                    onClick={() => setAdminTab('sa_alerts')}
                    className="w-full py-2 bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>View All ({alerts.length}) System Alerts</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Edge Infrastructure Quick Specs */}
              <div className="bg-[#111927] border border-[#1e293b] rounded-2xl p-5 shadow-lg space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-[#1e293b]">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-heading font-bold text-sm text-white">Cluster Health Telemetry</h3>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="p-2.5 bg-[#0a0f18] rounded-xl border border-[#1e293b] flex justify-between items-center">
                    <span className="text-[#94a3b8]">CPU Cluster Utilization</span>
                    <span className="font-mono font-bold text-emerald-400">29.4% (128 vCPUs)</span>
                  </div>
                  <div className="p-2.5 bg-[#0a0f18] rounded-xl border border-[#1e293b] flex justify-between items-center">
                    <span className="text-[#94a3b8]">Memory Allocation</span>
                    <span className="font-mono font-bold text-white">194 GB / 512 GB</span>
                  </div>
                  <div className="p-2.5 bg-[#0a0f18] rounded-xl border border-[#1e293b] flex justify-between items-center">
                    <span className="text-[#94a3b8]">Redis Cache Hit Ratio</span>
                    <span className="font-mono font-bold text-emerald-400">99.2% (14.2 GB buffer)</span>
                  </div>
                  <div className="p-2.5 bg-[#0a0f18] rounded-xl border border-[#1e293b] flex justify-between items-center">
                    <span className="text-[#94a3b8]">Cloud SQL DB Connection Pool</span>
                    <span className="font-mono font-bold text-blue-400">22 / 300 Active</span>
                  </div>
                  <div className="p-2.5 bg-[#0a0f18] rounded-xl border border-[#1e293b] flex justify-between items-center">
                    <span className="text-[#94a3b8]">USSD Packet Drop Rate</span>
                    <span className="font-mono font-bold text-emerald-400">0.09% (Nominal)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. TAB 2: Transaction Volume & Detailed Charts */}
      {activeView === 'transactions' && (
        <div className="space-y-6">
          {/* Top Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#111927] border border-[#1e293b] p-5 rounded-2xl shadow-lg space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#94a3b8]">Escrow Vault Protected</span>
              <div className="font-heading font-extrabold text-2xl text-emerald-400">₦1.48 Billion</div>
              <p className="text-xs text-[#94a3b8]">Backed by CBN-regulated commercial banks</p>
            </div>
            <div className="bg-[#111927] border border-[#1e293b] p-5 rounded-2xl shadow-lg space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#94a3b8]">Completed National Trades</span>
              <div className="font-heading font-extrabold text-2xl text-white">148,290 Orders</div>
              <p className="text-xs text-emerald-400 font-bold">99.8% Electronic Proof of Delivery (e-POD)</p>
            </div>
            <div className="bg-[#111927] border border-[#1e293b] p-5 rounded-2xl shadow-lg space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#94a3b8]">Platform Escrow Fee (1%)</span>
              <div className="font-heading font-extrabold text-2xl text-amber-400">₦184.50 Million</div>
              <p className="text-xs text-[#94a3b8]">Net platform operational sustainability margin</p>
            </div>
          </div>

          {/* Large Interactive Chart Container */}
          <div className="bg-[#111927] border border-[#1e293b] rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-[#1e293b]">
              <div>
                <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-400" />
                  <span>National Transaction Volume & Settlement Matrix</span>
                </h3>
                <p className="text-xs text-[#94a3b8]">
                  Detailed breakdown of value flow, trade count, and escrow clearing intervals across Nigeria
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Metric Selector */}
                <div className="flex items-center gap-1 bg-[#0a0f18] p-1 rounded-xl border border-[#1e293b]">
                  <button
                    type="button"
                    onClick={() => setChartMetric('volume_value')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      chartMetric === 'volume_value'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-[#94a3b8] hover:text-white'
                    }`}
                  >
                    Volume (₦)
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartMetric('trade_count')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      chartMetric === 'trade_count'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-[#94a3b8] hover:text-white'
                    }`}
                  >
                    Trade Count
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartMetric('escrow_settled')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      chartMetric === 'escrow_settled'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-[#94a3b8] hover:text-white'
                    }`}
                  >
                    Escrow Flow
                  </button>
                </div>

                {/* Timeframe Selector */}
                <div className="flex items-center gap-1 bg-[#0a0f18] p-1 rounded-xl border border-[#1e293b]">
                  {(['24h', '7d', '30d', '90d', '1y'] as const).map((tf) => (
                    <button
                      key={tf}
                      type="button"
                      onClick={() => setChartTimeframe(tf)}
                      className={`px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        chartTimeframe === tf
                          ? 'bg-teal-600 text-white shadow-xs'
                          : 'text-[#94a3b8] hover:text-white'
                      }`}
                    >
                      {tf.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Dynamic Graphic Bars */}
            <div className="space-y-4">
              <div className="h-64 w-full flex items-end gap-3 pt-8 pb-3 px-3 relative bg-[#0a0f18]/60 rounded-xl border border-[#1e293b]">
                {/* Horizontal Grid */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 p-3">
                  <div className="border-b border-[#334155] w-full" />
                  <div className="border-b border-[#334155] w-full" />
                  <div className="border-b border-[#334155] w-full" />
                  <div className="border-b border-[#334155] w-full" />
                </div>

                {currentChartData.map((d, idx) => {
                  const val = chartMetric === 'volume_value' ? d.valueNaira : chartMetric === 'trade_count' ? d.count : d.escrow;
                  const heightPercent = Math.max(14, Math.round((val / maxChartValue) * 100));
                  const isHovered = hoveredDataIndex === idx;

                  return (
                    <div
                      key={idx}
                      onMouseEnter={() => setHoveredDataIndex(idx)}
                      onMouseLeave={() => setHoveredDataIndex(null)}
                      className="flex-1 flex flex-col items-center justify-end h-full relative cursor-pointer group"
                    >
                      {/* Active Tooltip */}
                      {isHovered && (
                        <div className="absolute -top-14 z-30 bg-[#0a0f18] text-white border border-emerald-400 p-2 rounded-xl text-xs font-bold shadow-2xl">
                          <div className="text-emerald-400">
                            {chartMetric === 'volume_value'
                              ? `₦${d.valueNaira.toLocaleString()} ${chartTimeframe === '24h' ? 'M' : 'B'}`
                              : chartMetric === 'trade_count'
                              ? `${d.count.toLocaleString()} Trades`
                              : `₦${d.escrow.toLocaleString()} ${chartTimeframe === '24h' ? 'M' : 'B'} Escrow`}
                          </div>
                          <div className="text-[10px] text-[#94a3b8]">{d.timestamp}</div>
                        </div>
                      )}

                      <div
                        className={`w-full rounded-t-lg transition-all duration-300 ${
                          isHovered
                            ? 'bg-gradient-to-t from-emerald-600 via-teal-400 to-emerald-200 shadow-xl shadow-emerald-500/50 scale-105'
                            : 'bg-gradient-to-t from-emerald-950 via-emerald-800 to-teal-500'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />

                      <span className="text-[11px] font-bold text-[#94a3b8] mt-2 group-hover:text-white transition-colors">
                        {d.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Commodity Breakdown Table */}
          <div className="bg-[#111927] border border-[#1e293b] rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
              <div>
                <h3 className="font-heading font-bold text-sm text-white">
                  National Trade Volume by Agricultural Commodity
                </h3>
                <p className="text-xs text-[#94a3b8]">
                  Tonnage cleared, gross Naira settlement, and top regional supply hubs
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950 border border-emerald-600/40 px-3 py-1 rounded-xl">
                Live Clearing Data
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#1e293b] text-[#94a3b8] font-bold bg-[#0a0f18]/60">
                    <th className="p-3">Agricultural Commodity</th>
                    <th className="p-3">Volume Transacted</th>
                    <th className="p-3">Gross Value (₦)</th>
                    <th className="p-3">Market Share</th>
                    <th className="p-3">Primary Corridors</th>
                    <th className="p-3 text-right">MoM Velocity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e293b]">
                  {commodityVolumes.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#1e293b]/40 transition-colors">
                      <td className="p-3 font-bold text-white">{item.name}</td>
                      <td className="p-3 font-medium text-[#cbd5e1]">{item.volume}</td>
                      <td className="p-3 font-bold text-emerald-400">{item.value}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-[#0a0f18] h-2 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${item.percent * 2}%` }} />
                          </div>
                          <span className="font-mono text-[10px] text-[#94a3b8]">{item.percent}%</span>
                        </div>
                      </td>
                      <td className="p-3 text-[#94a3b8]">{item.zone}</td>
                      <td className="p-3 text-right font-bold text-emerald-400">{item.trend}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 7. TAB 3: System-Wide Alerts Panel */}
      {activeView === 'alerts' && (
        <div className="space-y-6">
          {/* Alerts Filter & Search Header */}
          <div className="bg-[#111927] border border-[#1e293b] rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-[#1e293b]">
              <div>
                <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-amber-400" />
                  <span>National System Alerts & Incident Management</span>
                </h3>
                <p className="text-xs text-[#94a3b8]">
                  Automated anomaly detection across banking gateways, price monitors, USSD queues, and security gates
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowBroadcastModal(true)}
                className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-950/40 cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Publish New Alert</span>
              </button>
            </div>

            {/* Filter Ribbons */}
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#64748b] absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search alerts by title, service node, keyword, or affected Nigerian state..."
                  value={alertSearchQuery}
                  onChange={(e) => setAlertSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0a0f18] border border-[#1e293b] rounded-xl text-xs text-white placeholder-[#64748b] focus:outline-hidden focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* Severity Toggles */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-[#94a3b8] font-bold">Severity:</span>
                {(['all', 'critical', 'warning', 'info'] as const).map((sev) => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setAlertSeverityFilter(sev)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                      alertSeverityFilter === sev
                        ? sev === 'critical'
                          ? 'bg-rose-600 text-white'
                          : sev === 'warning'
                          ? 'bg-amber-600 text-white'
                          : sev === 'info'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#1e293b] text-white border border-slate-600'
                        : 'bg-[#0a0f18] text-[#94a3b8] hover:text-white border border-[#1e293b]'
                    }`}
                  >
                    {sev}
                  </button>
                ))}

                {/* Status Toggles */}
                <span className="text-xs text-[#94a3b8] font-bold ml-2">Status:</span>
                {(['all', 'active', 'acknowledged', 'resolved'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setAlertStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                      alertStatusFilter === st
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-[#0a0f18] text-[#94a3b8] hover:text-white border border-[#1e293b]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Alerts List */}
          <div className="space-y-3">
            {filteredAlerts.length === 0 ? (
              <div className="bg-[#111927] border border-[#1e293b] rounded-2xl p-10 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="font-heading font-bold text-sm text-white">No Matching System Alerts</h4>
                <p className="text-xs text-[#94a3b8]">All microservice nodes and agricultural rails operating cleanly.</p>
              </div>
            ) : (
              filteredAlerts.map((alt) => (
                <div
                  key={alt.id}
                  className={`bg-[#111927] border rounded-2xl p-5 shadow-lg space-y-3 transition-all ${
                    alt.severity === 'critical'
                      ? 'border-rose-600/40 hover:border-rose-500'
                      : alt.severity === 'warning'
                      ? 'border-amber-600/40 hover:border-amber-500'
                      : 'border-emerald-600/40 hover:border-emerald-500'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          alt.severity === 'critical'
                            ? 'bg-rose-900 text-rose-200 border border-rose-500/50'
                            : alt.severity === 'warning'
                            ? 'bg-amber-900 text-amber-200 border border-amber-500/50'
                            : 'bg-emerald-900 text-emerald-200 border border-emerald-500/50'
                        }`}
                      >
                        {alt.severity}
                      </span>
                      <span className="font-mono text-[11px] text-[#64748b]">{alt.id}</span>
                      <span className="text-[10px] bg-[#0a0f18] text-[#94a3b8] px-2 py-0.5 rounded-md border border-[#1e293b]">
                        {alt.category}
                      </span>
                      <span className="font-heading font-bold text-sm text-white">{alt.title}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#94a3b8]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{alt.timestamp}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#cbd5e1] leading-relaxed">{alt.description}</p>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2 border-t border-[#1e293b]">
                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#94a3b8]">
                      <span className="flex items-center gap-1.5">
                        <Server className="w-3.5 h-3.5 text-blue-400" />
                        <span>Node: <strong className="text-white">{alt.service}</strong></span>
                      </span>
                      {alt.affectedRegion && (
                        <span className="flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Region: <strong className="text-white">{alt.affectedRegion}</strong></span>
                        </span>
                      )}
                      {alt.acknowledgedBy && (
                        <span className="text-teal-400 font-semibold">
                          Ack by: {alt.acknowledgedBy}
                        </span>
                      )}
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-2">
                      {alt.status === 'active' && (
                        <button
                          type="button"
                          onClick={() => handleAcknowledgeAlert(alt.id)}
                          className="px-3 py-1 bg-[#1e293b] hover:bg-[#334155] text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold transition-all cursor-pointer"
                        >
                          Acknowledge
                        </button>
                      )}
                      {alt.status !== 'resolved' && (
                        <button
                          type="button"
                          onClick={() => handleResolveAlert(alt.id)}
                          className="px-3 py-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/50 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Resolve</span>
                        </button>
                      )}
                      {alt.status === 'resolved' && (
                        <span className="px-3 py-1 bg-[#064e3b]/50 text-emerald-300 border border-emerald-600/30 rounded-xl text-xs font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Resolved</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 8. TAB 4: Microservices & API Gateway Telemetry */}
      {activeView === 'microservices' && (
        <div className="space-y-6">
          <div className="bg-[#111927] border border-[#1e293b] rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-[#1e293b]">
              <div>
                <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
                  <Server className="w-5 h-5 text-emerald-400" />
                  <span>Microservices Architecture & Gateway Telemetry</span>
                </h3>
                <p className="text-xs text-[#94a3b8]">
                  Real-time health, response latency, and throughput across national payment and telecommunication backbones
                </p>
              </div>

              <button
                type="button"
                onClick={handlePingNodes}
                disabled={isPingingNodes}
                className="flex items-center gap-2 px-3.5 py-2 bg-emerald-950 border border-emerald-500/50 hover:bg-emerald-900 text-emerald-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isPingingNodes ? 'animate-spin' : ''}`} />
                <span>Execute Health Probe</span>
              </button>
            </div>

            {/* Grid of Microservice Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {microservices.map((svc) => (
                <div
                  key={svc.id}
                  className="bg-[#0a0f18] border border-[#1e293b] hover:border-emerald-500/40 rounded-2xl p-4 shadow-md space-y-3 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-heading font-bold text-xs text-white leading-snug">{svc.name}</h4>
                      <p className="text-[10px] text-[#64748b]">{svc.region}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold rounded-full shrink-0">
                      {svc.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#1e293b] text-center">
                    <div className="p-1.5 bg-[#111927] rounded-lg">
                      <div className="text-[10px] text-[#94a3b8]">Latency</div>
                      <div className="text-xs font-bold text-emerald-400">{svc.latency}</div>
                    </div>
                    <div className="p-1.5 bg-[#111927] rounded-lg">
                      <div className="text-[10px] text-[#94a3b8]">Uptime</div>
                      <div className="text-xs font-bold text-white">{svc.uptime}</div>
                    </div>
                    <div className="p-1.5 bg-[#111927] rounded-lg">
                      <div className="text-[10px] text-[#94a3b8]">Traffic</div>
                      <div className="text-xs font-bold text-teal-300">{svc.rps}</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-[#94a3b8] pt-1">
                    <span>CPU: <strong className="text-white">{svc.cpu}</strong> | Mem: <strong className="text-white">{svc.memory}</strong></span>
                    <span>Err: <strong className="text-emerald-400">{svc.errorRate}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 9. TAB 5: Emergency Controls & Circuit Breakers */}
      {activeView === 'circuit_breakers' && (
        <div className="space-y-6">
          <div className="bg-[#111927] border border-[#1e293b] rounded-2xl p-6 shadow-xl space-y-6">
            <div className="pb-4 border-b border-[#1e293b]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-red-950 border border-red-500/50 rounded-xl text-red-400">
                  <AlertOctagon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-white">
                    Emergency Governance Switches & Financial Circuit Breakers
                  </h3>
                  <p className="text-xs text-[#94a3b8]">
                    High-authority operational switches for platform owner to halt trade, freeze escrow, or engage maintenance
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Switch 1: Marketplace Trading */}
              <div className="bg-[#0a0f18] border border-[#1e293b] rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-heading font-bold text-xs text-white">Marketplace Trade Engine</span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        tradingFrozen ? 'bg-rose-950 text-rose-200 border border-rose-500' : 'bg-emerald-950 text-emerald-200 border border-emerald-500/40'
                      }`}
                    >
                      {tradingFrozen ? 'FROZEN' : 'ACTIVE'}
                    </span>
                  </div>
                  <p className="text-xs text-[#94a3b8]">
                    Instantly suspends new order checkouts, haulage bidding, and produce listings in case of national market disruptions.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleToggleTrading}
                  className={`w-full py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    tradingFrozen
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/40'
                      : 'bg-rose-700 hover:bg-rose-600 text-white shadow-lg shadow-rose-950/50'
                  }`}
                >
                  {tradingFrozen ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  <span>{tradingFrozen ? 'Unfreeze Marketplace' : 'Halt Marketplace Trading'}</span>
                </button>
              </div>

              {/* Switch 2: Escrow Payout Auto-Sentry */}
              <div className="bg-[#0a0f18] border border-[#1e293b] rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-heading font-bold text-xs text-white">NIBSS Escrow Auto-Settlement</span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        escrowFrozen ? 'bg-rose-950 text-rose-200 border border-rose-500' : 'bg-emerald-950 text-emerald-200 border border-emerald-500/40'
                      }`}
                    >
                      {escrowFrozen ? 'PAUSED' : 'AUTO-RELEASE ACTIVE'}
                    </span>
                  </div>
                  <p className="text-xs text-[#94a3b8]">
                    Holds automated wallet disbursements and requires manual compliance clearance for payouts &gt; ₦5,000,000.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleToggleEscrow}
                  className={`w-full py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    escrowFrozen
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-rose-700 hover:bg-rose-600 text-white'
                  }`}
                >
                  {escrowFrozen ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  <span>{escrowFrozen ? 'Resume Auto-Settlement' : 'Pause Escrow Payouts'}</span>
                </button>
              </div>

              {/* Switch 3: Maintenance Mode */}
              <div className="bg-[#0a0f18] border border-[#1e293b] rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-heading font-bold text-xs text-white">Platform Maintenance Gate</span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        maintenanceGate ? 'bg-amber-950 text-amber-200 border border-amber-500' : 'bg-emerald-950 text-emerald-200 border border-emerald-500/40'
                      }`}
                    >
                      {maintenanceGate ? 'MAINTENANCE ENGAGED' : 'PUBLIC ONLINE'}
                    </span>
                  </div>
                  <p className="text-xs text-[#94a3b8]">
                    Gates public web and mobile ingress during national database schema migrations or core upgrades.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleToggleMaintenance}
                  className={`w-full py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    maintenanceGate
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-amber-700 hover:bg-amber-600 text-white'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>{maintenanceGate ? 'Deactivate Maintenance' : 'Engage Maintenance Mode'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 10. Broadcast Alert Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#111927] border border-[#1e293b] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 text-white animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center pb-3 border-b border-[#1e293b]">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-400" />
                <h3 className="font-heading font-bold text-base text-white">Broadcast Platform Alert</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowBroadcastModal(false)}
                className="text-[#94a3b8] hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBroadcastAlert} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-[#e2e8f0]">Alert Headline / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scheduled NIBSS Banking Settlement Bus Maintenance"
                  value={newAlertTitle}
                  onChange={(e) => setNewAlertTitle(e.target.value)}
                  className="w-full p-2.5 bg-[#0a0f18] border border-[#1e293b] rounded-xl text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-[#e2e8f0]">Severity Tier</label>
                  <select
                    value={newAlertSeverity}
                    onChange={(e) => setNewAlertSeverity(e.target.value as any)}
                    className="w-full p-2.5 bg-[#0a0f18] border border-[#1e293b] rounded-xl text-white font-medium"
                  >
                    <option value="critical">Critical (Immediate Red Flag)</option>
                    <option value="warning">Warning (Operational Advisory)</option>
                    <option value="info">Info (System Telemetry)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#e2e8f0]">Category</label>
                  <select
                    value={newAlertCategory}
                    onChange={(e) => setNewAlertCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-[#0a0f18] border border-[#1e293b] rounded-xl text-white font-medium"
                  >
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Settlement">Settlement</option>
                    <option value="Security">Security</option>
                    <option value="Trade">Trade</option>
                    <option value="Telecom">Telecom</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#e2e8f0]">Target Nigerian Region</label>
                <input
                  type="text"
                  value={newAlertRegion}
                  onChange={(e) => setNewAlertRegion(e.target.value)}
                  placeholder="National or specific state(s) e.g. Kano, Kaduna, Benue"
                  className="w-full p-2.5 bg-[#0a0f18] border border-[#1e293b] rounded-xl text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#e2e8f0]">Technical Description & Directive</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide explicit operational advisory for ministry admins, field agents, and financial operators..."
                  value={newAlertDesc}
                  onChange={(e) => setNewAlertDesc(e.target.value)}
                  className="w-full p-2.5 bg-[#0a0f18] border border-[#1e293b] rounded-xl text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1e293b]">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-[#94a3b8] rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold shadow-md cursor-pointer flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Alert</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
