from fastapi import APIRouter, Depends, Request
from database import get_db
from dependencies import get_current_user
from typing import Dict, Any

router = APIRouter()

@router.get('/taxonomy')
async def get_taxonomy(request: Request):
    """Returns the list of all available topics from the tagger."""
    tagger = request.app.state.tagger
    return tagger._labels

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
    
    # Daily Activity (Last 7 Days)
    import datetime as dt
    daily_activity = []
    today = dt.datetime.utcnow().date()
    days = [(today - dt.timedelta(days=i)) for i in range(6, -1, -1)]
    
    counts_by_date = {}
    for item in all_items:
        date_str = item.get('createdAt', '')
        if date_str and len(date_str) >= 10:
            d = date_str[:10]
            counts_by_date[d] = counts_by_date.get(d, 0) + 1
            
    for d in days:
        date_str = d.strftime('%Y-%m-%d')
        day_label = d.strftime('%a')
        daily_activity.append({
            "date": day_label,
            "count": counts_by_date.get(date_str, 0)
        })
    
    return {
        "totalQuestions": total_questions,
        "totalNotes": total_notes,
        "topicsExplored": unique_topics,
        "recentActivityCount": recent_activity_count,
        "topTags": top_tags,
        "dailyActivity": daily_activity,
        "accuracy": "94%"
    }

@router.get('/topic-analysis')
async def get_topic_analysis(
    user=Depends(get_current_user),
    db_service=Depends(get_db)
):
    questions_ref = db_service.reference(f'questions/{user.id}')
    questions_data = questions_ref.get() or {}
    
    # Aggregate by topic
    topics_dict = {}
    total_q = len(questions_data)
    
    # Sort questions by date to get recent ones properly
    sorted_q = sorted(questions_data.values(), key=lambda x: x.get('createdAt', ''), reverse=True)
    
    for qdata in sorted_q:
        topic = qdata.get('topic', 'Uncategorized')
        question_text = qdata.get('question', '')
        
        if topic not in topics_dict:
            topics_dict[topic] = {
                'name': topic,
                'count': 0,
                'recentQuestions': []
            }
            
        topics_dict[topic]['count'] += 1
        # Keep up to 3 recent questions
        if len(topics_dict[topic]['recentQuestions']) < 3:
            topics_dict[topic]['recentQuestions'].append(question_text)
            
    # Calculate percentages and format list
    topics_list = []
    for t_name, t_data in topics_dict.items():
        t_data['percentage'] = round((t_data['count'] / total_q) * 100, 1) if total_q > 0 else 0
        topics_list.append(t_data)
        
    # Sort by count descending
    topics_list.sort(key=lambda x: x['count'], reverse=True)
    
    return {
        "totalTopics": len(topics_list),
        "totalQuestions": total_q,
        "topics": topics_list
    }
