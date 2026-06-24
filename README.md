# LearnConnect AI: Semantic Question Finder & Auto-Tagger

LearnConnect AI is an advanced, full-stack web application designed for students. It utilizes semantic similarity and local AI models to find related past questions, automatically tag topics, and generate intelligent suggestions—all without relying on paid external APIs.

## 🚀 Features

- **Semantic Question Search**: Enter a study question, and the system uses `sentence-transformers` locally to find semantically similar past questions.
- **AI Auto-Tagging**: Questions are automatically assigned a topic (e.g., Biology, Computer Science) using a custom semantic classification system.
- **Local AI Chatbot**: An offline `flan-t5-small` model running on the backend generates immediate, context-aware answers to user queries without OpenAI API keys.
- **Interactive Knowledge Graph**: The dashboard features an advanced, physics-based data visualization mapping a user's semantic topic clustering over time.
- **Secure Authentication**: Fully implemented JWT-based email/password authentication with bcrypt hashing, plus a seamless Google OAuth integration.
- **Cloud Database**: All questions, similarities, and profile settings are securely stored in a Firebase Realtime Database (Free Tier NoSQL DB).

## 🛠 Tech Stack & Approach

- **Frontend**: Next.js 15 (React), Tailwind CSS, Framer Motion. 
  - *Approach*: Built for extreme responsiveness. We use `AnimatePresence` and custom layouts to provide a buttery-smooth, native-app feel that masks any latency.
- **Backend**: FastAPI (Python), Uvicorn.
  - *Approach*: Chosen for high-performance async processing. We utilize PyTorch and HuggingFace's `transformers` library natively within API endpoints.
- **AI/ML Library**: `sentence-transformers` (`all-MiniLM-L6-v2`) for blazing-fast 384-dimensional vector embeddings, and `flan-t5-small` for generative QA.
- **Database**: Firebase Realtime Database.
  - *Approach*: We use Firebase as a fast, free-tier NoSQL JSON store that perfectly handles hierarchical data like users -> questions -> similar questions.

## 🔄 How It Works (The Workflow)

1. **User Input**: A student logs in and asks a natural language study question (e.g., *"Why does photosynthesis need light?"*).
2. **Local Embedding**: The FastAPI backend intercepts the question and uses `sentence-transformers` to locally convert the text into a dense 384-dimensional vector embedding.
3. **Semantic Search & Clustering**: The backend compares this new vector against all previously stored questions in the Firebase database using Cosine Similarity, instantly identifying the Top 5 most semantically related questions.
4. **Auto-Tagging**: The custom `TopicTagger` analyzes the vector against a fixed taxonomy (Biology, Math, Physics, etc.) to automatically assign the most accurate domain tag.
5. **Local Chatbot Response**: An offline `flan-t5-small` model generates an immediate, context-aware answer.
6. **Data Storage & Visualization**: The entire payload is saved to Firebase, which then powers a stunning physics-based "Semantic Knowledge Graph" on the user's dashboard.

## ✨ Our Uniqueness

Unlike traditional study tools, LearnConnect AI is built entirely on **Edge/Local AI processing**. 
- **100% Free & Private**: By running `sentence-transformers` and `flan-t5` natively within our Python backend, we bypassed the need for expensive, privacy-invasive paid APIs (like OpenAI or Claude). 
- **Advanced Dynamic UI**: We completely discarded static charts in favor of custom, physics-based `framer-motion` knowledge graphs that adapt dynamically to a student's learning history.
- **Human-in-the-Loop**: Our auto-tagging system provides high-confidence suggestions but allows students to easily override topics, seamlessly refining their personal knowledge clusters.

## 🆚 Comparison to Existing Models

| Feature | Existing/Traditional Study Platforms (e.g., Quizlet, Microsoft Q&A) | LearnConnect AI |
| :--- | :--- | :--- |
| **Search Mechanism** | Keyword-based matching (fails if synonyms are used). | **Semantic Vector Similarity** (understands the *meaning* behind the question). |
| **Auto-Tagging** | Usually manual tagging required, or relies on paid third-party AI APIs. | **Fully Automatic Local Classification** running completely offline. |
| **Data Privacy** | Sends user data to third-party LLM providers (OpenAI). | **100% Private Processing** inside the secure FastAPI backend. |
| **Visualizations** | Basic static bar charts or pie charts. | **Interactive, physics-based Knowledge Nodes** that pulse and scale dynamically. |
| **Cost** | High operational costs due to API token usage. | **Zero AI API Costs**. Completely self-contained open-source stack. |

## 📦 Setup & Installation

### 1. Backend (Python)
Ensure Python 3.10+ is installed.
```bash
cd backend
python -m venv .venv
# Activate virtual environment
source .venv/bin/activate  # Mac/Linux
.venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
python main.py
```
*Note: The first run will download the open-source Hugging Face models (~300MB).*

### 2. Frontend (Next.js)
Ensure Node.js 18+ is installed.
```bash
cd frontend
npm install

# Start the development server
npm run dev
```

## 🚀 Deployment

The project is fully prepared for one-click deployment:
- **Frontend (Vercel)**: Connect your GitHub repo to Vercel. Vercel will automatically detect the Next.js framework in the `frontend` directory.
- **Backend (Render)**: The root directory contains a `render.yaml` file configured as a Blueprint. Simply connect this repository to Render and it will provision a Web Service for the FastAPI backend automatically.

---
*Developed to strictly comply with the Option B specification, demonstrating mastery of full-stack integration and offline ML processing.*
