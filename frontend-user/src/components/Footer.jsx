import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-platinum bg-slate-blue text-platinum relative overflow-hidden">
      <div className="absolute inset-x-0 -top-24 h-40 bg-gradient-to-b from-pacific/15 to-transparent" />

      <div className="relative max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link
              to="/"
              className="text-2xl font-black tracking-tight flex items-center gap-1"
            >
              RECO<span className="text-tangerine">MIND</span>
            </Link>
            <p className="text-sm text-platinum/80 max-w-xs">
              Plateforme e‑commerce intelligente qui combine recommandations
              IA et expérience d&apos;achat minimaliste.
            </p>
            <div className="flex gap-3">
              {["instagram", "facebook-f", "linkedin-in"].map((icon) => (
                <a
                  key={icon}
                  href="#"
                  className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-pacific transition-colors"
                >
                  <i className={`fa-brands fa-${icon} text-xs`} />
                </a>
              ))}
            </div>
          </div>

          {/* Shopping */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.25em] text-platinum/70 mb-4">
              Shopping
            </h4>
            <ul className="space-y-2 text-sm text-platinum/80">
              <li>
                <Link to="/products" className="hover:text-white transition-colors">
                  Tous les produits
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-colors">
                  Mon panier
                </Link>
              </li>
              <li>
                <Link to="/my-orders" className="hover:text-white transition-colors">
                  Mes commandes
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white transition-colors">
                  Mon compte
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.25em] text-platinum/70 mb-4">
              Aide & infos
            </h4>
            <ul className="space-y-2 text-sm text-platinum/80">
              <li className="hover:text-white cursor-pointer transition-colors">
                FAQ
              </li>
              <li className="hover:text-white cursor-pointer transition-colors">
                Livraison & retours
              </li>
              <li className="hover:text-white cursor-pointer transition-colors">
                Conditions d&apos;utilisation
              </li>
              <li className="hover:text-white cursor-pointer transition-colors">
                Confidentialité
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.25em] text-platinum/70 mb-4">
              Contact
            </h4>
            <p className="text-sm text-platinum/80 mb-2">
              Une question ? Écrivez‑nous :
            </p>
            <p className="text-pacific font-black text-lg mb-4 select-all">
              support@recomind.ma
            </p>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
              <p className="text-[10px] font-bold text-platinum/70 uppercase mb-1">
                Service client
              </p>
              <p className="text-sm font-bold text-white tracking-wide">
                +212 600 000 000
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-platinum/70 text-center">
            © 2026 RECOMIND STORE · Tous droits réservés.
          </p>
          <div className="flex items-center gap-4 opacity-70">
            <i className="fa-brands fa-cc-visa text-xl" />
            <i className="fa-brands fa-cc-mastercard text-xl" />
            <i className="fa-brands fa-cc-paypal text-xl" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;