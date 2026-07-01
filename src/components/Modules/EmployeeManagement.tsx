/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Employee } from '../../types';
import {
  Search,
  Plus,
  Mail,
  Calendar,
  DollarSign,
  TrendingUp,
  UserCheck,
  Building,
  GraduationCap,
  Sparkles,
  X,
  FileText,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const EmployeeManagement: React.FC = () => {
  const { employees, assets, currentRole } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Filter lists
  const filtered = employees.filter((emp) => {
    const matchQuery = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDept = selectedDept === 'All' || emp.department === selectedDept;
    return matchQuery && matchDept;
  });

  const departments = ['All', 'Engineering', 'Design', 'Marketing', 'Management', 'Finance'];

  // Resolve assigned hardware
  const getEmployeeAssets = (empId: string) => {
    return assets.filter((a) => a.assignedToId === empId);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search employee names, roles, or contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-950/20 text-xs outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 transition"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedDept === dept
                  ? 'bg-indigo-600 text-white'
                  : 'border border-slate-200/60 dark:border-slate-800/60 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Employees Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((emp) => (
          <motion.div
            key={emp.id}
            layoutId={`emp-card-${emp.id}`}
            onClick={() => setSelectedEmployee(emp)}
            className="p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 hover:border-indigo-500/50 dark:hover:border-indigo-500/40 shadow-sm hover:shadow-md cursor-pointer transition flex flex-col justify-between group"
          >
            <div className="space-y-4">
              {/* Profile Card Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3.5">
                  <div className="relative">
                    <img src={emp.avatar} alt={emp.name} className="w-12 h-12 rounded-2xl object-cover shadow-sm border border-slate-100 dark:border-slate-800" />
                    <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${emp.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                  </div>
                  <div>
                    <h3 className="font-bold font-display text-slate-800 dark:text-slate-100 tracking-tight group-hover:text-indigo-600 transition leading-snug">
                      {emp.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{emp.role}</p>
                  </div>
                </div>

                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-850 text-slate-400 font-bold font-mono">
                  {emp.department}
                </span>
              </div>

              {/* Skills Area */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {emp.skills.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className="text-[10px] px-2 py-0.5 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/30 text-indigo-600 dark:text-indigo-400 font-semibold font-mono"
                  >
                    {skill}
                  </span>
                ))}
                {emp.skills.length > 3 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 font-mono font-bold">
                    +{emp.skills.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Performance Metric summary */}
            <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center space-x-1 font-mono">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate max-w-[140px]">{emp.email}</span>
              </div>
              <div className="flex items-center space-x-1 font-bold text-slate-700 dark:text-slate-300">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
                <span>★ {emp.performance.toFixed(1)}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Individual Employee Profile Overlay Drawer */}
      <AnimatePresence>
        {selectedEmployee && (
          <>
            <div className="fixed inset-0 bg-slate-900/45 backdrop-blur-sm z-50" onClick={() => setSelectedEmployee(null)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-50 p-6 overflow-y-auto space-y-6"
            >
              {/* Overlay Close */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 font-mono uppercase">Profile Detail</span>
                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Profile Details Header */}
              <div className="flex flex-col items-center text-center space-y-3 pb-6 border-b border-slate-100 dark:border-slate-800">
                <img
                  src={selectedEmployee.avatar}
                  alt={selectedEmployee.name}
                  className="w-24 h-24 rounded-3xl object-cover shadow-md border-2 border-indigo-500/10"
                />
                <div>
                  <h2 className="text-xl font-bold font-display text-slate-800 dark:text-slate-100">{selectedEmployee.name}</h2>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedEmployee.role}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${selectedEmployee.status === 'Active' ? 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                    {selectedEmployee.status}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold font-mono">
                    {selectedEmployee.department}
                  </span>
                </div>
              </div>

              {/* Key operational credentials */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/20 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-medium flex items-center">
                    <Calendar className="w-3 h-3 mr-1" /> Start Date
                  </span>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200 font-display">
                    {selectedEmployee.startDate}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/20 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-medium flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" /> Rating
                  </span>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200 font-display">
                    ★ {selectedEmployee.performance.toFixed(1)} / 5.0
                  </p>
                </div>
              </div>

              {/* Salary block (Visible only to company managers/owner) */}
              {['Company Owner', 'HR', 'Admin', 'Finance'].includes(currentRole) && (
                <div className="p-4 rounded-xl border border-indigo-100 dark:border-indigo-950/20 bg-indigo-50/20 dark:bg-indigo-950/10 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600">
                      <DollarSign className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-mono font-bold text-indigo-400">Monthly Compensation</p>
                      <p className="text-sm font-bold text-indigo-900 dark:text-indigo-300 font-display">${selectedEmployee.salary.toLocaleString()}</p>
                    </div>
                  </div>
                  <button className="text-[10px] px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold transition">
                    View Payslips
                  </button>
                </div>
              )}

              {/* Specialist Skill Chips */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase font-display tracking-wider flex items-center">
                  <GraduationCap className="w-4 h-4 mr-1.5 text-indigo-500" /> Professional Skills
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {selectedEmployee.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-3 py-1 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300 font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Assigned Hardware Assets */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase font-display tracking-wider flex items-center">
                  <Building className="w-4 h-4 mr-1.5 text-indigo-500" /> Assigned Hardware & Assets
                </h3>
                <div className="space-y-2">
                  {getEmployeeAssets(selectedEmployee.id).map((asset) => (
                    <div key={asset.id} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{asset.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{asset.serialNumber}</p>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold font-mono">
                        ${asset.value}
                      </span>
                    </div>
                  ))}
                  {getEmployeeAssets(selectedEmployee.id).length === 0 && (
                    <p className="text-xs text-slate-400 italic">No hardware resources allocated to this employee.</p>
                  )}
                </div>
              </div>

              {/* Documents tab */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-bold text-slate-400 uppercase font-display tracking-wider flex items-center">
                  <FileText className="w-4 h-4 mr-1.5 text-indigo-500" /> Document Folder
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer text-left">
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300 truncate">NDA_Signed.pdf</p>
                    <span className="text-[9px] text-slate-400 font-mono">Completed</span>
                  </div>
                  <div className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer text-left">
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300 truncate">Employment_Agreement.pdf</p>
                    <span className="text-[9px] text-slate-400 font-mono">Verified</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
