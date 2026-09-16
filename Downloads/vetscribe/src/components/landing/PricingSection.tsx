export function PricingsSection(){


return (


<section

id="pricing"

className="pricing"


>



<div className="pricing-heading">


<span>

PRICING

</span>



<h2>

Simple pricing for veterinary practices

</h2>



<p>

Choose the plan that fits your veterinary workflow.

</p>



</div>









<div className="pricing-grid">







<div className="pricing-card">



<h3>

Starter

</h3>




<p className="pricing-description">

For individual veterinary professionals who want
AI-assisted documentation support.

</p>





<div className="price">

£24.99

</div>



<p className="price-period">

per month

</p>







<ul>


<li>

✓ AI-assisted consultation documentation

</li>


<li>

✓ Structured clinical note drafts

</li>


<li>

✓ Vet review workflow

</li>


<li>

✓ Patient-focused records

</li>


</ul>





<button
onClick={()=>window.location.href="/register"}
>

Get Started

</button>



</div>









<div className="pricing-card featured">



<div className="pricing-badge">

MOST POPULAR

</div>





<h3>

Practice Plus

</h3>





<p className="pricing-description">

For veterinary practices managing teams
and clinical documentation workflows.

</p>







<div className="price">

£44.99

</div>



<p className="price-period">

per month

</p>







<ul>


<li>

✓ Everything in Starter

</li>


<li>

✓ Practice workspace

</li>


<li>

✓ Team access controls

</li>


<li>

✓ Veterinary workflow tools

</li>


<li>

✓ Priority support

</li>


</ul>







<button
onClick={()=>window.location.href="/register"}
>

Get Started

</button>




</div>









<div className="pricing-card">



<h3>

Enterprise

</h3>





<p className="pricing-description">

For larger veterinary organisations requiring
tailored solutions.

</p>







<div className="price">

Custom

</div>



<p className="price-period">

Contact us

</p>







<ul>


<li>

✓ Everything in Practice Plus

</li>


<li>

✓ Organisation-level support

</li>


<li>

✓ Custom requirements discussion

</li>


<li>

✓ Dedicated onboarding

</li>


</ul>







<button
onClick={()=>window.location.href="mailto:support@vetscribe.clariana.co.uk"}
>

Contact Sales

</button>





</div>









</div>





</section>



);


}