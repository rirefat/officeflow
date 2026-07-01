/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  CompanyTenant,
  Employee,
  AttendanceRecord,
  Client,
  FiverrOrder,
  Project,
  Task,
  DailyStandup,
  TimesheetEntry,
  Invoice,
  Asset,
  ChatChannel,
  ChatMessage,
  WikiDoc,
} from '../types';
import {
  DEFAULT_TENANTS,
  MOCK_EMPLOYEES,
  MOCK_ATTENDANCE,
  MOCK_CLIENTS,
  MOCK_FIVERR_ORDERS,
  MOCK_PROJECTS,
  MOCK_TASKS,
  MOCK_STANDUPS,
  MOCK_TIMESHEETS,
  MOCK_INVOICES,
  MOCK_ASSETS,
  MOCK_CHANNELS,
  MOCK_MESSAGES,
  MOCK_WIKI,
} from '../mockData';

export type NewFiverrOrderData = Omit<FiverrOrder, 'id'>;
export type NewProjectData = Omit<Project, 'id' | 'health'>;
export type NewTaskData = Omit<Task, 'id' | 'comments' | 'attachments'>;
export type NewWikiDocData = Omit<WikiDoc, 'id' | 'lastUpdated' | 'author'>;

interface AppContextType {
  // Multitenancy & Persona Configuration
  tenants: CompanyTenant[];
  currentTenantId: string;
  currentTenant: CompanyTenant;
  setCurrentTenantId: (id: string) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUserEmployee: Employee | null;

  // Theme
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;

  // Modular States
  employees: Employee[];
  attendance: AttendanceRecord[];
  clients: Client[];
  fiverrOrders: FiverrOrder[];
  projects: Project[];
  tasks: Task[];
  standups: DailyStandup[];
  timesheets: TimesheetEntry[];
  invoices: Invoice[];
  assets: Asset[];
  channels: ChatChannel[];
  messages: ChatMessage[];
  wikiDocs: WikiDoc[];

  // Interactive Operations
  checkIn: () => void;
  checkOut: () => void;
  requestCorrection: (reason: string, requestedTime: string) => void;
  addFiverrOrder: (order: NewFiverrOrderData) => FiverrOrder;
  updateFiverrOrderStatus: (orderId: string, status: FiverrOrder['status']) => void;
  addProject: (project: NewProjectData) => Project;
  updateProjectHealth: (projectId: string, health: Project['health']) => void;
  addTask: (task: NewTaskData) => Task;
  updateTaskStatus: (taskId: string, status: Task['status']) => void;
  updateTaskChecklist: (taskId: string, subtasks: { id: string; title: string; completed: boolean }[]) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  addSubtask: (taskId: string, title: string) => void;
  addTaskComment: (taskId: string, text: string) => void;
  submitStandup: (completedToday: string, tomorrowPlan: string, blockers: string) => void;
  approveStandup: (standupId: string) => void;
  
  // Timer State
  activeTimerTaskId: string | null;
  timerSeconds: number;
  startTaskTimer: (taskId: string) => void;
  stopTaskTimer: (description: string) => void;

  // Chat
  sendChannelMessage: (channelId: string, text: string) => void;
  addWikiDoc: (doc: NewWikiDocData) => void;

  // Core Persistence Refresh Helper
  resetToDefaultData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Multi-tenant selection (independent databases simulated via isolated storage keys)
  const [currentTenantId, setCurrentTenantId] = useState<string>(() => {
    return localStorage.getItem('of_tenant_id') || 'tenant-pixelcraft';
  });

  // User role selector (to let the evaluator interact as different job profiles)
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return (localStorage.getItem('of_current_role') as UserRole) || 'Company Owner';
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('of_dark_mode') === 'true';
  });

  // Core entities mapping state
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [fiverrOrders, setFiverrOrders] = useState<FiverrOrder[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [standups, setStandups] = useState<DailyStandup[]>([]);
  const [timesheets, setTimesheets] = useState<TimesheetEntry[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [channels, setChannels] = useState<ChatChannel[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [wikiDocs, setWikiDocs] = useState<WikiDoc[]>([]);

  // Time logging timer states
  const [activeTimerTaskId, setActiveTimerTaskId] = useState<string | null>(null);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);

  const tenants = DEFAULT_TENANTS;
  const currentTenant = tenants.find((t) => t.id === currentTenantId) || tenants[0];

  // Resolve virtual active user from roles & tenant
  const currentUserEmployee = employees.find((e) => e.role === currentRole) || employees[0] || null;

  // Toggle Theme Class on Document Element
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('of_dark_mode', 'true');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('of_dark_mode', 'false');
    }
  }, [darkMode]);

  // Persist configurations
  useEffect(() => {
    localStorage.setItem('of_tenant_id', currentTenantId);
  }, [currentTenantId]);

  useEffect(() => {
    localStorage.setItem('of_current_role', currentRole);
  }, [currentRole]);

  // Load state on active tenant changes
  useEffect(() => {
    const loadTenantData = () => {
      function getOrInit<T>(key: string, fallback: T): T {
        const stored = localStorage.getItem(`of_${currentTenantId}_${key}`);
        if (stored) {
          try {
            return JSON.parse(stored);
          } catch (e) {
            console.error('Error parsing storage for', key, e);
          }
        }
        return fallback;
      }

      setEmployees(getOrInit('employees', MOCK_EMPLOYEES[currentTenantId] || []));
      setAttendance(getOrInit('attendance', MOCK_ATTENDANCE[currentTenantId] || []));
      setClients(getOrInit('clients', MOCK_CLIENTS[currentTenantId] || []));
      setFiverrOrders(getOrInit('fiverrOrders', MOCK_FIVERR_ORDERS[currentTenantId] || []));
      setProjects(getOrInit('projects', MOCK_PROJECTS[currentTenantId] || []));
      setTasks(getOrInit('tasks', MOCK_TASKS[currentTenantId] || []));
      setStandups(getOrInit('standups', MOCK_STANDUPS[currentTenantId] || []));
      setTimesheets(getOrInit('timesheets', MOCK_TIMESHEETS[currentTenantId] || []));
      setInvoices(getOrInit('invoices', MOCK_INVOICES[currentTenantId] || []));
      setAssets(getOrInit('assets', MOCK_ASSETS[currentTenantId] || []));
      setChannels(getOrInit('channels', MOCK_CHANNELS[currentTenantId] || []));
      setMessages(getOrInit('messages', MOCK_MESSAGES[currentTenantId] || []));
      setWikiDocs(getOrInit('wikiDocs', MOCK_WIKI[currentTenantId] || []));

      // Reset timer when switching tenant to prevent bleed
      setActiveTimerTaskId(null);
      setTimerSeconds(0);
    };

    loadTenantData();
  }, [currentTenantId]);

  // Save states to localstorage helper
  const persist = (key: string, value: any) => {
    localStorage.setItem(`of_${currentTenantId}_${key}`, JSON.stringify(value));
  };

  // Keep state variables synchronized to LocalStorage
  useEffect(() => { if (employees.length) persist('employees', employees); }, [employees]);
  useEffect(() => { persist('attendance', attendance); }, [attendance]);
  useEffect(() => { if (clients.length) persist('clients', clients); }, [clients]);
  useEffect(() => { persist('fiverrOrders', fiverrOrders); }, [fiverrOrders]);
  useEffect(() => { persist('projects', projects); }, [projects]);
  useEffect(() => { persist('tasks', tasks); }, [tasks]);
  useEffect(() => { persist('standups', standups); }, [standups]);
  useEffect(() => { persist('timesheets', timesheets); }, [timesheets]);
  useEffect(() => { persist('invoices', invoices); }, [invoices]);
  useEffect(() => { persist('assets', assets); }, [assets]);
  useEffect(() => { persist('channels', channels); }, [channels]);
  useEffect(() => { persist('messages', messages); }, [messages]);
  useEffect(() => { persist('wikiDocs', wikiDocs); }, [wikiDocs]);

  // Timesheet Ticker Handler
  useEffect(() => {
    let interval: any = null;
    if (activeTimerTaskId) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [activeTimerTaskId]);

  // Core Interactions
  const checkIn = () => {
    if (!currentUserEmployee) return;
    const todayStr = new Date().toISOString().split('T')[0];
    const checkInTime = new Date().toTimeString().split(' ')[0];

    const isAlreadyCheckedIn = attendance.some((r) => r.employeeId === currentUserEmployee.id && r.date === todayStr);
    if (isAlreadyCheckedIn) return;

    // Simulate location / IP
    const simulatedIP = `192.168.10.${Math.floor(Math.random() * 250) + 1}`;
    const cities = ['Dhaka, Bangladesh', 'Chicago, US', 'London, UK', 'Tokyo, Japan', 'Berlin, Germany'];
    const simulatedLoc = cities[Math.floor(Math.random() * cities.length)];

    const nowHour = new Date().getHours();
    const isLate = nowHour >= 9 && new Date().getMinutes() > 15;

    const record: AttendanceRecord = {
      id: `att-dyn-${Date.now()}`,
      employeeId: currentUserEmployee.id,
      date: todayStr,
      checkIn: checkInTime,
      breakMinutes: 0,
      ipAddress: simulatedIP,
      location: simulatedLoc,
      status: isLate ? 'Late' : 'On Time',
    };

    const updated = [record, ...attendance];
    setAttendance(updated);
  };

  const checkOut = () => {
    if (!currentUserEmployee) return;
    const todayStr = new Date().toISOString().split('T')[0];
    const checkOutTime = new Date().toTimeString().split(' ')[0];

    const updated = attendance.map((record) => {
      if (record.employeeId === currentUserEmployee.id && record.date === todayStr) {
        return {
          ...record,
          checkOut: checkOutTime,
        };
      }
      return record;
    });
    setAttendance(updated);
  };

  const requestCorrection = (reason: string, requestedTime: string) => {
    if (!currentUserEmployee) return;
    const todayStr = new Date().toISOString().split('T')[0];

    const record = attendance.find((r) => r.employeeId === currentUserEmployee.id && r.date === todayStr);
    if (!record) return;

    const updated = attendance.map((r) => {
      if (r.id === record.id) {
        return {
          ...r,
          corrections: {
            requestedTime,
            reason,
            status: 'Pending' as const,
          },
        };
      }
      return r;
    });
    setAttendance(updated);
  };

  const addFiverrOrder = (orderData: NewFiverrOrderData) => {
    const price = orderData.price;
    const newOrder: FiverrOrder = {
      ...orderData,
      id: `fov-dyn-${Date.now()}`,
      earnings: Math.floor(price * 0.8), // 20% platform commission
      revisionCount: 0,
      extensionsCount: 0,
    };
    setFiverrOrders([newOrder, ...fiverrOrders]);
    return newOrder;
  };

  const updateFiverrOrderStatus = (orderId: string, status: FiverrOrder['status']) => {
    setFiverrOrders(fiverrOrders.map((o) => (o.id === orderId ? { ...o, status } : o)));
  };

  const addProject = (projectData: NewProjectData) => {
    const newProj: Project = {
      ...projectData,
      id: `proj-dyn-${Date.now()}`,
      health: 'Healthy',
    };
    setProjects([newProj, ...projects]);
    return newProj;
  };

  const updateProjectHealth = (projectId: string, health: Project['health']) => {
    setProjects(projects.map((p) => (p.id === projectId ? { ...p, health } : p)));
  };

  const addTask = (taskData: NewTaskData) => {
    const newTask: Task = {
      ...taskData,
      id: `task-dyn-${Date.now()}`,
      comments: [],
      attachments: [],
    };
    setTasks([newTask, ...tasks]);
    return newTask;
  };

  const updateTaskStatus = (taskId: string, status: Task['status']) => {
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, status } : t)));
  };

  const updateTaskChecklist = (taskId: string, subtasks: { id: string; title: string; completed: boolean }[]) => {
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, subtasks } : t)));
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(
      tasks.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            subtasks: t.subtasks.map((st) => (st.id === subtaskId ? { ...st, completed: !st.completed } : st)),
          };
        }
        return t;
      })
    );
  };

  const addSubtask = (taskId: string, title: string) => {
    setTasks(
      tasks.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            subtasks: [...t.subtasks, { id: `st-dyn-${Date.now()}`, title, completed: false }],
          };
        }
        return t;
      })
    );
  };

  const addTaskComment = (taskId: string, text: string) => {
    if (!currentUserEmployee) return;
    setTasks(
      tasks.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            comments: [
              ...t.comments,
              {
                id: `comm-dyn-${Date.now()}`,
                author: currentUserEmployee.name,
                avatar: currentUserEmployee.avatar,
                text,
                timestamp: new Date().toISOString(),
              },
            ],
          };
        }
        return t;
      })
    );
  };

  const submitStandup = (completedToday: string, tomorrowPlan: string, blockers: string) => {
    if (!currentUserEmployee) return;
    const record: DailyStandup = {
      id: `std-dyn-${Date.now()}`,
      employeeId: currentUserEmployee.id,
      date: new Date().toISOString().split('T')[0],
      completedToday,
      tomorrowPlan,
      blockers: blockers || 'None',
      approvedBy: null,
      status: 'Pending',
    };
    setStandups([record, ...standups]);
  };

  const approveStandup = (standupId: string) => {
    if (!currentUserEmployee) return;
    setStandups(
      standups.map((s) =>
        s.id === standupId
          ? {
              ...s,
              status: 'Approved' as const,
              approvedBy: currentUserEmployee.name,
            }
          : s
      )
    );
  };

  const startTaskTimer = (taskId: string) => {
    setActiveTimerTaskId(taskId);
    setTimerSeconds(0);
  };

  const stopTaskTimer = (description: string) => {
    if (!activeTimerTaskId || !currentUserEmployee) return;

    const activeTask = tasks.find((t) => t.id === activeTimerTaskId);
    if (!activeTask) return;

    const durationMinutes = Math.max(1, Math.round(timerSeconds / 60));

    const entry: TimesheetEntry = {
      id: `ts-dyn-${Date.now()}`,
      employeeId: currentUserEmployee.id,
      projectId: activeTask.projectId,
      taskId: activeTimerTaskId,
      date: new Date().toISOString().split('T')[0],
      durationMinutes,
      description: description || activeTask.title,
      source: 'Timer',
    };

    setTimesheets([entry, ...timesheets]);
    setActiveTimerTaskId(null);
    setTimerSeconds(0);
  };

  const sendChannelMessage = (channelId: string, text: string) => {
    if (!currentUserEmployee) return;
    const msg: ChatMessage = {
      id: `msg-dyn-${Date.now()}`,
      channelId,
      senderId: currentUserEmployee.id,
      senderName: currentUserEmployee.name,
      senderAvatar: currentUserEmployee.avatar,
      text,
      timestamp: new Date().toISOString(),
      readBy: [currentUserEmployee.id],
    };

    setMessages((prev) => [...prev, msg]);

    // Update channel list lastMessageTime for ordering
    setChannels((prevChans) =>
      prevChans.map((c) => (c.id === channelId ? { ...c, lastMessageTime: msg.timestamp } : c))
    );

    // Simulate simple interactive reply from project managers or developers in 1.5 seconds!
    const activeChan = channels.find((c) => c.id === channelId);
    if (activeChan && !activeChan.isDirect) {
      setTimeout(() => {
        const matchingEmployees = employees.filter((e) => e.id !== currentUserEmployee.id);
        if (!matchingEmployees.length) return;
        const replier = matchingEmployees[Math.floor(Math.random() * matchingEmployees.length)];

        const replies = [
          "Noted! Let's follow up on this in our standup tomorrow.",
          "Awesome update, thank you! I will review the wireframes shortly.",
          "Perfect. Let me know if there are any blockers on your end.",
          "Understood! I'm on it.",
          "Thanks for flagging this! Let's double check with Refat.",
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];

        const botMsg: ChatMessage = {
          id: `msg-dyn-${Date.now() + 1}`,
          channelId,
          senderId: replier.id,
          senderName: replier.name,
          senderAvatar: replier.avatar,
          text: randomReply,
          timestamp: new Date().toISOString(),
          readBy: [replier.id],
        };

        setMessages((prev) => [...prev, botMsg]);
        setChannels((prevChans) =>
          prevChans.map((c) => (c.id === channelId ? { ...c, lastMessageTime: botMsg.timestamp } : c))
        );
      }, 1500);
    }
  };

  const addWikiDoc = (docData: NewWikiDocData) => {
    if (!currentUserEmployee) return;
    const newDoc: WikiDoc = {
      ...docData,
      id: `wiki-dyn-${Date.now()}`,
      lastUpdated: new Date().toISOString().split('T')[0],
      author: currentUserEmployee.name,
    };
    setWikiDocs([newDoc, ...wikiDocs]);
  };

  const resetToDefaultData = () => {
    localStorage.removeItem(`of_${currentTenantId}_employees`);
    localStorage.removeItem(`of_${currentTenantId}_attendance`);
    localStorage.removeItem(`of_${currentTenantId}_clients`);
    localStorage.removeItem(`of_${currentTenantId}_fiverrOrders`);
    localStorage.removeItem(`of_${currentTenantId}_projects`);
    localStorage.removeItem(`of_${currentTenantId}_tasks`);
    localStorage.removeItem(`of_${currentTenantId}_standups`);
    localStorage.removeItem(`of_${currentTenantId}_timesheets`);
    localStorage.removeItem(`of_${currentTenantId}_invoices`);
    localStorage.removeItem(`of_${currentTenantId}_assets`);
    localStorage.removeItem(`of_${currentTenantId}_channels`);
    localStorage.removeItem(`of_${currentTenantId}_messages`);
    localStorage.removeItem(`of_${currentTenantId}_wikiDocs`);

    setEmployees(MOCK_EMPLOYEES[currentTenantId] || []);
    setAttendance(MOCK_ATTENDANCE[currentTenantId] || []);
    setClients(MOCK_CLIENTS[currentTenantId] || []);
    setFiverrOrders(MOCK_FIVERR_ORDERS[currentTenantId] || []);
    setProjects(MOCK_PROJECTS[currentTenantId] || []);
    setTasks(MOCK_TASKS[currentTenantId] || []);
    setStandups(MOCK_STANDUPS[currentTenantId] || []);
    setTimesheets(MOCK_TIMESHEETS[currentTenantId] || []);
    setInvoices(MOCK_INVOICES[currentTenantId] || []);
    setAssets(MOCK_ASSETS[currentTenantId] || []);
    setChannels(MOCK_CHANNELS[currentTenantId] || []);
    setMessages(MOCK_MESSAGES[currentTenantId] || []);
    setWikiDocs(MOCK_WIKI[currentTenantId] || []);

    setActiveTimerTaskId(null);
    setTimerSeconds(0);
  };

  return (
    <AppContext.Provider
      value={{
        tenants,
        currentTenantId,
        currentTenant,
        setCurrentTenantId,
        currentRole,
        setCurrentRole,
        currentUserEmployee,

        darkMode,
        setDarkMode,

        employees,
        attendance,
        clients,
        fiverrOrders,
        projects,
        tasks,
        standups,
        timesheets,
        invoices,
        assets,
        channels,
        messages,
        wikiDocs,

        checkIn,
        checkOut,
        requestCorrection,
        addFiverrOrder,
        updateFiverrOrderStatus,
        addProject,
        updateProjectHealth,
        addTask,
        updateTaskStatus,
        updateTaskChecklist,
        toggleSubtask,
        addSubtask,
        addTaskComment,
        submitStandup,
        approveStandup,

        activeTimerTaskId,
        timerSeconds,
        startTaskTimer,
        stopTaskTimer,

        sendChannelMessage,
        addWikiDoc,

        resetToDefaultData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
