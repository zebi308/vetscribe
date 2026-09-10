import { createContext, useContext, useEffect, useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react'
import { auditLogs as seedAuditLogs, clients as seedClients, consultations as seedConsultations, medicines as seedMedicines, patients as seedPatients, practice as seedPractice, profiles as seedProfiles } from './demoData'
import type { AuditLog, ClinicalDraft, ClinicalNoteVersion, Client, Consultation, Medicine, OwnerSummary, Patient, Practice, Profile } from '../types/models'
import { supabase } from './supabase/client'
import { loadAuditLogs, loadMembership, loadPracticeData, loadProfiles } from './supabase/repository'

const demoMode=import.meta.env.VITE_DEMO_MODE !== 'false'

type State = {
  practice:Practice; setPractice:(p:Practice)=>void
  currentUser:Profile|null; loginDemo:()=>void; loginProduction:()=>Promise<void>; logout:()=>void
  profiles:Profile[]; setProfiles:Dispatch<SetStateAction<Profile[]>>
  clients:Client[]; patients:Patient[]; consultations:Consultation[]; medicines:Medicine[]
  ownerSummaries:OwnerSummary[]; versions:ClinicalNoteVersion[]; auditLogs:AuditLog[]
  createConsultation:(patientId:string)=>string
  updateConsultation:(id:string,patch:Partial<Consultation>)=>void
  saveDraft:(id:string,note:ClinicalDraft)=>void
  approveConsultation:(id:string,note:ClinicalDraft,changeReason?:string)=>Promise<void>
  addOwnerSummary:(summary:OwnerSummary)=>void
  updateOwnerSummary:(id:string,patch:Partial<OwnerSummary>)=>void
  addMedicine:(medicine:Medicine)=>void
  addAudit:(log:Omit<AuditLog,'id'|'createdAt'|'practiceId'|'actorUserId'>)=>void
}

const Ctx=createContext<State|null>(null)

export function AppStateProvider({children}:{children:ReactNode}){
 const [practice,setPracticeState]=useState(seedPractice)
 const [currentUser,setCurrentUser]=useState<Profile|null>(null)
 const [profiles,setProfiles]=useState<Profile[]>(demoMode?seedProfiles:[])
 const [clients,setClients]=useState<Client[]>(demoMode?seedClients:[])
 const [patients,setPatients]=useState<Patient[]>(demoMode?seedPatients:[])
 const [consultations,setConsultations]=useState<Consultation[]>(demoMode?seedConsultations:[])
 const [medicines,setMedicines]=useState<Medicine[]>(demoMode?seedMedicines:[])
 const [ownerSummaries,setOwnerSummaries]=useState<OwnerSummary[]>([])
 const [versions,setVersions]=useState<ClinicalNoteVersion[]>([])
 const [auditLogs,setAuditLogs]=useState<AuditLog[]>(demoMode?seedAuditLogs:[])

 const loginProduction=async()=>{
   if(!supabase) throw new Error('Supabase is not configured')
   const {data,error}=await supabase.auth.getUser(); if(error) throw error; if(!data.user) throw new Error('No authenticated user')
   const membership=await loadMembership(data.user.id)
   if(membership.profile.role==='super_admin'){setPracticeState(membership.practice);setCurrentUser(membership.profile);setProfiles([membership.profile]);setClients([]);setPatients([]);setConsultations([]);setMedicines([]);setOwnerSummaries([]);setVersions([]);return}
   const [dataSet,staff]=await Promise.all([loadPracticeData(),loadProfiles()])
   setPracticeState(membership.practice); setCurrentUser(membership.profile); setClients(dataSet.clients); setPatients(dataSet.patients); setConsultations(dataSet.consultations); setMedicines(dataSet.medicines); setOwnerSummaries(dataSet.ownerSummaries); setVersions(dataSet.versions); setProfiles(staff)
   if(membership.profile.role==='practice_manager'){void loadAuditLogs().then(setAuditLogs).catch(()=>undefined)}
 }
 useEffect(()=>{
   if(demoMode||!supabase)return
   void supabase.auth.getSession().then(({data})=>{if(data.session)void loginProduction().catch(()=>setCurrentUser(null))})
   const {data}=supabase.auth.onAuthStateChange((event:string)=>{if(event==='SIGNED_OUT')setCurrentUser(null)})
   return ()=>data.subscription.unsubscribe()
 },[])

 const setPractice=(p:Practice)=>{
   setPracticeState(p)
   if(!demoMode&&supabase){void supabase.from('practices').update({name:p.name,phone:p.phone,email:p.email,primary_color:p.primaryColor,secondary_color:p.secondaryColor,logo_url:p.logoUrl||null}).eq('id',p.id)}
 }
 const addAudit:State['addAudit']=(log)=>{
   const row={id:crypto.randomUUID(),practiceId:practice.id,actorUserId:currentUser?.id||'system',createdAt:new Date().toISOString(),...log}; setAuditLogs(prev=>[row,...prev])
   if(!demoMode&&supabase&&currentUser){void supabase.from('audit_logs').insert({practice_id:practice.id,actor_user_id:currentUser.id,entity_type:log.entityType,entity_id:log.entityId,action:log.action,after_json:{description:log.description}})}
 }
 const createConsultation=(patientId:string)=>{
   const patient=patients.find(p=>p.id===patientId); if(!patient) throw new Error('Patient not found')
   const treatingVetId=currentUser?.role==='vet'?currentUser.id:profiles.find(p=>p.role==='vet'&&p.isActive)?.id
   if(!currentUser||!treatingVetId) throw new Error('A treating veterinary surgeon is required')
   const id=crypto.randomUUID(); const now=new Date().toISOString(); const c:Consultation={id,practiceId:practice.id,patientId:patient.id,clientId:patient.clientId,createdBy:currentUser.id,treatingVetId,consultationDate:now,status:'draft',captureType:'audio',transcript:'',updatedAt:now,version:0}; setConsultations(prev=>[c,...prev])
   if(!demoMode&&supabase){void supabase.from('consultations').insert({id,practice_id:practice.id,patient_id:patient.id,client_id:patient.clientId,created_by:currentUser.id,treating_vet_id:treatingVetId,consultation_date:now,status:'draft',capture_type:'audio'})}
   return id
 }
 const updateConsultation=(id:string,patch:Partial<Consultation>)=>{
   setConsultations(prev=>prev.map(c=>c.id===id?{...c,...patch,updatedAt:new Date().toISOString()}:c))
   if(!demoMode&&supabase){const dbPatch:Record<string,unknown>={}; if(patch.status)dbPatch.status=patch.status;if(patch.transcript!==undefined)dbPatch.transcript=patch.transcript;if(patch.captureType)dbPatch.capture_type=patch.captureType;if(patch.startedAt!==undefined)dbPatch.started_at=patch.startedAt;if(patch.endedAt!==undefined)dbPatch.ended_at=patch.endedAt; if(Object.keys(dbPatch).length)void supabase.from('consultations').update(dbPatch).eq('id',id)}
 }
 const saveDraft=(id:string,note:ClinicalDraft)=>{
   const c=consultations.find(x=>x.id===id); if(!c) throw new Error('Consultation not found')
   updateConsultation(id,{clinicalNote:note,status:'awaiting_review'}); addAudit({entityType:'consultation',entityId:id,action:'updated',description:'Saved AI-assisted draft clinical record'})
   if(!demoMode&&supabase){void supabase.from('clinical_notes').upsert({practice_id:practice.id,consultation_id:id,patient_id:c.patientId,subjective:[note.subjective.presenting_complaint,note.subjective.history,note.subjective.owner_observations].filter(Boolean).join('\n'),objective:note.objective.clinical_findings,assessment:note.assessment.primary_assessment,plan:[...note.plan.treatment_given,note.plan.client_advice,note.plan.follow_up].filter(Boolean).join('\n'),diagnostic_tests:note.objective.diagnostic_tests,diagnoses:note.assessment.diagnoses,differentials:note.assessment.differentials,treatment_given:note.plan.treatment_given,medicines:note.plan.medications,client_advice:note.plan.client_advice,follow_up:note.plan.follow_up,structured_content:note,ai_generated:true,ai_model:'configured-service',ai_generated_at:new Date().toISOString(),reviewed_by:currentUser?.id||null,reviewed_at:new Date().toISOString()},{onConflict:'consultation_id'})}
 }
 const approveConsultation=async(id:string,note:ClinicalDraft,changeReason?:string)=>{
   if(!currentUser) throw new Error('Authenticated user required')
   if(currentUser.role!=='vet') throw new Error('Only a veterinary surgeon can approve this record')
   const c=consultations.find(x=>x.id===id); if(!c) throw new Error('Consultation not found')
   if(c.version>0&&!changeReason?.trim()) throw new Error('An amendment reason is required before re-approval.')
   if(!note.objective.clinical_findings.trim()||(!note.assessment.primary_assessment.trim()&&!note.assessment.differentials.length)||(!note.plan.client_advice.trim()&&!note.plan.treatment_given.length)) throw new Error('Clinical findings, assessment/differential and treatment/plan are required before approval.')
   const localNext=(c.version||0)+1
   let nextVersion=localNext
   if(!demoMode){
     if(!supabase)throw new Error('Supabase is not configured')
     const statusWrite=await supabase.from('consultations').update({status:'awaiting_review'}).eq('id',id); if(statusWrite.error)throw statusWrite.error
     const draftWrite=await supabase.from('clinical_notes').upsert({practice_id:practice.id,consultation_id:id,patient_id:c.patientId,subjective:[note.subjective.presenting_complaint,note.subjective.history,note.subjective.owner_observations].filter(Boolean).join('\n'),objective:note.objective.clinical_findings,assessment:note.assessment.primary_assessment,plan:[...note.plan.treatment_given,note.plan.client_advice,note.plan.follow_up].filter(Boolean).join('\n'),diagnostic_tests:note.objective.diagnostic_tests,diagnoses:note.assessment.diagnoses,differentials:note.assessment.differentials,treatment_given:note.plan.treatment_given,medicines:note.plan.medications,client_advice:note.plan.client_advice,follow_up:note.plan.follow_up,structured_content:note,ai_generated:true,ai_model:'configured-service',ai_generated_at:new Date().toISOString(),reviewed_by:currentUser.id,reviewed_at:new Date().toISOString()},{onConflict:'consultation_id'}); if(draftWrite.error)throw draftWrite.error
     const {data,error}=await supabase.rpc('approve_clinical_record',{p_consultation_id:id,p_structured_content:note,p_change_reason:changeReason|| (localNext===1?'Initial approval':'Approved amendment')}); if(error)throw error; nextVersion=Number(data||localNext)
   }
   setVersions(prev=>[{id:crypto.randomUUID(),clinicalNoteId:id,versionNumber:nextVersion,content:structuredClone(note),changedBy:currentUser.id,changeReason:changeReason|| (nextVersion===1?'Initial approval':'Approved amendment'),createdAt:new Date().toISOString()},...prev])
   setConsultations(prev=>prev.map(x=>x.id===id?{...x,clinicalNote:note,status:'approved',approvedBy:currentUser.id,approvedAt:new Date().toISOString(),version:nextVersion,updatedAt:new Date().toISOString()}:x))
   if(demoMode)addAudit({entityType:'consultation',entityId:id,action:'approved',description:'Approved and signed clinical record'})
 }
 const addOwnerSummary=(summary:OwnerSummary)=>{
   // In production the authenticated owner-summary API persists this row after verifying the consultation is approved.
   setOwnerSummaries(prev=>[summary,...prev.filter(x=>x.consultationId!==summary.consultationId)])
 }
 const updateOwnerSummary=(id:string,patch:Partial<OwnerSummary>)=>{
   setOwnerSummaries(prev=>prev.map(s=>s.id===id?{...s,...patch}:s))
   if(!demoMode&&supabase){const current=ownerSummaries.find(s=>s.id===id);if(current){const merged={...current,...patch};void supabase.from('owner_summaries').update({summary_text:[merged.whatWeFound,merged.whatWeDiscussed,merged.treatmentAndMedication,merged.whatToDoAtHome,merged.whenToContactUs,merged.followUp].join('\n\n'),structured_content:merged}).eq('id',id)}}
 }
 const addMedicine=(m:Medicine)=>{
   setMedicines(prev=>[m,...prev])
   if(!demoMode&&supabase){void supabase.from('medicines').insert({id:m.id,practice_id:m.practiceId,patient_id:m.patientId,client_id:m.clientId,consultation_id:m.consultationId||null,prescribing_vet_id:m.prescribingVetId,medicine_name:m.medicineName,medicine_category:m.medicineCategory,quantity:Number(m.quantity),unit:m.unit,batch_number:m.batchNumber,prescribed_date:m.prescribedDate,withdrawal_period:m.withdrawalPeriod,instructions:m.instructions})}
 }
 const logout=()=>{if(!demoMode&&supabase)void supabase.auth.signOut();setCurrentUser(null)}
 const value=useMemo<State>(()=>({practice,setPractice,currentUser,loginDemo:()=>setCurrentUser(seedProfiles[0]),loginProduction,logout,profiles,setProfiles,clients,patients,consultations,medicines,ownerSummaries,versions,auditLogs,createConsultation,updateConsultation,saveDraft,approveConsultation,addOwnerSummary,updateOwnerSummary,addMedicine,addAudit}),[practice,currentUser,profiles,clients,patients,consultations,medicines,ownerSummaries,versions,auditLogs])
 return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
export function useAppState(){ const v=useContext(Ctx); if(!v) throw new Error('AppStateProvider missing'); return v }
