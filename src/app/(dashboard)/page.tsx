"use client";

import Header from "@/components/ui/Header";
import {
  DollarSign,
  Users,
  Building2,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const stats = [
  {
    name: "Total Revenue",
    value: "$124,500",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "bg-green-500",
  },
  {
    name: "Active Deals",
    value: "34",
    change: "+4.3%",
    trend: "up",
    icon: TrendingUp,
    color: "bg-blue-500",
  },
  {
    name: "Total Contacts",
    value: "2,420",
    change: "+8.1%",
    trend: "up",
    icon: Users,
    color: "bg-purple-500",
  },
  {
    name: "Companies",
    value: "156",
    change: "-2.4%",
    trend: "down",
    icon: Building2,
    color: "bg-orange-500",
  },
];

const recentDeals = [
  { id: 1, name: "Enterprise License", company: "Acme Corp", value: 45000, stage: "Proposal" },
  { id: 2, name: "Consulting Package", company: "TechStart Inc", value: 12000, stage: "Negotiation" },
  { id: 3, name: "Annual Subscription", company: "Global Systems", value: 8500, stage: "Qualified" },
  { id: 4, name: "Implementation", company: "DataFlow Ltd", value: 32000, stage: "Lead" },
  { id: 5, name: "Support Contract", company: "CloudNine", value: 5600, stage: "Closed Won" },
];

const recentActivities = [
  { id: 1, type: "call", description: "Call with John from Acme Corp", time: "2 hours ago" },
  { id: 2, type: "email", description: "Sent proposal to TechStart Inc", time: "4 hours ago" },
  { id: 3, type: "meeting", description: "Demo meeting with Global Systems", time: "Yesterday" },
  { id: 4, type: "task", description: "Follow up on DataFlow proposal", time: "Yesterday" },
  { id: 5, type: "note", description: "Added notes for CloudNine deal", time: "2 days ago" },
];

export default function Dashboard() {
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
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.change}
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
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
              {recentDeals.map((deal) => (
                <div key={deal.id} className="px-6 py-4 flex items-center justify-between hover:bg-zinc-50">
                  <div>
                    <div className="font-medium text-zinc-900">{deal.name}</div>
                    <div className="text-sm text-zinc-500">{deal.company}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-zinc-900">
                      ${deal.value.toLocaleString()}
                    </div>
                    <div className="text-sm text-zinc-500">{deal.stage}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-xl border border-zinc-200">
            <div className="px-6 py-4 border-b border-zinc-200">
              <h2 className="text-lg font-semibold text-zinc-900">Recent Activities</h2>
            </div>
            <div className="divide-y divide-zinc-100">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="px-6 py-4 hover:bg-zinc-50">
                  <div className="font-medium text-zinc-900">{activity.description}</div>
                  <div className="text-sm text-zinc-500">{activity.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
