import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MemberLoanRecord } from '../../types';

export const CooperativeCreditView: React.FC = () => {
  const { memberLoans, coopMembers, recordLoanRepayment, setActiveView } = useApp();
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [repayLoan, setRepayLoan] = useState<MemberLoanRecord | null>(null);
  const [repayAmount, setRepayAmount] = useState<number>(50000);

  const filteredLoans = memberLoans.filter((loan) => {
    const matchesSearch =
      loan.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.cluster.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || loan.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalFacility = 15000000;
  const totalGranted = memberLoans.reduce((acc, l) => acc + l.amountGrantedNaira, 0);
  const totalRepaid = memberLoans.reduce((acc, l) => acc + l.amountRepaidNaira, 0);
  const totalOutstanding = memberLoans.reduce((acc, l) => acc + l.outstandingBalanceNaira, 0);
  const recoveryRate = totalGranted > 0 ? (totalRepaid / totalGranted) * 100 : 0;

  const handleRepay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repayLoan) return;

    recordLoanRepayment(repayLoan.id, repayAmount);
    setRepayLoan(null);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#3f6653] bg-[#c1ecd4] px-2.5 py-0.5 rounded-full">
              In-Kind Input Financing
            </span>
            <span className="text-xs text-[#717973] font-medium">• Harvest Deduction Model</span>
          </div>
          <h1 className="font-heading font-bold text-2xl text-[#012d1d] mt-1">
            Member Seasonal Credit & Loan Ledger
          </h1>
          <p className="text-xs text-[#414844]">
            Administer revolving input packages, tractor mechanization credit, and automated repayment deductions during weighbridge aggregation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('coop_inputs')}
            className="h-10 px-4 bg-[#012d1d] text-white font-heading font-bold text-xs rounded-full flex items-center gap-2 hover:bg-[#1b4332] active:scale-95 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Issue Input Package Loan</span>
          </button>
        </div>
      </div>

      {/* Credit Facility Metrics Bento */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#c1c8c2] p-4 rounded-xl space-y-1 shadow-sm">
          <div className="flex justify-between items-center text-[#717973]">
            <span className="text-xs font-bold uppercase">Revolving Facility</span>
            <span className="material-symbols-outlined text-[#012d1d] text-[20px]">account_balance</span>
          </div>
          <div className="font-heading font-bold text-2xl text-[#012d1d]">
            ₦{(totalFacility / 1000000).toFixed(1)}M
          </div>
          <p className="text-[10px] text-[#717973]">NIRSAL & BOA credit line</p>
        </div>

        <div className="bg-white border border-[#c1c8c2] p-4 rounded-xl space-y-1 shadow-sm">
          <div className="flex justify-between items-center text-[#717973]">
            <span className="text-xs font-bold uppercase">Disbursed to Farmers</span>
            <span className="material-symbols-outlined text-[#012d1d] text-[20px]">payments</span>
          </div>
          <div className="font-heading font-bold text-2xl text-[#012d1d]">
            ₦{(totalGranted / 1000000).toFixed(2)}M
          </div>
          <p className="text-[10px] text-[#717973]">In-kind seeds, fertilizer, tractors</p>
        </div>

        <div className="bg-white border border-[#c1c8c2] p-4 rounded-xl space-y-1 shadow-sm">
          <div className="flex justify-between items-center text-[#717973]">
            <span className="text-xs font-bold uppercase">Harvest Recovered</span>
            <span className="material-symbols-outlined text-[#3f6653] text-[20px]">check_circle</span>
          </div>
          <div className="font-heading font-bold text-2xl text-[#3f6653]">
            ₦{(totalRepaid / 1000000).toFixed(2)}M
          </div>
          <p className="text-[10px] text-[#717973]">{recoveryRate.toFixed(1)}% recovery progress</p>
        </div>

        <div className="bg-white border border-[#c1c8c2] p-4 rounded-xl space-y-1 shadow-sm">
          <div className="flex justify-between items-center text-[#ba1a1a]">
            <span className="text-xs font-bold uppercase">Outstanding Debt</span>
            <span className="material-symbols-outlined text-[#ba1a1a] text-[20px]">pending</span>
          </div>
          <div className="font-heading font-bold text-2xl text-[#ba1a1a]">
            ₦{(totalOutstanding / 1000000).toFixed(2)}M
          </div>
          <p className="text-[10px] text-[#717973]">Pending incoming grain harvests</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#c1c8c2] shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#717973] text-[20px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search by farmer name or cluster..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#f3f3f3] border border-[#c1c8c2] rounded-lg text-xs focus:outline-none focus:border-[#012d1d]"
          />
        </div>

        <div className="flex items-center gap-2">
          {['All', 'active', 'partially_repaid', 'fully_repaid'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-full text-xs font-heading font-bold transition-all ${
                filterStatus === st
                  ? 'bg-[#012d1d] text-white'
                  : 'bg-[#f3f3f3] text-[#414844] hover:bg-[#e8e8e8]'
              }`}
            >
              {st === 'All' ? 'All Loans' : st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Loans Table */}
      <div className="bg-white rounded-xl border border-[#c1c8c2] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f9f9f9] border-b border-[#e2e2e2] text-[#717973] uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Farmer & Cluster</th>
                <th className="py-3 px-4">Financed Package</th>
                <th className="py-3 px-4">Principal Amount</th>
                <th className="py-3 px-4">Grain Tonnage Pledged</th>
                <th className="py-3 px-4">Repaid via Harvest</th>
                <th className="py-3 px-4">Remaining Balance</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e2e2]">
              {filteredLoans.map((loan) => (
                <tr key={loan.id} className="hover:bg-[#f3f8f5] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-heading font-bold text-xs text-[#012d1d]">{loan.memberName}</div>
                    <div className="text-[10px] text-[#717973]">{loan.cluster}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-[#1a1c1c]">{loan.loanType}</div>
                    <div className="text-[10px] text-[#717973]">{loan.cropSeason} • {loan.interestRatePercent}% interest</div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#1a1c1c]">
                    ₦{loan.amountGrantedNaira.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-heading font-bold text-[#012d1d]">
                    {loan.harvestDeductionTonsCommitted} MT
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#3f6653]">
                    ₦{loan.amountRepaidNaira.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    {loan.outstandingBalanceNaira > 0 ? (
                      <span className="font-bold text-[#ba1a1a]">
                        ₦{loan.outstandingBalanceNaira.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-[#3f6653] font-bold">Settled (₦0)</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        loan.status === 'fully_repaid'
                          ? 'bg-[#c1ecd4] text-[#002114]'
                          : loan.status === 'partially_repaid'
                          ? 'bg-[#d8e2ff] text-[#001b3e]'
                          : 'bg-[#ffdeac] text-[#281900]'
                      }`}
                    >
                      {loan.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {loan.outstandingBalanceNaira > 0 && (
                      <button
                        onClick={() => {
                          setRepayLoan(loan);
                          setRepayAmount(Math.min(50000, loan.outstandingBalanceNaira));
                        }}
                        className="px-2.5 py-1 bg-[#012d1d] hover:bg-[#1b4332] text-white rounded text-[11px] font-bold"
                      >
                        Record Repayment
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Repayment Modal */}
      {repayLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#c1c8c2] space-y-4">
            <div className="flex justify-between items-center border-b border-[#e2e2e2] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#3f6653] bg-[#c1ecd4] px-2 py-0.5 rounded">
                  Credit Recovery
                </span>
                <h3 className="font-heading font-bold text-base text-[#012d1d] mt-1">
                  Record Loan Repayment: {repayLoan.memberName}
                </h3>
              </div>
              <button
                onClick={() => setRepayLoan(null)}
                className="w-8 h-8 rounded-full bg-[#f3f3f3] hover:bg-[#e2e2e2] flex items-center justify-center text-[#414844]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleRepay} className="space-y-3 text-xs">
              <div className="p-3 bg-[#f9f9f9] rounded-xl border border-[#e2e2e2] space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#717973]">Outstanding Balance:</span>
                  <span className="font-bold text-[#ba1a1a]">₦{repayLoan.outstandingBalanceNaira.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#717973]">Package:</span>
                  <span className="font-bold">{repayLoan.loanType}</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#414844] mb-1">
                  Repayment Amount (₦) *
                </label>
                <input
                  type="number"
                  step="5000"
                  max={repayLoan.outstandingBalanceNaira}
                  value={repayAmount}
                  onChange={(e) => setRepayAmount(Math.min(repayLoan.outstandingBalanceNaira, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 bg-[#f3f3f3] border border-[#c1c8c2] rounded-lg font-bold text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#e2e2e2]">
                <button
                  type="button"
                  onClick={() => setRepayLoan(null)}
                  className="px-4 py-2 bg-[#f3f3f3] text-[#414844] font-bold rounded-lg hover:bg-[#e8e8e8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#012d1d] text-white font-bold rounded-lg hover:bg-[#1b4332]"
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
