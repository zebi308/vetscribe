import {
  useState
} from "react";

import {
  Plus
} from "lucide-react";



const faqs = [

  {
    question:
      "What is VetScribe?",

    answer:
      "VetScribe is an AI-assisted veterinary documentation platform that helps veterinary teams capture consultations and prepare structured clinical notes for review."
  },


  {
    question:
      "Does VetScribe replace the veterinarian?",

    answer:
      "No. VetScribe is designed to support veterinary professionals by reducing documentation workload. Final review, editing and approval remain under veterinary control."
  },


  {
    question:
      "How does VetScribe create clinical notes?",

    answer:
      "VetScribe captures consultation information and transforms it into structured documentation that can be reviewed, edited and approved by the veterinary professional."
  },


  {
    question:
      "Is my practice data secure?",

    answer:
      "VetScribe is designed with security, access control and responsible AI use in mind. More detailed security information will be provided as the platform develops."
  },


  {
    question:
      "Can my whole veterinary team use VetScribe?",

    answer:
      "VetScribe is being designed for veterinary practices and teams, with user access based on practice requirements and permissions."
  },


  {
    question:
      "Do I need special equipment?",

    answer:
      "No special hardware is required. VetScribe is designed to work through standard devices used within veterinary practices."
  }


];





export function FAQ(){


const [
  openIndex,
  setOpenIndex
]=useState<number | null>(null);





return (


<section className="faq-section">


<div className="faq-heading">


<h2>

Frequently Asked Questions

</h2>



<p>

Everything you need to know about VetScribe.

</p>


</div>








<div className="faq-container">


{

faqs.map(
(faq,index)=>{


const open =
openIndex===index;



return (


<div

key={index}

className={`faq-item ${open ? "active" : ""}`}

>


<button


className="faq-question"


onClick={()=>


setOpenIndex(

open

?

null

:

index

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


}

)

}


</div>





</section>


);


}