"use client";

import React from "react";
import { Search, Filter, X } from "lucide-react";

interface FilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  channel: string;
  onChannelChange: (val: string) => void;
  interest: string;
  onInterestChange: (val: string) => void;
  category: string;
  onCategoryChange: (val: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  search,
  onSearchChange,
  channel,
  onChannelChange,
  interest,
  onInterestChange,
  category,
  onCategoryChange,
  onClearFilters,
  hasActiveFilters,
}) => {
  return (
    <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200/80 shadow-sm mb-6 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name, phone (017...), or keywords..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 placeholder-slate-400"
        />
        {search && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Select Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Channel Filter */}
        <select
          value={channel}
          onChange={(e) => onChannelChange(e.target.value)}
          className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
        >
          <option value="ALL">All Channels</option>
          <option value="WhatsApp">WhatsApp</option>
          <option value="Facebook Messenger">FB Messenger</option>
          <option value="Website form">Website Form</option>
          <option value="Phone call note">Phone Call</option>
          <option value="Facebook comment">FB Comment</option>
        </select>

        {/* Program Filter */}
        <select
          value={interest}
          onChange={(e) => onInterestChange(e.target.value)}
          className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
        >
          <option value="ALL">All Programs</option>
          <option value="3-Day Bootcamp">3-Day Bootcamp</option>
          <option value="AI Fellowship">AI Fellowship</option>
          <option value="Corporate Training">Corporate Training</option>
          <option value="General Enquiry">General Enquiry</option>
        </select>

        {/* Intent / Triage Category Filter */}
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
        >
          <option value="ALL">All Intents</option>
          <option value="LEAD">🎯 Sales Leads Only</option>
          <option value="SUPPORT">🚨 Urgent Support</option>
          <option value="SPAM">🚫 Quarantined Spam</option>
          <option value="JOB_SEEKER">💼 Job Applicants</option>
        </select>

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="inline-flex items-center px-2.5 py-1.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
          >
            <Filter className="w-3 h-3 mr-1" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
};
