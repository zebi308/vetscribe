import {
createContext,
useContext,
useState,
ReactNode
} from "react";

import {
Toast,
ToastItem,
ToastType
} from "../components/ui/Toast";


interface ToastContextType {

showToast:(message:string,type?:ToastType)=>void;

}



const ToastContext =
createContext<ToastContextType | null>(null);



export function ToastProvider({
children
}:{
children:ReactNode;
}){


const [toasts,setToasts]=useState<ToastItem[]>([]);



function showToast(
message:string,
type:ToastType="info"
){


const id =
Date.now().toString();


setToasts(prev=>[
...prev,
{
id,
message,
type
}
]);


setTimeout(()=>{

setToasts(prev=>
prev.filter(item=>item.id!==id)
);

},4000);


}



function removeToast(id:string){

setToasts(prev=>
prev.filter(item=>item.id!==id)
);

}



return (

<ToastContext.Provider
value={{
showToast
}}
>


{children}



<div className="
fixed
right-5
top-5
z-[100]
space-y-3
">

{

toasts.map(toast=>(

<Toast

key={toast.id}

toast={toast}

onRemove={()=>removeToast(toast.id)}

/>

))

}

</div>



</ToastContext.Provider>

);


}



export function useToast(){

const context =
useContext(ToastContext);


if(!context){

throw new Error(
"useToast must be used inside ToastProvider"
);

}


return context;

}
