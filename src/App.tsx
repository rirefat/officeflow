/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { GlobalSearch } from './components/GlobalSearch';

// Import Feature Modules
import { Dashboard } from './components/Modules/Dashboard';
import { EmployeeManagement } from './components/Modules/EmployeeManagement';
import { AttendanceTracker } from './components/Modules/AttendanceTracker';
import { FiverrOrders } from './components/Modules/FiverrOrders';
import { ProjectsTasks } from './components/Modules/ProjectsTasks';
import { StandupReports } from './components/Modules/StandupReports';
import { Timesheets } from './components/Modules/Timesheets';
import { FinancePayroll } from './components/Modules/FinancePayroll';
import { AssetsInventory } from './components/Modules/AssetsInventory';
import { KnowledgeBase } from './components/Modules/KnowledgeBase';
import { InternalChat } from './components/Modules/InternalChat';

import { Command } from 'lucide-react';

function MainLayoutContent() {
  const { darkMode } = useApp();
  const [activeModule, setActiveModule] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Command Palette global keyboard listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update root HTML class for Tailwind v4 dark theme triggers
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  // Render correct dashboard or sub-feature based on navigation
  const renderActiveModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveModule} />;
      case 'employees':
        return <EmployeeManagement />;
      case 'attendance':
        return <AttendanceTracker />;
      case 'fiverr':
        return <FiverrOrders />;
      case 'projects':
        return <ProjectsTasks />;
      case 'standups':
        return <StandupReports />;
      case 'timesheets':
        return <Timesheets />;
      case 'finance':
        return <FinancePayroll />;
      case 'assets':
        return <AssetsInventory />;
      case 'wiki':
        return <KnowledgeBase />;
      case 'chat':
        return <InternalChat />;
      default:
        return <Dashboard onNavigate={setActiveModule} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans antialiased transition-colors duration-200">
      {/* Sidebar navigation */}
      <Sidebar
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* Primary visual stack */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Universal Application header bar */}
        <Header activeModule={activeModule} onOpenSearch={() => setIsSearchOpen(true)} />

        {/* Scrollable primary content layout canvas */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {renderActiveModule()}
        </main>
      </div>

      {/* Raycast command panel overlay */}
      <GlobalSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={setActiveModule}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayoutContent />
    </AppProvider>
  );
}
