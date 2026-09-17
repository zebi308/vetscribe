import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

import { useAppState } from "../lib/AppState";



export function AddClientPage(){


const navigate = useNavigate();


const {
  practice,
  addClient
}=useAppState();





const [form,setForm]=useState({

firstName:"",
lastName:"",
email:"",
phone:"",
postcode:""

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

return;

}



try{


setLoading(true);



await addClient({

id:crypto.randomUUID(),

practiceId:practice.id,

firstName:form.firstName,

lastName:form.lastName,

email:form.email,

phone:form.phone,

postcode:form.postcode,

address:""

});





navigate("/dashboard/clients");



}

catch(error){

console.error(
"ADD CLIENT ERROR",
error
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

onClick={()=>navigate("/dashboard/clients")}

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

Add Client

</h1>


<p className="mt-2 text-slate-500">

Create a new pet owner record.

</p>


</div>



</div>









<form

onSubmit={handleSubmit}

className="
max-w-2xl
space-y-6
rounded-2xl
border
border-slate-200
bg-white
p-8
shadow-sm
"

>





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

First Name

</label>



<input

required

value={form.firstName}

onChange={(e)=>
handleChange(
"firstName",
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

Last Name

</label>



<input

required

value={form.lastName}

onChange={(e)=>
handleChange(
"lastName",
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









<div>


<label className="
text-sm
font-medium
text-slate-700
">

Email

</label>



<input

type="email"

value={form.email}

onChange={(e)=>
handleChange(
"email",
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

Phone

</label>



<input

value={form.phone}

onChange={(e)=>
handleChange(
"phone",
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

Postcode

</label>



<input

value={form.postcode}

onChange={(e)=>
handleChange(
"postcode",
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
"Save Client"
}


</button>






</form>








</div>


);


}