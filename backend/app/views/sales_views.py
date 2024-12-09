from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from ..models.database import get_db
from ..models.sales_model import Venta

router = APIRouter(
    tags=["Sales"]  # Nombre del grupo en Swagger UI
)

@router.get("/admin/estadisticas")
async def obtener_estadisticas(db: Session = Depends(get_db)):
    estadisticas = (
        db.query(
            Venta.producto_id,
            func.sum(Venta.cantidad).label("total_vendido"),
            func.max(Venta.fecha).label("ultima_venta"),
        )
        .group_by(Venta.producto_id)
        .all()
    )
    return estadisticas
