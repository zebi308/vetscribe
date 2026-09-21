import type { AuditLog, Client, Consultation, Medicine, Patient, Practice, Profile } from '../types/models'

export const practice:Practice = {
  id:'p-oakwood', name:'Oakwood Veterinary Practice', slug:'oakwood-veterinary-practice',
  address:'18 Willow Lane, Manchester, M20 4AB, United Kingdom', phone:'0161 555 0148',
  email:'hello@oakwood-vet.example', primaryColor:'#0f766e', secondaryColor:'#115e59'
}

export const profiles:Profile[] = [
  {id:'u-emily',practiceId:practice.id,firstName:'Emily',lastName:'Carter',email:'emily.carter@oakwood-vet.example',role:'vet',professionalRegistrationNumber:'RCVS-DEMO-1042',isActive:true},
  {id:'u-daniel',practiceId:practice.id,firstName:'Daniel',lastName:'Reed',email:'daniel.reed@oakwood-vet.example',role:'vet',professionalRegistrationNumber:'RCVS-DEMO-1128',isActive:true},
  {id:'u-sophie',practiceId:practice.id,firstName:'Sophie',lastName:'Morgan',email:'sophie.morgan@oakwood-vet.example',role:'nurse',isActive:true},
  {id:'u-james',practiceId:practice.id,firstName:'James',lastName:'Wilson',email:'james.wilson@oakwood-vet.example',role:'practice_manager',isActive:true},
]

export const clients:Client[] = [
 {id:'c-sarah',practiceId:practice.id,firstName:'Sarah',lastName:'Williams',address:'12 Meadow Close, Manchester',postcode:'M20 3AB',phone:'0161 555 0111',email:'sarah.williams@example.com'},
 {id:'c-james',practiceId:practice.id,firstName:'James',lastName:'Wilson',address:'8 Park View, Manchester',postcode:'M21 2CD',phone:'0161 555 0222',email:'james.wilson@example.com'},
 {id:'c-olivia',practiceId:practice.id,firstName:'Olivia',lastName:'Brown',address:'45 Oak Street, Manchester',postcode:'M19 1EF',phone:'0161 555 0333',email:'olivia.brown@example.com'},
]

export const patients:Patient[] = [
 {id:'pt-max',practiceId:practice.id,clientId:'c-sarah',name:'Max',species:'Dog',breed:'Labrador Retriever',sex:'Male',neutered:true,dateOfBirth:'2020-06-14',weightKg:28.4,microchipNumber:'985141000000001',colour:'Black'},
 {id:'pt-luna',practiceId:practice.id,clientId:'c-james',name:'Luna',species:'Cat',breed:'British Shorthair',sex:'Female',neutered:true,dateOfBirth:'2019-11-02',weightKg:4.8,microchipNumber:'985141000000002',colour:'Blue'},
 {id:'pt-bella',practiceId:practice.id,clientId:'c-olivia',name:'Bella',species:'Dog',breed:'Cocker Spaniel',sex:'Female',neutered:true,dateOfBirth:'2021-03-21',weightKg:12.7,microchipNumber:'985141000000003',colour:'Golden'},
]

export const demoTranscript = `Owner reports that Max has vomited intermittently for approximately three days. He has vomited twice today and once yesterday. He is still drinking but his appetite is reduced. No diarrhoea has been observed. Owner reports no access to known toxins. Max was bright at home but slightly quieter than usual this morning.\n\nOn examination Max is alert but mildly subdued. Mucous membranes are pink. Capillary refill time is under two seconds. Abdomen is mildly tense on palpation but no obvious mass is detected. Temperature is 38.7 degrees Celsius. Heart and respiratory rates are within expected limits. Hydration appears mildly reduced.\n\nDiscussed possible acute gastrointestinal disease. Differentials include dietary indiscretion, gastritis, pancreatitis and other gastrointestinal causes. Recommended blood testing and supportive management. Discussed monitoring appetite, vomiting frequency and hydration. Owner advised to return urgently if vomiting becomes persistent, blood is seen, Max becomes significantly lethargic, or he cannot keep water down.`

export const consultations:Consultation[] = [
 {id:'con-max',practiceId:practice.id,patientId:'pt-max',clientId:'c-sarah',createdBy:'u-emily',treatingVetId:'u-emily',consultationDate:'2026-09-09T09:30:00',status:'draft',captureType:'audio',transcript:'',updatedAt:'2026-09-09T09:30:00',version:0},
 {id:'con-luna',practiceId:practice.id,patientId:'pt-luna',clientId:'c-james',createdBy:'u-emily',treatingVetId:'u-emily',consultationDate:'2026-09-09T09:00:00',status:'approved',captureType:'typed',transcript:'Reduced appetite for two days. Examination unremarkable. Discussed monitoring and review if signs persist.',updatedAt:'2026-09-09T09:18:00',version:1,approvedBy:'u-emily',approvedAt:'2026-09-09T09:18:00'},
 {id:'con-bella',practiceId:practice.id,patientId:'pt-bella',clientId:'c-olivia',createdBy:'u-daniel',treatingVetId:'u-daniel',consultationDate:'2026-09-09T10:00:00',status:'approved',captureType:'typed',transcript:'Owner reports ear irritation. Otoscopic examination discussed. Cleaning plan and review advice given.',updatedAt:'2026-09-09T10:16:00',version:1,approvedBy:'u-daniel',approvedAt:'2026-09-09T10:16:00'},
]

export const medicines:Medicine[] = [
 {id:'med-1',practiceId:practice.id,patientId:'pt-max',clientId:'c-sarah',prescribingVetId:'u-emily',medicineName:'Demo supportive medicine',medicineCategory:'POM-V',quantity:'10',unit:'tablets',batchNumber:'DEMO-B001',prescribedDate:'2026-06-14',withdrawalPeriod:'Not applicable',instructions:'Historical fictional demo entry only.'}
]

export const auditLogs:AuditLog[] = [
 {id:'a1',practiceId:practice.id,actorUserId:'u-emily',entityType:'consultation',entityId:'con-luna',action:'approved',description:'Approved clinical record · Luna',createdAt:'2026-09-09T09:18:00'},
 {id:'a2',practiceId:practice.id,actorUserId:'u-daniel',entityType:'consultation',entityId:'con-bella',action:'approved',description:'Approved clinical record · Bella',createdAt:'2026-09-09T10:16:00'}
]
