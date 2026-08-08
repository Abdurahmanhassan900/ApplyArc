import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  calculateMetrics,
  filterAndSortInternships,
  normalizeInternshipRecords,
} from "./internships.ts";
import type { Internship } from "./types.ts";

const base: Internship = {
  id: "1",
  companyName: "Alpha",
  companyLogoUrl: "",
  jobTitle: "Cloud Intern",
  roleTrack: "Cloud Engineering",
  description: "",
  dateApplied: "2026-08-01",
  postingUrl: "",
  resumeVersion: "resume-v1.pdf",
  nextActionDate: "",
  recruiterName: "",
  recruiterEmail: "",
  recruiterPhone: "",
  notes: "",
  status: "Applied",
  createdAt: "2026-08-01T00:00:00.000Z",
  updatedAt: "2026-08-01T00:00:00.000Z",
};

describe("application collection helpers", () => {
  it("counts the requested headline metrics", () => {
    const records: Internship[] = [
      base,
      { ...base, id: "2", status: "Technical Interview" },
      { ...base, id: "3", status: "Rejected" },
      { ...base, id: "4", status: "Offer" },
    ];

    const metrics = calculateMetrics(records);
    assert.equal(metrics.total, 4);
    assert.equal(metrics.interviews, 1);
    assert.equal(metrics.rejections, 1);
    assert.equal(metrics.offers, 1);
    assert.equal(metrics.interviewRate, 50);
  });

  it("filters by status and sorts by newest application date", () => {
    const records: Internship[] = [
      base,
      {
        ...base,
        id: "2",
        companyName: "Beta",
        status: "Rejected",
        dateApplied: "2026-08-03",
      },
      {
        ...base,
        id: "3",
        companyName: "Gamma",
        status: "Rejected",
        dateApplied: "2026-08-02",
      },
    ];

    const result = filterAndSortInternships(records, {
      status: "Rejected",
      roleTrack: "all",
      search: "",
      sort: "date-desc",
    });

    assert.deepEqual(
      result.map((item) => item.companyName),
      ["Beta", "Gamma"],
    );
  });

  it("preserves older title-and-description records during migration", () => {
    const migrated = normalizeInternshipRecords([
      {
        id: "legacy-1",
        title: "Systems Intern",
        description: "Legacy record",
        status: "accepted",
      },
    ]);

    assert.ok(migrated);
    assert.equal(migrated[0].jobTitle, "Systems Intern");
    assert.equal(migrated[0].companyName, "Company not recorded");
    assert.equal(migrated[0].status, "Offer");
  });
});
