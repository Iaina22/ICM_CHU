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

  // LISTE PRODUITS TEMP
  const [tempDemandes, setTempDemandes] = useState([]);

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
      console.log(
  "DEMANDES DETAIL =",
  JSON.stringify(data, null, 2)
);
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

    const filtered = articles.filter(
      (a) =>
        a.nom_cat === value ||
        a.categorie === value
    );

    setFilteredArticles(filtered);
  };

  // ================= INPUT =================
  const handleChange = (e) => {

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ================= AJOUT =================
  const handleAdd = () => {

    if (
      !formData.categorie ||
      !formData.produit ||
      !formData.quantiter
    ) {
      alert("Remplir les champs");
      return;
    }

    const newItem = {
      categorie: formData.categorie,
      produit: formData.produit,
      quantiter: formData.quantiter,
      designation: formData.designation,
    };

    setTempDemandes((prev) => [
      ...prev,
      newItem,
    ]);

    // RESET FORM
    setFormData({
      categorie: "",
      produit: "",
      quantiter: "",
      designation: "",
    });

    setFilteredArticles([]);
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      if (!user_id) {
        alert("Utilisateur non connecté");
        return;
      }

      
      if (tempDemandes.length === 0) {
        alert("Ajouter produit d'abord");
        return;
      }

      // ID DEMANDE 1
      const demande_group = "DEM-" + Date.now();

      // PRODUIT MARO => DEMANDE 1
      for (let item of tempDemandes) {

        await addDemande({
          id_user: user_id,
          prenom,
          role,

          demande_group,

          categorie: item.categorie,
          produit: item.produit,
          quantiter: Number(item.quantiter),
          designation: item.designation,

          status: "en attente",
        });
      }

      // AFFICHAGE DIRECT HISTORIQUE
      const newHistorique = tempDemandes.map(
        (item, index) => ({
          id: Date.now() + index,

          demande_group,

          categorie: item.categorie,
          produit: item.produit,
          quantiter: item.quantiter,
          designation: item.designation,

          status: "en attente",

          created_at: new Date(),
        })
      );

      setDemandes((prev) => [
        ...newHistorique,
        ...prev,
      ]);

      alert("Demande envoyée");

      // RESET
      setTempDemandes([]);

      setFormData({
        categorie: "",
        produit: "",
        quantiter: "",
        designation: "",
      });

      setFilteredArticles([]);

    } catch (err) {
      console.log(err);
      alert("Erreur serveur");
    }
  };

  const groupedDemandes = demandes.reduce((acc, item) => {

  const key = item.demande_group;

  // si pas de group → fallback propre
  if (!key) {
    const fallback = `single-${item.id}`;

    if (!acc[fallback]) acc[fallback] = [];
    acc[fallback].push(item);

    return acc;
  }

  if (!acc[key]) {
    acc[key] = [];
  }

  acc[key].push(item);

  return acc;

}, {});
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />

      {/* ================= LAYOUT ================= */}
      <div className="flex flex-col md:flex-row gap-4 mt-5 px-3 pt-24">

       {/* ================= HISTORIQUE ================= */}
<div className="w-full md:w-[65%] bg-white dark:bg-gray-800 rounded-xl shadow p-3 max-h-[80vh] overflow-y-auto">

  <h2 className="text-sm font-bold text-blue-600 mb-3">
    📜 Historique des demandes
  </h2>

  {demandes.length === 0 && (
    <p className="text-xs text-gray-500">
      Aucune demande
    </p>
  )}

  <div className="space-y-3">

    {Object.entries(groupedDemandes).map(([groupId, items], index) => {

      const date = items[0]?.timestamp || items[0]?.created_at;

      return (
        <div
          key={groupId}
          className="p-3 rounded-lg border bg-white dark:bg-gray-700 text-xs"
        >

          {/* HEADER DEMANDE */}
          <div className="flex justify-between items-center mb-2">
            <p className="font-bold text-blue-600">
              Demande {index + 1}
            </p>

            <span
              className={`px-2 py-1 rounded text-xs font-bold ${
                items[items.length - 1]?.status === "validé"
                  ? "bg-green-100 text-green-700"
                  : items[items.length - 1]?.status === "refusé"
                  ? "bg-red-200 text-red-700"
                  : "bg-yellow-200 text-yellow-700"
              }`}
            >
              {items[items.length - 1]?.status || "en attente"}
            </span>
          </div>

          
          {date && (
            <p className="text-[10px] text-gray-400 mb-2">
              {new Date(date).toLocaleString()}
            </p>
          )}

          {/* ITEMS */}
          <div className="space-y-2">
            {items.map((d) => (
              <div key={d.id} className="border-b pb-2 flex justify-between">

                <div>
                  <p className="font-semibold text-blue-600">
                    {d.categorie}
                  </p>

                  <p className="font-semibold">
                    {d.produit}
                  </p>

                  <p className="text-gray-600">
                    Quantité : {d.quantiter}
                  </p>
                </div>

             

              </div>
            ))}
          </div>

        </div>
      );
    })}

  </div>
</div>

        {/* ================= FORM ================= */}
        <div className="w-full md:w-[30%]">

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
                <option value="">
                  Produit
                </option>

                {filteredArticles.map((a) => (
                  <option
                    key={a.ref_art}
                    value={a.produit}
                  >
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
              <div className="flex gap-2">

                <button
                  type="button"
                  onClick={handleAdd}
                  className="w-1/2 bg-green-600 hover:bg-green-700 text-white p-2 rounded"
                >
                  + Ajout
                </button>

                <button
                  type="submit"
                  className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
                >
                  Envoyer
                </button>

              </div>

            </form>

            {/* ================= LISTE DEMANDE ================= */}
            {tempDemandes.length > 0 && (

              <div className="mt-4">

                <p className="text-sm font-bold text-blue-600 mb-2">
                  Liste demande
                </p>

                <div className="space-y-2">

                  {tempDemandes.map(
                    (item, index) => (

                      <div
                        key={index}
                        className="p-2 rounded border text-xs bg-white dark:bg-gray-700"
                      >

                        <p className="font-semibold text-blue-600">
                          Catégorie : {item.categorie}
                        </p>

                        <p className="font-semibold">
                          {item.produit}
                        </p>

                        <p>
                          Quantité : {item.quantiter}
                        </p>

                      </div>
                    )
                  )}

                </div>

              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}