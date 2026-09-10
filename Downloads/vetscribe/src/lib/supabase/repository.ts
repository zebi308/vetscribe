import { supabase } from './client'
import type { AuditLog, Client, ClinicalDraft, ClinicalNoteVersion, Consultation, Medicine, OwnerSummary, Patient, Practice, Profile } from '../../types/models'
function db(){if(!supabase)throw new Error('Supabase is not configured');return supabase}

export async function loadMembership(authUserId:string):Promise<{profile:Profile;practice:Practice}>{
 const {data:p,error}=await db().from('profiles').select('*').eq('auth_user_id',authUserId).single();if(error)throw error
 const profile:Profile={id:p.id,authUserId:p.auth_user_id,practiceId:p.practice_id||'platform',firstName:p.first_name,lastName:p.last_name,email:p.email,role:p.role,professionalRegistrationNumber:p.professional_registration_number||undefined,isActive:p.is_active}
 if(p.role==='super_admin'&&!p.practice_id)return {profile,practice:{id:'platform',name:'VetScribe Platform',slug:'platform',address:'',phone:'',email:'',primaryColor:'#0f766e',secondaryColor:'#115e59'}}
 const {data:practice,error:pe}=await db().from('practices').select('*').eq('id',p.practice_id).single();if(pe)throw pe
 return {profile,practice:{id:practice.id,name:practice.name,slug:practice.slug,address:[practice.address_line_1,practice.address_line_2,practice.city,practice.postcode].filter(Boolean).join(', '),phone:practice.phone||'',email:practice.email||'',primaryColor:practice.primary_color,secondaryColor:practice.secondary_color,logoUrl:practice.logo_url||undefined}}
}

export async function loadPracticeData():Promise<{clients:Client[];patients:Patient[];consultations:Consultation[];medicines:Medicine[];ownerSummaries:OwnerSummary[];versions:ClinicalNoteVersion[]}>{
 const [cr,pr,cor,nr,mr,sr,vr]=await Promise.all([
  db().from('clients').select('*'),db().from('patients').select('*'),db().from('consultations').select('*').order('consultation_date',{ascending:false}),
  db().from('clinical_notes').select('*'),db().from('medicines').select('*').order('prescribed_date',{ascending:false}),db().from('owner_summaries').select('*').order('generated_at',{ascending:false}),db().from('clinical_note_versions').select('*').order('created_at',{ascending:false})
 ]);for(const r of [cr,pr,cor,nr,mr,sr,vr])if(r.error)throw r.error
 const notes=new Map<string, any>((nr.data||[]).map((n:any)=>[n.consultation_id,n]))
 const clients=(cr.data||[]).map(c=>({id:c.id,practiceId:c.practice_id,firstName:c.first_name,lastName:c.last_name,address:[c.address_line_1,c.address_line_2,c.city].filter(Boolean).join(', '),postcode:c.postcode||'',phone:c.phone||'',email:c.email||''}))
 const patients=(pr.data||[]).map(p=>({id:p.id,practiceId:p.practice_id,clientId:p.client_id,name:p.name,species:p.species,breed:p.breed||'',sex:(p.sex||'Unknown') as Patient['sex'],neutered:Boolean(p.neutered),dateOfBirth:p.date_of_birth||'',microchipNumber:p.microchip_number||undefined,colour:p.colour||undefined,weightKg:Number(p.weight_kg||0)}))
 const consultations=(cor.data||[]).map(c=>{const n=notes.get(c.id);return {id:c.id,practiceId:c.practice_id,patientId:c.patient_id,clientId:c.client_id,createdBy:c.created_by,treatingVetId:c.treating_vet_id,consultationDate:c.consultation_date,status:c.status,captureType:c.capture_type,transcript:c.transcript||'',startedAt:c.started_at||undefined,endedAt:c.ended_at||undefined,updatedAt:c.updated_at,clinicalNote:n?.structured_content as ClinicalDraft|undefined,approvedBy:n?.approved_by||undefined,approvedAt:n?.approved_at||undefined,version:Number(n?.version||0)} as Consultation})
 const medicines=(mr.data||[]).map(m=>({id:m.id,practiceId:m.practice_id,patientId:m.patient_id,clientId:m.client_id,consultationId:m.consultation_id||undefined,prescribingVetId:m.prescribing_vet_id,medicineName:m.medicine_name,medicineCategory:m.medicine_category,quantity:String(m.quantity),unit:m.unit||'',batchNumber:m.batch_number,prescribedDate:m.prescribed_date,withdrawalPeriod:m.withdrawal_period||'',instructions:m.instructions||''} as Medicine))
 const ownerSummaries=(sr.data||[]).map(row=>row.structured_content as OwnerSummary).filter(Boolean)
 const versions=(vr.data||[]).map(v=>({id:v.id,clinicalNoteId:v.clinical_note_id,versionNumber:v.version_number,content:v.content_json as ClinicalDraft,changedBy:v.changed_by,changeReason:v.change_reason,createdAt:v.created_at} as ClinicalNoteVersion))
 return {clients,patients,consultations,medicines,ownerSummaries,versions}
}

export async function loadProfiles():Promise<Profile[]>{
 const {data,error}=await db().from('profiles').select('*').order('last_name',{ascending:true});if(error)throw error
 return (data||[]).map(p=>({id:p.id,authUserId:p.auth_user_id||undefined,practiceId:p.practice_id||'platform',firstName:p.first_name,lastName:p.last_name,email:p.email,role:p.role,professionalRegistrationNumber:p.professional_registration_number||undefined,isActive:p.is_active}))
}

export async function loadAuditLogs():Promise<AuditLog[]>{
 const {data,error}=await db().from('audit_logs').select('*').order('created_at',{ascending:false}).limit(200);if(error)throw error
 return (data||[]).map(a=>({id:a.id,practiceId:a.practice_id,actorUserId:a.actor_user_id||'system',entityType:a.entity_type,entityId:a.entity_id||'',action:a.action,description:String(a.after_json?.description||`${a.action} ${a.entity_type}`),createdAt:a.created_at}))
}
