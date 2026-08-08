import {
  ACTIVE_PIPELINE,
  APPLICATION_STATUSES,
  INTERVIEW_STATUSES,
  ROLE_TRACKS,
} from "./types.ts";
import type {
  ApplicationStatus,
  Internship,
  InternshipFilters,
  InternshipMetrics,
  RoleTrack,
} from "./types.ts";
import { isPastDate, isWithinNextWeek } from "./format.ts";

const CLOSED_STATUSES: readonly ApplicationStatus[] = ["Offer", "Rejected"];

const STATUS_MIGRATIONS: Record<string, ApplicationStatus> = {
  applied: "Applied",
  reviewing: "Applied",
  review: "Applied",
  "phone screen": "Phone Screen",
  "phone-screen": "Phone Screen",
  technical: "Technical Interview",
  "technical interview": "Technical Interview",
  "final interview": "Final Interview",
  accepted: "Offer",
  offer: "Offer",
  rejected: "Rejected",
  waitlist: "Waitlist",
  waitlisted: "Waitlist",
};

export function normalizeInternshipRecords(
  value: unknown,
): Internship[] | null {
  if (!Array.isArray(value)) return null;
  const normalized = value.map(normalizeInternshipRecord);
  return normalized.every((record): record is Internship => Boolean(record))
    ? normalized
    : null;
}

function normalizeInternshipRecord(
  value: unknown,
  index: number,
): Internship | null {
  if (typeof value !== "object" || value === null) return null;
  const record = value as Record<string, unknown>;
  const jobTitle = stringFrom(record.jobTitle, record.title);
  if (!jobTitle) return null;

  const now = new Date().toISOString();
  const rawStatus = stringFrom(record.status).toLowerCase();
  const status = STATUS_MIGRATIONS[rawStatus] ?? "Applied";
  const rawRole = stringFrom(record.roleTrack, record.track);
  const roleTrack: RoleTrack = ROLE_TRACKS.includes(rawRole as RoleTrack)
    ? (rawRole as RoleTrack)
    : "Other";

  return {
    id: stringFrom(record.id) || `migrated-${index}-${Date.now()}`,
    companyName:
      stringFrom(record.companyName, record.company, record.organization) ||
      "Company not recorded",
    companyLogoUrl: stringFrom(
      record.companyLogoUrl,
      record.logoUrl,
      record.logo,
    ),
    jobTitle,
    roleTrack,
    description: stringFrom(record.description),
    dateApplied: stringFrom(record.dateApplied, record.appliedDate),
    postingUrl: stringFrom(record.postingUrl, record.jobPostingUrl, record.url),
    resumeVersion: stringFrom(record.resumeVersion, record.resume),
    nextActionDate: stringFrom(record.nextActionDate, record.followUpDate),
    recruiterName: stringFrom(record.recruiterName, record.contactName),
    recruiterEmail: stringFrom(record.recruiterEmail, record.contactEmail),
    recruiterPhone: stringFrom(record.recruiterPhone, record.contactPhone),
    notes: stringFrom(record.notes),
    status,
    createdAt: stringFrom(record.createdAt) || now,
    updatedAt: stringFrom(record.updatedAt) || now,
  };
}

function stringFrom(...values: unknown[]): string {
  const value = values.find((candidate) => typeof candidate === "string");
  return typeof value === "string" ? value : "";
}

export function filterAndSortInternships(
  internships: Internship[],
  filters: InternshipFilters,
): Internship[] {
  const query = filters.search.trim().toLowerCase();

  return internships
    .filter(
      (internship) =>
        filters.status === "all" || internship.status === filters.status,
    )
    .filter(
      (internship) =>
        filters.roleTrack === "all" ||
        internship.roleTrack === filters.roleTrack,
    )
    .filter((internship) => {
      if (!query) return true;
      return [
        internship.companyName,
        internship.jobTitle,
        internship.description,
        internship.recruiterName,
        internship.recruiterEmail,
        internship.resumeVersion,
        internship.notes,
      ].some((value) => value.toLowerCase().includes(query));
    })
    .sort((a, b) => {
      switch (filters.sort) {
        case "date-asc":
          return a.dateApplied.localeCompare(b.dateApplied);
        case "next-action":
          return (a.nextActionDate || "9999-12-31").localeCompare(
            b.nextActionDate || "9999-12-31",
          );
        case "company":
          return a.companyName.localeCompare(b.companyName);
        case "status":
          return statusRank(b.status) - statusRank(a.status);
        case "updated":
          return b.updatedAt.localeCompare(a.updatedAt);
        case "date-desc":
        default:
          return b.dateApplied.localeCompare(a.dateApplied);
      }
    });
}

export function calculateMetrics(internships: Internship[]): InternshipMetrics {
  const statusCounts = Object.fromEntries(
    APPLICATION_STATUSES.map((status) => [status, 0]),
  ) as Record<ApplicationStatus, number>;

  const resumeCounts: Record<string, number> = {};
  for (const internship of internships) {
    statusCounts[internship.status] += 1;
    const resume = internship.resumeVersion.trim() || "Unspecified";
    resumeCounts[resume] = (resumeCounts[resume] ?? 0) + 1;
  }

  const total = internships.length;
  const interviews = internships.filter((item) =>
    INTERVIEW_STATUSES.includes(item.status),
  ).length;
  const reachedInterview = interviews + statusCounts.Offer;
  const openActionItems = internships.filter(
    (item) => !CLOSED_STATUSES.includes(item.status),
  );

  return {
    total,
    interviews,
    rejections: statusCounts.Rejected,
    offers: statusCounts.Offer,
    interviewRate: total ? Math.round((reachedInterview / total) * 100) : 0,
    offerRate: total ? Math.round((statusCounts.Offer / total) * 100) : 0,
    overdueActions: openActionItems.filter((item) =>
      isPastDate(item.nextActionDate),
    ).length,
    upcomingActions: openActionItems.filter((item) =>
      isWithinNextWeek(item.nextActionDate),
    ).length,
    statusCounts,
    resumeCounts,
  };
}

export function statusRank(status: ApplicationStatus): number {
  const pipelineRank = ACTIVE_PIPELINE.indexOf(
    status as (typeof ACTIVE_PIPELINE)[number],
  );
  if (pipelineRank >= 0) return pipelineRank;
  if (status === "Waitlist") return 1;
  return -1;
}
