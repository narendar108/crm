"use client";

import { useState } from "react";
import Header from "@/components/ui/Header";
import Modal from "@/components/ui/Modal";
import { Contact } from "@/lib/types";
import { Mail, Phone, Building2, MoreHorizontal, User } from "lucide-react";

const initialContacts: Contact[] = [
  { id: "1", first_name: "John", last_name: "Smith", email: "john@acme.com", phone: "+1 555-0101", company_id: "1", position: "CEO", created_at: "", updated_at: "", user_id: "" },
  { id: "2", first_name: "Sarah", last_name: "Johnson", email: "sarah@techstart.com", phone: "+1 555-0102", company_id: "2", position: "CTO", created_at: "", updated_at: "", user_id: "" },
  { id: "3", first_name: "Michael", last_name: "Brown", email: "michael@global.com", phone: "+1 555-0103", company_id: "3", position: "VP Sales", created_at: "", updated_at: "", user_id: "" },
  { id: "4", first_name: "Emily", last_name: "Davis", email: "emily@dataflow.com", phone: "+1 555-0104", company_id: "4", position: "Director", created_at: "", updated_at: "", user_id: "" },
  { id: "5", first_name: "David", last_name: "Wilson", email: "david@cloudnine.com", phone: "+1 555-0105", company_id: "5", position: "Manager", created_at: "", updated_at: "", user_id: "" },
  { id: "6", first_name: "Lisa", last_name: "Anderson", email: "lisa@innovate.com", phone: "+1 555-0106", company_id: "6", position: "CFO", created_at: "", updated_at: "", user_id: "" },
  { id: "7", first_name: "James", last_name: "Taylor", email: "james@future.com", phone: "+1 555-0107", company_id: "7", position: "COO", created_at: "", updated_at: "", user_id: "" },
  { id: "8", first_name: "Jennifer", last_name: "Martinez", email: "jennifer@digital.com", phone: "+1 555-0108", company_id: "8", position: "VP Marketing", created_at: "", updated_at: "", user_id: "" },
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

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newContact, setNewContact] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
    company: "",
  });

  const handleAddContact = () => {
    if (!newContact.firstName || !newContact.lastName) return;

    const contact: Contact = {
      id: String(Date.now()),
      first_name: newContact.firstName,
      last_name: newContact.lastName,
      email: newContact.email || null,
      phone: newContact.phone || null,
      company_id: null,
      position: newContact.position || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: "",
    };

    setContacts([...contacts, contact]);
    setNewContact({ firstName: "", lastName: "", email: "", phone: "", position: "", company: "" });
    setIsModalOpen(false);
  };

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
              {contacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-zinc-50">
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
                    <div className="flex items-center gap-2 text-zinc-600">
                      <Mail className="w-4 h-4" />
                      {contact.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-zinc-600">
                      <Phone className="w-4 h-4" />
                      {contact.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-zinc-600">
                      <Building2 className="w-4 h-4" />
                      {contact.company_id ? companies[contact.company_id] : "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-600">{contact.position}</td>
                  <td className="px-6 py-4">
                    <button className="p-1 text-zinc-400 hover:text-zinc-600 rounded">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
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
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Contact
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
