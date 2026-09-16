import { PricingCard } from "./PricingCard";


export function PricingsSection() {


const plans = [

    {
        title:"Starter",

        price:"£24.99",

        description:
        "For individual veterinary professionals",

        features:[

            "AI consultation capture",

            "Structured clinical notes",

            "Patient documentation",

            "Review and editing tools",

            "Secure account access"

        ],

        buttonText:"Start Free Trial"

    },


    {


        title:"Professional",

        price:"£44.99",

        description:
        "For veterinary practices",

        popular:true,

        features:[

            "Everything in Starter",

            "Higher consultation allowance",

            "Owner-friendly summaries",

            "Advanced note templates",

            "Practice-level features",

            "Priority support"

        ],

        buttonText:"Start Free Trial"

    },



    {


        title:"Practice Plus",

        price:"£99",

        description:
        "For larger veterinary teams and organisations",

        features:[

            "Highest usage allowance",

            "Multi-user practice access",

            "Centralised administration",

            "Advanced permissions",

            "Custom onboarding",

            "Integration support",

            "Dedicated account support"

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

Simple, transparent pricing

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


<p className="pricing-note">
Start with a free trial. No credit card required.
</p>



</section>


);


}