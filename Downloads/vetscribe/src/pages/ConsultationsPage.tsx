import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Mic,
  FileText,
  CheckCircle2,
  MoreHorizontal,
  Plus,
  Archive,
  RotateCcw,
} from "lucide-react";
import { useAppState } from "../lib/AppState";

export function ConsultationsPage() {
  const navigate = useNavigate();

  const {
    consultations,
    patients,
    clients,
    archiveConsultation,
    restoreConsultation,
  } = useAppState();

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const consultationList = consultations.map((item) => {
    const patient = patients.find((p) => p.id === item.patientId);
    const client = clients.find((c) => c.id === item.clientId);

    return {
      ...item,
      patientName: patient?.name || "Unknown Patient",
      species: patient?.species || "Unknown",
      owner: client ? `${client.firstName} ${client.lastName}` : "Unknown Owner",
      time: item.consultationDate
        ? new Date(item.consultationDate).toLocaleString()
        : "Unknown date",
    };
  });

  const filteredConsultations = consultationList.filter((item) => {
    const searchMatch =
      item.patientName.toLowerCase().includes(search.toLowerCase()) ||
      item.owner.toLowerCase().includes(search.toLowerCase());

    const filterMatch =
      activeFilter === "All"
        ? item.archived !== true
        : activeFilter === "Archived"
        ? item.archived === true
        : item.archived !== true && item.status === activeFilter.toLowerCase();

    return searchMatch && filterMatch;
  });

  const filters = ["All", "Draft", "Approved", "Archived"];

  async function handleArchive(id: string) {
    const confirmArchive = window.confirm(
      "Archive this consultation? It will be preserved and removed from the active list."
    );

    if (!confirmArchive) {
      return;
    }

    await archiveConsultation(id);
    setMenuOpen(null);
  }

  async function handleRestore(id: string) {
    await restoreConsultation(id);
    setMenuOpen(null);
  }

  return (
    <div className="space-y-8">
      {/* =========================
          HEADER
      ========================= */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Consultations</h1>
          <p className="mt-2 text-slate-500">
            Manage recordings, AI notes and clinical reviews.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/dashboard/consultations/new")}
          className="flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-3 font-semibold text-white transition hover:bg-teal-700"
        >
          <Plus size={18} />
          New Consultation
        </button>
      </div>

      {/* =========================
          SEARCH
      ========================= */}
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
        <Search size={20} className="text-slate-400" />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search patient or owner..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
        />

        {search.length > 0 && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="text-xs font-medium text-slate-400 hover:text-slate-700"
          >
            Clear
          </button>
        )}
      </div>

      {/* =========================
          FILTERS
      ========================= */}
      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              activeFilter === filter
                ? "border-teal-600 bg-teal-600 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-teal-500 hover:text-teal-600"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* =========================
          RESULT COUNT
      ========================= */}
      <div className="text-sm text-slate-500">
        Showing{" "}
        <span className="font-semibold text-slate-800">
          {filteredConsultations.length}
        </span>{" "}
        consultations
      </div>

      {/* =========================
          CONSULTATION LIST
      ========================= */}
      <div className="space-y-4">
        {filteredConsultations.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            {activeFilter === "Archived"
              ? "No archived consultations found."
              : "No consultations found."}
          </div>
        ) : (
          filteredConsultations.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/dashboard/consultations/${item.id}`)}
              className={`relative cursor-pointer rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md ${
                item.archived === true
                  ? "border-slate-300 bg-slate-50"
                  : "border-slate-200"
              }`}
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                {/* =========================
                    LEFT SIDE
                ========================= */}
                <div className="flex items-center gap-4">
                  <div
                    className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${
                      item.archived === true
                        ? "bg-slate-100 text-slate-500"
                        : "bg-teal-50 text-teal-600"
                    }`}
                  >
                    {item.archived === true ? (
                      <Archive size={22} />
                    ) : (
                      <Mic size={22} />
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {item.patientName}
                    </h3>

                    <p className="text-sm text-slate-500">
                      {item.species}
                      {" • "}
                      {item.owner}
                    </p>

                    <p className="mt-2 text-sm text-slate-400">{item.time}</p>
                  </div>
                </div>

                {/* =========================
                    RIGHT SIDE
                ========================= */}
                <div
                  className="flex items-center gap-4"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {/* STATUS */}
                  {item.archived === true ? (
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
                      <Archive size={15} />
                      Archived
                    </span>
                  ) : (
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${
                        item.status === "approved"
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {item.status === "approved" ? (
                        <CheckCircle2 size={15} />
                      ) : (
                        <FileText size={15} />
                      )}
                      {item.status}
                    </span>
                  )}

                  {/* THREE DOT MENU */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(menuOpen === item.id ? null : item.id);
                      }}
                      className="rounded-lg p-2 transition hover:bg-slate-100"
                    >
                      <MoreHorizontal size={20} />
                    </button>

                    {menuOpen === item.id && (
                      <div className="absolute right-0 z-30 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                        {item.archived === true ? (
                          <button
                            type="button"
                            onClick={() => {
                              restoreConsultation(item.id);
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-teal-600 transition hover:bg-teal-50"
                          >
                            <RotateCcw size={16} />
                            Restore Consultation
                          </button>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                setMenuOpen(null);
                                navigate(`/dashboard/consultations/${item.id}`);
                              }}
                              className="block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                            >
                              Open Consultation
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setMenuOpen(null);
                                navigate(`/dashboard/consultations/${item.id}`);
                              }}
                              className="block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                            >
                              Edit Draft
                            </button>

                            {item.status === "draft" && (
                              <button
                                type="button"
                                onClick={() => {
                                  setMenuOpen(null);
                                  navigate(`/dashboard/consultations/${item.id}`);
                                }}
                                className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-teal-600 transition hover:bg-teal-50"
                              >
                                Review & Approve
                              </button>
                            )}

                            <div className="my-2 border-t border-slate-100" />

                            <button
                              type="button"
                              onClick={() => {
                                handleArchive(item.id);
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                            >
                              <Archive size={16} />
                              Archive Consultation
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}