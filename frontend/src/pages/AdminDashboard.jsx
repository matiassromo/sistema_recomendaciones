import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";


const AdminDashboard = () => {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [stock, setStock] = useState("");
  const [precio, setPrecio] = useState("");
  const [editId, setEditId] = useState(null); // Para controlar si se está editando un producto
  const [error, setError] = useState(null); // Para manejar errores

  // Fetch productos desde la API
  const fetchProductos = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/admin/productos", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener productos");
      }

      const data = await response.json();
      setProductos(data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los productos. Intenta nuevamente.");
    }
  };

  const handleSaveProducto = async (e) => {
    e.preventDefault();
  
    try {
      const token = localStorage.getItem("token");
      const url = editId
        ? `http://127.0.0.1:8000/admin/productos/${editId}`
        : `http://127.0.0.1:8000/admin/productos`;
  
      const method = editId ? "PUT" : "POST";
  
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre,
          stock: parseInt(stock, 10),
          precio: parseFloat(precio),
        }),
      });
  
      if (!response.ok) {
        throw new Error(
          editId
            ? "Error al actualizar el producto"
            : "Error al crear el producto"
        );
      }
  
      setNombre("");
      setStock("");
      setPrecio("");
      setEditId(null);
      setError(null);
      fetchProductos();
  
      Swal.fire({
        icon: "success",
        title: editId ? "Producto actualizado" : "Producto agregado",
        text: `El producto "${nombre}" ha sido ${editId ? "actualizado" : "agregado"} con éxito.`,
        background: "#1c1c1c",
          color: "#fff",
          confirmButtonColor: "#4CAF50",
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al guardar el producto. Intenta nuevamente.",
        background: "#1c1c1c",
          color: "#fff",
          confirmButtonColor: "#4CAF50",
      });
    }
  };
  

  const handleDeleteProducto = async (id) => {
    const producto = productos.find((p) => p.id === id); // Encuentra el producto por ID
  
    Swal.fire({
      title: "¿Estás seguro?",
      text: `Estás a punto de eliminar el producto "${producto.nombre}". Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: "#1c1c1c",
          color: "#fff",
          confirmButtonColor: "#4CAF50",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(
            `http://127.0.0.1:8000/admin/productos/${id}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
  
          if (!response.ok) {
            throw new Error("Error al eliminar el producto");
          }
  
          fetchProductos();
  
          Swal.fire({
            icon: "success",
            title: "Eliminado",
            text: `El producto "${producto.nombre}" ha sido eliminado con éxito.`,
            background: "#1c1c1c",
          color: "#fff",
          confirmButtonColor: "#4CAF50",
          });
        } catch (err) {
          console.error(err);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo eliminar el producto. Intenta nuevamente.",
            background: "#1c1c1c",
          color: "#fff",
          confirmButtonColor: "#4CAF50",
          });
        }
      }
    });
  };
  

  const handleEditProducto = (producto) => {
    setEditId(producto.id); // Establece el ID del producto a editar
    setNombre(producto.nombre); // Establece el nombre en el formulario
    setStock(producto.stock.toString()); // Establece el stock convertido a string en el formulario
    setPrecio(producto.precio.toString()); // Establece el precio convertido a string en el formulario
  };
  

  useEffect(() => {
    fetchProductos();
  }, []);

  
  const styles = {
    container: {
      maxWidth: "800px",
      margin: "50px auto",
      padding: "20px",
      backgroundColor: "#2c2c2c",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
      color: "#fff", // Cambia el texto a blanco para contraste
    },
    title: {
      textAlign: "center",
      marginBottom: "20px",
      fontSize: "24px",
      fontWeight: "bold",
      color: "#fff",
    },
    errorMessage: {
      color: "#ff4d4d",
      textAlign: "center",
      marginBottom: "20px",
    },
    form: {
      display: "flex",
      gap: "10px",
      marginBottom: "20px",
    },
    input: {
      flex: 1,
      padding: "10px",
      border: "1px solid #555", // Cambia a un color oscuro para armonía
      borderRadius: "4px",
      backgroundColor: "#3c3c3c", // Fondo oscuro para los inputs
      color: "#fff",
    },
    button: {
      padding: "10px 15px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      color: "#fff",
    },
    primaryButton: {
      backgroundColor: "#4caf50",
    },
    cancelButton: {
      backgroundColor: "#f44336",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "20px",
      backgroundColor: "#3c3c3c", // Fondo oscuro para la tabla
      color: "#fff",
    },
    tableHeader: {
      backgroundColor: "#444", // Color oscuro para el encabezado
      padding: "12px",
      border: "1px solid #555",
      textAlign: "left",
      fontWeight: "bold",
      fontSize: "16px",
      color: "#fff",
    },
    tableRow: {
      borderBottom: "1px solid #555",
    },
    tableCell: {
      padding: "10px",
      border: "1px solid #555",
      textAlign: "left",
      fontSize: "14px",
      color: "#fff",
    },
    actionButtons: {
      display: "flex",
      gap: "5px",
    },
    editButton: {
      backgroundColor: "#2196f3",
    },
    deleteButton: {
      backgroundColor: "#f44336",
    },
  };
  
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Dashboard del Administrador</h2>
      {error && <p style={styles.errorMessage}>{error}</p>}
      <form onSubmit={handleSaveProducto} style={styles.form}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="number"
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          required
          style={styles.input}
        />
        <button
          type="submit"
          style={{ ...styles.button, ...styles.primaryButton }}
        >
          {editId ? "Actualizar" : "Agregar"} Producto
        </button>
        {editId && (
          <button
            type="button"
            style={{ ...styles.button, ...styles.cancelButton }}
            onClick={() => {
              setEditId(null);
              setNombre("");
              setStock("");
              setPrecio("");
            }}
          >
            Cancelar
          </button>
        )}
      </form>
      <h3>Productos:</h3>
      <table style={styles.table}>
  <thead>
    <tr>
      <th style={styles.tableHeader}>Nombre</th>
      <th style={styles.tableHeader}>Stock</th>
      <th style={styles.tableHeader}>Precio</th>
      <th style={styles.tableHeader}>Acciones</th>
    </tr>
  </thead>
  <tbody>
    {productos.map((producto) => (
      <tr key={producto.id} style={styles.tableRow}>
        <td style={styles.tableCell}>{producto.nombre}</td>
        <td style={styles.tableCell}>{producto.stock} unidades</td>
        <td style={styles.tableCell}>${producto.precio.toFixed(2)}</td>
        <td style={styles.tableCell}>
          <button
            style={{ ...styles.button, ...styles.editButton }}
            onClick={() => handleEditProducto(producto)}
          >
            Editar
          </button>
          <button
            style={{ ...styles.button, ...styles.deleteButton }}
            onClick={() => handleDeleteProducto(producto.id)}
          >
            Eliminar
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

    </div>
  );
};

export default AdminDashboard;
