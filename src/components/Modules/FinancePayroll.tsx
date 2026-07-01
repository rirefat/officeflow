/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Wallet, DollarSign, Calendar, FileText, CheckCircle2, TrendingUp, HelpCircle, Printer, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const FinancePayroll: React.FC = () => {
  const { invoices, employees, currentRole, currentTenant } = useApp();

  const [selectedPayslipEmp, setSelectedPayslipEmp] = useState<any>(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Calculations
  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalPaid = invoices.filter((i) => i.status === 'Paid').reduce((sum, inv) => sum + inv.amount, 0);

  // Total developer salaries
  const totalSalaries = employees.reduce((sum, emp) => sum + emp.salary, 0);

  // Profit Margins estimate
  const profitMarginPercentage = totalPaid > 0 ? ((totalPaid - totalSalaries) / totalPaid) * 100 : 0;

  const handlePrintPayslip = (emp: any) => {
    setSelectedPayslipEmp(emp);
  };

  return (
    <div className="space-y-6">
      {/* Financial Health Snapshot Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 font-display">Client Invoices</span>
            <p className="text-xl font-bold font-display text-slate-800 dark:text-slate-100">${totalInvoiced.toLocaleString()}</p>
            <span className="text-[10px] font-mono font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              ${totalPaid.toLocaleString()} paid cashflow
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-600 shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 font-display">Monthly Payroll Burden</span>
            <p className="text-xl font-bold font-display text-slate-800 dark:text-slate-100">${totalSalaries.toLocaleString()}</p>
            <span className="text-[10px] font-mono text-slate-400">Fixed specialist commitments</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-600 shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 font-display">Operating Profit Margins</span>
            <p className="text-xl font-bold font-display text-emerald-600">
              {profitMarginPercentage > 0 ? `${profitMarginPercentage.toFixed(1)}%` : '0.0%'}
            </p>
            <span className="text-[10px] font-mono text-slate-400">Revenues minus labor overheads</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-600 shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Invoice Ledgers & Payroll list split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Client Invoice records */}
        <div className="lg:col-span-2 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div>
            <span className="text-xs font-bold text-slate-400 font-display">Direct Client Invoices</span>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-display mt-0.5">Billing Statements</h2>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">
                  <th className="p-3">Invoice Number</th>
                  <th className="p-3">Client</th>
                  <th className="p-3">Due Date</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-xs text-slate-700 dark:text-slate-300">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition">
                    <td className="p-3 font-mono font-semibold text-slate-800 dark:text-slate-200">{inv.invoiceNumber}</td>
                    <td className="p-3 font-medium text-slate-700 dark:text-slate-300">{inv.clientName}</td>
                    <td className="p-3 font-mono text-slate-400">{inv.dueDate}</td>
                    <td className="p-3 font-bold text-slate-800 dark:text-slate-100">${inv.amount.toLocaleString()}</td>
                    <td className="p-3 text-right">
                      <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded-full ${inv.status === 'Paid' ? 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400'}`}>
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Payslip Stubs Generation Drawer */}
        <div className="p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-display">Payslip & Payroll generator</h3>
            <p className="text-[11px] text-slate-400">Generate high-fidelity salary slips for contract payroll reporting.</p>
          </div>

          <div className="space-y-3">
            {employees.map((emp) => (
              <div
                key={emp.id}
                className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition"
              >
                <div className="flex items-center space-x-2.5">
                  <img src={emp.avatar} alt={emp.name} className="w-6.5 h-6.5 rounded-full object-cover" />
                  <div>
                    <p className="font-bold text-slate-700 dark:text-slate-200">{emp.name}</p>
                    <p className="text-[9px] text-slate-400 font-mono">Base Salary: ${emp.salary.toLocaleString()}</p>
                  </div>
                </div>

                <button
                  onClick={() => handlePrintPayslip(emp)}
                  className="flex items-center px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold transition text-[10px] text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 mr-1 text-slate-400" /> Payslip
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payslip printing Layout Sheet modal */}
      <AnimatePresence>
        {selectedPayslipEmp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xl p-6 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider">Salary Payslip Receipt</span>
                <button onClick={() => setSelectedPayslipEmp(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Corporate Payslip Mock */}
              <div className="border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 bg-slate-50/20 dark:bg-slate-950/20 space-y-6 text-xs text-slate-600 dark:text-slate-300">
                {/* Header info */}
                <div className="flex items-start justify-between">
                  <div className="leading-snug space-y-1">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 font-display text-sm">{currentTenant.name}</h3>
                    <p className="text-[10px] text-slate-400">{currentTenant.focus}</p>
                    <p className="text-[10px] text-slate-400 font-mono">Date: July 1, 2026</p>
                  </div>
                  <div className="text-right leading-snug">
                    <span className="text-sm font-bold font-mono text-indigo-600 dark:text-indigo-400">PAYSTUB RECEIPT</span>
                  </div>
                </div>

                {/* Employee details info */}
                <div className="grid grid-cols-2 gap-4 border-t border-b border-slate-100 dark:border-slate-800/80 py-3.5 font-medium">
                  <div>
                    <span className="text-[9px] uppercase font-mono text-slate-400 block mb-0.5">EMPLOYEE SPECIALIST</span>
                    <strong className="text-slate-800 dark:text-slate-200 font-display">{selectedPayslipEmp.name}</strong>
                    <span className="text-[10px] block text-slate-400">{selectedPayslipEmp.role}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-mono text-slate-400 block mb-0.5">DEPARTMENT</span>
                    <strong className="text-slate-800 dark:text-slate-200 font-display">{selectedPayslipEmp.department}</strong>
                    <span className="text-[10px] block text-slate-400">Status: {selectedPayslipEmp.status}</span>
                  </div>
                </div>

                {/* Earnings & Deductions ledger */}
                <div className="grid grid-cols-2 gap-6 leading-relaxed">
                  {/* Earnings */}
                  <div className="space-y-2">
                    <p className="text-[10px] uppercase font-mono font-bold text-slate-400 border-b border-slate-100 dark:border-slate-850 pb-1">Earnings</p>
                    <div className="flex items-center justify-between">
                      <span>Basic Fixed Salary</span>
                      <strong className="text-slate-800 dark:text-slate-200 font-mono">${selectedPayslipEmp.salary.toLocaleString()}</strong>
                    </div>
                    <div className="flex items-center justify-between text-emerald-600">
                      <span>Performance Bonus</span>
                      <strong className="font-mono">${(selectedPayslipEmp.performance * 150).toFixed(0)}</strong>
                    </div>
                  </div>

                  {/* Deductions */}
                  <div className="space-y-2">
                    <p className="text-[10px] uppercase font-mono font-bold text-slate-400 border-b border-slate-100 dark:border-slate-850 pb-1">Deductions</p>
                    <div className="flex items-center justify-between text-rose-500">
                      <span>Income Tax (15%)</span>
                      <strong className="font-mono">-${(selectedPayslipEmp.salary * 0.15).toFixed(0)}</strong>
                    </div>
                    <div className="flex items-center justify-between text-rose-500">
                      <span>Provident Fund (5%)</span>
                      <strong className="font-mono">-${(selectedPayslipEmp.salary * 0.05).toFixed(0)}</strong>
                    </div>
                  </div>
                </div>

                {/* Net totals summary */}
                <div className="border-t border-slate-200/80 dark:border-slate-800 pt-4 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-mono uppercase text-slate-400 block">TOTAL DISBURSED NET PAY</span>
                    <span className="text-lg font-bold font-mono text-emerald-600">
                      ${(selectedPayslipEmp.salary + selectedPayslipEmp.performance * 150 - selectedPayslipEmp.salary * 0.2).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-[10px] text-slate-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Transferred securely to Bank Account</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2">
                <button
                  onClick={() => alert('Sending to corporate printer spooler...')}
                  className="flex items-center px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition cursor-pointer"
                >
                  <Printer className="w-4 h-4 mr-1.5" /> Print Corporate Slip
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
