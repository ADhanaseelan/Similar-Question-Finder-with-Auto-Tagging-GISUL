"use client";

import { motion } from "framer-motion";
import { Brain, Database, Code, ChevronRight, Play, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { bloomsQuizData } from "../../../data/bloomsQuizData";

export default function BloomsQuizPage() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);

  const renderIcon = (iconName: string) => {
    switch(iconName) {
      case "Brain": return <Brain className="w-6 h-6" />;
      case "Code": return <Code className="w-6 h-6" />;
      case "Database": return <Database className="w-6 h-6" />;
      default: return <Brain className="w-6 h-6" />;
    }
  };

  const currentQuestion = bloomsQuizData.sampleQuiz.find(q => q.level === currentLevel);

  return (
    <div className="pb-12 space-y-8 max-w-5xl mx-auto">
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Bloom's Taxonomy Quiz</h1>
        <p className="text-gray-500 mt-2 text-lg max-w-2xl mx-auto">
          Test your mastery of a topic by progressing through the 6 levels of cognitive learning.
        </p>
      </div>

      {!selectedTopic ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <h2 className="text-xl font-bold text-gray-800 text-center mb-8">Select a Topic to Begin</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bloomsQuizData.availableTopics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => setSelectedTopic(topic.id)}
                className="group bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all text-left relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-4 relative z-10 group-hover:scale-110 transition-transform">
                  {renderIcon(topic.icon)}
                </div>
                <h3 className="font-bold text-gray-800 text-lg mb-1 relative z-10">{topic.name}</h3>
                <p className="text-sm font-medium text-gray-500 relative z-10">{topic.count} Questions Available</p>
              </button>
            ))}
          </div>
        </motion.div>
      ) : !quizStarted ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Ready to test your knowledge?</h2>
          <p className="text-gray-500 mb-8">You selected <span className="font-bold text-indigo-600">{bloomsQuizData.availableTopics.find(t => t.id === selectedTopic)?.name}</span></p>
          
          <div className="space-y-3 mb-8 text-left">
            {bloomsQuizData.taxonomyLevels.map((level) => (
              <div key={level.level} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className={`w-8 h-8 rounded-lg ${level.color} text-white flex items-center justify-center font-bold shadow-sm`}>
                  {level.level}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{level.name}</h4>
                  <p className="text-xs text-gray-500">{level.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => setSelectedTopic(null)}
              className="px-6 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Change Topic
            </button>
            <button 
              onClick={() => setQuizStarted(true)}
              className="px-6 py-3 rounded-xl font-bold text-white bg-indigo-500 hover:bg-indigo-600 shadow-md shadow-indigo-500/30 transition-all flex items-center gap-2"
            >
              Start Quiz <Play className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto space-y-6">
          {/* Progress Bar */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between gap-4">
            {bloomsQuizData.taxonomyLevels.map((level) => (
              <div key={level.level} className="flex-1 flex flex-col items-center gap-2 relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm z-10 transition-colors ${
                  currentLevel > level.level ? 'bg-green-500 text-white' : 
                  currentLevel === level.level ? `${level.color} text-white shadow-lg scale-110` : 
                  'bg-gray-100 text-gray-400'
                }`}>
                  {currentLevel > level.level ? <CheckCircle2 className="w-5 h-5" /> : level.level}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider hidden sm:block ${currentLevel === level.level ? 'text-gray-800' : 'text-gray-400'}`}>
                  {level.name}
                </span>
                {level.level < 6 && (
                  <div className={`absolute top-5 left-1/2 w-full h-1 -translate-y-1/2 z-0 ${currentLevel > level.level ? 'bg-green-500' : 'bg-gray-100'}`}></div>
                )}
              </div>
            ))}
          </div>

          {/* Question Card */}
          {currentQuestion && (
            <motion.div key={currentLevel} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 font-bold text-sm rounded-lg mb-6 uppercase tracking-wider">
                Level {currentLevel}: {currentQuestion.levelName}
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-8 leading-relaxed">
                {currentQuestion.question}
              </h2>
              
              <div className="space-y-4">
                <textarea 
                  placeholder="Type your detailed answer here..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-5 text-gray-800 focus:ring-2 focus:ring-indigo-500/50 resize-none outline-none font-medium"
                  rows={6}
                ></textarea>
                
                <div className="flex justify-between items-center pt-4">
                  <button className="text-sm font-bold text-gray-400 hover:text-indigo-500 transition-colors">
                    Need a hint?
                  </button>
                  <button 
                    onClick={() => {
                      if (currentLevel < 6) setCurrentLevel(prev => prev + 1);
                      else alert("Quiz Completed! Awesome job!");
                    }}
                    className="px-6 py-3 rounded-xl font-bold text-white bg-indigo-500 hover:bg-indigo-600 shadow-md shadow-indigo-500/30 transition-all flex items-center gap-2"
                  >
                    {currentLevel === 6 ? "Finish Quiz" : "Submit & Next"} <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}
