import React from "react";
import { useNavigate } from "react-router-dom";
import { DashboardMockup } from "./DashboardMockup";

export function Hero() {
  const navigate = useNavigate();

  const scrollToWorkflow = () => {
    document
      .getElementById("workflow")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  return (
    <section className="hero">

      <div className="hero-content">

        <div className="hero-badge">
          UK-based AI scribe built for UK veterinary practices
        </div>

        <h1>
          Less time writing notes.
          <br />
          <span>More time caring for patients.</span>
        </h1>

        <p className="hero-description">
          VetScribe turns veterinary consultations into structured,
          AI-drafted clinical notes ready for your team to review and edit.
        </p>

        <div className="hero-assurance">
          <span className="hero-assurance-icon">✓</span>

          <div>
            <strong>AI drafts. Your vet decides.</strong>
            <p>
              Clinical control always stays with the veterinary
              professional.
            </p>
          </div>
        </div>

        <div className="hero-buttons">

          <button
            className="primary-btn"
            onClick={() => navigate("/register")}
          >
            Start Free Trial →
          </button>

          <button
            className="secondary-btn"
            onClick={scrollToWorkflow}
          >
            See How It Works
          </button>

        </div>

        <div className="trust-row">

          <div>
            <span>✓</span>
            No credit card required
          </div>

          <div>
            <span>✓</span>
            No special hardware required
          </div>

          <div>
            <span>✓</span>
            Built for veterinary practices
          </div>

        </div>

      </div>

      <div className="hero-dashboard">
        <DashboardMockup />
      </div>

    </section>
  );
}
