import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api"; // تأكد من مسار الـ API عندك

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. جلب البيانات من الباكيند
  const fetchCategories = async () => {
    try {
      const response = await API.get("/categories");
      setCategories(response.data);
    } catch (err) {
      console.error("Erreur lors du chargement:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // 2. دالة المسح (Delete)
  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette catégorie ?")) {
      try {
        await API.delete(`/categories/${id}`);
        setCategories(categories.filter((c) => c.id_categorie !== id));
      } catch (err) {
        alert("Erreur lors de la suppression");
      }
    }
  };

  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-blue tracking-tight">
            Gestion des Catégories
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Visualisez et gérez l'ensemble des catégories de votre boutique.
          </p>
        </div>
        <Link
          to="/categories/add"
          className="bg-pacific text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-pacific/20 hover:scale-105 transition-all flex items-center gap-2"
        >
          <i className="fa-solid fa-plus"></i> Ajouter une Catégorie
        </Link>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2rem] border border-platinum overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-20 text-center text-gray-400">
            <i className="fa-solid fa-spinner animate-spin text-3xl mb-4"></i>
            <p>Chargement des catégories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-20 text-center">
            <p className="text-gray-400">Aucune catégorie trouvée.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-platinum">
              <tr>
                <th className="px-8 py-5 text-xs font-black text-slate-blue uppercase tracking-wider">ID</th>
                <th className="px-8 py-5 text-xs font-black text-slate-blue uppercase tracking-wider">Nom</th>
                <th className="px-8 py-5 text-xs font-black text-slate-blue uppercase tracking-wider">Description</th>
                <th className="px-8 py-5 text-xs font-black text-slate-blue uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-platinum">
              {categories.map((cat) => (
                <tr key={cat.id_categorie} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5 text-sm font-bold text-slate-blue">#{cat.id_categorie}</td>
                  <td className="px-8 py-5">
                    <span className="text-sm font-black text-pacific bg-pacific/5 px-3 py-1 rounded-lg">
                      {cat.nom_categorie}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-gray-500 max-w-xs truncate">
                    {cat.description || "Pas de description"}
                  </td>
                  <td className="px-8 py-5 text-right space-x-2">
                    <button className="p-2 text-slate-blue hover:bg-white hover:shadow-md rounded-xl transition-all">
                      <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button 
                      onClick={() => handleDelete(cat.id_categorie)}
                      className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageCategories;