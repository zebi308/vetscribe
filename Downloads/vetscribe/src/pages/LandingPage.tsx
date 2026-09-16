import "./landing.css";

import { Navbar } from "../components/landing/Navbar";
import { Hero } from "../components/landing/Hero";
import { PricingsSection } from "../components/landing/PricingSection";
import { FAQ } from "../components/landing/FAQ";
import { Footer } from "../components/landing/footer";


export function LandingPage() {

  return (

    <div className="landing">

      <Navbar />

      <Hero />


      {/* VALUE STATEMENTS */}

      <section className="stats">

        <div>
          <strong>Minutes, Not Hours</strong>
          <p>
            Turn consultations into structured documentation.
          </p>
        </div>

        <div>
          <strong>Vet Reviewed</strong>
          <p>
            Every draft remains under professional control.
          </p>
        </div>

        <div>
          <strong>Structured Notes</strong>
          <p>
            Generate consistent clinical documentation from conversations.
          </p>
        </div>

        <div>
          <strong>Available When You Need It</strong>
          <p>
            Documentation support whenever your practice needs it.
          </p>
        </div>

      </section>


      {/* PROBLEM */}

      <section className="problem">

        <div className="section-title">

          <span>THE PROBLEM</span>

          <h2>
            The consultation doesn't end when the patient leaves.
            The documentation does.
          </h2>

          <p>
            Veterinary professionals can spend valuable time after consultations
            writing, formatting and completing clinical notes. This creates
            administrative pressure and takes time away from patient care.
          </p>

        </div>


        <div className="problem-cards">

          <div className="problem-box">

            <h3>Without VetScribe</h3>

            <p>✗ Manual note writing</p>
            <p>✗ Reconstructing consultations from memory</p>
            <p>✗ Repetitive documentation</p>
            <p>✗ Administrative backlog</p>

          </div>


          <div className="solution-box">

            <h3>With VetScribe</h3>

            <p>✓ Consultation captured naturally</p>
            <p>✓ AI-drafted clinical documentation</p>
            <p>✓ Faster patient records</p>
            <p>✓ Vet reviews and approves</p>
            <p>✓ More time focused on patient care</p>

          </div>

        </div>

      </section>


      {/* HOW IT WORKS */}

      <section
        id="workflow"
        className="workflow"
      >

        <h2>
          How VetScribe Works
        </h2>

        <div className="workflow-grid">

          <div>

            <span>01</span>

            <h3>
              Capture the Consultation
            </h3>

            <p>
              Start a consultation and let VetScribe securely capture
              the conversation while you focus on the patient.
            </p>

          </div>


          <div>

            <span>02</span>

            <h3>
              AI Drafts the Clinical Note
            </h3>

            <p>
              VetScribe turns the consultation into structured
              clinical documentation for the veterinarian to review.
            </p>

          </div>


          <div>

            <span>03</span>

            <h3>
              Review, Edit & Approve
            </h3>

            <p>
              Review the draft, make any required changes and approve
              the final clinical record.
            </p>

          </div>


          <div>

            <span>04</span>

            <h3>
              Generate Client Summary
            </h3>

            <p>
              Create a clear client-facing summary to support
              communication after the consultation.
            </p>

          </div>

        </div>

      </section>


      {/* BEFORE / AFTER PRODUCT DEMONSTRATION */}

      <section className="product-demo">

        <div className="demo-heading">

          <span>SEE VETSCRIBE IN ACTION</span>

          <h2>
            From consultation conversation to structured clinical note
          </h2>

          <p>
            VetScribe captures the consultation and prepares a structured
            draft for the veterinarian to review, edit and approve.
          </p>

        </div>


        <div className="demo-grid">

          <div className="demo-card before-card">

            <span className="demo-label">
              BEFORE
            </span>

            <h3>
              Consultation Dialogue
            </h3>

            <div className="dialogue">

              <p>
                <strong>Vet:</strong> "How long has Bella been scratching?"
              </p>

              <p>
                <strong>Owner:</strong> "About three weeks, mostly at night."
              </p>

              <p>
                <strong>Vet:</strong> "Have you noticed any redness or changes
                to her skin?"
              </p>

              <p>
                <strong>Owner:</strong> "Yes, around her stomach and paws."
              </p>

            </div>

          </div>


          <div className="demo-arrow" aria-hidden="true">
            →
          </div>


          <div className="demo-card after-card">

            <span className="demo-label">
              AFTER
            </span>

            <h3>
              AI-Drafted Clinical Note
            </h3>

            <div className="clinical-note">

              <p>
                <strong>History:</strong> Pruritus reported for approximately
                three weeks, more noticeable at night.
              </p>

              <p>
                <strong>Clinical Context:</strong> Owner reports redness around
                the abdomen and paws.
              </p>

              <p>
                <strong>Assessment:</strong> Clinical assessment to be completed
                and confirmed by the veterinarian.
              </p>

              <p>
                <strong>Plan:</strong> Review findings and finalise the clinical
                record following veterinary assessment.
              </p>

            </div>

            <p className="review-note">
              Vet reviews, edits and approves the final clinical record.
            </p>

          </div>

        </div>

      </section>


      {/* FEATURES */}

      <section
        id="features"
        className="features"
      >

        <div className="features-heading">

          <h2>
            Built around the veterinary workflow
          </h2>

          <p>
            VetScribe is designed to reduce documentation work without
            taking control away from veterinary professionals.
          </p>

        </div>


        <div className="feature-grid">

          <div>

            <h3>
              AI Consultation Scribe
            </h3>

            <p>
              Capture consultations naturally without interrupting the
              conversation to type every detail.
            </p>

          </div>


          <div>

            <h3>
              Structured Clinical Notes
            </h3>

            <p>
              Turn consultation conversations into organised clinical
              documentation and SOAP-style drafts.
            </p>

          </div>


          <div>

            <h3>
              Patient Documentation
            </h3>

            <p>
              Keep consultation information structured and easier to review
              across the patient's history.
            </p>

          </div>


          <div>

            <h3>
              Owner-Friendly Summaries
            </h3>

            <p>
              Create clear, easy-to-understand summaries from clinical
              documentation for client communication.
            </p>

          </div>


          <div>

            <h3>
              Review & Edit
            </h3>

            <p>
              Review, modify and refine every AI-drafted note before it
              becomes part of your clinical workflow.
            </p>

          </div>


          <div>

            <h3>
              Practice-Level Control
            </h3>

            <p>
              Keep veterinary teams, records and permissions organised
              within a secure practice workspace.
            </p>

          </div>

        </div>

      </section>


      {/* BUILT FOR VETERINARY PRACTICES */}

      <section className="built-for-vets">

        <div className="built-for-vets-heading">

          <h2>
            Not another generic AI assistant.
          </h2>

          <p>
            VetScribe is being built specifically around the documentation
            needs of veterinary teams.
          </p>

        </div>


        <div className="vet-specific-grid">

          <div>✓ Veterinary terminology</div>

          <div>✓ Clinical documentation workflows</div>

          <div>✓ SOAP-style notes</div>

          <div>✓ Vet-controlled approval</div>

          <div>✓ Patient-focused records</div>

          <div>✓ Owner-friendly summaries</div>

          <div>✓ Practice-level user management</div>

          <div>✓ Designed for UK veterinary practices</div>

        </div>


        <div className="vet-positioning">

          <p>
            The goal isn't to replace the vet. It's to remove unnecessary
            documentation work from the vet's day.
          </p>

        </div>

      </section>


      {/* SECURITY */}

      <section className="security-section">

        <div className="security-heading">

          <h2>
            Your practice data deserves serious protection.
          </h2>

          <p>
            VetScribe is designed with security, access control and responsible
            AI use in mind.
          </p>

        </div>


        <div className="security-grid">

          <div>

            <h3>
              Data Protection
            </h3>

            <p>
              Protect practice and client information with appropriate
              security controls.
            </p>

          </div>


          <div>

            <h3>
              Access Control
            </h3>

            <p>
              Ensure users only access information and practice data
              they are authorised to see.
            </p>

          </div>


          <div>

            <h3>
              Practice Isolation
            </h3>

            <p>
              Keep each veterinary practice's data separated through
              organisation-level access controls.
            </p>

          </div>


          <div>

            <h3>
              Human Review
            </h3>

            <p>
              AI-drafted documentation remains a draft until reviewed and
              approved by an authorised veterinary professional.
            </p>

          </div>


          <div>

            <h3>
              Data & AI Transparency
            </h3>

            <p>
              Clear information about how customer data is handled and
              whether it is used for model training.
            </p>

          </div>

        </div>

      </section>


      {/* PRACTICE MANAGEMENT INTEGRATIONS */}

      <section className="integrations-section">

        <div className="integrations-heading">

          <h2>
            Designed to fit your existing practice workflow
          </h2>

          <p>
            VetScribe is designed to support the systems your practice
            already uses, rather than forcing your team to completely
            change the way they work.
          </p>

        </div>


        <div className="integrations-roadmap">

          <h3>
            Practice management connectivity
          </h3>

          <p>
            Start with a simple documentation workflow today, with
            integrations and deeper practice management connectivity
            on the roadmap.
          </p>

        </div>

      </section>


      {/* PRICING */}

      <PricingsSection />


      {/* FAQ */}

      <FAQ />


      {/* FOOTER */}

      <Footer />

    </div>

  );

}