import {
requireUser,
restWrite
} from "./_auth.js";



export default async function handler(
req:any,
res:any
){



if(req.method !== "POST"){


return res.status(405).json({

error:"Method not allowed"

});


}



try{


const ctx =
await requireUser(req);





const body =
req.body;





const {

consultation_id,

patient_id,

client_id,

soap_record

}=body;






const result =
await restWrite(

ctx,

"clinical_records",

"POST",

{

consultation_id,

patient_id,

client_id,

soap_record,

approved_by:
ctx.user.email || ctx.user.id

}

);






return res.status(200).json(

result

);



}

catch(error:any){


console.error(
error
);



return res.status(500).json({

error:error.message

});


}



}