import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#326273] text-white pt-20 pb-10 mt-20 relative overflow-hidden">
      {/* لمسة فنية: دائرة ملونة خفيفة في الخلفية */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#5C9EAD] opacity-5 rounded-full -mr-32 -mt-32"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Section */}
          <div className="space-y-6">
            <Link to="/" className="text-2xl font-black tracking-tighter flex items-center gap-1">
              RECO<span className="text-[#E39774]">MIND</span>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed max-w-xs">
              Votre destination préférée pour un shopping intelligent et créatif. Nous combinons technologie et style pour une expérience unique.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center hover:bg-[#5C9EAD] transition-all group">
                <i className="fa-brands fa-instagram text-white group-hover:scale-110"></i>
              </a>
              <a href="#" className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center hover:bg-[#5C9EAD] transition-all group">
                <i className="fa-brands fa-facebook-f text-white group-hover:scale-110"></i>
              </a>
              <a href="#" className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center hover:bg-[#5C9EAD] transition-all group">
                <i className="fa-brands fa-linkedin-in text-white group-hover:scale-110"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-[0.2em] mb-8 text-[#E39774]">Shopping</h4>
            <ul className="space-y-4 text-gray-300 text-sm">
              <li><Link to="/products" className="hover:text-[#5C9EAD] hover:translate-x-1 inline-block transition-all">Tous les produits</Link></li>
              <li><Link to="/cart" className="hover:text-[#5C9EAD] hover:translate-x-1 inline-block transition-all">Mon Panier</Link></li>
              <li><Link to="/my-orders" className="hover:text-[#5C9EAD] hover:translate-x-1 inline-block transition-all">Mes Commandes</Link></li>
              <li><Link to="/profile" className="hover:text-[#5C9EAD] hover:translate-x-1 inline-block transition-all">Mon Compte</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-[0.2em] mb-8 text-[#E39774]">Aide</h4>
            <ul className="space-y-4 text-gray-300 text-sm">
              <li className="hover:text-[#5C9EAD] cursor-pointer transition-colors">FAQs & Aide</li>
              <li className="hover:text-[#5C9EAD] cursor-pointer transition-colors">Livraison Rapide</li>
              <li className="hover:text-[#5C9EAD] cursor-pointer transition-colors">Retours & Remboursements</li>
              <li className="hover:text-[#5C9EAD] cursor-pointer transition-colors">Confidentialité</li>
            </ul>
          </div>

          {/* Newsletter / Contact */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-[0.2em] mb-8 text-[#E39774]">Contact</h4>
            <p className="text-gray-300 text-sm mb-2">Une question ? Écrivez-nous :</p>
            <p className="text-[#5C9EAD] font-black text-lg mb-6 select-all">support@recomind.ma</p>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
               <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Service Client</p>
               <p className="text-sm font-bold text-white tracking-wide">+212 600 000 000</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em]">
            © 2026 RECOMIND STORE. TOUS DROITS RÉSERVÉS.
          </p>
          
          <div className="flex items-center gap-8">
            <div className="flex gap-4 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
               <i className="fa-brands fa-cc-visa text-2xl"></i>
               <i className="fa-brands fa-cc-mastercard text-2xl"></i>
               <i className="fa-brands fa-cc-paypal text-2xl"></i>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;