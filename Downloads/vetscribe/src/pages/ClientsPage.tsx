import {
  Search,
  UserRound,
  Phone,
  Mail,
  PawPrint,
  CalendarDays,
  MoreHorizontal,
  Plus
} from "lucide-react";



export function ClientsPage(){



const clients = [

{
name:"Sarah Williams",
email:"sarah.williams@email.com",
phone:"+44 7700 900123",
pets:2,
lastVisit:"Today",
status:"Active"
},


{
name:"Michael Brown",
email:"michael.brown@email.com",
phone:"+44 7700 900456",
pets:1,
lastVisit:"12 Sep 2026",
status:"Active"
},


{
name:"Emma Johnson",
email:"emma.johnson@email.com",
phone:"+44 7700 900789",
pets:3,
lastVisit:"05 Sep 2026",
status:"Follow Up"
},


{
name:"David Wilson",
email:"david.wilson@email.com",
phone:"+44 7700 900321",
pets:1,
lastVisit:"01 Sep 2026",
status:"Active"
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

Clients

</h1>


<p className="mt-2 text-slate-500">

Manage pet owners, contact details and consultation history.

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

placeholder="Search client name, email or phone..."

className="
w-full
outline-none
text-sm
"

/>


</div>









{/* CLIENT GRID */}



<div className="
grid
gap-6
md:grid-cols-2
xl:grid-cols-3
">



{

clients.map((client)=>(


<div

key={client.email}

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

<UserRound size={28}/>

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

{client.name}

</h3>








<div className="
mt-5
space-y-3
text-sm
text-slate-600
">



<div className="
flex
items-center
gap-2
">

<Mail size={16}/>

{client.email}

</div>





<div className="
flex
items-center
gap-2
">

<Phone size={16}/>

{client.phone}

</div>






<div className="
flex
items-center
gap-2
">

<PawPrint size={16}/>

{client.pets} Registered Pets

</div>







<div className="
flex
items-center
gap-2
">

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

className={`
rounded-full
px-3
py-1
text-xs
font-medium

${
client.status==="Active"

?

"bg-green-50 text-green-700"

:

"bg-yellow-50 text-yellow-700"

}

`}

>

{client.status}

</span>





<button

className="
text-sm
font-semibold
text-teal-600
"

>

View Profile

</button>



</div>






</div>



))


}




</div>






</div>


);


}