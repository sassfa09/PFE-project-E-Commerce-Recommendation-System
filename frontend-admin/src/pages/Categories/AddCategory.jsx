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

  // Update values when typing
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Send data to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send POST request to backend (make sure the route is /api/categories)
      await API.post("/categories", formData);
      
      alert("Category added successfully!");
      
      // After adding the category, go back to dashboard or products page
      navigate("/dashboard"); 
    } catch (err) {
      console.error("Error while adding:", err);
      alert(
        err.response?.data?.message || 
        "Error while creating the category"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto animate-fade-in">
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-black text-slate-blue tracking-tight">
          New Category
        </h1>
        <p className="text-gray-500 mt-2">
          Add a category to organize your products (e.g., Sneakers, Accessories).
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
          ></textarea>
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
            className="flex-[2] py-4 bg-tangerine text-white rounded-xl font-bold shadow-lg shadow-tangerine/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <i className="fa-solid fa-spinner animate-spin"></i> Saving...
              </span>
            ) : (
              "Create Category"
            )}
          </button>
        </div>
      </form>

      {/* Quick Help Tip */}
      <div className="mt-8 p-4 bg-pacific/5 rounded-2xl border border-pacific/10">
        <p className="text-xs text-pacific font-medium leading-relaxed">
          <i className="fa-solid fa-lightbulb mr-2"></i>
          Once the category is created, you can use it when adding a new product by referencing its ID.
        </p>
      </div>
    </div>
  );
};

export default AddCategory;
