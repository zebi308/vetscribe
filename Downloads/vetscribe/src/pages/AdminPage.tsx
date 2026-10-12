import { useState } from "react";
import { useAppState } from "../lib/AppState";
import {
  Building2,
  Users,
  CreditCard,
  Activity,
  ShieldCheck,
  MoreHorizontal,
  CheckCircle2,
  AlertCircle,
  Trash2,
  RotateCcw,
  Search,
  FileText,
} from "lucide-react";

export function AdminPage() {
  const [userSearch, setUserSearch] = useState("");
  const [selectedPractice, setSelectedPractice] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "client" | "patient";
    id: string;
  } | null>(null);

  const {
    clients,
    patients,
    restoreClient,
    restorePatient,
    permanentDeleteClient,
    permanentDeletePatient,
    profiles,
    updateUserRole,
    toggleUserStatus,
    auditLogs,
    currentUser,
    practices,
    subscriptions,
    aiUsage,
  } = useAppState();

  const isSuperAdmin = currentUser?.role === "super_admin";

  const filteredProfiles = profiles?.filter((profile: any) => {
    const term = userSearch.toLowerCase();
    return (
      !term ||
      profile.email?.toLowerCase().includes(term) ||
      profile.fullName?.toLowerCase().includes(term) ||
      profile.role?.toLowerCase().includes(term)
    );
  });

  const countUsersForPractice = (practiceId: any) =>
    profiles?.filter(
      (p: any) => p.practiceId === practiceId || p.practice_id === practiceId
    ).length || 0;

  async function handlePermanentDelete() {
    if (!deleteTarget) return;

    try {
      if (deleteTarget.type === "patient") {
        await permanentDeletePatient(deleteTarget.id);
      } else {
        await permanentDeleteClient(deleteTarget.id);
      }
    } finally {
      setDeleteTarget(null);
    }
  }

  const deletedPatients = patients.filter((patient: any) => patient.isDeleted);
  const deletedClients = clients.filter((client: any) => client.isDeleted);

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Super Admin Dashboard
        </h1>
        <p className="mt-2 text-slate-500">
          Manage VetScribe practices, subscriptions and platform activity.
        </p>
      </div>

      {/* STATS */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-teal-50 text-teal-600">
              <Building2 size={22} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Practices</p>
              <p className="text-3xl font-bold">124</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-600">
              <Users size={22} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Users</p>
              <p className="text-3xl font-bold">846</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-green-50 text-green-600">
              <CreditCard size={22} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Subscriptions</p>
              <p className="text-3xl font-bold">118</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-purple-50 text-purple-600">
              <Activity size={22} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Monthly Activity</p>
              <p className="text-3xl font-bold">24k</p>
            </div>
          </div>
        </div>
      </div>

      {/* PLATFORM STATUS */}
      <div className="rounded-2xl bg-slate-900 p-6 text-white">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-teal-400" />
          <h2 className="text-xl font-semibold">Platform Status</h2>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-white/10 p-4">
            <p className="text-sm text-slate-300">API Status</p>
            <p className="mt-2 font-semibold text-green-400">Operational</p>
          </div>

          <div className="rounded-xl bg-white/10 p-4">
            <p className="text-sm text-slate-300">AI Processing</p>
            <p className="mt-2 font-semibold text-green-400">Running</p>
          </div>

          <div className="rounded-xl bg-white/10 p-4">
            <p className="text-sm text-slate-300">Security</p>
            <p className="mt-2 font-semibold text-green-400">Protected</p>
          </div>
        </div>
      </div>

      {/* PRACTICES TABLE - Ready for database practice management integration */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b p-6">
          <h2 className="text-xl font-semibold">Registered Practices</h2>
        </div>

        <div className="divide-y">
          {practices?.map((practice: any) => (
            <div
              key={practice.id ?? practice.name}
              onClick={() => setSelectedPractice(practice)}
              className="flex cursor-pointer flex-col gap-4 p-6 hover:bg-slate-50 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <h3 className="font-semibold text-slate-900">
                  {practice.name}
                </h3>
                <p className="text-sm text-slate-500">{practice.email || ""}</p>
              </div>

              <div className="flex items-center gap-5">
                <div>
                  <p className="text-sm text-slate-500">Plan</p>
                  <p className="font-medium">
                    {subscriptions?.find(
                      (s: any) => s.practice_id === practice.id
                    )?.status || "No Subscription"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Users</p>
                  <p className="font-medium">
                    {countUsersForPractice(practice.id)}
                  </p>
                </div>

                <span
                  className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                    practice.status === "Active"
                      ? "bg-green-50 text-green-700"
                      : "bg-yellow-50 text-yellow-700"
                  }`}
                >
                  {practice.status === "Active" ? (
                    <CheckCircle2 size={13} />
                  ) : (
                    <AlertCircle size={13} />
                  )}
                  {practice.status ?? "Unknown"}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPractice(practice);
                  }}
                  className="rounded-lg p-2 hover:bg-slate-100"
                >
                  <MoreHorizontal size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PRACTICE DETAIL PANEL */}
      {selectedPractice && isSuperAdmin && (
        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Practice Details</h2>
            <button
              onClick={() => setSelectedPractice(null)}
              className="text-sm text-slate-500"
            >
              Close
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border p-4">
              <p className="text-sm text-slate-500">Clinic</p>
              <p className="font-semibold">{selectedPractice.name}</p>
              <p className="text-sm">{selectedPractice.email}</p>
            </div>

            <div className="rounded-xl border p-4">
              <p className="text-sm text-slate-500">Users</p>
              <p className="font-semibold">
                {countUsersForPractice(selectedPractice.id)}
              </p>
            </div>

            <div className="rounded-xl border p-4">
              <p className="text-sm text-slate-500">Subscription</p>
              <p className="font-semibold">
                {subscriptions?.find(
                  (s: any) => s.practice_id === selectedPractice.id
                )?.status || "No subscription"}
              </p>
            </div>

            <div className="rounded-xl border p-4">
              <p className="text-sm text-slate-500">AI Usage</p>
              <p className="font-semibold">
                {aiUsage?.filter(
                  (a: any) => a.practice_id === selectedPractice.id
                ).length || 0}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* USER MANAGEMENT */}
      {isSuperAdmin && (
        <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <Users className="text-blue-600" />
            <h2 className="text-xl font-semibold">User Management</h2>
          </div>

          <div className="flex items-center gap-3 rounded-xl border px-4 py-3">
            <Search size={18} />
            <input
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="Search users..."
              className="w-full outline-none"
            />
          </div>

          <div className="space-y-4">
            {filteredProfiles?.map((profile: any) => (
              <div
                key={profile.id}
                className="flex flex-col gap-4 rounded-xl border p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-semibold">
                    {profile.fullName || profile.email || "User"}
                  </p>
                  <p className="text-sm text-slate-500">{profile.email}</p>
                  <span
                    className={
                      (profile.isActive ?? true)
                        ? "text-xs text-green-700"
                        : "text-xs text-red-700"
                    }
                  >
                    {(profile.isActive ?? true) ? "Active" : "Disabled"}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={profile.role}
                    onChange={(e) => updateUserRole(profile.id, e.target.value)}
                    className="rounded-lg border px-3 py-2 text-sm"
                  >
                    <option value="vet">Veterinarian</option>
                    <option value="practice_manager">Practice Manager</option>
                    <option value="super_admin">Super Admin</option>
                  </select>

                  <button
                    onClick={() =>
                      toggleUserStatus(profile.id, !(profile.isActive ?? true))
                    }
                    className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white"
                  >
                    {(profile.isActive ?? true) ? "Disable" : "Activate"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBSCRIPTION MANAGEMENT */}
      {isSuperAdmin && (
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold">Subscription Overview</h2>

          {subscriptions?.slice(0, 20).map((subscription: any) => (
            <div key={subscription.id} className="rounded-xl border p-4">
              <p className="font-medium">
                Practice ID: {subscription.practice_id}
              </p>
              <p className="text-sm text-slate-500">
                Plan: {subscription.plan_id || "N/A"}
              </p>
              <p className="text-sm text-slate-500">
                Status: {subscription.status}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* AUDIT LOGS */}
      {isSuperAdmin && (
        <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <FileText className="text-purple-600" />
            <h2 className="text-xl font-semibold">Audit Logs</h2>
          </div>

          <div className="space-y-3">
            {auditLogs?.slice(0, 20).map((log: any) => (
              <div
                key={log.id}
                className="flex items-center justify-between rounded-xl border p-4"
              >
                <div>
                  <p className="font-medium">
                    {log.action || log.description || "Activity"}
                  </p>
                  <p className="text-sm text-slate-500">
                    {log.type || "SYSTEM"}
                  </p>
                </div>

                <p className="text-xs text-slate-400">
                  {log.createdAt
                    ? new Date(log.createdAt).toLocaleString()
                    : ""}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DELETED RECORDS */}
      {isSuperAdmin && (
        <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <Trash2 className="text-red-600" />
            <h2 className="text-xl font-semibold">Deleted Records</h2>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Deleted Patients</h3>

            <div className="space-y-3">
              {deletedPatients.length === 0 ? (
                <p className="text-sm text-slate-500">No deleted patients.</p>
              ) : (
                deletedPatients.map((patient: any) => (
                  <div
                    key={patient.id}
                    className="flex items-center justify-between rounded-xl border p-4"
                  >
                    <div>
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-sm text-slate-500">
                        {patient.species}{" "}
                        {patient.breed && `• ${patient.breed}`}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => restorePatient(patient.id)}
                        className="flex items-center gap-2 rounded-lg bg-teal-600 px-3 py-2 text-sm font-semibold text-white"
                      >
                        <RotateCcw size={15} />
                        Restore
                      </button>

                      <button
                        onClick={() =>
                          setDeleteTarget({ type: "patient", id: patient.id })
                        }
                        className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white"
                      >
                        Delete Forever
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Deleted Clients</h3>

            <div className="space-y-3">
              {deletedClients.length === 0 ? (
                <p className="text-sm text-slate-500">No deleted clients.</p>
              ) : (
                deletedClients.map((client: any) => (
                  <div
                    key={client.id}
                    className="flex items-center justify-between rounded-xl border p-4"
                  >
                    <div>
                      <p className="font-medium">
                        {client.firstName} {client.lastName}
                      </p>
                      <p className="text-sm text-slate-500">{client.email}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => restoreClient(client.id)}
                        className="flex items-center gap-2 rounded-lg bg-teal-600 px-3 py-2 text-sm font-semibold text-white"
                      >
                        <RotateCcw size={15} />
                        Restore
                      </button>

                      <button
                        onClick={() =>
                          setDeleteTarget({ type: "client", id: client.id })
                        }
                        className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white"
                      >
                        Delete Forever
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="max-w-md space-y-5 rounded-2xl bg-white p-6">
            <h3 className="text-xl font-bold">Delete Permanently?</h3>

            <p className="text-slate-600">
              This action cannot be undone. The record will be removed
              permanently.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-lg border px-4 py-2"
              >
                Cancel
              </button>

              <button
                onClick={handlePermanentDelete}
                className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white"
              >
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}