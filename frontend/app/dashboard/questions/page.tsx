"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Calendar, ChevronRight } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { TopicTag } from "@/components/ui/TopicTag";

export default function MyQuestionsPage() {
  const [questions] = useState([
    { id: 1, text: "Why does photosynthesis need light?", topic: "Biology", date: "2023-10-15" },
    { id: 2, text: "What is the time complexity of QuickSort?", topic: "DSA", date: "2023-10-14" },
    { id: 3, text: "Explain the OSI model layers.", topic: "Computer Networks", date: "2023-10-12" },
    { id: 4, text: "How do plants convert sunlight into energy?", topic: "Biology", date: "2023-10-10" },
  ]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-4xl"
    >
      <div>
        <h1 className="text-4xl font-poppins font-extrabold text-foreground-light dark:text-foreground-dark mb-2">My Questions</h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Manage and review your saved questions.</p>
      </div>

      <div className="space-y-4">
        {questions.map((q, i) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <GlassCard className="!p-5 hover:border-primary/30 transition-colors cursor-pointer group flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <TopicTag topic={q.topic} />
                  <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {q.date}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground-light dark:text-foreground-dark group-hover:text-primary transition-colors">
                  {q.text}
                </h3>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
