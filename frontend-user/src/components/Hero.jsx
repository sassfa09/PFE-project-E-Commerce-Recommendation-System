import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative container mx-auto px-6 py-6">
      {/* Main Container with Gradient Background */}
      <div className="relative overflow-hidden rounded-[40px] bg-slate-blue min-h-[500px] flex items-center shadow-2xl shadow-slate-blue/20">
        
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-pacific/20 to-transparent z-0"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-tangerine/10 rounded-full blur-[100px] z-0"></div>

        <div className="container mx-auto px-12 flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          
          {/* Left Side: Content */}
          <div className="flex-1 text-center md:text-left animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/10">
              <span className="w-2 h-2 bg-tangerine rounded-full animate-ping"></span>
              <span className="text-white text-xs font-black uppercase tracking-widest">
                AI Recommendation Engine 2.0
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tighter">
              Shopping <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-tangerine to-orange-400">
                Redefined.
              </span>
            </h1>
            
            <p className="text-gray-300 text-lg mb-10 max-w-lg font-medium leading-relaxed">
              Ne cherchez plus. Notre IA analyse vos goûts pour vous proposer les meilleurs produits, sélectionnés rien que pour vous.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center md:justify-start">
              <Link to="/products" className="bg-tangerine text-white px-10 py-4 rounded-2xl font-black hover:bg-white hover:text-tangerine transition-all shadow-xl shadow-tangerine/30 active:scale-95 text-center">
                Shop Now
              </Link>
              <button className="bg-white/5 backdrop-blur-sm border border-white/20 text-white px-10 py-4 rounded-2xl font-black hover:bg-white/10 transition-all text-center">
                Learn More
              </button>
            </div>
          </div>

          {/* Right Side: Visual Image */}
          <div className="flex-1 relative group">
            <div className="absolute -inset-10 bg-pacific/30 rounded-full blur-[80px] group-hover:bg-tangerine/20 transition-colors duration-1000"></div>
            
            {/* Main Hero Image with Floating Animation */}
            <div className="relative animate-float">
              <img 
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800" 
                alt="Hero Product" 
                className="w-full h-auto drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)] transform -rotate-12 group-hover:rotate-0 transition-transform duration-700"
              />
              
              {/* Floating Badge */}
              <div className="absolute -top-4 -right-4 bg-white p-4 rounded-3xl shadow-2xl border border-gray-100 hidden md:block animate-bounce-slow">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-xl text-green-600 text-xl font-black">
                    -40%
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase">Flash Sale</p>
                    <p className="text-sm font-black text-slate-blue tracking-tighter">Running Shoes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;