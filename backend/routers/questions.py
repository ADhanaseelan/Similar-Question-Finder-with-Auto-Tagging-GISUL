from fastapi import APIRouter, Depends, Request
from datetime import datetime

from database import get_db
from dependencies import get_current_user
from models.question import QuestionRequest, SearchResult

import asyncio
from services.similarity_service import check_duplicate, find_similar

router = APIRouter()

@router.post('/search', response_model=SearchResult)
async def search_similar(
    payload: QuestionRequest,
    user=Depends(get_current_user),
    db_service=Depends(get_db),
    request: Request = None,
):
    embedder = request.app.state.embedder
    tagger = request.app.state.tagger

    # 1. Generate embedding
    embedding = embedder.encode(payload.question).tolist()

    # 2. Check for duplicate
    dup = await check_duplicate(db_service, embedding, user.id, threshold=0.90)
    if dup:
        return SearchResult(
            isDuplicate=True,
            duplicateQuestion=dup['question'],
            similarity=round(dup['score'] * 100, 1)
        )

    # 3. Find top 5 similar
    similar = await find_similar(db_service, embedding, user.id, top_k=5)

    # 4. Classify topic
    topic, confidence = tagger.classify(payload.question, embedder)
    
    # 5. Generate Chatbot Response
    chat_response = ""
    if similar and len(similar) > 0:
        chat_response = f"Based on your study history, this question clearly relates to **{topic}**. I found {len(similar)} similar questions you've asked in the past. Reviewing those prior concepts might help you connect the dots here!"
    else:
        chat_response = f"This looks like a brand new concept for you! I've categorized this under **{topic}**. Let's dive deep into this subject together."

    # 6. Persist
    questions_ref = db_service.reference(f'questions/{user.id}')
    questions_ref.push({
        'userId': user.id,
        'question': payload.question,
        'embedding': embedding,
        'topic': topic,
        'confidence': confidence,
        'similarQuestions': similar,
        'createdAt': datetime.utcnow().isoformat(),
    })

    return SearchResult(
        isDuplicate=False,
        topic=topic,
        confidence=confidence,
        similarQuestions=similar,
        chatResponse=chat_response
    )

import random

@router.get('/suggestions', response_model=list[str])
async def get_suggestions(
    db_service=Depends(get_db)
):
    """Returns 3 random questions from the database to show as dynamic suggestions."""
    all_ref = db_service.reference('questions')
    all_data = all_ref.get()
    
    questions = []
    if all_data:
        for uid, user_qs in all_data.items():
            if isinstance(user_qs, dict):
                for qid, qdata in user_qs.items():
                    if 'question' in qdata:
                        questions.append(qdata['question'])
                        
    if not questions:
        return [
            "What is Artificial Intelligence and Machine Learning?",
            "Explain how the virtual DOM works in React",
            "What is the time complexity of sorting algorithms?"
        ]
        
    # Pick 3 random unique questions
    sample_size = min(3, len(set(questions)))
    return random.sample(list(set(questions)), sample_size)

@router.get('/autocomplete', response_model=list[str])
async def autocomplete(
    q: str = "",
    db_service=Depends(get_db)
):
    """Returns up to 5 matching questions based on user text input."""
    if not q or len(q) < 2:
        return []
        
    all_ref = db_service.reference('questions')
    all_data = all_ref.get()
    
    matches = set()
    q_lower = q.lower()
    
    if all_data:
        for uid, user_qs in all_data.items():
            if isinstance(user_qs, dict):
                for qid, qdata in user_qs.items():
                    if 'question' in qdata:
                        text = qdata['question']
                        if q_lower in text.lower():
                            matches.add(text)
                            if len(matches) >= 5:
                                return list(matches)
                                
    return list(matches)
