"use client";

import React from "react";
import { Users, AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";
import { Enquiry } from "@/lib/types";

interface StatsOverviewProps {
  enquiries: Enquiry[];
  onFilterOverdue?: () => void;
  onFilterSupport?: () => void;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  enquiries,
  onFilterOverdue,
  onFilterSupport,
}) => {
  const total = enquiries.length;
  const overdueCount = enquiries.filter((e) => e.isOverdue).length;
  const paidCount = enquiries.filter((e) => e.status === "Paid").length;
  const supportCount = enquiries.filter((e) => e.category === "SUPPORT").length;
  const spamCount = enquiries.filter((e) => e.category === "SPAM").length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {/* Total Leads */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Enquiries</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{total}</p>
          <span className="text-[11px] text-slate-400">All channels active</span>
        </div>
        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
          <Users className="w-5 h-5" />
        </div>
      </div>

      {/* Overdue (>48h) Reminder */}
      <div
        onClick={onFilterOverdue}
        className={`bg-white p-4 rounded-xl border shadow-sm flex items-center justify-between cursor-pointer transition-all ${
          overdueCount > 0 ? "border-amber-300 hover:border-amber-400 bg-amber-50/20" : "border-slate-200"
        }`}
      >
        <div>
          <div className="flex items-center space-x-1.5">
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Follow-up Needed</p>
            {overdueCount > 0 && (
              <span className="inline-flex px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-200 text-amber-800">
                &gt;48h
              </span>
            )}
          </div>
          <p className="text-2xl font-bold text-amber-700 mt-1">{overdueCount}</p>
          <span className="text-[11px] text-amber-600/80">Pending in New/Contacted</span>
        </div>
        <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5" />
        </div>
      </div>

      {/* Active Conversions / Paid */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Enrollments / Paid</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{paidCount}</p>
          <span className="text-[11px] text-emerald-600/80">Confirmed revenue</span>
        </div>
        <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </div>

      {/* Support & Quarantined Spam */}
      <div
        onClick={onFilterSupport}
        className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between cursor-pointer hover:border-slate-300 transition-all"
      >
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Support &amp; Spam</p>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-bold text-rose-600">{supportCount}</span>
            <span className="text-xs text-slate-400">support /</span>
            <span className="text-lg font-semibold text-slate-600">{spamCount}</span>
            <span className="text-xs text-slate-400">spam</span>
          </div>
          <span className="text-[11px] text-rose-600/80">Triaged non-sales</span>
        </div>
        <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
          <ShieldAlert className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
