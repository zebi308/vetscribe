import type { ClinicalDraft, OwnerSummary, Patient } from '../../types/models'
export interface ClinicalGenerationInput { transcript:string; patient:Patient }
export interface OwnerSummaryInput { clinicalNote:ClinicalDraft; patient:Patient; consultationId:string; practiceId:string; clientId:string; generatedBy:string }
export interface AIService {
  transcribe(audio:Blob):Promise<string>
  generateClinicalNote(input:ClinicalGenerationInput):Promise<ClinicalDraft>
  generateOwnerSummary(input:OwnerSummaryInput):Promise<OwnerSummary>
}
