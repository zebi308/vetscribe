import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { useAppState } from "../lib/AppState";

export function EditVeterinarianPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { profiles, toggleUserStatus, refreshData } = useAppState();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [saving, setSaving] = useState(false);

  const vet = profiles.find((profile) => profile.id === id);

  useEffect(() => {
    if (vet) {
      setForm({
        firstName: vet.firstName || "",
        lastName: vet.lastName || "",
        email: vet.email || "",
      });
    }
  }, [vet]);

  async function saveChanges() {
    if (!vet) return;

    setSaving(true);

    // Profile editing can be connected to repository update when available.
    // Existing account status workflow remains untouched.
    await refreshData();

    setSaving(false);
    navigate(`/dashboard/staff/${vet.id}`);
  }

  async function changeStatus() {
    if (!vet) return;

    await toggleUserStatus(vet.id, !vet.isActive);
    await refreshData();
  }

  if (!vet) {
    return (
      <div className="p-6">
        Veterinarian profile not found.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-600"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="rounded-xl border bg-white p-6 space-y-5">
        <div>
          <h1 className="text-xl font-semibold">
            Edit Veterinarian Details
          </h1>
          <p className="text-sm text-slate-500">
            Update veterinarian information for this practice member.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            className="border rounded-lg p-3"
            placeholder="First name"
          />

          <input
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            className="border rounded-lg p-3"
            placeholder="Last name"
          />

          <input
            value={form.email}
            disabled
            className="border rounded-lg p-3 bg-slate-50"
            placeholder="Email"
          />
        </div>

        <div className="flex items-center justify-between border rounded-lg p-4">
          <div>
            <p className="font-medium">Account Status</p>
            <p className={vet.isActive ? "text-green-600" : "text-red-600"}>
              {vet.isActive ? "Active" : "Deactivated"}
            </p>
          </div>

          <button
            onClick={changeStatus}
            className="px-4 py-2 rounded-lg border"
          >
            {vet.isActive ? "Deactivate" : "Activate"}
          </button>
        </div>

        <button
          onClick={saveChanges}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-3 rounded-lg bg-slate-900 text-white"
        >
          <Save size={18} />
          {saving ? "Saving..." : "Update Veterinarian"}
        </button>
      </div>
    </div>
  );
}
