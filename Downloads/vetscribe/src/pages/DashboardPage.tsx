import {
  Activity,
  ClipboardCheck,
  FileText,
  PawPrint,
  Users,
  Clock,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

import { useAppState } from "../lib/AppState";


export function DashboardPage() {

const {
  practice
} = useAppState();



const stats = [
  {
    title:"Consultations Today",
    value:"24",
    icon:ClipboardCheck,
    change:"+12% this week"
  },
  {
    title:"AI Notes Generated",
    value:"18",
    icon:FileText,
    change:"6 awaiting review"
  },
  {
    title:"Active Patients",
    value:"1,248",
    icon:PawPrint,
    change:"+34 this month"
  },
  {
    title:"Practice Users",
    value:"8",
    icon:Users,
    change:"Team members"
  }
];



const consultations=[
 {
  patient:"Max",
  type:"Golden Retriever",
  status:"AI Note Ready",
  time:"10:30 AM"
 },
 {
  patient:"Bella",
  type:"British Shorthair Cat",
  status:"Recording",
  time:"11:15 AM"
 },
 {
  patient:"Charlie",
  type:"Labrador",
  status:"Approved",
  time:"12:40 PM"
 }
];




return (

<div className="space-y-8">


{/* HEADER */}

<div>

<h2 className="text-3xl font-bold text-slate-900">

Good morning 👋

</h2>


<p className="mt-2 text-slate-500">

Welcome back to {practice.name}. 
Here is today's clinical overview.

</p>

</div>





{/* STATS */}

<div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">


{
stats.map((item)=>{

const Icon=item.icon;


return (

<div

key={item.title}

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


<div className="flex justify-between">


<div>

<p className="text-sm text-slate-500">

{item.title}

</p>


<h3 className="mt-2 text-3xl font-bold text-slate-900">

{item.value}

</h3>


<p className="mt-2 text-xs text-teal-600">

{item.change}

</p>

</div>



<div className="
grid
h-12
w-12
place-items-center
rounded-xl
bg-teal-50
text-teal-600
">

<Icon size={24}/>

</div>


</div>


</div>


)

})

}


</div>






{/* MAIN GRID */}

<div className="grid gap-6 xl:grid-cols-3">





{/* CONSULTATIONS */}

<div className="
xl:col-span-2
rounded-2xl
border
bg-white
border-slate-200
p-6
">


<div className="flex items-center justify-between">


<h3 className="text-xl font-semibold">

Today's Consultations

</h3>


<button className="
flex
items-center
gap-2
text-sm
font-medium
text-teal-600
">

View all

<ArrowRight size={16}/>

</button>


</div>





<div className="mt-6 space-y-4">


{
consultations.map((item)=>(

<div

key={item.patient}

className="
flex
items-center
justify-between
rounded-xl
border
border-slate-100
p-4
hover:bg-slate-50
"

>


<div>

<h4 className="font-semibold text-slate-900">

{item.patient}

</h4>


<p className="text-sm text-slate-500">

{item.type}

</p>

</div>



<div className="text-right">


<p className="text-sm font-medium text-slate-700">

{item.time}

</p>


<span className="
mt-1
inline-flex
items-center
gap-1
rounded-full
bg-teal-50
px-3
py-1
text-xs
font-medium
text-teal-700
">

<CheckCircle2 size={13}/>

{item.status}

</span>


</div>


</div>


))

}


</div>



</div>






{/* AI ACTIVITY */}

<div className="
rounded-2xl
border
border-slate-200
bg-white
p-6
">


<h3 className="text-xl font-semibold">

AI Activity

</h3>



<div className="mt-6 space-y-5">


<div className="flex gap-3">


<div className="
mt-1
h-3
w-3
rounded-full
bg-teal-500
"/>


<div>

<p className="font-medium">

Clinical note generated

</p>


<p className="text-sm text-slate-500">

Max consultation completed

</p>

</div>


</div>




<div className="flex gap-3">


<div className="
mt-1
h-3
w-3
rounded-full
bg-blue-500
"/>


<div>

<p className="font-medium">

Recording processed

</p>


<p className="text-sm text-slate-500">

8 minute consultation

</p>

</div>


</div>





<div className="flex gap-3">


<div className="
mt-1
h-3
w-3
rounded-full
bg-green-500
"/>


<div>

<p className="font-medium">

Record approved

</p>


<p className="text-sm text-slate-500">

Ready for patient history

</p>

</div>


</div>



</div>


</div>



</div>







{/* QUICK ACTION */}

<div className="
rounded-2xl
bg-slate-900
p-8
text-white
flex
items-center
justify-between
">


<div>


<h3 className="text-2xl font-bold">

Start New Consultation

</h3>


<p className="mt-2 text-slate-300">

Record consultation and let AI prepare clinical notes.

</p>


</div>



<button className="
rounded-xl
bg-teal-500
px-6
py-3
font-semibold
text-white
hover:bg-teal-400
">

New Consultation

</button>



</div>



</div>

);

}