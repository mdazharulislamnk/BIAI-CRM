"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { StatsOverview } from "@/components/StatsOverview";
import { FilterBar } from "@/components/FilterBar";
import { PipelineBoard } from "@/components/PipelineBoard";
import { TableView } from "@/components/TableView";
import { AIIntakeModal } from "@/components/AIIntakeModal";
import { EnquiryDetailModal } from "@/components/EnquiryDetailModal";
import { WeeklySummaryModal } from "@/components/WeeklySummaryModal";
import { Enquiry, PipelineStage } from "@/lib/types";

export default function Home() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);

  // View Mode: Kanban Board vs Data Table
  const [viewMode, setViewMode] = useState<"board" | "table">("board");

  // Filters
  const [search, setSearch] = useState("");
  const [channel, setChannel] = useState("ALL");
  const [interest, setInterest] = useState("ALL");
  const [category, setCategory] = useState("ALL");
  const [status, setStatus] = useState("ALL");

  // Modals
  const [isIntakeOpen, setIsIntakeOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  // Fetch enquiries with filters
  const fetchEnquiries = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (channel !== "ALL") params.set("channel", channel);
      if (interest !== "ALL") params.set("interest", interest);
      if (category !== "ALL") params.set("category", category);
      if (status !== "ALL") params.set("status", status);

      const res = await fetch(`/api/enquiries?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setEnquiries(data.enquiries);
      }
    } catch (err) {
      console.error("Failed to fetch enquiries:", err);
    } finally {
      setIsLoading(false);
    }
  }, [search, channel, interest, category, status]);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  // Handle stage change
  const handleUpdateStage = async (id: string, newStage: PipelineStage | string) => {
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStage }),
      });
      const data = await res.json();
      if (data.success) {
        setEnquiries((prev) =>
          prev.map((item) => (item.id === id ? data.enquiry : item))
        );
        if (selectedEnquiry && selectedEnquiry.id === id) {
          setSelectedEnquiry(data.enquiry);
        }
      }
    } catch (err) {
      console.error("Error updating stage:", err);
    }
  };

  // Handle quick advance button on card
  const handleAdvanceStage = (
    enquiry: Enquiry,
    nextStage: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    handleUpdateStage(enquiry.id, nextStage as PipelineStage);
  };

  // Handle saving notes
  const handleUpdateNotes = async (id: string, notes: string) => {
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      const data = await res.json();
      if (data.success) {
        setEnquiries((prev) =>
          prev.map((item) => (item.id === id ? data.enquiry : item))
        );
      }
    } catch (err) {
      console.error("Error saving notes:", err);
    }
  };

  // Handle deleting lead
  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!confirm("Are you sure you want to delete this enquiry?")) return;
    try {
      const res = await fetch(`/api/enquiries/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setEnquiries((prev) => prev.filter((item) => item.id !== id));
        setSelectedEnquiry(null);
      }
    } catch (err) {
      console.error("Error deleting enquiry:", err);
    }
  };

  // Reset database back to original sample data
  const handleResetData = async () => {
    if (!confirm("Reset database to the original 20 sample enquiries?")) return;
    try {
      setIsResetting(true);
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        handleClearFilters();
        await fetchEnquiries();
      }
    } catch (err) {
      console.error("Error resetting data:", err);
    } finally {
      setIsResetting(false);
    }
  };

  const hasActiveFilters =
    search !== "" || channel !== "ALL" || interest !== "ALL" || category !== "ALL" || status !== "ALL";

  const handleClearFilters = () => {
    setSearch("");
    setChannel("ALL");
    setInterest("ALL");
    setCategory("ALL");
    setStatus("ALL");
  };

  return (
    <div className="h-screen max-h-screen w-screen overflow-hidden flex flex-col bg-slate-50 antialiased select-none">
      {/* Top Navigation: Fixed Height (h-13), No page scroll */}
      <Navbar
        onOpenIntake={() => setIsIntakeOpen(true)}
        onOpenSummary={() => setIsSummaryOpen(true)}
        onResetData={handleResetData}
        isResetting={isResetting}
      />

      {/* Main Container: 100% of remaining screen height, zero page scroll */}
      <main className="flex-1 min-h-0 w-full px-3 sm:px-6 pt-2 pb-3 flex flex-col overflow-hidden">
        {/* Compact Stats Overview Bar (Fixed height) */}
        <StatsOverview
          enquiries={enquiries}
          onFilterOverdue={() => {
            setCategory("ALL");
            setInterest("ALL");
            setStatus("New");
          }}
          onFilterSupport={() => {
            setCategory("SUPPORT");
            setStatus("ALL");
          }}
          onFilterPaid={() => {
            setStatus("Paid");
            setCategory("ALL");
          }}
          onResetFilters={handleClearFilters}
        />

        {/* Compact Filter Toolbar (Fixed height) */}
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          channel={channel}
          onChannelChange={setChannel}
          interest={interest}
          onInterestChange={setInterest}
          category={category}
          onCategoryChange={setCategory}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalFiltered={enquiries.length}
        />

        {/* Main Display Area: Fills exact remaining space, each column scrolls internally */}
        <div className="flex-1 min-h-0 w-full overflow-hidden flex flex-col">
          {isLoading && enquiries.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
              <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium">Loading live pipeline...</p>
            </div>
          ) : viewMode === "board" ? (
            <PipelineBoard
              enquiries={enquiries}
              onSelectEnquiry={(e) => setSelectedEnquiry(e)}
              onAdvanceStage={handleAdvanceStage}
            />
          ) : (
            <div className="h-full overflow-y-auto">
              <TableView
                enquiries={enquiries}
                onSelectEnquiry={(e) => setSelectedEnquiry(e)}
                onAdvanceStage={handleAdvanceStage}
                onDeleteEnquiry={handleDelete}
              />
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <AIIntakeModal
        isOpen={isIntakeOpen}
        onClose={() => setIsIntakeOpen(false)}
        onSaved={fetchEnquiries}
      />

      <EnquiryDetailModal
        enquiry={selectedEnquiry}
        isOpen={Boolean(selectedEnquiry)}
        onClose={() => setSelectedEnquiry(null)}
        onUpdateStage={handleUpdateStage}
        onUpdateNotes={handleUpdateNotes}
        onDelete={(id) => handleDelete(id)}
      />

      <WeeklySummaryModal
        isOpen={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
      />
    </div>
  );
}
