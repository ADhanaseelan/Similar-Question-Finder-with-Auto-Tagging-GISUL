from pydantic import BaseModel
from typing import Optional

class NoteRequest(BaseModel):
    content: str

class NoteResponse(BaseModel):
    id: Optional[str] = None
    content: str
    topic: str
    confidence: float
    createdAt: str
