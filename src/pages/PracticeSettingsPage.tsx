import {
  Building2,
  Palette,
  FileText,
  Bot,
  Save,
  CheckCircle2
} from "lucide-react";

import { useState } from "react";



export function PracticeSettingsPage(){


const [saved,setSaved]=useState(false);



function handleSave(){

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

Practice Settings

</h1>


<p className="mt-2 text-slate-500">

Manage clinic details, branding and workflow preferences.

</p>


</div>









{/* PRACTICE DETAILS */}



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

<h2 className="font-semibold text-lg">

Practice Information

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

defaultValue="VetScribe Veterinary Practice"

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

Clinic Email

</label>


<input

defaultValue="clinic@vetscribe.co.uk"

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

Phone Number

</label>


<input

defaultValue="+44 7000 000000"

className="
mt-2
w-full
rounded-xl
border
border-slate-200
px-4
py-3
"

/>

</div>





<div>

<label className="text-sm font-medium">

Address

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
"

/>

</div>




</div>



</section>









{/* BRANDING */}



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

<Palette size={22}/>

</div>



<h2 className="font-semibold text-lg">

Branding

</h2>


</div>





<div className="
mt-6
grid
gap-5
md:grid-cols-2
">


<div>

<label className="text-sm font-medium">

Primary Colour

</label>


<input

type="color"

defaultValue="#14b8a6"

className="
mt-2
h-12
w-full
rounded-xl
border
"

/>

</div>





<div>

<label className="text-sm font-medium">

Logo URL

</label>


<input

placeholder="https://..."

className="
mt-2
w-full
rounded-xl
border
border-slate-200
px-4
py-3
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



<h2 className="font-semibold text-lg">

AI Consultation Settings

</h2>


</div>







<div className="mt-6 space-y-4">



<div className="
rounded-xl
bg-slate-50
p-4
">

<p className="font-medium">

Generate SOAP notes automatically

</p>


<p className="text-sm text-slate-500">

AI prepares structured clinical documentation.

</p>


</div>





<div className="
rounded-xl
bg-slate-50
p-4
">

<p className="font-medium">

Create owner summaries

</p>


<p className="text-sm text-slate-500">

Convert clinical notes into easy owner communication.

</p>


</div>



</div>


</section>









{/* SAVE */}



<button

onClick={handleSave}

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
hover:bg-teal-700
"

>


{

saved

?

<>

<CheckCircle2 size={18}/>

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

);


}