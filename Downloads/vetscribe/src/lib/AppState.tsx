import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { supabase } from "./supabase/client";

import {
 getCurrentSubscription as getSubscriptionService,
 checkSubscriptionStatus as checkSubscriptionService,
 checkSubscriptionLimit as checkSubscriptionLimitService,
 requireActiveSubscription,
} from "./services/subscriptionService";
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
  loadAIUsage,
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
  aiUsage: any[];

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
  createStaffMember(data: any): Promise<void>;
  logout(): Promise<void>;
  refreshData(): Promise<void>;

  assignSubscription(payload:any): Promise<any>;
  generateInvoice(payload:any): Promise<any>;
  recordBusinessPayment(payload:any): Promise<any>;
  getBusinessMetrics(): Promise<any>;
  checkSubscriptionLimit(type: string): {
    allowed: boolean;
    current: number;
    limit: number | string;
    message?: string;
  };
  checkSubscriptionStatus(): {
    active: boolean;
    status: string;
    message?: string;
  };

  referralCode: string;
  referrals: any[];
  generateReferralCode(): Promise<string>;
  validateReferralCode(code:string): Promise<any>;
  createReferral(payload:any): Promise<any>;
  loadReferrals(): Promise<any[]>;
  loadReferralCode(): Promise<string>;

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
  updateClient(id: string, changes: Partial<Client>): Promise<void>;
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
  updatePractice(data:any): Promise<void>;

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
  const [templates, setTemplates] = useState<any[]>([]);

  // Phase 13 Business Layer
  const [subscriptionPlans, setSubscriptionPlans] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [ invoices, setInvoices ] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [platformAnalytics, setPlatformAnalytics] = useState<any | null>(null);
  const [analyticsEvents, setAnalyticsEvents] = useState<any[]>([]);
  const [platformMetrics, setPlatformMetrics] = useState<any[]>([]);
  const [aiUsage, setAIUsage] = useState<any[]>([]);

  // Referral system state (Stage 1)
  const [referrals, setReferrals] = useState<any[]>([]);
  const [referralCode, setReferralCode] = useState<string>("");

  useEffect(() => {
    restoreSession();
  }, []);

  // Keep subscriptions synced after Stripe webhook creates/updates rows
  useEffect(() => {

    if(!supabase || !practice?.id) return;

    const channel = supabase
      .channel("subscription-sync")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "subscriptions",
          filter: `practice_id=eq.${practice.id}`
        },
        async () => {
          try {
            const updatedSubscriptions = await loadSubscriptions();

            const normalizedSubscriptions = (updatedSubscriptions || []).map((item:any)=>({
              ...item,
              practice_id: item.practice_id || item.practiceId || item.practice?.id,
              plan_id: item.plan_id || item.planId || item.plan?.id,
              status: item.status?.toLowerCase()?.trim() || "inactive"
            }));

            setSubscriptions(normalizedSubscriptions);

          } catch(error){
            console.error(
              "SUBSCRIPTION REALTIME REFRESH ERROR:",
              error
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };

  }, [practice?.id]);

  // Load referral code only after practice state is ready
  useEffect(() => {

    if (!practice?.id) return;

    loadReferralCode()
      .catch((error) => {
        console.error(
          "REFERRAL CODE LOAD ERROR:",
          error
        );
      });

  }, [practice?.id]);


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

  async function loadUser(userId: string): Promise<boolean> {
    const membership = await loadMembership(userId);

    // Block disabled staff accounts from entering the system
    if (membership.profile && membership.profile.isActive === false) {
      if (supabase) {
        await supabase.auth.signOut();
      }

      setCurrentUser(null);
      setPractice(null);
      setProfiles([]);

      throw new Error("Your account has been deactivated. Please contact your practice administrator.");
    }

    setCurrentUser(membership.profile);
    setPractice(membership.practice);

    await loadAppData();

    return true;
  }


async function loadAppData() {

 console.log("NEW APPSTATE VERSION LOADED");

  try {

    console.log("LOADING PRACTICE DATA");

    const data = await loadPracticeData();

    setClients(data.clients || []);
    setPatients(data.patients || []);
    setConsultations(data.consultations || []);
    setMedicines(data.medicines || []);
    setOwnerSummaries(data.ownerSummaries || []);
    setVersions(data.versions || []);


    const logs = await loadAuditLogs();

    setAuditLogs(logs || []);



    const allProfiles = await loadProfiles();

    setProfiles(allProfiles || []);



    const allPractices = await loadPractices();

    setPractices(allPractices || []);



    // =====================================
    // PHASE 13 BUSINESS DATA
    // Separate error handling
    // =====================================


    try {

      const plans = await loadSubscriptionPlans();

      console.log(
        "PLANS FROM SUPABASE:",
        plans
      );

      setSubscriptionPlans(
        plans || []
      );

    }
    catch(error){

      console.error(
        "SUBSCRIPTION PLANS LOAD ERROR:",
        error
      );

      setSubscriptionPlans([]);

    }



    try {

      const activeSubscriptions = await loadSubscriptions();

      console.log(
        "SUBSCRIPTIONS FROM SUPABASE:",
        activeSubscriptions
      );

      const normalizedSubscriptions = (activeSubscriptions || []).map((item:any)=>({
        ...item,
        practice_id: item.practice_id || item.practiceId || item.practice?.id,
        plan_id: item.plan_id || item.planId || item.plan?.id,
        status: item.status?.toLowerCase()?.trim() || "inactive"
      }));

      console.log("NORMALIZED SUBSCRIPTIONS:", normalizedSubscriptions);

      setSubscriptions(normalizedSubscriptions);

    }
    catch(error){

      console.error(
        "SUBSCRIPTIONS LOAD ERROR:",
        error
      );

      setSubscriptions([]);

    }


    // Referral code is loaded separately after practice state is available
    // because setPractice() is asynchronous and practice.id may not exist here yet




    try {

      const invoiceData = await loadInvoices();

      console.log(
        "INVOICES FROM SUPABASE:",
        invoiceData
      );


      setInvoices(
        invoiceData || []
      );


    }
    catch(error){

      console.error(
        "INVOICES LOAD ERROR:",
        error
      );


      setInvoices([]);

    }




    try {

      const paymentData = await loadPayments();

      console.log(
        "PAYMENTS FROM SUPABASE:",
        paymentData
      );


      setPayments(
        paymentData || []
      );


    }
    catch(error){

      console.error(
        "PAYMENTS LOAD ERROR:",
        error
      );


      setPayments([]);

    }





    try {

      const usageData = await loadAIUsage();

      setAIUsage(usageData || []);

    }
    catch(error){

      console.error("AI USAGE LOAD ERROR:", error);

      setAIUsage([]);

    }


    console.log(
      "ALL APP DATA LOADED"
    );


  }
  catch(error){

    console.error(
      "MAIN DATA LOAD ERROR:",
      error
    );

  }

}

  // Stripe return handler
  // Webhook may finish a few seconds after redirect, so refresh the whole
  // subscription state and remove the success flag from the URL.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("success") === "true" && practice?.id) {

      window.history.replaceState(
  null,
  "",
  window.location.pathname
      );

      let attempts = 0;

      const refreshSubscription = async () => {
        try {

          const updatedSubscriptions = await loadSubscriptions();

          console.log(
            "STRIPE RETURN SUBSCRIPTIONS REFRESH:",
            updatedSubscriptions
          );

          const normalizedSubscriptions = (updatedSubscriptions || []).map((item:any)=>({
            ...item,
            practice_id: item.practice_id || item.practiceId || item.practice?.id,
            plan_id: item.plan_id || item.planId || item.plan?.id,
            status: item.status?.toLowerCase()?.trim() || "inactive"
          }));

          setSubscriptions(normalizedSubscriptions);

        } catch(error) {

          console.error(
            "SUCCESS SUBSCRIPTION REFRESH ERROR:",
            error
          );

        }

        attempts++;

        if (attempts < 8) {
          setTimeout(refreshSubscription, 3000);
        }
      };

      refreshSubscription();
    }

  }, [practice?.id]);




  async function createAuditLog(
    action: string,
    type: string,
    entityId: string = "",
    metadata: any = {}
  ) {

    if (!practice?.id) {
      console.error(
        "AUDIT LOG SKIPPED: Missing practice id"
      );
      return;
    }

    const actorId =
      currentUser?.id || null;

    const cleanEntityId =
      entityId && entityId.trim()
        ? entityId
        : null;


    const log: any = {
      id: crypto.randomUUID(),
      practiceId: practice.id,
      action,
      actorUserId: actorId,
      actorEmail: currentUser?.email || "",
      entityType: type,
      entityId: cleanEntityId,
      description: action,
      metadata: {
        ...metadata,
        actorEmail: currentUser?.email || ""
      },
      createdAt: new Date().toISOString()
    };


    setAuditLogs((prev) => [
      log,
      ...prev
    ]);


    if (!supabase) return;


    const { error } = await supabase
      .from("audit_logs")
      .insert({
        id: log.id,
        practice_id: log.practiceId,
        action: log.action,
        entity_type: log.entityType,
        entity_id: log.entityId,
        description: log.description,
        metadata: log.metadata,
        actor_user_id: log.actorUserId,
        created_at: log.createdAt
      });


    if (error) {
      console.error(
        "AUDIT INSERT ERROR DETAILS:",
        JSON.stringify(error, null, 2)
      );
    }

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

    try {
      if (data.user) {
        await loadUser(data.user.id);
      }

      setAuthLoading(false);
      return true;

    } catch (error: any) {
      console.error("ACCOUNT ACCESS BLOCKED", error);
      setAuthLoading(false);

      // Pass the real reason back to LoginPage
      // so deactivated users see the correct message
      throw error;
    }
  }

  async function register(form: any): Promise<void> {
    if (!supabase) throw new Error("Supabase not configured");

    const { data: userData, error: userError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (userError) throw userError;
    if (!userData.user) throw new Error("No auth user returned");

    // Make sure the signup JWT is active before creating the practice row.
    // This prevents RLS from seeing the insert as an anonymous request.

    let {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      const retry = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (retry.error) throw retry.error;

      session = retry.data.session;
    }

    if (!session) {
      throw new Error("No active session after signup");
    }

    const refreshedSession = await supabase.auth.refreshSession();

    if (refreshedSession.error) {
      throw refreshedSession.error;
    }

    session = refreshedSession.data.session;

    if (!session) {
      throw new Error("Session refresh failed");
    }

    const { data: confirmedUserData, error: confirmedUserError } =
      await supabase.auth.getUser(session.access_token);

    console.log(
      "USER BEFORE PRACTICE INSERT:",
      confirmedUserData?.user
    );

    if (confirmedUserError || !confirmedUserData?.user) {
      throw new Error(
        "Authentication not ready before practice creation"
      );
    }

    await supabase.realtime.setAuth(session.access_token);

const slug =
  form.practiceName.toLowerCase().trim().replace(/\s+/g, "-") +
  "-" +
  Date.now();


    // Validate referral before creating the new practice
    // Keep one normalized referral code value through the complete signup flow
    const submittedReferralCode =
      form.referralCode ||
      form.referral_code ||
      "";

    let referralOwner: any = null;

    if (submittedReferralCode.trim()) {
      referralOwner = await validateReferralCode(
        submittedReferralCode.trim()
      );

      if (!referralOwner) {
        throw new Error("Invalid referral code");
      }
    }
console.log(
  "CURRENT SESSION BEFORE PRACTICE INSERT:",
  await supabase.auth.getSession()
);
    const practiceId = crypto.randomUUID();

    const { error: practiceError } = await supabase
      .from("practices")
      .insert({
        id: practiceId,
        name: form.practiceName,
        slug,
        subdomain: slug,
        address_line_1: "",
        city: "",
        postcode: "",
        phone: "",
        email: form.email,
      });

    if (practiceError) throw practiceError;

    const practiceData = { id: practiceId };

    const { error: profileError } = await supabase.from("profiles").insert({
      auth_user_id: userData.user.id,
      practice_id: practiceData.id,
      first_name: form.firstName,
      last_name: form.lastName,
      email: form.email,
      role: "practice_manager",
      is_active: true,
    });

    if (profileError) throw profileError;


    // =====================================================
    // CREATE DEFAULT STARTER SUBSCRIPTION + TRIAL
    // Referral users receive additional 30 days later
    // =====================================================

    // The database RPC validates the manager, selects Starter Monthly,
    // and creates a 14-day trial (+30 referral days if applicable).
    // Direct subscription inserts are blocked by subscription RLS.
    try {
      const { data: createdSubscriptionId, error: trialError } = await supabase.rpc(
        "create_initial_trial",
        {
          p_practice_id: practiceData.id,
          p_referral_code: referralOwner ? submittedReferralCode.trim() : null,
        }
      );

      if (trialError) throw trialError;
      if (!createdSubscriptionId) {
        throw new Error("Initial subscription trial creation was not confirmed.");
      }

      console.log(
        "INITIAL SUBSCRIPTION CREATED:",
        createdSubscriptionId
      );
    } catch (subscriptionError) {
      console.error(
        "INITIAL SUBSCRIPTION CREATION ERROR:",
        subscriptionError
      );
      throw subscriptionError;
    }


    // =====================================================
    // SAVE REFERRAL RELATIONSHIP
    // =====================================================

    if (referralOwner) {

  const referralCodeUsed =
    submittedReferralCode ||
    referralOwner.referral_code;


  if (!referralCodeUsed) {
    throw new Error("Referral code missing while creating referral record");
  }


  const { error: referralError } = await supabase
    .from("referrals")
    .insert({
      referrer_practice_id: referralOwner.id,
      referred_practice_id: practiceData.id,
      referral_code: referralCodeUsed.trim(),
      status: "completed",
    });


  if (referralError) {
    console.error(
      "REFERRAL CREATION ERROR:",
      referralError
    );

    throw referralError;
  }
}

    await new Promise(resolve => setTimeout(resolve, 1000));
    await loadUser(userData.user.id);
  }


  async function createStaffMember(data: any): Promise<void> {
    if (!supabase) throw new Error("Supabase not configured");

    if (!practice || !currentUser) {
      throw new Error("Practice not loaded");
    }

    ensureActiveSubscription();

    const userLimit = checkSubscriptionLimit("users");

    if (!userLimit.allowed) {
      throw new Error(userLimit.message || "Veterinarian limit reached. Please upgrade your subscription.");
    }

    // Create staff through a trusted Edge Function so the Practice Manager's
    // Supabase session is never replaced by the new veterinarian's session.
    // The function must verify the caller's practice_manager role and practice,
    // enforce staff limits server-side, and create the veterinarian profile with
    // must_change_password=true. Do not fall back to auth.signUp here.
    const { data: createdVet, error: createError } =
      await supabase.functions.invoke("create-veterinarian", {
        body: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
        },
      });

    if (createError) throw createError;
    if (createdVet?.error) {
      throw new Error(createdVet.error);
    }
    if (!createdVet?.userId) {
      throw new Error("Veterinarian creation was not confirmed by the server.");
    }

    await loadAppData();

    await createAuditLog(
      "Veterinarian staff member created",
      "STAFF",
      createdVet.userId,
      {
        staffName: `${data.firstName} ${data.lastName}`,
        role: "Veterinarian",
        email: data.email
      }
    );
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

    ensureActiveSubscription();

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

    await createAuditLog(
      `Consultation created for patient ${patient.name}`,
      "CREATE"
    );

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

    const dbChanges: any = {
      updated_at: new Date().toISOString(),
    };

    if (changes.status !== undefined)
      dbChanges.status = changes.status;

    if (changes.archived !== undefined)
      dbChanges.archived = changes.archived;

    if (changes.transcript !== undefined)
      dbChanges.transcript = changes.transcript;

    if (changes.captureType !== undefined)
      dbChanges.capture_type = changes.captureType;

    if (changes.approvedBy !== undefined)
      dbChanges.approved_by = changes.approvedBy;

    if (changes.approvedAt !== undefined)
      dbChanges.approved_at = changes.approvedAt;

    const { error } = await supabase
      .from("consultations")
      .update(dbChanges)
      .eq("id", id);

    if (error) {
      console.error("CONSULTATION UPDATE ERROR:", error);
      throw error;
    }

    await createAuditLog(
      `Consultation updated: ${id}`,
      "UPDATE"
    );
  }

  // Maps the structured draft onto the typed clinical_notes columns that the
  // database approval trigger (validate_approval) reads.
  function noteToText(value: any): string {
    if (value === null || value === undefined) return "";
    if (typeof value === "string") return value;
    if (Array.isArray(value)) {
      return value.map(noteToText).filter((x) => x.trim() !== "").join("\n");
    }
    if (typeof value === "object") {
      return Object.values(value)
        .map(noteToText)
        .filter((x) => x.trim() !== "")
        .join("\n");
    }
    return String(value);
  }

  function noteToArray(value: any): any[] {
    if (Array.isArray(value)) return value;
    if (value === null || value === undefined || value === "") return [];
    if (typeof value === "string") return value.trim() ? [value] : [];
    return [value];
  }

  function buildClinicalNoteColumns(draft: ClinicalDraft) {
    const d: any = draft || {};

    const asObject = (value: any) =>
      value && typeof value === "object" && !Array.isArray(value) ? value : {};

    const objectiveSection: any = asObject(d.objective);
    const assessmentSection: any = asObject(d.assessment);
    const planSection: any = asObject(d.plan);

    // Objective: clinical findings + vital parameters + diagnostic tests
    const vitals = noteToArray(objectiveSection.vital_parameters).map(
      (v: any) =>
        v && typeof v === "object" && v.name
          ? `${v.name}: ${v.value ?? ""}`.trim()
          : noteToText(v)
    );

    const tests = noteToArray(objectiveSection.diagnostic_tests).map(
      (t: any) =>
        t && typeof t === "object" && t.test
          ? `${t.test}${t.result ? `: ${t.result}` : ""}`
          : noteToText(t)
    );

    const objective = [
      typeof d.objective === "string"
        ? d.objective
        : noteToText(
            objectiveSection.clinical_findings ??
              objectiveSection.clinicalFindings ??
              objectiveSection.findings ??
              d.findings ??
              d.clinicalFindings
          ),
      ...vitals,
      ...tests,
    ]
      .map((x) => noteToText(x).trim())
      .filter((x) => x !== "")
      .join("\n");

    // Assessment
    const assessment = noteToText(
      typeof d.assessment === "string"
        ? d.assessment
        : assessmentSection.primary_assessment ??
            assessmentSection.primaryAssessment
    );

    const diagnoses = noteToArray(
      assessmentSection.diagnoses ?? d.diagnoses
    );

    const differentials = noteToArray(
      assessmentSection.differentials ?? d.differentials
    );

    // Plan: client advice, follow up, medications as text
    const plan = [
      typeof d.plan === "string" ? d.plan : "",
      planSection.client_advice,
      planSection.follow_up,
      ...noteToArray(planSection.medications).map((m: any) =>
        noteToText(m)
      ),
    ]
      .map((x) => noteToText(x).trim())
      .filter((x) => x !== "")
      .join("\n");

    const treatmentGiven = noteToArray(
      planSection.treatment_given ??
        planSection.treatmentGiven ??
        d.treatmentGiven ??
        d.treatment_given
    );

    return {
      objective,
      assessment,
      plan,
      diagnoses,
      differentials,
      treatment_given: treatmentGiven,
    };
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

    const { error: draftError } = await supabase
      .from("clinical_notes")
      .upsert(
        {
          consultation_id: id,
          practice_id: consultation.practiceId,
          patient_id: consultation.patientId,
          structured_content: draft,
          ...buildClinicalNoteColumns(draft),
          clinical_quality: clinicalQuality || null,
          version: consultation.version || 0,
        },
        { onConflict: "consultation_id" }
      );

    if (draftError) {
      console.error("SAVE DRAFT ERROR:", draftError);
      throw draftError;
    }

    await createAuditLog(
      "Clinical note edited",
      "CONSULTATION",
      id
    );
  }

  async function approveConsultation(
    id: string,
    draft: ClinicalDraft,
    reason?: string
  ) {
    const consultation = consultations.find((x) => x.id === id);

    if (!consultation) throw new Error("Consultation not found");

    if (!supabase) throw new Error("Supabase not configured");

    const approvalTime = new Date().toISOString();
    const newVersion = (consultation.version || 0) + 1;
console.log("APPROVAL DATA", {
  consultationId: id,
  consultationPractice: consultation.practiceId,
  consultationPatient: consultation.patientId,
});
console.log("APPROVAL NOTE PAYLOAD", {
  draft,
  columns: buildClinicalNoteColumns(draft),
});
    const { error: noteError } = await supabase
    
      .from("clinical_notes")
      .upsert(
        {
          consultation_id: id,
          practice_id: consultation.practiceId,
          patient_id: consultation.patientId,
          structured_content: draft,
          ...buildClinicalNoteColumns(draft),
          approved_by: currentUser?.id,
          approved_at: approvalTime,
          version: newVersion,
        },
        { onConflict: "consultation_id" }
      );

    if (noteError) {
      console.error("CLINICAL NOTE APPROVAL ERROR:", noteError);
      throw noteError;
    }

    await updateConsultation(id, {
      status: "approved",
      clinicalNote: draft,
      version: newVersion,
    });

    await createAuditLog(
      "Clinical note approved",
      "CONSULTATION",
      id
    );
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
        ? "Veterinarian activated"
        : "Veterinarian deactivated",
      "STAFF",
      id
    );

  }



  async function addClient(client: Client) {

    ensureActiveSubscription();

    const clientLimit = checkSubscriptionLimit("clients");

    if (!clientLimit.allowed) {
      throw new Error(clientLimit.message || "Client limit reached. Please upgrade your subscription.");
    }

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

    await createAuditLog(
      `Client created: ${client.firstName} ${client.lastName}`,
      "CREATE"
    );
  }

  async function updateClient(
    id: string,
    changes: Partial<Client>
  ): Promise<void> {

    setClients((prev) =>
      prev.map((client) =>
        client.id === id
          ? { ...client, ...changes }
          : client
      )
    );


    if (!supabase) return;


    const updateData: any = {};


    if (changes.firstName !== undefined)
      updateData.first_name = changes.firstName;

    if (changes.lastName !== undefined)
      updateData.last_name = changes.lastName;

    if (changes.email !== undefined)
      updateData.email = changes.email;

    if (changes.phone !== undefined)
      updateData.phone = changes.phone;

    if (changes.postcode !== undefined)
      updateData.postcode = changes.postcode;

    if (changes.address !== undefined)
      updateData.address_line_1 = changes.address;


    const { error } = await supabase
      .from("clients")
      .update(updateData)
      .eq("id", id);


    if (error) throw error;

    await createAuditLog(
      "Client updated",
      "CLIENT",
      id,
      {
        changes
      }
    );

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

    ensureActiveSubscription();

    const patientLimit = checkSubscriptionLimit("patients");

    if (!patientLimit.allowed) {
      throw new Error(patientLimit.message || "Patient limit reached. Please upgrade your subscription.");
    }

    setPatients((prev) => [patient, ...prev]);

    if (!supabase) return;

    const { error } = await supabase.from("patients").insert({
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

    if (error) {
      console.error("PATIENT INSERT ERROR:", error);

      setPatients((prev) =>
        prev.filter((item) => item.id !== patient.id)
      );

      throw error;
    }

    await createAuditLog(
      `Patient created: ${patient.name}`,
      "CREATE"
    );
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

    await createAuditLog(
      "Patient updated",
      "PATIENT",
      id,
      {
        changes
      }
    );
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
async function updatePractice(data:any): Promise<void>{

  if(!practice) {
    throw new Error("Practice not loaded");
  }


  if(!supabase){
    throw new Error("Supabase not configured");
  }


  const updateData:any = {};


  if(data.name !== undefined)
    updateData.name = data.name;


  if(data.email !== undefined)
    updateData.email = data.email;


  if(data.phone !== undefined)
    updateData.phone = data.phone;


  if(data.address_line_1 !== undefined)
    updateData.address_line_1 = data.address_line_1;


  if(data.city !== undefined)
    updateData.city = data.city;


  if(data.postcode !== undefined)
    updateData.postcode = data.postcode;


  if(data.logo_url !== undefined)
    updateData.logo_url = data.logo_url;



  const {error} = await supabase
    .from("practices")
    .update(updateData)
    .eq("id", practice.id);



  if(error){
    throw error;
  }



  setPractice({
    ...practice,
    ...data
  });



  await createAuditLog(
    "Practice profile updated",
    "UPDATE",
    practice.id,
    {
      changes:data
    }
  );

}


  // ================================
  // REFERRAL SYSTEM - STAGE 1
  // ================================

  async function generateReferralCode(): Promise<string> {

    if (!practice?.id) {
      throw new Error("Practice not loaded");
    }

    // Prevent generating a new code every time.
    // Existing clinics should always keep the same referral code.
    const existingReferralCode = (practice as any).referral_code as string | undefined;

    if (existingReferralCode) {
      setReferralCode(existingReferralCode);
      return existingReferralCode;
    }

    const base =
      (practice.name || "VETSCRIBE")
      .replace(/[^a-zA-Z0-9]/g, "")
      .substring(0,8)
      .toUpperCase();

    const code =
      `${base}${Math.floor(1000 + Math.random() * 9000)}`;

    if (supabase) {
      const { error } = await supabase
        .from("practices")
        .update({
          referral_code: code
        })
        .eq("id", practice.id);

      if (error) throw error;
    }

    setReferralCode(code);

    setPractice((prev:any)=>(
      prev
      ? {
          ...prev,
          referral_code: code
        }
      : prev
    ));

    return code;
  }


  async function loadReferralCode(): Promise<string> {

    if (!supabase || !practice?.id) {
      return "";
    }

    const { data, error } = await supabase
      .from("practices")
      .select("referral_code")
      .eq("id", practice.id)
      .single();

    if (error) {
      console.error("REFERRAL CODE LOAD ERROR:", error);
      return "";
    }

    let code = data?.referral_code || "";

    // Auto-create referral code for older/new clinics that do not have one yet.
    if (!code) {
      code = await generateReferralCode();
      return code;
    }

    setReferralCode(code);

    setPractice((prev:any) =>
      prev
        ? {
            ...prev,
            referral_code: code
          }
        : prev
    );

    return code;
  }


  async function validateReferralCode(code:string): Promise<any> {

    if (!supabase) {
      throw new Error("Supabase not configured");
    }

    const { data, error } = await supabase
      .from("practices")
      .select("id,name,referral_code")
      .eq("referral_code", code.trim())
      .single();

    if (error) {
      return null;
    }

    return data;
  }


  async function createReferral(payload:any): Promise<any> {

    if (!supabase) {
      throw new Error("Supabase not configured");
    }

    const { data, error } = await supabase
      .from("referrals")
      .insert({
        referrer_practice_id: payload.referrer_practice_id,
        referred_practice_id: payload.referred_practice_id,
        referral_code: payload.referral_code,
        status: "pending"
      })
      .select()
      .single();

    if (error) throw error;

    setReferrals((prev)=>[
      data,
      ...prev
    ]);

    return data;
  }


  async function loadReferrals(): Promise<any[]> {

    if (!supabase || !practice?.id) {
      return [];
    }

    const { data, error } = await supabase
      .from("referrals")
      .select("*")
      .eq("referrer_practice_id", practice.id);

    if (error) throw error;

    setReferrals(data || []);

    return data || [];
  }

  // ================================
  // PHASE 13 BUSINESS WORKFLOWS
  // ================================

  function ensureActiveSubscription(){

    return requireActiveSubscription(
      checkSubscriptionStatus()
    );

  }


  function getCurrentSubscription(){

    return getSubscriptionService(
      subscriptions,
      practice?.id
    );

  }


  function checkSubscriptionStatus(){

    return checkSubscriptionService(
      subscriptions,
      practice?.id
    );

  }


  function checkSubscriptionLimit(type: string){

    const currentSubscription = getCurrentSubscription();

    const currentPlan =
      subscriptionPlans.find(
        (item:any) =>
          item.id === currentSubscription?.plan_id
      );


    if(type === "users"){

      const currentUsers =
        profiles.filter(
          (profile:any) =>
            (profile.practiceId === practice?.id ||
             profile.practice_id === practice?.id) &&
            profile.role === "vet"
        ).length;


      return checkSubscriptionLimitService(
        currentSubscription,
        currentPlan,
        type,
        currentUsers
      );

    }


    if(type === "clients"){

      const currentClients =
        clients.filter(
          (client:any) =>
            client.practiceId === practice?.id ||
            client.practice_id === practice?.id
        ).length;


      return checkSubscriptionLimitService(
        currentSubscription,
        currentPlan,
        type,
        currentClients
      );

    }


    if(type === "patients"){

      const currentPatients =
        patients.filter(
          (patient:any) =>
            patient.practiceId === practice?.id ||
            patient.practice_id === practice?.id
        ).length;


      return checkSubscriptionLimitService(
        currentSubscription,
        currentPlan,
        type,
        currentPatients
      );

    }


    if(type === "ai"){

      const currentUsage =
        aiUsage.filter(
          (item:any)=>
            item.practice_id === practice?.id
        ).length;


      return checkSubscriptionLimitService(
        currentSubscription,
        currentPlan,
        type,
        currentUsage
      );

    }


    return {
      allowed:false,
      current:0,
      limit:0,
      message:"Unknown subscription limit type."
    };

  }



  async function assignSubscription(payload:any){

    const subscription = await createSubscription(payload);

    await createAuditLog(
      "Subscription changed",
      "SUBSCRIPTION",
      payload.practice_id,
      {
        subscription
      }
    );

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
        aiUsage,
        platformMetrics,

        login,
        register,
        createStaffMember,
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
        updateClient,
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
        updatePractice,

        assignSubscription,
        generateInvoice,
        recordBusinessPayment,
        getBusinessMetrics,
        checkSubscriptionLimit,
        checkSubscriptionStatus,

        referralCode,
        referrals,
        generateReferralCode,
        validateReferralCode,
        createReferral,
        loadReferrals,
        loadReferralCode,

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