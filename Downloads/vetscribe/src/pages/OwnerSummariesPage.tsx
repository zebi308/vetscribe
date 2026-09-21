import {
  Search,
  FileText,
  User,
  CalendarDays,
  CheckCircle2,
  Clock,
  MoreHorizontal,
  Eye,
  PawPrint,
  Plus,
  Download
} from "lucide-react";

import {
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  useAppState
} from "../lib/AppState";


export function OwnerSummariesPage(){

  const navigate = useNavigate();

  const {
    ownerSummaries,
    patients,
    clients
  } = useAppState();


  const [search,setSearch] = useState("");
  const [menuOpen,setMenuOpen] = useState<string|null>(null);


  const summaries = (ownerSummaries || []).map(summary => {

    const patient = patients.find(
      item => item.id === summary.patientId
    );

    const client = clients.find(
      item => item.id === summary.clientId
    );

    return {
      ...summary,

      owner: client
        ? `${client.firstName} ${client.lastName}`
        : "Unknown Owner",

      patient: patient?.name || "Unknown Patient",

      species: patient?.species || "Unknown",

      date: summary.generatedAt
        ? new Date(summary.generatedAt).toLocaleDateString()
        : "Not available",

      status: "Ready",

      summary:
        summary.whatWeFound ||
        "No summary available."
    };

  });


  const filteredSummaries =
    summaries.filter(item => {

      const term =
        search.toLowerCase();


      return (
        item.owner
        .toLowerCase()
        .includes(term)

        ||

        item.patient
        .toLowerCase()
        .includes(term)

        ||

        item.species
        .toLowerCase()
        .includes(term)
      );

    });



  return (

    <div className="space-y-8">


      <div className="
      flex
      flex-col
      gap-4
      md:flex-row
      md:items-center
      md:justify-between
      ">

        <div>

          <h1 className="text-3xl font-bold text-slate-900">
            Owner Summaries
          </h1>

          <p className="mt-2 text-slate-500">
            AI-generated summaries to keep pet owners informed.
          </p>

        </div>


        <button
          onClick={() => navigate("/dashboard/consultations")}
          className="
          flex
          items-center
          gap-2
          rounded-xl
          bg-teal-600
          px-5
          py-3
          font-semibold
          text-white
          hover:bg-teal-700
          "
        >

          <Plus size={18}/>

          Generate Summary

        </button>


      </div>



      <div className="
      flex
      items-center
      gap-3
      rounded-xl
      border
      border-slate-200
      bg-white
      px-4
      py-3
      ">

        <Search size={20} className="text-slate-400"/>


        <input

          value={search}

          onChange={(e)=>setSearch(e.target.value)}

          placeholder="Search owner or patient..."

          className="
          w-full
          outline-none
          text-sm
          "

        />

      </div>




      <div className="space-y-5">


      {
        filteredSummaries.length===0

        ?

        <div className="
        rounded-xl
        border
        border-dashed
        p-10
        text-center
        text-slate-500
        ">
          No summaries found.
        </div>

        :

        filteredSummaries.map(item => (

          <div

          key={item.id}

          className="
          relative
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-6
          shadow-sm
          hover:shadow-md
          "

          >


            <div className="
            flex
            flex-col
            gap-5
            md:flex-row
            md:justify-between
            ">


              <div className="flex gap-4">


                <div className="
                grid
                h-12
                w-12
                place-items-center
                rounded-xl
                bg-teal-50
                text-teal-600
                ">

                  <FileText size={24}/>

                </div>


                <div>

                  <h3 className="text-lg font-semibold text-slate-900">
                    {item.patient}
                  </h3>


                  <p className="text-sm text-slate-500">
                    {item.species}
                  </p>


                  <div className="
                  mt-3
                  flex
                  flex-wrap
                  gap-4
                  text-sm
                  text-slate-500
                  ">


                    <span className="flex items-center gap-2">
                      <User size={15}/>
                      {item.owner}
                    </span>


                    <span className="flex items-center gap-2">
                      <CalendarDays size={15}/>
                      {item.date}
                    </span>


                  </div>


                </div>


              </div>



              <div className="flex items-center gap-3">


                <span className="
                flex
                items-center
                gap-2
                rounded-full
                bg-green-50
                px-4
                py-2
                text-xs
                font-medium
                text-green-700
                ">

                  <CheckCircle2 size={14}/>

                  {item.status}

                </span>


                <div className="relative">


                  <button

                  onClick={()=>setMenuOpen(
                    menuOpen===item.id
                    ? null
                    : item.id
                  )}

                  className="
                  rounded-lg
                  p-2
                  hover:bg-slate-100
                  "
                  >

                    <MoreHorizontal size={20}/>

                  </button>



                  {
                    menuOpen===item.id && (

                      <div className="
                      absolute
                      right-0
                      top-10
                      z-20
                      w-48
                      rounded-xl
                      border
                      bg-white
                      p-2
                      shadow-lg
                      ">


                        <button
                        onClick={() => navigate(`${item.id}`)}
                        className="
                        flex
                        w-full
                        items-center
                        gap-2
                        rounded-lg
                        px-3
                        py-2
                        text-sm
                        hover:bg-slate-100
                        "
                        >

                          <Eye size={16}/>
                          View Summary

                        </button>


                        <button
                        onClick={()=>navigate(`/dashboard/patients/${item.patientId}`)}
                        className="
                        flex
                        w-full
                        items-center
                        gap-2
                        rounded-lg
                        px-3
                        py-2
                        text-sm
                        hover:bg-slate-100
                        "
                        >

                          <PawPrint size={16}/>
                          Patient Record

                        </button>


                      </div>

                    )
                  }


                </div>


              </div>


            </div>



            <div className="
            mt-5
            rounded-xl
            bg-slate-50
            p-4
            ">

              <p className="
              text-sm
              leading-6
              text-slate-600
              ">

                {item.summary}

              </p>


            </div>



            <div className="
            mt-5
            flex
            justify-end
            ">


              <button

              onClick={() => navigate(`${item.id}`)}

              className="
              flex
              items-center
              gap-2
              text-sm
              font-semibold
              text-teal-600
              "

              >

                <Download size={16}/>

                View Full Summary

              </button>


            </div>


          </div>

        ))

      }


      </div>


    </div>

  );

}
