"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  MessageSquare, 
  BookOpen, 
  Bookmark, 
  Leaf,
  Activity,
  Loader2,
  Brain,
  Zap
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);
  const [topicAnalysis, setTopicAnalysis] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return router.push("/login");

        const headers = { "Authorization": `Bearer ${token}` };

        const [analyticsRes, topicRes, activityRes] = await Promise.all([
          fetch("/api/dashboard/analytics", { headers }),
          fetch("/api/dashboard/topic-analysis", { headers }),
          fetch("/api/questions/activity", { headers })
        ]);

        if (analyticsRes.ok) setAnalytics(await analyticsRes.json());
        if (topicRes.ok) setTopicAnalysis(await topicRes.json());
        if (activityRes.ok) setRecentActivity(await activityRes.json());
        
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading your dashboard...</p>
      </div>
    );
  }

  // Fallback defaults
  const stats = analytics || { totalQuestions: 0, topicsExplored: 0, accuracy: "N/A" };
  const topics = topicAnalysis?.topics || [];
  const topTopic = topics.length > 0 ? topics[0] : null;
  const dailyActivity = analytics?.dailyActivity || [];

  // Colors for the donut chart
  const colors = [
    { stroke: "#8B5CF6", colorClass: "bg-purple-500" },
    { stroke: "#3B82F6", colorClass: "bg-blue-500" },
    { stroke: "#10B981", colorClass: "bg-emerald-500" },
    { stroke: "#F59E0B", colorClass: "bg-amber-500" },
    { stroke: "#EF4444", colorClass: "bg-red-500" }
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Row: Hero Banner & Advanced Daily Activity Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* HERO BANNER (Reduced Size) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 relative bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 rounded-3xl p-8 overflow-hidden text-white shadow-xl shadow-purple-500/20 flex items-center justify-between"
        >
          <div className="relative z-10 max-w-sm">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight leading-tight">
              Ask Smarter.<br />Learn Better.
            </h1>
            <p className="text-sm text-white/80 mb-6">
              Get AI-powered answers, similar questions and topic insights instantly.
            </p>
            <button 
              onClick={() => router.push("/dashboard/ask-question")}
              className="bg-white text-indigo-600 px-6 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 hover:scale-105 hover:shadow-lg transition-all"
            >
              Ask a Question Now <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          {/* Abstract 3D-like shapes for hero (Reduced size) */}
          <div className="relative w-32 h-32 hidden md:block shrink-0 mr-4">
             <div className="absolute top-0 left-0 w-16 h-16 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
             <div className="absolute top-0 right-0 w-16 h-16 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
             <div className="absolute -bottom-4 left-8 w-16 h-16 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
             <div className="absolute inset-0 flex items-center justify-center text-6xl drop-shadow-xl">
                🧠
             </div>
          </div>
        </motion.div>

        {/* ADVANCED MODEL DAILY PULSE (Unique Format) */}
        <div className="bg-gray-900 rounded-3xl p-6 shadow-xl border border-gray-800 relative overflow-hidden flex flex-col justify-between group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full filter blur-3xl group-hover:bg-indigo-500/30 transition-colors"></div>
          
          <div className="flex justify-between items-start z-10 mb-4">
            <div>
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <Zap className="w-5 h-5 text-indigo-400" /> Model Pulse
              </h3>
              <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-bold">7-Day Analysis Velocity</p>
            </div>
            <div className="px-2 py-1 bg-indigo-500/20 rounded-md border border-indigo-500/30">
              <span className="text-xs font-bold text-indigo-300">Active</span>
            </div>
          </div>

          <div className="h-32 w-full mt-auto relative z-10">
            <AdvancedSparkline data={dailyActivity} />
          </div>
        </div>

      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Questions" value={stats.totalQuestions} icon={<MessageSquare className="w-6 h-6 text-indigo-500" />} color="bg-indigo-50" />
        <StatCard title="Topics Explored" value={stats.topicsExplored} icon={<BookOpen className="w-6 h-6 text-emerald-500" />} color="bg-emerald-50" />
        <StatCard title="Recent Activity" value={recentActivity.length} icon={<Activity className="w-6 h-6 text-purple-500" />} color="bg-purple-50" />
        <StatCard title="AI Confidence" value={stats.accuracy} icon={<Brain className="w-6 h-6 text-rose-500" />} color="bg-rose-50" />
      </div>

      {/* Bottom Row: Swapped Order (Chart on Left, Activity on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Topic Distribution (Now on LEFT - col-span-1) */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-800 text-lg">Topic Distribution</h3>
          </div>
          
          {topics.length === 0 ? (
            <p className="text-gray-500 italic text-center py-10">No topic data available.</p>
          ) : (
            <div className="space-y-5 flex-1">
              {topics.slice(0, 5).map((topic: any, i: number) => {
                const color = colors[i % colors.length];
                return (
                  <div key={i}>
                    <div className="flex justify-between text-sm font-bold text-gray-700 mb-2">
                      <span>{topic.name}</span>
                      <span style={{ color: color.stroke }}>{topic.percentage}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${topic.percentage}%` }} 
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className={`h-full ${color.colorClass}`} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {topTopic && (
            <div className="mt-6 bg-green-50 rounded-2xl p-4 flex items-center gap-4 border border-green-100">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-green-600/80 font-semibold uppercase tracking-wider mb-0.5">Top Topic</p>
                <p className="font-bold text-green-700 text-lg truncate max-w-[150px]">{topTopic.name}</p>
              </div>
            </div>
          )}
        </div>

        {/* Recent Activity Feed (Now on RIGHT - col-span-2) */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-800 text-lg">Recent Activity</h3>
            <Link href="/dashboard/history" className="text-indigo-500 text-sm font-semibold hover:underline">View all</Link>
          </div>
          <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {recentActivity.length === 0 ? (
              <p className="text-gray-500 italic">No recent activity.</p>
            ) : (
              recentActivity.slice(0, 5).map((act, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${act.type === 'saved' ? 'bg-amber-100 text-amber-500' : 'bg-indigo-100 text-indigo-500'}`}>
                    {act.type === 'saved' ? <Bookmark className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 truncate mb-1">{act.question}</p>
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                      <span className="text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md">{act.topic}</span>
                      <span>•</span>
                      <span>{new Date(act.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

// --- Subcomponents ---

function StatCard({ title, value, icon, color }: any) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow group">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${color} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-500 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

function AdvancedSparkline({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return <div className="text-gray-600 text-sm flex items-center justify-center h-full">No pulse data</div>;
  }

  const w = 400;
  const h = 100;
  const maxVal = Math.max(...data.map(d => d.count), 1);

  // Build the smooth cubic bezier curve path
  let path = `M 0,${h - (data[0].count / maxVal) * h}`;
  for (let i = 1; i < data.length; i++) {
    const prevX = ((i - 1) / (data.length - 1)) * w;
    const prevY = h - (data[i - 1].count / maxVal) * h;
    const currX = (i / (data.length - 1)) * w;
    const currY = h - (data[i].count / maxVal) * h;
    const controlX1 = prevX + (currX - prevX) / 2;
    const controlY1 = prevY;
    const controlX2 = prevX + (currX - prevX) / 2;
    const controlY2 = currY;
    path += ` C ${controlX1},${controlY1} ${controlX2},${controlY2} ${currX},${currY}`;
  }

  // Create the fill polygon by closing the path to the bottom edge
  const fillPath = `${path} L ${w},${h} L 0,${h} Z`;

  return (
    <div className="relative w-full h-full flex flex-col">
      <svg viewBox={`0 -10 ${w} ${h + 20}`} preserveAspectRatio="none" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="sparkGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0.0" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* The shaded area below the line */}
        <motion.path 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          d={fillPath} 
          fill="url(#sparkGradient)" 
        />
        
        {/* The glowing stroke line */}
        <motion.path 
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          d={path} 
          fill="none" 
          stroke="#818cf8" 
          strokeWidth="3" 
          filter="url(#glow)"
        />

        {/* Data points */}
        {data.map((d, i) => {
          const cx = (i / (data.length - 1)) * w;
          const cy = h - (d.count / maxVal) * h;
          return (
            <motion.circle 
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1 + i * 0.1 }}
              cx={cx} 
              cy={cy} 
              r="4" 
              fill="#c7d2fe" 
              stroke="#312e81"
              strokeWidth="2"
            />
          );
        })}
      </svg>
      
      {/* X-axis labels */}
      <div className="absolute -bottom-2 left-0 right-0 flex justify-between px-1">
        {data.map((d, i) => (
          <span key={i} className="text-[10px] font-bold text-gray-500 uppercase">{d.date}</span>
        ))}
      </div>
    </div>
  );
}
