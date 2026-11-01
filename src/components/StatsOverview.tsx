"use client";

import React from "react";
import { Users, AlertTriangle, CheckCircle2, ShieldAlert, ArrowUpRight } from "lucide-react";
import { Enquiry } from "@/lib/types";

interface StatsOverviewProps {
  enquiries: Enquiry[];
  onFilterOverdue?: () => void;
  onFilterSupport?: () => void;
  onFilterPaid?: () => void;
  onResetFilters?: () => void;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  enquiries,
  onFilterOverdue,
  onFilterSupport,
  onFilterPaid,
  onResetFilters,
}) => {
  const total = enquiries.length;
  const overdueCount = enquiries.filter((e) => e.isOverdue).length;
  const paidCount = enquiries.filter((e) => e.status === "Paid").length;
  const supportCount = enquiries.filter((e) => e.category === "SUPPORT").length;
  const spamCount = enquiries.filter((e) => e.category === "SPAM").length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mb-2.5 w-full shrink-0">
      {/* Total Leads */}
      <div 
        onClick={onResetFilters}
        className="bg-white px-3.5 py-2 rounded-xl border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all cursor-pointer flex items-center justify-between"
      >
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Enquiries</span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-lg font-black text-slate-900 leading-tight">{total}</span>
              <span className="text-[10px] text-slate-400 font-medium">all channels</span>
            </div>
          </div>
        </div>
      </div>

      {/* Overdue (>48h) Reminder */}
      <div
        onClick={onFilterOverdue}
        className={`px-3.5 py-2 rounded-xl border shadow-2xs transition-all cursor-pointer flex items-center justify-between ${
          overdueCount > 0 
            ? "bg-amber-50/50 border-amber-300/80 hover:border-amber-400" 
            : "bg-white border-slate-200/90"
        }`}
      >
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Follow-Up Needed</span>
              <span className="px-1 py-0.2 rounded text-[8px] font-black bg-amber-200 text-amber-900">
                &gt;48H
              </span>
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-lg font-black text-amber-700 leading-tight">{overdueCount}</span>
              <span className="text-[10px] text-amber-700/80 font-medium flex items-center">
                needs action <ArrowUpRight className="w-2.5 h-2.5 ml-0.5" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Conversions / Paid */}
      <div 
        onClick={onFilterPaid}
        className="bg-white px-3.5 py-2 rounded-xl border border-slate-200/90 shadow-2xs hover:border-emerald-300 transition-all cursor-pointer flex items-center justify-between"
      >
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Enrollments / Paid</span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-lg font-black text-emerald-600 leading-tight">{paidCount}</span>
              <span className="text-[10px] text-emerald-600/80 font-medium">closed deals</span>
            </div>
          </div>
        </div>
      </div>

      {/* Support & Quarantined Spam */}
      <div
        onClick={onFilterSupport}
        className="bg-white px-3.5 py-2 rounded-xl border border-slate-200/90 shadow-2xs hover:border-rose-300 transition-all cursor-pointer flex items-center justify-between"
      >
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Support &amp; Spam</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-lg font-black text-rose-600 leading-tight">{supportCount}</span>
              <span className="text-[10px] text-slate-400 font-semibold">support /</span>
              <span className="text-sm font-bold text-slate-600">{spamCount}</span>
              <span className="text-[9px] text-slate-400">spam</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
