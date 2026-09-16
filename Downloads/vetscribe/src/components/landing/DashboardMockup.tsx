import { useEffect, useState } from "react";
import { createPortal } from "react-dom";


export function DashboardMockup(){


const [status,setStatus] = useState(
"Recording consultation..."
);


const [seconds,setSeconds] = useState(52);


const [showNote,setShowNote] = useState(false);


const [generated,setGenerated] = useState(false);





useEffect(()=>{


const timer=setInterval(()=>{


setSeconds(prev=>prev+1);


},1000);





const aiTimer=setInterval(()=>{


setStatus(prev=>{


if(prev==="Recording consultation...")
return "AI analysing consultation...";



if(prev==="AI analysing consultation...")
{

setGenerated(true);

return "Generating clinical note...";

}



if(prev==="Generating clinical note...")
return "Clinical note ready for review";



return prev;


});


},3500);





return ()=>{


clearInterval(timer);

clearInterval(aiTimer);


}



},[]);







return (


<>


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

Ready

</div>


</div>









<div className="consultation-card">

<div className="patient-info">


<div className="patient-column">


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





<div className="owner-column">


<label>
OWNER
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

disabled={!generated}

className={generated ? "active-review" : ""}

onClick={()=>setShowNote(true)}

>


{generated ? "Review Note" : "Generating..."}


</button>






<div className="lines">

<span></span>

<span></span>

<span></span>

</div>




</div>





</div>













{
showNote &&

createPortal(


<div className="clinical-modal-overlay">



<div className="clinical-modal">





<div className="review-header">


<h3>

Clinical Note Review

</h3>




<button

onClick={()=>setShowNote(false)}

>

×


</button>



</div>






<h4>

SOAP Format

</h4>







<div className="soap-section">


<strong>
Subjective
</strong>


<p>

Owner reports Max has been vomiting intermittently for approximately three days. Appetite reduced but drinking normally.

</p>


</div>








<div className="soap-section">


<strong>
Objective
</strong>


<p>

Temperature 38.7°C. Mucous membranes pink. Mild abdominal tension detected on examination.

</p>


</div>








<div className="soap-section">


<strong>
Assessment
</strong>


<p>

Possible acute gastrointestinal condition. Differentials include dietary indiscretion and gastritis.

</p>


</div>








<div className="soap-section">


<strong>
Plan
</strong>


<p>

Supportive management recommended. Monitor vomiting frequency, appetite and hydration. Return if symptoms worsen.

</p>


</div>





</div>



</div>,


document.body


)

}





</>


);


}