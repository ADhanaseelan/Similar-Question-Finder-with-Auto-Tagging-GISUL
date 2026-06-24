"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Brain, Sparkles, BookOpen, Network } from "lucide-react";

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark overflow-hidden relative font-sans">
      {/* Animated Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[100px] animate-blob pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/20 blur-[120px] animate-blob animation-delay-2000 pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[20%] w-[40%] h-[40%] rounded-full bg-accent/20 blur-[100px] animate-blob animation-delay-4000 pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
            <Network className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-poppins font-bold text-foreground-light dark:text-foreground-dark tracking-tight">LearnConnect AI</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
            Sign In
          </Link>
          <Link href="/signup">
            <button className="px-6 py-2.5 bg-primary hover:bg-primary-hover rounded-xl text-sm font-semibold text-white transition-all shadow-md">
              Get Started
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col lg:flex-row items-center justify-between pt-24 pb-32 px-8 max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-start lg:w-1/2"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-primary/20 shadow-sm mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Semantic Similarity Search</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="font-poppins text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-foreground-light dark:text-foreground-dark leading-[1.1]">
            Find similar questions using <br />
            <span className="text-gradient">AI-powered understanding</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-lg mb-12 leading-relaxed font-medium">
            Ask study questions and discover related knowledge through semantic similarity. Build your own learning journey through connected questions.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 w-full justify-start">
            <Link href="/signup">
              <button className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-hover text-white rounded-[20px] font-semibold flex items-center justify-center gap-2 transition-all shadow-xl shadow-primary/20 transform hover:-translate-y-1">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <Link href="/login">
              <button className="w-full sm:w-auto px-8 py-4 glass text-foreground-light dark:text-foreground-dark rounded-[20px] font-semibold flex items-center justify-center transition-all transform hover:-translate-y-1">
                Login
              </button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Right Side Illustration placeholder */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="lg:w-1/2 mt-16 lg:mt-0 relative flex justify-center items-center"
        >
          <div className="relative w-[400px] h-[400px]">
            {/* Center Node */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 glass-card rounded-full flex items-center justify-center z-20 shadow-primary/30 shadow-2xl border-primary/30">
              <Brain className="w-10 h-10 text-primary" />
            </div>
            
            {/* Orbiting Nodes */}
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
              className="absolute inset-0 border border-dashed border-gray-300 dark:border-gray-700 rounded-full"
            >
              <div className="absolute top-[-10px] left-1/2 transform -translate-x-1/2 w-16 h-16 glass-card rounded-full flex items-center justify-center border-secondary/30">
                <BookOpen className="w-6 h-6 text-secondary" />
              </div>
              <div className="absolute bottom-10 right-10 w-12 h-12 glass-card rounded-full flex items-center justify-center border-accent/30">
                <Sparkles className="w-5 h-5 text-accent" />
              </div>
            </motion.div>
            
            <motion.div 
              animate={{ rotate: -360 }} 
              transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
              className="absolute inset-[60px] border border-dashed border-gray-200 dark:border-gray-800 rounded-full"
            >
              <div className="absolute top-10 left-0 w-14 h-14 glass-card rounded-full flex items-center justify-center border-primary/20">
                <Network className="w-6 h-6 text-primary" />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
