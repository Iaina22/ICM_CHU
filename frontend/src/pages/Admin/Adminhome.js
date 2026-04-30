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
  
 <div className="p-6 mt-10 font-sans">
  <Navbar />
  <h1 className="text-center text-blue-600 text-xl md:text-2xl font-bold mb-6">
    Administration des utilisateurs
  </h1>

  {/* SEARCH */}
  <input
    type="text"
    placeholder="Rechercher utilisateur..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="border border-gray-400 rounded px-3 py-2 w-full md:w-64 mb-4 text-sm"
  />

  {/* TABLE */}
  {filteredUsers.length === 0 ? (
    <p className="text-center text-gray-600 text-sm">Aucun utilisateur.</p>
  ) : (
    <table className="w-full border border-blue-700 text-xs md:text-sm">
      <thead>
        <tr className="bg-blue-600 text-white">
          <th className="p-2 border">id</th>
          <th className="p-2 border">Nom</th>
          <th className="p-2 border">Prénom</th>
          <th className="p-2 border">Âge</th>
          <th className="p-2 border">Sexe</th>
          <th className="p-2 border">CIN</th>
          <th className="p-2 border">Adresse</th>
          <th className="p-2 border">Email</th>
          <th className="p-2 border">Téléphone</th>
          <th className="p-2 border">Rôle</th>
          <th className="p-2 border">Mot de passe</th>
          <th className="p-2 border">Status</th>
          <th className="p-2 border">Action</th>
        </tr>
      </thead>
      <tbody>
        {filteredUsers.map((user, index) => (
          <tr key={user.id ?? index}>
            <td className="p-2 border">{user.id ?? '-'}</td>
            <td className="p-2 border">{user.nom ?? '-'}</td>
            <td className="p-2 border">{user.prenom ?? '-'}</td>
            <td className="p-2 border">{user.age ?? '-'}</td>
            <td className="p-2 border">{user.sexe ?? '-'}</td>
            <td className="p-2 border">{user.cin ?? '-'}</td>
            <td className="p-2 border">{user.adresse ?? '-'}</td>
            <td className="p-2 border">{user.email ?? '-'}</td>
            <td className="p-2 border">{user.phone ?? '-'}</td>
            <td className="p-2 border">{user.role ?? '-'}</td>
            <td className="p-2 border">••••••</td>
            <td className="p-2 border">
              <span
                className={`px-2 py-1 rounded text-white ${
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
            <td className="p-2 border">
              {user.status === "pending" ? (
                <>
                  <button
                    onClick={() => handleApprove(user.id)}
                    className="bg-green-600 text-white px-2 py-1 rounded mr-2 text-xs md:text-sm"
                  >
                    Approuver
                  </button>
                  <button
                    onClick={() => handleReject(user.id)}
                    className="bg-red-600 text-white px-2 py-1 rounded text-xs md:text-sm"
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
  )}
</div>
}