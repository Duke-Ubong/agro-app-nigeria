import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export const CreditView: React.FC = () => {
  const { user } = useAuth();
  const { loans, applyLoan } = useApp();

  const [requestedAmount, setRequestedAmount] = useState<number>(250000);
  const [tenureMonths, setTenureMonths] = useState<number>(6);
  const [purpose, setPurpose] = useState<'Input Seeds & Fertilizer' | 'Irrigation Equipment' | 'Mechanization Tractor Rent'>('Input Seeds & Fertilizer');
  const [isSuccessModal, setIsSuccessModal] = useState(false);

  // 5% annual subsidized agricultural interest rate
  const monthlyRate = 0.05 / 12;
  const totalInterest = Math.round(requestedAmount * monthlyRate * tenureMonths);
  const monthlyRepayment = Math.round((requestedAmount + totalInterest) / tenureMonths);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    applyLoan({
      applicantId: user.id,
      applicantName: user.name,
      applicantRole: user.role,
      applicantState: user.state,
      amount: requestedAmount,
      durationMonths: tenureMonths,
      tenureMonths,
      interestRate: '5%',
      purpose,
      collateral: 'Farm Yield Guarantee',
      repaymentEstimate: monthlyRepayment,
      expectedRepaymentDate: new Date(Date.now() + tenureMonths * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      appliedAt: new Date().toISOString(),
    });
    setIsSuccessModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#012d1d] text-white p-6 rounded-2xl shadow-sm border border-[#1b4332] space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#86af99] bg-[#1b4332] px-3 py-1 rounded-full border border-[#86af99]/30">
            Low-Interest Farm Loans
          </span>
          <h1 className="font-heading font-bold text-2xl mt-2">Farmer Loans & Farm Support</h1>
          <p className="text-xs text-[#86af99]">
            Get low 5% interest loans for seeds, fertilizer, plowing, and equipment before harvest season.
          </p>
        </div>

        {/* Credit Score & Eligibility Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-[#1b4332]">
          <div className="bg-[#1b4332] p-4 rounded-xl border border-[#274e3d] space-y-1">
            <span className="text-[10px] font-bold uppercase text-[#86af99]">Farmer Trust Score</span>
            <div className="font-heading font-bold text-3xl text-[#c1ecd4]">780 / 850</div>
            <p className="text-[10px] text-[#86af99]">Excellent (Supported by Cooperative)</p>
          </div>

          <div className="bg-[#1b4332] p-4 rounded-xl border border-[#274e3d] space-y-1">
            <span className="text-[10px] font-bold uppercase text-[#86af99]">Maximum Loan You Can Take</span>
            <div className="font-heading font-bold text-3xl text-[#c1ecd4]">₦1,500,000</div>
            <p className="text-[10px] text-[#86af99]">No Collateral Needed for Verified Farmers</p>
          </div>

          <div className="bg-[#1b4332] p-4 rounded-xl border border-[#274e3d] space-y-1">
            <span className="text-[10px] font-bold uppercase text-[#86af99]">Government Supported Rate</span>
            <div className="font-heading font-bold text-3xl text-[#c1ecd4]">5.0% Fixed</div>
            <p className="text-[10px] text-[#86af99]">Normal Bank Rate: 24% (Government Pays 19%)</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Loan Calculator & Application Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#c1c8c2] p-6 space-y-4">
          <h3 className="font-heading font-bold text-base text-[#012d1d]">Farm Loan Calculator & Request Form</h3>

          <form onSubmit={handleApply} className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-bold text-[#1a1c1c] mb-1">
                <span>How Much Money Do You Need?</span>
                <span className="text-sm font-heading text-[#012d1d]">₦{requestedAmount.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={50000}
                max={1500000}
                step={25000}
                value={requestedAmount}
                onChange={(e) => setRequestedAmount(Number(e.target.value))}
                className="w-full accent-[#012d1d]"
              />
              <div className="flex justify-between text-[10px] text-[#717973] mt-1">
                <span>₦50,000 (Min)</span>
                <span>₦1,500,000 (Max)</span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#1a1c1c] mb-1">How Long to Pay Back? (Months)</label>
              <div className="grid grid-cols-3 gap-2">
                {[3, 6, 9].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setTenureMonths(m)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      tenureMonths === m
                        ? 'bg-[#012d1d] text-white border-[#012d1d]'
                        : 'bg-[#f3f3f3] text-[#1a1c1c] border-[#c1c8c2] hover:bg-[#e8e8e8]'
                    }`}
                  >
                    {m} Months
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#1a1c1c] mb-1">What Will You Use the Money For?</label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value as any)}
                className="w-full h-11 px-3 rounded-xl border border-[#717973] font-bold"
              >
                <option value="Input Seeds & Fertilizer">Seeds & Fertilizer Package</option>
                <option value="Irrigation Equipment">Solar Water Pump / Irrigation</option>
                <option value="Mechanization Tractor Rent">Tractor Renting & Land Clearing</option>
              </select>
            </div>

            {/* Repayment Breakdown Box */}
            <div className="p-4 bg-[#f3f3f3] rounded-xl border border-[#c1c8c2] space-y-2">
              <div className="flex justify-between">
                <span>Amount Requested</span>
                <span className="font-bold">₦{requestedAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#717973]">
                <span>Total 5% Interest Fee ({tenureMonths} Months)</span>
                <span>₦{totalInterest.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-heading font-bold text-sm text-[#012d1d] pt-2 border-t border-[#c1c8c2]">
                <span>Amount to Pay Each Month</span>
                <span>₦{monthlyRepayment.toLocaleString()} / Month</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-[#012d1d] text-white font-heading font-bold text-sm rounded-full hover:bg-[#1b4332] active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>Apply for Loan Now</span>
            </button>
          </form>
        </div>

        {/* Existing Credit Facilities */}
        <div className="bg-white rounded-2xl border border-[#c1c8c2] p-5 space-y-3">
          <h3 className="font-heading font-bold text-sm text-[#012d1d]">My Loan Requests</h3>
          <div className="space-y-3 text-xs">
            {loans.length === 0 ? (
              <p className="text-xs text-[#717973]">No active loans found. Apply using the form.</p>
            ) : (
              loans.map((ln) => (
                <div key={ln.id} className="p-3 bg-[#f9f9f9] border border-[#e2e2e2] rounded-xl space-y-1">
                  <div className="flex justify-between font-bold text-[#1a1c1c]">
                    <span>{ln.purpose}</span>
                    <span className="text-[#012d1d]">₦{ln.amount.toLocaleString()}</span>
                  </div>
                  <div className="text-[11px] text-[#717973]">
                    Pay Back In: {ln.durationMonths || ln.tenureMonths || 6} Months • Interest: {ln.interestRate}
                  </div>
                  <div className="pt-1 flex justify-between items-center">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#ffdeac] text-[#281900]">
                      {ln.status === 'under_review' || ln.status === 'pending' ? 'Under Review' : ln.status.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-[#717973]">
                      Date: {new Date(ln.appliedAt || ln.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {isSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 bg-[#c1ecd4] text-[#002114] rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[36px]">verified</span>
            </div>
            <h3 className="font-heading font-bold text-lg text-[#012d1d]">Loan Request Received!</h3>
            <p className="text-xs text-[#414844]">
              Your 5% interest loan application has been submitted to your Cooperative Leader and Bank of Agriculture team for fast review.
            </p>
            <button
              onClick={() => setIsSuccessModal(false)}
              className="w-full py-3 bg-[#012d1d] text-white font-bold text-xs rounded-full hover:bg-[#1b4332]"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
