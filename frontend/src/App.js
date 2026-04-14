import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>

      {/* GLOBAL NAVBAR */}
      <Navbar />

      {/* ROUTES */}
      <AppRoutes />

    </BrowserRouter>
  );
}

export default App;