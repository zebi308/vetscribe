import {
  useEffect,
  useRef,
  useState
} from "react";

import {
  useParams
} from "react-router-dom";


import {
  CheckCircle2,
  Mic,
  Pause,
  Play,
  Save,
  Square,
  WandSparkles
} from "lucide-react";


import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";


import { useAppState } from "../lib/AppState";


import {
  ageYears,
  fullName,
  formatDate
} from "../lib/format";


import {
  aiService
} from "../lib/ai";


import {
  demoTranscript
} from "../lib/demoData";


import {
  ClinicalNoteEditor
} from "../components/clinical/ClinicalNoteEditor";


import {
  MissingInfoPanel
} from "../components/clinical/MissingInfoPanel";


import type {
  ClinicalDraft,
  Consultation
} from "../types/models";





export function ConsultationDetailPage(){


const {
  id
}=useParams();



const s =
useAppState();





const [draft,setDraft] =
useState<ClinicalDraft | undefined>();


const [error,setError] =
useState("");



const [processing,setProcessing] =
useState(false);



const [recording,setRecording] =
useState(false);



const [paused,setPaused] =
useState(false);



const [seconds,setSeconds] =
useState(0);



const [amendmentReason,setAmendmentReason] =
useState("");



const [approvalOpen,setApprovalOpen] =
useState(false);





const recorder =
useRef<MediaRecorder | null>(null);



const chunks =
useRef<Blob[]>([]);



const timer =
useRef<number | null>(null);









const foundConsultation =
s.consultations.find(
item=>item.id===id
);


if(!foundConsultation){

return (

<Card className="p-6">

Consultation not found.

</Card>

);

}


const consultation: Consultation = foundConsultation;







const foundPatient =
s.patients.find(
item=>item.id===consultation.patientId
);


if(!foundPatient){

return (

<Card className="p-6">

Patient not found.

</Card>

);

}


const patient = foundPatient;




const client =
s.clients.find(
item=>item.id===consultation.clientId
);





const vet =
s.profiles.find(
item=>item.id===consultation.treatingVetId
);






useEffect(()=>{


setDraft(
consultation.clinicalNote
);


},[
consultation.clinicalNote
]);






useEffect(()=>{


return ()=>{


if(timer.current){

window.clearInterval(
timer.current
);

}


};


},[]);









if(!patient || !client || !s.practice){

return (

<Card className="p-6">

Loading consultation data...

</Card>

);

}








const minutes =
String(
Math.floor(seconds/60)
)
.padStart(2,"0");



const secs =
String(
seconds%60
)
.padStart(2,"0");








async function startRecording(){


try{


setError("");



const stream =
await navigator.mediaDevices.getUserMedia({

audio:true

});





const media =
new MediaRecorder(stream);



chunks.current=[];




media.ondataavailable =
event=>{


if(event.data.size){

chunks.current.push(
event.data
);

}


};





media.onstop =
async ()=>{


stream
.getTracks()
.forEach(
track=>track.stop()
);





const audio =
new Blob(
chunks.current,
{
type:"audio/webm"
}
);





setProcessing(true);





try{


const transcript =
await aiService.transcribe(
audio
);



await s.updateConsultation(

consultation.id,

{

transcript,

durationSeconds:seconds,

captureType:"audio"

}

);



}

catch(e){


setError(
"Transcription failed"
);


}


finally{


setProcessing(false);


}


};






media.start();



recorder.current =
media;




setRecording(true);



setSeconds(0);




timer.current =
window.setInterval(()=>{


setSeconds(
old=>old+1
);


},1000);





}

catch{


setError(
"Microphone permission denied"
);


}



}







async function stopRecording(){


if(timer.current){

window.clearInterval(
timer.current
);

}



recorder.current?.stop();



setRecording(false);

setPaused(false);



}
function togglePause(){


const current =
recorder.current;



if(!current)

return;



if(current.state==="recording"){


current.pause();

setPaused(true);


}

else if(current.state==="paused"){


current.resume();

setPaused(false);


}



}









async function useDemoTranscript(){


await s.updateConsultation(

consultation.id,

{

transcript:demoTranscript,

captureType:"typed"

}

);


}









async function generateNote(){


if(!consultation.transcript){

setError(
"No transcript available"
);

return;

}



try{


setProcessing(true);



const result =
await aiService.generateClinicalNote({

transcript:
consultation.transcript,

patient

});





setDraft(result);





await s.saveDraft(

consultation.id,

result

);





}

catch(e){


console.error(e);


setError(
"Unable to generate clinical note"
);



}

finally{


setProcessing(false);


}



}









async function saveClinicalDraft(){



if(!draft)

return;



await s.saveDraft(

consultation.id,

draft

);



}









async function approve(){



if(!draft){

setError(
"No clinical note to approve"
);

return;

}





if(!patient || !client || !s.practice || !s.currentUser){

setError(
"Missing required data"
);


return;

}





try{


setProcessing(true);





await s.approveConsultation(

consultation.id,

draft,

consultation.version > 0

?

amendmentReason

:

undefined

);







const generated =

await aiService.generateOwnerSummary({

clinicalNote:draft,

patient,

consultationId:consultation.id,

practiceId:s.practice.id,

clientId:client.id,

generatedBy:s.currentUser.id

});








await s.addOwnerSummary(

generated

);





setApprovalOpen(false);



}

catch(e){


console.error(e);



setError(

e instanceof Error

?

e.message

:

"Approval failed"

);



}

finally{


setProcessing(false);


}


}
return (

<div className="space-y-5">


<Card className="p-6">


<div className="flex flex-wrap justify-between gap-4">


<div>


<h1 className="text-2xl font-bold">

{patient.name}

</h1>



<p className="text-sm text-slate-500">

{patient.breed}

{" · "}

{patient.sex}

{" · "}

{ageYears(patient.dateOfBirth)}

years

</p>



<p className="mt-2 text-sm">

Owner:

{" "}

<strong>

{fullName(client)}

</strong>

</p>



{
vet &&

<p className="text-sm text-slate-500">

Vet:

{" "}

{fullName(vet)}

</p>

}


</div>





<div className="text-right">


<p className="text-sm text-slate-500">

Date

</p>


<p className="font-semibold">

{formatDate(
consultation.consultationDate
)}

</p>


</div>



</div>


</Card>









{
error &&

<Card className="border-red-200 bg-red-50 p-4 text-red-700">

{error}

</Card>

}








{
!consultation.transcript &&

<Card className="p-6">


<h2 className="text-lg font-bold">

Record Consultation

</h2>




<div className="mt-5 text-center">


<p className="text-4xl font-bold">

{minutes}:{secs}

</p>



<div className="mt-5 flex justify-center gap-3">


{

!recording

?

<Button
onClick={startRecording}
>

<Mic size={18}/>

Start Recording

</Button>


:

<>


<Button

variant="secondary"

onClick={togglePause}

>


{

paused

?

<Play size={18}/>

:

<Pause size={18}/>

}



</Button>




<Button

variant="danger"

onClick={stopRecording}

>


<Square size={18}/>

Stop


</Button>



</>

}



</div>






<div className="mt-4">


<Button

variant="secondary"

onClick={useDemoTranscript}

>

<WandSparkles size={18}/>

Use Demo Transcript

</Button>


</div>



</div>


</Card>

}









{
processing &&

<Card className="p-5 text-center">

Processing...

</Card>

}









{
consultation.transcript &&

<Card className="p-6">


<div className="flex justify-between">


<h2 className="font-bold">

Transcript

</h2>




{

!draft &&

<Button

onClick={generateNote}

>

Generate Clinical Note

</Button>

}


</div>




<p className="mt-4 whitespace-pre-wrap text-sm text-slate-700">

{consultation.transcript}

</p>


</Card>

}









{
draft &&

<Card className="p-6">


<div className="flex justify-between">


<h2 className="text-xl font-bold">

Clinical Note

</h2>



<Button

variant="secondary"

onClick={saveClinicalDraft}

>

<Save size={17}/>

Save Draft

</Button>


</div>





<div className="mt-5">


<MissingInfoPanel

draft={draft}

onChange={setDraft}

/>



<ClinicalNoteEditor

draft={draft}

onChange={setDraft}

readOnly={
consultation.status==="approved"
}

/>



</div>







{

consultation.status!=="approved"

&&

<div className="mt-6 flex justify-end">


<Button

onClick={()=>setApprovalOpen(true)}

>

<CheckCircle2 size={17}/>

Approve Consultation

</Button>


</div>

}


</Card>

}









{

approvalOpen &&

<Card className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">


<div className="w-full max-w-md rounded-xl bg-white p-6">


<h3 className="text-xl font-bold">

Approve Consultation

</h3>




<p className="mt-3 text-sm text-slate-600">

This will lock the clinical record and generate the owner summary.

</p>





<textarea

value={amendmentReason}

onChange={
e=>setAmendmentReason(
e.target.value
)
}

placeholder="Amendment reason (optional)"

className="
mt-4
w-full
rounded-lg
border
p-3
"

/>





<div className="mt-5 flex justify-end gap-3">


<Button

variant="secondary"

onClick={()=>setApprovalOpen(false)}

>

Cancel

</Button>



<Button

onClick={approve}

>

Approve

</Button>



</div>



</div>


</Card>

}



</div>

);


}