import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

interface IdentityVerificationProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

export const IdentityVerification: React.FC<IdentityVerificationProps> = ({ onComplete: propOnComplete, onSkip: propOnSkip }) => {
  const { user, updateUser } = useAuth();
  const { setActiveView } = useApp();
  
  const onComplete = propOnComplete || (() => setActiveView('dashboard'));
  const onSkip = propOnSkip || (() => setActiveView('dashboard'));
  
  const [ninNumber, setNinNumber] = useState(user.nin || '');
  const [cacNumber, setCacNumber] = useState(user.cacNumber || '');
  const [idUploaded, setIdUploaded] = useState(false);
  const [selfieUploaded, setSelfieUploaded] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      updateUser({
        verificationStatus: 'verified',
        nin: ninNumber,
        cacNumber: cacNumber,
      });
      onComplete();
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] flex flex-col justify-between p-4 sm:p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between pb-4 border-b border-[#c1c8c2]">
        <h1 className="font-heading font-bold text-lg text-[#012d1d]">Verify Your Identity</h1>
        <button
          onClick={onSkip}
          className="text-xs font-bold text-[#717973] hover:text-[#012d1d] hover:underline"
        >
          Do this Later →
        </button>
      </div>

      <div className="my-auto py-6 space-y-6">
        <div className="bg-[#1b4332] text-white p-4 rounded-xl flex items-center gap-3 shadow-md">
          <div className="p-3 bg-[#012d1d] rounded-xl text-[#c1ecd4]">
            <span className="material-symbols-outlined text-[28px]">verified_user</span>
          </div>
          <div>
            <h2 className="font-heading font-bold text-base">Account Verification</h2>
            <p className="text-xs text-[#86af99]">
              Add your NIN or CAC number to unlock higher wallet limits, loan access, and government fertilizer benefits.
            </p>
          </div>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1a1c1c] mb-1">
                National Identity Number (NIN)
              </label>
              <input
                type="text"
                value={ninNumber}
                onChange={(e) => setNinNumber(e.target.value)}
                placeholder="11-digit NIN"
                className="w-full h-11 px-3 rounded-lg border border-[#717973] bg-white text-xs font-mono text-[#1a1c1c]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1a1c1c] mb-1">
                CAC / Cooperative Reg Number
              </label>
              <input
                type="text"
                value={cacNumber}
                onChange={(e) => setCacNumber(e.target.value)}
                placeholder="RC-XXXXXX"
                className="w-full h-11 px-3 rounded-lg border border-[#717973] bg-white text-xs font-mono text-[#1a1c1c]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setIdUploaded(!idUploaded)}
              className={`p-4 rounded-xl border border-dashed flex flex-col items-center justify-center gap-2 transition-all ${
                idUploaded
                  ? 'bg-[#c1ecd4]/30 border-[#012d1d] text-[#002114]'
                  : 'bg-white border-[#717973] hover:bg-[#f3f3f3] text-[#414844]'
              }`}
            >
              <span className="material-symbols-outlined text-[28px]">
                {idUploaded ? 'check_circle' : 'badge'}
              </span>
              <span className="font-bold text-xs">
                {idUploaded ? 'ID Card Attached ✓' : 'Upload ID Card or Voter Card'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSelfieUploaded(!selfieUploaded)}
              className={`p-4 rounded-xl border border-dashed flex flex-col items-center justify-center gap-2 transition-all ${
                selfieUploaded
                  ? 'bg-[#c1ecd4]/30 border-[#012d1d] text-[#002114]'
                  : 'bg-white border-[#717973] hover:bg-[#f3f3f3] text-[#414844]'
              }`}
            >
              <span className="material-symbols-outlined text-[28px]">
                {selfieUploaded ? 'check_circle' : 'photo_camera'}
              </span>
              <span className="font-bold text-xs">
                {selfieUploaded ? 'Photo Attached ✓' : 'Take a Photo of Your Face'}
              </span>
            </button>
          </div>

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full h-12 bg-[#012d1d] text-white font-heading font-bold text-sm rounded-full flex items-center justify-center gap-2 hover:bg-[#1b4332] active:scale-95 transition-all shadow-md mt-4"
          >
            {isVerifying ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
                <span>Checking NIN details...</span>
              </>
            ) : (
              <>
                <span>Confirm & Verify ID</span>
                <span className="material-symbols-outlined text-[18px]">security</span>
              </>
            )}
          </button>
        </form>
      </div>

      <div className="text-center text-[11px] text-[#717973] border-t border-[#c1c8c2] pt-3">
        Encrypted verification powered by NIMC / Federal Ministry Agricultural Identity System.
      </div>
    </div>
  );
};
