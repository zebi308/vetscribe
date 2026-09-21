// AppointmentsPage_Google_TimeGrid_Final.tsx
// Appointment calendar upgrade:
// - Google Calendar style time grid
// - Left time axis
// - Weekly navigation
// - Existing AppState + AddAppointmentModal flow preserved
// - Calendar + Grid views only

import {
  CalendarDays,
  Clock,
  PawPrint,
  Plus,
  ChevronLeft,
  ChevronRight,
  Calendar,
  LayoutGrid,
  Search,
  X,
  Stethoscope
} from "lucide-react";

import { useMemo, useState } from "react";
import { useAppState } from "../lib/AppState";
import { AddAppointmentModal } from "../components/modals/AddAppointmentModal";


type ViewMode = "calendar" | "grid";


const HOURS = [
 "08:00",
 "09:00",
 "10:00",
 "11:00",
 "12:00",
 "13:00",
 "14:00",
 "15:00",
 "16:00",
 "17:00",
 "18:00"
];


function monday(date:Date){
 const d=new Date(date);
 const day=d.getDay();
 d.setDate(d.getDate()-(day===0?6:day-1));
 return d;
}


function addDays(date:Date,n:number){
 const d=new Date(date);
 d.setDate(d.getDate()+n);
 return d;
}


function sameDate(a:string,b:Date){
 return new Date(a).toDateString()===b.toDateString();
}



export function AppointmentsPage(){

const {
 appointments,
 patients,
 clients,
 profiles,
 addAppointment,
 currentUser,
 practice
}=useAppState();


const [view,setView]=useState<ViewMode>("calendar");
const [date,setDate]=useState(new Date());
const [search,setSearch]=useState("");
const [status,setStatus]=useState("all");
const [modal,setModal]=useState(false);
const [selected,setSelected]=useState<any>(null);



const vets=profiles.filter(p=>p.role==="vet");



function patientName(id:string){
 return patients.find(p=>p.id===id)?.name || "Unknown";
}


function clientName(id:string){
 const c=clients.find(c=>c.id===id);
 return c ? `${c.firstName} ${c.lastName}` : "Unknown";
}


function vetName(id:string){
 const v=profiles.find(v=>v.id===id);
 return v ? `${v.firstName} ${v.lastName}` : "Unassigned";
}


const filtered=appointments.filter(a=>{

const s =
patientName(a.patientId)
.toLowerCase()
.includes(search.toLowerCase())
||
a.reason.toLowerCase()
.includes(search.toLowerCase());


return s && (status==="all" || a.status===status);

});



const days=useMemo(()=>{

const start=monday(date);

return Array.from(
{length:7},
(_,i)=>addDays(start,i)
);

},[date]);



function appointmentHour(a:any){

return a.appointmentTime?.slice(0,2) || "08";

}



return (

<div className="space-y-6">


<div className="flex justify-between">

<div>

<h1 className="text-3xl font-bold">
Appointments
</h1>

<p className="text-slate-500">
Manage veterinary schedules
</p>

</div>


<button
onClick={()=>setModal(true)}
className="bg-teal-600 text-white px-5 py-3 rounded-xl flex gap-2"
>
<Plus size={18}/>
New Appointment
</button>


</div>




<div className="bg-white border rounded-2xl p-4 flex justify-between">

<div className="flex gap-2">

<button onClick={()=>setView("calendar")}
className={view==="calendar"?"bg-teal-600 text-white px-4 py-2 rounded-xl":"border px-4 py-2 rounded-xl"}>
<Calendar size={16}/>
</button>


<button onClick={()=>setView("grid")}
className={view==="grid"?"bg-teal-600 text-white px-4 py-2 rounded-xl":"border px-4 py-2 rounded-xl"}>
<LayoutGrid size={16}/>
</button>

</div>



<div className="flex gap-3">

<div className="border rounded-xl px-3 flex items-center gap-2">
<Search size={16}/>
<input
value={search}
onChange={e=>setSearch(e.target.value)}
placeholder="Search patient..."
className="outline-none"
/>
</div>


<select
value={status}
onChange={e=>setStatus(e.target.value)}
className="border rounded-xl px-3"
>
<option value="all">All</option>
<option value="scheduled">Scheduled</option>
<option value="completed">Completed</option>
<option value="cancelled">Cancelled</option>
</select>

</div>

</div>





{view==="calendar" &&

<div className="bg-white border rounded-2xl overflow-hidden">


<div className="flex justify-between p-5 border-b">

<div className="flex gap-2">

<button className="border p-2 rounded-xl"
onClick={()=>setDate(addDays(date,-7))}
>
<ChevronLeft/>
</button>

<button className="border px-4 rounded-xl"
onClick={()=>setDate(new Date())}
>
Today
</button>

<button className="border p-2 rounded-xl"
onClick={()=>setDate(addDays(date,7))}
>
<ChevronRight/>
</button>

</div>


<h2 className="font-bold text-xl">
{date.toLocaleDateString("en-US",{month:"long",year:"numeric"})}
</h2>

</div>




<div className="flex overflow-auto">


<div className="w-20 shrink-0 border-r">

<div className="h-16 border-b"/>

{HOURS.map(h=>(

<div
key={h}
className="h-24 border-b text-xs text-slate-500 p-2"
>
{h}
</div>

))}

</div>




<div className="grid grid-cols-7 flex-1">


{days.map(day=>(

<div
key={day.toISOString()}
className="border-r"
>


<div className="h-16 border-b text-center p-3">

<div className="text-xs text-slate-500">
{day.toLocaleDateString("en-US",{weekday:"short"})}
</div>

<div className="font-bold">
{day.getDate()}
</div>

</div>



{HOURS.map(hour=>(

<div
key={hour}
className="h-24 border-b relative"
>


{
filtered
.filter(a=>
sameDate(a.appointmentDate,day)
&& appointmentHour(a)===hour.slice(0,2)
)
.map(a=>(

<button
key={a.id}
onClick={()=>setSelected(a)}
className="absolute inset-2 bg-teal-50 rounded-xl text-left p-2"
>

<b>{patientName(a.patientId)}</b>

<div className="text-xs">
{a.appointmentTime}
</div>

<div className="text-xs">
{a.reason}
</div>

</button>

))

}


</div>

))}



</div>

))}


</div>

</div>

</div>

}






{view==="grid" &&

<div className="grid gap-5">

{filtered.map(a=>(

<div
key={a.id}
className="bg-white border rounded-2xl p-6"
onClick={()=>setSelected(a)}
>


<h2 className="font-bold text-xl">
{patientName(a.patientId)}
</h2>


<div className="grid md:grid-cols-4 gap-3 mt-4">

<Info icon={<CalendarDays/>} label="Date" value={a.appointmentDate}/>

<Info icon={<Clock/>} label="Time" value={a.appointmentTime}/>

<Info icon={<PawPrint/>} label="Reason" value={a.reason}/>

<Info icon={<Stethoscope/>} label="Vet" value={vetName(a.assignedVetId)}/>

</div>

</div>

))}

</div>

}





{selected &&

<div className="fixed inset-0 bg-black/30 flex justify-end z-50">

<div className="bg-white w-full max-w-md p-6">

<button onClick={()=>setSelected(null)}>
<X/>
</button>

<h2 className="text-2xl font-bold mt-4">
{patientName(selected.patientId)}
</h2>

<p>Owner: {clientName(selected.clientId)}</p>
<p>Vet: {vetName(selected.assignedVetId)}</p>
<p>Reason: {selected.reason}</p>

</div>

</div>

}




{modal &&

<AddAppointmentModal
practiceId={practice?.id || ""}
createdBy={currentUser?.id || ""}
clients={clients}
patients={patients}
vets={vets}
onClose={()=>setModal(false)}
onSave={addAppointment}
/>

}


</div>

);

}



function Info({icon,label,value}:any){

return <div className="bg-slate-50 rounded-xl p-4">
<div className="flex gap-2 text-sm text-slate-500">
{icon}{label}
</div>
<div className="font-semibold mt-2">{value}</div>
</div>

}
