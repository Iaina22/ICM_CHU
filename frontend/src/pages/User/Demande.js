import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../../components/NavbarUser";

import { getCategories } from "../../services/categorieService";
import { getArticles } from "../../services/articleService";
import {
  addDemande,
  getDemandesByUser,
} from "../../services/demandeService";

export default function Demande() {

  const [categories, setCategories] = useState([]);
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [demandes, setDemandes] = useState([]);

  const [formData, setFormData] = useState({
    categorie: "",
    produit: "",
    quantiter: "",
    designation: "",
  });

  // ================= USER =================
  const user = JSON.parse(localStorage.getItem("user"));

  const user_id = user?.id;
  const prenom = user?.prenom;
  const role = user?.role;

  // ================= FETCH CATEGORIES =================
  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data || []);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= FETCH ARTICLES =================
  const fetchArticles = async () => {
    try {
      const data = await getArticles();

      console.log("ARTICLES => ", data);

      // articles dispo seulement
      const dispo = (data || []).filter(
        (a) => Number(a.quantite || 0) > 0
      );

      setArticles(dispo);

    } catch (err) {
      console.log(err);
    }
  };

  // ================= FETCH DEMANDES =================
  const fetchDemandes = useCallback(async () => {
    try {

      if (!user_id) return;

      const res = await getDemandesByUser(user_id);

      const data = Array.isArray(res)
        ? res
        : res?.data || [];

      setDemandes(data);

    } catch (err) {
      console.log(err);
    }
  }, [user_id]);

  // ================= LOAD =================
  useEffect(() => {
    fetchCategories();
    fetchArticles();
  }, []);

  useEffect(() => {
    fetchDemandes();
  }, [fetchDemandes]);

  // ================= CATEGORY CHANGE =================
  const handleCategoryChange = (e) => {

    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      categorie: value,
      produit: "",
    }));

    // IMPORTANT FIX
    // nom_cat na categorie
    const filtered = articles.filter(
      (a) =>
        a.nom_cat === value ||
        a.categorie === value
    );

    console.log("FILTERED => ", filtered);

    setFilteredArticles(filtered);
  };

  // ================= INPUT =================
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      if (!user_id) {
        alert("Utilisateur non connecté");
        return;
      }

      await addDemande({
        id_user: user_id,
        prenom,
        role,
        categorie: formData.categorie,
        produit: formData.produit,
        quantiter: Number(formData.quantiter),
        designation: formData.designation,
        status: "en attente",
      });

      alert("Demande envoyée");

      setFormData({
        categorie: "",
        produit: "",
        quantiter: "",
        designation: "",
      });

      setFilteredArticles([]);

      fetchDemandes();

    } catch (err) {
      console.log(err);
      alert("Erreur serveur");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />

      {/* ================= LAYOUT ================= */}
      <div className="flex flex-col md:flex-row gap-4 px-3 pt-24">

        {/* ================= HISTORIQUE ================= */}
        <div className="w-full md:w-[40%] bg-white dark:bg-gray-800 rounded-xl shadow p-3 max-h-[80vh] overflow-y-auto">

          <h2 className="text-sm font-bold text-blue-600 mb-3">
            📜 Historique des demandes
          </h2>

          {demandes.length === 0 && (
            <p className="text-xs text-gray-500">
              Aucune demande
            </p>
          )}

          <div className="space-y-2">

            {demandes.map((d) => (
              <div
                key={d.id}
                className="p-2 rounded-lg border text-xs bg-white dark:bg-gray-700"
              >

                <p className="font-semibold">
                  {d.produit}
                </p>

                <p>
                  Quantité : {d.quantiter}
                </p>

                <p className="text-[10px] text-gray-400">
                  {new Date(
                    d.timestamp || d.created_at
                  ).toLocaleString()}

                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    d.status === "validé"
                      ? "bg-green-100 text-green-700"
                      : d.status === "refusé"
                      ? "bg-red-200 text-red-700"
                      : "bg-yellow-200 text-yellow-700"
                  }`}
                >
                  {d.status || "en attente"}
                </span>
                </p>


              </div>
            ))}

          </div>
        </div>

        {/* ================= FORM ================= */}
        <div className="w-full md:w-[60%]">

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">

            <h1 className="text-lg font-bold text-center text-blue-600 mb-3">
              Nouvelle Demande
            </h1>

            <form
              onSubmit={handleSubmit}
              className="space-y-3 text-sm"
            >

              {/* ================= CATEGORIE ================= */}
              <select
                value={formData.categorie}
                onChange={handleCategoryChange}
                className="w-full p-2 rounded border dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="">
                  Sélectionner catégorie
                </option>

                {categories.map((c) => (
                  <option
                    key={c.ref_cat || c.id}
                    value={c.nom}
                  >
                    {c.nom}
                  </option>
                ))}
              </select>

              {/* ================= PRODUIT ================= */}
             
              <select
                name="produit"
                value={formData.produit}
                onChange={handleChange}
                className="w-full p-2 rounded border dark:bg-gray-700 dark:text-white"
              >
                <option value="">Produit</option>
                {filteredArticles.map((a) => (
                  <option key={a.ref_art} value={a.produit}>
                    {a.produit}
                  </option>
                ))}
              </select>

              {/* ================= QUANTITE ================= */}
              <input
                type="number"
                name="quantiter"
                min="1"
                value={formData.quantiter}
                onChange={handleChange}
                className="w-full p-2 rounded border dark:bg-gray-700 dark:text-white"
                placeholder="Entrer la quantité"
                required
              />

              {/* ================= DESIGNATION ================= */}
              <textarea
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className="w-full p-2 rounded border dark:bg-gray-700 dark:text-white"
                placeholder="Désignation"
                rows="3"
              />

              {/* ================= BUTTON ================= */}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
              >
                Envoyer
              </button>

            </form>

          </div>
        </div>

      </div>
    </div>
  );
}