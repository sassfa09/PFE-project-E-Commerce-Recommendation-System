import { useEffect, useState } from "react";
import API from "../../services/api"; 
import { Link } from "react-router-dom";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const getFullImageUrl = (img) => {
    if (!img) return "https://via.placeholder.com/150";
  
    if (img.startsWith("http")) return img;
 
    return `http://localhost:5000/${img}`;
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get("/products");
     
      const data = res.data.data || res.data;
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      try {
        const token = localStorage.getItem("adminToken"); 
        await API.delete(`/products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

       
        setProducts(products.filter((p) => p.id_product !== id));
        alert("Produit supprimé avec succès !");
      } catch (err) {
        console.error("Erreur delete:", err.response?.data);
        alert(err.response?.data?.message || "Erreur lors de la suppression");
      }
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center text-slate-blue font-bold flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-pacific border-t-transparent rounded-full animate-spin"></div>
        Chargement de l'inventaire...
      </div>
    );

  return (
    <div className="p-6 space-y-6 animate-fade-in text-left">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-blue">
            Inventaire des Produits
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Total: {products.length} articles en stock
          </p>
        </div>
        <Link
          to="/products/add"
          className="bg-pacific text-white px-6 py-2 rounded-xl font-bold hover:scale-105 transition-all shadow-lg shadow-pacific/20"
        >
          <i className="fa-solid fa-plus mr-2"></i>
          Ajouter un Produit
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-platinum overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#FBFCFC] border-b border-platinum">
              <tr className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-8 py-5">Produit</th>
                <th className="px-6 py-5">Catégorie</th>
                <th className="px-6 py-5">Prix</th>
                <th className="px-6 py-5">Stock</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-platinum">
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id_product} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-xl overflow-hidden border border-platinum flex-shrink-0">
                          <img
                            src={getFullImageUrl(product.img_url)}
                            alt={product.nom_produit}
                            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
                          />
                        </div>
                        <span className="font-bold text-slate-blue text-sm line-clamp-1">
                          {product.nom_produit}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                        {product.nom_categorie || "Général"}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-black text-pacific">
                      {product.prix} DH
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${product.stock > 5 ? 'bg-green-400' : 'bg-red-400'}`}></span>
                        <span className="text-gray-500 font-medium">{product.stock} pcs</span>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <Link 
                          to={`/products/edit/${product.id_product}`} 
                          className="p-2 text-slate-blue hover:bg-pacific hover:text-white rounded-lg transition-all"
                          title="Modifier"
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id_product)}
                          className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all"
                          title="Supprimer"
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-20 text-gray-400 font-medium">
                    <div className="flex flex-col items-center gap-3">
                       <i className="fa-solid fa-inbox text-4xl opacity-20"></i>
                       <p>Aucun produit dans votre inventaire.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageProducts;