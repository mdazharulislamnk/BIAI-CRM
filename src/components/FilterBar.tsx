"use client";

import React from "react";
import { Search, Filter, X, LayoutGrid, TableProperties } from "lucide-react";

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
  viewMode: "board" | "table";
  onViewModeChange: (mode: "board" | "table") => void;
  totalFiltered: number;
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
  viewMode,
  onViewModeChange,
  totalFiltered,
}) => {
  return (
    <div className="bg-white p-3 sm:p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs mb-5 flex flex-col md:flex-row gap-2.5 items-stretch md:items-center justify-between w-full">
      {/* Left: Search Bar */}
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name, phone (017...), or keywords..."
          className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 placeholder-slate-400 font-medium"
        />
        {search && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Middle: Select Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Channel Filter */}
        <select
          value={channel}
          onChange={(e) => onChannelChange(e.target.value)}
          className="px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer shadow-2xs"
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
          className="px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer shadow-2xs"
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
          className="px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer shadow-2xs"
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
            className="inline-flex items-center px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors border border-rose-200"
          >
            <Filter className="w-3 h-3 mr-1" />
            Clear
          </button>
        )}
      </div>

      {/* Right: Board vs Table View Mode Switcher */}
      <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80 shrink-0">
        <button
          onClick={() => onViewModeChange("board")}
          className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            viewMode === "board"
              ? "bg-white text-slate-900 shadow-2xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
          title="Kanban Board View"
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Board</span>
        </button>
        <button
          onClick={() => onViewModeChange("table")}
          className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            viewMode === "table"
              ? "bg-white text-slate-900 shadow-2xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
          title="Data Table View"
        >
          <TableProperties className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Table</span>
        </button>
      </div>
    </div>
  );
};
