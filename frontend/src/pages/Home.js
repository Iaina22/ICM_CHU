import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar"; 

import s1 from "../assets/images/labo.jpg";
import s2 from "../assets/images/entretien.jpg";
import s3 from "../assets/images/mobilier.jpeg";
import s4 from "../assets/images/pharmacie.jpeg";
import s5 from "../assets/images/transport.jpg";
import s6 from "../assets/images/informatique.avif";
import s7 from "../assets/images/technique.jpg";
import s8 from "../assets/images/technique.jpg";

/* ✅ FIX WARNING ONLY */
const slides = [
  { img: s1, text: " de laboratoire" },
  { img: s2, text: " d'entretien" },
  { img: s3, text: " de mobilier" },
  { img: s4, text: " pharmacitique" },
  { img: s5, text: "de transport" },
  { img: s6, text: " informatique" },
  { img: s7, text: " biomedical/technique" },
  { img: s8, text: " biomedical/technique" },
];

function Home() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []); // ✅ no warning (slides stable)

  return (
    <div className="home-container">
      <Navbar />

      {/* MAIN INTRO */}
      <div className="main">
        {/* LEFT */}
        <div className="content"  id="articles">
          <h1>Compta Matière CHU.</h1>
          <p>
            Optimisez la gestion des matières hospitalières avec MediGestion.
            Notre application web vous permet de suivre avec précision les stocks et les mouvements de matériel au sein du CHU Anosiala.
            Assurez une traçabilité complète et une sécurité renforcée pour chaque matière médicale.
            Gagnez du temps et simplifiez les tâches administratives grâce à une interface intuitive et des fonctionnalités adaptées aux équipes hospitalières.
            Découvrez une solution moderne pour maîtriser vos stocks et améliorer la qualité des soins.
          </p>

          <div className="buttons">
            <Link to="/register" className="btn btn-outline">Inscription</Link>
          </div>
        </div>

        {/* RIGHT SLIDER */}
        <div className="slider">
          <div className="legend">
            <span className="fixed">Matériel : </span>
            <span className="dynamic">{slides[index].text}</span>
          </div>
          <img src={slides[index].img} alt="slide" />
        </div>
      </div>

      {/* MOUVEMENTS SECTION */}
      <div className="section" id="stocks">
        <h2>Entrées / Sorties</h2>
        <p>Suivi des mouvements de stock (entrées et sorties).</p>
      </div>

      {/* FOURNISSEURS SECTION */}
      <div className="section" id="demandes">
        <h2>Fournisseurs</h2>
        <p>Gestion des fournisseurs et partenaires hospitaliers.</p>
      </div>

      {/* DEMANDES SECTION */}
      <div className="section" id="contacts">
        <h2>Demandes</h2>
        <p>Suivi des demandes internes de matériel.</p>
      </div>

      <style>{`
        html {
          scroll-behavior: smooth; /* ✅ Smooth scroll */
        }

        body {
          margin: 0;
          font-family: 'Segoe UI', sans-serif;
        }

        .home-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .main {
          flex: 1;
          width: 90%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top:18%;
        }
        .content {
          width: 45%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin-top: -10%;
        }

        .content h1 {
          font-size: 36px;
          margin-bottom: 10px;
          color: #0f5ed7;
        }

        .content p {
          font-size: 18px;
          margin-bottom: 30px;
        }

        .slider {
          width: 45%;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: -10%;
        }

        .legend {
          margin-bottom: 10px;
          font-size: 18px;
        }

        .fixed {
          color: #333;
          font-weight: bold;
        }

        .dynamic {
          color: red;
          font-weight: bold;
        }

        .slider img {
          width: 100%;
          height: 320px;
          object-fit: cover;
          border-radius: 15px;
        }

        .buttons {
          display: flex;
          gap: 20px;
        }

        .btn {
          padding: 10px 25px;
          background: #0f5ed7;
          color: white;
          border-radius: 8px;
          text-decoration: none;
          font-weight: bold;
        }

        .btn-outline {
          background: white;
          color: #0a3a83;
          border: 2px solid #0f5ed7;
        }

        .section {
          width: 90%;
          margin: 50px auto;
          padding: 20px;
          background: #f5f5f5;
          border-radius: 12px;
        }

        .section h2 {
          color: #0f5ed7;
          margin-bottom: 10px;
        }
      `}</style>
    </div>
  );
}

export default Home;
