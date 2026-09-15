import {
  useMemo,
  useState
} from "react";


import {
  useNavigate
} from "react-router-dom";


import {
  Search,
  UserRound
} from "lucide-react";


import {
  Card
} from "../components/ui/Card";


import {
  Button
} from "../components/ui/Button";


import {
  useAppState
} from "../lib/AppState";


import {
  ageYears,
  fullName
} from "../lib/format";







export function NewConsultationPage(){


const {
  patients,
  clients,
  createConsultation
}=useAppState();




const [q,setQ]=
useState("");



const [selected,setSelected]=
useState("");



const nav =
useNavigate();







const list =
useMemo(()=>{


return patients.filter(patient=>{


const owner =
clients.find(
client=>client.id===patient.clientId
);



return (

`${patient.name} ${owner?.firstName || ""} ${owner?.lastName || ""}`

.toLowerCase()

.includes(
q.toLowerCase()
)

);


});


},[
patients,
clients,
q
]);









const foundPatient =
patients.find(
patient=>patient.id===selected
);





const selectedPatient =
foundPatient;





const selectedClient =
selectedPatient

?

clients.find(
client=>client.id===selectedPatient.clientId
)

:

undefined;





function startConsultation(){


if(
!selectedPatient ||
!selectedClient
){

return;

}



const consultationId =
createConsultation(
selectedPatient.id
);



nav(
`/consultations/${consultationId}`
);


}
return (

<div className="mx-auto max-w-3xl space-y-5">


<div>

<h2 className="text-2xl font-bold">

Start a consultation

</h2>


<p className="text-slate-500">

Select the patient first. The clinical record remains under veterinary control.

</p>


</div>








<Card className="p-5">


<label className="relative block">


<Search

size={18}

className="absolute left-3 top-3 text-slate-400"

/>



<input

autoFocus

value={q}

onChange={
e=>setQ(
e.target.value
)
}

placeholder="Search patient or client..."

className="

w-full

rounded-lg

border

border-slate-300

py-2.5

pl-10

pr-3

"

/>



</label>







<div className="mt-4 divide-y rounded-lg border">


{

list.map(patient=>{


const owner =
clients.find(
client=>client.id===patient.clientId
);



return (


<button


key={patient.id}



onClick={()=>

setSelected(
patient.id
)

}



className={`

flex

w-full

items-center

gap-3

p-4

text-left

hover:bg-slate-50

${selected===patient.id
?
"bg-brand-50"
:
""

}

`}



>


<span

className="

grid

h-10

w-10

place-items-center

rounded-full

bg-slate-100

"

>

<UserRound size={18}/>

</span>






<span>


<strong>

{patient.name}

</strong>






<span className="block text-sm text-slate-500">


{patient.breed}



{

owner &&

<>

{" · "}

{fullName(owner)}

</>


}



</span>



</span>



</button>


);


})


}


</div>


</Card>









{

selectedPatient && selectedClient &&


<Card className="p-5">


<div className="flex flex-wrap items-start justify-between gap-4">


<div>


<h3 className="text-xl font-bold">

{selectedPatient.name}

</h3>





<p className="text-sm text-slate-600">


{selectedPatient.breed}

{" · "}

{selectedPatient.sex}

{" · "}

{

selectedPatient.neutered

?

"Neutered"

:

"Not neutered"

}



{" · "}

{ageYears(
selectedPatient.dateOfBirth
)}

years



</p>






<p className="mt-1 font-semibold">

{selectedPatient.weightKg} kg

</p>






<p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">

Owner

</p>





<p>

{fullName(selectedClient)}

</p>




</div>







<Button

onClick={startConsultation}

>

Start Consultation

</Button>






</div>


</Card>


}



</div>


);


}