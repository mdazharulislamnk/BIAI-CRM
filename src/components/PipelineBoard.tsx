"use client";

import React, { useState } from "react";
import { Enquiry } from "@/lib/types";
import { PipelineColumn } from "./PipelineColumn";

interface PipelineBoardProps {
  enquiries: Enquiry[];
  onSelectEnquiry: (enquiry: Enquiry) => void;
  onAdvanceStage: (enquiry: Enquiry, nextStage: string, e: React.MouseEvent) => void;
}

const STAGES = ["New", "Contacted", "Interested", "Paid", "Lost"];

export const PipelineBoard: React.FC<PipelineBoardProps> = ({
  enquiries,
  onSelectEnquiry,
  onAdvanceStage,
}) => {
  // Mobile stage tab selection
  const [activeMobileStage, setActiveMobileStage] = useState<string>("ALL");

  return (
    <div className="w-full">
      {/* Mobile Stage Selector Tabs (Visible only on <lg screens) */}
      <div className="lg:hidden flex items-center space-x-1.5 overflow-x-auto pb-3 mb-3 scrollbar-none">
        <button
          onClick={() => setActiveMobileStage("ALL")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeMobileStage === "ALL"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-white text-slate-600 border border-slate-200"
          }`}
        >
          All Stages ({enquiries.length})
        </button>
        {STAGES.map((stg) => {
          const count = enquiries.filter((e) => e.status === stg).length;
          const isSelected = activeMobileStage === stg;
          return (
            <button
              key={stg}
              onClick={() => setActiveMobileStage(stg)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                isSelected
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <span>{stg}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isSelected ? "bg-emerald-700 text-white" : "bg-slate-100 text-slate-700"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Desktop & Tablet: Full-Screen 5-Column Responsive Grid */}
      <div className="hidden lg:grid lg:grid-cols-5 gap-3.5 w-full">
        {STAGES.map((stage) => {
          const stageEnquiries = enquiries.filter((e) => e.status === stage);
          return (
            <PipelineColumn
              key={stage}
              stage={stage}
              enquiries={stageEnquiries}
              totalCount={enquiries.length}
              onSelectEnquiry={onSelectEnquiry}
              onAdvanceStage={onAdvanceStage}
            />
          );
        })}
      </div>

      {/* Mobile Screen: Renders selected stage column (or stacked) */}
      <div className="lg:hidden space-y-4">
        {STAGES.filter((stg) => activeMobileStage === "ALL" || activeMobileStage === stg).map((stage) => {
          const stageEnquiries = enquiries.filter((e) => e.status === stage);
          return (
            <PipelineColumn
              key={stage}
              stage={stage}
              enquiries={stageEnquiries}
              totalCount={enquiries.length}
              onSelectEnquiry={onSelectEnquiry}
              onAdvanceStage={onAdvanceStage}
            />
          );
        })}
      </div>
    </div>
  );
};
