"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, User, AlertCircle, ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type SimilarQuestion = {
  question: string;
  topic: string;
  similarity: number;
};

type SearchResult = {
  isDuplicate: boolean;
  duplicateQuestion?: string;
  similarity?: number;
  topic?: string;
  confidence?: number;
  similarQuestions?: SimilarQuestion[];
  chatResponse?: string;
};

type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
  data?: SearchResult;
  isError?: boolean;
};

export default function ChatAskPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      content: "Hello! I am StudyMind, your personal AI tutor. Ask me any study question, and I will instantly categorize it into specific Indian academic subjects and retrieve similar concepts you've explored before."
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch("http://localhost:8000/api/questions/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ question: userMsg.content })
      });

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }
        throw new Error("Failed to process question. Please try again.");
      }

      const data: SearchResult = await res.json();
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: data.chatResponse || "Here is what I found based on your history.",
        data: data
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: err.message,
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-background relative overflow-hidden flex flex-col font-sans">
      {/* Header */}
      <header className="p-4 border-b border-slate-200 bg-white/80 backdrop-blur-md relative z-10 flex items-center justify-between shadow-sm">
        <Link href="/dashboard" className="flex items-center gap-2 text-slate-500 font-bold hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Dashboard
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center shadow-md shadow-blue-600/20">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-extrabold text-foreground tracking-tight">StudyMind Chat</span>
        </div>
        <div className="w-20"></div> {/* Spacer for centering */}
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 bg-slate-50/50">
        <div className="max-w-4xl mx-auto space-y-8 pb-10">
          {messages.map((msg) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={msg.id} 
              className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'ai' && (
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center flex-shrink-0">
                  <Brain className="w-5 h-5 text-blue-600" />
                </div>
              )}
              
              <div className={`max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                <div className={`px-6 py-4 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white font-medium rounded-br-sm' 
                    : msg.isError 
                      ? 'bg-red-50 border border-red-100 text-red-700 font-medium' 
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm font-medium'
                }`}>
                  {msg.isError && <AlertCircle className="w-4 h-4 inline mr-2 -mt-0.5" />}
                  {/* Safely render markdown-like bold tags natively */}
                  <span dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong class="text-blue-700 font-extrabold">$1</strong>') }} />
                </div>

                {/* AI Data Payload Rendering */}
                {msg.data && msg.data.isDuplicate && (
                  <div className="mt-3 bg-orange-50 border border-orange-200 p-4 rounded-xl shadow-sm w-full">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-orange-700 font-bold text-sm mb-1">Exact Match Found ({msg.data.similarity}%)</h3>
                        <div className="bg-white p-3 rounded-lg border border-orange-100 text-slate-700 font-medium text-sm shadow-sm">
                          "{msg.data.duplicateQuestion}"
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {msg.data && msg.data.similarQuestions && msg.data.similarQuestions.length > 0 && !msg.data.isDuplicate && (
                  <div className="mt-4 w-full grid gap-3">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Retrieved Context</p>
                    {msg.data.similarQuestions.map((sq, idx) => (
                      <div key={idx} className="bg-white border border-slate-200 shadow-sm p-4 rounded-xl flex items-center justify-between hover:border-blue-300 transition-colors">
                        <div>
                          <p className="text-slate-800 font-bold text-sm">{sq.question}</p>
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 mt-2 inline-block rounded-md bg-slate-100 text-slate-500">{sq.topic}</span>
                        </div>
                        <span className="text-blue-600 font-black text-sm ml-4 bg-blue-50 px-2 py-1 rounded-lg">{sq.similarity}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-10 h-10 rounded-xl bg-slate-200 border border-slate-300 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-slate-600" />
                </div>
              )}
            </motion.div>
          ))}

          {loading && (
            <div className="flex gap-4 justify-start">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center flex-shrink-0">
                <Brain className="w-5 h-5 text-blue-600 animate-pulse" />
              </div>
              <div className="bg-white border border-slate-200 px-6 py-5 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto relative">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            disabled={loading}
            placeholder="Type your study question... e.g. What are the key features of the Indian Constitution?"
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-6 pr-16 py-4 text-foreground placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium shadow-inner"
          />
          <button 
            onClick={handleSubmit}
            disabled={loading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:opacity-50 transition-colors shadow-md"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
