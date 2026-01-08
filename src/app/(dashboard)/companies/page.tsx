"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import Header from "@/components/ui/Header";
import Modal from "@/components/ui/Modal";
import { Company } from "@/lib/types";
import { Globe, MapPin, MoreHorizontal, Loader2, Trash2 } from "lucide-react";

export default function Companies() {
  const supabase = createClient();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: "",
    industry: "",
    website: "",
    address: "",
  });
  const [editCompany, setEditCompany] = useState({
    name: "",
    industry: "",
    website: "",
    address: "",
  });

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) setCompanies(data);
    } catch (error) {
      console.error("Error loading companies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCompany = async () => {
    if (!newCompany.name) return;

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from("companies")
        .insert({
          name: newCompany.name,
          industry: newCompany.industry || null,
          website: newCompany.website || null,
          address: newCompany.address || null,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setCompanies([data, ...companies]);
      }

      setNewCompany({ name: "", industry: "", website: "", address: "" });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding company:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCompanyClick = (company: Company) => {
    setSelectedCompany(company);
    setEditCompany({
      name: company.name,
      industry: company.industry || "",
      website: company.website || "",
      address: company.address || "",
    });
    setIsDetailModalOpen(true);
  };

  const handleUpdateCompany = async () => {
    if (!selectedCompany || !editCompany.name) return;

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from("companies")
        .update({
          name: editCompany.name,
          industry: editCompany.industry || null,
          website: editCompany.website || null,
          address: editCompany.address || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedCompany.id)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setCompanies(companies.map((c) => (c.id === data.id ? data : c)));
      }

      setIsDetailModalOpen(false);
      setSelectedCompany(null);
    } catch (error) {
      console.error("Error updating company:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCompany = async () => {
    if (!selectedCompany) return;

    setDeleting(true);
    try {
      const { error } = await supabase
        .from("companies")
        .delete()
        .eq("id", selectedCompany.id);

      if (error) throw error;

      setCompanies(companies.filter((c) => c.id !== selectedCompany.id));
      setIsDetailModalOpen(false);
      setSelectedCompany(null);
    } catch (error) {
      console.error("Error deleting company:", error);
    } finally {
      setDeleting(false);
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
        title="Companies"
        onAddNew={() => setIsModalOpen(true)}
        addNewLabel="Add Company"
      />

      <div className="flex-1 overflow-y-auto p-6">
        {companies.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-500">
            <p>No companies yet. Add your first company to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <div
                key={company.id}
                onClick={() => handleCompanyClick(company)}
                className="bg-white rounded-xl border border-zinc-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {company.name[0]}
                  </div>
                  <button
                    className="p-1 text-zinc-400 hover:text-zinc-600 rounded"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCompanyClick(company);
                    }}
                  >
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
                      <span className="hover:text-blue-600">{company.website}</span>
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
        )}
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
              disabled={saving}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Company"
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Company Detail/Edit Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedCompany(null);
        }}
        title="Edit Company"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Company Name
            </label>
            <input
              type="text"
              value={editCompany.name}
              onChange={(e) => setEditCompany({ ...editCompany, name: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Industry
            </label>
            <input
              type="text"
              value={editCompany.industry}
              onChange={(e) => setEditCompany({ ...editCompany, industry: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Website
            </label>
            <input
              type="text"
              value={editCompany.website}
              onChange={(e) => setEditCompany({ ...editCompany, website: e.target.value })}
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
              value={editCompany.address}
              onChange={(e) => setEditCompany({ ...editCompany, address: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleDeleteCompany}
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
                setSelectedCompany(null);
              }}
              className="flex-1 px-4 py-2 border border-zinc-300 rounded-lg text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateCompany}
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
