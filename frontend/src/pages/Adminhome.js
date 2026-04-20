import React, { useEffect, useState } from 'react';
import { FiBell, FiSettings, FiUser, FiLogOut, FiFilter } from 'react-icons/fi';
import Navbar from "../components/NavbarAdmin";
import socket from "../socket";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


export default function Adminhome() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [openMenu, setOpenMenu] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  
  
const [showLogoutModal, setShowLogoutModal] = useState(false);

  // 🔔 NOTIF
  const [notif, setNotif] = useState("");
  const [count, setCount] = useState(0);
  const [showNotif, setShowNotif] = useState(false);

  const fetchPendingUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/pending-users');
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

    // ✅ mandefa notif amin'ny user via socket
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

  const filteredUsers = users.filter((u) =>
    `${u.nom} ${u.prenom} ${u.email} ${u.role}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <Navbar />
      <h1>Administration des utilisateurs</h1>

      {/* MESSAGE ACTIONS */}
      {message && <div className="toast">{message}</div>}

      {/* NOTIF POPUP (CLICK ONLY) */}
      {showNotif && notif && (
        <div className="toast notif-popup">
          {notif}
        </div>
      )}

      {/* TOP BAR */}
      <div className="top-bar">
        <div className="right-icons">

          {/* 🔔 BELL */}
          <div className="icon-box" onClick={() => setShowNotif(!showNotif)}>
            <FiBell className="icon" />
            {count > 0 && <span className="badge">{count}</span>}
          </div>

          {/* SETTINGS */}
          <div className="menu-container">
            <FiSettings
              className="icon"
              onClick={() => setOpenMenu(!openMenu)}
            />

            {openMenu && (
              <div className="dropdown">

                <div className="item">
                  <Link to="/profile" className="item">
                  <FiUser className="icon" />
                  <span>Profil</span>
                </Link>
                </div>

                <div className="item">
                  <FiFilter className="icon" />
                  <span>Filtre</span>
                </div>

                <div className="item logout" onClick={() => setShowLogoutModal(true)}>
  <FiLogOut className="icon" />
  <span>Déconnecter</span>
  {showLogoutModal && (
  <div className="modalOverlay">
    <div className="modal">
      <h3>Déconnexion</h3>
      <p>Voulez-vous vraiment vous déconnecter ?</p>

      <div className="modalActions">
              <button
              type="button"
              onClick={(e) => {
                e.stopPropagation(); 
                setShowLogoutModal(false);
              }}
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
>
  Oui
</button>
      </div>
    </div>
  </div>
)}
</div>

              </div>
            )}
          </div>

        </div>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Rechercher utilisateur..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search"
      />

      {/* TABLE */}
      {filteredUsers.length === 0 ? (
        <p>Aucun utilisateur.</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>id</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Âge</th>
                <th>Sexe</th>
                <th>CIN</th>
                <th>Adresse</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Rôle</th>
                <th>Mot de passe</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user.id ?? index}>
                  <td>{user.id ?? '-'}</td>
                  <td>{user.nom ?? '-'}</td>
                  <td>{user.prenom ?? '-'}</td>
                  <td>{user.age ?? '-'}</td>
                  <td>{user.sexe ?? '-'}</td>
                  <td>{user.cin ?? '-'}</td>
                  <td>{user.adresse ?? '-'}</td>
                  <td>{user.email ?? '-'}</td>
                  <td>{user.phone ?? '-'}</td>
                  <td>{user.role ?? '-'}</td>
                  <td>••••••</td>

                  <td>
                    <button onClick={() => handleApprove(user.id)} className="approve">
                      Approuver
                    </button>
                    <button onClick={() => handleReject(user.id)} className="reject">
                      Rejeter
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}

      {/* CSS */}
      <style>{`
        .container {
          padding: 30px;
          margin-top: 5%;
          font-family: sans-serif;
        }

        h1 {
          color: #0f5ed7;
          text-align: center;
        }

        .top-bar {
          display: flex;
          justify-content: flex-end;
        }

        .right-icons {
          display: flex;
          gap: 12px;
          align-items: center;
          margin-top: -5%;
        }

        .icon {
          font-size: 22px;
          cursor: pointer;
        }

        .icon-box {
          position: relative;
          z-index: 1001;
        }

        .badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: red;
          color: white;
          border-radius: 50%;
          padding: 3px 6px;
          font-size: 12px;
          z-index:2000;
        }

        .dropdown {
          position: absolute;
          right: 0;
          top: 150px;
          background: white;
          border-radius: 10px;
          width: 150px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }

        .item {
          display: flex;
          gap: 10px;
          padding: 10px;
          cursor: pointer;
        }

        .item:hover {
          background: #f2f2f2d5;
        }

        .logout {
          color: black;
        }

        .search {
          padding: 8px;
          width: 250px;
          margin-bottom: 10px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          border: 1px solid #0e7dbe;
          padding: 8px;
        }

        th {
          background: #3e3bf3;
          color: white;
        }

        button {
          padding: 5px 10px;
          border: none;
          color: white;
          border-radius: 5px;
          cursor: pointer;
        }

        .approve { background: green; }
        .reject { background: red; }

        .toast {
          background: #0f5ed7;
          color: white;
          padding: 10px;
          margin-bottom: 10px;
          text-align: center;
        }

        .notif-popup {
          position: fixed;
          right: 20px;
          top: 60px;
          width: 220px;
          background: white;
          color: #333;
          padding: 10px;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
          z-index: 3000;
        }
        .modalOverlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 4000;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  width: 280px;
  animation: scaleIn 0.3s ease;
}

.modalActions {
  display: flex;
  justify-content: space-around;
  margin-top: 15px;
}

.modalActions button {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.modalActions button:first-child {
  background: #ccc;
}

.modalActions button:last-child {
  background: red;
  color: white;
}

@keyframes scaleIn {
  from { transform: scale(0.8); }
  to { transform: scale(1); }
}
      `}</style>
    </div>
  );
}