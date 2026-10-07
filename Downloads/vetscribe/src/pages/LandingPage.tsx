import { useEffect, useState } from "react";

import "./landing.css";

import demoVideo from "../assets/VetScribe-demo.mp4";

import { Navbar } from "../components/landing/Navbar";
import { Hero } from "../components/landing/Hero";
import { PricingsSection } from "../components/landing/PricingSection";
import { FAQ } from "../components/landing/FAQ";
import { Footer } from "../components/landing/footer";



function HeroAIDemo() {

  const [stage, setStage] = useState(0);


  useEffect(() => {

    const interval = window.setInterval(() => {

      setStage((current) => (current + 1) % 3);

    }, 3600);


    return () => window.clearInterval(interval);

  }, []);


  return (

    <div className="hero-ai-demo-slot">


      <div className="hero-ai-demo-window">


        <div className="hero-ai-demo-topbar">


          <div>

            <strong>
              VetScribe AI
            </strong>


            <span>
              Clinical Documentation Assistant
            </span>

          </div>


          <div className="hero-ai-demo-ready">

            <span className="hero-ai-demo-ready-dot" />

            Live

          </div>


        </div>




        <div className="hero-ai-demo-patient">


          <div>

            <span className="hero-ai-demo-kicker">
              CURRENT CONSULTATION
            </span>

            <strong>
              Bella
            </strong>

            <p>
              Labrador Retriever • 5 years
            </p>

          </div>


          <div>

            <span className="hero-ai-demo-kicker">
              OWNER
            </span>

            <strong>
              Sarah Williams
            </strong>

          </div>


        </div>




        <div className="hero-ai-demo-stage-area">


          {stage === 0 && (

            <div className="hero-ai-demo-stage hero-ai-recording">


              <span className="hero-ai-demo-stage-label">
                01 · RECORDING
              </span>


              <h3>
                Consultation in progress
              </h3>


              <div className="hero-ai-recording-status">

                <span className="hero-ai-recording-dot" />

                Recording consultation

              </div>


              <div className="hero-ai-waveform" aria-hidden="true">

                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />

              </div>


              <div className="hero-ai-conversation">

                <p>
                  <strong>Vet:</strong> How long has Bella been scratching?
                </p>

                <p>
                  <strong>Owner:</strong> About three weeks, mostly at night.
                </p>

              </div>


            </div>

          )}




          {stage === 1 && (

            <div className="hero-ai-demo-stage hero-ai-processing">


              <span className="hero-ai-demo-stage-label">
                02 · PROCESSING
              </span>


              <h3>
                Drafting the clinical note
              </h3>


              <div className="hero-ai-processing-loader" aria-hidden="true">

                <span />
                <span />
                <span />

              </div>


              <div className="hero-ai-processing-list">

                <p>
                  ✓ Clinical history extracted
                </p>

                <p>
                  ✓ Examination details structured
                </p>

                <p>
                  ✓ Assessment and plan organised
                </p>

              </div>


            </div>

          )}




          {stage === 2 && (

            <div className="hero-ai-demo-stage hero-ai-soap">


              <span className="hero-ai-demo-stage-label">
                03 · SOAP READY
              </span>


              <h3>
                Draft clinical note ready
              </h3>


              <div className="hero-ai-soap-grid">


                <div>

                  <strong>
                    S · Subjective
                  </strong>

                  <p>
                    Three-week history of pruritus, worse at night.
                    Owner reports redness around the abdomen and paws.
                  </p>

                </div>


                <div>

                  <strong>
                    O · Objective
                  </strong>

                  <p>
                    Clinical examination findings are structured
                    and ready for the veterinarian to check.
                  </p>

                </div>


                <div>

                  <strong>
                    A · Assessment
                  </strong>

                  <p>
                    Pruritus with reported dermatological changes.
                    Clinical judgement remains veterinarian-led.
                  </p>

                </div>


                <div>

                  <strong>
                    P · Plan
                  </strong>

                  <p>
                    Findings and next steps are organised into
                    a structured draft clinical record.
                  </p>

                </div>


              </div>


              <div className="hero-ai-review-note">

                Ready for veterinarian review before finalisation.

              </div>


            </div>

          )}


        </div>




        <div className="hero-ai-demo-dots" aria-hidden="true">

          <span className={stage === 0 ? "active" : ""} />
          <span className={stage === 1 ? "active" : ""} />
          <span className={stage === 2 ? "active" : ""} />

        </div>


      </div>


    </div>

  );

}


export function LandingPage() {


  return (

    <div className="landing">


      <div className="hero-shell">

        <Navbar />


        <Hero />


        <HeroAIDemo />

      </div>



      {/* PROBLEM */}

      <section className="problem">


        <div className="section-title problem-heading">


          <span>THE PROBLEM</span>


          <h2>
            The consultation doesn't end when the patient leaves.
            Documentation does.
          </h2>


          <p>

            Veterinary professionals can spend valuable time after consultations
            writing, formatting and completing clinical notes. This creates
            administrative pressure and takes time away from patient care.

          </p>


        </div>





        <div className="problem-cards">


          <div className="problem-box">


            <h3>
              Without VetScribe
            </h3>


            <p>
              ✗ Manual note writing
            </p>


            <p>
              ✗ Reconstructing consultations from memory
            </p>


            <p>
              ✗ Administrative backlog
            </p>


          </div>





          <div className="solution-box">


            <h3>
              With VetScribe
            </h3>


            <p>
              ✓ Consultation captured naturally
            </p>


            <p>
              ✓ AI-drafted clinical documentation
            </p>


            <p>
              ✓ Structured notes ready sooner
            </p>


            <p>
              ✓ More consistent documentation workflow
            </p>


            <p>
              ✓ More time focused on patient care
            </p>


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


            <span>
              01
            </span>


            <h3>
              Capture the Consultation
            </h3>


            <p>

              Start a consultation and let VetScribe securely capture
              the conversation while you focus on the patient.

            </p>


          </div>





          <div>


            <span>
              02
            </span>


            <h3>
              AI Drafts the Clinical Note
            </h3>


            <p>

              VetScribe turns the consultation into structured
              clinical documentation for the veterinarian to review.

            </p>


          </div>





          <div>


            <span>
              03
            </span>


            <h3>
              Review, Edit & Approve
            </h3>


            <p>

              Review the draft, make any required changes and approve
              the final clinical record.

            </p>


          </div>





          <div>


            <span>
              04
            </span>


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


          <span>
            SEE VETSCRIBE IN ACTION
          </span>



          <h2>

            From consultation conversation to structured clinical note

          </h2>



          <p>

            See how consultation details can be transformed into a clear,
            structured SOAP-style draft.

          </p>



        </div>








        <div className="product-demo-video-wrapper">

          <video
            className="product-demo-video"
            controls
            playsInline
            preload="metadata"
          >
            <source
              src={demoVideo}
              type="video/mp4"
            />

            Your browser does not support video playback.

          </video>

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

                <strong>Owner:</strong> "About three weeks, mostly at night.
                She is eating and drinking normally."

              </p>



              <p>

                <strong>Vet:</strong> "Have you noticed any redness or changes
                to her skin?"

              </p>



              <p>

                <strong>Owner:</strong> "Yes, around her stomach and paws."

              </p>



              <p>

                <strong>Vet:</strong> "Bella weighs 24.6 kg and her temperature
                is 38.5°C. There is mild redness between the toes and across
                the lower abdomen, with no open lesions."

              </p>



              <p>

                <strong>Vet:</strong> "We will review her flea control, start
                the agreed skin treatment and recheck her in two weeks, or
                sooner if the itching becomes worse."

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

              AI-Drafted SOAP Note

            </h3>





            <div className="clinical-note soap-note-example">


              <div className="soap-note-section">

                <strong>
                  S · Subjective
                </strong>

                <p>
                  Three-week history of pruritus, more noticeable at night.
                  Owner reports erythema around the ventral abdomen and paws.
                  Appetite and water intake reported as normal.
                </p>

              </div>



              <div className="soap-note-section">

                <strong>
                  O · Objective
                </strong>

                <p>
                  Weight 24.6 kg. Temperature 38.5°C. Mild interdigital and
                  ventral abdominal erythema noted. No open lesions observed.
                </p>

              </div>



              <div className="soap-note-section">

                <strong>
                  A · Assessment
                </strong>

                <p>
                  Pruritic dermatitis with mild erythematous skin changes.
                  Clinical assessment remains subject to the veterinarian's
                  final judgement.
                </p>

              </div>



              <div className="soap-note-section">

                <strong>
                  P · Plan
                </strong>

                <p>
                  Review flea control, commence the agreed skin treatment and
                  recheck in two weeks. Earlier reassessment advised if signs
                  worsen.
                </p>

              </div>



            </div>



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





      {/* SECURITY & DATA */}


      <section className="security-section">


        <div className="security-heading">


          <span className="security-eyebrow">
            SECURITY & DATA
          </span>


          <h2>
            Your clinical data stays under your practice's control
          </h2>


          <p>
            VetScribe is designed with secure access, practice-level data
            separation and clear handling of consultation information.
          </p>


        </div>


        <div className="security-grid">


          <div>

            <span className="security-card-icon">
              01
            </span>

            <h3>
              Secure practice access
            </h3>

            <p>
              VetScribe uses encrypted connections, secure authentication,
              database access controls and practice-level data separation.
            </p>

          </div>


          <div>

            <span className="security-card-icon">
              02
            </span>

            <h3>
              Consultation audio
            </h3>

            <p>
              Audio is temporarily processed for transcription and is not
              stored by VetScribe after transcription is completed.
            </p>

          </div>


          <div>

            <span className="security-card-icon">
              03
            </span>

            <h3>
              AI model training
            </h3>

            <p>
              Consultation inputs and outputs are not shared with AI providers
              for model-improvement purposes.
            </p>

          </div>


          <div>

            <span className="security-card-icon">
              04
            </span>

            <h3>
              Your practice owns the records
            </h3>

            <p>
              Your practice owns its clinical data. VetScribe provides the
              tools to create, manage and organise those records.
            </p>

          </div>


        </div>


      </section>








      {/* PRICING */}



      <PricingsSection />








      {/* FAQ */}



      <FAQ />








      {/* CLOSING CTA */}


      <section className="closing-cta">


        <div className="closing-cta-inner">


          <span className="closing-cta-eyebrow">
            READY TO TRY VETSCRIBE?
          </span>


          <h2>
            Spend less time on documentation and more time with patients.
          </h2>


          <p>
            Start your free trial and see how VetScribe fits into your
            veterinary workflow.
          </p>


          <div className="closing-cta-actions">


            <button
              className="closing-cta-primary"
              onClick={() => {
                window.location.href = "/register";
              }}
            >
              Start Free Trial →
            </button>


            <a
              className="closing-cta-secondary"
              href="mailto:vetscribe@clariana.co.uk"
            >
              Contact VetScribe
            </a>


          </div>


        </div>


      </section>








      {/* FOOTER */}



      <Footer />



    </div>


  );


}
