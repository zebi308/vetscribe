import { useState } from "react";


const faqData = [

  {
    question:
      "What is VetScribe?",

    answer:
      "VetScribe is an AI clinical documentation assistant designed specifically for veterinary teams. It helps transform consultation conversations into structured clinical documentation for veterinary professionals to review, edit and approve."
  },


  {
    question:
      "Does VetScribe make clinical decisions?",

    answer:
      "No. VetScribe is designed to assist with documentation rather than replace veterinary clinical judgement. AI-drafted content should be reviewed and approved by the appropriate veterinary professional."
  },


  {
    question:
      "Can I edit the AI-drafted notes?",

    answer:
      "Yes. VetScribe is designed around a review-first workflow, allowing veterinary professionals to review and edit the draft before approving the final documentation."
  },


  {
    question:
      "Does VetScribe diagnose animals?",

    answer:
      "VetScribe should not be positioned as a diagnostic tool. Its primary purpose is to assist with clinical documentation and organisation of information captured during consultations."
  },


  {
    question:
      "Can I use VetScribe with my practice?",

    answer:
      "Yes. VetScribe is being designed for veterinary practices and teams, with practice-level accounts and workflows intended to support multiple veterinary professionals working from the same account."
  },


  {
    question:
      "Is my data secure?",

    answer:
      "VetScribe is designed with appropriate security and access controls for practice data — see the Security section above for details."
  },


  {
    question:
      "Does VetScribe integrate with my practice management system?",

    answer:
      "Practice management integrations are part of the VetScribe roadmap. The current workflow allows teams to review and use their documentation directly within VetScribe."
  },


  {
    question:
      "Is there a free trial?",

    answer:
      "Yes. Start your free trial to experience the VetScribe workflow before committing to a paid plan."
  }

];


export function FAQ(){


const [openIndex,setOpenIndex] = useState<number | null>(null);


return (

<section
className="faq-section"
id="faq"
>


<h2>
Frequently Asked Questions
</h2>


<div className="faq-container">


{
faqData.map((item,index)=>(


<div

className={`faq-item ${
openIndex === index ? "active" : ""
}`}

key={index}

>


<button

className="faq-question"

onClick={() =>
setOpenIndex(
openIndex === index
? null
: index
)
}

>


<span>
{item.question}
</span>


<span className="faq-icon">

{
openIndex === index
? "−"
: "+"
}

</span>


</button>


<div
className="faq-answer"
>

<p>

{item.answer}

</p>

</div>


</div>


))

}


</div>


</section>

);


}