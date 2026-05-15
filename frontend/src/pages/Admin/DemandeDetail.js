import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/NavbarAdmin";
import { getAllDemandes } from "../../services/demandeService";

export default function DemandeDetail() {

  const { groupId } = useParams();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await getAllDemandes();
      const data = Array.isArray(res) ? res : res?.data || [];

      const filtered = data.filter(d => d.demande_group === groupId);
      setItems(filtered);
    };

    fetch();
  }, [groupId]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />

      <div className="pt-24 p-4 grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* ================= LEFT ================= */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">

          <h2 className="text-blue-600 font-bold mb-3">
            📦 Demandes
          </h2>

          {items.map((d) => (
            <div key={d.id} className="border-b py-2 text-sm">
              <p className="font-bold">{d.produit}</p>
              <p>Catégorie: {d.categorie}</p>
              <p>Qté demandée: {d.quantiter}</p>
              <p>Désignation: {d.designation}</p>
            </div>
          ))}

        </div>

        {/* ================= RIGHT ================= */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">

          <h2 className="text-blue-600 font-bold mb-3">
            📊 Stock / Action
          </h2>

          {items.map((d) => (
            <div key={d.id} className="border-b py-2 text-sm">

              <p className="font-bold">{d.produit}</p>

              <p>Stock actuel: 🔢 (API stock later)</p>

              <div className="flex gap-2 mt-2">

                <button className="bg-green-600 text-white px-3 py-1 rounded text-xs">
                  Valider
                </button>

                <button className="bg-red-600 text-white px-3 py-1 rounded text-xs">
                  Refuser
                </button>

                <button className="bg-yellow-500 text-white px-3 py-1 rounded text-xs">
                  Retour
                </button>

              </div>

            </div>
          ))}

        </div>

      </div>
    </div>
  );
}