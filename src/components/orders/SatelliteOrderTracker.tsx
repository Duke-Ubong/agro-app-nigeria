import React, { useState, useEffect, useRef } from 'react';
import { Order } from '../../types';
import satelliteMapImg from '../../assets/images/nigeria_satellite_map_1792237735975.jpg';

interface SatelliteOrderTrackerProps {
  order: Order;
  onClose?: () => void;
  isInline?: boolean;
}

interface Waypoint {
  id: string;
  name: string;
  state: string;
  type: 'origin' | 'checkpoint' | 'rest_stop' | 'corridor' | 'destination';
  lat: number;
  lng: number;
  pct: number; // percentage along journey (0 to 100)
  note: string;
  status: 'passed' | 'active' | 'upcoming';
  timeEstimate: string;
}

export const SatelliteOrderTracker: React.FC<SatelliteOrderTrackerProps> = ({
  order,
  onClose,
  isInline = false,
}) => {
  // Map visualization layer: 'satellite' | 'hybrid' | 'thermal'
  const [viewMode, setViewMode] = useState<'satellite' | 'hybrid' | 'thermal'>('satellite');
  
  // Simulation playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1); // 1x, 2x, 5x
  const [progress, setProgress] = useState<number>(62); // Initial progress 62% along route (in-transit around Ore / Lokoja bypass)
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showDriverDetails, setShowDriverDetails] = useState<boolean>(false);
  const [pingAlert, setPingAlert] = useState<string | null>(null);

  // Dynamic telemetry metrics
  const [liveSpeed, setLiveSpeed] = useState<number>(64);
  const [cargoTemp, setCargoTemp] = useState<number>(23.6);
  const [moistureLevel, setMoistureLevel] = useState<number>(12.4);

  // Corridor waypoints for Nigerian agricultural transit
  const isKadunaLagos = order.originState.includes('Kaduna') || order.originState.includes('Kano');
  
  const waypoints: Waypoint[] = isKadunaLagos
    ? [
        {
          id: 'wp_1',
          name: `${order.originState} Central Grain Silos`,
          state: order.originState,
          type: 'origin',
          lat: 10.5105,
          lng: 7.4165,
          pct: 0,
          note: 'Produce inspected, bagged & loaded into 30-ton haulage truck',
          status: progress >= 5 ? 'passed' : 'active',
          timeEstimate: '06:30 AM (Departed)',
        },
        {
          id: 'wp_2',
          name: 'Tafa Federal Weighbridge & Quality Post',
          state: 'Niger / Kaduna Border',
          type: 'checkpoint',
          lat: 9.3854,
          lng: 7.2341,
          pct: 25,
          note: 'Axle load 29.8 MT verified • E-waybill manifest stamped by ADP inspector',
          status: progress >= 25 ? 'passed' : progress >= 15 ? 'active' : 'upcoming',
          timeEstimate: '09:45 AM (Cleared)',
        },
        {
          id: 'wp_3',
          name: 'Lokoja Confluence Transit Hub',
          state: 'Kogi State',
          type: 'rest_stop',
          lat: 7.8023,
          lng: 6.7431,
          pct: 50,
          note: 'Driver mandatory rest interval • Tire pressure & refrigeration telemetry check',
          status: progress >= 50 ? 'passed' : progress >= 38 ? 'active' : 'upcoming',
          timeEstimate: '01:15 PM (Completed)',
        },
        {
          id: 'wp_4',
          name: 'Ore Interstate Agro-Freight Corridor (A2 Highway)',
          state: 'Ondo State',
          type: 'corridor',
          lat: 6.7485,
          lng: 4.8782,
          pct: 75,
          note: 'Passing major commercial crossroads • Clear road conditions • Steady 65 km/h',
          status: progress >= 75 ? 'passed' : progress >= 50 ? 'active' : 'upcoming',
          timeEstimate: '04:50 PM (In Transit)',
        },
        {
          id: 'wp_5',
          name: `${order.destinationState} Terminal Agro-Depot`,
          state: order.destinationState,
          type: 'destination',
          lat: 6.5244,
          lng: 3.3792,
          pct: 100,
          note: 'Offloading bay prepared • Escrow payout pending electronic waybill signature',
          status: progress >= 98 ? 'active' : 'upcoming',
          timeEstimate: '08:30 PM (ETA)',
        },
      ]
    : [
        {
          id: 'wp_1',
          name: `${order.originState} Aggregation Center`,
          state: order.originState,
          type: 'origin',
          lat: 7.1557,
          lng: 3.3451,
          pct: 0,
          note: 'Quality graded & sealed • Dispatch manifest issued',
          status: progress >= 10 ? 'passed' : 'active',
          timeEstimate: '08:00 AM (Departed)',
        },
        {
          id: 'wp_2',
          name: 'Sagamu Interchange Logistics Point',
          state: 'Ogun State',
          type: 'checkpoint',
          lat: 6.8398,
          lng: 3.6496,
          pct: 45,
          note: 'Transit toll & federal phytosanitary pass verified',
          status: progress >= 45 ? 'passed' : progress >= 25 ? 'active' : 'upcoming',
          timeEstimate: '11:20 AM (Cleared)',
        },
        {
          id: 'wp_3',
          name: `${order.destinationState} Industrial Silos`,
          state: order.destinationState,
          type: 'destination',
          lat: 6.5954,
          lng: 3.3421,
          pct: 100,
          note: 'Destination warehouse • Ready for offload & quality confirmation',
          status: progress >= 95 ? 'active' : 'upcoming',
          timeEstimate: '02:45 PM (ETA)',
        },
      ];

  // Calculate current coordinates based on progress interpolation
  const currentWaypointIndex = Math.min(
    waypoints.length - 1,
    Math.max(0, Math.floor((progress / 100) * (waypoints.length - 1)))
  );
  const nextWaypointIndex = Math.min(waypoints.length - 1, currentWaypointIndex + 1);

  const startWp = waypoints[currentWaypointIndex];
  const endWp = waypoints[nextWaypointIndex];
  const segmentFraction =
    startWp.pct === endWp.pct ? 0 : (progress - startWp.pct) / (endWp.pct - startWp.pct || 1);
  const clampedFraction = Math.max(0, Math.min(1, segmentFraction));

  const currentLat = (startWp.lat + (endWp.lat - startWp.lat) * clampedFraction).toFixed(4);
  const currentLng = (startWp.lng + (endWp.lng - startWp.lng) * clampedFraction).toFixed(4);

  // Simulation timer loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 10; // Loop simulation seamlessly
        }
        return Math.min(100, prev + 0.3 * simSpeed);
      });

      // Subtle realistic telemetry fluctuations
      setLiveSpeed((prev) => {
        const change = (Math.random() - 0.48) * 3;
        return Math.min(78, Math.max(52, Math.round(prev + change)));
      });
      setCargoTemp((prev) => {
        const change = (Math.random() - 0.5) * 0.1;
        return parseFloat((prev + change).toFixed(1));
      });
      setMoistureLevel((prev) => {
        const change = (Math.random() - 0.5) * 0.05;
        return parseFloat(Math.min(13.2, Math.max(11.8, prev + change)).toFixed(1));
      });
    }, 400);

    return () => clearInterval(interval);
  }, [isPlaying, simSpeed]);

  const triggerPing = (message: string) => {
    setPingAlert(message);
    setTimeout(() => setPingAlert(null), 3000);
  };

  // SVG route path calculations
  // Truck position on 2D map canvas (0% to 100% width and height)
  // Route goes diagonally from upper right to lower left representing North-to-South Nigeria corridor
  const routePoints = [
    { x: 82, y: 15 },
    { x: 68, y: 34 },
    { x: 52, y: 54 },
    { x: 34, y: 72 },
    { x: 18, y: 88 },
  ];

  // Interpolate truck position on the map SVG
  const totalSegments = routePoints.length - 1;
  const currentSeg = Math.min(totalSegments - 1, Math.floor((progress / 100) * totalSegments));
  const segProgress = (progress / 100) * totalSegments - currentSeg;

  const p1 = routePoints[currentSeg];
  const p2 = routePoints[Math.min(totalSegments, currentSeg + 1)];
  const truckX = p1.x + (p2.x - p1.x) * segProgress;
  const truckY = p1.y + (p2.y - p1.y) * segProgress;

  return (
    <div
      className={`bg-[#0d1410] text-white rounded-2xl overflow-hidden border border-[#1b4332] shadow-2xl transition-all ${
        isFullscreen ? 'fixed inset-4 z-50 flex flex-col' : 'w-full'
      }`}
    >
      {/* Top Telemetry Header Bar */}
      <div className="bg-[#051a11] px-4 py-3 border-b border-[#1b4332] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-[#003822] text-[#34d399] border border-[#059669]/40">
            <span className="material-symbols-outlined text-[18px] animate-pulse">satellite_alt</span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#10b981] rounded-full animate-ping" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-black text-sm text-white tracking-tight flex items-center gap-1.5">
                <span>Federal Agro-Satellite Telemetry</span>
                <span className="text-[10px] bg-[#10b981]/20 text-[#34d399] border border-[#10b981]/40 px-2 py-0.2 rounded font-mono font-bold">
                  ORBITAL PASS ACTIVE
                </span>
              </h2>
            </div>
            <p className="text-[11px] text-[#9ca3af] flex items-center gap-2 mt-0.5">
              <span>Waybill Code: <strong className="text-white font-mono">{order.trackingCode}</strong></span>
              <span>•</span>
              <span>Cargo: <strong className="text-[#34d399]">{order.cropTitle}</strong> ({order.quantity} MT)</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Layer View Mode Switcher */}
          <div className="flex bg-[#032316] p-0.5 rounded-lg border border-[#065f46]">
            <button
              onClick={() => setViewMode('satellite')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all flex items-center gap-1 ${
                viewMode === 'satellite' ? 'bg-[#10b981] text-[#022c1b] shadow-xs' : 'text-[#9ca3af] hover:text-white'
              }`}
              title="Photogrammetric Satellite Observation"
            >
              <span className="material-symbols-outlined text-[14px]">satellite</span>
              <span>Satellite</span>
            </button>
            <button
              onClick={() => setViewMode('hybrid')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all flex items-center gap-1 ${
                viewMode === 'hybrid' ? 'bg-[#10b981] text-[#022c1b] shadow-xs' : 'text-[#9ca3af] hover:text-white'
              }`}
              title="Corridor Highway Hybrid Overlay"
            >
              <span className="material-symbols-outlined text-[14px]">alt_route</span>
              <span>Corridor</span>
            </button>
            <button
              onClick={() => setViewMode('thermal')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all flex items-center gap-1 ${
                viewMode === 'thermal' ? 'bg-[#10b981] text-[#022c1b] shadow-xs' : 'text-[#9ca3af] hover:text-white'
              }`}
              title="Cold-Chain Thermal Telemetry"
            >
              <span className="material-symbols-outlined text-[14px]">thermostat</span>
              <span>Cargo Telemetry</span>
            </button>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg bg-[#032316] hover:bg-[#065f46] text-[#9ca3af] hover:text-white border border-[#065f46] transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand Fullscreen'}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
            </span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#ba1a1a]/20 hover:bg-[#ba1a1a] text-[#ffdad6] hover:text-white border border-[#ba1a1a]/40 transition-colors"
              title="Close Satellite View"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Interactive Satellite Map Display */}
      <div className={`relative w-full bg-[#041009] overflow-hidden select-none ${isFullscreen ? 'flex-1 min-h-[480px]' : isInline ? 'h-96' : 'h-[440px]'}`}>
        
        {/* Real Satellite Aerial Photo Texture Layer */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out"
          style={{
            backgroundImage: `url(${satelliteMapImg})`,
            transform: `scale(${zoomLevel})`,
            filter:
              viewMode === 'thermal'
                ? 'hue-rotate(180deg) saturate(220%) contrast(120%)'
                : viewMode === 'hybrid'
                ? 'contrast(110%) brightness(95%)'
                : 'contrast(105%) brightness(100%)',
          }}
        />

        {/* Satellite HUD Overlay: Scanlines & Grid */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.6)_100%)]" />
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(16, 185, 129, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.15) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Live Satellite Orbital Crosshairs & HUD Telemetry */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 pointer-events-none">
          <div className="bg-[#021f14]/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#059669]/50 text-[11px] font-mono text-[#34d399] shadow-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
            <span>LAT: <strong className="text-white">{currentLat}° N</strong></span>
            <span>LNG: <strong className="text-white">{currentLng}° E</strong></span>
            <span className="text-[#9ca3af]">| ALT: 492m ASL</span>
          </div>

          <div className="bg-black/75 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 text-[10px] font-mono text-[#9ca3af] flex items-center gap-3">
            <span>SATELLITE: <strong className="text-white">SENTINEL-2A (ESA/NASRDA)</strong></span>
            <span>LOCK: <strong className="text-[#34d399]">12 GPS+GAL</strong></span>
            <span>GSD: <strong>0.5m/px</strong></span>
          </div>
        </div>

        {/* Floating Zoom & Map Nav Controls */}
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5">
          <button
            onClick={() => setZoomLevel((z) => Math.min(2.5, parseFloat((z + 0.3).toFixed(1))))}
            className="w-8 h-8 rounded-lg bg-[#021f14]/80 hover:bg-[#065f46] text-white border border-[#059669]/40 flex items-center justify-center backdrop-blur-md transition-all active:scale-95"
            title="Zoom In"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(1, parseFloat((z - 0.3).toFixed(1))))}
            className="w-8 h-8 rounded-lg bg-[#021f14]/80 hover:bg-[#065f46] text-white border border-[#059669]/40 flex items-center justify-center backdrop-blur-md transition-all active:scale-95"
            title="Zoom Out"
          >
            <span className="material-symbols-outlined text-[18px]">remove</span>
          </button>
          <button
            onClick={() => {
              setZoomLevel(1);
              triggerPing('Centered satellite observation on haulage convoy');
            }}
            className="w-8 h-8 rounded-lg bg-[#021f14]/80 hover:bg-[#065f46] text-[#34d399] border border-[#059669]/40 flex items-center justify-center backdrop-blur-md transition-all active:scale-95"
            title="Center on Haulage Truck"
          >
            <span className="material-symbols-outlined text-[18px]">my_location</span>
          </button>
        </div>

        {/* Interactive Highway Vector Route Overlay on top of Satellite Map */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <defs>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="60%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Planned Highway Route Line */}
          <path
            d={`M ${routePoints.map((p) => `${p.x}%,${p.y}%`).join(' L ')}`}
            fill="none"
            stroke="rgba(255, 255, 255, 0.25)"
            strokeWidth="6"
            strokeDasharray="4 6"
          />

          {/* Active Travelled GPS Breadcrumb Trail */}
          <path
            d={`M ${routePoints.slice(0, currentSeg + 1).map((p) => `${p.x}%,${p.y}%`).join(' L ')} L ${truckX}%,${truckY}%`}
            fill="none"
            stroke="#10b981"
            strokeWidth="4"
            filter="url(#glow)"
          />

          {/* Corridor Waypoint Pins */}
          {routePoints.map((pt, idx) => {
            const wp = waypoints[idx] || waypoints[waypoints.length - 1];
            const isPassed = progress >= wp.pct;
            return (
              <g key={idx} transform={`translate(${pt.x * 0.01 * 100}%, ${pt.y * 0.01 * 100}%)`}>
                <circle
                  cx="0"
                  cy="0"
                  r={idx === 0 || idx === routePoints.length - 1 ? '7' : '5'}
                  fill={isPassed ? '#10b981' : '#4b5563'}
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              </g>
            );
          })}
        </svg>

        {/* Dynamic Moving Truck Marker with Radar Pulses */}
        <div
          className="absolute z-20 transition-all duration-300 ease-out -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group"
          style={{
            left: `${truckX}%`,
            top: `${truckY}%`,
          }}
          onClick={() => setShowDriverDetails(!showDriverDetails)}
        >
          {/* Radar Ping Concentric Rings */}
          <div className="absolute -inset-6 rounded-full bg-[#10b981]/25 animate-ping" />
          <div className="absolute -inset-3 rounded-full bg-[#34d399]/40 animate-pulse" />

          {/* Main Truck Beacon Badge */}
          <div className="relative w-10 h-10 rounded-full bg-[#012d1d] border-2 border-[#10b981] text-[#34d399] flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.8)]">
            <span className="material-symbols-outlined text-[20px] text-white">local_shipping</span>
          </div>

          {/* Overhead Callout Badge */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#022417]/95 backdrop-blur-md px-2.5 py-1 rounded-lg border border-[#10b981] shadow-xl text-center whitespace-nowrap">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-white">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-ping" />
              <span>{order.transporterName || 'Ibrahim Haulage Truck'}</span>
              <span className="text-[#34d399] font-mono">{liveSpeed} km/h</span>
            </div>
            <div className="text-[9px] text-[#9ca3af] font-mono mt-0.5">
              Plate: {order.transporterId ? 'KAD-882-X' : 'NG-AGRO-772'} • {progress.toFixed(0)}% Completed
            </div>
          </div>
        </div>

        {/* Waypoint Labels Floating on Map */}
        <div className="absolute top-[16%] right-[19%] z-10 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] text-[#c1ecd4] font-bold border border-white/10 pointer-events-none">
          Origin: {order.originState}
        </div>
        <div className="absolute bottom-[10%] left-[20%] z-10 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] text-[#fef08a] font-bold border border-white/10 pointer-events-none">
          Dest: {order.destinationState}
        </div>

        {/* Toast Notification Alert for Pings */}
        {pingAlert && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 bg-[#064e3b] text-white px-4 py-2 rounded-xl border border-[#34d399] text-xs font-bold shadow-2xl flex items-center gap-2 animate-bounce">
            <span className="material-symbols-outlined text-[18px] text-[#34d399]">check_circle</span>
            <span>{pingAlert}</span>
          </div>
        )}

        {/* Bottom Left HUD Telematics Overview */}
        <div className="absolute bottom-3 left-3 z-20 flex flex-wrap gap-2">
          <div className="bg-[#021f14]/90 backdrop-blur-md p-2.5 rounded-xl border border-[#059669]/40 text-xs shadow-lg space-y-1">
            <div className="flex items-center justify-between gap-4 text-[11px] text-[#9ca3af]">
              <span>Haulage Speed:</span>
              <span className="font-mono font-bold text-white text-xs">{liveSpeed} km/h</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-[11px] text-[#9ca3af]">
              <span>Internal Cargo Temp:</span>
              <span className="font-mono font-bold text-[#34d399]">{cargoTemp}°C (Safe)</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-[11px] text-[#9ca3af]">
              <span>Grain Moisture Sensor:</span>
              <span className="font-mono font-bold text-[#f59e0b]">{moistureLevel}% (Grade A)</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-[11px] text-[#9ca3af] pt-1 border-t border-white/10">
              <span>Security Electronic Seal:</span>
              <span className="font-bold text-[#10b981] flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">lock</span>
                <span>VERIFIED SEALED</span>
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Right Route Progress Milestone Badge */}
        <div className="absolute bottom-3 right-3 z-20 bg-[#021f14]/90 backdrop-blur-md px-3 py-2 rounded-xl border border-[#059669]/40 text-right text-xs shadow-lg">
          <div className="text-[10px] text-[#9ca3af] uppercase font-bold tracking-wider">Estimated Delivery</div>
          <div className="font-heading font-black text-sm text-white mt-0.5">
            {order.estimatedDeliveryDate || 'Today, 08:30 PM'}
          </div>
          <div className="text-[10px] text-[#34d399] font-mono mt-0.5">
            Approx. 4 hrs 15 mins remaining
          </div>
        </div>
      </div>

      {/* Playback & Real-Time Simulation Control Bar */}
      <div className="bg-[#051a11] p-4 border-t border-[#1b4332] space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          
          {/* Controls: Play/Pause, Speed multiplier */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="h-9 px-3.5 bg-[#10b981] hover:bg-[#059669] text-[#022c1b] font-bold text-xs rounded-lg flex items-center gap-1.5 transition-all active:scale-95 shadow-md"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isPlaying ? 'pause' : 'play_arrow'}
              </span>
              <span>{isPlaying ? 'Pause Feed' : 'Live Tracking'}</span>
            </button>

            <div className="flex bg-[#032316] rounded-lg p-0.5 border border-[#065f46]">
              {[1, 2, 5].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setSimSpeed(speed)}
                  className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded transition-colors ${
                    simSpeed === speed ? 'bg-[#10b981] text-[#022c1b]' : 'text-[#9ca3af] hover:text-white'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setProgress(10);
                triggerPing('Resetting live transit corridor simulation');
              }}
              className="p-2 rounded-lg bg-[#032316] hover:bg-[#065f46] text-[#9ca3af] hover:text-white border border-[#065f46] transition-colors"
              title="Rewind to Dispatch"
            >
              <span className="material-symbols-outlined text-[16px]">replay</span>
            </button>
          </div>

          {/* Journey Milestone Status Text */}
          <div className="text-xs text-[#9ca3af] flex items-center gap-2">
            <span>Current Transit Zone:</span>
            <span className="font-bold text-white bg-[#022c1b] px-2.5 py-1 rounded-md border border-[#065f46] text-[11px]">
              {waypoints.find((w) => w.status === 'active')?.name || 'Ore - Benin Expressway Corridor'}
            </span>
          </div>

          {/* Driver Communication Actions */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => triggerPing(`Connecting secure satellite VoIP call to Driver Malam Sani (+234 809 111 2233)...`)}
              className="px-3 py-1.5 bg-[#032316] hover:bg-[#065f46] text-white text-xs font-bold rounded-lg border border-[#065f46] flex items-center gap-1.5 transition-all"
            >
              <span className="material-symbols-outlined text-[16px] text-[#34d399]">call</span>
              <span>Call Haulage Driver</span>
            </button>

            <button
              onClick={() => triggerPing(`Official Ministry Waybill Ping sent to Transporter GPS Terminal.`)}
              className="px-3 py-1.5 bg-[#032316] hover:bg-[#065f46] text-white text-xs font-bold rounded-lg border border-[#065f46] flex items-center gap-1.5 transition-all"
            >
              <span className="material-symbols-outlined text-[16px] text-[#f59e0b]">send_to_mobile</span>
              <span>Send Waybill Ping</span>
            </button>
          </div>
        </div>

        {/* Journey Progress Interactive Scrubber */}
        <div className="space-y-1 pt-1">
          <div className="flex justify-between text-[11px] font-mono text-[#9ca3af]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#10b981]" />
              <span>{order.originState} (Loading)</span>
            </span>
            <span className="font-bold text-[#34d399]">
              Corridor Progress: {progress.toFixed(0)}%
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
              <span>{order.destinationState} (Offload)</span>
            </span>
          </div>

          <div className="relative flex items-center">
            <input
              type="range"
              min="0"
              max="100"
              step="0.5"
              value={progress}
              onChange={(e) => setProgress(parseFloat(e.target.value))}
              className="w-full h-2 bg-[#022417] rounded-lg appearance-none cursor-pointer accent-[#10b981]"
            />
          </div>
        </div>

        {/* Waypoint Checkpoint Tracker Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2 pt-2 border-t border-[#1b4332]/60">
          {waypoints.map((wp, idx) => {
            const isCompleted = wp.status === 'passed';
            const isActive = wp.status === 'active';

            return (
              <div
                key={wp.id}
                onClick={() => setProgress(wp.pct)}
                className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                  isActive
                    ? 'bg-[#02311f] border-[#10b981] shadow-lg ring-1 ring-[#10b981]/50'
                    : isCompleted
                    ? 'bg-[#031d13] border-[#065f46]/70 text-[#9ca3af]'
                    : 'bg-[#02140d] border-white/5 text-[#6b7280]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] uppercase font-bold tracking-wider">
                    Stop {idx + 1}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                      isActive
                        ? 'bg-[#10b981] text-[#022c1b]'
                        : isCompleted
                        ? 'bg-[#065f46] text-[#34d399]'
                        : 'bg-white/10 text-[#9ca3af]'
                    }`}
                  >
                    {isActive ? 'CURRENT' : isCompleted ? 'PASSED' : 'NEXT'}
                  </span>
                </div>

                <div className={`font-bold text-xs truncate ${isActive ? 'text-white' : isCompleted ? 'text-[#d1d5db]' : 'text-[#9ca3af]'}`}>
                  {wp.name}
                </div>
                <div className="text-[10px] text-[#9ca3af] mt-0.5 truncate">{wp.state}</div>
                <div className="text-[10px] font-mono text-[#34d399] mt-1">{wp.timeEstimate}</div>
              </div>
            );
          })}
        </div>

        {/* Federal Escrow Guarantee Banner */}
        <div className="bg-[#022417] p-2.5 rounded-xl border border-[#059669]/40 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#34d399] text-[20px]">shield_with_heart</span>
            <div>
              <span className="font-bold text-white">Central Bank / Bank of Agriculture Escrow Guarantee: </span>
              <span className="text-[#9ca3af]">
                ₦{order.totalPrice.toLocaleString()} secured. Satellite GPS confirmation triggers automatic payment release to farmer upon terminal scan.
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono bg-[#052e16] text-[#34d399] px-2 py-0.5 rounded border border-[#059669]">
            ESCROW SECURED #ESC-{order.id.replace('ord_', '')}
          </span>
        </div>
      </div>
    </div>
  );
};
