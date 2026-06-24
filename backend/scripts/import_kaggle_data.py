import os
import sys
import csv
import time
from pathlib import Path

# Add backend directory to sys.path to allow imports from services
backend_dir = Path(__file__).resolve().parent.parent
sys.path.append(str(backend_dir))

from services.embedding_service import EmbeddingService
from services.tagger_service import TopicTagger
from database import get_db, connect_db

def find_csv_files(directory):
    return list(Path(directory).rglob('*.csv'))

def extract_questions(csv_path, max_questions=2000):
    questions = set()
    print(f"Reading CSV: {csv_path}")
    
    with open(csv_path, mode='r', encoding='utf-8') as f:
        reader = csv.reader(f)
        header = next(reader, None)
        
        if not header:
            return []

        # Find columns that might contain questions
        q_cols = []
        for i, col_name in enumerate(header):
            col_lower = col_name.lower()
            if 'question1' in col_lower or 'question2' in col_lower or 'question' in col_lower:
                q_cols.append(i)
                
        if not q_cols:
            print("Could not find any 'question' columns in the CSV. Using the first string column as fallback.")
            q_cols = [0]
            
        for row in reader:
            for idx in q_cols:
                if idx < len(row):
                    q_text = row[idx].strip()
                    # Basic validation: must be reasonably long and contain a question mark
                    if len(q_text) > 15 and '?' in q_text:
                        questions.add(q_text)
                        
            if len(questions) >= max_questions:
                break
                
    return list(questions)

def generate_sample_csv(filepath):
    print("No Kaggle dataset found. Auto-generating a sample dataset for you instead...")
    sample_questions = [
        # Biology
        "Why does photosynthesis need light?",
        "What is the function of the mitochondria?",
        "How does DNA replication work?",
        "What is the difference between mitosis and meiosis?",
        "Explain the theory of evolution by natural selection.",
        # Physics
        "How does gravity work in space?",
        "What are Newton's three laws of motion?",
        "Explain the theory of general relativity.",
        "What is the difference between speed and velocity?",
        "How do magnetic fields work?",
        # Chemistry
        "What is an endothermic reaction?",
        "How do you balance a chemical equation?",
        "What are covalent and ionic bonds?",
        "Explain the periodic table trends.",
        "What is the pH scale?",
        # Math
        "What is the quadratic formula?",
        "How do you solve a system of linear equations?",
        "Explain the Pythagorean theorem.",
        "What is a derivative in calculus?",
        "How do you calculate the probability of independent events?",
        # Artificial Intelligence & Machine Learning
        "What is Artificial Intelligence and Machine Learning?",
        "How do you train a Neural Network?",
        "Explain the difference between deep learning and traditional machine learning.",
        "What is Natural Language Processing in AIML?",
        "How does a Random Forest classifier work?",
        # Web Development
        "What is the difference between React and Next.js?",
        "Explain how the virtual DOM works in React.",
        "How do you create a RESTful API in Node.js?",
        "What are the benefits of using Tailwind CSS?",
        # Programming General
        "What is object oriented programming and its 4 pillars?",
        "How do pointers work in C/C++?",
        "What is the difference between Python lists and tuples?",
        "Explain time complexity and Big O notation.",
        "How does garbage collection work in Java?"
    ]
    
    with open(filepath, mode='w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(["id", "question1"])
        for i, q in enumerate(sample_questions):
            writer.writerow([i, q])
            
    print(f"Created sample dataset with {len(sample_questions)} questions at {filepath}")

def main():
    data_dir = backend_dir / 'data' / 'kaggle'
    
    if not data_dir.exists():
        data_dir.mkdir(parents=True, exist_ok=True)
        
    csv_files = find_csv_files(data_dir)
    sample_path = data_dir / 'sample_questions.csv'
    generate_sample_csv(sample_path) # Force regeneration of the new dataset
    csv_files = [sample_path]
        
    all_questions = set()
    for csv_file in csv_files:
        qs = extract_questions(csv_file, max_questions=2000)
        all_questions.update(qs)
        
    questions_list = list(all_questions)[:2000] # Hard limit to 2000 for seeding
    
    if not questions_list:
        print("No valid questions found in the CSV files.")
        return
        
    print(f"\nExtracted {len(questions_list)} unique questions. Starting AI embedding pipeline...")
    
    embedder = EmbeddingService()
    tagger = TopicTagger(embedder)
    
    # Initialize Firebase
    connect_db()
    db_service = get_db()
    
    seed_ref = db_service.reference('questions/kaggle_seed')
    
    print("\nProcessing and uploading questions in batches...")
    
    batch_size = 50
    total_uploaded = 0
    
    for i in range(0, len(questions_list), batch_size):
        batch = questions_list[i:i+batch_size]
        
        updates = {}
        for q in batch:
            # 1. Embed
            embedding = embedder.encode(q).tolist()
            
            # 2. Tag
            topic, confidence = tagger.classify(q, embedder)
            
            # 3. Prepare for Firebase
            # We use a sanitized hash of the question as the key to prevent duplicates
            q_id = f"kgl_{hash(q) % ((sys.maxsize + 1) * 2)}"
            
            updates[q_id] = {
                'question': q,
                'embedding': embedding,
                'topic': topic,
                'confidence': float(confidence),
                'timestamp': time.time() * 1000,
                'source': 'kaggle_seed'
            }
            
        # Push batch to Firebase
        seed_ref.update(updates)
        total_uploaded += len(batch)
        print(f"Uploaded batch {i//batch_size + 1} ({total_uploaded}/{len(questions_list)} questions)")
        
    print(f"\nSuccessfully seeded {total_uploaded} questions to Firebase!")
    print("You can now test the AI Semantic Search in the frontend.")

if __name__ == '__main__':
    main()
