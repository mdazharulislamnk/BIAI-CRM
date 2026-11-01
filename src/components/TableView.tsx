"use client";

import React from "react";
import { Enquiry, PipelineStage } from "@/lib/types";
import { formatDisplayDate, getStageBadge, getCategoryBadge } from "@/lib/utils";
import { MessageSquare, Phone, Globe, Facebook, Copy, ExternalLink, ArrowRight, Clock, Trash2 } from "lucide-react";

interface TableViewProps {
  enquiries: Enquiry[];
  onSelectEnquiry: (enquiry: Enquiry) => void;
  onAdvanceStage: (enquiry: Enquiry, nextStage: string, e: React.MouseEvent) => void;
  onDeleteEnquiry: (id: string, e: React.MouseEvent) => void;
}

export const TableView: React.FC<TableViewProps> = ({
  enquiries,
  onSelectEnquiry,
  onAdvanceStage,
  onDeleteEnquiry,
}) => {
  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getNextStage = (current: string): string | null => {
    switch (current) {
      case "New": return "Contacted";
      case "Contacted": return "Interested";
      case "Interested": return "Paid";
      default: return null;
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50/90 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-4">Contact</th>
              <th className="py-3.5 px-3">Channel</th>
              <th className="py-3.5 px-3">Course Wanted</th>
              <th className="py-3.5 px-3">Message Preview</th>
              <th className="py-3.5 px-3">Status / Stage</th>
              <th className="py-3.5 px-3">Overdue</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {enquiries.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400 text-sm">
                  No enquiries match the selected filters.
                </td>
              </tr>
            ) : (
              enquiries.map((enquiry) => {
                const stageBadge = getStageBadge(enquiry.status);
                const categoryBadge = getCategoryBadge(enquiry.category);
                const nextStage = getNextStage(enquiry.status);

                return (
                  <tr
                    key={enquiry.id}
                    onClick={() => onSelectEnquiry(enquiry)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    {/* Contact */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-100 to-slate-200 border border-slate-300/60 flex items-center justify-center font-bold text-xs text-slate-700 shrink-0">
                          {getInitials(enquiry.senderName)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                            {enquiry.senderName || "Unknown Sender"}
                          </p>
                          <p className="text-xs text-slate-400 font-mono mt-0.5">
                            {enquiry.phone || "No phone"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Channel */}
                    <td className="py-3.5 px-3 text-xs text-slate-600 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 font-medium border border-slate-200/80">
                        {enquiry.channel}
                      </span>
                    </td>

                    {/* Course Wanted */}
                    <td className="py-3.5 px-3 text-xs whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {enquiry.interest}
                      </span>
                    </td>

                    {/* Message Preview */}
                    <td className="py-3.5 px-3 max-w-xs text-xs text-slate-600 line-clamp-2">
                      <p className="truncate italic">&ldquo;{enquiry.message}&rdquo;</p>
                      {enquiry.category !== "LEAD" && (
                        <span className={`inline-flex px-1.5 py-0.2 rounded text-[10px] font-bold border mt-1 ${categoryBadge.bg}`}>
                          {categoryBadge.label}
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${stageBadge.bg}`}>
                        {enquiry.status}
                      </span>
                    </td>

                    {/* Overdue */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      {enquiry.isOverdue ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          <Clock className="w-3 h-3 text-amber-600" />
                          &gt;48h
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">On track</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end space-x-2">
                        {nextStage && (
                          <button
                            onClick={(e) => onAdvanceStage(enquiry, nextStage, e)}
                            className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors"
                          >
                            <span>{nextStage}</span>
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </button>
                        )}
                        <button
                          onClick={(e) => onDeleteEnquiry(enquiry.id, e)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors rounded hover:bg-rose-50"
                          title="Delete enquiry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
