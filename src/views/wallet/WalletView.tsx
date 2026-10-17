import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export const WalletView: React.FC = () => {
  const { user } = useAuth();
  const { walletTransactions, walletBalance, addTransaction } = useApp();

  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [amount, setAmount] = useState<number>(50000);
  const [bankAccount, setBankAccount] = useState({
    bankName: 'First Bank of Nigeria',
    accountNumber: '3091823901',
    accountName: user.name,
  });

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;
    addTransaction({
      type: 'credit',
      amount,
      description: 'Wallet Top-up via NIBSS Direct Transfer',
      status: 'completed',
      reference: `DEP-${Math.floor(100000 + Math.random() * 900000)}`,
    });
    setDepositModalOpen(false);
    setAmount(50000);
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || amount > walletBalance) return;
    addTransaction({
      type: 'debit',
      amount,
      description: `Withdrawal to ${bankAccount.bankName} (${bankAccount.accountNumber})`,
      status: 'completed',
      reference: `WTH-${Math.floor(100000 + Math.random() * 900000)}`,
    });
    setWithdrawModalOpen(false);
    setAmount(50000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#012d1d] text-white p-6 rounded-2xl shadow-sm border border-[#1b4332] space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#86af99] bg-[#1b4332] px-3 py-1 rounded-full border border-[#86af99]/30">
              National Agricultural Digital Wallet
            </span>
            <h1 className="font-heading font-bold text-2xl mt-2">Agro-Pay Escrow & Settlement</h1>
            <p className="text-xs text-[#86af99]">
              CBN-Compliant Digital Ledger for Farmers, Buyers, and Input Distributors
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDepositModalOpen(true)}
              className="h-11 px-5 bg-[#c1ecd4] text-[#002114] font-heading font-bold text-xs rounded-full hover:bg-[#a8dfc1] active:scale-95 transition-all shadow-sm flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>Fund Wallet</span>
            </button>
            <button
              onClick={() => setWithdrawModalOpen(true)}
              className="h-11 px-5 bg-[#1b4332] text-white font-heading font-bold text-xs rounded-full border border-[#86af99]/40 hover:bg-[#274e3d] active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">account_balance</span>
              <span>Withdraw Funds</span>
            </button>
          </div>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#1b4332]">
          <div className="bg-[#1b4332] p-4 rounded-xl border border-[#274e3d] space-y-1">
            <span className="text-[10px] font-bold uppercase text-[#86af99]">Available Liquid Balance</span>
            <div className="font-heading font-bold text-3xl text-[#c1ecd4]">
              ₦{walletBalance.toLocaleString()}
            </div>
            <p className="text-[10px] text-[#86af99]">Instant payout to all 24 Nigerian banks</p>
          </div>

          <div className="bg-[#1b4332] p-4 rounded-xl border border-[#274e3d] space-y-1">
            <span className="text-[10px] font-bold uppercase text-[#86af99]">Locked Escrow Holdings</span>
            <div className="font-heading font-bold text-3xl text-[#c1ecd4]">₦12,500,000</div>
            <p className="text-[10px] text-[#86af99]">4 Pending Produce Contracts</p>
          </div>

          <div className="bg-[#1b4332] p-4 rounded-xl border border-[#274e3d] space-y-1">
            <span className="text-[10px] font-bold uppercase text-[#86af99]">Active Subsidy Vouchers</span>
            <div className="font-heading font-bold text-3xl text-[#c1ecd4]">₦350,000</div>
            <p className="text-[10px] text-[#86af99]">Federal Input Grant (50% Off Seeds)</p>
          </div>
        </div>
      </div>

      {/* Transaction History Table */}
      <div className="bg-white rounded-2xl border border-[#c1c8c2] p-5 space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-[#e2e2e2]">
          <h3 className="font-heading font-bold text-base text-[#012d1d]">Ledger & Transaction History</h3>
          <span className="text-xs text-[#717973]">Real-time NIBSS Verification</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#f3f3f3] text-[#012d1d] font-bold border-b border-[#c1c8c2]">
                <th className="p-3">Reference</th>
                <th className="p-3">Description</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e2e2]">
              {walletTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#f9f9f9]">
                  <td className="p-3 font-mono font-bold text-[#012d1d]">{tx.reference}</td>
                  <td className="p-3 font-semibold text-[#1a1c1c]">{tx.description}</td>
                  <td className="p-3 text-[#717973]">{new Date(tx.createdAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-[#c1ecd4] text-[#002114] text-[10px] font-bold uppercase">
                      {tx.status}
                    </span>
                  </td>
                  <td
                    className={`p-3 text-right font-heading font-bold text-sm ${
                      tx.type === 'credit' ? 'text-[#012d1d]' : 'text-[#ba1a1a]'
                    }`}
                  >
                    {tx.type === 'credit' ? '+' : '-'}₦{tx.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deposit Modal */}
      {depositModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setDepositModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-[#e8e8e8] text-[#717973]"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <h3 className="font-heading font-bold text-lg text-[#012d1d]">Fund Wallet via Bank Transfer</h3>
            <p className="text-xs text-[#414844]">
              Transfer funds directly from any Nigerian bank to your dedicated AgroApp NIBSS Virtual Account:
            </p>

            <div className="p-3 bg-[#f3f3f3] rounded-xl space-y-1 text-xs border border-[#c1c8c2]">
              <div className="flex justify-between">
                <span className="text-[#717973]">Bank Name</span>
                <span className="font-bold text-[#012d1d]">Providus Bank / Wema Bank</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#717973]">Virtual Account No.</span>
                <span className="font-mono font-bold text-sm text-[#012d1d]">9921839210</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#717973]">Account Name</span>
                <span className="font-bold text-[#1a1c1c]">AGROAPP / {user.name}</span>
              </div>
            </div>

            <form onSubmit={handleDeposit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#1a1c1c] mb-1">Simulate Quick Top-up Amount (₦)</label>
                <input
                  type="number"
                  required
                  min={1000}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full h-11 px-3 rounded-xl border border-[#717973] font-bold text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#012d1d] text-white font-bold text-xs rounded-full hover:bg-[#1b4332]"
              >
                Confirm Instant Credit
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {withdrawModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setWithdrawModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-[#e8e8e8] text-[#717973]"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <h3 className="font-heading font-bold text-lg text-[#012d1d]">Withdraw Funds to Nigerian Bank</h3>

            <form onSubmit={handleWithdraw} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#1a1c1c] mb-1">Select Destination Bank</label>
                <select
                  value={bankAccount.bankName}
                  onChange={(e) => setBankAccount({ ...bankAccount, bankName: e.target.value })}
                  className="w-full h-11 px-3 rounded-xl border border-[#717973] font-bold"
                >
                  <option value="First Bank of Nigeria">First Bank of Nigeria</option>
                  <option value="Zenith Bank">Zenith Bank</option>
                  <option value="Access Bank">Access Bank</option>
                  <option value="UBA">United Bank for Africa (UBA)</option>
                  <option value="GTBank">Guaranty Trust Bank (GTB)</option>
                  <option value="Kuda Bank">Kuda Microfinance Bank</option>
                  <option value="Moniepoint">Moniepoint Microfinance Bank</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#1a1c1c] mb-1">Account Number (10 Digits)</label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  value={bankAccount.accountNumber}
                  onChange={(e) => setBankAccount({ ...bankAccount, accountNumber: e.target.value })}
                  className="w-full h-11 px-3 rounded-xl border border-[#717973] font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1a1c1c] mb-1">Withdrawal Amount (₦)</label>
                <input
                  type="number"
                  required
                  max={walletBalance}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full h-11 px-3 rounded-xl border border-[#717973] font-bold text-sm"
                />
                <p className="text-[10px] text-[#717973] mt-1">
                  Available: ₦{walletBalance.toLocaleString()}
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#012d1d] text-white font-bold text-xs rounded-full hover:bg-[#1b4332]"
              >
                Withdraw to Bank Account
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
