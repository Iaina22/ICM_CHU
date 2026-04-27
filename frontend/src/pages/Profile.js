import React, { useEffect, useState } from "react";
import Navbar from "../components/NavbarUser";
import { FiEdit, FiSettings } from "react-icons/fi";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:5000/api/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <p style={{ textAlign: "center" }}>Chargement...</p>;
  if (!user) return <p style={{ textAlign: "center" }}>Utilisateur introuvable</p>;

  return (
    <div className="container">
      <Navbar />

      <div className="profile-card">
        {/* Avatar + Nom + Rôle */}
        <div className="avatar-section">
          <div className="avatar">{user.prenom?.charAt(0).toUpperCase()}</div>
          <h3 className="name">{user.prenom}</h3>
          <p className="role">{user.role}</p>
        </div>

        {/* Boutons d’action */}
        <div className="action-buttons">
          <button>
            <FiEdit className="icon" />
            <span>Modifier les infos</span>
          </button>
          <button>
            <FiSettings className="icon" />
            <span>Paramètres</span>
          </button>
        </div>

        {/* Infos utilisateur */}
        <div className="info-box">
          <div className="info"><strong>Nom:</strong> {user.nom}</div>
          <div className="info"><strong>Prénom:</strong> {user.prenom}</div>
          <div className="info"><strong>Âge:</strong> {user.age}</div>
          <div className="info"><strong>Sexe:</strong> {user.sexe}</div>
          <div className="info"><strong>Adresse:</strong> {user.adresse}</div>
          <div className="info"><strong>Email:</strong> {user.email}</div>
          <div className="info"><strong>Téléphone:</strong> {user.phone}</div>
          <div className="info"><strong>CIN:</strong> {user.cin}</div>
          
          {/* Status afindra aty amin'ny farany */}
          <div className="info">
            <strong>Status:</strong>
            <span className={`status ${user.status}`}>{user.status}</span>
          </div>
        </div>
      </div>

      {/* CSS */}
      <style>{`
        .profile-card {
          width: 500px;
          background: #dee6e7c9;
          border-radius: 20px;
          box-shadow: 0 5px 25px rgba(177, 171, 171, 0.15);
          padding: 20px;
          text-align: center;
          margin-left:30%;
          margin-top:10%;
          
        }

        .avatar-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 15px;
        }

        .avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #482fd4, #504dff);
          color: white;
          font-size: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 10px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        }

        .name {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 3px;
        }

        .role {
          font-size: 14px;
          color: #666;
          margin: 0;
        }

        .status {
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 12px;
          color: white;
        }

        .status.active {
          background: #4caf50;
        }
        .status.pending {
          background: #ff9800;
        }
        .status.rejected {
          background: #f44336;
        }

        .action-buttons {
          display: flex;
          justify-content: space-around;
          margin: 15px 0;
          width: 100%;
        }

        .action-buttons button {
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 10px;
          padding: 8px;
          font-size: 13px;
          cursor: pointer;
          transition: 0.3s;
          box-shadow: 0 3px 8px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 140px; /* mivelatra kokoa */
        }

        .action-buttons button:hover {
          background: #e3f2fd;
        }

        .action-buttons .icon {
          font-size: 18px;
          margin-bottom: 5px;
        }

        .info-box {
          background: rgba(255,255,255,0.95);
          border-radius: 15px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.15);
          padding: 15px;
          margin: 15px 0;
          text-align: left;
        }

        .info {
          font-size: 14px;
          margin-bottom: 8px;
        }
      `}</style>
    </div>
  );
}

export default Profile;
