import { useMemo, useRef, useState, type ChangeEvent } from "react";
import {
  ArchiveRestore,
  Database,
  Download,
  HelpCircle,
  Plus,
  RotateCcw,
  ShieldCheck,
  Trash2,
  Upload,
} from "lucide-react";
import { BrandMark } from "../components/BrandMark";
import { FilterBar } from "../components/FilterBar";
import { InternshipCard } from "../components/InternshipCard";
import { InternshipDetail } from "../components/InternshipDetail";
import { InternshipForm } from "../components/InternshipForm";
import { MetricsDashboard } from "../components/MetricsDashboard";
import { ThemeSwitcher } from "../components/ThemeSwitcher";
import { Walkthrough, useWalkthrough } from "../components/Walkthrough";
import { useInternships } from "../hooks/useInternships";
import { normalizeInternshipRecords } from "../lib/internships";
import type { Internship, InternshipDraft } from "../lib/types";
import "../components/walkthrough.css";

export default function Home() {
  const tracker = useInternships();
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const importInput = useRef<HTMLInputElement>(null);
  const walkthrough = useWalkthrough();

  const editing = useMemo(
    () => tracker.internships.find((item) => item.id === editingId) ?? null,
    [editingId, tracker.internships],
  );
  const selected = useMemo(
    () => tracker.internships.find((item) => item.id === selectedId) ?? null,
    [selectedId, tracker.internships],
  );

  const openAdd = () => {
    setEditingId(null);
    setFormOpen(true);
  };

  const openEdit = (internship: Internship) => {
    setSelectedId(null);
    setEditingId(internship.id);
    setFormOpen(true);
  };

  const submitForm = (draft: InternshipDraft) => {
    if (editingId) tracker.updateInternship(editingId, draft);
    else tracker.addInternship(draft);
    setFormOpen(false);
    setEditingId(null);
  };

  const remove = (internship: Internship) => {
    const confirmed = window.confirm(
      `Delete ${internship.companyName} — ${internship.jobTitle}? This cannot be undone.`,
    );
    if (!confirmed) return;
    tracker.removeInternship(internship.id);
    if (selectedId === internship.id) setSelectedId(null);
    if (editingId === internship.id) {
      setEditingId(null);
      setFormOpen(false);
    }
  };

  const exportBackup = () => {
    const payload = JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        applications: tracker.internships,
      },
      null,
      2,
    );
    const url = URL.createObjectURL(
      new Blob([payload], { type: "application/json" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `applyarc-backup-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const importBackup = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const parsed: unknown = JSON.parse(await file.text());
      const candidate = Array.isArray(parsed)
        ? parsed
        : typeof parsed === "object" &&
            parsed !== null &&
            Array.isArray((parsed as { applications?: unknown }).applications)
          ? (parsed as { applications: unknown[] }).applications
          : null;
      const normalized = normalizeInternshipRecords(candidate);
      if (!normalized)
        throw new Error("The file is not a valid ApplyArc backup.");
      if (
        !window.confirm(
          `Replace the current pipeline with ${normalized.length} imported applications?`,
        )
      )
        return;
      tracker.replaceAll(normalized);
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "This backup could not be imported.",
      );
    }
  };

  return (
    <div className="app-shell">
      <div className="mat-canvas" aria-hidden="true" />

      <aside className="control-rail mat-surface">
        <header className="rail-header">
          <BrandMark />
          <p>Internship application operations console.</p>
        </header>

        <div className="rail-rule mat-rule">
          <span />
        </div>
        <ThemeSwitcher />
        <div className="rail-rule mat-rule">
          <span />
        </div>

        <section className="rail-readout" aria-label="Pipeline summary">
          <span className="section-kicker">PIPELINE / SUMMARY</span>
          <div className="rail-metrics">
            <div>
              <strong className="t-numeral">{tracker.metrics.total}</strong>
              <span>Records</span>
            </div>
            <div>
              <strong className="t-numeral">
                {tracker.metrics.interviews}
              </strong>
              <span>Interviews</span>
            </div>
            <div>
              <strong className="t-numeral">
                {tracker.metrics.overdueActions}
              </strong>
              <span>Overdue</span>
            </div>
          </div>
        </section>

        <section className="rail-data-tools">
          <span className="section-kicker">LOCAL DATA / TOOLS</span>
          <button
            className="rail-tool mat-control"
            type="button"
            onClick={exportBackup}
          >
            <Download size={14} /> Download backup
          </button>
          <button
            className="rail-tool mat-control"
            type="button"
            onClick={() => importInput.current?.click()}
          >
            <Upload size={14} /> Import backup
          </button>
          <input
            ref={importInput}
            className="sr-only"
            type="file"
            accept="application/json,.json"
            onChange={importBackup}
          />
          <button
            className="rail-tool mat-control"
            type="button"
            onClick={() =>
              window.confirm(
                "Replace your current data with the five sample applications?",
              ) && tracker.restoreSamples()
            }
          >
            <ArchiveRestore size={14} /> Restore sample data
          </button>
          <button
            className="rail-tool danger-copy"
            type="button"
            disabled={!tracker.internships.length}
            onClick={() =>
              window.confirm(
                "Clear every application from this browser? Download a backup first if you may need them.",
              ) && tracker.clearAll()
            }
          >
            <Trash2 size={14} /> Clear all records
          </button>
        </section>

        <footer className="rail-footer">
          <ShieldCheck size={15} />
          <p>
            <strong>Private by default.</strong> Records stay in this browser
            unless you export them.
          </p>
        </footer>
      </aside>

      <main className="workspace">
        <header className="workspace-header">
          <div>
            <div className="plate-line">
              <span>PLATE 01</span>
              <i />
              <span>APPLICATION PIPELINE</span>
            </div>
            <h1>Internship field</h1>
            <p>
              Track every submission, interview stage, contact, resume version,
              and next move in one place.
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button
              className="walkthrough-trigger"
              type="button"
              onClick={walkthrough.start}
              title="Start guided tour"
            >
              <HelpCircle size={15} /> Tour
            </button>
            <button
              className="add-application mat-accent"
              type="button"
              onClick={openAdd}
            >
              <Plus size={17} /> Add application
            </button>
          </div>
        </header>

        <MetricsDashboard metrics={tracker.metrics} />

        <FilterBar
          filters={tracker.filters}
          resultCount={tracker.visibleInternships.length}
          totalCount={tracker.internships.length}
          setStatus={tracker.setStatusFilter}
          setRoleTrack={tracker.setRoleFilter}
          setSearch={tracker.setSearch}
          setSort={tracker.setSort}
        />

        <section
          className="application-field"
          aria-labelledby="application-field-title"
        >
          <div className="field-heading">
            <div>
              <span className="section-kicker">
                SPECIMEN FIELD / R1–R
                {Math.max(tracker.visibleInternships.length, 1)}
              </span>
              <h2 id="application-field-title">Application records</h2>
            </div>
            <span className="field-count t-mono">
              {tracker.visibleInternships.length.toString().padStart(2, "0")}{" "}
              VISIBLE
            </span>
          </div>

          {tracker.visibleInternships.length ? (
            <div className="application-grid">
              {tracker.visibleInternships.map((internship, index) => (
                <InternshipCard
                  key={internship.id}
                  internship={internship}
                  index={index}
                  onOpen={() => setSelectedId(internship.id)}
                  onEdit={() => openEdit(internship)}
                  onDelete={() => remove(internship)}
                  onStatusChange={(status) =>
                    tracker.updateInternship(internship.id, { status })
                  }
                  onNotesChange={(notes) =>
                    tracker.updateInternship(internship.id, { notes })
                  }
                />
              ))}
            </div>
          ) : (
            <div className="empty-state mat-card">
              <Database size={26} />
              <h3>
                {tracker.internships.length
                  ? "No records match these filters."
                  : "No applications in the pipeline."}
              </h3>
              <p>
                {tracker.internships.length
                  ? "Reset the filters or search for something else."
                  : "Add the first one when you submit your next application."}
              </p>
              {tracker.internships.length ? (
                <button
                  className="mat-control"
                  type="button"
                  onClick={() => {
                    tracker.setStatusFilter("all");
                    tracker.setRoleFilter("all");
                    tracker.setSearch("");
                  }}
                >
                  <RotateCcw size={15} /> Reset filters
                </button>
              ) : (
                <button className="mat-accent" type="button" onClick={openAdd}>
                  <Plus size={15} /> Add first application
                </button>
              )}
            </div>
          )}
        </section>
      </main>

      <InternshipForm
        open={formOpen}
        initialData={editing}
        onClose={() => {
          setFormOpen(false);
          setEditingId(null);
        }}
        onSubmit={submitForm}
      />
      <InternshipDetail
        internship={selected}
        onClose={() => setSelectedId(null)}
        onEdit={openEdit}
        onDelete={remove}
        onNotesChange={(notes) =>
          selected && tracker.updateInternship(selected.id, { notes })
        }
      />

      {/* Walkthrough Tour */}
      {walkthrough.isActive && (
        <Walkthrough
          onComplete={walkthrough.complete}
          onDismiss={walkthrough.dismiss}
        />
      )}
    </div>
  );
}
