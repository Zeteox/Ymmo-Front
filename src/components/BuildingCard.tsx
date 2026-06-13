import { LuHouse, LuMapPinHouse } from "react-icons/lu";
import type { BuildingResponse, BuildingPictureResponse } from "../types/api";
import { Link } from "react-router-dom";
import { TYPE_LABELS, ZONE_LABELS } from "../types/formattedBuildingUtils";

interface BuildingCardProps {
  building: BuildingResponse;
  picture?: BuildingPictureResponse;
}

const STATE_LABELS: Record<string, { label: string; color: string }> = {
  BUILDING_AVAILABLE: { label: "Disponible", color: "bg-emerald-100 text-emerald-800" },
  BUILDING_SOLD:      { label: "Vendu",      color: "bg-slate-100 text-slate-500" },
};

export default function BuildingCard({ building, picture }: BuildingCardProps) {
  const stateInfo = STATE_LABELS[building.state] ?? { label: building.state, color: "bg-slate-100 text-slate-600" };
  const zoneLabel = ZONE_LABELS[building.zone] ?? building.zone;
  const typeLabel = TYPE_LABELS[building.type] ?? building.type;

  const imageSrc = picture?.data
    ? `data:${picture.contentType};base64,${picture.data}`
    : null;

  const formattedPrice = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(building.price);

  return (
    <Link
      to={`/buildings/${building.id}`}
      className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-slate-100 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={building.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <LuHouse className="text-slate-400 w-12 h-12 shrink-0" />
          </div>
        )}
        <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${stateInfo.color}`}>
          {stateInfo.label}
        </span>
      </div>
      <div className="p-4">
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">{typeLabel}</p>
        <h3
          className="font-semibold text-slate-900 text-base leading-snug mb-1 group-hover:text-blue-600 transition-colors"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {building.name}
        </h3>
        <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
          <LuMapPinHouse className="text-slate-400 w-3.5 h-3.5 shrink-0" />
          {building.address} · <span className="text-blue-500">{zoneLabel}</span>
        </p>
        <div className="flex items-end justify-between">
          <p className="text-lg font-bold text-slate-900">{formattedPrice}</p>
          <span className="text-xs text-blue-600 font-medium group-hover:underline">Voir le bien →</span>
        </div>
      </div>
    </Link>
  );
}