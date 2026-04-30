import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import logo from "../assets/images/log.png";
import { FiUser } from "react-icons/fi";

function Navbar() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <nav
      className="fixed top-1 left-0 w-full z-[1000]
                 flex justify-between items-center px-4 py-2
                 bg-gray-200 md:bg-white/70 md:backdrop-blur-md md:border md:border-black/10 md:rounded-xl md:shadow-md
                 transition duration-300
                 dark:bg-gray-900 dark:md:bg-gray-800 dark:md:border-white/20"
    >
      {/* LOGO */}
      <Link to="/" className="flex flex-col items-center no-underline">
        <img src={logo} alt="logo" className="w-[40px] md:w-[90px]" />
        <h1 className="text-black dark:text-white text-[11px] md:text-[16px] font-bold mt-0 mb-0">
          CHU Anosiala
        </h1>
      </Link>

      {/* LINKS */}
      <ul className="flex gap-3 md:gap-6 items-center text-xs md:text-base font-semibold">
        <li>
          <Link
            to="/UserArticle"
            className="text-blue-600 hover:text-blue-700 hover:underline"
          >
            Articles
          </Link>
        </li>
        <li>
          <Link
            to="/demandes"
            className="text-blue-600 hover:text-blue-700 hover:underline"
          >
            Demandes
          </Link>
        </li>
        <li>
          <Link
            to="/profile"
            className="text-blue-600 hover:text-blue-700"
          >
            <FiUser className="w-4 h-4 md:w-6 md:h-6" />
          </Link>
        </li>
        <li
          onClick={toggleTheme}
          className="cursor-pointer flex items-center"
        >
          {theme === "light" ? (
            <Moon size={18} className="text-black md:w-[22px]" />
          ) : (
            <Sun size={18} className="text-blue-600 md:w-[22px]" />
          )}
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
