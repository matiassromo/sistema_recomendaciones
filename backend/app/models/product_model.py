from sqlalchemy import Column, Integer, String, Float
from .database import Base

class Producto(Base):
    __tablename__ = "productos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True)
    descripcion = Column(String, nullable=True)
    precio = Column(Float)

    def __repr__(self):
        return f"<Producto(id={self.id}, nombre={self.nombre}, precio={self.precio})>"
