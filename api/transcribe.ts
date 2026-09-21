import { requireUser } from "./_auth.js";


export const config = {
  api:{
    bodyParser:false
  }
};



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


await requireUser(req);



const apiKey =
process.env.OPENAI_API_KEY;


if(!apiKey){

throw new Error(
"OPENAI_API_KEY missing"
);

}





const chunks:any[]=[];



await new Promise<void>((resolve,reject)=>{


req.on(
"data",
(chunk:any)=>{

chunks.push(chunk);

}
);



req.on(
"end",
()=>resolve()
);



req.on(
"error",
reject
);



});






const audioBuffer =
Buffer.concat(chunks);



console.log(
"RECEIVED CHUNKS:",
chunks.length
);



console.log(
"RECEIVED AUDIO SIZE:",
audioBuffer.length
);





if(audioBuffer.length===0){

throw new Error(
"No audio received"
);

}






const formData =
new FormData();



const file =
new File(

[
audioBuffer

],

"consultation.webm",

{
type:"audio/webm"
}

);





formData.append(
"file",
file
);



formData.append(
"model",
process.env.OPENAI_TRANSCRIPTION_MODEL ||
"gpt-4o-mini-transcribe"
);






const openaiResponse =
await fetch(

"https://api.openai.com/v1/audio/transcriptions",

{


method:"POST",


headers:{


Authorization:
`Bearer ${apiKey}`


},


body:formData


}

);





const text =
await openaiResponse.text();





console.log(
"OPENAI RESPONSE:",
text
);





if(!openaiResponse.ok){

throw new Error(text);

}





const result =
JSON.parse(text);





return res.status(200).json({

text:
result.text || ""

});





}

catch(error:any){


console.error(
"TRANSCRIPTION ERROR:",
error
);



return res.status(500).json({

error:
error.message

});



}



}