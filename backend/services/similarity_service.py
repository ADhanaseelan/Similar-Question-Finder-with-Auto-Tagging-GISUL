import numpy as np

async def find_similar(
    db_service,
    query_embedding: list[float],
    user_id: str,
    top_k: int = 5,
    min_score: float = 0.60,
    global_search: bool = True
) -> list[dict]:
    q_vec = np.array(query_embedding, dtype=np.float32)

    docs = []
    if global_search:
        all_ref = db_service.reference('questions')
        all_data = all_ref.get()
        if all_data:
            for uid, user_qs in all_data.items():
                if isinstance(user_qs, dict):
                    for qid, qdata in user_qs.items():
                        # Exclude the exact same question if it's already saved
                        docs.append(qdata)
    else:
        questions_ref = db_service.reference(f'questions/{user_id}')
        questions_data = questions_ref.get()
        if questions_data:
            docs = list(questions_data.values())

    if not docs:
        return []

    stored_vecs = np.array([d['embedding'] for d in docs], dtype=np.float32)
    scores = stored_vecs @ q_vec

    ranked_indices = np.argsort(scores)[::-1]
    
    # Deduplicate by question text to avoid showing the exact same question multiple times
    seen_questions = set()
    results = []
    
    for idx in ranked_indices:
        score = float(scores[idx])
        if score >= min_score:
            q_text = docs[idx]['question']
            if q_text.lower() not in seen_questions:
                seen_questions.add(q_text.lower())
                results.append({
                    'question':   q_text,
                    'topic':      docs[idx].get('topic', 'Unknown'),
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
) -> dict | None:
    results = await find_similar(db_service, query_embedding, user_id, top_k=1, min_score=threshold, global_search=False)
    if results:
        results[0]['score'] = results[0]['similarity'] / 100.0
        return results[0]
    return None
