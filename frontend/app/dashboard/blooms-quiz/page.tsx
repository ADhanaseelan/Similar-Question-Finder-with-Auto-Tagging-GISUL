"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Type, FileText, Link as LinkIcon, Upload, Loader2, Sparkles, Brain } from "lucide-react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";

const BLOOMS_LEVELS = [
  "All Blooms Levels",
  "Remember",
  "Understand",
  "Apply",
  "Analyze",
  "Evaluate",
  "Create"
];

export default function BloomsQuizPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"text" | "file" | "url">("text");
  const [bloomsLevel, setBloomsLevel] = useState("All Blooms Levels");
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (activeTab === "text" && !inputText.trim()) return;
    
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch("http://localhost:8000/api/quiz/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          source_type: activeTab,
          content: inputText,
          blooms_level: bloomsLevel
        })
      });

      if (!res.ok) {
        let errorDetails = "Unknown error";
        try {
          const errData = await res.json();
          errorDetails = JSON.stringify(errData);
        } catch (e) {
          errorDetails = res.statusText;
        }
        throw new Error(`Failed to generate quiz: ${res.status} - ${errorDetails}`);
      }

      const data = await res.json();
      sessionStorage.setItem("last_quiz_result", JSON.stringify(data));
      router.push("/dashboard/blooms-quiz/results");
      
    } catch (err) {
      console.error(err);
      alert("An error occurred while generating the quiz.");
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl space-y-8"
    >
      <div>
        <h1 className="text-4xl font-poppins font-extrabold text-foreground-light dark:text-foreground-dark mb-2 flex items-center gap-3">
          <Brain className="w-10 h-10 text-primary" />
          Bloom's Taxonomy Quiz
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">
          Generate targeted MCQs based on different cognitive levels.
        </p>
      </div>

      <GlassCard className="!p-0 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
          <button
            onClick={() => setActiveTab("text")}
            className={`flex-1 py-4 flex items-center justify-center gap-2 font-bold transition-colors ${
              activeTab === "text" 
                ? "text-primary border-b-2 border-primary bg-white dark:bg-gray-800" 
                : "text-gray-500 hover:text-foreground-light dark:hover:text-foreground-dark"
            }`}
          >
            <Type className="w-5 h-5" /> Text
          </button>
          <button
            onClick={() => setActiveTab("file")}
            className={`flex-1 py-4 flex items-center justify-center gap-2 font-bold transition-colors ${
              activeTab === "file" 
                ? "text-primary border-b-2 border-primary bg-white dark:bg-gray-800" 
                : "text-gray-500 hover:text-foreground-light dark:hover:text-foreground-dark"
            }`}
          >
            <FileText className="w-5 h-5" /> File
          </button>
          <button
            onClick={() => setActiveTab("url")}
            className={`flex-1 py-4 flex items-center justify-center gap-2 font-bold transition-colors ${
              activeTab === "url" 
                ? "text-primary border-b-2 border-primary bg-white dark:bg-gray-800" 
                : "text-gray-500 hover:text-foreground-light dark:hover:text-foreground-dark"
            }`}
          >
            <LinkIcon className="w-5 h-5" /> URL
          </button>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === "text" && (
              <motion.div
                key="text"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste your study material here (up to 5,000 words)..."
                  className="w-full h-64 p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground-light dark:text-foreground-dark resize-none font-medium"
                />
              </motion.div>
            )}

            {activeTab === "file" && (
              <motion.div
                key="file"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full h-64 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <Upload className="w-10 h-10 text-gray-400 mb-4" />
                <p className="font-bold text-foreground-light dark:text-foreground-dark mb-1">Click or drag file to this area to upload</p>
                <p className="text-sm text-gray-500 font-medium">Supports PDF, DOCX, TXT (Max 10MB)</p>
              </motion.div>
            )}

            {activeTab === "url" && (
              <motion.div
                key="url"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    placeholder="https://en.wikipedia.org/wiki/Photosynthesis"
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground-light dark:text-foreground-dark font-medium"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-4 font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> We'll automatically extract the text from the webpage.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="p-6 bg-gray-50/50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-auto flex items-center gap-3">
            <label className="text-sm font-bold text-gray-500 whitespace-nowrap">Taxonomy Level:</label>
            <select
              value={bloomsLevel}
              onChange={(e) => setBloomsLevel(e.target.value)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 font-medium text-foreground-light dark:text-foreground-dark focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
            >
              {BLOOMS_LEVELS.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || (activeTab === "text" && !inputText.trim())}
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Generating...</>
            ) : (
              <><Sparkles className="w-5 h-5" /> Generate Quiz</>
            )}
          </button>
        </div>
      </GlassCard>
    </motion.div>
  );
}
