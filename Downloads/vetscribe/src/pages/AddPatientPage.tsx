import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

import { useAppState } from "../lib/AppState";
import { useToast } from "../lib/ToastContext";



export function AddPatientPage(){



const navigate = useNavigate();



const {
  practice,
  clients,
  addPatient
}=useAppState();


const {
showToast
}=useToast();







const [form,setForm]=useState({

clientId:"",
name:"",
species:"Dog",
breed:"",
sex:"Unknown",
dateOfBirth:"",
weightKg:"",
colour:""

});





const [loading,setLoading]=useState(false);








function handleChange(
field:string,
value:string
){


setForm(prev=>({

...prev,

[field]:value

}));


}









async function handleSubmit(
e:React.FormEvent
){


e.preventDefault();



if(!practice){

console.error(
"Practice not loaded"
);

showToast(
"Practice not loaded. Please try again.",
"error"
);

return;

}



if(!form.clientId){

showToast(
"Please select a client.",
"error"
);

return;

}





try{


setLoading(true);





await addPatient({

id:crypto.randomUUID(),

practiceId:practice.id,

clientId:form.clientId,

name:form.name,

species:form.species,

breed:form.breed,

sex:form.sex as any,

neutered:false,

dateOfBirth:form.dateOfBirth,

microchipNumber:undefined,

colour:form.colour,

weightKg:Number(form.weightKg || 0)

});


showToast(
"Patient added successfully.",
"success"
);






navigate("/dashboard/patients");



}

catch(error){


console.error(
"ADD PATIENT ERROR",
error
);


showToast(
"Unable to create patient.",
"error"
);



}

finally{


setLoading(false);


}



}









return (

<div className="space-y-8">






<div className="
flex
items-center
gap-4
">


<button

type="button"

onClick={()=>navigate("/dashboard/patients")}

className="
rounded-xl
p-2
hover:bg-slate-100
"

>

<ArrowLeft size={22}/>

</button>







<div>


<h1 className="text-3xl font-bold text-slate-900">

Add Patient

</h1>



<p className="mt-2 text-slate-500">

Create a new animal record.

</p>



</div>




</div>









<form

onSubmit={handleSubmit}

className="
max-w-3xl
space-y-6
rounded-2xl
border
border-slate-200
bg-white
p-8
shadow-sm
"

>









<div>


<label className="
text-sm
font-medium
text-slate-700
">

Owner / Client

</label>



<select

required

value={form.clientId}

onChange={(e)=>
handleChange(
"clientId",
e.target.value
)
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

>


<option value="">

Select client

</option>



{

clients.map(client=>(


<option

key={client.id}

value={client.id}

>

{client.firstName} {client.lastName}

</option>


))


}



</select>



</div>









<div className="
grid
gap-5
md:grid-cols-2
">





<div>


<label className="
text-sm
font-medium
text-slate-700
">

Patient Name

</label>



<input

required

value={form.name}

onChange={(e)=>
handleChange(
"name",
e.target.value
)
}

placeholder="e.g Max"

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


<label className="
text-sm
font-medium
text-slate-700
">

Species

</label>



<select

value={form.species}

onChange={(e)=>
handleChange(
"species",
e.target.value
)
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

>


<option>

Dog

</option>


<option>

Cat

</option>


<option>

Rabbit

</option>


<option>

Other

</option>



</select>



</div>



</div>









<div className="
grid
gap-5
md:grid-cols-2
">





<div>


<label className="
text-sm
font-medium
text-slate-700
">

Breed

</label>



<input

value={form.breed}

onChange={(e)=>
handleChange(
"breed",
e.target.value
)
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


<label className="
text-sm
font-medium
text-slate-700
">

Sex

</label>



<select

value={form.sex}

onChange={(e)=>
handleChange(
"sex",
e.target.value
)
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

>


<option>

Unknown

</option>


<option>

Male

</option>


<option>

Female

</option>



</select>



</div>



</div>









<div className="
grid
gap-5
md:grid-cols-3
">





<div>


<label className="
text-sm
font-medium
text-slate-700
">

Date of Birth

</label>



<input

type="date"

value={form.dateOfBirth}

onChange={(e)=>
handleChange(
"dateOfBirth",
e.target.value
)
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


<label className="
text-sm
font-medium
text-slate-700
">

Weight KG

</label>



<input

type="number"

value={form.weightKg}

onChange={(e)=>
handleChange(
"weightKg",
e.target.value
)
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


<label className="
text-sm
font-medium
text-slate-700
">

Colour

</label>



<input

value={form.colour}

onChange={(e)=>
handleChange(
"colour",
e.target.value
)
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



</div>









<button

type="submit"

disabled={loading}

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
disabled:opacity-50
"

>


<Save size={18}/>


{

loading

?

"Saving..."

:

"Save Patient"

}



</button>






</form>






</div>


);


}