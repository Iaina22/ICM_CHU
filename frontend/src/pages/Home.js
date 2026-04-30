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
    <div className="min-h-screen flex flex-col items-center font-[Segoe_UI] scroll-smooth text-[14px] md:text-[16px]">
      <Navbar />

      {/* MAIN INTRO */}
      <div className="flex flex-col md:flex-row w-[90%] justify-between items-center mt-[18%] flex-1">
        {/* LEFT */}
        <div className="flex flex-col justify-center w-full md:w-[45%] mt-5 md:-mt-[10%]" id="articles">
          <h1 className="text-[24px] md:text-[36px] mb-2 text-[#0f5ed7] font-bold">Compta Matière CHU.</h1>
          <p className="text-[14px] md:text-[18px] mb-8">
            Optimisez la gestion des matières hospitalières avec MediGestion.
            Notre application web vous permet de suivre avec précision les stocks et les mouvements de matériel au sein du CHU Anosiala.
            Assurez une traçabilité complète et une sécurité renforcée pour chaque matière médicale.
            Gagnez du temps et simplifiez les tâches administratives grâce à une interface intuitive et des fonctionnalités adaptées aux équipes hospitalières.
            Découvrez une solution moderne pour maîtriser vos stocks et améliorer la qualité des soins.
          </p>

          <div className="flex gap-5">
            <Link to="/register" className="px-4 py-2 md:px-6 md:py-2 bg-[#0f5ed7] text-white rounded-lg font-bold border-2 border-[#0f5ed7] hover:opacity-90 text-sm md:text-base">
              Inscription
            </Link>
          </div>
        </div>

        {/* RIGHT SLIDER */}
        <div className="flex flex-col items-center w-full md:w-[45%] mt-5 md:-mt-[10%]">
          <div className="mb-2 text-[14px] md:text-[18px]">
            <span className="text-gray-800 font-bold">Matériel : </span>
            <span className="text-red-600 font-bold">{slides[index].text}</span>
          </div>
          <img src={slides[index].img} alt="slide" className="w-full h-[220px] md:h-[320px] object-cover rounded-xl" />
        </div>
      </div>

      {/* MOUVEMENTS SECTION */}
      <div className="w-[90%] my-8 md:my-12 p-4 md:p-5 bg-[#f5f5f5] rounded-xl" id="stocks">
        <h2 className="text-[#0f5ed7] mb-2 text-lg md:text-xl font-semibold">Entrées / Sorties</h2>
        <p className="text-sm md:text-base">Suivi des mouvements de stock (entrées et sorties).</p>
      </div>

      {/* FOURNISSEURS SECTION */}
      <div className="w-[90%] my-8 md:my-12 p-4 md:p-5 bg-[#f5f5f5] rounded-xl" id="demandes">
        <h2 className="text-[#0f5ed7] mb-2 text-lg md:text-xl font-semibold">Fournisseurs</h2>
        <p className="text-sm md:text-base">Gestion des fournisseurs et partenaires hospitaliers.</p>
      </div>

      {/* DEMANDES SECTION */}
      <div className="w-[90%] my-8 md:my-12 p-4 md:p-5 bg-[#f5f5f5] rounded-xl" id="contacts">
        <h2 className="text-[#0f5ed7] mb-2 text-lg md:text-xl font-semibold">Demandes</h2>
        <p className="text-sm md:text-base">Suivi des demandes internes de matériel.</p>
      </div>
    </div>
  );
}

export default Home;
