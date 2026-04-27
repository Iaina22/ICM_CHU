import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import logo from "../assets/images/log.png";
import {  FiUser } from 'react-icons/fi';

function Navbar() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <>
      <nav className="navbar">
        <div>
  <Link
    to="/"
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textDecoration: "none"
    }}
  >
    <img
      style={{ width: "90px" }}
      src={logo}
      alt="logo"
    />

    <h1
      style={{
        color: "#0a54c4",
        fontSize: "16px",
        fontWeight: "bold",
        marginTop: "5px",
        marginBottom: 0
      }}
    >
      CHU Anosiala
    </h1>
  </Link>
</div>

        <ul className="nav-links">
          <li><Link to="/UserArticle">Articles</Link></li>
          <li><Link to="/demandes">Demandes</Link></li>
          <li>      
            <Link to="/profile" className="item">
              <FiUser className="icon" />
            </Link>
           </li>

          <li
  onClick={toggleTheme}
  style={{
    cursor: "pointer",
    display: "flex",
    alignItems: "center"
  }}
>
  {theme === "light" ? (
    <Moon size={22} />
  ) : (
    <Sun size={22} />
  )}
</li>
        </ul>
      </nav>

      <style>{`
      .navbar {
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  z-index: 1000;

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 15px;

  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(10px);

  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 12px;

  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);

  transition: 0.3s;
}

        .nav-links {
          list-style: none;
          display: flex;
          gap: 25px;
          align-items: center;
        }

        .nav-links a {
          text-decoration: none;
          color:  #0f5ed7;
          font-weight: 700;
          transition: 0.3s;
        }

        .nav-links a:hover {
          color: #206fe6;
          text-decoration: underline;
        }
  .icon {
          font-size: 22px;
          cursor: pointer;
        }


        
      `}</style>
    </>
  );
}

export default Navbar;