import math
from services.embedding_service import EmbeddingService

TOPIC_SEEDS = {
    # Basic Sciences (CBSE/ICSE/State Boards)
    'Biology':          'photosynthesis cells organisms genetics evolution human anatomy plants',
    'Physics':          'force energy motion waves electricity magnetism optics thermodynamics mechanics',
    'Chemistry':        'chemical reactions atoms molecules bonds periodic table organic inorganic physical',
    'Mathematics':      'calculus algebra geometry probability statistics trigonometry matrices differential equations',
    
    # Core Engineering & Computer Science
    'Data Structures & Algorithms': 'DSA data structures algorithms sorting searching trees graphs dynamic programming linked list leetcode',
    'Database Systems': 'DBMS database SQL normalization transactions relational schema oracle mysql nosql mongodb postgres',
    'Operating Systems':'processes threads memory management file systems scheduling linux windows unix kernel',
    'Computer Networks':'TCP IP protocols routing HTTP DNS network layers OSI model switching internet',
    'Java Programming': 'Java OOP inheritance polymorphism JVM Spring Boot hibernate servlet interface',
    'Python Programming': 'Python lists dictionaries functions classes decorators pandas numpy django flask scripting',
    'C/C++ Programming': 'C C++ pointers memory management object oriented STL headers templates compile',
    'Web Development':  'HTML CSS JavaScript React Node Next.js web frontend backend API REST UI UX',
    'Artificial Intelligence & Machine Learning': 'AIML AI ML Artificial Intelligence Machine Learning neural networks deep learning classification regression clustering NLP tensorflow pytorch LLM prompt engineering',
    'Engineering Drawing':'CAD AutoCAD orthographic isometric projections drafting engineering graphics',
    'Applied Mechanics':'statics dynamics kinematics friction trusses rigid bodies newton laws',
    'VLSI Design':      'CMOS MOSFET logic gates verilog VHDL digital circuits fpga asic',
    
    # Competitive Exams (UPSC / State PSC)
    'Indian Polity':    'constitution parliament supreme court fundamental rights directive principles president elections',
    'Indian History':   'ancient medieval modern freedom struggle mughals mauryas gandhi independence',
    'Geography of India':'monsoon rivers mountains Himalayas agriculture soil climate states',
    'Indian Economy':   'GDP RBI inflation banking budget taxation five year plans NITI aayog',
    
    # Competitive Exams (Banking / SSC / CAT)
    'Quantitative Aptitude': 'percentages ratio proportion time work distance profit loss interest averages',
    'Logical Reasoning':'blood relations syllogism seating arrangement puzzles coding decoding series',
    'English Grammar':  'comprehension vocabulary synonyms antonyms active passive voice direct indirect speech',
    
    # Commerce / CA / CS
    'Accountancy':      'ledger journal balance sheet trial balance partnership company accounts depreciation',
    'Business Studies': 'management marketing finance human resources principles of management business environment',
    'Economics':        'microeconomics macroeconomics demand supply elasticity monopoly oligopoly market structures',
    
    # Regional / Arts
    'Political Science':'political theory comparative politics international relations public administration',
    'Sociology':        'society culture institutions social stratification social change caste system',
}

class TopicTagger:
    def __init__(self, embedder: EmbeddingService):
        self._labels = list(TOPIC_SEEDS.keys())
        self._topic_vecs = None
        
        # Try to batch precompute topic seed vectors
        try:
            print("[TopicTagger] Precomputing topic seed vectors via Hugging Face...")
            seeds = list(TOPIC_SEEDS.values())
            vecs = embedder.encode_batch(seeds)
            if vecs and all(len(v) > 0 for v in vecs):
                self._topic_vecs = vecs
                print("[TopicTagger] Successfully precomputed all topic vectors!")
            else:
                print("[TopicTagger] Batch encoding returned empty/invalid vectors. Will use keyword fallback.")
        except Exception as e:
            print(f"[TopicTagger] Error precomputing topic vectors: {e}. Using keyword fallback.")

    def classify_keyword(self, question: str) -> tuple[str, float, list[dict]]:
        q_words = set(word.lower() for word in question.split() if len(word) > 2)
        scores = {}
        for topic, seeds in TOPIC_SEEDS.items():
            seed_words = set(seeds.lower().split())
            match_count = len(q_words.intersection(seed_words))
            scores[topic] = match_count
        
        # Sort topics by score
        sorted_topics = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        best_topic, best_score = sorted_topics[0]
        
        # Calculate a rough confidence score (best_score / total_score)
        total = sum(scores.values())
        confidence = best_score / total if total > 0 else 1.0 / len(TOPIC_SEEDS)
        
        alternatives = []
        for t, s in sorted_topics[1:5]:
            alternatives.append({
                "topic": t,
                "confidence": s / total if total > 0 else 0.0
            })
            
        return best_topic, confidence, alternatives

    def classify_vector(self, q_vec: list[float]) -> tuple[str, float, list[dict]]:
        scores = []
        for t_vec in self._topic_vecs:
            # Cosine similarity (dot product since they are normalized)
            dot = sum(x * y for x, y in zip(t_vec, q_vec))
            scores.append(dot)
            
        # Softmax-like confidence distribution to make it look realistic
        exp_scores = []
        for s in scores:
            try:
                exp_scores.append(math.exp(s * 5))
            except OverflowError:
                exp_scores.append(float('inf'))
                
        sum_exp = sum(exp_scores)
        probabilities = [e / sum_exp if sum_exp > 0 else 0.0 for e in exp_scores]
        
        ranked_indices = sorted(range(len(probabilities)), key=lambda i: probabilities[i], reverse=True)
        
        best_idx = ranked_indices[0]
        topic = self._labels[best_idx]
        confidence = probabilities[best_idx]
        
        alternatives = []
        for idx in ranked_indices[1:5]:
            alternatives.append({
                "topic": self._labels[idx],
                "confidence": probabilities[idx]
            })
            
        return topic, confidence, alternatives

    def classify(self, question: str, embedder: EmbeddingService) -> tuple[str, float, list[dict]]:
        if self._topic_vecs:
            q_vec = embedder.encode(question)
            if q_vec and len(q_vec) > 0:
                return self.classify_vector(q_vec)
                
        # Fallback to keyword matching
        print("[TopicTagger] Using keyword-based classification fallback.")
        return self.classify_keyword(question)
