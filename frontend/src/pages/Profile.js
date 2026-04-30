import React, { useEffect, useState } from "react";
import Navbar from "../components/NavbarUser";
import { FiEdit, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false); // ✅ state modal
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

      <div className="layout">
        {/* Fenêtre kely ankavia */}
        <div className="side-window">
          <h4>Paramètres</h4>
          <button onClick={() => navigate("/editProfile")}>
            <FiEdit className="icon" />
            <span>Modification</span>
          </button>
          <button onClick={() => setShowLogoutModal(true)}>
            <FiLogOut className="icon" />
            <span>Déconnexion</span>
          </button>
        </div>

        {/* Profile card ankavanana */}
        <div className="profile-card">
          <div className="avatar">{user.prenom?.charAt(0).toUpperCase()}</div>
          <h3 className="name">{user.prenom}</h3>
          <p className="role">{user.role}</p>

          <div className="info-box">
            <div className="info"><strong>Nom:</strong> {user.nom}</div>
            <div className="info"><strong>Prénom:</strong> {user.prenom}</div>
            <div className="info"><strong>Âge:</strong> {user.age}</div>
            <div className="info"><strong>Sexe:</strong> {user.sexe}</div>
            <div className="info"><strong>CIN:</strong> {user.cin}</div>
            <div className="info"><strong>Adresse:</strong> {user.adresse}</div>
            <div className="info"><strong>Email:</strong> {user.email}</div>
            <div className="info"><strong>Téléphone:</strong> {user.phone}</div>
            <div className="info">
              <strong>Status:</strong>
              <span className={`status ${user.status}`}>{user.status}</span>
            </div>
          </div>
        </div>
      </div>

     
      {/* Modal Déconnexion */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Voulez-vous vraiment vous déconnecter ?</h3>
            <div className="modal-actions">
              <button
                className="yes"
                onClick={() => {
                  localStorage.clear();
                  navigate("/"); 
                }}
              >
                Oui
              </button>
              <button className="no" onClick={() => setShowLogoutModal(false)}>
                Non
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS */}
      <style>{`
        .container { margin-top: 10%; margin-left:;10%
        margin-rigth:10%; }
        .layout {
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
          gap: 30px;
          margin: 5% auto;
          width: 90%;
        }

        .side-window {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.15);
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 15px;
          width: 180px;
          height: fit-content;
          position: sticky;
          top: 100px;
        }

        .side-window h4 {
          margin: 0 0 10px;
          font-size: 16px;
          text-align: center;
        }

        .side-window button {
          background: #f9f9f9;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 10px;
          font-size: 13px;
          cursor: pointer;
          transition: 0.3s;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .side-window button:hover { background: #e3f2fd; }
        .side-window .icon { font-size: 20px; margin-bottom: 5px; }

        .profile-card {
          flex: 1;
          background: #dee6e7c9;
          border-radius: 20px;
          box-shadow: 0 5px 25px rgba(177, 171, 171, 0.15);
          padding: 10px;
          text-align: center;
          width:50%;
        }

        .avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: linear-gradient(135deg, #482fd4, #504dff);
          color: white;
          font-size: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 15px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        }

        .name { font-size: 22px; font-weight: bold; margin-bottom: 3px; }
        .role { font-size: 14px; color: #666; margin-bottom: 15px; }

        .info-box {
          background: rgba(255,255,255,0.95);
          border-radius: 15px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.15);
          padding: 20px;
          text-align: left;
          width:50%;
          margin-left:25%;
        }

        .info { font-size: 14px; margin-bottom: 12px; }

        .status { padding: 4px 10px; border-radius: 12px; font-size: 12px; color: white; }
        .status.active { background: #4caf50; }
        .status.pending { background: #ff9800; }
        .status.rejected { background: #f44336; }

        .logo-footer { text-align: center; margin-top: 40px; }
        .logo-footer img { height: 70px; }

        /* Modal CSS */
        .modal-overlay {
          position: fixed;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background: rgba(0,0,0,0.5);
          display: flex; align-items: center; justify-content: center;
          z-index: 999;
        }
        .modal {
          background: #fff;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.3);
          text-align: center;
          width: 300px;
        }
        .modal-actions {
          display: flex;
          justify-content: space-around;
          margin-top: 20px;
        }
        .modal-actions .yes {
          background: #f12c3d;
          color: white;
          border: none;
          padding: 8px 15px;
          border-radius: 8px;
          cursor: pointer;
        }
        .modal-actions .no {
          background: #babac4;
          color: white;
          border: none;
          padding: 8px 15px;
          border-radius: 8px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

export default Profile;
