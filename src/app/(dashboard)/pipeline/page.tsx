"use client";

import { useState } from "react";
import Header from "@/components/ui/Header";
import Modal from "@/components/ui/Modal";
import { DEAL_STAGES, Deal, DealStage } from "@/lib/types";
import { MoreHorizontal, Building2, User, Calendar } from "lucide-react";

// Demo data
const initialDeals: Deal[] = [
  { id: "1", title: "Enterprise License", value: 45000, currency: "USD", stage: "lead", contact_id: "1", company_id: "1", expected_close_date: "2024-02-15", created_at: "", updated_at: "", user_id: "" },
  { id: "2", title: "Consulting Package", value: 12000, currency: "USD", stage: "qualified", contact_id: "2", company_id: "2", expected_close_date: "2024-02-20", created_at: "", updated_at: "", user_id: "" },
  { id: "3", title: "Annual Subscription", value: 8500, currency: "USD", stage: "proposal", contact_id: "3", company_id: "3", expected_close_date: "2024-02-28", created_at: "", updated_at: "", user_id: "" },
  { id: "4", title: "Implementation", value: 32000, currency: "USD", stage: "negotiation", contact_id: "4", company_id: "4", expected_close_date: "2024-03-05", created_at: "", updated_at: "", user_id: "" },
  { id: "5", title: "Support Contract", value: 5600, currency: "USD", stage: "closed_won", contact_id: "5", company_id: "5", expected_close_date: "2024-01-30", created_at: "", updated_at: "", user_id: "" },
  { id: "6", title: "Platform Migration", value: 28000, currency: "USD", stage: "lead", contact_id: "6", company_id: "6", expected_close_date: "2024-03-15", created_at: "", updated_at: "", user_id: "" },
  { id: "7", title: "Training Package", value: 7500, currency: "USD", stage: "qualified", contact_id: "7", company_id: "7", expected_close_date: "2024-02-25", created_at: "", updated_at: "", user_id: "" },
  { id: "8", title: "API Integration", value: 15000, currency: "USD", stage: "proposal", contact_id: "8", company_id: "8", expected_close_date: "2024-03-01", created_at: "", updated_at: "", user_id: "" },
];

const companies: Record<string, string> = {
  "1": "Acme Corp",
  "2": "TechStart Inc",
  "3": "Global Systems",
  "4": "DataFlow Ltd",
  "5": "CloudNine",
  "6": "InnovateTech",
  "7": "FutureLabs",
  "8": "DigitalFirst",
};

export default function Pipeline() {
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draggedDeal, setDraggedDeal] = useState<Deal | null>(null);
  const [newDeal, setNewDeal] = useState({
    title: "",
    value: "",
    company: "",
    expectedCloseDate: "",
  });

  const getDealsByStage = (stage: DealStage) => {
    return deals.filter((deal) => deal.stage === stage);
  };

  const getStageTotal = (stage: DealStage) => {
    return getDealsByStage(stage).reduce((sum, deal) => sum + deal.value, 0);
  };

  const handleDragStart = (e: React.DragEvent, deal: Deal) => {
    setDraggedDeal(deal);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, stage: DealStage) => {
    e.preventDefault();
    if (draggedDeal && draggedDeal.stage !== stage) {
      setDeals(deals.map((d) =>
        d.id === draggedDeal.id ? { ...d, stage } : d
      ));
    }
    setDraggedDeal(null);
  };

  const handleAddDeal = () => {
    if (!newDeal.title || !newDeal.value) return;

    const deal: Deal = {
      id: String(Date.now()),
      title: newDeal.title,
      value: Number(newDeal.value),
      currency: "USD",
      stage: "lead",
      contact_id: null,
      company_id: null,
      expected_close_date: newDeal.expectedCloseDate || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: "",
    };

    setDeals([...deals, deal]);
    setNewDeal({ title: "", value: "", company: "", expectedCloseDate: "" });
    setIsModalOpen(false);
  };

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
                          {companies[deal.company_id]}
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
            <input
              type="text"
              value={newDeal.company}
              onChange={(e) => setNewDeal({ ...newDeal, company: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Acme Corp"
            />
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
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Deal
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
