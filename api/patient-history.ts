import {
requireUser,
restGet
} from "./_auth.js";


export default async function handler(
req:any,
res:any
){


if(req.method !== "GET"){

return res.status(405).json({

error:"Method not allowed"

});

}



try{


const ctx =
await requireUser(req);



const patientId =
req.query.patient_id;



if(!patientId){

throw new Error(
"Patient ID required"
);

}





const records =
await restGet<any[]>(

ctx,

`clinical_records?patient_id=eq.${patientId}&order=created_at.desc`

);





return res.status(200).json(records);



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