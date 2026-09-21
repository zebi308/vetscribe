import {
  useState
} from "react";

import {
  X
} from "lucide-react";

import {
  Vaccination
} from "../../types/models";


interface Props {

  patientId:string;

  practiceId:string;

  onClose:()=>void;

  onSave:(vaccination:Vaccination)=>Promise<void>;

}



export function AddVaccinationModal({
  patientId,
  practiceId,
  onClose,
  onSave
}:Props){


  const [form,setForm] = useState({

    vaccineName:"",

    manufacturer:"",

    batchNumber:"",

    dateGiven:"",

    nextDueDate:"",

    administeredBy:"",

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


    if(!form.vaccineName || !form.dateGiven){

      alert(
        "Vaccine name and date given are required."
      );

      return;

    }



    try{


      setSaving(true);



      const vaccination:Vaccination = {

        id:
          crypto.randomUUID(),


        practiceId,


        patientId,


        vaccineName:
          form.vaccineName,


        manufacturer:
          form.manufacturer || undefined,


        batchNumber:
          form.batchNumber || undefined,


        dateGiven:
          form.dateGiven,


        nextDueDate:
          form.nextDueDate || undefined,


        administeredBy:
          form.administeredBy || undefined,


        notes:
          form.notes || undefined,


        createdAt:
          new Date().toISOString()

      };



      await onSave(vaccination);


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

            Add Vaccination

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
            label="Vaccine Name *"
            value={form.vaccineName}
            onChange={(v)=>update("vaccineName",v)}
          />


          <Input
            label="Manufacturer"
            value={form.manufacturer}
            onChange={(v)=>update("manufacturer",v)}
          />


          <Input
            label="Batch Number"
            value={form.batchNumber}
            onChange={(v)=>update("batchNumber",v)}
          />



          <Input
            type="date"
            label="Date Given *"
            value={form.dateGiven}
            onChange={(v)=>update("dateGiven",v)}
          />



          <Input
            type="date"
            label="Next Due Date"
            value={form.nextDueDate}
            onChange={(v)=>update("nextDueDate",v)}
          />



          <Input
            label="Administered By"
            value={form.administeredBy}
            onChange={(v)=>update("administeredBy",v)}
          />



          <textarea

            value={form.notes}

            onChange={(e)=>
              update(
                "notes",
                e.target.value
              )
            }

            placeholder="Notes"

            className="
              w-full
              rounded-xl
              border
              p-3
              text-sm
              outline-none
            "

            rows={3}

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
              ? "Saving..."
              : "Save Vaccination"
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