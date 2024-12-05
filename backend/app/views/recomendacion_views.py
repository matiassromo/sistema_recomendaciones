from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from datetime import datetime, timedelta
from ..models.database import get_db
from ..models.sales_model import Venta
from ..models.product_model import Producto

router = APIRouter()

@router.get("/recomendaciones/")
def obtener_recomendaciones(db: Session = Depends(get_db)):
    # Obtener fecha límite (últimos 30 días)
    fecha_limite = datetime.utcnow() - timedelta(days=30)
    
    # Consulta para agrupar ventas por producto y calcular la suma de cantidades
    recomendaciones = (
        db.query(
            Producto.id.label("producto_id"),
            Producto.nombre,
            Producto.descripcion,
            Producto.precio,
            func.sum(Venta.cantidad).label("total_vendido"),
            func.max(Venta.fecha).label("ultima_venta")
        )
        .join(Venta, Producto.id == Venta.producto_id)
        .filter(Venta.fecha >= fecha_limite)  # Solo ventas de los últimos 30 días
        .group_by(Producto.id)
        .order_by(func.sum(Venta.cantidad).desc())  # Ordenar por total vendido
        .limit(5)  # Limitar a los 5 productos más vendidos
        .all()
    )

    return recomendaciones
