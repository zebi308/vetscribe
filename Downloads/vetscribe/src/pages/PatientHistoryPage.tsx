import {
useEffect,
useState
} from "react";


import {
useParams
} from "react-router-dom";


import {
FileText,
Download
} from "lucide-react";


import {
Card
} from "../components/ui/Card";


import {
Button
} from "../components/ui/Button";


import {supabase}
from "../lib/supabase";






export function PatientHistoryPage(){



const {
id
}=useParams();





const [records,setRecords]=
useState<any[]>([]);



const [loading,setLoading]=
useState(true);






useEffect(()=>{


loadHistory();


},[]);







async function loadHistory(){


try{


const {

data:{
session

}

}=await supabase.auth.getSession();






if(!session)
return;







const response =
await fetch(

`/api/patient-history?patient_id=${id}`,

{

headers:{

Authorization:

`Bearer ${session.access_token}`

}

}

);






const data =
await response.json();





setRecords(data);



}

finally{


setLoading(false);


}



}








if(loading){


return (

<div className="p-8">

Loading history...

</div>

);


}








return (

<div className="space-y-6">



<h1 className="text-3xl font-bold">

Medical History

</h1>





{

records.length===0

?

<Card className="p-6">

No previous records found

</Card>



:

records.map(record=>(



<Card

key={record.id}

className="p-6 space-y-4"

>


<div className="flex justify-between">


<div>


<h2 className="font-bold text-lg">

Clinical Record

</h2>


<p className="text-sm text-slate-500">

{

new Date(
record.created_at
).toLocaleDateString()

}

</p>


</div>



<FileText/>




</div>







<div>


<h3 className="font-bold">

Subjective

</h3>


<p>

{

record.soap_record?.subjective
?.presenting_complaint

}

</p>



</div>








<div>


<h3 className="font-bold">

Assessment

</h3>


<p>

{

record.soap_record?.assessment
?.primary_assessment

}

</p>


</div>








<Button>


<Download size={18}/>

Export PDF


</Button>






</Card>



))


}



</div>


);


}