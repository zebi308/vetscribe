import {
  useState
} from "react";

import {
  X
} from "lucide-react";

import {
  Condition
} from "../../types/models";


interface Props {

  patientId:string;

  practiceId:string;

  onClose:()=>void;

  onSave:(condition:Condition)=>Promise<void>;

}



export function AddConditionModal({

  patientId,

  practiceId,

  onClose,

  onSave

}:Props){



  const [form,setForm] = useState({

    name:"",

    diagnosisDate:"",

    status:
      "active" as
      "active"|
      "resolved"|
      "chronic"|
      "monitoring",

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





  async function handleSubmit(){


    if(!form.name){

      alert(
        "Condition name is required."
      );

      return;

    }



    try{


      setSaving(true);



      const condition:Condition = {

        id:
          crypto.randomUUID(),


        practiceId,


        patientId,


        name:
          form.name,


        diagnosisDate:
          form.diagnosisDate || undefined,


        status:
          form.status,


        notes:
          form.notes || undefined,


        createdAt:
          new Date().toISOString()

      };



      await onSave(condition);


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

Add Medical Condition

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

label="Condition Name *"

value={form.name}

onChange={(v)=>
update("name",v)
}

/>





<Input

label="Diagnosis Date"

type="date"

value={form.diagnosisDate}

onChange={(v)=>
update("diagnosisDate",v)
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


<option value="resolved">
Resolved
</option>


<option value="chronic">
Chronic
</option>


<option value="monitoring">
Monitoring
</option>


</select>


</div>





<textarea

value={form.notes}

onChange={(e)=>
update(
"notes",
e.target.value
)
}

placeholder="Notes"

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
"Save Condition"
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

}:{

label:string;

value:string;

onChange:(value:string)=>void;

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