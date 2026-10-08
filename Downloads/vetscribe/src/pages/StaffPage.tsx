import {
  Users,
  UserPlus,
  ShieldCheck,
  Mail,
  MoreHorizontal,
  CheckCircle2
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../lib/AppState";



export function StaffPage(){



const { profiles, currentUser, createStaffMember, toggleUserStatus } = useAppState();

const navigate = useNavigate();

const [form, setForm] = useState({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
});

const [showAddModal, setShowAddModal] = useState(false);
const [openMenu, setOpenMenu] = useState<string | null>(null);
const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

const staff = profiles.filter(
  (profile) =>
    profile.practiceId === currentUser?.practiceId &&
    profile.id !== currentUser?.id &&
    profile.role === "vet"
);

const activeStaff = staff.filter(
  (member) => member.isActive
).length;




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

onClick={() => setShowAddModal(true)}

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

Add Veterinarian

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

{staff.length}

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

{activeStaff}

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

{staff.length}

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

{person.firstName} {person.lastName}

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
person.isActive

?

"bg-green-50 text-green-700"

:

"bg-red-50 text-red-700"

}

`}>

{person.isActive ? "Active" : "Deactivated"}

</span>


</div>





<div>

<button

onClick={(e) => {
 const rect = e.currentTarget.getBoundingClientRect();
 setMenuPosition({
   top: rect.bottom + 8,
   left: rect.right - 192,
 });
 setOpenMenu(openMenu === person.id ? null : person.id);
}}

className="
rounded-lg
p-2
hover:bg-slate-100
"

>

<MoreHorizontal size={20}/>

</button>

{openMenu === person.id && (
  <div
    className="fixed z-[100] w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-xl"
    style={{
      top: menuPosition.top,
      left: menuPosition.left,
    }}
  >

    <button
       onClick={() => {
         navigate(`/dashboard/staff/${person.id}`);
         setOpenMenu(null);
       }}
       className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-50"
     >
       View Profile
     </button>

     <button
       onClick={() => {
         navigate(`/dashboard/staff/${person.id}/edit`);
         setOpenMenu(null);
       }}
       className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-50"
     >
       Edit Veterinarian Details
     </button>

     <button
       onClick={async () => {
         await toggleUserStatus(person.id, !person.isActive);
         setOpenMenu(null);
       }}
       className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
          person.isActive
            ? "text-red-600 hover:bg-red-50"
            : "text-green-600 hover:bg-green-50"
        }`}
     >
       {person.isActive ? "Deactivate Account" : "Activate Account"}
     </button>

  </div>
)}

</div>



</div>




</div>


))


}



</div>




</div>






{showAddModal && (
  <div className="rounded-2xl border border-slate-200 bg-white p-6">
    <h3 className="text-lg font-semibold">Add Veterinarian</h3>

    <div className="mt-4 grid gap-3 md:grid-cols-2">
      <input
        className="rounded-lg border px-3 py-2"
        placeholder="First name"
        value={form.firstName}
        onChange={(e)=>setForm({...form, firstName:e.target.value})}
      />

      <input
        className="rounded-lg border px-3 py-2"
        placeholder="Last name"
        value={form.lastName}
        onChange={(e)=>setForm({...form, lastName:e.target.value})}
      />

      <input
        className="rounded-lg border px-3 py-2"
        placeholder="Email"
        value={form.email}
        onChange={(e)=>setForm({...form, email:e.target.value})}
      />

      <input
        className="rounded-lg border px-3 py-2"
        placeholder="Temporary password"
        type="password"
        value={form.password}
        onChange={(e)=>setForm({...form, password:e.target.value})}
      />
    </div>

    <p className="mt-3 text-xs text-slate-500">
      This is a temporary password. The veterinarian will be required to set a new password at first login.
    </p>

    <div className="mt-4 flex gap-3">
      <button
        className="rounded-lg bg-teal-600 px-4 py-2 text-white"
       onClick={async()=>{

try {

await createStaffMember(form);

setShowAddModal(false);

setForm({
 firstName:"",
 lastName:"",
 email:"",
 password:"",
});

}
catch(error){

console.error("CREATE VET ERROR:", error);

alert(
 error instanceof Error
 ? error.message
 : "Failed creating veterinarian"
);

}

}}
        
      >
        Create Veterinarian
      </button>

      <button
        className="rounded-lg border px-4 py-2"
        onClick={()=>setShowAddModal(false)}
      >
        Cancel
      </button>
    </div>
  </div>
)}

</div>


);


}