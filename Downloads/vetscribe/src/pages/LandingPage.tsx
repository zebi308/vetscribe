import "./landing.css";

import { Navbar } from "../components/landing/Navbar";
import { Hero } from "../components/landing/Hero";
import { PricingsSection } from "../components/landing/PricingSection";
import { FAQ } from "../components/landing/FAQ";
import { Footer } from "../components/landing/footer";


export function LandingPage(){


return (

<div className="landing">


<Navbar />


<Hero />



{/* STATS */}

<section className="stats">


<div>
<strong>
10,000+
</strong>

<p>
Consultations documented
</p>

</div>



<div>

<strong>
70%
</strong>

<p>
Less documentation workload
</p>

</div>



<div>

<strong>
5 min
</strong>

<p>
Average note generation
</p>

</div>



<div>

<strong>
24/7
</strong>

<p>
AI assistant availability
</p>

</div>



</section>






{/* PROBLEM */}


<section className="problem">


<div className="section-title">


<span>
THE PROBLEM
</span>


<h2>
Veterinary professionals lose hours every week writing notes.
</h2>


<p>
Manual documentation takes time away from patient care.
VetScribe helps transform consultations into structured records.
</p>


</div>




<div className="problem-cards">



<div className="problem-box">

<h3>
Without VetScribe
</h3>


<p>
❌ Manual note writing
</p>


<p>
❌ Long administrative tasks
</p>


<p>
❌ Less time with patients
</p>


<p>
❌ Repetitive documentation work
</p>


</div>






<div className="solution-box">

<h3>
With VetScribe
</h3>


<p>
✓ AI generated clinical notes
</p>


<p>
✓ Faster patient records
</p>


<p>
✓ Vet controlled approval
</p>


<p>
✓ More focus on animal care
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
Capture Consultation
</h3>


<p>
Record the conversation securely during the appointment.
</p>


</div>




<div>

<span>
02
</span>


<h3>
AI Creates Notes
</h3>


<p>
VetScribe converts conversations into structured clinical documentation.
</p>


</div>




<div>

<span>
03
</span>


<h3>
Review & Save
</h3>


<p>
Veterinarians review, edit and approve before saving.
</p>


</div>



</div>



</section>








{/* FEATURES */}


<section
id="features"
className="features"
>



<h2>
Everything your veterinary practice needs
</h2>



<div className="feature-grid">


<div>

<h3>
AI Clinical Notes
</h3>


<p>
SOAP notes, summaries and consultation records generated instantly.
</p>


</div>




<div>

<h3>
Client & Patient Records
</h3>


<p>
Keep owners, pets and consultation history organised.
</p>


</div>




<div>

<h3>
Secure Practice Workflow
</h3>


<p>
Designed for modern veterinary teams and clinics.
</p>


</div>



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