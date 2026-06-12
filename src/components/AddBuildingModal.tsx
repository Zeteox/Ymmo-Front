import { useState } from "react";
import { buildingApiService, type CreateBuildingData } from "../services/buildingApiService";
import { pictureApiService } from "../services/pictureApiService";
import { STATE_LABELS, TYPE_LABELS, ZONE_LABELS } from "../types/formattedBuildingUtils";
import { FaPlus } from "react-icons/fa6";

function compressImage(file: File, maxWidth = 1920, maxHeight = 1080, quality = 0.8): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas context unavailable"));

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("Compression failed"));
          const compressed = new File([blob], file.name, { type: "image/jpeg" });
          resolve(compressed);
        },
        "image/jpeg",
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Image load failed"));
    };

    img.src = objectUrl;
  });
}

export function AddBuildingModal({
  agencyId,
  onClose,
  onCreated,
}: {
  agencyId: number;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [form, setForm] = useState<Omit<CreateBuildingData, "agencyId">>({
    name: "",
    price: 0,
    description: "",
    address: "",
    buildingType: "APARTMENT",
    buildingState: "BUILDING_AVAILABLE",
    zone: "ZONE_CENTRE",
  });
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setCompressing(true);
    try {
      const compressed = await Promise.all(files.map((f) => compressImage(f)));
      setImages((prev) => [...prev, ...compressed].slice(0, 5));
    } catch {
      setError("Une image n'a pas pu être traitée.");
    } finally {
      setCompressing(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.address || form.price <= 0) {
      setError("Merci de remplir tous les champs obligatoires.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const building = await buildingApiService.createBuilding({ ...form, agencyId });
      await Promise.all(images.map((file) => pictureApiService.uploadPicture(building.id, file)));
      onCreated();
      onClose();
    } catch {
      setError("Une erreur est survenue lors de la création du bien.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelClass = "text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <p className="text-xs text-blue-600 font-semibold uppercase tracking-widest mb-1">
            Nouveau bien
          </p>
          <h3
            className="text-xl font-bold text-slate-900"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Ajouter une annonce
          </h3>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className={labelClass}>Nom du bien *</label>
            <input
              className={inputClass}
              placeholder="Ex: Villa Les Pins"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className={labelClass}>Prix (€) *</label>
            <input
              type="number"
              className={inputClass}
              placeholder="250000"
              value={form.price || ""}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            />
          </div>

          <div>
            <label className={labelClass}>Type</label>
            <select
              className={inputClass}
              value={form.buildingType}
              onChange={(e) => setForm({ ...form, buildingType: e.target.value })}
            >
              {Object.entries(TYPE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Zone</label>
            <select
              className={inputClass}
              value={form.zone}
              onChange={(e) => setForm({ ...form, zone: e.target.value })}
            >
              {Object.entries(ZONE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Statut</label>
            <select
              className={inputClass}
              value={form.buildingState}
              onChange={(e) => setForm({ ...form, buildingState: e.target.value })}
            >
              {Object.entries(STATE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>

          <div className="col-span-2">
            <label className={labelClass}>Adresse *</label>
            <input
              className={inputClass}
              placeholder="12 rue des Fleurs, Toulouse"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>

          <div className="col-span-2">
            <label className={labelClass}>Description</label>
            <textarea
              className={`${inputClass} resize-none`}
              rows={3}
              placeholder="Décrivez le bien..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="col-span-2">
            <label className={labelClass}>Photos (5 max)</label>
            <label className={`flex items-center gap-3 border-2 border-dashed rounded-xl px-4 py-3 transition-colors ${
              compressing
                ? "border-blue-300 bg-blue-50 cursor-wait"
                : "border-slate-200 cursor-pointer hover:border-blue-400"
            }`}>
              <FaPlus className={`w-4 h-4 ${compressing ? "text-blue-400 animate-spin" : "text-slate-400"}`} />
              <span className="text-sm text-slate-500">
                {compressing
                  ? "Compression en cours…"
                  : images.length > 0
                  ? `${images.length} photo${images.length > 1 ? "s" : ""} sélectionnée${images.length > 1 ? "s" : ""}`
                  : "Choisir des photos"}
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                disabled={compressing}
                onChange={handleImageChange}
              />
            </label>
            {images.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {images.map((f, i) => (
                  <div key={i} className="relative">
                    <img
                      src={URL.createObjectURL(f)}
                      className="w-14 h-14 object-cover rounded-lg border border-slate-200"
                      alt=""
                    />
                    <button
                      onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 border border-slate-200 text-slate-600 text-sm font-medium py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || compressing}
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50"
          >
            {loading ? "Création..." : "Créer le bien"}
          </button>
        </div>
      </div>
    </div>
  );
}