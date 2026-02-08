import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-slate-blue text-white pt-16 pb-8 mt-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="text-2xl font-black tracking-tighter">
              RECO<span className="text-tangerine">MIND</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Votre destination préférée pour un shopping intelligent et créatif. Qualité et style à votre portée.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 border-b border-white/10 pb-2 inline-block">Shopping</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><Link to="/products" className="hover:text-tangerine transition-colors">Tous les produits</Link></li>
              <li><Link to="/cart" className="hover:text-tangerine transition-colors">Mon Panier</Link></li>
              <li><Link to="/profile" className="hover:text-tangerine transition-colors">Suivre ma commande</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-bold mb-6 border-b border-white/10 pb-2 inline-block">Aide</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="hover:text-tangerine cursor-pointer">FAQs</li>
              <li className="hover:text-tangerine cursor-pointer">Livraison</li>
              <li className="hover:text-tangerine cursor-pointer">Retours</li>
            </ul>
          </div>

          {/* Newsletter / Contact */}
          <div>
            <h4 className="text-lg font-bold mb-6 border-b border-white/10 pb-2 inline-block">Contact</h4>
            <p className="text-gray-400 text-sm mb-4">Besoin d'aide ?</p>
            <p className="text-pacific font-bold text-lg">support@recomind.ma</p>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-[10px] uppercase font-bold tracking-widest">
          <p>© 2026 RECOMIND STORE. TOUS DROITS RÉSERVÉS.</p>
          <div className="flex gap-6">
            <span className="hover:text-white cursor-pointer transition-colors">Instagram</span>
            <span className="hover:text-white cursor-pointer transition-colors">LinkedIn</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;