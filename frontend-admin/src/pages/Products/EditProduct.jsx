import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";

const EditProduct = () => {
  const { id } = useParams(); // كيجيب ID من الرابط
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  
  const [formData, setFormData] = useState({
    nom_produit: "",
    prix: "",
    stock: "",
    id_categorie: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. نجيبو التصنيفات
        const catRes = await API.get("/categories");
        setCategories(catRes.data.data || catRes.data);

        // 2. نجيبو بيانات البرودوي الحالي
        const prodRes = await API.get(`/products/${id}`);
        const product = prodRes.data.data;
        
        setFormData({
          nom_produit: product.nom_produit,
          prix: product.prix,
          stock: product.stock,
          id_categorie: product.id_categorie,
        });
        setPreview(product.img_url ? `http://localhost:5000/${product.img_url}` : "");
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
    setPreview(URL.createObjectURL(file)); // كايورينا التصويرة الجديدة قبل ما نطلعوها
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("nom_produit", formData.nom_produit);
    data.append("prix", formData.prix);
    data.append("stock", formData.stock);
    data.append("id_categorie", formData.id_categorie);
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
      navigate("/admin/products"); // رجوع للجدول
    } catch (err) {
      alert("Erreur lors de la modification");
    }
  };

  if (loading) return <div className="p-10 text-center">Chargement...</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white rounded-3xl shadow-sm border border-platinum mt-10">
      <h2 className="text-2xl font-black text-slate-blue mb-6">Modifier le Produit</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-500 mb-1">Nom du Produit</label>
          <input
            type="text" name="nom_produit" value={formData.nom_produit} onChange={handleChange}
            className="w-full p-3 bg-slate-50 border border-platinum rounded-xl outline-none focus:border-pacific"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-500 mb-1">Prix (DH)</label>
            <input
              type="number" name="prix" value={formData.prix} onChange={handleChange}
              className="w-full p-3 bg-slate-50 border border-platinum rounded-xl outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-500 mb-1">Stock</label>
            <input
              type="number" name="stock" value={formData.stock} onChange={handleChange}
              className="w-full p-3 bg-slate-50 border border-platinum rounded-xl outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-500 mb-1">Catégorie</label>
          <select
            name="id_categorie" value={formData.id_categorie} onChange={handleChange}
            className="w-full p-3 bg-slate-50 border border-platinum rounded-xl outline-none"
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

        <div>
          <label className="block text-sm font-bold text-gray-500 mb-1">Image du Produit</label>
          {preview && (
            <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-xl mb-3 border" />
          )}
          <input type="file" onChange={handleFileChange} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pacific file:text-white hover:file:bg-slate-blue transition-all" />
        </div>

        <div className="flex gap-3 pt-4">
          <button type="submit" className="flex-1 bg-pacific text-white py-3 rounded-xl font-bold shadow-lg shadow-pacific/20 hover:scale-[1.02] transition-all">
            Enregistrer les modifications
          </button>
          <button type="button" onClick={() => navigate("/admin/products")} className="px-6 py-3 bg-slate-100 text-gray-500 rounded-xl font-bold hover:bg-slate-200 transition-all">
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;