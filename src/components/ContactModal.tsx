import { useState } from "react";
import { FaXmark } from "react-icons/fa6";

const MAX_CHARS = 500;

export function ContactModal({
  buildingName,
  onClose,
  onSubmit,
}: {
  buildingName: string;
  onClose: () => void;
  onSubmit: (message: string) => Promise<void>;
}) {
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remaining = MAX_CHARS - message.length;

  const handleSubmit = async () => {
    if (!message.trim() || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(message.trim());
      setSuccess(true);
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(15, 23, 42, 0.5)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <p className="text-xs text-blue-600 font-semibold uppercase tracking-widest">
              Prendre contact
            </p>
            <h2
              className="text-lg font-bold text-slate-900 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {buildingName}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <FaXmark className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5">
          {success ? (
            <div className="text-center py-6 space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="font-semibold text-slate-800">Message envoyé !</p>
              <p className="text-sm text-slate-500">Nous vous répondrons dans les meilleurs délais.</p>
              <button
                onClick={onClose}
                className="mt-4 px-5 py-2 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors"
              >
                Fermer
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-slate-500">
                Décrivez votre demande et nous vous mettrons en relation avec le propriétaire.
              </p>
              <div className="relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, MAX_CHARS))}
                  placeholder="Bonjour, je suis intéressé par ce bien et j'aimerais..."
                  rows={6}
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <span
                  className={`absolute bottom-3 right-3 text-xs font-medium ${
                    remaining <= 50 ? (remaining <= 20 ? "text-red-400" : "text-amber-400") : "text-slate-300"
                  }`}
                >
                  {remaining}
                </span>
              </div>

              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!message.trim() || submitting}
                  className="flex-1 py-3 rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Envoi…" : "Envoyer"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}