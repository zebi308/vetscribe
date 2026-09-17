import { supabase } from "./client";

import type {
  AuditLog,
  Client,
  ClinicalDraft,
  ClinicalNoteVersion,
  Consultation,
  Medicine,
  OwnerSummary,
  Patient,
  Practice,
  Profile
} from "../../types/models";



function db(){

  if(!supabase){

    throw new Error(
      "Supabase is not configured"
    );

  }

  return supabase;

}







export async function loadMembership(
  authUserId:string
):Promise<{
  profile:Profile;
  practice:Practice;
}>{


const {
  data:p,
  error
}=

await db()

.from("profiles")

.select("*")

.eq(
  "auth_user_id",
  authUserId
)

.single();



if(error)

throw error;





const profile:Profile={

id:p.id,

authUserId:p.auth_user_id,

practiceId:p.practice_id || "platform",

firstName:p.first_name,

lastName:p.last_name,

email:p.email,

role:p.role,

professionalRegistrationNumber:
p.professional_registration_number || undefined,

isActive:p.is_active

};







if(
p.role==="super_admin"
&&
!p.practice_id
){


return {


profile,


practice:{

id:"platform",

name:"VetScribe Platform",

slug:"platform",

address:"",

phone:"",

email:"",

primaryColor:"#0f766e",

secondaryColor:"#115e59"

}


};


}








const {

data:practice,

error:practiceError

}

=

await db()

.from("practices")

.select("*")

.eq(
"id",
p.practice_id
)

.single();





if(practiceError)

throw practiceError;








return {


profile,


practice:{

id:practice.id,

name:practice.name,

slug:practice.slug,

address:

[

practice.address_line_1,

practice.address_line_2,

practice.city,

practice.postcode

]

.filter(Boolean)

.join(", "),

phone:

practice.phone || "",

email:

practice.email || "",

primaryColor:

practice.primary_color,

secondaryColor:

practice.secondary_color,

logoUrl:

practice.logo_url || undefined

}


};


}
export async function loadPracticeData(){


console.log("LOADING PRACTICE DATA");



const [

clientsResult,

patientsResult,

consultationsResult,

notesResult,

medicinesResult,

summariesResult,

versionsResult


] = await Promise.all([


db()
.from("clients")
.select("*"),



db()
.from("patients")
.select("*"),



db()
.from("consultations")
.select("*")
.order(
"consultation_date",
{
ascending:false
}
),



db()
.from("clinical_notes")
.select("*"),



db()
.from("medicines")
.select("*")
.order(
"prescribed_date",
{
ascending:false
}
),



db()
.from("owner_summaries")
.select("*")
.order(
"generated_at",
{
ascending:false
}
),



db()
.from("clinical_note_versions")
.select("*")
.order(
"created_at",
{
ascending:false
}


)


]);





console.log(
"CLIENT RESULT",
clientsResult.data,
clientsResult.error
);



console.log(
"PATIENT RESULT",
patientsResult.data,
patientsResult.error
);



console.log(
"CONSULTATION RESULT",
consultationsResult.data,
consultationsResult.error
);


const results=[

clientsResult,

patientsResult,

consultationsResult,

notesResult,

medicinesResult,

summariesResult,

versionsResult

];





for(const result of results){

if(result.error)

throw result.error;

}








const notesMap =

new Map<string,any>(

(notesResult.data || [])

.map(

(note:any)=>[

note.consultation_id,

note

]

)

);









const clients:Client[]=

(clientsResult.data || [])

.map(client=>({


id:client.id,


practiceId:client.practice_id,


firstName:client.first_name,


lastName:client.last_name,


address:

[

client.address_line_1,

client.address_line_2,

client.city

]

.filter(Boolean)

.join(", "),



postcode:client.postcode || "",


phone:client.phone || "",


email:client.email || ""



}));









const patients:Patient[]=

(patientsResult.data || [])

.map(patient=>({


id:patient.id,


practiceId:patient.practice_id,


clientId:patient.client_id,


name:patient.name,


species:patient.species,


breed:patient.breed || "",


sex:

(patient.sex || "Unknown") as Patient["sex"],



neutered:Boolean(patient.neutered),


dateOfBirth:patient.date_of_birth || "",


microchipNumber:

patient.microchip_number || undefined,


colour:

patient.colour || undefined,


weightKg:

Number(patient.weight_kg || 0)



}));









const consultations:Consultation[]=

(consultationsResult.data || [])

.map(item=>{


const note =

notesMap.get(item.id);





return {


id:item.id,


practiceId:item.practice_id,


patientId:item.patient_id,


clientId:item.client_id,


createdBy:item.created_by,


treatingVetId:item.treating_vet_id,


consultationDate:item.consultation_date,


status:item.status,


captureType:item.capture_type,


transcript:item.transcript || "",


startedAt:item.started_at || undefined,


endedAt:item.ended_at || undefined,


updatedAt:item.updated_at,



clinicalNote:

note?.structured_content as ClinicalDraft | undefined,



approvedBy:

note?.approved_by || undefined,


approvedAt:

note?.approved_at || undefined,


version:

Number(note?.version || 0)



};



});









const medicines:Medicine[]=

(medicinesResult.data || [])

.map(medicine=>({


id:medicine.id,


practiceId:medicine.practice_id,


patientId:medicine.patient_id,


clientId:medicine.client_id,


consultationId:

medicine.consultation_id || undefined,


prescribingVetId:

medicine.prescribing_vet_id,


medicineName:

medicine.medicine_name,


medicineCategory:

medicine.medicine_category,


quantity:

String(medicine.quantity),


unit:

medicine.unit || "",


batchNumber:

medicine.batch_number,


prescribedDate:

medicine.prescribed_date,


withdrawalPeriod:

medicine.withdrawal_period || "",


instructions:

medicine.instructions || ""



}));









const ownerSummaries:OwnerSummary[]=

(summariesResult.data || [])

.map(

item=>

item.structured_content as OwnerSummary

)

.filter(Boolean);









const versions:ClinicalNoteVersion[]=

(versionsResult.data || [])

.map(version=>({


id:version.id,


clinicalNoteId:

version.clinical_note_id,


versionNumber:

version.version_number,


content:

version.content_json as ClinicalDraft,


changedBy:

version.changed_by,


changeReason:

version.change_reason,


createdAt:

version.created_at



}));









return {


clients,

patients,

consultations,

medicines,

ownerSummaries,

versions


};



}
export async function loadProfiles():Promise<Profile[]>{


const {

data,

error

}

=

await db()

.from("profiles")

.select("*")

.order(

"last_name",

{

ascending:true

}

);





if(error)

throw error;







return (

data || []

)

.map(profile=>({


id:profile.id,


authUserId:

profile.auth_user_id || undefined,


practiceId:

profile.practice_id || "platform",


firstName:

profile.first_name,


lastName:

profile.last_name,


email:

profile.email,


role:

profile.role,


professionalRegistrationNumber:

profile.professional_registration_number || undefined,


isActive:

profile.is_active



}));



}












export async function loadAuditLogs():Promise<AuditLog[]>{


const {


data,

error


}

=

await db()

.from("audit_logs")

.select("*")

.order(

"created_at",

{

ascending:false

}

)

.limit(200);






if(error)

throw error;







return (

data || []

)

.map(log=>({



id:log.id,



practiceId:

log.practice_id,



actorUserId:

log.actor_user_id || "system",



entityType:

log.entity_type,



entityId:

log.entity_id || "",



action:

log.action,



description:

String(

log.after_json?.description ||

`${log.action} ${log.entity_type}`

),



createdAt:

log.created_at



}));



}
export async function createConsultationRecord(

consultation:Consultation

):Promise<Consultation>{



const {

data,

error

}

=

await db()

.from("consultations")

.insert({


id:consultation.id,


practice_id:

consultation.practiceId,


patient_id:

consultation.patientId,


client_id:

consultation.clientId,


created_by:

consultation.createdBy,


treating_vet_id:

consultation.treatingVetId,


consultation_date:

consultation.consultationDate,


status:

consultation.status,


capture_type:

consultation.captureType,


transcript:

consultation.transcript || "",


started_at:

consultation.startedAt || null,


ended_at:

consultation.endedAt || null,


updated_at:

consultation.updatedAt



})

.select()

.single();







if(error)

throw error;








return {



id:data.id,


practiceId:data.practice_id,


patientId:data.patient_id,


clientId:data.client_id,


createdBy:data.created_by,


treatingVetId:data.treating_vet_id,


consultationDate:data.consultation_date,


status:data.status,


captureType:data.capture_type,


transcript:data.transcript || "",


startedAt:

data.started_at || undefined,


endedAt:

data.ended_at || undefined,


updatedAt:data.updated_at,


version:0



};
}
