import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../services/api";
 
const EditCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading]   = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    nom_categorie: "",
    description: "",
  });
 
  // Load existing category data on mount
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await API.get(`/categories/${id}`);
        const cat = res.data.data || res.data;
        setFormData({
          nom_categorie: cat.nom_categorie || "",
          description:   cat.description   || "",
        });
      } catch (err) {
        console.error("Error loading category:", err);
        alert("Could not load category data.");
        navigate("/dashboard");
      } finally {
        setFetching(false);
      }
    };
 
    fetchCategory();
  }, [id]);
 
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
 
    try {
      await API.put(`/categories/${id}`, formData);
      alert("Category updated successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Error while updating:", err);
      alert(
        err.response?.data?.message ||
        "Error while updating the category"
      );
    } finally {
      setLoading(false);
    }
  };
 
  // Loading skeleton while fetching
  if (fetching) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="h-8 w-48 bg-gray-200 rounded-xl animate-pulse mb-4" />
        <div className="h-4 w-72 bg-gray-100 rounded-xl animate-pulse mb-8" />
        <div className="bg-white p-8 rounded-3xl border border-platinum shadow-sm space-y-6">
          <div className="h-12 bg-gray-100 rounded-xl animate-pulse" />
          <div className="h-28 bg-gray-100 rounded-xl animate-pulse" />
          <div className="h-12 bg-gray-100 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }
 
  return (
    <div className="p-8 max-w-2xl mx-auto animate-fade-in">
      <div className="mb-8 text-center md:text-left">
        <div className="inline-flex items-center gap-2 bg-pacific/10 text-pacific text-xs font-bold px-3 py-1 rounded-full mb-3">
          <i className="fa-solid fa-pen-to-square" />
          Editing Category #{id}
        </div>
        <h1 className="text-3xl font-black text-slate-blue tracking-tight">
          Edit Category
        </h1>
        <p className="text-gray-500 mt-2">
          Update the name or description of this category.
        </p>
      </div>
 
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-3xl border border-platinum shadow-sm space-y-6"
      >
        {/* Category Name */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-blue ml-1">
            Category Name
          </label>
          <input
            type="text"
            name="nom_categorie"
            value={formData.nom_categorie}
            onChange={handleChange}
            placeholder="Example: Sports Shoes"
            required
            className="w-full px-4 py-3 rounded-xl border border-platinum focus:border-pacific focus:ring-2 focus:ring-pacific/10 outline-none transition-all"
          />
        </div>
 
        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-blue ml-1">
            Description (Details)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Briefly describe the products in this category..."
            className="w-full px-4 py-3 rounded-xl border border-platinum focus:border-pacific focus:ring-2 focus:ring-pacific/10 outline-none transition-all resize-none"
          />
        </div>
 
        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 py-4 bg-platinum text-slate-blue rounded-xl font-bold hover:bg-gray-200 transition-all"
          >
            Cancel
          </button>
 
          <button
            type="submit"
            disabled={loading}
            className="flex-[2] py-4 bg-pacific text-white rounded-xl font-bold shadow-lg shadow-pacific/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <i className="fa-solid fa-spinner animate-spin" /> Saving...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <i className="fa-solid fa-floppy-disk" /> Save Changes
              </span>
            )}
          </button>
        </div>
      </form>
 
      {/* Tip */}
      <div className="mt-8 p-4 bg-pacific/5 rounded-2xl border border-pacific/10">
        <p className="text-xs text-pacific font-medium leading-relaxed">
          <i className="fa-solid fa-circle-info mr-2" />
          Changing the category name will not affect products already assigned to it — their id_categorie stays the same.
        </p>
      </div>
    </div>
  );
};
 
export default EditCategory;