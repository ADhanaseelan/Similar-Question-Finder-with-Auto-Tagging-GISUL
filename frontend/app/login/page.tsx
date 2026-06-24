"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Network, ArrowRight, Loader2, BookOpen } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Login failed");
      }

      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex font-sans">
      {/* Left Side - Visuals */}
      <div className="hidden lg:flex flex-col justify-center items-center w-1/2 relative overflow-hidden bg-gradient-to-br from-[#1A1A2E] to-[#10101F] text-white">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/20 blur-[100px] animate-blob pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-secondary/20 blur-[100px] animate-blob animation-delay-2000 pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-md text-center"
        >
          <div className="w-24 h-24 mx-auto rounded-[24px] bg-white/10 backdrop-blur-md flex items-center justify-center mb-8 shadow-xl border border-white/20">
            <Network className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-4xl font-poppins font-extrabold mb-4">LearnConnect AI</h2>
          <p className="text-gray-300 text-lg font-medium leading-relaxed">
            Connect your questions to knowledge. Sign in to access your semantic learning map.
          </p>
          <div className="mt-12 flex justify-center gap-4 text-left">
             <div className="flex flex-col gap-3">
               <div className="flex items-center gap-2"><BookOpen className="w-5 h-5 text-accent"/> <span>Semantic Search</span></div>
               <div className="flex items-center gap-2"><BookOpen className="w-5 h-5 text-accent"/> <span>Auto Topic Tagging</span></div>
               <div className="flex items-center gap-2"><BookOpen className="w-5 h-5 text-accent"/> <span>Question History</span></div>
             </div>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative bg-background-light dark:bg-background-dark">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md relative z-10"
        >
          <Link href="/" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-primary mb-8 transition-colors">
            &larr; Back to home
          </Link>

          <div className="glass-card p-8 sm:p-10">
            <h1 className="text-3xl font-poppins font-extrabold text-foreground-light dark:text-foreground-dark mb-2">Welcome Back</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium mb-8">Sign in to your account</p>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl mb-6 text-sm font-medium">
                {error}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-foreground-light dark:text-foreground-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-medium" 
                  placeholder="you@example.com" 
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Password</label>
                  <a href="#" className="text-xs font-bold text-primary hover:text-primary-hover transition-colors">Forgot password?</a>
                </div>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-foreground-light dark:text-foreground-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-medium" 
                  placeholder="••••••••" 
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full mt-8 bg-primary hover:bg-primary-hover text-white py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-primary/20"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
              Don't have an account yet?{" "}
              <Link href="/signup" className="text-primary hover:text-primary-hover transition-colors font-bold">
                Create Account
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
