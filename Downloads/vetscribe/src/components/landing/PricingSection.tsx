import React, { useState } from "react";

export function PricingsSection() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");

  // EXISTING LINKS/FUNCTIONALITY PRESERVED
  const goToRegister = () => {
    window.location.href = "/register";
  };

  const contactSales = () => {
    window.location.href = "mailto:vetscribe@clariana.co.uk";
  };

  const annual = billing === "annual";

  return (
    <section id="pricing" className="pricing">

      <div className="pricing-heading">
        <span>PRICING</span>

        <h2>Simple pricing for veterinary practices</h2>

        <p>
          Choose the level of AI-assisted documentation support
          that fits your veterinary workflow.
        </p>
      </div>

      {/* MONTHLY / ANNUAL TOGGLE */}
      <div className="billing-toggle-wrapper">

        <div className="billing-toggle">

          <button
            type="button"
            className={!annual ? "active" : ""}
            onClick={() => setBilling("monthly")}
          >
            Monthly
          </button>

          <button
            type="button"
            className={annual ? "active" : ""}
            onClick={() => setBilling("annual")}
          >
            Annual
          </button>

        </div>

        <span className="annual-saving">
          Save 2 months with annual billing
        </span>

      </div>

      <div className="pricing-grid">

        {/* STARTER */}
        <div className="pricing-card">

          <div className="pricing-plan-label">
            FOR SMALL PRACTICES
          </div>

          <h3>Starter</h3>

          <p className="pricing-description">
            For small veterinary practices starting with digital workflows.
          </p>

          <div className="pricing-price-area">

            <div className="price">
              {annual ? "£499.90" : "£49.99"}
            </div>

            <p className="price-period">
              {annual ? "per year" : "per month"}
            </p>

          </div>

          {annual && (
            <div className="pricing-saving-message">
              Save 2 months with annual billing
            </div>
          )}

          <ul>
            <li>✓ Up to 2 veterinarians</li>
            <li>✓ Up to 100 patients</li>
            <li>✓ 200 AI consultations per month</li>
            <li>✓ AI-powered consultation assistance</li>
            <li>✓ Client and patient management</li>
            <li>✓ Owner summaries</li>
            <li>✓ Staff management</li>
            <li>✓ Email support</li>
          </ul>

          <button onClick={goToRegister}>
            Start Free Trial
          </button>

        </div>

        {/* PRACTICE PLUS */}
        <div className="pricing-card featured">

          <div className="pricing-badge">
            ★ MOST POPULAR
          </div>

          <div className="pricing-plan-label">
            FOR GROWING PRACTICES
          </div>

          <h3>Practice Plus</h3>

          <p className="pricing-description">
            For growing veterinary practices that need more capacity.
          </p>

          <div className="pricing-price-area">

            <div className="price">
              {annual ? "£899.90" : "£89.99"}
            </div>

            <p className="price-period">
              {annual ? "per year" : "per month"}
            </p>

          </div>

          {annual && (
            <div className="pricing-saving-message">
              Save 2 months with annual billing
            </div>
          )}

          <ul>
            <li>✓ Everything in Starter</li>
            <li>✓ Up to 10 veterinarians</li>
            <li>✓ Up to 500 patients</li>
            <li>✓ Unlimited AI consultations</li>
            <li>✓ Advanced practice management</li>
            <li>✓ Larger team collaboration</li>
            <li>✓ Priority support</li>
            <li>✓ Designed for multi-vet practices</li>
          </ul>

          <button onClick={goToRegister}>
            Start Free Trial
          </button>

        </div>

        {/* ENTERPRISE */}
        <div className="pricing-card">

          <div className="pricing-plan-label">
            FOR LARGER ORGANISATIONS
          </div>

          <h3>Enterprise</h3>

          <p className="pricing-description">
            For veterinary groups, hospitals, and large organisations.
          </p>

          <div className="pricing-price-area">

            <div className="price">
              Custom
            </div>

            <p className="price-period">
              Pricing
            </p>

          </div>

          <ul>
            <li>✓ Unlimited veterinarians</li>
            <li>✓ Unlimited patients</li>
            <li>✓ Unlimited AI consultations</li>
            <li>✓ Custom onboarding</li>
            <li>✓ Dedicated account manager</li>
            <li>✓ Custom integrations</li>
            <li>✓ Custom workflows</li>
            <li>✓ Priority SLA support</li>
          </ul>

          <button onClick={contactSales}>
            Contact Sales
          </button>

        </div>

      </div>

    </section>
  );
}