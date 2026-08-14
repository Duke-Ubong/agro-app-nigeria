import React, { useState } from 'react';
import {
  ShieldAlert,
  Lock,
  FileCheck,
  AlertTriangle,
  User,
  X,
  History,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

interface ReasonLoggingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string, category: string) => void;
  targetUserName: string;
  targetUserRole: string;
  targetUserId: string;
  recordType?: string;
  adminDepartment: string;
}

export const ReasonLoggingModal: React.FC<ReasonLoggingModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  targetUserName,
  targetUserRole,
  targetUserId,
  recordType = 'End-User Personal & Financial Profile',
  adminDepartment,
}) => {
  const { user } = useAuth();
  const { addAuditLog } = useApp();

  const [category, setCategory] = useState<string>('regulatory_audit');
  const [customReason, setCustomReason] = useState<string>('');
  const [agreeNDPR, setAgreeNDPR] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const REASON_CATEGORIES = [
    { id: 'regulatory_audit', label: 'Statutory / NDPR Audit & Compliance Inspection' },
    { id: 'loan_underwriting', label: 'BOA Credit Assessment & Collateral Verification' },
    { id: 'dispute_resolution', label: 'Trade Dispute & Escrow Mediation Investigation' },
    { id: 'kyc_verification', label: 'NIN / CAC / Farmer Cooperative Tier-2 KYC Review' },
    { id: 'policy_evaluation', label: 'FMAFS Subsidy Eligibility & Yield Evaluation' },
    { id: 'user_support', label: 'Authorized User Support Incident Resolution' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeNDPR) {
      setError('You must confirm compliance with Nigeria Data Protection Regulation (NDPR).');
      return;
    }
    if (!customReason.trim()) {
      setError('Please enter specific case details / ticket reference for the audit trail.');
      return;
    }

    const fullReason = `[${category.toUpperCase()}] ${customReason.trim()} (Target: ${targetUserName} ID: ${targetUserId})`;
    
    // Log to immutable app context audit trail
    addAuditLog(
      user.name,
      user.role,
      'USER_RECORD_ACCESS_DECRYPT',
      `Authorized decrypted inspection of ${recordType} for ${targetUserName} (${targetUserRole}). Reason: ${fullReason}`
    );

    onConfirm(fullReason, category);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 font-body">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-[#c1c8c2] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex justify-between items-start pb-3 border-b border-[#e5e9e6]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-[#012d1d]">
                Mandatory Reason Logging Required
              </h3>
              <p className="text-xs text-[#525a54]">
                NDPR & National Agricultural Data Governance Policy
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#f0f4f1] text-[#717973]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Target Profile Card */}
        <div className="p-3.5 bg-[#f8faf8] rounded-2xl border border-[#d8deda] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#525a54]">Target Record:</span>
            <span className="px-2 py-0.5 bg-[#012d1d] text-white rounded-md text-[10px] font-bold uppercase">
              {targetUserRole}
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#c1ecd4] text-[#002114] font-bold text-xs flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <div className="font-heading font-bold text-sm text-[#012d1d]">
                {targetUserName}
              </div>
              <div className="text-[11px] text-[#717973] font-mono">
                UID: {targetUserId} • Protected Data: {recordType}
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#012d1d]">
              Select Regulatory Access Justification
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-xs font-semibold py-2 px-3 bg-white border border-[#717973] rounded-xl text-[#012d1d] focus:outline-none focus:ring-1 focus:ring-[#012d1d]"
            >
              {REASON_CATEGORIES.map((rc) => (
                <option key={rc.id} value={rc.id}>
                  {rc.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#012d1d]">
              Specific Operational Reference / Ticket ID / Audit Note
            </label>
            <textarea
              value={customReason}
              onChange={(e) => {
                setCustomReason(e.target.value);
                setError(null);
              }}
              placeholder="e.g., Underwriting review for ₦2.4M Maize crop loan application #BOA-8924 or Support Ticket #4419..."
              rows={3}
              className="w-full text-xs p-3 bg-white border border-[#717973] rounded-xl text-[#012d1d] focus:outline-none focus:ring-1 focus:ring-[#012d1d]"
            />
          </div>

          {/* NDPR Compliance Checkbox */}
          <div className="p-3 bg-[#fff8f6] border border-[#ffdad6] rounded-xl flex items-start gap-2.5">
            <input
              type="checkbox"
              id="ndpr-check"
              checked={agreeNDPR}
              onChange={(e) => setAgreeNDPR(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-[#012d1d] rounded"
            />
            <label htmlFor="ndpr-check" className="text-[11px] text-[#281900] leading-snug cursor-pointer">
              I certify under official oath that this access is strictly for legitimate governance/regulatory purposes in compliance with the <strong>Nigeria Data Protection Act 2023</strong>. My access, IP, and reason will be permanently sealed in the audit registry.
            </label>
          </div>

          {error && (
            <div className="p-2.5 bg-[#ffdad6] text-[#ba1a1a] rounded-xl text-xs font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-[#d8deda] hover:bg-[#f8faf8] text-[#525a54] font-bold text-xs rounded-xl"
            >
              Cancel Access
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-[#012d1d] hover:bg-[#1b4332] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs"
            >
              <FileCheck className="w-4 h-4 text-[#c1ecd4]" />
              <span>Log Reason & Unlock</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default ReasonLoggingModal;
