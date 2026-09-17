
import {
  useEffect,
  useRef,
  useState
} from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";


import {
  Mic,
  Pause,
  Play,
  Square,
  Upload,
  Sparkles,
  Save,
  CheckCircle
} from "lucide-react";

import jsPDF from "jspdf";

import { supabase } from "../lib/supabase";

import { Card } from "../components/ui/Card";

import { Button } from "../components/ui/Button";

import { useAppState } from "../lib/AppState";






export function ConsultationRoomPage(){


const navigate = useNavigate();


const { id } = useParams();




const {

consultations,

patients,

clients,

updateConsultation,

saveDraft,

approveConsultation

}=useAppState();





const consultationData =
consultations.find(
(item)=>item.id===id
);




if(!consultationData){

return (

<div className="p-8 text-slate-500">

Loading consultation...

</div>

);

}





const activeConsultation =
consultationData;



const consultationId =
activeConsultation.id;






const patient =
patients.find(
(item)=>item.id===activeConsultation.patientId
);





const client =
clients.find(
(item)=>item.id===activeConsultation.clientId
);









// --------------------
// STATES
// --------------------


const [recording,setRecording] =
useState(false);


const [paused,setPaused] =
useState(false);



const [seconds,setSeconds] =
useState(0);



const [recordingReady,setRecordingReady] =
useState(false);



const [notes,setNotes] =
useState(
activeConsultation.transcript || ""
);



const [draft,setDraft] =
useState<any>(
activeConsultation.clinicalNote || null
);
const [editingSOAP,setEditingSOAP] =
useState(false);

const [savedAt,setSavedAt] =
useState<string | null>(null);

const [loading,setLoading] =
useState(false);



const [transcribing,setTranscribing] =
useState(false);



const [mediaRecorder,setMediaRecorder] =
useState<MediaRecorder|null>(null);




// IMPORTANT
// Do not store Blob in React state
// Browser recorder needs reference

const audioBlobRef =
useRef<Blob|null>(null);









useEffect(()=>{


if(!recording)
return;



const timer =
setInterval(()=>{

setSeconds(
prev=>prev+1
);

},1000);



return ()=>clearInterval(timer);



},[recording]);








function formatTime(){


const min =
Math.floor(seconds / 60)
.toString()
.padStart(2,"0");


const sec =
(seconds % 60)
.toString()
.padStart(2,"0");



return `${min}:${sec}`;

}









// --------------------
// RECORDING
// --------------------



async function startRecording(){

try{


const stream =
await navigator.mediaDevices.getUserMedia({

audio:true

});



console.log(
"MIC STREAM STARTED",
stream.getAudioTracks()
);



const recorder =
new MediaRecorder(
stream,
{
mimeType:"audio/webm;codecs=opus"
}
);



const chunks:Blob[]=[];



recorder.ondataavailable=(event)=>{


console.log(
"DATA AVAILABLE SIZE:",
event.data.size
);



if(event.data.size>0){

chunks.push(event.data);

}


};





recorder.onstop=()=>{


console.log(
"TOTAL CHUNKS:",
chunks.length
);



const blob =
new Blob(
chunks,
{
type:"audio/webm"
}
);



console.log(
"FINAL AUDIO SIZE:",
blob.size
);



audioBlobRef.current = blob;



setRecordingReady(true);



};




recorder.start(1000);



setMediaRecorder(recorder);


setSeconds(0);


setRecording(true);


}


catch(error){


console.error(
"RECORDING ERROR",
error
);



alert(
"Microphone permission denied"
);


}


}









function togglePause(){


if(!mediaRecorder)
return;



if(mediaRecorder.state==="recording"){


mediaRecorder.pause();


setPaused(true);


}

else if(mediaRecorder.state==="paused"){


mediaRecorder.resume();


setPaused(false);


}



}







function stopRecording(){


if(!mediaRecorder)
return;



console.log(
"RECORDER STATE:",
mediaRecorder.state
);



mediaRecorder.stop();



mediaRecorder.stream
.getTracks()
.forEach(
track=>track.stop()
);



setRecording(false);

setPaused(false);


}
// --------------------
// TRANSCRIPTION
// --------------------


async function submitRecording(){


const blob =
audioBlobRef.current;



console.log(
"BLOB BEFORE SEND:",
blob
);



console.log(
"BLOB SIZE:",
blob?.size
);




if(!blob){


alert(
"Recording not ready. Please stop recording first."
);


return;

}





try{


setTranscribing(true);





const {
data:{
session
}

}=await supabase.auth.getSession();






if(!session){


throw new Error(
"User session expired. Please login again."
);


}







console.log(
"SENDING AUDIO SIZE:",
blob.size
);







const response =
await fetch(

"/api/transcribe",

{

method:"POST",


headers:{

"Content-Type":
"audio/webm",


Authorization:
`Bearer ${session.access_token}`

},


body:blob

}

);








const data =
await response.json();





console.log(
"TRANSCRIPTION RESPONSE:",
data
);







if(!response.ok){


throw new Error(

data.error ||

"Transcription failed"

);


}








if(data.text){


setNotes(
data.text
);





await updateConsultation(

consultationId,

{

transcript:data.text

}

);



}



}

catch(error){



console.error(
"TRANSCRIPTION ERROR:",
error
);



alert(

error instanceof Error

?

error.message

:

"Transcription failed"

);


}

finally{


setTranscribing(false);


}



}









// --------------------
// SAVE TRANSCRIPT
// --------------------


async function saveNotes(){



await updateConsultation(

consultationId,

{

transcript:notes

}

);



}












// --------------------
// GENERATE SOAP
// --------------------



async function generateDraft(){


try{


setLoading(true);





const response =
await fetch(

"/api/clinical-note",

{

method:"POST",


headers:{

"Content-Type":
"application/json"

},


body:JSON.stringify({

transcript:notes,

patient,

client

})

}

);






if(!response.ok){


const error =
await response.text();



throw new Error(error);


}







const generated =
await response.json();





console.log(
"SOAP GENERATED:",
generated
);






setDraft(
generated
);







await saveDraft(

consultationId,

generated

);




}

catch(error){


console.error(
"SOAP ERROR:",
error
);



alert(

error instanceof Error

?

error.message

:

"SOAP generation failed"

);



}

finally{


setLoading(false);


}


}









async function handleSaveDraft(){


if(!draft){

alert(
"No SOAP draft available"
);

return;

}



try{


setLoading(true);





await saveDraft(

consultationId,

draft

);

setSavedAt(
new Date().toLocaleString()
);




setEditingSOAP(false);





alert(
"SOAP saved successfully"
);



}

catch(error){


console.error(
"SAVE SOAP ERROR",
error
);



alert(
"Failed to save SOAP"
);



}

finally{


setLoading(false);


}



}







async function handleApprove(){


if(!draft)
return;



try{


setLoading(true);



await approveConsultation(

consultationId,

draft,

"Approved by veterinarian"

);



}

finally{


setLoading(false);


}


}




function exportPDF(){

if(!draft)
return;


const pdf = new jsPDF();


pdf.setFontSize(18);

pdf.text(
"Veterinary Clinical Record",
20,
20
);


pdf.setFontSize(12);


pdf.text(
`Patient: ${patient?.name || ""}`,
20,
35
);


pdf.text(
`Owner: ${client?.firstName || ""} ${client?.lastName || ""}`,
20,
45
);



let y = 65;


pdf.text(
"SUBJECTIVE",
20,
y
);


y += 10;


pdf.text(
draft.subjective?.presenting_complaint || "",
20,
y
);



y += 20;


pdf.text(
"OBJECTIVE",
20,
y
);



y += 10;


pdf.text(
draft.objective?.clinical_findings || "",
20,
y
);



y += 20;


pdf.text(
"ASSESSMENT",
20,
y
);



y += 10;


pdf.text(
draft.assessment?.primary_assessment || "",
20,
y
);



y += 20;


pdf.text(
"PLAN",
20,
y
);



y += 10;


pdf.text(
draft.plan?.follow_up || "",
20,
y
);



pdf.save(
`${patient?.name}-clinical-record.pdf`
);


}

function updateSOAPField(
section:string,
field:string,
value:string
){


setDraft(
(prev:any)=>({

...prev,


[section]:{

...prev[section],

[field]:value

}


})

);


}


// --------------------
// HELPERS
// --------------------


function displayValue(value:any){



if(!value)
return "";





if(Array.isArray(value)){


return value.map(

(item:any)=>{


if(typeof item==="object"){

return JSON.stringify(item);

}


return item;


}

).join(", ");



}






if(typeof value==="object"){


return JSON.stringify(value);


}





return value;



}









function renderMissingInformation(){



if(
!draft?.missing_information ||
!Array.isArray(
draft.missing_information
)

){

return null;

}





return draft.missing_information.map(

(item:any,index:number)=>(


<div
key={index}
className="border rounded-lg p-3"
>


<p className="font-semibold">

{
item.field ||
"Missing information"
}

</p>


<p className="text-slate-600">

{
item.reason ||
"Needs review"
}

</p>



</div>


)


);



}
return (

<div className="space-y-8">





{/* HEADER */}

<div className="flex items-center gap-4">


<button

type="button"

onClick={()=>navigate(-1)}

className="
rounded-xl
p-2
hover:bg-slate-100
"

>

←

</button>





<div>

<h1 className="text-3xl font-bold">

Consultation Room

</h1>


<p className="text-slate-500">

Clinical documentation workspace

</p>


</div>



</div>









{/* PATIENT CARD */}

<Card className="p-6">


<h2 className="text-2xl font-bold">

{patient?.name || "Unknown Patient"}

</h2>




<p className="text-slate-500">

{patient?.species}

{" • "}

{patient?.breed}

</p>





<p className="mt-3">

Owner:

<strong>

{" "}

{client?.firstName}

{" "}

{client?.lastName}

</strong>


</p>





<Button

className="mt-5"

onClick={()=>navigate(

`/patients/${activeConsultation.patientId}/history`

)}

>

View Medical History

</Button>



</Card>









{/* RECORDING */}


<Card className="p-6 space-y-5">


<h3 className="text-lg font-bold">

Consultation Recording

</h3>





<div className="flex flex-wrap items-center gap-3">





{!recording && (

<Button

onClick={startRecording}

>

<Mic size={18}/>

Start Recording

</Button>

)}








{recording && (

<>


<Button

onClick={togglePause}

>


{

paused

?

<>

<Play size={18}/>

Resume

</>


:

<>

<Pause size={18}/>

Pause

</>


}



</Button>





<Button

onClick={stopRecording}

>

<Square size={18}/>

Stop

</Button>


</>

)}







{

!recording && recordingReady &&

(

<Button

disabled={transcribing}

onClick={submitRecording}

>


<Upload size={18}/>


{

transcribing

?

"Transcribing..."

:

"Submit Recording"

}



</Button>

)

}





<span className="font-semibold">


{

recording

?

`Recording ${formatTime()}`

:

recordingReady

?

"Recording ready"

:

"Ready"

}



</span>



</div>





</Card>









{/* TRANSCRIPT */}


<Card className="p-6 space-y-4">


<h3 className="text-lg font-bold">

Consultation Transcript

</h3>





<textarea

value={notes}

onChange={(e)=>setNotes(e.target.value)}

placeholder="
Doctor conversation transcript will appear here...
"

className="
min-h-[220px]
w-full
rounded-xl
border
p-4
"

/>





<Button

onClick={saveNotes}

>

<Save size={18}/>

Save Transcript

</Button>





</Card>









{/* SOAP */}


<Card className="p-6 space-y-6">


<div className="
flex
items-center
justify-between
flex-wrap
gap-3
">


<div>

<h3 className="text-xl font-bold">

AI Clinical SOAP Record

</h3>

{

savedAt &&

<p className="text-xs text-slate-500">

Last saved: {savedAt}

</p>

}
<p className="text-sm text-slate-500">

Veterinary clinical documentation draft

</p>


</div>





<div className="flex gap-2 flex-wrap">


<Button

onClick={generateDraft}

disabled={loading}

>


<Sparkles size={18}/>


{

loading

?

"Generating..."

:

"Generate SOAP"

}



</Button>





<Button

onClick={()=>setEditingSOAP(!editingSOAP)}

>

{

editingSOAP

?

"Stop Editing"

:

"Edit SOAP"

}

</Button>






<Button

onClick={exportPDF}

>

Export PDF

</Button>




</div>



</div>









{

draft &&

<div className="space-y-6">







{/* SUBJECTIVE */}
<h4 className="
text-lg
font-bold
mb-4
">
S — Subjective
</h4>

{

editingSOAP ?

(

<div className="space-y-4">


<div>

<label className="font-semibold">

Presenting Complaint

</label>


<textarea

value={
draft.subjective?.presenting_complaint || ""
}

onChange={(e)=>

updateSOAPField(

"subjective",

"presenting_complaint",

e.target.value

)

}

className="
w-full
rounded-xl
border
p-3
mt-1
"

/>


</div>





<div>

<label className="font-semibold">

History

</label>


<textarea

value={
draft.subjective?.history || ""
}

onChange={(e)=>

updateSOAPField(

"subjective",

"history",

e.target.value

)

}

className="
w-full
rounded-xl
border
p-3
mt-1
"

/>


</div>





<div>

<label className="font-semibold">

Owner Observations

</label>


<textarea

value={
draft.subjective?.owner_observations || ""
}

onChange={(e)=>

updateSOAPField(

"subjective",

"owner_observations",

e.target.value

)

}

className="
w-full
rounded-xl
border
p-3
mt-1
"

/>


</div>



</div>


)

:

(

<div className="space-y-3">


<p>

{draft.subjective?.presenting_complaint}

</p>


<p>

{draft.subjective?.history}

</p>


<p>

{draft.subjective?.owner_observations}

</p>


</div>


)

}








{/* OBJECTIVE */}



<div className="
rounded-2xl
border
p-5
bg-white
">


<h4 className="
text-lg
font-bold
mb-4
">

O — Objective

</h4>





{

editingSOAP ?

(

<div>


<label className="font-semibold">

Clinical Findings

</label>



<textarea

value={
draft.objective?.clinical_findings || ""
}


onChange={(e)=>

updateSOAPField(

"objective",

"clinical_findings",

e.target.value

)

}


className="
w-full
rounded-xl
border
p-3
mt-2
"

rows={5}

/>



</div>


)

:

(

<div>

<p className="font-semibold">

Clinical Findings

</p>


<p className="text-slate-600">

{

draft.objective?.clinical_findings ||

"No examination findings recorded"

}

</p>


</div>


)

}







<div className="mt-4">


<p className="font-semibold">

Vital Parameters

</p>




<div className="space-y-2 mt-2">


{

draft.objective?.vital_parameters?.map(

(item:any,index:number)=>(


<div

key={index}

className="
rounded-lg
border
p-3
"

>

<strong>

{
item.name ||
item.parameter ||
"Parameter"
}

:

</strong>

{" "}

{
item.value ||
""
}


</div>


)

)

}



</div>


</div>








<div className="mt-4">


<p className="font-semibold">

Diagnostic Tests

</p>



<p className="text-slate-600">

{

displayValue(
draft.objective?.diagnostic_tests
)

}


</p>



</div>



</div>









{/* ASSESSMENT */}



<div className="
rounded-2xl
border
p-5
bg-slate-50
">


<h4 className="
text-lg
font-bold
mb-4
">

A — Assessment

</h4>






<div>


<p className="font-semibold">

Primary Assessment

</p>


{

editingSOAP ?

(

<textarea

value={
draft.assessment?.primary_assessment || ""
}


onChange={(e)=>

updateSOAPField(

"assessment",

"primary_assessment",

e.target.value

)

}


className="
w-full
rounded-xl
border
p-3
"

rows={4}

/>

)

:

(

<p className="text-slate-600">

{

draft.assessment?.primary_assessment ||

"Pending veterinarian assessment"

}

</p>


)

}



</div>







<div className="mt-4">


<p className="font-semibold">

Diagnoses

</p>


<p className="text-slate-600">

{

displayValue(
draft.assessment?.diagnoses
)

}


</p>



</div>







<div className="mt-4">


<p className="font-semibold">

Differentials

</p>


<p className="text-slate-600">

{

displayValue(
draft.assessment?.differentials
)

}


</p>



</div>



</div>









{/* PLAN */}



<div className="
rounded-2xl
border
p-5
bg-white
">


<h4 className="
text-lg
font-bold
mb-4
">

P — Plan

</h4>






<div className="space-y-3">


<div>

<p className="font-semibold">

Treatment

</p>


<p className="text-slate-600">

{

displayValue(
draft.plan?.treatment_given
)

}


</p>


</div>






<div>

<p className="font-semibold">

Medications

</p>


<p className="text-slate-600">

{

displayValue(
draft.plan?.medications
)

}


</p>


</div>







<div>

<p className="font-semibold">

Follow Up

</p>


{

editingSOAP ?

(

<textarea

value={
draft.plan?.follow_up || ""
}


onChange={(e)=>

updateSOAPField(

"plan",

"follow_up",

e.target.value

)

}


className="
w-full
rounded-xl
border
p-3
"

rows={3}

/>


)

:

(

<p className="text-slate-600">

{

draft.plan?.follow_up ||

"Not specified"

}

</p>


)

}


</div>






<div>

<p className="font-semibold">

Client Advice

</p>


<p className="text-slate-600">

{
draft.plan?.client_advice ||
"Not specified"
}

</p>


</div>



</div>


</div>









{/* MISSING INFORMATION */}



<div className="
rounded-2xl
border
p-5
bg-red-50
">


<h4 className="
text-lg
font-bold
mb-4
">

Missing Information

</h4>




<div className="space-y-3">


{

draft.missing_information?.map(

(item:any,index:number)=>(


<div

key={index}

className="
rounded-lg
border
bg-white
p-3
"


>


<p className="font-semibold">

{
item.field ||
"Missing field"
}

</p>


<p className="text-sm text-slate-600">

{
item.reason ||
"Needs review"
}

</p>




</div>


)


)

}




</div>


</div>









{/* CONFIDENCE */}



<div className="
rounded-2xl
border
p-5
bg-slate-50
">


<h4 className="font-bold">

AI Confidence Notes

</h4>


<p className="text-slate-600 mt-2">

{

displayValue(
draft.confidence_notes
)

}


</p>



</div>



{

editingSOAP &&

<div className="flex gap-3">


<Button

disabled={loading}

onClick={handleSaveDraft}

>

<Save size={18}/>

{

loading

?

"Saving..."

:

"Save SOAP Changes"

}


</Button>





<Button

onClick={()=>setEditingSOAP(false)}

>

Cancel

</Button>



</div>


}





<div className="flex gap-3">


<Button

onClick={handleSaveDraft}

>

<Save size={18}/>

Save Draft

</Button>







<Button

disabled={loading}

onClick={handleApprove}

>


<CheckCircle size={18}/>

Approve & Save


</Button>




</div>






</div>


}



</Card>






</div>

);


}