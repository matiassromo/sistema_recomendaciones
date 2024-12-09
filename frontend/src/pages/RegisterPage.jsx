import React, { useState } from "react";
import API_BASE_URL from "../config"; // Asegúrate de tener la URL base del backend
import Swal from "sweetalert2"; // Importa SweetAlert2

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // Valor por defecto para el rol
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); // Limpiar errores previos
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, role }),
      });

      if (!response.ok) {
        const errorData = await response.json();   
        setError(errorData.detail || "Error al registrar el usuario");
        return;
      }

      const data = await response.json();
      console.log("Usuario creado exitosamente", data);
      
      // Mostrar SweetAlert2 de éxito
      Swal.fire({
        icon: "success",
        title: "¡Usuario creado exitosamente!",
        text: "Ahora puedes iniciar sesión.",
        background: "#1c1c1c", // Fondo oscuro
        color: "#fff", // Texto blanco
        confirmButtonColor: "#4CAF50", // Color del botón de confirmación
      }).then(() => {
        // Redirigir a la página de login después de cerrar el mensaje
        window.location.href = "/login"; // Redirigir a la página de login
      });
      
    } catch (err) {
      setError("Error de conexión con el servidor.");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleRegister} style={styles.form}>
        <h2 style={styles.title}>Registrar Usuario</h2>
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
        <div style={styles.inputGroup}>
          <label style={styles.label}>Rol</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={styles.input}
          >
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        <button type="submit" style={styles.button}>
          Registrar Usuario
        </button>
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
};

export default RegisterPage;
