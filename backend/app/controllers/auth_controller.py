from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt
from sqlalchemy.orm import Session
from ..models.database import SessionLocal
from ..models.user_model import User

# Configuración para encriptar contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Configuración de JWT
SECRET_KEY = "1234"  # Cambia esto por una clave secreta
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Función para encriptar contraseñas
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# Función para verificar contraseñas
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# Función para autenticar usuario
def authenticate_user(db: Session, username: str, password: str):
    user = db.query(User).filter(User.username == username).first()
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user

# Función para crear un token de acceso
def create_access_token(data: dict, expires_delta: timedelta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Función para crear un nuevo usuario (registro)
def create_user(db: Session, username: str, password: str, role: str):
    # Hashear la contraseña
    hashed_password = hash_password(password)
    
    # Crear un nuevo objeto User con el hash de la contraseña
    new_user = User(username=username, hashed_password=hashed_password, role=role)
    
    # Agregar el usuario a la base de datos
    db.add(new_user)
    db.commit()
    db.refresh(new_user)  # Para obtener el objeto con el id generado
    
    return new_user

