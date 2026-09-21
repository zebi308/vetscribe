import {
  useMemo,
  useState
} from "react";

import {
  Search,
  Plus,
  Pill,
  MoreHorizontal,
  CalendarDays,
  User,
  PawPrint,
  X,
  Save,
  ChevronDown
} from "lucide-react";

import {
  useAppState
} from "../lib/AppState";

import type {
  Medicine
} from "../types/models";


const MEDICINE_CATEGORIES = [
  "POM-V",
  "POM-VPS",
  "Cascade",
  "Other"
] as const;


type MedicineCategory =
  typeof MEDICINE_CATEGORIES[number];


interface MedicationForm {
  patientId: string;
  medicineName: string;
  medicineCategory: MedicineCategory;
  quantity: string;
  unit: string;
  batchNumber: string;
  prescribedDate: string;
  withdrawalPeriod: string;
  instructions: string;
}


const emptyForm: MedicationForm = {
  patientId: "",
  medicineName: "",
  medicineCategory: "POM-V",
  quantity: "",
  unit: "",
  batchNumber: "",
  prescribedDate: new Date()
    .toISOString()
    .slice(0, 10),
  withdrawalPeriod: "",
  instructions: ""
};


export function MedicationsPage() {

  const {
    medicines,
    patients,
    clients,
    profiles,
    addMedicine,
    currentUser,
    practice
  } = useAppState();


  const [search, setSearch] =
    useState("");


  const [activeCategory, setActiveCategory] =
    useState<"All" | MedicineCategory>("All");


  const [showForm, setShowForm] =
    useState(false);


  const [menuOpen, setMenuOpen] =
    useState<string | null>(null);


  const [form, setForm] =
    useState<MedicationForm>(emptyForm);


  const [saving, setSaving] =
    useState(false);


  const [error, setError] =
    useState("");


  const [success, setSuccess] =
    useState("");


  const patientLookup = useMemo(() => {

    const map = new Map<string, typeof patients[number]>();

    patients.forEach(patient => {
      map.set(patient.id, patient);
    });

    return map;

  }, [patients]);


  const clientLookup = useMemo(() => {

    const map = new Map<string, typeof clients[number]>();

    clients.forEach(client => {
      map.set(client.id, client);
    });

    return map;

  }, [clients]);


  const profileLookup = useMemo(() => {

    const map = new Map<string, typeof profiles[number]>();

    profiles.forEach(profile => {
      map.set(profile.id, profile);
    });

    return map;

  }, [profiles]);


  const filteredMedicines = useMemo(() => {

    const term =
      search.trim().toLowerCase();


    return medicines.filter(medicine => {

      const patient =
        patientLookup.get(
          medicine.patientId
        );


      const client =
        clientLookup.get(
          medicine.clientId
        );


      const vet =
        profileLookup.get(
          medicine.prescribingVetId
        );


      const patientName =
        patient?.name || "";


      const ownerName =
        client
          ? `${client.firstName} ${client.lastName}`
          : "";


      const vetName =
        vet
          ? `${vet.firstName} ${vet.lastName}`
          : "";


      const searchMatch =
        !term ||
        medicine.medicineName
          .toLowerCase()
          .includes(term) ||
        patientName
          .toLowerCase()
          .includes(term) ||
        ownerName
          .toLowerCase()
          .includes(term) ||
        vetName
          .toLowerCase()
          .includes(term) ||
        medicine.instructions
          .toLowerCase()
          .includes(term);


      const categoryMatch =
        activeCategory === "All" ||
        medicine.medicineCategory ===
          activeCategory;


      return searchMatch && categoryMatch;

    });

  }, [
    medicines,
    patients,
    clients,
    profiles,
    search,
    activeCategory,
    patientLookup,
    clientLookup,
    profileLookup
  ]);


  function openAddForm() {

    setForm({
      ...emptyForm,
      prescribedDate:
        new Date()
          .toISOString()
          .slice(0, 10)
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  }


  function closeForm() {

    if (saving) {
      return;
    }

    setShowForm(false);
    setError("");
  }


  function updateField<
    K extends keyof MedicationForm
  >(
    field: K,
    value: MedicationForm[K]
  ) {

    setForm(prev => ({
      ...prev,
      [field]: value
    }));

    setError("");
    setSuccess("");
  }


  async function handleAddMedicine(
    event: React.FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();

    setError("");
    setSuccess("");


    if (!practice) {

      setError(
        "Practice information is not available."
      );

      return;
    }


    if (!currentUser) {

      setError(
        "Current user is not available."
      );

      return;
    }


    if (!form.patientId) {

      setError(
        "Please select a patient."
      );

      return;
    }


    if (!form.medicineName.trim()) {

      setError(
        "Medicine name is required."
      );

      return;
    }


    if (!form.quantity.trim()) {

      setError(
        "Quantity is required."
      );

      return;
    }


    if (!form.unit.trim()) {

      setError(
        "Unit is required."
      );

      return;
    }


    if (!form.prescribedDate) {

      setError(
        "Prescribed date is required."
      );

      return;
    }


    const patient =
      patientLookup.get(form.patientId);


    if (!patient) {

      setError(
        "Selected patient could not be found."
      );

      return;
    }


    const id =
      crypto.randomUUID();


    const medicine: Medicine = {

      id,

      practiceId:
        practice.id,

      patientId:
        patient.id,

      clientId:
        patient.clientId,

      prescribingVetId:
        currentUser.id,

      medicineName:
        form.medicineName.trim(),

      medicineCategory:
        form.medicineCategory,

      quantity:
        form.quantity.trim(),

      unit:
        form.unit.trim(),

      batchNumber:
        form.batchNumber.trim(),

      prescribedDate:
        form.prescribedDate,

      withdrawalPeriod:
        form.withdrawalPeriod.trim(),

      instructions:
        form.instructions.trim()

    };


    setSaving(true);


    try {

      await addMedicine(medicine);

      setSuccess(
        "Medication added successfully."
      );

      setForm({
        ...emptyForm,
        prescribedDate:
          new Date()
            .toISOString()
            .slice(0, 10)
      });


      window.setTimeout(() => {
        setShowForm(false);
        setSuccess("");
      }, 1000);

    } catch (err) {

      console.error(
        "ADD MEDICINE ERROR",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to add medication."
      );

    } finally {

      setSaving(false);

    }

  }


  function getPatientName(
    medicine: Medicine
  ) {

    return (
      patientLookup.get(
        medicine.patientId
      )?.name ||
      "Unknown Patient"
    );

  }


  function getOwnerName(
    medicine: Medicine
  ) {

    const client =
      clientLookup.get(
        medicine.clientId
      );


    return client
      ? `${client.firstName} ${client.lastName}`
      : "Unknown Owner";

  }


  function getVetName(
    medicine: Medicine
  ) {

    const profile =
      profileLookup.get(
        medicine.prescribingVetId
      );


    return profile
      ? `${profile.firstName} ${profile.lastName}`
      : "Unknown Vet";

  }


  function formatDate(
    value: string
  ) {

    if (!value) {
      return "Not recorded";
    }


    const date =
      new Date(value);


    if (Number.isNaN(
      date.getTime()
    )) {

      return value;

    }


    return date.toLocaleDateString(
      undefined,
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );

  }


  return (

    <div className="space-y-8">


      {/* =========================
          HEADER
      ========================= */}

      <div
        className="
          flex
          flex-col
          gap-4
          md:flex-row
          md:items-center
          md:justify-between
        "
      >

        <div>

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <div
              className="
                grid
                h-12
                w-12
                place-items-center
                rounded-xl
                bg-teal-50
                text-teal-600
              "
            >

              <Pill size={24} />

            </div>


            <div>

              <h1
                className="
                  text-3xl
                  font-bold
                  text-slate-900
                "
              >

                Medications

              </h1>


              <p
                className="
                  mt-1
                  text-slate-500
                "
              >

                Manage prescribed medicines
                and treatment records.

              </p>

            </div>

          </div>

        </div>


        <button
          type="button"
          onClick={openAddForm}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-teal-600
            px-5
            py-3
            font-semibold
            text-white
            shadow-sm
            transition
            hover:bg-teal-700
          "
        >

          <Plus size={18} />

          Add Medication

        </button>

      </div>


      {/* =========================
          SUMMARY
      ========================= */}

      <div
        className="
          grid
          gap-4
          sm:grid-cols-2
          lg:grid-cols-3
        "
      >

        <div
          className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm
          "
        >

          <p
            className="
              text-sm
              text-slate-500
            "
          >

            Total medications

          </p>


          <p
            className="
              mt-2
              text-3xl
              font-bold
              text-slate-900
            "
          >

            {medicines.length}

          </p>

        </div>


        <div
          className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm
          "
        >

          <p
            className="
              text-sm
              text-slate-500
            "
          >

            Patients with records

          </p>


          <p
            className="
              mt-2
              text-3xl
              font-bold
              text-slate-900
            "
          >

            {
              new Set(
                medicines.map(
                  medicine =>
                    medicine.patientId
                )
              ).size
            }

          </p>

        </div>


        <div
          className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm
          "
        >

          <p
            className="
              text-sm
              text-slate-500
            "
          >

            Current view

          </p>


          <p
            className="
              mt-2
              text-xl
              font-bold
              text-slate-900
            "
          >

            {activeCategory}

          </p>

        </div>

      </div>


      {/* =========================
          SEARCH
      ========================= */}

      <div
        className="
          flex
          flex-col
          gap-3
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-4
          shadow-sm
          lg:flex-row
          lg:items-center
        "
      >

        <div
          className="
            flex
            flex-1
            items-center
            gap-3
            rounded-xl
            border
            border-slate-200
            px-4
            py-3
          "
        >

          <Search
            size={19}
            className="
              shrink-0
              text-slate-400
            "
          />


          <input
            type="text"
            value={search}
            onChange={event =>
              setSearch(
                event.target.value
              )
            }
            placeholder="
              Search medicine, patient,
              owner or vet...
            "
            className="
              w-full
              bg-transparent
              text-sm
              text-slate-900
              outline-none
              placeholder:text-slate-400
            "
          />

        </div>


        <div
          className="
            flex
            flex-wrap
            gap-2
          "
        >

          <button
            type="button"
            onClick={() =>
              setActiveCategory("All")
            }
            className={`
              rounded-full
              border
              px-4
              py-2
              text-sm
              font-medium
              transition
              ${
                activeCategory === "All"
                  ? "border-teal-600 bg-teal-600 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-teal-400"
              }
            `}
          >

            All

          </button>


          {MEDICINE_CATEGORIES.map(
            category => (

              <button
                key={category}
                type="button"
                onClick={() =>
                  setActiveCategory(
                    category
                  )
                }
                className={`
                  rounded-full
                  border
                  px-4
                  py-2
                  text-sm
                  font-medium
                  transition
                  ${
                    activeCategory === category
                      ? "border-teal-600 bg-teal-600 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-teal-400"
                  }
                `}
              >

                {category}

              </button>

            )
          )}

        </div>

      </div>


      {/* =========================
          RESULTS
      ========================= */}

      <div
        className="
          flex
          items-center
          justify-between
          text-sm
          text-slate-500
        "
      >

        <p>

          Showing{" "}

          <span
            className="
              font-semibold
              text-slate-800
            "
          >

            {filteredMedicines.length}

          </span>

          {" "}medication records

        </p>


        {search && (

          <button
            type="button"
            onClick={() => setSearch("")}
            className="
              font-medium
              text-teal-600
              hover:text-teal-700
            "
          >

            Clear search

          </button>

        )}

      </div>


      {/* =========================
          MEDICATION LIST
      ========================= */}

      {filteredMedicines.length === 0 ? (

        <div
          className="
            rounded-2xl
            border
            border-dashed
            border-slate-300
            bg-white
            p-12
            text-center
          "
        >

          <div
            className="
              mx-auto
              grid
              h-14
              w-14
              place-items-center
              rounded-full
              bg-slate-100
              text-slate-500
            "
          >

            <Pill size={25} />

          </div>


          <h2
            className="
              mt-4
              text-lg
              font-semibold
              text-slate-900
            "
          >

            No medications found

          </h2>


          <p
            className="
              mx-auto
              mt-2
              max-w-md
              text-sm
              text-slate-500
            "
          >

            There are no medication records
            matching your current search or
            filter.

          </p>


          {!search &&
            activeCategory === "All" && (

              <button
                type="button"
                onClick={openAddForm}
                className="
                  mt-5
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-teal-600
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  hover:bg-teal-700
                "
              >

                <Plus size={17} />

                Add First Medication

              </button>

            )}

        </div>

      ) : (

        <div
          className="
            overflow-hidden
            rounded-2xl
            border
            border-slate-200
            bg-white
            shadow-sm
          "
        >

          {/* DESKTOP TABLE */}

          <div className="hidden lg:block">

            <div
              className="
                grid
                grid-cols-[1.5fr_1.2fr_1fr_1fr_1fr_48px]
                gap-4
                border-b
                border-slate-200
                bg-slate-50
                px-6
                py-3
                text-xs
                font-semibold
                uppercase
                tracking-wide
                text-slate-500
              "
            >

              <span>Medication</span>

              <span>Patient</span>

              <span>Category</span>

              <span>Prescribed</span>

              <span>Prescribing Vet</span>

              <span />

            </div>


            {filteredMedicines.map(
              medicine => (

                <div
                  key={medicine.id}
                  className="
                    relative
                    grid
                    grid-cols-[1.5fr_1.2fr_1fr_1fr_1fr_48px]
                    items-center
                    gap-4
                    border-b
                    border-slate-100
                    px-6
                    py-5
                    last:border-b-0
                    hover:bg-slate-50
                  "
                >

                  <div>

                    <p
                      className="
                        font-semibold
                        text-slate-900
                      "
                    >

                      {medicine.medicineName}

                    </p>


                    <p
                      className="
                        mt-1
                        text-xs
                        text-slate-500
                      "
                    >

                      {medicine.quantity}{" "}
                      {medicine.unit}

                    </p>

                  </div>


                  <div>

                    <p
                      className="
                        flex
                        items-center
                        gap-2
                        text-sm
                        font-medium
                        text-slate-800
                      "
                    >

                      <PawPrint
                        size={15}
                        className="
                          text-teal-600
                        "
                      />

                      {getPatientName(
                        medicine
                      )}

                    </p>


                    <p
                      className="
                        mt-1
                        text-xs
                        text-slate-500
                      "
                    >

                      {getOwnerName(
                        medicine
                      )}

                    </p>

                  </div>


                  <div>

                    <span
                      className="
                        inline-flex
                        rounded-full
                        bg-teal-50
                        px-3
                        py-1
                        text-xs
                        font-semibold
                        text-teal-700
                      "
                    >

                      {medicine.medicineCategory}

                    </span>

                  </div>


                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      text-sm
                      text-slate-600
                    "
                  >

                    <CalendarDays
                      size={15}
                      className="
                        text-slate-400
                      "
                    />

                    {formatDate(
                      medicine.prescribedDate
                    )}

                  </div>


                  <div>

                    <p
                      className="
                        text-sm
                        font-medium
                        text-slate-700
                      "
                    >

                      {getVetName(
                        medicine
                      )}

                    </p>

                  </div>


                  <div className="relative">

                    <button
                      type="button"
                      onClick={() =>
                        setMenuOpen(
                          menuOpen ===
                            medicine.id
                            ? null
                            : medicine.id
                        )
                      }
                      className="
                        rounded-lg
                        p-2
                        text-slate-500
                        hover:bg-slate-100
                        hover:text-slate-800
                      "
                    >

                      <MoreHorizontal
                        size={19}
                      />

                    </button>


                    {menuOpen === medicine.id && (

                      <div
                        className="
                          absolute
                          right-0
                          top-10
                          z-30
                          w-48
                          rounded-xl
                          border
                          border-slate-200
                          bg-white
                          p-2
                          shadow-lg
                        "
                      >

                        <div
                          className="
                            px-3
                            py-2
                          "
                        >

                          <p
                            className="
                              text-xs
                              font-semibold
                              text-slate-500
                            "
                          >

                            Instructions

                          </p>


                          <p
                            className="
                              mt-1
                              text-sm
                              text-slate-700
                            "
                          >

                            {medicine.instructions ||
                              "No instructions recorded."}

                          </p>

                        </div>


                        {medicine.withdrawalPeriod && (

                          <div
                            className="
                              border-t
                              border-slate-100
                              px-3
                              py-2
                            "
                          >

                            <p
                              className="
                                text-xs
                                font-semibold
                                text-slate-500
                              "
                            >

                              Withdrawal

                            </p>


                            <p
                              className="
                                mt-1
                                text-sm
                                text-slate-700
                              "
                            >

                              {medicine.withdrawalPeriod}

                            </p>

                          </div>

                        )}

                      </div>

                    )}

                  </div>

                </div>

              )
            )}

          </div>


          {/* MOBILE / TABLET CARDS */}

          <div
            className="
              divide-y
              divide-slate-100
              lg:hidden
            "
          >

            {filteredMedicines.map(
              medicine => (

                <div
                  key={medicine.id}
                  className="
                    p-5
                  "
                >

                  <div
                    className="
                      flex
                      items-start
                      justify-between
                      gap-4
                    "
                  >

                    <div className="min-w-0">

                      <div
                        className="
                          flex
                          items-center
                          gap-2
                        "
                      >

                        <div
                          className="
                            grid
                            h-10
                            w-10
                            shrink-0
                            place-items-center
                            rounded-lg
                            bg-teal-50
                            text-teal-600
                          "
                        >

                          <Pill size={19} />

                        </div>


                        <div className="min-w-0">

                          <h3
                            className="
                              truncate
                              font-semibold
                              text-slate-900
                            "
                          >

                            {medicine.medicineName}

                          </h3>


                          <p
                            className="
                              mt-1
                              text-xs
                              text-slate-500
                            "
                          >

                            {medicine.quantity}{" "}
                            {medicine.unit}

                          </p>

                        </div>

                      </div>

                    </div>


                    <span
                      className="
                        shrink-0
                        rounded-full
                        bg-teal-50
                        px-3
                        py-1
                        text-xs
                        font-semibold
                        text-teal-700
                      "
                    >

                      {medicine.medicineCategory}

                    </span>

                  </div>


                  <div
                    className="
                      mt-5
                      grid
                      gap-3
                      sm:grid-cols-2
                    "
                  >

                    <div
                      className="
                        rounded-xl
                        bg-slate-50
                        p-3
                      "
                    >

                      <p
                        className="
                          text-xs
                          text-slate-500
                        "
                      >

                        Patient

                      </p>


                      <p
                        className="
                          mt-1
                          flex
                          items-center
                          gap-2
                          text-sm
                          font-semibold
                          text-slate-800
                        "
                      >

                        <PawPrint
                          size={15}
                          className="
                            text-teal-600
                          "
                        />

                        {getPatientName(
                          medicine
                        )}

                      </p>


                      <p
                        className="
                          mt-1
                          text-xs
                          text-slate-500
                        "
                      >

                        {getOwnerName(
                          medicine
                        )}

                      </p>

                    </div>


                    <div
                      className="
                        rounded-xl
                        bg-slate-50
                        p-3
                      "
                    >

                      <p
                        className="
                          text-xs
                          text-slate-500
                        "
                      >

                        Prescribed

                      </p>


                      <p
                        className="
                          mt-1
                          text-sm
                          font-semibold
                          text-slate-800
                        "
                      >

                        {formatDate(
                          medicine.prescribedDate
                        )}

                      </p>


                      <p
                        className="
                          mt-1
                          text-xs
                          text-slate-500
                        "
                      >

                        {getVetName(
                          medicine
                        )}

                      </p>

                    </div>

                  </div>


                  <div
                    className="
                      mt-4
                      border-t
                      border-slate-100
                      pt-4
                    "
                  >

                    <p
                      className="
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wide
                        text-slate-400
                      "
                    >

                      Instructions

                    </p>


                    <p
                      className="
                        mt-1
                        text-sm
                        text-slate-700
                      "
                    >

                      {medicine.instructions ||
                        "No instructions recorded."}

                    </p>


                    {medicine.withdrawalPeriod && (

                      <p
                        className="
                          mt-2
                          text-xs
                          text-slate-500
                        "
                      >

                        Withdrawal:{" "}

                        <span
                          className="
                            font-medium
                            text-slate-700
                          "
                        >

                          {medicine.withdrawalPeriod}

                        </span>

                      </p>

                    )}

                  </div>

                </div>

              )
            )}

          </div>

        </div>

      )}


      {/* =========================
          ADD MEDICATION MODAL
      ========================= */}

      {showForm && (

        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-slate-900/50
            p-4
            backdrop-blur-sm
          "
          onMouseDown={event => {

            if (
              event.target ===
              event.currentTarget
            ) {
              closeForm();
            }

          }}
        >

          <div
            className="
              max-h-[92vh]
              w-full
              max-w-3xl
              overflow-y-auto
              rounded-2xl
              bg-white
              shadow-2xl
            "
          >

            {/* MODAL HEADER */}

            <div
              className="
                sticky
                top-0
                z-10
                flex
                items-center
                justify-between
                border-b
                border-slate-200
                bg-white
                px-5
                py-4
                sm:px-6
              "
            >

              <div>

                <h2
                  className="
                    text-xl
                    font-bold
                    text-slate-900
                  "
                >

                  Add Medication

                </h2>


                <p
                  className="
                    mt-1
                    text-sm
                    text-slate-500
                  "
                >

                  Create a new medication record.

                </p>

              </div>


              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="
                  rounded-lg
                  p-2
                  text-slate-400
                  hover:bg-slate-100
                  hover:text-slate-700
                  disabled:opacity-50
                "
              >

                <X size={20} />

              </button>

            </div>


            <form
              onSubmit={handleAddMedicine}
              className="
                space-y-6
                p-5
                sm:p-6
              "
            >

              {error && (

                <div
                  className="
                    rounded-xl
                    border
                    border-red-200
                    bg-red-50
                    px-4
                    py-3
                    text-sm
                    text-red-700
                  "
                >

                  {error}

                </div>

              )}


              {success && (

                <div
                  className="
                    rounded-xl
                    border
                    border-green-200
                    bg-green-50
                    px-4
                    py-3
                    text-sm
                    text-green-700
                  "
                >

                  {success}

                </div>

              )}


              <div
                className="
                  grid
                  gap-5
                  sm:grid-cols-2
                "
              >

                {/* PATIENT */}

                <div className="sm:col-span-2">

                  <label
                    htmlFor="medicine-patient"
                    className="
                      text-sm
                      font-medium
                      text-slate-700
                    "
                  >

                    Patient
                    <span className="text-red-500">
                      {" "}*
                    </span>

                  </label>


                  <select
                    id="medicine-patient"
                    value={form.patientId}
                    onChange={event =>
                      updateField(
                        "patientId",
                        event.target.value
                      )
                    }
                    className="
                      mt-2
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      px-4
                      py-3
                      text-sm
                      outline-none
                      focus:border-teal-500
                    "
                  >

                    <option value="">
                      Select patient
                    </option>


                    {patients.map(
                      patient => (

                        <option
                          key={patient.id}
                          value={patient.id}
                        >

                          {patient.name} —{" "}
                          {patient.species}

                        </option>

                      )
                    )}

                  </select>

                </div>


                {/* MEDICINE */}

                <div>

                  <label
                    htmlFor="medicine-name"
                    className="
                      text-sm
                      font-medium
                      text-slate-700
                    "
                  >

                    Medicine Name
                    <span className="text-red-500">
                      {" "}*
                    </span>

                  </label>


                  <input
                    id="medicine-name"
                    type="text"
                    value={form.medicineName}
                    onChange={event =>
                      updateField(
                        "medicineName",
                        event.target.value
                      )
                    }
                    placeholder="e.g. Amoxicillin"
                    className="
                      mt-2
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      px-4
                      py-3
                      text-sm
                      outline-none
                      focus:border-teal-500
                    "
                  />

                </div>


                {/* CATEGORY */}

                <div>

                  <label
                    htmlFor="medicine-category"
                    className="
                      text-sm
                      font-medium
                      text-slate-700
                    "
                  >

                    Medicine Category

                  </label>


                  <select
                    id="medicine-category"
                    value={
                      form.medicineCategory
                    }
                    onChange={event =>
                      updateField(
                        "medicineCategory",
                        event.target.value as MedicineCategory
                      )
                    }
                    className="
                      mt-2
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      px-4
                      py-3
                      text-sm
                      outline-none
                      focus:border-teal-500
                    "
                  >

                    {MEDICINE_CATEGORIES.map(
                      category => (

                        <option
                          key={category}
                          value={category}
                        >

                          {category}

                        </option>

                      )
                    )}

                  </select>

                </div>


                {/* QUANTITY */}

                <div>

                  <label
                    htmlFor="medicine-quantity"
                    className="
                      text-sm
                      font-medium
                      text-slate-700
                    "
                  >

                    Quantity
                    <span className="text-red-500">
                      {" "}*
                    </span>

                  </label>


                  <input
                    id="medicine-quantity"
                    type="text"
                    value={form.quantity}
                    onChange={event =>
                      updateField(
                        "quantity",
                        event.target.value
                      )
                    }
                    placeholder="e.g. 20"
                    className="
                      mt-2
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      px-4
                      py-3
                      text-sm
                      outline-none
                      focus:border-teal-500
                    "
                  />

                </div>


                {/* UNIT */}

                <div>

                  <label
                    htmlFor="medicine-unit"
                    className="
                      text-sm
                      font-medium
                      text-slate-700
                    "
                  >

                    Unit
                    <span className="text-red-500">
                      {" "}*
                    </span>

                  </label>


                  <input
                    id="medicine-unit"
                    type="text"
                    value={form.unit}
                    onChange={event =>
                      updateField(
                        "unit",
                        event.target.value
                      )
                    }
                    placeholder="e.g. tablets"
                    className="
                      mt-2
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      px-4
                      py-3
                      text-sm
                      outline-none
                      focus:border-teal-500
                    "
                  />

                </div>


                {/* BATCH */}

                <div>

                  <label
                    htmlFor="medicine-batch"
                    className="
                      text-sm
                      font-medium
                      text-slate-700
                    "
                  >

                    Batch Number

                  </label>


                  <input
                    id="medicine-batch"
                    type="text"
                    value={form.batchNumber}
                    onChange={event =>
                      updateField(
                        "batchNumber",
                        event.target.value
                      )
                    }
                    placeholder="Optional"
                    className="
                      mt-2
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      px-4
                      py-3
                      text-sm
                      outline-none
                      focus:border-teal-500
                    "
                  />

                </div>


                {/* DATE */}

                <div>

                  <label
                    htmlFor="medicine-date"
                    className="
                      text-sm
                      font-medium
                      text-slate-700
                    "
                  >

                    Prescribed Date
                    <span className="text-red-500">
                      {" "}*
                    </span>

                  </label>


                  <input
                    id="medicine-date"
                    type="date"
                    value={
                      form.prescribedDate
                    }
                    onChange={event =>
                      updateField(
                        "prescribedDate",
                        event.target.value
                      )
                    }
                    className="
                      mt-2
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      px-4
                      py-3
                      text-sm
                      outline-none
                      focus:border-teal-500
                    "
                  />

                </div>


                {/* WITHDRAWAL */}

                <div className="sm:col-span-2">

                  <label
                    htmlFor="medicine-withdrawal"
                    className="
                      text-sm
                      font-medium
                      text-slate-700
                    "
                  >

                    Withdrawal Period

                  </label>


                  <input
                    id="medicine-withdrawal"
                    type="text"
                    value={
                      form.withdrawalPeriod
                    }
                    onChange={event =>
                      updateField(
                        "withdrawalPeriod",
                        event.target.value
                      )
                    }
                    placeholder="e.g. 7 days or N/A"
                    className="
                      mt-2
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      px-4
                      py-3
                      text-sm
                      outline-none
                      focus:border-teal-500
                    "
                  />

                </div>


                {/* INSTRUCTIONS */}

                <div className="sm:col-span-2">

                  <label
                    htmlFor="medicine-instructions"
                    className="
                      text-sm
                      font-medium
                      text-slate-700
                    "
                  >

                    Instructions

                  </label>


                  <textarea
                    id="medicine-instructions"
                    value={
                      form.instructions
                    }
                    onChange={event =>
                      updateField(
                        "instructions",
                        event.target.value
                      )
                    }
                    rows={4}
                    placeholder="
                      Enter dosage, route,
                      frequency and duration...
                    "
                    className="
                      mt-2
                      w-full
                      resize-none
                      rounded-xl
                      border
                      border-slate-200
                      px-4
                      py-3
                      text-sm
                      outline-none
                      focus:border-teal-500
                    "
                  />

                </div>

              </div>


              {/* FORM ACTIONS */}

              <div
                className="
                  flex
                  flex-col-reverse
                  gap-3
                  border-t
                  border-slate-200
                  pt-5
                  sm:flex-row
                  sm:justify-end
                "
              >

                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-5
                    py-3
                    text-sm
                    font-semibold
                    text-slate-700
                    hover:bg-slate-50
                    disabled:opacity-50
                  "
                >

                  Cancel

                </button>


                <button
                  type="submit"
                  disabled={saving}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-teal-600
                    px-5
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    hover:bg-teal-700
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >

                  {saving ? (

                    <>
                      <span
                        className="
                          h-4
                          w-4
                          animate-spin
                          rounded-full
                          border-2
                          border-white
                          border-t-transparent
                        "
                      />

                      Saving...

                    </>

                  ) : (

                    <>
                      <Save size={17} />

                      Save Medication

                    </>

                  )}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>

  );

}
