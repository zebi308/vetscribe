import {
  Building2,
  Bell,
  Shield,
  Bot,
  CreditCard,
  Save,
  Check,
  FileText,
  Lock,
  UserCog
} from "lucide-react";

import { useState } from "react";



export function SettingsPage(){



const [saved,setSaved] = useState(false);



const [settings,setSettings] = useState({

practiceName:"VetScribe Veterinary Clinic",

country:"United Kingdom",

address:"",

phone:"",

email:"",

soapNotes:true,

ownerSummaries:true,

followUpReminders:true,

requireApproval:true,

aiSuggestions:true,

emailAlerts:true,

approvalAlerts:true,

securityAlerts:true,

weeklyReports:true

});







function updateSetting(
key:string,
value:boolean
){

setSettings(prev=>({

...prev,

[key]:value

}));

}






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


<h1 className="
text-3xl
font-bold
text-slate-900
">

Settings

</h1>


<p className="
mt-2
text-slate-500
">

Manage your practice, AI preferences and account settings.

</p>


</div>









{/* PRACTICE PROFILE */}



<section className="
rounded-2xl
border
border-slate-200
bg-white
p-5
sm:p-6
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

value={settings.practiceName}

onChange={(e)=>

setSettings(prev=>({

...prev,

practiceName:e.target.value

}))

}

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

value={settings.country}

onChange={(e)=>

setSettings(prev=>({

...prev,

country:e.target.value

}))

}

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

Practice Address

</label>


<input

value={settings.address}

onChange={(e)=>

setSettings(prev=>({

...prev,

address:e.target.value

}))

}

placeholder="Clinic address"

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

Contact Email

</label>


<input

value={settings.email}

onChange={(e)=>

setSettings(prev=>({

...prev,

email:e.target.value

}))

}

placeholder="clinic@email.com"

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

{/* =========================
AI PREFERENCES
========================= */}


<section className="
rounded-2xl
border
border-slate-200
bg-white
p-5
sm:p-6
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

Control how VetScribe generates clinical notes.

</p>


</div>


</div>









<div className="mt-6 space-y-4">





<div className="
flex
items-center
justify-between
rounded-xl
bg-slate-50
p-4
">


<div>


<p className="text-sm font-medium">

Generate SOAP clinical notes

</p>


<p className="text-xs text-slate-500 mt-1">

Create structured veterinary consultation notes

</p>


</div>





<button

type="button"

onClick={()=>updateSetting(

"soapNotes",

!settings.soapNotes

)}

className={`

relative
h-6
w-11
rounded-full
transition

${
settings.soapNotes

?

"bg-teal-500"

:

"bg-slate-300"

}

`}

>


<span

className={`

absolute
top-1
h-4
w-4
rounded-full
bg-white
transition

${
settings.soapNotes

?

"left-6"

:

"left-1"

}

`}

/>


</button>



</div>












<div className="
flex
items-center
justify-between
rounded-xl
bg-slate-50
p-4
">


<div>


<p className="text-sm font-medium">

Create owner-friendly summaries

</p>


<p className="text-xs text-slate-500 mt-1">

Generate simplified updates for pet owners

</p>


</div>







<button

type="button"

onClick={()=>updateSetting(

"ownerSummaries",

!settings.ownerSummaries

)}

className={`

relative
h-6
w-11
rounded-full
transition

${
settings.ownerSummaries

?

"bg-teal-500"

:

"bg-slate-300"

}

`}

>


<span

className={`

absolute
top-1
h-4
w-4
rounded-full
bg-white
transition

${
settings.ownerSummaries

?

"left-6"

:

"left-1"

}

`}

/>


</button>



</div>













<div className="
flex
items-center
justify-between
rounded-xl
bg-slate-50
p-4
">


<div>


<p className="text-sm font-medium">

Suggest follow-up reminders

</p>


<p className="text-xs text-slate-500 mt-1">

AI suggests future care actions

</p>


</div>








<button

type="button"

onClick={()=>updateSetting(

"followUpReminders",

!settings.followUpReminders

)}

className={`

relative
h-6
w-11
rounded-full
transition

${
settings.followUpReminders

?

"bg-teal-500"

:

"bg-slate-300"

}

`}

>


<span

className={`

absolute
top-1
h-4
w-4
rounded-full
bg-white
transition

${
settings.followUpReminders

?

"left-6"

:

"left-1"

}

`}

/>


</button>



</div>







</div>



</section>

{/* =========================
CONSULTATION WORKFLOW
========================= */}


<section className="
rounded-2xl
border
border-slate-200
bg-white
p-5
sm:p-6
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


<FileText size={22}/>


</div>





<div>


<h2 className="text-lg font-semibold">

Consultation Workflow

</h2>


<p className="text-sm text-slate-500">

Control how clinical records are reviewed.

</p>


</div>


</div>








<div className="mt-6 space-y-4">



<div className="
flex
items-center
justify-between
rounded-xl
bg-slate-50
p-4
">


<div>


<p className="text-sm font-medium">

Require approval before finalizing notes

</p>


<p className="text-xs text-slate-500 mt-1">

Veterinarian approval is required before records are completed.

</p>


</div>





<button

type="button"

onClick={()=>updateSetting(

"requireApproval",

!settings.requireApproval

)}

className={`

relative
h-6
w-11
rounded-full
transition

${
settings.requireApproval

?

"bg-teal-500"

:

"bg-slate-300"

}

`}

>


<span

className={`

absolute
top-1
h-4
w-4
rounded-full
bg-white
transition

${
settings.requireApproval

?

"left-6"

:

"left-1"

}

`}

/>


</button>




</div>










<div className="
flex
items-center
justify-between
rounded-xl
bg-slate-50
p-4
">


<div>


<p className="text-sm font-medium">

AI assistance during consultations

</p>


<p className="text-xs text-slate-500 mt-1">

Show AI suggestions while creating clinical notes.

</p>


</div>







<button

type="button"

onClick={()=>updateSetting(

"aiSuggestions",

!settings.aiSuggestions

)}

className={`

relative
h-6
w-11
rounded-full
transition

${
settings.aiSuggestions

?

"bg-teal-500"

:

"bg-slate-300"

}

`}

>


<span

className={`

absolute
top-1
h-4
w-4
rounded-full
bg-white
transition

${
settings.aiSuggestions

?

"left-6"

:

"left-1"

}

`}

/>


</button>



</div>




</div>



</section>












{/* =========================
NOTIFICATIONS
========================= */}



<section className="
rounded-2xl
border
border-slate-200
bg-white
p-5
sm:p-6
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





<div>


<h2 className="text-lg font-semibold">

Notifications

</h2>


<p className="text-sm text-slate-500">

Manage alerts and practice updates.

</p>


</div>



</div>










<div className="mt-6 space-y-4">



{


[


{
key:"emailAlerts",
title:"Email alerts for completed AI notes"
},


{
key:"approvalAlerts",
title:"Consultation approval reminders"
},


{
key:"securityAlerts",
title:"Security and login alerts"
},


{
key:"weeklyReports",
title:"Weekly practice reports"
}



].map(item=>(



<div

key={item.key}

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

{item.title}

</span>






<button

type="button"

onClick={()=>updateSetting(

item.key,

!(settings as any)[item.key]

)}

className={`

relative
h-6
w-11
rounded-full
transition

${
(settings as any)[item.key]

?

"bg-teal-500"

:

"bg-slate-300"

}

`}

>


<span

className={`

absolute
top-1
h-4
w-4
rounded-full
bg-white
transition

${
(settings as any)[item.key]

?

"left-6"

:

"left-1"

}

`}

/>


</button>



</div>



))


}




</div>



</section>

{/* =========================
SECURITY
========================= */}


<section className="
rounded-2xl
border
border-slate-200
bg-white
p-5
sm:p-6
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





<div>


<h2 className="text-lg font-semibold">

Security

</h2>


<p className="text-sm text-slate-500">

Manage account protection and access control.

</p>


</div>



</div>









<div className="
mt-6
space-y-4
">



<button

type="button"

className="
flex
w-full
items-center
justify-between
rounded-xl
border
border-slate-200
p-4
text-left
hover:bg-slate-50
transition
"

>


<div>


<p className="text-sm font-medium">

Change Password

</p>


<p className="text-xs text-slate-500 mt-1">

Update your account password.

</p>


</div>



<Lock size={18} className="text-slate-400"/>



</button>









<button

type="button"

className="
flex
w-full
items-center
justify-between
rounded-xl
border
border-slate-200
p-4
text-left
hover:bg-slate-50
transition
"

>


<div>


<p className="text-sm font-medium">

Two-Factor Authentication

</p>


<p className="text-xs text-slate-500 mt-1">

Add extra protection to your account.

</p>


</div>



<div className="
rounded-full
bg-teal-50
px-3
py-1
text-xs
font-medium
text-teal-700
">

Recommended

</div>



</button>









<button

type="button"

className="
flex
w-full
items-center
justify-between
rounded-xl
border
border-red-200
p-4
text-left
text-red-600
hover:bg-red-50
transition
"

>


<div>


<p className="text-sm font-medium">

Logout from all devices

</p>


<p className="text-xs text-red-400 mt-1">

Remove active sessions from other devices.

</p>


</div>




<UserCog size={18}/>



</button>







</div>



</section>









{/* =========================
SUBSCRIPTION
========================= */}


<section className="
rounded-2xl
bg-slate-900
p-5
sm:p-6
text-white
">



<div className="flex items-center gap-3">


<div className="
grid
h-11
w-11
place-items-center
rounded-xl
bg-white/10
text-teal-400
">


<CreditCard size={22}/>


</div>





<div>


<h2 className="text-lg font-semibold">

Subscription

</h2>


<p className="text-sm text-slate-400">

Manage your VetScribe plan.

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


<p className="text-sm text-slate-400">

Current Plan

</p>



<h3 className="
mt-2
text-3xl
font-bold
">

Professional

</h3>



<p className="
mt-3
text-sm
text-slate-300
">

Unlimited consultations, AI notes and practice management tools.

</p>



</div>










<div className="
rounded-xl
bg-white/10
p-5
">


<p className="text-sm text-slate-400">

Monthly Billing

</p>



<p className="
mt-2
text-3xl
font-bold
">

£99

<span className="
text-base
font-normal
text-slate-400
">

/month

</span>

</p>




<p className="
mt-2
text-sm
text-slate-400
">

Next billing date: 01 October 2026

</p>



</div>





</div>








<div className="
mt-6
flex
flex-col
gap-3
sm:flex-row
">



<button

type="button"

className="
rounded-xl
bg-teal-500
px-5
py-3
font-semibold
hover:bg-teal-400
transition
"

>

Manage Subscription

</button>






<button

type="button"

className="
rounded-xl
border
border-white/20
px-5
py-3
font-semibold
hover:bg-white/10
transition
"

>

Billing History

</button>





</div>



</section>

{/* =========================
Save Settings
========================= */}


<div className="
flex
justify-end
pb-8
">



<button

type="button"

onClick={saveSettings}

className="
flex
items-center
gap-2
rounded-xl
bg-teal-600
px-6
py-3
font-semibold
text-white
transition
hover:bg-teal-700
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



</div>









{

saved && (


<div

className="
fixed
bottom-5
right-5
rounded-xl
bg-green-600
px-5
py-3
text-sm
font-medium
text-white
shadow-lg
"

>

Settings saved successfully

</div>


)

}





</div>


);


}