"use client";

import React from "react";
import { MessageSquare, Phone, Globe, Facebook, AlertCircle, ArrowRight, Clock } from "lucide-react";
import { Enquiry } from "@/lib/types";
import { formatDisplayDate, getCategoryBadge } from "@/lib/utils";

interface EnquiryCardProps {
  enquiry: Enquiry;
  onSelect: (enquiry: Enquiry) => void;
  onAdvanceStage: (enquiry: Enquiry, nextStage: string, e: React.MouseEvent) => void;
}

export const EnquiryCard: React.FC<EnquiryCardProps> = ({
  enquiry,
  onSelect,
  onAdvanceStage,
}) => {
  const categoryBadge = getCategoryBadge(enquiry.category);

  // Channel icon helper
  const renderChannelIcon = (channel: string) => {
    switch (channel) {
      case "WhatsApp":
        return <span className="text-emerald-600 font-bold text-[11px] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">WA</span>;
      case "Facebook Messenger":
      case "Facebook comment":
        return <Facebook className="w-3.5 h-3.5 text-blue-600" />;
      case "Website form":
        return <Globe className="w-3.5 h-3.5 text-indigo-600" />;
      case "Phone call note":
        return <Phone className="w-3.5 h-3.5 text-amber-600" />;
      default:
        return <MessageSquare className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  // Next stage recommendation
  const getNextStage = (current: string): string | null => {
    switch (current) {
      case "New": return "Contacted";
      case "Contacted": return "Interested";
      case "Interested": return "Paid";
      default: return null;
    }
  };

  const nextStage = getNextStage(enquiry.status);

  return (
    <div
      onClick={() => onSelect(enquiry)}
      className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-emerald-500/40 transition-all cursor-pointer relative group flex flex-col justify-between"
    >
      <div>
        {/* Top Badges Row */}
        <div className="flex items-center justify-between gap-1.5 mb-2">
          {/* Channel Tag */}
          <div className="flex items-center space-x-1.5">
            {renderChannelIcon(enquiry.channel)}
            <span className="text-[11px] font-medium text-slate-500 truncate max-w-[100px]">
              {enquiry.channel}
            </span>
          </div>

          {/* Overdue Alert Badge */}
          {enquiry.isOverdue && (
            <span
              title="Needs follow-up! Over 48 hours without progress."
              className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse"
            >
              <Clock className="w-3 h-3 mr-0.5" />
              &gt;48h Overdue
            </span>
          )}
        </div>

        {/* Sender Name & Phone */}
        <div className="mb-2">
          <h4 className="text-sm font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
            {enquiry.senderName || "Unknown Sender"}
          </h4>
          {enquiry.phone && (
            <p className="text-xs text-slate-500 font-mono mt-0.5 flex items-center">
              <Phone className="w-3 h-3 mr-1 text-slate-400" />
              {enquiry.phone}
            </p>
          )}
        </div>

        {/* Program / Interest Tag & Category Tag */}
        <div className="flex flex-wrap gap-1 mb-2.5">
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
            {enquiry.interest}
          </span>
          {enquiry.category !== "LEAD" && (
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${categoryBadge.bg}`}>
              {categoryBadge.label}
            </span>
          )}
        </div>

        {/* Message snippet */}
        <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50/70 p-2 rounded-lg border border-slate-100 italic mb-2">
          &ldquo;{enquiry.message}&rdquo;
        </p>
      </div>

      {/* Footer: Date & Quick Advance */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>{formatDisplayDate(enquiry.receivedAt)}</span>

        {nextStage && (
          <button
            onClick={(e) => onAdvanceStage(enquiry, nextStage, e)}
            className="inline-flex items-center px-2 py-1 text-[11px] font-medium text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200 transition-colors"
            title={`Move to ${nextStage}`}
          >
            <span>{nextStage}</span>
            <ArrowRight className="w-3 h-3 ml-1" />
          </button>
        )}
      </div>
    </div>
  );
};
