"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import Header from "@/components/ui/Header";
import { Deal, Contact, Company, Activity } from "@/lib/types";
import {
  DollarSign,
  Users,
  Building2,
  TrendingUp,
  Loader2,
} from "lucide-react";

export default function Dashboard() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [dealsResult, contactsResult, companiesResult, activitiesResult] = await Promise.all([
        supabase.from("deals").select("*").order("created_at", { ascending: false }),
        supabase.from("contacts").select("*").order("created_at", { ascending: false }),
        supabase.from("companies").select("*").order("created_at", { ascending: false }),
        supabase.from("activities").select("*").order("created_at", { ascending: false }).limit(5),
      ]);

      if (dealsResult.data) setDeals(dealsResult.data);
      if (contactsResult.data) setContacts(contactsResult.data);
      if (companiesResult.data) setCompanies(companiesResult.data);
      if (activitiesResult.data) setActivities(activitiesResult.data);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCompanyName = (companyId: string | null) => {
    if (!companyId) return "Unknown";
    const company = companies.find((c) => c.id === companyId);
    return company?.name || "Unknown";
  };

  const getStageName = (stage: string) => {
    const stages: Record<string, string> = {
      lead: "Lead",
      qualified: "Qualified",
      proposal: "Proposal",
      negotiation: "Negotiation",
      closed_won: "Closed Won",
      closed_lost: "Closed Lost",
    };
    return stages[stage] || stage;
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
  };

  // Calculate stats
  const totalRevenue = deals
    .filter((d) => d.stage === "closed_won")
    .reduce((sum, d) => sum + d.value, 0);

  const activeDeals = deals.filter(
    (d) => !["closed_won", "closed_lost"].includes(d.stage)
  ).length;

  const stats = [
    {
      name: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      name: "Active Deals",
      value: String(activeDeals),
      icon: TrendingUp,
      color: "bg-blue-500",
    },
    {
      name: "Total Contacts",
      value: String(contacts.length),
      icon: Users,
      color: "bg-purple-500",
    },
    {
      name: "Companies",
      value: String(companies.length),
      icon: Building2,
      color: "bg-orange-500",
    },
  ];

  const recentDeals = deals.slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="Dashboard" />

      <div className="flex-1 overflow-y-auto p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="bg-white rounded-xl border border-zinc-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="text-2xl font-bold text-zinc-900">{stat.value}</div>
              <div className="text-sm text-zinc-500">{stat.name}</div>
            </div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Deals */}
          <div className="bg-white rounded-xl border border-zinc-200">
            <div className="px-6 py-4 border-b border-zinc-200">
              <h2 className="text-lg font-semibold text-zinc-900">Recent Deals</h2>
            </div>
            <div className="divide-y divide-zinc-100">
              {recentDeals.length === 0 ? (
                <div className="px-6 py-8 text-center text-zinc-500">
                  No deals yet. Add your first deal in the Pipeline.
                </div>
              ) : (
                recentDeals.map((deal) => (
                  <div key={deal.id} className="px-6 py-4 flex items-center justify-between hover:bg-zinc-50">
                    <div>
                      <div className="font-medium text-zinc-900">{deal.title}</div>
                      <div className="text-sm text-zinc-500">{getCompanyName(deal.company_id)}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-zinc-900">
                        ${deal.value.toLocaleString()}
                      </div>
                      <div className="text-sm text-zinc-500">{getStageName(deal.stage)}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-xl border border-zinc-200">
            <div className="px-6 py-4 border-b border-zinc-200">
              <h2 className="text-lg font-semibold text-zinc-900">Recent Activities</h2>
            </div>
            <div className="divide-y divide-zinc-100">
              {activities.length === 0 ? (
                <div className="px-6 py-8 text-center text-zinc-500">
                  No activities yet. Add your first activity.
                </div>
              ) : (
                activities.map((activity) => (
                  <div key={activity.id} className="px-6 py-4 hover:bg-zinc-50">
                    <div className="font-medium text-zinc-900">{activity.title}</div>
                    <div className="text-sm text-zinc-500">{getTimeAgo(activity.created_at)}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
