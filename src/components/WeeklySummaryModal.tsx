"use client";

import React, { useState, useEffect } from "react";
import { X, Sparkles, Copy, Check, RefreshCw, FileText, TrendingUp, AlertTriangle, CheckCircle, ShieldAlert } from "lucide-react";

interface WeeklySummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Formats markdown into clean, styled executive blocks
 */
function renderMarkdownContent(content: string) {
  if (!content) return null;

  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (!trimmed) {
      elements.push(<div key={`empty-${index}`} className="h-2" />);
      return;
    }

    // Top Level Header
    if (trimmed.startsWith("# ")) {
      elements.push(
        <h2 key={index} className="text-xl font-bold text-slate-900 pb-2 border-b border-slate-200 mt-2 mb-3">
          {trimmed.replace("# ", "")}
        </h2>
      );
      return;
    }

    // Sub Header
    if (trimmed.startsWith("### ") || trimmed.startsWith("## ")) {
      const heading = trimmed.replace(/^###?\s+/, "");
      elements.push(
        <div key={index} className="flex items-center space-x-2 mt-5 mb-2 pt-2 border-t border-slate-100">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
            {heading}
          </h3>
        </div>
      );
      return;
    }

    // Divider
    if (trimmed === "---") {
      elements.push(<hr key={index} className="my-3 border-slate-200" />);
      return;
    }

    // Bullet points
    if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
      const bulletText = trimmed.replace(/^(\*|-)\s+/, "");
      // Format bold text inside bullets
      const formatted = bulletText.split(/(\*\*.*?\*\*)/g).map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      elements.push(
        <div key={index} className="flex items-start space-x-2.5 my-1 pl-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{formatted}</p>
        </div>
      );
      return;
    }

    // Normal paragraph with bold highlights
    const formattedParagraph = line.split(/(\*\*.*?\*\*)/g).map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });

    elements.push(
      <p key={index} className="text-xs sm:text-sm text-slate-700 leading-relaxed my-1">
        {formattedParagraph}
      </p>
    );
  });

  return elements;
}

export const WeeklySummaryModal: React.FC<WeeklySummaryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [report, setReport] = useState<string>("");
  const [metrics, setMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/weekly-summary", {
        method: "POST",
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to generate summary");
      setReport(data.report);
      setMetrics(data.metrics);
    } catch (err: any) {
      setError(err.message || "Failed to generate report");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !report) {
      fetchSummary();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/90 sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">AI Weekly Executive Briefing</h3>
              <p className="text-xs text-slate-500">Synthesized by Gemini 3 from live CRM pipeline metrics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top KPI Ribbon (If available) */}
        {metrics && !isLoading && (
          <div className="px-6 py-3 bg-indigo-50/50 border-b border-indigo-100/60 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <span><strong>{metrics.total}</strong> Enquiries Tracked</span>
            </div>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span><strong className="text-amber-700">{metrics.overdueCount}</strong> &gt;48h Overdue</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span><strong className="text-emerald-700">{metrics.byStage?.Paid || 0}</strong> Enrollments</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span><strong className="text-rose-700">{(metrics.byCategory?.SUPPORT || 0) + (metrics.byCategory?.SPAM || 0)}</strong> Triaged Non-sales</span>
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-3">
          {isLoading ? (
            <div className="h-72 flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center animate-bounce">
                <Sparkles className="w-6 h-6 animate-spin" />
              </div>
              <p className="text-sm font-semibold text-slate-700">
                Gemini 3 is synthesizing pipeline velocity, conversions &amp; bottlenecks...
              </p>
              <p className="text-xs text-slate-400">Reading live records from SQLite database</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm">
              <p className="font-semibold">Unable to generate summary</p>
              <p className="text-xs mt-1">{error}</p>
              <button
                onClick={fetchSummary}
                className="mt-3 px-3 py-1.5 text-xs font-semibold bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
              >
                Retry Generation
              </button>
            </div>
          ) : (
            <div className="bg-slate-50/80 p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-inner">
              {renderMarkdownContent(report)}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 flex justify-between items-center bg-slate-50/90 sticky bottom-0">
          <button
            onClick={fetchSummary}
            disabled={isLoading}
            className="inline-flex items-center px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-all shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? "animate-spin text-indigo-600" : ""}`} />
            Regenerate
          </button>

          <div className="flex space-x-2">
            <button
              onClick={handleCopy}
              disabled={!report || isLoading}
              className="inline-flex items-center px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-all shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                  <span className="text-emerald-600 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                  <span>Copy Report</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-sm"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
