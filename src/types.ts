/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole =
  | 'Super Admin'
  | 'Company Owner'
  | 'Admin'
  | 'HR'
  | 'Project Manager'
  | 'Team Lead'
  | 'Finance'
  | 'Employee'
  | 'Intern';

export interface CompanyTenant {
  id: string;
  name: string;
  focus: string;
  domain: string;
  logoColor: string; // Tailwind bg color class
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: 'Engineering' | 'Design' | 'Marketing' | 'Management' | 'Finance' | 'Customer Support';
  avatar: string;
  salary: number;
  skills: string[];
  performance: number; // 1 to 5 stars
  startDate: string;
  status: 'Active' | 'On Leave' | 'Suspended';
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string; // YYYY-MM-DD
  checkIn: string; // HH:MM:SS
  checkOut?: string; // HH:MM:SS
  breakMinutes: number;
  ipAddress: string;
  location: string;
  status: 'On Time' | 'Late' | 'Absent' | 'On Leave';
  corrections?: {
    requestedTime: string;
    reason: string;
    status: 'Pending' | 'Approved' | 'Declined';
  };
}

export interface Client {
  id: string;
  name: string;
  email: string;
  companyName: string;
  avatar: string;
  projectCount: number;
  rating: number;
}

export interface FiverrOrder {
  id: string;
  orderNumber: string; // e.g., #FO6A7E89
  buyerName: string;
  package: 'Basic' | 'Standard' | 'Premium';
  gigTitle: string;
  price: number; // USD
  earnings: number; // 80% of price
  deliveryDate: string; // ISO String / YYYY-MM-DD HH:MM
  status: 'Requirements' | 'In Progress' | 'Delivered' | 'Revision' | 'Completed' | 'Late';
  revisionsRemaining: number;
  revisionCount: number;
  requirements: string;
  attachments: { name: string; url: string }[];
  extensionsCount: number;
}

export interface Project {
  id: string;
  name: string;
  clientId?: string;
  fiverrOrderId?: string;
  health: 'Healthy' | 'At Risk' | 'Critical';
  status: 'Planning' | 'In Progress' | 'On Hold' | 'Completed';
  budget: number;
  deliverables: string[];
  milestones: {
    id: string;
    name: string;
    dueDate: string;
    completed: boolean;
  }[];
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'To Do' | 'In Progress' | 'Review' | 'Completed';
  assigneeId: string;
  dueDate: string;
  subtasks: { id: string; title: string; completed: boolean }[];
  comments: { id: string; author: string; avatar: string; text: string; timestamp: string }[];
  attachments: string[];
}

export interface DailyStandup {
  id: string;
  employeeId: string;
  date: string;
  completedToday: string;
  tomorrowPlan: string;
  blockers: string;
  approvedBy: string | null;
  status: 'Pending' | 'Approved' | 'Changes Requested';
}

export interface TimesheetEntry {
  id: string;
  employeeId: string;
  projectId: string;
  taskId: string;
  date: string;
  durationMinutes: number;
  description: string;
  source: 'Timer' | 'Manual';
}

export interface Invoice {
  id: string;
  clientId?: string;
  fiverrOrderId?: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: 'Paid' | 'Unpaid' | 'Overdue';
  category: 'Development' | 'Design' | 'Marketing' | 'Consulting' | 'Fiverr';
}

export interface Asset {
  id: string;
  name: string;
  category: 'Laptop' | 'Monitor' | 'Peripherals' | 'License';
  serialNumber: string;
  value: number;
  assignedToId?: string;
  assignedDate?: string;
  status: 'In Use' | 'In Stock' | 'Maintenance';
}

export interface ChatChannel {
  id: string;
  name: string;
  description: string;
  isDirect: boolean;
  memberIds: string[];
  lastMessageTime: string;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  readBy: string[];
}

export interface WikiDoc {
  id: string;
  title: string;
  category: string;
  content: string; // Markdown supported
  lastUpdated: string;
  author: string;
}
