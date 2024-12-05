import React, { useState, useEffect } from "react";

const AdminDashboard = () => {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");

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
  
  const handleAddProducto = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    await fetch("http://127.0.0.1:8000/admin/productos/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nombre, descripcion, precio }),
    });
    setNombre("");
    setDescripcion("");
    setPrecio("");
    fetchProductos();   
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  return (
    <div>
      <h2>Dashboard del Administrador</h2>
      <form onSubmit={handleAddProducto}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          required
        />
        <button type="submit">Agregar Producto</button>
      </form>
      <h3>Productos:</h3>
      <ul>
        {productos.map((producto) => (
          <li key={producto.id}>
            {producto.nombre} - ${producto.precio}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
