from fastapi import APIRouter, Depends
from database import get_db
from dependencies import get_current_user
from typing import Dict, Any

router = APIRouter()

@router.get('/analytics', response_model=Dict[str, Any])
async def get_dashboard_analytics(
    user=Depends(get_current_user),
    db_service=Depends(get_db),
):
    questions_ref = db_service.reference(f'questions/{user.id}')
    notes_ref = db_service.reference(f'notes/{user.id}')
    
    questions_data = questions_ref.get() or {}
    notes_data = notes_ref.get() or {}
    
    total_questions = len(questions_data)
    total_notes = len(notes_data)
    
    topics_count = {}
    
    # Process Questions
    for key, val in questions_data.items():
        topic = val.get('topic', 'Unknown')
        topics_count[topic] = topics_count.get(topic, 0) + 1
        
    # Process Notes
    for key, val in notes_data.items():
        topic = val.get('topic', 'Unknown')
        topics_count[topic] = topics_count.get(topic, 0) + 1
        
    unique_topics = len(topics_count)
    
    # Sort topics for recent tags or distribution
    sorted_topics = sorted(topics_count.items(), key=lambda item: item[1], reverse=True)
    top_tags = [t[0] for t in sorted_topics[:5]]
    
    # Combine and sort for recent activity
    all_items = []
    for val in questions_data.values():
        all_items.append({'type': 'question', 'text': val.get('question', ''), 'createdAt': val.get('createdAt', '')})
    for val in notes_data.values():
        all_items.append({'type': 'note', 'text': val.get('content', ''), 'createdAt': val.get('createdAt', '')})
        
    all_items.sort(key=lambda x: x.get('createdAt', ''), reverse=True)
    recent_activity_count = len(all_items[:12]) # Just a stat
    
    return {
        "totalQuestions": total_questions,
        "totalNotes": total_notes,
        "topicsExplored": unique_topics,
        "recentActivityCount": recent_activity_count,
        "topTags": top_tags,
        "accuracy": "94%"
    }
