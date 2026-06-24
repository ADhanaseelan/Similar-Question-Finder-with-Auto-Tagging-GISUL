from fastapi import APIRouter, Depends, HTTPException
import bcrypt
from datetime import datetime, timedelta
from jose import jwt
from pydantic import BaseModel

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

class GoogleUser(BaseModel):
    email: str
    uid: str
    displayName: str = ""

@router.post('/google', response_model=Token)
async def google_login(payload: GoogleUser, db_service=Depends(get_db)):
    """Handles Google Auth by mapping the Firebase UID to our custom JWT."""
    users_ref = db_service.reference('users')
    query = users_ref.order_by_child('email').equal_to(payload.email).get()
    
    if query:
        # User exists
        user_id, user_data = next(iter(query.items()))
    else:
        # Create new user
        new_user_ref = users_ref.push({
            'email': payload.email,
            'firebaseUid': payload.uid,
            'displayName': payload.displayName,
            'createdAt': datetime.utcnow().isoformat(),
            'authProvider': 'google'
        })
        user_id = new_user_ref.key

    token = create_access_token({'sub': user_id})
    return {'access_token': token, 'token_type': 'bearer'}

class PasswordUpdate(BaseModel):
    current_password: str
    new_password: str

from dependencies import get_current_user, CurrentUser

@router.put('/password')
async def update_password(
    payload: PasswordUpdate,
    current_user: CurrentUser = Depends(get_current_user),
    db_service = Depends(get_db)
):
    users_ref = db_service.reference(f'users/{current_user.id}')
    user = users_ref.get()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if user.get("authProvider") == "google":
        raise HTTPException(status_code=400, detail="Google users cannot change passwords here")

    if not verify_password(payload.current_password, user['password']):
        raise HTTPException(status_code=401, detail="Incorrect current password")
        
    hashed = hash_password(payload.new_password)
    users_ref.update({"password": hashed})
    
    return {"status": "success"}
