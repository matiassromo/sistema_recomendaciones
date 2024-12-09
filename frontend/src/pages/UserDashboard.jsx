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

  return (
    <div>
      <h2>Productos Disponibles</h2>
      <ul>
        {productos.map((producto) => (
          <li key={producto.id}>
            {producto.nombre} - ${producto.precio}
            <button onClick={() => handleCompra(producto.id)}>Comprar</button>
          </li>
        ))}
      </ul>
    </div>
  );
  
};





export default UserDashboard;
