import { useState, useEffect } from "react";
import type { BuildingResponse, BuildingPictureResponse, AgencyResponse } from "../types/api";
import { fetchBuildingsByAgency, fetchBuildingPictures } from "../services/api";
import BuildingCard from "../components/BuildingCard";
import TrendsSection from "../components/TrendsSection";
import { PiHouseSimpleLight } from "react-icons/pi";

interface HomePageProps {
  selectedAgency: AgencyResponse | null;
}

const PAGE_SIZE = 9;

export default function HomePage({ selectedAgency }: HomePageProps) {
  const [buildings, setBuildings] = useState<BuildingResponse[]>([]);
  const [pictures, setPictures] = useState<Record<number, string>>({});
  const [loadingBuildings, setLoadingBuildings] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const [filterType, setFilterType] = useState<string>("ALL");
  const [filterZone, setFilterZone] = useState<string>("ALL");
  const [filterState, setFilterState] = useState<string>("ALL");

  useEffect(() => {
    if (!selectedAgency) return;
    setLoadingBuildings(true);
    setError(null);
    setPage(1);

    fetchBuildingsByAgency(selectedAgency.id)
      .then(async (data) => {
        setBuildings(data);

        const picEntries = await Promise.all(
          data.map(async (b): Promise<[number, string] | null> => {
            try {
              const pics: BuildingPictureResponse[] = await fetchBuildingPictures(b.id);
              return pics.length > 0 ? [b.id, pics[0].path] : null;
            } catch {
              return null;
            }
          })
        );

        const picMap: Record<number, string> = {};
        for (const entry of picEntries) {
          if (entry) picMap[entry[0]] = entry[1];
        }
        setPictures(picMap);
      })
      .catch(() => setError("Impossible de charger les biens. Vérifiez votre connexion."))
      .finally(() => setLoadingBuildings(false));
  }, [selectedAgency]);

  const filtered = buildings.filter((b) => {
    if (filterType !== "ALL" && b.type !== filterType) return false;
    if (filterZone !== "ALL" && b.zone !== filterZone) return false;
    if (filterState !== "ALL" && b.state !== filterState) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const uniqueTypes = ["ALL", ...Array.from(new Set(buildings.map((b) => b.type)))];
  const uniqueZones = ["ALL", ...Array.from(new Set(buildings.map((b) => b.zone)))];
  const uniqueStates = ["ALL", ...Array.from(new Set(buildings.map((b) => b.state)))];

  const TYPE_LABELS: Record<string, string> = {
    ALL: "Tous types",
    APARTMENT: "Appartements",
    HOUSE: "Maisons",
    COMMERCIAL: "Locaux commerciaux",
    GARAGE: "Garages",
    COMPLEX: "Complexes",
    HOTEL: "Hotels",
  };
  const ZONE_LABELS: Record<string, string> = {
    ALL: "Toute zones",
    ZONE_CENTRE: "Centre",
    ZONE_BANLIEUE: "Banlieue",
  };
  const STATE_LABELS: Record<string, string> = {
    ALL: "Tous statuts",
    BUILDING_AVAILABLE: "Disponible",
    BUILDING_SOLD: "Vendu",
  };

  const getCleanName = (name: String) => {
    name = name.split("_").join(" ");
    return name[0].toUpperCase() + name.slice(1).toLowerCase();
  }

  return (
    <main>
      <section className="relative min-h-105 flex items-center bg-slate-900 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center w-full">
          {selectedAgency ? (
            <>
              <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
                {getCleanName(selectedAgency.city)}
              </p>
              <h1
                className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Bienvenue chez <span className="text-blue-400">{getCleanName(selectedAgency.name)}</span>
              </h1>
              <p className="text-slate-400 text-lg max-w-xl mx-auto">
                Découvrez notre sélection de biens immobiliers à {getCleanName(selectedAgency.city)}.
              </p>
              <p className="mt-6 text-slate-500 text-sm">
                {buildings.length > 0 ? `${buildings.length} bien${buildings.length > 1 ? "s" : ""} disponible${buildings.length > 1 ? "s" : ""}` : ""}
              </p>
            </>
          ) : (
            <>
              <h1
                className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Trouvez le bien<br />
                <span className="text-blue-400">qui vous correspond</span>
              </h1>
              <p className="text-slate-400 text-lg max-w-md mx-auto">
                Sélectionnez une agence dans la barre de navigation pour explorer les annonces.
              </p>
            </>
          )}
        </div>
      </section>

      {selectedAgency && (
        <TrendsSection
          buildings={buildings}
          pictures={pictures}
          agencyName={selectedAgency.name}
        />
      )}

      {selectedAgency && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <p className="text-xs text-blue-600 font-semibold uppercase tracking-widest mb-1">Annonces</p>
                <h2
                  className="text-2xl font-bold text-slate-900"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Nos biens disponibles
                </h2>
              </div>

              <div className="flex flex-wrap gap-2">
                <select
                  value={filterType}
                  onChange={(e) => { setFilterType(e.target.value); setPage(1); }}
                  className="text-sm border border-slate-200 rounded-full px-3 py-1.5 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {uniqueTypes.map((t) => (
                    <option key={t} value={t}>{TYPE_LABELS[t] ?? t}</option>
                  ))}
                </select>
                <select
                  value={filterZone}
                  onChange={(e) => { setFilterZone(e.target.value); setPage(1); }}
                  className="text-sm border border-slate-200 rounded-full px-3 py-1.5 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {uniqueZones.map((s) => (
                    <option key={s} value={s}>{ZONE_LABELS[s] ?? s}</option>
                  ))}
                </select>
                <select
                  value={filterState}
                  onChange={(e) => { setFilterState(e.target.value); setPage(1); }}
                  className="text-sm border border-slate-200 rounded-full px-3 py-1.5 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {uniqueStates.map((s) => (
                    <option key={s} value={s}>{STATE_LABELS[s] ?? s}</option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 mb-6 text-sm">
                {error}
              </div>
            )}

            {loadingBuildings && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 animate-pulse">
                    <div className="aspect-4/3 bg-slate-200" />
                    <div className="p-4 space-y-3">
                      <div className="h-3 bg-slate-200 rounded w-1/3" />
                      <div className="h-4 bg-slate-200 rounded w-3/4" />
                      <div className="h-3 bg-slate-100 rounded w-1/2" />
                      <div className="h-5 bg-slate-200 rounded w-1/3 mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loadingBuildings && !error && filtered.length === 0 && (
              <div className="text-center py-20 text-slate-400">
                <PiHouseSimpleLight className="text-slate-400 w-12 h-12 mx-auto mb-4 opacity-30"/>
                <p className="text-sm">Aucun bien ne correspond à vos filtres.</p>
                <button
                  onClick={() => { setFilterType("ALL"); setFilterState("ALL"); }}
                  className="mt-3 text-sm text-blue-600 hover:underline"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}

            {!loadingBuildings && !error && paginated.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginated.map((building) => (
                    <BuildingCard
                      key={building.id}
                      building={building}
                      picturePath={pictures[building.id]}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 text-sm rounded-full border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors"
                    >
                      ← Précédent
                    </button>
                    <span className="text-sm text-slate-500">
                      Page {page} / {totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 text-sm rounded-full border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors"
                    >
                      Suivant →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
