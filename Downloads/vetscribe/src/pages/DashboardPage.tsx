import {
  Users,
  PawPrint,
  ClipboardList,
  FileText
} from "lucide-react";

import { Card } from "../components/ui/Card";

import { useAppState } from "../lib/AppState";



export function DashboardPage(){


const {

practice,

patients,

clients,

consultations,

ownerSummaries

}=useAppState();






const todayConsultations =
consultations.filter(c=>
c.consultationDate.startsWith(
new Date().toISOString().split("T")[0]
)
).length;







const stats = [

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
title:"Owner Summaries",
value:ownerSummaries.length,
icon:FileText
}

];









return (

<div className="space-y-6">



<div>

<h2 className="text-2xl font-bold text-slate-900">

Welcome back

</h2>


<p className="mt-1 text-slate-500">

{practice?.name || "Veterinary Practice"}

</p>


</div>









<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">



{

stats.map(item=>{


const Icon =
item.icon;



return (

<Card
key={item.title}
className="p-5"
>


<div className="flex items-center justify-between">


<div>

<p className="text-sm text-slate-500">

{item.title}

</p>


<p className="mt-2 text-3xl font-bold text-slate-900">

{item.value}

</p>


</div>



<div className="
grid
h-10
w-10
place-items-center
rounded-xl
bg-teal-50
text-teal-700
">

<Icon size={22}/>

</div>



</div>


</Card>

)


})

}


</div>








<Card className="p-6">


<h3 className="text-lg font-bold">

Today's activity

</h3>



<div className="mt-4 grid gap-4 md:grid-cols-3">


<div>

<p className="text-sm text-slate-500">

Today's consultations

</p>


<p className="text-xl font-bold">

{todayConsultations}

</p>

</div>




<div>

<p className="text-sm text-slate-500">

Approved records

</p>


<p className="text-xl font-bold">

{
consultations.filter(
c=>c.status==="approved"
).length
}

</p>


</div>




<div>

<p className="text-sm text-slate-500">

Draft records

</p>


<p className="text-xl font-bold">

{
consultations.filter(
c=>c.status==="draft"
).length
}

</p>


</div>



</div>



</Card>






</div>


);


}