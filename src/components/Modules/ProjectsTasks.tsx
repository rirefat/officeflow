/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Project, Task } from '../../types';
import {
  FolderKanban,
  Plus,
  Clock,
  Sparkles,
  ChevronDown,
  X,
  PlusSquare,
  CheckCircle2,
  Calendar,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ProjectsTasks: React.FC = () => {
  const {
    projects,
    tasks,
    employees,
    addTask,
    updateTaskStatus,
    updateTaskChecklist,
    currentRole,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'kanban' | 'milestones'>('kanban');
  const [selectedProject, setSelectedProject] = useState<Project>(projects[0]);

  // Task detail drawer state
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Add Task state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [newTaskAssignee, setNewTaskAssignee] = useState(employees[0]?.id || '');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  // AI checklist state
  const [aiLoading, setAiLoading] = useState(false);

  // Filter tasks belonging to the current selected project
  const projectTasks = tasks.filter((t) => t.projectId === selectedProject.id);

  const kanbanColumns = [
    { id: 'Todo', title: 'To Do', color: 'bg-slate-400' },
    { id: 'In Progress', title: 'In Progress', color: 'bg-indigo-500 animate-pulse' },
    { id: 'In Review', title: 'In Review', color: 'bg-amber-500' },
    { id: 'Completed', title: 'Completed', color: 'bg-emerald-500' },
  ];

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;

    addTask({
      projectId: selectedProject.id,
      title: newTaskTitle,
      description: newTaskDesc,
      status: 'Todo',
      priority: newTaskPriority,
      assigneeId: newTaskAssignee,
      dueDate: newTaskDueDate || new Date().toISOString().split('T')[0],
      subtasks: [],
      comments: [],
    });

    // Reset Form
    setNewTaskTitle('');
    setNewTaskDesc('');
    setShowAddModal(false);
  };

  // Drag-and-drop or simple click-status-change
  const handleMoveStatus = (taskId: string, currentStatus: string) => {
    const statuses = ['Todo', 'In Progress', 'In Review', 'Completed'];
    const nextIdx = (statuses.indexOf(currentStatus) + 1) % statuses.length;
    updateTaskStatus(taskId, statuses[nextIdx] as any);
  };

  // Toggle checklist task completion ratio
  const handleToggleChecklist = (taskId: string, index: number) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    const nextCheck = [...task.subtasks];
    nextCheck[index] = { ...nextCheck[index], completed: !nextCheck[index].completed };
    updateTaskChecklist(taskId, nextCheck);
  };

  // Fetch real subtasks checklists via server-side Gemini suggest-subtasks route!
  const getAiSubtasks = async (task: Task) => {
    setAiLoading(true);
    try {
      const response = await fetch('/api/gemini/suggest-subtasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskTitle: task.title,
          taskDesc: task.description,
          projectName: selectedProject.name,
        }),
      });
      const data = await response.json();
      if (data.subtasks) {
        const mapped = data.subtasks.map((st: string, i: number) => ({ id: `st-ai-${Date.now()}-${i}`, title: st, completed: false }));
        updateTaskChecklist(task.id, [...task.subtasks, ...mapped]);
        // Update selection reference to rerender modal checklist
        const refreshedTask = { ...task, subtasks: [...task.subtasks, ...mapped] };
        setSelectedTask(refreshedTask);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Project Selector Tab bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-400 font-mono uppercase">PROJECT SPACE</span>
          <div className="relative">
            <select
              value={selectedProject.id}
              onChange={(e) => setSelectedProject(projects.find((p) => p.id === e.target.value)!)}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-sm font-semibold outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 transition cursor-pointer"
            >
              {projects.map((proj) => (
                <option key={proj.id} value={proj.id}>
                  {proj.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status headers */}
        <div className="flex items-center space-x-3 text-xs">
          <button
            onClick={() => setActiveTab('kanban')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer ${
              activeTab === 'kanban'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'border border-slate-200/60 dark:border-slate-800/60 text-slate-500 dark:text-slate-400 hover:bg-slate-50'
            }`}
          >
            Kanban Boards
          </button>
          <button
            onClick={() => setActiveTab('milestones')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer ${
              activeTab === 'milestones'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'border border-slate-200/60 dark:border-slate-800/60 text-slate-500 dark:text-slate-400 hover:bg-slate-50'
            }`}
          >
            Milestones & KPIs
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Task
          </button>
        </div>
      </div>

      {activeTab === 'kanban' ? (
        /* Kanban Layout Board */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {kanbanColumns.map((col) => {
            const colTasks = projectTasks.filter((t) => t.status === col.id);
            return (
              <div
                key={col.id}
                className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 bg-slate-50/40 dark:bg-slate-900/10 space-y-3"
              >
                {/* Column header */}
                <div className="flex items-center justify-between pb-1.5">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${col.color}`} />
                    <span className="text-xs font-bold font-display text-slate-700 dark:text-slate-300">
                      {col.title}
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 font-mono font-bold">
                    {colTasks.length}
                  </span>
                </div>

                {/* Column tasks cards list */}
                <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
                  {colTasks.map((task) => {
                    const assignee = employees.find((e) => e.id === task.assigneeId);
                    const completedChecklistCount = task.checklist.filter((c) => c.completed).length;
                    const totalChecklistCount = task.checklist.length;
                    return (
                      <div
                        key={task.id}
                        onClick={() => setSelectedTask(task)}
                        className="p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 hover:border-indigo-500/50 dark:hover:border-indigo-500/40 shadow-sm hover:shadow transition cursor-pointer space-y-3 group"
                      >
                        <div className="flex items-start justify-between">
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            task.priority === 'High'
                              ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-600'
                              : task.priority === 'Medium'
                              ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                          }`}>
                            {task.priority}
                          </span>

                          {/* Quick movement */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveStatus(task.id, task.status);
                            }}
                            className="text-[9px] px-2 py-0.5 rounded border border-slate-100 dark:border-slate-800 bg-slate-50 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 hover:text-indigo-600 transition font-bold font-mono text-slate-400 uppercase"
                          >
                            Move
                          </button>
                        </div>

                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 font-display leading-snug line-clamp-2">
                          {task.title}
                        </h4>

                        {/* Checklist progress bar */}
                        {totalChecklistCount > 0 && (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                              <span>Checklist</span>
                              <span>{completedChecklistCount}/{totalChecklistCount}</span>
                            </div>
                            <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-indigo-500"
                                style={{ width: `${(completedChecklistCount / totalChecklistCount) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Footer details */}
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
                          <div className="flex items-center space-x-1.5 text-[10px] font-mono text-slate-400">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{task.dueDate}</span>
                          </div>

                          <img
                            src={assignee?.avatar}
                            alt={assignee?.name}
                            className="w-5.5 h-5.5 rounded-full object-cover shadow-sm border border-slate-100 dark:border-slate-800"
                          />
                        </div>
                      </div>
                    );
                  })}

                  {colTasks.length === 0 && (
                    <div className="text-center py-8 text-slate-400 text-xs italic">
                      Empty column
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Milestones & KPIs Layout */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <h3 className="text-sm font-bold font-display text-slate-800 dark:text-slate-100">Project Milestones</h3>
            <div className="space-y-4">
              {selectedProject.milestones?.map((ms, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-3.5 h-3.5 rounded-full border-2 ${ms.status === 'Completed' ? 'bg-emerald-500 border-emerald-500' : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700'}`} />
                    {index < selectedProject.milestones.length - 1 && (
                      <div className="w-0.5 h-12 bg-slate-100 dark:bg-slate-800 mt-1" />
                    )}
                  </div>
                  <div className="leading-snug space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200">{ms.title}</h4>
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${ms.status === 'Completed' ? 'bg-emerald-100 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                        {ms.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono">Target Date: {ms.dueDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <h3 className="text-sm font-bold font-display text-slate-800 dark:text-slate-100">Health Diagnostics</h3>
            <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/20 space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">PROJECT HEALTH STATUS</span>
                <p className={`text-base font-bold font-display ${selectedProject.health === 'Healthy' ? 'text-emerald-600' : 'text-amber-500'}`}>
                  {selectedProject.health}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Milestones Completed Ratio</span>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  {selectedProject.milestones?.filter(m => m.status === 'Completed').length} / {selectedProject.milestones?.length} completed
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY DRAWER: Task Details & Checklist Helper */}
      <AnimatePresence>
        {selectedTask && (
          <>
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50" onClick={() => setSelectedTask(null)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-50 p-6 overflow-y-auto space-y-6"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 font-mono uppercase">Task Workspace</span>
                <button onClick={() => setSelectedTask(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              <div className="space-y-2">
                <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                  {selectedTask.status}
                </span>
                <h2 className="text-lg font-bold font-display text-slate-800 dark:text-slate-100">{selectedTask.title}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">{selectedTask.description || 'No description provided.'}</p>
              </div>

              {/* Checklist details with Gemini support */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-display">Checklist Specifications</span>

                  {/* Gemini trigger */}
                  <button
                    onClick={() => getAiSubtasks(selectedTask)}
                    disabled={aiLoading}
                    className="flex items-center px-2 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold transition cursor-pointer"
                  >
                    {aiLoading ? (
                      <div className="w-3 h-3 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin mr-1.5" />
                    ) : (
                      <Sparkles className="w-3 h-3 mr-1 text-indigo-500 animate-pulse" />
                    )}
                    Generate with Gemini AI
                  </button>
                </div>

                <div className="space-y-2">
                  {selectedTask.subtasks.map((check, idx) => (
                    <label
                      key={check.id || idx}
                      className="flex items-center space-x-3 p-2 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/20 dark:bg-slate-900/10 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={check.completed}
                        onChange={() => handleToggleChecklist(selectedTask.id, idx)}
                        className="rounded border-slate-200 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className={`text-xs text-slate-700 dark:text-slate-300 leading-none ${check.completed ? 'line-through text-slate-400' : ''}`}>
                        {check.title}
                      </span>
                    </label>
                  ))}

                  {selectedTask.subtasks.length === 0 && (
                    <p className="text-xs text-slate-400 italic text-center py-4">No checklist logged yet. Use Gemini to generate one!</p>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MODAL: Add Task Form */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/45 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold font-display text-slate-800 dark:text-slate-100">Add Project Task</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Task Title</label>
                <input
                  type="text"
                  placeholder="e.g. Design Dashboard Mobile UI screens"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/20 text-xs outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Description</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Follow the brand colors and create high-fidelity components..."
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/20 text-xs outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Assignee</label>
                  <select
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/20 text-xs outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
                  >
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/20 text-xs outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Due Date</label>
                <input
                  type="date"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/20 text-xs outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/15 transition cursor-pointer"
              >
                Create Task
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
