import React, { useState } from 'react';
import {
  MapPin,
  Users,
  Sprout,
  Truck,
  PhoneCall,
  Shield,
  Layers,
  BarChart2,
  CheckCircle2,
  AlertCircle,
  Eye,
  Download,
  Search,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { AdminGlobalFilterBar, GlobalFilterState } from '../../components/admin/AdminGlobalFilterBar';
import { ReasonLoggingModal } from '../../components/admin/ReasonLoggingModal';

export const StateRegionalAdminDashboard: React.FC = () => {
  const { listings, orders, usersList, addAuditLog } = useApp();
  const { user } = useAuth();

  // State locked or assigned
  const [assignedState, setAssignedState] = useState<string>('Kaduna');
  const [filters, setFilters] = useState<GlobalFilterState>({
    dateRange: 'last_30_days',
    state: 'Kaduna',
    lga: 'All LGAs',
    valueChain: 'All Value Chains',
    commodity: 'All Commodities',
  });

  const [activeTab, setActiveTab] = useState<
    'lga_heatmap' | 'farmer_onboarding' | 'inputs_gmp' | 'market_haulage' | 'extension_agents'
  >('lga_heatmap');

  const [selectedFarmerForInspection, setSelectedFarmerForInspection] = useState<any | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // State Profiles & Data
  const STATE_PROFILES: Record<
    string,
    {
      director: string;
      hq: string;
      phone: string;
      registeredFarmers: number;
      extensionAgents: number;
      fertilizerAllocatedMT: number;
      fertilizerDistributedMT: number;
      topCrops: string[];
      spoilageReductionRate: string;
      lgas: {
        name: string;
        farmers: number;
        cooperatives: number;
        hectares: number;
        topCrop: string;
        inputRedemptionRate: string;
        status: 'Optimal' | 'Average' | 'Needs Attention';
      }[];
    }
  > = {
    Kaduna: {
      director: 'Dr. Chidi Okafor (State ADP Project Manager)',
      hq: 'Kaduna State ADP Headquarters, Zaria Road, Kaduna',
      phone: '+234 803 400 1199',
      registeredFarmers: 184500,
      extensionAgents: 284,
      fertilizerAllocatedMT: 18000,
      fertilizerDistributedMT: 15400,
      topCrops: ['White Maize', 'Ginger', 'Soybeans', 'Tomatoes'],
      spoilageReductionRate: '18.4% Loss Reduction',
      lgas: [
        { name: 'Zaria', farmers: 28400, cooperatives: 142, hectares: 45000, topCrop: 'White Maize', inputRedemptionRate: '94.2%', status: 'Optimal' },
        { name: 'Giwa', farmers: 24100, cooperatives: 118, hectares: 38000, topCrop: 'Soybeans', inputRedemptionRate: '91.8%', status: 'Optimal' },
        { name: 'Makarfi', farmers: 21500, cooperatives: 95, hectares: 32000, topCrop: 'Tomatoes', inputRedemptionRate: '88.5%', status: 'Average' },
        { name: 'Chikun', farmers: 19800, cooperatives: 84, hectares: 29000, topCrop: 'Ginger', inputRedemptionRate: '86.0%', status: 'Average' },
        { name: 'Igabi', farmers: 18200, cooperatives: 78, hectares: 26000, topCrop: 'Sorghum', inputRedemptionRate: '82.4%', status: 'Needs Attention' },
        { name: 'Birnin Gwari', farmers: 14900, cooperatives: 62, hectares: 21000, topCrop: 'Yam', inputRedemptionRate: '79.1%', status: 'Needs Attention' },
      ],
    },
    Kano: {
      director: 'Alhaji Mansur Garba (KNARDA Managing Director)',
      hq: 'Kano State Agricultural & Rural Development Authority (KNARDA), Kano',
      phone: '+234 802 881 2244',
      registeredFarmers: 242000,
      extensionAgents: 360,
      fertilizerAllocatedMT: 26000,
      fertilizerDistributedMT: 22800,
      topCrops: ['Paddy Rice', 'Wheat', 'Groundnuts', 'Onions'],
      spoilageReductionRate: '21.2% Loss Reduction',
      lgas: [
        { name: 'Kura', farmers: 34200, cooperatives: 180, hectares: 52000, topCrop: 'Paddy Rice', inputRedemptionRate: '96.0%', status: 'Optimal' },
        { name: 'Bichi', farmers: 29800, cooperatives: 145, hectares: 46000, topCrop: 'Wheat', inputRedemptionRate: '93.5%', status: 'Optimal' },
        { name: 'Wudil', farmers: 26400, cooperatives: 120, hectares: 39000, topCrop: 'Groundnuts', inputRedemptionRate: '89.0%', status: 'Optimal' },
        { name: 'Dala', farmers: 18500, cooperatives: 90, hectares: 22000, topCrop: 'Vegetables', inputRedemptionRate: '85.2%', status: 'Average' },
        { name: 'Fagge', farmers: 15400, cooperatives: 74, hectares: 18000, topCrop: 'Onions', inputRedemptionRate: '84.1%', status: 'Average' },
      ],
    },
    Benue: {
      director: 'Engr. Terver Aondo (BNARDA Program Coordinator)',
      hq: 'Benue Agricultural and Rural Development Authority (BNARDA), Makurdi',
      phone: '+234 805 112 3388',
      registeredFarmers: 168000,
      extensionAgents: 240,
      fertilizerAllocatedMT: 16500,
      fertilizerDistributedMT: 13900,
      topCrops: ['Yam Tubers', 'Cassava', 'Soybeans', 'Citrus'],
      spoilageReductionRate: '16.8% Loss Reduction',
      lgas: [
        { name: 'Gboko', farmers: 31200, cooperatives: 160, hectares: 48000, topCrop: 'Yam Tubers', inputRedemptionRate: '92.4%', status: 'Optimal' },
        { name: 'Makurdi', farmers: 26800, cooperatives: 130, hectares: 41000, topCrop: 'Soybeans', inputRedemptionRate: '90.1%', status: 'Optimal' },
        { name: 'Otukpo', farmers: 22500, cooperatives: 105, hectares: 35000, topCrop: 'Cassava', inputRedemptionRate: '87.5%', status: 'Average' },
        { name: 'Katsina-Ala', farmers: 19400, cooperatives: 88, hectares: 30000, topCrop: 'Yam Tubers', inputRedemptionRate: '84.0%', status: 'Average' },
      ],
    },
  };

  const currentProfile = STATE_PROFILES[assignedState] || STATE_PROFILES['Kaduna'];

  // Handle switching state (for testing or regional managers)
  const handleSwitchState = (st: string) => {
    setAssignedState(st);
    setFilters({ ...filters, state: st, lga: 'All LGAs' });
  };

  return (
    <div className="space-y-6 font-body">
      {/* Global Filter Bar (Locked or focused on Assigned State) */}
      <AdminGlobalFilterBar
        filters={filters}
        onFilterChange={setFilters}
        roleTitle="State / Regional Admin (State ADP Command)"
        departmentTag={`${assignedState} State ADP`}
        watermarkText={`CONFIDENTIAL • ${assignedState.toUpperCase()} STATE ADP OFFICIAL`}
        isStateLocked={false}
        lockedStateName={assignedState}
      />

      {/* State Banner Header with State Switcher for demonstration */}
      <div className="bg-[#012d1d] text-white p-5 rounded-2xl border border-[#1b4332] shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 bg-[#16a34a] text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
              {assignedState} State ADP Command
            </span>
            <span className="text-xs text-[#86af99]">{currentProfile.hq}</span>
          </div>
          <h2 className="font-heading font-bold text-xl text-white">
            {assignedState} State Agricultural Operations & LGA Execution
          </h2>
          <p className="text-xs text-[#86af99]">
            Director: <strong>{currentProfile.director}</strong> • Hotline: {currentProfile.phone}
          </p>
        </div>

        {/* State Switcher Selector */}
        <div className="flex items-center gap-2 bg-[#002114] p-1.5 rounded-xl border border-[#1b4332] self-stretch sm:self-auto justify-between">
          <span className="text-[11px] font-bold text-[#86af99] px-2">Assigned State:</span>
          <select
            value={assignedState}
            onChange={(e) => handleSwitchState(e.target.value)}
            className="text-xs font-bold bg-[#1b4332] text-[#c1ecd4] px-3 py-1.5 rounded-lg border-none focus:outline-none cursor-pointer"
          >
            <option value="Kaduna">Kaduna State</option>
            <option value="Kano">Kano State</option>
            <option value="Benue">Benue State</option>
          </select>
        </div>
      </div>

      {/* State-Level Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="bg-white border border-[#c1c8c2]/80 p-4 rounded-2xl shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#717973]">
            Registered State Farmers
          </span>
          <div className="font-heading font-bold text-2xl text-[#012d1d]">
            {currentProfile.registeredFarmers.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#16a34a] font-bold">+12% Onboarding Growth</div>
        </div>

        <div className="bg-white border border-[#c1c8c2]/80 p-4 rounded-2xl shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#717973]">
            Fertilizer Distributed
          </span>
          <div className="font-heading font-bold text-2xl text-[#012d1d]">
            {currentProfile.fertilizerDistributedMT.toLocaleString()} MT
          </div>
          <div className="text-[11px] text-[#012d1d] font-semibold">
            {((currentProfile.fertilizerDistributedMT / currentProfile.fertilizerAllocatedMT) * 100).toFixed(1)}% of State Quota
          </div>
        </div>

        <div className="bg-white border border-[#c1c8c2]/80 p-4 rounded-2xl shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#717973]">
            Active Extension Officers
          </span>
          <div className="font-heading font-bold text-2xl text-[#012d1d]">
            {currentProfile.extensionAgents} Agents
          </div>
          <div className="text-[11px] text-[#2563eb] font-bold">1:650 Farmer-to-Agent Ratio</div>
        </div>

        <div className="bg-white border border-[#c1c8c2]/80 p-4 rounded-2xl shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#717973]">
            Post-Harvest Spoilage Indicator
          </span>
          <div className="font-heading font-bold text-2xl text-[#16a34a]">
            {currentProfile.spoilageReductionRate}
          </div>
          <div className="text-[11px] text-[#717973] font-medium">Solar Cold Storage Active</div>
        </div>
      </div>

      {/* Sub-Tabs Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-[#c1c8c2]/60">
        {[
          { id: 'lga_heatmap' as const, label: 'LGA Performance Heatmap', icon: BarChart2 },
          { id: 'farmer_onboarding' as const, label: 'Farmer & Coop Registry', icon: Users },
          { id: 'inputs_gmp' as const, label: 'State Subsidies & GMP', icon: Sprout },
          { id: 'market_haulage' as const, label: 'Produce Haulage & Warehousing', icon: Truck },
          { id: 'extension_agents' as const, label: 'Extension Field Agents', icon: PhoneCall },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#012d1d] text-white shadow-xs'
                  : 'bg-white text-[#525a54] hover:bg-[#f0f4f1] border border-[#c1c8c2]/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#c1ecd4]' : 'text-[#012d1d]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: LGA Performance Heatmap */}
      {activeTab === 'lga_heatmap' && (
        <div className="bg-white rounded-2xl border border-[#c1c8c2]/80 p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-[#e5e9e6]">
            <div>
              <h3 className="font-heading font-bold text-sm text-[#012d1d]">
                {assignedState} State LGA Execution Matrix
              </h3>
              <p className="text-xs text-[#717973]">
                Comparative productivity, input redemption, and registered farmer density by local government area
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-[#f0f4f1] text-[#012d1d] rounded-md border border-[#d8deda]">
              {currentProfile.lgas.length} Active LGAs
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#e5e9e6] bg-[#f8faf8] text-[#525a54] font-bold">
                  <th className="p-3">LGA Name</th>
                  <th className="p-3">Registered Farmers</th>
                  <th className="p-3">Cooperatives</th>
                  <th className="p-3">Cultivated Hectares</th>
                  <th className="p-3">Primary Value Chain</th>
                  <th className="p-3">Input Redemption</th>
                  <th className="p-3">Performance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e9e6]">
                {currentProfile.lgas.map((lga, idx) => (
                  <tr key={idx} className="hover:bg-[#f8faf8] transition-colors">
                    <td className="p-3 font-bold text-[#012d1d] flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#012d1d]" />
                      <span>{lga.name}</span>
                    </td>
                    <td className="p-3 font-semibold text-[#012d1d]">
                      {lga.farmers.toLocaleString()}
                    </td>
                    <td className="p-3 text-[#525a54]">{lga.cooperatives} Coops</td>
                    <td className="p-3 text-[#525a54]">{lga.hectares.toLocaleString()} Ha</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-[#f0fdf4] text-[#166534] rounded-md font-medium text-[11px] border border-[#bbf7d0]">
                        {lga.topCrop}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-[#012d1d]">{lga.inputRedemptionRate}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          lga.status === 'Optimal'
                            ? 'bg-[#c1ecd4] text-[#002114]'
                            : lga.status === 'Average'
                            ? 'bg-[#fef3c7] text-[#b45309]'
                            : 'bg-[#ffdad6] text-[#ba1a1a]'
                        }`}
                      >
                        {lga.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Farmer & Cooperative Registry */}
      {activeTab === 'farmer_onboarding' && (
        <div className="bg-white rounded-2xl border border-[#c1c8c2]/80 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-[#e5e9e6]">
            <div>
              <h3 className="font-heading font-bold text-sm text-[#012d1d]">
                {assignedState} State Farmer Directory & Verification
              </h3>
              <p className="text-xs text-[#717973]">
                View localized smallholder records within your authorized state jurisdiction
              </p>
            </div>
            <span className="text-xs text-[#ba1a1a] font-semibold">
              🔒 State Jurisdiction Locked: {assignedState} Only
            </span>
          </div>

          <div className="divide-y divide-[#e5e9e6]">
            {[
              { id: 'f_101', name: 'Abebe Usman', role: 'farmer', lga: 'Zaria', crop: 'White Maize (5 Ha)', kyc: 'Tier-2 Verified (NIN + Land Letter)' },
              { id: 'f_102', name: 'Hauwa Abubakar', role: 'farmer', lga: 'Giwa', crop: 'Soybeans (3 Ha)', kyc: 'Tier-2 Verified (NIN)' },
              { id: 'f_103', name: 'Zaria Grain Growers Cooperative', role: 'cooperative', lga: 'Zaria', crop: '140 Smallholders Hub', kyc: 'CAC + State Ministry Registered' },
            ].map((farmer) => (
              <div key={farmer.id} className="py-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#012d1d]">{farmer.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.2 bg-[#012d1d] text-[#c1ecd4] rounded-md uppercase">
                      {farmer.role}
                    </span>
                    <span className="text-[10px] text-[#525a54]">LGA: <strong>{farmer.lga}</strong></span>
                  </div>
                  <div className="text-xs text-[#525a54]">
                    Produce: {farmer.crop} • KYC: <span className="text-[#16a34a] font-semibold">{farmer.kyc}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedFarmerForInspection(farmer)}
                  className="px-3 py-1.5 bg-[#012d1d] hover:bg-[#1b4332] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-[#c1ecd4]" />
                  <span>Inspect Record</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: State Subsidies & GMP */}
      {activeTab === 'inputs_gmp' && (
        <div className="bg-white rounded-2xl border border-[#c1c8c2]/80 p-5 shadow-xs space-y-4">
          <div className="pb-2 border-b border-[#e5e9e6]">
            <h3 className="font-heading font-bold text-sm text-[#012d1d]">
              State-Level Fertilizer Allocation & GMP Floor Price Monitoring
            </h3>
            <p className="text-xs text-[#717973]">
              Tracking subsidized fertilizer consignments at agro-dealer redemption centers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#f8faf8] rounded-2xl border border-[#d8deda] space-y-2">
              <span className="font-heading font-bold text-xs text-[#012d1d]">
                NPK 20-10-10 State Redemption Rate
              </span>
              <div className="text-2xl font-bold text-[#012d1d]">85.5% Redeemed</div>
              <p className="text-xs text-[#525a54]">
                15,400 MT of 18,000 MT quota redeemed by verified farmers in {assignedState}.
              </p>
            </div>

            <div className="p-4 bg-[#f8faf8] rounded-2xl border border-[#d8deda] space-y-2">
              <span className="font-heading font-bold text-xs text-[#012d1d]">
                Guaranteed Minimum Price (GMP) Compliance
              </span>
              <div className="text-2xl font-bold text-[#16a34a]">98.2% Compliant</div>
              <p className="text-xs text-[#525a54]">
                Aggregator grain intake prices are staying above statutory floor prices.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Produce Haulage & Warehousing */}
      {activeTab === 'market_haulage' && (
        <div className="bg-white rounded-2xl border border-[#c1c8c2]/80 p-5 shadow-xs space-y-4">
          <div className="pb-2 border-b border-[#e5e9e6]">
            <h3 className="font-heading font-bold text-sm text-[#012d1d]">
              Inter-State Produce Outflow & Post-Harvest Storage Depots
            </h3>
            <p className="text-xs text-[#717973]">
              Active trucks transporting produce out of {assignedState} with electronic POD waybills
            </p>
          </div>

          <div className="divide-y divide-[#e5e9e6]">
            {[
              { id: 'trk_901', cargo: '30 MT White Maize', origin: 'Zaria Depots', destination: 'Ikeja Feed Mill (Lagos)', status: 'In Transit (Lokoja corridor)', lossRisk: 'Low' },
              { id: 'trk_902', cargo: '15 MT Fresh Ginger', origin: 'Kachia Hub', destination: 'Apapa Port Export Terminal', status: 'Waybill Sealed', lossRisk: 'Low' },
            ].map((haul, idx) => (
              <div key={idx} className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <div className="font-bold text-xs text-[#012d1d]">{haul.cargo}</div>
                  <div className="text-xs text-[#525a54]">
                    Route: <strong>{haul.origin}</strong> → <strong>{haul.destination}</strong>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#c1ecd4] text-[#002114] text-[10px] font-bold rounded-md">
                    {haul.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Extension Field Agents */}
      {activeTab === 'extension_agents' && (
        <div className="bg-white rounded-2xl border border-[#c1c8c2]/80 p-5 shadow-xs space-y-4">
          <div className="pb-2 border-b border-[#e5e9e6]">
            <h3 className="font-heading font-bold text-sm text-[#012d1d]">
              {assignedState} Extension Officers & Advisory Dispatch Desk
            </h3>
            <p className="text-xs text-[#717973]">
              Dispatch weather warnings, pest outbreak advisories, and audio memos in local languages
            </p>
          </div>

          <div className="p-4 bg-[#f8faf8] rounded-2xl border border-[#d8deda] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="font-heading font-bold text-xs text-[#012d1d]">
                Broadcast Field Advisory to {assignedState} Farmers
              </div>
              <p className="text-xs text-[#525a54]">
                Sends SMS / IVR audio memo to all {currentProfile.registeredFarmers.toLocaleString()} registered phone numbers.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setActionSuccess(`Broadcast advisory queued for ${currentProfile.registeredFarmers.toLocaleString()} farmers.`);
                setTimeout(() => setActionSuccess(null), 4000);
              }}
              className="px-4 py-2 bg-[#012d1d] hover:bg-[#1b4332] text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
            >
              Dispatch State Alert
            </button>
          </div>
        </div>
      )}

      {/* Mandatory Reason Logging Modal for Individual Farmer Inspection */}
      {selectedFarmerForInspection && (
        <ReasonLoggingModal
          isOpen={true}
          onClose={() => setSelectedFarmerForInspection(null)}
          targetUserName={selectedFarmerForInspection.name}
          targetUserRole={selectedFarmerForInspection.role}
          targetUserId={selectedFarmerForInspection.id}
          adminDepartment={`${assignedState} State ADP Command`}
          recordType="State Farmer KYC & Agricultural Yield Log"
          onConfirm={(reason) => {
            setSelectedFarmerForInspection(null);
            setActionSuccess(`State ADP authorized decrypted inspection logged for ${selectedFarmerForInspection.name}.`);
            setTimeout(() => setActionSuccess(null), 4000);
          }}
        />
      )}
    </div>
  );
};
export default StateRegionalAdminDashboard;
