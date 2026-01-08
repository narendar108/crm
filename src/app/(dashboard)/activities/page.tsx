"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import Header from "@/components/ui/Header";
import Modal from "@/components/ui/Modal";
import { Activity, ACTIVITY_TYPES } from "@/lib/types";
import { Phone, Mail, Calendar, CheckSquare, FileText, Check, MoreHorizontal, Loader2, Trash2 } from "lucide-react";

const iconMap = {
  Phone,
  Mail,
  Calendar,
  CheckSquare,
  FileText,
};

export default function Activities() {
  const supabase = createClient();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [newActivity, setNewActivity] = useState({
    type: "task" as Activity["type"],
    title: "",
    description: "",
    dueDate: "",
  });
  const [editActivity, setEditActivity] = useState({
    type: "task" as Activity["type"],
    title: "",
    description: "",
    dueDate: "",
    completed: false,
  });

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) setActivities(data);
    } catch (error) {
      console.error("Error loading activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const activity = activities.find((a) => a.id === id);
    if (!activity) return;

    const previousActivities = [...activities];
    setActivities(activities.map((a) =>
      a.id === id ? { ...a, completed: !a.completed } : a
    ));

    const { error } = await supabase
      .from("activities")
      .update({ completed: !activity.completed, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      console.error("Error updating activity:", error);
      setActivities(previousActivities);
    }
  };

  const handleAddActivity = async () => {
    if (!newActivity.title) return;

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from("activities")
        .insert({
          type: newActivity.type,
          title: newActivity.title,
          description: newActivity.description || null,
          due_date: newActivity.dueDate || null,
          completed: false,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setActivities([data, ...activities]);
      }

      setNewActivity({ type: "task", title: "", description: "", dueDate: "" });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding activity:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleActivityClick = (activity: Activity) => {
    setSelectedActivity(activity);
    setEditActivity({
      type: activity.type,
      title: activity.title,
      description: activity.description || "",
      dueDate: activity.due_date || "",
      completed: activity.completed,
    });
    setIsDetailModalOpen(true);
  };

  const handleUpdateActivity = async () => {
    if (!selectedActivity || !editActivity.title) return;

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from("activities")
        .update({
          type: editActivity.type,
          title: editActivity.title,
          description: editActivity.description || null,
          due_date: editActivity.dueDate || null,
          completed: editActivity.completed,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedActivity.id)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setActivities(activities.map((a) => (a.id === data.id ? data : a)));
      }

      setIsDetailModalOpen(false);
      setSelectedActivity(null);
    } catch (error) {
      console.error("Error updating activity:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteActivity = async () => {
    if (!selectedActivity) return;

    setDeleting(true);
    try {
      const { error } = await supabase
        .from("activities")
        .delete()
        .eq("id", selectedActivity.id);

      if (error) throw error;

      setActivities(activities.filter((a) => a.id !== selectedActivity.id));
      setIsDetailModalOpen(false);
      setSelectedActivity(null);
    } catch (error) {
      console.error("Error deleting activity:", error);
    } finally {
      setDeleting(false);
    }
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
          {filteredActivities.length === 0 ? (
            <div className="px-6 py-12 text-center text-zinc-500">
              {filter === "all"
                ? "No activities yet. Add your first activity to get started."
                : `No ${filter} activities.`}
            </div>
          ) : (
            filteredActivities.map((activity) => {
              const Icon = getIcon(activity.type);
              return (
                <div
                  key={activity.id}
                  onClick={() => handleActivityClick(activity)}
                  className={`p-4 flex items-start gap-4 hover:bg-zinc-50 cursor-pointer ${
                    activity.completed ? "opacity-60" : ""
                  }`}
                >
                  {/* Checkbox */}
                  <button
                    onClick={(e) => toggleComplete(activity.id, e)}
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
                  <button
                    className="p-1 text-zinc-400 hover:text-zinc-600 rounded"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleActivityClick(activity);
                    }}
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              );
            })
          )}
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
              disabled={saving}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Activity"
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Activity Detail/Edit Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedActivity(null);
        }}
        title="Edit Activity"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Type
            </label>
            <select
              value={editActivity.type}
              onChange={(e) => setEditActivity({ ...editActivity, type: e.target.value as Activity["type"] })}
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
              value={editActivity.title}
              onChange={(e) => setEditActivity({ ...editActivity, title: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Description
            </label>
            <textarea
              value={editActivity.description}
              onChange={(e) => setEditActivity({ ...editActivity, description: e.target.value })}
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
              value={editActivity.dueDate}
              onChange={(e) => setEditActivity({ ...editActivity, dueDate: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="completed"
              checked={editActivity.completed}
              onChange={(e) => setEditActivity({ ...editActivity, completed: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-zinc-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="completed" className="text-sm font-medium text-zinc-700">
              Mark as completed
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleDeleteActivity}
              disabled={deleting}
              className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {deleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Delete
            </button>
            <button
              onClick={() => {
                setIsDetailModalOpen(false);
                setSelectedActivity(null);
              }}
              className="flex-1 px-4 py-2 border border-zinc-300 rounded-lg text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateActivity}
              disabled={saving}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
