import { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "../components/ProductCard";
import api from "../services/api";
 
// ─── Animation Variants ───────────────────────────────────────────────────────
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const cardPop = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 80, damping: 16 } },
};
 
// ─── Smart category icon matcher ──────────────────────────────────────────────
// Maps keywords found in category names → relevant FA icon
const ICON_MAP = [
  { keys: ["femme","woman","women","elle","her","robe","mode","fashion","fille","girl","lady"], icon: "fa-person-dress",     color: "#F43F5E" },
  { keys: ["homme","man","men","lui","him","monsieur","garcon","boy"],                         icon: "fa-person",            color: "#3B82F6" },
  { keys: ["enfant","kid","kids","bebe","baby","child","enfants"],                             icon: "fa-child",             color: "#F97316" },
  { keys: ["electronique","electronic","tech","laptop","pc","computer","informatique"],        icon: "fa-laptop",            color: "#6366F1" },
  { keys: ["phone","mobile","smartphone","telephone","gsm","iphone","android"],               icon: "fa-mobile-screen",     color: "#8B5CF6" },
  { keys: ["maison","home","house","living","deco","meuble","furniture","salon"],              icon: "fa-couch",             color: "#10B981" },
  { keys: ["sport","gym","fitness","musculation","yoga","running","football","foot"],          icon: "fa-dumbbell",          color: "#EF4444" },
  { keys: ["cuisine","kitchen","cook","food","alimentation","manger","gastronomie"],           icon: "fa-utensils",          color: "#F59E0B" },
  { keys: ["livre","book","read","lecture","education","scolaire","papeterie"],                icon: "fa-book-open",         color: "#06B6D4" },
  { keys: ["jeux","game","gaming","jouet","toy","console","video"],                            icon: "fa-gamepad",           color: "#7C3AED" },
  { keys: ["photo","camera","photo","appareil","picture","image"],                             icon: "fa-camera",            color: "#0EA5E9" },
  { keys: ["bijou","jewelry","jewel","montre","watch","accessoire","sac","bag","handbag"],     icon: "fa-gem",               color: "#EC4899" },
  { keys: ["chaussure","shoe","shoes","basket","sneaker","botte","sandale"],                   icon: "fa-shoe-prints",       color: "#64748B" },
  { keys: ["beaute","beauty","cosmetic","cosmetique","parfum","soin","make","maquillage"],     icon: "fa-spray-can-sparkles",color: "#DB2777" },
  { keys: ["auto","car","voiture","vehicule","moto","automobile"],                             icon: "fa-car",               color: "#1D4ED8" },
  { keys: ["jardin","garden","plante","plant","exterieur","outdoor"],                          icon: "fa-seedling",          color: "#16A34A" },
  { keys: ["sante","health","medical","pharmacie","medicament"],                               icon: "fa-heart-pulse",       color: "#DC2626" },
  { keys: ["voyage","travel","valise","luggage","tourisme"],                                   icon: "fa-plane",             color: "#0284C7" },
  { keys: ["musique","music","son","audio","instrument","headphone","casque"],                 icon: "fa-headphones",        color: "#7C3AED" },
  { keys: ["bain","bathroom","hygiene","propre","clean"],                                      icon: "fa-bath",              color: "#0891B2" },
];
 
const DEFAULT_ICONS = [
  { icon: "fa-tag",        color: "#64748B" },
  { icon: "fa-star",       color: "#F59E0B" },
  { icon: "fa-box",        color: "#6366F1" },
  { icon: "fa-gift",       color: "#EC4899" },
  { icon: "fa-fire",       color: "#EF4444" },
  { icon: "fa-bolt",       color: "#F97316" },
  { icon: "fa-cube",       color: "#10B981" },
  { icon: "fa-heart",      color: "#F43F5E" },
];
 
function getCatIcon(name = "", index = 0) {
  const lower = name.toLowerCase();
  for (const entry of ICON_MAP) {
    if (entry.keys.some(k => lower.includes(k))) return { icon: entry.icon, color: entry.color };
  }
  return DEFAULT_ICONS[index % DEFAULT_ICONS.length];
}
 
// ─── Static Data ──────────────────────────────────────────────────────────────
const TABS   = ["All", "Best Seller", "New Arrival", "AI Picks", "Trending"];
const BADGES = ["HOT","NEW","AI","TOP","-20%","-30%","SALE","PICK"];
 
// ─── Countdown Hook ───────────────────────────────────────────────────────────
function useCountdown(init = 9 * 3600 + 54 * 60 + 12) {
  const [t, setT] = useState(init);
  useEffect(() => {
    const id = setInterval(() => setT(p => Math.max(0, p - 1)), 1000);
    return () => clearInterval(id);
  }, []);
  return {
    h: String(Math.floor(t / 3600)).padStart(2, "0"),
    m: String(Math.floor((t % 3600) / 60)).padStart(2, "0"),
    s: String(t % 60).padStart(2, "0"),
  };
}
 
// ─── Micro-components ─────────────────────────────────────────────────────────
const Stars = ({ n = 4 }) => (
  <span style={{ display:"flex", gap:2 }}>
    {[...Array(5)].map((_, i) => (
      <i key={i} className={`fa-${i < n ? "solid" : "regular"} fa-star`}
        style={{ fontSize: 9, color: i < n ? "#F97316" : "#CBD5E1" }} />
    ))}
  </span>
);
 
const SectionTitle = ({ icon, children, sub }) => (
  <div>
    {sub && (
      <div style={{ fontSize:10, fontWeight:700, color:"#0EA5E9", textTransform:"uppercase", letterSpacing:"0.2em", marginBottom:5, display:"flex", alignItems:"center", gap:7, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
        <i className={`fa-solid ${icon}`} />{sub}
      </div>
    )}
    <h2 style={{ fontWeight:900, fontSize:20, fontStyle:"italic", display:"flex", alignItems:"center", gap:10, fontFamily:"'Plus Jakarta Sans',sans-serif", margin:0 }}>
      <span style={{ display:"inline-block", width:4, height:"1em", background:"#0EA5E9", borderRadius:2, verticalAlign:"middle", flexShrink:0 }} />
      {children}
    </h2>
  </div>
);
 
const CountdownDigits = ({ h, m, s, dark = false }) => (
  <div style={{ display:"flex", gap:4, alignItems:"center" }}>
    {[h, m, s].map((u, i) => (
      <Fragment key={i}>
        <AnimatePresence mode="popLayout">
          <motion.span
            key={u}
            initial={{ y: -7, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 7, opacity: 0 }}
            transition={{ duration: .18 }}
            style={{ background: dark ? "rgba(0,0,0,0.3)" : "#F97316", color:"#fff", fontSize:12, fontWeight:900, padding:"3px 8px", borderRadius:7, minWidth:28, textAlign:"center", display:"inline-block", fontFamily:"'Plus Jakarta Sans',sans-serif" }}
          >
            {u}
          </motion.span>
        </AnimatePresence>
        {i < 2 && <span style={{ color: dark ? "rgba(255,255,255,0.6)" : "#F97316", fontWeight:900, fontSize:13 }}>:</span>}
      </Fragment>
    ))}
  </div>
);
 
// ═════════════════════════════════════════════════════════════════════════════
const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products,   setProducts]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [tab,        setTab]        = useState("All");
  const { h, m, s } = useCountdown();
 
  useEffect(() => {
    (async () => {
      try {
        const [c, p] = await Promise.all([api.get("/categories"), api.get("/products")]);
        setCategories(c.data.data || c.data || []);
        setProducts(p.data.data   || p.data   || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);
 
  if (loading) return (
    <div style={{ height:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"#F8F9FA", gap:20 }}>
      <motion.div
        animate={{ opacity:[0.15,1,0.15] }}
        transition={{ repeat:Infinity, duration:1.8 }}
        style={{ fontWeight:900, fontSize:"2rem", letterSpacing:"0.5em", color:"#1E293B", fontFamily:"'Plus Jakarta Sans',sans-serif" }}
      >
        RECOMIND
      </motion.div>
      <div style={{ width:160, height:3, background:"#E2E8F0", borderRadius:99, overflow:"hidden" }}>
        <motion.div
          animate={{ x:["-100%","100%"] }}
          transition={{ repeat:Infinity, duration:1.1, ease:"linear" }}
          style={{ height:"100%", width:"60%", background:"linear-gradient(90deg,#0EA5E9,#F97316)", borderRadius:99 }}
        />
      </div>
    </div>
  );
 
  const W = { maxWidth:1280, margin:"0 auto", padding:"0 20px" };
 
  return (
    <>
      <style>{`
        /* Font is loaded via index.html <link> tags — no @import needed here */
        *, *::before, *::after { box-sizing: border-box; }
 
        body, * {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
 
        @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes ripple { 0%{transform:scale(0.8);opacity:0.7} 100%{transform:scale(2.6);opacity:0} }
 
        .no-sb::-webkit-scrollbar{display:none}
        .no-sb{-ms-overflow-style:none;scrollbar-width:none}
        .lift{transition:transform .22s ease,box-shadow .22s ease}
        .lift:hover{transform:translateY(-5px);box-shadow:0 18px 44px rgba(0,0,0,0.1)!important}
        .img-zoom img{transition:transform .4s ease}
        .img-zoom:hover img{transform:scale(1.06)}
 
        /* ── Category cards — structure only, hover handled via JS ── */
        .cat-icon-wrap {
          position: relative;
          width: 72px; height: 72px; border-radius: 22px;
          background: #fff; border: 1.5px solid #E2E8F0;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 14px rgba(0,0,0,0.06);
          overflow: hidden;
        }
        .cat-bg {
          position: absolute; inset: 0;
          border-radius: inherit;
        }
        .cat-label {
          font-size: 11px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.08em; color: rgba(30,41,59,0.45);
          text-align: center; max-width: 82px; line-height: 1.35;
          transition: color .25s ease, font-weight .25s ease;
        }
      `}</style>
 
      <div style={{ background:"#F8F9FA", minHeight:"100vh", color:"#1E293B" }}>
 
        {/* ── TICKER ──────────────────────────────────────────────────────────── */}
        <div style={{ background:"#1E293B", color:"#fff", padding:"8px 0", overflow:"hidden", fontSize:10, fontWeight:700, letterSpacing:"0.18em" }}>
          <div style={{ display:"flex", whiteSpace:"nowrap", animation:"ticker 32s linear infinite" }}>
            {[...Array(2)].map((_,i) => (
              <span key={i} style={{ display:"flex", alignItems:"center", gap:36, paddingRight:36, textTransform:"uppercase" }}>
                {["🤖 AI-Powered Picks","🚚 Free Shipping Over 500 DH","⚡ Flash Sale Live Now","✨ New Arrivals Daily","💎 Premium Members Get 20% Off","🔥 Trending Now"].map((t,j) => (
                  <span key={j} style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <span style={{ width:4, height:4, borderRadius:"50%", background:"#F97316", display:"inline-block", flexShrink:0 }} />{t}
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
 
        {/* ── 1. HERO ─────────────────────────────────────────────────────────── */}
        <div style={{ ...W, paddingTop:20, paddingBottom:12 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 320px", gap:14, minHeight:370, alignItems:"stretch" }}>
 
            {/* Main panel */}
            <motion.div
              initial={{ opacity:0, y:22 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:.65, ease:[0.22,1,0.36,1] }}
              style={{ gridColumn:"span 2", background:"linear-gradient(135deg,#1E293B 0%,#0f1f35 100%)", borderRadius:26, overflow:"hidden", position:"relative", padding:"50px 56px", display:"flex", flexDirection:"column", justifyContent:"center" }}
            >
              <div style={{ position:"absolute", top:-80, right:-60, width:380, height:380, borderRadius:"50%", background:"rgba(14,165,233,0.12)", filter:"blur(70px)", pointerEvents:"none" }} />
              <div style={{ position:"absolute", bottom:-60, left:"38%", width:280, height:280, borderRadius:"50%", background:"rgba(249,115,22,0.09)", filter:"blur(55px)", pointerEvents:"none" }} />
              <div style={{ position:"absolute", top:0, right:0, width:"46%", height:"100%", pointerEvents:"none" }}>
                <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=700&q=80&fit=crop" alt="" style={{ width:"100%", height:"100%", objectFit:"cover", opacity:.3 }} />
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(to right,#1E293B 25%,transparent)" }} />
              </div>
 
              <div style={{ position:"relative", zIndex:2, maxWidth:520 }}>
                <motion.div initial={{ opacity:0, x:-18 }} animate={{ opacity:1, x:0 }} transition={{ delay:.15, duration:.5 }}
                  style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(14,165,233,0.15)", border:"1px solid rgba(14,165,233,0.28)", color:"#38BDF8", fontSize:10, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", padding:"6px 14px", borderRadius:999, marginBottom:18 }}>
                  <i className="fa-solid fa-microchip" /> AI-Powered Shopping
                </motion.div>
 
                <motion.h1 initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ delay:.25, duration:.6 }}
                  style={{ color:"#fff", fontSize:"clamp(2rem,3.8vw,3.5rem)", fontWeight:900, lineHeight:1.06, marginBottom:18, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                  Style that <span style={{ color:"#F97316" }}>Knows You.</span>
                </motion.h1>
 
                <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.38, duration:.5 }}
                  style={{ color:"rgba(255,255,255,0.48)", fontSize:15, lineHeight:1.7, maxWidth:400, marginBottom:28, fontWeight:500 }}>
                  Personalized picks powered by our hybrid AI engine. Shop smarter, live better.
                </motion.p>
 
                <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:.5, duration:.45 }}
                  style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:28 }}>
                  <Link to="/products"
                    style={{ background:"#F97316", color:"#fff", padding:"13px 30px", borderRadius:999, fontWeight:700, fontSize:14, display:"inline-flex", alignItems:"center", gap:8, boxShadow:"0 8px 24px rgba(249,115,22,0.4)", transition:"transform .2s", fontFamily:"'Plus Jakarta Sans',sans-serif" }}
                    onMouseEnter={e=>e.currentTarget.style.transform="scale(1.05)"}
                    onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
                    Shop Now <i className="fa-solid fa-arrow-right" />
                  </Link>
                  <Link to="/recommendations"
                    style={{ background:"rgba(255,255,255,0.09)", color:"#fff", padding:"13px 22px", borderRadius:999, fontWeight:600, fontSize:14, display:"inline-flex", alignItems:"center", gap:8, border:"1px solid rgba(255,255,255,0.14)", backdropFilter:"blur(8px)", transition:"background .2s" }}
                    onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.17)"}
                    onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.09)"}>
                    <i className="fa-solid fa-wand-magic-sparkles" style={{ color:"#0EA5E9" }} /> AI Picks
                  </Link>
                </motion.div>
 
                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.65 }}
                  style={{ display:"flex", gap:28, paddingTop:20, borderTop:"1px solid rgba(255,255,255,0.08)" }}>
                  {[{v:"50K+",l:"Products"},{v:"98%",l:"AI Accuracy"},{v:"4.9★",l:"Rating"},{v:"Free",l:"Returns"}].map(({v,l}) => (
                    <div key={l}>
                      <div style={{ color:"#fff", fontWeight:900, fontSize:15, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{v}</div>
                      <div style={{ color:"rgba(255,255,255,0.32)", fontSize:9, textTransform:"uppercase", letterSpacing:"0.1em", marginTop:2, fontWeight:600 }}>{l}</div>
                    </div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
 
            {/* Side column */}
            <motion.div initial={{ opacity:0, x:26 }} animate={{ opacity:1, x:0 }} transition={{ delay:.18, duration:.6, ease:[0.22,1,0.36,1] }}
              style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <div style={{ background:"#fff", borderRadius:22, padding:18, border:"1px solid #E2E8F0", flex:1, position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:0, right:0, background:"linear-gradient(135deg,#F97316,#ef4444)", color:"#fff", fontSize:9, fontWeight:900, letterSpacing:"0.12em", padding:"5px 14px 5px 10px", borderRadius:"0 22px 0 14px", textTransform:"uppercase", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                  Deal of the Day
                </div>
                {products[0] ? (
                  <Link to={`/product/${products[0].id_product}`} style={{ display:"flex", flexDirection:"column", alignItems:"center", textDecoration:"none" }}>
                    <div className="img-zoom" style={{ width:"100%", aspectRatio:"1", background:"#F8F9FA", borderRadius:14, overflow:"hidden", marginTop:18 }}>
                      <img src={`http://localhost:5000/${products[0].img_url}`} style={{ width:"100%", height:"100%", objectFit:"cover" }} alt="" />
                    </div>
                    <div style={{ marginTop:10, textAlign:"center" }}>
                      <div style={{ fontSize:11, fontWeight:600, color:"#1E293B", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:220 }}>{products[0].nom_produit}</div>
                      <div style={{ color:"#F97316", fontWeight:900, fontSize:19, marginTop:2, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{products[0].prix} DH</div>
                      <div style={{ display:"flex", justifyContent:"center", marginTop:4 }}><Stars n={5} /></div>
                    </div>
                  </Link>
                ) : <div style={{ aspectRatio:"1", background:"#F1F5F9", borderRadius:14, marginTop:18 }} />}
              </div>
              <div style={{ background:"linear-gradient(135deg,#0EA5E9,#0284c7)", borderRadius:18, padding:"14px 18px", color:"#fff" }}>
                <div style={{ fontSize:10, fontWeight:700, opacity:.7, textTransform:"uppercase", letterSpacing:"0.15em", marginBottom:8 }}>
                  <i className="fa-solid fa-bolt-lightning" style={{ marginRight:6 }} />Flash ends in
                </div>
                <CountdownDigits h={h} m={m} s={s} dark />
              </div>
            </motion.div>
          </div>
        </div>
 
        {/* ── 2. CATEGORIES — Animated with smart icons ─────────────────────── */}
        <div style={{ ...W, paddingTop:24, paddingBottom:20 }}>
          {/* Section label */}
          <motion.div
            initial={{ opacity:0, y:12 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}
          >
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ display:"inline-block", width:4, height:20, background:"#0EA5E9", borderRadius:2 }} />
              <h2 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:900, fontSize:18, fontStyle:"italic", margin:0 }}>Shop by Category</h2>
            </div>
            <Link to="/products" style={{ fontSize:10, fontWeight:700, color:"#0EA5E9", textTransform:"uppercase", letterSpacing:"0.14em", display:"flex", alignItems:"center", gap:4 }}>
              All Categories <i className="fa-solid fa-chevron-right" style={{ fontSize:8 }} />
            </Link>
          </motion.div>
 
          {/* Scrollable pill row — centered */}
          <motion.div
            variants={stagger} initial="hidden" whileInView="visible" viewport={{ once:true }}
            style={{ display:"flex", gap:24, justifyContent:"center", flexWrap:"wrap", paddingBottom:8 }}
          >
            {categories.map((cat, i) => {
              const { icon, color } = getCatIcon(cat.nom_categorie, i);
              const floatDuration = 2.4 + (i % 5) * 0.35;
              const floatDelay   = i * 0.15;
              return (
                <motion.div key={cat.id_categorie} variants={cardPop}>
                  {/* Float div — pauses on hover so no jump conflict */}
                  <motion.div
                    animate={{ y: [0, -9, 0] }}
                    whileHover={{ y: 0 }}               /* ← freeze float on hover */
                    transition={{ repeat: Infinity, duration: floatDuration, delay: floatDelay, ease: "easeInOut" }}
                    style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:10 }}
                  >
                    <Link
                      to={`/products?cat=${cat.id_categorie}`}
                      style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:10, textDecoration:"none", cursor:"pointer" }}
                      onMouseEnter={e => {
                        const wrap = e.currentTarget.querySelector(".cat-icon-wrap");
                        const bg   = e.currentTarget.querySelector(".cat-bg");
                        const ico  = e.currentTarget.querySelector(".cat-icon-inner");
                        const lbl  = e.currentTarget.querySelector(".cat-label");
                        if (wrap) { wrap.style.boxShadow = `0 12px 28px ${color}55`; wrap.style.borderColor = "transparent"; wrap.style.transform = "scale(1.1)"; }
                        if (bg)   bg.style.opacity = "1";
                        if (ico)  { ico.style.color = "#fff"; ico.style.transform = "scale(1.15) rotate(-6deg)"; }
                        if (lbl)  { lbl.style.color = "#1E293B"; lbl.style.fontWeight = "800"; }
                      }}
                      onMouseLeave={e => {
                        const wrap = e.currentTarget.querySelector(".cat-icon-wrap");
                        const bg   = e.currentTarget.querySelector(".cat-bg");
                        const ico  = e.currentTarget.querySelector(".cat-icon-inner");
                        const lbl  = e.currentTarget.querySelector(".cat-label");
                        if (wrap) { wrap.style.boxShadow = ""; wrap.style.borderColor = ""; wrap.style.transform = ""; }
                        if (bg)   bg.style.opacity = "0";
                        if (ico)  { ico.style.color = color; ico.style.transform = ""; }
                        if (lbl)  { lbl.style.color = ""; lbl.style.fontWeight = ""; }
                      }}
                    >
                      <div className="cat-icon-wrap" style={{ transition:"transform .3s cubic-bezier(0.22,1,0.36,1), box-shadow .3s ease, border-color .3s ease" }}>
                        <div className="cat-bg" style={{ background:`linear-gradient(135deg,${color},${color}cc)`, opacity:0, transition:"opacity .3s ease" }} />
                        <i className={`fa-solid ${icon} cat-icon-inner`}
                          style={{ color, fontSize:24, position:"relative", zIndex:2, transition:"color .3s ease, transform .3s cubic-bezier(0.22,1,0.36,1)" }} />
                      </div>
                      <span className="cat-label">{cat.nom_categorie}</span>
                    </Link>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
 
        {/* ── 3. FLASH SALE ───────────────────────────────────────────────────── */}
        <div style={{ ...W, paddingTop:4, paddingBottom:12 }}>
          <motion.div initial={{ opacity:0, y:22 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:.55 }}
            style={{ background:"#fff", borderRadius:26, border:"1px solid #E2E8F0" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 26px 16px", borderBottom:"1px solid #F1F5F9" }}>
              <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                <div style={{ position:"relative" }}>
                  <div style={{ position:"absolute", inset:0, background:"#F97316", borderRadius:13, filter:"blur(10px)", opacity:.4 }} />
                  <div style={{ position:"relative", width:44, height:44, borderRadius:13, background:"linear-gradient(135deg,#F97316,#ef4444)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:17 }}>
                    <i className="fa-solid fa-bolt-lightning" />
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight:900, fontSize:17, fontStyle:"italic", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Flash Sale</div>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:3 }}>
                    <span style={{ fontSize:10, color:"rgba(30,41,59,0.4)", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.1em" }}>Ends in</span>
                    <CountdownDigits h={h} m={m} s={s} />
                  </div>
                </div>
              </div>
              <Link to="/products" style={{ fontSize:10, fontWeight:900, color:"#0EA5E9", textTransform:"uppercase", letterSpacing:"0.14em", display:"flex", alignItems:"center", gap:4, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                View All <i className="fa-solid fa-chevron-right" style={{ fontSize:8 }} />
              </Link>
            </div>
            <div style={{ display:"flex", gap:14, overflowX:"auto", padding:"18px 26px" }} className="no-sb">
              {products.slice(0,8).map((p,i) => (
                <motion.div key={p.id_product} initial={{ opacity:0, x:18 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ delay:i*.055, duration:.4 }}
                  style={{ minWidth:195 }}>
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
 
        {/* ── 4. AMAZON WIDGET GRID ───────────────────────────────────────────── */}
        <div style={{ ...W, paddingTop:4, paddingBottom:12 }}>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once:true }}
            style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
 
            {/* Keep Shopping */}
            <motion.div variants={cardPop} className="lift" style={{ background:"#fff", borderRadius:22, padding:20, border:"1px solid #E2E8F0" }}>
              <div style={{ fontWeight:900, fontSize:13, marginBottom:14, display:"flex", alignItems:"center", gap:8, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                <i className="fa-solid fa-clock-rotate-left" style={{ color:"#CBD5E1" }} /> Keep Shopping
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:9 }}>
                {products.slice(4,8).map(p => (
                  <Link key={p.id_product} to={`/product/${p.id_product}`} className="img-zoom"
                    style={{ aspectRatio:"1", borderRadius:12, overflow:"hidden", background:"#F8F9FA", border:"1px solid #E2E8F0", display:"block" }}>
                    <img src={`http://localhost:5000/${p.img_url}`} style={{ width:"100%", height:"100%", objectFit:"cover" }} alt="" />
                  </Link>
                ))}
              </div>
              <Link to="/products" style={{ fontSize:10, color:"#0EA5E9", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", marginTop:12, display:"block" }}>See more →</Link>
            </motion.div>
 
            {/* AI Top Pick */}
            <motion.div variants={cardPop} className="lift" style={{ background:"#fff", borderRadius:22, padding:20, border:"1px solid #E2E8F0", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:12, right:12, background:"linear-gradient(135deg,#0EA5E9,#0284c7)", color:"#fff", fontSize:8, fontWeight:900, padding:"3px 9px", borderRadius:999, letterSpacing:"0.13em", textTransform:"uppercase", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                <i className="fa-solid fa-microchip" style={{ marginRight:4 }} />AI Pick
              </div>
              <div style={{ fontWeight:900, fontSize:13, marginBottom:12, display:"flex", alignItems:"center", gap:8, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                <i className="fa-solid fa-wand-magic-sparkles" style={{ color:"#0EA5E9" }} /> Top Selection
              </div>
              {products[8] && (
                <Link to={`/product/${products[8].id_product}`} className="img-zoom" style={{ display:"flex", flexDirection:"column", alignItems:"center", textDecoration:"none" }}>
                  <div style={{ width:"100%", aspectRatio:"1", borderRadius:14, overflow:"hidden", background:"#F8F9FA", border:"1px solid #E2E8F0" }}>
                    <img src={`http://localhost:5000/${products[8].img_url}`} style={{ width:"100%", height:"100%", objectFit:"cover" }} alt="" />
                  </div>
                  <div style={{ fontSize:11, fontWeight:600, textAlign:"center", marginTop:9, color:"#1E293B" }}>{products[8].nom_produit}</div>
                  <div style={{ color:"#F97316", fontWeight:900, fontSize:17, marginTop:3, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{products[8].prix} DH</div>
                  <div style={{ marginTop:3 }}><Stars n={5} /></div>
                </Link>
              )}
            </motion.div>
 
            {/* Category Explorer */}
            <motion.div variants={cardPop} className="lift" style={{ background:"#fff", borderRadius:22, padding:20, border:"1px solid #E2E8F0" }}>
              <div style={{ fontWeight:900, fontSize:13, marginBottom:12, display:"flex", alignItems:"center", gap:8, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                <i className="fa-solid fa-layer-group" style={{ color:"#CBD5E1" }} /> Explore More
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:9 }}>
                {categories.slice(0,4).map((cat,i) => {
                  const { icon, color } = getCatIcon(cat.nom_categorie, i);
                  return (
                    <Link key={cat.id_categorie} to={`/products?cat=${cat.id_categorie}`}
                      style={{ aspectRatio:"1", background:"#F8F9FA", borderRadius:13, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:6, border:"1px solid #E2E8F0", transition:"all .2s", textDecoration:"none" }}
                      onMouseEnter={e=>{e.currentTarget.style.background=`${color}12`;e.currentTarget.style.borderColor=`${color}44`;}}
                      onMouseLeave={e=>{e.currentTarget.style.background="#F8F9FA";e.currentTarget.style.borderColor="#E2E8F0";}}>
                      <i className={`fa-solid ${icon}`} style={{ color, fontSize:17 }} />
                      <span style={{ fontSize:8, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", color:"rgba(30,41,59,0.45)", textAlign:"center", padding:"0 4px" }}>{cat.nom_categorie}</span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
 
            {/* Premium */}
            <motion.div variants={cardPop} className="lift"
              style={{ background:"linear-gradient(145deg,#1E293B,#0f1f35)", borderRadius:22, padding:22, color:"#fff", display:"flex", flexDirection:"column", justifyContent:"space-between", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:-40, right:-40, width:150, height:150, borderRadius:"50%", background:"rgba(14,165,233,0.15)", filter:"blur(40px)" }} />
              <div style={{ position:"absolute", bottom:-30, left:-25, width:120, height:120, borderRadius:"50%", background:"rgba(249,115,22,0.12)", filter:"blur(30px)" }} />
              <div style={{ position:"relative", zIndex:1 }}>
                <div style={{ width:42, height:42, borderRadius:13, background:"rgba(14,165,233,0.2)", border:"1px solid rgba(14,165,233,0.3)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:14 }}>
                  <i className="fa-solid fa-gem" style={{ color:"#38BDF8", fontSize:17 }} />
                </div>
                <div style={{ fontWeight:900, fontSize:17, fontStyle:"italic", lineHeight:1.25, marginBottom:9, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Recomind<br/>Premium</div>
                <p style={{ fontSize:11, color:"rgba(255,255,255,0.32)", lineHeight:1.65, marginBottom:12, fontWeight:500 }}>Unlock AI-driven insights, early access & exclusive deals.</p>
                {["Priority AI Picks","Early Sale Access","VIP Support"].map(f => (
                  <div key={f} style={{ display:"flex", alignItems:"center", gap:7, fontSize:10, color:"rgba(255,255,255,0.48)", marginBottom:5, fontWeight:500 }}>
                    <i className="fa-solid fa-check" style={{ color:"#0EA5E9", fontSize:9 }} />{f}
                  </div>
                ))}
              </div>
              <button style={{ position:"relative", zIndex:1, width:"100%", padding:"12px 0", background:"linear-gradient(90deg,#F97316,#ef4444)", borderRadius:13, color:"#fff", fontSize:10, fontWeight:900, letterSpacing:"0.15em", textTransform:"uppercase", border:"none", cursor:"pointer", marginTop:16, boxShadow:"0 6px 20px rgba(249,115,22,0.4)", transition:"transform .2s", fontFamily:"'Plus Jakarta Sans',sans-serif" }}
                onMouseEnter={e=>e.currentTarget.style.transform="scale(1.03)"}
                onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
                Upgrade Now
              </button>
            </motion.div>
          </motion.div>
        </div>
 
        {/* ── 5. TODAY'S FOR YOU ──────────────────────────────────────────────── */}
        <div style={{ ...W, paddingTop:4, paddingBottom:12 }}>
          <motion.div initial={{ opacity:0, y:18 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            style={{ background:"#fff", borderRadius:26, border:"1px solid #E2E8F0", padding:"26px 26px 30px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:22, flexWrap:"wrap", gap:14 }}>
              <SectionTitle icon="fa-sparkles" sub="Curated for you">Today's For You</SectionTitle>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {TABS.map(t => (
                  <button key={t} onClick={() => setTab(t)}
                    style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", padding:"7px 15px", borderRadius:999, cursor:"pointer", transition:"all .2s", background: tab===t ? "#1E293B" : "#F8F9FA", color: tab===t ? "#fff" : "rgba(30,41,59,0.5)", border: tab===t ? "1.5px solid #1E293B" : "1.5px solid #E2E8F0", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                    {t === "AI Picks" && <i className="fa-solid fa-wand-magic-sparkles" style={{ marginRight:5, color:"#F97316" }} />}
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once:true }}
              style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(185px,1fr))", gap:14 }}>
              {products.slice(0,10).map(p => (
                <motion.div key={p.id_product} variants={cardPop} whileHover={{ y:-6, transition:{ duration:.2 } }}>
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </motion.div>
            <div style={{ textAlign:"center", marginTop:26 }}>
              <Link to="/products"
                style={{ display:"inline-flex", alignItems:"center", gap:8, border:"2px solid #1E293B", color:"#1E293B", padding:"12px 34px", borderRadius:999, fontWeight:800, fontSize:10, textTransform:"uppercase", letterSpacing:"0.14em", transition:"all .25s", fontFamily:"'Plus Jakarta Sans',sans-serif" }}
                onMouseEnter={e=>{e.currentTarget.style.background="#1E293B";e.currentTarget.style.color="#fff";}}
                onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="#1E293B";}}>
                Load More <i className="fa-solid fa-arrow-down" />
              </Link>
            </div>
          </motion.div>
        </div>
 
        {/* ── 6. STYLE CATEGORY BANNERS ───────────────────────────────────────── */}
        <div style={{ ...W, paddingTop:4, paddingBottom:12 }}>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once:true }}
            style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
            {[
              { title:"For Her",       sub:"Women's Fashion",   img:"https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=70&fit=crop", bg:"#FFF5F0" },
              { title:"For Him",       sub:"Men's Fashion",     img:"https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?w=400&q=70&fit=crop", bg:"#F0F8FF" },
              { title:"Home & Living", sub:"Upgrade your space", img:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=70&fit=crop", bg:"#F0FFF4" },
              { title:"Tech Picks",    sub:"Latest gadgets",    img:"https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=70&fit=crop", bg:"#F5F0FF" },
            ].map((card, i) => (
              <motion.div key={i} variants={cardPop} className="lift img-zoom"
                style={{ background:card.bg, borderRadius:20, overflow:"hidden", border:"1px solid rgba(0,0,0,0.05)", cursor:"pointer" }}>
                <div style={{ padding:"16px 16px 0" }}>
                  <div style={{ fontWeight:900, fontSize:13, color:"#1E293B", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{card.title}</div>
                  <div style={{ fontSize:10, color:"rgba(30,41,59,0.48)", fontWeight:500, marginTop:2 }}>{card.sub}</div>
                </div>
                <img src={card.img} alt="" style={{ width:"100%", height:130, objectFit:"cover", marginTop:10, display:"block" }} />
              </motion.div>
            ))}
          </motion.div>
        </div>
 
        {/* ── 7. BEST SELLERS ─────────────────────────────────────────────────── */}
        <div style={{ ...W, paddingTop:4, paddingBottom:12 }}>
          <motion.div initial={{ opacity:0, y:18 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            style={{ background:"#fff", borderRadius:26, border:"1px solid #E2E8F0", padding:"24px 26px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
              <SectionTitle icon="fa-fire">Best Sellers</SectionTitle>
              <Link to="/products" style={{ fontSize:10, fontWeight:900, color:"#0EA5E9", textTransform:"uppercase", letterSpacing:"0.14em", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>View All →</Link>
            </div>
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once:true }}
              style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(165px,1fr))", gap:13 }}>
              {products.slice(1,7).map((p,i) => (
                <motion.div key={p.id_product} variants={cardPop} whileHover={{ y:-5, transition:{ duration:.18 } }}>
                  <div style={{ position:"relative" }}>
                    <div style={{ position:"absolute", top:8, left:8, zIndex:10, background: i < 3 ? "linear-gradient(135deg,#F97316,#ef4444)" : "#1E293B", color:"#fff", fontSize:8, fontWeight:900, padding:"3px 7px", borderRadius:999, fontFamily:"'Plus Jakarta Sans',sans-serif", letterSpacing:"0.1em" }}>
                      {BADGES[i % BADGES.length]}
                    </div>
                    <ProductCard product={p} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
 
        {/* ── 8. NEWSLETTER ───────────────────────────────────────────────────── */}
        <div style={{ ...W, paddingTop:4, paddingBottom:12 }}>
          <motion.div initial={{ opacity:0, y:18 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            style={{ background:"#EFF6FF", borderRadius:24, border:"1px solid #BFDBFE", padding:"28px 36px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:20, flexWrap:"wrap" }}>
            <div style={{ display:"flex", alignItems:"center", gap:18 }}>
              <div style={{ width:50, height:50, borderRadius:15, background:"linear-gradient(135deg,#0EA5E9,#0284c7)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"0 6px 18px rgba(14,165,233,0.35)" }}>
                <i className="fa-solid fa-envelope" style={{ color:"#fff", fontSize:19 }} />
              </div>
              <div>
                <div style={{ fontWeight:900, fontSize:15, color:"#0C4A6E", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Subscribe to the Newsletter</div>
                <div style={{ fontSize:12, color:"#0369A1", marginTop:2, fontWeight:500 }}>Get exclusive deals & AI picks delivered to your inbox</div>
              </div>
            </div>
            <div style={{ display:"flex", gap:9, flexShrink:0 }}>
              <input type="email" placeholder="Enter your email…"
                style={{ padding:"10px 18px", borderRadius:999, border:"1.5px solid #BAE6FD", fontSize:13, outline:"none", width:230, background:"#fff", color:"#0C4A6E", fontWeight:500 }} />
              <button
                style={{ background:"linear-gradient(90deg,#0EA5E9,#0284c7)", color:"#fff", padding:"10px 22px", borderRadius:999, fontWeight:800, fontSize:10, letterSpacing:"0.12em", textTransform:"uppercase", border:"none", cursor:"pointer", boxShadow:"0 4px 14px rgba(14,165,233,0.3)", transition:"transform .2s", fontFamily:"'Plus Jakarta Sans',sans-serif" }}
                onMouseEnter={e=>e.currentTarget.style.transform="scale(1.04)"}
                onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
 
        {/* ── 9. FOOTER BANNER ────────────────────────────────────────────────── */}
        <div style={{ ...W, paddingTop:4, paddingBottom:40 }}>
          <motion.div initial={{ opacity:0, scale:.97 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }} transition={{ duration:.7, ease:[0.22,1,0.36,1] }}
            style={{ borderRadius:32, overflow:"hidden", position:"relative", minHeight:340 }}>
            <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&q=80&fit=crop" alt=""
              style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }} />
            <div style={{ position:"absolute", inset:0, background:"linear-gradient(to right,rgba(15,31,53,0.94) 38%,rgba(15,31,53,0.45))" }} />
            <div style={{ position:"absolute", top:0, left:0, width:360, height:360, borderRadius:"50%", background:"rgba(14,165,233,0.12)", filter:"blur(90px)" }} />
            <div style={{ position:"absolute", bottom:-30, right:80, width:280, height:280, borderRadius:"50%", background:"rgba(249,115,22,0.1)", filter:"blur(70px)" }} />
            <div style={{ position:"relative", zIndex:2, padding:"60px 60px", maxWidth:580 }}>
              <div style={{ fontSize:10, fontWeight:700, color:"#38BDF8", textTransform:"uppercase", letterSpacing:"0.22em", marginBottom:16, display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ display:"inline-block", width:28, height:1, background:"#38BDF8" }} />New Season 2025
              </div>
              <h2 style={{ color:"#fff", fontSize:"clamp(1.9rem,4vw,3.5rem)", fontWeight:900, fontStyle:"italic", lineHeight:1.09, marginBottom:18, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                Let's Shop Beyond{" "}
                <span style={{ position:"relative", display:"inline-block" }}>
                  Boundaries.
                  <span style={{ position:"absolute", bottom:-4, left:0, right:0, height:3, background:"linear-gradient(90deg,#0EA5E9,#F97316)", borderRadius:99 }} />
                </span>
              </h2>
              <p style={{ color:"rgba(255,255,255,0.42)", fontSize:15, lineHeight:1.7, maxWidth:400, marginBottom:32, fontWeight:500 }}>
                Discover products tailored to you by our AI engine, every single day.
              </p>
              <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:36 }}>
                <Link to="/products"
                  style={{ background:"#fff", color:"#1E293B", padding:"14px 34px", borderRadius:999, fontWeight:800, fontSize:14, fontFamily:"'Plus Jakarta Sans',sans-serif", display:"inline-flex", alignItems:"center", gap:8, boxShadow:"0 8px 28px rgba(0,0,0,0.18)", transition:"all .25s" }}
                  onMouseEnter={e=>{e.currentTarget.style.background="#0EA5E9";e.currentTarget.style.color="#fff";}}
                  onMouseLeave={e=>{e.currentTarget.style.background="#fff";e.currentTarget.style.color="#1E293B";}}>
                  Get Started <i className="fa-solid fa-paper-plane" />
                </Link>
                <Link to="/about"
                  style={{ color:"rgba(255,255,255,0.55)", fontSize:14, display:"inline-flex", alignItems:"center", gap:8, padding:"14px 0", fontWeight:500, textDecoration:"underline", textUnderlineOffset:4, transition:"color .2s" }}
                  onMouseEnter={e=>e.currentTarget.style.color="#fff"}
                  onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.55)"}>
                  Learn More
                </Link>
              </div>
              <div style={{ display:"flex", gap:28, paddingTop:28, borderTop:"1px solid rgba(255,255,255,0.1)" }}>
                {[{v:"50K+",l:"Products"},{v:"98%",l:"AI Accuracy"},{v:"4.9★",l:"Rating"},{v:"120K+",l:"Happy Clients"}].map(({v,l}) => (
                  <div key={l}>
                    <div style={{ color:"#fff", fontWeight:900, fontSize:17, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{v}</div>
                    <div style={{ color:"rgba(255,255,255,0.32)", fontSize:9, textTransform:"uppercase", letterSpacing:"0.1em", marginTop:2, fontWeight:600 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
 
      </div>
    </>
  );
};
 
export default Home;