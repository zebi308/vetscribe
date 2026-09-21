import {
  useMemo,
  useState
} from "react";

import {
  ArrowLeft,
  Archive,
  CalendarDays,
  CheckCircle2,
  Edit3,
  FileText,
  Pill,
  Save,
  User,
  X,
  PawPrint
} from "lucide-react";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import {
  useAppState
} from "../lib/AppState";


const MEDICINE_CATEGORIES = [
  "POM-V",
  "POM-VPS",
  "Cascade",
  "Other"
] as const;


type MedicineCategory =
  typeof MEDICINE_CATEGORIES[number];


interface FormState {
  medicineName: string;
  medicineCategory: MedicineCategory;
  quantity: string;
  unit: string;
  batchNumber: string;
  prescribedDate: string;
  withdrawalPeriod: string;
  instructions: string;
}


export function MedicationDetailPage() {

  const navigate = useNavigate();

  const { id } =
    useParams<{ id: string }>();


  const {
    medicines,
    patients,
    clients,
    profiles,
    updateMedicine,
    archiveMedicine
  } = useAppState();


  const medicine =
    medicines.find(
      item => item.id === id
    );


  const patient =
    useMemo(
      () =>
        medicine
          ? patients.find(
              item =>
                item.id ===
                medicine.patientId
            )
          : undefined,
      [medicine, patients]
    );


  const client =
    useMemo(
      () =>
        medicine
          ? clients.find(
              item =>
                item.id ===
                medicine.clientId
            )
          : undefined,
      [medicine, clients]
    );


  const prescribingVet =
    useMemo(
      () =>
        medicine
          ? profiles.find(
              item =>
                item.id ===
                medicine.prescribingVetId
            )
          : undefined,
      [medicine, profiles]
    );


  const [editing, setEditing] =
    useState(false);


  const [saving, setSaving] =
    useState(false);


  const [archiving, setArchiving] =
    useState(false);


  const [saved, setSaved] =
    useState(false);


  const [error, setError] =
    useState("");


  const [form, setForm] =
    useState<FormState>({
      medicineName: "",
      medicineCategory: "POM-V",
      quantity: "",
      unit: "",
      batchNumber: "",
      prescribedDate: "",
      withdrawalPeriod: "",
      instructions: ""
    });


  /*
   * Keep the edit form synchronized with
   * the selected medication.
   */
  function startEditing() {

    if (!medicine) {
      return;
    }


    setForm({
      medicineName:
        medicine.medicineName || "",

      medicineCategory:
        medicine.medicineCategory,

      quantity:
        medicine.quantity || "",

      unit:
        medicine.unit || "",

      batchNumber:
        medicine.batchNumber || "",

      prescribedDate:
        medicine.prescribedDate || "",

      withdrawalPeriod:
        medicine.withdrawalPeriod || "",

      instructions:
        medicine.instructions || ""
    });


    setError("");
    setSaved(false);
    setEditing(true);
  }


  function cancelEditing() {

    if (saving) {
      return;
    }

    setEditing(false);
    setError("");
    setSaved(false);
  }


  function updateField<
    K extends keyof FormState
  >(
    field: K,
    value: FormState[K]
  ) {

    setForm(prev => ({
      ...prev,
      [field]: value
    }));

    setError("");
    setSaved(false);
  }


  function formatDate(
    value?: string
  ) {

    if (!value) {
      return "Not recorded";
    }


    const date =
      new Date(value);


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

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


  async function handleSave(
    event: React.FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();


    if (!medicine) {
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


    setSaving(true);
    setError("");
    setSaved(false);


    try {

      await updateMedicine(
        medicine.id,
        {
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
        }
      );


      setSaved(true);
      setEditing(false);

    } catch (err) {

      console.error(
        "UPDATE MEDICATION ERROR",
        err
      );


      setError(
        err instanceof Error
          ? err.message
          : "Unable to update medication."
      );

    } finally {

      setSaving(false);

    }

  }


  async function handleArchive() {

    if (!medicine) {
      return;
    }


    const confirmed =
      window.confirm(
        `Archive ${medicine.medicineName}? This will remove it from the active medication list while preserving the record.`
      );


    if (!confirmed) {
      return;
    }


    setArchiving(true);
    setError("");


    try {

      await archiveMedicine(
        medicine.id
      );


      navigate(
        "/dashboard/medications"
      );

    } catch (err) {

      console.error(
        "ARCHIVE MEDICATION ERROR",
        err
      );


      setError(
        err instanceof Error
          ? err.message
          : "Unable to archive medication."
      );

    } finally {

      setArchiving(false);

    }

  }


  if (!medicine) {

    return (

      <div className="space-y-6">

        <button
          type="button"
          onClick={() =>
            navigate(
              "/dashboard/medications"
            )
          }
          className="
            inline-flex
            items-center
            gap-2
            text-sm
            font-medium
            text-slate-500
            hover:text-teal-600
          "
        >

          <ArrowLeft size={17} />

          Back to Medications

        </button>


        <div
          className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-10
            text-center
            shadow-sm
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

            <Pill size={26} />

          </div>


          <h1
            className="
              mt-4
              text-xl
              font-bold
              text-slate-900
            "
          >

            Medication not found

          </h1>


          <p
            className="
              mx-auto
              mt-2
              max-w-md
              text-sm
              text-slate-500
            "
          >

            This medication record could not
            be found in the current practice.

          </p>


          <button
            type="button"
            onClick={() =>
              navigate(
                "/dashboard/medications"
              )
            }
            className="
              mt-6
              inline-flex
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

            <ArrowLeft size={17} />

            Back to Medications

          </button>

        </div>

      </div>

    );

  }


  return (

    <div className="space-y-8">

      {/* HEADER */}

      <div>

        <button
          type="button"
          onClick={() =>
            navigate(
              "/dashboard/medications"
            )
          }
          className="
            mb-5
            inline-flex
            items-center
            gap-2
            text-sm
            font-medium
            text-slate-500
            hover:text-teal-600
          "
        >

          <ArrowLeft size={17} />

          Back to Medications

        </button>


        <div
          className="
            flex
            flex-col
            gap-5
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >

          <div
            className="
              flex
              items-center
              gap-4
            "
          >

            <div
              className="
                grid
                h-14
                w-14
                shrink-0
                place-items-center
                rounded-2xl
                bg-teal-50
                text-teal-600
              "
            >

              <Pill size={28} />

            </div>


            <div>

              <h1
                className="
                  text-2xl
                  font-bold
                  text-slate-900
                  sm:text-3xl
                "
              >

                {medicine.medicineName}

              </h1>


              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                "
              >

                Medication record

              </p>

            </div>

          </div>


          {!editing && (

            <div
              className="
                flex
                flex-col
                gap-3
                sm:flex-row
              "
            >

              <button
                type="button"
                onClick={startEditing}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-slate-700
                  shadow-sm
                  hover:bg-slate-50
                "
              >

                <Edit3 size={17} />

                Edit Medication

              </button>


              <button
                type="button"
                onClick={handleArchive}
                disabled={archiving}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-red-200
                  bg-red-50
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-red-700
                  hover:bg-red-100
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >

                <Archive size={17} />

                {archiving
                  ? "Archiving..."
                  : "Archive Medication"}

              </button>

            </div>

          )}

        </div>

      </div>


      {/* SUCCESS */}

      {saved && (

        <div
          className="
            flex
            items-center
            gap-3
            rounded-xl
            border
            border-green-200
            bg-green-50
            px-4
            py-3
            text-sm
            font-medium
            text-green-700
          "
        >

          <CheckCircle2 size={18} />

          Medication details saved successfully.

        </div>

      )}


      {/* ERROR */}

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


      {/* PATIENT / OWNER CONTEXT */}

      <div
        className="
          grid
          gap-5
          md:grid-cols-2
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
                h-10
                w-10
                place-items-center
                rounded-xl
                bg-teal-50
                text-teal-600
              "
            >

              <PawPrint size={20} />

            </div>


            <div>

              <p
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-slate-400
                "
              >

                Patient

              </p>


              <p
                className="
                  mt-1
                  font-semibold
                  text-slate-900
                "
              >

                {patient?.name ||
                  "Unknown Patient"}

              </p>


              {patient && (

                <p
                  className="
                    mt-1
                    text-sm
                    text-slate-500
                  "
                >

                  {patient.species}

                  {patient.breed
                    ? ` • ${patient.breed}`
                    : ""}

                </p>

              )}

            </div>

          </div>

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
                h-10
                w-10
                place-items-center
                rounded-xl
                bg-slate-100
                text-slate-600
              "
            >

              <User size={20} />

            </div>


            <div>

              <p
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-slate-400
                "
              >

                Owner

              </p>


              <p
                className="
                  mt-1
                  font-semibold
                  text-slate-900
                "
              >

                {client
                  ? `${client.firstName} ${client.lastName}`
                  : "Unknown Owner"}

              </p>


              {client?.phone && (

                <p
                  className="
                    mt-1
                    text-sm
                    text-slate-500
                  "
                >

                  {client.phone}

                </p>

              )}

            </div>

          </div>

        </div>

      </div>


      {/* MEDICATION DETAILS */}

      {editing ? (

        <form
          onSubmit={handleSave}
          className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm
            sm:p-6
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
              gap-4
              border-b
              border-slate-200
              pb-5
            "
          >

            <div>

              <h2
                className="
                  text-lg
                  font-semibold
                  text-slate-900
                "
              >

                Edit Medication

              </h2>


              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                "
              >

                Update the medication record.

              </p>

            </div>

          </div>


          <div
            className="
              mt-6
              grid
              gap-5
              sm:grid-cols-2
            "
          >

            <div>

              <label
                htmlFor="detail-medicine-name"
                className="
                  text-sm
                  font-medium
                  text-slate-700
                "
              >

                Medicine Name *

              </label>


              <input
                id="detail-medicine-name"
                value={form.medicineName}
                onChange={event =>
                  updateField(
                    "medicineName",
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


            <div>

              <label
                htmlFor="detail-medicine-category"
                className="
                  text-sm
                  font-medium
                  text-slate-700
                "
              >

                Category

              </label>


              <select
                id="detail-medicine-category"
                value={form.medicineCategory}
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


            <div>

              <label
                htmlFor="detail-quantity"
                className="
                  text-sm
                  font-medium
                  text-slate-700
                "
              >

                Quantity *

              </label>


              <input
                id="detail-quantity"
                value={form.quantity}
                onChange={event =>
                  updateField(
                    "quantity",
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


            <div>

              <label
                htmlFor="detail-unit"
                className="
                  text-sm
                  font-medium
                  text-slate-700
                "
              >

                Unit *

              </label>


              <input
                id="detail-unit"
                value={form.unit}
                onChange={event =>
                  updateField(
                    "unit",
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


            <div>

              <label
                htmlFor="detail-batch"
                className="
                  text-sm
                  font-medium
                  text-slate-700
                "
              >

                Batch Number

              </label>


              <input
                id="detail-batch"
                value={form.batchNumber}
                onChange={event =>
                  updateField(
                    "batchNumber",
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


            <div>

              <label
                htmlFor="detail-date"
                className="
                  text-sm
                  font-medium
                  text-slate-700
                "
              >

                Prescribed Date *

              </label>


              <input
                id="detail-date"
                type="date"
                value={form.prescribedDate}
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


            <div className="sm:col-span-2">

              <label
                htmlFor="detail-withdrawal"
                className="
                  text-sm
                  font-medium
                  text-slate-700
                "
              >

                Withdrawal Period

              </label>


              <input
                id="detail-withdrawal"
                value={form.withdrawalPeriod}
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


            <div className="sm:col-span-2">

              <label
                htmlFor="detail-instructions"
                className="
                  text-sm
                  font-medium
                  text-slate-700
                "
              >

                Instructions

              </label>


              <textarea
                id="detail-instructions"
                value={form.instructions}
                onChange={event =>
                  updateField(
                    "instructions",
                    event.target.value
                  )
                }
                rows={5}
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


          <div
            className="
              mt-6
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
              onClick={cancelEditing}
              disabled={saving}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
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

              <X size={17} />

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

                  Save Changes

                </>

              )}

            </button>

          </div>

        </form>

      ) : (

        <div
          className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm
            sm:p-6
          "
        >

          <div
            className="
              flex
              flex-col
              gap-3
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            <div>

              <h2
                className="
                  text-lg
                  font-semibold
                  text-slate-900
                "
              >

                Medication Details

              </h2>


              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                "
              >

                Full prescribing and treatment
                information.

              </p>

            </div>


            <span
              className="
                inline-flex
                w-fit
                rounded-full
                bg-teal-50
                px-3
                py-1.5
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
              mt-6
              grid
              gap-5
              sm:grid-cols-2
              lg:grid-cols-3
            "
          >

            <DetailItem
              label="Medicine"
              value={
                medicine.medicineName
              }
            />


            <DetailItem
              label="Quantity"
              value={`${medicine.quantity} ${medicine.unit}`}
            />


            <DetailItem
              label="Prescribed Date"
              value={formatDate(
                medicine.prescribedDate
              )}
              icon={
                <CalendarDays size={16} />
              }
            />


            <DetailItem
              label="Batch Number"
              value={
                medicine.batchNumber ||
                "Not recorded"
              }
            />


            <DetailItem
              label="Withdrawal Period"
              value={
                medicine.withdrawalPeriod ||
                "Not recorded"
              }
            />


            <DetailItem
              label="Prescribing Vet"
              value={
                prescribingVet
                  ? `Dr. ${prescribingVet.firstName} ${prescribingVet.lastName}`
                  : "Unknown Vet"
              }
            />

          </div>


          <div
            className="
              mt-6
              rounded-xl
              bg-slate-50
              p-5
            "
          >

            <div
              className="
                flex
                items-center
                gap-2
                text-sm
                font-semibold
                text-slate-700
              "
            >

              <FileText size={17} />

              Instructions

            </div>


            <p
              className="
                mt-3
                whitespace-pre-wrap
                text-sm
                leading-6
                text-slate-700
              "
            >

              {medicine.instructions ||
                "No instructions recorded."}

            </p>

          </div>

        </div>

      )}

    </div>

  );

}


interface DetailItemProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
}


function DetailItem({
  label,
  value,
  icon
}: DetailItemProps) {

  return (

    <div
      className="
        rounded-xl
        border
        border-slate-100
        bg-slate-50
        p-4
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

        {label}

      </p>


      <p
        className="
          mt-2
          flex
          items-center
          gap-2
          break-words
          text-sm
          font-semibold
          text-slate-800
        "
      >

        {icon && (
          <span className="text-slate-400">
            {icon}
          </span>
        )}

        {value}

      </p>

    </div>

  );

}
