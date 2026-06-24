"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, TrendingUp } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { TopicTag, topicColors } from "@/components/ui/TopicTag";

export default function TopicsPage() {
  const topics = Object.keys(topicColors).map(t => ({
    name: t,
    count: Math.floor(Math.random() * 20) + 1,
    mastery: Math.floor(Math.random() * 100),
  }));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-5xl"
    >
      <div>
        <h1 className="text-4xl font-poppins font-extrabold text-foreground-light dark:text-foreground-dark mb-2">My Topics</h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Explore your subject topography and mastery levels.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <GlassCard className="hover:-translate-y-1 transition-transform cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-2xl bg-gray-100 dark:bg-gray-800">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <TopicTag topic={t.name} />
              </div>
              <h3 className="text-xl font-bold text-foreground-light dark:text-foreground-dark mb-2">{t.name}</h3>
              <p className="text-gray-500 dark:text-gray-400 font-medium text-sm mb-6">{t.count} questions explored</p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-gray-600 dark:text-gray-300">Mastery</span>
                  <span className="text-primary">{t.mastery}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" 
                    style={{ width: `${t.mastery}%` }} 
                  />
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
