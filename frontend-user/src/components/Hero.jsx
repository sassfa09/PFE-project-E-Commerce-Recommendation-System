import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative container mx-auto px-4 md:px-6 py-10">
    
      <div className="relative overflow-hidden rounded-[3rem] bg-[#326273] min-h-[550px] flex items-center shadow-2xl shadow-[#326273]/20">
        
        {/* Background Decorative Elements */}
        
        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-[#5C9EAD]/20 to-transparent z-0"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#E39774]/10 rounded-full blur-[100px] z-0"></div>

        <div className="container mx-auto px-8 md:px-16 flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          
          {/* Left Side: Content */}
          <div className="flex-1 text-center md:text-left animate-in fade-in slide-in-from-left duration-1000">
            <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl px-5 py-2 rounded-full mb-8 border border-white/10">
              <span className="w-2 h-2 bg-[#E39774] rounded-full animate-pulse shadow-[0_0_10px_#E39774]"></span>
              <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">
                Smart Recommendation Engine 2.0
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] mb-8 tracking-tighter">
              Shopping <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E39774] to-[#ffb08e]">
                Redefined.
              </span>
            </h1>
            
            <p className="text-[#EEEEEE]/70 text-lg mb-12 max-w-lg font-medium leading-relaxed">
              Ne cherchez plus. Notre technologie analyse vos goûts pour vous proposer des pépites sélectionnées spécialement pour vous.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center md:justify-start">
              {/* Button Shop Now - Tangerine Dream (#E39774) */}
              <Link to="/products" className="bg-[#E39774] text-white px-12 py-4 rounded-2xl font-black hover:bg-white hover:text-[#326273] transition-all shadow-xl shadow-[#E39774]/20 active:scale-95 text-center tracking-tight">
                Shop Now
              </Link>
              <button className="bg-white/5 backdrop-blur-md border border-white/10 text-white px-10 py-4 rounded-2xl font-black hover:bg-white/10 transition-all text-center">
                Learn More
              </button>
            </div>
          </div>

          {/* Right Side: Visual Image */}
          <div className="flex-1 relative group w-full max-w-lg md:max-w-none">
            {/* Glow effect */}
            <div className="absolute -inset-10 bg-[#5C9EAD]/20 rounded-full blur-[100px] group-hover:bg-[#E39774]/20 transition-colors duration-1000"></div>
            
            {/* Main Hero Image */}
            <div className="relative transition-transform duration-700 hover:scale-105">
              <img 
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800" 
                alt="Hero Product" 
                className="w-full h-auto drop-shadow-[0_50px_50px_rgba(0,0,0,0.4)] transform -rotate-12 group-hover:rotate-0 transition-all duration-700 ease-out"
              />
              
              {/* Floating Badge - Platinum (#EEEEEE) Background */}
              <div className="absolute -top-4 -right-4 bg-white p-5 rounded-[2rem] shadow-2xl border border-[#EEEEEE] hidden lg:block animate-bounce-slow">
                <div className="flex items-center gap-4">
                  <div className="bg-[#E39774]/10 p-3 rounded-2xl text-[#E39774] text-xl font-black">
                    -40%
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Offre limitée</p>
                    <p className="text-sm font-black text-[#326273] tracking-tighter">Premium Collection</p>
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