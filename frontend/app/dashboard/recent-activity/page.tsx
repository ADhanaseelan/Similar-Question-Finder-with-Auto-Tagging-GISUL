"use client";
import { Activity, MessageSquarePlus, Bookmark, Clock, Loader2, Tag } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function RecentActivityPage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8000/api/questions/activity", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setActivities(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchActivity();
  }, []);

  // Format relative time (e.g., "2 hours ago")
  const getRelativeTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  return (
    <div className="pb-12 space-y-8 max-w-4xl mx-auto">
      <div className="mb-8 md:mb-12 text-center px-4">
        <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">
          <Activity className="w-6 h-6 md:w-8 md:h-8 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight">Recent Activity</h1>
        <p className="text-gray-500 mt-2 text-base md:text-lg max-w-2xl mx-auto">
          A unified timeline of your learning journey and interactions.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Recent Activity</h3>
          <p className="text-gray-500">Ask a question or bookmark an item to see it appear in your timeline.</p>
        </div>
      ) : (
        <div className="relative pl-8 md:pl-0">
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-indigo-100 -translate-x-1/2 z-0"></div>

          <div className="space-y-8">
            {activities.map((item, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={item.id} 
                className={`relative flex items-center justify-start md:justify-between group w-full ${
                  idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline Dot icon */}
                <div className="absolute left-0 md:left-1/2 -translate-x-1/2 w-10 h-10 rounded-full border-4 border-white bg-indigo-50 flex items-center justify-center z-10 shadow-sm group-hover:scale-110 group-hover:bg-indigo-100 transition-all">
                  {item.type === 'asked' ? (
                    <MessageSquarePlus className="w-4 h-4 text-indigo-500" />
                  ) : (
                    <Bookmark className="w-4 h-4 text-pink-500" />
                  )}
                </div>

                {/* Content Card */}
                <div className={`w-full md:w-[calc(50%-2.5rem)] pl-8 md:pl-0 ${
                  idx % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left'
                }`}>
                  <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-200 transition-shadow">
                    <div className={`flex flex-wrap items-center gap-1.5 md:gap-2 mb-2 md:mb-3 text-[10px] md:text-xs font-bold uppercase tracking-wider ${
                      idx % 2 === 0 ? 'md:justify-end' : 'md:justify-start'
                    }`}>
                      <span className={item.type === 'asked' ? 'text-indigo-600' : 'text-pink-600'}>
                        {item.type === 'asked' ? 'Asked Question' : 'Bookmarked'}
                      </span>
                      <span className="text-gray-300 hidden md:inline">•</span>
                      <span className="text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 md:w-3 md:h-3" />
                        {getRelativeTime(item.timestamp)}
                      </span>
                    </div>

                    <h3 className="text-base md:text-lg font-bold text-gray-800 leading-snug mb-3 md:mb-4">
                      "{item.question}"
                    </h3>

                    <div className={`inline-flex items-center gap-1.5 px-2 md:px-3 py-1 bg-gray-50 text-gray-600 rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-wider ${
                      idx % 2 === 0 ? 'md:float-right' : 'md:float-left'
                    }`}>
                      <Tag className="w-3 h-3 text-gray-400" />
                      <span className="truncate max-w-[120px] md:max-w-[150px]">{item.topic}</span>
                    </div>
                    <div className="clear-both"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
