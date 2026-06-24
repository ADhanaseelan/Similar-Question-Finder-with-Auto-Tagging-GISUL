"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileEdit, ArrowLeft, Loader2, Sparkles, BookOpen } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Note = {
  id: string;
  content: string;
  topic: string;
  confidence: number;
  createdAt: string;
};

export default function NotesPage() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("http://localhost:8000/api/notes", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSave = async () => {
    if (!content.trim()) return;
    
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch("http://localhost:8000/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ content })
      });

      if (!res.ok) throw new Error("Failed to save note");

      const newNote = await res.json();
      setNotes([newNote, ...notes]);
      setContent("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString("en-US", {
      month: "short", day: "numeric", hour: "numeric", minute: "2-digit"
    });
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col font-sans">
      {/* Background Orbs */}
      <div className="absolute top-[10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-100 blur-[120px] animate-blob pointer-events-none" />

      {/* Header */}
      <header className="p-6 relative z-10 flex items-center justify-between max-w-6xl mx-auto w-full">
        <Link href="/dashboard" className="flex items-center gap-2 text-slate-500 font-bold hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-extrabold text-foreground tracking-tight">StudyMind Notes</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 pt-8 relative z-10 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left Side - Editor */}
        <div className="flex flex-col">
          <div className="mb-6">
            <h1 className="text-4xl font-extrabold text-foreground mb-2">Create Note</h1>
            <p className="text-slate-500 font-medium text-lg">Paste your study material below. AI will automatically read, tag, and categorize it into your knowledge base.</p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-black/[0.03] border border-slate-200 p-2 flex flex-col h-[500px] transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start typing your study notes here..."
              className="flex-1 p-6 bg-transparent border-none text-foreground placeholder-slate-400 focus:outline-none resize-none font-medium leading-relaxed"
            />
            <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50 rounded-b-2xl">
              <span className="text-sm font-bold text-slate-400">
                {content.length} characters
              </span>
              <button 
                onClick={handleSave}
                disabled={loading || !content.trim()}
                className="px-8 py-3 rounded-xl bg-foreground text-white font-bold flex items-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50 shadow-md"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-4 h-4" /> Auto-Tag & Save</>}
              </button>
            </div>
          </div>
          {error && <p className="text-red-500 mt-4 font-bold">{error}</p>}
        </div>

        {/* Right Side - Saved Notes */}
        <div className="flex flex-col">
          <h2 className="text-2xl font-extrabold text-foreground mb-6 flex items-center gap-2">
            <FileEdit className="w-6 h-6 text-slate-400" />
            Your AI-Tagged Notes
          </h2>

          <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[600px] scrollbar-hide">
            {fetching ? (
              <div className="flex justify-center p-12 text-slate-400"><Loader2 className="w-8 h-8 animate-spin" /></div>
            ) : notes.length === 0 ? (
              <div className="bg-white/60 p-12 rounded-3xl text-center border-2 border-dashed border-slate-200">
                <p className="text-slate-500 font-bold">No notes yet. Create your first note on the left!</p>
              </div>
            ) : (
              notes.map((note) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={note.id} 
                  className="bg-white border border-slate-200 shadow-sm p-6 rounded-2xl flex flex-col group hover:border-blue-300 transition-all"
                >
                  <p className="text-slate-700 font-medium leading-relaxed line-clamp-3 mb-4">
                    {note.content}
                  </p>
                  <div className="flex items-center justify-between mt-auto border-t border-slate-100 pt-4">
                    <span className="px-3 py-1 rounded-full bg-violet-50 text-violet-700 text-xs font-black uppercase tracking-wider border border-violet-100">
                      {note.topic}
                    </span>
                    <span className="text-slate-400 font-bold text-xs">
                      {formatDate(note.createdAt)}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
