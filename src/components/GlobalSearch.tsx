/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Command, X, FolderKanban, User, CheckSquare, ShoppingBag, Moon, Sun, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (module: string) => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose, onNavigate }) => {
  const { projects, employees, tasks, fiverrOrders, darkMode, setDarkMode } = useApp();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  // Filter entities
  const q = query.toLowerCase().trim();

  const filteredProjects = q
    ? projects.filter((p) => p.name.toLowerCase().includes(q))
    : projects.slice(0, 3);

  const filteredEmployees = q
    ? employees.filter((e) => e.name.toLowerCase().includes(q) || e.role.toLowerCase().includes(q))
    : employees.slice(0, 3);

  const filteredTasks = q
    ? tasks.filter((t) => t.title.toLowerCase().includes(q))
    : tasks.slice(0, 3);

  const filteredOrders = q
    ? fiverrOrders.filter((o) => o.orderNumber.toLowerCase().includes(q) || o.buyerName.toLowerCase().includes(q) || o.gigTitle.toLowerCase().includes(q))
    : fiverrOrders.slice(0, 3);

  const systemActions = [
    { id: 'act-dark', title: 'Toggle Dark Mode', icon: darkMode ? Sun : Moon, action: () => setDarkMode(!darkMode) },
    { id: 'act-dash', title: 'Go to Dashboard', icon: Play, action: () => onNavigate('dashboard') },
    { id: 'act-emp', title: 'View Employee Directory', icon: User, action: () => onNavigate('employees') },
    { id: 'act-proj', title: 'View Projects & Kanban Board', icon: FolderKanban, action: () => onNavigate('projects') },
    { id: 'act-fiv', title: 'View Fiverr Orders Workspace', icon: ShoppingBag, action: () => onNavigate('fiverr') },
  ].filter((a) => !q || a.title.toLowerCase().includes(q));

  const handleAction = (cb: () => void) => {
    cb();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] p-4 bg-slate-900/40 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.15 }}
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl"
      >
        {/* Search Input */}
        <div className="flex items-center px-4 py-4 border-b border-slate-100 dark:border-slate-800">
          <Search className="w-5 h-5 mr-3 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type to search projects, tasks, employees, orders, or commands..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-base outline-none bg-transparent border-none placeholder-slate-400 text-slate-800 dark:text-slate-100"
          />
          <div className="flex items-center space-x-1.5 px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-400 font-mono">
            <span>ESC</span>
          </div>
          <button onClick={onClose} className="p-1 ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6">
          {/* Projects */}
          {filteredProjects.length > 0 && (
            <div>
              <h3 className="px-2 mb-2 text-xs font-semibold text-slate-400 tracking-wider uppercase font-display flex items-center">
                <FolderKanban className="w-3.5 h-3.5 mr-1.5 text-indigo-500" /> Projects
              </h3>
              <div className="space-y-0.5">
                {filteredProjects.map((proj) => (
                  <button
                    key={proj.id}
                    onClick={() => handleAction(() => onNavigate('projects'))}
                    className="w-full flex items-center justify-between p-2 rounded-lg text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 group text-slate-700 dark:text-slate-300"
                  >
                    <span>{proj.name}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
                      {proj.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tasks */}
          {filteredTasks.length > 0 && (
            <div>
              <h3 className="px-2 mb-2 text-xs font-semibold text-slate-400 tracking-wider uppercase font-display flex items-center">
                <CheckSquare className="w-3.5 h-3.5 mr-1.5 text-rose-500" /> Tasks
              </h3>
              <div className="space-y-0.5">
                {filteredTasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => handleAction(() => onNavigate('projects'))}
                    className="w-full flex items-center justify-between p-2 rounded-lg text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 group text-slate-700 dark:text-slate-300"
                  >
                    <span className="truncate max-w-[400px]">{task.title}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/30 text-rose-600 font-mono">
                      {task.priority}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Fiverr Orders */}
          {filteredOrders.length > 0 && (
            <div>
              <h3 className="px-2 mb-2 text-xs font-semibold text-slate-400 tracking-wider uppercase font-display flex items-center">
                <ShoppingBag className="w-3.5 h-3.5 mr-1.5 text-emerald-500" /> Fiverr Orders
              </h3>
              <div className="space-y-0.5">
                {filteredOrders.map((ord) => (
                  <button
                    key={ord.id}
                    onClick={() => handleAction(() => onNavigate('fiverr'))}
                    className="w-full flex items-center justify-between p-2 rounded-lg text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 group text-slate-700 dark:text-slate-300"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs text-slate-400">{ord.orderNumber}</span>
                      <span className="truncate max-w-[300px]">{ord.gigTitle}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      @{ord.buyerName}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Employees */}
          {filteredEmployees.length > 0 && (
            <div>
              <h3 className="px-2 mb-2 text-xs font-semibold text-slate-400 tracking-wider uppercase font-display flex items-center">
                <User className="w-3.5 h-3.5 mr-1.5 text-blue-500" /> Employees
              </h3>
              <div className="space-y-0.5">
                {filteredEmployees.map((emp) => (
                  <button
                    key={emp.id}
                    onClick={() => handleAction(() => onNavigate('employees'))}
                    className="w-full flex items-center justify-between p-2 rounded-lg text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 group text-slate-700 dark:text-slate-300"
                  >
                    <div className="flex items-center space-x-3">
                      <img src={emp.avatar} alt={emp.name} className="w-6 h-6 rounded-full object-cover" />
                      <span>{emp.name}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {emp.role}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* System Actions & Commands */}
          {systemActions.length > 0 && (
            <div>
              <h3 className="px-2 mb-2 text-xs font-semibold text-slate-400 tracking-wider uppercase font-display flex items-center">
                <Command className="w-3.5 h-3.5 mr-1.5 text-violet-500" /> Commands
              </h3>
              <div className="space-y-0.5">
                {systemActions.map((act) => {
                  const Icon = act.icon;
                  return (
                    <button
                      key={act.id}
                      onClick={() => handleAction(act.action)}
                      className="w-full flex items-center p-2 rounded-lg text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 group text-slate-700 dark:text-slate-300"
                    >
                      <Icon className="w-4 h-4 mr-3 text-slate-400 group-hover:text-indigo-500" />
                      <span>{act.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredProjects.length === 0 &&
            filteredEmployees.length === 0 &&
            filteredTasks.length === 0 &&
            filteredOrders.length === 0 &&
            systemActions.length === 0 && (
              <div className="text-center py-12">
                <Command className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                <p className="text-slate-400 text-sm">No results matching "{query}"</p>
              </div>
            )}
        </div>
      </motion.div>
    </div>
  );
};
