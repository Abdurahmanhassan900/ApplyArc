import { useEffect, useId, useState, type FormEvent } from "react";
import {
  Building2,
  CalendarDays,
  Contact,
  FileText,
  Link2,
  StickyNote,
  X,
} from "lucide-react";
import { addDaysIso, normalizeUrl, todayIso } from "../lib/format";
import {
  APPLICATION_STATUSES,
  ROLE_TRACKS,
  type Internship,
  type InternshipDraft,
} from "../lib/types";

function emptyDraft(): InternshipDraft {
  return {
    companyName: "",
    companyLogoUrl: "",
    jobTitle: "",
    roleTrack: "Cloud Engineering",
    description: "",
    dateApplied: todayIso(),
    postingUrl: "",
    resumeVersion: "main-resume.pdf",
    nextActionDate: addDaysIso(7),
    recruiterName: "",
    recruiterEmail: "",
    recruiterPhone: "",
    notes: "",
    status: "Applied",
  };
}

export function InternshipForm({
  open,
  initialData,
  onClose,
  onSubmit,
}: {
  open: boolean;
  initialData?: Internship | null;
  onClose: () => void;
  onSubmit: (draft: InternshipDraft) => void;
}) {
  const [draft, setDraft] = useState<InternshipDraft>(emptyDraft);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    if (initialData) {
      const {
        id: _id,
        createdAt: _createdAt,
        updatedAt: _updatedAt,
        ...editable
      } = initialData;
      setDraft(editable);
    } else {
      setDraft(emptyDraft());
    }
  }, [initialData, open]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.classList.add("modal-open");
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose, open]);

  if (!open) return null;

  const update = <Key extends keyof InternshipDraft>(
    key: Key,
    value: InternshipDraft[Key],
  ) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit({
      ...draft,
      companyName: draft.companyName.trim(),
      companyLogoUrl: normalizeUrl(draft.companyLogoUrl),
      jobTitle: draft.jobTitle.trim(),
      description: draft.description.trim(),
      postingUrl: normalizeUrl(draft.postingUrl),
      resumeVersion: draft.resumeVersion.trim(),
      recruiterName: draft.recruiterName.trim(),
      recruiterEmail: draft.recruiterEmail.trim(),
      recruiterPhone: draft.recruiterPhone.trim(),
      notes: draft.notes.trim(),
    });
  };

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        className="application-form-modal mat-float"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header className="modal-header">
          <div>
            <span className="section-kicker">APPLICATION RECORD</span>
            <h2 id={titleId}>
              {initialData ? "Edit application" : "Add application"}
            </h2>
          </div>
          <button
            className="icon-button mat-control"
            type="button"
            onClick={onClose}
            aria-label="Close form"
          >
            <X size={18} />
          </button>
        </header>

        <form onSubmit={submit}>
          <fieldset>
            <legend>
              <Building2 size={15} /> Company & role
            </legend>
            <div className="form-grid two-columns">
              <label>
                <span>
                  Company name <b>*</b>
                </span>
                <input
                  autoFocus
                  required
                  value={draft.companyName}
                  onChange={(event) =>
                    update("companyName", event.target.value)
                  }
                  placeholder="e.g. Northstar Labs"
                />
              </label>
              <label>
                <span>Company logo URL</span>
                <input
                  type="url"
                  value={draft.companyLogoUrl}
                  onChange={(event) =>
                    update("companyLogoUrl", event.target.value)
                  }
                  placeholder="https://…/logo.png"
                />
              </label>
              <label>
                <span>
                  Job title <b>*</b>
                </span>
                <input
                  required
                  value={draft.jobTitle}
                  onChange={(event) => update("jobTitle", event.target.value)}
                  placeholder="Cloud Engineering Intern"
                />
              </label>
              <label>
                <span>Role track</span>
                <select
                  value={draft.roleTrack}
                  onChange={(event) =>
                    update(
                      "roleTrack",
                      event.target.value as InternshipDraft["roleTrack"],
                    )
                  }
                >
                  {ROLE_TRACKS.map((role) => (
                    <option key={role}>{role}</option>
                  ))}
                </select>
              </label>
            </div>
            <label>
              <span>Job description / requirements</span>
              <textarea
                rows={3}
                value={draft.description}
                onChange={(event) => update("description", event.target.value)}
                placeholder="Paste a concise summary of the role and its key requirements."
              />
            </label>
          </fieldset>

          <fieldset>
            <legend>
              <CalendarDays size={15} /> Pipeline & dates
            </legend>
            <div className="form-grid three-columns">
              <label>
                <span>Status</span>
                <select
                  value={draft.status}
                  onChange={(event) =>
                    update(
                      "status",
                      event.target.value as InternshipDraft["status"],
                    )
                  }
                >
                  {APPLICATION_STATUSES.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </label>
              <label>
                <span>
                  Date applied <b>*</b>
                </span>
                <input
                  required
                  type="date"
                  value={draft.dateApplied}
                  onChange={(event) =>
                    update("dateApplied", event.target.value)
                  }
                />
              </label>
              <label>
                <span>Next action date</span>
                <input
                  type="date"
                  value={draft.nextActionDate}
                  onChange={(event) =>
                    update("nextActionDate", event.target.value)
                  }
                />
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend>
              <Link2 size={15} /> Application files
            </legend>
            <div className="form-grid two-columns">
              <label>
                <span>Job posting URL</span>
                <input
                  type="url"
                  value={draft.postingUrl}
                  onChange={(event) => update("postingUrl", event.target.value)}
                  placeholder="Direct link to the job description"
                />
              </label>
              <label>
                <span>
                  <FileText size={13} /> Resume version <b>*</b>
                </span>
                <input
                  required
                  value={draft.resumeVersion}
                  onChange={(event) =>
                    update("resumeVersion", event.target.value)
                  }
                  placeholder="resume-cloud-v3.pdf"
                />
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend>
              <Contact size={15} /> Recruiter contact
            </legend>
            <div className="form-grid three-columns">
              <label>
                <span>Name</span>
                <input
                  value={draft.recruiterName}
                  onChange={(event) =>
                    update("recruiterName", event.target.value)
                  }
                  placeholder="Recruiter name"
                />
              </label>
              <label>
                <span>Email</span>
                <input
                  type="email"
                  value={draft.recruiterEmail}
                  onChange={(event) =>
                    update("recruiterEmail", event.target.value)
                  }
                  placeholder="name@company.com"
                />
              </label>
              <label>
                <span>Phone</span>
                <input
                  type="tel"
                  value={draft.recruiterPhone}
                  onChange={(event) =>
                    update("recruiterPhone", event.target.value)
                  }
                  placeholder="(000) 000-0000"
                />
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend>
              <StickyNote size={15} /> Manual notes
            </legend>
            <label>
              <span>
                Interview prep, salary expectations, company research, and
                follow-up details
              </span>
              <textarea
                className="large-notes"
                rows={7}
                value={draft.notes}
                onChange={(event) => update("notes", event.target.value)}
                placeholder="Save everything you will need before the next conversation…"
              />
            </label>
          </fieldset>

          <footer className="modal-actions">
            <button className="mat-control" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="mat-accent" type="submit">
              {initialData ? "Save changes" : "Add to pipeline"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
