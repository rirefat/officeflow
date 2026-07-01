/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LogIn, LogOut, Shield, MapPin, Send, CheckCircle2, Download, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AttendanceTracker: React.FC = () => {
  const {
    currentUserEmployee,
    attendance,
    checkIn,
    checkOut,
    requestCorrection,
    employees,
  } = useApp();

  const [correctionReason, setCorrectionReason] = useState('');
  const [requestedTime, setRequestedTime] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];
  const myRecord = attendance.find((r) => r.employeeId === currentUserEmployee?.id && r.date === todayStr);

  const isCheckedIn = !!myRecord;
  const isCheckedOut = !!myRecord?.checkOut;

  const handleCorrectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionReason || !requestedTime) return;
    requestCorrection(correctionReason, requestedTime);
    setSuccessMsg('Correction request successfully submitted to managers.');
    setCorrectionReason('');
    setRequestedTime('');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // CSV export helper
  const exportToCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,Date,Employee,Check In,Check Out,IP Address,Location,Status\n';

    attendance.forEach((r) => {
      const emp = employees.find((e) => e.id === r.employeeId);
      const row = [
        r.date,
        `"${emp?.name || 'Unknown'}"`,
        r.checkIn,
        r.checkOut || 'N/A',
        r.ipAddress,
        `"${r.location}"`,
        r.status,
      ].join(',');
      csvContent += row + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Attendance_Report_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Attendance Check-in Core Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Large Active Clock controller */}
        <div className="lg:col-span-2 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 font-display">Active Operations Console</span>
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-display mt-0.5">Punch Attendance</h2>
              </div>
              <span className="text-[10px] bg-slate-50 dark:bg-slate-850 px-2.5 py-1 rounded-full border border-slate-100 dark:border-slate-800 text-slate-400 font-bold font-mono">
                DEVICE SECURE
              </span>
            </div>

            {/* Simulated Live Location details */}
            <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/50 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-mono font-bold text-slate-400 flex items-center">
                  <Shield className="w-3.5 h-3.5 mr-1 text-indigo-500" /> Secure Gateway IP
                </span>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200 font-mono">
                  {myRecord?.ipAddress || '192.168.10.231 (Auto-detected)'}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-mono font-bold text-slate-400 flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-rose-500" /> GPS Location Address
                </span>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200 font-mono">
                  {myRecord?.location || 'Detecting via corporate router...'}
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Check-In button block */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
            {!isCheckedIn ? (
              <button
                onClick={checkIn}
                className="w-full sm:w-auto flex items-center justify-center px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-500/20 transition cursor-pointer"
              >
                <LogIn className="w-4.5 h-4.5 mr-2" /> Punch Check-In (Clock In)
              </button>
            ) : !isCheckedOut ? (
              <button
                onClick={checkOut}
                className="w-full sm:w-auto flex items-center justify-center px-6 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-500/20 transition cursor-pointer"
              >
                <LogOut className="w-4.5 h-4.5 mr-2" /> Punch Check-Out (Clock Out)
              </button>
            ) : (
              <div className="p-4 rounded-xl border border-emerald-100 dark:border-emerald-950/30 bg-emerald-50/20 dark:bg-emerald-950/10 text-emerald-800 dark:text-emerald-400 flex items-center space-x-2.5 w-full">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="text-xs font-semibold">You have successfully completed your shifts for today.</span>
              </div>
            )}

            {isCheckedIn && (
              <div className="text-xs text-slate-400 text-center sm:text-left leading-normal font-medium">
                <p>Checked In at <strong className="text-slate-700 dark:text-slate-200">{myRecord.checkIn}</strong></p>
                {isCheckedOut && (
                  <p>Checked Out at <strong className="text-slate-700 dark:text-slate-200">{myRecord.checkOut}</strong></p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Column: Manual Attendance Correction Panel */}
        <div className="p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-display flex items-center">
              <HelpCircle className="w-4 h-4 mr-1.5 text-indigo-500" /> Shift Corrections
            </h3>
            <p className="text-[11px] text-slate-400">Forget to check-in or out? Submit a correction timestamp below.</p>
          </div>

          <form onSubmit={handleCorrectionSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Requested Hour (HH:MM)</label>
              <input
                type="text"
                placeholder="09:00"
                value={requestedTime}
                onChange={(e) => setRequestedTime(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/20 text-xs outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Reason for Correction</label>
              <textarea
                rows={2}
                placeholder="Forgot to punch check-in due to urgent client call..."
                value={correctionReason}
                onChange={(e) => setCorrectionReason(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/20 text-xs outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 transition resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={!isCheckedIn}
              className="w-full flex items-center justify-center py-2 rounded-xl bg-slate-500 hover:bg-slate-600 disabled:opacity-40 disabled:hover:bg-slate-500 text-white font-bold text-xs transition cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 mr-1.5" /> Submit Request
            </button>
          </form>

          <AnimatePresence>
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/10 border border-emerald-100/30 text-[11px] text-emerald-700 dark:text-emerald-400 leading-snug"
              >
                {successMsg}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Historical logs table */}
      <div className="p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <span className="text-xs font-bold text-slate-400 font-display">Archived Records</span>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-display mt-0.5">Corporate Attendance History</h2>
          </div>
          <button
            onClick={exportToCSV}
            className="flex items-center px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" /> Export as CSV
          </button>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">
                <th className="p-3">Specialist Name</th>
                <th className="p-3">Shift Date</th>
                <th className="p-3">Check In</th>
                <th className="p-3">Check Out</th>
                <th className="p-3">Secure IP</th>
                <th className="p-3">Location Gateway</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-xs text-slate-700 dark:text-slate-300">
              {attendance.map((rec) => {
                const emp = employees.find((e) => e.id === rec.employeeId);
                return (
                  <tr key={rec.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                    <td className="p-3 font-semibold font-display flex items-center space-x-2">
                      <img src={emp?.avatar} alt={emp?.name} className="w-5.5 h-5.5 rounded-full object-cover" />
                      <span>{emp?.name || 'Unknown Specialist'}</span>
                    </td>
                    <td className="p-3 font-mono text-slate-500">{rec.date}</td>
                    <td className="p-3 font-mono">{rec.checkIn}</td>
                    <td className="p-3 font-mono">{rec.checkOut || '--:--:--'}</td>
                    <td className="p-3 font-mono text-slate-500">{rec.ipAddress}</td>
                    <td className="p-3 text-slate-500">{rec.location}</td>
                    <td className="p-3 text-right">
                      <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded-full ${rec.status === 'On Time' ? 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400'}`}>
                        {rec.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
