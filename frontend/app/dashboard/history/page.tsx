"use client";
import { History, Clock, Tag, Search, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8000/api/questions/history", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setHistory(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="pb-12 space-y-8 max-w-5xl mx-auto">
      <div className="mb-6 md:mb-8 text-center px-4">
        <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">
          <History className="w-6 h-6 md:w-8 md:h-8 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight">Your Question History</h1>
        <p className="text-gray-500 mt-2 text-base md:text-lg max-w-2xl mx-auto">
          Review all the concepts you've explored and see how your knowledge has grown.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-2xl mx-auto">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">No History Found</h3>
          <p className="text-gray-500">You haven't asked any questions yet! Head over to the Ask Question page to get started.</p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {history.map((item, idx) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={item.id} 
              className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-200 transition-all group flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center"
            >
              <div className="flex-1 w-full">
                <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2 md:mb-3">
                  <div className="inline-flex items-center gap-1.5 px-2 md:px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-wider">
                    <Tag className="w-3 h-3" />
                    <span className="truncate max-w-[150px]">{item.topic}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] md:text-xs font-medium text-gray-400">
                    <Clock className="w-3 h-3 md:w-4 md:h-4" />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <h3 className="text-base md:text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                  {item.question}
                </h3>
              </div>
              <div className="bg-gray-50 rounded-xl md:rounded-2xl p-3 md:p-4 text-center w-full md:w-auto md:min-w-[120px] shrink-0 flex md:block items-center justify-between md:justify-center border border-gray-100 md:border-none">
                <span className="block text-xl md:text-2xl font-black text-indigo-600">{item.similarCount}</span>
                <span className="text-[10px] md:text-[10px] font-bold uppercase text-gray-400 tracking-wider">Similar Found</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
