import type { ContactDemandResponse, UserResponse } from "../types/api";

export function DemandModal({
  demand,
  onClose,
}: {
  demand: ContactDemandResponse & { userInfo?: UserResponse; buildingName?: string };
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-blue-600 font-semibold uppercase tracking-widest mb-1">
              Demande de contact
            </p>
            <h3
              className="text-xl font-bold text-slate-900"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {demand.buildingName ?? `Bien #${demand.buildingId}`}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl font-bold leading-none"
          >
            ×
          </button>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm">
          {demand.userInfo ? (
            <>
              <p className="text-slate-500">
                <span className="font-semibold text-slate-700">Prénom : </span>
                {demand.userInfo.firstName}
              </p>
              <p className="text-slate-500">
                <span className="font-semibold text-slate-700">Nom : </span>
                {demand.userInfo.lastName}
              </p>
              <p className="text-slate-500 flex items-center gap-2">
                <span className="font-semibold text-slate-700">Email : </span>
                <a
                  href={`mailto:${demand.userInfo.email}`}
                  className="text-blue-600 hover:underline font-medium"
                >
                  {demand.userInfo.email}
                </a>
              </p>
              {demand.userInfo.phone && (
                <p className="text-slate-500">
                  <span className="font-semibold text-slate-700">Téléphone : </span>
                  {demand.userInfo.phone}
                </p>
              )}
            </>
          ) : (
            <p className="text-slate-400 italic">Client #{demand.userId}</p>
          )}
        </div>

        <div>
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
            Message
          </p>
          <p className="text-slate-700 text-sm leading-relaxed bg-slate-50 rounded-xl p-4">
            {demand.content}
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-slate-900 hover:bg-slate-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}