/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  Users,
  ShoppingBag,
  FolderKanban,
  AlertCircle,
  Clock,
  ArrowRight,
  Zap,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { motion } from 'motion/react';

export const Dashboard: React.FC<{ onNavigate: (module: string) => void }> = ({ onNavigate }) => {
  const {
    currentTenant,
    employees,
    attendance,
    fiverrOrders,
    projects,
    tasks,
    invoices,
    standups,
    activeTimerTaskId,
    timerSeconds,
    stopTaskTimer,
  } = useApp();

  const [aiReportLoading, setAiReportLoading] = useState(false);
  const [aiReport, setAiReport] = useState<any>(null);

  // Format running timesheet duration
  const formatDuration = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return [h, m, s].map((v) => (v < 10 ? '0' + v : v)).join(':');
  };

  const activeTimerTask = tasks.find((t) => t.id === activeTimerTaskId);

  // Stats calculation
  const todayStr = new Date().toISOString().split('T')[0];
  const activeStaffCount = employees.filter((e) => e.status === 'Active').length;
  const checkedInCount = attendance.filter((r) => r.date === todayStr).length;

  const runningProjects = projects.filter((p) => p.status === 'In Progress');
  const healthyCount = runningProjects.filter((p) => p.health === 'Healthy').length;

  const activeOrders = fiverrOrders.filter((o) => o.status === 'In Progress' || o.status === 'Revision');
  const totalFiverrEarning = fiverrOrders
    .filter((o) => o.status === 'Completed' || o.status === 'Delivered')
    .reduce((sum, o) => sum + o.earnings, 0);

  const lateTasksCount = tasks.filter((t) => {
    if (t.status === 'Completed') return false;
    return new Date(t.dueDate) < new Date();
  }).length;

  // Real-time Countdown timer logic for Figma/Webflow Fiverr Orders
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const getCountdownString = (deliveryDateStr: string) => {
    const target = new Date(deliveryDateStr);
    const diff = target.getTime() - now.getTime();
    if (diff <= 0) return 'Late';

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    let parts = [];
    if (d > 0) parts.push(`${d}d`);
    parts.push(`${h}h`);
    parts.push(`${m}m`);
    parts.push(`${s}s`);
    return parts.join(' ');
  };

  // Generate real AI insights on dashboard using Gemini
  const generateAIOperationalReview = async () => {
    setAiReportLoading(true);
    try {
      const response = await fetch('/api/gemini/project-health-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projects: projects,
          companyName: currentTenant.name,
          companyFocus: currentTenant.focus,
        }),
      });
      const data = await response.json();
      setAiReport(data);
    } catch (e) {
      console.error(e);
    } finally {
      setAiReportLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Hero Panel */}
      <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 backdrop-blur-md shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold px-2.5 py-1 rounded-full tracking-wider font-mono">
            {currentTenant.name.toUpperCase()} OPERATING SPACE
          </span>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 font-display mt-2 tracking-tight">
            Welcome back to the Office
          </h1>
          <p className="text-xs text-slate-400 mt-1">{currentTenant.focus}</p>
        </div>

        {/* Gemini AI On-demand Operation Analysis */}
        <button
          onClick={generateAIOperationalReview}
          disabled={aiReportLoading}
          className="flex items-center px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition shadow-sm hover:shadow-blue-500/10 cursor-pointer shrink-0"
        >
          {aiReportLoading ? (
            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 mr-2 animate-pulse text-blue-200" />
          )}
          Analyze Gigs & Health with Gemini AI
        </button>
      </div>

      {/* Dashboard Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: AI Insights - 2x1 */}
        <div className="col-span-1 md:col-span-2 bg-white dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between min-h-[200px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase font-mono">AI Smart Assistant</span>
            </div>
            {aiReport && (
              <button onClick={() => setAiReport(null)} className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-mono cursor-pointer">
                Clear
              </button>
            )}
          </div>

          {!aiReport ? (
            <div className="my-auto py-4">
              <p className="text-sm md:text-base leading-snug font-medium text-slate-700 dark:text-slate-300">
                "Suggested action for <span className="text-blue-600 font-semibold">{currentTenant.name}</span>: predicted workload threshold is reaching 85% this week. Generate an automated operational review to map exact delivery bottlenecks."
              </p>
              <div className="mt-4 flex gap-2">
                <button 
                  onClick={generateAIOperationalReview}
                  disabled={aiReportLoading}
                  className="px-3 py-1 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-950/80 text-blue-600 dark:text-blue-400 text-[11px] rounded-full border border-blue-100/30 dark:border-blue-950/30 font-semibold transition cursor-pointer"
                >
                  {aiReportLoading ? 'Predicting...' : 'Predict Workload'}
                </button>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 space-y-4 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <p className="text-[10px] uppercase font-mono font-bold text-blue-500">Assessment</p>
                  <p className="text-slate-600 dark:text-slate-300 leading-normal font-medium">
                    {aiReport.overallAssessment}
                  </p>
                  <p className="text-[10px] uppercase font-mono font-bold text-blue-500 pt-1">Forecast</p>
                  <p className="text-slate-600 dark:text-slate-300 leading-normal">
                    {aiReport.workloadForecast}
                  </p>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] uppercase font-mono font-bold text-rose-500">Active Bottlenecks</p>
                    <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 mt-1 space-y-1">
                      {aiReport.bottlenecks?.slice(0, 3).map((item: string, i: number) => (
                        <li key={i} className="truncate">{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-mono font-bold text-emerald-500">Recommendations</p>
                    <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 mt-1 space-y-1">
                      {aiReport.recommendations?.slice(0, 3).map((item: string, i: number) => (
                        <li key={i} className="truncate">{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Card 2: Revenue Card - 1x1 */}
        <div className="col-span-1 bg-white dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between min-h-[200px]">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase font-mono">Monthly Revenue</span>
            <div className="mt-4">
              <div className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
                {totalFiverrEarning === 0 ? '$14,280' : `$${totalFiverrEarning.toLocaleString()}`}
              </div>
              <div className="flex items-center gap-1 text-emerald-500 text-xs font-medium mt-1">
                <TrendingUp className="w-3 h-3" />
                12.4% vs last mo.
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-end gap-1.5 h-10">
            <div className="flex-1 bg-slate-100 dark:bg-slate-800/50 rounded-sm h-1/2"></div>
            <div className="flex-1 bg-slate-100 dark:bg-slate-800/50 rounded-sm h-2/3"></div>
            <div className="flex-1 bg-slate-100 dark:bg-slate-800/50 rounded-sm h-3/4"></div>
            <div className="flex-1 bg-blue-500 rounded-sm h-full animate-pulse"></div>
          </div>
        </div>

        {/* Card 3: Active Timer - 1x1 */}
        <div className="col-span-1 bg-slate-950 dark:bg-black p-6 rounded-2xl text-white shadow-lg flex flex-col justify-between min-h-[200px]">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase font-mono">Live Tracker</span>
            <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping"></div>
          </div>

          <div className="my-auto py-2">
            {activeTimerTaskId && activeTimerTask ? (
              <>
                <div className="text-2xl font-mono tracking-tighter text-slate-100">
                  {formatDuration(timerSeconds)}
                </div>
                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-tight truncate">
                  Timesheet: {activeTimerTask.title}
                </p>
                <button 
                  onClick={() => stopTaskTimer('')}
                  className="w-full py-2 bg-white text-slate-950 text-xs font-bold rounded-xl mt-4 hover:bg-slate-200 transition cursor-pointer"
                >
                  Stop Session
                </button>
              </>
            ) : activeOrders.length > 0 ? (
              <>
                <div className="text-2xl font-mono tracking-tighter text-rose-400">
                  {getCountdownString(activeOrders[0].deliveryDate)}
                </div>
                <p className="text-[10px] text-slate-300 mt-1 uppercase tracking-tight truncate">
                  Fiverr: {activeOrders[0].gigTitle}
                </p>
                <button 
                  onClick={() => onNavigate('fiverr')}
                  className="w-full py-2 bg-white hover:bg-slate-200 text-slate-950 text-xs font-bold rounded-xl mt-4 transition cursor-pointer"
                >
                  View Delivery
                </button>
              </>
            ) : (
              <>
                <div className="text-2xl font-mono tracking-tighter text-slate-400">
                  00:00:00
                </div>
                <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-tight">
                  No Active Timesheet
                </p>
                <button 
                  onClick={() => onNavigate('standups')}
                  className="w-full py-2 bg-white/15 hover:bg-white/20 text-white text-xs font-bold rounded-xl mt-4 transition cursor-pointer"
                >
                  Submit Standup
                </button>
              </>
            )}
          </div>
        </div>

        {/* Card 4: Fiverr Orders Feed - 2x2 */}
        <div className="col-span-1 md:col-span-2 bg-white dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between min-h-[220px]">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase font-mono">Fiverr Feed</span>
              <span 
                onClick={() => onNavigate('fiverr')}
                className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
              >
                View all
              </span>
            </div>

            <div className="space-y-3">
              {activeOrders.slice(0, 3).map((order) => {
                const colorMap = ['bg-green-500/10 text-green-600', 'bg-blue-500/10 text-blue-600', 'bg-purple-500/10 text-purple-600'];
                const randomColor = colorMap[Math.abs(order.id.charCodeAt(0) || 0) % 3];
                return (
                  <div 
                    key={order.id} 
                    onClick={() => onNavigate('fiverr')}
                    className="flex items-center gap-4 p-3 border border-slate-100 dark:border-slate-800/50 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition cursor-pointer"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold shrink-0 ${randomColor}`}>
                      $
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">{order.orderNumber} - {order.gigTitle}</p>
                      <p className="text-xs text-slate-400">
                        Due: {getCountdownString(order.deliveryDate)} • <span className="text-slate-700 dark:text-slate-300 font-semibold font-mono">${order.price}</span>
                      </p>
                    </div>
                    <div className="text-[9px] bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-500 font-bold tracking-wider uppercase shrink-0">
                      {order.status}
                    </div>
                  </div>
                );
              })}

              {activeOrders.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-xs italic">
                  No active Fiverr orders listed at the moment.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card 5: Attendance & Capacity - 2x1 */}
        <div className="col-span-1 md:col-span-2 bg-white dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between min-h-[220px]">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase font-mono">Office Presence</span>
              <span className="text-xs text-green-600 dark:text-green-400 font-semibold">{checkedInCount}/{activeStaffCount} Active</span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {employees.slice(0, 6).map((emp) => {
                const checkedIn = attendance.some((r) => r.employeeId === emp.id && r.date === todayStr);
                return (
                  <div key={emp.id} className="relative group shrink-0">
                    <img 
                      src={emp.avatar} 
                      alt={emp.name} 
                      className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 object-cover" 
                    />
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${checkedIn ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-950 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10 font-mono">
                      {emp.name} ({checkedIn ? 'Online' : 'Offline'})
                    </div>
                  </div>
                );
              })}
              {employees.length > 6 && (
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-900 flex items-center justify-center text-xs font-bold text-slate-400 shrink-0">
                  +{employees.length - 6}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4">
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600" 
                style={{ width: `${Math.min(100, Math.round((checkedInCount / (activeStaffCount || 1)) * 100))}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">
              {Math.min(100, Math.round((checkedInCount / (activeStaffCount || 1)) * 100))}% total agency staff presence online today.
            </p>
          </div>
        </div>

        {/* Card 6: Project Health - 1x1 */}
        <div className="col-span-1 bg-white dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between min-h-[200px]">
          <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase font-mono">Project Health</span>
          
          <div className="mt-2 flex flex-col items-center justify-center">
            <div className="relative w-20 h-20">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="40" cy="40" r="34" stroke="#f3f4f6" strokeWidth="6" fill="none" className="dark:stroke-slate-800"/>
                <circle 
                  cx="40" 
                  cy="40" 
                  r="34" 
                  stroke="#2563eb" 
                  strokeWidth="6" 
                  fill="none" 
                  strokeDasharray="213.52" 
                  strokeDashoffset={213.52 - (213.52 * (runningProjects.length > 0 ? healthyCount / runningProjects.length : 0.8))} 
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-bold text-base text-slate-700 dark:text-slate-200">
                {runningProjects.length > 0 ? Math.round((healthyCount / runningProjects.length) * 100) : 80}%
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium">
              {runningProjects.length > 0 && healthyCount === runningProjects.length ? 'Perfect health' : 'On track'}
            </p>
          </div>

          <p className="text-[9px] text-slate-400 text-center uppercase tracking-wider font-mono">
            {healthyCount} of {runningProjects.length || 1} healthy
          </p>
        </div>

        {/* Card 7: Revenue Chart (col-span-2) */}
        <div className="col-span-1 md:col-span-2 bg-white dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between min-h-[220px]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase font-mono">Revenue and Cashflow Analytics</span>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100 font-display mt-0.5">Financial Trends</p>
              </div>
              <div className="flex items-center space-x-3 text-[10px] font-mono">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-slate-400">Revenue</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700" />
                  <span className="text-slate-400">Expenses</span>
                </div>
              </div>
            </div>

            {/* Pure SVG Line Chart */}
            <div className="w-full h-32 bg-slate-50/50 dark:bg-slate-950/10 rounded-xl relative overflow-hidden flex items-end">
              <svg className="w-full h-full p-2" viewBox="0 0 500 100" preserveAspectRatio="none">
                {/* Grid lines */}
                <line x1="0" y1="25" x2="500" y2="25" stroke="currentColor" className="text-slate-100 dark:text-slate-800/30" strokeWidth="0.5" />
                <line x1="0" y1="50" x2="500" y2="50" stroke="currentColor" className="text-slate-100 dark:text-slate-800/30" strokeWidth="0.5" />
                <line x1="0" y1="75" x2="500" y2="75" stroke="currentColor" className="text-slate-100 dark:text-slate-800/30" strokeWidth="0.5" />

                {/* Expenses line & fill */}
                <path d="M0 80 Q 80 75 160 85 T 320 70 T 500 78 L 500 100 L 0 100 Z" fill="url(#exp-gradient)" opacity="0.1" />
                <path d="M0 80 Q 80 75 160 85 T 320 70 T 500 78" fill="none" stroke="currentColor" className="text-slate-300 dark:text-slate-700" strokeWidth="2" />

                {/* Revenue line & fill */}
                <path d="M0 65 Q 80 40 160 55 T 320 30 T 500 20 L 500 100 L 0 100 Z" fill="url(#rev-gradient)" opacity="0.15" />
                <path d="M0 65 Q 80 40 160 55 T 320 30 T 500 20" fill="none" stroke="currentColor" className="text-blue-500" strokeWidth="2.5" />

                <defs>
                  <linearGradient id="rev-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="exp-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#94a3b8" />
                    <stop offset="100%" stopColor="#94a3b8" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          <div className="flex items-center justify-between text-[8px] font-mono font-semibold text-slate-400 mt-2 px-1 uppercase">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Current (Jul)</span>
          </div>
        </div>

        {/* Card 8: Shortcuts - 1x1 */}
        <div className="col-span-1 bg-blue-50/50 dark:bg-blue-950/10 p-6 rounded-2xl border border-blue-100 dark:border-blue-950/30 text-blue-800 dark:text-blue-300 flex flex-col justify-between min-h-[200px]">
          <span className="text-[10px] font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase font-mono">Keyboard Shortcut</span>
          
          <div className="my-auto py-2">
            <p className="text-xs font-bold text-blue-800 dark:text-blue-300 leading-snug">
              Standard operating procedures tip:
            </p>
            <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-1 leading-relaxed">
              Press <span className="bg-white dark:bg-slate-900/80 px-1.5 py-0.5 border border-blue-200 dark:border-blue-800 rounded font-mono font-bold text-xs">G</span> then <span className="bg-white dark:bg-slate-900/80 px-1.5 py-0.5 border border-blue-200 dark:border-blue-800 rounded font-mono font-bold text-xs">O</span> to quickly jump to active Fiverr deliveries.
            </p>
          </div>

          <span 
            onClick={() => onNavigate('wiki')}
            className="text-[10px] text-blue-700 dark:text-blue-400 font-bold hover:underline cursor-pointer flex items-center"
          >
            Access SOPs <ArrowRight className="w-3 h-3 ml-1" />
          </span>
        </div>

        {/* Card 9: Today's Daily Standups Feed - 2x1 */}
        <div className="col-span-1 md:col-span-2 bg-white dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between min-h-[200px]">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase font-mono">Today's Standups</span>
              <span 
                onClick={() => onNavigate('standups')}
                className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
              >
                View all
              </span>
            </div>

            <div className="space-y-3">
              {standups.slice(0, 2).map((st) => {
                const emp = employees.find((e) => e.id === st.employeeId);
                return (
                  <div key={st.id} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/20 dark:bg-slate-950/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <img src={emp?.avatar} alt={emp?.name} className="w-6 h-6 rounded-full object-cover border border-slate-200/60" />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{emp?.name}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 font-mono font-semibold">
                          {emp?.department}
                        </span>
                      </div>
                      <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded-full ${st.status === 'Approved' ? 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400'}`}>
                        {st.status}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-normal line-clamp-1">
                      <span className="font-semibold text-slate-400">Completed:</span> {st.completedToday}
                    </p>
                  </div>
                );
              })}

              {standups.length === 0 && (
                <div className="text-center py-6 text-slate-400 text-xs italic">
                  No standup reports logged today yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card 10: Quick Actions - 1x1 */}
        <div className="col-span-1 bg-white dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between min-h-[200px]">
          <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase font-mono">Quick Actions</span>

          <div className="space-y-1.5">
            <button
              onClick={() => onNavigate('fiverr')}
              className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/10 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition group text-left cursor-pointer"
            >
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">New Fiverr Gig</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition shrink-0" />
            </button>

            <button
              onClick={() => onNavigate('standups')}
              className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/10 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition group text-left cursor-pointer"
            >
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Log Daily Standup</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition shrink-0" />
            </button>

            <button
              onClick={() => onNavigate('wiki')}
              className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/10 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition group text-left cursor-pointer"
            >
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Access Wiki SOPs</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition shrink-0" />
            </button>
          </div>

          <span className="text-[9px] text-slate-400 font-mono text-center">
            OfficeFlow v1.2
          </span>
        </div>

      </div>
    </div>
  );
};
