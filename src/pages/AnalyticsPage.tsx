import { useAppState } from "../lib/AppState";

export function AnalyticsPage(){

const {
platformMetrics
}=useAppState();


return (

<div className="space-y-8">

<h1 className="text-3xl font-bold">
Analytics
</h1>


<div className="grid md:grid-cols-3 gap-6">

{[
"Clinic Growth",
"Revenue Growth",
"User Growth"
].map(type=>(

<div key={type}
className="rounded-2xl border bg-white p-6">

<h2 className="font-bold">
{type}
</h2>

<div className="mt-5 space-y-2">

{platformMetrics?.slice(0,5).map((metric:any)=>(

<div key={metric.id}
className="border-b py-2">

{metric.metric_date}

</div>

))}

</div>

</div>

))}

</div>

</div>

);

}
