import {
  useEffect,
  useState
} from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import {
  ArrowLeft,
  Save,
  PawPrint,
  User,
  CalendarDays,
  Scale,
  Microchip,
  Palette,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

import {
  useAppState
} from "../lib/AppState";

import {
  useToast
} from "../lib/ToastContext";


type Sex = "Male" | "Female" | "Unknown";


interface FormState {
  name: string;
  species: string;
  breed: string;
  sex: Sex;
  neutered: boolean;
  dateOfBirth: string;
  microchipNumber: string;
  colour: string;
  weightKg: string;
  clientId: string;
}


export function EditPatientPage() {

  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  const {
    patients,
    clients,
    updatePatient
  } = useAppState();


  const {
    showToast
  } = useToast();


  const patient = patients.find(
    item => item.id === id
  );


  const [form, setForm] = useState<FormState>({
    name: "",
    species: "",
    breed: "",
    sex: "Unknown",
    neutered: false,
    dateOfBirth: "",
    microchipNumber: "",
    colour: "",
    weightKg: "",
    clientId: ""
  });


  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});


  const [saving, setSaving] = useState(false);

  const [saved, setSaved] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");


  /*
   * Load the patient into the form once the patient
   * is available from AppState.
   */
  useEffect(() => {

    if (!patient) {
      return;
    }


    setForm({
      name: patient.name || "",
      species: patient.species || "",
      breed: patient.breed || "",
      sex: patient.sex || "Unknown",
      neutered: Boolean(patient.neutered),
      dateOfBirth: patient.dateOfBirth || "",
      microchipNumber: patient.microchipNumber || "",
      colour: patient.colour || "",
      weightKg:
        patient.weightKg !== undefined &&
        patient.weightKg !== null
          ? String(patient.weightKg)
          : "",
      clientId: patient.clientId || ""
    });

  }, [patient]);


  function updateField<K extends keyof FormState>(
    field: K,
    value: FormState[K]
  ) {

    setForm(prev => ({
      ...prev,
      [field]: value
    }));


    setErrors(prev => ({
      ...prev,
      [field]: ""
    }));


    setSaved(false);
    setErrorMessage("");
  }


  function validateForm() {

    const nextErrors: Partial<
      Record<keyof FormState, string>
    > = {};


    if (!form.name.trim()) {
      nextErrors.name = "Patient name is required.";
    }


    if (!form.species.trim()) {
      nextErrors.species = "Species is required.";
    }


    if (!form.clientId) {
      nextErrors.clientId = "Please select an owner.";
    }


    if (form.weightKg.trim()) {

      const weight = Number(form.weightKg);

      if (
        Number.isNaN(weight) ||
        weight < 0
      ) {
        nextErrors.weightKg =
          "Enter a valid weight.";
      }
    }


    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }


  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();


    if (!id || !patient) {
      setErrorMessage(
        "Patient record could not be found."
      );

      showToast(
        "Patient record could not be found.",
        "error"
      );

      return;
    }


    if (!validateForm()) {
      return;
    }


    setSaving(true);
    setSaved(false);
    setErrorMessage("");


    try {

      const parsedWeight =
        form.weightKg.trim() === ""
          ? 0
          : Number(form.weightKg);


      await updatePatient(
        patient.id,
        {
          name: form.name.trim(),
          species: form.species.trim(),
          breed: form.breed.trim(),
          sex: form.sex,
          neutered: form.neutered,
          dateOfBirth:
            form.dateOfBirth || "",
          microchipNumber:
            form.microchipNumber.trim() ||
            undefined,
          colour:
            form.colour.trim() ||
            undefined,
          weightKg: parsedWeight,
          clientId: form.clientId
        }
      );


      setSaved(true);

      showToast(
        "Patient updated successfully.",
        "success"
      );


      /*
       * Keep the user on this page briefly so they can
       * clearly see that the save succeeded.
       */
      window.setTimeout(() => {

        navigate(
          `/patients/${patient.id}`
        );

      }, 900);

    } catch (error) {

      console.error(
        "UPDATE PATIENT ERROR",
        error
      );


      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to save patient changes."
      );

      showToast(
        "Unable to update patient.",
        "error"
      );

    } finally {

      setSaving(false);

    }
  }


  function handleCancel() {

    if (patient) {

      navigate(
        `/patients/${patient.id}`
      );

      return;
    }


    navigate("/patients");
  }


  if (!id) {

    return (

      <div className="space-y-6">

        <div
          className="
            rounded-2xl
            border
            border-red-200
            bg-red-50
            p-6
            text-red-700
          "
        >

          Patient ID is missing.

        </div>

        <button
          type="button"
          onClick={() => navigate("/patients")}
          className="
            inline-flex
            items-center
            gap-2
            rounded-xl
            bg-teal-600
            px-4
            py-2.5
            font-semibold
            text-white
            hover:bg-teal-700
          "
        >

          <ArrowLeft size={17} />

          Back to Patients

        </button>

      </div>

    );
  }


  if (!patient) {

    return (

      <div className="space-y-6">

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

            <PawPrint size={26} />

          </div>


          <h1
            className="
              mt-4
              text-xl
              font-bold
              text-slate-900
            "
          >

            Patient not found

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

            This patient may have been removed,
            archived, or is not available in the
            current practice.

          </p>


          <button
            type="button"
            onClick={() => navigate("/patients")}
            className="
              mt-6
              inline-flex
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

            <ArrowLeft size={17} />

            Back to Patients

          </button>

        </div>

      </div>

    );
  }


  return (

    <div className="space-y-8">

      {/* HEADER */}

      <div
        className="
          flex
          flex-col
          gap-4
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >

        <div>

          <button
            type="button"
            onClick={handleCancel}
            className="
              mb-4
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

            Back to Patient

          </button>


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
                shrink-0
                place-items-center
                rounded-xl
                bg-teal-50
                text-teal-600
              "
            >

              <PawPrint size={24} />

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

                Edit Patient

              </h1>


              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                "
              >

                Update {patient.name}'s clinical
                and identification details.

              </p>

            </div>

          </div>

        </div>


        <div
          className="
            hidden
            items-center
            gap-2
            rounded-full
            bg-slate-100
            px-3
            py-1.5
            text-xs
            font-medium
            text-slate-600
            sm:flex
          "
        >

          <span
            className="
              h-2
              w-2
              rounded-full
              bg-green-500
            "
          />

          Existing patient record

        </div>

      </div>


      {/* ERROR */}

      {errorMessage && (

        <div
          className="
            flex
            items-start
            gap-3
            rounded-xl
            border
            border-red-200
            bg-red-50
            p-4
            text-sm
            text-red-700
          "
        >

          <AlertCircle
            size={19}
            className="mt-0.5 shrink-0"
          />

          <div>

            <p className="font-semibold">
              Unable to save changes
            </p>

            <p className="mt-1">
              {errorMessage}
            </p>

          </div>

        </div>

      )}


      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        {/* BASIC INFORMATION */}

        <section
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

              <h2
                className="
                  font-semibold
                  text-slate-900
                "
              >

                Patient Information

              </h2>


              <p
                className="
                  text-sm
                  text-slate-500
                "
              >

                Core details about the animal.

              </p>

            </div>

          </div>


          <div
            className="
              mt-6
              grid
              gap-5
              md:grid-cols-2
            "
          >

            {/* NAME */}

            <div>

              <label
                htmlFor="patient-name"
                className="
                  text-sm
                  font-medium
                  text-slate-700
                "
              >

                Patient Name
                <span className="text-red-500">
                  {" "}*
                </span>

              </label>


              <input
                id="patient-name"
                type="text"
                value={form.name}
                onChange={event =>
                  updateField(
                    "name",
                    event.target.value
                  )
                }
                className={`
                  mt-2
                  w-full
                  rounded-xl
                  border
                  bg-white
                  px-4
                  py-3
                  text-sm
                  text-slate-900
                  outline-none
                  transition
                  ${
                    errors.name
                      ? "border-red-300 focus:border-red-500"
                      : "border-slate-200 focus:border-teal-500"
                  }
                `}
              />


              {errors.name && (

                <p
                  className="
                    mt-1.5
                    text-xs
                    text-red-600
                  "
                >

                  {errors.name}

                </p>

              )}

            </div>


            {/* OWNER */}

            <div>

              <label
                htmlFor="patient-owner"
                className="
                  text-sm
                  font-medium
                  text-slate-700
                "
              >

                Owner
                <span className="text-red-500">
                  {" "}*
                </span>

              </label>


              <div className="relative mt-2">

                <User
                  size={17}
                  className="
                    pointer-events-none
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                />


                <select
                  id="patient-owner"
                  value={form.clientId}
                  onChange={event =>
                    updateField(
                      "clientId",
                      event.target.value
                    )
                  }
                  className={`
                    w-full
                    appearance-none
                    rounded-xl
                    border
                    bg-white
                    py-3
                    pl-10
                    pr-4
                    text-sm
                    text-slate-900
                    outline-none
                    ${
                      errors.clientId
                        ? "border-red-300 focus:border-red-500"
                        : "border-slate-200 focus:border-teal-500"
                    }
                  `}
                >

                  <option value="">
                    Select owner
                  </option>


                  {clients.map(client => (

                    <option
                      key={client.id}
                      value={client.id}
                    >

                      {client.firstName}{" "}
                      {client.lastName}

                    </option>

                  ))}

                </select>

              </div>


              {errors.clientId && (

                <p
                  className="
                    mt-1.5
                    text-xs
                    text-red-600
                  "
                >

                  {errors.clientId}

                </p>

              )}

            </div>


            {/* SPECIES */}

            <div>

              <label
                htmlFor="patient-species"
                className="
                  text-sm
                  font-medium
                  text-slate-700
                "
              >

                Species
                <span className="text-red-500">
                  {" "}*
                </span>

              </label>


              <input
                id="patient-species"
                type="text"
                value={form.species}
                onChange={event =>
                  updateField(
                    "species",
                    event.target.value
                  )
                }
                placeholder="e.g. Dog, Cat, Rabbit"
                className={`
                  mt-2
                  w-full
                  rounded-xl
                  border
                  px-4
                  py-3
                  text-sm
                  outline-none
                  ${
                    errors.species
                      ? "border-red-300 focus:border-red-500"
                      : "border-slate-200 focus:border-teal-500"
                  }
                `}
              />


              {errors.species && (

                <p
                  className="
                    mt-1.5
                    text-xs
                    text-red-600
                  "
                >

                  {errors.species}

                </p>

              )}

            </div>


            {/* BREED */}

            <div>

              <label
                htmlFor="patient-breed"
                className="
                  text-sm
                  font-medium
                  text-slate-700
                "
              >

                Breed

              </label>


              <input
                id="patient-breed"
                type="text"
                value={form.breed}
                onChange={event =>
                  updateField(
                    "breed",
                    event.target.value
                  )
                }
                placeholder="e.g. Labrador"
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

          </div>

        </section>


        {/* CLINICAL DETAILS */}

        <section
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

              <Scale size={20} />

            </div>


            <div>

              <h2
                className="
                  font-semibold
                  text-slate-900
                "
              >

                Clinical Details

              </h2>


              <p
                className="
                  text-sm
                  text-slate-500
                "
              >

                Physical and identification
                information.

              </p>

            </div>

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

            {/* SEX */}

            <div>

              <label
                htmlFor="patient-sex"
                className="
                  text-sm
                  font-medium
                  text-slate-700
                "
              >

                Sex

              </label>


              <select
                id="patient-sex"
                value={form.sex}
                onChange={event =>
                  updateField(
                    "sex",
                    event.target.value as Sex
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

                <option value="Unknown">
                  Unknown
                </option>

                <option value="Male">
                  Male
                </option>

                <option value="Female">
                  Female
                </option>

              </select>

            </div>


            {/* DATE OF BIRTH */}

            <div>

              <label
                htmlFor="patient-dob"
                className="
                  text-sm
                  font-medium
                  text-slate-700
                "
              >

                Date of Birth

              </label>


              <div className="relative mt-2">

                <CalendarDays
                  size={17}
                  className="
                    pointer-events-none
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                />


                <input
                  id="patient-dob"
                  type="date"
                  value={form.dateOfBirth}
                  onChange={event =>
                    updateField(
                      "dateOfBirth",
                      event.target.value
                    )
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    py-3
                    pl-10
                    pr-4
                    text-sm
                    outline-none
                    focus:border-teal-500
                  "
                />

              </div>

            </div>


            {/* WEIGHT */}

            <div>

              <label
                htmlFor="patient-weight"
                className="
                  text-sm
                  font-medium
                  text-slate-700
                "
              >

                Weight (kg)

              </label>


              <div className="relative mt-2">

                <Scale
                  size={17}
                  className="
                    pointer-events-none
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                />


                <input
                  id="patient-weight"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.weightKg}
                  onChange={event =>
                    updateField(
                      "weightKg",
                      event.target.value
                    )
                  }
                  placeholder="0.00"
                  className={`
                    w-full
                    rounded-xl
                    border
                    py-3
                    pl-10
                    pr-4
                    text-sm
                    outline-none
                    ${
                      errors.weightKg
                        ? "border-red-300 focus:border-red-500"
                        : "border-slate-200 focus:border-teal-500"
                    }
                  `}
                />

              </div>


              {errors.weightKg && (

                <p
                  className="
                    mt-1.5
                    text-xs
                    text-red-600
                  "
                >

                  {errors.weightKg}

                </p>

              )}

            </div>


            {/* COLOUR */}

            <div>

              <label
                htmlFor="patient-colour"
                className="
                  text-sm
                  font-medium
                  text-slate-700
                "
              >

                Colour

              </label>


              <div className="relative mt-2">

                <Palette
                  size={17}
                  className="
                    pointer-events-none
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                />


                <input
                  id="patient-colour"
                  type="text"
                  value={form.colour}
                  onChange={event =>
                    updateField(
                      "colour",
                      event.target.value
                    )
                  }
                  placeholder="e.g. Black and white"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    py-3
                    pl-10
                    pr-4
                    text-sm
                    outline-none
                    focus:border-teal-500
                  "
                />

              </div>

            </div>


            {/* MICROCHIP */}

            <div className="sm:col-span-2">

              <label
                htmlFor="patient-microchip"
                className="
                  text-sm
                  font-medium
                  text-slate-700
                "
              >

                Microchip Number

              </label>


              <div className="relative mt-2">

                <Microchip
                  size={17}
                  className="
                    pointer-events-none
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                />


                <input
                  id="patient-microchip"
                  type="text"
                  value={form.microchipNumber}
                  onChange={event =>
                    updateField(
                      "microchipNumber",
                      event.target.value
                    )
                  }
                  placeholder="Enter microchip number"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    py-3
                    pl-10
                    pr-4
                    text-sm
                    outline-none
                    focus:border-teal-500
                  "
                />

              </div>

            </div>


            {/* NEUTERED */}

            <div
              className="
                flex
                items-end
              "
            >

              <label
                className="
                  flex
                  w-full
                  cursor-pointer
                  items-center
                  justify-between
                  gap-4
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  px-4
                  py-3
                "
              >

                <div>

                  <p
                    className="
                      text-sm
                      font-medium
                      text-slate-800
                    "
                  >

                    Neutered / Spayed

                  </p>


                  <p
                    className="
                      mt-0.5
                      text-xs
                      text-slate-500
                    "
                  >

                    Mark if the procedure has
                    been completed.

                  </p>

                </div>


                <input
                  type="checkbox"
                  checked={form.neutered}
                  onChange={event =>
                    updateField(
                      "neutered",
                      event.target.checked
                    )
                  }
                  className="
                    h-5
                    w-5
                    shrink-0
                    accent-teal-600
                  "
                />

              </label>

            </div>

          </div>

        </section>


        {/* ACTION BAR */}

        <div
          className="
            sticky
            bottom-4
            z-20
            rounded-2xl
            border
            border-slate-200
            bg-white/95
            p-3
            shadow-lg
            backdrop-blur
            sm:p-4
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

            <div
              className="
                flex
                items-center
                gap-2
                text-sm
              "
            >

              {saved ? (

                <>
                  <CheckCircle2
                    size={18}
                    className="text-green-600"
                  />

                  <span
                    className="
                      font-medium
                      text-green-700
                    "
                  >

                    Patient details saved successfully.

                  </span>
                </>

              ) : (

                <span
                  className="
                    text-slate-500
                  "
                >

                  Changes will update the patient
                  record.

                </span>

              )}

            </div>


            <div
              className="
                flex
                w-full
                flex-col-reverse
                gap-3
                sm:w-auto
                sm:flex-row
              "
            >

              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="
                  w-full
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
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  sm:w-auto
                "
              >

                Cancel

              </button>


              <button
                type="submit"
                disabled={saving}
                className="
                  inline-flex
                  w-full
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
                  transition
                  hover:bg-teal-700
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  sm:w-auto
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

                ) : saved ? (

                  <>
                    <CheckCircle2 size={18} />

                    Saved

                  </>

                ) : (

                  <>
                    <Save size={18} />

                    Save Changes

                  </>

                )}

              </button>

            </div>

          </div>

        </div>

      </form>

    </div>

  );

}
