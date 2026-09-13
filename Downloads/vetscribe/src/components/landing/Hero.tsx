import { useNavigate } from "react-router-dom";
import { DashboardMockup } from "./DashboardMockup";


export function Hero(){


const navigate = useNavigate();



return (

<section className="hero">



<div className="hero-content">



<div className="hero-badge">

AI Clinical Documentation For Veterinary Teams

</div>




<h1>

Your Consultation Ends.

<br/>

<span>
Your Clinical Notes Are Already Done.
</span>


</h1>





<p>

VetScribe listens during consultations and transforms conversations
into structured veterinary notes, patient records and treatment
summaries — helping vets save hours every week.

</p>






<div className="hero-buttons">



<button

className="primary-btn"

onClick={()=>navigate("/register")}

>

Start Free Trial →

</button>




<button

className="secondary-btn"

onClick={()=>

document
.getElementById("workflow")
?.scrollIntoView({
behavior:"smooth"
})

}

>

See How It Works

</button>



</div>







<div className="trust-row">


<div>

<span>
✓
</span>

No credit card required

</div>



<div>

<span>
✓
</span>

Vet approval always required

</div>



<div>

<span>
✓
</span>

Built for veterinary practices

</div>



</div>





</div>







<div className="hero-dashboard">


<DashboardMockup/>


</div>




</section>


);


}