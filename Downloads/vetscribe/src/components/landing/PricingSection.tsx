import { PricingCard } from "./PricingCard";


export function PricingsSection() {


const plans = [

    {
        title:"Starter",

        price:"£19",

        description:
        "For individual veterinarians starting with AI documentation",

        features:[

            "100 AI consultations/month",

            "AI clinical note generation",

            "Client & patient records",

            "Consultation history",

            "Secure veterinary workflow"

        ],

        buttonText:"Start Free Trial"

    },


    {


        title:"Professional",

        price:"£49",

        description:
        "For growing veterinary practices",

        popular:true,

        features:[

            "500 AI consultations/month",

            "Everything in Starter",

            "SOAP note generation",

            "Treatment summaries",

            "Advanced templates",

            "Priority support"

        ],

        buttonText:"Start Free Trial"

    },



    {


        title:"Practice Plus",

        price:"£99",

        description:
        "For larger veterinary clinics and teams",

        features:[

            "Unlimited consultations",

            "Multiple staff accounts",

            "Advanced analytics",

            "Custom workflows",

            "Practice management tools",

            "Dedicated support"

        ],

        buttonText:"Contact Us"

    }



];





return (


<section 
className="pricing"
id="pricing"
>



<h2>

Simple transparent pricing

</h2>





<div className="pricing-grid">


{

plans.map((plan,index)=>(


<PricingCard

key={index}

{...plan}

/>


))


}


</div>




</section>


);


}