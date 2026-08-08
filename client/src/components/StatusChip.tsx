import {
  ACTIVE_PIPELINE,
  APPLICATION_STATUSES,
  type ApplicationStatus,
} from "../lib/types";

export function StatusChip({
  status,
  onChange,
  compact = false,
}: {
  status: ApplicationStatus;
  onChange?: (status: ApplicationStatus) => void;
  compact?: boolean;
}) {
  if (onChange) {
    return (
      <label
        className={`status-chip status-${statusKey(status)} ${compact ? "is-compact" : ""}`}
      >
        <span className="sr-only">Application status</span>
        <select
          value={status}
          onChange={(event) =>
            onChange(event.target.value as ApplicationStatus)
          }
        >
          {APPLICATION_STATUSES.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </label>
    );
  }

  return (
    <span
      className={`status-chip status-${statusKey(status)} ${compact ? "is-compact" : ""}`}
    >
      {status}
    </span>
  );
}

export function StageLadder({ status }: { status: ApplicationStatus }) {
  const currentIndex = ACTIVE_PIPELINE.indexOf(
    status as (typeof ACTIVE_PIPELINE)[number],
  );
  return (
    <div className="stage-ladder" aria-label={`Pipeline stage: ${status}`}>
      {ACTIVE_PIPELINE.map((stage, index) => (
        <span
          key={stage}
          className={index <= currentIndex ? "is-complete" : ""}
          title={stage}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export function statusKey(status: ApplicationStatus): string {
  return status.toLowerCase().replace(/\s+/g, "-");
}
