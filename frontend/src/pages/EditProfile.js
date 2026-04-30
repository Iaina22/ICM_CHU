import React, { useEffect, useState } from "react";
import Navbar from "../components/NavbarUser";
import { useNavigate } from "react-router-dom";

function EditProfile() {
  const [form, setForm] = useState({});
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  // 📥 Fetch user data
  useEffect(() => {
    fetch(`http://localhost:5000/api/user/${userId}`)
      .then(res => res.json())
      .then(data => setForm(data))
      .catch(err => console.error(err));
  }, [userId]);

  // ✏️ Handle input change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // 💾 Submit changes
  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`http://localhost:5000/api/user/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    })
      .then(res => {
        if (!res.ok) throw new Error("Update failed");
        return res.json();
      })
      .then(() => {
        navigate("/profile");
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="container">
      <Navbar />

      <form className="edit-card" onSubmit={handleSubmit}>
        <h3>Modifier Profil</h3>

        <input name="nom" value={form.nom || ""} onChange={handleChange} placeholder="Nom" />
        <input name="prenom" value={form.prenom || ""} onChange={handleChange} placeholder="Prénom" />
        <input name="age" value={form.age || ""} onChange={handleChange} placeholder="Âge" />
        <input name="sexe" value={form.sexe || ""} onChange={handleChange} placeholder="Sexe" />
        <input name="adresse" value={form.adresse || ""} onChange={handleChange} placeholder="Adresse" />
        <input name="email" value={form.email || ""} onChange={handleChange} placeholder="Email" />
        <input name="phone" value={form.phone || ""} onChange={handleChange} placeholder="Téléphone" />
        <input name="cin" value={form.cin || ""} onChange={handleChange} placeholder="CIN" />

        <button type="submit" className="btn-save">💾 Enregistrer</button>
        <button type="button" className="btn-cancel" onClick={() => navigate("/profile")}>
          ❌ Annuler
        </button>
      </form>

      <style>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #e0f7fa, #fce4ec);
          animation: fadeIn 1s ease-in-out;
          margin-top:5%;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .edit-card {
          width: 400px;
          padding: 20px;
          background: #fff;
          border-radius: 15px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
          display: flex;
          flex-direction: column;
          animation: slideUp 0.8s ease;
        }

        @keyframes slideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .edit-card h3 {
          text-align: center;
          margin-bottom: 15px;
        }

        .edit-card input {
          margin-bottom: 10px;
          padding: 8px;
          border-radius: 8px;
          border: 1px solid #ccc;
          transition: border-color 0.3s;
        }

        .edit-card input:focus {
          border-color: #4CAF50;
          outline: none;
        }

        .edit-card button {
          margin-top: 10px;
          padding: 10px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          font-weight: bold;
          transition: transform 0.2s, opacity 0.2s;
        }

        .edit-card button:hover {
          transform: scale(1.05);
          opacity: 0.9;
        }

        .btn-save {
          background-color: #4CAF50;
          color: white;
        }

        .btn-cancel {
          background-color: #f44336;
          color: white;
        }
      `}</style>
    </div>
  );
}

export default EditProfile;
