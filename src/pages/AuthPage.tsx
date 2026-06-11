import { useState, useRef, useEffect } from "react";
import { AuthApiService } from "../services/authApiService";
import type { AgencyResponse } from "../types/api";
import { FaHouse } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiOutlinePhone, HiOutlineEye, HiOutlineEyeOff, HiOutlineOfficeBuilding } from "react-icons/hi";
import { Link } from "react-router-dom";

interface AuthPageProps {
  agencies?: AgencyResponse[];
  isRegister?: boolean;
}

export default function AuthPage({ agencies = [], isRegister = false }: AuthPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // register
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [agencyId, setAgencyId] = useState(0);
  const [selectedAgency, setSelectedAgency] = useState<AgencyResponse | null>(null);
  const [agencyDropdownOpen, setAgencyDropdownOpen] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setAgencyDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const getCleanName = (name: string) => {
    const n = name.split("_").join(" ");
    return n[0].toUpperCase() + n.slice(1).toLowerCase();
  };

  const verifyPasswords = (p: string, pc: string) => p === pc;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await AuthApiService.login(email, password);
      if (data.token) {
        window.location.replace("/");
      } else {
        setError("Email ou mot de passe incorrect.");
      }
    } catch {
      setError("Une erreur est survenue. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!verifyPasswords(password, passwordConfirm)) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (agencyId === 0) {
      setError("Veuillez sélectionner une agence.");
      return;
    }
    setLoading(true);
    try {
      const data = await AuthApiService.register(firstName, lastName, email, phone, password, agencyId);
      if (data.token) {
        window.location.replace("/");
      } else {
        setError("Inscription impossible. Vérifiez vos informations.");
      }
    } catch {
      setError("Une erreur est survenue. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4 py-16">
      <a href="/" className="flex items-center gap-2 mb-10">
        <div className="w-9 h-9 bg-blue-600 rounded-sm flex items-center justify-center shadow-lg shadow-blue-600/30">
          <FaHouse className="text-white w-4 h-4" />
        </div>
        <span
          className="text-white font-bold text-2xl tracking-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Ymmo
        </span>
      </a>

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">

        <div className="flex border-b border-slate-800">
          <a
            href="/login"
            className={`flex-1 text-center py-4 text-sm font-semibold transition-colors ${
              !isRegister
                ? "text-white border-b-2 border-blue-500 bg-slate-900"
                : "text-slate-500 hover:text-slate-300 bg-slate-950"
            }`}
          >
            Connexion
          </a>
          <a
            href="/register"
            className={`flex-1 text-center py-4 text-sm font-semibold transition-colors ${
              isRegister
                ? "text-white border-b-2 border-blue-500 bg-slate-900"
                : "text-slate-500 hover:text-slate-300 bg-slate-950"
            }`}
          >
            Créer un compte
          </a>
        </div>

        <div className="p-8">

          <h1
            className="text-xl font-bold text-white mb-1"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {isRegister ? "Rejoignez Ymmo" : "Bon retour parmi nous"}
          </h1>
          <p className="text-sm text-slate-500 mb-7">
            {isRegister
              ? "Créez votre espace client pour suivre vos biens."
              : "Connectez-vous à votre espace client."}
          </p>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-red-950 border border-red-800 text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={isRegister ? handleRegister : handleLogin} className="space-y-4">

            {isRegister && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 font-medium mb-1.5">Prénom</label>
                  <div className="relative">
                    <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input
                      type="text"
                      required
                      placeholder="Marie"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 font-medium mb-1.5">Nom</label>
                  <div className="relative">
                    <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input
                      type="text"
                      required
                      placeholder="Dupont"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            {isRegister && (
              <div>
                <label className="block text-xs text-slate-400 font-medium mb-1.5">Téléphone</label>
                <div className="relative">
                  <HiOutlinePhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                  <input
                    type="tel"
                    required
                    placeholder="+33 6 00 00 00 00"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-colors"
                  />
                </div>
              </div>
            )}

            {isRegister && (
              <div>
                <label className="block text-xs text-slate-400 font-medium mb-1.5">Agence</label>
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setAgencyDropdownOpen(!agencyDropdownOpen)}
                    className={`w-full flex items-center gap-2 bg-slate-800 border rounded-lg px-3 py-2.5 text-sm transition-colors text-left ${
                      agencyId === 0 ? "border-slate-700" : "border-blue-500"
                    } hover:border-slate-600 focus:outline-none`}
                  >
                    <HiOutlineOfficeBuilding className="text-slate-500 w-4 h-4 shrink-0" />
                    <span className={`flex-1 truncate ${selectedAgency ? "text-white" : "text-slate-500"}`}>
                      {agencies.length === 0
                        ? "Chargement…"
                        : selectedAgency
                        ? `${getCleanName(selectedAgency.name)} — ${getCleanName(selectedAgency.city)}`
                        : "Sélectionner une agence"}
                    </span>
                    <IoIosArrowDown
                      className={`w-4 h-4 shrink-0 text-slate-400 transition-transform duration-200 ${agencyDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {agencyDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden z-20">
                      <div className="max-h-48 overflow-y-auto">
                        {agencies.map((agency) => (
                          <button
                            type="button"
                            key={agency.id}
                            onClick={() => {
                              setSelectedAgency(agency);
                              setAgencyId(agency.id);
                              setAgencyDropdownOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left ${
                              selectedAgency?.id === agency.id
                                ? "bg-blue-600 text-white"
                                : "text-slate-300 hover:bg-slate-700"
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              selectedAgency?.id === agency.id ? "bg-white" : "bg-slate-600"
                            }`} />
                            <span className="flex-1 truncate font-medium">{getCleanName(agency.name)}</span>
                            <span className={`text-xs shrink-0 ${
                              selectedAgency?.id === agency.id ? "text-blue-200" : "text-slate-500"
                            }`}>{getCleanName(agency.city)}</span>
                          </button>
                        ))}
                      </div>
                      <div className="px-4 py-2 border-t border-slate-700 text-xs text-slate-500">
                        {agencies.length} agence{agencies.length > 1 ? "s" : ""}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs text-slate-400 font-medium mb-1.5">Adresse e-mail</label>
              <div className="relative">
                <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input
                  type="email"
                  required
                  placeholder="marie@exemple.fr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs text-slate-400 font-medium">Mot de passe</label>
                {!isRegister && (
                  <a href="/forgot-password" className="text-xs text-blue-500 hover:text-blue-400 transition-colors">
                    Mot de passe oublié ?
                  </a>
                )}
              </div>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <HiOutlineEyeOff className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="block text-xs text-slate-400 font-medium mb-1.5">Confirmer le mot de passe</label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                  <input
                    type={showPasswordConfirm ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    className={`w-full bg-slate-800 border rounded-lg pl-9 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-colors ${
                      passwordConfirm && !verifyPasswords(password, passwordConfirm)
                        ? "border-red-600 focus:border-red-500 focus:ring-red-500/20"
                        : "border-slate-700 focus:border-blue-500 focus:ring-blue-500/30"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPasswordConfirm ? <HiOutlineEyeOff className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordConfirm && !verifyPasswords(password, passwordConfirm) && (
                  <p className="mt-1 text-xs text-red-400">Les mots de passe ne correspondent pas.</p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 rounded-lg transition-colors shadow-lg shadow-blue-600/20"
            >
              {loading
                ? "Chargement…"
                : isRegister
                ? "Créer mon compte"
                : "Se connecter"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            {isRegister ? (
              <>
                Déjà un compte ?{" "}
                <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                  Se connecter
                </Link>
              </>
            ) : (
              <>
                Pas encore de compte ?{" "}
                <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                  S'inscrire gratuitement
                </Link>
              </>
            )}
          </p>
        </div>
      </div>

      <a href="/" className="mt-8 text-xs text-slate-600 hover:text-slate-400 transition-colors">
        ← Retour à l'accueil
      </a>
    </div>
  );
}