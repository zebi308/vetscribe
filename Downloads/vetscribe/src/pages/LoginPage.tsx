import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Lock,
  Mail,
  LogIn,
  PawPrint
} from "lucide-react";

import { useAppState } from "../lib/AppState";




export function LoginPage(){


const navigate = useNavigate();


const {
login
}=useAppState();



const [email,setEmail]=useState("");

const [password,setPassword]=useState("");

const [error,setError]=useState("");

const [loading,setLoading]=useState(false);







async function handleLogin(
e:React.FormEvent
){

e.preventDefault();


setError("");

setLoading(true);



try{


const success =
await login(
email,
password
);



if(success){

navigate("/dashboard");

}

else{

setError(
"Invalid email or password"
);

}



}

catch(err:any){


console.error(err);


setError(
err.message || "Login failed"
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
">


<div className="
w-full
max-w-md
rounded-2xl
border
border-slate-200
bg-white
p-8
shadow-sm
">


<div className="flex justify-center">

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

Welcome Back

</h1>



<p className="
mt-2
text-center
text-sm
text-slate-500
">

Sign in to your VetScribe account

</p>








<form

onSubmit={handleLogin}

className="
mt-8
space-y-5
"

>






<div>


<label className="
text-sm
font-medium
text-slate-700
">

Email Address

</label>


<div className="
mt-2
flex
items-center
gap-3
rounded-xl
border
border-slate-200
px-4
py-3
">


<Mail size={18} className="text-slate-400"/>


<input

type="email"

required

value={email}

onChange={(e)=>setEmail(e.target.value)}

className="w-full outline-none"

placeholder="doctor@clinic.com"

/>


</div>


</div>







<div>


<label className="
text-sm
font-medium
text-slate-700
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
border-slate-200
px-4
py-3
">


<Lock size={18} className="text-slate-400"/>


<input

type="password"

required

value={password}

onChange={(e)=>setPassword(e.target.value)}

className="w-full outline-none"

placeholder="••••••••"

/>


</div>


</div>







{
error &&

<p className="text-sm text-red-600">

{error}

</p>

}








<button

type="submit"

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
hover:bg-teal-700
disabled:opacity-50
"

>

<LogIn size={18}/>

{
loading
?
"Signing in..."
:
"Login"
}


</button>






</form>








<div className="
mt-6
flex
justify-between
text-sm
">


<Link
to="/forgot-password"
className="text-teal-600"
>

Forgot Password?

</Link>



<Link
to="/register"
className="text-teal-600"
>

Create Account

</Link>


</div>







</div>

</div>

);


}