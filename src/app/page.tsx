"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { StatsOverview } from "@/components/StatsOverview";
import { FilterBar } from "@/components/FilterBar";
import { PipelineBoard } from "@/components/PipelineBoard";
import { AIIntakeModal } from "@/components/AIIntakeModal";
import { EnquiryDetailModal } from "@/components/EnquiryDetailModal";
import { WeeklySummaryModal } from "@/components/WeeklySummaryModal";
import { Enquiry, PipelineStage } from "@/lib/types";

export default function Home() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [channel, setChannel] = useState("ALL");
  const [interest, setInterest] = useState("ALL");
  const [category, setCategory] = useState("ALL");

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
  }, [search, channel, interest, category]);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  // Handle stage change (e.g. from New -> Contacted)
  const handleUpdateStage = async (id: string, newStage: PipelineStage | string) => {
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStage }),
      });
      const data = await res.json();
      if (data.success) {
        // Update local state smoothly
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
  const handleDelete = async (id: string) => {
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
        await fetchEnquiries();
      }
    } catch (err) {
      console.error("Error resetting data:", err);
    } finally {
      setIsResetting(false);
    }
  };

  const hasActiveFilters =
    search !== "" || channel !== "ALL" || interest !== "ALL" || category !== "ALL";

  const handleClearFilters = () => {
    setSearch("");
    setChannel("ALL");
    setInterest("ALL");
    setCategory("ALL");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Navigation */}
      <Navbar
        onOpenIntake={() => setIsIntakeOpen(true)}
        onOpenSummary={() => setIsSummaryOpen(true)}
        onResetData={handleResetData}
        isResetting={isResetting}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Overview Bar */}
        <StatsOverview
          enquiries={enquiries}
          onFilterOverdue={() => {
            // Filter to new/contacted
            setCategory("ALL");
            setInterest("ALL");
          }}
          onFilterSupport={() => {
            setCategory("SUPPORT");
          }}
        />

        {/* Filters & Search Toolbar */}
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
        />

        {/* Kanban Pipeline Board */}
        {isLoading && enquiries.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
            Loading pipeline leads...
          </div>
        ) : (
          <PipelineBoard
            enquiries={enquiries}
            onSelectEnquiry={(e) => setSelectedEnquiry(e)}
            onAdvanceStage={handleAdvanceStage}
          />
        )}
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
        onDelete={handleDelete}
      />

      <WeeklySummaryModal
        isOpen={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
      />
    </div>
  );
}
