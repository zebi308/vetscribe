import {
  useState
} from "react";

import {
  Mail,
  ArrowLeft
} from "lucide-react";

import {
  Link
} from "react-router-dom";

import {
  useToast
} from "../lib/ToastContext";

import {
  supabase
} from "../lib/supabase";



export function ForgotPasswordPage(){


const {
showToast
}=useToast();



const [email,setEmail]=useState("");

const [loading,setLoading]=useState(false);





async function handleReset(){

setLoading(true);


try{


if(!email.trim()){

showToast(
"Please enter your email address.",
"error"
);

return;

}



const {
error
}=await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${window.location.origin}/reset-password`,
});



if(error){

throw error;

}



showToast(
"Password reset link sent. Please check your email.",
"success"
);



}

catch(error:any){


console.error(
"Password reset error:",
error
);



showToast(
error?.message || "Unable to send reset email.",
"error"
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



<div className="
mx-auto
grid
h-14
w-14
place-items-center
rounded-xl
bg-teal-50
text-teal-600
">

<Mail size={28}/>

</div>





<h1 className="
mt-6
text-center
text-2xl
font-bold
text-slate-900
">

Forgot Password?

</h1>



<p className="
mt-3
text-center
text-sm
text-slate-500
">

Enter your email and we will send you a password reset link.

</p>





<div className="mt-6">


<label className="
text-sm
font-medium
text-slate-700
">

Email Address

</label>


<input

type="email"

value={email}

onChange={(e)=>setEmail(e.target.value)}

onKeyDown={(e)=>{

if(e.key==="Enter"){

handleReset();

}

}}

placeholder="vet@example.com"

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





<button

onClick={handleReset}

disabled={loading}

className="
mt-6
w-full
rounded-xl
bg-teal-600
py-3
font-semibold
text-white
hover:bg-teal-700
disabled:opacity-50
"

>

{
loading
?
"Sending..."
:
"Send Reset Link"
}


</button>






<Link

to="/login"

className="
mt-6
flex
items-center
justify-center
gap-2
text-sm
font-medium
text-teal-600
"

>

<ArrowLeft size={16}/>

Back to Login

</Link>



</div>


</div>

);


}