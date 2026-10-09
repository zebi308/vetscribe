import {
  ArrowLeft,
  CalendarDays,
  Download,
  FileText,
  PawPrint,
  User,
  Mail,
  CheckCircle2,
  XCircle
} from "lucide-react";

import {
  useState
} from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import {
  useAppState
} from "../lib/AppState";


export function OwnerSummaryPage(){

  const navigate = useNavigate();

  const { id } =
    useParams<{id:string}>();

  const {
    ownerSummaries,
    patients,
    clients,
    sendOwnerSummaryEmail
  } = useAppState();


  const [sending,setSending] =
    useState(false);

  const [message,setMessage] =
    useState("");

  const [messageType,setMessageType] =
    useState<"success" | "error" | "">("");


  const summary =
    ownerSummaries.find(
      item => item.id === id
    );


  if (!summary) {

    return (

      <div className="
      p-8
      text-slate-500
      ">

        Summary not found.

      </div>

    );

  }


  const patient =
    patients.find(
      item =>
        item.id === summary.patientId
    );


  const client =
    clients.find(
      item =>
        item.id === summary.clientId
    );



  async function sendEmail(){

    try{

      setSending(true);

      setMessage("");

      setMessageType("");


      await sendOwnerSummaryEmail(
        summary!.id
      );


      setMessage(
        "Summary sent successfully."
      );

      setMessageType("success");

    }

    catch(error){

      setMessage(
        error instanceof Error
          ? error.message
          : "Email was not sent. Please try again."
      );

      setMessageType("error");

    }

    finally{

      setSending(false);

    }

  }



  function printSummary(){

    window.print();

  }



  function formatDate(
    value?:string
  ){

    if(!value)
      return "Not available";


    return new Date(value)
      .toLocaleDateString();

  }



  return (

    <div className="
    space-y-8
    ">


      {/* =========================
          ACTION BAR
      ========================= */}

      <div className="
      flex
      flex-col
      gap-4
      md:flex-row
      md:justify-between
      ">


        <button

          onClick={() =>
            navigate(
              "/dashboard/owner-summaries"
            )
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

          Back

        </button>



        <div className="
        flex
        gap-3
        ">


          {/* PRINT */}

          <button

            onClick={printSummary}

            className="
            flex
            items-center
            gap-2
            rounded-xl
            bg-teal-600
            px-5
            py-3
            text-sm
            font-semibold
            text-white
            hover:bg-teal-700
            "

          >

            <Download size={17}/>

            Export / Print PDF

          </button>



          {/* SEND EMAIL */}

          <button

            onClick={sendEmail}

            disabled={sending}

            className="
            flex
            items-center
            gap-2
            rounded-xl
            bg-slate-900
            px-5
            py-3
            text-sm
            font-semibold
            text-white
            hover:bg-slate-800
            disabled:cursor-not-allowed
            disabled:opacity-50
            "

          >

            <Mail size={17}/>


            {

              sending

                ?

                "Sending..."

                :

                "Send To Owner"

            }


          </button>


        </div>


      </div>



      {/* =========================
          EMAIL STATUS
      ========================= */}

      {

        message &&

        <div

          className={`
          flex
          items-center
          gap-2
          rounded-xl
          p-4

          ${
            messageType === "success"

              ?

              "bg-green-50 text-green-700"

              :

              "bg-red-50 text-red-700"
          }
          `}

        >

          {

            messageType === "success"

              ?

              <CheckCircle2
                size={18}
              />

              :

              <XCircle
                size={18}
              />

          }


          {message}


        </div>

      }



      {/* =========================
          SUMMARY HEADER
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
        gap-4
        border-b
        pb-5
        ">


          <div className="
          grid
          h-12
          w-12
          place-items-center
          rounded-xl
          bg-teal-50
          text-teal-600
          ">

            <FileText
              size={24}
            />

          </div>



          <div>


            <h1 className="
            text-3xl
            font-bold
            text-slate-900
            ">

              Owner Summary

            </h1>



            <p className="
            text-sm
            text-slate-500
            ">

              Generated consultation summary

            </p>


          </div>


        </div>



        {/* PATIENT / OWNER / DATE */}

        <div className="
        mt-6
        grid
        gap-4
        md:grid-cols-3
        ">


          <InfoCard

            icon={
              <PawPrint
                size={18}
              />
            }

            label="Patient"

            value={
              patient?.name ||
              "Unknown"
            }

          />



          <InfoCard

            icon={
              <User
                size={18}
              />
            }

            label="Owner"

            value={
              client
                ?

                `${client.firstName} ${client.lastName}`

                :

                "Unknown"
            }

          />



          <InfoCard

            icon={
              <CalendarDays
                size={18}
              />
            }

            label="Generated"

            value={
              formatDate(
                summary.generatedAt
              )
            }

          />


        </div>


      </div>



      {/* =========================
          SUMMARY CONTENT
      ========================= */}

      <SummarySection

        title="What We Found"

        text={
          summary.whatWeFound
        }

      />


      <SummarySection

        title="What We Discussed"

        text={
          summary.whatWeDiscussed
        }

      />


      <TreatmentMedicationSection
        data={summary.treatmentAndMedication}
      />


      <SummarySection

        title="What To Do At Home"

        text={
          summary.whatToDoAtHome
        }

      />


      <SummarySection

        title="When To Contact Us"

        text={
          summary.whenToContactUs
        }

      />


      <SummarySection

        title="Follow Up"

        text={
          summary.followUp
        }

      />


    </div>

  );

}



/* =========================
   TREATMENT & MEDICATION
========================= */

function TreatmentMedicationSection(
{
  data
}:{
  data:any;
}){

  let items:any[] = [];

  try {

    if(Array.isArray(data)){
      items = data;
    }
    else if(typeof data === "string"){
      const parsed = JSON.parse(data);
      items = Array.isArray(parsed) ? parsed : [parsed];
    }
    else if(data && typeof data === "object"){
      items = [data];
    }

  } catch {
    items = [];
  }


  return (

    <div className="
    rounded-2xl
    border
    border-slate-200
    bg-white
    p-6
    shadow-sm
    ">

      <h2 className="
      text-lg
      font-semibold
      text-slate-900
      ">
        Treatment and Medication
      </h2>


      {
        items.length > 0

        ?

        <div className="
        mt-4
        space-y-4
        ">

          {
            items.map((item:any,index:number)=>(

              <div
              key={index}
              className="
              rounded-xl
              bg-slate-50
              p-4
              border
              border-slate-100
              "
              >

                <h3 className="
                font-semibold
                text-slate-900
                ">
                  {
                    item.medicineName ||
                    item.name ||
                    item.medication ||
                    item.treatment ||
                    `Treatment ${index + 1}`
                  }
                </h3>


                <div className="
                mt-3
                grid
                gap-3
                md:grid-cols-2
                text-sm
                text-slate-600
                ">

                  {
                    item.dose &&
                    <div>
                      <span className="font-medium text-slate-800">
                        Dose:
                      </span>{" "}
                      {item.dose}
                    </div>
                  }

                  {
                    item.frequency &&
                    <div>
                      <span className="font-medium text-slate-800">
                        Frequency:
                      </span>{" "}
                      {item.frequency}
                    </div>
                  }

                  {
                    item.duration &&
                    <div>
                      <span className="font-medium text-slate-800">
                        Duration:
                      </span>{" "}
                      {item.duration}
                    </div>
                  }

                  {
                    item.route &&
                    <div>
                      <span className="font-medium text-slate-800">
                        Route:
                      </span>{" "}
                      {item.route}
                    </div>
                  }

                </div>

              </div>

            ))
          }

        </div>

        :

        <p className="
        mt-3
        text-slate-600
        ">
          No information available.
        </p>

      }

    </div>

  );

}



/* =========================
   SUMMARY SECTION
========================= */

function SummarySection(
{
  title,
  text
}:{
  title:string;
  text:string;
}){


  return (

    <div className="
    rounded-2xl
    border
    border-slate-200
    bg-white
    p-6
    shadow-sm
    ">


      <h2 className="
      text-lg
      font-semibold
      text-slate-900
      ">

        {title}

      </h2>



      <p className="
      mt-3
      whitespace-pre-line
      leading-7
      text-slate-600
      ">

        {
          text ||
          "No information available."
        }

      </p>


    </div>

  );

}



/* =========================
   INFO CARD
========================= */

function InfoCard(
{
  icon,
  label,
  value
}:{
  icon:React.ReactNode;
  label:string;
  value:string;
}){


  return (

    <div className="
    rounded-xl
    bg-slate-50
    p-4
    ">


      <div className="
      flex
      items-center
      gap-2
      text-sm
      text-slate-500
      ">

        {icon}

        {label}

      </div>



      <p className="
      mt-2
      font-semibold
      text-slate-900
      ">

        {value}

      </p>


    </div>

  );

}