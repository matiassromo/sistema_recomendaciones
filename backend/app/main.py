from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .views.recomendacion_views import router as recomendacion_router
from .views.auth_views import router as auth_router
from .models.database import Base, engine

# Instanciar la aplicación FastAPI
app = FastAPI()

# Configurar CORS (permite comunicación entre backend y frontend)
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir todas las URLs, o especifica solo tu frontend
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos los métodos
    allow_headers=["*"],  # Permitir todos los encabezados
)


# Incluir rutas desde los archivos de vistas (views)
app.include_router(recomendacion_router)
app.include_router(auth_router)  # Agregamos las rutas de autenticación

