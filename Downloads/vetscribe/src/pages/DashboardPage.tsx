import {
  Users,
  PawPrint,
  ClipboardList,
  FileText,
  UserPlus,
  Stethoscope,
  CheckCircle,
  ArrowRight,
  Plus,
  Eye
} from "lucide-react";


import {
  useState
} from "react";


import {
  useNavigate
} from "react-router-dom";


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





export function DashboardPage(){


const navigate = useNavigate();



const {

practice,

patients,

clients,

consultations,

ownerSummaries

}=useAppState();





const [showGuide,setShowGuide] = useState(

localStorage.getItem(
"vetscribe_onboarding_skipped"
)!=="true"

);





const today = new Date()

.toISOString()

.split("T")[0];





const todayConsultations = consultations.filter(

c=>

c.consultationDate?.startsWith(today)

).length;





const isEmptyDashboard =

patients.length===0 &&

clients.length===0 &&

consultations.length===0;






// =========================
// ANALYTICS DATA
// =========================



const consultationData = [

{
name:"Total",
value:consultations.length
},

{
name:"Today",
value:todayConsultations
},

{
name:"Draft",
value:
consultations.filter(
c=>c.status==="draft"
).length
},

{
name:"Approved",
value:
consultations.filter(
c=>c.status==="approved"
).length
}

];





const speciesMap:any = {};



patients.forEach(patient=>{


const species =
patient.species || "Unknown";


speciesMap[species] =
(speciesMap[species] || 0)+1;


});





const speciesData = Object.keys(speciesMap)

.map(key=>({

name:key,

value:speciesMap[key]

}));





const stats = [

{
title:"Patients",
value:patients.length,
icon:PawPrint,
route:"/dashboard/patients"
},


{
title:"Clients",
value:clients.length,
icon:Users,
route:"/dashboard/clients"
},


{
title:"Consultations",
value:consultations.length,
icon:ClipboardList,
route:"/dashboard/consultations"
},


{
title:"Owner Summaries",
value:ownerSummaries.length,
icon:FileText,
route:"/dashboard/owner-summaries"
}

];
return (

<div className="space-y-6">





{/* HEADER */}


<div>


<h2 className="text-2xl font-bold text-slate-900">

Welcome back

</h2>



<p className="mt-1 text-slate-500">

{practice?.name || "Veterinary Practice"}

</p>


</div>









{/* ONBOARDING GUIDE */}



{

showGuide && isEmptyDashboard && (

<Card className="p-6">


<div className="flex items-start justify-between">


<div>


<h3 className="text-xl font-bold">

Welcome to VetScribe

</h3>



<p className="mt-2 text-slate-500">

Follow these steps to create your first AI-assisted clinical note.

</p>


</div>





<button

className="text-sm text-slate-500 hover:text-slate-900"

onClick={()=>{


localStorage.setItem(

"vetscribe_onboarding_skipped",

"true"

);


setShowGuide(false);


}}

>

Skip Guide

</button>


</div>








<div className="mt-6 grid gap-4 md:grid-cols-4">


{[

{
title:"Add Client",
icon:UserPlus
},

{
title:"Add Patient",
icon:PawPrint
},

{
title:"Start Consultation",
icon:Stethoscope
},

{
title:"Review AI Draft",
icon:CheckCircle
}


].map((step,index)=>{


const Icon = step.icon;



return (


<div

key={step.title}

className="
rounded-xl
border
border-slate-200
p-4
"


>


<div className="flex items-center justify-between">


<div

className="
grid
h-10
w-10
place-items-center
rounded-xl
bg-teal-50
text-teal-700
"

>


<Icon size={20}/>


</div>



<span className="text-sm text-slate-400">

Step {index+1}

</span>


</div>



<p className="mt-4 font-semibold">

{step.title}

</p>



{

index < 3 &&

<ArrowRight

size={16}

className="mt-3 text-slate-400"

/>

}



</div>


)


})


}


</div>


</Card>

)

}










{/* STAT CARDS */}


{/* STAT CARDS */}


<div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">


{

stats.map(item=>{


const Icon=item.icon;



return (

<Card

key={item.title}

className="
group
cursor-pointer
p-6
transition
hover:-translate-y-1
hover:shadow-lg
"

onClick={()=>navigate(item.route)}

>


<div className="flex items-start justify-between">


<div>


<p className="
text-sm
font-medium
uppercase
tracking-wide
text-slate-400
">

{item.title}

</p>



<p className="
mt-3
text-4xl
font-bold
text-slate-900
">

{item.value}

</p>


<p className="
mt-2
text-xs
text-slate-400
"

>

View details →

</p>


</div>





<div

className="
flex
h-14
w-14
items-center
justify-center
rounded-2xl
bg-teal-50
text-teal-600
transition
group-hover:bg-teal-100
"

>

<Icon size={28}/>

</div>



</div>



</Card>


)


})


}


</div>





{/* ACTIVITY CARD */}



<Card className="p-6">


<h3 className="text-lg font-bold">

Today's Activity

</h3>





<div className="mt-4 grid gap-4 md:grid-cols-3">



<div>


<p className="text-sm text-slate-500">

Today's consultations

</p>


<p className="text-2xl font-bold">

{todayConsultations}

</p>


</div>





<div>


<p className="text-sm text-slate-500">

Approved records

</p>


<p className="text-2xl font-bold">

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


<p className="text-2xl font-bold">

{

consultations.filter(

c=>c.status==="draft"

).length

}

</p>


</div>



</div>



</Card>

{/* QUICK ACTIONS */}


<Card className="p-6">


<h3 className="text-lg font-bold text-slate-900">

Quick Actions

</h3>


<p className="mt-1 text-sm text-slate-500">

Common tasks to manage your practice faster.

</p>





<div className="
mt-5
grid
gap-4
md:grid-cols-4
">





<button

onClick={()=>navigate("/dashboard/clients/new")}

className="
flex
items-center
gap-4
rounded-xl
border
border-slate-200
bg-white
p-4
text-left
transition
hover:border-teal-300
hover:shadow-md
"

>


<div

className="
flex
h-11
w-11
items-center
justify-center
rounded-xl
bg-teal-50
text-teal-600
"

>

<UserPlus size={22}/>

</div>



<div>

<p className="font-semibold text-slate-900">

Add Client

</p>


<p className="text-xs text-slate-500">

Register pet owner

</p>


</div>


</button>









<button

onClick={()=>navigate("/dashboard/patients/new")}

className="
flex
items-center
gap-4
rounded-xl
border
border-slate-200
bg-white
p-4
text-left
transition
hover:border-teal-300
hover:shadow-md
"

>


<div

className="
flex
h-11
w-11
items-center
justify-center
rounded-xl
bg-teal-50
text-teal-600
"

>

<PawPrint size={22}/>

</div>



<div>

<p className="font-semibold text-slate-900">

Add Patient

</p>


<p className="text-xs text-slate-500">

Create animal record

</p>


</div>


</button>









<button

onClick={()=>navigate("/dashboard/consultations/new")}

className="
flex
items-center
gap-4
rounded-xl
border
border-slate-200
bg-white
p-4
text-left
transition
hover:border-teal-300
hover:shadow-md
"

>


<div

className="
flex
h-11
w-11
items-center
justify-center
rounded-xl
bg-teal-50
text-teal-600
"

>

<Stethoscope size={22}/>

</div>



<div>

<p className="font-semibold text-slate-900">

New Consultation

</p>


<p className="text-xs text-slate-500">

Start clinical note

</p>


</div>


</button>









<button

onClick={()=>navigate("/dashboard/consultations")}

className="
flex
items-center
gap-4
rounded-xl
border
border-slate-200
bg-white
p-4
text-left
transition
hover:border-teal-300
hover:shadow-md
"

>


<div

className="
flex
h-11
w-11
items-center
justify-center
rounded-xl
bg-teal-50
text-teal-600
"

>

<Eye size={22}/>

</div>



<div>

<p className="font-semibold text-slate-900">

View Records

</p>


<p className="text-xs text-slate-500">

Review consultations

</p>


</div>


</button>




</div>


</Card>

{/* ANALYTICS SECTION */}


<div className="grid gap-6 lg:grid-cols-2">





{/* CONSULTATION CHART */}


<Card className="p-6">


<h3 className="text-lg font-bold text-slate-900">

Consultation Analytics

</h3>



<p className="mt-1 text-sm text-slate-500">

Overview of consultation records

</p>





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



<YAxis />



<Tooltip />



<Bar

dataKey="value"

fill="#0d9488"

radius={[6,6,0,0]}

/>



</BarChart>



</ResponsiveContainer>



</div>


</Card>









{/* SPECIES CHART */}



<Card className="p-6">


<h3 className="text-lg font-bold text-slate-900">

Patient Species

</h3>



<p className="mt-1 text-sm text-slate-500">

Registered animal distribution

</p>







<div className="mt-6 h-72">


{

speciesData.length > 0 ?


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

label

>


{

speciesData.map(

(entry,index)=>(


<Cell

key={`cell-${index}`}

fill={[

"#0d9488",

"#14b8a6",

"#5eead4",

"#99f6e4"

][index % 4]}

/>


)

)

}


</Pie>



<Tooltip />



</PieChart>


</ResponsiveContainer>


:


<div className="flex h-full items-center justify-center text-slate-400">


No patient data available


</div>



}



</div>


</Card>





</div>









{/* RECENT CONSULTATIONS */}



<Card className="p-6">


<div className="flex items-center justify-between">


<h3 className="text-lg font-bold">

Recent Consultations

</h3>



<span className="text-sm text-slate-500">

Total: {consultations.length}

</span>



</div>







<div className="mt-5 space-y-3">



{

consultations

.slice(0,5)

.map((consultation:any)=>{


const patient =

patients.find(

p=>p.id===consultation.patientId

);



return (


<div

key={consultation.id}

className="
flex
items-center
justify-between
rounded-xl
bg-slate-50
p-4
"


>


<div>


<p className="font-semibold text-slate-900">


{

patient?.name ||

"Unknown Patient"

}


</p>


<p className="text-sm text-slate-500">

Consultation record

</p>


</div>





<span

className="
rounded-full
bg-teal-50
px-3
py-1
text-xs
font-medium
text-teal-700
"

>


{consultation.status}


</span>



</div>


)


})



}



{

consultations.length===0 &&

<p className="text-sm text-slate-500">

No consultations available.

</p>

}



</div>



</Card>







</div>


);


}