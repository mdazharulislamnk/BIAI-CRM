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
  const [activeMobileStage, setActiveMobileStage] = useState<string>("ALL");

  return (
    <div className="w-full h-full max-h-full flex flex-col flex-1 min-h-0 overflow-hidden">
      {/* Mobile Stage Selector Tabs (Visible only on <lg screens) */}
      <div className="lg:hidden flex items-center space-x-1.5 overflow-x-auto pb-2 mb-2 scrollbar-none shrink-0">
        <button
          onClick={() => setActiveMobileStage("ALL")}
          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
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
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
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

      {/* Desktop & Tablet: 100% Height, 5-Column Grid, Zero Window Vertical Scroll, Full Inner Scroll */}
      <div className="hidden lg:grid lg:grid-cols-5 gap-3 w-full h-full max-h-full flex-1 min-h-0 overflow-hidden">
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

      {/* Mobile Screen: Stacked/Selected Column */}
      <div className="lg:hidden flex-1 min-h-0 overflow-hidden">
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
