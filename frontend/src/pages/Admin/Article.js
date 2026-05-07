import React, {
  useEffect,
  useState,
} from "react";

import Navbar from "../../components/NavbarAdmin";

import {
  getArticles,
  addArticle,
  updateArticle,
} from "../../services/articleService";

import {
  getCategories,
} from "../../services/categorieService";

import {
  FiSearch,
  FiPlus,
} from "react-icons/fi";

export default function Article() {

  const [articles, setArticles] = useState([]);
  const [allArticles, setAllArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    ref_cat: "",
    produit: "",
    designation: "",
    stock: "",
  });

  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, []);

  const fetchArticles = async () => {
    try {
      const data = await getArticles();
      setArticles(data);
      setAllArticles(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.log(error);
    }
  };

  // FILTER
  const showAll = () => setArticles(allArticles);

  const showDisponible = () => {
    setArticles(allArticles.filter((a) => a.stock >= 10));
  };

  const showFaible = () => {
    setArticles(allArticles.filter((a) => a.stock > 0 && a.stock < 10));
  };

  const showRupture = () => {
    setArticles(allArticles.filter((a) => a.stock === 0));
  };

  // CATEGORY
  const handleCategoryChange = (e) => {
    const selected = categories.find(
      (cat) => cat.ref_cat === e.target.value
    );

    setSelectedCategory(selected);

    setFormData({
      ...formData,
      ref_cat: selected.ref_cat,
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
const handleSubmit = async (e) => {

  e.preventDefault();

  try {

    const existingArticle = allArticles.find(
      (a) =>
        a.designation?.toLowerCase() ===
        formData.designation.toLowerCase()
    );

    if (existingArticle && existingArticle.stock > 0) {

      const newStock =
        Number(existingArticle.stock) +
        Number(formData.stock);

      await updateArticle(
        existingArticle.id,
        newStock
      );

    } else {

      await addArticle(formData);

    }

    fetchArticles();

    setFormData({
      ref_cat: "",
      produit: "",
      designation: "",
      stock: "",
    });

    setSelectedCategory(null);

  } catch (error) {

    console.log(error);

  }

};
  const filteredArticles = articles.filter((article) =>
    article.designation?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatus = (stock) => {
    if (stock === 0) {
      return { text: "Rupture", color: "bg-red-100 text-red-600" };
    }
    if (stock < 10) {
      return { text: "Faible", color: "bg-orange-100 text-orange-600" };
    }
    return { text: "Disponible", color: "bg-green-100 text-green-600" };
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">

      <Navbar />

      <div className="max-w-7xl mx-auto p-3 md:p-6">

        {/* HEADER */}
        <div className="mt-20 mb-6">
          <h1 className="text-3xl font-bold text-blue-600 dark:text-white">
            Gestion des Articles
          </h1>
        </div>

        {/* TOP FLEX (STATS + FORM) */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">

          {/* LEFT - STATS (2x2) */}
          <div className="lg:w-1/2 grid grid-cols-2 gap-3">

            <div onClick={showAll}
              className="bg-white dark:bg-gray-800 rounded-xl shadow p-3 cursor-pointer">
              <p className="text-xs text-gray-500">Total</p>
              <h2 className="text-xl font-bold">{allArticles.length}</h2>
            </div>

            <div onClick={showDisponible}
              className="bg-white dark:bg-gray-800 rounded-xl shadow p-3 cursor-pointer">
              <p className="text-xs text-gray-500">Disponible</p>
              <h2 className="text-xl font-bold text-green-600">
                {allArticles.filter((a) => a.stock >= 10).length}
              </h2>
            </div>

            <div onClick={showFaible}
              className="bg-white dark:bg-gray-800 rounded-xl shadow p-3 cursor-pointer">
              <p className="text-xs text-gray-500">Faible</p>
              <h2 className="text-xl font-bold text-orange-500">
                {allArticles.filter((a) => a.stock > 0 && a.stock < 10).length}
              </h2>
            </div>

            <div onClick={showRupture}
              className="bg-white dark:bg-gray-800 rounded-xl shadow p-3 cursor-pointer">
              <p className="text-xs text-gray-500">Rupture</p>
              <h2 className="text-xl font-bold text-red-600">
                {allArticles.filter((a) => a.stock === 0).length}
              </h2>
            </div>

          </div>

          {/* RIGHT - FORM */}
          <div className="lg:w-1/2">

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-3">

              <h2 className="text-base font-semibold mb-3 dark:text-white">
                Ajouter Article
              </h2>

              <form onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-3">

                <select
                  onChange={handleCategoryChange}
                  className="p-2 rounded-lg border bg-transparent dark:text-white"
                  required
                >
                  <option value="">Catégorie</option>
                  {categories.map((cat) => (
                    <option key={cat.ref_cat} value={cat.ref_cat}>
                      {cat.nom}
                    </option>
                  ))}
                </select>

                <input
                  disabled
                  value={selectedCategory?.ref_cat || ""}
                  className="p-2 rounded-lg border bg-gray-100 dark:bg-gray-700 dark:text-white"
                />

                <input
                  disabled
                  value={selectedCategory?.code_compta || ""}
                  className="p-2 rounded-lg border bg-gray-100 dark:bg-gray-700 dark:text-white"
                />

                <input
                  name="produit"
                  value={formData.produit}
                  onChange={handleChange}
                  placeholder="Produit"
                  className="p-2 rounded-lg border dark:text-white"
                />

                <input
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="Désignation"
                  className="p-2 rounded-lg border dark:text-white"
                />

                <input
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="Stock"
                  className="p-2 rounded-lg border dark:text-white"
                />

                <button className="md:col-span-2 bg-blue-600 text-white p-2 rounded-lg flex items-center justify-center gap-2">
                  <FiPlus /> Ajouter
                </button>

              </form>

            </div>

          </div>

        </div>

        {/* SEARCH */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-3 mb-6">
          <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
            <FiSearch />
            <input
              className="w-full bg-transparent outline-none dark:text-white"
              placeholder="Recherche..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* TABLE (UNCHANGED) */}
       {/* TABLE (UNCHANGED except Action -> Created At) */}
<div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
  <div className="overflow-x-auto">

    <table className="min-w-full">

      <thead className="bg-gray-200 dark:bg-gray-700">
        <tr>
          <th className="p-3 text-left">REF</th>
          <th className="p-3 text-left">Code compta</th>
          <th className="p-3 text-left">Catégorie</th>
          <th className="p-3 text-left">Produit</th>
          <th className="p-3 text-left">Designation</th>
          <th className="p-3 text-left">quantiter</th>
          <th className="p-3 text-left">Etat</th>

          {/* NEW COLUMN */}
          <th className="p-3 text-left">Created At</th>
        </tr>
      </thead>

      <tbody>
        {filteredArticles.map((article) => {
          const status = getStatus(article.stock);

          return (
            <tr key={article.id}
              className="border-b dark:border-gray-700">

              <td className="p-3">{article.ref_art}</td>
              <td className="p-3">{article.code_compta}</td>
              <td className="p-3">{article.nom}</td>
              <td className="p-3">{article.produit}</td>
              <td className="p-3">{article.designation}</td>
              <td className="p-3">{article.stock}</td>

              <td className="p-3">
                <span className={`px-2 py-1 rounded ${status.color}`}>
                  {status.text}
                </span>
              </td>

             <td className="p-3 text-gray-600 dark:text-gray-300">
  {article.created_at || article.createdAt
    ? new Date(article.created_at || article.createdAt).toLocaleString()
    : "-"}
</td>

            </tr>
          );
        })}
      </tbody>

    </table>

  </div>
</div>

      </div>
    </div>
  );
}