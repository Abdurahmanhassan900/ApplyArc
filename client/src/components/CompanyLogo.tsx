import { useEffect, useState } from "react";
import { monogram } from "../lib/format";

export function CompanyLogo({
  companyName,
  logoUrl,
}: {
  companyName: string;
  logoUrl: string;
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [logoUrl]);

  if (!logoUrl || failed) {
    return (
      <span
        className="company-logo company-monogram"
        aria-label={`${companyName} logo fallback`}
      >
        {monogram(companyName)}
      </span>
    );
  }

  return (
    <span className="company-logo">
      <img
        src={logoUrl}
        alt={`${companyName} logo`}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    </span>
  );
}
