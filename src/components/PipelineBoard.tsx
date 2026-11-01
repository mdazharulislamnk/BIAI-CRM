"use client";

import React from "react";
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
  return (
    <div className="flex gap-4 overflow-x-auto pb-6 pt-1 items-start">
      {STAGES.map((stage) => {
        const stageEnquiries = enquiries.filter((e) => e.status === stage);
        return (
          <PipelineColumn
            key={stage}
            stage={stage}
            enquiries={stageEnquiries}
            onSelectEnquiry={onSelectEnquiry}
            onAdvanceStage={onAdvanceStage}
          />
        );
      })}
    </div>
  );
};
