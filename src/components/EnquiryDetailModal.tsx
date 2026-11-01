"use client";

import React, { useState } from "react";
import { X, Copy, Check, MessageSquare, Phone, Trash2, Clock, ExternalLink } from "lucide-react";
import { Enquiry, PipelineStage } from "@/lib/types";
import { formatDisplayDate, getCategoryBadge, getStageBadge } from "@/lib/utils";

interface EnquiryDetailModalProps {
  enquiry: Enquiry | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStage: (id: string, newStage: PipelineStage) => Promise<void>;
  onUpdateNotes: (id: string, notes: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const STAGES: PipelineStage[] = ["New", "Contacted", "Interested", "Paid", "Lost"];

export const EnquiryDetailModal: React.FC<EnquiryDetailModalProps> = ({
  enquiry,
  isOpen,
  onClose,
  onUpdateStage,
  onUpdateNotes,
  onDelete,
}) => {
  const [copied, setCopied] = useState(false);
  const [notes, setNotes] = useState(enquiry?.notes || "");
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);

  // Sync state when enquiry opens
  React.useEffect(() => {
    if (enquiry) {
      setNotes(enquiry.notes || "");
    }
  }, [enquiry]);

  if (!isOpen || !enquiry) return null;

  const categoryBadge = getCategoryBadge(enquiry.category);
  const stageBadge = getStageBadge(enquiry.status);

  const handleCopyReply = () => {
    if (!enquiry.suggestedReply) return;
    navigator.clipboard.writeText(enquiry.suggestedReply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    await onUpdateNotes(enquiry.id, notes);
    setIsSavingNotes(false);
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  };

  const handleWhatsAppRedirect = () => {
    if (!enquiry.phone) return;
    const cleanPhone = enquiry.phone.replace(/[^0-9]/g, "");
    const formattedPhone = cleanPhone.startsWith("88") ? cleanPhone : `88${cleanPhone}`;
    const text = encodeURIComponent(enquiry.suggestedReply || "");
    window.open(`https://wa.me/${formattedPhone}?text=${text}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 sticky top-0 z-10">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-slate-900">
                {enquiry.senderName || "Unknown Sender"}
              </h3>
              <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${categoryBadge.bg}`}>
                {categoryBadge.label}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center">
              <span>{enquiry.channel}</span>
              <span className="mx-1.5">•</span>
              <span>{formatDisplayDate(enquiry.receivedAt)}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 flex-1">
          {/* Overdue Notice if applicable */}
          {enquiry.isOverdue && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-amber-600 shrink-0" />
                <span>
                  <strong>48h Overdue:</strong> This lead has had no follow-up progress in over 48 hours.
                </span>
              </div>
              <button
                onClick={() => onUpdateStage(enquiry.id, "Contacted")}
                className="px-2.5 py-1 text-[11px] font-bold bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
              >
                Mark Contacted
              </button>
            </div>
          )}

          {/* Key Details Row */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Phone Number
              </span>
              <span className="text-sm font-mono text-slate-900 font-medium">
                {enquiry.phone || "No phone provided"}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Program of Interest
              </span>
              <span className="text-sm font-semibold text-emerald-700">
                {enquiry.interest}
              </span>
            </div>
          </div>

          {/* Original Message */}
          <div>
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1.5">
              Original Message Received
            </label>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-800 italic leading-relaxed">
              &ldquo;{enquiry.message}&rdquo;
            </div>
          </div>

          {/* AI Suggested Reply */}
          {enquiry.suggestedReply && (
            <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center">
                  <MessageSquare className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                  AI Suggested Reply ({enquiry.detectedLang || "Matching Style"})
                </span>

                <div className="flex items-center space-x-2">
                  {enquiry.phone && (
                    <button
                      onClick={handleWhatsAppRedirect}
                      className="inline-flex items-center px-2 py-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded border border-emerald-300 transition-colors"
                      title="Open in WhatsApp Web"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Send WhatsApp
                    </button>
                  )}
                  <button
                    onClick={handleCopyReply}
                    className="inline-flex items-center px-2 py-1 text-[11px] font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 rounded border border-slate-200 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 mr-1 text-emerald-600" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 mr-1 text-slate-500" />
                        <span>Copy Reply</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <p className="text-sm text-slate-800 leading-relaxed bg-white p-3 rounded-lg border border-emerald-100 font-sans">
                {enquiry.suggestedReply}
              </p>
            </div>
          )}

          {/* Pipeline Stage Transition Buttons */}
          <div>
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2">
              Move Pipeline Stage
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {STAGES.map((stg) => {
                const isCurrent = enquiry.status === stg;
                return (
                  <button
                    key={stg}
                    onClick={() => onUpdateStage(enquiry.id, stg)}
                    className={`py-2 text-xs font-semibold rounded-lg border transition-all text-center ${
                      isCurrent
                        ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                    }`}
                  >
                    {stg}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Counselor Notes */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Internal Counselor Notes
              </label>
              {notesSaved && (
                <span className="text-xs text-emerald-600 font-semibold flex items-center">
                  <Check className="w-3.5 h-3.5 mr-1" /> Saved
                </span>
              )}
            </div>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Called student, interested in batch 2 starting Nov 15..."
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
            />
            <div className="flex justify-end mt-1.5">
              <button
                type="button"
                onClick={handleSaveNotes}
                disabled={isSavingNotes}
                className="px-3 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-200"
              >
                {isSavingNotes ? "Saving..." : "Save Note"}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 flex justify-between items-center bg-slate-50/80 sticky bottom-0">
          <button
            onClick={() => onDelete(enquiry.id)}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            Delete Enquiry
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
