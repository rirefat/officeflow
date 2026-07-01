/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Play, Square, Clock, Plus, HelpCircle, AlertCircle, FileSpreadsheet } from 'lucide-react';
import { motion } from 'motion/react';

export const Timesheets: React.FC = () => {
  const {
    tasks,
    timesheets,
    employees,
    activeTimerTaskId,
    startTaskTimer,
    stopTaskTimer,
    addManualTimesheet,
  } = useApp();

  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [manualHours, setManualHours] = useState('2.5');
  const [manualDescription, setManualDescription] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const activeTimerTask = tasks.find((t) => t.id === activeTimerTaskId);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskId || !manualHours || !manualDescription) return;

    addManualTimesheet({
      taskId: selectedTaskId,
      hours: Number(manualHours),
      description: manualDescription,
      date: new Date().toISOString().split('T')[0],
    });

    setManualDescription('');
    setSuccessMsg('Timesheet logged successfully!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Time Tracking Engine Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Log manual timesheet */}
        <div className="p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold font-display text-slate-800 dark:text-slate-100 flex items-center">
              <Plus className="w-4.5 h-4.5 mr-2 text-indigo-600" /> Log Time Allocation
            </h3>
            <p className="text-[11px] text-slate-400">Submit a manual timesheet record or start a live task stopwatch.</p>
          </div>

          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Select Project Task</label>
              <select
                value={selectedTaskId}
                onChange={(e) => setSelectedTaskId(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/20 text-xs outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
              >
                <option value="">-- Choose Active Task --</option>
                {tasks.map((t) => (
                  <option key={t.id} value={t.id}>
                    [{t.priority}] {t.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Logged Hours duration (e.g. 3.5)</label>
              <input
                type="number"
                step="0.1"
                placeholder="2.5"
                value={manualHours}
                onChange={(e) => setManualHours(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/20 text-xs outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Brief Activity description</label>
              <textarea
                rows={3}
                placeholder="Implemented dark mode styles and checked colors against WCAG contrast ratios..."
                value={manualDescription}
                onChange={(e) => setManualDescription(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/20 text-xs outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="submit"
                className="py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer"
              >
                Log Manual Hours
              </button>

              <button
                type="button"
                disabled={!selectedTaskId}
                onClick={() => startTaskTimer(selectedTaskId)}
                className="py-2 rounded-xl border border-indigo-100 dark:border-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/50 disabled:opacity-45 text-xs font-bold transition flex items-center justify-center cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 mr-1" /> Start Live Timer
              </button>
            </div>
          </form>

          {successMsg && (
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/15 border border-emerald-100/30 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
              {successMsg}
            </div>
          )}
        </div>

        {/* Right 2 Columns: Timesheets Log History */}
        <div className="lg:col-span-2 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div>
            <span className="text-xs font-bold text-slate-400 font-display">Timesheets Logs</span>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-display mt-0.5">Corporate Labor & Time Logs</h2>
          </div>

          {/* Historical Logs List */}
          <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">
                  <th className="p-3">Specialist</th>
                  <th className="p-3">Project Task</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Logged Description</th>
                  <th className="p-3 text-right">Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-xs text-slate-700 dark:text-slate-300">
                {timesheets.map((ts) => {
                  const emp = employees.find((e) => e.id === ts.employeeId);
                  const t = tasks.find((tk) => tk.id === ts.taskId);
                  return (
                    <tr key={ts.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition">
                      <td className="p-3 font-semibold font-display flex items-center space-x-2">
                        <img src={emp?.avatar} alt={emp?.name} className="w-5.5 h-5.5 rounded-full object-cover" />
                        <span>{emp?.name || 'Unknown Specialist'}</span>
                      </td>
                      <td className="p-3 max-w-[150px] truncate font-medium text-slate-800 dark:text-slate-200">{t?.title || 'Unknown Task'}</td>
                      <td className="p-3 font-mono text-slate-400 whitespace-nowrap">{ts.date}</td>
                      <td className="p-3 max-w-[200px] truncate text-slate-500">{ts.description}</td>
                      <td className="p-3 text-right font-mono font-bold text-indigo-600 dark:text-indigo-400">{ts.hours.toFixed(1)} hrs</td>
                    </tr>
                  );
                })}

                {timesheets.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400 italic">No timesheets recorded yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
