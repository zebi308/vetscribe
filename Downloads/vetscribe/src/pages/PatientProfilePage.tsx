import {
  ArrowLeft,
  PawPrint,
  User,
  Phone,
  Mail,
  CalendarDays,
  Weight,
  Stethoscope,
  FileText,
  Plus,
  Edit3,
  Trash2,
  HeartPulse,
  Pill,
  ClipboardCheck,
  CheckCircle2,
  Syringe,
  AlertTriangle,
  Activity,
  ClipboardList,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppState } from "../lib/AppState";
import React from "react";
import { AddVaccinationModal } from "../components/modals/AddVaccinationModal";
import { AddAllergyModal } from "../components/modals/AddAllergyModal";
import { AddConditionModal } from "../components/modals/AddConditionModal";
import { AddPrescriptionModal } from "../components/modals/AddPrescriptionModal";
export function PatientProfilePage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    patients,
    clients,
    consultations,
    medicines,
    profiles,
    followUps,
    completeFollowUp,
    vaccinations,
    allergies,
    conditions,
    prescriptions,
    addVaccination,
    addAllergy,
    addCondition,
    addPrescription,
    deletePatient,
  } = useAppState();

  const [activeMedicalModal, setActiveMedicalModal] =
    React.useState<
      "vaccination" |
      "allergy" |
      "condition" |
      "prescription" |
      null
    >(null);

  const patient = patients.find((item) => item.id === id);

  const handleDeletePatient = async () => {
    if (!patient) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this patient record?"
    );

    if (!confirmed) return;

    try {
      await deletePatient(patient.id);
      navigate("/dashboard/patients");
    } catch (error) {
      console.error("DELETE PATIENT ERROR", error);
      alert("Unable to delete patient.");
    }
  };

  if (!patient) {
    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => navigate("/dashboard/patients")}
          className="flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-700"
        >
          <ArrowLeft size={18} />
          Back to Patients
        </button>

        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-slate-100 text-slate-400">
            <PawPrint size={30} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            Patient not found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            The patient record could not be found.
          </p>
        </div>
      </div>
    );
  }

  const owner = clients.find((client) => client.id === patient.clientId);

  const patientConsultations = consultations
    .filter((consultation) => consultation.patientId === patient.id)
    .sort(
      (a, b) =>
        new Date(b.consultationDate || 0).getTime() -
        new Date(a.consultationDate || 0).getTime()
    );

  const patientMedicines = medicines
    .filter((medicine) => medicine.patientId === patient.id)
    .sort(
      (a, b) =>
        new Date(b.prescribedDate || 0).getTime() -
        new Date(a.prescribedDate || 0).getTime()
    );

  const patientFollowUps = (followUps || [])
    .filter((followUp) => followUp.patientId === patient.id)
    .sort(
      (a, b) =>
        new Date(a.scheduledDate || 0).getTime() -
        new Date(b.scheduledDate || 0).getTime()
    );

  const pendingFollowUps = patientFollowUps.filter(
    (followUp) => followUp.status === "scheduled"
  );
  const patientVaccinations = (vaccinations || [])
    .filter((item) => item.patientId === patient.id);

  const patientAllergies = (allergies || [])
    .filter((item) => item.patientId === patient.id);

  const patientConditions = (conditions || [])
    .filter((item) => item.patientId === patient.id);

  const patientPrescriptions = (prescriptions || [])
    .filter((item) => item.patientId === patient.id);



  const latestConsultation = patientConsultations[0];

  const approvedConsultations = patientConsultations.filter(
    (consultation) => consultation.status === "approved"
  ).length;

  const draftConsultations = patientConsultations.filter(
    (consultation) => consultation.status === "draft"
  ).length;

  const ownerName = owner
    ? `${owner.firstName} ${owner.lastName}`
    : "Unknown Owner";

  const calculateAge = () => {
    if (!patient.dateOfBirth) {
      return "Not recorded";
    }

    const birthDate = new Date(patient.dateOfBirth);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      years--;
    }

    if (years < 1) {
      const months =
        (today.getFullYear() - birthDate.getFullYear()) * 12 +
        (today.getMonth() - birthDate.getMonth());

      return `${Math.max(months, 0)} month${months === 1 ? "" : "s"}`;
    }

    return `${years} year${years === 1 ? "" : "s"}`;
  };

  const formatDate = (date?: string) => {
    if (!date) {
      return "Not recorded";
    }

    return new Date(date).toLocaleDateString();
  };


  const patientTimeline = [
    ...patientConsultations.map((item:any)=>({
      id:item.id,
      type:"Consultation",
      date:item.consultationDate,
      title:"Clinical Consultation",
      description:`Status: ${item.status}`,
      icon:"🩺"
    })),
    ...patientMedicines.map((item:any)=>({
      id:item.id,
      type:"Medication",
      date:item.prescribedDate,
      title:item.medicineName,
      description:item.instructions || "Medication prescribed",
      icon:"💊"
    })),
    ...patientVaccinations.map((item:any)=>({
      id:item.id,
      type:"Vaccination",
      date:item.dateGiven,
      title:item.vaccineName,
      description:item.nextDueDate ? `Next due: ${formatDate(item.nextDueDate)}` : "Vaccination record",
      icon:"💉"
    })),
    ...patientAllergies.map((item:any)=>({
      id:item.id,
      type:"Allergy",
      date:item.createdAt,
      title:item.allergen,
      description:item.reaction || "Allergy recorded",
      icon:"⚠️"
    })),
    ...patientConditions.map((item:any)=>({
      id:item.id,
      type:"Condition",
      date:item.diagnosisDate || item.createdAt,
      title:item.name,
      description:item.status || "Condition",
      icon:"🧬"
    })),
    ...patientPrescriptions.map((item:any)=>({
      id:item.id,
      type:"Prescription",
      date:item.prescribedDate,
      title:item.medicineName,
      description:item.instructions || "Prescription",
      icon:"📋"
    }))
  ].sort((a,b)=>new Date(b.date || 0).getTime()-new Date(a.date || 0).getTime());

  return (
    <div className="space-y-8">
      {/* =========================
          BACK
      ========================= */}
      <button
        type="button"
        onClick={() => navigate("/dashboard/patients")}
        className="flex items-center gap-2 text-sm font-medium text-teal-600 transition hover:text-teal-700"
      >
        <ArrowLeft size={18} />
        Back to Patients
      </button>

      {/* =========================
          PATIENT HEADER
      ========================= */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-teal-50 text-teal-600">
              <PawPrint size={32} />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold text-slate-900">
                  {patient.name}
                </h1>

                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                  Active
                </span>
              </div>

              <p className="mt-2 text-slate-500">
                {patient.species}
                {" • "}
                {patient.breed || "Breed not recorded"}
              </p>

              <p className="mt-1 text-sm text-slate-400">
                {patient.sex}
                {" • "}
                {patient.neutered ? "Neutered" : "Not neutered"}
                {" • "}
                {calculateAge()}
              </p>
            </div>
          </div>
        </div>
      </div>


      {/* =========================
          PHASE 10.6 — PATIENT SNAPSHOT
      ========================= */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Species</p>
          <p className="mt-2 font-bold text-slate-900">
            {patient.species || "Not recorded"}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Last Consultation</p>
          <p className="mt-2 font-bold text-slate-900">
            {latestConsultation
              ? formatDate(latestConsultation.consultationDate)
              : "No visits"}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Active Conditions</p>
          <p className="mt-2 font-bold text-slate-900">
            {patientConditions.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Prescriptions</p>
          <p className="mt-2 font-bold text-slate-900">
            {patientPrescriptions.length}
          </p>
        </div>

      </div>

      {/* =========================
          PATIENT INFORMATION
      ========================= */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* =========================
            PATIENT DETAILS
        ========================= */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-teal-50 text-teal-600">
              <PawPrint size={22} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Patient Details
              </h2>
              <p className="text-sm text-slate-500">
                Basic information about this patient.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Species
              </p>
              <p className="mt-1 font-medium text-slate-900">
                {patient.species || "Not recorded"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Breed
              </p>
              <p className="mt-1 font-medium text-slate-900">
                {patient.breed || "Not recorded"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Sex
              </p>
              <p className="mt-1 font-medium text-slate-900">
                {patient.sex || "Unknown"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Neutered
              </p>
              <p className="mt-1 font-medium text-slate-900">
                {patient.neutered ? "Yes" : "No"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Date of Birth
              </p>
              <p className="mt-1 font-medium text-slate-900">
                {formatDate(patient.dateOfBirth)}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Age
              </p>
              <p className="mt-1 font-medium text-slate-900">
                {calculateAge()}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Weight
              </p>
              <p className="mt-1 font-medium text-slate-900">
                {patient.weightKg !== undefined && patient.weightKg !== null
                  ? `${patient.weightKg} kg`
                  : "Not recorded"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Colour
              </p>
              <p className="mt-1 font-medium text-slate-900">
                {patient.colour || "Not recorded"}
              </p>
            </div>
          </div>

          {patient.microchipNumber && (
            <div className="mt-6 rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Microchip Number
              </p>
              <p className="mt-1 font-mono text-sm font-medium text-slate-800">
                {patient.microchipNumber}
              </p>
            </div>
          )}
        </div>

        {/* =========================
            OWNER INFORMATION
        ========================= */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-teal-50 text-teal-600">
              <User size={22} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">Owner</h2>
              <p className="text-sm text-slate-500">Registered pet owner.</p>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Name
              </p>
              <p className="mt-1 font-semibold text-slate-900">
                {ownerName}
              </p>
            </div>

            {owner?.phone && (
              <div>
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                  <Phone size={14} />
                  Phone
                </div>
                <p className="mt-1 text-sm font-medium text-slate-800">
                  {owner.phone}
                </p>
              </div>
            )}

            {owner?.email && (
              <div>
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                  <Mail size={14} />
                  Email
                </div>
                <p className="mt-1 break-all text-sm font-medium text-slate-800">
                  {owner.email}
                </p>
              </div>
            )}

            {owner && (
              <button
                type="button"
                onClick={() => navigate(`/dashboard/clients/${owner.id}`)}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-teal-600 transition hover:bg-teal-50"
              >
                View Owner Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* =========================
          QUICK STATISTICS
      ========================= */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Consultations</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {patientConsultations.length}
              </p>
            </div>

            <div className="grid h-10 w-10 place-items-center rounded-xl bg-teal-50 text-teal-600">
              <Stethoscope size={20} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Approved Records</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {approvedConsultations}
              </p>
            </div>

            <div className="grid h-10 w-10 place-items-center rounded-xl bg-green-50 text-green-600">
              <HeartPulse size={20} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Draft Records</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {draftConsultations}
              </p>
            </div>

            <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-600">
              <FileText size={20} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Last Visit</p>
              <p className="mt-2 text-sm font-bold text-slate-900">
                {latestConsultation
                  ? formatDate(latestConsultation.consultationDate)
                  : "No visits"}
              </p>
            </div>

            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600">
              <CalendarDays size={20} />
            </div>
          </div>
        </div>
      </div>
{/* =========================
    PATIENT JOURNEY TIMELINE
========================= */}

<div className="
rounded-2xl
border
border-slate-200
bg-white
p-6
shadow-sm
">


<div className="
flex
items-center
gap-3
">


<div className="
grid
h-11
w-11
place-items-center
rounded-xl
bg-teal-50
text-teal-600
">

<Activity size={22}/>

</div>



<div>

<h2 className="
text-lg
font-semibold
text-slate-900
">

Patient Journey Timeline

</h2>


<p className="
text-sm
text-slate-500
">

Complete medical journey of this patient.

</p>


</div>


</div>





{
patientTimeline.length === 0

?


<div className="
mt-6
rounded-xl
bg-slate-50
p-8
text-center
text-sm
text-slate-500
">

No patient history available yet.

</div>


:


<div className="
mt-8
space-y-6
">


{
patientTimeline.map(
(event,index)=>(


<div

key={`${event.id}-${index}`}

className="
flex
gap-4
"


>


{/* Timeline line */}

<div className="
flex
flex-col
items-center
">


<div className="
grid
h-11
w-11
place-items-center
rounded-full
bg-teal-50
text-xl
">

{event.icon}

</div>


{
index !== patientTimeline.length - 1 &&

<div className="
mt-2
h-full
min-h-10
w-px
bg-slate-200
"/>

}


</div>





{/* Event Card */}

<div className="
flex-1
rounded-xl
border
border-slate-200
p-4
hover:border-teal-200
transition
">


<div className="
flex
flex-col
gap-2
sm:flex-row
sm:items-start
sm:justify-between
">


<div>


<span className="
text-xs
font-semibold
uppercase
tracking-wide
text-slate-400
">

{event.type}

</span>



<h3 className="
mt-1
font-semibold
text-slate-900
">

{event.title}

</h3>



<p className="
mt-2
text-sm
text-slate-600
">

{event.description}

</p>



</div>




<span className="
text-sm
text-slate-500
">

{formatDate(event.date)}

</span>



</div>


</div>



</div>


)

)


}


</div>


}



</div>
      {/* =========================
          FOLLOW-UPS
      ========================= */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-amber-50 text-amber-600">
              <ClipboardCheck size={22} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Follow-ups
              </h2>

              <p className="text-sm text-slate-500">
                Scheduled follow-ups and rechecks for this patient.
              </p>
            </div>
          </div>

          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
            {pendingFollowUps.length} pending
          </span>
        </div>

        {patientFollowUps.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <ClipboardCheck className="mx-auto text-slate-400" size={28} />

            <p className="mt-3 font-semibold text-slate-800">
              No follow-ups scheduled
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Follow-ups created from consultations will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {patientFollowUps.map((followUp) => {
              const isCompleted =
                followUp.status === "completed";

              const isCancelled =
                followUp.status === "cancelled";

              return (
                <div
                  key={followUp.id}
                  className="rounded-xl border border-slate-200 p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex gap-4">
                      <div
                        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                          isCompleted
                            ? "bg-green-50 text-green-600"
                            : isCancelled
                            ? "bg-slate-100 text-slate-500"
                            : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 size={20} />
                        ) : (
                          <CalendarDays size={20} />
                        )}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-slate-900">
                            {followUp.title}
                          </h3>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              isCompleted
                                ? "bg-green-50 text-green-700"
                                : isCancelled
                                ? "bg-slate-100 text-slate-600"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {followUp.status}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-500">
                          Due:{" "}
                          <span className="font-medium text-slate-700">
                            {formatDate(followUp.scheduledDate)}
                          </span>
                        </p>

                        {followUp.notes && (
                          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
                            {followUp.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    {followUp.status === "scheduled" && (
                      <button
                        type="button"
                        onClick={() => completeFollowUp(followUp.id)}
                        className="flex items-center justify-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm font-medium text-green-700 transition hover:bg-green-100"
                      >
                        <CheckCircle2 size={16} />
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =========================
          CONSULTATION HISTORY
      ========================= */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Consultation History
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Previous clinical consultations for this patient.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate(`/dashboard/consultations/new?patient=${patient.id}`)
            }
            className="flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
          >
            <Plus size={17} />
            New Consultation
          </button>
        </div>

        {patientConsultations.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-white text-slate-400 shadow-sm">
              <Stethoscope size={22} />
            </div>

            <h3 className="mt-4 font-semibold text-slate-800">
              No consultations yet
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Start a consultation to begin building this patient's clinical
              history.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {patientConsultations.map((consultation, index) => (
              <div
                key={consultation.id}
                className="relative rounded-xl border border-slate-200 p-5 transition hover:border-teal-200 hover:bg-slate-50"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex gap-4">
                    <div className="relative flex flex-col items-center">
                      <div className="grid h-10 w-10 place-items-center rounded-full bg-teal-50 text-teal-600">
                        <Stethoscope size={18} />
                      </div>

                      {index < patientConsultations.length - 1 && (
                        <div className="mt-2 h-full min-h-6 w-px bg-slate-200" />
                      )}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-slate-900">
                          Consultation
                        </h3>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            consultation.status === "approved"
                              ? "bg-green-50 text-green-700"
                              : consultation.status === "draft"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {consultation.status}
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-2">
                          <CalendarDays size={15} />
                          {formatDate(consultation.consultationDate)}
                        </span>

                        {consultation.captureType && (
                          <span className="capitalize">
                            {consultation.captureType}
                          </span>
                        )}
                      </div>

                      {consultation.approvedAt && (
                        <p className="mt-2 text-xs text-green-600">
                          Approved on{" "}
                          {formatDate(consultation.approvedAt)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/dashboard/consultations/${consultation.id}`)
                      }
                      className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-teal-600 transition hover:bg-teal-50"
                    >
                      <FileText size={16} />
                      Open
                    </button>
                  </div>
                </div>

                {consultation.transcript && (
                  <div className="mt-4 rounded-lg bg-slate-50 p-4">
                    <p className="line-clamp-2 text-sm leading-6 text-slate-600">
                      {consultation.transcript}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* =========================
          MEDICATIONS
      ========================= */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <div className="grid h-11 w-11 place-items-center rounded-xl bg-teal-50 text-teal-600">
              <Pill size={22} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Medications
              </h2>

              <p className="text-sm text-slate-500">
                Prescribed medicines and treatment history.
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={() => navigate("/dashboard/medications")}
            className="rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
          >
            Manage Medications
          </button>

        </div>


        {patientMedicines.length === 0 ? (

          <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">

            <Pill className="mx-auto text-slate-400" size={28} />

            <p className="mt-3 font-semibold text-slate-800">
              No medications recorded
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Add medication records from the medication module.
            </p>

          </div>

        ) : (

          <div className="mt-6 space-y-4">

            {patientMedicines.map((medicine) => (

              <div
                key={medicine.id}
                className="rounded-xl border border-slate-200 p-4"
              >

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                  <div>

                    <h3 className="font-semibold text-slate-900">
                      {medicine.medicineName}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {medicine.quantity} {medicine.unit}
                    </p>

                  </div>


                  <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
                    {medicine.medicineCategory}
                  </span>

                </div>


                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">

                  <p className="text-slate-600">
                    Prescribed:{" "}
                    <span className="font-medium text-slate-900">
                      {formatDate(medicine.prescribedDate)}
                    </span>
                  </p>


                  <p className="text-slate-600">
                    Instructions:{" "}
                    <span className="font-medium text-slate-900">
                      {medicine.instructions || "Not recorded"}
                    </span>
                  </p>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>



      {/* =========================
          PHASE 8 MEDICAL RECORDS
      ========================= */}

      <div className="grid gap-6 lg:grid-cols-2">

        <MedicalRecordCard
          title="Vaccinations"
          icon={<Syringe size={22}/>}
          empty="No vaccinations recorded"
          items={patientVaccinations}
          onAdd={() => setActiveMedicalModal("vaccination")}
          render={(item:any)=>
            `${item.vaccineName || item.name || "Vaccination"} - ${item.date || item.administeredDate || ""}`
          }
        />

        <MedicalRecordCard
          title="Allergies"
          icon={<AlertTriangle size={22}/>}
          empty="No allergies recorded"
          items={patientAllergies}
          onAdd={() => setActiveMedicalModal("allergy")}
          render={(item:any)=>
            `${item.allergen || item.name || "Allergy"} ${item.notes ? "- " + item.notes : ""}`
          }
        />

        <MedicalRecordCard
          title="Conditions / Medical Problems"
          icon={<Activity size={22}/>}
          empty="No conditions recorded"
          items={patientConditions}
          onAdd={() => setActiveMedicalModal("condition")}
          render={(item:any)=>
            `${item.conditionName || item.name || "Condition"}`
          }
        />

        <MedicalRecordCard
          title="Prescriptions"
          icon={<ClipboardList size={22}/>}
          empty="No prescriptions recorded"
          items={patientPrescriptions}
          onAdd={() => setActiveMedicalModal("prescription")}
          render={(item:any)=>
            `${item.medicineName || item.name || "Prescription"}`
          }
        />

      </div>

      {/* =========================
          MEDICAL OVERVIEW
      ========================= */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* =========================
            CLINICAL SUMMARY
        ========================= */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-teal-50 text-teal-600">
              <HeartPulse size={22} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Clinical Summary
              </h2>
              <p className="text-sm text-slate-500">
                Current patient overview.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Total Clinical Records
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {patientConsultations.length}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Latest Consultation
              </p>
              <p className="mt-2 font-semibold text-slate-900">
                {latestConsultation
                  ? formatDate(latestConsultation.consultationDate)
                  : "No records"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Record Status
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {approvedConsultations > 0 && (
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                    {approvedConsultations} Approved
                  </span>
                )}

                {draftConsultations > 0 && (
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                    {draftConsultations} Draft
                  </span>
                )}

                {patientConsultations.length === 0 && (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    No records
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* =========================
            PATIENT FLAGS
        ========================= */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-600">
              <FileText size={22} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Patient Record
              </h2>
              <p className="text-sm text-slate-500">
                Additional stored information.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
              <span className="text-sm text-slate-600">Microchip</span>
              <span className="text-sm font-medium text-slate-900">
                {patient.microchipNumber
                  ? patient.microchipNumber
                  : "Not recorded"}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
              <span className="text-sm text-slate-600">Weight</span>
              <span className="text-sm font-medium text-slate-900">
                {patient.weightKg ? `${patient.weightKg} kg` : "Not recorded"}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
              <span className="text-sm text-slate-600">Colour</span>
              <span className="text-sm font-medium text-slate-900">
                {patient.colour ? patient.colour : "Not recorded"}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
              <span className="text-sm text-slate-600">
                Capture Types Used
              </span>
              <span className="text-sm font-medium text-slate-900">
                {
                  [
                    ...new Set(
                      patientConsultations.map((item) => item.captureType)
                    ),
                  ].length
                }
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================
          MEDICAL TIMELINE SHORTCUT
      ========================= */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Complete Medical Timeline
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              View consultations, medications, owner summaries and follow-ups together.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate(`/dashboard/patients/${patient.id}/history`)
            }
            className="
            rounded-xl
            bg-teal-600
            px-5
            py-3
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-teal-700
            "
          >
            Open Timeline
          </button>

        </div>
      </div>

      {/* =========================
          QUICK ACTIONS
      ========================= */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-teal-50 text-teal-600">
            <Stethoscope size={22} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Quick Actions
            </h2>
            <p className="text-sm text-slate-500">
              Common tasks for this patient.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <button
            type="button"
            onClick={() =>
              navigate(`/dashboard/consultations/new?patient=${patient.id}`)
            }
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-teal-400 hover:bg-teal-50"
          >
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-teal-50 text-teal-600">
              <Plus size={20} />
            </div>

            <div>
              <p className="font-semibold text-slate-900">
                New Consultation
              </p>
              <p className="text-xs text-slate-500">Start clinical record</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(`/dashboard/patients/${patient.id}/history`)
            }
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-teal-400 hover:bg-teal-50"
          >
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-blue-600">
              <CalendarDays size={20} />
            </div>

            <div>
              <p className="font-semibold text-slate-900">
                Medical History
              </p>
              <p className="text-xs text-slate-500">View timeline</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => navigate(`/dashboard/patients/${patient.id}/edit`)}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-teal-400 hover:bg-teal-50"
          >
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-slate-600">
              <Edit3 size={20} />
            </div>

            <div>
              <p className="font-semibold text-slate-900">Edit Patient</p>
              <p className="text-xs text-slate-500">Update information</p>
            </div>
          </button>
        </div>
      </div>


      {/* =========================
          MEDICAL RECORD MODALS
      ========================= */}

      {activeMedicalModal === "vaccination" && (
        <AddVaccinationModal
          patient={patient}
          onClose={() => setActiveMedicalModal(null)}
          onSave={async (data:any) => {
            await addVaccination({
              ...data,
              id: crypto.randomUUID(),
              practiceId: patient.practiceId,
              patientId: patient.id,
            });
            setActiveMedicalModal(null);
          }}
        />
      )}

      {activeMedicalModal === "allergy" && (
        <AddAllergyModal
          patient={patient}
          onClose={() => setActiveMedicalModal(null)}
          onSave={async (data:any) => {
            await addAllergy({
              ...data,
              id: crypto.randomUUID(),
              practiceId: patient.practiceId,
              patientId: patient.id,
            });
            setActiveMedicalModal(null);
          }}
        />
      )}

      {activeMedicalModal === "condition" && (
        <AddConditionModal
          patient={patient}
          onClose={() => setActiveMedicalModal(null)}
          onSave={async (data:any) => {
            await addCondition({
              ...data,
              id: crypto.randomUUID(),
              practiceId: patient.practiceId,
              patientId: patient.id,
            });
            setActiveMedicalModal(null);
          }}
        />
      )}

      {activeMedicalModal === "prescription" && (
        <AddPrescriptionModal
          patient={patient}
          onClose={() => setActiveMedicalModal(null)}
          onSave={async (data:any) => {
            await addPrescription({
              ...data,
              id: crypto.randomUUID(),
              practiceId: patient.practiceId,
              patientId: patient.id,
            });
            setActiveMedicalModal(null);
          }}
        />
      )}

    </div>
  );
}
function MedicalRecordCard({
  title,
  icon,
  items,
  empty,
  render,
  onAdd,
}: {
  title: string;
  icon: React.ReactNode;
  items: any[];
  empty: string;
  render: (item: any) => string;
  onAdd?: () => void;
}) {
  return (
    <div className="
      rounded-2xl
      border
      border-slate-200
      bg-white
      p-6
      shadow-sm
    ">

      <div className="flex items-center gap-3">

        <div className="
          grid h-11 w-11
          place-items-center
          rounded-xl
          bg-teal-50
          text-teal-600
        ">
          {icon}
        </div>

        <h2 className="
          text-lg
          font-semibold
          text-slate-900
        ">
          {title}
        </h2>

        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="ml-auto rounded-lg bg-teal-600 px-3 py-2 text-xs font-semibold text-white hover:bg-teal-700"
          >
            + Add
          </button>
        )}

      </div>


      {items.length === 0 ? (

        <p className="
          mt-5
          text-sm
          text-slate-500
        ">
          {empty}
        </p>

      ) : (

        <div className="
          mt-5
          space-y-3
        ">

          {items.map((item) => (

            <div
              key={item.id}
              className="
                rounded-xl
                bg-slate-50
                p-4
                text-sm
                text-slate-700
              "
            >
              {render(item)}
            </div>

          ))}

        </div>

      )}

    </div>
  );
}