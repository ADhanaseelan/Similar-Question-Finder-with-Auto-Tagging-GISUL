"use client";
import { BarChart, Activity, PieChart, Layers, HelpCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StatisticsPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return router.push("/login");

        const res = await fetch("/api/dashboard/analytics", {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (res.ok) {
          const result = await res.json();
          setData(result);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Crunching your study data...</p>
      </div>
    );
  }

  if (!data || data.totalQuestions === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <BarChart className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">No Data Available</h1>
        <p className="text-gray-500 mb-6 max-w-md">You need to ask a few questions before we can generate your usage statistics!</p>
        <button onClick={() => router.push("/dashboard/ask-question")} className="px-6 py-3 bg-indigo-500 text-white rounded-xl font-bold hover:bg-indigo-600 transition-colors">
          Start Learning
        </button>
      </div>
    );
  }

  return (
    <div className="pb-12 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight flex items-center gap-3">
            <BarChart className="w-8 h-8 text-indigo-500" /> Usage Statistics
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Detailed analytics for your study sessions and activity.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat Cards */}
        <StatCard 
          icon={<HelpCircle className="w-6 h-6 text-blue-500" />} 
          title="Questions Asked" 
          value={data.totalQuestions} 
          color="bg-blue-50" 
        />
        <StatCard 
          icon={<Layers className="w-6 h-6 text-emerald-500" />} 
          title="Topics Explored" 
          value={data.topicsExplored} 
          color="bg-emerald-50" 
        />
        <StatCard 
          icon={<Activity className="w-6 h-6 text-purple-500" />} 
          title="Recent Activity" 
          value={data.recentActivityCount} 
          color="bg-purple-50" 
        />
        <StatCard 
          icon={<PieChart className="w-6 h-6 text-rose-500" />} 
          title="AI Confidence" 
          value={data.accuracy} 
          color="bg-rose-50" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Top Tags Bar Chart */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 text-xl mb-6">Top Learning Categories</h3>
          <div className="space-y-4">
            {data.topTags.map((tag: string, idx: number) => {
              // Mock percentage for visual effect since analytics endpoint only returns tag names
              const pct = Math.max(20, 100 - (idx * 15)); 
              return (
                <div key={idx}>
                  <div className="flex justify-between text-sm font-bold text-gray-600 mb-2">
                    <span>{tag}</span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${pct}%` }} 
                      transition={{ duration: 1, delay: idx * 0.1 }}
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" 
                    />
                  </div>
                </div>
              );
            })}
            {data.topTags.length === 0 && (
              <p className="text-gray-500 italic">No categories explored yet.</p>
            )}
          </div>
        </div>

        {/* Learning Velocity */}
        <div className="bg-gradient-to-br from-[#131421] to-[#1c1d30] p-6 rounded-3xl shadow-lg relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full filter blur-3xl"></div>
          <h3 className="font-bold text-white text-xl mb-6 relative z-10">Learning Velocity</h3>
          <div className="flex items-center justify-center h-48 relative z-10">
            <div className="text-center">
              <div className="w-32 h-32 rounded-full border-8 border-indigo-500/30 border-t-indigo-500 flex items-center justify-center mx-auto mb-4 animate-[spin_3s_linear_infinite]">
                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center animate-[spin_3s_linear_infinite_reverse]">
                  <Activity className="w-8 h-8 text-indigo-400" />
                </div>
              </div>
              <p className="text-indigo-300 font-bold tracking-widest uppercase text-sm">System Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color }: { icon: any, title: string, value: string | number, color: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-5"
    >
      <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{title}</p>
        <p className="text-2xl font-black text-gray-800">{value}</p>
      </div>
    </motion.div>
  );
}
