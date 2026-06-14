import { useEffect, useState } from "react";
import type { UserResponse } from "../types/api";
import { FaHouse } from "react-icons/fa6";
import { HiOutlineUser, HiOutlineMail, HiOutlinePhone, HiOutlineShieldCheck } from "react-icons/hi";
import { userApiService } from "../services/userApiService";
import { Link } from "react-router-dom";

const ROLE_LABELS: Record<string, string> = {
  ROLE_AGENT: "Agent",
  ROLE_USER: "Client",
};

export default function ProfilePage() {
  const [user, setUser] = useState<UserResponse | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    userApiService.getMe()
      .then(setUser)
      .catch(() => {
        setError("Session expirée. Veuillez vous reconnecter.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4 py-16">

      <a href="/" className="flex items-center gap-2 mb-10">
        <div className="w-9 h-9 bg-blue-600 rounded-sm flex items-center justify-center shadow-lg shadow-blue-600/30">
          <FaHouse className="text-white w-4 h-4" />
        </div>
        <span className="text-white font-bold text-2xl tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
          Ymmo
        </span>
      </a>

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">

        <div className="px-8 pt-8 pb-6 border-b border-slate-800">
          <p className="text-xs text-blue-500 font-semibold uppercase tracking-widest mb-1">Espace client</p>
          <h1 className="text-xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            Mon profil
          </h1>
        </div>

        <div className="p-8">

          {loading && (
            <div className="space-y-4 animate-pulse">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-2.5 bg-slate-800 rounded w-1/3" />
                    <div className="h-3.5 bg-slate-700 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-950 border border-red-800 text-red-300 text-sm">
              {error}
            </div>
          )}

          {!loading && user && (
            <div className="space-y-5">

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                  <HiOutlineUser className="text-slate-400 w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Nom complet</p>
                  <p className="text-sm text-white font-semibold">{user.firstName} {user.lastName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                  <HiOutlineMail className="text-slate-400 w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Adresse e-mail</p>
                  <p className="text-sm text-white">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                  <HiOutlinePhone className="text-slate-400 w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Téléphone</p>
                  <p className="text-sm text-white">{user.phone || "—"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                  <HiOutlineShieldCheck className="text-slate-400 w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Rôle</p>
                  <p className="text-sm text-white">{ROLE_LABELS[user.role] ?? user.role}</p>
                </div>
              </div>

              <div className="pt-2">
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                  user.isActive
                    ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                    : "bg-slate-800 text-slate-500 border border-slate-700"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? "bg-emerald-400" : "bg-slate-600"}`} />
                  {user.isActive ? "Compte actif" : "Compte inactif"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <Link to="/" className="mt-8 text-xs text-slate-600 hover:text-slate-400 transition-colors">
        ← Retour à l'accueil
      </Link>
    </div>
  );
}