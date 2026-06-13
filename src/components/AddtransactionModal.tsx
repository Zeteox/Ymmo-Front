import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { FaMoneyBillWave } from "react-icons/fa6";
import type { TransactionPayload } from "../types/utils";

interface AddTransactionModalProps {
  agencyId: number;
  agentId: number;
  onClose: () => void;
  onSubmit: (data: TransactionPayload) => Promise<void>;
}

export function AddTransactionModal({
  agencyId,
  agentId,
  onClose,
  onSubmit,
}: AddTransactionModalProps) {
  const [form, setForm] = useState({
    buildingId: "",
    buyerId: "",
    amount: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async () => {
    const buildingId = parseInt(form.buildingId);
    const buyerId = parseInt(form.buyerId);
    const amount = parseFloat(form.amount);

    if (!form.buildingId || isNaN(buildingId)) {
      setError("L'identifiant du bien est requis.");
      return;
    }
    if (!form.buyerId || isNaN(buyerId)) {
      setError("L'identifiant de l'acheteur est requis.");
      return;
    }
    if (!form.amount || isNaN(amount) || amount < 0) {
      setError("Le montant doit être un nombre positif.");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        buildingId,
        buyerId,
        agentId,
        agencyId,
        amount,
      });
      onClose();
    } catch (e: any) {
      setError(e?.message ?? "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <FaMoneyBillWave className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <h2
              className="text-base font-semibold text-slate-900"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Nouvelle transaction
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Fermer"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <Field
            label="ID du bien"
            name="buildingId"
            value={form.buildingId}
            onChange={handleChange}
            placeholder="ex : 42"
            type="number"
          />
          <Field
            label="ID de l'acheteur"
            name="buyerId"
            value={form.buyerId}
            onChange={handleChange}
            placeholder="ex : 17"
            type="number"
          />
          <Field
            label="Montant (€)"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="ex : 250000"
            type="number"
            min="0"
            step="0.01"
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-xl px-4 py-3">
              <p className="text-xs text-slate-400 mb-1">Agent (vous)</p>
              <p className="text-sm font-semibold text-slate-700">#{agentId}</p>
            </div>
            <div className="bg-slate-50 rounded-xl px-4 py-3">
              <p className="text-xs text-slate-400 mb-1">Agence</p>
              <p className="text-sm font-semibold text-slate-700">#{agencyId}</p>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="flex-1 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2.5 rounded-xl transition-colors"
          >
            {loading ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── small reusable field ─────────────────────────────────────── */
interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
}

function Field({ label, ...inputProps }: FieldProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1.5">{label}</label>
      <input
        {...inputProps}
        className="w-full text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5
          focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
          placeholder:text-slate-300 transition"
      />
    </div>
  );
}