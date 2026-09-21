import {
  Search,
  PawPrint,
  CalendarDays,
  User,
  MoreHorizontal,
  Plus,
  HeartPulse,
  FileText,
  Stethoscope,
  Pencil,
  Trash2
} from "lucide-react";


import {
useState
} from "react";


import {
useNavigate
} from "react-router-dom";


import {
useAppState
} from "../lib/AppState";



export function PatientsPage(){


const navigate = useNavigate();




const {
patients,
clients,
consultations,
deletePatient

}=useAppState();





const [menuOpen,setMenuOpen] =
useState<string|null>(null);



const [search,setSearch] =
useState("");




async function handleDeletePatient(
patientId:string
){

const confirmed =
window.confirm(
"Are you sure you want to delete this patient record?"
);


if(!confirmed){

return;

}


try{


await deletePatient(patientId);


setMenuOpen(null);


}
catch(error){

console.error(
"DELETE PATIENT ERROR",
error
);


alert(
"Unable to delete patient."
);


}

}









const patientList = patients
.filter(patient=>!(patient as any).isDeleted)
.map(patient=>{


const owner =
clients.find(
client=>client.id===patient.clientId
);




const patientConsultations =
consultations.filter(

consultation=>

consultation.patientId===patient.id

);





const latestConsultation =
patientConsultations.sort(

(a,b)=>

new Date(
b.consultationDate|| 0
).getTime()

-

new Date(
a.consultationDate || 0
).getTime()

)[0];





return {


...patient,



owner:

owner

?

`${owner.firstName} ${owner.lastName}`

:

"Unknown Owner",





lastVisit:

latestConsultation?.consultationDate

?

new Date(
latestConsultation.consultationDate

)

.toLocaleDateString()

:

"Not available",






status:

"Active"


};


});









const filteredPatients =

patientList.filter(patient=>{


const term =
search.toLowerCase();




return (

patient.name
?.toLowerCase()
.includes(term)


||

patient.breed
?.toLowerCase()
.includes(term)



||

patient.owner
?.toLowerCase()
.includes(term)

);


});









return (

<div className="space-y-8">





<div className="
flex
flex-col
gap-4
md:flex-row
md:items-center
md:justify-between
">



<div>


<h1 className="text-3xl font-bold text-slate-900">

Patients

</h1>



<p className="mt-2 text-slate-500">

Manage animal records, medical history and consultations.

</p>


</div>






<button

onClick={()=>navigate("/dashboard/patients/new")}

className="
flex
items-center
gap-2
rounded-xl
bg-teal-600
px-5
py-3
font-semibold
text-white
hover:bg-teal-700
"

>

<Plus size={18}/>

Add Patient

</button>




</div>









<div className="
flex
items-center
gap-3
rounded-xl
border
border-slate-200
bg-white
px-4
py-3
">


<Search

size={20}

className="text-slate-400"

/>




<input


value={search}


onChange={

(e)=>setSearch(e.target.value)

}


placeholder="Search patient, breed or owner..."


className="
w-full
outline-none
text-sm
"


/>



</div>







{
filteredPatients.length===0


?

<div className="
rounded-2xl
border
border-dashed
border-slate-300
bg-white
p-10
text-center
text-slate-500
">

No patients found.

</div>



:

<div className="
grid
gap-6
md:grid-cols-2
xl:grid-cols-3
">


{
filteredPatients.map((patient)=>(



<div

key={patient.id}

className="
relative
rounded-2xl
border
border-slate-200
bg-white
p-6
shadow-sm
hover:shadow-md
transition
"


>

  <div className="
flex
items-start
justify-between
">


<div className="
grid
h-14
w-14
place-items-center
rounded-xl
bg-teal-50
text-teal-600
">

<PawPrint size={28}/>

</div>





<div className="relative">


<button

onClick={()=>setMenuOpen(

menuOpen===patient.id

?

null

:

patient.id

)}

className="
rounded-lg
p-2
hover:bg-slate-100
"

>

<MoreHorizontal size={20}/>

</button>





{

menuOpen===patient.id && (

<div

className="
absolute
right-0
top-10
z-30
w-48
rounded-xl
border
bg-white
p-2
shadow-lg
"

>





<button

onClick={()=>navigate(
`/dashboard/patients/${patient.id}`


)}

className="
flex
w-full
items-center
gap-2
rounded-lg
px-3
py-2
text-left
text-sm
hover:bg-slate-100
"

>

<FileText size={16}/>

View Record

</button>







<button

onClick={()=>navigate(

`/dashboard/patients/${patient.id}/history`

)}

className="
flex
w-full
items-center
gap-2
rounded-lg
px-3
py-2
text-left
text-sm
hover:bg-slate-100
"

>

<CalendarDays size={16}/>

Medical History

</button>







<button

onClick={()=>navigate(

`/dashboard/consultations/new?patient=${patient.id}`

)}

className="
flex
w-full
items-center
gap-2
rounded-lg
px-3
py-2
text-left
text-sm
hover:bg-slate-100
"

>

<Stethoscope size={16}/>

New Consultation

</button>








<button

onClick={()=>navigate(

`/dashboard/patients/${patient.id}/edit`

)}

className="
flex
w-full
items-center
gap-2
rounded-lg
px-3
py-2
text-left
text-sm
hover:bg-slate-100
"

>

<Pencil size={16}/>

Edit Patient

</button>






<button

onClick={()=>handleDeletePatient(patient.id)}

className="
flex
w-full
items-center
gap-2
rounded-lg
px-3
py-2
text-left
text-sm
text-red-600
hover:bg-red-50
"

>

<Trash2 size={16}/>

Delete Patient

</button>






</div>

)

}


</div>


</div>








<h3 className="
mt-5
text-xl
font-bold
text-slate-900
">

{patient.name}

</h3>






<p className="
mt-1
text-sm
text-slate-500
">

{patient.breed || "Breed not recorded"}

</p>







<div className="
mt-5
space-y-3
text-sm
">





<div className="
flex
items-center
gap-2
text-slate-600
">


<User size={16}/>


{patient.owner}


</div>






<div className="
flex
items-center
gap-2
text-slate-600
">


<HeartPulse size={16}/>


{patient.species}


</div>








<div className="
flex
items-center
gap-2
text-slate-600
">


<CalendarDays size={16}/>


Last visit:

{" "}

{patient.lastVisit}


</div>






</div>








<div className="
mt-6
flex
items-center
justify-between
border-t
pt-4
">





<span className="
rounded-full
bg-green-50
px-3
py-1
text-xs
font-medium
text-green-700
">

{patient.status}

</span>







<button


onClick={()=>navigate(

`/dashboard/patients/${patient.id}`

)}


className="
font-semibold
text-teal-600
hover:text-teal-700
"


>


View Record


</button>






</div>






</div>


))

}



</div>


}



</div>


);

}