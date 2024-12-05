from sqlalchemy.orm import Session
from sqlalchemy import func
from ..models.product_model import Producto
from ..models.sales_model import Venta

def obtener_recomendaciones(db: Session, limite: int = 5):
    """
    Obtiene las recomendaciones de productos más vendidos basados en las ventas
    de los últimos 30 días.
    """
    ultimos_30_dias = func.date(func.now(), '-30 days')

    resultados = (
        db.query(
            Producto.id,
            Producto.nombre,
            Producto.descripcion,
            Producto.precio,
            func.sum(Venta.cantidad).label("total_vendido"),
            func.max(Venta.fecha).label("ultima_venta")
        )
        .join(Venta, Producto.id == Venta.producto_id)
        .filter(Venta.fecha >= ultimos_30_dias)
        .group_by(Producto.id)
        .order_by(func.sum(Venta.cantidad).desc())
        .limit(limite)
        .all()
    )

    recomendaciones = [
        {
            "id": resultado.id,
            "nombre": resultado.nombre,
            "descripcion": resultado.descripcion,
            "precio": resultado.precio,
            "total_vendido": resultado.total_vendido,
            "ultima_venta": resultado.ultima_venta,
        }
        for resultado in resultados
    ]

    return recomendaciones
