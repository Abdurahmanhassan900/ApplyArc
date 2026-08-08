import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  X,
  Sparkles,
  Plus,
  Trash2,
  Save,
  Edit3,
  RefreshCw,
} from "lucide-react";

export interface WalkthroughStep {
  target: string; // CSS selector for the element to highlight
  title: string;
  description: string;
  icon?: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right" | "center";
}

const WALKTHROUGH_STEPS: WalkthroughStep[] = [
  {
    target: ".add-application",
    title: "Add an Internship Manually",
    description:
      'Click this button to open the application form. You can fill in the company name, job title, role track, dates, and all relevant details manually.',
    icon: <Plus size={18} />,
    position: "bottom",
  },
  {
    target: ".application-form-modal",
    title: "Fill in Application Details",
    description:
      "The form has sections for Company & Role, Pipeline & Dates, Application Files, Recruiter Contact, and Notes. Fill in what you know — only Company Name, Job Title, Date Applied, and Resume Version are required.",
    icon: <Edit3 size={18} />,
    position: "center",
  },
  {
    target: ".workspace-header",
    title: "AI-Assisted Entry (Coming Soon)",
    description:
      "Soon you'll be able to paste a job posting URL or description and let AI auto-fill the form fields for you — extracting company name, role, requirements, and more automatically.",
    icon: <Sparkles size={18} />,
    position: "bottom",
  },
  {
    target: ".filter-bar",
    title: "Filter & Search Applications",
    description:
      "Use the search bar to find applications by company or role. Filter by status (Applied, Interview, Offer, etc.) or role track. Sort by date, company name, or status.",
    icon: <RefreshCw size={18} />,
    position: "bottom",
  },
  {
    target: ".internship-card",
    title: "Application Cards",
    description:
      "Each card shows the company, role, status, dates, and notes at a glance. You can change the status directly from the card using the status dropdown chip.",
    icon: <Edit3 size={18} />,
    position: "bottom",
  },
  {
    target: ".card-menu",
    title: "Edit or Delete Applications",
    description:
      'Click the three-dot menu on any card to edit or delete that application. Editing opens the same form pre-filled with the current data.',
    icon: <Trash2 size={18} />,
    position: "left",
  },
  {
    target: ".card-notes",
    title: "Quick Notes",
    description:
      "Add notes directly on the card — interview prep, salary expectations, follow-up reminders. Notes auto-save when you click away.",
    icon: <Save size={18} />,
    position: "bottom",
  },
  {
    target: ".status-chip",
    title: "Change Status / Type",
    description:
      "Click the status chip to change an application's stage: Applied, Phone Screen, Technical Interview, Final Interview, Offer, Rejected, or Waitlist. This updates the pipeline view instantly.",
    icon: <RefreshCw size={18} />,
    position: "bottom",
  },
  {
    target: ".rail-data-tools",
    title: "Backup & Data Management",
    description:
      "Download a JSON backup of all your data, import a previous backup, restore sample data to explore the app, or clear all records. Your data never leaves your browser unless you export it.",
    icon: <Save size={18} />,
    position: "right",
  },
  {
    target: ".metrics-dashboard",
    title: "Dashboard Metrics",
    description:
      "Track your overall progress — total applications, interview rate, offers, and overdue actions. The distribution bar shows your pipeline breakdown at a glance.",
    icon: <CheckCircle2 size={18} />,
    position: "bottom",
  },
];

interface TooltipPosition {
  top: number;
  left: number;
  arrowDirection: "top" | "bottom" | "left" | "right";
}

function getTooltipPosition(
  targetRect: DOMRect,
  position: string,
  tooltipWidth: number,
  tooltipHeight: number,
): TooltipPosition {
  const gap = 14;
  const viewportW = window.innerWidth;
  const viewportH = window.innerHeight;

  let top = 0;
  let left = 0;
  let arrowDirection: TooltipPosition["arrowDirection"] = "top";

  switch (position) {
    case "bottom":
      top = targetRect.bottom + gap;
      left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
      arrowDirection = "top";
      break;
    case "top":
      top = targetRect.top - tooltipHeight - gap;
      left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
      arrowDirection = "bottom";
      break;
    case "left":
      top = targetRect.top + targetRect.height / 2 - tooltipHeight / 2;
      left = targetRect.left - tooltipWidth - gap;
      arrowDirection = "right";
      break;
    case "right":
      top = targetRect.top + targetRect.height / 2 - tooltipHeight / 2;
      left = targetRect.right + gap;
      arrowDirection = "left";
      break;
    case "center":
    default:
      top = viewportH / 2 - tooltipHeight / 2;
      left = viewportW / 2 - tooltipWidth / 2;
      arrowDirection = "top";
      break;
  }

  // Clamp to viewport
  if (left < 12) left = 12;
  if (left + tooltipWidth > viewportW - 12) left = viewportW - tooltipWidth - 12;
  if (top < 12) top = 12;
  if (top + tooltipHeight > viewportH - 12) top = viewportH - tooltipHeight - 12;

  return { top, left, arrowDirection };
}

export function Walkthrough({
  onComplete,
  onDismiss,
}: {
  onComplete: () => void;
  onDismiss: () => void;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [tooltipPos, setTooltipPos] = useState<TooltipPosition>({
    top: 0,
    left: 0,
    arrowDirection: "top",
  });

  const step = WALKTHROUGH_STEPS[currentStep];
  const isLastStep = currentStep === WALKTHROUGH_STEPS.length - 1;

  const tooltipWidth = 360;
  const tooltipHeight = 200;

  const updatePosition = useCallback(() => {
    if (!step) return;

    // For "center" positioned steps (like the form modal), don't need a target
    if (step.position === "center") {
      setTargetRect(null);
      setTooltipPos({
        top: window.innerHeight / 2 - tooltipHeight / 2,
        left: window.innerWidth / 2 - tooltipWidth / 2,
        arrowDirection: "top",
      });
      return;
    }

    const el = document.querySelector(step.target);
    if (!el) {
      // If target not found, center the tooltip
      setTargetRect(null);
      setTooltipPos({
        top: window.innerHeight / 2 - tooltipHeight / 2,
        left: window.innerWidth / 2 - tooltipWidth / 2,
        arrowDirection: "top",
      });
      return;
    }

    const rect = el.getBoundingClientRect();
    setTargetRect(rect);

    // Scroll element into view if needed
    if (rect.top < 0 || rect.bottom > window.innerHeight) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      // Re-calculate after scroll
      setTimeout(() => {
        const newRect = el.getBoundingClientRect();
        setTargetRect(newRect);
        setTooltipPos(
          getTooltipPosition(newRect, step.position || "bottom", tooltipWidth, tooltipHeight),
        );
      }, 400);
      return;
    }

    setTooltipPos(
      getTooltipPosition(rect, step.position || "bottom", tooltipWidth, tooltipHeight),
    );
  }, [step, tooltipWidth, tooltipHeight]);

  useEffect(() => {
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [updatePosition]);

  const next = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep((s) => s + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  const progressPercent = useMemo(
    () => ((currentStep + 1) / WALKTHROUGH_STEPS.length) * 100,
    [currentStep],
  );

  return createPortal(
    <div className="walkthrough-overlay">
      {/* Backdrop with cutout */}
      <div className="walkthrough-backdrop" onClick={onDismiss}>
        {targetRect && (
          <div
            className="walkthrough-spotlight"
            style={{
              top: targetRect.top - 6,
              left: targetRect.left - 6,
              width: targetRect.width + 12,
              height: targetRect.height + 12,
            }}
          />
        )}
      </div>

      {/* Highlight ring around target */}
      {targetRect && (
        <div
          className="walkthrough-highlight-ring"
          style={{
            top: targetRect.top - 6,
            left: targetRect.left - 6,
            width: targetRect.width + 12,
            height: targetRect.height + 12,
          }}
        />
      )}

      {/* Tooltip */}
      <div
        className={`walkthrough-tooltip walkthrough-arrow-${tooltipPos.arrowDirection}`}
        style={{
          top: tooltipPos.top,
          left: tooltipPos.left,
          width: tooltipWidth,
        }}
      >
        {/* Close button */}
        <button
          className="walkthrough-close"
          onClick={onDismiss}
          aria-label="Close walkthrough"
          type="button"
        >
          <X size={16} />
        </button>

        {/* Progress bar */}
        <div className="walkthrough-progress">
          <div
            className="walkthrough-progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Step counter */}
        <div className="walkthrough-step-counter">
          Step {currentStep + 1} of {WALKTHROUGH_STEPS.length}
        </div>

        {/* Content */}
        <div className="walkthrough-content">
          {step.icon && <div className="walkthrough-icon">{step.icon}</div>}
          <h3 className="walkthrough-title">{step.title}</h3>
          <p className="walkthrough-description">{step.description}</p>
        </div>

        {/* Navigation */}
        <div className="walkthrough-nav">
          <button
            className="walkthrough-nav-btn walkthrough-nav-prev"
            onClick={prev}
            disabled={currentStep === 0}
            type="button"
          >
            <ArrowLeft size={14} />
            Back
          </button>
          <button
            className="walkthrough-nav-btn walkthrough-nav-next"
            onClick={next}
            type="button"
          >
            {isLastStep ? (
              <>
                <CheckCircle2 size={14} />
                Finish
              </>
            ) : (
              <>
                Next
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

// Hook to manage walkthrough state
export function useWalkthrough() {
  const STORAGE_KEY = "applyarc-walkthrough-completed";
  const [isActive, setIsActive] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) === "true";
  });

  const start = useCallback(() => setIsActive(true), []);
  const dismiss = useCallback(() => setIsActive(false), []);
  const complete = useCallback(() => {
    setIsActive(false);
    setHasCompleted(true);
    localStorage.setItem(STORAGE_KEY, "true");
  }, []);
  const reset = useCallback(() => {
    setHasCompleted(false);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { isActive, hasCompleted, start, dismiss, complete, reset };
}
