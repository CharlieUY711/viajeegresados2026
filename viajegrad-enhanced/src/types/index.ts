// ─── Auth ────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: "admin" | "member";
  created_at: string;
}

// ─── Events ──────────────────────────────────────────────────────────────────
export type EventStatus = "upcoming" | "ongoing" | "completed" | "cancelled";
export type EventCategory = "fundraising" | "social" | "meeting" | "trip";

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  end_date?: string;
  location?: string;
  category: EventCategory;
  status: EventStatus;
  max_participants?: number;
  current_participants?: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface EventParticipant {
  id: string;
  event_id: string;
  user_id: string;
  joined_at: string;
  user?: User;
}

// ─── Finance ─────────────────────────────────────────────────────────────────
export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  event_id?: string;
  type: TransactionType;
  amount: number;
  description: string;
  responsible_id: string;
  date: string;
  created_at: string;
  event?: Pick<Event, "id" | "title">;
  responsible?: Pick<User, "id" | "full_name">;
}

export interface FinanceSummary {
  total_income: number;
  total_expenses: number;
  net: number;
  goal: number;
  progress_percentage: number;
}

export interface FinanceRow {
  event: string;
  income: number;
  expenses: number;
  net: number;
  responsible: string;
  date: string;
}

// ─── Commissions ─────────────────────────────────────────────────────────────
export type TaskStatus = "pending" | "in_progress" | "completed";

export interface CommissionTask {
  id: string;
  commission_id: string;
  title: string;
  status: TaskStatus;
  assigned_to?: string;
  due_date?: string;
  created_at: string;
}

export interface Commission {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  created_at: string;
  members?: CommissionMember[];
  tasks?: CommissionTask[];
}

export interface CommissionMember {
  id: string;
  commission_id: string;
  user_id: string;
  role: "lead" | "member";
  joined_at: string;
  user?: User;
}

// ─── Gallery ─────────────────────────────────────────────────────────────────
export type MediaType = "image" | "video";

export interface GalleryItem {
  id: string;
  storage_path: string;
  public_url: string;
  thumbnail_url?: string;
  type: MediaType;
  title?: string;
  description?: string;
  event_id?: string;
  uploaded_by: string;
  uploaded_at: string;
  event?: Pick<Event, "id" | "title">;
  uploader?: Pick<User, "id" | "full_name">;
}

// ─── Documents ───────────────────────────────────────────────────────────────
export type DocumentCategory =
  | "contract"
  | "report"
  | "budget"
  | "consent"
  | "other";

export interface Document {
  id: string;
  name: string;
  description?: string;
  storage_path: string;
  public_url: string;
  file_size: number;
  file_type: string;
  category: DocumentCategory;
  event_id?: string;
  uploaded_by: string;
  uploaded_at: string;
  event?: Pick<Event, "id" | "title">;
  uploader?: Pick<User, "id" | "full_name">;
}

// ─── Games ───────────────────────────────────────────────────────────────────
export type PoolType = "prediction" | "raffle" | "challenge";

export interface Pool {
  id: string;
  title: string;
  description: string;
  type: PoolType;
  entry_fee: number;
  prize_description: string;
  deadline: string;
  status: "open" | "closed" | "finished";
  created_by: string;
  created_at: string;
  participants?: PoolParticipant[];
}

export interface PoolParticipant {
  id: string;
  pool_id: string;
  user_id: string;
  prediction?: string;
  joined_at: string;
  score?: number;
  user?: User;
}

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  full_name: string;
  avatar_url?: string;
  total_points: number;
  events_participated: number;
  pools_won: number;
}

// ─── Activity ────────────────────────────────────────────────────────────────
export type ActivityType =
  | "event_created"
  | "event_joined"
  | "transaction_added"
  | "photo_uploaded"
  | "document_uploaded"
  | "commission_task_completed"
  | "pool_joined";

export interface Activity {
  id: string;
  type: ActivityType;
  user_id: string;
  reference_id?: string;
  reference_label?: string;
  created_at: string;
  user?: Pick<User, "id" | "full_name" | "avatar_url">;
}

// ─── UI Helpers ──────────────────────────────────────────────────────────────
export interface SelectOption {
  value: string;
  label: string;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}
