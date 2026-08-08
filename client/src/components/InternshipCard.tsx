import { useEffect, useState } from "react";
import {
  CalendarClock,
  ExternalLink,
  FileText,
  Mail,
  MoreHorizontal,
  Pencil,
  StickyNote,
  Trash2,
} from "lucide-react";
import { displayHost, isPastDate } from "../lib/format";
import type { ApplicationStatus, Internship } from "../lib/types";
import { CompanyLogo } from "./CompanyLogo";
import { StageLadder, StatusChip, statusKey } from "./StatusChip";

export function InternshipCard({
  internship,
  index,
  onOpen,
  onEdit,
  onDelete,
  onStatusChange,
  onNotesChange,
}: {
  internship: Internship;
  index: number;
  onOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (status: ApplicationStatus) => void;
  onNotesChange: (notes: string) => void;
}) {
  const [notes, setNotes] = useState(internship.notes);

  useEffect(() => setNotes(internship.notes), [internship.notes]);

  return (
    <article
      className={`internship-card mat-card status-card-${statusKey(internship.status)}`}
      style={{ "--card-index": index } as React.CSSProperties}
    >
      <span className="status-spine" aria-hidden="true" />
      <header className="card-header">
        <CompanyLogo
          companyName={internship.companyName}
          logoUrl={internship.companyLogoUrl}
        />
        <div className="card-company">
          <span className="section-kicker">{internship.roleTrack}</span>
          <h3>{internship.companyName}</h3>
        </div>
        <details className="card-menu">
          <summary
            className="icon-button mat-control"
            aria-label={`Actions for ${internship.companyName}`}
          >
            <MoreHorizontal size={17} />
          </summary>
          <div className="card-menu-popover mat-float">
            <button type="button" onClick={onEdit}>
              <Pencil size={14} /> Edit
            </button>
            <button type="button" className="danger-copy" onClick={onDelete}>
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </details>
      </header>

      <div className="card-title-block">
        <h4>{internship.jobTitle}</h4>
        <p>{internship.description || "No job description saved yet."}</p>
      </div>

      <div className="card-status-row">
        <StatusChip
          status={internship.status}
          onChange={onStatusChange}
          compact
        />
        <StageLadder status={internship.status} />
      </div>

      <dl className="card-metadata">
        <div>
          <dt>Applied</dt>
          <dd className="t-mono">{internship.dateApplied || "—"}</dd>
        </div>
        <div
          className={isPastDate(internship.nextActionDate) ? "is-overdue" : ""}
        >
          <dt>
            <CalendarClock size={12} /> Next action
          </dt>
          <dd className="t-mono">{internship.nextActionDate || "Not set"}</dd>
        </div>
        <div className="metadata-wide">
          <dt>
            <FileText size={12} /> Resume
          </dt>
          <dd title={internship.resumeVersion}>
            {internship.resumeVersion || "Not recorded"}
          </dd>
        </div>
        {(internship.recruiterName || internship.recruiterEmail) && (
          <div className="metadata-wide">
            <dt>
              <Mail size={12} /> Recruiter
            </dt>
            <dd>{internship.recruiterName || internship.recruiterEmail}</dd>
          </div>
        )}
      </dl>

      <div className="card-notes">
        <label htmlFor={`notes-${internship.id}`}>
          <StickyNote size={13} /> Manual notes
        </label>
        <textarea
          id={`notes-${internship.id}`}
          rows={2}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          onBlur={() => notes !== internship.notes && onNotesChange(notes)}
          placeholder="Prep notes, salary, research…"
        />
      </div>

      <footer className="card-footer">
        {internship.postingUrl ? (
          <a
            href={internship.postingUrl}
            target="_blank"
            rel="noreferrer"
            className="posting-compact"
            title={internship.postingUrl}
          >
            {displayHost(internship.postingUrl)} <ExternalLink size={12} />
          </a>
        ) : (
          <span className="posting-missing">No posting URL</span>
        )}
        <button className="card-open-button" type="button" onClick={onOpen}>
          Open record
        </button>
      </footer>
    </article>
  );
}
