/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertOctagon, Send, Sparkles, X, PlusSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const StandupReports: React.FC = () => {
  const {
    standups,
    addStandup,
    approveStandup,
    employees,
    currentUserEmployee,
    currentRole,
  } = useApp();

  // Create Standup state
  const [completedToday, setCompletedToday] = useState('');
  const [tomorrowPlan, setTomorrowPlan] = useState('');
  const [blockers, setBlockers] = useState('None');
  const [successMsg, setSuccessMsg] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const handleSubmitStandup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!completedToday || !tomorrowPlan) return;

    addStandup({
      date: todayStr,
      completedToday,
      tomorrowPlan,
      blockers,
      status: 'Pending',
    });

    setCompletedToday('');
    setTomorrowPlan('');
    setBlockers('None');
    setSuccessMsg('Your daily standup report has been submitted to your manager.');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const isManager = ['Company Owner', 'Admin', 'HR', 'Project Manager', 'Team Lead'].includes(currentRole);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form: Log Daily Standup */}
        <div className="p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold font-display text-slate-800 dark:text-slate-100 flex items-center">
              <PlusSquare className="w-4.5 h-4.5 mr-2 text-indigo-600" /> Submit Today's Standup
            </h3>
            <p className="text-[11px] text-slate-400">Keep your team synchronized. Log your task deliverables.</p>
          </div>

          <form onSubmit={handleSubmitStandup} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">What did you complete today?</label>
              <textarea
                rows={3}
                placeholder="Finished e-commerce wireframes; debugged navigation state issue..."
                value={completedToday}
                onChange={(e) => setCompletedToday(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/20 text-xs outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">What are you planning for tomorrow?</label>
              <textarea
                rows={2}
                placeholder="Implement responsive layout; connect real mock api endpoints..."
                value={tomorrowPlan}
                onChange={(e) => setTomorrowPlan(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/20 text-xs outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Do you have any Active Blockers?</label>
              <input
                type="text"
                placeholder="e.g. None or waiting on Figma asset exports from designer"
                value={blockers}
                onChange={(e) => setBlockers(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/20 text-xs outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/15 transition cursor-pointer"
            >
              Submit Daily Standup
            </button>
          </form>

          <AnimatePresence>
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/10 border border-emerald-100/30 text-xs text-emerald-700 dark:text-emerald-400 leading-snug"
              >
                {successMsg}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right 2 Columns: Feed of Submitted Standups */}
        <div className="lg:col-span-2 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div>
            <span className="text-xs font-bold text-slate-400 font-display">Daily Standups Feed</span>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-display mt-0.5">Corporate Standups Logs</h2>
          </div>

          <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
            {standups.map((st) => {
              const emp = employees.find((e) => e.id === st.employeeId);
              return (
                <div
                  key={st.id}
                  className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/85 bg-slate-50/30 dark:bg-slate-900/10 space-y-3.5"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <img src={emp?.avatar} alt={emp?.name} className="w-9 h-9 rounded-full object-cover" />
                      <div className="leading-tight">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-display">{emp?.name}</h4>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{emp?.role} • {st.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold font-mono ${st.status === 'Approved' ? 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400'}`}>
                        {st.status}
                      </span>

                      {/* Approval Trigger for Managers */}
                      {isManager && st.status === 'Pending' && (
                        <button
                          onClick={() => approveStandup(st.id)}
                          className="px-2.5 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold cursor-pointer transition"
                        >
                          Approve
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850/50 space-y-1">
                      <span className="text-[9px] uppercase font-mono font-bold text-slate-400 flex items-center">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-500" /> Done Today
                      </span>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                        {st.completedToday}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850/50 space-y-1">
                      <span className="text-[9px] uppercase font-mono font-bold text-slate-400 flex items-center">
                        <Send className="w-3.5 h-3.5 mr-1 text-indigo-500" /> Plan Tomorrow
                      </span>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                        {st.tomorrowPlan}
                      </p>
                    </div>
                  </div>

                  {st.blockers !== 'None' && (
                    <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/15 border border-rose-100/30 text-xs text-rose-700 dark:text-rose-400 flex items-center">
                      <AlertOctagon className="w-4 h-4 mr-2 text-rose-500 shrink-0" />
                      <span><strong className="font-bold">Blocker impediments:</strong> {st.blockers}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
