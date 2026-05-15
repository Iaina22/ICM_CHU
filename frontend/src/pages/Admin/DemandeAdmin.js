import React, { useEffect, useState } from "react";
import Navbar from "../../components/NavbarAdmin";
import { getAllDemandes } from "../../services/demandeService";
import { useNavigate } from "react-router-dom";

export default function AdminDemandes() {

  const [demandes, setDemandes] = useState([]);
  const navigate = useNavigate();

  // ================= FETCH =================
  const fetchDemandes = async () => {
    try {
      const res = await getAllDemandes();
      const data = Array.isArray(res) ? res : res?.data || [];
      setDemandes(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDemandes();
  }, []);

  // ================= GROUP SAFE =================
  const grouped = (demandes || []).reduce((acc, item) => {

    const key = item.demande_group || `single-${item.id}`;

    if (!acc[key]) acc[key] = [];
    acc[key].push(item);

    return acc;

  }, {});

  // ================= STATS =================
  const total = demandes.length;
  const enAttente = demandes.filter(d => d.status === "en attente").length;
  const valide = demandes.filter(d => d.status === "validé").length;
  const refuse = demandes.filter(d => d.status === "refusé").length;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />

      <div className="p-4 pt-24">

        {/* TITLE */}
        <h1 className="text-2xl font-bold text-blue-600 mb-4">
          📦 Gestion des demandes
        </h1>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">

          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
            <p className="text-gray-500 text-sm">Total</p>
            <h2 className="text-2xl font-bold">{total}</h2>
          </div>

          <div className="bg-yellow-100 text-yellow-800 p-4 rounded-xl shadow">
            <p className="text-sm">En attente</p>
            <h2 className="text-2xl font-bold">{enAttente}</h2>
          </div>

          <div className="bg-green-100 text-green-800 p-4 rounded-xl shadow">
            <p className="text-sm">Validées</p>
            <h2 className="text-2xl font-bold">{valide}</h2>
          </div>

          <div className="bg-red-100 text-red-800 p-4 rounded-xl shadow">
            <p className="text-sm">Refusées</p>
            <h2 className="text-2xl font-bold">{refuse}</h2>
          </div>

        </div>

        {/* ================= EMPTY ================= */}
        {demandes.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            Aucune demande trouvée
          </div>
        )}

        {/* ================= GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {Object.entries(grouped).map(([groupId, items], index) => (

            <div
              key={groupId}
              onClick={() => navigate(`/admin/demandes/${groupId}`)}
              className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 cursor-pointer hover:shadow-lg transition"
            >

              {/* HEADER */}
              <div className="flex justify-between items-center mb-3">

                <h2 className="font-bold text-blue-600">
                  Demande #{index + 1}
                </h2>

                <span
                  className={`text-xs px-2 py-1 rounded-full font-bold
                  ${
                    items[0]?.status === "validé"
                      ? "bg-green-200 text-green-700"
                      : items[0]?.status === "refusé"
                      ? "bg-red-200 text-red-700"
                      : "bg-yellow-200 text-yellow-700"
                  }`}
                >
                  {items[0]?.status || "en attente"}
                </span>

              </div>

              {/* USER INFO */}
              <p className="text-xs text-gray-500 mb-2">
                👤 {items[0]?.prenom} — {items[0]?.role}
              </p>

              {/* ITEMS */}
              <div className="space-y-2">

                {items.map((d) => (

                  <div
                    key={d.id}
                    className="border-b pb-2 text-sm"
                  >

                    <p className="font-semibold text-blue-600">
                      {d.produit}
                    </p>

                    <p className="text-gray-600">
                      Catégorie: {d.categorie}
                    </p>

                    <p className="text-gray-600">
                      Quantité: {d.quantiter}
                    </p>

                    <p className="text-gray-600">
                      Désignation: {d.designation}
                    </p>

                  </div>

                ))}

              </div>

              {/* DATE */}
              <p className="text-[11px] text-gray-400 mt-3">
                {items[0]?.timestamp
                  ? new Date(items[0].timestamp).toLocaleString()
                  : ""}
              </p>

            </div>

          ))}

        </div>

      </div>
    </div>
  );
}