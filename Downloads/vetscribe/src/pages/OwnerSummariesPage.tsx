import {
  Search,
  FileText,
  User,
  PawPrint,
  CalendarDays,
  CheckCircle2,
  Clock,
  MoreHorizontal
} from "lucide-react";



export function OwnerSummariesPage(){



const summaries = [

{
owner:"Sarah Williams",
patient:"Max",
species:"Golden Retriever",
date:"Today",
status:"Ready",
summary:
"Max was examined for routine health assessment. Vaccination history reviewed and diet advice provided."
},


{
owner:"Michael Brown",
patient:"Bella",
species:"British Shorthair Cat",
date:"12 Sep 2026",
status:"Pending Review",
summary:
"Bella consultation summary generated from recorded discussion. Awaiting veterinary approval."
},


{
owner:"Emma Johnson",
patient:"Charlie",
species:"Labrador",
date:"05 Sep 2026",
status:"Sent",
summary:
"Treatment progress update prepared and shared with the pet owner."
}


];







return (

<div className="space-y-8">





{/* HEADER */}


<div>


<h1 className="text-3xl font-bold text-slate-900">

Owner Summaries

</h1>


<p className="mt-2 text-slate-500">

AI-generated summaries to keep pet owners informed.

</p>


</div>








{/* SEARCH */}



<div className="
flex
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
size={20}
className="text-slate-400"
/>


<input

placeholder="Search owner or patient..."

className="
w-full
outline-none
text-sm
"

/>


</div>








{/* SUMMARY LIST */}



<div className="space-y-5">



{

summaries.map((item)=>(


<div

key={item.patient}

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



<div className="
flex
flex-col
gap-5
md:flex-row
md:justify-between
">





<div className="flex gap-4">


<div className="
grid
h-12
w-12
place-items-center
rounded-xl
bg-teal-50
text-teal-600
">

<FileText size={24}/>

</div>





<div>


<h3 className="
text-lg
font-semibold
text-slate-900
">

{item.patient}

</h3>


<p className="
text-sm
text-slate-500
">

{item.species}

</p>



<div className="
mt-3
flex
flex-wrap
gap-4
text-sm
text-slate-500
">


<span className="flex items-center gap-2">

<User size={15}/>

{item.owner}

</span>




<span className="flex items-center gap-2">

<CalendarDays size={15}/>

{item.date}

</span>



</div>


</div>



</div>








<div className="flex items-center gap-3">


<span

className={`

flex
items-center
gap-2
rounded-full
px-4
py-2
text-xs
font-medium

${

item.status==="Ready"

?

"bg-green-50 text-green-700"

:

item.status==="Sent"

?

"bg-blue-50 text-blue-700"

:

"bg-yellow-50 text-yellow-700"

}

`}

>


{

item.status==="Ready"

?

<CheckCircle2 size={14}/>

:

<Clock size={14}/>

}


{item.status}


</span>




<button

className="
rounded-lg
p-2
hover:bg-slate-100
"

>

<MoreHorizontal size={20}/>

</button>



</div>




</div>









<div className="
mt-5
rounded-xl
bg-slate-50
p-4
">


<p className="
text-sm
leading-6
text-slate-600
">

{item.summary}

</p>


</div>






<div className="
mt-5
flex
justify-end
">


<button

className="
text-sm
font-semibold
text-teal-600
"

>

View Full Summary

</button>



</div>





</div>



))

}




</div>







</div>


);


}