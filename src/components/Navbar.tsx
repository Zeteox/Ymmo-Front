import { useEffect, useState, useRef } from "react";
import type { AgencyResponse } from "../types/api";
import { FaHouse } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { RxCross2, RxHamburgerMenu } from "react-icons/rx";

interface NavbarProps {
  agencies: AgencyResponse[];
  selectedAgency: AgencyResponse | null;
  onSelectAgency: (agency: AgencyResponse) => void;
}

export default function Navbar({ agencies, selectedAgency, onSelectAgency }: NavbarProps) {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [agencyDropdownOpen, setAgencyDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    setAuthenticated(token != null);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setAgencyDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    window.localStorage.removeItem("token");
    setAuthenticated(false);
    window.location.replace("/");
  };

  const getCleanName = (name: String) => {
    name = name.split("_").join(" ");
    return name[0].toUpperCase() + name.slice(1).toLowerCase();
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          <a href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-sm flex items-center justify-center">
              <FaHouse className="text-white"/>
            </div>
            <span className="text-white font-bold text-xl tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Ymmo
            </span>
          </a>

          <div className="hidden md:block relative shrink-0" ref={dropdownRef}>
            <button
              onClick={() => setAgencyDropdownOpen(!agencyDropdownOpen)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 transition-colors rounded-full px-4 py-2 text-sm text-slate-200 min-w-50 max-w-70"
            >
              <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
              <span className="flex-1 text-left truncate">
                {agencies.length === 0
                  ? "Chargement…"
                  : selectedAgency
                  ? `${getCleanName(selectedAgency.name)} — ${getCleanName(selectedAgency.city)}`
                  : "Sélectionner une agence"}
              </span>
              <IoIosArrowDown className={`w-4 h-4 shrink-0 text-slate-400 transition-transform duration-200 ${agencyDropdownOpen ? "rotate-180" : ""}`}/>
            </button>

            {agencyDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden">
                <div className="max-h-80 overflow-y-auto">
                  {agencies.map((agency) => (
                    <button
                      key={agency.id}
                      onClick={() => { onSelectAgency(agency); setAgencyDropdownOpen(false); }}
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

          <div className="hidden md:flex items-center gap-3 shrink-0 ml-auto">
            {isAuthenticated ? (
              <>
                <button
                  onClick={handleLogout}
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Déconnexion
                </button>
                <a href="/profile" className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-full transition-colors">
                  Profile
                </a>
              </>
            ) : (
              <>
                <a href="/login" className="text-sm text-slate-300 hover:text-white transition-colors">
                  Connexion
                </a>
                <a href="/register" className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-full transition-colors">
                  S'inscrire
                </a>
              </>
            )}
          </div>

          <button
            className="md:hidden text-slate-300 hover:text-white ml-auto"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? (
              <RxCross2 className="w-6 h-6"/>) : (<RxHamburgerMenu className="w-6 h-6"/>)}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 px-4 py-4 space-y-4">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Agence</p>
            <div className="bg-slate-800 rounded-xl overflow-hidden max-h-64 overflow-y-auto">
              {agencies.map((agency) => (
                <button
                  key={agency.id}
                  onClick={() => { onSelectAgency(agency); setMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors text-left border-b border-slate-700/50 last:border-0 ${
                    selectedAgency?.id === agency.id
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    selectedAgency?.id === agency.id ? "bg-white" : "bg-slate-600"
                  }`} />
                  <span className="flex-1 font-medium">{agency.name}</span>
                  <span className={`text-xs ${selectedAgency?.id === agency.id ? "text-blue-200" : "text-slate-500"}`}>
                    {agency.city}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {isAuthenticated ? (
            
            <div className="flex gap-3">
              <button onClick={handleLogout} className="w-full text-center text-sm text-slate-400 hover:text-white py-2">
                Déconnexionadzazd
              </button>
              <a href="/profile" className="flex-1 text-center text-sm bg-blue-600 text-white rounded-full py-2 hover:bg-blue-500">
                Profile
              </a>
            </div>
          ) : (
            <div className="flex gap-3">
              <a href="/login" className="flex-1 text-center text-sm text-slate-300 border border-slate-700 rounded-full py-2 hover:bg-slate-800">
                Connexion
              </a>
              <a href="/register" className="flex-1 text-center text-sm bg-blue-600 text-white rounded-full py-2 hover:bg-blue-500">
                S'inscrire
              </a>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}