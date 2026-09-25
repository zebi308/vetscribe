import {
  ArrowLeft,
  Mail,
  Phone,
  PawPrint,
  CalendarDays,
  Stethoscope,
  FileText,
  Trash2,
  Edit3
} from "lucide-react";


import {
  useNavigate,
  useParams
} from "react-router-dom";


import {
  useAppState
} from "../lib/AppState";


import {
  Card
} from "../components/ui/Card";


import {
  Button
} from "../components/ui/Button";





export function ClientProfilePage(){



const navigate = useNavigate();


const {id}=useParams();





const {

clients,

patients,

consultations,

deleteClient

}=useAppState();








const client =

clients.find(

(item)=>

item.id===id

);







if(!client){


return (

<div className="p-8 text-slate-500">

Client not found.

</div>

);


}









async function handleDeleteClient(){

const confirmed = window.confirm(
"Are you sure you want to delete this client?"
);

if(!confirmed) return;


try{

if(!client){
  return;
}

await deleteClient(client.id);

navigate("/dashboard/clients");

}

catch(error){

console.error(
"DELETE CLIENT ERROR",
error
);

alert(
"Unable to delete client"
);

}

}


const clientPets =

patients.filter(

(patient)=>

patient.clientId===client.id

);









const clientConsultations =

consultations

.filter(

(consultation)=>

consultation.clientId===client.id

)

.sort(

(a,b)=>

new Date(

b.consultationDate

).getTime()

-

new Date(

a.consultationDate

).getTime()

);









return (

<div className="space-y-8">








<div className="
flex
items-center
gap-4
">


<button

onClick={()=>navigate(-1)}

className="
rounded-xl
p-2
hover:bg-slate-100
"

>

<ArrowLeft size={22}/>

</button>






<div>

<h1 className="
text-3xl
font-bold
">

{

client.firstName

}

{" "}

{

client.lastName

}

</h1>



<p className="text-slate-500">

Client Profile

</p>


</div>

<button

onClick={handleDeleteClient}

className="
ml-auto
flex
items-center
gap-2
rounded-xl
bg-red-600
px-4
py-2
font-semibold
text-white
hover:bg-red-700
"

>

<Trash2 size={17}/>

Delete Client

</button>



</div>









<Card className="p-6">


<h2 className="
text-xl
font-bold
mb-5
">

Contact Information

</h2>





<div className="space-y-3 text-slate-600">



<div className="
flex
items-center
gap-3
">


<Mail size={18}/>


{

client.email || "No email"

}


</div>





<div className="
flex
items-center
gap-3
">


<Phone size={18}/>


{

client.phone || "No phone"

}


</div>



</div>



</Card>









<Card className="p-6">


<div className="
flex
items-center
justify-between
mb-5
">


<h2 className="
text-xl
font-bold
">

Registered Pets

</h2>




<Button

onClick={()=>navigate(

`/dashboard/patients/new?client=${client.id}`

)}

>

Add Pet

</Button>



</div>








{

clientPets.length===0

?

<p className="text-slate-500">

No pets registered.

</p>


:


<div className="
grid
gap-4
md:grid-cols-2
">


{

clientPets.map((pet)=>(


<div

key={pet.id}

className="
rounded-xl
border
p-4
"

>


<div className="
flex
items-center
gap-3
">


<PawPrint

className="text-teal-600"

/>



<div>


<h3 className="font-bold">

{pet.name}

</h3>



<p className="text-sm text-slate-500">

{pet.species}

{" • "}

{pet.breed}

</p>


</div>



</div>





<button

onClick={()=>navigate(

`/dashboard/patients/${pet.id}`

)}

className="
mt-3
text-sm
font-semibold
text-teal-600
"

>

View Patient Record

</button>



</div>



))


}



</div>


}



</Card>









<Card className="p-6">


<div className="
flex
items-center
justify-between
mb-5
">


<h2 className="
text-xl
font-bold
">

Consultation History

</h2>





<Button

onClick={()=>navigate(

`/dashboard/consultations/new?client=${client.id}`

)}

>

<Stethoscope size={18}/>

New Consultation

</Button>



</div>









{

clientConsultations.length===0

?

<p className="text-slate-500">

No consultations yet.

</p>



:


<div className="space-y-4">


{

clientConsultations.map((consultation)=>(


<div

key={consultation.id}

className="
rounded-xl
border
p-4
flex
items-center
justify-between
"

>


<div>


<h3 className="font-bold">

Consultation

</h3>



<p className="text-sm text-slate-500">

<CalendarDays

size={14}

className="inline"

/>

{" "}

{

new Date(

consultation.consultationDate

)

.toLocaleDateString()

}


</p>


</div>





<Button

onClick={()=>navigate(

`/dashboard/consultations/${consultation.id}`

)}

>

<FileText size={16}/>

Open Record

</Button>





</div>



))


}



</div>


}



</Card>









</div>


);


}