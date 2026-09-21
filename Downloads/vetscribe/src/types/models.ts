export type Role =

  | 'vet'

  | 'nurse'

  | 'practice_manager'

  | 'super_admin';


export type ConsultationStatus =

  | 'draft'

  | 'transcribing'

  | 'generating'

  | 'awaiting_review'

  | 'approved'

  | 'cancelled';


export type FollowUpStatus =

  | "scheduled"

  | "completed"

  | "cancelled";


export interface Practice {

  id:string;

  name:string;

  slug:string;

  address:string;

  phone:string;

  email:string;

  primaryColor:string;

  secondaryColor:string;

  logoUrl?:string;

}


export interface Profile {

  id:string;

  authUserId?:string;

  practiceId:string;

  firstName:string;

  lastName:string;

  email:string;

  role:Role;

  professionalRegistrationNumber?:string;

  isActive:boolean;

}


export interface Client {

  id:string;

  practiceId:string;

  firstName:string;

  lastName:string;

  address:string;

  postcode:string;

  phone:string;

  email:string;

}


export interface Patient {

  id:string;

  practiceId:string;

  clientId:string;

  name:string;

  species:string;

  breed:string;

  sex:'Male'|'Female'|'Unknown';

  neutered:boolean;

  dateOfBirth:string;

  microchipNumber?:string;

  colour?:string;

  weightKg:number;

}


export interface VitalParameter {

  name:string;

  value:string;

}


export interface DiagnosticTest {

  test:string;

  status:'performed'|'requested'|'discussed';

  result:string|null;

}


export interface MedicationDraft {

  name:string;

  dose:string|null;

  route:string|null;

  frequency:string|null;

  duration:string|null;

}


export interface MissingInformation {

  field:string;

  reason:string;

  severity:'low'|'medium'|'high';

  dismissed?:boolean;

}

export interface ClinicalInsight {

  id:string;

  type:
    | 'warning'
    | 'suggestion'
    | 'information';

  message:string;

  confidence:number;

  createdAt:string;

}

export interface ClinicalDraft {

  subjective:{

    presenting_complaint:string;

    history:string;

    owner_observations:string;

  };

  objective:{

    clinical_findings:string;

    vital_parameters:VitalParameter[];

    diagnostic_tests:DiagnosticTest[];

  };

  assessment:{

    primary_assessment:string;

    diagnoses:string[];

    differentials:string[];

  };

  plan:{

    treatment_given:string[];

    medications:MedicationDraft[];

    follow_up:string;

    client_advice:string;

  };

  missing_information:MissingInformation[];

  confidence_notes:string[];

}


export interface ClinicalNoteVersion {

  id:string;

  clinicalNoteId:string;

  versionNumber:number;

  content:ClinicalDraft;

  changedBy:string;

  changeReason:string;

  createdAt:string;

}


export interface Consultation {

  id:string;

  practiceId:string;

  patientId:string;

  clientId:string;

  createdBy:string;

  treatingVetId:string;

  consultationDate:string;

  status:ConsultationStatus;

  archived?: boolean;

  captureType:'audio'|'typed'|'mixed';

  transcript:string;

  durationSeconds?:number;

  startedAt?:string;

  endedAt?:string;

  updatedAt:string;


  clinicalNote?:ClinicalDraft;


  aiInsights?:ClinicalInsight[];

  clinicalQuality?:ClinicalNoteQuality;
  noteQuality?:ClinicalNoteQuality;


  approvedBy?:string;

  approvedAt?:string;

  version:number;

}

export interface ClinicalNoteQuality {

  completeness:number;

  structure:number;

  clinicalClarity:number;

  safetyCheck:number;

  overall:number;

  generatedAt:string;

}




export interface OwnerSummary {

  id:string;

  practiceId:string;

  consultationId:string;

  patientId:string;

  clientId:string;

  title:string;

  whatWeFound:string;

  whatWeDiscussed:string;

  treatmentAndMedication:string;

  whatToDoAtHome:string;

  whenToContactUs:string;

  followUp:string;

  generatedAt:string;

  generatedBy:string;

}


export interface FollowUp {

  id:string;

  practiceId:string;

  patientId:string;

  clientId:string;

  consultationId?:string;

  createdBy:string;

  title:string;

  notes:string;

  scheduledDate:string;

  dueDate?:string;

  status:FollowUpStatus;

  completedAt?:string;

  createdAt:string;

}


export interface Medicine {

  id:string;

  practiceId:string;

  patientId:string;

  clientId:string;

  consultationId?:string;

  prescribingVetId:string;

  medicineName:string;

  medicineCategory:'POM-V'|'POM-VPS'|'Cascade'|'Other';

  quantity:string;

  unit:string;

  batchNumber:string;

  prescribedDate:string;

  withdrawalPeriod:string;

  instructions:string;

}


export interface AuditLog {

  id:string;

  practiceId:string;

  actorUserId:string;

  entityType:string;

  entityId:string;

  action:string;

  description:string;

  createdAt:string;

}


/* =========================================================
   PHASE 8 — MEDICAL RECORD EXPANSION
   ========================================================= */


export interface Vaccination {

  id:string;

  practiceId:string;

  patientId:string;

  vaccineName:string;

  manufacturer?:string;

  batchNumber?:string;

  dateGiven:string;

  nextDueDate?:string;

  administeredBy?:string;

  notes?:string;

  createdAt:string;

}


export interface Allergy {

  id:string;

  practiceId:string;

  patientId:string;

  allergen:string;

  reaction:string;

  severity:'low'|'medium'|'high';

  notes?:string;

  createdAt:string;

}


export interface Condition {

  id:string;

  practiceId:string;

  patientId:string;

  name:string;

  diagnosisDate?:string;

  status:
    | 'active'
    | 'resolved'
    | 'chronic'
    | 'monitoring';

  notes?:string;

  createdAt:string;

}


export interface Prescription {

  id:string;

  practiceId:string;

  patientId:string;

  clientId:string;

  consultationId?:string;

  prescribingVetId:string;

  medicineName:string;

  dose?:string;

  route?:string;

  frequency?:string;

  duration?:string;

  instructions:string;

  prescribedDate:string;

  status:
    | 'active'
    | 'completed'
    | 'cancelled';

}



/* =========================================================
   PHASE 9 — APPOINTMENT MANAGEMENT
   ========================================================= */

export type AppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "checked_in"
  | "completed"
  | "cancelled"
  | "no_show";


export interface Appointment {

  id:string;

  practiceId:string;

  patientId:string;

  clientId:string;

  assignedVetId:string;

  appointmentDate:string;

  appointmentTime:string;

  reason:string;

  notes?:string;

  status:AppointmentStatus;

  createdBy:string;

  createdAt:string;

  updatedAt:string;

}


/* Existing interfaces remain unchanged below this point */
