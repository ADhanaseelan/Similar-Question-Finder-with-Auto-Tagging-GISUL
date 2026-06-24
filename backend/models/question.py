from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class QuestionRequest(BaseModel):
    question: str

class SimilarQuestion(BaseModel):
    question: str
    topic: str
    similarity: float

class SearchResult(BaseModel):
    isDuplicate: bool
    duplicateQuestion: Optional[str] = None
    similarity: Optional[float] = None
    topic: Optional[str] = None
    confidence: Optional[float] = None
    similarQuestions: Optional[List[SimilarQuestion]] = None
    chatResponse: Optional[str] = None

class HistoryItem(BaseModel):
    id: str
    question: str
    topic: str
    confidence: float
    similarQuestions: List[SimilarQuestion]
    createdAt: datetime
