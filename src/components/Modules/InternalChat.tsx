/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquare, Send, Sparkles, User, Hash, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const InternalChat: React.FC = () => {
  const { employees, currentUserEmployee } = useApp();

  const [activeChannel, setActiveChannel] = useState('#fiverr-orders');
  const [messages, setMessages] = useState<any[]>([
    {
      id: 'm-1',
      channel: '#fiverr-orders',
      senderId: 'emp-2', // Vanya (Lead UI UX)
      text: 'Hey everyone, just received the requirements on order #FO9902A3. The buyer wants premium dark theme branding. I will start wireframing now.',
      time: '10:14 AM',
    },
    {
      id: 'm-2',
      channel: '#fiverr-orders',
      senderId: 'emp-3', // Aris (Webflow Dev)
      text: 'Perfect. Let me know when the Figma layouts are locked so I can begin prepping the Webflow responsive classes.',
      time: '10:28 AM',
    },
  ]);

  const [typedMsg, setTypedMsg] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeChannel]);

  const channelsList = ['#general', '#fiverr-orders', '#webflow-dev', '#marketing-gigs'];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMsg || !currentUserEmployee) return;

    const newMsg = {
      id: `m-${Date.now()}`,
      channel: activeChannel,
      senderId: currentUserEmployee.id,
      text: typedMsg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMsg]);
    setTypedMsg('');
  };

  const currentChannelMessages = messages.filter((m) => m.channel === activeChannel);

  // Call server-side Gemini assist-chat API to draft response based on channel history!
  const generateAiChatAssist = async () => {
    setAiLoading(true);
    setAiResult('');
    try {
      const response = await fetch('/api/gemini/assist-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channelName: activeChannel,
          messages: currentChannelMessages.map((m) => {
            const emp = employees.find((e) => e.id === m.senderId);
            return `${emp?.name || 'Unknown'}: ${m.text}`;
          }),
        }),
      });
      const data = await response.json();
      if (data.suggestion) {
        setAiResult(data.suggestion);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="h-[74vh] rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 shadow-sm overflow-hidden flex select-none">
      {/* Sidebar: Channels list */}
      <div className="w-56 border-r border-slate-100 dark:border-slate-800/80 p-4 space-y-4 shrink-0 bg-slate-50/20 dark:bg-slate-950/10">
        <div>
          <span className="text-[10px] uppercase font-mono font-bold text-slate-400">AGENCY CHAT</span>
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 font-display mt-1">Discussion Channels</h3>
        </div>

        <div className="space-y-1">
          {channelsList.map((ch) => (
            <button
              key={ch}
              onClick={() => {
                setActiveChannel(ch);
                setAiResult('');
              }}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center space-x-2 cursor-pointer ${
                activeChannel === ch
                  ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
              }`}
            >
              <Hash className="w-4 h-4 text-slate-400" />
              <span>{ch.substring(1)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Primary chat workspace split */}
      <div className="flex-1 flex flex-col justify-between">
        {/* Header */}
        <div className="px-6 h-[56px] border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Hash className="w-4.5 h-4.5 text-indigo-500" />
            <span className="text-xs font-bold font-display text-slate-800 dark:text-slate-100">{activeChannel.substring(1)}</span>
          </div>

          <button
            onClick={generateAiChatAssist}
            disabled={aiLoading}
            className="flex items-center px-2.5 py-1.5 rounded-xl border border-indigo-100 dark:border-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 text-[10px] font-bold cursor-pointer transition"
          >
            {aiLoading ? (
              <div className="w-3.5 h-3.5 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin mr-1.5" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 mr-1.5 animate-pulse text-indigo-500" />
            )}
            Gemini Chat Reply Assist
          </button>
        </div>

        {/* Message Logs Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {currentChannelMessages.map((m) => {
            const sender = employees.find((e) => e.id === m.senderId);
            const isMe = currentUserEmployee?.id === m.senderId;
            return (
              <div key={m.id} className={`flex items-start space-x-3 max-w-xl ${isMe ? 'ml-auto flex-row-reverse space-x-reverse' : ''}`}>
                <img src={sender?.avatar} alt={sender?.name} className="w-8 h-8 rounded-full object-cover" />
                <div className={`p-3.5 rounded-2xl text-xs space-y-1 leading-relaxed ${isMe ? 'bg-indigo-600 text-white' : 'border border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300'}`}>
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-bold font-display">{sender?.name}</span>
                    <span className="text-[9px] font-mono opacity-60">{m.time}</span>
                  </div>
                  <p>{m.text}</p>
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* AI suggested draft preview bar */}
        <AnimatePresence>
          {aiResult && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-indigo-100 dark:border-indigo-950 bg-indigo-50/20 dark:bg-indigo-950/10 p-4 relative"
            >
              <button
                onClick={() => setAiResult('')}
                className="absolute right-3 top-3 p-1 rounded-lg hover:bg-indigo-100 text-slate-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="space-y-2 max-w-2xl">
                <span className="text-[10px] uppercase font-mono font-bold text-indigo-500 flex items-center">
                  <Sparkles className="w-3 h-3 mr-1" /> GEMINI REPLY SUGGESTION (CLICK TO INSERT)
                </span>
                <p
                  onClick={() => {
                    setTypedMsg(aiResult);
                    setAiResult('');
                  }}
                  className="text-xs text-slate-600 dark:text-slate-300 leading-normal p-2.5 bg-white dark:bg-slate-950 border border-indigo-100 dark:border-indigo-950/40 rounded-xl cursor-pointer hover:border-indigo-500/50 transition font-medium"
                >
                  {aiResult}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Typed form footer */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 dark:border-slate-850 bg-white dark:bg-slate-900 flex items-center space-x-3">
          <input
            type="text"
            placeholder={`Send message to ${activeChannel}...`}
            value={typedMsg}
            onChange={(e) => setTypedMsg(e.target.value)}
            required
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/25 dark:bg-slate-950/15 text-xs outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer transition shrink-0 shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
