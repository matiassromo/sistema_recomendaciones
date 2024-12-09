from pydantic import BaseModel

class ProductoSchema(BaseModel):
    nombre: str
    stock: int
    precio: float

    class Config:
        schema_extra = {
            "example": {
                "nombre": "Producto Ejemplo",
                "stock": 10,
                "precio": 19.99,
            }
        }

