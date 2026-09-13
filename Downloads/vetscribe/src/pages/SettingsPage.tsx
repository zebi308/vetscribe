import {
  Building2,
  Bell,
  Shield,
  Bot,
  CreditCard,
  Save,
  Check
} from "lucide-react";

import { useState } from "react";



export function SettingsPage(){


const [saved,setSaved]=useState(false);



function saveSettings(){

setSaved(true);

setTimeout(()=>{

setSaved(false);

},2000);

}





return (

<div className="space-y-8">






{/* HEADER */}



<div>


<h1 className="text-3xl font-bold text-slate-900">

Settings

</h1>


<p className="mt-2 text-slate-500">

Manage your practice, AI preferences and account settings.

</p>


</div>









{/* PRACTICE PROFILE */}



<section className="
rounded-2xl
border
border-slate-200
bg-white
p-6
shadow-sm
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

<h2 className="text-lg font-semibold">

Practice Profile

</h2>


<p className="text-sm text-slate-500">

Basic clinic information

</p>


</div>


</div>







<div className="
mt-6
grid
gap-5
md:grid-cols-2
">


<div>

<label className="text-sm font-medium">

Practice Name

</label>


<input

defaultValue="VetScribe Veterinary Clinic"

className="
mt-2
w-full
rounded-xl
border
border-slate-200
px-4
py-3
outline-none
focus:border-teal-500
"

/>

</div>





<div>

<label className="text-sm font-medium">

Country

</label>


<input

defaultValue="United Kingdom"

className="
mt-2
w-full
rounded-xl
border
border-slate-200
px-4
py-3
outline-none
focus:border-teal-500
"

/>

</div>




</div>



</section>









{/* AI SETTINGS */}



<section className="
rounded-2xl
border
border-slate-200
bg-white
p-6
shadow-sm
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

<Bot size={22}/>

</div>


<div>


<h2 className="text-lg font-semibold">

AI Preferences

</h2>


<p className="text-sm text-slate-500">

Control how VetScribe generates notes.

</p>


</div>


</div>







<div className="mt-6 space-y-4">



{
[
"Generate SOAP clinical notes",
"Create owner-friendly summaries",
"Suggest follow-up reminders"
].map(item=>(


<div

key={item}

className="
flex
items-center
justify-between
rounded-xl
bg-slate-50
p-4
"


>


<span className="text-sm font-medium">

{item}

</span>



<div className="
h-6
w-11
rounded-full
bg-teal-500
p-1
">

<div className="
h-4
w-4
rounded-full
bg-white
ml-auto
"/>

</div>



</div>



))

}



</div>



</section>









{/* NOTIFICATIONS */}



<section className="
rounded-2xl
border
border-slate-200
bg-white
p-6
shadow-sm
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

<Bell size={22}/>

</div>



<h2 className="text-lg font-semibold">

Notifications

</h2>



</div>





<div className="mt-5 space-y-3">


<p className="rounded-xl bg-slate-50 p-4 text-sm">

✓ Email alerts for completed AI notes

</p>


<p className="rounded-xl bg-slate-50 p-4 text-sm">

✓ Consultation approval reminders

</p>



</div>



</section>









{/* SECURITY */}



<section className="
rounded-2xl
border
border-slate-200
bg-white
p-6
shadow-sm
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

<Shield size={22}/>

</div>


<h2 className="text-lg font-semibold">

Security

</h2>


</div>





<p className="mt-5 text-sm text-slate-600">

Your veterinary data is protected with secure authentication and controlled access.

</p>



</section>









{/* SUBSCRIPTION */}



<section className="
rounded-2xl
bg-slate-900
p-6
text-white
">


<div className="flex items-center gap-3">


<CreditCard className="text-teal-400"/>


<h2 className="text-lg font-semibold">

Subscription

</h2>


</div>




<p className="mt-4 text-slate-300">

Professional Plan

</p>


<p className="mt-2 text-3xl font-bold">

£99/month

</p>



<button

onClick={saveSettings}

className="
mt-6
flex
items-center
gap-2
rounded-xl
bg-teal-500
px-5
py-3
font-semibold
hover:bg-teal-400
"

>


{

saved

?

<>

<Check size={18}/>

Saved

</>

:

<>

<Save size={18}/>

Save Changes

</>

}



</button>



</section>








</div>

);

}