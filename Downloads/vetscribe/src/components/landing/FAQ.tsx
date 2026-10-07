import React, { useState } from "react";
import { Plus } from "lucide-react";

const faqs = [

  {
    question: "Does VetScribe replace the veterinarian?",
    answer:
      "No. VetScribe is designed to support veterinary professionals by reducing documentation workload. Final review, editing and approval remain under veterinary control."
  },

  {
    question: "How does VetScribe create clinical notes?",
    answer:
      "VetScribe captures consultation information and transforms it into structured documentation that can be reviewed, edited and approved by the veterinary professional."
  },

  {
    question: "Is my practice and client data secure with VetScribe?",
    answer:
      "Yes. VetScribe is built with security in mind using encrypted connections, secure authentication, database access controls, and practice-level data separation to protect your information."
  },


  {
    question: "Is my consultation data used to train AI models?",
    answer:
      "No. VetScribe has disabled sharing of consultation inputs and outputs with AI providers for model improvement purposes. Your consultation data is used only to provide the VetScribe service."
  },

  {
    question: "Will AI make clinical decisions for my patients?",
    answer:
      "No. VetScribe is an AI-assisted documentation tool designed to help veterinary professionals save time creating records. All generated notes should be reviewed and approved by a qualified veterinary professional."
  },

  {
    question: "Who owns my practice data and clinical records?",
    answer:
      "Your practice owns your clinical data. VetScribe provides the tools to help you create, manage, and organise records while keeping your information protected."
  },

  {
    question: "Can my whole veterinary team use VetScribe?",
    answer:
      "VetScribe is being designed for veterinary practices and teams, with user access based on practice requirements and permissions."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="faq-section">

      <div className="faq-heading">
        <h2>
          Frequently Asked Questions
        </h2>

        <p>
          Everything you need to know about VetScribe.
        </p>
      </div>

      <div className="faq-container">

        {faqs.map((faq, index) => {
          const open = openIndex === index;

          return (
            <div
              key={index}
              className={`faq-item ${open ? "active" : ""}`}
            >

              <button
                className="faq-question"
                onClick={() =>
                  setOpenIndex(
                    open
                      ? null
                      : index
                  )
                }
              >

                <span>
                  {faq.question}
                </span>

                <Plus
                  size={22}
                  className={`faq-icon ${open ? "rotate" : ""}`}
                />

              </button>

              <div
                className={`faq-answer-wrapper ${open ? "open" : ""}`}
              >
                <div className="faq-answer">
                  <p>
                    {faq.answer}
                  </p>
                </div>
              </div>

            </div>
          );
        })}

      </div>

    </section>
  );
}