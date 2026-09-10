import type { AIService } from './types'
import type { ClinicalDraft, OwnerSummary } from '../../types/models'
import { demoTranscript } from '../demoData'

const delay=(ms:number)=>new Promise(r=>setTimeout(r,ms))
export const mockAI:AIService = {
 async transcribe(){ await delay(700); return demoTranscript },
 async generateClinicalNote({transcript}){
   await delay(900)
   if(!transcript.trim()) throw new Error('Transcript is empty')
   const note:ClinicalDraft={
     subjective:{presenting_complaint:'Intermittent vomiting for approximately three days.',history:'Vomited twice today and once yesterday. Still drinking; appetite reduced. No diarrhoea observed. No known toxin access reported.',owner_observations:'Bright at home but slightly quieter than usual this morning.'},
     objective:{clinical_findings:'Alert but mildly subdued. Mucous membranes pink. CRT under two seconds. Abdomen mildly tense on palpation with no obvious mass. Hydration appears mildly reduced.',vital_parameters:[{name:'Temperature',value:'38.7 °C'},{name:'Heart rate',value:'Within expected limits'},{name:'Respiratory rate',value:'Within expected limits'}],diagnostic_tests:[{test:'Blood testing',status:'discussed',result:null}]},
     assessment:{primary_assessment:'Possible acute gastrointestinal disease discussed.',diagnoses:[],differentials:['Dietary indiscretion','Gastritis','Pancreatitis','Other gastrointestinal causes']},
     plan:{treatment_given:['Supportive management discussed'],medications:[],follow_up:'Return urgently if vomiting becomes persistent, blood is seen, Max becomes significantly lethargic, or cannot keep water down.',client_advice:'Monitor appetite, vomiting frequency and hydration.'},
     missing_information:[{field:'Follow-up timeframe',reason:'No routine follow-up interval was specified in the transcript.',severity:'medium'}],
     confidence_notes:['Draft generated only from the supplied transcript. Veterinary review required.']
   }
   return note
 },
 async generateOwnerSummary({clinicalNote,patient,consultationId,practiceId,clientId,generatedBy}){
   await delay(600)
   const out:OwnerSummary={id:`sum-${consultationId}`,practiceId,consultationId,patientId:patient.id,clientId,title:`${patient.name}'s Consultation Summary`,whatWeFound:clinicalNote.objective.clinical_findings,whatWeDiscussed:[clinicalNote.assessment.primary_assessment,...clinicalNote.assessment.differentials].filter(Boolean).join(' '),treatmentAndMedication:clinicalNote.plan.treatment_given.join('; ')||'No treatment was recorded in the approved clinical record.',whatToDoAtHome:clinicalNote.plan.client_advice,whenToContactUs:clinicalNote.plan.follow_up,followUp:clinicalNote.plan.follow_up,generatedAt:new Date().toISOString(),generatedBy}
   return out
 }
}
