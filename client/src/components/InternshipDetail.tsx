import { useEffect, useId, useState } from "react";
import {
  CalendarDays,
  ExternalLink,
  Mail,
  Phone,
  Pencil,
  Save,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { displayHost, isPastDate } from "../lib/format";
import type { Internship } from "../lib/types";
import { CompanyLogo } from "./CompanyLogo";
import { StageLadder, StatusChip } from "./StatusChip";

export function InternshipDetail({
  internship,
  onClose,
  onEdit,
  onDelete,
  onNotesChange,
}: {
  internship: Internship | null;
  onClose: () => void;
  onEdit: (internship: Internship) => void;
  onDelete: (internship: Internship) => void;
  onNotesChange: (notes: string) => void;
}) {
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);
  const titleId = useId();

  useEffect(() => {
    setNotes(internship?.notes ?? "");
    setSaved(false);
  }, [internship]);

  useEffect(() => {
    if (!internship) return;
    const closeOnEscape = (event: KeyboardEvent) =>
      event.key === "Escape" && onClose();
    document.body.classList.add("modal-open");
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [internship, onClose]);

  if (!internship) return null;

  const saveNotes = () => {
    onNotesChange(notes);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1600);
  };

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        className="detail-modal mat-float"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header className="detail-hero">
          <CompanyLogo
            companyName={internship.companyName}
            logoUrl={internship.companyLogoUrl}
          />
          <div className="detail-identity">
            <span className="section-kicker">
              APPLICATION RECORD / {internship.roleTrack}
            </span>
            <h2 id={titleId}>{internship.jobTitle}</h2>
            <p>{internship.companyName}</p>
          </div>
          <button
            className="icon-button mat-control detail-close"
            type="button"
            onClick={onClose}
            aria-label="Close application details"
          >
            <X size={18} />
          </button>
        </header>

        <div className="detail-pipeline">
          <StatusChip status={internship.status} />
          <StageLadder status={internship.status} />
        </div>

        <div className="detail-body">
          <div className="detail-main">
            <section>
              <span className="section-kicker">ROLE BRIEF</span>
              <p className="detail-description">
                {internship.description || "No job description saved."}
              </p>
              {internship.postingUrl && (
                <a
                  className="posting-link mat-control"
                  href={internship.postingUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {displayHost(internship.postingUrl)}{" "}
                  <ExternalLink size={14} />
                </a>
              )}
            </section>

            <section className="detail-notes-section">
              <div className="notes-heading">
                <div>
                  <span className="section-kicker">MANUAL NOTES</span>
                  <h3>Interview prep & research</h3>
                </div>
                <button
                  className="mat-accent save-notes"
                  type="button"
                  onClick={saveNotes}
                >
                  <Save size={14} /> {saved ? "Saved" : "Save notes"}
                </button>
              </div>
              <textarea
                value={notes}
                onChange={(event) => {
                  setNotes(event.target.value);
                  setSaved(false);
                }}
                rows={11}
                placeholder="Save interview questions, salary expectations, company research, and follow-up details…"
              />
            </section>
          </div>

          <aside className="detail-sidebar">
            <section className="detail-facts mat-sunken">
              <div>
                <span>
                  <CalendarDays size={14} /> Date applied
                </span>
                <strong className="t-mono">
                  {internship.dateApplied || "—"}
                </strong>
              </div>
              <div
                className={
                  isPastDate(internship.nextActionDate) ? "is-overdue" : ""
                }
              >
                <span>
                  <CalendarDays size={14} /> Next action
                </span>
                <strong className="t-mono">
                  {internship.nextActionDate || "Not set"}
                </strong>
              </div>
              <div>
                <span>Resume evaluated</span>
                <strong className="resume-filename">
                  {internship.resumeVersion || "Not recorded"}
                </strong>
              </div>
            </section>

            <section className="contact-card">
              <span className="section-kicker">RECRUITER CONTACT</span>
              {internship.recruiterName ||
              internship.recruiterEmail ||
              internship.recruiterPhone ? (
                <>
                  {internship.recruiterName && (
                    <p>
                      <UserRound size={15} /> {internship.recruiterName}
                    </p>
                  )}
                  {internship.recruiterEmail && (
                    <a href={`mailto:${internship.recruiterEmail}`}>
                      <Mail size={15} /> {internship.recruiterEmail}
                    </a>
                  )}
                  {internship.recruiterPhone && (
                    <a href={`tel:${internship.recruiterPhone}`}>
                      <Phone size={15} /> {internship.recruiterPhone}
                    </a>
                  )}
                </>
              ) : (
                <p className="muted-copy">No recruiter contact saved yet.</p>
              )}
            </section>

            <section className="detail-system-meta">
              <span>Last updated</span>
              <strong className="t-mono">
                {internship.updatedAt.slice(0, 10)}
              </strong>
            </section>
          </aside>
        </div>

        <footer className="detail-actions">
          <button
            className="danger-button"
            type="button"
            onClick={() => onDelete(internship)}
          >
            <Trash2 size={15} /> Delete
          </button>
          <button
            className="mat-accent"
            type="button"
            onClick={() => onEdit(internship)}
          >
            <Pencil size={15} /> Edit application
          </button>
        </footer>
      </section>
    </div>
  );
}
