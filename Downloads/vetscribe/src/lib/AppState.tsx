import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from "react";


import { supabase } from "./supabase/client";


import {
  loadMembership,
  loadPracticeData,
  loadAuditLogs,
  loadProfiles
} from "./supabase/repository";


import type {
  Profile,
  Practice,
  Client,
  Patient,
  Consultation,
  Medicine,
  OwnerSummary,
  ClinicalNoteVersion,
  AuditLog,
  ClinicalDraft
} from "../types/models";





interface AppStateContextType {


  currentUser: Profile | null;

  practice: Practice | null;



  profiles: Profile[];


  clients: Client[];

  patients: Patient[];

  consultations: Consultation[];

  medicines: Medicine[];

  ownerSummaries: OwnerSummary[];

  versions: ClinicalNoteVersion[];

  auditLogs: AuditLog[];




  login(
    email:string,
    password:string
  ):Promise<boolean>;



  register(
    data:any
  ):Promise<void>;



  logout():Promise<void>;



  refreshData():Promise<void>;





  createConsultation(
    patientId:string
  ):string;



  updateConsultation(
    id:string,
    changes:Partial<Consultation>
  ):Promise<void>;



  saveDraft(
    id:string,
    draft:ClinicalDraft
  ):Promise<void>;



  approveConsultation(
    id:string,
    draft:ClinicalDraft,
    reason?:string
  ):Promise<void>;



  addOwnerSummary(
    summary:OwnerSummary
  ):Promise<void>;



  updateOwnerSummary(
    id:string,
    changes:Partial<OwnerSummary>
  ):Promise<void>;



  addMedicine(
    medicine:Medicine
  ):Promise<void>;



}








const AppStateContext =
createContext<AppStateContextType | undefined>(
undefined
);









export function AppStateProvider({
children
}:{
children:ReactNode
}){



const [currentUser,setCurrentUser]
=
useState<Profile|null>(null);



const [practice,setPractice]
=
useState<Practice|null>(null);




const [profiles,setProfiles]
=
useState<Profile[]>([]);



const [clients,setClients]
=
useState<Client[]>([]);



const [patients,setPatients]
=
useState<Patient[]>([]);



const [consultations,setConsultations]
=
useState<Consultation[]>([]);



const [medicines,setMedicines]
=
useState<Medicine[]>([]);



const [ownerSummaries,setOwnerSummaries]
=
useState<OwnerSummary[]>([]);



const [versions,setVersions]
=
useState<ClinicalNoteVersion[]>([]);



const [auditLogs,setAuditLogs]
=
useState<AuditLog[]>([]);







useEffect(()=>{

restoreSession();

},[]);









async function restoreSession(){


if(!supabase)

return;




const {

data

}
=
await supabase.auth.getSession();





if(data.session?.user){

await loadUser(
data.session.user.id
);

}



}









async function loadUser(
authUserId:string
){


const membership =
await loadMembership(
authUserId
);



setCurrentUser(
membership.profile
);



setPractice(
membership.practice
);



await loadAppData();



}









async function loadAppData(){


try{


const data =
await loadPracticeData();



setClients(
data.clients
);



setPatients(
data.patients
);



setConsultations(
data.consultations
);



setMedicines(
data.medicines
);



setOwnerSummaries(
data.ownerSummaries
);



setVersions(
data.versions
);



const logs =
await loadAuditLogs();



setAuditLogs(
logs
);



const allProfiles =
await loadProfiles();



setProfiles(
allProfiles
);



}

catch(error){

console.error(
"DATA LOAD ERROR",
error
);

}



}
async function login(
email:string,
password:string
):Promise<boolean>{


if(!supabase)

return false;



const {

data,

error

}
=
await supabase.auth.signInWithPassword({

email,

password

});



if(error){

console.error(
"LOGIN ERROR",
error
);

return false;

}



if(data.user){

await loadUser(
data.user.id
);

}



return true;


}









async function register(
form:any
):Promise<void>{


if(!supabase)

throw new Error(
"Supabase not configured"
);





const {

data:userData,

error:userError

}
=
await supabase.auth.signUp({

email:form.email,

password:form.password

});





if(userError)

throw userError;




if(!userData.user)

throw new Error(
"No auth user returned"
);






let {

data:{
session
}

}
=
await supabase.auth.getSession();





if(!session){


const retry =
await supabase.auth.signInWithPassword({

email:form.email,

password:form.password

});


session =
retry.data.session;


}






if(!session)

throw new Error(
"No active session"
);







const slug =

form.practiceName

.toLowerCase()

.trim()

.replace(/\s+/g,"-")

+

"-"

+

Date.now();









const {

data:practiceData,

error:practiceError

}

=
await supabase

.from("practices")

.insert({

name:form.practiceName,

slug,

subdomain:slug,

address_line_1:"",

city:"",

postcode:"",

phone:"",

email:form.email

})

.select()

.single();







if(practiceError)

throw practiceError;








const {

error:profileError

}

=
await supabase

.from("profiles")

.insert({

auth_user_id:userData.user.id,

practice_id:practiceData.id,

first_name:form.firstName,

last_name:form.lastName,

email:form.email,

role:form.role,

is_active:true

});







if(profileError)

throw profileError;






await loadUser(
userData.user.id
);



}









async function logout(){


if(supabase){

await supabase.auth.signOut();

}



setCurrentUser(null);

setPractice(null);

setProfiles([]);

setClients([]);

setPatients([]);

setConsultations([]);

setMedicines([]);

setOwnerSummaries([]);

setVersions([]);

setAuditLogs([]);



}









function createConsultation(
patientId:string
):string{


if(!practice || !currentUser)

throw new Error(
"User not loaded"
);



const patient =
patients.find(
p=>p.id===patientId
);



if(!patient)

throw new Error(
"Patient not found"
);



const client =
clients.find(
c=>c.id===patient.clientId
);



if(!client)

throw new Error(
"Client not found"
);



const id =
crypto.randomUUID();



const consultation:Consultation={

id,

practiceId:practice.id,

patientId,

clientId:client.id,

createdBy:currentUser.id,

treatingVetId:currentUser.id,

consultationDate:
new Date().toISOString(),

status:"draft",

captureType:"typed",

transcript:"",

updatedAt:
new Date().toISOString(),

version:0

};






setConsultations(
prev=>[
consultation,
...prev
]
);





return id;



}









async function updateConsultation(
id:string,
changes:Partial<Consultation>
){



setConsultations(
prev=>

prev.map(item=>

item.id===id

?

{

...item,

...changes,

updatedAt:
new Date().toISOString()

}

:

item

)

);





if(!supabase)

return;




await supabase

.from("consultations")

.update({

...changes,

updated_at:
new Date().toISOString()

})

.eq(
"id",
id
);



}









async function saveDraft(
id:string,
draft:ClinicalDraft
){



const consultation =
consultations.find(
x=>x.id===id
);



if(!consultation)

return;





setConsultations(

prev=>

prev.map(item=>

item.id===id

?

{

...item,

clinicalNote:draft

}

:

item

)

);






if(!supabase)

return;





await supabase

.from("clinical_notes")

.upsert({

consultation_id:id,

structured_content:draft,

version:
consultation.version || 0

});



}
async function approveConsultation(
id:string,
draft:ClinicalDraft,
reason?:string
){


const consultation =
consultations.find(
x=>x.id===id
);



if(!consultation)

throw new Error(
"Consultation not found"
);



const updated:Partial<Consultation>={


status:"approved",


clinicalNote:draft,


approvedBy:
currentUser?.id,


approvedAt:
new Date().toISOString(),


version:
(consultation.version || 0) + 1


};






await updateConsultation(
id,
updated
);






if(!supabase)

return;







await supabase

.from("clinical_notes")

.upsert({

consultation_id:id,

structured_content:draft,

approved_by:currentUser?.id,

approved_at:
new Date().toISOString(),

version:
(consultation.version || 0)+1,

change_reason:
reason || null

});



}









async function addOwnerSummary(
summary:OwnerSummary
){



setOwnerSummaries(

prev=>[
summary,
...prev
]

);






if(!supabase)

return;




await supabase

.from("owner_summaries")

.insert(summary);



}









async function updateOwnerSummary(
id:string,
changes:Partial<OwnerSummary>
){



setOwnerSummaries(

prev=>

prev.map(item=>

item.id===id

?

{

...item,

...changes

}

:

item

)

);






if(!supabase)

return;





await supabase

.from("owner_summaries")

.update(changes)

.eq(
"id",
id
);



}









async function addMedicine(
medicine:Medicine
){



setMedicines(

prev=>[
medicine,
...prev
]

);






if(!supabase)

return;





await supabase

.from("medicines")

.insert(medicine);



}









return (

<AppStateContext.Provider

value={{

currentUser,

practice,

profiles,


clients,

patients,

consultations,

medicines,

ownerSummaries,

versions,

auditLogs,



login,

register,

logout,


refreshData:loadAppData,


createConsultation,

updateConsultation,

saveDraft,

approveConsultation,

addOwnerSummary,

updateOwnerSummary,

addMedicine

}}

>


{children}


</AppStateContext.Provider>

);



}









export function useAppState(){


const context =
useContext(AppStateContext);



if(!context)

throw new Error(
"AppStateProvider missing"
);



return context;


}