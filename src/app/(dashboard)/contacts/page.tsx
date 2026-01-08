"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import Header from "@/components/ui/Header";
import Modal from "@/components/ui/Modal";
import { Contact, Company } from "@/lib/types";
import { Mail, Phone, Building2, MoreHorizontal, Loader2, Trash2 } from "lucide-react";

export default function Contacts() {
  const supabase = createClient();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [newContact, setNewContact] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
    company_id: "",
  });
  const [editContact, setEditContact] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
    company_id: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [contactsResult, companiesResult] = await Promise.all([
        supabase.from("contacts").select("*").order("created_at", { ascending: false }),
        supabase.from("companies").select("*").order("name"),
      ]);

      if (contactsResult.data) setContacts(contactsResult.data);
      if (companiesResult.data) setCompanies(companiesResult.data);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCompanyName = (companyId: string | null) => {
    if (!companyId) return "-";
    const company = companies.find((c) => c.id === companyId);
    return company?.name || "-";
  };

  const handleAddContact = async () => {
    if (!newContact.firstName || !newContact.lastName) return;

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("contacts")
        .insert({
          first_name: newContact.firstName,
          last_name: newContact.lastName,
          email: newContact.email || null,
          phone: newContact.phone || null,
          position: newContact.position || null,
          company_id: newContact.company_id || null,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setContacts([data, ...contacts]);
      }

      setNewContact({ firstName: "", lastName: "", email: "", phone: "", position: "", company_id: "" });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding contact:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact);
    setEditContact({
      firstName: contact.first_name,
      lastName: contact.last_name,
      email: contact.email || "",
      phone: contact.phone || "",
      position: contact.position || "",
      company_id: contact.company_id || "",
    });
    setIsDetailModalOpen(true);
  };

  const handleUpdateContact = async () => {
    if (!selectedContact || !editContact.firstName || !editContact.lastName) return;

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from("contacts")
        .update({
          first_name: editContact.firstName,
          last_name: editContact.lastName,
          email: editContact.email || null,
          phone: editContact.phone || null,
          position: editContact.position || null,
          company_id: editContact.company_id || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedContact.id)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setContacts(contacts.map((c) => (c.id === data.id ? data : c)));
      }

      setIsDetailModalOpen(false);
      setSelectedContact(null);
    } catch (error) {
      console.error("Error updating contact:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteContact = async () => {
    if (!selectedContact) return;

    setDeleting(true);
    try {
      const { error } = await supabase
        .from("contacts")
        .delete()
        .eq("id", selectedContact.id);

      if (error) throw error;

      setContacts(contacts.filter((c) => c.id !== selectedContact.id));
      setIsDetailModalOpen(false);
      setSelectedContact(null);
    } catch (error) {
      console.error("Error deleting contact:", error);
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
        title="Contacts"
        onAddNew={() => setIsModalOpen(true)}
        addNewLabel="Add Contact"
      />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200">
                <th className="text-left px-6 py-3 text-sm font-semibold text-zinc-900">Name</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-zinc-900">Email</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-zinc-900">Phone</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-zinc-900">Company</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-zinc-900">Position</th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {contacts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                    No contacts yet. Add your first contact to get started.
                  </td>
                </tr>
              ) : (
                contacts.map((contact) => (
                  <tr
                    key={contact.id}
                    className="hover:bg-zinc-50 cursor-pointer"
                    onClick={() => handleContactClick(contact)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                          {contact.first_name[0]}{contact.last_name[0]}
                        </div>
                        <div className="font-medium text-zinc-900">
                          {contact.first_name} {contact.last_name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {contact.email ? (
                        <div className="flex items-center gap-2 text-zinc-600">
                          <Mail className="w-4 h-4" />
                          {contact.email}
                        </div>
                      ) : (
                        <span className="text-zinc-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {contact.phone ? (
                        <div className="flex items-center gap-2 text-zinc-600">
                          <Phone className="w-4 h-4" />
                          {contact.phone}
                        </div>
                      ) : (
                        <span className="text-zinc-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-zinc-600">
                        <Building2 className="w-4 h-4" />
                        {getCompanyName(contact.company_id)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-600">{contact.position || "-"}</td>
                    <td className="px-6 py-4">
                      <button
                        className="p-1 text-zinc-400 hover:text-zinc-600 rounded"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleContactClick(contact);
                        }}
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Contact Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Contact"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                value={newContact.firstName}
                onChange={(e) => setNewContact({ ...newContact, firstName: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={newContact.lastName}
                onChange={(e) => setNewContact({ ...newContact, lastName: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={newContact.email}
              onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={newContact.phone}
              onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Company
            </label>
            <select
              value={newContact.company_id}
              onChange={(e) => setNewContact({ ...newContact, company_id: e.target.value })}
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
              Position
            </label>
            <input
              type="text"
              value={newContact.position}
              onChange={(e) => setNewContact({ ...newContact, position: e.target.value })}
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
              onClick={handleAddContact}
              disabled={saving}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Contact"
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Contact Detail/Edit Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedContact(null);
        }}
        title="Edit Contact"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                value={editContact.firstName}
                onChange={(e) => setEditContact({ ...editContact, firstName: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={editContact.lastName}
                onChange={(e) => setEditContact({ ...editContact, lastName: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={editContact.email}
              onChange={(e) => setEditContact({ ...editContact, email: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={editContact.phone}
              onChange={(e) => setEditContact({ ...editContact, phone: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Company
            </label>
            <select
              value={editContact.company_id}
              onChange={(e) => setEditContact({ ...editContact, company_id: e.target.value })}
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
              Position
            </label>
            <input
              type="text"
              value={editContact.position}
              onChange={(e) => setEditContact({ ...editContact, position: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleDeleteContact}
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
                setSelectedContact(null);
              }}
              className="flex-1 px-4 py-2 border border-zinc-300 rounded-lg text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateContact}
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
