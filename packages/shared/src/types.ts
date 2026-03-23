// ─────────────────────────────────────────────────────────────
// ROLES & STATUS CONSTANTS
// We use 'as const' objects instead of TypeScript enums.
// 'as const' tells TypeScript to treat these values as literal
// types ("citizen") rather than widened types (string).
// The 'keyof typeof' trick then derives a union type from the
// object's values, so we never have to type them twice.
// ─────────────────────────────────────────────────────────────

export const UserRole = {
  CITIZEN: "citizen",
  OFFICIAL: "official",
  ADMIN: "admin",
} as const;

// This derives the type: "citizen" | "official" | "admin"

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const IssueStatus = {
  PENDING: "pending",
  UNDER_REVIEW: "under_review",
  IN_PROGRESS: "in_progress",
  RESOLVED: "resolved",
  REJECTED: "rejected",
} as const;

export type IssueStatus = (typeof IssueStatus)[keyof typeof IssueStatus];

export const IssueCategory = {
  ROAD_INFRASTRUCTURE: "road_infrastructure",
  WATER_SANITATION: "water_sanitation",
  ELECTRICITY: "electricity",
  WASTE_MANAGEMENT: "waste_management",
  PUBLIC_SAFETY: "public_safety",
  ENVIRONMENT: "environment",
  OTHER: "other",
} as const;

export type IssueCategory = (typeof IssueCategory)[keyof typeof IssueCategory];

// ─────────────────────────────────────────────────────────────
// BASE ENTITY
// Every entity in CivicPulse has these four fields.
// We define them once here and compose them into every entity
// below. This is the DRY (Don't Repeat Yourself) principle
// applied at the type level.
// ─────────────────────────────────────────────────────────────

interface BaseEntity {
  readonly id: string; // UUID — 'readonly' means TypeScript
  readonly createdAt: Date; // will error if you try to reassign
  readonly updatedAt: Date; // these fields after creation
}

// ─────────────────────────────────────────────────────────────
// USER
// The '?' after a field name makes it optional — TypeScript
// will accept the object even if that field is absent.
// Optional fields always have the type 'T | undefined' implicitly.
// ─────────────────────────────────────────────────────────────

export interface User extends BaseEntity {
  email: string;
  name: string;
  avatarUrl?: string; // optional — not all users set an avatar
  role: UserRole;
  isEmailVerified: boolean;
  isActive: boolean;
  // Officials have an associated ward/constituency.
  // Citizens leave this undefined.
  wardName?: string;
}

// ─────────────────────────────────────────────────────────────
// LOCATION
// We separate geographic data from the Issue itself.
// This is a deliberate design decision: if we later want to
// support "areas" (polygons, not just points), we only change
// this type — not the entire Issue type.
// ─────────────────────────────────────────────────────────────

export interface Location {
  latitude: number;
  longitude: number;
  address?: string; // human-readable address from reverse geocoding
  ward?: string; // administrative division (e.g. "Westlands Ward")
  county?: string; // e.g. "Nairobi County"
}

// ─────────────────────────────────────────────────────────────
// ISSUE
// This is the central entity of the entire system.
// Notice we embed 'Location' directly (composition) rather than
// just storing a locationId. For reads, this is more efficient —
// you get the full location data without a separate DB query.
// ─────────────────────────────────────────────────────────────

export interface Issue extends BaseEntity {
  title: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  location: Location;

  // The citizen who reported this issue
  reportedBy: string; // User ID reference

  // When an official picks this up, these get populated
  assignedTo?: string; // Official's User ID
  assignedAt?: Date;

  // Populated from our votes system — stored as a denormalized
  // count for fast rendering (avoids COUNT() query on every load)
  voteCount: number;

  photoUrls: string[]; // Array of S3/R2 URLs

  // AI-generated fields (we add these in Week 17)
  aiCategory?: IssueCategory; // What the AI thinks the category is
  isDuplicate?: boolean;
  duplicateOfId?: string;
}

// ─────────────────────────────────────────────────────────────
// VOTE
// Simple junction entity: one user, one issue, one vote.
// Notice there's no 'voteType' (upvote/downvote) — CivicPulse
// only has upvotes. This is a product decision: downvotes on
// civic issues can suppress legitimate community needs.
// ─────────────────────────────────────────────────────────────

export interface Vote extends BaseEntity {
  userId: string;
  issueId: string;
}

// ─────────────────────────────────────────────────────────────
// COMMENT
// Officials can post updates; citizens can respond.
// 'isOfficialUpdate' distinguishes a public comment from an
// official status update — the frontend styles them differently.
// ─────────────────────────────────────────────────────────────

export interface Comment extends BaseEntity {
  issueId: string;
  authorId: string;
  content: string;
  isOfficialUpdate: boolean;
}

// ─────────────────────────────────────────────────────────────
// AUDIT LOG
// Every status change creates an immutable audit log entry.
// This is how the "issue history" feature works — you can see
// every state transition, who made it, and when.
// Notice this has NO 'updatedAt' — audit logs are never updated.
// ─────────────────────────────────────────────────────────────

export interface AuditLog {
  readonly id: string;
  readonly createdAt: Date;
  issueId: string;
  changedBy: string; // User ID of who made the change
  previousStatus: IssueStatus;
  newStatus: IssueStatus;
  note?: string; // Optional explanation for the change
}

// ─────────────────────────────────────────────────────────────
// NOTIFICATION
// ─────────────────────────────────────────────────────────────

export const NotificationType = {
  ISSUE_STATUS_CHANGED: "issue_status_changed",
  ISSUE_COMMENTED: "issue_commented",
  VOTE_MILESTONE: "vote_milestone", // "Your issue just hit 100 votes!"
} as const;

export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];

export interface Notification extends BaseEntity {
  userId: string; // Who receives this notification
  type: NotificationType;
  issueId: string; // Which issue triggered it
  message: string;
  isRead: boolean;
}


// ─────────────────────────────────────────────────────────────
// API RESPONSE WRAPPERS
// The 'T' is a type parameter — a placeholder that gets filled
// in when you USE the type. Like a function parameter, but for
// types. When you write ApiResponse<Issue>, TypeScript replaces
// every 'T' with 'Issue' throughout the definition.
// ─────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;               // total records in the DB matching the query
  page: number;
  pageSize: number;
  hasNextPage: boolean;
  cursor?: string;             // for cursor-based pagination (Week 18)
}

export interface ApiError {
  error: string;
  code: string;                // e.g. "ISSUE_NOT_FOUND", "UNAUTHORIZED"
  details?: Record<string, string[]>; // validation errors per field
}

// ─────────────────────────────────────────────────────────────
// DERIVED CONVENIENCE TYPES using TypeScript Utility Types
// These are types you compute FROM other types — no repetition.
//
// 'Omit<T, K>' creates a type that is T with certain keys removed.
// 'Pick<T, K>' creates a type with only the keys you specify.
// 'Partial<T>' makes every field optional.
// ─────────────────────────────────────────────────────────────

// What the frontend sends when creating a new issue
// We omit all the fields the server generates
export type CreateIssueDto = Omit
  Issue,
  "id" | "createdAt" | "updatedAt" | "reportedBy" |
  "voteCount" | "assignedTo" | "assignedAt" | "aiCategory" | "isDuplicate" | "duplicateOfId"
>;

// What an official sends when updating an issue's status
export type UpdateIssueStatusDto = Pick<Issue, "status"> & {
  note?: string;               // optional explanation (goes into AuditLog)
};

// A lightweight version of Issue for the map view —
// we don't need description or photos, just enough to render a pin
export type IssueMapPin = Pick
  Issue,
  "id" | "title" | "category" | "status" | "location" | "voteCount"
>;

// ─────────────────────────────────────────────────────────────
// QUERY PARAMETERS TYPES
// TypeScript types for what the frontend sends as URL query
// params when filtering the issue list
// ─────────────────────────────────────────────────────────────

export interface IssueQueryParams {
  category?: IssueCategory;
  status?: IssueStatus;
  ward?: string;
  sortBy?: "voteCount" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
  // For map-bounded queries: "only fetch issues in this bounding box"
  boundingBox?: {
    northEast: Location;
    southWest: Location;
  };
}