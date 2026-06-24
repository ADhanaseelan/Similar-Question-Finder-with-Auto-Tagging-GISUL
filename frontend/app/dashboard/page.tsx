"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  MessageSquare, 
  BookOpen, 
  Bookmark, 
  TrendingUp, 
  Sparkles,
  Leaf,
  Atom,
  Calculator,
  FlaskConical,
  Bot,
  Pencil,
  Brain,
  CheckCircle2,
  Search
} from "lucide-react";
import Link from "next/link";
import { dashboardData } from "../../data/dummyData";

// Helper to get correct icon component based on string type
const getIcon = (type: string, className: string) => {
  switch (type) {
    case "message": return <MessageSquare className={className} />;
    case "book": return <BookOpen className={className} />;
    case "bookmark": return <Bookmark className={className} />;
    case "trending": return <TrendingUp className={className} />;
    case "leaf": return <Leaf className={className} />;
    case "atom": return <Atom className={className} />;
    case "calculator": return <Calculator className={className} />;
    case "flask": return <FlaskConical className={className} />;
    case "bot": return <Bot className={className} />;
    case "pencil": return <Pencil className={className} />;
    case "brain": return <Brain className={className} />;
    case "check": return <CheckCircle2 className={className} />;
    case "search": return <Search className={className} />;
    default: return <Sparkles className={className} />;
  }
};

export default function DashboardPage() {
  const { stats, recentQuestions, topicDistribution, activityOverview, aiInsight, recentActivityTimeline } = dashboardData;

  // States for interactive charts
  const [activeTopic, setActiveTopic] = useState<any>(null);
  const [activePoint, setActivePoint] = useState<any>(null);

  // Calculate donut chart SVGs
  let currentOffset = 0;
  const circumference = 251.327; // 2 * pi * 40
  
  // Calculate line chart points
  const maxVal = 50; // assuming Y axis goes 0 to 50
  const pointsString = activityOverview.points.map((pt, i) => {
    const x = Math.round((i / (activityOverview.points.length - 1)) * 100);
    // mapped to top=20, bottom=90
    const y = Math.round(90 - (pt.value / maxVal) * 70);
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 rounded-3xl p-10 overflow-hidden text-white shadow-xl shadow-purple-500/20"
      >
        <div className="relative z-10 max-w-xl">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight leading-tight">
            Ask Smarter.<br />Learn Better.
          </h1>
          <p className="text-lg text-white/80 mb-8 max-w-md">
            Get AI-powered answers, similar questions and topic insights instantly.
          </p>
          <button className="bg-white text-indigo-600 px-8 py-3.5 rounded-full font-bold flex items-center gap-2 hover:scale-105 hover:shadow-lg transition-all">
            Ask a Question Now <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        
        {/* Abstract 3D-like shapes for hero */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:block">
          <div className="relative w-64 h-64">
             <div className="absolute top-0 left-10 w-24 h-24 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
             <div className="absolute top-0 right-10 w-24 h-24 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
             <div className="absolute -bottom-8 left-20 w-24 h-24 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
             <div className="absolute inset-0 flex items-center justify-center text-8xl">
                🧠
             </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <StatCard 
            key={idx}
            title={stat.title} 
            value={stat.value} 
            subtitle={stat.subtitle} 
            icon={getIcon(stat.iconType, `w-6 h-6 ${stat.iconColor}`)} 
            color={stat.color} 
            subtitleColor={stat.subtitleColor}
          />
        ))}
      </div>

      {/* Main Grid: 3 columns layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Questions */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-800 text-lg">Recent Questions</h3>
            <Link href="#" className="text-indigo-500 text-sm font-semibold hover:underline">View all</Link>
          </div>
          <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {recentQuestions.map((q) => (
              <RecentQuestionItem 
                key={q.id}
                icon={getIcon(q.iconType, `w-5 h-5 ${q.matchColor}`)}
                iconBg={q.iconBg}
                question={q.question}
                topic={q.topic}
                time={q.time}
                match={q.match}
                matchColor={q.matchColor}
              />
            ))}
          </div>
        </div>

        {/* Topic Distribution */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-800 text-lg">Topic Distribution</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">This Month v</span>
          </div>
          
          <div className="flex-1 flex items-center justify-center gap-6">
            {/* SVG Donut Chart */}
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
                {topicDistribution.data.map((topic, i) => {
                  const dashLength = (topic.percent / 100) * circumference;
                  const circle = (
                    <circle 
                      key={i}
                      cx="50" cy="50" r="40" 
                      fill="transparent" 
                      stroke={topic.stroke} 
                      strokeWidth={activeTopic?.label === topic.label ? "20" : "16"} 
                      strokeDasharray={`${dashLength} ${circumference}`} 
                      strokeDashoffset={-currentOffset}
                      className="transition-all duration-300 cursor-pointer outline-none hover:opacity-80"
                      onMouseEnter={() => setActiveTopic(topic)}
                      onMouseLeave={() => setActiveTopic(null)}
                    />
                  );
                  currentOffset += dashLength;
                  return circle;
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-all duration-300">
                {activeTopic ? (
                  <>
                    <span className="text-xl font-bold text-gray-800" style={{ color: activeTopic.stroke }}>{activeTopic.percent}%</span>
                    <span className="text-xs font-semibold text-gray-500">{activeTopic.label}</span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl font-bold text-gray-800">{topicDistribution.total}</span>
                    <span className="text-xs text-gray-500">Total</span>
                  </>
                )}
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-3">
              {topicDistribution.data.map((topic, i) => (
                <LegendItem 
                  key={i} 
                  color={topic.colorClass} 
                  label={topic.label} 
                  value={`${topic.percent}%`}
                  isActive={activeTopic?.label === topic.label} 
                />
              ))}
            </div>
          </div>

          <div className="mt-6 bg-green-50 rounded-2xl p-4 flex items-center gap-4 border border-green-100">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-green-600/80 font-semibold uppercase tracking-wider mb-0.5">Most Explored Topic</p>
              <p className="font-bold text-green-700 text-lg">{topicDistribution.mostExplored}</p>
            </div>
          </div>
        </div>

        {/* Activity Overview */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-800 text-lg">Activity Overview</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">This Week v</span>
          </div>

          <div className="flex-1 flex items-end pt-4 pb-2 relative">
            <div className="w-full h-40 relative">
              {/* Y Axis labels */}
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-400">
                <span>50</span>
                <span>40</span>
                <span>30</span>
                <span>20</span>
                <span>10</span>
                <span>0</span>
              </div>
              
              {/* Grid lines */}
              <div className="absolute left-6 right-0 top-0 bottom-6 flex flex-col justify-between pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="border-b border-gray-100 w-full h-0"></div>
                ))}
              </div>

              {/* Line Chart SVG */}
              <div className="absolute left-6 right-0 top-0 bottom-6">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                  {/* Glow/Shadow under line */}
                  <polyline 
                    fill="none" 
                    stroke="#8B5CF6" 
                    strokeWidth="3" 
                    points={pointsString} 
                    className="drop-shadow-md"
                  />
                  {/* Points */}
                  {activityOverview.points.map((pt, i) => {
                    const x = Math.round((i / (activityOverview.points.length - 1)) * 100);
                    const y = Math.round(90 - (pt.value / maxVal) * 70);
                    const isHovered = activePoint?.day === pt.day;
                    return (
                      <circle 
                        key={i} 
                        cx={x} 
                        cy={y} 
                        r={isHovered ? "5" : "3"} 
                        fill="white" 
                        stroke="#8B5CF6" 
                        strokeWidth={isHovered ? "3" : "2"} 
                        className="transition-all duration-200 cursor-pointer outline-none"
                        onMouseEnter={() => setActivePoint(pt)}
                        onMouseLeave={() => setActivePoint(null)}
                      />
                    );
                  })}
                </svg>
                
                {/* Floating Tooltip */}
                <AnimatePresence>
                  {activePoint && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.9 }}
                      className="absolute -top-12 bg-gray-800 text-white text-xs py-1.5 px-3 rounded-lg shadow-xl pointer-events-none z-10 whitespace-nowrap"
                      style={{
                        left: `${(activityOverview.points.findIndex(p => p.day === activePoint.day) / (activityOverview.points.length - 1)) * 100}%`,
                        transform: 'translateX(-50%)'
                      }}
                    >
                      <div className="font-bold text-center">{activePoint.day}</div>
                      <div className="text-gray-300">{activePoint.value} questions</div>
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* X Axis Labels */}
              <div className="absolute left-6 right-0 bottom-0 flex justify-between text-xs text-gray-400 transform translate-y-full pt-2">
                {activityOverview.points.map((pt, i) => (
                  <span key={i} className={activePoint?.day === pt.day ? "text-purple-600 font-bold" : ""}>
                    {pt.day}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 bg-purple-50 rounded-2xl p-4 flex items-center justify-between border border-purple-100">
            <div>
              <p className="text-xs text-purple-500 font-semibold uppercase tracking-wider mb-0.5">Peak Day</p>
              <p className="font-bold text-purple-700 text-lg">{activityOverview.peakDay}</p>
              <p className="text-xs text-purple-600/70">Highest activity</p>
            </div>
            <div className="text-4xl drop-shadow-sm">🚀</div>
          </div>
        </div>
      </div>

      {/* Bottom Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* AI Insight */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-6 group hover:shadow-md transition-all cursor-pointer">
          <div className="w-24 h-24 bg-gradient-to-tr from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
             {getIcon(aiInsight.iconType, "w-12 h-12 text-indigo-500")}
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-2">AI Insight</h3>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              {aiInsight.message}
            </p>
            <button className="bg-indigo-500 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-indigo-600 transition-colors shadow-sm">
              Explore More Insights
            </button>
          </div>
        </div>

        {/* Recent Activity Timeline */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-800 text-lg">Recent Activity</h3>
            <Link href="#" className="text-indigo-500 text-sm font-semibold hover:underline">View all</Link>
          </div>
          
          <div className="relative pt-4 pb-2 px-2 overflow-x-auto">
            {/* Connecting line */}
            <div className="absolute top-8 left-6 right-6 h-1 bg-gradient-to-r from-purple-500 via-blue-400 to-green-400 rounded-full hidden sm:block"></div>
            
            <div className="flex flex-col sm:flex-row justify-between gap-8 sm:gap-0 relative z-10">
              {recentActivityTimeline.map((step) => (
                <TimelineStep 
                  key={step.id}
                  icon={getIcon(step.iconType, "w-4 h-4 text-white")}
                  color={step.color}
                  time={step.time}
                  title={step.title}
                  desc={step.desc}
                />
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

// --- Subcomponents ---

function StatCard({ title, value, subtitle, icon, color, subtitleColor }: any) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow cursor-default group">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${color} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-500 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-800 mb-1">{value}</p>
        <p className={`text-xs font-semibold ${subtitleColor}`}>{subtitle}</p>
      </div>
    </div>
  );
}

function RecentQuestionItem({ icon, iconBg, question, topic, time, match, matchColor }: any) {
  return (
    <div className="flex items-start gap-4 group cursor-pointer hover:bg-gray-50 p-2 -mx-2 rounded-xl transition-colors">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 text-sm truncate mb-1 group-hover:text-indigo-600 transition-colors">{question}</p>
        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
          <span className={matchColor}>{topic}</span>
          <span>•</span>
          <span>{time}</span>
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className={`font-bold text-sm ${matchColor}`}>{match}</p>
        <p className={`text-[10px] uppercase tracking-wide ${matchColor} opacity-70 font-semibold`}>Match</p>
      </div>
    </div>
  );
}

function LegendItem({ color, label, value, isActive }: any) {
  return (
    <div className={`flex items-center gap-3 transition-all duration-200 ${isActive ? 'scale-105' : 'opacity-80'}`}>
      <div className={`w-3 h-3 rounded-full ${color} ${isActive ? 'ring-4 ring-gray-100' : ''}`}></div>
      <span className={`text-sm font-medium w-16 ${isActive ? 'text-gray-900 font-bold' : 'text-gray-600'}`}>{label}</span>
      <span className={`text-sm font-bold ${isActive ? 'text-indigo-600' : 'text-gray-800'}`}>{value}</span>
    </div>
  );
}

function TimelineStep({ icon, color, time, title, desc }: any) {
  return (
    <div className="flex sm:flex-col items-start sm:items-center gap-4 sm:gap-2 sm:w-1/4 group cursor-pointer">
      <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center shadow-lg shrink-0 border-4 border-white relative z-10 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div className="sm:text-center pt-1 sm:pt-2">
        <p className="text-[10px] text-gray-400 font-bold mb-1">{time}</p>
        <p className="text-xs font-bold text-gray-800 mb-1 group-hover:text-indigo-600 transition-colors">{title}</p>
        <p className="text-[11px] text-gray-500 leading-relaxed max-w-[150px] mx-auto">{desc}</p>
      </div>
    </div>
  );
}
