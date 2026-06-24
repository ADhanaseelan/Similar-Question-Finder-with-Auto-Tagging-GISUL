from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from database import get_db
from dependencies import get_current_user, CurrentUser

router = APIRouter()

class UserProfileUpdate(BaseModel):
    displayName: str
    email: str = None  # Read-only mostly, but client might send it

@router.get('/me')
async def get_my_profile(
    current_user: CurrentUser = Depends(get_current_user),
    db_service = Depends(get_db)
):
    user_ref = db_service.reference(f'users/{current_user.id}')
    user = user_ref.get()
    if not user:
        raise HTTPException(status_code=404, detail='User not found')
    
    return {
        "id": current_user.id,
        "email": user.get("email"),
        "displayName": user.get("displayName", user.get("email", "").split("@")[0]),
        "authProvider": user.get("authProvider", "email")
    }

@router.put('/me')
async def update_my_profile(
    payload: UserProfileUpdate,
    current_user: CurrentUser = Depends(get_current_user),
    db_service = Depends(get_db)
):
    user_ref = db_service.reference(f'users/{current_user.id}')
    user_ref.update({
        "displayName": payload.displayName
    })
    return {"status": "success", "displayName": payload.displayName}
