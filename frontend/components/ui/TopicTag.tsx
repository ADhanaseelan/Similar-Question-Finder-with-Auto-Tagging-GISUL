import React from "react";

export const topicColors: Record<string, { bg: string; text: string; dot: string; border: string }> = {
  Biology: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', dot: 'bg-green-500', border: 'border-green-200 dark:border-green-800' },
  Physics: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', dot: 'bg-blue-500', border: 'border-blue-200 dark:border-blue-800' },
  Chemistry: { bg: 'bg-teal-100 dark:bg-teal-900/30', text: 'text-teal-700 dark:text-teal-300', dot: 'bg-teal-500', border: 'border-teal-200 dark:border-teal-800' },
  Mathematics: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300', dot: 'bg-purple-500', border: 'border-purple-200 dark:border-purple-800' },
  DSA: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300', dot: 'bg-orange-500', border: 'border-orange-200 dark:border-orange-800' },
  DBMS: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300', dot: 'bg-red-500', border: 'border-red-200 dark:border-red-800' },
  'Operating Systems': { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300', dot: 'bg-slate-500', border: 'border-slate-200 dark:border-slate-700' },
  'Computer Networks': { bg: 'bg-cyan-100 dark:bg-cyan-900/30', text: 'text-cyan-700 dark:text-cyan-300', dot: 'bg-cyan-500', border: 'border-cyan-200 dark:border-cyan-800' },
};

interface TopicTagProps {
  topic: string;
  className?: string;
}

export function TopicTag({ topic, className = "" }: TopicTagProps) {
  const colors = topicColors[topic] ?? { 
    bg: 'bg-gray-100 dark:bg-gray-800', 
    text: 'text-gray-700 dark:text-gray-300', 
    dot: 'bg-gray-400', 
    border: 'border-gray-200 dark:border-gray-700' 
  };
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${colors.bg} ${colors.text} ${colors.border} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
      {topic}
    </span>
  );
}
