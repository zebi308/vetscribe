import {
  useState
} from "react";


import {
  useAppState
} from "../lib/AppState";


import {
  useNavigate
} from "react-router-dom";


import {
  Search,
  Mic,
  FileText,
  CheckCircle2,
  MoreHorizontal,
  Plus
} from "lucide-react";





export function ConsultationsPage(){



const navigate = useNavigate();



const {
  consultations,
  patients,
  clients
}=useAppState();





const [search,setSearch] = useState("");



const [activeFilter,setActiveFilter] = useState("All");



const [menuOpen,setMenuOpen] = useState<string|null>(null);









const consultationList = consultations.map(item=>{



const patient =
patients.find(
p=>p.id===item.patientId
);



const client =
clients.find(
c=>c.id===item.clientId
);





return {


...item,


patientName:
patient?.name || "Unknown Patient",


species:
patient?.species || "Unknown",



owner:
client
?
`${client.firstName} ${client.lastName}`
:
"Unknown Owner",



time:

item.consultationDate

?

new Date(
item.consultationDate
).toLocaleString()

:

"Unknown date"



};



});









const filteredConsultations = consultationList.filter(item=>{


const searchMatch =

item.patientName
.toLowerCase()
.includes(
search.toLowerCase()
)

||

item.owner
.toLowerCase()
.includes(
search.toLowerCase()
);





const filterMatch =

activeFilter==="All"

?

true


:

activeFilter==="Draft"

?

item.status==="draft"


:

activeFilter==="Approved"

?

item.status==="approved"


:

true;





return searchMatch && filterMatch;


});


const filters = [

"All",

"Draft",

"Approved"

];
return (

<div className="space-y-8">


{/* =========================
    HEADER
========================= */}


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

Consultations

</h1>


<p className="mt-2 text-slate-500">

Manage recordings, AI notes and clinical reviews.

</p>

</div>



<button

type="button"

onClick={()=>navigate("/dashboard/consultations/new")}

className="
flex
cursor-pointer
items-center
gap-2
rounded-xl
bg-teal-600
px-5
py-3
font-semibold
text-white
transition
hover:bg-teal-700
"

>

<Plus size={18}/>

New Consultation

</button>


</div>





{/* =========================
    SEARCH
========================= */}


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

className="shrink-0 text-slate-400"

/>



<input

type="text"

value={search}

onChange={(e)=>setSearch(e.target.value)}

placeholder="Search patient or owner..."

className="
w-full
bg-transparent
text-sm
text-slate-900
outline-none
placeholder:text-slate-400
"

/>


{

search.length > 0 && (

<button

type="button"

onClick={()=>setSearch("")}

className="
text-xs
font-medium
text-slate-400
hover:text-slate-700
"

>

Clear

</button>

)

}


</div>





{/* =========================
    FILTER BUTTONS
========================= */}


<div className="flex flex-wrap gap-3">


{

filters.map(filter=>(


<button

key={filter}

type="button"

onClick={()=>setActiveFilter(filter)}

className={`

cursor-pointer
rounded-full
border
px-4
py-2
text-sm
font-medium
transition

${

activeFilter===filter

?

"border-teal-600 bg-teal-600 text-white shadow-sm"

:

"border-slate-200 bg-white text-slate-600 hover:border-teal-500 hover:text-teal-600"

}

`}

>

{filter}

</button>


))

}


</div>





{/* =========================
    RESULTS INFORMATION
========================= */}


<div className="
flex
items-center
justify-between
text-sm
text-slate-500
">


<p>

Showing{" "}

<span className="font-semibold text-slate-700">

{filteredConsultations.length}

</span>

{" "}

{

filteredConsultations.length===1

?

"consultation"

:

"consultations"

}

</p>


{

activeFilter!=="All" && (

<button

type="button"

onClick={()=>setActiveFilter("All")}

className="
font-medium
text-teal-600
hover:text-teal-700
"

>

Clear filter

</button>

)

}


</div>

{/* =========================
    CONSULTATION LIST
========================= */}


<div className="space-y-4">


{

filteredConsultations.length===0

?

(

<div

className="
rounded-2xl
border
border-dashed
border-slate-300
bg-white
p-10
text-center
text-slate-500
"

>

No consultations found.

Try changing your search or filter.

</div>

)

:


filteredConsultations.map(item=>(


<div

key={item.id}

className="
relative
cursor-pointer
rounded-2xl
border
border-slate-200
bg-white
p-6
shadow-sm
transition
hover:shadow-md
"

onClick={()=>navigate(`/dashboard/consultations/${item.id}`)}

>





<div className="
flex
flex-col
gap-5
md:flex-row
md:items-center
md:justify-between
">





{/* LEFT SIDE */}

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


<h3 className="
text-lg
font-semibold
text-slate-900
">

{item.patientName}

</h3>




<p className="
text-sm
text-slate-500
">

{item.species}

{" • "}

{item.owner}

</p>




<p className="
mt-2
text-sm
text-slate-400
">

{item.time}

</p>



</div>


</div>







{/* RIGHT SIDE */}

<div className="
flex
items-center
gap-4
"

onClick={(e)=>e.stopPropagation()}

>





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

item.status==="approved"

?

"bg-green-50 text-green-700"


:

"bg-red-50 text-red-700"

}

`}

>


{

item.status==="approved"

?

<CheckCircle2 size={15}/>

:

<FileText size={15}/>

}


{item.status}


</span>







{/* THREE DOT MENU */}



<div className="relative">



<button

type="button"

onClick={()=>{


setMenuOpen(

menuOpen===item.id

?

null

:

item.id

);


}}

className="
cursor-pointer
rounded-lg
p-2
hover:bg-slate-100
"

>

<MoreHorizontal size={20}/>

</button>





{


menuOpen===item.id && (


<div

className="
absolute
right-0
z-20
mt-2
w-48
rounded-xl
border
border-slate-200
bg-white
p-2
shadow-lg
"

>



<button

type="button"

onClick={()=>navigate(`/dashboard/consultations/${item.id}`)}

className="
block
w-full
rounded-lg
px-3
py-2
text-left
text-sm
text-slate-700
hover:bg-slate-50
"

>

Open Consultation

</button>





<button

type="button"

onClick={()=>navigate(`/dashboard/consultations/${item.id}`)}

className="
block
w-full
rounded-lg
px-3
py-2
text-left
text-sm
text-slate-700
hover:bg-slate-50
"

>

Edit Draft

</button>






{

item.status==="draft" && (


<button

type="button"

onClick={()=>navigate(`/dashboard/consultations/${item.id}`)}

className="
block
w-full
rounded-lg
px-3
py-2
text-left
text-sm
text-teal-600
hover:bg-teal-50
"

>

Review & Approve

</button>


)

}



</div>


)


}



</div>





</div>




</div>




</div>



))

}



</div>





</div>

);

}