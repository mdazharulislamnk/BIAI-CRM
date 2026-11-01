"use client";

import React from "react";
import { Enquiry } from "@/lib/types";
import { EnquiryCard } from "./EnquiryCard";
import { CheckCircle2, Inbox } from "lucide-react";

interface PipelineColumnProps {
  stage: string;
  enquiries: Enquiry[];
  totalCount: number;
  onSelectEnquiry: (enquiry: Enquiry) => void;
  onAdvanceStage: (enquiry: Enquiry, nextStage: string, e: React.MouseEvent) => void;
}

export const PipelineColumn: React.FC<PipelineColumnProps> = ({
  stage,
  enquiries,
  totalCount,
  onSelectEnquiry,
  onAdvanceStage,
}) => {
  // Stage styling
  const getStageMeta = (stg: string) => {
    switch (stg) {
      case "New":
        return { dot: "bg-blue-500", border: "border-blue-200", badge: "bg-blue-50 text-blue-700" };
      case "Contacted":
        return { dot: "bg-amber-500", border: "border-amber-200", badge: "bg-amber-50 text-amber-700" };
      case "Interested":
        return { dot: "bg-purple-500", border: "border-purple-200", badge: "bg-purple-50 text-purple-700" };
      case "Paid":
        return { dot: "bg-emerald-500", border: "border-emerald-200", badge: "bg-emerald-50 text-emerald-700" };
      case "Lost":
        return { dot: "bg-slate-400", border: "border-slate-200", badge: "bg-slate-100 text-slate-600" };
      default:
        return { dot: "bg-slate-400", border: "border-slate-200", badge: "bg-slate-100 text-slate-700" };
    }
  };

  const meta = getStageMeta(stage);
  const percentage = totalCount > 0 ? Math.round((enquiries.length / totalCount) * 100) : 0;

  return (
    <div className="w-full h-full max-h-full flex flex-col bg-slate-100/90 rounded-2xl p-2 sm:p-2.5 border border-slate-200/90 shadow-2xs overflow-hidden">
      {/* Column Header (Fixed, won't scroll) */}
      <div className="flex items-center justify-between px-2.5 py-1.5 mb-2 bg-white/90 rounded-xl border border-slate-200/80 shadow-2xs shrink-0">
        <div className="flex items-center space-x-2">
          <span className={`w-2 h-2 rounded-full ${meta.dot} shadow-xs shrink-0`} />
          <h3 className="font-bold text-slate-900 text-xs sm:text-sm tracking-tight truncate">{stage}</h3>
        </div>
        <div className="flex items-center space-x-1.5 shrink-0">
          <span className="text-[10px] text-slate-400 font-medium">{percentage}%</span>
          <span className="text-xs font-bold text-slate-800 bg-slate-100 px-1.5 py-0.2 rounded-full border border-slate-200">
            {enquiries.length}
          </span>
        </div>
      </div>

      {/* Cards Scroll Container: Smooth Independent Inner Box Scrolling */}
      <div className="flex-1 min-h-0 column-scroll space-y-2.5 pr-1 pb-1">
        {enquiries.length === 0 ? (
          <div className="h-40 border-2 border-dashed border-slate-200/80 rounded-xl flex flex-col items-center justify-center p-4 text-center my-auto">
            {stage === "Paid" ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-400 mb-1" />
            ) : (
              <Inbox className="w-6 h-6 text-slate-300 mb-1" />
            )}
            <p className="text-xs font-semibold text-slate-500">No leads in {stage}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {stage === "Paid" ? "Advance leads to close" : "Leads move here when updated"}
            </p>
          </div>
        ) : (
          enquiries.map((enquiry) => (
            <EnquiryCard
              key={enquiry.id}
              enquiry={enquiry}
              onSelect={onSelectEnquiry}
              onAdvanceStage={onAdvanceStage}
            />
          ))
        )}
      </div>
    </div>
  );
};
