import {
  Building2,
  Users,
  CreditCard,
  Activity,
  ShieldCheck,
  MoreHorizontal,
  CheckCircle2,
  AlertCircle
} from "lucide-react";



export function AdminPage(){



const practices = [

{
name:"London Veterinary Care",
owner:"Dr. James Anderson",
plan:"Professional",
users:8,
status:"Active"
},


{
name:"Happy Paws Clinic",
owner:"Dr. Sarah Williams",
plan:"Starter",
users:3,
status:"Active"
},


{
name:"Animal Health Centre",
owner:"Dr. Michael Brown",
plan:"Professional",
users:12,
status:"Pending"
},


{
name:"City Pet Hospital",
owner:"Dr. Emma Johnson",
plan:"Enterprise",
users:25,
status:"Active"
}

];







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









{/* PRACTICES TABLE */}



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






</div>

);


}