from fastapi import APIRouter, Depends, Request
from datetime import datetime

from database import get_db
from dependencies import get_current_user
from models.question import QuestionRequest, SearchResult

import asyncio
from services.similarity_service import check_duplicate, find_similar
from services.llm_service import get_llm_service

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
    is_duplicate = False
    duplicate_question = None
    similarity_score = None
    
    if dup:
        is_duplicate = True
        duplicate_question = dup['question']
        similarity_score = round(dup['score'] * 100, 1)

    # 3. Find top 5 similar
    similar = await find_similar(db_service, embedding, user.id, top_k=5)

    # 4. Classify topic
    topic, confidence = tagger.classify(payload.question, embedder)
    
    # 5. Generate Chatbot Response
    llm = get_llm_service()
    ai_answer = llm.generate_answer(payload.question)
    
    if similar and len(similar) > 0:
        chat_response = f"AI Answer: {ai_answer}\n\nNote: I also found {len(similar)} similar questions you've asked in the past about {topic}. Reviewing those prior concepts might help you connect the dots!"
    else:
        chat_response = f"AI Answer: {ai_answer}\n\nThis looks like a brand new concept for you! I've categorized this under {topic}. Let's dive deep into this subject together."

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
        isDuplicate=is_duplicate,
        duplicateQuestion=duplicate_question,
        similarity=similarity_score,
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

@router.get('/global-bank')
async def get_global_bank(
    db_service=Depends(get_db)
):
    """Returns all questions from the global Kaggle seed for the explorer."""
    ref = db_service.reference('questions/kaggle_seed')
    data = ref.get()
    
    results = []
    if data:
        for qid, qdata in data.items():
            results.append({
                'id': qid,
                'question': qdata.get('question', ''),
                'topic': qdata.get('topic', 'Unknown'),
                'confidence': qdata.get('confidence', 0.0),
                'timestamp': qdata.get('timestamp', 0)
            })
            
    # Sort by timestamp descending
    results.sort(key=lambda x: x['timestamp'], reverse=True)
    return results

@router.get('/history')
async def get_history(
    user=Depends(get_current_user),
    db_service=Depends(get_db)
):
    """Returns the history of questions asked by the current user."""
    ref = db_service.reference(f'questions/{user.id}')
    data = ref.get()
    
    results = []
    if data:
        for qid, qdata in data.items():
            results.append({
                'id': qid,
                'question': qdata.get('question', ''),
                'topic': qdata.get('topic', 'Unknown'),
                'createdAt': qdata.get('createdAt', ''),
                'similarCount': len(qdata.get('similarQuestions', [])) if qdata.get('similarQuestions') else 0
            })
            
    # Sort by creation date descending
    results.sort(key=lambda x: x['createdAt'], reverse=True)
    return results

from pydantic import BaseModel

class SaveQuestionRequest(BaseModel):
    id: str
    question: str
    topic: str
    
@router.post('/saved')
async def save_question(
    payload: SaveQuestionRequest,
    user=Depends(get_current_user),
    db_service=Depends(get_db)
):
    """Saves a question to the user's bookmarks."""
    ref = db_service.reference(f'saved_questions/{user.id}/{payload.id}')
    ref.set({
        'id': payload.id,
        'question': payload.question,
        'topic': payload.topic,
        'savedAt': datetime.utcnow().isoformat()
    })
    return {"success": True}

@router.delete('/saved/{question_id}')
async def unsave_question(
    question_id: str,
    user=Depends(get_current_user),
    db_service=Depends(get_db)
):
    """Removes a question from the user's bookmarks."""
    ref = db_service.reference(f'saved_questions/{user.id}/{question_id}')
    ref.delete()
    return {"success": True}

@router.get('/saved')
async def get_saved_questions(
    user=Depends(get_current_user),
    db_service=Depends(get_db)
):
    """Returns the user's saved/bookmarked questions."""
    ref = db_service.reference(f'saved_questions/{user.id}')
    data = ref.get()
    
    results = []
    if data:
        for qid, qdata in data.items():
            results.append(qdata)
            
    results.sort(key=lambda x: x.get('savedAt', ''), reverse=True)
    return results

@router.get('/activity')
async def get_recent_activity(
    user=Depends(get_current_user),
    db_service=Depends(get_db)
):
    """Returns a unified timeline of recent user activity (asked & saved questions)."""
    activity_feed = []
    
    # 1. Get asked questions
    asked_ref = db_service.reference(f'questions/{user.id}')
    asked_data = asked_ref.get()
    if asked_data:
        for qid, qdata in asked_data.items():
            activity_feed.append({
                'id': qid,
                'type': 'asked',
                'question': qdata.get('question', ''),
                'topic': qdata.get('topic', 'Unknown'),
                'timestamp': qdata.get('createdAt', '')
            })
            
    # 2. Get saved questions
    saved_ref = db_service.reference(f'saved_questions/{user.id}')
    saved_data = saved_ref.get()
    if saved_data:
        for qid, qdata in saved_data.items():
            activity_feed.append({
                'id': f"saved_{qid}",
                'type': 'saved',
                'question': qdata.get('question', ''),
                'topic': qdata.get('topic', 'Unknown'),
                'timestamp': qdata.get('savedAt', '')
            })
            
    # Sort unified feed by timestamp descending
    activity_feed.sort(key=lambda x: x['timestamp'], reverse=True)
    
    # Return top 20 recent activities
    return activity_feed[:20]
