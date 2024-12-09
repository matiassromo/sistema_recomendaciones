from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from ..models.database import SessionLocal
from ..models.user_model import User
from ..controllers.auth_controller import create_user, authenticate_user, create_access_token
from pydantic import BaseModel

# Definir el esquema de Pydantic para la validación de datos
class UserCreate(BaseModel):
    username: str
    password: str
    role: str

class UserLogin(BaseModel):
    username: str
    password: str

router = APIRouter(
    tags=["Autenticación"]  # Nombre del grupo en Swagger UI
)

# Función para obtener la sesión de la base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Endpoint para registrar un usuario
@router.post("/register")
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    # Verificar si el usuario ya existe
    existing_user = db.query(User).filter(User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="El usuario ya existe")
    
    # Crear el nuevo usuario
    new_user = create_user(db=db, username=user.username, password=user.password, role=user.role)
    
    return {"message": "Usuario creado exitosamente", "user_id": new_user.id}

# Endpoint para login (autenticación)
@router.post("/login")
async def login_user(user: UserLogin, db: Session = Depends(get_db)):
    # Verificar las credenciales del usuario
    user_db = authenticate_user(db=db, username=user.username, password=user.password)
    if not user_db:
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")

    # Crear el token de acceso
    access_token = create_access_token(data={"sub": user_db.username, "role": user_db.role})

    return {"access_token": access_token, "token_type": "bearer"}
