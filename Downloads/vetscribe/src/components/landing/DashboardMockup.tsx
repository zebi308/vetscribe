import { useEffect, useState } from "react";


export function DashboardMockup(){


const [status,setStatus] = useState(
"Recording consultation..."
);


const [seconds,setSeconds] = useState(52);



useEffect(()=>{


const timer=setInterval(()=>{


setSeconds(prev=>prev+1);


},1000);



const aiTimer=setInterval(()=>{


setStatus(prev=>{


if(prev==="Recording consultation...")
return "AI analysing consultation...";


if(prev==="AI analysing consultation...")
return "Generating clinical note...";


return "Recording consultation...";


});


},3500);



return ()=>{

clearInterval(timer);
clearInterval(aiTimer);

}



},[]);





return (

<div className="dashboard-mockup">



<div className="mockup-header">


<div>

<h3>
VetScribe AI
</h3>

<span>
Clinical Documentation Assistant
</span>

</div>



<div className="ai-status">

<span></span>

Ready

</div>


</div>





<div className="consultation-card">


<div className="patient-info">


<div>

<label>
CURRENT CONSULTATION
</label>


<h2>
Max
</h2>


<p>
Golden Retriever • 5 years
</p>


</div>



<div className="owner">

<label>
Owner:
</label>

<strong>
Sarah Williams
</strong>

</div>



</div>


</div>







<div className="recording-card">


<div className="card-title">

Consultation Recording

</div>



<div className="timer">

🎙

{String(
Math.floor(seconds/60)
).padStart(2,"0")}

:

{String(
seconds%60
).padStart(2,"0")}

 recorded


</div>




<div className="wave">


<span></span>
<span></span>
<span></span>
<span></span>
<span></span>
<span></span>



</div>



<p className="status-text">

{status}

</p>


</div>







<div className="analysis-card">


<h3>
Documentation Processing
</h3>


<div className="check">

✓ Clinical history extracted

</div>


<div className="check">

✓ Clinical findings captured

</div>


<div className="check">

✓ Consultation details structured

</div>



</div>










<div className="note-card">


<div>

<h3>
Draft Clinical Note
</h3>


<p>

SOAP format ready for review

</p>


</div>



<button
onClick={() =>
document
.getElementById("demo")
?.scrollIntoView({
behavior: "smooth"
})
}
>

Review

</button>



<div className="lines">

<span></span>
<span></span>
<span></span>

</div>



</div>





</div>


);


}