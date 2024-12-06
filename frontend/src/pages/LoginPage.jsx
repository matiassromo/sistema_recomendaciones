import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importar useNavigate
import Swal from "sweetalert2"; // Importa SweetAlert2
import API_BASE_URL from "../config";  // Asegúrate de que la ruta sea la correcta


const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Crear una instancia de navigate

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Limpiar errores previos
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.detail || "Credenciales inválidas");
        return;
      }

      // Guardar el token en localStorage
      localStorage.setItem("token", data.access_token);

      // Decodificar token para obtener el rol
      const decodedToken = JSON.parse(atob(data.access_token.split(".")[1]));
      const userRole = decodedToken.role;

      // Redirigir dependiendo del rol
      if (userRole === "admin") {
        Swal.fire({
          icon: "success",
          title: "Bienvenido Administrador",
          text: "Redirigiendo al dashboard de administración.",
          background: "#1c1c1c",
          color: "#fff",
          confirmButtonColor: "#4CAF50",
        }).then(() => {
          navigate("/admin"); // Redirige al dashboard del administrador
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Bienvenido Usuario",
          text: "Redirigiendo al dashboard del usuario.",
          background: "#1c1c1c",
          color: "#fff",
          confirmButtonColor: "#4CAF50",
        }).then(() => {
          navigate("/user"); // Redirige al dashboard del usuario
        });
      }
    } catch (err) {
      console.log("Error de conexión:", err);  // Muestra el error en la consola
      setError("Error de conexión con el servidor.");
    }
  };

  const goToRegisterPage = () => {
    navigate("/register"); // Redirige a la página de registro
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>
        <h2 style={styles.title}>Iniciar Sesión</h2>
        {error && <p style={styles.error}>{error}</p>}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Usuario</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={styles.input}
            placeholder="Ingrese su usuario"
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
            placeholder="Ingrese su contraseña"
          />
        </div>
        <button type="submit" style={styles.button}>
          Iniciar Sesión
        </button>
        <p style={styles.registerLink} onClick={goToRegisterPage}>
          ¿No tienes cuenta? Regístrate
        </p>
      </form>
    </div>
  );
};

const styles = {
  container: {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1c1c1c",
    color: "#fff",
    margin: "0",
    padding: "0",
  },
  form: {
    width: "320px",
    padding: "25px",
    backgroundColor: "#2c2c2c",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "22px",
    fontWeight: "bold",
  },
  error: {
    color: "#ff4d4d",
    textAlign: "center",
    marginBottom: "15px",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontSize: "14px",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#3c3c3c",
    color: "#fff",
    outline: "none",
    fontSize: "14px",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#4CAF50",
    border: "none",
    borderRadius: "5px",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  registerLink: {
    color: "#4CAF50",
    textAlign: "center",
    marginTop: "10px",
    cursor: "pointer",
    textDecoration: "underline",
  },
};

export default LoginPage;
