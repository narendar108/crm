"use client";

import { useState } from "react";
import Header from "@/components/ui/Header";
import Modal from "@/components/ui/Modal";
import { Company } from "@/lib/types";
import { Globe, MapPin, MoreHorizontal, Users } from "lucide-react";

const initialCompanies: Company[] = [
  { id: "1", name: "Acme Corp", industry: "Technology", website: "acme.com", address: "San Francisco, CA", created_at: "", updated_at: "", user_id: "" },
  { id: "2", name: "TechStart Inc", industry: "Software", website: "techstart.io", address: "New York, NY", created_at: "", updated_at: "", user_id: "" },
  { id: "3", name: "Global Systems", industry: "Enterprise", website: "globalsystems.com", address: "Chicago, IL", created_at: "", updated_at: "", user_id: "" },
  { id: "4", name: "DataFlow Ltd", industry: "Data Analytics", website: "dataflow.io", address: "Austin, TX", created_at: "", updated_at: "", user_id: "" },
  { id: "5", name: "CloudNine", industry: "Cloud Computing", website: "cloudnine.com", address: "Seattle, WA", created_at: "", updated_at: "", user_id: "" },
  { id: "6", name: "InnovateTech", industry: "Innovation", website: "innovatetech.co", address: "Boston, MA", created_at: "", updated_at: "", user_id: "" },
  { id: "7", name: "FutureLabs", industry: "Research", website: "futurelabs.com", address: "Los Angeles, CA", created_at: "", updated_at: "", user_id: "" },
  { id: "8", name: "DigitalFirst", industry: "Digital Marketing", website: "digitalfirst.io", address: "Miami, FL", created_at: "", updated_at: "", user_id: "" },
];

export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: "",
    industry: "",
    website: "",
    address: "",
  });

  const handleAddCompany = () => {
    if (!newCompany.name) return;

    const company: Company = {
      id: String(Date.now()),
      name: newCompany.name,
      industry: newCompany.industry || null,
      website: newCompany.website || null,
      address: newCompany.address || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: "",
    };

    setCompanies([...companies, company]);
    setNewCompany({ name: "", industry: "", website: "", address: "" });
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Companies"
        onAddNew={() => setIsModalOpen(true)}
        addNewLabel="Add Company"
      />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <div
              key={company.id}
              className="bg-white rounded-xl border border-zinc-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                  {company.name[0]}
                </div>
                <button className="p-1 text-zinc-400 hover:text-zinc-600 rounded">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              <h3 className="text-lg font-semibold text-zinc-900 mb-1">
                {company.name}
              </h3>

              {company.industry && (
                <span className="inline-block px-2 py-1 bg-zinc-100 text-zinc-600 text-xs rounded-full mb-4">
                  {company.industry}
                </span>
              )}

              <div className="space-y-2 text-sm text-zinc-600">
                {company.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <a href={`https://${company.website}`} className="hover:text-blue-600">
                      {company.website}
                    </a>
                  </div>
                )}
                {company.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {company.address}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Company Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Company"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Company Name
            </label>
            <input
              type="text"
              value={newCompany.name}
              onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Industry
            </label>
            <input
              type="text"
              value={newCompany.industry}
              onChange={(e) => setNewCompany({ ...newCompany, industry: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Website
            </label>
            <input
              type="text"
              value={newCompany.website}
              onChange={(e) => setNewCompany({ ...newCompany, website: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Address
            </label>
            <input
              type="text"
              value={newCompany.address}
              onChange={(e) => setNewCompany({ ...newCompany, address: e.target.value })}
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
              onClick={handleAddCompany}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Company
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
