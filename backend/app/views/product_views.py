from fastapi import APIRouter, HTTPException, Depends, Body
from sqlalchemy.orm import Session
from ..models.database import get_db
from ..models.product_model import Producto
from ..models.schemas import ProductoSchema
from ..models.sales_model import Venta  # Modelo de ventas, si existe

router = APIRouter()

# --- Rutas para Administradores ---
admin_router = APIRouter(prefix="/admin/productos", tags=["Admin"])

@admin_router.get("/")
async def obtener_productos_admin(db: Session = Depends(get_db)):
    """
    Obtener todos los productos (solo para administradores).
    """
    productos = db.query(Producto).all()
    return productos


@admin_router.post("/")
async def crear_producto(producto: ProductoSchema, db: Session = Depends(get_db)):
    """
    Crear un nuevo producto (solo para administradores).
    """
    nuevo_producto = Producto(**producto.dict())
    db.add(nuevo_producto)
    db.commit()
    db.refresh(nuevo_producto)
    return {"message": "Producto creado exitosamente", "producto": nuevo_producto}


@admin_router.put("/{producto_id}")
async def actualizar_producto(producto_id: int, producto: ProductoSchema, db: Session = Depends(get_db)):
    """
    Actualizar un producto existente (solo para administradores).
    """
    producto_db = db.query(Producto).filter(Producto.id == producto_id).first()
    if not producto_db:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    for key, value in producto.dict().items():
        setattr(producto_db, key, value)

    db.commit()
    db.refresh(producto_db)
    return {"message": "Producto actualizado", "producto": producto_db}


@admin_router.delete("/{producto_id}")
async def eliminar_producto(producto_id: int, db: Session = Depends(get_db)):
    """
    Eliminar un producto (solo para administradores).
    """
    producto = db.query(Producto).filter(Producto.id == producto_id).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    db.delete(producto)
    db.commit()
    return {"message": "Producto eliminado"}


# --- Rutas para Usuarios ---
user_router = APIRouter(prefix="/user", tags=["User"])

@user_router.get("/productos")
async def obtener_productos_usuario(db: Session = Depends(get_db)):
    """
    Obtener todos los productos disponibles para los usuarios.
    """
    productos = db.query(Producto).filter(Producto.stock > 0).all()
    return productos


@router.post("/user/comprar", tags=["User"])
async def comprar_producto(producto_id: int = Body(...), cantidad: int = Body(...), db: Session = Depends(get_db)):
    """
    Comprar un producto (solo para usuarios).
    """
    producto = db.query(Producto).filter(Producto.id == producto_id).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    if producto.stock < cantidad:
        raise HTTPException(status_code=400, detail="Stock insuficiente")
    
    # Reducir el stock del producto
    producto.stock -= cantidad

    # Registrar la venta
    nueva_venta = Venta(producto_id=producto_id, cantidad=cantidad)
    db.add(nueva_venta)

    db.commit()
    db.refresh(producto)
    return {
        "message": "Compra realizada exitosamente",
        "producto": {
            "id": producto.id,
            "nombre": producto.nombre,
            "precio": producto.precio,
            "stock": producto.stock,
        },
        "venta": {"producto_id": producto_id, "cantidad": cantidad},
    }


# --- Incluir en el archivo principal ---
router.include_router(admin_router)
router.include_router(user_router)
