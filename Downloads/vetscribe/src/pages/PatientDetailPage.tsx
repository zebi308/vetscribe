import {
  useState
} from "react";

import {
  Link,
  useParams
} from "react-router-dom";


import {
  Plus
} from "lucide-react";


import {
  Card
} from "../components/ui/Card";


import {
  Button
} from "../components/ui/Button";


import {
  Modal
} from "../components/ui/Modal";


import {
  Field
} from "../components/ui/Field";


import {
  StatusBadge
} from "../components/ui/Badge";


import {
  useAppState
} from "../lib/AppState";


import {
  ageYears,
  formatDate,
  fullName
} from "../lib/format";


import type {
  Medicine
} from "../types/models";





export function PatientDetailPage(){


const {
id=""
}=useParams();



const s =
useAppState();





const foundPatient =
s.patients.find(
x=>x.id===id
);





if(!foundPatient){

return (

<Card className="p-6">

Patient not found.

</Card>

);

}





const patient =
foundPatient;





const foundClient =
s.clients.find(
x=>x.id===patient.clientId
);


if(!foundClient){

return (

<Card className="p-6">

Client not found.

</Card>

);

}


const client = foundClient;






if(!client){

return (

<Card className="p-6">

Client record not found.

</Card>

);

}






if(!s.practice){

return (

<Card className="p-6">

Loading practice data...

</Card>

);

}






const [tab,setTab]
=
useState(
"overview"
);



const [open,setOpen]
=
useState(false);



const [form,setForm]
=
useState({

name:"",

category:
"POM-V" as Medicine["medicineCategory"],

quantity:"",

batch:"",

date:
new Date()
.toISOString()
.split("T")[0]

});





const history =
s.consultations

.filter(
x=>x.patientId===patient.id
)

.sort(
(a,b)=>
b.consultationDate
.localeCompare(
a.consultationDate
)
);





const medicines =
s.medicines.filter(
x=>x.patientId===patient.id
);






async function addMedicine(){


if(
!form.name ||
!form.quantity ||
!form.batch ||
!form.date
){

return;

}
const medicine:Medicine = {


id:crypto.randomUUID(),


practiceId:s.practice!.id,


patientId:patient.id,


clientId:client.id,


prescribingVetId:
s.currentUser?.role==="vet"

?

s.currentUser.id

:

"u-emily",



medicineName:
form.name,


medicineCategory:
form.category,


quantity:
form.quantity,


unit:
"units",


batchNumber:
form.batch,


prescribedDate:
form.date,


withdrawalPeriod:
"Not specified",


instructions:
""

};






await s.addMedicine(
medicine
);





setOpen(false);



setForm({

name:"",

category:"POM-V",

quantity:"",

batch:"",

date:
new Date()
.toISOString()
.split("T")[0]

});


}









return (

<div className="space-y-5">






<div>


<h2 className="text-3xl font-bold">

{patient.name}

</h2>



<p className="text-slate-600">

{patient.breed}

{" · "}

{patient.sex}

{" · "}

{

patient.neutered

?

"Neutered"

:

"Not neutered"

}

{" · "}

{ageYears(patient.dateOfBirth)}

years

{" · "}

{patient.weightKg}

kg

</p>



<p className="mt-2 text-sm">


Owner:

{" "}


<Link

to={`/clients/${client.id}`}

className="font-semibold text-brand-700"

>

{fullName(client)}

</Link>



</p>



</div>









<div className="flex gap-2 border-b">


{

[
"overview",
"clinical history",
"medicines",
"documents"

]

.map(tabName=>(


<button

key={tabName}

onClick={()=>setTab(tabName)}

className={`

border-b-2

px-3

py-2

text-sm

font-semibold

${tab===tabName

?

"border-brand-700 text-brand-800"

:

"border-transparent text-slate-500"

}

`}

>


{tabName}


</button>


))


}


</div>









{
tab==="overview"

&&


<Card className="grid gap-4 p-5 md:grid-cols-2">


<div>

<p className="text-xs uppercase text-slate-400">

Microchip

</p>


<p className="mt-1 font-medium">

{patient.microchipNumber || "Not recorded"}

</p>

</div>






<div>

<p className="text-xs uppercase text-slate-400">

Date of birth

</p>


<p className="mt-1 font-medium">

{formatDate(patient.dateOfBirth)}

</p>

</div>






<div>

<p className="text-xs uppercase text-slate-400">

Colour

</p>


<p className="mt-1 font-medium">

{patient.colour || "Not recorded"}

</p>

</div>






<div>

<p className="text-xs uppercase text-slate-400">

Owner contact

</p>


<p className="mt-1 font-medium">

{client.phone}

</p>

</div>



</Card>


}









{
tab==="clinical history"

&&


<Card className="p-5">


<div className="space-y-0">


{

history.map(item=>(


<Link

key={item.id}

to={`/consultations/${item.id}`}

className="

relative

block

border-l-2

border-brand-200

pb-6

pl-5

last:pb-0

"

>


<span

className="

absolute

-left-2

top-0

h-3.5

w-3.5

rounded-full

border-2

border-white

bg-brand-600

"

/>





<p className="text-sm font-semibold">

{formatDate(item.consultationDate)}

</p>





<p className="mt-1 font-bold">

{

item.transcript

?

item.transcript.split(".")[0]

:

"Consultation"

}

</p>





<div className="mt-2">

<StatusBadge

status={item.status}

/>

</div>





</Link>


))


}


</div>


</Card>


}
{
tab==="medicines"

&&


<Card>


<div className="flex items-center justify-between border-b p-5">


<div>


<h3 className="font-bold">

Medicine history

</h3>


<p className="text-sm text-slate-500">

Medicine records are retained according to practice policy.

</p>


</div>




<Button

onClick={()=>setOpen(true)}

>

<Plus size={16}/>

Add medicine

</Button>



</div>







<div className="overflow-x-auto">


<table className="w-full text-left text-sm">


<thead className="bg-slate-50">


<tr>


{

[
"Date",
"Medicine",
"Category",
"Quantity",
"Batch",
"Prescribing vet",
"Withdrawal period"

].map(header=>(


<th

key={header}

className="px-4 py-3"

>

{header}

</th>


))


}


</tr>


</thead>







<tbody>


{

medicines.map(medicine=>(


<tr

key={medicine.id}

className="border-t"

>


<td className="px-4 py-3">

{formatDate(
medicine.prescribedDate
)}

</td>



<td className="px-4 py-3 font-semibold">

{medicine.medicineName}

</td>




<td className="px-4 py-3">

{medicine.medicineCategory}

</td>




<td className="px-4 py-3">

{medicine.quantity}

{" "}

{medicine.unit}

</td>




<td className="px-4 py-3">

{medicine.batchNumber}

</td>





<td className="px-4 py-3">


{

(()=>{


const profile =
s.profiles.find(
x=>x.id===medicine.prescribingVetId
);



return profile
?
fullName(profile)
:
"Unknown";


})()


}


</td>





<td className="px-4 py-3">

{medicine.withdrawalPeriod}

</td>



</tr>


))


}


</tbody>


</table>


</div>







<div className="border-t bg-slate-50 p-4 text-xs text-slate-500">

Controlled drug register functionality is planned for a future version.

</div>



</Card>


}









{
tab==="documents"

&&


<Card className="p-8 text-center text-sm text-slate-500">

No documents in this demo record.

</Card>


}









<Modal

open={open}

title="Add medicine record"

onClose={()=>setOpen(false)}

>


<div className="space-y-3">


<Field

label="Medicine name"

value={form.name}

onChange={
e=>

setForm({

...form,

name:e.target.value

})

}

/>






<label className="block text-sm font-medium">


Category


<select

className="mt-1.5 w-full rounded-lg border p-2.5"

value={form.category}

onChange={

e=>

setForm({

...form,

category:
e.target.value as Medicine["medicineCategory"]

})

}

>


{

[
"POM-V",
"POM-VPS",
"Cascade",
"Other"

].map(category=>(


<option

key={category}

value={category}

>

{category}

</option>


))


}


</select>


</label>







<Field

label="Quantity"

value={form.quantity}

onChange={
e=>

setForm({

...form,

quantity:e.target.value

})

}

/>






<Field

label="Batch number"

value={form.batch}

onChange={
e=>

setForm({

...form,

batch:e.target.value

})

}

/>






<Field

label="Prescribed date"

type="date"

value={form.date}

onChange={
e=>

setForm({

...form,

date:e.target.value

})

}

/>








<div className="flex justify-end gap-2 pt-2">


<Button

variant="secondary"

onClick={()=>setOpen(false)}

>

Cancel

</Button>




<Button

onClick={addMedicine}

>

Add record

</Button>




</div>





</div>


</Modal>





</div>


);


}