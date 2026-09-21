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

createConsultation

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









async function start(){



if(!selected)

return;





try{


setLoading(true);





const consultationId =

await createConsultation(

selected

);






navigate(

`/dashboard/consultations/${consultationId}`

);





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

Select a patient to begin a new clinical consultation

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









<div className="mt-5 space-y-3">



{

filtered.map(patient=>{



const owner =

clients.find(

c=>c.id===patient.clientId

);





return (



<button


key={patient.id}


type="button"


onClick={()=>setSelected(patient.id)}


className={`

flex
w-full
items-center
gap-3
rounded-xl
border
p-4
text-left
transition

${

selected===patient.id

?

"bg-teal-50 border-teal-500"

:

"hover:bg-slate-50"

}

`}


>




<div className="
grid
h-10
w-10
place-items-center
rounded-full
bg-slate-100
">


<UserRound size={18}/>


</div>








<div>


<p className="font-bold">

{patient.name}

</p>



<p className="text-sm text-slate-500">


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





</button>



);



})


}



</div>





</Card>









<Button


disabled={

!selected || loading

}


onClick={start}


>



{

loading

?

"Starting..."

:

"Start Consultation"

}



</Button>









</div>


);


}