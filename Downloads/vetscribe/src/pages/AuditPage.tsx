import { useState } from "react";

import { useAppState } from "../lib/AppState";

import {
  ShieldCheck,
  Clock,
  User,
  FileText,
  Activity,
  Search,
  Filter,
  Trash2
} from "lucide-react";



export function AuditPage(){

const { auditLogs: appAuditLogs } = useAppState();

const [search, setSearch] = useState("");

const logs = [

{
action:"Consultation note approved",
user:"Dr. James Anderson",
type:"Clinical Record",
time:"Today • 10:45 AM",
status:"Completed"
},


{
action:"Patient record viewed",
user:"Emily Carter",
type:"Patient Data",
time:"Today • 11:20 AM",
status:"Viewed"
},


{
action:"New staff member invited",
user:"Daniel Smith",
type:"Account Management",
time:"Yesterday • 03:15 PM",
status:"Completed"
},


{
action:"AI summary generated",
user:"System",
type:"AI Activity",
time:"Yesterday • 04:40 PM",
status:"Completed"
},

{
action:"Patient record deleted",
user:"Practice Manager",
type:"DELETE",
time:"Today • 12:15 PM",
status:"Completed"
},

{
action:"Client record deleted",
user:"Practice Manager",
type:"DELETE",
time:"Today • 12:20 PM",
status:"Completed"
}

];


const auditLogs = appAuditLogs.length ? appAuditLogs : logs;

const filteredLogs = auditLogs.filter((log:any) => {
  const text = `${log.action || ""} ${log.user || ""} ${log.type || ""}`.toLowerCase();
  return text.includes(search.toLowerCase());
});








return (

<div className="space-y-8">





{/* HEADER */}


<div>


<h1 className="text-3xl font-bold text-slate-900">

Audit Log

</h1>


<p className="mt-2 text-slate-500">

Track important activities and changes across your practice.

</p>


</div>









{/* SUMMARY */}



<div className="
grid
gap-5
md:grid-cols-3
">





<div className="
rounded-2xl
border
border-slate-200
bg-white
p-6
">


<div className="flex items-center gap-3">


<div className="
grid
h-11
w-11
place-items-center
rounded-xl
bg-teal-50
text-teal-600
">

<Activity size={22}/>

</div>



<div>

<p className="text-sm text-slate-500">

Total Activities

</p>


<p className="text-2xl font-bold">

{auditLogs.length}

</p>


</div>


</div>


</div>







<div className="
rounded-2xl
border
border-slate-200
bg-white
p-6
">


<div className="flex items-center gap-3">


<div className="
grid
h-11
w-11
place-items-center
rounded-xl
bg-green-50
text-green-600
">

<ShieldCheck size={22}/>

</div>



<div>

<p className="text-sm text-slate-500">

Security Status

</p>


<p className="text-2xl font-bold">

Secure

</p>


</div>


</div>


</div>







<div className="
rounded-2xl
border
border-slate-200
bg-white
p-6
">


<div className="flex items-center gap-3">


<div className="
grid
h-11
w-11
place-items-center
rounded-xl
bg-blue-50
text-blue-600
">

<FileText size={22}/>

</div>



<div>

<p className="text-sm text-slate-500">

Records Checked

</p>


<p className="text-2xl font-bold">

96

</p>


</div>


</div>


</div>




</div>









{/* SEARCH / FILTER */}



<div className="
flex
flex-col
gap-3
md:flex-row
">



<div className="
flex
flex-1
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
size={18}
className="text-slate-400"
/>


<input

value={search}

onChange={(e)=>setSearch(e.target.value)}

placeholder="Search audit activity..."

className="
w-full
outline-none
text-sm
"

/>


</div>





<button

className="
flex
items-center
justify-center
gap-2
rounded-xl
border
border-slate-200
bg-white
px-5
py-3
font-medium
text-slate-700
"

>


<Filter size={18}/>

Filters


</button>



</div>









{/* AUDIT LIST */}



<div className="
rounded-2xl
border
border-slate-200
bg-white
shadow-sm
overflow-hidden
">





<div className="
divide-y
">


{

filteredLogs.length === 0

?

<div className="p-8 text-center text-slate-500">

No activity recorded yet.

</div>

:

filteredLogs.map((log:any)=>(


<div

key={log.action}

className="
flex
flex-col
gap-4
p-6
md:flex-row
md:items-center
md:justify-between
hover:bg-slate-50
"


>



<div className="flex gap-4">


<div className="
grid
h-11
w-11
place-items-center
rounded-xl
bg-slate-100
text-slate-600
">

{
log.type === "DELETE"
?
<Trash2 size={20}/>
:
<User size={20}/>
}

</div>





<div>


<h3 className="
font-semibold
text-slate-900
">

{log.action}

</h3>



<p className="
mt-1
text-sm
text-slate-500
">

{log.user} • {log.type}

</p>



</div>



</div>







<div className="flex items-center gap-5">


<div className="
flex
items-center
gap-2
text-sm
text-slate-500
">

<Clock size={15}/>

{log.time}

</div>




<span className="
rounded-full
bg-green-50
px-3
py-1
text-xs
font-medium
text-green-700
">

{log.status}

</span>



</div>





</div>



))

}



</div>





</div>






</div>


);


}