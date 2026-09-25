import {
  Search,
  UserRound,
  Phone,
  Mail,
  PawPrint,
  CalendarDays,
  MoreHorizontal,
  Plus,
  Eye,
  FileText,
  Trash2,
  Edit3
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





export function ClientsPage(){


const navigate = useNavigate();



const {
  clients,
  patients,
  consultations,
  deleteClient
}=useAppState();




const [search,setSearch] =
useState("");



const [menuOpen,setMenuOpen] =
useState<string | null>(null);



async function handleDeleteClient(
clientId:string
){

const confirmed = window.confirm(
"Are you sure you want to delete this client record?"
);


if(!confirmed){

return;

}


try{


await deleteClient(clientId);


setMenuOpen(null);


}
catch(error){

console.error(
"DELETE CLIENT ERROR",
error
);


alert(
"Unable to delete client."
);


}

}







const clientList = clients
.filter((client)=>!(client as any).isDeleted)
.filter((client)=>{


const name =

`${client.firstName} ${client.lastName}`

.toLowerCase();



const email =

(client.email || "")

.toLowerCase();



const phone =

(client.phone || "")

.toLowerCase();



const query =

search.toLowerCase();




return (

name.includes(query)

||

email.includes(query)

||

phone.includes(query)

);


})

.map((client)=>{





const petsCount =

patients.filter(

(patient)=>

patient.clientId === client.id

).length;





const visits =

consultations

.filter(

(item)=>

item.clientId === client.id

)

.sort(

(a,b)=>


new Date(b.consultationDate).getTime()

-

new Date(a.consultationDate).getTime()


);






return {


...client,


id:client.id,


name:

`${client.firstName} ${client.lastName}`,



pets:

petsCount,



lastVisit:

visits.length > 0

?

new Date(

visits[0].consultationDate

)

.toLocaleDateString()

:

"No visits yet",



status:

"Active"



};



});




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

Clients

</h1>


<p className="mt-2 text-slate-500">

Manage pet owners, contact details and consultation history.

</p>


</div>




<button

onClick={()=>navigate("new")}

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

Add Client

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

value={search}

onChange={(e)=>

setSearch(e.target.value)

}

placeholder="Search client name, email or phone..."

className="
w-full
outline-none
text-sm
"

/>



</div>









{/* CLIENT LIST */}


{

clientList.length === 0

?

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

No clients found.

</div>


:


<div className="
grid
gap-6
md:grid-cols-2
xl:grid-cols-3
">


{

clientList.map((client)=>(



<div

key={client.id}

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


<UserRound size={28}/>


</div>





<div className="relative">


<button

onClick={()=>


setMenuOpen(

menuOpen === client.id

?

null

:

client.id

)

}

className="
rounded-lg
p-2
hover:bg-slate-100
"

>

<MoreHorizontal size={20}/>

</button>





{

menuOpen === client.id &&


<div

className="
absolute
right-0
top-11
z-20
w-48
rounded-xl
border
bg-white
shadow-lg
p-2
"

>



<button

onClick={()=>navigate(

`/dashboard/clients/${client.id}`

)}

className="
flex
w-full
items-center
gap-2
rounded-lg
px-3
py-2
text-sm
hover:bg-slate-100
"

>

<Eye size={16}/>

View Profile

</button>





<button

onClick={()=>navigate(

`/dashboard/clients/${client.id}/records`

)}

className="
flex
w-full
items-center
gap-2
rounded-lg
px-3
py-2
text-sm
hover:bg-slate-100
"

>

<FileText size={16}/>

Medical Records

</button>




<button

onClick={() => navigate(`/dashboard/clients/${client.id}/edit`)}

className="
flex
w-full
items-center
gap-2
rounded-lg
px-3
py-2
text-sm
hover:bg-slate-100
"

>

<Edit3 size={16}/>

Edit Client

</button>



<button

onClick={()=>handleDeleteClient(client.id)}

className="
flex
w-full
items-center
gap-2
rounded-lg
px-3
py-2
text-sm
text-red-600
hover:bg-red-50
"

>

<Trash2 size={16}/>

Delete Client

</button>



</div>


}



</div>



</div>






<h3 className="
mt-5
text-xl
font-bold
text-slate-900
">

{client.name}

</h3>







<div className="
mt-5
space-y-3
text-sm
text-slate-600
">


<div className="flex items-center gap-2">

<Mail size={16}/>

{client.email || "No email"}

</div>





<div className="flex items-center gap-2">

<Phone size={16}/>

{client.phone || "No phone"}

</div>





<div className="flex items-center gap-2">

<PawPrint size={16}/>

{client.pets} Registered Pets

</div>




<div className="flex items-center gap-2">

<CalendarDays size={16}/>

Last visit: {client.lastVisit}

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


<span

className="
rounded-full
bg-green-50
px-3
py-1
text-xs
font-medium
text-green-700
"

>

{client.status}

</span>





<button

onClick={()=>navigate(

`/dashboard/clients/${client.id}`

)}

className="
text-sm
font-semibold
text-teal-600
hover:text-teal-800
"

>

View Profile

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
