from fastapi import APIRouter, Depends, Query
from database import get_db
from dependencies import get_current_user
from models.question import HistoryItem
from typing import List

router = APIRouter()

@router.get('/', response_model=List[HistoryItem])
async def get_history(
    user=Depends(get_current_user),
    db_service=Depends(get_db),
    limit: int = Query(50, ge=1, le=200),
    skip:  int = Query(0,  ge=0),
):
    questions_ref = db_service.reference(f'questions/{user.id}')
    questions_data = questions_ref.order_by_child('createdAt').limit_to_last(limit + skip).get()
    
    if not questions_data:
        return []
    
    docs = []
    for key, val in questions_data.items():
        doc = val.copy()
        doc['id'] = key
        doc.pop('embedding', None)
        # Handle empty similarQuestions list
        if 'similarQuestions' not in doc or not doc['similarQuestions']:
            doc['similarQuestions'] = []
        docs.append(doc)
    
    docs.sort(key=lambda x: x.get('createdAt', ''), reverse=True)
    return docs[skip:skip+limit]

@router.get('/{topic}', response_model=List[HistoryItem])
async def get_history_by_topic(
    topic: str,
    user=Depends(get_current_user),
    db_service=Depends(get_db),
):
    questions_ref = db_service.reference(f'questions/{user.id}')
    questions_data = questions_ref.order_by_child('topic').equal_to(topic).get()
    
    if not questions_data:
        return []
    
    docs = []
    for key, val in questions_data.items():
        doc = val.copy()
        doc['id'] = key
        doc.pop('embedding', None)
        if 'similarQuestions' not in doc or not doc['similarQuestions']:
            doc['similarQuestions'] = []
        docs.append(doc)
    
    docs.sort(key=lambda x: x.get('createdAt', ''), reverse=True)
    return docs
