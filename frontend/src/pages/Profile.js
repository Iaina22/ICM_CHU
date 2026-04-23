import React, { useEffect, useState } from "react";
import Navbar from "../components/NavbarUser";

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
        <h2>👤 Profil utilisateur</h2>

        <div className="info"><strong>Nom:</strong> {user.nom}</div>
        <div className="info"><strong>Prénom:</strong> {user.prenom}</div>
        <div className="info"><strong>Âge:</strong> {user.age}</div>
        <div className="info"><strong>Sexe:</strong> {user.sexe}</div>
        <div className="info"><strong>Email:</strong> {user.email}</div>
        <div className="info"><strong>Téléphone:</strong> {user.phone}</div>
        <div className="info"><strong>Rôle:</strong> {user.role}</div>
        <div className="info">
          <strong>Status:</strong> 
          <span className={`status ${user.status}`}>
            {user.status}
          </span>
        </div>
      </div>

      {/* CSS */}
      <style>{`
        .container {
          padding: 20px;
        }

        .profile-card {
          max-width: 400px;
          margin-top:10%;
          background: rgba(255,255,255,0.8);
          backdrop-filter: blur(10px);
          padding: 25px;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }

        .profile-card h2 {
          text-align: center;
          margin-bottom: 20px;
          color: #0f5ed7;
        }

        .info {
          margin-bottom: 10px;
          font-size: 14px;
        }

        .status {
          margin-left: 8px;
          padding: 3px 8px;
          border-radius: 8px;
          color: white;
          font-size: 12px;
        }

        .status.active {
          background: green;
        }

        .status.pending {
          background: orange;
        }

        .status.rejected {
          background: red;
        }
      `}</style>
    </div>
  );
}

export default Profile;