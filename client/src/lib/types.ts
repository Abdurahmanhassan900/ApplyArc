export const APPLICATION_STATUSES = [
  "Applied",
  "Phone Screen",
  "Technical Interview",
  "Final Interview",
  "Offer",
  "Rejected",
  "Waitlist",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const ACTIVE_PIPELINE = [
  "Applied",
  "Phone Screen",
  "Technical Interview",
  "Final Interview",
  "Offer",
] as const satisfies readonly ApplicationStatus[];

export const INTERVIEW_STATUSES: readonly ApplicationStatus[] = [
  "Phone Screen",
  "Technical Interview",
  "Final Interview",
];

export const ROLE_TRACKS = [
  "Cloud Engineering",
  "DevOps",
  "Systems",
  "Software Engineering",
  "Security",
  "Other",
] as const;

export type RoleTrack = (typeof ROLE_TRACKS)[number];

export const SORT_OPTIONS = [
  { value: "date-desc", label: "Date applied — newest" },
  { value: "date-asc", label: "Date applied — oldest" },
  { value: "next-action", label: "Next action — soonest" },
  { value: "company", label: "Company — A to Z" },
  { value: "status", label: "Pipeline — furthest first" },
  { value: "updated", label: "Recently updated" },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];

export interface Internship {
  id: string;
  companyName: string;
  companyLogoUrl: string;
  jobTitle: string;
  roleTrack: RoleTrack;
  description: string;
  dateApplied: string;
  postingUrl: string;
  resumeVersion: string;
  nextActionDate: string;
  recruiterName: string;
  recruiterEmail: string;
  recruiterPhone: string;
  notes: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
}

export type InternshipDraft = Omit<
  Internship,
  "id" | "createdAt" | "updatedAt"
>;

export interface InternshipMetrics {
  total: number;
  interviews: number;
  rejections: number;
  offers: number;
  interviewRate: number;
  offerRate: number;
  overdueActions: number;
  upcomingActions: number;
  statusCounts: Record<ApplicationStatus, number>;
  resumeCounts: Record<string, number>;
}

export interface InternshipFilters {
  status: ApplicationStatus | "all";
  roleTrack: RoleTrack | "all";
  search: string;
  sort: SortOption;
}
