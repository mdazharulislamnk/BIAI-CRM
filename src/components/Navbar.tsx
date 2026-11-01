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
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 flex items-center justify-center text-white font-black text-lg shadow-sm shadow-emerald-500/20">
            AI
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">BIAI CRM</h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100/80 text-emerald-800 border border-emerald-200">
                <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" />
                Task 1 Production
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Multi-Channel Lead Intelligence &amp; Triage (Bangla / Banglish / English)
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Reset to Sample Data */}
          <button
            onClick={onResetData}
            disabled={isResetting}
            title="Reset database to original 20 sample enquiries"
            className="inline-flex items-center px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-all border border-slate-200 disabled:opacity-50 cursor-pointer shadow-2xs"
          >
            <RotateCcw className={`w-3.5 h-3.5 mr-1.5 ${isResetting ? "animate-spin text-emerald-600" : ""}`} />
            <span className="hidden md:inline">{isResetting ? "Resetting..." : "Reset Sample Data"}</span>
            <span className="md:hidden">Reset</span>
          </button>

          {/* AI Weekly Summary */}
          <button
            onClick={onOpenSummary}
            className="inline-flex items-center px-3.5 py-2 text-xs sm:text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100/80 rounded-xl transition-all border border-indigo-200/80 cursor-pointer shadow-2xs"
          >
            <FileText className="w-4 h-4 mr-1.5 text-indigo-600" />
            <span className="hidden md:inline">AI Weekly Summary</span>
            <span className="md:hidden">Summary</span>
          </button>

          {/* Quick AI Intake (Primary) */}
          <button
            onClick={onOpenIntake}
            className="inline-flex items-center px-4 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl shadow-sm shadow-emerald-600/30 transition-all hover:shadow-md cursor-pointer"
          >
            <Sparkles className="w-4 h-4 mr-1.5 text-emerald-100" />
            <span>AI Quick Intake</span>
          </button>
        </div>
      </div>
    </header>
  );
};
