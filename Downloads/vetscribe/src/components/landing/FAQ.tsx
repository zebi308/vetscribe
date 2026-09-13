import { useState } from "react";


const faqData = [

  {
    question:
      "Does VetScribe replace veterinarians?",

    answer:
      "No. VetScribe is an AI documentation assistant. It helps veterinary professionals create clinical notes faster, but veterinarians remain responsible for diagnosis, treatment decisions and patient care."
  },


  {
    question:
      "How does VetScribe create clinical notes?",

    answer:
      "VetScribe captures the consultation workflow, processes the information using AI, and generates structured veterinary documentation including consultation summaries, clinical history and treatment notes."
  },


  {
    question:
      "Can I edit AI-generated notes before saving?",

    answer:
      "Yes. Every generated clinical note can be reviewed, edited and approved by the veterinarian before it becomes part of the patient's permanent record."
  },


  {
    question:
      "Can multiple veterinarians use the same practice account?",

    answer:
      "Yes. Professional and Practice plans support multiple veterinary users, allowing teams to collaborate while maintaining secure access controls."
  },


  {
    question:
      "What type of animals can VetScribe support?",

    answer:
      "VetScribe is designed for companion animal practices including dogs, cats and other small animal workflows."
  },


  {
    question:
      "Is my clinic and patient data secure?",

    answer:
      "VetScribe uses secure access controls and privacy-focused workflows. Veterinary professionals maintain control over their clinical records and information."
  },


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

onClick={()=>
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