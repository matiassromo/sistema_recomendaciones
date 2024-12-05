import React from "react";
import { Routes, Route } from "react-router-dom"; // Usa Routes y Route para las rutas
import LoginPage from "./pages/loginPage";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import RegisterPage from "./pages/RegisterPage";

const App = () => {
  return (
    <Routes> {/* Envolvemos las rutas dentro de Routes */}
      <Route path="/login" element={<LoginPage />} /> {/* Ruta para el login */}
      <Route path="/register" element={<RegisterPage />} /> {/* Ruta para el registro */}
      <Route path="/admin" element={<AdminDashboard />} /> {/* Ruta para el dashboard del admin */}
      <Route path="/user" element={<UserDashboard />} /> {/* Ruta para el dashboard del usuario */}
      <Route path="/" element={<LoginPage />} /> {/* Ruta por defecto para Login */}
    </Routes>
  );
};

export default App;
