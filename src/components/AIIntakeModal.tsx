"use client";

import React, { useState } from "react";
import { X, Sparkles, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { AIParsedResult } from "@/lib/types";

interface AIIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

const SAMPLE_PRESETS = [
  {
    label: "Sample 1: Rafi (Banglish)",
    text: "Assalamualaikum, apnader 3 day bootcamp er price koto? Payment kibhabe korbo?",
  },
  {
    label: "Sample 2: Tahmina (Bangla)",
    text: "ফেলোশিপ প্রোগ্রামে ভর্তি হতে চাই। কবে শুরু হবে?",
  },
  {
    label: "Sample 3: Kamrul (Corporate)",
    text: "Hi, I'm from a bank in Motijheel. Need a quote for training 120 employees. Online or onsite both fine.",
  },
  {
    label: "Sample 7: Farzana (bKash Support)",
    text: "পেমেন্ট করেছি কিন্তু কোনো কনফার্মেশন পাইনি। আমার নাম ফারজানা রহমান। ২৫ তারিখে বিকাশে দিয়েছি।",
  },
  {
    label: "Sample 11: Scam (Spam)",
    text: "Earn 5000 USD every day with our crypto signals! Click bit.ly/xxxx now!!!",
  },
];

export const AIIntakeModal: React.FC<AIIntakeModalProps> = ({
  isOpen,
  onClose,
  onSaved,
}) => {
  const [rawText, setRawText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extracted Fields
  const [parsed, setParsed] = useState<AIParsedResult | null>(null);
  const [senderName, setSenderName] = useState("");
  const [phone, setPhone] = useState("");
  const [channel, setChannel] = useState("WhatsApp");
  const [interest, setInterest] = useState("3-Day Bootcamp");
  const [category, setCategory] = useState("LEAD");
  const [status, setStatus] = useState("New");
  const [suggestedReply, setSuggestedReply] = useState("");

  if (!isOpen) return null;

  const handleAnalyze = async () => {
    if (!rawText.trim()) return;
    setIsAnalyzing(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/parse-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawMessage: rawText }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Analysis failed");

      const data: AIParsedResult = json.data;
      setParsed(data);
      setSenderName(data.senderName || "Unknown Sender");
      setPhone(data.phone || "");
      setChannel(data.channel || "WhatsApp");
      setInterest(data.interest || "General Enquiry");
      setCategory(data.category || "LEAD");
      setStatus(data.category === "SPAM" ? "Lost" : "New");
      setSuggestedReply(data.suggestedReply || "");
    } catch (err: any) {
      setError(err.message || "Failed to analyze message");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (!rawText.trim()) return;
    setIsSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderName,
          phone,
          channel,
          interest,
          category,
          status,
          message: rawText,
          suggestedReply,
          detectedLang: parsed?.detectedLang || "English",
        }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Save failed");

      // Reset and close
      setRawText("");
      setParsed(null);
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save lead");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 sticky top-0 z-10">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Quick AI Lead Intake</h3>
              <p className="text-xs text-slate-500">Paste any raw message in Bangla, Banglish, or English</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 flex-1">
          {/* Quick Presets for Demo */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Demo Presets (Sample Data)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setRawText(preset.text);
                    setParsed(null);
                  }}
                  className="px-2.5 py-1 text-xs rounded-md bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border border-slate-200 transition-all font-medium text-slate-600"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Raw Text Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Raw Message Content *
            </label>
            <textarea
              rows={3}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="e.g. Assalamualaikum, apnader 3 day bootcamp er price koto? Payment kibhabe korbo?"
              className="w-full p-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50/50"
            />
          </div>

          {/* Action: Analyze with Gemini */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={isAnalyzing || !rawText.trim()}
              className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className={`w-4 h-4 mr-2 ${isAnalyzing ? "animate-spin" : ""}`} />
              {isAnalyzing ? "AI Analyzing with Gemini 3..." : "Extract with AI"}
            </button>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Auto-populated Fields */}
          {parsed && (
            <div className="mt-4 pt-4 border-t border-slate-200 space-y-3 bg-emerald-50/30 p-4 rounded-xl border border-emerald-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-600" />
                  AI Intelligence Extracted ({parsed.detectedLang})
                </span>
                <span className="text-[11px] font-medium text-slate-500 italic">
                  {parsed.summaryReasoning}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Sender Name */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Sender Name</label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017..."
                    className="w-full px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                {/* Channel */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Source Channel</label>
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value)}
                    className="w-full px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                  >
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Facebook Messenger">Facebook Messenger</option>
                    <option value="Website form">Website form</option>
                    <option value="Phone call note">Phone call note</option>
                    <option value="Facebook comment">Facebook comment</option>
                  </select>
                </div>

                {/* Course Interest */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Program of Interest</label>
                  <select
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    className="w-full px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                  >
                    <option value="3-Day Bootcamp">3-Day Bootcamp</option>
                    <option value="AI Fellowship">AI Fellowship</option>
                    <option value="Corporate Training">Corporate Training</option>
                    <option value="General Enquiry">General Enquiry</option>
                  </select>
                </div>

                {/* Intent Category */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Intent Category (Triage)</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 font-semibold"
                  >
                    <option value="LEAD">🎯 Sales Lead</option>
                    <option value="SUPPORT">🚨 Urgent Support</option>
                    <option value="SPAM">🚫 Spam / Scam</option>
                    <option value="JOB_SEEKER">💼 Job Applicant</option>
                  </select>
                </div>

                {/* Pipeline Stage */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Pipeline Stage</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Interested">Interested</option>
                    <option value="Paid">Paid</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>
              </div>

              {/* Suggested Reply */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  AI Suggested Reply ({parsed.detectedLang} Tone Matched)
                </label>
                <textarea
                  rows={2}
                  value={suggestedReply}
                  onChange={(e) => setSuggestedReply(e.target.value)}
                  className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 flex justify-end space-x-2 bg-slate-50/80 sticky bottom-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !rawText.trim()}
            className="inline-flex items-center px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5 mr-1.5" />
            {isSaving ? "Saving to Database..." : "Save to CRM Pipeline"}
          </button>
        </div>
      </div>
    </div>
  );
};
