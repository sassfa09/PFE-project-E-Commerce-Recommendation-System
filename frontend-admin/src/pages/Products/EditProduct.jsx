import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";

const EditProduct = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  
  const [formData, setFormData] = useState({
    nom_produit: "",
    prix: "",
    stock: "",
    id_categorie: "",
    description: "", 
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const catRes = await API.get("/categories");
        setCategories(catRes.data.data || catRes.data);

     
        const prodRes = await API.get(`/products/${id}`);
        const product = prodRes.data.data;
        
        setFormData({
          nom_produit: product.nom_produit,
          prix: product.prix,
          stock: product.stock,
          id_categorie: product.id_categorie,
          description: product.description || "", 
        });

      
        const fullImageUrl = product.img_url?.startsWith('http') 
          ? product.img_url 
          : `http://localhost:5000/${product.img_url}`;
        
        setPreview(product.img_url ? fullImageUrl : "");
        setLoading(false);
      } catch (err) {
        console.error("Erreur fetching data:", err);
        alert("Impossible de charger le produit");
        navigate("/admin/products");
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setPreview(URL.createObjectURL(file)); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("nom_produit", formData.nom_produit);
    data.append("prix", formData.prix);
    data.append("stock", formData.stock);
    data.append("id_categorie", formData.id_categorie);
    data.append("description", formData.description); 
    
    if (imageFile) data.append("image_file", imageFile);

    try {
      const token = localStorage.getItem("adminToken");
      await API.put(`/products/${id}`, data, {
        headers: { 
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}` 
        },
      });
      alert("Produit modifié avec succès !");
      navigate("/admin/products"); 
    } catch (err) {
      console.error("Update error:", err);
      alert("Erreur lors de la modification");
    }
  };

  if (loading) return <div className="p-10 text-center font-bold text-slate-blue">Chargement des données...</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white rounded-[2.5rem] shadow-sm border border-platinum mt-10 animate-fade-in text-left">
      <div className="flex items-center gap-3 mb-6">
         <div className="w-10 h-10 bg-pacific/10 rounded-xl flex items-center justify-center text-pacific">
            <i className="fa-solid fa-pen-to-square"></i>
         </div>
         <h2 className="text-2xl font-black text-slate-blue tracking-tight">Modifier le Produit</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Nom */}
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Nom du Produit</label>
          <input
            type="text" name="nom_produit" value={formData.nom_produit} onChange={handleChange}
            className="w-full p-4 bg-slate-50 border border-platinum rounded-2xl outline-none focus:border-pacific focus:ring-4 focus:ring-pacific/5 transition-all"
            required
          />
        </div>

        {/* Description  */}
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Description</label>
          <textarea
            name="description" value={formData.description} onChange={handleChange}
            className="w-full p-4 bg-slate-50 border border-platinum rounded-2xl outline-none focus:border-pacific focus:ring-4 focus:ring-pacific/5 transition-all h-32 resize-none"
            placeholder="Détails du produit..."
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Prix */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Prix (DH)</label>
            <input
              type="number" name="prix" value={formData.prix} onChange={handleChange}
              className="w-full p-4 bg-slate-50 border border-platinum rounded-2xl outline-none"
              required
            />
          </div>
          {/* Stock */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Stock</label>
            <input
              type="number" name="stock" value={formData.stock} onChange={handleChange}
              className="w-full p-4 bg-slate-50 border border-platinum rounded-2xl outline-none"
              required
            />
          </div>
        </div>

        {/* Catégorie */}
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Catégorie</label>
          <select
            name="id_categorie" value={formData.id_categorie} onChange={handleChange}
            className="w-full p-4 bg-slate-50 border border-platinum rounded-2xl outline-none"
            required
          >
            <option value="">Sélectionner une catégorie</option>
            {categories.map((cat) => (
              <option key={cat.id_categorie} value={cat.id_categorie}>
                {cat.nom_categorie}
              </option>
            ))}
          </select>
        </div>

        {/* Image */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-platinum border-dashed">
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 text-center">Image du Produit</label>
          <div className="flex flex-col items-center">
            {preview && (
              <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-2xl mb-4 border shadow-sm" />
            )}
            <input 
              type="file" 
              onChange={handleFileChange} 
              className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pacific/10 file:text-pacific hover:file:bg-pacific/20 cursor-pointer transition-all" 
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button type="submit" className="flex-1 bg-slate-blue text-white py-4 rounded-2xl font-black shadow-xl shadow-slate-blue/20 hover:bg-pacific hover:scale-[1.02] active:scale-[0.98] transition-all">
            <i className="fa-solid fa-check mr-2"></i> Enregistrer
          </button>
          <button type="button" onClick={() => navigate("/admin/products")} className="px-8 py-4 bg-slate-100 text-gray-500 rounded-2xl font-bold hover:bg-slate-200 transition-all">
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;