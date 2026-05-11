import React, { useEffect, useState } from "react";
import Navbar from "../components/NavbarUser";
import { FiEdit, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function Profile() {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  useEffect(() => {

    if (!userId) return;

    fetch(`http://localhost:5000/api/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

  }, [userId]);

  if (loading)
    return <p className="text-center mt-10">Chargement...</p>;

  if (!user)
    return <p className="text-center mt-10">Utilisateur introuvable</p>;

  return (

    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">

      <Navbar />

      <div className="mt-24 flex justify-center px-3">

        <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-5">

          {/* HEADER */}
          <div className="flex flex-col items-center">

            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-3xl flex items-center justify-center shadow">
              {user.prenom?.charAt(0).toUpperCase()}
            </div>

            <h3 className="mt-3 text-lg font-bold dark:text-white">
              {user.prenom} {user.nom}
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              {user.role}
            </p>

          </div>

          {/* BUTTONS (EO AMBONY EMAIL) */}
          <div className="mt-5 flex gap-3">

            <button
              onClick={() => navigate("/editProfile")}
              className="flex-1 flex items-center justify-center gap-2 
                         bg-transparent border border-blue-500 
                         text-blue-600 hover:bg-blue-50 
                         py-2 rounded-lg text-sm transition"
            >
              <FiEdit /> Modifier
            </button>

            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex-1 flex items-center justify-center gap-2 
                         bg-transparent border border-red-500 
                         text-red-500 hover:bg-red-50 
                         py-2 rounded-lg text-sm transition"
            >
              <FiLogOut /> Logout
            </button>

          </div>

          {/* INFOS */}
          <div className="mt-5 space-y-2 text-sm">

            <div className="flex justify-between border-b pb-1">
              <span className="text-gray-500">Email</span>
              <span>{user.email}</span>
            </div>

            <div className="flex justify-between border-b pb-1">
              <span className="text-gray-500">Téléphone</span>
              <span>{user.phone}</span>
            </div>

            <div className="flex justify-between border-b pb-1">
              <span className="text-gray-500">Adresse</span>
              <span>{user.adresse}</span>
            </div>

            <div className="flex justify-between border-b pb-1">
              <span className="text-gray-500">Sexe</span>
              <span>{user.sexe}</span>
            </div>

            <div className="flex justify-between border-b pb-1">
              <span className="text-gray-500">Âge</span>
              <span>{user.age}</span>
            </div>

            <div className="flex justify-between border-b pb-1">
              <span className="text-gray-500">CIN</span>
              <span>{user.cin}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-500">Status</span>

              <span className={`text-xs px-2 py-1 rounded-full text-white
                ${
                  user.status === "active"
                    ? "bg-green-500"
                    : user.status === "pending"
                    ? "bg-orange-500"
                    : "bg-red-500"
                }`}
              >
                {user.status}
              </span>

            </div>

          </div>

        </div>

      </div>

      {/* MODAL */}
      {showLogoutModal && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl w-72 text-center">

            <h3 className="text-base font-semibold dark:text-white">
              Déconnexion ?
            </h3>

            <div className="flex gap-2 mt-4">

              <button
                onClick={() => {
                  localStorage.clear();
                  navigate("/");
                }}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg"
              >
                Oui
              </button>

              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 bg-gray-400 text-white py-2 rounded-lg"
              >
                Non
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Profile;