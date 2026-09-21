import {
  FileText,
  Plus,
  Edit3,
  CheckCircle2,
  ClipboardList,
  MoreHorizontal
} from "lucide-react";



export function TemplatesPage(){



const templates = [

{
name:"Standard SOAP Note",
type:"Clinical Note",
description:
"Structured Subjective, Objective, Assessment and Plan consultation format.",
status:"Active"
},


{
name:"Vaccination Consultation",
type:"Clinical Note",
description:
"Template for routine vaccination appointments and follow-up notes.",
status:"Active"
},


{
name:"Surgery Follow-up",
type:"Clinical Note",
description:
"Post-operative monitoring and recovery documentation.",
status:"Draft"
},


{
name:"Owner Discharge Summary",
type:"Owner Communication",
description:
"Simple explanation of treatment and aftercare instructions.",
status:"Active"
}

];







return (

<div className="space-y-8">





{/* HEADER */}



<div className="
flex
flex-col
gap-4
md:flex-row
md:items-center
md:justify-between
">


<div>


<h1 className="text-3xl font-bold text-slate-900">

Templates

</h1>


<p className="mt-2 text-slate-500">

Create and manage AI documentation templates.

</p>


</div>





<button

className="
flex
items-center
gap-2
rounded-xl
bg-teal-600
px-5
py-3
font-semibold
text-white
hover:bg-teal-700
"

>

<Plus size={18}/>

New Template

</button>


</div>









{/* TEMPLATE STATS */}



<div className="
grid
gap-5
md:grid-cols-3
">



<div className="
rounded-2xl
border
bg-white
p-5
border-slate-200
">


<div className="flex items-center gap-3">


<div className="
grid
h-10
w-10
place-items-center
rounded-xl
bg-teal-50
text-teal-600
">

<FileText size={20}/>

</div>


<div>

<p className="text-sm text-slate-500">

Total Templates

</p>


<p className="text-2xl font-bold">

4

</p>


</div>


</div>


</div>







<div className="
rounded-2xl
border
bg-white
p-5
border-slate-200
">


<div className="flex items-center gap-3">


<div className="
grid
h-10
w-10
place-items-center
rounded-xl
bg-green-50
text-green-600
">

<CheckCircle2 size={20}/>

</div>


<div>

<p className="text-sm text-slate-500">

Active

</p>


<p className="text-2xl font-bold">

3

</p>


</div>


</div>


</div>







<div className="
rounded-2xl
border
bg-white
p-5
border-slate-200
">


<div className="flex items-center gap-3">


<div className="
grid
h-10
w-10
place-items-center
rounded-xl
bg-blue-50
text-blue-600
">

<ClipboardList size={20}/>

</div>


<div>

<p className="text-sm text-slate-500">

Categories

</p>


<p className="text-2xl font-bold">

2

</p>


</div>


</div>


</div>



</div>









{/* TEMPLATE LIST */}



<div className="grid gap-5 lg:grid-cols-2">



{

templates.map((template)=>(



<div

key={template.name}

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
justify-between
items-start
">


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






<h3 className="
mt-5
text-lg
font-semibold
text-slate-900
">

{template.name}

</h3>




<span className="
mt-2
inline-block
rounded-full
bg-slate-100
px-3
py-1
text-xs
font-medium
text-slate-600
">

{template.type}

</span>






<p className="
mt-4
text-sm
leading-6
text-slate-500
">

{template.description}

</p>







<div className="
mt-6
flex
items-center
justify-between
border-t
pt-4
">


<span className={`
flex
items-center
gap-2
text-sm
font-medium

${
template.status==="Active"

?

"text-green-600"

:

"text-yellow-600"

}

`}>

<CheckCircle2 size={15}/>

{template.status}

</span>






<button

className="
flex
items-center
gap-2
text-sm
font-semibold
text-teal-600
"

>

<Edit3 size={15}/>

Edit

</button>



</div>






</div>


))


}



</div>






</div>

);


}