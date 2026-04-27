import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import socket from "./socket";


function App() {
  

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      socket.emit("registerUser", userId);
    }
    socket.on("statusUpdate", (data) => {
      alert(data.message); 
    });

    return () => {
      socket.off("statusUpdate");
    };
  }, []);

  return (
    <BrowserRouter>

      {/* ROUTES */}
      <AppRoutes />

    </BrowserRouter>
  );
}

export default App;