from fastapi import APIRouter, Depends, Request
from datetime import datetime
from typing import List

from database import get_db
from dependencies import get_current_user
from models.note import NoteRequest, NoteResponse

router = APIRouter()

@router.post('/', response_model=NoteResponse)
async def create_note(
    payload: NoteRequest,
    user=Depends(get_current_user),
    db_service=Depends(get_db),
    request: Request = None,
):
    embedder = request.app.state.embedder
    tagger = request.app.state.tagger

    # 1. Classify the note content
    topic, confidence = tagger.classify(payload.content, embedder)

    # 2. Persist to Firebase
    notes_ref = db_service.reference(f'notes/{user.id}')
    new_note_ref = notes_ref.push()
    
    note_data = {
        'userId': user.id,
        'content': payload.content,
        'topic': topic,
        'confidence': confidence,
        'createdAt': datetime.utcnow().isoformat(),
    }
    
    new_note_ref.set(note_data)

    return NoteResponse(
        id=new_note_ref.key,
        **note_data
    )

@router.get('/', response_model=List[NoteResponse])
async def get_notes(
    user=Depends(get_current_user),
    db_service=Depends(get_db),
):
    notes_ref = db_service.reference(f'notes/{user.id}')
    notes_data = notes_ref.get()
    
    if not notes_data:
        return []
        
    docs = []
    for key, val in notes_data.items():
        doc = val.copy()
        doc['id'] = key
        docs.append(doc)
        
    docs.sort(key=lambda x: x.get('createdAt', ''), reverse=True)
    return docs
