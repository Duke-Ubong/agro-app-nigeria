import React from 'react';
import { UserRole } from '../../types';

interface RoleSelectionProps {
  onSelectRole: (role: UserRole) => void;
  onBack: () => void;
}

const ROLE_OPTIONS = [
  {
    id: 'farmer' as UserRole,
    title: 'Farmer',
    subtitle: 'SMALLHOLDER / COMMERCIAL',
    description: 'Manage crops, track localized weather forecasts, and list harvest for direct buyers.',
    icon: 'energy_savings_leaf',
    iconBg: 'bg-[#e7f5e8]',
    iconColor: 'text-[#0a3826]',
    pills: ['Crop Log', 'Market Prices', 'Inputs & Loans']
  },
  {
    id: 'cooperative' as UserRole,
    title: 'Cooperative Leader',
    subtitle: 'FARMERS UNION / CLUSTER',
    description: 'Aggregate produce from member farmers, manage bulk contracts and warehouse receipts.',
    icon: 'groups',
    iconBg: 'bg-[#ffefe5]',
    iconColor: 'text-[#d84315]',
    pills: ['Member Pooling', 'Bulk Sales', 'Credit Access']
  },
  {
    id: 'buyer' as UserRole,
    title: 'Buyer / Processor',
    subtitle: 'OFF-TAKER & MERCHANT',
    description: 'Source quality verified produce directly from farms, place orders, and track shipments.',
    icon: 'store',
    iconBg: 'bg-[#fff5d7]',
    iconColor: 'text-[#f9a825]',
    pills: ['Direct Sourcing', 'Escrow Orders', 'Quality Specs']
  },
  {
    id: 'supplier' as UserRole,
    title: 'Input Supplier',
    subtitle: 'SEEDS, FERTILIZER & TOOLS',
    description: 'Sell certified seeds, agro-chemicals, and machinery to farmers and cooperatives.',
    icon: 'water_drop',
    iconBg: 'bg-[#e8f0fe]',
    iconColor: 'text-[#1565c0]',
    pills: ['Input Store', 'Order Dispatch', 'Inventory']
  },
  {
    id: 'transporter' as UserRole,
    title: 'Logistics / Transporter',
    subtitle: 'HAULAGE & DELIVERY',
    description: 'Provide fleet haulage, accept farm-to-market dispatch requests, and track routes.',
    icon: 'local_shipping',
    iconBg: 'bg-[#f3f4f6]',
    iconColor: 'text-[#374151]',
    pills: []
  },
  {
    id: 'super_admin' as UserRole,
    title: 'System Administrator',
    subtitle: 'MINISTRY / PLATFORM ADMIN',
    description: 'Platform oversight, farmer verification, subsidies distribution, and analytics.',
    icon: 'admin_panel_settings',
    iconBg: 'bg-[#fee2e2]',
    iconColor: 'text-[#b91c1c]',
    pills: []
  }
];

export const RoleSelection: React.FC<RoleSelectionProps> = ({ onSelectRole, onBack }) => {
  const [selectedRole, setSelectedRole] = React.useState<UserRole>('farmer');

  const selectedData = ROLE_OPTIONS.find(r => r.id === selectedRole)!;

  return (
    <div className="min-h-screen bg-[#ebf0ed] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-[700px] flex flex-col h-[90vh] md:h-[85vh]">
        
        {/* Header */}
        <div className="flex flex-col pt-6 px-8 pb-4 shrink-0">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={onBack}
              className="flex items-center gap-1 text-[#1a1c1c] font-bold text-sm hover:text-[#0a3826] transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              Back
            </button>
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-6 bg-[#063d28] rounded-bl-full rounded-br-full rounded-tr-full flex items-center justify-center relative overflow-hidden">
                <span className="material-symbols-outlined text-[#f2a611] text-[12px] absolute">emoji_nature</span>
              </div>
              <span className="font-heading font-black text-lg text-[#012d1d] tracking-tight flex items-baseline">
                Agro<span className="text-[#f2a611]">App</span><span className="text-[#063d28] w-1 h-1 rounded-full bg-[#063d28] ml-0.5"></span>
              </span>
            </div>
            <div className="bg-[#e7f5e8] text-[#0a3826] font-bold text-[10px] tracking-widest px-3 py-1 rounded-full uppercase">
              Instant Access
            </div>
          </div>
          
          <h1 className="font-heading font-black text-3xl text-[#1a1c1c] mb-2">Select Your Role</h1>
          <p className="text-sm text-[#414844]">
            Choose your profile type to customize your tools, marketplace access, and dashboard.
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-8 pb-4 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
            {ROLE_OPTIONS.map((role) => {
              const isSelected = selectedRole === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`relative p-4 rounded-2xl border text-left flex flex-col transition-all ${
                    isSelected
                      ? 'border-[#0a3826] ring-1 ring-[#0a3826] bg-[#fdfdfd]'
                      : 'border-[#e2e8e4] hover:border-[#b3c2b8] hover:bg-[#fcfcfc]'
                  }`}
                >
                  {/* Top row: Icon, text, radio */}
                  <div className="flex items-start justify-between w-full mb-3">
                    <div className="flex gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${role.iconBg} ${role.iconColor}`}>
                        <span className="material-symbols-outlined text-[20px]">{role.icon}</span>
                      </div>
                      <div className="flex flex-col justify-center">
                        <h3 className="font-heading font-bold text-[#1a1c1c] text-sm leading-tight">{role.title}</h3>
                        <p className="text-[10px] text-[#717973] font-bold tracking-wider uppercase mt-0.5">{role.subtitle}</p>
                      </div>
                    </div>
                    {/* Radio Button */}
                    <div className="shrink-0 ml-2 mt-1">
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-[#0a3826] text-white flex items-center justify-center">
                          <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-[#c1c8c2]"></div>
                      )}
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-[12px] text-[#414844] leading-relaxed mb-4 flex-1">
                    {role.description}
                  </p>

                  {/* Pills */}
                  {role.pills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {role.pills.map((pill, idx) => (
                        <div 
                          key={idx} 
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-md ${
                            isSelected ? 'bg-[#0a3826] text-white' : 'bg-[#f3f4f6] text-[#414844]'
                          }`}
                        >
                          {pill}
                        </div>
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 shrink-0 border-t border-[#e2e8e4] rounded-b-3xl bg-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedData.iconBg} ${selectedData.iconColor}`}>
              <span className="material-symbols-outlined text-[20px]">{selectedData.icon}</span>
            </div>
            <div>
              <div className="text-[10px] text-[#717973] font-bold tracking-widest uppercase">Selected Profile •</div>
              <div className="font-bold text-[#1a1c1c] text-sm">{selectedData.title}</div>
            </div>
          </div>
          <button
            onClick={() => onSelectRole(selectedRole)}
            className="h-12 px-6 bg-[#0a3826] text-white font-heading font-bold text-sm rounded-xl flex items-center justify-center gap-2 hover:bg-[#1b4332] active:scale-95 transition-all shadow-md"
          >
            <span>Enter as {selectedData.title.split(' ')[0]}</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>

      </div>
    </div>
  );
};
