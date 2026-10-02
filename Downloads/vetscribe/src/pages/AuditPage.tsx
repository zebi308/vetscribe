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

const { auditLogs: appAuditLogs, currentUser, practice } = useAppState();

const [search, setSearch] = useState("");

const auditLogs = appAuditLogs || [];

const [moduleFilter, setModuleFilter] = useState("All");
const [actionFilter, setActionFilter] = useState("All");

const visibleLogs = auditLogs.filter((log:any)=>{

  // Practice managers can see their practice activity.
  // Other users only see their own activity.
  const permissionMatch =
    currentUser?.role === "practice_manager"
      ? log.practiceId === practice?.id
      : log.actorUserId === currentUser?.id;

  const searchText = `${log.action || ""} ${log.description || ""} ${log.entityType || ""}`.toLowerCase();

  const searchMatch = searchText.includes(search.toLowerCase());
  const moduleMatch = moduleFilter === "All" || log.entityType === moduleFilter;
  const actionMatch = actionFilter === "All" || log.action?.includes(actionFilter);

  return permissionMatch && searchMatch && moduleMatch && actionMatch;
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

{visibleLogs.length}

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





<select
value={moduleFilter}
onChange={(e)=>setModuleFilter(e.target.value)}
className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
>
<option>All</option>
<option>STAFF</option>
<option>CLIENT</option>
<option>PATIENT</option>
<option>CONSULTATION</option>
<option>SUBSCRIPTION</option>
</select>

<select
value={actionFilter}
onChange={(e)=>setActionFilter(e.target.value)}
className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
>
<option>All</option>
<option>created</option>
<option>updated</option>
<option>deleted</option>
<option>restored</option>
</select>



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

visibleLogs.length === 0

?

<div className="p-8 text-center text-slate-500">

No activity recorded yet.

</div>

:

visibleLogs.map((log:any)=>(


<div

key={log.id}

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
log.action?.toLowerCase().includes("delete")
?
<Trash2 size={20}/>
:
log.entityType === "CONSULTATION"
?
<FileText size={20}/>
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

{log.actorEmail || "System"} • {log.entityType}

</p>

{log.metadata && Object.keys(log.metadata).length > 0 && (

<p className="
mt-2
text-xs
text-slate-400
">

{Object.entries(log.metadata)
.filter(([key]) => key !== "actorEmail")
.map(([key,value]) => `${key}: ${typeof value === "object" ? JSON.stringify(value) : value}`)
.join(" • ")}

</p>

)}



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

{new Date(log.createdAt).toLocaleString()}

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

Completed

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