import { useState } from "react";

import { useAppState } from "../lib/AppState";

import {
  Building2,
  Users,
  CreditCard,
  Activity,
  ShieldCheck,
  MoreHorizontal,
  CheckCircle2,
  AlertCircle,
  Trash2,
  RotateCcw,
  Search,
FileText
} from "lucide-react";



export function AdminPage(){


const [userSearch,setUserSearch] = useState("");

const [statusTarget,setStatusTarget] = useState<any>(null);

const [deleteTarget,setDeleteTarget] = useState<{
type:"client"|"patient",
id:string
}|null>(null);


const {
clients,
patients,
restoreClient,
restorePatient,
permanentDeleteClient,
permanentDeletePatient,
profiles,
updateUserRole,
toggleUserStatus,
auditLogs,
currentUser
}=useAppState();



const filteredProfiles = profiles?.filter((profile:any)=>{
  const term = userSearch.toLowerCase();

  return (
    !term ||
    profile.email?.toLowerCase().includes(term) ||
    profile.fullName?.toLowerCase().includes(term) ||
    profile.role?.toLowerCase().includes(term)
  );
});


 const practiceList = []; // replaced by real practices from AppState

 /*
  Static practice data removed.
  Final version will receive practices from AppState/repository.
 */

 const practices = practiceList.length ? practiceList : [];



async function handlePermanentDelete(){

if(!deleteTarget) return;

try{

if(deleteTarget.type==="patient"){

await permanentDeletePatient(deleteTarget.id);

}
else{

await permanentDeleteClient(deleteTarget.id);

}

}
finally{

setDeleteTarget(null);

}

}







return (

<div className="space-y-8">





{/* HEADER */}



<div>


<h1 className="text-3xl font-bold text-slate-900">

Super Admin Dashboard

</h1>


<p className="mt-2 text-slate-500">

Manage VetScribe practices, subscriptions and platform activity.

</p>


</div>









{/* STATS */}



<div className="
grid
gap-5
md:grid-cols-2
xl:grid-cols-4
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

<Building2 size={22}/>

</div>


<div>

<p className="text-sm text-slate-500">

Practices

</p>


<p className="text-3xl font-bold">

124

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

<Users size={22}/>

</div>



<div>

<p className="text-sm text-slate-500">

Total Users

</p>


<p className="text-3xl font-bold">

846

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

<CreditCard size={22}/>

</div>


<div>

<p className="text-sm text-slate-500">

Subscriptions

</p>


<p className="text-3xl font-bold">

118

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
bg-purple-50
text-purple-600
">

<Activity size={22}/>

</div>


<div>

<p className="text-sm text-slate-500">

Monthly Activity

</p>


<p className="text-3xl font-bold">

24k

</p>


</div>


</div>


</div>




</div>









{/* PLATFORM STATUS */}



<div className="
rounded-2xl
bg-slate-900
p-6
text-white
">


<div className="flex items-center gap-3">


<ShieldCheck className="text-teal-400"/>


<h2 className="text-xl font-semibold">

Platform Status

</h2>


</div>



<div className="mt-5 grid gap-4 md:grid-cols-3">


<div className="
rounded-xl
bg-white/10
p-4
">


<p className="text-sm text-slate-300">

API Status

</p>


<p className="mt-2 font-semibold text-green-400">

Operational

</p>


</div>




<div className="
rounded-xl
bg-white/10
p-4
">


<p className="text-sm text-slate-300">

AI Processing

</p>


<p className="mt-2 font-semibold text-green-400">

Running

</p>


</div>





<div className="
rounded-xl
bg-white/10
p-4
">


<p className="text-sm text-slate-300">

Security

</p>


<p className="mt-2 font-semibold text-green-400">

Protected

</p>


</div>



</div>



</div>









{/* PRACTICES TABLE - Ready for database practice management integration */}



<div className="
rounded-2xl
border
border-slate-200
bg-white
overflow-hidden
">



<div className="border-b p-6">


<h2 className="text-xl font-semibold">

Registered Practices

</h2>


</div>






<div className="divide-y">


{

practices.map((practice)=>(


<div

key={practice.name}

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


<div>


<h3 className="font-semibold text-slate-900">

{practice.name}

</h3>


<p className="text-sm text-slate-500">

{practice.owner}

</p>


</div>







<div className="flex items-center gap-5">


<div>


<p className="text-sm text-slate-500">

Plan

</p>


<p className="font-medium">

{practice.plan}

</p>


</div>





<div>


<p className="text-sm text-slate-500">

Users

</p>


<p className="font-medium">

{practice.users}

</p>


</div>






<span className={`
flex
items-center
gap-2
rounded-full
px-3
py-1
text-xs
font-medium

${
practice.status==="Active"

?

"bg-green-50 text-green-700"

:

"bg-yellow-50 text-yellow-700"

}

`}>

{

practice.status==="Active"

?

<CheckCircle2 size={13}/>

:

<AlertCircle size={13}/>

}


{practice.status}


</span>




<button className="rounded-lg p-2 hover:bg-slate-100">

<MoreHorizontal size={20}/>

</button>



</div>






</div>



))


}



</div>



</div>








{/* USER MANAGEMENT */}

{
currentUser?.role === "super_admin" &&

<div className="
rounded-2xl
border
border-slate-200
bg-white
p-6
space-y-6
">

<div className="flex items-center gap-3">

<Users className="text-blue-600"/>

<h2 className="text-xl font-semibold">

User Management

</h2>

</div>


<div className="
flex
items-center
gap-3
rounded-xl
border
px-4
py-3
">

<Search size={18}/>

<input
value={userSearch}
onChange={(e)=>setUserSearch(e.target.value)}
placeholder="Search users..."
className="w-full outline-none"
/>

</div>


<div className="space-y-4">

{
filteredProfiles?.map((profile:any)=>(

<div

key={profile.id}

className="
rounded-xl
border
p-4
flex
flex-col
gap-4
md:flex-row
md:items-center
md:justify-between
"

>

<div>

<p className="font-semibold">

{profile.fullName || profile.email || "User"}

</p>


<p className="text-sm text-slate-500">

{profile.email}

</p>

<span className={
(profile.isActive ?? true)
? "text-xs text-green-700"
: "text-xs text-red-700"
}>
{(profile.isActive ?? true) ? "Active" : "Disabled"}
</span>


</div>



<div className="flex items-center gap-3">


<select

value={profile.role}

onChange={(e)=>
updateUserRole(
profile.id,
e.target.value
)
}

className="
rounded-lg
border
px-3
py-2
text-sm
"

>

<option value="vet">

Veterinarian

</option>

<option value="practice_manager">

Practice Manager

</option>

<option value="super_admin">

Super Admin

</option>


</select>



<button

onClick={()=>
toggleUserStatus(
profile.id,
!(profile.isActive ?? true)
)
}

className="
rounded-lg
bg-slate-900
px-3
py-2
text-sm
font-semibold
text-white
"

>

{
(profile.isActive ?? true)
?
"Disable"
:
"Activate"
}

</button>


</div>


</div>

))

}

</div>


</div>

}



{/* AUDIT LOGS */}

{
currentUser?.role === "super_admin" &&

<div className="
rounded-2xl
border
border-slate-200
bg-white
p-6
space-y-6
">

<div className="flex items-center gap-3">

<FileText className="text-purple-600"/>

<h2 className="text-xl font-semibold">
Audit Logs
</h2>

</div>


<div className="space-y-3">

{
auditLogs?.slice(0,20).map((log:any)=>(

<div
key={log.id}
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

<p className="font-medium">
{log.action || log.description || "Activity"}
</p>

<p className="text-sm text-slate-500">
{log.type || "SYSTEM"}
</p>

</div>

<p className="text-xs text-slate-400">
{
log.createdAt
?
new Date(log.createdAt).toLocaleString()
:
""
}
</p>

</div>

))

}

</div>

</div>

}


{/* DELETED RECORDS */}

{
currentUser?.role === "super_admin" &&

<div className="
rounded-2xl
border
border-slate-200
bg-white
p-6
space-y-6
">

<div className="flex items-center gap-3">

<Trash2 className="text-red-600"/>

<h2 className="text-xl font-semibold">

Deleted Records

</h2>

</div>


<div>

<h3 className="font-semibold mb-4">

Deleted Patients

</h3>

<div className="space-y-3">

{
patients
.filter((patient:any)=>patient.isDeleted)
.length === 0

?

<p className="text-sm text-slate-500">
No deleted patients.
</p>

:

patients
.filter((patient:any)=>patient.isDeleted)
.map((patient:any)=>(

<div
key={patient.id}
className="
flex
items-center
justify-between
rounded-xl
border
p-4
"
>

<div>

<p className="font-medium">

{patient.name}

</p>

<p className="text-sm text-slate-500">

{patient.species} {patient.breed && `• ${patient.breed}`}

</p>

</div>


<button

onClick={()=>restorePatient(patient.id)}

className="
flex
items-center
gap-2
rounded-lg
bg-teal-600
px-3
py-2
text-sm
font-semibold
text-white
"

>

<RotateCcw size={15}/>

Restore

</button>

<button

onClick={()=>setDeleteTarget({
type:"patient",
id:patient.id
})}

className="
rounded-lg
bg-red-600
px-3
py-2
text-sm
font-semibold
text-white
"

>

Delete Forever

</button>
</div>

))

}

</div>

</div>



<div>

<h3 className="font-semibold mb-4">

Deleted Clients

</h3>

<div className="space-y-3">

{
clients
.filter((client:any)=>client.isDeleted)
.length === 0

?

<p className="text-sm text-slate-500">
No deleted clients.
</p>

:

clients
.filter((client:any)=>client.isDeleted)
.map((client:any)=>(

<div
key={client.id}
className="
flex
items-center
justify-between
rounded-xl
border
p-4
"
>

<div>

<p className="font-medium">

{client.firstName} {client.lastName}

</p>

<p className="text-sm text-slate-500">

{client.email}

</p>

</div>


<button

onClick={()=>restoreClient(client.id)}

className="
flex
items-center
gap-2
rounded-lg
bg-teal-600
px-3
py-2
text-sm
font-semibold
text-white
"

>

<RotateCcw size={15}/>

Restore

</button>


</div>

))

}

</div>

</div>


</div>

}



{
deleteTarget &&

<div className="
fixed
inset-0
z-50
flex
items-center
justify-center
bg-black/40
">

<div className="
rounded-2xl
bg-white
p-6
max-w-md
space-y-5
">

<h3 className="text-xl font-bold">

Delete Permanently?

</h3>

<p className="text-slate-600">

This action cannot be undone. The record will be removed permanently.

</p>

<div className="flex justify-end gap-3">

<button

onClick={()=>setDeleteTarget(null)}

className="px-4 py-2 rounded-lg border"

>

Cancel

</button>

<button

onClick={handlePermanentDelete}

className="
px-4
py-2
rounded-lg
bg-red-600
text-white
font-semibold
"

>

Delete Forever

</button>

</div>

</div>

</div>

}


</div>

);


}