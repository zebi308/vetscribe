import {
  useEffect,
  useRef,
  useState
} from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import {
  ArrowLeft,
  Mic,
  Pause,
  Play,
  Square,
  Upload,
  Sparkles,
  Save,
  CheckCircle,
  FileText,
  User,
  CalendarDays,
  PawPrint,
  Download,
  Edit3,
  AlertTriangle,
  ShieldCheck,
  Pill,
  Clock
} from "lucide-react";

import jsPDF from "jspdf";

import { supabase } from "../lib/supabase";

import { Card } from "../components/ui/Card";

import { Button } from "../components/ui/Button";

import { useAppState } from "../lib/AppState";
import { useToast } from "../lib/ToastContext";

export function ConsultationRoomPage(){

  // Phase 11 Toast notifications
  const { showToast } = useToast();

  const navigate = useNavigate();

  const { id } = useParams();

  const {
    consultations,
    patients,
    clients,
    updateConsultation,
    saveDraft,
    approveConsultation,
    addMedicine,
    addOwnerSummary,
    addFollowUp
  } = useAppState();

  const consultationData = consultations.find(item => item.id === id);

  if(!consultationData){

    return (
      <div className="p-8">

        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">

          <h2 className="text-xl font-bold text-slate-900">
            Consultation not found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            The consultation may have been deleted or is no longer available.
          </p>

          <Button
            className="mt-5"
            onClick={() => navigate("/dashboard/consultations")}
          >
            Back to Consultations
          </Button>

        </div>

      </div>
    );
  }

  const activeConsultation = consultationData;

  const consultationId = activeConsultation.id;

  const patient = patients.find(item => item.id === activeConsultation.patientId);

  const client = clients.find(item => item.id === activeConsultation.clientId);

  const ownerName =
    client
      ? `${client.firstName} ${client.lastName}`
      : "Unknown Owner";

  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [recordingReady, setRecordingReady] = useState(false);
  const [notes, setNotes] = useState(activeConsultation.transcript || "");
  const [draft, setDraft] = useState<any>(activeConsultation.clinicalNote || null);
  const [aiInsights, setAiInsights] = useState<any[]>(activeConsultation.aiInsights || []);

  const [clinicalQuality, setClinicalQuality] =
    useState<any>(activeConsultation.clinicalQuality || null);

  useEffect(() => {
    setDraft(activeConsultation.clinicalNote || null);
    setClinicalQuality(activeConsultation.clinicalQuality || null);
    setAiInsights(activeConsultation.aiInsights || []);
  }, [activeConsultation.id, activeConsultation.clinicalNote, activeConsultation.clinicalQuality]);

  const [editingSOAP, setEditingSOAP] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastAutoSave, setLastAutoSave] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showApprovalWarning, setShowApprovalWarning] = useState(false);
  const [showMedicationForm, setShowMedicationForm] = useState(false);
  const [medicationForm, setMedicationForm] =
    useState({
      medicineName:"",
      medicineCategory:"POM-V",
      quantity:"",
      unit:"",
      batchNumber:"",
      withdrawalPeriod:"",
      instructions:""
    });

  const [showFollowUpForm, setShowFollowUpForm] = useState(false);
  const [followUpForm, setFollowUpForm] =
    useState({
      title:"",
      dueDate:"",
      notes:""
    });

  const [transcribing, setTranscribing] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  const audioBlobRef = useRef<Blob | null>(null);

  useEffect(() => {

    if(!recording){
      return;
    }

    const timer =
      setInterval(() => {

        setSeconds(
          previous => previous + 1
        );

      },1000);

    return () =>
      clearInterval(timer);

  },[recording]);

  function formatTime(){

    const minutes =
      Math.floor(seconds / 60)
        .toString()
        .padStart(2,"0");

    const secondsValue =
      (seconds % 60)
        .toString()
        .padStart(2,"0");

    return `${minutes}:${secondsValue}`;
  }

  function getStatusLabel(){

    const status = activeConsultation.status;

    if(status === "approved"){
      return "Approved";
    }

    if(status === "draft"){
      return "Draft";
    }

    return status || "Draft";
  }

  function getStatusClasses(){

    const status = activeConsultation.status;

    if(status === "approved"){

      return `
        bg-green-50
        text-green-700
        border-green-200
      `;
    }

    return `
      bg-amber-50
      text-amber-700
      border-amber-200
    `;
  }

  async function startRecording(){

    try{

      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio:true
        });

      const recorder =
        new MediaRecorder(
          stream,
          {
            mimeType:"audio/webm;codecs=opus"
          }
        );

      const chunks: Blob[] = [];

      recorder.ondataavailable =
        event => {

          if(event.data.size > 0){

            chunks.push(
              event.data
            );
          }

        };

      recorder.onstop = () => {

        const blob =
          new Blob(
            chunks,
            {
              type:"audio/webm"
            }
          );

        audioBlobRef.current =
          blob;

        setRecordingReady(true);
      };

      recorder.start(1000);

      setMediaRecorder(recorder);

      setSeconds(0);

      setRecording(true);

      setPaused(false);
    }
    catch(error){

      console.error(
        "RECORDING ERROR",
        error
      );

      showToast(
        "Microphone permission was denied or recording is not available.",
        "error"
      );
    }

  }

  function togglePause(){

    if(!mediaRecorder){
      return;
    }

    if(
      mediaRecorder.state === "recording"
    ){

      mediaRecorder.pause();

      setPaused(true);

      return;
    }

    if(
      mediaRecorder.state === "paused"
    ){

      mediaRecorder.resume();

      setPaused(false);
    }

  }

  function stopRecording(){

    if(!mediaRecorder){
      return;
    }

    mediaRecorder.stop();

    mediaRecorder.stream
      .getTracks()
      .forEach(
        track =>
          track.stop()
      );

    setRecording(false);

    setPaused(false);
  }

  async function submitRecording(){

    const blob = audioBlobRef.current;

    if(!blob){

      showToast(
        "Recording is not ready. Please record and stop the consultation first.",
        "warning"
      );

      return;
    }

    try{

      setTranscribing(true);

      const {
        data:{
          session
        }
      } =
        await supabase.auth.getSession();

      if(!session){

        throw new Error(
          "Your session has expired. Please login again."
        );
      }

      const response =
        await fetch(
          "/api/transcribe",
          {
            method:"POST",
            headers:{
              "Content-Type":
                "audio/webm",
              Authorization:
                `Bearer ${session.access_token}`
            },
            body:blob
          }
        );

      const data = await response.json();

      if(!response.ok){

        throw new Error(
          data.error ||
          "Transcription failed."
        );
      }

      if(data.text){

        setNotes(
          data.text
        );

        await updateConsultation(
          consultationId,
          {
            transcript:data.text
          }
        );
      }

    }
    catch(error){

      console.error(
        "TRANSCRIPTION ERROR",
        error
      );

      showToast(
        error instanceof Error
          ? error.message
          : "Transcription failed.",
        "error"
      );
    }
    finally{

      setTranscribing(false);
    }

  }

  async function saveNotes(){

    try{

      await updateConsultation(
        consultationId,
        {
          transcript:notes
        }
      );

      setSavedAt(
        new Date().toLocaleString()
      );
    }
    catch(error){

      console.error(
        "SAVE TRANSCRIPT ERROR",
        error
      );

      showToast(
        "Failed to save transcript.",
        "error"
      );
    }

  }

  async function generateDraft(){

    if(!notes.trim()){

      showToast(
        "Please add or record a consultation transcript before generating the AI note.",
        "warning"
      );

      return;
    }

    try{

      setLoading(true);

      const response =
        await fetch(
          "/api/clinical-note",
          {
            method:"POST",
            headers:{
              "Content-Type":
                "application/json"
            },
            body:JSON.stringify({
              transcript:notes,
              patient,
              client
            })
          }
        );

      if(!response.ok){

        const error = await response.text();

        throw new Error(
          error ||
          "SOAP generation failed."
        );
      }

      const generated = await response.json();

      const generatedNote = generated.clinicalNote || generated;

      const generatedInsights = generated.insights || [];

      const generatedQuality =
        generated.clinicalQuality || null;

      setClinicalQuality(generatedQuality);

      setDraft(
        generatedNote
      );

      setAiInsights(
        generatedInsights
      );

      await saveDraft(
        consultationId,
        generatedNote,
        generatedQuality
      );

      await updateConsultation(
        consultationId,
        {
          aiInsights:generatedInsights,
          clinicalQuality:generatedQuality
        }
      );

      setSavedAt(
        new Date().toLocaleString()
      );
    }
    catch(error){

      console.error(
        "SOAP ERROR",
        error
      );

      showToast(
        error instanceof Error
          ? error.message
          : "SOAP generation failed.",
        "error"
      );
    }
    finally{

      setLoading(false);
    }

  }

  async function handleSaveDraft(){

    if(!draft){

      showToast(
        "There is no clinical note to save yet.",
        "warning"
      );

      return;
    }

    try{

      setLoading(true);

      await saveDraft(
        consultationId,
        draft,
        clinicalQuality
      );

      setSavedAt(
        new Date().toLocaleString()
      );

      setEditingSOAP(false);
    }
    catch(error){

      console.error(
        "SAVE SOAP ERROR",
        error
      );

      showToast(
        "Failed to save the clinical note.",
        "error"
      );
    }
    finally{

      setLoading(false);
    }

  }

  function getHighSeverityMissingInformation(){

    if(!draft?.missing_information){
      return [];
    }

    return draft.missing_information.filter(
      item =>
        item.severity === "high" &&
        !item.dismissed
    );
  }

  async function handleApprove(
    approveAnyway:boolean = false
  ){

    if(!draft){

      showToast(
        "Generate or save the clinical note before approving it.",
        "warning"
      );

      return;
    }

    const highRiskItems = getHighSeverityMissingInformation();

    if(
      highRiskItems.length > 0 &&
      !approveAnyway
    ){

      setShowApprovalWarning(true);

      return;
    }

    setShowApprovalWarning(false);

    try{

      setLoading(true);

      await approveConsultation(
        consultationId,
        draft,
        "Approved by veterinarian"
      );

      await updateConsultation(
        consultationId,
        {
          status:"approved"
        }
      );

      setSavedAt(
        new Date().toLocaleString()
      );
    }
    catch(error){

      console.error(
        "APPROVE ERROR",
        error
      );

      showToast(
        "Failed to approve the consultation.",
        "error"
      );
    }
    finally{

      setLoading(false);
    }

  }

  async function handleAddMedication(){

    try{

      await addMedicine({
        id:crypto.randomUUID(),
        practiceId:activeConsultation.practiceId,
        patientId:activeConsultation.patientId,
        clientId:activeConsultation.clientId,
        consultationId,
        prescribingVetId:activeConsultation.treatingVetId,
        medicineName:medicationForm.medicineName,
        medicineCategory:medicationForm.medicineCategory as any,
        quantity:medicationForm.quantity,
        unit:medicationForm.unit,
        batchNumber:medicationForm.batchNumber,
        prescribedDate:new Date().toISOString(),
        withdrawalPeriod:medicationForm.withdrawalPeriod,
        instructions:medicationForm.instructions
      });

      setMedicationForm({
        medicineName:"",
        medicineCategory:"POM-V",
        quantity:"",
        unit:"",
        batchNumber:"",
        withdrawalPeriod:"",
        instructions:""
      });

      setShowMedicationForm(false);

      showToast("Medication added successfully", "success");
    }
    catch(error){

      console.error("ADD MEDICATION ERROR",error);

      showToast("Failed to add medication", "error");
    }

  }

  async function handleCreateFollowUp(){

    if(!followUpForm.title || !followUpForm.dueDate){

      showToast("Please add follow-up title and date.", "warning");

      return;
    }

    try{

      await addFollowUp({
        id:crypto.randomUUID(),
        practiceId:activeConsultation.practiceId,
        patientId:activeConsultation.patientId,
        clientId:activeConsultation.clientId,
        consultationId,
        title:followUpForm.title,
        dueDate:followUpForm.dueDate,
        notes:followUpForm.notes,
        status:"scheduled",
        createdAt:new Date().toISOString()
      });

      setFollowUpForm({
        title:"",
        dueDate:"",
        notes:""
      });

      setShowFollowUpForm(false);

      showToast("Follow-up created successfully.", "success");
    }
    catch(error){

      console.error("FOLLOW UP ERROR",error);

      showToast("Failed to create follow-up.", "error");
    }

  }

  async function handleGenerateOwnerSummary(){

    if(!draft){

      showToast(
        "Approve or generate the clinical note before creating an owner summary.",
        "warning"
      );

      return;
    }

    try{

      const summary = {
        id:crypto.randomUUID(),
        practiceId:activeConsultation.practiceId,
        consultationId,
        patientId:activeConsultation.patientId,
        clientId:activeConsultation.clientId,
        title:
          `${patient?.name || "Patient"} Consultation Summary`,
        whatWeFound:
          draft.assessment?.primary_assessment ||
          draft.objective?.clinical_findings ||
          "No findings recorded.",
        whatWeDiscussed:
          draft.subjective?.history ||
          "Clinical discussion recorded during consultation.",
        treatmentAndMedication:
          displayValue(
            [
              draft.plan?.treatment_given,
              draft.plan?.medications
            ]
          ),
        whatToDoAtHome:
          draft.plan?.client_advice ||
          "Follow veterinarian instructions.",
        whenToContactUs:
          "Contact the clinic if symptoms worsen or concerns arise.",
        followUp:
          draft.plan?.follow_up ||
          "No follow-up recorded.",
        generatedAt:
          new Date().toISOString(),
        generatedBy:
          activeConsultation.treatingVetId
      };

      if(addOwnerSummary){

        await addOwnerSummary(summary);
      }
      else{

        console.warn(
          "addOwnerSummary is not available in AppState yet."
        );
      }

      showToast(
        "Owner summary generated successfully.",
        "success"
      );

      navigate(
        "/dashboard/owner-summaries"
      );
    }
    catch(error){

      console.error(
        "OWNER SUMMARY ERROR",
        error
      );

      showToast(
        "Failed to generate owner summary.",
        "error"
      );
    }

  }

  function exportPDF(){

    if(!draft){

      showToast(
        "There is no clinical note to export.",
        "warning"
      );

      return;
    }

    const pdf = new jsPDF();

    pdf.setFontSize(18);

    pdf.text(
      "Veterinary Clinical Record",
      20,
      20
    );

    pdf.setFontSize(12);

    pdf.text(
      `Patient: ${patient?.name || ""}`,
      20,
      35
    );

    pdf.text(
      `Species: ${patient?.species || ""}`,
      20,
      45
    );

    pdf.text(
      `Breed: ${patient?.breed || ""}`,
      20,
      55
    );

    pdf.text(
      `Owner: ${ownerName}`,
      20,
      65
    );

    let y = 85;

    function addSection(
      title:string,
      value:string
    ){

      pdf.setFontSize(13);

      pdf.text(
        title,
        20,
        y
      );

      y += 8;

      pdf.setFontSize(10);

      const lines =
        pdf.splitTextToSize(
          value || "Not specified",
          170
        );

      pdf.text(
        lines,
        20,
        y
      );

      y +=
        Math.max(
          18,
          lines.length * 5 + 10
        );

      if(y > 270){

        pdf.addPage();

        y = 20;
      }

    }

    addSection(
      "SUBJECTIVE",
      draft.subjective?.presenting_complaint || ""
    );

    addSection(
      "HISTORY",
      draft.subjective?.history || ""
    );

    addSection(
      "OWNER OBSERVATIONS",
      draft.subjective?.owner_observations || ""
    );

    addSection(
      "OBJECTIVE",
      draft.objective?.clinical_findings || ""
    );

    addSection(
      "ASSESSMENT",
      draft.assessment?.primary_assessment || ""
    );

    addSection(
      "TREATMENT",
      displayValue(
        draft.plan?.treatment_given
      )
    );

    addSection(
      "MEDICATIONS",
      displayValue(
        draft.plan?.medications
      )
    );

    addSection(
      "FOLLOW UP",
      draft.plan?.follow_up || ""
    );

    pdf.save(
      `${patient?.name || "patient"}-clinical-record.pdf`
    );
  }

  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {

    if(!draft || !editingSOAP){
      return;
    }

    if(autoSaveTimer.current){
      clearTimeout(autoSaveTimer.current);
    }

    autoSaveTimer.current = setTimeout(async () => {

      try{

        setAutoSaving(true);

        await saveDraft(
          consultationId,
          draft,
          clinicalQuality
        );

        const now = new Date().toLocaleString();

        setLastAutoSave(now);
        setSavedAt(now);

      }
      catch(error){

        console.error(
          "AUTO SAVE ERROR",
          error
        );

      }
      finally{

        setAutoSaving(false);

      }

    },5000);


    return () => {

      if(autoSaveTimer.current){

        clearTimeout(autoSaveTimer.current);

      }

    };

  },[
    draft,
    editingSOAP,
    consultationId,
    clinicalQuality
  ]);


  function updateSOAPField(
    section:string,
    field:string,
    value:string
  ){

    setDraft(
      (previous:any) => ({

        ...previous,

        [section]:{

          ...(previous?.[section] || {}),

          [field]:value
        }

      })
    );
  }

  function displayValue(
    value:any
  ){

    if(
      value === null ||
      value === undefined ||
      value === ""
    ){

      return "Not specified";
    }

    if(
      Array.isArray(value)
    ){

      return value
        .map(
          item => {

            if(
              typeof item === "object"
            ){

              return JSON.stringify(
                item
              );
            }

            return String(item);
          }
        )
        .join(", ");
    }

    if(
      typeof value === "object"
    ){

      return JSON.stringify(
        value
      );
    }

    return String(value);
  }

  function calculateConfidenceScore(){

    if(!draft){
      return 0;
    }

    let score = 0;

    if(draft.subjective?.presenting_complaint){
      score += 20;
    }

    if(draft.subjective?.history){
      score += 20;
    }

    if(draft.objective?.clinical_findings){
      score += 20;
    }

    if(draft.assessment?.primary_assessment){
      score += 20;
    }

    if(
      draft.plan?.treatment_given?.length ||
      draft.plan?.medications?.length ||
      draft.plan?.client_advice
    ){
      score += 20;
    }

    return score;
  }

  function renderAIInsights(){

    if(!aiInsights || aiInsights.length === 0){
      return null;
    }

    return (

      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">

        <h3 className="font-bold text-blue-900">
          AI Clinical Insights
        </h3>

        <p className="mt-1 text-sm text-blue-700">
          Additional points identified for veterinarian review.
        </p>

        <div className="mt-4 space-y-3">

          {
            aiInsights.map(
              (item:any,index:number) => (

                <div
                  key={index}
                  className="rounded-xl border border-blue-100 bg-white p-4"
                >

                  <p className="font-semibold text-slate-900">
                    {item.message || item}
                  </p>

                  {
                    item.confidence && (
                      <p className="mt-1 text-xs text-blue-700">
                        Confidence: {item.confidence}%
                      </p>
                    )
                  }

                </div>

              )
            )
          }

        </div>

      </div>

    );
  }

  function renderMissingInformation(){

    if(
      !draft?.missing_information ||
      !Array.isArray(
        draft.missing_information
      ) ||
      draft.missing_information.length === 0
    ){

      return null;
    }

    return (

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">

        <div className="flex items-start gap-3">

          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-700">

            <AlertTriangle size={20}/>

          </div>

          <div>

            <h4 className="font-bold text-amber-900">
              Information requiring review
            </h4>

            <p className="mt-1 text-sm text-amber-800">
              The AI identified information that may need veterinarian review.
            </p>

          </div>

        </div>

        <div className="mt-4 space-y-3">

          {
            draft.missing_information.map(
              (item:any,index:number) => (

                <div
                  key={index}
                  className="rounded-xl border border-amber-200 bg-white p-4"
                >

                  <p className="font-semibold text-slate-900">

                    {
                      item.field ||
                      "Missing information"
                    }

                  </p>

                  <p className="mt-1 text-sm text-slate-600">

                    {
                      item.reason ||
                      "Needs veterinarian review."
                    }

                  </p>

                </div>

              )
            )
          }

        </div>

      </div>

    );
  }


  function renderClinicalQuality(){

    if(!clinicalQuality){
      return null;
    }

    return (

      <div className="rounded-2xl border border-slate-200 bg-white p-5">

        <div className="flex items-center justify-between">

          <div>
            <h3 className="font-bold text-slate-900">
              Clinical Note Quality
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              AI evaluation of documentation completeness and clarity.
            </p>
          </div>

          <ShieldCheck size={24} className="text-teal-700"/>

        </div>


        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">

          {
            Object.entries(clinicalQuality).map(
              ([key,value]:any)=>(

                typeof value === "number" &&

                <div
                  key={key}
                  className="rounded-xl bg-slate-50 p-4"
                >

                  <p className="text-xs uppercase text-slate-500">
                    {key}
                  </p>

                  <p className="mt-2 text-xl font-bold text-slate-900">
                    {value}%
                  </p>

                </div>

              )
            )
          }

        </div>

      </div>

    );

  }


  function renderPatientContext(){

    return (

      <Card className="p-5">

        <h3 className="font-bold text-slate-900">
          Patient Context
        </h3>

        <div className="mt-4 space-y-3 text-sm">

          <div>
            <p className="text-slate-400">Patient</p>
            <p className="font-semibold text-slate-900">
              {patient?.name || "Unknown"}
            </p>
          </div>

          <div>
            <p className="text-slate-400">Species</p>
            <p className="font-semibold text-slate-900">
              {patient?.species || "Not recorded"}
              {patient?.breed ? ` • ${patient.breed}` : ""}
            </p>
          </div>

          <div>
            <p className="text-slate-400">Weight</p>
            <p className="font-semibold text-slate-900">
              {patient?.weightKg ? `${patient.weightKg} kg` : "Not recorded"}
            </p>
          </div>

          <Button
            onClick={() =>
              navigate(`/dashboard/patients/${activeConsultation.patientId}/history`)
            }
          >
            View Full History
          </Button>

        </div>

      </Card>

    );
  }


  function renderQuickActions(){

    return (

      <Card className="p-5">

        <h3 className="font-bold text-slate-900">
          Quick Actions
        </h3>

        <div className="mt-4 flex flex-wrap gap-3">

          <Button
            onClick={() => setShowMedicationForm(true)}
          >
            Add Medication
          </Button>

          <Button
            onClick={handleGenerateOwnerSummary}
            disabled={!draft}
          >
            Owner Summary
          </Button>

          <Button
            onClick={() => setEditingSOAP(true)}
            disabled={!draft}
          >
            Edit SOAP
          </Button>

        </div>

      </Card>

    );
  }

  return (

    <div className="w-full max-w-full overflow-x-hidden space-y-6 pb-10">

      {/* HEADER */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-start gap-3">

          <button
            type="button"
            onClick={() =>
              navigate(
                "/dashboard/consultations"
              )
            }
            className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          >

            <ArrowLeft size={18}/>

          </button>

          <div>

            <p className="text-sm font-medium text-teal-600">
              Consultation
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">
              Clinical Documentation
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Review, edit and approve the clinical record.
            </p>

          </div>

        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">

          <span className={`
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            px-4
            py-2
            text-sm
            font-semibold
            ${getStatusClasses()}
          `}>

            {
              activeConsultation.status === "approved"
                ? <CheckCircle size={15}/>
                : <FileText size={15}/>
            }

            {getStatusLabel()}

          </span>

          {
            draft && (

              <Button onClick={exportPDF}>

                <Download size={17}/>

                Export PDF

              </Button>

            )
          }

        </div>

      </div>

      {/* PATIENT / OWNER SUMMARY */}

      <Card className="p-5 sm:p-6">

        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">

          <div className="flex items-center gap-3">

            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-700">

              <PawPrint size={21}/>

            </div>

            <div>

              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Patient
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {patient?.name || "Unknown Patient"}
              </p>

            </div>

          </div>

          <div className="flex items-center gap-3">

            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-50 text-slate-600">

              <FileText size={20}/>

            </div>

            <div>

              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Species
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {patient?.species || "Not specified"}
                {patient?.breed
                  ? ` • ${patient.breed}`
                  : ""
                }
              </p>

            </div>

          </div>

          <div className="flex items-center gap-3">

            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-50 text-slate-600">

              <User size={20}/>

            </div>

            <div>

              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Owner
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {ownerName}
              </p>

            </div>

          </div>

          <div className="flex items-center gap-3">

            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-50 text-slate-600">

              <CalendarDays size={20}/>

            </div>

            <div>

              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Consultation date
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {
                  activeConsultation.consultationDate
                    ? new Date(
                        activeConsultation.consultationDate
                      ).toLocaleString()
                    : "Not available"
                }
              </p>

            </div>

          </div>

        </div>

        <div className="mt-5 border-t border-slate-100 pt-5">

          <Button
            onClick={() =>
              navigate(
                `/dashboard/patients/${activeConsultation.patientId}/history`
              )
            }
          >
            View Medical History
          </Button>

        </div>

      </Card>


      {/* PHASE 10.7.1 + 10.7.2 */}

      <div className="grid gap-6 lg:grid-cols-[320px_1fr] grid-cols-1">

        <div className="space-y-6">

          {renderPatientContext()}

          {renderQuickActions()}

        </div>

        <div />

      </div>

      {/* RECORDING */}

      <Card className="p-5 sm:p-6">

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>

            <div className="flex items-center gap-2">

              <div className="grid h-10 w-10 place-items-center rounded-xl bg-teal-50 text-teal-700">

                <Mic size={20}/>

              </div>

              <h2 className="text-lg font-bold text-slate-900">
                Consultation Recording
              </h2>

            </div>

            <p className="mt-2 text-sm text-slate-500">
              Record the consultation and convert it into a clinical transcript.
            </p>

          </div>

          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">

            {
              !recording && (

                <Button onClick={startRecording}>

                  <Mic size={17}/>

                  Start Recording

                </Button>

              )
            }

            {
              recording && (

                <>

                  <Button onClick={togglePause}>

                    {
                      paused
                        ? <Play size={17}/>
                        : <Pause size={17}/>
                    }

                    {
                      paused
                        ? "Resume"
                        : "Pause"
                    }

                  </Button>

                  <Button onClick={stopRecording}>

                    <Square size={17}/>

                    Stop

                  </Button>

                </>

              )
            }

            {
              !recording &&
              recordingReady && (

                <Button
                  disabled={transcribing}
                  onClick={submitRecording}
                >

                  <Upload size={17}/>

                  {
                    transcribing
                      ? "Transcribing..."
                      : "Transcribe Recording"
                  }

                </Button>

              )
            }

          </div>

        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">

          <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">

            <span className={`
              h-2
              w-2
              rounded-full
              ${recording
                ? "bg-red-500 animate-pulse"
                : "bg-slate-300"
              }
            `}/>

            {
              recording
                ? `Recording ${formatTime()}`
                : recordingReady
                  ? "Recording ready"
                  : "Ready to record"
            }

          </span>

          {
            recording && (

              <span className="text-sm text-red-600 font-medium">
                Live recording in progress
              </span>

            )
          }

        </div>

      </Card>

      {/* TRANSCRIPT */}

      <Card className="p-5 sm:p-6">

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>

            <h2 className="text-lg font-bold text-slate-900">
              Consultation Transcript
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Review the conversation before generating the AI clinical note.
            </p>

          </div>

          <Button onClick={saveNotes}>

            <Save size={17}/>

            Save Transcript

          </Button>

        </div>

        <textarea
          value={notes}
          onChange={
            event =>
              setNotes(
                event.target.value
              )
          }
          placeholder="
            Doctor conversation transcript will appear here...
          "
          className="mt-5 min-h-[240px] w-full resize-y rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
        />

        {
          savedAt && (

            <p className="mt-3 text-xs text-slate-400">
              Last saved: {savedAt}
            </p>

          )
        }

        {
          editingSOAP && (

            <p className="mt-2 text-xs text-teal-600">

              {
                autoSaving
                  ? "Saving draft automatically..."
                  : lastAutoSave
                    ? `Auto-saved: ${lastAutoSave}`
                    : "Auto-save enabled"
              }

            </p>

          )
        }

      </Card>

      {/* AI CLINICAL NOTE */}

      <Card className="p-5 sm:p-6">

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <div className="flex items-center gap-3">

              <div className="grid h-11 w-11 place-items-center rounded-xl bg-teal-50 text-teal-700">

                <Sparkles size={21}/>

              </div>

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  AI Clinical SOAP Record
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  AI-assisted clinical documentation for veterinarian review.
                </p>

              </div>

            </div>

          </div>

          <div className="flex flex-wrap gap-2">

            <Button
              disabled={loading}
              onClick={generateDraft}
            >

              <Sparkles size={17}/>

              {
                loading
                  ? "Generating..."
                  : "Generate SOAP"
              }

            </Button>

            {
              draft && (

                <>

                  <Button
                    onClick={() =>
                      setEditingSOAP(
                        previous =>
                          !previous
                      )
                    }
                  >

                    <Edit3 size={17}/>

                    {
                      editingSOAP
                        ? "Stop Editing"
                        : "Edit SOAP"
                    }

                  </Button>

                  <Button onClick={exportPDF}>

                    <Download size={17}/>

                    Export

                  </Button>

                </>

              )
            }

          </div>

        </div>

        {
          !draft && (

            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">

              <Sparkles size={30} className="mx-auto text-teal-500"/>

              <h3 className="mt-3 font-semibold text-slate-900">
                No clinical note generated yet
              </h3>

              <p className="mx-auto mt-1 max-w-lg text-sm text-slate-500">
                Add a consultation transcript above and generate a SOAP record for veterinarian review.
              </p>

            </div>

          )
        }

        {
          draft && (

            <div className="mt-6 space-y-5">

              {renderMissingInformation()}

              {renderAIInsights()}

              {/* SUBJECTIVE */}

              <div className="rounded-2xl border border-slate-200 bg-white p-5">

                <div className="flex items-center gap-3">

                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-700 font-bold">
                    S
                  </span>

                  <h3 className="text-lg font-bold text-slate-900">
                    Subjective
                  </h3>

                </div>

                <div className="mt-5 space-y-5">

                  <div>

                    <label className="text-sm font-semibold text-slate-700">
                      Presenting Complaint
                    </label>

                    {
                      editingSOAP
                        ? (

                          <textarea
                            value={
                              draft.subjective?.presenting_complaint || ""
                            }
                            onChange={
                              event =>
                                updateSOAPField(
                                  "subjective",
                                  "presenting_complaint",
                                  event.target.value
                                )
                            }
                            rows={4}
                            className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-teal-500"
                          />

                        )
                        : (

                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {
                              draft.subjective?.presenting_complaint ||
                              "Not specified"
                            }
                          </p>

                        )
                    }

                  </div>

                  <div>

                    <label className="text-sm font-semibold text-slate-700">
                      History
                    </label>

                    {
                      editingSOAP
                        ? (

                          <textarea
                            value={
                              draft.subjective?.history || ""
                            }
                            onChange={
                              event =>
                                updateSOAPField(
                                  "subjective",
                                  "history",
                                  event.target.value
                                )
                            }
                            rows={4}
                            className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-teal-500"
                          />

                        )
                        : (

                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {
                              draft.subjective?.history ||
                              "Not specified"
                            }
                          </p>

                        )
                    }

                  </div>

                  <div>

                    <label className="text-sm font-semibold text-slate-700">
                      Owner Observations
                    </label>

                    {
                      editingSOAP
                        ? (

                          <textarea
                            value={
                              draft.subjective?.owner_observations || ""
                            }
                            onChange={
                              event =>
                                updateSOAPField(
                                  "subjective",
                                  "owner_observations",
                                  event.target.value
                                )
                            }
                            rows={4}
                            className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-teal-500"
                          />

                        )
                        : (

                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {
                              draft.subjective?.owner_observations ||
                              "Not specified"
                            }
                          </p>

                        )
                    }

                  </div>

                </div>

              </div>

              {/* OBJECTIVE */}

              <div className="rounded-2xl border border-slate-200 bg-white p-5">

                <div className="flex items-center gap-3">

                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-purple-50 text-purple-700 font-bold">
                    O
                  </span>

                  <h3 className="text-lg font-bold text-slate-900">
                    Objective
                  </h3>

                </div>

                <div className="mt-5">

                  <label className="text-sm font-semibold text-slate-700">
                    Clinical Findings
                  </label>

                  {
                    editingSOAP
                      ? (

                        <textarea
                          value={
                            draft.objective?.clinical_findings || ""
                          }
                          onChange={
                            event =>
                              updateSOAPField(
                                "objective",
                                "clinical_findings",
                                event.target.value
                              )
                          }
                          rows={5}
                          className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-teal-500"
                        />

                      )
                      : (

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {
                            draft.objective?.clinical_findings ||
                            "No examination findings recorded."
                          }
                        </p>

                      )
                  }

                </div>

                <div className="mt-5">

                  <p className="text-sm font-semibold text-slate-700">
                    Vital Parameters
                  </p>

                  {
                    Array.isArray(
                      draft.objective?.vital_parameters
                    ) &&
                    draft.objective.vital_parameters.length > 0
                      ? (

                        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

                          {
                            draft.objective.vital_parameters.map(
                              (item:any,index:number) => (

                                <div
                                  key={index}
                                  className="rounded-xl border border-slate-200 bg-slate-50 p-3"
                                >

                                  <p className="text-xs font-medium text-slate-500">
                                    {
                                      item.name ||
                                      item.parameter ||
                                      "Parameter"
                                    }
                                  </p>

                                  <p className="mt-1 font-semibold text-slate-900">
                                    {
                                      item.value ||
                                      "Not recorded"
                                    }
                                  </p>

                                </div>

                              )
                            )
                          }

                        </div>

                      )
                      : (

                        <p className="mt-2 text-sm text-slate-500">
                          No vital parameters recorded.
                        </p>

                      )
                  }

                </div>

                <div className="mt-5">

                  <p className="text-sm font-semibold text-slate-700">
                    Diagnostic Tests
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {
                      displayValue(
                        draft.objective?.diagnostic_tests
                      )
                    }
                  </p>

                </div>

              </div>

              {/* ASSESSMENT */}

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

                <div className="flex items-center gap-3">

                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-amber-50 text-amber-700 font-bold">
                    A
                  </span>

                  <h3 className="text-lg font-bold text-slate-900">
                    Assessment
                  </h3>

                </div>

                <div className="mt-5">

                  <label className="text-sm font-semibold text-slate-700">
                    Primary Assessment
                  </label>

                  {
                    editingSOAP
                      ? (

                        <textarea
                          value={
                            draft.assessment?.primary_assessment || ""
                          }
                          onChange={
                            event =>
                              updateSOAPField(
                                "assessment",
                                "primary_assessment",
                                event.target.value
                              )
                          }
                          rows={4}
                          className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-teal-500"
                        />

                      )
                      : (

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {
                            draft.assessment?.primary_assessment ||
                            "Pending veterinarian assessment."
                          }
                        </p>

                      )
                  }

                </div>

                <div className="mt-5">

                  <p className="text-sm font-semibold text-slate-700">
                    Diagnoses
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {
                      displayValue(
                        draft.assessment?.diagnoses
                      )
                    }
                  </p>

                </div>

                <div className="mt-5">

                  <p className="text-sm font-semibold text-slate-700">
                    Differentials
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {
                      displayValue(
                        draft.assessment?.differentials
                      )
                    }
                  </p>

                </div>

              </div>

              {/* PLAN */}

              <div className="rounded-2xl border border-slate-200 bg-white p-5">

                <div className="flex items-center gap-3">

                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-green-50 text-green-700 font-bold">
                    P
                  </span>

                  <h3 className="text-lg font-bold text-slate-900">
                    Plan
                  </h3>

                </div>

                <div className="mt-5 grid gap-5 md:grid-cols-2">

                  <div>

                    <p className="text-sm font-semibold text-slate-700">
                      Treatment
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {
                        displayValue(
                          draft.plan?.treatment_given
                        )
                      }
                    </p>

                  </div>

                  <div>

                    <p className="text-sm font-semibold text-slate-700">
                      Medications
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {
                        displayValue(
                          draft.plan?.medications
                        )
                      }
                    </p>

                  </div>

                </div>

                <div className="mt-5">

                  <label className="text-sm font-semibold text-slate-700">
                    Follow Up
                  </label>

                  {
                    editingSOAP
                      ? (

                        <textarea
                          value={
                            draft.plan?.follow_up || ""
                          }
                          onChange={
                            event =>
                              updateSOAPField(
                                "plan",
                                "follow_up",
                                event.target.value
                              )
                          }
                          rows={3}
                          className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-teal-500"
                        />

                      )
                      : (

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {
                            draft.plan?.follow_up ||
                            "Not specified."
                          }
                        </p>

                      )
                  }

                </div>

                <div className="mt-5">

                  <p className="text-sm font-semibold text-slate-700">
                    Client Advice
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {
                      draft.plan?.client_advice ||
                      "Not specified."
                    }
                  </p>

                </div>

              </div>

              {/* AI CONFIDENCE */}

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

                <div className="flex items-center justify-between">

                  <div>

                    <h3 className="font-bold text-slate-900">
                      AI Confidence
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Confidence based on clinical information completeness.
                    </p>

                  </div>

                  <ShieldCheck size={24} className="text-teal-700"/>

                </div>

                <div className="mt-5 flex items-center gap-4">

                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-200">

                    <div
                      className="h-full rounded-full bg-teal-600"
                      style={{
                        width:`${calculateConfidenceScore()}%`
                      }}
                    />

                  </div>

                  <span className="font-bold text-slate-900">
                    {calculateConfidenceScore()}%
                  </span>

                </div>

                <div className="mt-5 space-y-2">

                  <p className="text-sm font-semibold text-slate-700">
                    Based on:
                  </p>

                  <ul className="list-disc pl-5 text-sm text-slate-600">

                    <li>
                      Complete history
                    </li>

                    <li>
                      Clinical findings
                    </li>

                    <li>
                      Treatment details
                    </li>

                  </ul>

                  {
                    draft.confidence_notes &&
                    draft.confidence_notes.length > 0 && (

                      <div className="mt-4 rounded-xl bg-white p-4 text-sm text-slate-600">

                        <p className="font-semibold text-slate-800">
                          AI Review Notes
                        </p>

                        <p className="mt-2">
                          {
                            displayValue(
                              draft.confidence_notes
                            )
                          }
                        </p>

                      </div>

                    )
                  }

                </div>

              </div>

              {
                showApprovalWarning && (

                  <div className="rounded-2xl border border-red-200 bg-red-50 p-5">

                    <h3 className="font-bold text-red-800">
                      Important information missing
                    </h3>

                    <p className="mt-2 text-sm text-red-700">
                      High priority missing information was detected. Review before approving this consultation.
                    </p>

                    <div className="mt-4 flex gap-3">

                      <Button
                        type="button"
                        onClick={() =>
                          setShowApprovalWarning(false)
                        }
                      >
                        Review Again
                      </Button>

                      <Button
                        type="button"
                        onClick={() => {
                          setShowApprovalWarning(false);
                          handleApprove(true);
                        }}
                      >
                        Approve Anyway
                      </Button>

                    </div>

                  </div>

                )
              }

              {/* EDITING ACTIONS */}

              {
                editingSOAP && (

                  <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full">

                    <Button
                      disabled={loading}
                      onClick={handleSaveDraft}
                    >

                      <Save size={17}/>

                      {
                        loading
                          ? "Saving..."
                          : "Save SOAP Changes"
                      }

                    </Button>

                    <Button
                      onClick={() =>
                        setEditingSOAP(false)
                      }
                    >
                      Cancel
                    </Button>

                  </div>

                )
              }

              {/* MEDICATIONS */}

              <div className="rounded-2xl border border-slate-200 bg-white p-5">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-teal-50 text-teal-700">

                      <Pill size={20}/>

                    </div>

                    <div>

                      <h3 className="font-bold text-slate-900">
                        Medications
                      </h3>

                      <p className="text-sm text-slate-500">
                        Add prescribed medication for this consultation.
                      </p>

                    </div>

                  </div>

                  <Button
                    onClick={() =>
                      setShowMedicationForm(
                        previous => !previous
                      )
                    }
                  >
                    Add Medication
                  </Button>

                </div>

                {
                  showMedicationForm && (

                    <div className="mt-5 grid gap-3 md:grid-cols-2">

                      {
                        [
                          ["medicineName","Medicine Name"],
                          ["quantity","Quantity"],
                          ["unit","Unit"],
                          ["batchNumber","Batch Number"],
                          ["withdrawalPeriod","Withdrawal Period"],
                          ["instructions","Instructions"]
                        ].map(([key, label]) => (

                          <input
                            key={key}
                            placeholder={label}
                            value={(medicationForm as any)[key]}
                            onChange={
                              e =>
                                setMedicationForm(
                                  previous => ({
                                    ...previous,
                                    [key]:e.target.value
                                  })
                                )
                            }
                            className="rounded-xl border border-slate-200 p-3 text-sm"
                          />

                        ))
                      }

                      <Button onClick={handleAddMedication}>
                        Save Medication
                      </Button>

                    </div>

                  )
                }

              </div>

              {/* FINAL ACTIONS */}

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                  <div>

                    <h3 className="font-bold text-slate-900">
                      Clinical Record Actions
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Save your work or approve the record when the clinical documentation has been reviewed.
                    </p>

                  </div>

                  <div className="flex flex-wrap gap-2">

                    <Button onClick={handleSaveDraft}>

                      <Save size={17}/>

                      Save Draft

                    </Button>

                    {
                      activeConsultation.status === "approved" ? (

                        <div
                          className="inline-flex items-center gap-2 rounded-xl bg-green-50 px-5 py-3 font-semibold text-green-700 border border-green-200"
                        >

                          <CheckCircle size={18}/>

                          Approved

                        </div>

                      ) : (

                        <Button
                          type="button"
                          disabled={loading}
                          onClick={() => handleApprove()}
                        >

                          <CheckCircle size={17}/>

                          {
                            loading
                              ? "Approving..."
                              : "Approve Record"
                          }

                        </Button>

                      )
                    }

                    {
                      activeConsultation.status === "approved" && (

                        <Button onClick={handleGenerateOwnerSummary}>

                          <FileText size={17}/>

                          Generate Owner Summary

                        </Button>

                      )
                    }

                  </div>

                </div>

              </div>

            </div>

          )
        }

      </Card>

      {/* FOLLOW UP CREATION */}

      <Card className="p-5 sm:p-6">

        <div className="flex items-center justify-between gap-3">

          <div className="flex items-center gap-3">

            <div className="grid h-10 w-10 place-items-center rounded-xl bg-teal-50 text-teal-700">
              <Clock size={20}/>
            </div>

            <div>
              <h3 className="font-bold text-slate-900">Create Follow-up</h3>
              <p className="text-sm text-slate-500">Schedule a future patient follow-up.</p>
            </div>

          </div>

          <Button onClick={() => setShowFollowUpForm(v => !v)}>
            {showFollowUpForm ? "Close" : "Add Follow-up"}
          </Button>

        </div>

        {
          showFollowUpForm && (

            <div className="mt-5 space-y-3">

              <input
                className="w-full rounded-xl border p-3 text-sm"
                placeholder="Follow-up title"
                value={followUpForm.title}
                onChange={
                  e =>
                    setFollowUpForm(v => ({
                      ...v,
                      title:e.target.value
                    }))
                }
              />

              <input
                type="date"
                className="w-full rounded-xl border p-3 text-sm"
                value={followUpForm.dueDate}
                onChange={
                  e =>
                    setFollowUpForm(v => ({
                      ...v,
                      dueDate:e.target.value
                    }))
                }
              />

              <textarea
                className="w-full rounded-xl border p-3 text-sm"
                placeholder="Notes"
                value={followUpForm.notes}
                onChange={
                  e =>
                    setFollowUpForm(v => ({
                      ...v,
                      notes:e.target.value
                    }))
                }
              />

              <Button onClick={handleCreateFollowUp}>
                Save Follow-up
              </Button>

            </div>

          )
        }

      </Card>

    </div>

  );
}