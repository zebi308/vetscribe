import {
  Users,
  UserPlus,
  ShieldCheck,
  Mail,
  MoreHorizontal,
  CheckCircle2
} from "lucide-react";



export function StaffPage(){



const staff = [

{
name:"Dr. James Anderson",
email:"james@vetscribe.co.uk",
role:"Veterinarian",
status:"Active"
},


{
name:"Emily Carter",
email:"emily@vetscribe.co.uk",
role:"Veterinary Nurse",
status:"Active"
},


{
name:"Daniel Smith",
email:"daniel@vetscribe.co.uk",
role:"Practice Manager",
status:"Active"
},


{
name:"Sophie Wilson",
email:"sophie@vetscribe.co.uk",
role:"Reception",
status:"Invited"
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

Staff Management

</h1>


<p className="mt-2 text-slate-500">

Manage veterinary team members and access permissions.

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

<UserPlus size={18}/>

Add Staff Member

</button>



</div>









{/* SUMMARY CARDS */}


<div className="
grid
gap-5
md:grid-cols-3
">


<div className="
rounded-2xl
border
border-slate-200
bg-white
p-5
">


<div className="
flex
items-center
gap-3
">

<div className="
grid
h-10
w-10
place-items-center
rounded-xl
bg-teal-50
text-teal-600
">

<Users size={20}/>

</div>


<div>

<p className="text-sm text-slate-500">

Total Staff

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
border-slate-200
bg-white
p-5
">


<div className="
flex
items-center
gap-3
">


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

Active Users

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
border-slate-200
bg-white
p-5
">


<div className="
flex
items-center
gap-3
">


<div className="
grid
h-10
w-10
place-items-center
rounded-xl
bg-blue-50
text-blue-600
">

<ShieldCheck size={20}/>

</div>


<div>

<p className="text-sm text-slate-500">

Roles

</p>


<p className="text-2xl font-bold">

4

</p>

</div>


</div>


</div>


</div>








{/* STAFF LIST */}



<div className="
rounded-2xl
border
border-slate-200
bg-white
shadow-sm
overflow-hidden
">



<div className="
border-b
p-6
">


<h2 className="text-xl font-semibold">

Team Members

</h2>


</div>






<div className="divide-y">


{

staff.map((person)=>(


<div

key={person.email}

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


<div className="flex items-center gap-4">


<div className="
grid
h-12
w-12
place-items-center
rounded-xl
bg-teal-50
text-teal-600
">

<Users size={22}/>

</div>




<div>


<h3 className="font-semibold text-slate-900">

{person.name}

</h3>


<p className="flex items-center gap-2 text-sm text-slate-500">

<Mail size={14}/>

{person.email}

</p>


</div>



</div>







<div className="flex items-center gap-4">


<div>


<p className="text-sm font-medium">

{person.role}

</p>


<span className={`
text-xs
rounded-full
px-3
py-1

${
person.status==="Active"

?

"bg-green-50 text-green-700"

:

"bg-yellow-50 text-yellow-700"

}

`}>

{person.status}

</span>


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




</div>


))


}



</div>




</div>






</div>


);


}