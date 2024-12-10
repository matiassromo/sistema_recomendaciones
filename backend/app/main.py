from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .views.recomendacion_views import router as recomendacion_router
from .views.auth_views import router as auth_router
from .models.database import Base, engine
from .views.product_views import router as product_router
from .views.sales_views import router as sales_router

# Instanciar la aplicación FastAPI
app = FastAPI()

# Configurar CORS (permite comunicación entre backend y frontend)
from fastapi.middleware.cors import CORSMiddleware


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Asegúrate de que esté configurado correctamente, puedes probar con un dominio específico
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Incluir rutas desde los archivos de vistas (views)
app.include_router(auth_router, prefix="/auth")  # Agregamos las rutas de autenticación
app.include_router(product_router)
app.include_router(sales_router)
app.include_router(recomendacion_router)

