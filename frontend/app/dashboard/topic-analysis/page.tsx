"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PieChart, Loader2, Network, Tag, BrainCircuit } from "lucide-react";
import { useRouter } from "next/navigation";

interface TopicData {
  name: string;
  count: number;
  percentage: number;
}

export default function TopicAnalysisPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [topics, setTopics] = useState<TopicData[]>([]);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return router.push("/login");

        const res = await fetch("/api/dashboard/topic-analysis", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setTopics(data.topics || []);
        }
      } catch (err) {
        console.error("Topic fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, [router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Analyzing your learning clusters...</p>
      </div>
    );
  }

  // Pre-defined pleasing positions for up to 10 nodes to avoid overlapping physics calculations
  const positions = [
    { top: '15%', left: '50%' }, // 1 - Top Center
    { top: '40%', left: '25%' }, // 2 - Mid Left
    { top: '40%', left: '75%' }, // 3 - Mid Right
    { top: '70%', left: '35%' }, // 4 - Bottom Left
    { top: '70%', left: '65%' }, // 5 - Bottom Right
    { top: '25%', left: '30%' }, // 6 
    { top: '25%', left: '70%' }, // 7
    { top: '60%', left: '15%' }, // 8
    { top: '60%', left: '85%' }, // 9
    { top: '85%', left: '50%' }, // 10
  ];

  const colors = [
    "from-indigo-500 to-purple-500",
    "from-blue-500 to-cyan-500",
    "from-emerald-400 to-teal-500",
    "from-rose-400 to-red-500",
    "from-amber-400 to-orange-500",
    "from-fuchsia-500 to-pink-500",
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="pb-12"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white tracking-tight flex items-center gap-3">
            <Network className="w-8 h-8 text-indigo-500" /> Semantic Topic Clustering
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">A visual representation of your knowledge map based on question history.</p>
        </div>
      </div>

      {topics.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-700">
          <BrainCircuit className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">No Topic Clusters Found</h3>
          <p className="text-gray-500 dark:text-gray-400">Ask more questions to begin generating your semantic knowledge graph.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Visual Graph (Takes up 2 columns) */}
          <div className="lg:col-span-2 bg-gray-900 rounded-3xl p-6 shadow-xl border border-gray-800 relative h-[600px] overflow-hidden flex items-center justify-center">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            
            {/* Center User Node */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute z-20 w-24 h-24 bg-white rounded-full shadow-[0_0_50px_rgba(255,255,255,0.2)] flex items-center justify-center flex-col top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-4 border-gray-900"
            >
              <BrainCircuit className="w-8 h-8 text-gray-900" />
              <span className="text-xs font-bold text-gray-900 mt-1">CORE</span>
            </motion.div>

            {/* Connecting SVG Lines */}
            <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none">
              {topics.slice(0, 10).map((topic, index) => {
                const pos = positions[index];
                return (
                  <motion.line
                    key={`line-${index}`}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.3 }}
                    transition={{ duration: 1.5, delay: index * 0.2 }}
                    x1="50%"
                    y1="50%"
                    x2={pos.left}
                    y2={pos.top}
                    stroke="#818cf8"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                );
              })}
            </svg>

            {/* Topic Nodes */}
            {topics.slice(0, 10).map((topic, index) => {
              const pos = positions[index];
              const color = colors[index % colors.length];
              
              // Scale size based on percentage: min 80px, max 160px
              const size = Math.max(80, Math.min(160, topic.percentage * 3));

              return (
                <motion.div
                  key={index}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 100,
                    delay: 0.5 + index * 0.1 
                  }}
                  whileHover={{ scale: 1.1, zIndex: 30 }}
                  className={`absolute z-10 rounded-full bg-gradient-to-br ${color} flex items-center justify-center flex-col shadow-[0_0_30px_rgba(0,0,0,0.5)] border-4 border-gray-900 cursor-pointer group`}
                  style={{
                    width: size,
                    height: size,
                    top: pos.top,
                    left: pos.left,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <span className="text-white font-extrabold text-sm sm:text-base text-center px-2 truncate w-full group-hover:whitespace-normal group-hover:overflow-visible transition-all">
                    {topic.name}
                  </span>
                  <span className="text-white/80 font-bold text-xs mt-1">
                    {topic.percentage}%
                  </span>
                  
                  {/* Floating effect */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3 + index, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full"
                  />
                </motion.div>
              );
            })}
          </div>

          {/* Breakdown List */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 h-[600px] flex flex-col">
            <h3 className="font-bold text-gray-800 dark:text-white text-lg mb-6 flex items-center gap-2">
              <Tag className="w-5 h-5 text-indigo-500" /> Topic Breakdown
            </h3>
            
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {topics.map((topic, index) => {
                const color = colors[index % colors.length].split(" ")[0].replace("from-", "bg-"); // Extract a background color class
                return (
                  <motion.div 
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    key={index} 
                    className="p-4 rounded-2xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full shadow-sm ${color.includes('bg-') ? color : 'bg-indigo-500'}`} />
                      <span className="font-bold text-gray-800 dark:text-gray-200">{topic.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="block font-extrabold text-indigo-600 dark:text-indigo-400">{topic.percentage}%</span>
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{topic.count} Questions</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>
      )}
    </motion.div>
  );
}
