import {
  useState
} from "react";

import {
  X
} from "lucide-react";

import {
  Prescription
} from "../../types/models";


interface Props {

  patientId:string;

  practiceId:string;

  clientId:string;

  consultationId?:string;

  prescribingVetId:string;

  onClose:()=>void;

  onSave:(prescription:Prescription)=>Promise<void>;

}



export function AddPrescriptionModal({

  patientId,

  practiceId,

  clientId,

  consultationId,

  prescribingVetId,

  onClose,

  onSave

}:Props){



  const [form,setForm] = useState({

    medicineName:"",

    dose:"",

    route:"",

    frequency:"",

    duration:"",

    instructions:"",

    prescribedDate:"",

    status:
      "active" as
      "active"|
      "completed"|
      "cancelled"

  });



  const [saving,setSaving] =
    useState(false);





  function update(
    field:string,
    value:string
  ){

    setForm(prev=>({

      ...prev,

      [field]:value

    }));

  }





  async function handleSubmit(){


    if(!form.medicineName){

      alert(
        "Medicine name is required."
      );

      return;

    }



    try{


      setSaving(true);



      const prescription:Prescription = {

        id:
          crypto.randomUUID(),


        practiceId,


        patientId,


        clientId,


        consultationId,


        prescribingVetId,


        medicineName:
          form.medicineName,


        dose:
          form.dose || undefined,


        route:
          form.route || undefined,


        frequency:
          form.frequency || undefined,


        duration:
          form.duration || undefined,


        instructions:
          form.instructions,


        prescribedDate:
          form.prescribedDate ||
          new Date().toISOString(),


        status:
          form.status

      };



      await onSave(prescription);


      onClose();


    }
    finally{

      setSaving(false);

    }


  }





return (

<div className="
fixed
inset-0
z-50
flex
items-center
justify-center
bg-black/40
p-4
">


<div className="
w-full
max-w-xl
rounded-2xl
bg-white
p-6
shadow-xl
">



<div className="
flex
items-center
justify-between
border-b
pb-4
">


<h2 className="
text-xl
font-bold
text-slate-900
">

Add Prescription

</h2>


<button

onClick={onClose}

className="
rounded-lg
p-2
hover:bg-slate-100
"

>

<X size={20}/>

</button>


</div>





<div className="
mt-5
space-y-4
">



<Input

label="Medicine Name *"

value={form.medicineName}

onChange={(v)=>
update(
"medicineName",
v
)
}

/>





<Input

label="Dose"

value={form.dose}

onChange={(v)=>
update(
"dose",
v
)
}

/>





<Input

label="Route"

placeholder="Oral / Injection / Topical"

value={form.route}

onChange={(v)=>
update(
"route",
v
)
}

/>





<Input

label="Frequency"

placeholder="Once daily / Twice daily"

value={form.frequency}

onChange={(v)=>
update(
"frequency",
v
)
}

/>





<Input

label="Duration"

placeholder="5 days"

value={form.duration}

onChange={(v)=>
update(
"duration",
v
)
}

/>





<Input

label="Prescribed Date"

type="date"

value={form.prescribedDate}

onChange={(v)=>
update(
"prescribedDate",
v
)
}

/>






<div>

<label className="
mb-1
block
text-sm
font-medium
text-slate-700
">

Status

</label>


<select

value={form.status}

onChange={(e)=>
update(
"status",
e.target.value
)
}

className="
w-full
rounded-xl
border
border-slate-300
px-3
py-2
text-sm
"

>


<option value="active">
Active
</option>


<option value="completed">
Completed
</option>


<option value="cancelled">
Cancelled
</option>


</select>


</div>





<textarea

value={form.instructions}

onChange={(e)=>
update(
"instructions",
e.target.value
)
}

placeholder="Instructions"

rows={3}

className="
w-full
rounded-xl
border
border-slate-300
p-3
text-sm
outline-none
"

/>



</div>






<div className="
mt-6
flex
justify-end
gap-3
">


<button

onClick={onClose}

className="
rounded-xl
border
px-5
py-2
text-sm
"

>

Cancel

</button>





<button

onClick={handleSubmit}

disabled={saving}

className="
rounded-xl
bg-teal-600
px-5
py-2
text-sm
font-semibold
text-white
disabled:opacity-50
"

>

{
saving
?
"Saving..."
:
"Save Prescription"
}


</button>


</div>




</div>


</div>

);


}





function Input({

label,

value,

onChange,

placeholder,

type="text"

}:{

label:string;

value:string;

onChange:(value:string)=>void;

placeholder?:string;

type?:string;

}){


return (

<div>

<label className="
mb-1
block
text-sm
font-medium
text-slate-700
">

{label}

</label>


<input

type={type}

value={value}

placeholder={placeholder}

onChange={(e)=>
onChange(e.target.value)
}

className="
w-full
rounded-xl
border
border-slate-300
px-3
py-2
text-sm
outline-none
"

/>

</div>

);

}