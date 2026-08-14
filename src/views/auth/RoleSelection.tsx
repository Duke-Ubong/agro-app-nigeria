import React, { useState } from 'react';
import {
  Sprout,
  Users,
  Store,
  Droplet,
  Truck,
  ShieldCheck,
  ArrowRight,
  ChevronLeft,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'motion/react';
import { UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { AgroAppLogo } from '../../components/common/AgroAppLogo';

interface RoleSelectionProps {
  onSelectRole?: (role: UserRole) => void;
  onBack?: () => void;
}

interface RoleOption {
  id: UserRole;
  title: string;
  badge: string;
  description: string;
  tags: string[];
  icon: React.ReactNode;
  iconBg: string;
}

export const RoleSelection: React.FC<RoleSelectionProps> = ({ onSelectRole, onBack }) => {
  const { loginRole, setRole } = useAuth();
  const { setActiveView } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>('farmer');

  const roles: RoleOption[] = [
    {
      id: 'farmer',
      title: 'Farmer',
      badge: 'Smallholder / Commercial',
      description: 'Manage crops, track localized weather forecasts, and list harvest for direct buyers.',
      tags: ['Crop Log', 'Market Prices', 'Inputs & Loans'],
      icon: <Sprout className="w-6 h-6 text-[#053221]" />,
      iconBg: 'bg-[#c1ecd4]',
    },
    {
      id: 'cooperative',
      title: 'Cooperative Leader',
      badge: 'Farmers Union / Cluster',
      description: 'Aggregate produce from member farmers, manage bulk contracts and warehouse receipts.',
      tags: ['Member Pooling', 'Bulk Sales', 'Credit Access'],
      icon: <Users className="w-6 h-6 text-[#852b12]" />,
      iconBg: 'bg-[#ffdad2]',
    },
    {
      id: 'buyer',
      title: 'Buyer / Processor',
      badge: 'Off-taker & Merchant',
      description: 'Source quality verified produce directly from farms, place orders, and track shipments.',
      tags: ['Direct Sourcing', 'Escrow Orders', 'Quality Specs'],
      icon: <Store className="w-6 h-6 text-[#725a00]" />,
      iconBg: 'bg-[#ffe08b]',
    },
    {
      id: 'supplier',
      title: 'Input Supplier',
      badge: 'Seeds, Fertilizer & Tools',
      description: 'Sell certified seeds, agro-chemicals, and machinery to farmers and cooperatives.',
      tags: ['Input Store', 'Order Dispatch', 'Inventory'],
      icon: <Droplet className="w-6 h-6 text-[#1a365d]" />,
      iconBg: 'bg-[#e2e8f0]',
    },
    {
      id: 'transporter',
      title: 'Logistics / Transporter',
      badge: 'Haulage & Delivery',
      description: 'Provide fleet haulage, accept farm-to-market dispatch requests, and track routes.',
      tags: ['Waybills', 'Fleet Routes', 'Instant Pay'],
      icon: <Truck className="w-6 h-6 text-[#2d3748]" />,
      iconBg: 'bg-[#edf2f7]',
    },
    {
      id: 'super_admin',
      title: 'System Administrator',
      badge: 'Ministry / Platform Admin',
      description: 'Platform oversight, farmer verification, subsidies distribution, and analytics.',
      tags: ['Verification', 'Audit Logs', 'Subsidies'],
      icon: <ShieldCheck className="w-6 h-6 text-[#90000d]" />,
      iconBg: 'bg-[#ffdad6]',
    },
  ];

  const currentSelectedRole = roles.find((r) => r.id === selectedRole) || roles[0];

  const handleContinue = () => {
    setRole(selectedRole);
    loginRole(selectedRole);

    if (onSelectRole) {
      onSelectRole(selectedRole);
    }

    if (selectedRole === 'super_admin') {
      setActiveView('admin_department_select');
    } else {
      setActiveView('dashboard');
    }
  };

  const handleGoBack = () => {
    if (onBack) {
      onBack();
    } else {
      setActiveView('splash');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] sm:bg-[#f0f2f1] flex flex-col justify-between items-center p-3 sm:p-6 lg:p-8 selection:bg-[#c1ecd4]">
      {/* Container Wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-2xl bg-[#f8f9fa] sm:bg-white sm:rounded-3xl sm:shadow-xl sm:border sm:border-[#e5e7eb] p-4 sm:p-7 flex flex-col justify-between my-auto relative overflow-hidden max-h-[96vh] sm:max-h-[90vh]"
      >
        {/* Subtle Accent Glows */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#c1ecd4]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header & Title */}
        <div className="shrink-0">
          {/* Header Bar */}
          <div className="w-full pb-3 border-b border-[#e5e7eb] flex items-center justify-between">
            <button
              onClick={handleGoBack}
              className="p-1.5 rounded-xl hover:bg-[#e5e7eb]/60 text-[#4b5563] hover:text-[#111827] transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
              title="Go Back"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back</span>
            </button>

            <AgroAppLogo iconSize={26} textSize="text-lg sm:text-xl" onClick={handleGoBack} />

            <span className="px-2.5 py-1 rounded-full bg-[#053221]/10 text-[#053221] text-[11px] font-extrabold uppercase tracking-wider">
              Step 1 of 2
            </span>
          </div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="pt-3 pb-1 text-center sm:text-left space-y-1"
          >
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#111827] tracking-tight">
              Select Your Role
            </h1>
            <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed">
              Choose your profile type to customize your tools, marketplace access, and dashboard.
            </p>
          </motion.div>
        </div>

        {/* Scrollable Role Cards List / Grid */}
        <div className="flex-1 overflow-y-auto my-2 pr-1 space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-3 max-h-[52vh] sm:max-h-[56vh] scrollbar-thin">
            {roles.map((role, idx) => {
              const isSelected = selectedRole === role.id;
              return (
                <motion.div
                  key={role.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + idx * 0.04 }}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => setSelectedRole(role.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative ${
                    isSelected
                      ? 'bg-[#053221]/[0.03] border-[#053221] ring-2 ring-[#053221]/20 shadow-sm'
                      : 'bg-white border-[#e5e7eb] hover:border-[#053221]/40 hover:bg-[#fafafa]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${role.iconBg}`}
                      >
                        {role.icon}
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-base text-[#111827] leading-tight">
                          {role.title}
                        </h3>
                        <span className="text-[10px] font-bold text-[#6b7280] uppercase tracking-wide">
                          {role.badge}
                        </span>
                      </div>
                    </div>

                    {/* Radio/Check Indicator */}
                    <div className="shrink-0 pt-1">
                      {isSelected ? (
                        <CheckCircle2 className="w-5 h-5 text-[#053221] fill-[#053221]/10" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-[#d1d5db]" />
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-[#4b5563] leading-normal mt-2.5 mb-3 line-clamp-2">
                    {role.description}
                  </p>

                  {/* Feature Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1 border-t border-[#f0f0f0]">
                    {role.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                          isSelected
                            ? 'bg-[#053221] text-white'
                            : 'bg-[#f3f4f6] text-[#4b5563]'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
        </div>

        {/* Sticky Fixed Bottom Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          className="shrink-0 pt-3 mt-1 border-t border-[#e5e7eb] bg-white sm:bg-transparent -mx-4 -mb-4 px-4 pb-4 sm:mx-0 sm:mb-0 sm:px-0 sm:pb-0 flex flex-col sm:flex-row items-center justify-between gap-2.5 shadow-lg sm:shadow-none z-20"
        >
          {/* Active Selected Role Preview Chip */}
          <div className="flex items-center gap-3 w-full sm:w-auto bg-[#f8f9fa] sm:bg-[#f3f4f6] p-2 px-3 rounded-xl border border-[#e5e7eb] shadow-2xs">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${currentSelectedRole.iconBg}`}>
              {currentSelectedRole.icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-bold text-[#6b7280] uppercase tracking-wider flex items-center gap-1">
                <span>Selected Profile</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#053221]" />
              </div>
              <div className="text-xs font-extrabold text-[#111827] truncate">
                {currentSelectedRole.title}
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleContinue}
            className="w-full sm:w-auto h-12 px-7 bg-[#053221] hover:bg-[#09462e] text-white font-heading font-bold text-sm sm:text-base rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer group shrink-0"
          >
            <span>Continue as {currentSelectedRole.title}</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" />
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};


