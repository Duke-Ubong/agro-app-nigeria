import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { NIGERIAN_BANKS } from '../../data/farmerData';

export const FarmerWalletView: React.FC = () => {
  const { user } = useAuth();
  const {
    walletBalance,
    transactions,
    memberLoans,
    recordLoanRepayment,
    withdrawFromWallet,
  } = useApp();

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isRepayModalOpen, setIsRepayModalOpen] = useState(false);
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);

  // Withdrawal Form State
  const [selectedBankCode, setSelectedBankCode] = useState(NIGERIAN_BANKS[0].code);
  const [accountNumber, setAccountNumber] = useState('0124892019');
  const [withdrawAmount, setWithdrawAmount] = useState('150000');
  const [withdrawSuccessMsg, setWithdrawSuccessMsg] = useState<string | null>(null);

  // Repayment Form State
  const [repayAmount, setRepayAmount] = useState('50000');

  const selectedBank = NIGERIAN_BANKS.find((b) => b.code === selectedBankCode) || NIGERIAN_BANKS[0];

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(withdrawAmount, 10);
    if (isNaN(amount) || amount <= 0 || amount > walletBalance) {
      alert('Please enter a valid withdrawal amount within your available balance.');
      return;
    }

    const success = withdrawFromWallet(
      amount,
      selectedBank.code,
      selectedBank.name,
      accountNumber,
      user.name || 'Babatunde Adeleke'
    );

    if (success) {
      setWithdrawSuccessMsg(
        `₦${amount.toLocaleString()} successfully transferred to ${selectedBank.name} (${accountNumber}) via NIBSS Instant Payment.`
      );
      setIsWithdrawModalOpen(false);
    }
  };

  const handleRepayLoan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLoanId) return;

    const amount = parseInt(repayAmount, 10);
    if (isNaN(amount) || amount <= 0) return;

    recordLoanRepayment(selectedLoanId, amount);
    setIsRepayModalOpen(false);
    setSelectedLoanId(null);
  };

  const totalOutstandingLoans = memberLoans
    .filter((l) => l.status !== 'fully_repaid')
    .reduce((acc, l) => acc + l.outstandingBalanceNaira, 0);

  const totalHarvestTonsPledged = memberLoans
    .filter((l) => l.status !== 'fully_repaid')
    .reduce((acc, l) => acc + l.harvestDeductionTonsCommitted, 0);

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-2xl border border-[#c1c8c2]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#3f6653] uppercase tracking-wider mb-1">
            <span>Instant Harvest Payouts</span>
            <span>·</span>
            <span>NIBSS-Integrated Digital Wallet</span>
          </div>
          <h1 className="font-heading font-bold text-2xl text-[#012d1d]">
            Farmer Payout Wallet & Input Credit
          </h1>
          <p className="text-xs text-[#414844] mt-1">
            Access proceeds from warehouse intake deliveries, withdraw directly to your commercial bank, and monitor crop-lien repayments.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsWithdrawModalOpen(true)}
            className="h-10 px-5 rounded-xl bg-[#012d1d] text-white hover:bg-[#1b4332] text-xs font-bold font-heading flex items-center gap-2 transition-colors shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">account_balance</span>
            <span>Transfer to Bank</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {withdrawSuccessMsg && (
        <div className="bg-[#c1ecd4] border border-[#274e3d] text-[#002114] p-4 rounded-xl flex justify-between items-center text-xs font-semibold animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            <span>{withdrawSuccessMsg}</span>
          </div>
          <button onClick={() => setWithdrawSuccessMsg(null)} className="text-[#002114] hover:underline font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* Wallet Balance Hero Card & Credit Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Available Balance Box */}
        <div className="md:col-span-2 bg-[#1b4332] text-white p-6 rounded-2xl border border-[#274e3d] flex flex-col justify-between shadow-xs">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[#86af99] text-xs font-semibold">
              <span className="uppercase tracking-wider">Available Payout Balance</span>
              <span className="text-[#c1ecd4] font-bold">Instant 24/7 Withdrawal</span>
            </div>

            <div className="font-heading font-bold text-4xl text-[#c1ecd4] tabular-nums mt-1">
              ₦{walletBalance.toLocaleString()}
            </div>

            <p className="text-xs text-[#a5d0b9]">
              Settled from certified cooperative warehouse intakes & marketplace grain orders.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 mt-4 border-t border-[#274e3d] text-xs">
            <div>
              <span className="text-[10px] text-[#86af99] uppercase font-bold">Linked Bank</span>
              <div className="font-semibold text-white truncate">GTBank · 0124892019</div>
            </div>
            <div>
              <span className="text-[10px] text-[#86af99] uppercase font-bold">BVN Identity</span>
              <div className="font-semibold text-[#c1ecd4]">Verified (NIN/BVN)</div>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-[10px] text-[#86af99] uppercase font-bold">Daily Limit</span>
              <div className="font-semibold text-white">₦5,000,000</div>
            </div>
          </div>
        </div>

        {/* Seasonal Credit & Harvest Lien Summary */}
        <div className="bg-white p-5 rounded-2xl border border-[#c1c8c2] flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#717973]">
              Active Crop-Lien Commitments
            </span>
            <div className="font-heading font-bold text-2xl text-[#ba1a1a] tabular-nums">
              ₦{totalOutstandingLoans.toLocaleString()}
            </div>
            <div className="text-xs text-[#414844]">
              Committed harvest pledge: <strong className="text-[#012d1d] tabular-nums">{totalHarvestTonsPledged} MT</strong> of grain at warehouse intake.
            </div>
          </div>

          <div className="bg-[#fef7f7] border border-[#f5c2c2] p-3 rounded-xl text-xs text-[#93000a] space-y-1">
            <div className="font-bold">Transparent Harvest Deductions</div>
            <p className="text-[11px] leading-relaxed">
              When your grain trucks arrive at the silo weighbridge, input debt is automatically deducted from gross valuation before cash payout.
            </p>
          </div>
        </div>
      </div>

      {/* Member Loan & Crop-Lien Ledger */}
      <div className="bg-white rounded-2xl border border-[#c1c8c2] p-5 space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-[#e2e2e2]">
          <div>
            <h3 className="font-heading font-bold text-base text-[#012d1d]">
              Input Package Loans & Lien Ledger ({memberLoans.length})
            </h3>
            <p className="text-xs text-[#717973]">
              Zero-interest in-kind input financing provided by your agricultural cooperative union.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#f9f9f9] text-[#717973] uppercase font-bold text-[10px] border-b border-[#e2e2e2]">
              <tr>
                <th className="px-4 py-3">Package / Loan Type</th>
                <th className="px-4 py-3">Crop Season</th>
                <th className="px-4 py-3">Granted (₦)</th>
                <th className="px-4 py-3">Repaid (₦)</th>
                <th className="px-4 py-3">Outstanding (₦)</th>
                <th className="px-4 py-3">Pledged Harvest</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Repay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e2e2]">
              {memberLoans.map((loan) => (
                <tr key={loan.id} className="hover:bg-[#f9f9f9] transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-heading font-bold text-[#012d1d]">{loan.loanType}</div>
                    <div className="text-[10px] text-[#717973]">Disbursed: {loan.disbursedDate}</div>
                  </td>
                  <td className="px-4 py-3 font-medium text-[#1a1c1c]">{loan.cropSeason}</td>
                  <td className="px-4 py-3 font-heading font-bold text-[#1a1c1c] tabular-nums">
                    ₦{loan.amountGrantedNaira.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-heading font-bold text-[#1b4332] tabular-nums">
                    ₦{loan.amountRepaidNaira.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-heading font-bold text-[#ba1a1a] tabular-nums">
                    ₦{loan.outstandingBalanceNaira.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-[#012d1d] tabular-nums">
                      {loan.harvestDeductionTonsCommitted} MT
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      loan.status === 'fully_repaid'
                        ? 'bg-[#c1ecd4] text-[#002114]'
                        : loan.status === 'partially_repaid'
                        ? 'bg-[#ffdeac] text-[#523700]'
                        : 'bg-[#ffdad6] text-[#93000a]'
                    }`}>
                      {loan.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {loan.status !== 'fully_repaid' && (
                      <button
                        onClick={() => {
                          setSelectedLoanId(loan.id);
                          setRepayAmount(Math.min(walletBalance, loan.outstandingBalanceNaira).toString());
                          setIsRepayModalOpen(true);
                        }}
                        className="h-8 px-3 rounded-lg border border-[#c1c8c2] bg-white hover:bg-[#012d1d] hover:text-white text-xs font-bold text-[#012d1d] transition-colors"
                      >
                        Pay Down
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Wallet Transactions History */}
      <div className="bg-white rounded-2xl border border-[#c1c8c2] p-5 space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-[#e2e2e2]">
          <div>
            <h3 className="font-heading font-bold text-base text-[#012d1d]">
              Recent Payout & Settlement Transactions
            </h3>
            <p className="text-xs text-[#717973]">
              Immutable audit ledger of grain deposits, marketplace settlements, and bank cashouts.
            </p>
          </div>
        </div>

        <div className="divide-y divide-[#e2e2e2]">
          {transactions.map((tx) => (
            <div key={tx.id} className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-xl shrink-0 ${
                    tx.type === 'credit' || tx.type === 'escrow_release'
                      ? 'bg-[#c1ecd4] text-[#002114]'
                      : 'bg-[#ffdad6] text-[#93000a]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {tx.type === 'credit' || tx.type === 'escrow_release' ? 'south_west' : 'north_east'}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#1a1c1c]">{tx.description}</h4>
                  <div className="text-[10px] text-[#717973] mt-0.5">
                    {tx.category} · Ref: {tx.reference} · {new Date(tx.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div
                  className={`font-heading font-bold text-sm tabular-nums ${
                    tx.type === 'credit' || tx.type === 'escrow_release'
                      ? 'text-[#012d1d]'
                      : 'text-[#ba1a1a]'
                  }`}
                >
                  {tx.type === 'credit' || tx.type === 'escrow_release' ? '+' : '-'}₦
                  {tx.amount.toLocaleString()}
                </div>
                <span className="text-[10px] font-semibold text-[#3f6653] uppercase">
                  {tx.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Bank Withdrawal */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-[#c1c8c2] shadow-xl">
            <div className="flex justify-between items-start pb-3 border-b border-[#e2e2e2]">
              <div>
                <h3 className="font-heading font-bold text-lg text-[#012d1d]">
                  Transfer to Bank Account
                </h3>
                <p className="text-xs text-[#717973] mt-0.5">
                  Instant settlement via NIBSS (Nigeria Inter-Bank Settlement System).
                </p>
              </div>
              <button onClick={() => setIsWithdrawModalOpen(false)} className="text-[#717973] hover:text-[#012d1d]">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#414844] mb-1">Select Destination Bank *</label>
                <select
                  value={selectedBankCode}
                  onChange={(e) => setSelectedBankCode(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-[#f9f9f9] border border-[#c1c8c2] rounded-lg focus:outline-none focus:border-[#012d1d]"
                >
                  {NIGERIAN_BANKS.map((b) => (
                    <option key={b.code} value={b.code}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#414844] mb-1">10-Digit NUBAN Account Number *</label>
                <input
                  type="text"
                  maxLength={10}
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-[#f9f9f9] border border-[#c1c8c2] rounded-lg focus:outline-none focus:border-[#012d1d] font-bold tabular-nums"
                />
                <div className="flex items-center gap-1.5 text-[11px] text-[#3f6653] font-semibold mt-1">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  <span>Beneficiary: {user.name || 'Babatunde Adeleke'} (NIN Matched)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <label className="font-semibold text-[#414844]">Amount to Withdraw (₦) *</label>
                  <span className="text-[#717973]">Available: ₦{walletBalance.toLocaleString()}</span>
                </div>
                <input
                  type="number"
                  min="1000"
                  max={walletBalance}
                  required
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-[#f9f9f9] border border-[#c1c8c2] rounded-lg focus:outline-none focus:border-[#012d1d] font-bold tabular-nums"
                />

                {/* Quick Presets */}
                <div className="flex gap-2 mt-2">
                  {[50000, 100000, 250000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setWithdrawAmount(preset.toString())}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-[#f3f3f3] hover:bg-[#e8e8e8] text-[#012d1d] rounded-lg transition-colors"
                    >
                      ₦{preset.toLocaleString()}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setWithdrawAmount(walletBalance.toString())}
                    className="px-2.5 py-1 text-[11px] font-semibold bg-[#c1ecd4] text-[#002114] rounded-lg transition-colors"
                  >
                    Max
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#e2e2e2]">
                <button
                  type="button"
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-[#414844] hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#012d1d] hover:bg-[#1b4332] rounded-lg transition-colors"
                >
                  Confirm Instant Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Repay Loan */}
      {isRepayModalOpen && selectedLoanId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-[#c1c8c2] shadow-xl">
            <div className="flex justify-between items-start pb-3 border-b border-[#e2e2e2]">
              <div>
                <h3 className="font-heading font-bold text-lg text-[#012d1d]">
                  Pay Down Input Credit
                </h3>
                <p className="text-xs text-[#717973] mt-0.5">
                  Deduct from wallet balance to clear seasonal input liens early.
                </p>
              </div>
              <button onClick={() => setIsRepayModalOpen(false)} className="text-[#717973] hover:text-[#012d1d]">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleRepayLoan} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#414844] mb-1">Repayment Amount (₦) *</label>
                <input
                  type="number"
                  min="5000"
                  max={walletBalance}
                  required
                  value={repayAmount}
                  onChange={(e) => setRepayAmount(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-[#f9f9f9] border border-[#c1c8c2] rounded-lg focus:outline-none focus:border-[#012d1d] font-bold tabular-nums"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#e2e2e2]">
                <button
                  type="button"
                  onClick={() => setIsRepayModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-[#414844] hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#012d1d] hover:bg-[#1b4332] rounded-lg transition-colors"
                >
                  Confirm Repayment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
