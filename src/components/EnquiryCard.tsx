"use client";

import React from "react";
import { MessageSquare, Phone, Globe, Facebook, ArrowRight, Clock, ShieldAlert, Briefcase, AlertCircle } from "lucide-react";
import { Enquiry } from "@/lib/types";
import { formatDisplayDate } from "@/lib/utils";

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
  // Channel styling helper
  const getChannelDetails = (channel: string) => {
    switch (channel) {
      case "WhatsApp":
        return { label: "WhatsApp", icon: "WA", bg: "bg-emerald-50 text-emerald-700 border-emerald-200" };
      case "Facebook Messenger":
        return { label: "Messenger", icon: <Facebook className="w-2.5 h-2.5 text-blue-600" />, bg: "bg-blue-50 text-blue-700 border-blue-200" };
      case "Facebook comment":
        return { label: "FB Comment", icon: <Facebook className="w-2.5 h-2.5 text-blue-500" />, bg: "bg-sky-50 text-sky-700 border-sky-200" };
      case "Website form":
        return { label: "Website", icon: <Globe className="w-2.5 h-2.5 text-violet-600" />, bg: "bg-violet-50 text-violet-700 border-violet-200" };
      case "Phone call note":
        return { label: "Phone Call", icon: <Phone className="w-2.5 h-2.5 text-amber-600" />, bg: "bg-amber-50 text-amber-700 border-amber-200" };
      default:
        return { label: channel, icon: <MessageSquare className="w-2.5 h-2.5 text-slate-500" />, bg: "bg-slate-50 text-slate-700 border-slate-200" };
    }
  };

  // Course badge styling
  const getCourseBadgeColor = (interest: string) => {
    switch (interest) {
      case "3-Day Bootcamp":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "AI Fellowship":
        return "bg-sky-50 text-sky-700 border-sky-200";
      case "Corporate Training":
        return "bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
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
  const channelInfo = getChannelDetails(enquiry.channel);

  return (
    <div
      onClick={() => onSelect(enquiry)}
      className={`group bg-white p-2.5 sm:p-3 rounded-xl border transition-all duration-150 cursor-pointer shadow-2xs hover:shadow-xs hover:border-emerald-500/50 flex flex-col justify-between shrink-0 ${
        enquiry.category === 'SUPPORT' 
          ? 'border-rose-200 bg-gradient-to-b from-rose-50/20 to-white' 
          : enquiry.category === 'SPAM'
          ? 'border-zinc-200 opacity-75 hover:opacity-100'
          : 'border-slate-200/90'
      }`}
    >
      <div>
        {/* Top Badges Row */}
        <div className="flex items-center justify-between gap-1 mb-1.5">
          {/* Channel Tag */}
          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border ${channelInfo.bg}`}>
            {typeof channelInfo.icon === "string" ? (
              <span className="font-bold text-[9px]">{channelInfo.icon}</span>
            ) : (
              channelInfo.icon
            )}
            <span>{channelInfo.label}</span>
          </span>

          {/* Overdue Alert Badge */}
          {enquiry.isOverdue && (
            <span
              title="Needs follow-up! Over 48 hours without contact."
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-300"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
              <span>&gt;48h Overdue</span>
            </span>
          )}
        </div>

        {/* Sender Name & Phone */}
        <div className="mb-1.5">
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
            {enquiry.senderName || "Unknown Sender"}
          </h4>
          {enquiry.phone && (
            <p className="text-[11px] text-slate-400 font-mono flex items-center mt-0.5">
              <Phone className="w-2.5 h-2.5 mr-1 text-slate-400" />
              {enquiry.phone}
            </p>
          )}
        </div>

        {/* Program Tag & Triage Tag */}
        <div className="flex flex-wrap items-center gap-1 mb-2">
          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${getCourseBadgeColor(enquiry.interest)}`}>
            {enquiry.interest}
          </span>

          {enquiry.category === "SUPPORT" && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
              <AlertCircle className="w-2.5 h-2.5 text-rose-600" />
              Urgent Support
            </span>
          )}

          {enquiry.category === "SPAM" && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-zinc-100 text-zinc-600 border border-zinc-300">
              <ShieldAlert className="w-2.5 h-2.5 text-zinc-500" />
              Spam
            </span>
          )}

          {enquiry.category === "JOB_SEEKER" && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              <Briefcase className="w-2.5 h-2.5 text-indigo-500" />
              Job Seeker
            </span>
          )}
        </div>

        {/* Message snippet in clean quote container */}
        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-[11px] text-slate-600 italic line-clamp-2 leading-relaxed mb-2">
          &ldquo;{enquiry.message}&rdquo;
        </div>
      </div>

      {/* Footer: Date & Quick Advance */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
        <span>{formatDisplayDate(enquiry.receivedAt)}</span>

        {nextStage && (
          <button
            onClick={(e) => onAdvanceStage(enquiry, nextStage, e)}
            className="inline-flex items-center px-2 py-0.5 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-md border border-emerald-200 transition-all cursor-pointer"
            title={`Move to ${nextStage}`}
          >
            <span>{nextStage}</span>
            <ArrowRight className="w-2.5 h-2.5 ml-1" />
          </button>
        )}
      </div>
    </div>
  );
};
