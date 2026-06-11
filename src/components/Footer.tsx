import { FaHouse } from "react-icons/fa6";
import type { AgencyResponse } from "../types/api";

interface FooterProps {
  agencies: AgencyResponse[];
}

export default function Footer({ agencies }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-12">

          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-blue-600 rounded-sm flex items-center justify-center">
                <FaHouse className="text-white"/>
              </div>
              <span className="text-white font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>Ymmo</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-500">
              Votre partenaire immobilier de confiance. Achat, vente, location, nous vous accompagnons à chaque étape.
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-4">Nos agences</h4>
            <ul className="space-y-2">
              {agencies.map((a) => (
                <li key={a.id} className="text-sm hover:text-white transition-colors cursor-pointer">
                  {a.name} <span className="text-slate-600">· {a.city}</span>
                </li>
              ))}
              {agencies.length === 0 && (
                <li className="text-sm text-slate-600">Chargement…</li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-4">Liens utiles</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-white transition-colors">Accueil</a></li>
              <li><a href="/buildings" className="hover:text-white transition-colors">Tous les biens</a></li>
              <li><a href="/login" className="hover:text-white transition-colors">Espace client</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
          <p>© {year} Ymmo. Tous droits réservés.</p>
          <div className="flex gap-4">
            <a href="/mentions-legales" className="hover:text-slate-400 transition-colors">Mentions légales</a>
            <a href="/confidentialite" className="hover:text-slate-400 transition-colors">Confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
