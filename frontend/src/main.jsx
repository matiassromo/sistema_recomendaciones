import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Importa BrowserRouter
import App from "./App"; // Asegúrate de que tu componente App está importado

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter> {/* Envuelve la aplicación con BrowserRouter */}
    <App />
  </BrowserRouter>
);
