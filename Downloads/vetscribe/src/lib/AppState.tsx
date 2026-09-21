import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { supabase } from "./supabase/client";

import {
  loadMembership,
  loadPracticeData,
  loadAuditLogs,
  loadProfiles,
  loadPractices,
  updatePracticeStatus,
  createConsultationRecord,
  loadSubscriptionPlans,
  loadSubscriptions,
  loadInvoices,
  loadPayments,
  loadPlatformAnalytics,
  createSubscription,
  createInvoice,
  recordPayment,
  createAnalyticsEvent,
  calculateBusinessMetrics,
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
  ClinicalDraft,
  FollowUp,
  Vaccination,
  Allergy,
  Condition,
  Prescription,
  Appointment,
} from "../types/models";

interface AppStateContextType {
  currentUser: Profile | null;
  practice: Practice | null;
  practices: Practice[];
  authLoading: boolean;

  subscriptionPlans: any[];
  subscriptions: any[];
  invoices: any[];
  payments: any[];
  platformMetrics: any[];

  profiles: Profile[];

  clients: Client[];
  patients: Patient[];
  consultations: Consultation[];
  medicines: Medicine[];
  ownerSummaries: OwnerSummary[];
  versions: ClinicalNoteVersion[];
  auditLogs: AuditLog[];

  followUps: FollowUp[];

  vaccinations: Vaccination[];
  allergies: Allergy[];
  conditions: Condition[];
  prescriptions: Prescription[];

  appointments: Appointment[];

  login(email: string, password: string): Promise<boolean>;
  register(data: any): Promise<void>;
  logout(): Promise<void>;
  refreshData(): Promise<void>;

  assignSubscription(payload:any): Promise<any>;
  generateInvoice(payload:any): Promise<any>;
  recordBusinessPayment(payload:any): Promise<any>;
  getBusinessMetrics(): Promise<any>;

  createConsultation(patientId: string): Promise<string>;
  updateConsultation(
    id: string,
    changes: Partial<Consultation>
  ): Promise<void>;
  saveDraft(id: string, draft: ClinicalDraft, clinicalQuality?: any): Promise<void>;
  approveConsultation(
    id: string,
    draft: ClinicalDraft,
    reason?: string
  ): Promise<void>;
  archiveConsultation(id: string): Promise<void>;
  restoreConsultation(id: string): Promise<void>;

  addOwnerSummary(summary: OwnerSummary): Promise<void>;
  updateOwnerSummary(
    id: string,
    changes: Partial<OwnerSummary>
  ): Promise<void>;

  sendOwnerSummaryEmail(summaryId: string): Promise<void>;

  addMedicine(medicine: Medicine): Promise<void>;
  updateMedicine(
    id: string,
    changes: Partial<Medicine>
  ): Promise<void>;
  archiveMedicine(id: string): Promise<void>;

  addClient(client: Client): Promise<void>;
  deleteClient(id: string): Promise<void>;
  restoreClient(id: string): Promise<void>;
  permanentDeleteClient(id: string): Promise<void>;
  addPatient(patient: Patient): Promise<void>;
  updatePatient(id: string, changes: Partial<Patient>): Promise<void>;
  deletePatient(id: string): Promise<void>;
  restorePatient(id: string): Promise<void>;
  permanentDeletePatient(id: string): Promise<void>;

  updateUserRole(
    id: string,
    role: string
  ): Promise<void>;

  toggleUserStatus(
    id: string,
    active: boolean
  ): Promise<void>;

  changePracticeStatus(id:string,status:string): Promise<void>;

  addFollowUp(followUp: FollowUp): Promise<void>;

  updateFollowUp(
    id: string,
    changes: Partial<FollowUp>
  ): Promise<void>;

  completeFollowUp(id: string): Promise<void>;

  addVaccination(item: Vaccination): Promise<void>;
  updateVaccination(id:string, changes:Partial<Vaccination>): Promise<void>;
  deleteVaccination(id:string): Promise<void>;

  addAllergy(item: Allergy): Promise<void>;
  updateAllergy(id:string, changes:Partial<Allergy>): Promise<void>;
  deleteAllergy(id:string): Promise<void>;

  addCondition(item: Condition): Promise<void>;
  updateCondition(id:string, changes:Partial<Condition>): Promise<void>;
  deleteCondition(id:string): Promise<void>;

  addPrescription(item: Prescription): Promise<void>;
  updatePrescription(id:string, changes:Partial<Prescription>): Promise<void>;
  deletePrescription(id:string): Promise<void>;

  addAppointment(item: Appointment): Promise<void>;
  updateAppointment(id:string, changes:Partial<Appointment>): Promise<void>;
  deleteAppointment(id:string): Promise<void>;
}

const AppStateContext = createContext<AppStateContextType | undefined>(
  undefined
);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [practice, setPractice] = useState<Practice | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);

  const [practices, setPractices] = useState<Practice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [ownerSummaries, setOwnerSummaries] = useState<OwnerSummary[]>([]);
  const [versions, setVersions] = useState<ClinicalNoteVersion[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  const [followUps, setFollowUps] = useState<FollowUp[]>([]);

  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);

  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Phase 13 Business Layer
  const [subscriptionPlans, setSubscriptionPlans] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [ invoices, setInvoices ] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [platformAnalytics, setPlatformAnalytics] = useState<any | null>(null);
  const [analyticsEvents, setAnalyticsEvents] = useState<any[]>([]);
  const [platformMetrics, setPlatformMetrics] = useState<any[]>([]);

  useEffect(() => {
    restoreSession();
  }, []);

  async function restoreSession() {

    try {

      if (!supabase) {
        return;
      }

      const { data } = await supabase.auth.getSession();

      if (data.session?.user) {
        await loadUser(data.session.user.id);
      }

    }
    catch(error){

      console.error("SESSION RESTORE ERROR", error);

    }
    finally {

      setAuthLoading(false);

    }

  }

  async function loadUser(userId: string) {
    const membership = await loadMembership(userId);

    setCurrentUser(membership.profile);
    setPractice(membership.practice);

    await loadAppData();
  }

  async function loadAppData() {
    try {
      const data = await loadPracticeData();

      setClients(data.clients);
      setPatients(data.patients);
      setConsultations(data.consultations);
      setMedicines(data.medicines);
      setOwnerSummaries(data.ownerSummaries);
      setVersions(data.versions);

      const logs = await loadAuditLogs();
      setAuditLogs(logs);

      const allProfiles = await loadProfiles();
      setProfiles(allProfiles);

      const allPractices = await loadPractices();
      setPractices(allPractices);
    } catch (error) {
      console.error("DATA LOAD ERROR", error);
    }
  }


  async function createAuditLog(
    action: string,
    type: string,
    status: string = "Completed"
  ) {

    const log: AuditLog = {
      id: crypto.randomUUID(),
      practiceId: practice?.id || "",
      action,
      actorUserId: currentUser?.id || "",
      entityType: type,
      entityId: currentUser?.id || "",
      description: action,
      createdAt: new Date().toISOString()
    } as AuditLog;


    setAuditLogs((prev) => [
      log,
      ...prev
    ]);


    if (!supabase) return;


    await supabase
      .from("audit_logs")
      .insert({
        id: log.id,
        practice_id: log.practiceId,
        action: log.action,
        entity_type: log.entityType,
        entity_id: log.entityId,
        description: log.description,
        actor_user_id: log.actorUserId,
        created_at: log.createdAt
      });

  }


  async function login(email: string, password: string): Promise<boolean> {

    setAuthLoading(true);

    if (!supabase) {
      setAuthLoading(false);
      return false;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("LOGIN ERROR", error);
      return false;
    }

    if (data.user) {
      await loadUser(data.user.id);
    }

    setAuthLoading(false);

    return true;
  }

  async function register(form: any): Promise<void> {
    if (!supabase) throw new Error("Supabase not configured");

    const { data: userData, error: userError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (userError) throw userError;

    if (!userData.user) throw new Error("No auth user returned");

    let {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      const retry = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      session = retry.data.session;
    }

    if (!session) throw new Error("No active session");

    const slug =
      form.practiceName.toLowerCase().trim().replace(/\s+/g, "-") +
      "-" +
      Date.now();

    const { data: practiceData, error: practiceError } = await supabase
      .from("practices")
      .insert({
        name: form.practiceName,
        slug,
        subdomain: slug,
        address_line_1: "",
        city: "",
        postcode: "",
        phone: "",
        email: form.email,
      })
      .select()
      .single();

    if (practiceError) throw practiceError;

    const { error: profileError } = await supabase.from("profiles").insert({
      auth_user_id: userData.user.id,
      practice_id: practiceData.id,
      first_name: form.firstName,
      last_name: form.lastName,
      email: form.email,
      role: form.role,
      is_active: true,
    });

    if (profileError) throw profileError;

    await loadUser(userData.user.id);
  }

  async function logout() {
    if (supabase) {
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
    setFollowUps([]);
  }

  async function createConsultation(patientId: string): Promise<string> {
    if (!practice || !currentUser) throw new Error("User not loaded");

    const patient = patients.find((p) => p.id === patientId);

    if (!patient) throw new Error("Patient not found");

    const client = clients.find((c) => c.id === patient.clientId);

    if (!client) throw new Error("Client not found");

    const id = crypto.randomUUID();

    const consultation: Consultation = {
      id,
      practiceId: practice.id,
      patientId,
      clientId: client.id,
      createdBy: currentUser.id,
      treatingVetId: currentUser.id,
      consultationDate: new Date().toISOString(),
      status: "draft",
      archived: false,
      captureType: "typed",
      transcript: "",
      updatedAt: new Date().toISOString(),
      version: 0,
    };

    const savedConsultation = await createConsultationRecord(consultation);

    setConsultations((prev) => [savedConsultation, ...prev]);

    return savedConsultation.id;
  }

  async function updateConsultation(
    id: string,
    changes: Partial<Consultation>
  ) {
    setConsultations((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, ...changes, updatedAt: new Date().toISOString() }
          : item
      )
    );

    if (!supabase) return;

    await supabase
      .from("consultations")
      .update({ ...changes, updated_at: new Date().toISOString() })
      .eq("id", id);
  }

  async function saveDraft(id: string, draft: ClinicalDraft, clinicalQuality?: any) {
    const consultation = consultations.find((x) => x.id === id);

    if (!consultation) return;

    setConsultations((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, clinicalNote: draft, clinicalQuality } : item
      )
    );

    if (!supabase) return;

    await supabase.from("clinical_notes").upsert({
      consultation_id: id,
      structured_content: draft,
      clinical_quality: clinicalQuality || null,
      version: consultation.version || 0,
    });
  }

  async function approveConsultation(
    id: string,
    draft: ClinicalDraft,
    reason?: string
  ) {
    const consultation = consultations.find((x) => x.id === id);

    if (!consultation) throw new Error("Consultation not found");

    const updated: Partial<Consultation> = {
      status: "approved",
      clinicalNote: draft,
      approvedBy: currentUser?.id,
      approvedAt: new Date().toISOString(),
      version: (consultation.version || 0) + 1,
    };

    await updateConsultation(id, updated);

    if (!supabase) return;

    await supabase.from("clinical_notes").upsert({
      consultation_id: id,
      structured_content: draft,
      approved_by: currentUser?.id,
      approved_at: new Date().toISOString(),
      version: (consultation.version || 0) + 1,
      change_reason: reason || null,
    });
  }

  async function archiveConsultation(id: string) {
    await updateConsultation(id, {
      archived: true,
    });
  }

  async function restoreConsultation(id: string) {
    await updateConsultation(id, {
      archived: false,
    });
  }

  async function addOwnerSummary(summary: OwnerSummary) {
    setOwnerSummaries((prev) => [summary, ...prev]);

    if (!supabase) return;

    await supabase.from("owner_summaries").insert(summary);
  }

  async function updateOwnerSummary(
    id: string,
    changes: Partial<OwnerSummary>
  ) {
    setOwnerSummaries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...changes } : item))
    );

    if (!supabase) return;

    await supabase.from("owner_summaries").update(changes).eq("id", id);
  }

  async function sendOwnerSummaryEmail(summaryId: string): Promise<void> {

    const summary =
      ownerSummaries.find(
        (item) => item.id === summaryId
      );

    if (!summary) {
      throw new Error("Owner summary not found");
    }


    const client =
      clients.find(
        (item) => item.id === summary.clientId
      );

    if (!client?.email) {
      throw new Error("Client email not found");
    }


    if (!supabase) {
      throw new Error("Supabase not configured");
    }


    const patient =
      patients.find(
        (item) => item.id === summary.patientId
      );


    /*
     * ============================================================
     * SEND OWNER SUMMARY
     * ============================================================
     *
     * Important:
     *
     * We deliberately do NOT treat the absence of a response body
     * as a failure. The Edge Function is responsible for returning
     * HTTP 200 only after Resend has accepted the email.
     *
     * We also keep the complete response available in the console
     * so that transport/function errors can be diagnosed without
     * changing the user-facing message.
     * ============================================================
     */

    try {

      const response =
        await supabase.functions.invoke(
          "send-owner-summary",
          {
            body: {
              email: client.email.trim(),

              ownerName:
                `${client.firstName} ${client.lastName}`.trim(),

              patientName:
                patient?.name || "your pet",

              summary
            }
          }
        );


      console.log(
        "send-owner-summary invoke response:",
        response
      );


      /*
       * ==========================================================
       * SUPABASE FUNCTION TRANSPORT ERROR
       * ==========================================================
       */

      if (response.error) {

        console.error(
          "send-owner-summary transport/function error:",
          response.error
        );


        /*
         * Supabase can expose additional information through
         * context/details depending on the version of the client.
         */

        const functionError =
          response.error as any;


        console.error(
          "Function error context:",
          functionError?.context
        );


        console.error(
          "Function error details:",
          functionError?.details
        );


        /*
         * Never claim success when the frontend has not received
         * a confirmed HTTP success from the Edge Function.
         */

        throw new Error(
          "The email service did not confirm the email request. Check the Edge Function logs before retrying."
        );

      }


      /*
       * ==========================================================
       * PARSE SUCCESS RESPONSE
       * ==========================================================
       */

      const result =
        response.data as
          | {
              success?: boolean;
              message?: string;
              id?: string | null;
              error?: string;
            }
          | null;


      console.log(
        "send-owner-summary response data:",
        result
      );


      /*
       * ==========================================================
       * EDGE FUNCTION EXPLICIT FAILURE
       * ==========================================================
       */

      if (
        result &&
        result.success === false
      ) {

        throw new Error(
          result.error ||
          "The email service reported that the email was not sent."
        );

      }


      /*
       * ==========================================================
       * SUCCESS
       * ==========================================================
       *
       * The Edge Function returns HTTP 200 only after Resend
       * successfully accepts the email.
       *
       * Therefore an invoke with no error is treated as success.
       * We do NOT require response.data.success to be present,
       * because the HTTP status from the Edge Function is the
       * authoritative success signal here.
       * ==========================================================
       */

      console.log(
        "Owner summary email successfully confirmed."
      );


      return;

    }
    catch (error) {

      console.error(
        "sendOwnerSummaryEmail failed:",
        error
      );


      if (error instanceof Error) {
        throw error;
      }


      throw new Error(
        "Unable to send the owner summary email."
      );

    }

  }


  async function addMedicine(medicine: Medicine) {
    setMedicines((prev) => [medicine, ...prev]);

    if (!supabase) return;

    await supabase.from("medicines").insert(medicine);
  }


  async function updateMedicine(
    id: string,
    changes: Partial<Medicine>
  ): Promise<void> {

    setMedicines((prev) =>
      prev.map((medicine) =>
        medicine.id === id
          ? { ...medicine, ...changes }
          : medicine
      )
    );


    if (!supabase) return;


    const { error } = await supabase
      .from("medicines")
      .update(changes)
      .eq("id", id);


    if (error) throw error;

  }


  async function archiveMedicine(
    id: string
  ): Promise<void> {

    setMedicines((prev) =>
      prev.map((medicine) =>
        medicine.id === id
          ? {
              ...medicine,
              archived: true
            } as Medicine
          : medicine
      )
    );


    if (!supabase) return;


    await supabase
      .from("medicines")
      .update({
        archived: true
      })
      .eq("id", id);

  }


  async function addFollowUp(followUp: FollowUp) {

    setFollowUps((prev) => [
      followUp,
      ...prev
    ]);

    if (!supabase) return;

    await supabase
      .from("follow_ups")
      .insert({
        id: followUp.id,
        practice_id: followUp.practiceId,
        patient_id: followUp.patientId,
        client_id: followUp.clientId,
        consultation_id: followUp.consultationId,
        created_by: followUp.createdBy,
        title: followUp.title,
        notes: followUp.notes,
        scheduled_date: followUp.scheduledDate,
        status: followUp.status,
        created_at: followUp.createdAt
      });
  }



  async function updateFollowUp(
    id: string,
    changes: Partial<FollowUp>
  ) {

    setFollowUps((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...changes
            }
          : item
      )
    );


    if (!supabase) return;


    await supabase
      .from("follow_ups")
      .update(changes)
      .eq("id", id);

  }



  async function completeFollowUp(
    id: string
  ) {

    await updateFollowUp(
      id,
      {
        status: "completed",
        completedAt: new Date().toISOString()
      }
    );

  }




  async function addVaccination(item: Vaccination){
    setVaccinations(prev => [item, ...prev]);
    if(supabase) await supabase.from("vaccinations").insert(item);
  }

  async function updateVaccination(id:string, changes:Partial<Vaccination>){
    setVaccinations(prev => prev.map(x => x.id===id ? {...x,...changes}:x));
    if(supabase) await supabase.from("vaccinations").update(changes).eq("id",id);
  }

  async function deleteVaccination(id:string){
    setVaccinations(prev => prev.filter(x=>x.id!==id));
    if(supabase) await supabase.from("vaccinations").delete().eq("id",id);
  }


  async function addAllergy(item: Allergy){
    setAllergies(prev => [item,...prev]);
    if(supabase) await supabase.from("allergies").insert(item);
  }

  async function updateAllergy(id:string, changes:Partial<Allergy>){
    setAllergies(prev => prev.map(x=>x.id===id?{...x,...changes}:x));
    if(supabase) await supabase.from("allergies").update(changes).eq("id",id);
  }

  async function deleteAllergy(id:string){
    setAllergies(prev=>prev.filter(x=>x.id!==id));
    if(supabase) await supabase.from("allergies").delete().eq("id",id);
  }


  async function addCondition(item: Condition){
    setConditions(prev=>[item,...prev]);
    if(supabase) await supabase.from("conditions").insert(item);
  }

  async function updateCondition(id:string, changes:Partial<Condition>){
    setConditions(prev=>prev.map(x=>x.id===id?{...x,...changes}:x));
    if(supabase) await supabase.from("conditions").update(changes).eq("id",id);
  }

  async function deleteCondition(id:string){
    setConditions(prev=>prev.filter(x=>x.id!==id));
    if(supabase) await supabase.from("conditions").delete().eq("id",id);
  }


  async function addPrescription(item: Prescription){
    setPrescriptions(prev=>[item,...prev]);
    if(supabase) await supabase.from("prescriptions").insert(item);
  }

  async function updatePrescription(id:string, changes:Partial<Prescription>){
    setPrescriptions(prev=>prev.map(x=>x.id===id?{...x,...changes}:x));
    if(supabase) await supabase.from("prescriptions").update(changes).eq("id",id);
  }

  async function deletePrescription(id:string){
    setPrescriptions(prev=>prev.filter(x=>x.id!==id));
    if(supabase) await supabase.from("prescriptions").delete().eq("id",id);
  }



  async function addAppointment(item: Appointment){

    setAppointments(prev => [item, ...prev]);

    if(!supabase) return;

    const { error } = await supabase
      .from("appointments")
      .insert({
        id: item.id,
        practice_id: item.practiceId,
        patient_id: item.patientId,
        client_id: item.clientId,
        assigned_vet_id: item.assignedVetId,
        appointment_date: item.appointmentDate,
        appointment_time: item.appointmentTime,
        reason: item.reason,
        notes: item.notes,
        status: item.status,
        created_by: item.createdBy,
        created_at: item.createdAt,
        updated_at: item.updatedAt
      });

    if(error) throw error;
  }


  async function updateAppointment(
    id:string,
    changes:Partial<Appointment>
  ){

    setAppointments(prev =>
      prev.map(item =>
        item.id === id
        ? {...item, ...changes}
        : item
      )
    );

    if(!supabase) return;

    await supabase
      .from("appointments")
      .update(changes)
      .eq("id", id);
  }


  async function deleteAppointment(id:string){

    setAppointments(prev =>
      prev.filter(item => item.id !== id)
    );

    if(!supabase) return;

    await supabase
      .from("appointments")
      .delete()
      .eq("id", id);
  }



  async function updateUserRole(
    id: string,
    role: string
  ): Promise<void> {

    if (currentUser?.id === id) {
      throw new Error("You cannot change your own role");
    }

    setProfiles((prev) =>
      prev.map((profile) =>
        profile.id === id
          ? {
              ...profile,
              role
            } as Profile
          : profile
      )
    );


    if (!supabase) return;


    const { error } = await supabase
      .from("profiles")
      .update({
        role
      })
      .eq("id", id);


    if (error) throw error;


    await createAuditLog(
      `User role updated for profile ${id} to ${role}`,
      "UPDATE"
    );

  }



  async function toggleUserStatus(
    id: string,
    active: boolean
  ): Promise<void> {

    if (currentUser?.id === id && !active) {
      throw new Error("You cannot disable your own account");
    }


    setProfiles((prev) =>
      prev.map((profile) =>
        profile.id === id
          ? {
              ...profile,
              isActive: active
            } as Profile
          : profile
      )
    );


    if (!supabase) return;


    const { error } = await supabase
      .from("profiles")
      .update({
        is_active: active
      })
      .eq("id", id);


    if (error) throw error;


    await createAuditLog(
      active
        ? `User activated: ${id}`
        : `User disabled: ${id}`,
      "UPDATE"
    );

  }



  async function addClient(client: Client) {
    setClients((prev) => [client, ...prev]);

    if (!supabase) return;

    await supabase.from("clients").insert({
      id: client.id,
      practice_id: client.practiceId,
      first_name: client.firstName,
      last_name: client.lastName,
      address_line_1: "",
      address_line_2: "",
      city: "",
      postcode: client.postcode,
      phone: client.phone,
      email: client.email,
    });
  }

  async function deleteClient(
    id: string
  ): Promise<void> {

    const deletedAt = new Date().toISOString();

    setClients((prev) =>
      prev.map((client) =>
        client.id === id
          ? {
              ...client,
              isDeleted: true,
              deletedAt
            } as Client
          : client
      )
    );

    if (!supabase) return;

    const { error } = await supabase
      .from("clients")
      .update({
        is_deleted: true,
        deleted_at: deletedAt
      })
      .eq("id", id);

    if (error) throw error;


    await createAuditLog(
      "Client record deleted",
      "DELETE"
    );

  }


  async function permanentDeleteClient(
    id: string
  ): Promise<void> {

    setClients((prev) =>
      prev.filter((client) => client.id !== id)
    );

    if (!supabase) return;

    const { error } = await supabase
      .from("clients")
      .delete()
      .eq("id", id);

    if (error) throw error;

    await createAuditLog(
      "Client permanently deleted",
      "PERMANENT_DELETE"
    );

  }


  async function restoreClient(
    id: string
  ): Promise<void> {

    const restoredAt = new Date().toISOString();

    setClients((prev) =>
      prev.map((client) =>
        client.id === id
          ? {
              ...client,
              isDeleted: false,
              deletedAt: undefined
            } as Client
          : client
      )
    );

    if (!supabase) return;

    const { error } = await supabase
      .from("clients")
      .update({
        is_deleted: false,
        deleted_at: null
      })
      .eq("id", id);

    if (error) throw error;

    await createAuditLog(
      "Client record restored",
      "RESTORE"
    );

  }



  async function addPatient(patient: Patient) {
    setPatients((prev) => [patient, ...prev]);

    if (!supabase) return;

    await supabase.from("patients").insert({
      id: patient.id,
      practice_id: patient.practiceId,
      client_id: patient.clientId,
      name: patient.name,
      species: patient.species,
      breed: patient.breed,
      sex: patient.sex,
      neutered: patient.neutered,
      date_of_birth: patient.dateOfBirth,
      microchip_number: patient.microchipNumber,
      colour: patient.colour,
      weight_kg: patient.weightKg,
    });
  }

  async function updatePatient(
    id: string,
    changes: Partial<Patient>
  ): Promise<void> {
    setPatients((prev) =>
      prev.map((patient) =>
        patient.id === id ? { ...patient, ...changes } : patient
      )
    );

    if (!supabase) return;

    const updateData: any = {};

    if (changes.practiceId !== undefined)
      updateData.practice_id = changes.practiceId;

    if (changes.clientId !== undefined)
      updateData.client_id = changes.clientId;

    if (changes.name !== undefined) updateData.name = changes.name;

    if (changes.species !== undefined) updateData.species = changes.species;

    if (changes.breed !== undefined) updateData.breed = changes.breed;

    if (changes.sex !== undefined) updateData.sex = changes.sex;

    if (changes.neutered !== undefined)
      updateData.neutered = changes.neutered;

    if (changes.dateOfBirth !== undefined)
      updateData.date_of_birth = changes.dateOfBirth;

    if (changes.microchipNumber !== undefined)
      updateData.microchip_number = changes.microchipNumber;

    if (changes.colour !== undefined) updateData.colour = changes.colour;

    if (changes.weightKg !== undefined)
      updateData.weight_kg = changes.weightKg;

    const { error } = await supabase
      .from("patients")
      .update(updateData)
      .eq("id", id);

    if (error) throw error;
  }

  async function deletePatient(
    id: string
  ): Promise<void> {

    const deletedAt = new Date().toISOString();

    setPatients((prev) =>
      prev.map((patient) =>
        patient.id === id
          ? {
              ...patient,
              isDeleted: true,
              deletedAt
            } as Patient
          : patient
      )
    );

    if (!supabase) return;

    const { error } = await supabase
      .from("patients")
      .update({
        is_deleted: true,
        deleted_at: deletedAt
      })
      .eq("id", id);

    if (error) throw error;


    await createAuditLog(
      "Patient record deleted",
      "DELETE"
    );

  }


  async function permanentDeletePatient(
    id: string
  ): Promise<void> {

    setPatients((prev) =>
      prev.filter((patient) => patient.id !== id)
    );

    if (!supabase) return;

    const { error } = await supabase
      .from("patients")
      .delete()
      .eq("id", id);

    if (error) throw error;

    await createAuditLog(
      "Patient permanently deleted",
      "PERMANENT_DELETE"
    );

  }


  async function restorePatient(
    id: string
  ): Promise<void> {

    setPatients((prev) =>
      prev.map((patient) =>
        patient.id === id
          ? {
              ...patient,
              isDeleted: false,
              deletedAt: undefined
            } as Patient
          : patient
      )
    );

    if (!supabase) return;

    const { error } = await supabase
      .from("patients")
      .update({
        is_deleted: false,
        deleted_at: null
      })
      .eq("id", id);

    if (error) throw error;

    await createAuditLog(
      "Patient record restored",
      "RESTORE"
    );

  }


  async function changePracticeStatus(id:string,status:string):Promise<void>{

    setPractices(prev=>prev.map(p=>p.id===id ? ({...p,status} as Practice):p));

    await updatePracticeStatus(id,status);

    await createAuditLog(
      `Practice status changed: ${id} -> ${status}`,
      "UPDATE"
    );
  }


  // ================================
  // PHASE 13 BUSINESS WORKFLOWS
  // ================================

  async function assignSubscription(payload:any){

    const subscription = await createSubscription(payload);

    await createAnalyticsEvent({
      practice_id: payload.practice_id,
      event_type:"subscription_created",
      metadata:subscription
    });

    setSubscriptions((prev)=>[
      subscription,
      ...prev
    ]);

    return subscription;
  }


  async function generateInvoice(payload:any){

    const invoice = await createInvoice(payload);

    await createAnalyticsEvent({
      practice_id:payload.practice_id,
      event_type:"invoice_created",
      metadata:invoice
    });

    setInvoices((prev)=>[
      invoice,
      ...prev
    ]);

    return invoice;
  }


  async function recordBusinessPayment(payload:any){

    const payment = await recordPayment(payload);

    await createAnalyticsEvent({
      practice_id:payload.practice_id,
      event_type:"payment_received",
      metadata:payment
    });

    setPayments((prev)=>[
      payment,
      ...prev
    ]);

    return payment;
  }


  async function getBusinessMetrics(){

    return await calculateBusinessMetrics();

  }




  return (
    <AppStateContext.Provider
      value={{
        currentUser,
        authLoading,
        practice,

        profiles,
        practices,

        clients,
        patients,
        consultations,
        medicines,
        ownerSummaries,
        versions,
        auditLogs,

        followUps,

        vaccinations,
        allergies,
        conditions,
        prescriptions,
        appointments,

        subscriptionPlans,
        subscriptions,
        invoices,
        payments,
        platformMetrics,

        login,
        register,
        logout,

        refreshData: loadAppData,

        createConsultation,
        updateConsultation,
        saveDraft,
        approveConsultation,
        archiveConsultation,
        restoreConsultation,

        addOwnerSummary,
        updateOwnerSummary,
        sendOwnerSummaryEmail,
        addMedicine,
        updateMedicine,
        archiveMedicine,

        addClient,
        deleteClient,
        restoreClient,
        permanentDeleteClient,
        addPatient,
        updatePatient,
        deletePatient,
        restorePatient,
        permanentDeletePatient,

        updateUserRole,
        toggleUserStatus,
        changePracticeStatus,

        assignSubscription,
        generateInvoice,
        recordBusinessPayment,
        getBusinessMetrics,

        addFollowUp,
        updateFollowUp,
        completeFollowUp,

        addVaccination,
        updateVaccination,
        deleteVaccination,

        addAllergy,
        updateAllergy,
        deleteAllergy,

        addCondition,
        updateCondition,
        deleteCondition,

        addPrescription,
updatePrescription,
deletePrescription,

addAppointment,
updateAppointment,
deleteAppointment,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);

  if (!context) throw new Error("AppStateProvider missing");

  return context;
}
// Phase 13 business actions ready for UI connection
