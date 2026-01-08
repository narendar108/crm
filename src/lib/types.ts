export type DealStage = "lead" | "qualified" | "proposal" | "negotiation" | "closed_won" | "closed_lost";

export type Deal = {
  id: string;
  title: string;
  value: number;
  currency: string;
  stage: DealStage;
  contact_id: string | null;
  company_id: string | null;
  expected_close_date: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
  contact?: Contact;
  company?: Company;
};

export type Contact = {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  company_id: string | null;
  position: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
  company?: Company;
};

export type Company = {
  id: string;
  name: string;
  industry: string | null;
  website: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
};

export type Activity = {
  id: string;
  type: "call" | "email" | "meeting" | "task" | "note";
  title: string;
  description: string | null;
  due_date: string | null;
  completed: boolean;
  deal_id: string | null;
  contact_id: string | null;
  company_id: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
  deal?: Deal;
  contact?: Contact;
  company?: Company;
};

export type User = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
};

export const DEAL_STAGES: { id: DealStage; label: string; color: string }[] = [
  { id: "lead", label: "Lead", color: "bg-slate-500" },
  { id: "qualified", label: "Qualified", color: "bg-blue-500" },
  { id: "proposal", label: "Proposal", color: "bg-yellow-500" },
  { id: "negotiation", label: "Negotiation", color: "bg-orange-500" },
  { id: "closed_won", label: "Closed Won", color: "bg-green-500" },
  { id: "closed_lost", label: "Closed Lost", color: "bg-red-500" },
];

export const ACTIVITY_TYPES = [
  { id: "call", label: "Call", icon: "Phone" },
  { id: "email", label: "Email", icon: "Mail" },
  { id: "meeting", label: "Meeting", icon: "Calendar" },
  { id: "task", label: "Task", icon: "CheckSquare" },
  { id: "note", label: "Note", icon: "FileText" },
] as const;
