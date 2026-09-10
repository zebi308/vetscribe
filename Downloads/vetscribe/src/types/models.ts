export type Role = 'vet' | 'nurse' | 'practice_manager' | 'super_admin'
export type ConsultationStatus = 'draft' | 'transcribing' | 'generating' | 'awaiting_review' | 'approved' | 'cancelled'

export interface Practice { id:string; name:string; slug:string; address:string; phone:string; email:string; primaryColor:string; secondaryColor:string; logoUrl?:string }
export interface Profile { id:string; authUserId?:string; practiceId:string; firstName:string; lastName:string; email:string; role:Role; professionalRegistrationNumber?:string; isActive:boolean }
export interface Client { id:string; practiceId:string; firstName:string; lastName:string; address:string; postcode:string; phone:string; email:string }
export interface Patient { id:string; practiceId:string; clientId:string; name:string; species:string; breed:string; sex:'Male'|'Female'|'Unknown'; neutered:boolean; dateOfBirth:string; microchipNumber?:string; colour?:string; weightKg:number }
export interface VitalParameter { name:string; value:string }
export interface DiagnosticTest { test:string; status:'performed'|'requested'|'discussed'; result:string|null }
export interface MedicationDraft { name:string; dose:string|null; route:string|null; frequency:string|null; duration:string|null }
export interface MissingInformation { field:string; reason:string; severity:'low'|'medium'|'high'; dismissed?:boolean }
export interface ClinicalDraft {
  subjective:{ presenting_complaint:string; history:string; owner_observations:string }
  objective:{ clinical_findings:string; vital_parameters:VitalParameter[]; diagnostic_tests:DiagnosticTest[] }
  assessment:{ primary_assessment:string; diagnoses:string[]; differentials:string[] }
  plan:{ treatment_given:string[]; medications:MedicationDraft[]; follow_up:string; client_advice:string }
  missing_information:MissingInformation[]
  confidence_notes:string[]
}
export interface ClinicalNoteVersion { id:string; clinicalNoteId:string; versionNumber:number; content:ClinicalDraft; changedBy:string; changeReason:string; createdAt:string }
export interface Consultation { id:string; practiceId:string; patientId:string; clientId:string; createdBy:string; treatingVetId:string; consultationDate:string; status:ConsultationStatus; captureType:'audio'|'typed'|'mixed'; transcript:string; durationSeconds?:number; startedAt?:string; endedAt?:string; updatedAt:string; clinicalNote?:ClinicalDraft; approvedBy?:string; approvedAt?:string; version:number }
export interface OwnerSummary { id:string; practiceId:string; consultationId:string; patientId:string; clientId:string; title:string; whatWeFound:string; whatWeDiscussed:string; treatmentAndMedication:string; whatToDoAtHome:string; whenToContactUs:string; followUp:string; generatedAt:string; generatedBy:string }
export interface Medicine { id:string; practiceId:string; patientId:string; clientId:string; consultationId?:string; prescribingVetId:string; medicineName:string; medicineCategory:'POM-V'|'POM-VPS'|'Cascade'|'Other'; quantity:string; unit:string; batchNumber:string; prescribedDate:string; withdrawalPeriod:string; instructions:string }
export interface AuditLog { id:string; practiceId:string; actorUserId:string; entityType:string; entityId:string; action:string; description:string; createdAt:string }
