import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

const AddCategory = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nom_categorie: "",
    description: "",
  });

  // تحديث القيم عند الكتابة
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // إرسال البيانات للباكيند
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // كانديرو POST للباكيند (تأكد أن المسار هو /api/categories)
      await API.post("/categories", formData);
      
      alert("Catégorie ajoutée avec succès !");
      
      // من بعد ما تزيد الكاتيغوري، نرجعو لصفحة المنتجات أو الداشبورد
      navigate("/dashboard"); 
    } catch (err) {
      console.error("Erreur lors de l'ajout:", err);
      alert(err.response?.data?.message || "Erreur lors de la création de la catégorie");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto animate-fade-in">
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-black text-slate-blue tracking-tight">
          Nouvelle Catégorie
        </h1>
        <p className="text-gray-500 mt-2">
          Ajoutez une catégorie pour classer vos produits (ex: Sneakers, Accessoires).
        </p>
      </div>

      <form 
        onSubmit={handleSubmit} 
        className="bg-white p-8 rounded-3xl border border-platinum shadow-sm space-y-6"
      >
        {/* Nom de la Catégorie */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-blue ml-1">
            Nom de la Catégorie
          </label>
          <input
            type="text"
            name="nom_categorie"
            value={formData.nom_categorie}
            onChange={handleChange}
            placeholder="Ex: Chaussures de sport"
            required
            className="w-full px-4 py-3 rounded-xl border border-platinum focus:border-pacific focus:ring-2 focus:ring-pacific/10 outline-none transition-all"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-blue ml-1">
            Description (Détails)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Décrivez brièvement les produits de cette catégorie..."
            className="w-full px-4 py-3 rounded-xl border border-platinum focus:border-pacific focus:ring-2 focus:ring-pacific/10 outline-none transition-all resize-none"
          ></textarea>
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 py-4 bg-platinum text-slate-blue rounded-xl font-bold hover:bg-gray-200 transition-all"
          >
            Annuler
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="flex-[2] py-4 bg-tangerine text-white rounded-xl font-bold shadow-lg shadow-tangerine/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <i className="fa-solid fa-spinner animate-spin"></i> Enregistrement...
              </span>
            ) : (
              "Créer la catégorie"
            )}
          </button>
        </div>
      </form>

      {/* Quick Help Tip */}
      <div className="mt-8 p-4 bg-pacific/5 rounded-2xl border border-pacific/10">
        <p className="text-xs text-pacific font-medium leading-relaxed">
          <i className="fa-solid fa-lightbulb mr-2"></i>
          Une fois la catégorie créée, vous pourrez l'utiliser lors de l'ajout d'un nouveau produit en utilisant son ID.
        </p>
      </div>
    </div>
  );
};

export default AddCategory;