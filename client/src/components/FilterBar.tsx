import {
  ArrowDownAZ,
  CalendarArrowDown,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  APPLICATION_STATUSES,
  ROLE_TRACKS,
  SORT_OPTIONS,
  type ApplicationStatus,
  type InternshipFilters,
  type RoleTrack,
  type SortOption,
} from "../lib/types";

interface FilterBarProps {
  filters: InternshipFilters;
  resultCount: number;
  totalCount: number;
  setStatus: (value: ApplicationStatus | "all") => void;
  setRoleTrack: (value: RoleTrack | "all") => void;
  setSearch: (value: string) => void;
  setSort: (value: SortOption) => void;
}

export function FilterBar({
  filters,
  resultCount,
  totalCount,
  setStatus,
  setRoleTrack,
  setSearch,
  setSort,
}: FilterBarProps) {
  const hasFilters =
    filters.status !== "all" ||
    filters.roleTrack !== "all" ||
    Boolean(filters.search);
  const reset = () => {
    setStatus("all");
    setRoleTrack("all");
    setSearch("");
  };

  return (
    <section
      className="filter-bar mat-instrument"
      aria-label="Filter and sort applications"
    >
      <div className="search-field">
        <Search size={16} aria-hidden="true" />
        <label className="sr-only" htmlFor="application-search">
          Search applications
        </label>
        <input
          id="application-search"
          value={filters.search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search company, role, recruiter, notes…"
        />
        {filters.search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="filter-selects">
        <label>
          <span className="sr-only">Filter by status</span>
          <select
            value={filters.status}
            onChange={(event) =>
              setStatus(event.target.value as ApplicationStatus | "all")
            }
          >
            <option value="all">All statuses</option>
            {APPLICATION_STATUSES.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">Filter by role track</span>
          <select
            value={filters.roleTrack}
            onChange={(event) =>
              setRoleTrack(event.target.value as RoleTrack | "all")
            }
          >
            <option value="all">All role tracks</option>
            {ROLE_TRACKS.map((role) => (
              <option key={role}>{role}</option>
            ))}
          </select>
        </label>
        <label className="sort-select">
          <SlidersHorizontal size={14} aria-hidden="true" />
          <span className="sr-only">Sort applications</span>
          <select
            value={filters.sort}
            onChange={(event) => setSort(event.target.value as SortOption)}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="quick-sort" aria-label="Quick sort">
        <button
          className={filters.sort === "date-desc" ? "is-active" : ""}
          type="button"
          onClick={() => setSort("date-desc")}
          title="Sort by newest date applied"
        >
          <CalendarArrowDown size={15} /> Date
        </button>
        <button
          className={filters.sort === "company" ? "is-active" : ""}
          type="button"
          onClick={() => setSort("company")}
          title="Sort by company name"
        >
          <ArrowDownAZ size={15} /> A–Z
        </button>
      </div>

      <div className="result-count">
        <span>
          {resultCount} / {totalCount}
        </span>
        {hasFilters && (
          <button type="button" onClick={reset}>
            Reset filters
          </button>
        )}
      </div>
    </section>
  );
}
