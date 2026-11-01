"use client";

import React from "react";
import { Enquiry } from "@/lib/types";
import { EnquiryCard } from "./EnquiryCard";
import { getStageBadge } from "@/lib/utils";

interface PipelineColumnProps {
  stage: string;
  enquiries: Enquiry[];
  onSelectEnquiry: (enquiry: Enquiry) => void;
  onAdvanceStage: (enquiry: Enquiry, nextStage: string, e: React.MouseEvent) => void;
}

export const PipelineColumn: React.FC<PipelineColumnProps> = ({
  stage,
  enquiries,
  onSelectEnquiry,
  onAdvanceStage,
}) => {
  const badge = getStageBadge(stage);

  return (
    <div className="flex flex-col flex-1 min-w-[270px] max-w-xs bg-slate-100/70 rounded-2xl p-3 border border-slate-200/70 h-[calc(100vh-270px)] min-h-[500px]">
      {/* Column Header */}
      <div className="flex items-center justify-between px-2 py-2 mb-2">
        <div className="flex items-center space-x-2">
          <span className={`w-2.5 h-2.5 rounded-full ${
            stage === 'New' ? 'bg-blue-500' :
            stage === 'Contacted' ? 'bg-amber-500' :
            stage === 'Interested' ? 'bg-purple-500' :
            stage === 'Paid' ? 'bg-emerald-500' : 'bg-slate-400'
          }`} />
          <h3 className="font-semibold text-slate-800 text-sm tracking-tight">{stage}</h3>
        </div>
        <span className="text-xs font-bold text-slate-600 bg-white px-2 py-0.5 rounded-full border border-slate-200 shadow-2xs">
          {enquiries.length}
        </span>
      </div>

      {/* Cards Scroll Container */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
        {enquiries.length === 0 ? (
          <div className="h-32 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-xs text-slate-400">
            No leads in {stage}
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
