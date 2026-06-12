import { useEffect, useState, useRef } from "react";
import { FaArrowTrendUp, FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import type { BuildingPictureResponse, BuildingResponse, TrendByZoneTypeResponse } from "../types/api";
import BuildingCard from "./BuildingCard";

const PYTHON_API = import.meta.env.VITE_PYTHON_API_URL ?? "http://localhost:5100";

interface TrendsSectionProps {
  buildings: BuildingResponse[];
  pictures: Record<number, BuildingPictureResponse>;
  agencyName: string;
}

export default function TrendsSection({ buildings, pictures, agencyName }: TrendsSectionProps) {
  const [trendingBuildings, setTrendingBuildings] = useState<BuildingResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (buildings.length === 0) return;
    setLoading(true);

    const zones = [...new Set(buildings.map((b) => b.zone))].filter(Boolean);

    Promise.all(
      zones.map((zone) =>
        fetch(`${PYTHON_API}/trends/zones/${zone}/types`)
          .then((res) => res.ok ? res.json() : [])
          .then((trends: TrendByZoneTypeResponse[]) => trends)
          .catch(() => [])
      )
    )
      .then((results) => {
        const allTrends: TrendByZoneTypeResponse[] = results.flat();
        const sortedTrends = allTrends.sort((a, b) => b.sales_count - a.sales_count);
        const scored = buildings
          .map((building) => {
            const rank = sortedTrends.findIndex(
              (t) => t.type === building.type && t.zone === building.zone
            );
            return { building, rank: rank === -1 ? 9999 : rank };
          })
          .sort((a, b) => a.rank - b.rank)
          .slice(0, 5)
          .map((s) => s.building);

        setTrendingBuildings(scored);
      })
      .finally(() => setLoading(false));
  }, [buildings]);

  const scroll = (dir: "left" | "right") => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs text-blue-600 font-semibold uppercase tracking-widest mb-1">
              À la une
            </p>
            <h2
              className="text-2xl font-bold text-slate-900 flex items-center gap-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <FaArrowTrendUp className="text-blue-500 w-5 h-5" />
              Biens tendance - {agencyName}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Les biens les plus recherchés du marché en ce moment
            </p>
          </div>

          {trendingBuildings.length > 1 && (
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => scroll("left")}
                className="w-9 h-9 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors"
              >
                <FaChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-9 h-9 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors"
              >
                <FaChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {loading && (
          <div className="flex gap-5 overflow-hidden">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 animate-pulse shrink-0 w-72">
                <div className="aspect-4/3 bg-slate-200" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-slate-200 rounded w-1/3" />
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                  <div className="h-5 bg-slate-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && trendingBuildings.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <FaArrowTrendUp className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">Aucune tendance disponible pour le moment.</p>
          </div>
        )}

        {!loading && trendingBuildings.length > 0 && (
          <div
            ref={carouselRef}
            className="flex gap-5 overflow-x-auto scroll-smooth pb-2"
            style={{ scrollbarWidth: "none" }}
          >
            {trendingBuildings.map((building, i) => (
              <div key={building.id} className="shrink-0 w-72 relative">
                {i === 0 && (
                  <div className="absolute top-2 right-2 z-10 bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow flex items-center gap-1">
                    <FaArrowTrendUp className="w-3 h-3" />
                    #1 Tendance
                  </div>
                )}
                <BuildingCard
                  building={building}
                  picture={pictures[building.id]}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}