/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
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
} from './types';

export const DEFAULT_TENANTS: CompanyTenant[] = [
  {
    id: 'tenant-pixelcraft',
    name: 'PixelCraft Studios',
    focus: 'UI/UX Design & High-End WordPress/Webflow Fiverr Agency',
    domain: 'pixelcraft.co',
    logoColor: 'bg-indigo-600',
  },
  {
    id: 'tenant-apex',
    name: 'Apex Code Labs',
    focus: 'SaaS Software Development & Cloud Integrations Agency',
    domain: 'apexcode.io',
    logoColor: 'bg-emerald-600',
  },
];

export const MOCK_EMPLOYEES: Record<string, Employee[]> = {
  'tenant-pixelcraft': [
    {
      id: 'emp-pc-1',
      name: 'Rafiul Refat',
      email: 'owner@pixelcraft.co',
      role: 'Company Owner',
      department: 'Management',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      salary: 8500,
      skills: ['Figma', 'UI/UX Design', 'Client Relations', 'Strategy'],
      performance: 5,
      startDate: '2024-01-10',
      status: 'Active',
    },
    {
      id: 'emp-pc-2',
      name: 'Sarah Jenkins',
      email: 'sarah@pixelcraft.co',
      role: 'Project Manager',
      department: 'Management',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      salary: 5200,
      skills: ['Agile', 'Fiverr Dashboard', 'Asana', 'Content Design'],
      performance: 4.8,
      startDate: '2024-03-15',
      status: 'Active',
    },
    {
      id: 'emp-pc-3',
      name: 'David Kim',
      email: 'david@pixelcraft.co',
      role: 'Team Lead',
      department: 'Design',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      salary: 4500,
      skills: ['Figma', 'Webflow', 'Tailwind CSS', 'Branding'],
      performance: 4.9,
      startDate: '2024-02-01',
      status: 'Active',
    },
    {
      id: 'emp-pc-4',
      name: 'Mia Wong',
      email: 'mia@pixelcraft.co',
      role: 'Employee',
      department: 'Design',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      salary: 3200,
      skills: ['Illustrator', 'Spline 3D', 'After Effects', 'Figma'],
      performance: 4.6,
      startDate: '2025-05-10',
      status: 'Active',
    },
    {
      id: 'emp-pc-5',
      name: 'Alex Mercer',
      email: 'alex@pixelcraft.co',
      role: 'Employee',
      department: 'Engineering',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      salary: 3800,
      skills: ['WordPress', 'HTML/CSS', 'JavaScript', 'AlpineJS'],
      performance: 4.2,
      startDate: '2024-11-01',
      status: 'Active',
    },
    {
      id: 'emp-pc-6',
      name: 'John Doe',
      email: 'john@pixelcraft.co',
      role: 'Employee',
      department: 'Marketing',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      salary: 3000,
      skills: ['SEO', 'Google Ads', 'Fiverr Gigs optimization', 'Social Media'],
      performance: 4.0,
      startDate: '2025-02-18',
      status: 'On Leave',
    },
  ],
  'tenant-apex': [
    {
      id: 'emp-ap-1',
      name: 'Marcus Sterling',
      email: 'marcus@apexcode.io',
      role: 'Company Owner',
      department: 'Management',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
      salary: 9500,
      skills: ['System Architecture', 'Golang', 'SaaS Licensing', 'Enterprise Sales'],
      performance: 5,
      startDate: '2023-05-01',
      status: 'Active',
    },
    {
      id: 'emp-ap-2',
      name: 'Elena Rostova',
      email: 'elena@apexcode.io',
      role: 'HR',
      department: 'Finance',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      salary: 4000,
      skills: ['Payroll', 'Talent Acquisition', 'conflict resolution', 'Benefits'],
      performance: 4.7,
      startDate: '2023-08-15',
      status: 'Active',
    },
    {
      id: 'emp-ap-3',
      name: 'Devon Miller',
      email: 'devon@apexcode.io',
      role: 'Project Manager',
      department: 'Management',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
      salary: 6000,
      skills: ['Jira', 'PostgreSQL', 'Risk Assessment', 'Kanban'],
      performance: 4.5,
      startDate: '2024-01-20',
      status: 'Active',
    },
    {
      id: 'emp-ap-4',
      name: 'Hiroshi Sato',
      email: 'hiroshi@apexcode.io',
      role: 'Team Lead',
      department: 'Engineering',
      avatar: 'https://images.unsplash.com/photo-1489980508314-941910ded1f4?auto=format&fit=crop&w=200&q=80',
      salary: 7500,
      skills: ['React', 'Next.js', 'TypeScript', 'Drizzle ORM', 'AWS'],
      performance: 5,
      startDate: '2023-06-10',
      status: 'Active',
    },
    {
      id: 'emp-ap-5',
      name: 'Chloe Sinclair',
      email: 'chloe@apexcode.io',
      role: 'Employee',
      department: 'Engineering',
      avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=200&q=80',
      salary: 4800,
      skills: ['Express', 'Node.js', 'Prisma', 'PostgreSQL', 'Docker'],
      performance: 4.4,
      startDate: '2024-06-01',
      status: 'Active',
    },
    {
      id: 'emp-ap-6',
      name: 'Taylor Reed',
      email: 'taylor@apexcode.io',
      role: 'Intern',
      department: 'Engineering',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
      salary: 1500,
      skills: ['HTML', 'CSS', 'JavaScript Basics', 'React basics'],
      performance: 4.1,
      startDate: '2026-05-01',
      status: 'Active',
    },
  ],
};

export const MOCK_ATTENDANCE: Record<string, AttendanceRecord[]> = {
  'tenant-pixelcraft': [
    {
      id: 'att-pc-1',
      employeeId: 'emp-pc-1',
      date: '2026-07-01',
      checkIn: '08:45:12',
      breakMinutes: 45,
      ipAddress: '192.168.1.104',
      location: 'Dhaka, Bangladesh',
      status: 'On Time',
    },
    {
      id: 'att-pc-2',
      employeeId: 'emp-pc-2',
      date: '2026-07-01',
      checkIn: '08:55:00',
      breakMinutes: 30,
      ipAddress: '82.24.112.5',
      location: 'London, UK',
      status: 'On Time',
    },
    {
      id: 'att-pc-3',
      employeeId: 'emp-pc-3',
      date: '2026-07-01',
      checkIn: '09:12:43',
      breakMinutes: 60,
      ipAddress: '222.181.99.12',
      location: 'Seoul, South Korea',
      status: 'On Time',
    },
    {
      id: 'att-pc-4',
      employeeId: 'emp-pc-4',
      date: '2026-07-01',
      checkIn: '09:35:10',
      breakMinutes: 15,
      ipAddress: '124.90.35.41',
      location: 'Kowloon, Hong Kong',
      status: 'Late',
    },
    {
      id: 'att-pc-5',
      employeeId: 'emp-pc-5',
      date: '2026-07-01',
      checkIn: '08:30:22',
      breakMinutes: 40,
      ipAddress: '172.56.21.90',
      location: 'New York, US',
      status: 'On Time',
    },
  ],
  'tenant-apex': [
    {
      id: 'att-ap-1',
      employeeId: 'emp-ap-1',
      date: '2026-07-01',
      checkIn: '08:50:00',
      breakMinutes: 50,
      ipAddress: '72.35.12.8',
      location: 'Chicago, USA',
      status: 'On Time',
    },
    {
      id: 'att-ap-2',
      employeeId: 'emp-ap-2',
      date: '2026-07-01',
      checkIn: '08:58:33',
      breakMinutes: 30,
      ipAddress: '190.22.45.19',
      location: 'Madrid, Spain',
      status: 'On Time',
    },
    {
      id: 'att-ap-3',
      employeeId: 'emp-ap-3',
      date: '2026-07-01',
      checkIn: '09:15:00',
      breakMinutes: 45,
      ipAddress: '110.224.50.62',
      location: 'Sydney, Australia',
      status: 'Late',
    },
    {
      id: 'att-ap-4',
      employeeId: 'emp-ap-4',
      date: '2026-07-01',
      checkIn: '08:15:40',
      breakMinutes: 60,
      ipAddress: '210.89.5.44',
      location: 'Tokyo, Japan',
      status: 'On Time',
    },
    {
      id: 'att-ap-5',
      employeeId: 'emp-ap-5',
      date: '2026-07-01',
      checkIn: '08:52:12',
      breakMinutes: 10,
      ipAddress: '99.124.6.85',
      location: 'Berlin, Germany',
      status: 'On Time',
    },
  ],
};

export const MOCK_CLIENTS: Record<string, Client[]> = {
  'tenant-pixelcraft': [
    {
      id: 'cli-pc-1',
      name: 'Jonathan Sterling',
      email: 'jonathan@sterlingcorp.com',
      companyName: 'Sterling Real Estate Group',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      projectCount: 2,
      rating: 4.8,
    },
    {
      id: 'cli-pc-2',
      name: 'Vanya Henderson',
      email: 'vanya@glowbeauty.io',
      companyName: 'Glow Cosmetics Ltd.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      projectCount: 1,
      rating: 5.0,
    },
    {
      id: 'cli-pc-3',
      name: 'Marcus Brody',
      email: 'mbrody@epicventures.co',
      companyName: 'Epic Travel & Tours',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
      projectCount: 3,
      rating: 4.5,
    },
  ],
  'tenant-apex': [
    {
      id: 'cli-ap-1',
      name: 'Darius Vance',
      email: 'dvance@cloudpeak.net',
      companyName: 'CloudPeak Healthcare',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      projectCount: 1,
      rating: 4.9,
    },
    {
      id: 'cli-ap-2',
      name: 'Amara Lopez',
      email: 'amara@smartlogistics.tech',
      companyName: 'Smart Logistics Global',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
      projectCount: 2,
      rating: 4.7,
    },
  ],
};

export const MOCK_FIVERR_ORDERS: Record<string, FiverrOrder[]> = {
  'tenant-pixelcraft': [
    {
      id: 'fov-pc-1',
      orderNumber: '#FO9902A3',
      buyerName: 'glow_skincare_vanya',
      package: 'Premium',
      gigTitle: 'Design Modern E-Commerce UI UX in Figma',
      price: 1500,
      earnings: 1200,
      deliveryDate: '2026-07-03 14:00', // Close to current mock date 2026-07-01
      status: 'In Progress',
      revisionsRemaining: 3,
      revisionCount: 1,
      requirements: 'I need a sleek UI/UX flow for an online organic beauty brand. Requirements include 12 custom page templates, full-fledged component library with responsive design guidelines, interactive prototyping, and animated banner specs. Preferred primary color is sage green.',
      attachments: [
        { name: 'glow_cosmetics_branding_guide.pdf', url: '#' },
        { name: 'wireframes_draft_v1.fig', url: '#' },
      ],
      extensionsCount: 0,
    },
    {
      id: 'fov-pc-2',
      orderNumber: '#FO11B34E',
      buyerName: 'epic_travel_brody',
      package: 'Standard',
      gigTitle: 'Convert Figma Design to Fully Responsive Webflow Site',
      price: 850,
      earnings: 680,
      deliveryDate: '2026-07-02 18:30',
      status: 'In Progress',
      revisionsRemaining: 5,
      revisionCount: 0,
      requirements: 'We designed an interactive travel directory in Figma. Please convert the home layout, search details grid, and booking form with smooth parallax integrations and clean Webflow collections.',
      attachments: [{ name: 'epic_travel_web_figma_link.txt', url: '#' }],
      extensionsCount: 1,
    },
    {
      id: 'fov-pc-3',
      orderNumber: '#FO56A329',
      buyerName: 'tech_expert_sam',
      package: 'Basic',
      gigTitle: 'Create Premium Vector Icon Set & Branding Elements',
      price: 250,
      earnings: 200,
      deliveryDate: '2026-06-30 11:00',
      status: 'Delivered',
      revisionsRemaining: 2,
      revisionCount: 1,
      requirements: 'Need 15 minimalistic dark mode flat vector icons for a system monitoring dashboard. Must export to SVG and React raw component objects.',
      attachments: [{ name: 'icon_spec_v2.png', url: '#' }],
      extensionsCount: 0,
    },
    {
      id: 'fov-pc-4',
      orderNumber: '#FO33D890',
      buyerName: 'design_lover_kate',
      package: 'Premium',
      gigTitle: 'Design Modern E-Commerce UI UX in Figma',
      price: 1800,
      earnings: 1440,
      deliveryDate: '2026-07-15 12:00',
      status: 'Requirements',
      revisionsRemaining: 5,
      revisionCount: 0,
      requirements: 'SaaS multi-tenant billing workspace design starting from scratch. Needs interactive wireframes and a modern dashboard UI concept.',
      attachments: [],
      extensionsCount: 0,
    },
  ],
  'tenant-apex': [
    {
      id: 'fov-ap-1',
      orderNumber: '#FO77D42A',
      buyerName: 'smart_log_amara',
      package: 'Premium',
      gigTitle: 'Develop custom Next.js SaaS Web Portal with Database Integration',
      price: 4500,
      earnings: 3600,
      deliveryDate: '2026-07-08 17:00',
      status: 'In Progress',
      revisionsRemaining: 2,
      revisionCount: 0,
      requirements: 'Provide a secure multi-role vehicle logistics tracker using Next.js App Router, Prisma, PostgreSQL and Tailwind CSS. Needs beautiful Leaflet map integrations, interactive dashboard charts, automated emails using Resend, and optimized CSV export functionality.',
      attachments: [{ name: 'logistics_api_schema.json', url: '#' }],
      extensionsCount: 0,
    },
  ],
};

export const MOCK_PROJECTS: Record<string, Project[]> = {
  'tenant-pixelcraft': [
    {
      id: 'proj-pc-1',
      name: 'Glow Skincare E-Commerce UI',
      clientId: 'cli-pc-2',
      fiverrOrderId: 'fov-pc-1',
      health: 'Healthy',
      status: 'In Progress',
      budget: 1500,
      deliverables: ['Figma Landing Page', '12 Product Pages', 'UI Kit & Icons', 'Spline 3D Asset Mockup'],
      milestones: [
        { id: 'm-pc-1-1', name: 'Wireframes & User Flow Approval', dueDate: '2026-06-25', completed: true },
        { id: 'm-pc-1-2', name: 'UI Styling &Sage Theme Draft', dueDate: '2026-06-29', completed: true },
        { id: 'm-pc-1-3', name: 'Mobile Layout Prototypes', dueDate: '2026-07-02', completed: false },
        { id: 'm-pc-1-4', name: 'Final Hand-off & Source Files', dueDate: '2026-07-03', completed: false },
      ],
    },
    {
      id: 'proj-pc-2',
      name: 'Epic Travel & Tours Conversion',
      clientId: 'cli-pc-3',
      fiverrOrderId: 'fov-pc-2',
      health: 'At Risk',
      status: 'In Progress',
      budget: 850,
      deliverables: ['Webflow Home Template', 'Search Grid CMS Integration', 'Parallax Animations'],
      milestones: [
        { id: 'm-pc-2-1', name: 'Initial Asset Extraction', dueDate: '2026-06-28', completed: true },
        { id: 'm-pc-2-2', name: 'CMS Schema Setup & Static Elements', dueDate: '2026-06-30', completed: false },
        { id: 'm-pc-2-3', name: 'Interaction Rigging & Responsive Pass', dueDate: '2026-07-01', completed: false },
        { id: 'm-pc-2-4', name: 'SEO & Domain Connection Deliver', dueDate: '2026-07-02', completed: false },
      ],
    },
    {
      id: 'proj-pc-3',
      name: 'Sterling Realty Corporate Portal',
      clientId: 'cli-pc-1',
      health: 'Critical',
      status: 'On Hold',
      budget: 4200,
      deliverables: ['Custom WordPress Core', 'Realty API Integration', 'Advanced Filtering', 'Multi-agent Sub-accounts'],
      milestones: [
        { id: 'm-pc-3-1', name: 'System Blueprint & DB Layout', dueDate: '2026-06-15', completed: true },
        { id: 'm-pc-3-2', name: 'Listing Aggregator Engine Sync', dueDate: '2026-06-22', completed: false },
      ],
    },
  ],
  'tenant-apex': [
    {
      id: 'proj-ap-1',
      name: 'CloudPeak Health Patient Portal',
      clientId: 'cli-ap-1',
      health: 'Healthy',
      status: 'In Progress',
      budget: 12500,
      deliverables: ['HIPAA Compliant AWS Pipeline', 'Patient History Logs', 'Next.js App Core', 'MFA Audit Trail'],
      milestones: [
        { id: 'm-ap-1-1', name: 'HIPAA Security Risk Assessment', dueDate: '2026-06-10', completed: true },
        { id: 'm-ap-1-2', name: 'DB Schema & Encryption Key Rigging', dueDate: '2026-06-24', completed: true },
        { id: 'm-ap-1-3', name: 'OAuth Patient Login Flow', dueDate: '2026-07-02', completed: true },
        { id: 'm-ap-1-4', name: 'Secure Telehealth WebRTC Stream', dueDate: '2026-07-15', completed: false },
      ],
    },
    {
      id: 'proj-ap-2',
      name: 'Smart Logistics Global Portal',
      clientId: 'cli-ap-2',
      fiverrOrderId: 'fov-ap-1',
      health: 'Healthy',
      status: 'In Progress',
      budget: 4500,
      deliverables: ['Vehicle Tracker Map Layout', 'Client Admin Panel', 'PostgreSQL Sync Hooks'],
      milestones: [
        { id: 'm-ap-2-1', name: 'Leaflet Integration & Mock Map Data', dueDate: '2026-06-28', completed: true },
        { id: 'm-ap-2-2', name: 'Admin Fleet Controls & API Routes', dueDate: '2026-07-04', completed: false },
        { id: 'm-ap-2-3', name: 'Deploy to Vercel production', dueDate: '2026-07-08', completed: false },
      ],
    },
  ],
};

export const MOCK_TASKS: Record<string, Task[]> = {
  'tenant-pixelcraft': [
    {
      id: 'task-pc-1',
      projectId: 'proj-pc-1',
      title: 'Design sage green color theory & typography specifications',
      description: 'Prepare beautiful font pairings (Playfair & Inter) and set absolute neutral & pastel palettes for organic products.',
      priority: 'High',
      status: 'Completed',
      assigneeId: 'emp-pc-3',
      dueDate: '2026-06-28',
      subtasks: [
        { id: 'st-pc-1-1', title: 'Compile 5 mood boards', completed: true },
        { id: 'st-pc-1-2', title: 'Choose typography scales', completed: true },
      ],
      comments: [
        { id: 'c-pc-1', author: 'Sarah Jenkins', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80', text: 'Stunning palette! The buyer absolutely loved the green tint and the branding directions.', timestamp: '2026-06-28T15:20:00Z' },
      ],
      attachments: [],
    },
    {
      id: 'task-pc-2',
      projectId: 'proj-pc-1',
      title: 'Render 3D Spline Glass Jar Asset',
      description: 'Create interactive premium jar model that orbits upon user hover. Export splinedist variables to frontend.',
      priority: 'Medium',
      status: 'In Progress',
      assigneeId: 'emp-pc-4',
      dueDate: '2026-07-02',
      subtasks: [
        { id: 'st-pc-2-1', title: 'Model detailed cream texture inside jar', completed: true },
        { id: 'st-pc-2-2', title: 'Add lighting triggers and orbit vectors', completed: false },
        { id: 'st-pc-2-3', title: 'Export with optimal web compression', completed: false },
      ],
      comments: [],
      attachments: ['jar_wireframe_screengrab.jpg'],
    },
    {
      id: 'task-pc-3',
      projectId: 'proj-pc-2',
      title: 'Setup Webflow CMS Collections',
      description: 'Establish collections for destinations, hotels, and custom travel packages. Wire the template page layouts.',
      priority: 'High',
      status: 'In Progress',
      assigneeId: 'emp-pc-5',
      dueDate: '2026-06-30',
      subtasks: [
        { id: 'st-pc-3-1', title: 'Create destinations collection with fields', completed: true },
        { id: 'st-pc-3-2', title: 'Import mock data CSV with 50 locations', completed: false },
        { id: 'st-pc-3-3', title: 'Connect Webflow slider nodes to CMS', completed: false },
      ],
      comments: [
        { id: 'c-pc-2', author: 'David Kim', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', text: 'Ensure the image fields have WebP compression guidelines enabled. Travel images are quite heavy.', timestamp: '2026-06-29T10:15:00Z' },
      ],
      attachments: [],
    },
    {
      id: 'task-pc-4',
      projectId: 'proj-pc-1',
      title: 'Mobile Navigation Shell Layouts',
      description: 'Design sleek bottom sheets for mobile filters and optimized single checkout drawers.',
      priority: 'Low',
      status: 'To Do',
      assigneeId: 'emp-pc-4',
      dueDate: '2026-07-03',
      subtasks: [],
      comments: [],
      attachments: [],
    },
  ],
  'tenant-apex': [
    {
      id: 'task-ap-1',
      projectId: 'proj-ap-1',
      title: 'Configure HIPAA Compliant S3 Encryption',
      description: 'Rig automated AES-256 server-side encryption with AWS KMS CMK keys. Enforce SSL and audit logging bucket policies.',
      priority: 'High',
      status: 'Completed',
      assigneeId: 'emp-ap-4',
      dueDate: '2026-06-22',
      subtasks: [
        { id: 'st-ap-1-1', title: 'Create KMS multi-region key', completed: true },
        { id: 'st-ap-1-2', title: 'Configure CloudTrail read audit buckets', completed: true },
      ],
      comments: [],
      attachments: [],
    },
    {
      id: 'task-ap-2',
      projectId: 'proj-ap-1',
      title: 'Integrate WebRTC Video Room Channels',
      description: 'Rig peer-to-peer interactive clinical consultation rooms with instant chat, screenshare and record capabilities.',
      priority: 'High',
      status: 'In Progress',
      assigneeId: 'emp-ap-4',
      dueDate: '2026-07-15',
      subtasks: [
        { id: 'st-ap-2-1', title: 'Setup STUN/TURN server configurations', completed: true },
        { id: 'st-ap-2-2', title: 'Develop socket room connection protocols', completed: false },
        { id: 'st-ap-2-3', title: 'Build React video-grid controls', completed: false },
      ],
      comments: [
        { id: 'c-ap-1', author: 'Marcus Sterling', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80', text: 'This is the crown jewel of our patient platform. Speed and reliable connections are vital.', timestamp: '2026-06-30T16:00:00Z' },
      ],
      attachments: [],
    },
    {
      id: 'task-ap-3',
      projectId: 'proj-ap-2',
      title: 'Build Leaflet interactive Map Interface',
      description: 'Display cargo vehicles with colored marker vectors representing status (moving, idling, off). Use custom SVG icons.',
      priority: 'Medium',
      status: 'In Progress',
      assigneeId: 'emp-ap-5',
      dueDate: '2026-07-04',
      subtasks: [
        { id: 'st-ap-3-1', title: 'Create dynamic cluster manager', completed: true },
        { id: 'st-ap-3-2', title: 'Embed websocket speed telemetry', completed: false },
      ],
      comments: [],
      attachments: [],
    },
  ],
};

export const MOCK_STANDUPS: Record<string, DailyStandup[]> = {
  'tenant-pixelcraft': [
    {
      id: 'std-pc-1',
      employeeId: 'emp-pc-3',
      date: '2026-07-01',
      completedToday: 'Finished wireframe adjustments for Glow skincare. Updated brand boards.',
      tomorrowPlan: 'Starting mid-fidelity components for design review. Aligning with Alex on specs.',
      blockers: 'None. Awaiting buyer confirmation on custom colors.',
      approvedBy: 'emp-pc-2',
      status: 'Approved',
    },
    {
      id: 'std-pc-2',
      employeeId: 'emp-pc-4',
      date: '2026-07-01',
      completedToday: 'Created base Spline model for organic glass container.',
      tomorrowPlan: 'Refine lighting models and configure hover rotations. Wire up React spline component.',
      blockers: 'My Spline cloud preview container is experiencing slow loading times.',
      approvedBy: null,
      status: 'Pending',
    },
    {
      id: 'std-pc-3',
      employeeId: 'emp-pc-5',
      date: '2026-07-01',
      completedToday: 'Successfully connected Webflow collections to API backend for travelers review database.',
      tomorrowPlan: 'Embed full animations and configure the checkout Webflow forms.',
      blockers: 'Need Vanya to send over custom checkout payment webhook credentials.',
      approvedBy: null,
      status: 'Pending',
    },
  ],
  'tenant-apex': [
    {
      id: 'std-ap-1',
      employeeId: 'emp-ap-4',
      date: '2026-07-01',
      completedToday: 'Configured HIPAA patient details API routes with fully encrypted database requests.',
      tomorrowPlan: 'Rig patient session logs and begin STUN / TURN credentials provisioning.',
      blockers: 'Waiting for Amazon S3 security compliance audit token from Elena.',
      approvedBy: 'emp-ap-3',
      status: 'Approved',
    },
    {
      id: 'std-ap-2',
      employeeId: 'emp-ap-5',
      date: '2026-07-01',
      completedToday: 'Integrated vehicle tracker database schemas and finished Leaflet static map layouts.',
      tomorrowPlan: 'Rig dynamic marker clusters and test simulation telemetry endpoints.',
      blockers: 'None.',
      approvedBy: null,
      status: 'Pending',
    },
  ],
};

export const MOCK_TIMESHEETS: Record<string, TimesheetEntry[]> = {
  'tenant-pixelcraft': [
    { id: 'ts-pc-1', employeeId: 'emp-pc-3', projectId: 'proj-pc-1', taskId: 'task-pc-1', date: '2026-07-01', durationMinutes: 240, description: 'Refined brand sage color rules', source: 'Manual' },
    { id: 'ts-pc-2', employeeId: 'emp-pc-4', projectId: 'proj-pc-1', taskId: 'task-pc-2', date: '2026-07-01', durationMinutes: 180, description: 'Sleek jar modeling on Spline', source: 'Timer' },
    { id: 'ts-pc-3', employeeId: 'emp-pc-5', projectId: 'proj-pc-2', taskId: 'task-pc-3', date: '2026-07-01', durationMinutes: 320, description: 'Rigged Webflow dynamic collections', source: 'Manual' },
  ],
  'tenant-apex': [
    { id: 'ts-ap-1', employeeId: 'emp-ap-4', projectId: 'proj-ap-1', taskId: 'task-ap-2', date: '2026-07-01', durationMinutes: 410, description: 'HIPAA Compliant patient token development', source: 'Timer' },
    { id: 'ts-ap-2', employeeId: 'emp-ap-5', projectId: 'proj-ap-2', taskId: 'task-ap-3', date: '2026-07-01', durationMinutes: 220, description: 'Configured custom SVG icons and clusters for Leaflet', source: 'Manual' },
  ],
};

export const MOCK_INVOICES: Record<string, Invoice[]> = {
  'tenant-pixelcraft': [
    { id: 'inv-pc-1', clientId: 'cli-pc-2', fiverrOrderId: 'fov-pc-1', amount: 1500, issueDate: '2026-06-20', dueDate: '2026-07-03', status: 'Paid', category: 'Fiverr' },
    { id: 'inv-pc-2', clientId: 'cli-pc-3', fiverrOrderId: 'fov-pc-2', amount: 850, issueDate: '2026-06-25', dueDate: '2026-07-10', status: 'Unpaid', category: 'Fiverr' },
    { id: 'inv-pc-3', clientId: 'cli-pc-1', amount: 2000, issueDate: '2026-06-01', dueDate: '2026-06-15', status: 'Overdue', category: 'Development' },
    { id: 'inv-pc-4', clientId: 'cli-pc-1', amount: 1200, issueDate: '2026-06-10', dueDate: '2026-06-25', status: 'Paid', category: 'Consulting' },
  ],
  'tenant-apex': [
    { id: 'inv-ap-1', clientId: 'cli-ap-1', amount: 8500, issueDate: '2026-06-10', dueDate: '2026-06-25', status: 'Paid', category: 'Development' },
    { id: 'inv-ap-2', clientId: 'cli-ap-1', amount: 4000, issueDate: '2026-06-24', dueDate: '2026-07-10', status: 'Unpaid', category: 'Development' },
    { id: 'inv-ap-3', clientId: 'cli-ap-2', fiverrOrderId: 'fov-ap-1', amount: 4500, issueDate: '2026-06-28', dueDate: '2026-07-08', status: 'Paid', category: 'Fiverr' },
  ],
};

export const MOCK_ASSETS: Record<string, Asset[]> = {
  'tenant-pixelcraft': [
    { id: 'ast-pc-1', name: 'MacBook Pro 16" M3 Max', category: 'Laptop', serialNumber: 'C02H48A2Q05D', value: 3499, assignedToId: 'emp-pc-1', assignedDate: '2024-01-10', status: 'In Use' },
    { id: 'ast-pc-2', name: 'Apple Studio Display 27"', category: 'Monitor', serialNumber: 'SD890334812X', value: 1599, assignedToId: 'emp-pc-3', assignedDate: '2024-02-05', status: 'In Use' },
    { id: 'ast-pc-3', name: 'MacBook Air 15" M2', category: 'Laptop', serialNumber: 'C02G238FQA89', value: 1299, assignedToId: 'emp-pc-4', assignedDate: '2025-05-12', status: 'In Use' },
    { id: 'ast-pc-4', name: 'Spline Pro Team License', category: 'License', serialNumber: 'SPL-PRO-88902', value: 240, assignedToId: 'emp-pc-4', assignedDate: '2025-05-11', status: 'In Use' },
    { id: 'ast-pc-5', name: 'Logitech MX Master 3S', category: 'Peripherals', serialNumber: 'MX-990-2A3-01', value: 99, status: 'In Stock' },
  ],
  'tenant-apex': [
    { id: 'ast-ap-1', name: 'Lenovo ThinkPad X1 Carbon Gen 11', category: 'Laptop', serialNumber: 'TP-992381289', value: 1999, assignedToId: 'emp-ap-4', assignedDate: '2023-06-12', status: 'In Use' },
    { id: 'ast-ap-2', name: 'Dell UltraSharp 38" Curved Monitor', category: 'Monitor', serialNumber: 'DS-38234-99D', value: 1049, assignedToId: 'emp-ap-4', assignedDate: '2023-06-15', status: 'In Use' },
    { id: 'ast-ap-3', name: 'AWS Production Sandbox Account', category: 'License', serialNumber: 'AWS-ACT-77012', value: 1200, assignedToId: 'emp-ap-1', assignedDate: '2023-05-10', status: 'In Use' },
    { id: 'ast-ap-4', name: 'JetBrains All Products License', category: 'License', serialNumber: 'JB-ALL-990A1', value: 499, assignedToId: 'emp-ap-5', assignedDate: '2024-06-02', status: 'In Use' },
    { id: 'ast-ap-5', name: 'MacBook Pro 14" M3 Pro', category: 'Laptop', serialNumber: 'MB-14-382903', value: 1999, status: 'In Stock' },
  ],
};

export const MOCK_CHANNELS: Record<string, ChatChannel[]> = {
  'tenant-pixelcraft': [
    { id: 'chan-pc-1', name: 'general', description: 'Company-wide general announcements', isDirect: false, memberIds: ['emp-pc-1', 'emp-pc-2', 'emp-pc-3', 'emp-pc-4', 'emp-pc-5', 'emp-pc-6'], lastMessageTime: '2026-07-01T10:10:00Z' },
    { id: 'chan-pc-2', name: 'fiverr-orders', description: 'Incoming Fiverr gigs notifications & delivery tracking', isDirect: false, memberIds: ['emp-pc-1', 'emp-pc-2', 'emp-pc-3', 'emp-pc-4', 'emp-pc-5'], lastMessageTime: '2026-07-01T09:40:00Z' },
    { id: 'chan-pc-3', name: 'design-assets', description: 'Figma templates, asset feedback, design components', isDirect: false, memberIds: ['emp-pc-1', 'emp-pc-3', 'emp-pc-4'], lastMessageTime: '2026-06-30T16:00:00Z' },
    { id: 'chan-pc-dm1', name: 'Sarah Jenkins', description: 'Direct message', isDirect: true, memberIds: ['emp-pc-1', 'emp-pc-2'], lastMessageTime: '2026-07-01T08:30:00Z' },
  ],
  'tenant-apex': [
    { id: 'chan-ap-1', name: 'general', description: 'Company-wide general updates', isDirect: false, memberIds: ['emp-ap-1', 'emp-ap-2', 'emp-ap-3', 'emp-ap-4', 'emp-ap-5', 'emp-ap-6'], lastMessageTime: '2026-07-01T09:00:00Z' },
    { id: 'chan-ap-2', name: 'devops-alerts', description: 'AWS builds, docker containers, deploy health', isDirect: false, memberIds: ['emp-ap-1', 'emp-ap-3', 'emp-ap-4'], lastMessageTime: '2026-06-30T22:30:00Z' },
  ],
};

export const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
  'tenant-pixelcraft': [
    {
      id: 'msg-pc-1',
      channelId: 'chan-pc-1',
      senderId: 'emp-pc-1',
      senderName: 'Rafiul Refat',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      text: "Welcome to PixelCraft Flow! Let's align all our active Fiverr orders here. Please post daily standup reports in the Standup section before 10 AM.",
      timestamp: '2026-07-01T08:00:00Z',
      readBy: ['emp-pc-2', 'emp-pc-3'],
    },
    {
      id: 'msg-pc-2',
      channelId: 'chan-pc-1',
      senderId: 'emp-pc-2',
      senderName: 'Sarah Jenkins',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      text: 'Good morning Refat! On it. I am wrapping up the Glow skincare requirements checks today.',
      timestamp: '2026-07-01T08:15:00Z',
      readBy: ['emp-pc-1', 'emp-pc-3'],
    },
    {
      id: 'msg-pc-3',
      channelId: 'chan-pc-2',
      senderId: 'emp-pc-2',
      senderName: 'Sarah Jenkins',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      text: '🔔 Fiverr Order #FO9902A3 ($1500) has been created! Buyer "glow_skincare_vanya" is active. Assignee: David. Requirements attached in Fiverr orders panel.',
      timestamp: '2026-07-01T09:30:00Z',
      readBy: ['emp-pc-1', 'emp-pc-3', 'emp-pc-4'],
    },
    {
      id: 'msg-pc-4',
      channelId: 'chan-pc-2',
      senderId: 'emp-pc-3',
      senderName: 'David Kim',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      text: 'Got it. I have already drafted wireframes. Mia is modeling the skincare jar in Spline. We are well on track for delivery on July 3rd.',
      timestamp: '2026-07-01T09:40:00Z',
      readBy: ['emp-pc-1', 'emp-pc-2', 'emp-pc-4'],
    },
  ],
  'tenant-apex': [
    {
      id: 'msg-ap-1',
      channelId: 'chan-ap-1',
      senderId: 'emp-ap-1',
      senderName: 'Marcus Sterling',
      senderAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
      text: 'Team, CloudPeak Patient Portal milestone #3 has been fully approved by the client! Great work on the HIPAA encryption schemas.',
      timestamp: '2026-07-01T09:00:00Z',
      readBy: ['emp-ap-3', 'emp-ap-4'],
    },
  ],
};

export const MOCK_WIKI: Record<string, WikiDoc[]> = {
  'tenant-pixelcraft': [
    {
      id: 'wiki-pc-1',
      title: 'Fiverr Order Delivery Standard Operating Procedure (SOP)',
      category: 'Client Relations',
      content: `# Fiverr Order Hand-off & Delivery Guidelines

To maintain our **5-star average rating** on Fiverr, we must follow these delivery guidelines for every single digital product hand-off.

## 1. Quality Control (QC) Checklist
Before any delivery, the lead designer **must**:
* Export layouts in WebP and SVG (no heavy PNGs unless requested).
* Organize Figma layers perfectly into pages, with clear components and auto-layout structures.
* Run a speed audit if Webflow/WordPress sites are involved.

## 2. Hand-off Deliverables Pack
Upload standard hand-off formats:
1. \`Source Figma File URL\` (configured to View Only with Export permissions).
2. \`Static Template Images Archive\` (.zip containing 1K responsive screenshots).
3. \`Branding Guidelines Sheet\` (Color codes, typography selections).

## 3. Communication Guidelines
* Use a warm, professional, encouraging opening greeting.
* **Always** summarize what was completed and include an actionable list showing where revisions can be requested.
* Highlight that we provide **unlimited premium revisions** during the order phase.
`,
      lastUpdated: '2026-06-18',
      author: 'Sarah Jenkins',
    },
    {
      id: 'wiki-pc-2',
      title: 'Spline 3D Integration & Optimization Guide',
      category: 'Design Systems',
      content: `# Spline 3D Web Integration

Guidelines to prevent heavy canvas lag on mobile platforms.

## Asset Optimization
1. **Reduce Polygon Count**: Bake models as much as possible, avoid complex geometry nodes.
2. **Compress Textures**: Limit spline image uploads to 1024px maximum. Use JPG over PNG where transparency isn't needed.
3. **Turn off Idle Shadows**: Direct shadows can slow FPS on mobile browsers. Disable them when target orbits are static.
`,
      lastUpdated: '2026-06-25',
      author: 'David Kim',
    },
  ],
  'tenant-apex': [
    {
      id: 'wiki-ap-1',
      title: 'HIPAA Compliant App Architecture Standard',
      category: 'Engineering Guidelines',
      content: `# HIPAA Standards for Cloud Databases

Absolute requirements for cloud-hosted Patient Health Information (PHI).

## Encryption
* **At Rest**: AES-256 enabled on all RDS volumes and S3 buckets.
* **In Transit**: TLS 1.3 enforced. All non-HTTPS requests must drop instantly.

## Audit Logging
* Ensure cloud trail tracks every API request involving patient fields. Keep logging historical records for a minimum of 7 years.
`,
      lastUpdated: '2026-05-12',
      author: 'Hiroshi Sato',
    },
  ],
};
