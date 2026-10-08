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


import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";


import { useAppState } from "../lib/AppState";

import { fullName } from "../lib/format";





export function NewConsultationPage(){



const {

patients,

clients,

createConsultation,

checkSubscriptionLimit

}=useAppState();





const navigate = useNavigate();





const [search,setSearch] = useState("");

const [selected,setSelected] = useState<string>("");

const [loading,setLoading] = useState(false);









const filtered = useMemo(()=>{


return patients.filter(patient=>{


const owner =

clients.find(

c=>c.id===patient.clientId

);





return (

`${patient.name} ${owner?.firstName || ""} ${owner?.lastName || ""}`

.toLowerCase()

.includes(

search.toLowerCase()

)

);


});


},[
patients,
clients,
search
]);









async function start(patientId:string){



if(!patientId || loading)

return;





try{


setSelected(patientId);

setLoading(true);





const consultationId = await createConsultation(patientId);

console.log("CREATED CONSULTATION ID:", consultationId);

if (!consultationId) {
  console.error("No consultation id returned from createConsultation");
  return;
}

navigate(`/dashboard/consultations/${consultationId}`);





}

catch(error){


console.error(

"START CONSULTATION ERROR",

error

);


}

finally{


setLoading(false);


}



}









return (

<div className="mx-auto max-w-3xl space-y-6">





<div>


<h1 className="text-3xl font-bold text-slate-900">

Start Consultation

</h1>


<p className="mt-2 text-slate-500">

Find a patient below and click Start Consultation to begin a new clinical record

</p>


</div>









<Card className="p-5">





<div className="
flex
items-center
gap-3
rounded-xl
border
px-3
">


<Search 
size={18}
/>



<input


className="
w-full
p-3
outline-none
"


placeholder="Search patient or owner"


value={search}


onChange={

e=>setSearch(e.target.value)

}



/>



</div>









<div className="mt-6 space-y-4">



{

filtered.map(patient=>{



const owner =

clients.find(

c=>c.id===patient.clientId

);



const isStarting =

loading && selected===patient.id;





return (



<div


key={patient.id}


className={`

flex
w-full
items-center
gap-4
rounded-2xl
border
border-slate-200
bg-white
px-5
py-5
text-left
shadow-sm
transition

${

isStarting

?

"bg-teal-50 border-teal-500"

:

"hover:border-slate-300 hover:shadow-md"

}

`}


>




<div className="
grid
h-12
w-12
shrink-0
place-items-center
rounded-full
bg-teal-50
text-teal-700
">


<UserRound size={18}/>


</div>








<div className="min-w-0 flex-1">


<p className="truncate text-base font-bold text-slate-900">

{patient.name}

</p>



<p className="mt-1 truncate text-sm text-slate-500">


{patient.breed}


{" · "}


{

owner

?

fullName(owner)

:

""

}



</p>



</div>









<button


type="button"


disabled={loading}


onClick={()=>start(patient.id)}


className="
shrink-0
rounded-lg
bg-[#2d6f69]
px-5
py-3
text-sm
font-semibold
text-white
shadow-sm
transition
hover:bg-[#245b56]
focus:outline-none
focus:ring-2
focus:ring-[#2d6f69]/40
focus:ring-offset-2
disabled:cursor-not-allowed
disabled:opacity-60
"


>


{

isStarting

?

"Starting..."

:

"Start Consultation"

}


</button>





</div>



);



})


}





{

filtered.length===0 && (

<div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">

No patients found.

</div>

)

}



</div>





</Card>









</div>


);


}