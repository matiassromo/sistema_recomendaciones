import React, { useState, useEffect } from "react";

const UserDashboard = () => {
  const [productos, setProductos] = useState([]);
  const [cantidad, setCantidad] = useState(1);

  const fetchProductos = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://127.0.0.1:8000/admin/productos/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setProductos(data);
  };
  
  const handleCompra = async (productoId) => {
    const token = localStorage.getItem("token");
    await fetch("http://127.0.0.1:8000/user/comprar/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ producto_id: productoId, cantidad }),
    });
    alert("Compra realizada con éxito.");
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const styles = {
    container: {
      maxWidth: "800px",
      margin: "50px auto",
      padding: "20px",
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    title: {
      textAlign: "center",
      marginBottom: "20px",
      fontSize: "24px",
      fontWeight: "bold",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    tableHeader: {
      backgroundColor: "#f4f4f4",
      fontWeight: "bold",
      textAlign: "left",
      padding: "10px",
      border: "1px solid #ddd",
    },
    tableCell: {
      padding: "10px",
      border: "1px solid #ddd",
    },
    actionButton: {
      padding: "8px 15px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      color: "#fff",
      backgroundColor: "#4caf50",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Productos Disponibles</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>Nombre</th>
            <th style={styles.tableHeader}>Precio</th>
            <th style={styles.tableHeader}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id}>
              <td style={styles.tableCell}>{producto.nombre}</td>
              <td style={styles.tableCell}>${producto.precio.toFixed(2)}</td>
              <td style={styles.tableCell}>
                <button
                  style={styles.actionButton}
                  onClick={() => handleCompra(producto.id)}
                >
                  Comprar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserDashboard;
