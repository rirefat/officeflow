/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Laptop, Cpu, Shield, Search, Plus, CheckCircle2, AlertTriangle, User } from 'lucide-react';
import { motion } from 'motion/react';

export const AssetsInventory: React.FC = () => {
  const { assets, employees, addAsset, currentRole } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [value, setValue] = useState(1200);
  const [assignedToId, setAssignedToId] = useState('');

  const filtered = assets.filter((as) => {
    return as.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      as.serialNumber.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleAddAssetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !serialNumber) return;

    addAsset({
      name,
      serialNumber,
      value: Number(value),
      assignedToId: assignedToId || undefined,
    });

    setName('');
    setSerialNumber('');
    setValue(1200);
    setAssignedToId('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Search Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search assets name or serial keys..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-950/20 text-xs outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 transition"
          />
        </div>

        {['Company Owner', 'Admin', 'HR'].includes(currentRole) && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/15 transition cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Allocate Asset
          </button>
        )}
      </div>

      {/* Add Asset Form Panel */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm max-w-xl space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <h3 className="text-xs font-bold font-display uppercase text-slate-800 dark:text-slate-200">Record Corporate Asset</h3>
            <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-600">Close</button>
          </div>

          <form onSubmit={handleAddAssetSubmit} className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1 col-span-2">
              <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Hardware / Software name</label>
              <input
                type="text"
                placeholder="MacBook Pro M3 Max"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/20 text-xs outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Serial Code / License Key</label>
              <input
                type="text"
                placeholder="C02GG34ALTRX"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/20 text-xs outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Asset Value ($ USD)</label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/20 text-xs outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="space-y-1 col-span-2">
              <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Assigned Developer Specialist</label>
              <select
                value={assignedToId}
                onChange={(e) => setAssignedToId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/20 text-xs outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
              >
                <option value="">-- Leave Unassigned (Inventory Room) --</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="col-span-2 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition cursor-pointer"
            >
              Allocate Asset to Developer
            </button>
          </form>
        </motion.div>
      )}

      {/* Assets inventory table list */}
      <div className="p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <div>
          <span className="text-xs font-bold text-slate-400 font-display">Corporate Hardware ledger</span>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-display mt-0.5">Asset Inventory Workspace</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((asset) => {
            const assignee = employees.find((e) => e.id === asset.assignedToId);
            return (
              <div
                key={asset.id}
                className="p-4.5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm transition space-y-3.5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600">
                      <Laptop className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-display leading-tight">{asset.name}</h4>
                      <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{asset.serialNumber}</span>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                    ${asset.value}
                  </span>
                </div>

                {/* Allocation row details */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center space-x-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Allocated:</span>
                  </div>

                  {assignee ? (
                    <div className="flex items-center space-x-1.5 font-semibold text-slate-800 dark:text-slate-200">
                      <img src={assignee.avatar} alt={assignee.name} className="w-5 h-5 rounded-full object-cover" />
                      <span>{assignee.name}</span>
                    </div>
                  ) : (
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 rounded">
                      STOCK INVENTORY
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
