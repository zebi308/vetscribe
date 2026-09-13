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
  loadAuditLogs
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
  AuditLog
} from "../types/models";






interface AppStateContextType {


  currentUser: Profile | null;

  practice: Practice | null;



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



console.log(
"RESTORE SESSION",
data.session
);





if(data.session?.user){


await loadUser(
data.session.user.id
);


}



}









async function loadUser(
authUserId:string
){



console.log(
"LOADING USER",
authUserId
);





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



console.log(
"APP DATA LOADED"
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
){



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





await loadUser(
data.user.id
);



return true;


}









async function register(
form:any
){



if(!supabase)

throw new Error(
"Supabase not configured"
);






console.log(
"START REGISTER"
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


const result =
await supabase.auth.signInWithPassword({

email:form.email,

password:form.password

});



session =
result.data.session;


}






if(!session)

throw new Error(
"No active Supabase session"
);








const authUserId =
userData.user.id;









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

auth_user_id:authUserId,

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
authUserId
);






}









async function logout(){



if(supabase)

await supabase.auth.signOut();





setCurrentUser(null);

setPractice(null);


setClients([]);

setPatients([]);

setConsultations([]);

setMedicines([]);

setOwnerSummaries([]);

setVersions([]);

setAuditLogs([]);



}









return (

<AppStateContext.Provider

value={{

currentUser,

practice,


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

refreshData:loadAppData


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