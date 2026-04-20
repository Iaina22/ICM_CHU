import React, { useEffect, useState } from "react";
import Navbar from "../components/NavbarUser";

export default function Profil() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"));
    if (data) {
      setUser(data);
    }
  }, []);

  if (!user) {
    return <h2 style={{ textAlign: "center" }}>Aucun utilisateur connecté</h2>;
  }

  return (
    <div className="container">
      <Navbar />

      {/* HEADER */}
      <div className="header">
        <h1>{user.nom} {user.prenom}</h1>
        <p>{user.role || "Utilisateur"}</p>
      </div>

      {/* AVATAR */}
      <div className="avatarBox">
        <img
          src="https://i.imgur.com/6VBx3io.png"
          alt="avatar"
        />
      </div>

      {/* CONTENT */}
      <div className="content">

        {/* ABOUT */}
        <div className="box">
          <h2>Apropos de  <span>moi </span></h2>
          <p>
            Bonjour je suis <b>{user.nom}</b>, 
            j'habite à <b>{user.adresse}</b>.<br/>
            Je suis <b>{user.role}</b>.
          </p>
        </div>

        {/* CONTACT */}
        <div className="box">
          <h2>Mes <span>information</span></h2>

          <p><b>Age:</b> {user.age}</p>
          <p><b>Sexe:</b> {user.sexe}</p>
          <p><b>CIN:</b> {user.cin}</p>
          <p><b>Email:</b> {user.email}</p>
          <p><b>Phone:</b> {user.phone}</p>
          <p><b>Adresse:</b> {user.adresse}</p>
        </div>
      </div>

      {/* STYLE */}
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Segoe UI', sans-serif;
        }

        .container {
          min-height: 100vh;
        }

        /* HEADER VIOLET ANIMATION */
        .header {
          background: linear-gradient(270deg, #6a11cb, #8e44ad, #9b59b6);
          background-size: 600% 600%;
          animation: gradientMove 8s ease infinite;
          color: white;
          text-align: center;
          padding: 50px 50px;

        }

        .header h1 {
          margin-bottom: 5px;
          
        }

    
        .avatarBox {
          display: flex;
          justify-content: center;
          margin-top: -60px;
        }

        .avatarBox img {
          width: 130px;
          height: 130px;
          border-radius: 50%;
          border: 5px solid white;
          background: white;
          animation: float 3s ease-in-out infinite;
        }

        /* CONTENT */
        .content {
          display: flex;
          justify-content: space-around;
          padding: 40px;
          flex-wrap: wrap;
        }

        /* BOX */
        .box {
          width: 40%;
          min-width: 280px;
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          transition: transform 0.3s ease;
          margin-bottom: 20px;
        }

        .box:hover {
          transform: translateY(-5px);
        }

        .box h2 {
          margin-bottom: 10px;
        }

        .box h2 span {
          color: #8e44ad;
        }

        .box p {
          margin: 8px 0;
        }

        /* ANIMATIONS */
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

      
      `}</style>
    </div>
  );
}