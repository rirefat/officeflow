/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  FolderKanban,
  Clock,
  CalendarCheck,
  FileCheck,
  Wallet,
  Laptop,
  BookOpen,
  MessageSquare,
  Building2,
  ChevronDown,
  UserCheck,
  PanelLeftClose,
  PanelLeft,
  Settings2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  setActiveModule,
  isCollapsed,
  setIsCollapsed,
}) => {
  const {
    tenants,
    currentTenantId,
    setCurrentTenantId,
    currentRole,
    setCurrentRole,
    currentUserEmployee,
    resetToDefaultData,
  } = useApp();

  const [showTenantDropdown, setShowTenantDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'employees', name: 'Employees', icon: Users },
    { id: 'fiverr', name: 'Fiverr Orders', icon: ShoppingBag, badge: 'Fiverr' },
    { id: 'projects', name: 'Projects & Tasks', icon: FolderKanban },
    { id: 'attendance', name: 'Attendance', icon: CalendarCheck },
    { id: 'timesheets', name: 'Timesheets', icon: Clock },
    { id: 'standups', name: 'Daily Standups', icon: FileCheck },
    { id: 'finance', name: 'Finance & Invoices', icon: Wallet },
    { id: 'assets', name: 'Assets Inventory', icon: Laptop },
    { id: 'wiki', name: 'SOP & Wiki', icon: BookOpen },
    { id: 'chat', name: 'Agency Chat', icon: MessageSquare },
  ];

  const rolesList: UserRole[] = [
    'Company Owner',
    'Admin',
    'HR',
    'Project Manager',
    'Team Lead',
    'Finance',
    'Employee',
    'Intern',
  ];

  const handleTenantChange = (tenantId: string) => {
    setCurrentTenantId(tenantId);
    setShowTenantDropdown(false);
  };

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    setShowRoleDropdown(false);
  };

  return (
    <motion.aside
      animate={{ width: isCollapsed ? '72px' : '260px' }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="flex flex-col h-screen border-r border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md select-none shrink-0"
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-[64px] px-4 border-b border-slate-100 dark:border-slate-800">
        <AnimatePresence mode="popLayout">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-display font-semibold text-lg shadow-md shadow-blue-500/20 shrink-0">
                <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
              </div>
              <span className="font-display font-bold text-lg tracking-tight bg-gradient-to-r from-slate-900 to-blue-950 dark:from-white dark:to-blue-200 bg-clip-text text-transparent">
                OfficeFlow
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {isCollapsed && (
          <div className="w-8 h-8 mx-auto rounded-lg bg-blue-600 flex items-center justify-center text-white font-display font-semibold text-lg shadow-md">
            <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hidden md:block"
        >
          {isCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>

      {/* Tenant Switcher */}
      <div className="p-3 border-b border-slate-100 dark:border-slate-800 relative">
        <button
          onClick={() => setShowTenantDropdown(!showTenantDropdown)}
          className="w-full flex items-center justify-between p-2 rounded-xl border border-slate-200/60 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700 transition"
        >
          <div className="flex items-center space-x-2 truncate">
            <div className={`w-3.5 h-3.5 rounded-full ${tenants.find(t => t.id === currentTenantId)?.logoColor || 'bg-blue-600'}`} />
            {!isCollapsed && (
              <span className="text-sm font-semibold truncate text-slate-800 dark:text-slate-200 font-display">
                {tenants.find(t => t.id === currentTenantId)?.name || 'Select Tenant'}
              </span>
            )}
          </div>
          {!isCollapsed && <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {/* Tenant Dropdown */}
        <AnimatePresence>
          {showTenantDropdown && !isCollapsed && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute left-3 right-3 top-14 mt-1 z-20 overflow-hidden rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl"
            >
              {tenants.map((tenant) => (
                <button
                   key={tenant.id}
                   onClick={() => handleTenantChange(tenant.id)}
                   className={`w-full flex flex-col items-start p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/80 transition ${
                     tenant.id === currentTenantId ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                   }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${tenant.logoColor}`} />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-display">{tenant.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 truncate w-full">{tenant.focus}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Interactive Persona Selector (Switch user roles instantly) */}
      <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 relative">
        <button
          onClick={() => setShowRoleDropdown(!showRoleDropdown)}
          className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/70 border border-transparent transition"
        >
          <div className="flex items-center space-x-2.5 truncate">
            {currentUserEmployee ? (
              <img
                src={currentUserEmployee.avatar}
                alt={currentUserEmployee.name}
                className="w-5 h-5 rounded-full object-cover shadow-sm"
              />
            ) : (
              <UserCheck className="w-4 h-4 text-slate-400" />
            )}
            {!isCollapsed && (
              <div className="text-left truncate">
                <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase font-medium">SIMULATED USER</p>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 font-display">{currentRole}</p>
              </div>
            )}
          </div>
          {!isCollapsed && <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
        </button>

        {/* Roles Dropdown */}
        <AnimatePresence>
          {showRoleDropdown && !isCollapsed && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute left-3 right-3 top-14 mt-1 z-20 max-h-60 overflow-y-auto rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl"
            >
              <div className="p-2 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block px-2">SWITCH USER PERSONA</span>
              </div>
              {rolesList.map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleChange(role)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition ${
                    role === currentRole ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 font-semibold' : ''
                  }`}
                >
                  <span>{role}</span>
                  {role === currentRole && <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-sm font-medium transition group relative ${
                isActive
                  ? 'bg-neutral-100 dark:bg-neutral-800 text-blue-600 dark:text-blue-400 font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <div className="flex items-center space-x-3 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 transition ${
                    isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'
                  }`}
                />
                {!isCollapsed && <span className="font-display truncate">{item.name}</span>}
              </div>

              {!isCollapsed && item.badge && (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold tracking-wider font-mono">
                  {item.badge}
                </span>
              )}

              {/* Tooltip on collapse */}
              {isCollapsed && (
                <div className="absolute left-16 hidden group-hover:block z-30 px-2 py-1 rounded bg-slate-900 text-white text-xs whitespace-nowrap shadow-md">
                  {item.name}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer / Reset Settings */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={resetToDefaultData}
          className="w-full flex items-center justify-center p-2 rounded-xl text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-display transition"
        >
          <Settings2 className="w-3.5 h-3.5 mr-2 shrink-0" />
          {!isCollapsed && <span>Reset Cache & Data</span>}
        </button>
      </div>
    </motion.aside>
  );
};
