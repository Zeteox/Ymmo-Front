import { useEffect, useState, useCallback, use } from "react";
import { fetchBuildingById, fetchBuildingPictures, getBuildingIdFromUrl } from "../services/api";
import type { BuildingResponse, BuildingPictureResponse } from "../types/api";
import { STATE_LABELS, TYPE_LABELS, ZONE_LABELS } from "../types/formattedBuildingUtils";
import {
  FaHeart,
  FaRegHeart,
  FaLocationDot,
  FaChevronLeft,
  FaTag,
  FaLayerGroup,
  FaMapPin,
} from "react-icons/fa6";
import { PictureCarousel } from "../components/PictureCarousel";
import { Badge } from "../components/Badge";
import { Link } from "react-router-dom";
import { favoriteApiService } from "../services/favoriteApiService";
import { demandApiService } from "../services/demandApiService";
import { ContactModal } from "../components/ContactModal";
import { userApiService } from "../services/userApiService";

export function BuildingPage() {
  const buildingId = getBuildingIdFromUrl();

  const [building, setBuilding] = useState<BuildingResponse | null>(null);
  const [pictures, setPictures] = useState<BuildingPictureResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorited, setFavorited] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    if (!buildingId) { setError("Identifiant de bien invalide."); setLoading(false); return; }

    Promise.all([
      fetchBuildingById(buildingId),
      fetchBuildingPictures(buildingId),
    ])
      .then(([b, pics]) => {
        setBuilding(b);
        setPictures(pics);
      })
      .catch(() => setError("Impossible de charger ce bien."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!buildingId) return;
    favoriteApiService.isFavorite(buildingId).then(resp => setFavorited(resp));
  }, [buildingId]);

  const toggleFavorite = useCallback(async () => {
    if (!buildingId || favLoading) return;
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    setFavLoading(true);
    try {
      if (favorited) {
        await favoriteApiService.removeFavorite(buildingId);
        setFavorited(false);
      } else {
        await favoriteApiService.addFavorite(buildingId);
        setFavorited(true);
      }
    } catch {
      console.error("error adding favorite");
    } finally {
      setFavLoading(false);
    }
  }, [buildingId, favorited, favLoading]);

  const handleTakeContact = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    setContactOpen(true);
  };

  const handleSubmitDemand = async (message: string) => {
    if (!buildingId) return;
    const user = await userApiService.getMe()
    if (!user) return;
    await demandApiService.addDemand(buildingId.toString(), { userId: user.id, content: message });
  };

  const formattedPrice = building
    ? new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(building.price)
    : "";
  const stateInfo  = building ? (STATE_LABELS[building.state]  ?? building.state)  : "";
  const typeLabel  = building ? (TYPE_LABELS[building.type]    ?? building.type)   : "";
  const zoneLabel  = building ? (ZONE_LABELS[building.zone]    ?? building.zone)   : "";

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-24 animate-pulse space-y-6">
        <div className="aspect-video bg-slate-200 rounded-2xl" />
        <div className="h-8 bg-slate-200 rounded w-1/2" />
        <div className="h-4 bg-slate-100 rounded w-1/3" />
        <div className="h-24 bg-slate-100 rounded" />
      </div>
    );
  }

  if (error || !building) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-24 text-center text-slate-400">
        <p className="text-lg">{error ?? "Bien introuvable."}</p>
        <a href="/" className="mt-4 inline-block text-sm text-blue-600 hover:underline">← Retour à l'accueil</a>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {contactOpen && (
        <ContactModal
          buildingName={building.name}
          onClose={() => setContactOpen(false)}
          onSubmit={handleSubmitDemand}
        />
      )}

      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-6"
      >
        <FaChevronLeft className="w-3 h-3" />
        Retour aux annonces
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        <div>
          <PictureCarousel pictures={pictures} name={building.name} />

          {pictures.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
              {pictures.map((pic, i) => (
                <img
                  key={pic.id}
                  src={`/${pic.path}`}
                  alt={`miniature ${i + 1}`}
                  className="w-16 h-12 object-cover rounded-lg shrink-0 cursor-pointer border-2 transition-all"
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5">

          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-blue-600 font-semibold uppercase tracking-widest mb-1">
                {typeLabel}
              </p>
              <h1
                className="text-3xl font-bold text-slate-900 leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {building.name}
              </h1>
            </div>

            <button
              onClick={toggleFavorite}
              disabled={favLoading}
              aria-label={favorited ? "Retirer des favoris" : "Ajouter aux favoris"}
              className={`shrink-0 w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all ${
                favorited
                  ? "bg-red-50 border-red-300 text-red-500 hover:bg-red-100"
                  : "bg-white border-slate-200 text-slate-400 hover:border-red-300 hover:text-red-400"
              } ${favLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {favorited
                ? <FaHeart className="w-5 h-5" />
                : <FaRegHeart className="w-5 h-5" />
              }
            </button>
          </div>

          <div>
            <p
              className="text-4xl font-bold text-slate-900"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {formattedPrice}
            </p>
          </div>

          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <FaLocationDot className="w-4 h-4 text-blue-500 shrink-0" />
            <span>{building.address}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Badge icon={<FaTag className="w-3.5 h-3.5" />}     label="Statut"  value={stateInfo as string}  color="emerald" />
            <Badge icon={<FaLayerGroup className="w-3.5 h-3.5" />} label="Type" value={typeLabel as string}  color="blue"    />
            <Badge icon={<FaMapPin className="w-3.5 h-3.5" />}  label="Zone"    value={zoneLabel as string}  color="amber"   />
          </div>

          <hr className="border-slate-100" />

          <div>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Description
            </h2>
            <p className="text-slate-700 leading-relaxed text-sm whitespace-pre-line">
              {building.description}
            </p>
          </div>

          <button
            onClick={handleTakeContact}
            className="mt-auto w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Prendre contact
          </button>
        </div>
      </div>
    </div>
  );
}