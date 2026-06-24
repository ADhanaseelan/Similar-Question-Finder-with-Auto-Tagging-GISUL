from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from config import settings
from database import get_db

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

class CurrentUser:
    def __init__(self, id: str):
        self.id = id

async def get_current_user(token: str = Depends(oauth2_scheme), db_service = Depends(get_db)) -> CurrentUser:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user_ref = db_service.reference(f'users/{user_id}')
    user = user_ref.get()
    if user is None:
        raise credentials_exception
    return CurrentUser(id=user_id)
