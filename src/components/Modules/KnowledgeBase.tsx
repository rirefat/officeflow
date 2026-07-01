/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, Search, HelpCircle, CheckSquare, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export const KnowledgeBase: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocId, setSelectedDocId] = useState<string>('sop-fiverr');

  const sops = [
    {
      id: 'sop-fiverr',
      title: 'Fiverr Order Delivery Standard (SOP-091)',
      category: 'Client Support',
      lastUpdated: 'June 18, 2026',
      content: `### Fiverr Delivery Standards & Verification Checklist

To maintain our 5-star seller rating across both Apex Code Labs and PixelCraft Studios, all specialists must comply with the following procedural protocol prior to punching "Deliver Work":

#### 1. Pre-delivery Quality Assurance (QA)
- **Design Leads:** Inspect contrast standards using a WCAG checker. Verify typography hierarchy, padding values (e.g., matching the 8px grid), and responsive layouts.
- **Webflow/Engineering Specialists:** Ensure standard link redirections are clean, CSS tags are compressed, and the live staging links are fully responsive.
- **Client Managers:** Check initial requirement logs. Verify that every single asset request from the buyer has been fulfilled in full.

#### 2. Constructing the Delivery Message
- Avoid brief messages like "here is your design".
- Express genuine enthusiasm. Thank them for partnering with our agency.
- Structure your message clearly using descriptive paragraphs detailing:
  - What has been built.
  - Where they can access the Figma layout or Webflow staging link.
  - A friendly reminder that they receive unlimited revisions under our Premium Package terms.
  
#### 3. Revision Handling Guidelines
- If a client requests revisions, respond within **2 hours** (check notifications drawer).
- Reassure them with a supportive message and estimate a direct 12-hour turnaround time for revisions.`,
    },
    {
      id: 'sop-dev',
      title: 'Git Versioning & Deployments (SOP-024)',
      category: 'Engineering',
      lastUpdated: 'May 30, 2026',
      content: `### Git Branching & Staging Deployments

This protocol guides code modifications, staging launches, and production check-ins to prevent deployment downtime:

#### 1. Branching Naming Protocol
- Create descriptive topic branches using relative tags:
  - **Feature branch:** \`feature/fiverr-reply-assistant\`
  - **Bugfix branch:** \`bugfix/timer-seconds-reset\`
  - **Optimization branch:** \`optimize/bundle-sizing\`

#### 2. Staging Launch Verification
- Deploy and review topic branches on our secondary isolated staging servers.
- Ensure that the environment variables are correctly synchronized inside \`.env.example\`.
- Inspect build logs for type compliance prior to requesting PR approvals.`,
    },
  ];

  const activeDoc = sops.find((s) => s.id === selectedDocId) || sops[0];

  const filtered = sops.filter((s) => {
    return s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.content.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 1 Column: Directory of Wiki SOPs */}
        <div className="lg:col-span-1 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 shadow-sm space-y-4 h-fit">
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-display flex items-center">
              <BookOpen className="w-4 h-4 mr-1.5 text-indigo-500" /> Agency SOPs
            </h3>
            <p className="text-[11px] text-slate-400">Search company procedural guidelines.</p>
          </div>

          <div className="relative">
            <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search wiki..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/20 text-xs outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="space-y-1 pt-2">
            {filtered.map((sop) => (
              <button
                key={sop.id}
                onClick={() => setSelectedDocId(sop.id)}
                className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  selectedDocId === sop.id
                    ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
                }`}
              >
                {sop.title}
              </button>
            ))}
          </div>
        </div>

        {/* Right 3 Columns: Active SOP content area */}
        <div className="lg:col-span-3 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 shadow-sm space-y-6">
          <div className="pb-4 border-b border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold font-mono uppercase tracking-wide">
                {activeDoc.category}
              </span>
              <h2 className="text-lg font-bold font-display text-slate-800 dark:text-slate-100 mt-1.5 leading-snug">
                {activeDoc.title}
              </h2>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Last updated: {activeDoc.lastUpdated}</span>
          </div>

          {/* SOP Document contents */}
          <div className="prose prose-slate dark:prose-invert max-w-none text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line space-y-4">
            {activeDoc.content}
          </div>
        </div>
      </div>
    </div>
  );
};
