import { X } from "lucide-react";

export type ToastType =
  | "success"
  | "error"
  | "warning"
  | "info";


export interface ToastItem {

  id:string;

  message:string;

  type:ToastType;

}



export function Toast({
toast,
onRemove
}:{
toast:ToastItem;
onRemove:()=>void;
}){


const styles={

success:"border-green-200 bg-green-50 text-green-800",

error:"border-red-200 bg-red-50 text-red-800",

warning:"border-yellow-200 bg-yellow-50 text-yellow-800",

info:"border-blue-200 bg-blue-50 text-blue-800"

};



return (

<div className={`
flex
items-center
justify-between
gap-4
rounded-xl
border
px-4
py-3
shadow-lg
${styles[toast.type]}
`}>

<span className="text-sm font-medium">
{toast.message}
</span>


<button
onClick={onRemove}
className="rounded p-1 hover:bg-black/5"
>

<X size={16}/>

</button>


</div>

);

}
