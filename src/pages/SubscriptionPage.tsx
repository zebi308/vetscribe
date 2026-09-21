
import {useAppState} from "../lib/AppState";

export function SubscriptionPage(){

const {
subscriptionPlans,
assignSubscription
}=useAppState();


async function choosePlan(plan:any){

 await assignSubscription({

 plan_id:
 plan.id,

 status:
 "active"

 });

}


return (

<div className="space-y-8">

<h1 className="text-3xl font-bold">
Choose Subscription
</h1>

<div className="grid md:grid-cols-3 gap-6">

{subscriptionPlans?.map((plan:any)=>(

<div
key={plan.id}
className="rounded-2xl border bg-white p-6"
>

<h2 className="text-xl font-bold">
{plan.name}
</h2>

<p>
£{plan.price}
</p>

<button
onClick={()=>choosePlan(plan)}
className="mt-4 bg-teal-600 text-white px-4 py-2 rounded-xl"
>
Assign Plan
</button>

</div>

))}

</div>

</div>

);

}
