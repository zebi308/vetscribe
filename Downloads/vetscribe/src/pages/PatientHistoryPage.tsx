import {
  useMemo,
  useState
} from "react";


import {
  useParams,
  useNavigate
} from "react-router-dom";


import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Download,
  FileText,
  Pill,
  Stethoscope
} from "lucide-react";


import {
  Card
} from "../components/ui/Card";


import {
  Button
} from "../components/ui/Button";


import {
  useAppState
} from "../lib/AppState";



type TimelineFilter =
  | "all"
  | "consultations"
  | "medications"
  | "summaries"
  | "followups";


type TimelineEvent = {

  id: string;

  type:
    | "consultation"
    | "medication"
    | "summary"
    | "followup";

  date: string;

  title: string;

  subtitle: string;

  details: string[];

  status?: string;
};



export function PatientHistoryPage() {


  const {
    id
  } = useParams<{ id: string }>();


  const navigate =
    useNavigate();


  const {
    patients,
    clients,
    consultations,
    medicines,
    ownerSummaries,
    followUps
  } = useAppState();


  const [filter, setFilter] =
    useState<TimelineFilter>("all");


  const [expandedId, setExpandedId] =
    useState<string | null>(null);



  const patient =
    patients.find(
      item => item.id === id
    );


  const client =
    patient
      ? clients.find(
          item =>
            item.id === patient.clientId
        )
      : undefined;



  const patientConsultations =
    consultations.filter(
      item =>
        item.patientId === id
    );


  const patientMedicines =
    medicines.filter(
      item =>
        item.patientId === id
    );


  const patientSummaries =
    ownerSummaries.filter(
      item =>
        item.patientId === id
    );


  const patientFollowUps =
    followUps.filter(
      item =>
        item.patientId === id
    );



  const timeline =
    useMemo<TimelineEvent[]>(() => {

      const events: TimelineEvent[] = [];


      patientConsultations.forEach(
        consultation => {

          const clinicalNote =
            consultation.clinicalNote;


          const assessment =
            clinicalNote
              ?.assessment
              ?.primary_assessment;


          const complaint =
            clinicalNote
              ?.subjective
              ?.presenting_complaint;


          const details: string[] = [];


          if (complaint) {

            details.push(
              `Presenting complaint: ${complaint}`
            );

          }


          if (assessment) {

            details.push(
              `Assessment: ${assessment}`
            );

          }


          if (
            clinicalNote
              ?.plan
              ?.follow_up
          ) {

            details.push(
              `Follow-up: ${clinicalNote.plan.follow_up}`
            );

          }


          events.push({

            id:
              `consultation-${consultation.id}`,

            type:
              "consultation",

            date:
              consultation.consultationDate ||
              consultation.updatedAt,

            title:
              "Consultation",

            subtitle:
              complaint ||
              "Clinical consultation",

            details,

            status:
              consultation.status

          });

        }
      );



      patientMedicines.forEach(
        medicine => {

          events.push({

            id:
              `medicine-${medicine.id}`,

            type:
              "medication",

            date:
              medicine.prescribedDate,

            title:
              medicine.medicineName,

            subtitle:
              `${medicine.quantity} ${medicine.unit}`,

            details: [

              `Category: ${medicine.medicineCategory}`,

              `Instructions: ${medicine.instructions}`,

              medicine.withdrawalPeriod
                ? `Withdrawal period: ${medicine.withdrawalPeriod}`
                : ""

            ].filter(Boolean),

            status:
              "prescribed"

          });

        }
      );



      patientSummaries.forEach(
        summary => {

          events.push({

            id:
              `summary-${summary.id}`,

            type:
              "summary",

            date:
              summary.generatedAt,

            title:
              summary.title ||
              "Owner Summary",

            subtitle:
              "Consultation summary generated",

            details: [

              summary.whatWeFound,

              summary.whatWeDiscussed,

              summary.treatmentAndMedication,

              summary.whatToDoAtHome,

              summary.whenToContactUs,

              summary.followUp

            ].filter(Boolean),

            status:
              "generated"

          });

        }
      );



      patientFollowUps.forEach(
        followUp => {

          events.push({

            id:
              `followup-${followUp.id}`,

            type:
              "followup",

            date:
              followUp.scheduledDate,

            title:
              followUp.title,

            subtitle:
              followUp.notes ||
              "Scheduled patient follow-up",

            details: [

              followUp.notes

            ].filter(Boolean),

            status:
              followUp.status

          });

        }
      );



      return events.sort(
        (a, b) =>
          new Date(b.date || 0).getTime() -
          new Date(a.date || 0).getTime()
      );

    }, [
      patientConsultations,
      patientMedicines,
      patientSummaries,
      patientFollowUps
    ]);




  const filteredTimeline =
    timeline.filter(
      event => {

        if (filter === "all")
          return true;

        return (
          event.type ===
          filter.slice(0, -1)
        );

      }
    );



  function formatDate(
    value?: string
  ) {

    if (!value)
      return "Not available";


    const date =
      new Date(value);


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return "Not available";

    }


    return date.toLocaleDateString(
      undefined,
      {
        day: "numeric",
        month: "short",
        year: "numeric"
      }
    );

  }



  function eventIcon(
    type: TimelineEvent["type"]
  ) {

    if (type === "consultation")
      return <Stethoscope size={19}/>;


    if (type === "medication")
      return <Pill size={19}/>;


    if (type === "summary")
      return <FileText size={19}/>;


    return <ClipboardCheck size={19}/>;

  }



  function eventStyle(
    type: TimelineEvent["type"]
  ) {

    if (type === "consultation") {

      return {
        wrapper:
          "bg-teal-50 text-teal-700",
        line:
          "border-teal-200"
      };

    }


    if (type === "medication") {

      return {
        wrapper:
          "bg-blue-50 text-blue-700",
        line:
          "border-blue-200"
      };

    }


    if (type === "summary") {

      return {
        wrapper:
          "bg-violet-50 text-violet-700",
        line:
          "border-violet-200"
      };

    }


    return {
      wrapper:
        "bg-amber-50 text-amber-700",
      line:
        "border-amber-200"
    };

  }



  function printHistory() {

    window.print();

  }



  if (!patient) {

    return (

      <div className="space-y-6">

        <button
          onClick={() =>
            navigate("/dashboard/patients")
          }
          className="
          flex
          items-center
          gap-2
          text-sm
          font-medium
          text-slate-600
          hover:text-teal-600
          "
        >

          <ArrowLeft size={17}/>

          Back to Patients

        </button>


        <Card className="p-10 text-center">

          <p className="text-slate-500">
            Patient not found.
          </p>

        </Card>

      </div>

    );

  }



  return (

    <div className="space-y-8">


      {/* HEADER */}

      <div className="
      flex
      flex-col
      gap-4
      md:flex-row
      md:items-center
      md:justify-between
      ">


        <div>

          <button
            onClick={() =>
              navigate(
                `/dashboard/patients/${patient.id}`
              )
            }
            className="
            mb-3
            flex
            items-center
            gap-2
            text-sm
            font-medium
            text-slate-600
            hover:text-teal-600
            "
          >

            <ArrowLeft size={17}/>

            Back to Patient

          </button>


          <h1 className="
          text-3xl
          font-bold
          text-slate-900
          ">

            Medical History

          </h1>


          <p className="
          mt-2
          text-slate-500
          ">

            {patient.name}

            {patient.species
              ? ` · ${patient.species}`
              : ""}

            {patient.breed
              ? ` · ${patient.breed}`
              : ""}

          </p>


          {client && (

            <p className="
            mt-1
            text-sm
            text-slate-400
            ">

              Owner:
              {" "}
              {client.firstName}
              {" "}
              {client.lastName}

            </p>

          )}

        </div>



        <Button
          onClick={printHistory}
        >

          <Download size={18}/>

          Export PDF

        </Button>


      </div>



      {/* SUMMARY CARDS */}

      <div className="
      grid
      gap-4
      sm:grid-cols-2
      lg:grid-cols-4
      ">


        <HistoryStat
          label="Consultations"
          value={
            patientConsultations.length
          }
          icon={
            <Stethoscope size={19}/>
          }
        />


        <HistoryStat
          label="Medications"
          value={
            patientMedicines.length
          }
          icon={
            <Pill size={19}/>
          }
        />


        <HistoryStat
          label="Owner Summaries"
          value={
            patientSummaries.length
          }
          icon={
            <FileText size={19}/>
          }
        />


        <HistoryStat
          label="Follow-ups"
          value={
            patientFollowUps.length
          }
          icon={
            <ClipboardCheck size={19}/>
          }
        />

      </div>



      {/* FILTERS */}

      <Card className="p-4">

        <div className="
        flex
        flex-wrap
        gap-2
        ">

          <TimelineFilterButton
            active={
              filter === "all"
            }
            onClick={() =>
              setFilter("all")
            }
          >
            All
          </TimelineFilterButton>


          <TimelineFilterButton
            active={
              filter === "consultations"
            }
            onClick={() =>
              setFilter("consultations")
            }
          >
            Consultations
          </TimelineFilterButton>


          <TimelineFilterButton
            active={
              filter === "medications"
            }
            onClick={() =>
              setFilter("medications")
            }
          >
            Medications
          </TimelineFilterButton>


          <TimelineFilterButton
            active={
              filter === "summaries"
            }
            onClick={() =>
              setFilter("summaries")
            }
          >
            Summaries
          </TimelineFilterButton>


          <TimelineFilterButton
            active={
              filter === "followups"
            }
            onClick={() =>
              setFilter("followups")
            }
          >
            Follow-ups
          </TimelineFilterButton>

        </div>

      </Card>



      {/* TIMELINE */}

      {filteredTimeline.length === 0 ? (

        <Card className="p-10 text-center">

          <CalendarDays
            size={32}
            className="
            mx-auto
            text-slate-400
            "
          />


          <h2 className="
          mt-4
          font-semibold
          text-slate-800
          ">

            No medical history found

          </h2>


          <p className="
          mt-1
          text-sm
          text-slate-500
          ">

            Records added for this patient
            will appear here.

          </p>

        </Card>

      ) : (

        <div className="space-y-4">

          {filteredTimeline.map(
            (event) => {

              const style =
                eventStyle(
                  event.type
                );


              const expanded =
                expandedId === event.id;


              return (

                <div
                  key={event.id}
                  className="
                  relative
                  flex
                  gap-4
                  "
                >

                  <div className="
                  flex
                  w-11
                  shrink-0
                  justify-center
                  ">

                    <div
                      className={`
                      grid
                      h-10
                      w-10
                      place-items-center
                      rounded-xl
                      ${style.wrapper}
                      `}
                    >

                      {eventIcon(
                        event.type
                      )}

                    </div>

                  </div>



                  <Card
                    className="
                    min-w-0
                    flex-1
                    p-5
                    "
                  >

                    <button
                      type="button"
                      onClick={() =>
                        setExpandedId(
                          expanded
                            ? null
                            : event.id
                        )
                      }
                      className="
                      w-full
                      text-left
                      "
                    >

                      <div className="
                      flex
                      flex-col
                      gap-3
                      sm:flex-row
                      sm:items-start
                      sm:justify-between
                      ">


                        <div>

                          <div className="
                          flex
                          flex-wrap
                          items-center
                          gap-2
                          ">

                            <h2 className="
                            font-semibold
                            text-slate-900
                            ">

                              {event.title}

                            </h2>


                            {event.status && (

                              <span className="
                              rounded-full
                              bg-slate-100
                              px-2.5
                              py-1
                              text-xs
                              font-medium
                              capitalize
                              text-slate-600
                              ">

                                {event.status
                                  .replace(
                                    "_",
                                    " "
                                  )}

                              </span>

                            )}

                          </div>


                          <p className="
                          mt-1
                          text-sm
                          text-slate-500
                          ">

                            {event.subtitle}

                          </p>

                        </div>



                        <div className="
                        flex
                        shrink-0
                        items-center
                        gap-2
                        text-sm
                        text-slate-400
                        ">

                          <CalendarDays
                            size={15}
                          />

                          {formatDate(
                            event.date
                          )}

                        </div>

                      </div>


                      {expanded && (

                        <div className="
                        mt-5
                        space-y-3
                        border-t
                        border-slate-100
                        pt-5
                        ">

                          {event.details.length === 0 ? (

                            <p className="
                            text-sm
                            text-slate-500
                            ">

                              No additional
                              information available.

                            </p>

                          ) : (

                            event.details.map(
                              (detail, index) => (

                                <p
                                  key={`${event.id}-detail-${index}`}
                                  className="
                                  whitespace-pre-line
                                  text-sm
                                  leading-6
                                  text-slate-600
                                  "
                                >

                                  {detail}

                                </p>

                              )
                            )

                          )}

                        </div>

                      )}

                    </button>


                    {event.type === "followup" &&
                      event.status === "completed" && (

                      <div className="
                      mt-4
                      flex
                      items-center
                      gap-2
                      text-xs
                      font-medium
                      text-green-700
                      ">

                        <CheckCircle2
                          size={15}
                        />

                        Follow-up completed

                      </div>

                    )}

                  </Card>

                </div>

              );

            }
          )}

        </div>

      )}


    </div>

  );

}



function HistoryStat(
{
  label,
  value,
  icon
}:{
  label:string;
  value:number;
  icon:React.ReactNode;
}){

  return (

    <Card className="p-5">

      <div className="
      flex
      items-center
      gap-3
      ">

        <div className="
        grid
        h-10
        w-10
        place-items-center
        rounded-xl
        bg-slate-100
        text-slate-600
        ">

          {icon}

        </div>


        <div>

          <p className="
          text-xs
          text-slate-500
          ">

            {label}

          </p>


          <p className="
          mt-1
          text-2xl
          font-bold
          text-slate-900
          ">

            {value}

          </p>

        </div>

      </div>

    </Card>

  );

}



function TimelineFilterButton(
{
  active,
  onClick,
  children
}:{
  active:boolean;
  onClick:()=>void;
  children:React.ReactNode;
}){

  return (

    <button
      type="button"
      onClick={onClick}
      className={`
      rounded-lg
      px-4
      py-2
      text-sm
      font-medium
      transition
      ${
        active
          ? "bg-teal-600 text-white"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      }
      `}
    >

      {children}

    </button>

  );

}
