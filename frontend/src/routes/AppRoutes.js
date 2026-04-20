import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Adminhome from "../pages/Adminhome";
import Article from "../pages/Article";
import Profile from "../pages/Profile";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/adminhome" element={<Adminhome />} />
      <Route path="/article" element={<Article />} />
       <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default AppRoutes;