"use client";

import React from "react";
import { Sparkles, FileText, RotateCcw, ShieldCheck } from "lucide-react";

interface NavbarProps {
  onOpenIntake: () => void;
  onOpenSummary: () => void;
  onResetData: () => void;
  isResetting: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenIntake,
  onOpenSummary,
  onResetData,
  isResetting,
}) => {
  return (
    /* Top margin container: Creates elegant breathing room from the browser tab */
    <div className="w-full px-3 sm:px-6 pt-2.5 sm:pt-3.5 shrink-0 z-30">
      <header className="h-13 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-xs w-full px-3 sm:px-5 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white font-black text-sm shadow-xs">
            AI
          </div>
          <div className="flex items-center space-x-2">
            <h1 className="text-base font-bold tracking-tight text-slate-900">BIAI CRM</h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" />
              Task 1 Production
            </span>
          </div>
          <span className="text-[11px] text-slate-400 hidden md:inline border-l border-slate-200 pl-2 ml-1 font-medium">
            Multi-Channel Lead Intelligence &amp; Triage
          </span>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* Reset to Sample Data */}
          <button
            onClick={onResetData}
            disabled={isResetting}
            title="Reset database to original 20 sample enquiries"
            className="inline-flex items-center px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors border border-slate-200 disabled:opacity-50 cursor-pointer"
          >
            <RotateCcw className={`w-3.5 h-3.5 mr-1 ${isResetting ? "animate-spin text-emerald-600" : ""}`} />
            <span className="hidden sm:inline">{isResetting ? "Resetting..." : "Reset Data"}</span>
          </button>

          {/* AI Weekly Summary */}
          <button
            onClick={onOpenSummary}
            className="inline-flex items-center px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors border border-indigo-200/90 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
            <span>AI Weekly Summary</span>
          </button>

          {/* Quick AI Intake (Primary) */}
          <button
            onClick={onOpenIntake}
            className="inline-flex items-center px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-emerald-100" />
            <span>AI Quick Intake</span>
          </button>
        </div>
      </header>
    </div>
  );
};
