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
  User,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

import {
  useAppState
} from "../lib/AppState";

import {
  useToast
} from "../lib/ToastContext";


interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  postcode: string;
  address: string;
}


export function EditClientPage() {

  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();


  const {
    clients,
    updateClient
  } = useAppState();


  const {
    showToast
  } = useToast();



  const client = clients.find(
    item => item.id === id
  );



  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    postcode: "",
    address: ""
  });


  const [saving, setSaving] = useState(false);

  const [saved, setSaved] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");



  useEffect(() => {

    if (!client) {
      return;
    }


    setForm({

      firstName: client.firstName || "",
      lastName: client.lastName || "",
      email: client.email || "",
      phone: client.phone || "",
      postcode: client.postcode || "",
      address: client.address || ""

    });


  }, [client]);





  function updateField<K extends keyof FormState>(
    field: K,
    value: FormState[K]
  ) {

    setForm(prev => ({
      ...prev,
      [field]: value
    }));

    setSaved(false);
    setErrorMessage("");

  }





  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();


    if (!id || !client) {

      setErrorMessage(
        "Client record could not be found."
      );

      return;
    }


    try {

      setSaving(true);

      setSaved(false);


      await updateClient(
        client.id,
        {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          postcode: form.postcode.trim(),
          address: form.address.trim()
        }
      );


      setSaved(true);


      showToast(
        "Client updated successfully.",
        "success"
      );


      window.setTimeout(() => {

        navigate(
          `/dashboard/clients/${client.id}`
        );

      }, 900);



    } catch(error) {


      console.error(
        "UPDATE CLIENT ERROR",
        error
      );


      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to save client changes."
      );


      showToast(
        "Unable to update client.",
        "error"
      );


    } finally {

      setSaving(false);

    }

  }





  function handleCancel(){

    if(client){

      navigate(
        `/dashboard/clients/${client.id}`
      );

      return;

    }

    navigate("/dashboard/clients");

  }





  if(!id){

    return (

      <div className="p-8 text-red-600">
        Client ID is missing.
      </div>

    );

  }





  if(!client){

    return (

      <div className="p-8 text-slate-500">
        Client not found.
      </div>

    );

  }







  return (

    <div className="space-y-8">


      <div className="flex items-center gap-4">

        <button
          type="button"
          onClick={handleCancel}
          className="rounded-xl p-2 hover:bg-slate-100"
        >

          <ArrowLeft size={22}/>

        </button>



        <div>

          <h1 className="text-3xl font-bold text-slate-900">
            Edit Client
          </h1>


          <p className="mt-2 text-slate-500">
            Update {client.firstName} {client.lastName}'s information.
          </p>


        </div>


      </div>






      {errorMessage && (

        <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">

          <AlertCircle size={20}/>

          <p>{errorMessage}</p>

        </div>

      )}






      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >



        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">


          <div className="mb-6 flex items-center gap-3">

            <div className="grid h-10 w-10 place-items-center rounded-xl bg-teal-50 text-teal-600">

              <User size={20}/>

            </div>


            <div>

              <h2 className="font-semibold text-slate-900">
                Client Information
              </h2>


              <p className="text-sm text-slate-500">
                Update owner details.
              </p>

            </div>


          </div>




          <div className="grid gap-5 md:grid-cols-2">


            <input
              value={form.firstName}
              onChange={e => updateField("firstName", e.target.value)}
              placeholder="First Name"
              className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-teal-500"
              required
            />


            <input
              value={form.lastName}
              onChange={e => updateField("lastName", e.target.value)}
              placeholder="Last Name"
              className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-teal-500"
              required
            />



          </div>





          <div className="mt-5 grid gap-5 md:grid-cols-2">


            <input
              value={form.email}
              onChange={e => updateField("email", e.target.value)}
              placeholder="Email"
              className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-teal-500"
            />



            <input
              value={form.phone}
              onChange={e => updateField("phone", e.target.value)}
              placeholder="Phone"
              className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-teal-500"
            />


          </div>





          <div className="mt-5 grid gap-5 md:grid-cols-2">


            <input
              value={form.postcode}
              onChange={e => updateField("postcode", e.target.value)}
              placeholder="Postcode"
              className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-teal-500"
            />



            <input
              value={form.address}
              onChange={e => updateField("address", e.target.value)}
              placeholder="Address"
              className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-teal-500"
            />


          </div>


        </section>






        <div className="flex justify-end gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">


          <button
            type="button"
            onClick={handleCancel}
            disabled={saving}
            className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700"
          >

            Cancel

          </button>




          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-3 font-semibold text-white hover:bg-teal-700"
          >

            {saved ? (
              <>
                <CheckCircle2 size={18}/>
                Saved
              </>
            ) : (
              <>
                <Save size={18}/>
                {saving ? "Saving..." : "Save Changes"}
              </>
            )}

          </button>


        </div>




      </form>


    </div>

  );


}
