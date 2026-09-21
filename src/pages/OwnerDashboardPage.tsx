import { useEffect,useState } from "react";
import { useAppState } from "../lib/AppState";

export function OwnerDashboardPage(){

const {
 practices,
 subscriptions,
 getBusinessMetrics
}=useAppState();

const [metrics,setMetrics]=useState<any>({});


useEffect(()=>{

getBusinessMetrics()
.then(setMetrics);

},[]);


return (

<div className="space-y-8">

<h1 className="text-3xl font-bold">
VetScribe Owner Dashboard
</h1>


<div className="grid md:grid-cols-5 gap-5">

{[
["Clinics",practices?.length || 0],
["Active Subscriptions",metrics.activeSubscriptions || 0],
["MRR","£"+(metrics.mrr || 0)],
["ARR","£"+(metrics.arr || 0)],
["Revenue","£"+(metrics.totalRevenue || 0)]
].map(([title,value])=>(

<div key={title}
className="rounded-2xl border bg-white p-5">

<p>{title}</p>

<h2 className="text-2xl font-bold">
{value}
</h2>

</div>

))}

</div>


<div className="grid md:grid-cols-3 gap-6">

{[
"Clinic Growth",
"Revenue Growth",
"User Growth"
].map(item=>(

<div
key={item}
className="rounded-2xl border bg-white p-6 h-48"
>

<h3 className="font-bold">
{item}
</h3>

<div className="mt-8 text-slate-500">
Chart data connected in analytics module
</div>

</div>

))}

</div>


</div>

);

}
