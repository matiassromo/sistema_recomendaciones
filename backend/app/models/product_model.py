from sqlalchemy import Column, Integer, String, Float
from .database import Base
from sqlalchemy.orm import relationship

class Producto(Base):
    __tablename__ = "productos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True)
    stock = Column(Integer, default=0)  # Definir el campo stock como entero
    precio = Column(Float)
    ventas = relationship("Venta", back_populates="producto")

    def __repr__(self):
        return f"<Producto(id={self.id}, nombre={self.nombre}, stock={self.stock}, precio={self.precio})>"
