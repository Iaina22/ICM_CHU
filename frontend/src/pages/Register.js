import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/log.png";
import Navbar from "../components/NavbarRegister"; 
import socket from "../socket";

export default function Register() {
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    age: "",
    sexe: "",
    cin: "",
    adresse: "",
    email: "",
    phone: "",
    role: "",
    mdp: "",
    confirmMdp: "",
  });

  // ✅ FIX SOCKET USER
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) return;

    socket.emit("registerUser", user.id);

    socket.on("approved", (data) => {
      alert(data.message);

      if (data.message.includes("approuvé")) {
        navigate("/");
      }
    });

    return () => {
      socket.off("approved");
    };
  }, [user, navigate]); // ✅ FIX ONLY

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.mdp !== formData.confirmMdp) {
    setMessage("Mot de passe incorrect !");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (data.success) {
      setMessage("Inscription en attente de validation...");

      const user = {
        id: data.userId,
        nom: formData.nom,
        prenom: formData.prenom,
        age: formData.age,
        sexe: formData.sexe,
        cin: formData.cin,
        adresse: formData.adresse,
        email: formData.email,
        phone: formData.phone,
        role: formData.role
      };

      localStorage.setItem("user", JSON.stringify(user));

      setStep(1);

      setFormData({
        nom: "",
        prenom: "",
        age: "",
        sexe: "",
        cin: "",
        adresse: "",
        email: "",
        phone: "",
        role: "",
        mdp: "",
        confirmMdp: "",
      });
      setTimeout(() => {
        navigate("/"); 
      }, 1500);

    } else {
      setMessage(data.message);
    }

  } catch (err) {
    console.error(err);
    setMessage("Erreur serveur, réessayez plus tard");
  }
};

  return (
    <div className="container">
      <Navbar />

      {/* TOAST */}
      {message && <div className="toast">{message}</div>}

      <div className="card">
        {/* LEFT */}
        <div className="left">
          <div className="text">
            <div>
              <img
                style={{ width: "90px", marginLeft: "35%", borderRadius: "10px" }}
                src={logo}
                alt="logo"
              />
            </div>
            <h1>Créez votre compte</h1>
            <p>Pour accéder au suivi et à la gestion des matières de l’hôpital.</p>
          </div>
          <div className="circle big"></div>
          <div className="circle mid"></div>
          <div className="circle small"></div>
        </div>

        {/* RIGHT */}
        <div className="right">
          <h2>inscrivez-vous !</h2>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <>
                <input type="text" name="nom" placeholder="Nom" value={formData.nom} onChange={handleChange} required />
                <input type="text" name="prenom" placeholder="Prénom" value={formData.prenom} onChange={handleChange} required />
                <input type="number" name="age" placeholder="Âge" min="0" value={formData.age} onChange={handleChange} required />

                <select name="sexe" value={formData.sexe} onChange={handleChange} required>
                  <option value="">Sexe</option>
                  <option value="Homme">Homme</option>
                  <option value="Femme">Femme</option>
                  <option value="Autre">Autre</option>
                </select>

                <input type="text" name="cin" placeholder="CIN"
                  value={formData.cin}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, "");
                    let formatted = value.match(/.{1,3}/g)?.join("-") || "";
                    if (formatted.length > 15) formatted = formatted.slice(0, 15);
                    setFormData({ ...formData, cin: formatted });
                  }}
                  required
                />

                   <input
                  type="tel"
                  name="phone"
                  placeholder="Téléphone"
                  value={formData.phone}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, "");
                    if (value.length >= 3) {
                      const prefix = value.substring(0, 3);
                      if (!["032","033","034","037","038"].includes(prefix)) value = "";
                    }
                    let formatted = "";
                    if (value.length > 0) formatted += value.substring(0,3);
                    if (value.length > 3) formatted += " " + value.substring(3,5);
                    if (value.length > 5) formatted += " " + value.substring(5,8);
                    if (value.length > 8) formatted += " " + value.substring(8,10);
                    setFormData({ ...formData, phone: formatted });
                  }}
                  maxLength="13"
                  required
                />

                <button type="button" onClick={() => setStep(2)} className="btn">
                  Suivant
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <input type="text" name="adresse" placeholder="Adresse" value={formData.adresse} onChange={handleChange} required />

                <select name="role" value={formData.role} onChange={handleChange} required>
                  <option value="">Choisir un rôle</option>
                  <option value="Admin">Admin</option>
                  <option value="Comptable">Comptable</option>
                  <option value="Magasinier">Magasinier</option>
                  <option value="Médecin">Médecin</option>
                </select>

                <input type="password" name="mdp" placeholder="Mot de passe" value={formData.mdp} onChange={handleChange} required />
                <input type="password" name="confirmMdp" placeholder="Confirmer mot de passe" value={formData.confirmMdp} onChange={handleChange} required />

                <div className="actions">
                  <button type="button" onClick={() => setStep(1)} className="btn-outline">
                    Retour
                  </button>
                  <button type="submit" className="btn">
                    S'inscrire
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>

      <style>{`
      
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', sans-serif; }
        .container { height: 100vh; margin-top:3%; display: flex; justify-content: center; align-items: center;  }
        .card { width: 950px; height: 500px; background: white; border-radius: 15px; display: flex; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.3); }
        .left { width: 50%; background: linear-gradient(135deg, #3d4ee7, #7390ee); position: relative; display: flex; justify-content: center; align-items: center; color: white; border-top-right-radius: 120px; border-bottom-right-radius: 120px; overflow: hidden; }
        .text { z-index: 2; margin-top:-35%; align-items: center; }
        .text h1 { font-size: 28px; letter-spacing: 1px; color: #F3F4F6; }
        .text p { font-size: 13px; }
        .circle { position: absolute; border-radius: 50%; filter: blur(2px); animation: float 6s ease-in-out infinite; }
        .big { width: 300px; height: 300px; background: #74b9ff; bottom: -120px; left: -120px; animation-delay: 0s; }
        .mid { width: 160px; height: 160px; background: #4ea1ff; bottom: 40px; left: 120px; animation-delay: 1s; }
        .small { width: 100px; height: 100px; background: #a5d8ff; top: 30px; right: 40px; animation-delay: 2s; }
        @keyframes float { 0% { transform: translateY(0px) scale(1); } 50% { transform: translateY(-20px) scale(1.05); } 100% { transform: translateY(0px) scale(1); } }
        .right { width: 50%; padding: 30px; display: flex; flex-direction: column; justify-content: center; }
        .right h2 { margin-bottom: 15px; color: #8893fa; }
        .right input, .right select { padding: 10px; margin-bottom: 10px; border-radius: 8px; border: 1px solid #ddd; outline: none; width: 80%; }
        .right input:focus, .right select:focus { border-color: #0f5ed7; }
        .btn { padding: 10px; background: #0f5ed7; color: white; border: none; border-radius: 8px; cursor: pointer; margin-top: 10px; width: 80%; }
        .btn:hover { background: #0a4fb3; }
        .btn-outline { padding: 10px; border: 1px solid #19af2d; background: green; border-radius: 8px; cursor: pointer; width: 80%; }
        .actions { display: flex; flex-direction: column; align-items: flex-start; margin-top: 10px; gap: 10px; }

      .toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #0f5ed7;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  animation: fadeInOut 2s ease;
  z-index: 9999;
}

        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(-20px); }
          20% { opacity: 1; transform: translateY(0); }
          80% { opacity: 1; }
          100% { opacity: 0; transform: translateY(-20px); }
        }
      
    
      `}</style>
    </div>
  );
}