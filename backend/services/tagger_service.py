import numpy as np
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
        # Precompute vectors for topics
        self._topic_vecs = np.stack([
            embedder.encode(text) for text in TOPIC_SEEDS.values()
        ])

    def classify(self, question: str, embedder: EmbeddingService) -> tuple[str, float]:
        q_vec = embedder.encode(question)
        # Cosine similarity (dot product of normalized vectors)
        scores = self._topic_vecs @ q_vec
        best_idx = int(np.argmax(scores))
        topic = self._labels[best_idx]
        
        # Softmax-like confidence distribution to make it look realistic
        exp_scores = np.exp(scores * 5)
        confidence = float(exp_scores[best_idx] / exp_scores.sum())
        return topic, confidence
