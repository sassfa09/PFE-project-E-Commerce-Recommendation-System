import { useState, useEffect } from "react";
import API from "../../services/api";

const AddProduct = () => {
  const [categories, setCategories] = useState([]);
  const [imageType, setImageType] = useState("url"); // 'url' أو 'file'
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nom_produit: "",
    id_categorie: "",
    prix: "",
    stock: "",
    imageData: "" 
  });

  // 1. جلب الكاتيغوريات باش نعمرو الـ Dropdown
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await API.get("/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement des catégories:", err);
      }
    };
    fetchCats();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, imageData: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // جلب التوكن بـ السمية اللي سيفنا فـ الـ Login
    const token = localStorage.getItem("adminToken");

    if (!token) {
      alert("Erreur: Vous n'êtes pas connecté en tant qu'admin !");
      setLoading(false);
      return;
    }

    // استعمال FormData لإرسال الملفات والبيانات
    const data = new FormData();
    data.append("nom_produit", formData.nom_produit);
    data.append("id_categorie", formData.id_categorie);
    data.append("prix", formData.prix);
    data.append("stock", formData.stock);
    
    if (imageType === "url") {
      data.append("image_url", formData.imageData);
    } else {
      data.append("image_file", formData.imageData); // هادا هو req.file فـ الباكيند
    }

    try {
      const response = await API.post("/products", data, {
        headers: { 
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}` // صيفطنا التوكن باش الـ Middleware تقبلنا
        }
      });

      alert(" Produit ajouté avec succès !");
      // مسح الفورم بعد النجاح
      setFormData({ nom_produit: "", id_categorie: "", prix: "", stock: "", imageData: "" });
    } catch (err) {
      console.error("Détails de l'erreur:", err.response?.data);
      alert(err.response?.data?.message || "Erreur lors de l'ajout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-pacific/10 rounded-2xl flex items-center justify-center text-pacific text-2xl">
          <i className="fa-solid fa-box-open"></i>
        </div>
        <h1 className="text-3xl font-black text-slate-blue tracking-tight">Ajouter un Produit</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-platinum space-y-8">
        
        {/* Nom du produit */}
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Nom du produit</label>
          <input 
            type="text" name="nom_produit" value={formData.nom_produit} onChange={handleChange}
            className="w-full p-4 bg-slate-50 border border-platinum rounded-2xl focus:ring-4 focus:ring-pacific/5 focus:border-pacific outline-none transition-all"
            placeholder="Ex: Nike Air Max 270" required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Dropdown Catégories */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Catégorie</label>
            <select 
              name="id_categorie" value={formData.id_categorie} onChange={handleChange} required
              className="w-full p-4 bg-slate-50 border border-platinum rounded-2xl outline-none focus:border-pacific"
            >
              <option value="">Choisir une catégorie</option>
              {categories.map(cat => (
                <option key={cat.id_categorie} value={cat.id_categorie}>
                  {cat.nom_categorie}
                </option>
              ))}
            </select>
          </div>

          {/* Prix */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Prix (DH)</label>
            <input 
              type="number" name="prix" value={formData.prix} onChange={handleChange}
              className="w-full p-4 bg-slate-50 border border-platinum rounded-2xl outline-none focus:border-pacific"
              placeholder="0.00" required
            />
          </div>
        </div>

        {/* Section Image */}
        <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-dashed border-platinum">
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4 ml-1 text-center">Image du produit</label>
          <div className="flex justify-center gap-4 mb-6">
            <button 
              type="button" 
              onClick={() => { setImageType("url"); setFormData({...formData, imageData: ""}) }}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${imageType === 'url' ? 'bg-slate-blue text-white shadow-lg' : 'bg-white text-gray-500 border border-platinum'}`}
            >
              Lien URL
            </button>
            <button 
              type="button" 
              onClick={() => { setImageType("file"); setFormData({...formData, imageData: ""}) }}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${imageType === 'file' ? 'bg-slate-blue text-white shadow-lg' : 'bg-white text-gray-500 border border-platinum'}`}
            >
              Importer Image
            </button>
          </div>

          {imageType === "url" ? (
            <input 
              type="text" name="imageData" value={formData.imageData} onChange={handleChange}
              className="w-full p-4 bg-white border border-platinum rounded-2xl outline-none focus:border-pacific shadow-sm"
              placeholder="https://example.com/image.jpg"
            />
          ) : (
            <div className="relative group">
               <input 
                type="file" onChange={handleFileChange}
                className="w-full p-4 bg-white border border-platinum rounded-2xl outline-none cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pacific/10 file:text-pacific hover:file:bg-pacific/20"
                accept="image/*"
              />
            </div>
          )}
        </div>

        {/* Stock */}
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Quantité disponible</label>
          <input 
            type="number" name="stock" value={formData.stock} onChange={handleChange}
            className="w-full p-4 bg-slate-50 border border-platinum rounded-2xl outline-none focus:border-pacific"
            placeholder="Ex: 100" required
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-slate-blue text-white py-5 rounded-[1.5rem] font-black text-lg hover:bg-pacific transition-all shadow-xl shadow-slate-blue/20 flex items-center justify-center gap-3 active:scale-[0.98]"
        >
          {loading ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-cloud-arrow-up"></i>}
          {loading ? "Enregistrement..." : "Enregistrer le produit"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;