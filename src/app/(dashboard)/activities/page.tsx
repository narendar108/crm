"use client";

import { useState } from "react";
import Header from "@/components/ui/Header";
import Modal from "@/components/ui/Modal";
import { Activity, ACTIVITY_TYPES } from "@/lib/types";
import { Phone, Mail, Calendar, CheckSquare, FileText, Check, MoreHorizontal } from "lucide-react";

const iconMap = {
  Phone,
  Mail,
  Calendar,
  CheckSquare,
  FileText,
};

const initialActivities: Activity[] = [
  { id: "1", type: "call", title: "Follow up call with John", description: "Discuss pricing options", due_date: "2024-02-10", completed: false, deal_id: "1", contact_id: "1", company_id: "1", created_at: "", updated_at: "", user_id: "" },
  { id: "2", type: "email", title: "Send proposal to TechStart", description: "Include all pricing tiers", due_date: "2024-02-08", completed: true, deal_id: "2", contact_id: "2", company_id: "2", created_at: "", updated_at: "", user_id: "" },
  { id: "3", type: "meeting", title: "Demo presentation", description: "Product demo for Global Systems", due_date: "2024-02-12", completed: false, deal_id: "3", contact_id: "3", company_id: "3", created_at: "", updated_at: "", user_id: "" },
  { id: "4", type: "task", title: "Prepare contract", description: "Draft contract for DataFlow deal", due_date: "2024-02-09", completed: false, deal_id: "4", contact_id: "4", company_id: "4", created_at: "", updated_at: "", user_id: "" },
  { id: "5", type: "note", title: "Meeting notes", description: "Notes from CloudNine kickoff", due_date: null, completed: true, deal_id: "5", contact_id: "5", company_id: "5", created_at: "", updated_at: "", user_id: "" },
  { id: "6", type: "call", title: "Quarterly review call", description: "Discuss Q1 performance", due_date: "2024-02-15", completed: false, deal_id: "6", contact_id: "6", company_id: "6", created_at: "", updated_at: "", user_id: "" },
  { id: "7", type: "email", title: "Send invoice", description: "Invoice for training package", due_date: "2024-02-07", completed: true, deal_id: "7", contact_id: "7", company_id: "7", created_at: "", updated_at: "", user_id: "" },
  { id: "8", type: "meeting", title: "Onboarding session", description: "New client onboarding", due_date: "2024-02-14", completed: false, deal_id: "8", contact_id: "8", company_id: "8", created_at: "", updated_at: "", user_id: "" },
];

export default function Activities() {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [newActivity, setNewActivity] = useState({
    type: "task" as Activity["type"],
    title: "",
    description: "",
    dueDate: "",
  });

  const toggleComplete = (id: string) => {
    setActivities(activities.map((a) =>
      a.id === id ? { ...a, completed: !a.completed } : a
    ));
  };

  const handleAddActivity = () => {
    if (!newActivity.title) return;

    const activity: Activity = {
      id: String(Date.now()),
      type: newActivity.type,
      title: newActivity.title,
      description: newActivity.description || null,
      due_date: newActivity.dueDate || null,
      completed: false,
      deal_id: null,
      contact_id: null,
      company_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: "",
    };

    setActivities([...activities, activity]);
    setNewActivity({ type: "task", title: "", description: "", dueDate: "" });
    setIsModalOpen(false);
  };

  const filteredActivities = activities.filter((a) => {
    if (filter === "pending") return !a.completed;
    if (filter === "completed") return a.completed;
    return true;
  });

  const getIcon = (type: Activity["type"]) => {
    const activityType = ACTIVITY_TYPES.find((t) => t.id === type);
    if (activityType) {
      const Icon = iconMap[activityType.icon as keyof typeof iconMap];
      return Icon;
    }
    return CheckSquare;
  };

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Activities"
        onAddNew={() => setIsModalOpen(true)}
        addNewLabel="Add Activity"
      />

      <div className="flex-1 overflow-y-auto p-6">
        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {(["all", "pending", "completed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Activities List */}
        <div className="bg-white rounded-xl border border-zinc-200 divide-y divide-zinc-100">
          {filteredActivities.map((activity) => {
            const Icon = getIcon(activity.type);
            return (
              <div
                key={activity.id}
                className={`p-4 flex items-start gap-4 hover:bg-zinc-50 ${
                  activity.completed ? "opacity-60" : ""
                }`}
              >
                {/* Checkbox */}
                <button
                  onClick={() => toggleComplete(activity.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                    activity.completed
                      ? "bg-green-500 border-green-500 text-white"
                      : "border-zinc-300 hover:border-blue-500"
                  }`}
                >
                  {activity.completed && <Check className="w-4 h-4" />}
                </button>

                {/* Icon */}
                <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-zinc-600" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className={`font-medium text-zinc-900 ${activity.completed ? "line-through" : ""}`}>
                    {activity.title}
                  </h3>
                  {activity.description && (
                    <p className="text-sm text-zinc-500 mt-1">{activity.description}</p>
                  )}
                  {activity.due_date && (
                    <p className="text-sm text-zinc-400 mt-2">
                      Due: {new Date(activity.due_date).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {/* Type badge */}
                <span className="px-2 py-1 bg-zinc-100 text-zinc-600 text-xs rounded-full capitalize">
                  {activity.type}
                </span>

                {/* Actions */}
                <button className="p-1 text-zinc-400 hover:text-zinc-600 rounded">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Activity Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Activity"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Type
            </label>
            <select
              value={newActivity.type}
              onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value as Activity["type"] })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {ACTIVITY_TYPES.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={newActivity.title}
              onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Description
            </label>
            <textarea
              value={newActivity.description}
              onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={newActivity.dueDate}
              onChange={(e) => setNewActivity({ ...newActivity, dueDate: e.target.value })}
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
              onClick={handleAddActivity}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Activity
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
