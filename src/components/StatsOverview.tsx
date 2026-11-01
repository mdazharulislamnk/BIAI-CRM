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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5 w-full">
      {/* Total Leads */}
      <div 
        onClick={onResetFilters}
        className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between group"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Enquiries</span>
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{total}</p>
          <span className="text-[11px] text-slate-400 font-medium">All 20 sample records</span>
        </div>
      </div>

      {/* Overdue (>48h) Reminder */}
      <div
        onClick={onFilterOverdue}
        className={`p-4 rounded-2xl border shadow-2xs transition-all cursor-pointer flex flex-col justify-between group ${
          overdueCount > 0 
            ? "bg-amber-50/40 border-amber-300/80 hover:border-amber-400 hover:shadow-amber-100" 
            : "bg-white border-slate-200/90"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Follow-up Needed</span>
            {overdueCount > 0 && (
              <span className="inline-flex px-1.5 py-0.2 rounded-md text-[9px] font-black bg-amber-200 text-amber-900 animate-pulse">
                &gt;48H
              </span>
            )}
          </div>
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <p className="text-2xl sm:text-3xl font-black text-amber-700 tracking-tight">{overdueCount}</p>
          <span className="text-[11px] text-amber-700/80 font-medium flex items-center">
            Needs action <ArrowUpRight className="w-3 h-3 ml-0.5" />
          </span>
        </div>
      </div>

      {/* Active Conversions / Paid */}
      <div 
        onClick={onFilterPaid}
        className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between group"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Enrollments / Paid</span>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight">{paidCount}</p>
          <span className="text-[11px] text-emerald-600/80 font-medium">Closed deals</span>
        </div>
      </div>

      {/* Support & Quarantined Spam */}
      <div
        onClick={onFilterSupport}
        className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-rose-300 transition-all cursor-pointer flex flex-col justify-between group"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Support &amp; Spam</span>
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl sm:text-3xl font-black text-rose-600 tracking-tight">{supportCount}</span>
            <span className="text-xs text-slate-400 font-semibold">urgent /</span>
            <span className="text-xl font-bold text-slate-600">{spamCount}</span>
            <span className="text-[10px] text-slate-400">spam</span>
          </div>
          <span className="text-[11px] text-rose-600/80 font-medium">Triaged</span>
        </div>
      </div>
    </div>
  );
};
