import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, ShieldCheck, User, Building2 } from "lucide-react";
import { useAppState } from "../lib/AppState";

export function StaffProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profiles } = useAppState();

  const staff = profiles.find((item) => item.id === id);

  if (!staff) {
    return (
      <div className="rounded-2xl border bg-white p-8 text-slate-600">
        Staff member not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <div className="rounded-2xl border border-slate-200 bg-white p-8">
        <h1 className="text-3xl font-bold text-slate-900">
          {staff.firstName || staff.first_name} {staff.lastName || staff.last_name}
        </h1>

        <div className="mt-6 space-y-4">
          <p className="flex items-center gap-3 text-slate-600">
            <Mail size={18} /> {staff.email}
          </p>

          <p className="flex items-center gap-3 text-slate-600">
            <User size={18} /> Role: Veterinarian
          </p>

          <p className="flex items-center gap-3 text-slate-600">
            <ShieldCheck size={18} />
            Status:
            <span className={staff.isActive ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
              {staff.isActive ? "Active" : "Deactivated"}
            </span>
          </p>

          <p className="flex items-center gap-3 text-slate-600">
            <Building2 size={18} />
            Practice ID: {staff.practiceId || "-"}
          </p>
        </div>
      </div>
    </div>
  );
}
