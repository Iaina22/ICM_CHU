import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import Navbar from "../components/NavbarLogin"; 

function Login() {
  const [prenom, setPrenom] = useState('');
  const [password, setPassword] = useState('');
  const [modal, setModal] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {

    // ===== ADMIN =====
    if (prenom === "Admin" && password === "azerty12") {
      navigate("/Adminhome");
      return;
    }

    // ===== STOCK =====
    if (prenom === "Stock" && password === "stock12") {
      navigate("/Article");
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prenom, mdp: password })
      });

      const data = await res.json();

      if (data.success) {

        if (data.user.status === 'active') {
           localStorage.setItem("userId", data.user.id);
          setModal("✅ Connexion réussie !");

          setTimeout(() => {
            setModal('');
            setPrenom('');
            setPassword('');
            navigate("/Article");
          }, 1500);
        }

        else if (data.user.status === 'pending') {
          setModal("⏳ Compte pas encore validé par l'administrateur");
           setTimeout(() => {
          navigate("/");
        }, 2000);
        }

        else if (data.user.status === 'rejected') {
          setModal("❌ Compte refusé par l'admin");
           setTimeout(() => {
          navigate("/");
        }, 2000);
        }

      } else {
        setModal("❌ Utilisateur introuvable ou mot de passe incorrect");
        
      }

    } catch (error) {
      console.error(error);
      setModal("❌ Erreur serveur");
    }
  };

  return (
    <div className="container">
      
       <Navbar />
      {/* ===== MODAL ===== */}
      {modal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <p>{modal}</p>
            <button onClick={() => setModal('')}>OK</button>
          </div>
        </div>
      )}

      {/* ===== LOGIN CARD ===== */}
      <div className="login-card">
       

        <h2>Connectez-vous</h2>

        <div className="form-group">
          <label>Prénom</label>
          <input
            type="text"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* ===== FORGOT PASSWORD (FIXED) ===== */}
        <div className="forgot-password" >
    <Link to="/Mdpoublier"  className="forgot-link">
  Mot de passe oublié ?
</Link>
        </div>

        <button onClick={handleSubmit}>Se connecter</button>
      </div>

      {/* ===== CSS ===== */}
      <style>{`

        .container {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .login-card {
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(12px);
          padding: 40px;
          border-radius: 20px;
          width: 250px;
          text-align: center;
          box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        }

        .login-card h2 {
          margin-bottom: 20px;
          color: #75a7f1;
        }

        .form-group {
          text-align: left;
          margin-bottom: 12px;
        }

        .form-group label {
          font-size: 13px;
          color: gray;
        }

        .login-card input {
          width: 100%;
          padding: 10px;
          border-radius: 10px;
          border: 1px solid #ddd;
        }

        .login-card button {
          width: 100%;
          padding: 10px;
          background: linear-gradient(135deg, #0f5ed7, #206fe6);
          color: white;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-weight: bold;
        }
        .forgot-link {
        font-size: 12px;
        color: #0b851f;
        text-decoration: none;
        text-align: end;
  
      }

      .forgot-link:hover {
        text-decoration: underline;
      }
        /* ===== MODAL ===== */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }

        .modal-box {
          background: white;
          padding: 20px;
          border-radius: 12px;
          text-align: center;
          width: 280px;
        }

        .modal-box button {
          margin-top: 10px;
          padding: 6px 15px;
          background: #0f5ed7;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

      `}</style>
    </div>
  );
}

export default Login;