import { useEffect, useState } from "react";
import type {
  BuildingResponse,
  AgencyResponse,
  ContactDemandResponse,
  UserResponse,
  TransactionResponse,
} from "../types/api";
import { fetchBuildingsByAgency, fetchAgencies } from "../services/api";
import { demandApiService } from "../services/demandApiService";
import { buildingApiService } from "../services/buildingApiService";
import { userApiService } from "../services/userApiService";
import { TYPE_LABELS, ZONE_LABELS, STATE_LABELS } from "../types/formattedBuildingUtils";
import { FaPlus, FaTrash, FaBuilding, FaEnvelope, FaChartBar, FaInbox, FaToggleOn, FaToggleOff } from "react-icons/fa6";
import { DemandModal } from "../components/DemandModal";
import { AddBuildingModal } from "../components/AddBuildingModal";
import { transactionApiService } from "../services/transactionsApiService";
import { AddTransactionModal } from "../components/AddtransactionModal";
import type { TransactionPayload } from "../types/utils";

const API_URL = import.meta.env.VITE_IA_API_URL ?? "/ia";

function getCleanName(name: string) {
  return name
    .split("_")
    .join(" ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
async function forecastNextMonths(
  agencyId: string | number,
  months = 3
): Promise<{ month: string; predicted: number }[]> {
  const res = await fetch(
    `${API_URL}/predictions/agency/${agencyId}/forecast?months=${months}`
  );
  if (!res.ok) {
    throw new Error(`Forecast request failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [myAgency, setMyAgency] = useState<AgencyResponse | null>(null);
  const [allAgencies, setAllAgencies] = useState<AgencyResponse[]>([]);
  const [buildings, setBuildings] = useState<BuildingResponse[]>([]);
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [demands, setDemands] = useState<(ContactDemandResponse & { buildingName?: string })[]>([]);
  const [selectedDemand, setSelectedDemand] = useState<
    (ContactDemandResponse & { userInfo?: UserResponse; buildingName?: string }) | null
  >(null);
  const [addOpen, setAddOpen] = useState(false);
  const [addTransactionOpen, setAddTransactionOpen] = useState(false);
  const [filterType, setFilterType] = useState("ALL");
  const [filterZone, setFilterZone] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [forecast, setForecast] = useState<{ month: string; predicted: number }[]>([]);

  const loadData = async (agencyId: number) => {
    const data = await fetchBuildingsByAgency(agencyId);
    setBuildings(data);

    const allDemands: (ContactDemandResponse & { buildingName?: string })[] = [];
    for (const b of data) {
      try {
        const d = await demandApiService.getDemands(b.id.toString());
        allDemands.push(...d.map((demand) => ({ ...demand, buildingName: b.name })));
      } catch {}
    }
    setDemands(allDemands);
  };

  useEffect(() => {
    (async () => {
      try {
        const u = await userApiService.getMe();
        if (!u) return;
        setUser(u);

        const agencies = await fetchAgencies();
        setAllAgencies(agencies);

        const agency = agencies.find((a) => a.id === u.agencyId) ?? null;
        setMyAgency(agency);

        if (agency) await loadData(agency.id);

        const entries: Record<number, BuildingResponse[]> = {};
        await Promise.all(
          agencies.map(async (a) => {
            try {
              entries[a.id] = await fetchBuildingsByAgency(a.id);
            } catch {
              entries[a.id] = [];
            }
          })
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (myAgency === null) return;
    forecastNextMonths(myAgency.id, 6).then(setForecast);
    transactionApiService.getTransactions().then(setTransactions)
  }, [myAgency]);

  const handleDeleteBuilding = async (id: number) => {
    if (!confirm("Supprimer ce bien ? Cette action est irréversible.")) return;
    await buildingApiService.deleteBuilding(id);
    if (myAgency) await loadData(myAgency.id);
  };

  const [togglingId, setTogglingId] = useState<number | null>(null);

  const handleToggleAvailability = async (b: BuildingResponse) => {
    const nextState = b.state === "BUILDING_SOLD" ? "BUILDING_AVAILABLE" : "BUILDING_SOLD";
    setTogglingId(b.id);
    try {
      await buildingApiService.updateBuilding(b.id, { buildingState: nextState });
      if (myAgency) await loadData(myAgency.id);
    } finally {
      setTogglingId(null);
    }
  };

  const handleOpenDemand = async (
    demand: ContactDemandResponse & { buildingName?: string }
  ) => {
    let userInfo: UserResponse | undefined;
    try {
      userInfo = await userApiService.getUserById(demand.userId.toString());
    } catch {}
    setSelectedDemand({ ...demand, userInfo });
  };

  const filteredDemands = demands.filter((d) => {
    const building = buildings.find((b) => b.id === d.buildingId);
    if (!building) return true;
    if (filterType !== "ALL" && building.type !== filterType) return false;
    if (filterZone !== "ALL" && building.zone !== filterZone) return false;
    return true;
  });

  const currentMonthSales = (agencyId:number) => {
    const now = new Date();

    return transactions.filter(trans => {
        const transDate = new Date(trans.date);
        return (
            trans.agencyId === Number(agencyId) &&
            transDate.getMonth() === now.getMonth() &&
            transDate.getFullYear() === now.getFullYear()
        );
    }).length;
  }

  var soldThisMonth = 0;
  if (myAgency != null) soldThisMonth = currentMonthSales(myAgency.id);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 animate-pulse space-y-6">
        <div className="h-8 bg-slate-200 rounded w-1/3" />
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-200 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

      {selectedDemand && (
        <DemandModal demand={selectedDemand} onClose={() => setSelectedDemand(null)} />
      )}
      {addOpen && myAgency && (
        <AddBuildingModal
          agencyId={myAgency.id}
          onClose={() => setAddOpen(false)}
          onCreated={() => myAgency && loadData(myAgency.id)}
        />
      )}
      {addTransactionOpen && myAgency && user && (
        <AddTransactionModal
          agencyId={myAgency.id}
          agentId={user.id}
          onClose={() => setAddTransactionOpen(false)}
          onSubmit={async (payload: TransactionPayload) => {
            await transactionApiService.createTransaction(payload);
            const updated = await transactionApiService.getTransactions();
            setTransactions(updated);
          }}
        />
      )}

      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs text-blue-600 font-semibold uppercase tracking-widest mb-1">
            Espace agent
          </p>
          <h1
            className="text-3xl font-bold text-slate-900"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Bonjour, {user?.firstName}
          </h1>
          {myAgency && (
            <p className="text-slate-500 text-sm mt-1">
              {getCleanName(myAgency.name)} - {getCleanName(myAgency.city)}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAddTransactionOpen(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            <FaPlus className="w-3.5 h-3.5" />
            Ajouter une transaction
          </button>
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            <FaPlus className="w-3.5 h-3.5" />
            Ajouter un bien
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Biens en agence</p>
          <p className="text-4xl font-bold text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            {buildings.length}
          </p>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Vendus ce mois</p>
          <p className="text-4xl font-bold text-emerald-600" style={{ fontFamily: "'Playfair Display', serif" }}>
            {soldThisMonth}
          </p>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Demandes reçues</p>
          <p className="text-4xl font-bold text-blue-600" style={{ fontFamily: "'Playfair Display', serif" }}>
            {demands.length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        <div className="lg:col-span-3 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <FaChartBar className="text-blue-500 w-4 h-4" />
            <h2 className="text-sm font-semibold text-slate-700">Prévisions de ventes</h2>
          </div>
          <div className="space-y-4">
            {forecast.map((f) => (
              <div key={f.month} className="flex items-center gap-4">
                <span className="text-sm text-slate-500 w-24 capitalize">{f.month}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-blue-500 h-2.5 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (f.predicted / Math.max(...forecast.map(x => x.predicted), 1)) * 100)}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-slate-700 w-8 text-right">
                  {f.predicted}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-4">
            Projection basée sur le taux de vente actuel de l'agence.
          </p>
        </div>

        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <FaBuilding className="text-slate-400 w-4 h-4" />
            <h2 className="text-sm font-semibold text-slate-700">Ventes du mois par agence</h2>
          </div>
          <div className="space-y-3">
            {allAgencies.map((agency) => {
              const sold = currentMonthSales(agency.id);
              const isMe = agency.id === myAgency?.id;
              return (
                <div
                  key={agency.id}
                  className={`flex items-center justify-between text-sm rounded-xl px-3 py-2 ${
                    isMe ? "bg-blue-50 border border-blue-100" : "bg-slate-50"
                  }`}
                >
                  <span className={`font-medium truncate ${isMe ? "text-blue-700" : "text-slate-700"}`}>
                    {getCleanName(agency.name)}
                    {isMe && <span className="ml-1 text-xs text-blue-400">(vous)</span>}
                  </span>
                  <span className={`font-bold shrink-0 ml-3 ${isMe ? "text-blue-600" : "text-slate-600"}`}>
                    {sold}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <FaBuilding className="text-slate-400 w-4 h-4" />
            <h2 className="text-sm font-semibold text-slate-700">Biens de l'agence</h2>
          </div>
        </div>

        {buildings.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">Aucun bien pour cette agence.</p>
        ) : (
          <div className="divide-y divide-slate-100 max-h-100 overflow-scroll">
            {buildings.map((b) => (
              <div key={b.id} className="flex items-center justify-between py-3 gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{b.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {TYPE_LABELS[b.type] ?? b.type} - {ZONE_LABELS[b.zone] ?? b.zone}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => handleToggleAvailability(b)}
                    disabled={togglingId === b.id}
                    title={b.state === "BUILDING_SOLD" ? "Marquer comme disponible" : "Marquer comme vendu"}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-colors disabled:opacity-50 ${
                      b.state === "BUILDING_SOLD"
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                        : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    }`}
                  >
                    {b.state === "BUILDING_SOLD"
                      ? <FaToggleOn className="w-3.5 h-3.5" />
                      : <FaToggleOff className="w-3.5 h-3.5" />
                    }
                    {STATE_LABELS[b.state] ?? b.state}
                  </button>
                  <p className="text-sm font-bold text-slate-800">
                    {new Intl.NumberFormat("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                      maximumFractionDigits: 0,
                    }).format(b.price)}
                  </p>
                  <button
                    onClick={() => handleDeleteBuilding(b.id)}
                    className="text-slate-300 hover:text-red-500 transition-colors mr-5"
                    aria-label="Supprimer"
                  >
                    <FaTrash className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <FaInbox className="text-slate-400 w-4 h-4" />
            <h2 className="text-sm font-semibold text-slate-700">Demandes de contact</h2>
          </div>
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="text-sm border border-slate-200 rounded-full px-3 py-1.5 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="ALL">Tous types</option>
              {Object.entries(TYPE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <select
              value={filterZone}
              onChange={(e) => setFilterZone(e.target.value)}
              className="text-sm border border-slate-200 rounded-full px-3 py-1.5 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="ALL">Toutes zones</option>
              {Object.entries(ZONE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredDemands.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">Aucune demande pour ces filtres.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredDemands.map((d) => {
              const building = buildings.find((b) => b.id === d.buildingId);
              return (
                <button
                  key={d.id}
                  onClick={() => handleOpenDemand(d)}
                  className="w-full flex items-start gap-4 py-3 text-left hover:bg-slate-50 rounded-xl px-2 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                    <FaEnvelope className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {d.buildingName ?? `Bien #${d.buildingId}`}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">{d.content}</p>
                  </div>
                  {building && (
                    <div className="shrink-0 flex gap-1.5 mt-0.5">
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                        {TYPE_LABELS[building.type] ?? building.type}
                      </span>
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                        {ZONE_LABELS[building.zone] ?? building.zone}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

    </main>
  );
}
