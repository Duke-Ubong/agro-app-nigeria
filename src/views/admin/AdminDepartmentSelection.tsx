import React, { useState } from 'react';
import {
  Shield,
  Landmark,
  MapPin,
  Headphones,
  CreditCard,
  ShieldCheck,
  ArrowRight,
  HelpCircle,
  Check,
  Sprout,
  X,
  Phone,
  Mail,
  ArrowLeft,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export interface DepartmentOption {
  id: string;
  title: string;
  subtitle: string;
  role: UserRole;
  defaultTab: 'super_admin' | 'ministry_policy' | 'state_adp' | 'operations' | 'finance_partner' | 'compliance_audit' | 'users' | 'broadcasts';
  icon: React.ComponentType<{ className?: string }>;
  accentColor?: string;
}

export const AdminDepartmentSelection: React.FC = () => {
  const { setRole, loginRole } = useAuth();
  const { setActiveView, setAdminTab } = useApp();

  const [selectedDeptId, setSelectedDeptId] = useState<string>('super_admin');
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [showContactModal, setShowContactModal] = useState<boolean>(false);

  const departments: DepartmentOption[] = [
    {
      id: 'super_admin',
      title: 'Super Admin',
      subtitle: 'Full Ecosystem Oversight',
      role: 'super_admin',
      defaultTab: 'super_admin',
      icon: Shield,
    },
    {
      id: 'ministry_admin',
      title: 'Ministry Admin',
      subtitle: 'Strategic Policy & National Data',
      role: 'gov_admin',
      defaultTab: 'ministry_policy',
      icon: Landmark,
    },
    {
      id: 'state_admin',
      title: 'State / Regional Admin',
      subtitle: 'Localized Operations & Logistics',
      role: 'institutional_admin',
      defaultTab: 'state_adp',
      icon: MapPin,
    },
    {
      id: 'operations_admin',
      title: 'Operations / Support Admin',
      subtitle: 'User Support & Verifications',
      role: 'institutional_admin',
      defaultTab: 'operations',
      icon: Headphones,
    },
    {
      id: 'finance_admin',
      title: 'Finance / Partner Admin',
      subtitle: 'Escrow & Financial Reconciliation',
      role: 'gov_admin',
      defaultTab: 'finance_partner',
      icon: CreditCard,
    },
    {
      id: 'compliance_admin',
      title: 'Compliance / Audit Admin',
      subtitle: 'Regulatory & Fraud Monitoring',
      role: 'super_admin',
      defaultTab: 'compliance_audit',
      icon: ShieldCheck,
    },
  ];

  const handleContinue = () => {
    const chosen = departments.find((d) => d.id === selectedDeptId) || departments[0];
    setRole(chosen.role);
    loginRole(chosen.role);
    if (setAdminTab) {
      setAdminTab(chosen.defaultTab);
    }
    setActiveView('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#f8faf8] flex flex-col font-body selection:bg-[#c1ecd4] selection:text-[#002114]">
      {/* Top App Bar with AgriGov Nigeria Portal branding */}
      <header className="w-full bg-white border-b border-[#e5e7eb] px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#053221] flex items-center justify-center text-white shrink-0">
            <Sprout className="w-4 h-4 text-[#c1ecd4]" />
          </div>
          <h1 className="font-heading font-extrabold text-base sm:text-lg text-[#012d1d] tracking-tight">
            AgriGov Nigeria Portal
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowHelpModal(true)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#2c342e] hover:bg-[#f0f4f1] transition-colors cursor-pointer border border-[#e5e7eb]"
            title="Help & Information"
            aria-label="Help"
          >
            <HelpCircle className="w-5 h-5 text-[#2c342e]" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-3 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[480px] bg-white rounded-2xl sm:rounded-3xl border border-[#d8deda] shadow-md p-5 sm:p-7 flex flex-col space-y-5"
        >
          {/* Header Title */}
          <div className="text-center space-y-1.5 pt-1">
            <h2 className="font-heading font-bold text-xl sm:text-2xl text-[#012d1d] tracking-tight">
              Admin Portal
            </h2>
            <p className="text-xs sm:text-sm text-[#525a54] font-normal leading-relaxed">
              Select your department to access the management console.
            </p>
          </div>

          {/* Department List */}
          <div className="space-y-2.5">
            {departments.map((dept) => {
              const isSelected = selectedDeptId === dept.id;
              const IconComponent = dept.icon;
              return (
                <div
                  key={dept.id}
                  id={`admin-dept-${dept.id}`}
                  onClick={() => setSelectedDeptId(dept.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedDeptId(dept.id);
                    }
                  }}
                  className={`w-full p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border text-left flex items-center justify-between gap-3.5 transition-all cursor-pointer group ${
                    isSelected
                      ? 'border-[#012d1d] bg-[#f2f7f4] shadow-xs ring-1 ring-[#012d1d]/20'
                      : 'border-[#e2e8e4] bg-white hover:border-[#a3b8ad] hover:bg-[#fafbfa]'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Icon Pill */}
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-[#012d1d] text-white shadow-xs'
                          : 'bg-[#e9ece9] text-[#2c342e] group-hover:bg-[#dfe5e1]'
                      }`}
                    >
                      <IconComponent
                        className={`w-5 h-5 ${isSelected ? 'text-[#c1ecd4]' : 'text-[#2c342e]'}`}
                      />
                    </div>

                    {/* Department Title & Subtitle */}
                    <div className="min-w-0">
                      <div className="font-heading font-bold text-xs sm:text-sm text-[#012d1d] leading-snug">
                        {dept.title}
                      </div>
                      <div className="text-[11px] sm:text-xs text-[#636c65] font-normal truncate mt-0.5">
                        {dept.subtitle}
                      </div>
                    </div>
                  </div>

                  {/* Selected Indicator */}
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#012d1d] text-white flex items-center justify-center shrink-0 animate-in zoom-in-75 duration-150">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Button */}
          <div className="pt-2 space-y-3">
            <button
              type="button"
              id="continue-to-dashboard-btn"
              onClick={handleContinue}
              className="w-full py-3.5 px-5 bg-[#758e80] hover:bg-[#012d1d] active:bg-[#002114] text-white font-heading font-bold text-sm rounded-xl shadow-xs hover:shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Continue to Dashboard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Bottom Support Links */}
            <div className="text-center space-y-1 pt-1 text-xs">
              <p className="text-[#525a54] font-medium">Forgotten credentials?</p>
              <button
                type="button"
                onClick={() => setShowContactModal(true)}
                className="font-bold text-[#012d1d] hover:underline cursor-pointer"
              >
                Contact System Administrator
              </button>
            </div>

            {/* Back to Role Selection */}
            <div className="pt-1 text-center">
              <button
                type="button"
                onClick={() => setActiveView('role_selection')}
                className="text-[11px] text-[#717973] hover:text-[#012d1d] inline-flex items-center gap-1 font-medium transition-colors"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Switch to Public / Farmer Portal</span>
              </button>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Help Modal */}
      <AnimatePresence>
        {showHelpModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-[#c1c8c2]"
            >
              <div className="flex justify-between items-center pb-2 border-b border-[#e8ece9]">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-[#012d1d]" />
                  <h3 className="font-heading font-bold text-base text-[#012d1d]">
                    AgriGov Admin Shells
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowHelpModal(false)}
                  className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#f0f4f1] text-[#717973]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-[#525a54] leading-relaxed">
                <p>
                  The <strong>AgriGov Nigeria Platform</strong> organizes administrative authorities into six specialized functional branches:
                </p>
                <ul className="list-disc pl-4 space-y-1.5">
                  <li><strong>Super Admin:</strong> Manages platform infrastructure, kill-switches, and edge routing.</li>
                  <li><strong>Ministry Admin:</strong> Oversees national strategic grain reserves, crop production, and policy balance sheets.</li>
                  <li><strong>State / Regional Admin:</strong> Coordinates state ADP directorates, field extension workers, and localized logistics.</li>
                  <li><strong>Operations / Support:</strong> Resolves dispute tickets, verifies KYC registrations, and handles waybill incidents.</li>
                  <li><strong>Finance / Partner:</strong> Reconciles Bank of Agriculture (BOA) credit lines and escrow payouts.</li>
                  <li><strong>Compliance / Audit:</strong> Monitors AML/CFT red flags, price gouging alerts, and tamper-proof logs.</li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="w-full py-2.5 bg-[#012d1d] text-white font-bold text-xs rounded-xl hover:bg-[#1b4332]"
              >
                Got It
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Contact Admin Modal */}
      <AnimatePresence>
        {showContactModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-[#c1c8c2]"
            >
              <div className="flex justify-between items-center pb-2 border-b border-[#e8ece9]">
                <h3 className="font-heading font-bold text-base text-[#012d1d]">
                  Contact System Administrator
                </h3>
                <button
                  type="button"
                  onClick={() => setShowContactModal(false)}
                  className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#f0f4f1] text-[#717973]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-[#525a54]">
                <p>
                  For access elevation, role reassignments, or credential recovery, reach out to the Federal Ministry of Agriculture & Food Security Directorate of ICT:
                </p>

                <div className="p-3 bg-[#f8faf8] rounded-xl border border-[#e2e8e4] space-y-2">
                  <div className="flex items-center gap-2 text-[#012d1d] font-bold">
                    <Mail className="w-4 h-4 text-[#012d1d]" />
                    <span>admin-support@agrigov.gov.ng</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#012d1d] font-bold">
                    <Phone className="w-4 h-4 text-[#012d1d]" />
                    <span>0800-AGRI-GOV (0800-2474-468)</span>
                  </div>
                  <div className="text-[11px] text-[#717973]">
                    FMAFS Headquarters, Area 11, Garki, Abuja, FCT
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowContactModal(false)}
                className="w-full py-2.5 bg-[#012d1d] text-white font-bold text-xs rounded-xl hover:bg-[#1b4332]"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default AdminDepartmentSelection;
