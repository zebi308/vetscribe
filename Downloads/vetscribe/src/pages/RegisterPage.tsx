import { 
useState 
} from "react";


import {
Link,
useNavigate
} from "react-router-dom";


import {
Building2,
Mail,
Lock,
User,
PawPrint,
UserRoundPlus
} from "lucide-react";


import {
useAppState
} from "../lib/AppState";





export function RegisterPage(){



const navigate = useNavigate();


const {
register
}=useAppState();





const [form,setForm]=useState({

firstName:"",

lastName:"",

practiceName:"",

email:"",

password:"",

role:"vet"

});





const [error,setError]=useState("");

const [loading,setLoading]=useState(false);









function updateField(
field:string,
value:string
){


setForm({

...form,

[field]:value

});


}









async function handleSubmit(
e:React.FormEvent
){


e.preventDefault();


setError("");

setLoading(true);



try{


await register(form);



navigate("/dashboard");


}

catch(err:any){


console.error(err);


setError(
err.message ||
"Registration failed"
);


}

finally{


setLoading(false);


}


}









return (


<div className="
min-h-screen
flex
items-center
justify-center
bg-slate-50
px-4
py-10
">






<div className="
w-full
max-w-lg
rounded-2xl
border
border-slate-200
bg-white
p-8
shadow-sm
">







<div className="
flex
justify-center
">


<div className="
grid
h-14
w-14
place-items-center
rounded-xl
bg-teal-600
text-white
">

<PawPrint size={28}/>

</div>


</div>








<h1 className="
mt-6
text-center
text-3xl
font-bold
text-slate-900
">

Create VetScribe Account

</h1>



<p className="
mt-2
text-center
text-sm
text-slate-500
">

Start your veterinary practice workspace

</p>








<form

onSubmit={handleSubmit}

className="
mt-8
space-y-5
"

>







<div className="
grid
gap-4
md:grid-cols-2
">



<div>


<label className="
text-sm
font-medium
">

First Name

</label>



<div className="
mt-2
flex
items-center
gap-3
rounded-xl
border
px-4
py-3
">


<User size={17}/>



<input

required

value={form.firstName}

onChange={(e)=>
updateField(
"firstName",
e.target.value
)
}

className="w-full outline-none"

placeholder="James"

/>


</div>


</div>








<div>


<label className="
text-sm
font-medium
">

Last Name

</label>



<input

required

value={form.lastName}

onChange={(e)=>
updateField(
"lastName",
e.target.value
)
}

className="
mt-2
w-full
rounded-xl
border
px-4
py-3
outline-none
"

placeholder="Wilson"

/>


</div>



</div>









<div>


<label className="
text-sm
font-medium
">

Practice Name

</label>



<div className="
mt-2
flex
items-center
gap-3
rounded-xl
border
px-4
py-3
">


<Building2 size={17}/>



<input

required

value={form.practiceName}

onChange={(e)=>
updateField(
"practiceName",
e.target.value
)
}

className="w-full outline-none"

placeholder="Oakwood Veterinary Practice"

/>


</div>


</div>









<div>


<label className="
text-sm
font-medium
">

Email

</label>



<div className="
mt-2
flex
items-center
gap-3
rounded-xl
border
px-4
py-3
">


<Mail size={17}/>



<input

required

type="email"

value={form.email}

onChange={(e)=>
updateField(
"email",
e.target.value
)
}

className="w-full outline-none"

placeholder="doctor@clinic.com"

/>


</div>


</div>









<div>


<label className="
text-sm
font-medium
">

Password

</label>



<div className="
mt-2
flex
items-center
gap-3
rounded-xl
border
px-4
py-3
">


<Lock size={17}/>



<input

required

type="password"

value={form.password}

onChange={(e)=>
updateField(
"password",
e.target.value
)
}

className="w-full outline-none"

placeholder="Minimum 6 characters"

/>


</div>


</div>









<div>


<label className="
text-sm
font-medium
">

Account Type

</label>



<div className="
mt-3
grid
gap-3
md:grid-cols-2
">



<label className="
flex
cursor-pointer
gap-3
rounded-xl
border
p-4
">


<input

type="radio"

name="role"

value="vet"

checked={
form.role==="vet"
}

onChange={(e)=>
updateField(
"role",
e.target.value
)
}


/>



<div>


<p className="font-medium">

Veterinarian

</p>


<p className="text-xs text-slate-500">

Clinical access

</p>


</div>


</label>







<label className="
flex
cursor-pointer
gap-3
rounded-xl
border
p-4
">


<input

type="radio"

name="role"

value="practice_manager"

checked={
form.role==="practice_manager"
}

onChange={(e)=>
updateField(
"role",
e.target.value
)
}


/>



<div>


<p className="font-medium">

Practice Manager

</p>


<p className="text-xs text-slate-500">

Manage practice

</p>


</div>


</label>





</div>


</div>









{
error &&

<p className="
text-sm
text-red-600
">

{error}

</p>

}








<button

disabled={loading}

className="
flex
w-full
items-center
justify-center
gap-2
rounded-xl
bg-teal-600
py-3
font-semibold
text-white
disabled:opacity-50
"

>


<UserRoundPlus size={18}/>


{

loading

?

"Creating Account..."

:

"Create Account"

}



</button>






</form>








<p className="
mt-6
text-center
text-sm
text-slate-500
">

Already have an account?


<Link

to="/login"

className="
ml-2
text-teal-600
"

>

Login

</Link>


</p>






</div>


</div>


);


}