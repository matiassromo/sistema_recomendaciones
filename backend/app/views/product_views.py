from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from ..models.database import get_db
from ..models.product_model import Producto
from ..models.schemas import ProductoSchema
from fastapi import Body

router = APIRouter(
    tags=["Product"]  # Nombre del grupo en Swagger UI
)

# Leer todos los productos
@router.get("/admin/productos")
async def obtener_productos(db: Session = Depends(get_db)):
    productos = db.query(Producto).all()
    return productos

# Crear un producto
@router.post("/admin/productos")
async def crear_producto(producto: ProductoSchema, db: Session = Depends(get_db)):
    nuevo_producto = Producto(**producto.dict())
    db.add(nuevo_producto)
    db.commit()
    db.refresh(nuevo_producto)
    return {"message": "Producto creado exitosamente", "producto": nuevo_producto}

# Actualizar un producto
@router.put("/admin/productos/{producto_id}")
async def actualizar_producto(producto_id: int, producto: ProductoSchema, db: Session = Depends(get_db)):
    producto_db = db.query(Producto).filter(Producto.id == producto_id).first()
    if not producto_db:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    for key, value in producto.dict().items():
        setattr(producto_db, key, value)

    db.commit()
    db.refresh(producto_db)
    return {"message": "Producto actualizado", "producto": producto_db}



# Eliminar un producto
@router.delete("/admin/productos/{producto_id}")
async def eliminar_producto(producto_id: int, db: Session = Depends(get_db)):
    producto = db.query(Producto).filter(Producto.id == producto_id).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    db.delete(producto)
    db.commit()
    return {"message": "Producto eliminado"}
