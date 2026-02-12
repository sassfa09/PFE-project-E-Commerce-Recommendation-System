import { useEffect, useState } from "react";
import API from "../../services/api"; 
import { Link } from "react-router-dom";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch products from the backend
  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      // الباكيند كيصيفط { success: true, data: [...] }
      // داكشي علاش خاصنا ناخدو res.data.data
      setProducts(res.data.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching products:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. Delete function
const handleDelete = async (id) => {
  if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
    try {
      const token = localStorage.getItem("adminToken"); // التوكن ضروري
      
      await API.delete(`/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });


      setProducts(products.filter((p) => p.id_product !== id));
      alert("Produit supprimé !");
    } catch (err) {
      console.error("Erreur delete:", err.response?.data);
      alert(err.response?.data?.message || "Erreur lors de la suppression");
    }
  }
};

  if (loading)
    return (
      <div className="p-10 text-center text-slate-blue font-bold">
        Chargement des produits...
      </div>
    );

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-slate-blue">
          Inventaire ({products.length})
        </h1>
        <Link
          to="/products/add"
          className="bg-pacific text-white px-6 py-2 rounded-xl font-bold hover:scale-105 transition-all shadow-lg"
        >
          + Ajouter un Produit
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-platinum overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-[#FBFCFC] border-b border-platinum">
            <tr className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
              <th className="px-8 py-5">Détails du Produit</th>
              <th className="px-6 py-5">Prix</th>
              <th className="px-6 py-5">Stock</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-platinum">
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id_product} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-platinum rounded-xl overflow-hidden border">
                        <img
                          src={product.img_url || "https://via.placeholder.com/150"}
                          alt={product.nom_produit}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <span className="font-bold text-slate-blue uppercase text-sm">
                        {product.nom_produit} {/* تم تصحيح الاسم هنا */}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-black text-pacific">
                    {product.prix} DH
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-medium">
                    {product.stock} pcs {/* تم تصحيح الاسم هنا */}
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-slate-blue hover:bg-platinum rounded-lg transition-all">
                         
                                         <Link 
                                    to={`/products/edit/${product.id_product}`} 
                                 className="p-2 text-slate-blue hover:bg-platinum rounded-lg transition-all"
                                      >
                          <i className="fa-solid fa-pen"></i>
                               </Link>
                      </button>
                      <button
                        onClick={() => handleDelete(product.id_product)}
                        className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <i className="fa-solid fa-trash"></i>
     
                      </button>
                    </div>
                  </td>
                </tr>
                
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-20 text-gray-400 font-medium">
                  Aucun produit trouvé. Commencez par en ajouter un !
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageProducts;