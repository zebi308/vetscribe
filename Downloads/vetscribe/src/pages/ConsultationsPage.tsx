import {
  Search,
  Mic,
  FileText,
  Clock,
  CheckCircle2,
  MoreHorizontal,
  Plus
} from "lucide-react";



export function ConsultationsPage(){



const consultations=[

{
patient:"Max",
species:"Golden Retriever",
owner:"Sarah Williams",
time:"Today • 10:30 AM",
status:"AI Note Ready",
duration:"08:42",
},

{
patient:"Bella",
species:"British Shorthair Cat",
owner:"Michael Brown",
time:"Today • 11:15 AM",
status:"Recording",
duration:"12:05",
},

{
patient:"Charlie",
species:"Labrador",
owner:"Emma Johnson",
time:"Yesterday • 03:20 PM",
status:"Approved",
duration:"06:30",
},

{
patient:"Luna",
species:"Persian Cat",
owner:"David Wilson",
time:"Yesterday • 04:10 PM",
status:"Pending Review",
duration:"09:15",
}

];





return (

<div className="space-y-8">



{/* HEADER */}

<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">


<div>

<h1 className="text-3xl font-bold text-slate-900">

Consultations

</h1>


<p className="mt-2 text-slate-500">

Manage recordings, AI notes and clinical reviews.

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

New Consultation

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


<Search size={20} className="text-slate-400"/>


<input

placeholder="Search patient or owner..."

className="
w-full
outline-none
text-sm
"

/>


</div>






{/* FILTERS */}

<div className="flex gap-3 flex-wrap">


{
[
"All",
"Recording",
"AI Note Ready",
"Pending Review",
"Approved"

].map(filter=>(


<button

key={filter}

className="
rounded-full
border
border-slate-200
bg-white
px-4
py-2
text-sm
font-medium
text-slate-600
hover:border-teal-500
hover:text-teal-600
"

>

{filter}

</button>


))

}



</div>








{/* CONSULTATION LIST */}


<div className="space-y-4">



{
consultations.map((item)=>(


<div

key={item.patient}

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
flex-col
gap-5
md:flex-row
md:items-center
md:justify-between
">


{/* LEFT */}

<div className="flex gap-4">


<div className="
grid
h-12
w-12
place-items-center
rounded-xl
bg-teal-50
text-teal-600
">

<Mic size={22}/>

</div>



<div>


<h3 className="text-lg font-semibold text-slate-900">

{item.patient}

</h3>


<p className="text-sm text-slate-500">

{item.species} • {item.owner}

</p>


<p className="mt-2 flex items-center gap-2 text-sm text-slate-400">

<Clock size={14}/>

{item.time}

</p>


</div>


</div>





{/* RIGHT */}

<div className="flex items-center gap-5">


<div className="text-right">


<p className="text-sm text-slate-500">

Duration

</p>


<p className="font-semibold">

{item.duration}

</p>


</div>





<span

className={`

inline-flex
items-center
gap-2
rounded-full
px-4
py-2
text-sm
font-medium

${

item.status==="Approved"

?

"bg-green-50 text-green-700"

:

item.status==="Recording"

?

"bg-red-50 text-red-700"

:

"bg-teal-50 text-teal-700"

}

`}

>


{
item.status==="Approved"

?

<CheckCircle2 size={15}/>

:

<FileText size={15}/>

}


{item.status}


</span>





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



</div>



</div>



))

}



</div>



</div>


);


}