from fastapi import APIRouter, Depends, HTTPException
import uuid
from datetime import datetime
from pydantic import BaseModel
from dependencies import get_current_user
from database import get_db
from services.quiz_generator import QuizGeneratorService

router = APIRouter()
quiz_service = QuizGeneratorService()

class QuizRequest(BaseModel):
    source_type: str
    content: str
    blooms_level: str

@router.post('/generate')
async def generate_quiz(
    payload: QuizRequest,
    user=Depends(get_current_user),
    db_service=Depends(get_db)
):
    if not payload.content:
        raise HTTPException(status_code=400, detail="Content cannot be empty.")
        
    try:
        questions = await quiz_service.generate_mock_quiz(
            source_type=payload.source_type,
            content=payload.content,
            blooms_level=payload.blooms_level
        )

        # Store in Firebase
        quiz_id = str(uuid.uuid4())
        quiz_ref = db_service.reference(f'quizzes/{user.id}/{quiz_id}')
        
        quiz_data = {
            'id': quiz_id,
            'source_type': payload.source_type,
            'blooms_level': payload.blooms_level,
            'questions': questions,
            'createdAt': datetime.utcnow().isoformat(),
        }
        
        quiz_ref.set(quiz_data)

        return quiz_data
    except Exception as e:
        print(f"Error generating quiz: {e}")
        raise HTTPException(status_code=500, detail=str(e))
