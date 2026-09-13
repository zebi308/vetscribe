import {
  ShieldCheck,
  Lock,
  Database,
  Users,
  Eye,
  Download,
  CheckCircle2
} from "lucide-react";



export function PrivacyPage(){



const controls = [

{
title:"Patient Data Protection",
description:
"Clinical records and consultation data are securely stored and protected.",
icon:Database,
status:"Enabled"
},


{
title:"Staff Access Control",
description:
"Only authorised team members can access practice information.",
icon:Users,
status:"Enabled"
},


{
title:"Secure Authentication",
description:
"Account access is protected using secure login controls.",
icon:Lock,
status:"Enabled"
},


{
title:"Activity Monitoring",
description:
"Practice actions and record access can be reviewed.",
icon:Eye,
status:"Enabled"
}

];







return (

<div className="space-y-8">





{/* HEADER */}


<div>


<h1 className="text-3xl font-bold text-slate-900">

Privacy & Security

</h1>


<p className="mt-2 text-slate-500">

Manage data protection, access controls and security preferences.

</p>


</div>









{/* SECURITY STATUS */}



<section className="
rounded-2xl
bg-slate-900
p-8
text-white
">


<div className="flex items-center gap-4">


<div className="
grid
h-14
w-14
place-items-center
rounded-xl
bg-teal-500
">

<ShieldCheck size={28}/>

</div>




<div>


<h2 className="text-2xl font-bold">

Your Practice Security

</h2>


<p className="mt-1 text-slate-300">

VetScribe follows secure data handling practices for veterinary workflows.

</p>


</div>


</div>




<div className="
mt-6
flex
items-center
gap-2
rounded-xl
bg-white/10
px-4
py-3
text-sm
">

<CheckCircle2 size={18}/>

All security controls are active

</div>



</section>









{/* SECURITY CONTROLS */}



<section>


<h2 className="
mb-5
text-xl
font-semibold
text-slate-900
">

Security Controls

</h2>




<div className="
grid
gap-5
md:grid-cols-2
">



{

controls.map((item)=>{


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
"


>


<div className="flex items-start gap-4">


<div className="
grid
h-11
w-11
place-items-center
rounded-xl
bg-teal-50
text-teal-600
">

<Icon size={22}/>

</div>




<div className="flex-1">


<h3 className="
font-semibold
text-slate-900
">

{item.title}

</h3>


<p className="
mt-2
text-sm
leading-6
text-slate-500
">

{item.description}

</p>



<span className="
mt-4
inline-flex
items-center
gap-2
rounded-full
bg-green-50
px-3
py-1
text-xs
font-medium
text-green-700
">

<CheckCircle2 size={13}/>

{item.status}

</span>



</div>


</div>



</div>


)


})


}



</div>



</section>









{/* DATA MANAGEMENT */}



<section className="
rounded-2xl
border
border-slate-200
bg-white
p-6
shadow-sm
">



<h2 className="
text-xl
font-semibold
text-slate-900
">

Data Management

</h2>



<p className="
mt-2
text-sm
text-slate-500
">

Manage your practice data and export options.

</p>





<div className="
mt-6
flex
flex-col
gap-4
md:flex-row
">



<button

className="
flex
items-center
justify-center
gap-2
rounded-xl
border
border-slate-200
px-5
py-3
font-medium
text-slate-700
hover:bg-slate-50
"

>

<Download size={18}/>

Export Practice Data

</button>





<button

className="
rounded-xl
bg-teal-600
px-5
py-3
font-semibold
text-white
hover:bg-teal-700
"

>

Review Permissions

</button>



</div>



</section>







</div>

);


}