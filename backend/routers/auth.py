from fastapi import APIRouter, Depends, HTTPException
import bcrypt
from datetime import datetime, timedelta
from jose import jwt

from config import settings
from database import get_db
from models.user import UserCreate, Token

router = APIRouter()

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=settings.JWT_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")
    return encoded_jwt

@router.post('/register', status_code=201)
async def register(payload: UserCreate, db_service=Depends(get_db)):
    users_ref = db_service.reference('users')
    query = users_ref.order_by_child('email').equal_to(payload.email).get()
    if query:
        raise HTTPException(status_code=409, detail='Email already registered')
    
    hashed = hash_password(payload.password)
    new_user_ref = users_ref.push({
        'email': payload.email,
        'password': hashed,
        'createdAt': datetime.utcnow().isoformat(),
    })
    return {'userId': new_user_ref.key}

@router.post('/login', response_model=Token)
async def login(payload: UserCreate, db_service=Depends(get_db)):
    users_ref = db_service.reference('users')
    query = users_ref.order_by_child('email').equal_to(payload.email).get()
    
    if not query:
        raise HTTPException(status_code=401, detail='Invalid credentials')
    
    user_id, user_data = next(iter(query.items()))
    
    if not verify_password(payload.password, user_data['password']):
        raise HTTPException(status_code=401, detail='Invalid credentials')
        
    token = create_access_token({'sub': user_id})
    return {'access_token': token, 'token_type': 'bearer'}
