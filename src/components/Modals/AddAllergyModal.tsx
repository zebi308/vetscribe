import {
  useState
} from "react";

import {
  X
} from "lucide-react";

import {
  Allergy
} from "../../types/models";


interface Props {

  patientId:string;

  practiceId:string;

  onClose:()=>void;

  onSave:(allergy:Allergy)=>Promise<void>;

}



export function AddAllergyModal({

  patientId,

  practiceId,

  onClose,

  onSave

}:Props){



  const [form,setForm] = useState({

    allergen:"",

    reaction:"",

    severity:"medium" as
      "low"|"medium"|"high",

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

  if(
    !form.allergen ||
    !form.reaction
  ){

    alert(
      "Allergen and reaction are required."
    );

    return;

  }


  try{

    setSaving(true);


    const allergy:Allergy = {

      id: crypto.randomUUID(),

      practiceId,

      patientId,

      allergen:
        form.allergen,

      reaction:
        form.reaction,

      severity:
        form.severity,

      notes:
        form.notes || undefined,

      createdAt:
        new Date().toISOString()

    };


    console.log(
      "Saving allergy:",
      allergy
    );


    await onSave(allergy);


    console.log(
      "Allergy saved successfully"
    );


    onClose();


  }
  catch(error){

    console.error(
      "Save allergy failed:",
      error
    );


    alert(
      error instanceof Error
      ? error.message
      : "Unable to save allergy"
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

Add Allergy

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

label="Allergen *"

value={form.allergen}

onChange={(v)=>
update("allergen",v)
}

/>



<Input

label="Reaction *"

value={form.reaction}

onChange={(v)=>
update("reaction",v)
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

Severity

</label>


<select

value={form.severity}

onChange={(e)=>
update(
"severity",
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


<option value="low">
Low
</option>


<option value="medium">
Medium
</option>


<option value="high">
High
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
"Save Allergy"
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

onChange

}:{

label:string;

value:string;

onChange:(value:string)=>void;

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