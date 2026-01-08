"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import Header from "@/components/ui/Header";
import Modal from "@/components/ui/Modal";
import { DEAL_STAGES, Deal, DealStage, Company } from "@/lib/types";
import { MoreHorizontal, Building2, Calendar, Loader2 } from "lucide-react";

export default function Pipeline() {
  const supabase = createClient();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draggedDeal, setDraggedDeal] = useState<Deal | null>(null);
  const [saving, setSaving] = useState(false);
  const [newDeal, setNewDeal] = useState({
    title: "",
    value: "",
    company_id: "",
    expectedCloseDate: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [dealsResult, companiesResult] = await Promise.all([
        supabase.from("deals").select("*").order("created_at", { ascending: false }),
        supabase.from("companies").select("*").order("name"),
      ]);

      if (dealsResult.data) setDeals(dealsResult.data);
      if (companiesResult.data) setCompanies(companiesResult.data);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDealsByStage = (stage: DealStage) => {
    return deals.filter((deal) => deal.stage === stage);
  };

  const getStageTotal = (stage: DealStage) => {
    return getDealsByStage(stage).reduce((sum, deal) => sum + deal.value, 0);
  };

  const getCompanyName = (companyId: string | null) => {
    if (!companyId) return null;
    const company = companies.find((c) => c.id === companyId);
    return company?.name || null;
  };

  const handleDragStart = (e: React.DragEvent, deal: Deal) => {
    setDraggedDeal(deal);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, stage: DealStage) => {
    e.preventDefault();
    if (draggedDeal && draggedDeal.stage !== stage) {
      // Optimistic update
      setDeals(deals.map((d) =>
        d.id === draggedDeal.id ? { ...d, stage } : d
      ));

      // Update in Supabase
      const { error } = await supabase
        .from("deals")
        .update({ stage, updated_at: new Date().toISOString() })
        .eq("id", draggedDeal.id);

      if (error) {
        console.error("Error updating deal:", error);
        // Revert on error
        setDeals(deals);
      }
    }
    setDraggedDeal(null);
  };

  const handleAddDeal = async () => {
    if (!newDeal.title || !newDeal.value) return;

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from("deals")
        .insert({
          title: newDeal.title,
          value: Number(newDeal.value),
          currency: "USD",
          stage: "lead" as DealStage,
          company_id: newDeal.company_id || null,
          expected_close_date: newDeal.expectedCloseDate || null,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setDeals([data, ...deals]);
      }

      setNewDeal({ title: "", value: "", company_id: "", expectedCloseDate: "" });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding deal:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Pipeline"
        onAddNew={() => setIsModalOpen(true)}
        addNewLabel="Add Deal"
      />

      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-4 h-full min-w-max">
          {DEAL_STAGES.map((stage) => (
            <div
              key={stage.id}
              className="w-80 flex flex-col bg-zinc-100 rounded-xl"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              {/* Stage Header */}
              <div className="p-4 border-b border-zinc-200">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                    <span className="font-semibold text-zinc-900">
                      {stage.label}
                    </span>
                    <span className="text-sm text-zinc-500">
                      ({getDealsByStage(stage.id).length})
                    </span>
                  </div>
                </div>
                <div className="text-sm text-zinc-600">
                  ${getStageTotal(stage.id).toLocaleString()}
                </div>
              </div>

              {/* Deals */}
              <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                {getDealsByStage(stage.id).map((deal) => (
                  <div
                    key={deal.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, deal)}
                    className={`bg-white rounded-lg border border-zinc-200 p-4 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow ${
                      draggedDeal?.id === deal.id ? "opacity-50" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-zinc-900">{deal.title}</h3>
                      <button className="p-1 text-zinc-400 hover:text-zinc-600 rounded">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-lg font-semibold text-zinc-900 mb-3">
                      ${deal.value.toLocaleString()}
                    </div>

                    <div className="space-y-1 text-sm text-zinc-500">
                      {deal.company_id && (
                        <div className="flex items-center gap-2">
                          <Building2 className="w-3.5 h-3.5" />
                          {getCompanyName(deal.company_id)}
                        </div>
                      )}
                      {deal.expected_close_date && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(deal.expected_close_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Deal Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Deal"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Deal Title
            </label>
            <input
              type="text"
              value={newDeal.title}
              onChange={(e) => setNewDeal({ ...newDeal, title: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Enterprise License"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Value ($)
            </label>
            <input
              type="number"
              value={newDeal.value}
              onChange={(e) => setNewDeal({ ...newDeal, value: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 10000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Company
            </label>
            <select
              value={newDeal.company_id}
              onChange={(e) => setNewDeal({ ...newDeal, company_id: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a company</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Expected Close Date
            </label>
            <input
              type="date"
              value={newDeal.expectedCloseDate}
              onChange={(e) => setNewDeal({ ...newDeal, expectedCloseDate: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-2 border border-zinc-300 rounded-lg text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddDeal}
              disabled={saving}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Deal"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
