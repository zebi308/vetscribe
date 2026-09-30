import {
  Users,
  PawPrint,
  ClipboardList,
  FileText,
  ShieldCheck,
  Activity
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";


import { Card } from "../components/ui/Card";
import { useAppState } from "../lib/AppState";


export function AnalyticsPage(){


const {

  patients,
  clients,
  consultations,
  ownerSummaries,
  profiles,
  auditLogs,
  subscriptions,
  subscriptionPlans,
  practice

}=useAppState();





const currentSubscription =
subscriptions.find(
(item:any)=>
item.practice_id===practice?.id
);



const currentPlan =
subscriptionPlans.find(
(plan:any)=>
plan.id===currentSubscription?.plan_id
);





const approvedConsultations =
consultations.filter(
(item:any)=>
item.status==="approved"
).length;



const draftConsultations =
consultations.filter(
(item:any)=>
item.status==="draft"
).length;





const speciesMap:any={};


patients.forEach((patient:any)=>{

const species =
patient.species || "Unknown";


speciesMap[species] =
(speciesMap[species] || 0)+1;


});



const speciesData =
Object.keys(speciesMap)
.map(key=>({

name:key,
value:speciesMap[key]

}));






const consultationData=[

{
name:"Total",
value:consultations.length
},

{
name:"Approved",
value:approvedConsultations
},

{
name:"Draft",
value:draftConsultations
}

];





const staffActivity =
profiles
.filter(
(profile:any)=>
profile.role==="vet"
)
.map((staff:any)=>{


const staffConsultations =
consultations.filter(
(item:any)=>
item.treatingVetId===staff.id ||
item.createdBy===staff.id
).length;


return {

name:
`${staff.firstName || ""} ${staff.lastName || ""}`,

consultations:
staffConsultations

};


});





const stats=[


{
title:"Patients",
value:patients.length,
icon:PawPrint
},


{
title:"Clients",
value:clients.length,
icon:Users
},


{
title:"Consultations",
value:consultations.length,
icon:ClipboardList
},


{
title:"Audit Activities",
value:auditLogs.length,
icon:ShieldCheck
},


{
title:"Owner Summaries",
value:ownerSummaries.length,
icon:FileText
},


{
title:"Staff Members",
value:
profiles.filter(
(p:any)=>p.role==="vet"
).length,
icon:Activity
}


];






return (

<div className="space-y-8">


<div>

<h1 className="text-3xl font-bold text-slate-900">
Practice Analytics
</h1>


<p className="mt-2 text-slate-500">
Monitor your veterinary practice performance.
</p>


</div>






{/* SUMMARY CARDS */}


<div className="grid gap-5 md:grid-cols-3">


{

stats.map((item)=>{


const Icon=item.icon;


return (

<Card
key={item.title}
className="p-6"
>


<div className="flex items-center justify-between">


<div>

<p className="text-sm text-slate-500">
{item.title}
</p>


<p className="mt-2 text-3xl font-bold">
{item.value}
</p>


</div>


<div className="rounded-xl bg-teal-50 p-3 text-teal-600">

<Icon size={24}/>

</div>


</div>


</Card>


)


})


}



</div>







{/* SUBSCRIPTION USAGE */}


<Card className="p-6">


<h2 className="text-lg font-bold">
Subscription Usage
</h2>


<div className="mt-5 grid gap-4 md:grid-cols-2">


<div className="rounded-xl border p-4">

<p className="text-sm text-slate-500">
Users
</p>


<p className="mt-2 text-2xl font-bold">

{
profiles.filter(
(p:any)=>p.role==="vet"
).length
}

/

{currentPlan?.max_users || "Unlimited"}

</p>


</div>





<div className="rounded-xl border p-4">


<p className="text-sm text-slate-500">
Patients
</p>


<p className="mt-2 text-2xl font-bold">

{patients.length}

/

{currentPlan?.max_patients || "Unlimited"}

</p>


</div>


</div>


</Card>







<div className="grid gap-6 lg:grid-cols-2">






<Card className="p-6">


<h2 className="text-lg font-bold">
Consultation Analytics
</h2>


<div className="mt-6 h-72">


<ResponsiveContainer
width="100%"
height="100%"
>


<BarChart
data={consultationData}
>


<CartesianGrid
strokeDasharray="3 3"
/>


<XAxis
dataKey="name"
/>


<YAxis/>


<Tooltip/>


<Bar
dataKey="value"
fill="#0d9488"
/>


</BarChart>


</ResponsiveContainer>


</div>


</Card>








<Card className="p-6">


<h2 className="text-lg font-bold">
Patient Species
</h2>


<div className="mt-6 h-72">


{

speciesData.length>0 ?


<ResponsiveContainer
width="100%"
height="100%"
>


<PieChart>


<Pie
data={speciesData}
dataKey="value"
nameKey="name"
outerRadius={100}
>


{

speciesData.map(
(entry:any,index:number)=>(

<Cell
key={index}
fill={[
"#0d9488",
"#14b8a6",
"#5eead4",
"#99f6e4"
][index%4]}
/>

)

)

}


</Pie>


<Tooltip/>


</PieChart>


</ResponsiveContainer>


:


<div className="flex h-full items-center justify-center text-slate-400">

No patient data

</div>


}



</div>


</Card>





</div>







{/* STAFF PERFORMANCE */}



<Card className="p-6">


<h2 className="text-lg font-bold">
Veterinarian Performance
</h2>


<div className="mt-5 h-72">


<ResponsiveContainer
width="100%"
height="100%"
>


<BarChart
data={staffActivity}
>


<CartesianGrid
strokeDasharray="3 3"
/>


<XAxis
dataKey="name"
/>


<YAxis/>


<Tooltip/>


<Bar
dataKey="consultations"
fill="#0d9488"
/>


</BarChart>


</ResponsiveContainer>


</div>


</Card>






{/* AUDIT */}


<Card className="p-6">


<h2 className="text-lg font-bold">
Recent Activity
</h2>


<div className="mt-4 space-y-3">


{

auditLogs
.slice(0,5)
.map((log:any)=>(


<div
key={log.id}
className="rounded-lg bg-slate-50 p-3"
>


<p className="font-medium">

{log.description || log.action}

</p>


<p className="text-xs text-slate-500">

{log.createdAt}

</p>


</div>


))


}


</div>


</Card>




</div>

);


}