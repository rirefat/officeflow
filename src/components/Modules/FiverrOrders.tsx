/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { FiverrOrder } from '../../types';
import {
  ShoppingBag,
  Plus,
  Clock,
  Briefcase,
  FileText,
  DollarSign,
  Undo2,
  Sparkles,
  RefreshCw,
  Send,
  X,
  AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const FiverrOrders: React.FC = () => {
  const { fiverrOrders, addFiverrOrder, updateFiverrOrderStatus } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  
  // Create Order Form State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [buyerName, setBuyerName] = useState('');
  const [packageTier, setPackageTier] = useState<'Basic' | 'Standard' | 'Premium'>('Standard');
  const [gigTitle, setGigTitle] = useState('');
  const [price, setPrice] = useState(450);
  const [deliveryDays, setDeliveryDays] = useState(3);
  const [requirements, setRequirements] = useState('');

  // AI Suggestion State
  const [showAiModal, setShowAiModal] = useState(false);
  const [activeOrderForAi, setActiveOrderForAi] = useState<FiverrOrder | null>(null);
  const [aiTone, setAiTone] = useState('Professional & Reassuring');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{ subject: string; message: string } | null>(null);

  // Filter Gigs
  const filtered = fiverrOrders.filter((ord) => {
    const matchQuery = ord.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.gigTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = selectedStatus === 'All' || ord.status === selectedStatus;
    return matchQuery && matchStatus;
  });

  const statuses = ['All', 'Requirements', 'In Progress', 'Delivered', 'Revision', 'Completed'];

  // Countdown clock hooks
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getCountdownString = (deliveryDateStr: string) => {
    const target = new Date(deliveryDateStr);
    const diff = target.getTime() - now.getTime();
    if (diff <= 0) return 'Late';

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    let parts = [];
    if (d > 0) parts.push(`${d}d`);
    parts.push(`${h}h`);
    parts.push(`${m}m`);
    parts.push(`${s}s`);
    return parts.join(' ');
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !gigTitle || !requirements) return;

    // Calculate delivery date ISO string based on days
    const delivDate = new Date();
    delivDate.setDate(delivDate.getDate() + Number(deliveryDays));

    const numStr = Math.floor(100000 + Math.random() * 900000).toString(16).toUpperCase();

    addFiverrOrder({
      orderNumber: `#FO${numStr.slice(0,6)}`,
      buyerName,
      package: packageTier,
      gigTitle,
      price: Number(price),
      earnings: Math.floor(Number(price) * 0.8),
      deliveryDate: delivDate.toISOString().replace('T', ' ').slice(0, 16),
      status: 'In Progress',
      revisionsRemaining: packageTier === 'Premium' ? 5 : packageTier === 'Standard' ? 3 : 1,
      requirements,
      attachments: [],
      extensionsCount: 0,
    });

    // Reset Form
    setBuyerName('');
    setGigTitle('');
    setRequirements('');
    setPrice(450);
    setDeliveryDays(3);
    setShowCreateModal(false);
  };

  // Call real server-side Gemini suggest-reply API
  const generateAiReply = async () => {
    if (!activeOrderForAi) return;
    setAiLoading(true);
    setAiResult(null);
    try {
      const response = await fetch('/api/gemini/suggest-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerName: activeOrderForAi.buyerName,
          gigTitle: activeOrderForAi.gigTitle,
          requirements: activeOrderForAi.requirements,
          currentStatus: activeOrderForAi.status,
          replyTone: aiTone,
        }),
      });
      const data = await response.json();
      setAiResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  const openAiReplyModal = (order: FiverrOrder) => {
    setActiveOrderForAi(order);
    setShowAiModal(true);
    setAiResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Title & Filter bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex-1 max-w-md relative">
          <Briefcase className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Filter by Order ID, Buyer username, or gig..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-950/20 text-xs outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 transition"
          />
        </div>

        <div className="flex items-center space-x-3 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedStatus === st
                  ? 'bg-indigo-600 text-white'
                  : 'border border-slate-200/60 dark:border-slate-800/60 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              {st}
            </button>
          ))}

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/10 transition cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Record Order
          </button>
        </div>
      </div>

      {/* Fiverr Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((ord) => (
          <div
            key={ord.id}
            className="p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition"
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold font-mono text-slate-400">{ord.orderNumber}</span>
                  <h3 className="text-sm font-bold font-display text-slate-800 dark:text-slate-200 mt-1 line-clamp-1">
                    {ord.gigTitle}
                  </h3>
                </div>
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold font-mono tracking-wide ${
                  ord.status === 'Completed'
                    ? 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400'
                    : ord.status === 'Revision'
                    ? 'bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 animate-pulse'
                    : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                }`}>
                  {ord.status.toUpperCase()}
                </span>
              </div>

              {/* Requirements summary text */}
              <div className="p-3.5 rounded-xl bg-slate-50/50 dark:bg-slate-950/15 border border-slate-100 dark:border-slate-850/50">
                <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center">
                  <FileText className="w-3 h-3 mr-1" /> GIG REQUIREMENTS
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal line-clamp-3">
                  {ord.requirements}
                </p>
              </div>

              {/* Commission pricing grid details */}
              <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
                <div className="p-2 rounded-xl bg-slate-50/50 dark:bg-slate-850">
                  <span className="text-[9px] font-mono text-slate-400 uppercase block">Buyer price</span>
                  <strong className="text-slate-800 dark:text-slate-200 mt-0.5 block">${ord.price}</strong>
                </div>
                <div className="p-2 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600">
                  <span className="text-[9px] font-mono text-indigo-400 uppercase block">Commission fee (20%)</span>
                  <strong className="mt-0.5 block">-${ord.price - ord.earnings}</strong>
                </div>
                <div className="p-2 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-600">
                  <span className="text-[9px] font-mono text-emerald-400 uppercase block">Net Earning</span>
                  <strong className="mt-0.5 block">${ord.earnings}</strong>
                </div>
              </div>
            </div>

            {/* Timers & Interactive triggers */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              {ord.status !== 'Completed' && ord.status !== 'Delivered' ? (
                <div className="flex items-center text-rose-600">
                  <Clock className="w-4 h-4 mr-1.5 shrink-0 animate-pulse" />
                  <span className="text-xs font-bold font-mono tracking-tight">{getCountdownString(ord.deliveryDate)}</span>
                </div>
              ) : (
                <span className="text-xs text-slate-400 font-medium">Delivered</span>
              )}

              {/* Interactive buttons */}
              <div className="flex items-center space-x-2">
                {ord.status !== 'Completed' && (
                  <button
                    onClick={() => openAiReplyModal(ord)}
                    className="flex items-center px-2.5 py-1.5 rounded-xl border border-indigo-100 dark:border-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 text-xs font-semibold cursor-pointer transition"
                  >
                    <Sparkles className="w-3.5 h-3.5 mr-1" /> AI Reply
                  </button>
                )}

                {ord.status === 'In Progress' && (
                  <button
                    onClick={() => updateFiverrOrderStatus(ord.id, 'Delivered')}
                    className="px-2.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer transition"
                  >
                    Deliver Work
                  </button>
                )}

                {ord.status === 'Delivered' && (
                  <button
                    onClick={() => updateFiverrOrderStatus(ord.id, 'Completed')}
                    className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer transition"
                  >
                    Accept Order
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: Record Fiverr Order Form */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-base font-bold font-display text-slate-800 dark:text-slate-100 flex items-center">
                <ShoppingBag className="w-4.5 h-4.5 mr-2 text-indigo-600" /> Record Fiverr Order
              </h2>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Buyer Username</label>
                  <input
                    type="text"
                    placeholder="e.g. glow_vanya"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/20 text-xs outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Package tier</label>
                  <select
                    value={packageTier}
                    onChange={(e) => setPackageTier(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/20 text-xs outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
                  >
                    <option value="Basic">Basic</option>
                    <option value="Standard">Standard</option>
                    <option value="Premium">Premium</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Gig Title Description</label>
                <input
                  type="text"
                  placeholder="e.g. Design Modern E-Commerce UI UX in Figma"
                  value={gigTitle}
                  onChange={(e) => setGigTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/20 text-xs outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Total Price ($ USD)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/20 text-xs outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Delivery Days</label>
                  <input
                    type="number"
                    value={deliveryDays}
                    onChange={(e) => setDeliveryDays(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/20 text-xs outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Buyer Specifications Requirements</label>
                <textarea
                  rows={4}
                  placeholder="Paste details, brand colors, preferences, and design reference assets..."
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/20 text-xs outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/15 transition cursor-pointer"
              >
                Accept & Launch Order
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* MODAL: AI Reply Generator */}
      {showAiModal && activeOrderForAi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
                <span className="text-base font-bold font-display text-slate-800 dark:text-slate-100">
                  Gemini AI Fiverr Chat Helper
                </span>
              </div>
              <button onClick={() => setShowAiModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-50/50 dark:bg-slate-950/20 text-xs space-y-1">
                <p className="text-slate-500 dark:text-slate-400">Drafting reply for buyer <strong className="text-slate-800 dark:text-slate-100">@{activeOrderForAi.buyerName}</strong></p>
                <p className="text-slate-400">Order: {activeOrderForAi.gigTitle}</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Select Tone Vibe</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Professional & Reassuring', 'Enthusiastic & Friendly', 'Delivery of draft work', 'Apologetic for slight delay'].map((tone) => (
                    <button
                      key={tone}
                      onClick={() => setAiTone(tone)}
                      className={`px-3 py-2 rounded-xl border text-[11px] font-semibold transition text-center cursor-pointer ${
                        aiTone === tone
                          ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-500'
                      }`}
                    >
                      {tone.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={generateAiReply}
                disabled={aiLoading}
                className="w-full flex items-center justify-center py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-55 text-white font-bold text-xs transition cursor-pointer"
              >
                {aiLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                Generate suggested Fiverr Chat Reply
              </button>

              {aiResult && (
                <div className="p-4 rounded-xl border border-indigo-100 dark:border-indigo-950/30 bg-indigo-50/10 dark:bg-indigo-950/5 space-y-2">
                  <p className="text-xs font-bold text-indigo-900 dark:text-indigo-300 font-display">Suggested Fiverr Reply:</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-850">
                    {aiResult.message}
                  </p>
                  <div className="flex items-center justify-end">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(aiResult.message);
                        alert('Copied to clipboard!');
                      }}
                      className="px-3 py-1 text-[11px] font-bold text-indigo-600 hover:underline"
                    >
                      Copy message text
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
