import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export const AdminGovernanceOverview: React.FC = () => {
  const { listings, orders, loans, usersList } = useApp();
  const { role } = useAuth();
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>('All States');
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'quarter'>('month');

  // National Silo Strategic Reserves Mock Data
  const [siloReserves, setSiloReserves] = useState([
    { id: 'silo_1', location: 'Minna, Niger State', commodity: 'Maize & Sorghum', capacityMT: 100000, currentStockMT: 78500, status: 'Healthy', thresholdAlert: false },
    { id: 'silo_2', location: 'Kano, Kano State', commodity: 'Wheat & Rice Paddy', capacityMT: 150000, currentStockMT: 112000, status: 'Healthy', thresholdAlert: false },
    { id: 'silo_3', location: 'Ilorin, Kwara State', commodity: 'White & Yellow Corn', capacityMT: 80000, currentStockMT: 39000, status: 'Moderate', thresholdAlert: true },
    { id: 'silo_4', location: 'Gombe, Gombe State', commodity: 'Sesame & Millet', capacityMT: 60000, currentStockMT: 49200, status: 'Healthy', thresholdAlert: false },
    { id: 'silo_5', location: 'Akure, Ondo State', commodity: 'Processed Cassava & Grains', capacityMT: 50000, currentStockMT: 21500, status: 'Low Stock', thresholdAlert: true },
  ]);

  const [reserveReleaseModal, setReserveReleaseModal] = useState<any | null>(null);
  const [releaseAmount, setReleaseAmount] = useState<number>(5000);
  const [releaseSuccessMessage, setReleaseSuccessMessage] = useState<string | null>(null);

  const handleTriggerRelease = (silo: any) => {
    setReserveReleaseModal(silo);
    setReleaseAmount(Math.min(5000, silo.currentStockMT));
  };

  const confirmRelease = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reserveReleaseModal) return;
    setSiloReserves((prev) =>
      prev.map((s) =>
        s.id === reserveReleaseModal.id
          ? { ...s, currentStockMT: Math.max(0, s.currentStockMT - releaseAmount) }
          : s
      )
    );
    setReleaseSuccessMessage(`Authorized market release of ${releaseAmount.toLocaleString()} MT from ${reserveReleaseModal.location} to stabilize food prices.`);
    setReserveReleaseModal(null);
    setTimeout(() => setReleaseSuccessMessage(null), 6000);
  };

  // Recent Live Transactions Feed
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Controls Bar: State Selector & Timeframe */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-3.5 rounded-2xl border border-[#c1c8c2]/70 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#012d1d] text-[20px]">public</span>
          <span className="text-xs font-bold text-[#012d1d]">National Governance Scope:</span>
          <select
            value={selectedStateFilter}
            onChange={(e) => setSelectedStateFilter(e.target.value)}
            className="h-8 px-2.5 rounded-lg border border-[#c1c8c2] bg-[#f9fbf9] text-xs font-bold text-[#1a1c1c]"
          >
            <option value="All States">All 36 States + FCT</option>
            <option value="Kaduna">Kaduna State</option>
            <option value="Kano">Kano State</option>
            <option value="Benue">Benue State</option>
            <option value="Ogun">Ogun State</option>
            <option value="Niger">Niger State</option>
            <option value="Lagos">Lagos State</option>
            <option value="Plateau">Plateau State</option>
            <option value="Oyo">Oyo State</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5 bg-[#f0f4f1] p-1 rounded-xl text-xs font-bold text-[#3f6653]">
          {(['today', 'week', 'month', 'quarter'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                dateRange === range ? 'bg-[#012d1d] text-white shadow-xs' : 'hover:text-[#012d1d]'
              }`}
            >
              {range === 'today' ? '24 Hours' : range === 'week' ? '7 Days' : range === 'month' ? '30 Days' : 'This Quarter'}
            </button>
          ))}
        </div>
      </div>

      {releaseSuccessMessage && (
        <div className="p-3.5 bg-[#c1ecd4] text-[#002114] border border-[#276a4c]/40 rounded-xl text-xs font-bold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            <span>{releaseSuccessMessage}</span>
          </div>
          <button onClick={() => setReleaseSuccessMessage(null)} className="text-xs underline hover:text-black">
            Dismiss
          </button>
        </div>
      )}

      {/* Top 4 Primary Governance KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-[#c1c8c2]/70 p-4 rounded-2xl shadow-xs space-y-1.5">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#717973]">Registered Farm Actors</span>
            <span className="p-1.5 rounded-lg bg-[#c1ecd4]/50 text-[#012d1d]">
              <span className="material-symbols-outlined text-[18px]">group</span>
            </span>
          </div>
          <div className="font-heading font-bold text-2xl text-[#012d1d]">
            {(usersList.length * 18450).toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#012d1d] font-semibold">
            <span className="material-symbols-outlined text-[14px] text-[#276a4c]">trending_up</span>
            <span>+14.2% verified farm clusters</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-[#c1c8c2]/70 p-4 rounded-2xl shadow-xs space-y-1.5">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#717973]">National Trade Volume</span>
            <span className="p-1.5 rounded-lg bg-[#c1ecd4]/50 text-[#012d1d]">
              <span className="material-symbols-outlined text-[18px]">payments</span>
            </span>
          </div>
          <div className="font-heading font-bold text-2xl text-[#012d1d]">₦4.92 Billion</div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#012d1d] font-semibold">
            <span className="material-symbols-outlined text-[14px] text-[#276a4c]">verified</span>
            <span>₦1.45B in Protected Escrow</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-[#c1c8c2]/70 p-4 rounded-2xl shadow-xs space-y-1.5">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#717973]">Strategic Grain Stock</span>
            <span className="p-1.5 rounded-lg bg-[#c1ecd4]/50 text-[#012d1d]">
              <span className="material-symbols-outlined text-[18px]">inventory_2</span>
            </span>
          </div>
          <div className="font-heading font-bold text-2xl text-[#012d1d]">
            {siloReserves.reduce((acc, s) => acc + s.currentStockMT, 0).toLocaleString()} MT
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#012d1d] font-semibold">
            <span className="material-symbols-outlined text-[14px] text-[#276a4c]">warehouse</span>
            <span>5 Federal Silos Active</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-[#c1c8c2]/70 p-4 rounded-2xl shadow-xs space-y-1.5">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#717973]">BOA Concessionary Loans</span>
            <span className="p-1.5 rounded-lg bg-[#c1ecd4]/50 text-[#012d1d]">
              <span className="material-symbols-outlined text-[18px]">account_balance</span>
            </span>
          </div>
          <div className="font-heading font-bold text-2xl text-[#012d1d]">₦1.84 Billion</div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#012d1d] font-semibold">
            <span className="material-symbols-outlined text-[14px] text-[#276a4c]">price_check</span>
            <span>5% Subsidized Agronomy Rate</span>
          </div>
        </div>
      </div>

      {/* Regional Production & Input Voucher Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regional Agricultural Production Bar Visualizer */}
        <div className="bg-white rounded-2xl border border-[#c1c8c2]/70 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#e8ece9]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#012d1d] text-[22px]">map</span>
              <div>
                <h3 className="font-heading font-bold text-sm text-[#012d1d]">Regional Harvest Output & Trade Flow</h3>
                <p className="text-[11px] text-[#717973]">Aggregated production across geopolitical zones</p>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-[#c1ecd4] text-[#002114] px-2 py-0.5 rounded-full uppercase">
              Live GIS Data
            </span>
          </div>

          <div className="space-y-3.5">
            <div>
              <div className="flex justify-between text-xs font-bold text-[#1a1c1c] mb-1">
                <span>North Central (Benue, Niger, Plateau, Kaduna)</span>
                <span className="text-[#012d1d]">42,800 MT (Grains & Yam)</span>
              </div>
              <div className="w-full bg-[#e8ece9] h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#012d1d] h-full w-[85%] rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-[#1a1c1c] mb-1">
                <span>North West (Kano, Katsina, Kebbi, Sokoto)</span>
                <span className="text-[#012d1d]">38,400 MT (Rice Paddy & Wheat)</span>
              </div>
              <div className="w-full bg-[#e8ece9] h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#1b4332] h-full w-[72%] rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-[#1a1c1c] mb-1">
                <span>South West (Oyo, Ogun, Ondo, Osun)</span>
                <span className="text-[#012d1d]">24,600 MT (Cassava & Cocoa)</span>
              </div>
              <div className="w-full bg-[#e8ece9] h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#3f6653] h-full w-[54%] rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-[#1a1c1c] mb-1">
                <span>South South & South East (Edo, Cross River, Ebonyi)</span>
                <span className="text-[#012d1d]">19,200 MT (Palm Oil & Abakaliki Rice)</span>
              </div>
              <div className="w-full bg-[#e8ece9] h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#86af99] h-full w-[42%] rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* National Input Subsidy Allocation Tracker */}
        <div className="bg-white rounded-2xl border border-[#c1c8c2]/70 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#e8ece9]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#012d1d] text-[22px]">card_membership</span>
              <div>
                <h3 className="font-heading font-bold text-sm text-[#012d1d]">Input Subsidy Voucher Program</h3>
                <p className="text-[11px] text-[#717973]">Federal 50% Fertilizer & Certified Seed Support</p>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-[#c1ecd4] text-[#002114] px-2 py-0.5 rounded-full uppercase">
              Active Phase 2
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-[#f9fbf9] rounded-xl border border-[#e2e8e4] space-y-1">
              <span className="text-[10px] font-bold text-[#717973] uppercase">Total Vouchers Issued</span>
              <div className="text-lg font-bold text-[#012d1d]">750,000</div>
              <span className="text-[10px] text-[#3f6653]">Across 36 States + FCT</span>
            </div>

            <div className="p-3 bg-[#f9fbf9] rounded-xl border border-[#e2e8e4] space-y-1">
              <span className="text-[10px] font-bold text-[#717973] uppercase">Redeemed at Certified Depots</span>
              <div className="text-lg font-bold text-[#012d1d]">584,210</div>
              <span className="text-[10px] text-[#276a4c] font-bold">77.9% Redemption Rate</span>
            </div>
          </div>

          <div className="p-3 bg-[#f0f4f1] rounded-xl border border-[#c1c8c2]/50 text-xs space-y-2">
            <div className="flex justify-between font-bold text-[#012d1d]">
              <span>Direct Federal Subsidy Value:</span>
              <span>₦3.65 Billion Disbursed</span>
            </div>
            <div className="w-full bg-[#d0dbd3] h-2 rounded-full overflow-hidden">
              <div className="bg-[#012d1d] h-full w-[78%]" />
            </div>
            <div className="flex justify-between text-[10px] text-[#717973]">
              <span>NAFDAC Certified Suppliers: 128 registered depots</span>
              <span className="text-[#012d1d] font-bold">₦1.05B Balance in Escrow</span>
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Grain Reserves (National Silos) Status & Release Controller */}
      <div className="bg-white rounded-2xl border border-[#c1c8c2]/70 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-[#e8ece9]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#012d1d] text-[22px]">warehouse</span>
            <div>
              <h3 className="font-heading font-bold text-sm text-[#012d1d]">Strategic National Grain Reserves (Silos)</h3>
              <p className="text-[11px] text-[#717973]">Federal buffer stocks for national price stabilization and emergency food security</p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#012d1d] bg-[#c1ecd4] px-2.5 py-1 rounded-xl">
            Total Silo Capacity: 440,000 MT
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f9fbf9] text-[#012d1d] font-bold border-b border-[#e2e8e4]">
                <th className="p-3">Silo Facility & State</th>
                <th className="p-3">Primary Grains</th>
                <th className="p-3">Capacity</th>
                <th className="p-3">Current Stock</th>
                <th className="p-3">Fill Level</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Emergency Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8ece9]">
              {siloReserves.map((silo) => {
                const fillPercent = Math.round((silo.currentStockMT / silo.capacityMT) * 100);
                return (
                  <tr key={silo.id} className="hover:bg-[#f9fbf9] transition-colors">
                    <td className="p-3 font-bold text-[#1a1c1c]">{silo.location}</td>
                    <td className="p-3 text-[#525a54]">{silo.commodity}</td>
                    <td className="p-3 font-semibold">{silo.capacityMT.toLocaleString()} MT</td>
                    <td className="p-3 font-bold text-[#012d1d]">{silo.currentStockMT.toLocaleString()} MT</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-[#e8ece9] h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              fillPercent < 40 ? 'bg-[#ba1a1a]' : fillPercent < 65 ? 'bg-[#dc9a00]' : 'bg-[#012d1d]'
                            }`}
                            style={{ width: `${fillPercent}%` }}
                          />
                        </div>
                        <span className="font-bold text-[11px]">{fillPercent}%</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          silo.status === 'Healthy'
                            ? 'bg-[#c1ecd4] text-[#002114]'
                            : silo.status === 'Moderate'
                            ? 'bg-[#ffdeac] text-[#281900]'
                            : 'bg-[#ffdad6] text-[#410002]'
                        }`}
                      >
                        {silo.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleTriggerRelease(silo)}
                        className="px-2.5 py-1 bg-[#012d1d] text-white font-bold text-[11px] rounded-lg hover:bg-[#1b4332] active:scale-95 transition-all shadow-xs"
                      >
                        Authorize Release
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Transaction & Interstate Trade Activity */}
      <div className="bg-white rounded-2xl border border-[#c1c8c2]/70 p-5 shadow-xs space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-[#e8ece9]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#012d1d] text-[22px]">sync_alt</span>
            <div>
              <h3 className="font-heading font-bold text-sm text-[#012d1d]">Live Interstate Commodity Trade Stream</h3>
              <p className="text-[11px] text-[#717973]">Real-time farm-gate to industrial processing transactions</p>
            </div>
          </div>
          <span className="text-[10px] font-bold bg-[#c1ecd4] text-[#002114] px-2 py-0.5 rounded-full uppercase">
            Active Feed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f9fbf9] text-[#012d1d] font-bold border-b border-[#e2e8e4]">
                <th className="p-3">Order ID</th>
                <th className="p-3">Commodity</th>
                <th className="p-3">Route (Origin → Dest)</th>
                <th className="p-3">Buyer / Merchant</th>
                <th className="p-3">Value</th>
                <th className="p-3">Escrow Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8ece9]">
              {recentOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-[#f9fbf9] transition-colors">
                  <td className="p-3 font-mono font-bold text-[#012d1d]">{ord.id}</td>
                  <td className="p-3 font-bold text-[#1a1c1c]">{ord.cropTitle}</td>
                  <td className="p-3 text-[#525a54]">
                    {ord.originState || 'Kaduna'} → {ord.destinationState || 'Lagos'}
                  </td>
                  <td className="p-3">{ord.buyerName}</td>
                  <td className="p-3 font-bold text-[#012d1d]">₦{ord.totalPrice.toLocaleString()}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                        ord.status === 'completed'
                          ? 'bg-[#c1ecd4] text-[#002114]'
                          : ord.status === 'in_transit'
                          ? 'bg-[#d0e4ff] text-[#001d36]'
                          : 'bg-[#ffdeac] text-[#281900]'
                      }`}
                    >
                      {ord.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Strategic Reserve Emergency Release */}
      {reserveReleaseModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-[#c1c8c2]">
            <div className="flex justify-between items-center pb-2 border-b border-[#e8ece9]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ba1a1a] text-[24px]">crisis_alert</span>
                <h3 className="font-heading font-bold text-base text-[#012d1d]">
                  Emergency Reserve Grain Release
                </h3>
              </div>
              <button
                onClick={() => setReserveReleaseModal(null)}
                className="text-[#717973] hover:text-[#1a1c1c] text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-[#f9fbf9] rounded-xl border border-[#e2e8e4] text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-[#717973]">Facility:</span>
                <span className="font-bold text-[#012d1d]">{reserveReleaseModal.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#717973]">Available Silo Stock:</span>
                <span className="font-bold text-[#012d1d]">{reserveReleaseModal.currentStockMT.toLocaleString()} MT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#717973]">Primary Crop:</span>
                <span className="font-bold text-[#1a1c1c]">{reserveReleaseModal.commodity}</span>
              </div>
            </div>

            <form onSubmit={confirmRelease} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1 text-[#2c342e]">
                  Quantity to Release to Commercial Market (Metric Tons)
                </label>
                <input
                  type="number"
                  min="100"
                  max={reserveReleaseModal.currentStockMT}
                  value={releaseAmount}
                  onChange={(e) => setReleaseAmount(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-xl border border-[#c1c8c2] text-sm font-bold"
                  required
                />
                <p className="text-[11px] text-[#717973] mt-1">
                  Will trigger distribution via certified Agro-Connect grain aggregators at subsidized benchmark prices.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReserveReleaseModal(null)}
                  className="flex-1 py-2.5 rounded-xl border border-[#c1c8c2] font-bold text-xs hover:bg-[#f9fbf9]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#ba1a1a] text-white font-bold text-xs rounded-xl hover:bg-[#93000a] active:scale-95 transition-all shadow-xs"
                >
                  Confirm Release
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
