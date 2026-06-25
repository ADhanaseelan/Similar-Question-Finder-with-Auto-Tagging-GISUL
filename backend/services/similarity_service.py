import math
from typing import Optional

def dot_product(v1, v2):
    return sum(x * y for x, y in zip(v1, v2))

def get_jaccard_similarity(text1: str, text2: str) -> float:
    if not text1 or not text2:
        return 0.0
    words1 = set(word.lower() for word in text1.split() if len(word) > 2)
    words2 = set(word.lower() for word in text2.split() if len(word) > 2)
    intersection = words1.intersection(words2)
    union = words1.union(words2)
    if not union:
        return 0.0
    return len(intersection) / len(union)

async def find_similar(
    db_service,
    query_embedding: list[float],
    user_id: str,
    top_k: int = 5,
    min_score: float = 0.60,
    global_search: bool = True,
    question_text: str = ""
) -> list[dict]:
    docs = []
    if global_search:
        all_ref = db_service.reference('questions')
        all_data = all_ref.get()
        if all_data:
            for uid, user_qs in all_data.items():
                if isinstance(user_qs, dict):
                    for qid, qdata in user_qs.items():
                        docs.append(qdata)
    else:
        questions_ref = db_service.reference(f'questions/{user_id}')
        questions_data = questions_ref.get()
        if questions_data:
            docs = list(questions_data.values())

    if not docs:
        return []

    # Check if we should use vector similarity or keyword similarity fallback
    use_vector = bool(query_embedding and len(query_embedding) > 0)
    
    scored_docs = []
    for d in docs:
        if use_vector and 'embedding' in d and d['embedding']:
            score = dot_product(d['embedding'], query_embedding)
        else:
            score = get_jaccard_similarity(d['question'], question_text)
            
        scored_docs.append((score, d))

    # Sort descending by score
    scored_docs.sort(key=lambda x: x[0], reverse=True)

    seen_questions = set()
    results = []
    
    for score, doc in scored_docs:
        effective_threshold = min_score if use_vector else 0.15
        if score >= effective_threshold:
            q_text = doc['question']
            if q_text.lower() not in seen_questions:
                seen_questions.add(q_text.lower())
                results.append({
                    'question':   q_text,
                    'topic':      doc.get('topic', 'Unknown'),
                    'similarity': round(score * 100, 1),
                })
        if len(results) >= top_k:
            break
            
    return results

async def check_duplicate(
    db_service,
    query_embedding: list[float],
    user_id: str,
    threshold: float = 0.90,
    question_text: str = ""
) -> Optional[dict]:
    results = await find_similar(
        db_service, 
        query_embedding, 
        user_id, 
        top_k=1, 
        min_score=threshold, 
        global_search=False,
        question_text=question_text
    )
    if results:
        results[0]['score'] = results[0]['similarity'] / 100.0
        return results[0]
    return None
