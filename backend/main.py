from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
from fastapi.middleware.cors import CORSMiddleware
from database import connect_db, close_db
from services.embedding_service import EmbeddingService
from services.tagger_service import TopicTagger
from routers import auth, questions, history, notes, dashboard, quiz, users

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
    allow_origins=['*'],
    allow_methods=['*'], allow_headers=['*'], allow_credentials=True,
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(questions.router, prefix="/api/questions", tags=["questions"])
app.include_router(history.router, prefix="/api/history", tags=["history"])
app.include_router(notes.router, prefix="/api/notes", tags=["notes"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])
app.include_router(quiz.router, prefix="/api/quiz", tags=["quiz"])

@app.get('/api/health', tags=['Health'])
async def health():
    return {"status": "ok"}

# Serve Next.js static export if it exists
frontend_out_path = os.path.join(os.path.dirname(__file__), "../frontend/out")
if os.path.exists(frontend_out_path):
    next_assets_path = os.path.join(frontend_out_path, "_next")
    if os.path.exists(next_assets_path):
        app.mount("/_next", StaticFiles(directory=next_assets_path), name="next_assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_frontend(full_path: str):
        if ".." in full_path:
            return FileResponse(os.path.join(frontend_out_path, "index.html"))
            
        file_path = os.path.join(frontend_out_path, full_path)
        
        if os.path.isfile(file_path):
            return FileResponse(file_path)
            
        html_path = file_path + ".html"
        if os.path.isfile(html_path):
            return FileResponse(html_path)
            
        return FileResponse(os.path.join(frontend_out_path, "index.html"))

if __name__ == '__main__':
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
