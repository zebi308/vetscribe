import {
  useState
} from "react";

import {
  X
} from "lucide-react";

import {
  Appointment
} from "../../types/models";



interface Props {

  practiceId:string;

  createdBy:string;

  clients:any[];

  patients:any[];

  vets:any[];

  onClose:()=>void;

  onSave:(appointment:Appointment)=>Promise<void>;

}



export function AddAppointmentModal({

  practiceId,

  createdBy,

  clients,

  patients,

  vets,

  onClose,

  onSave

}:Props){



  const [form,setForm] = useState({

    clientId:"",

    patientId:"",

    assignedVetId:"",

    appointmentDate:"",

    appointmentTime:"",

    reason:"",

    notes:""

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





  async function handleSave(){


    if(
      !form.clientId ||
      !form.patientId ||
      !form.appointmentDate ||
      !form.appointmentTime ||
      !form.reason
    ){

      alert(
        "Please fill all required fields."
      );

      return;

    }



    try{


      setSaving(true);



      const appointment:Appointment = {

        id:
          crypto.randomUUID(),


        practiceId,


        patientId:
          form.patientId,


        clientId:
          form.clientId,


        assignedVetId:
          form.assignedVetId,


        appointmentDate:
          form.appointmentDate,


        appointmentTime:
          form.appointmentTime,


        reason:
          form.reason,


        notes:
          form.notes || undefined,


        status:
          "scheduled",


        createdBy,


        createdAt:
          new Date().toISOString(),


        updatedAt:
          new Date().toISOString()

      };



      await onSave(
        appointment
      );


      onClose();


    }

    catch(error){

      console.error(
        error
      );


      alert(
        error instanceof Error
        ? error.message
        : "Unable to save appointment"
      );

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
justify-between
border-b
pb-4
">


<h2 className="
text-xl
font-bold
">

Create Appointment

</h2>


<button
onClick={onClose}
>

<X/>

</button>


</div>





<div className="
mt-5
space-y-4
">



<Select

label="Client"

value={form.clientId}

onChange={(v:string)=>
update(
"clientId",
v
)}

options={
clients.map(c=>({

value:c.id,

label:
`${c.firstName} ${c.lastName}`

}))
}

/>




<Select

label="Patient"

value={form.patientId}

onChange={(v:string)=>
update(
"patientId",
v
)}

options={
patients
.filter(
p=>p.clientId===form.clientId
)
.map(p=>({

value:p.id,

label:p.name

}))
}

/>





<Select

label="Assigned Vet"

value={form.assignedVetId}

onChange={(v:string)=>
update(
"assignedVetId",
v
)}

options={
vets.map(v=>({

value:v.id,

label:
`${v.firstName} ${v.lastName}`

}))
}

/>





<Input

label="Date"

type="date"

value={form.appointmentDate}

onChange={(v:string)=>
update(
"appointmentDate",
v
)}

/>




<Input

label="Time"

type="time"

value={form.appointmentTime}

onChange={(v:string)=>
  update(
    "appointmentTime",
    v
  )
}

/>




<Input

label="Reason"

value={form.reason}

onChange={(v:string)=>
update(
"reason",
v
)}

/>




<textarea

placeholder="Notes"

value={form.notes}

onChange={(e)=>
update(
"notes",
e.target.value
)
}

className="
w-full
rounded-xl
border
p-3
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
"

>

Cancel

</button>



<button

disabled={saving}

onClick={handleSave}

className="
rounded-xl
bg-teal-600
px-5
py-2
font-semibold
text-white
"

>

{
saving
?
"Saving..."
:
"Create Appointment"
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

type="text"

}:any){


return (

<div>

<label className="
block
text-sm
font-medium
mb-1
">

{label}

</label>


<input

type={type}

value={value}

onChange={(e)=>
onChange(e.target.value)
}

className="
w-full
rounded-xl
border
px-3
py-2
"

/>

</div>

);

}







function Select({

label,

value,

onChange,

options

}:any){


return (

<div>


<label className="
block
text-sm
font-medium
mb-1
">

{label}

</label>


<select

value={value}

onChange={(e)=>
onChange(e.target.value)
}

className="
w-full
rounded-xl
border
px-3
py-2
"

>


<option value="">

Select {label}

</option>


{

options.map((o:any)=>(

<option

key={o.value}

value={o.value}

>

{o.label}

</option>


))

}


</select>


</div>

);

}