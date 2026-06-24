"use client";
import { BookOpen, PieChart, TrendingUp, Layers, HelpCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TopicsPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }
        
        const res = await fetch("/api/dashboard/topic-analysis", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (res.ok) {
          const result = await res.json();
          setData(result);
        }
      } catch (err) {
        console.error("Failed to fetch topic analysis", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTopics();
  }, [router]);

  // Map of nice vibrant gradient colors for cards
  const colorGradients = [
    "from-indigo-500 to-purple-500",
    "from-emerald-500 to-teal-500",
    "from-rose-500 to-orange-500",
    "from-blue-500 to-cyan-500",
    "from-amber-500 to-yellow-500",
    "from-pink-500 to-rose-400"
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Analyzing your learning patterns...</p>
      </div>
    );
  }

  if (!data || data.topics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Layers className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">No Data Yet</h1>
        <p className="text-gray-500 mb-6 max-w-md">Start asking questions to let our AI analyze and categorize your learning topics!</p>
        <button onClick={() => router.push("/dashboard/ask-question")} className="px-6 py-3 bg-indigo-500 text-white rounded-xl font-bold hover:bg-indigo-600 transition-colors">
          Ask a Question
        </button>
      </div>
    );
  }

  return (
    <div className="pb-12 space-y-8">
      {/* HEADER STATS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight flex items-center gap-3">
            <PieChart className="w-8 h-8 text-indigo-500" /> Topic Analysis
          </h1>
          <p className="text-gray-500 font-medium mt-1">AI clustering of your entire learning history</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-indigo-50 px-5 py-3 rounded-2xl border border-indigo-100 flex items-center gap-4">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl"><Layers className="w-5 h-5"/></div>
            <div>
              <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Total Topics</p>
              <p className="text-xl font-black text-indigo-600">{data.totalTopics}</p>
            </div>
          </div>
          <div className="bg-emerald-50 px-5 py-3 rounded-2xl border border-emerald-100 flex items-center gap-4">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl"><HelpCircle className="w-5 h-5"/></div>
            <div>
              <p className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Questions</p>
              <p className="text-xl font-black text-emerald-600">{data.totalQuestions}</p>
            </div>
          </div>
        </div>
      </div>

      {/* TOPIC CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {data.topics.map((topic: any, idx: number) => {
          const gradient = colorGradients[idx % colorGradients.length];
          return (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              {/* Top Accent Line */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${gradient}`} />
              
              <div className="flex justify-between items-start mb-4 mt-2">
                <h3 className="font-bold text-xl text-gray-800 pr-4">{topic.name}</h3>
                <span className={`px-3 py-1 bg-gray-50 text-gray-600 rounded-lg text-sm font-bold shrink-0 shadow-sm border border-gray-100 group-hover:scale-105 transition-transform`}>
                  {topic.count} Qs
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                  <span>Learning Share</span>
                  <span className="text-gray-600">{topic.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${topic.percentage}%` }} 
                    transition={{ duration: 1, delay: 0.2 }}
                    className={`h-full bg-gradient-to-r ${gradient}`} 
                  />
                </div>
              </div>

              {/* Recent Questions List */}
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Recent Questions
                </p>
                <ul className="space-y-3">
                  {topic.recentQuestions.map((q: string, qIdx: number) => (
                    <li key={qIdx} className="text-sm text-gray-600 font-medium flex items-start gap-2">
                      <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 bg-gradient-to-r ${gradient}`} />
                      <span className="leading-snug line-clamp-2">{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
