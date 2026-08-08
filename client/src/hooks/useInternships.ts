import { useCallback, useEffect, useMemo, useState } from "react";
import {
  calculateMetrics,
  filterAndSortInternships,
  normalizeInternshipRecords,
} from "../lib/internships";
import { SEED_INTERNSHIPS } from "../lib/seed";
import type {
  ApplicationStatus,
  Internship,
  InternshipDraft,
  InternshipFilters,
  RoleTrack,
  SortOption,
} from "../lib/types";

const STORAGE_KEY = "runbook.applications.v1";
const LEGACY_STORAGE_KEYS = ["runbook.internships", "applyarc.applications.v1"];

function loadInternships(): Internship[] {
  if (typeof window === "undefined") return SEED_INTERNSHIPS;
  const stored =
    window.localStorage.getItem(STORAGE_KEY) ??
    LEGACY_STORAGE_KEYS.map((key) => window.localStorage.getItem(key)).find(
      Boolean,
    );
  if (!stored) return SEED_INTERNSHIPS;
  try {
    const parsed: unknown = JSON.parse(stored);
    return normalizeInternshipRecords(parsed) ?? SEED_INTERNSHIPS;
  } catch {
    return SEED_INTERNSHIPS;
  }
}

function makeId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `application-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function useInternships() {
  const [internships, setInternships] = useState<Internship[]>(loadInternships);
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">(
    "all",
  );
  const [roleFilter, setRoleFilter] = useState<RoleTrack | "all">("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("date-desc");

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(internships));
  }, [internships]);

  const addInternship = useCallback((draft: InternshipDraft) => {
    const timestamp = new Date().toISOString();
    setInternships((current) => [
      ...current,
      { ...draft, id: makeId(), createdAt: timestamp, updatedAt: timestamp },
    ]);
  }, []);

  const updateInternship = useCallback(
    (id: string, changes: Partial<InternshipDraft>) => {
      setInternships((current) =>
        current.map((internship) =>
          internship.id === id
            ? { ...internship, ...changes, updatedAt: new Date().toISOString() }
            : internship,
        ),
      );
    },
    [],
  );

  const removeInternship = useCallback((id: string) => {
    setInternships((current) =>
      current.filter((internship) => internship.id !== id),
    );
  }, []);

  const clearAll = useCallback(() => setInternships([]), []);
  const restoreSamples = useCallback(
    () => setInternships(SEED_INTERNSHIPS),
    [],
  );
  const replaceAll = useCallback(
    (records: Internship[]) => setInternships(records),
    [],
  );

  const filters: InternshipFilters = useMemo(
    () => ({ status: statusFilter, roleTrack: roleFilter, search, sort }),
    [roleFilter, search, sort, statusFilter],
  );

  const visibleInternships = useMemo(
    () => filterAndSortInternships(internships, filters),
    [filters, internships],
  );
  const metrics = useMemo(() => calculateMetrics(internships), [internships]);

  return {
    internships,
    visibleInternships,
    metrics,
    filters,
    setStatusFilter,
    setRoleFilter,
    setSearch,
    setSort,
    addInternship,
    updateInternship,
    removeInternship,
    clearAll,
    restoreSamples,
    replaceAll,
  };
}
