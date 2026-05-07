import React, { useEffect, useState } from 'react';
import { FiBell, FiSettings, FiUser, FiLogOut, FiFilter } from 'react-icons/fi';
import Navbar from "../../components/NavbarAdmin";
import socket from "../../socket";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


export default function Adminhome() {

  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [openMenu, setOpenMenu] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState("all");
const [showFilterMenu, setShowFilterMenu] = useState(false);
  
  
const [showLogoutModal, setShowLogoutModal] = useState(false);

  // 🔔 NOTIF
  const [notif, setNotif] = useState("");
  const [count, setCount] = useState(0);
  const [showNotif, setShowNotif] = useState(false);

  const fetchPendingUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/users');
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setMessage('Erreur serveur');
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

 
  useEffect(() => {
    socket.on("newUser", (data) => {
      setNotif(data.message);
      setCount(prev => prev + 1);
      fetchPendingUsers();
    });

    return () => {
      socket.off("newUser");
    };
  }, []);

  const handleApprove = async (id) => {
  const res = await fetch(`http://localhost:5000/api/admin/approve/${id}`, {
    method: 'POST'
  });

  const data = await res.json();

  if (data.success) {
    // ❌ esorina ito
    // setMessage(data.message);
    socket.emit("approveUser", {
      userId: id,
      message: "Votre compte est approuvé ✅"
    });

    fetchPendingUsers();
  }
};
  const handleReject = async (id) => {
    const res = await fetch(`http://localhost:5000/api/admin/reject/${id}`, {
      method: 'POST'
    });
    const data = await res.json();
    if (data.success) {
      setMessage(data.message);
      fetchPendingUsers();
    }
  };

const filteredUsers = users
  .filter((u) =>
    `${u.nom} ${u.prenom} ${u.email} ${u.role}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )
  .filter((u) => {
    if (filterStatus === "all") return true;
    return u.status?.toLowerCase() === filterStatus;
  });
return (
  <div className="px-8 mt-20 md:mt-32 font-sans">

    <Navbar />
    <h1 className="text-center text-blue-600 text-xl md:text-2xl font-bold">
  Administration des utilisateurs
</h1>


    {/* MESSAGE ACTIONS */}
    {message && (
      <div className="bg-blue-600 text-white p-3 mb-3 text-center rounded-md shadow">
        {message}
      </div>
    )}

    {/* NOTIF POPUP */}
    {showNotif && notif && (
      <div className="fixed right-5 top-16 w-56 bg-white text-gray-800 p-3 rounded-lg shadow-lg z-50">
        {notif}
      </div>
    )}

    {/* TOP BAR */}
    <div className="flex justify-end">
      <div className="flex gap-3 items-center mt-5">
        {/* 🔔 BELL */}
        <div
          className="relative cursor-pointer"
          onClick={() => setShowNotif(!showNotif)}
        >
          <FiBell className="text-xl" />
          {count > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full px-2 text-xs">
              {count}
            </span>
          )}
        </div>

        {/* SETTINGS */}
        <div className="relative">
          <FiSettings
            className="text-xl cursor-pointer"
            onClick={() => setOpenMenu(!openMenu)}
          />

          {openMenu && (
            <div className="absolute right-0 top-10 bg-white rounded-lg w-40 shadow-lg">
              <Link
                to="/profile"
                className="flex gap-2 p-2 hover:bg-gray-100 cursor-pointer"
              >
                <FiUser className="text-lg" />
                <span>Profil</span>
              </Link>

              <div
                className="flex gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => setShowFilterMenu(!showFilterMenu)}
              >
                <FiFilter className="text-lg" />
                <span>Filtre</span>
              </div>

              {showFilterMenu && (
                <div className="absolute right-0 top-20 bg-white rounded-lg w-40 shadow-lg">
                  <div
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => setFilterStatus("pending")}
                  >
                    En attente
                  </div>
                  <div
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => setFilterStatus("active")}
                  >
                    Acceptés
                  </div>
                  <div
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => setFilterStatus("rejected")}
                  >
                    Refusés
                  </div>
                  <div
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => setFilterStatus("all")}
                  >
                    Tous
                  </div>
                </div>
              )}

              <div
                className="flex gap-2 p-2 hover:bg-gray-100 cursor-pointer text-black"
                onClick={() => setShowLogoutModal(true)}
              >
                <FiLogOut className="text-lg" />
                <span>Déconnecter</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* LOGOUT MODAL */}
    {showLogoutModal && (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
        <div className="bg-white p-5 rounded-lg text-center w-72 animate-scaleIn">
          <h3 className="text-lg font-bold mb-2">Déconnexion</h3>
          <p>Voulez-vous vraiment vous déconnecter ?</p>
          <div className="flex justify-around mt-4">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowLogoutModal(false);
              }}
              className="px-3 py-1 rounded-md bg-gray-300"
            >
              Non
            </button>
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem("user");
                socket.disconnect();
                setShowLogoutModal(false);
                navigate("/");
              }}
              className="px-3 py-1 rounded-md bg-red-600 text-white"
            >
              Oui
            </button>
          </div>
        </div>
      </div>
    )}

    {/* SEARCH */}
    <input
      type="text"
      placeholder="Rechercher utilisateur..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="border border-gray-400 rounded-md p-2 w-64 mb-3"
    />

    {/* TABLE */}
    {filteredUsers.length === 0 ? (
      <p>Aucun utilisateur.</p>
    ) : (
      <div className="overflow-x-auto">
  <table className="w-full border-collapse text-xs md:text-sm lg:text-sm">
    <thead>
      <tr>
        <th className="bg-blue-700 text-white p-2 border">id</th>
        <th className="bg-blue-700 text-white p-2 border">Nom</th>
        <th className="bg-blue-700 text-white p-2 border">Prénom</th>
        <th className="bg-blue-700 text-white p-2 border">Âge</th>
        <th className="bg-blue-700 text-white p-2 border">Sexe</th>
        <th className="bg-blue-700 text-white p-2 border">CIN</th>
        <th className="bg-blue-700 text-white p-2 border">Adresse</th>
        <th className="bg-blue-700 text-white p-2 border">Email</th>
        <th className="bg-blue-700 text-white p-2 border">Téléphone</th>
        <th className="bg-blue-700 text-white p-2 border">Rôle</th>
        <th className="bg-blue-700 text-white p-2 border">Mot de passe</th>
        <th className="bg-blue-700 text-white p-2 border">Status</th>
        <th className="bg-blue-700 text-white p-2 border">Action</th>
      </tr>
    </thead>
    <tbody>
      {filteredUsers.map((user, index) => (
        <tr key={user.id ?? index} className="text-xs md:text-sm lg:text-sm">
          <td className="border p-2">{user.id ?? "-"}</td>
          <td className="border p-2">{user.nom ?? "-"}</td>
          <td className="border p-2">{user.prenom ?? "-"}</td>
          <td className="border p-2">{user.age ?? "-"}</td>
          <td className="border p-2">{user.sexe ?? "-"}</td>
          <td className="border p-2">{user.cin ?? "-"}</td>
          <td className="border p-2">{user.adresse ?? "-"}</td>
          <td className="border p-2">{user.email ?? "-"}</td>
          <td className="border p-2">{user.phone ?? "-"}</td>
          <td className="border p-2">{user.role ?? "-"}</td>
          <td className="border p-2">••••••</td>
          <td className="border p-2">
            <span
              className={`px-2 py-1 rounded-md text-white ${
                user.status === "active"
                  ? "bg-green-600"
                  : user.status === "rejected"
                  ? "bg-red-600"
                  : "bg-orange-500"
              }`}
            >
              {user.status ?? "pending"}
            </span>
          </td>
          <td className="border p-2">
            {user.status === "pending" ? (
              <>
                <button
                  onClick={() => handleApprove(user.id)}
                  className="px-2 py-1 rounded-md bg-green-600 text-white mr-2 text-xs md:text-sm"
                >
                  Approuver
                </button>
                <button
                  onClick={() => handleReject(user.id)}
                  className="px-2 py-1 rounded-md bg-red-600 text-white text-xs md:text-sm"
                >
                  Rejeter
                </button>
              </>
            ) : user.status === "active" ? (
              <span className="text-green-600 font-bold">Accepté ✔</span>
            ) : user.status === "rejected" ? (
              <span className="text-red-600 font-bold">Refusé ❌</span>
            ) : null}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

    )}
  </div>
);
}

