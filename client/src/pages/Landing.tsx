import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { ArrowRight, Briefcase, Sparkles, Target, Zap } from "lucide-react";

export default function Landing() {
  const [, navigate] = useLocation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="landing-page">
      {/* Animated background */}
      <div className="landing-bg" aria-hidden="true">
        <div className="landing-orb landing-orb-1" />
        <div className="landing-orb landing-orb-2" />
        <div className="landing-orb landing-orb-3" />
        <div className="landing-grid" />
      </div>

      {/* Floating particles */}
      <div className="landing-particles" aria-hidden="true">
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            className="particle"
            style={{
              "--delay": `${i * 0.5}s`,
              "--x": `${Math.random() * 100}%`,
              "--duration": `${3 + Math.random() * 4}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Header */}
      <header
        className={`landing-header ${mounted ? "landing-visible" : ""}`}
      >
        <div className="landing-brand">
          <span className="landing-brand-icon" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="landing-brand-name">ApplyArc</span>
        </div>
      </header>

      {/* Hero section */}
      <main className="landing-hero">
        <div
          className={`landing-hero-content ${mounted ? "landing-visible" : ""}`}
        >
          <div className="landing-badge">
            <Sparkles size={14} />
            <span>AI-Powered Internship Tracking</span>
          </div>

          <h1 className="landing-title">
            <span className="landing-title-line">Track Your</span>
            <span className="landing-title-line landing-title-accent">
              Internship Journey
            </span>
          </h1>

          <p className="landing-subtitle">
            From application to offer — manage every submission, interview stage,
            contact, and next move in one beautifully designed workspace.
          </p>

          <button
            className="landing-cta"
            onClick={() => navigate("/tracker")}
            type="button"
          >
            <span className="landing-cta-text">
              Open Internship Tracker
            </span>
            <ArrowRight size={20} className="landing-cta-arrow" />
            <span className="landing-cta-glow" aria-hidden="true" />
          </button>

          <div className="landing-features">
            <div className="landing-feature">
              <div className="landing-feature-icon">
                <Target size={18} />
              </div>
              <span>Pipeline Tracking</span>
            </div>
            <div className="landing-feature">
              <div className="landing-feature-icon">
                <Zap size={18} />
              </div>
              <span>AI-Assisted Entry</span>
            </div>
            <div className="landing-feature">
              <div className="landing-feature-icon">
                <Briefcase size={18} />
              </div>
              <span>Smart Organization</span>
            </div>
          </div>
        </div>

        {/* Decorative card preview */}
        <div
          className={`landing-preview ${mounted ? "landing-visible" : ""}`}
          aria-hidden="true"
        >
          <div className="preview-card preview-card-1">
            <div className="preview-card-dot" style={{ background: "#00a99d" }} />
            <div className="preview-card-line" style={{ width: "70%" }} />
            <div className="preview-card-line" style={{ width: "45%" }} />
          </div>
          <div className="preview-card preview-card-2">
            <div className="preview-card-dot" style={{ background: "#7c3aed" }} />
            <div className="preview-card-line" style={{ width: "60%" }} />
            <div className="preview-card-line" style={{ width: "80%" }} />
          </div>
          <div className="preview-card preview-card-3">
            <div className="preview-card-dot" style={{ background: "#d97706" }} />
            <div className="preview-card-line" style={{ width: "55%" }} />
            <div className="preview-card-line" style={{ width: "65%" }} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className={`landing-footer ${mounted ? "landing-visible" : ""}`}
      >
        <p>Private by default. Your data stays in your browser.</p>
      </footer>
    </div>
  );
}
