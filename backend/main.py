from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import connect_db, close_db
from services.embedding_service import EmbeddingService
from services.tagger_service import TopicTagger
from routers import auth, questions, history, notes, dashboard, quiz

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: connect DB and warm up AI model
    connect_db()
    embedder = EmbeddingService()
    app.state.embedder = embedder
    app.state.tagger = TopicTagger(embedder)
    yield
    # Shutdown: close DB connection
    close_db()

app = FastAPI(
    title='StudyMind AI API',
    version='1.0.0',
    lifespan=lifespan,
)

app.add_middleware(CORSMiddleware,
    allow_origins=['http://localhost:3000', 'http://localhost:3001'],
    allow_methods=['*'], allow_headers=['*'], allow_credentials=True,
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(questions.router, prefix="/api/questions", tags=["questions"])
app.include_router(history.router, prefix="/api/history", tags=["history"])
app.include_router(notes.router, prefix="/api/notes", tags=["notes"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])
app.include_router(quiz.router, prefix="/api/quiz", tags=["quiz"])

@app.get('/api/health', tags=['Health'])
async def health():
    return {"status": "ok"}

if __name__ == '__main__':
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
