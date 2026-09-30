import {
  FileText,
  Plus,
  Edit3,
  CheckCircle2,
  ClipboardList,
  MoreHorizontal
} from "lucide-react";

import { useState } from "react";



type Template = {
  id: string;
  name: string;
  type: string;
  category: string;
  description: string;
  status: "Active" | "Draft";
};

const emptyForm = {
  name: "",
  type: "",
  category: "",
  description: ""
};

const defaultTemplates: Template[] = [
  {
    id: "default-soap",
    name: "SOAP Consultation Note",
    type: "Consultation",
    category: "Clinical Notes",
    description: "Subjective, Objective, Assessment and Plan structure for routine consultations.",
    status: "Active"
  },
  {
    id: "default-vaccination",
    name: "Vaccination Record",
    type: "Preventive Care",
    category: "Clinical Notes",
    description: "Records vaccine type, batch number, date given and next due date.",
    status: "Active"
  },
  {
    id: "default-discharge",
    name: "Post-Surgery Discharge",
    type: "Surgery",
    category: "Client Communication",
    description: "Aftercare instructions and warning signs to send home with the owner.",
    status: "Active"
  },
  {
    id: "default-dental",
    name: "Dental Procedure Note",
    type: "Dental",
    category: "Clinical Notes",
    description: "Dental grading, extractions performed and follow-up plan.",
    status: "Draft"
  }
];

export function TemplatesPage(){

  const [templates, setTemplates] = useState<Template[]>(defaultTemplates);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  function editTemplate(template: Template){
    setEditingId(template.id);
    setForm({
      name: template.name,
      type: template.type,
      category: template.category,
      description: template.description
    });
    setShowForm(true);
  }

  function saveTemplate(){
    if(!form.name.trim()) return;

    if(editingId){
      setTemplates(
        templates.map((t)=>
          t.id === editingId ? { ...t, ...form } : t
        )
      );
    }else{
      setTemplates([
        ...templates,
        {
          id: String(Date.now()),
          ...form,
          status: "Active"
        }
      ]);
    }

    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  }












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

onClick={()=>{ setEditingId(null); setForm(emptyForm); setShowForm(true); }}

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









{showForm && (
<div className="rounded-2xl border bg-white p-6 space-y-4">
<h2 className="text-xl font-semibold">{editingId ? "Edit Template" : "New Template"}</h2>
<input className="w-full rounded-lg border p-3" placeholder="Template name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
<input className="w-full rounded-lg border p-3" placeholder="Type" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}/>
<input className="w-full rounded-lg border p-3" placeholder="Category" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}/>
<textarea className="w-full rounded-lg border p-3" placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
<div className="flex gap-3"><button onClick={saveTemplate} className="rounded-lg bg-teal-600 px-5 py-2 text-white">Save</button><button onClick={()=>{ setShowForm(false); setEditingId(null); setForm(emptyForm); }} className="rounded-lg border px-5 py-2">Cancel</button></div>
</div>
)}

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


<p className="text-2xl font-bold">{templates.length}</p>


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


<p className="text-2xl font-bold">{templates.filter((t:any)=>t.status==="Active").length}</p>


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


<p className="text-2xl font-bold">{new Set(templates.map((t:any)=>t.category)).size}</p>


</div>


</div>


</div>



</div>









{/* TEMPLATE LIST */}



<div className="grid gap-5 lg:grid-cols-2">



{

templates.map((template)=>(



<div

key={template.id}

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
onClick={()=>editTemplate(template)}
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