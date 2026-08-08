import {
  AlertCircle,
  ArrowUpRight,
  BriefcaseBusiness,
  CircleX,
  Trophy,
} from "lucide-react";
import { APPLICATION_STATUSES, type InternshipMetrics } from "../lib/types";
import { statusKey } from "./StatusChip";

export function MetricsDashboard({ metrics }: { metrics: InternshipMetrics }) {
  const headline = [
    {
      code: "M1",
      label: "Total applications",
      value: metrics.total,
      icon: BriefcaseBusiness,
    },
    {
      code: "M2",
      label: "In interviews",
      value: metrics.interviews,
      icon: ArrowUpRight,
    },
    {
      code: "M3",
      label: "Rejections",
      value: metrics.rejections,
      icon: CircleX,
    },
    { code: "M4", label: "Offers", value: metrics.offers, icon: Trophy },
  ];

  return (
    <section className="metrics-dashboard" aria-labelledby="metrics-title">
      <div className="metrics-heading">
        <div>
          <span className="section-kicker">PIPELINE INSTRUMENTS / LIVE</span>
          <h2 id="metrics-title">Application signal</h2>
        </div>
        <div className="conversion-readout">
          <span className="t-numeral">{metrics.interviewRate}%</span>
          <small>reached an interview</small>
        </div>
      </div>

      <div className="metrics-grid">
        {headline.map(({ code, label, value, icon: Icon }) => (
          <article key={label} className="metric-card mat-instrument">
            <div className="metric-card-top">
              <span>{code}</span>
              <Icon size={17} aria-hidden="true" />
            </div>
            <strong className="t-numeral">
              {String(value).padStart(2, "0")}
            </strong>
            <p>{label}</p>
          </article>
        ))}
      </div>

      <div className="metrics-lower mat-instrument">
        <div className="status-distribution">
          <div className="metric-subhead">
            <span>STATUS DISTRIBUTION</span>
            <span>{metrics.total} records</span>
          </div>
          <div
            className="distribution-bar"
            aria-label="Application status distribution"
          >
            {APPLICATION_STATUSES.map((status) => {
              const count = metrics.statusCounts[status];
              const width = metrics.total ? (count / metrics.total) * 100 : 0;
              return (
                <span
                  key={status}
                  className={`status-${statusKey(status)}`}
                  style={{ width: `${width}%` }}
                  title={`${status}: ${count}`}
                />
              );
            })}
          </div>
          <div className="distribution-legend">
            {APPLICATION_STATUSES.map((status) => (
              <span key={status} className={`status-${statusKey(status)}`}>
                <i /> {status} <b>{metrics.statusCounts[status]}</b>
              </span>
            ))}
          </div>
        </div>

        <div className="action-readout">
          <AlertCircle size={18} aria-hidden="true" />
          <div>
            <strong>{metrics.overdueActions}</strong>
            <span>overdue</span>
          </div>
          <div>
            <strong>{metrics.upcomingActions}</strong>
            <span>due in 7 days</span>
          </div>
          <div>
            <strong>{metrics.offerRate}%</strong>
            <span>offer rate</span>
          </div>
        </div>
      </div>
    </section>
  );
}
