import {
  Search,
  PawPrint,
  CalendarDays,
  User,
  MoreHorizontal,
  Plus,
  HeartPulse
} from "lucide-react";



export function PatientsPage(){



const patients = [

{
name:"Max",
species:"Dog",
breed:"Golden Retriever",
owner:"Sarah Williams",
age:"5 years",
lastVisit:"Today",
status:"Healthy"
},


{
name:"Bella",
species:"Cat",
breed:"British Shorthair",
owner:"Michael Brown",
age:"3 years",
lastVisit:"12 Sep 2026",
status:"Vaccination Due"
},


{
name:"Charlie",
species:"Dog",
breed:"Labrador",
owner:"Emma Johnson",
age:"7 years",
lastVisit:"05 Sep 2026",
status:"Under Treatment"
},


{
name:"Luna",
species:"Cat",
breed:"Persian",
owner:"David Wilson",
age:"2 years",
lastVisit:"01 Sep 2026",
status:"Healthy"
}


];






return (

<div className="space-y-8">





{/* HEADER */}


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








{/* SEARCH */}


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

placeholder="Search patient, breed or owner..."

className="
w-full
outline-none
text-sm
"

/>


</div>









{/* PATIENT GRID */}



<div className="
grid
gap-6
md:grid-cols-2
xl:grid-cols-3
">





{
patients.map((patient)=>(



<div

key={patient.name}

className="
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



<button

className="
rounded-lg
p-2
hover:bg-slate-100
"

>

<MoreHorizontal size={20}/>

</button>


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

{patient.breed}

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

Last visit: {patient.lastVisit}

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


<span className={`
rounded-full
px-3
py-1
text-xs
font-medium

${

patient.status==="Healthy"

?

"bg-green-50 text-green-700"

:

patient.status==="Vaccination Due"

?

"bg-yellow-50 text-yellow-700"

:

"bg-red-50 text-red-700"

}

`}>

{patient.status}

</span>



<button

className="
text-sm
font-semibold
text-teal-600
"

>

View Record

</button>



</div>




</div>



))

}



</div>






</div>


);


}